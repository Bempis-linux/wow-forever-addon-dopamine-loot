-- Dopamine Loot popups: one item per popup, top middle of the screen, newest on top, drawn by the
-- shared view (View.lua) in the chosen style. Up to MAX_SHOWN at once; more wait their turn.
-- Everything moves by hand in one OnUpdate: 3D models don't follow animation groups.
local _, ns = ...

local TOP_Y, GAP, MAX_SHOWN, MAX_WAITING = -120, 4, 3, 12
local IN_T, OUT_T, FAST_OUT_T = 0.3, 0.8, 0.25

ns.AddToggle("popup", "noPopup", "loot popups")

local pool, shown, waiting = {}, {}, {}
local ShowWaiting -- defined below ShowLoot; Update calls it
local driver = CreateFrame("Frame")

local function Create()
  local p = CreateFrame("Button", nil, UIParent)
  p:SetFrameStrata("HIGH")
  p:SetClampedToScreen(true)
  p:RegisterForClicks("LeftButtonUp", "RightButtonUp")
  ns.CreateView(p)

  p:SetScript("OnEnter", function(self)
    self.hover = true
    if self.item and self.item.link then
      GameTooltip:SetOwner(self, "ANCHOR_BOTTOM", 0, 4)
      GameTooltip:SetHyperlink(self.item.link)
      GameTooltip:Show()
    end
  end)
  p:SetScript("OnLeave", function(self)
    self.hover = false
    if GameTooltip:IsOwned(self) then GameTooltip:Hide() end
  end)
  p:SetScript("OnClick", function(self, button)
    if button == "LeftButton" and IsModifiedClick("CHATLINK") and self.item.link then
      ChatEdit_InsertLink(self.item.link) -- into your chat box; you press Enter yourself
      return
    end
    self:Leave(FAST_OUT_T)
  end)
  -- start fading out; a fading popup no longer catches clicks meant for the world under it
  function p:Leave(duration)
    if self.outAge then return end
    self.outAge, self.outFor, self.hover = 0, duration, false
    self:EnableMouse(false)
    if GameTooltip:IsOwned(self) then GameTooltip:Hide() end
  end
  return p
end

local function Release(p)
  if p.onModel then p.onModel("dismissed", nil, "closed before the model decided") end
  p:Hide()
  p.model:ClearModel()
  p.item, p.onModel, p.hover = nil, nil, false
  if GameTooltip:IsOwned(p) then GameTooltip:Hide() end
  pool[#pool + 1] = p
end

local slotY = {}
local function Update(_, dt)
  dt = math.min(dt, 0.1)
  local size = ns.PopupScale()
  -- each popup's slot: stacked downward from the top, newest first
  local y = TOP_Y
  for i, p in ipairs(shown) do
    slotY[i] = y
    y = y - p:GetHeight() * size - GAP
  end
  for i = #shown, 1, -1 do
    local p = shown[i]
    p.life = p.life + dt
    p.y = p.y + (slotY[i] - p.y) * math.min(1, dt * 12)
    local alpha, pop = 1, 1
    if p.life < IN_T then
      local a = p.life / IN_T
      alpha = a
      pop = 1 + 0.15 * (1 - a) * (1 - a) -- pops in slightly big and settles
    end
    if not p.outAge and not p.hover then
      p.hold = p.hold - dt
      if p.hold <= 0 then p:Leave(OUT_T) end
    end
    if p.outAge then
      p.outAge = p.outAge + dt
      alpha = math.max(0, 1 - p.outAge / p.outFor)
      p.y = p.y + dt * 20 -- drift up as it fades
    end
    local scale = size * pop
    p:SetScale(scale)
    p:SetPoint("TOP", UIParent, "TOP", 0, p.y / scale)
    p:SetAlpha(alpha)
    p:Tick(dt)
    if p.outAge and p.outAge >= p.outFor then
      table.remove(shown, i)
      Release(p)
    end
  end
  ShowWaiting()
  if #shown == 0 then driver:SetScript("OnUpdate", nil) end
end

local function Pop(item, onModel)
  local p = table.remove(pool) or Create()
  p.onModel = onModel
  p.life, p.hold, p.outAge, p.hover = 0, ns.HoldTime(item.quality), nil, false
  p.y = TOP_Y + 40
  p:SetAlpha(0)
  p:ClearAllPoints()
  p:SetPoint("TOP", UIParent, "TOP", 0, p.y)
  table.insert(shown, 1, p)
  p:EnableMouse(true)
  p:SetFrameStrata(item.test and "DIALOG" or "HIGH") -- previews show above the settings window
  p:Show()
  p:SetItem(item) -- after Show: the model needs a visible frame
  ns:PlayTierSound(item.quality or 1)
  driver:SetScript("OnUpdate", Update)
  return p
end

-- How many fit: tall styles at big sizes would stack down past the middle of the screen
local function MaxShown()
  local probe = shown[1] or pool[1]
  local h = (probe and probe:GetHeight() or 180) * ns.PopupScale() + GAP
  return math.max(1, math.min(MAX_SHOWN, math.floor((UIParent:GetHeight() * 0.8 + TOP_Y) / h + 0.25)))
end

-- Popups still on screen and not leaving; the oldest of them
local function Active()
  local n, oldest = 0, nil
  for _, p in ipairs(shown) do
    if not p.outAge then n, oldest = n + 1, p end
  end
  return n, oldest
end

-- After each frame: waiting items take the free slots
function ShowWaiting() -- the local declared at the top
  while waiting[1] and Active() < MaxShown() do
    local w = table.remove(waiting, 1)
    Pop(w.item, w.onModel)
  end
end

-- item: { link, id, count, quality, name, icon, equipLoc, ilvl, typeText, src, test, push, forceModel }
-- onModel(mode, fileID, why) is called once the display path is decided (/dl model uses it).
-- With MAX_SHOWN on screen, a better item (or a preview) pushes the oldest out; anything else
-- waits for a free slot, so a rain's blues are all seen in turn.
function ns:ShowLoot(item, onModel)
  local n, oldest = Active()
  if n >= MaxShown() and oldest then
    local q, oq = item.quality or 1, oldest.item and oldest.item.quality or 1
    if not (item.push or q > oq) then
      if #waiting >= MAX_WAITING then table.remove(waiting, 1) end
      waiting[#waiting + 1] = { item = item, onModel = onModel }
      return
    end
    oldest:Leave(FAST_OUT_T)
  end
  return Pop(item, onModel)
end

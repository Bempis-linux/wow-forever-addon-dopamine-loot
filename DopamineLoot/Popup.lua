-- Dopamine Loot popups: one item per popup, drawn by the shared view (View.lua) in the chosen style,
-- stacked from a corner of the screen the player picks (default: right of the character, mid-screen,
-- picked in docs/mockups/placement.html), newest nearest the start. Up to "at once" on screen; more
-- wait their turn. Low rarities can come as a compact one-line popup, and by default nothing catches
-- the mouse (hovering still holds a popup and shows its tooltip).
-- Everything moves by hand in one OnUpdate: 3D models don't follow animation groups.
local _, ns = ...

local GAP, MAX_WAITING = 4, 12
local IN_T, OUT_T, FAST_OUT_T, HOVER_MAX = 0.3, 0.8, 0.25, 10

-- Where the stack starts, as fractions of the screen from the anchor point, and which way it grows
-- (1 = down, -1 = up). The popup is anchored by the same point.
ns.POPUP_POSITIONS = {
  { key = "midright", label = "Right of you (default)", point = "TOPLEFT", x = 0.63, y = -0.25, dir = 1 },
  { key = "upleft", label = "Upper left", point = "TOPLEFT", x = 0.14, y = -0.18, dir = 1 },
  { key = "upper", label = "Upper middle", point = "TOP", x = 0, y = -0.2, dir = 1 },
  { key = "top", label = "Top middle", point = "TOP", x = 0, y = -0.11, dir = 1 },
  { key = "bottom", label = "Above the action bars", point = "BOTTOM", x = -0.12, y = 0.12, dir = -1 },
}
local POS = {}
for _, p in ipairs(ns.POPUP_POSITIONS) do POS[p.key] = p end
local function Position() return POS[ns.settings.popupPos or "midright"] or POS.midright end
function ns.PopupMax() return ns.settings.popupMax or 2 end
local function ClickThrough() return (ns.settings.popupMouse or "through") == "through" end

ns.AddToggle("popup", "noPopup", "loot popups")

local pool, shown, waiting, afterCombat = {}, {}, {}, {}
local ShowWaiting -- defined below ShowLoot; Update calls it
local driver = CreateFrame("Frame")

local function ShowTooltip(self)
  if self.item and self.item.link then
    GameTooltip:SetOwner(self, "ANCHOR_BOTTOM", 0, 4)
    GameTooltip:SetHyperlink(self.item.link)
    GameTooltip:Show()
  end
end

local function Create()
  local p = CreateFrame("Button", nil, UIParent)
  p:SetFrameStrata("HIGH")
  p:SetClampedToScreen(true)
  p:RegisterForClicks("LeftButtonUp", "RightButtonUp")
  ns.CreateView(p)

  p:SetScript("OnEnter", function(self) self.hover = true; ShowTooltip(self) end)
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

-- Is the cursor over the part that would catch clicks (not the empty glow)? By hand: MouseIsOver
-- doesn't exist on Forever. hit = { left, right, top, bottom } insets, like SetHitRectInsets.
local NO_HIT = { 0, 0, 0, 0 }
local function OverHit(p, cx, cy)
  local l, r, t, b = p:GetLeft(), p:GetRight(), p:GetTop(), p:GetBottom()
  if not l then return false end
  local h, s = p.L and p.L.hit or NO_HIT, p:GetEffectiveScale()
  cx, cy = cx / s, cy / s
  return cx >= l + h[1] and cx <= r - h[2] and cy <= t - h[3] and cy >= b + h[4]
end

local slot = {}
local function Update(_, dt)
  dt = math.min(dt, 0.1)
  local size = ns.PopupScale()
  local pos = Position()
  local W, H = UIParent:GetWidth(), UIParent:GetHeight()
  local bx, by = pos.x * W, pos.y * H
  -- each popup's slot: its distance from the start along the stack, newest first
  local d = 0
  for i, p in ipairs(shown) do
    slot[i] = d
    d = d + p:GetHeight() * size + GAP
  end
  local through = ClickThrough()
  for i = #shown, 1, -1 do
    local p = shown[i]
    p.life = p.life + dt
    p.d = p.d + (slot[i] - p.d) * math.min(1, dt * 12)
    local alpha, pop = 1, 1
    if p.life < IN_T then
      local a = p.life / IN_T
      alpha = a
      pop = 1 + 0.15 * (1 - a) * (1 - a) -- pops in slightly big and settles
    end
    local wantMouse = not through and not p.outAge -- the Mouse setting may change while it's up
    if p:IsMouseEnabled() ~= wantMouse then p:EnableMouse(wantMouse) end
    if through and not p.outAge then
      -- the mouse passes through: hovering is checked by hand, and only counts once the cursor has
      -- moved since the popup appeared and not while turning the camera (the cursor sits still then)
      local cx, cy = GetCursorPosition()
      if cx ~= p.cursorX or cy ~= p.cursorY then p.cursorMoved = true end
      local over = p.cursorMoved and not (IsMouselooking and IsMouselooking()) and OverHit(p, cx, cy)
      if over and not p.hover then p.hover = true; ShowTooltip(p)
      elseif not over and p.hover then p.hover = false; if GameTooltip:IsOwned(p) then GameTooltip:Hide() end end
    end
    if p.hover then p.held = (p.held or 0) + dt end
    if not p.outAge and (not p.hover or p.held > HOVER_MAX) then -- hovering holds it, up to HOVER_MAX
      p.hold = p.hold - dt
      if p.hold <= 0 then p:Leave(OUT_T) end
    end
    if p.outAge then
      p.outAge = p.outAge + dt
      alpha = math.max(0, 1 - p.outAge / p.outFor)
      p.d = p.d - dt * 20 -- drifts back toward where it came from as it fades
    end
    local scale = size * pop
    p:SetScale(scale)
    p:ClearAllPoints()
    p:SetPoint(pos.point, UIParent, pos.point, bx / scale, (by - pos.dir * p.d) / scale)
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

-- Compact (one line) for low rarities: Poor and Common always; an Uncommon unless it's the best of
-- what was looted with it (setting popupLow: "smart", "always", "never"); in combat everything
-- (setting popupCombat "compact", the default)
function ns.PopupCompact(item, fight) -- the rule itself (the Popups page's preview and tests use it too;
  -- fight: as if in combat)
  if (ns.settings.popupCombat or "compact") == "compact" and (fight or InCombatLockdown()) then return true end
  local q, low = item.quality or 1, ns.settings.popupLow or "smart"
  if q >= 3 or low == "never" then return false end
  if q <= 1 or low == "always" then return true end
  return (item.burstBest or q) > q -- an Uncommon: full when it's the best of the loot
end
-- test popups and item checks show the full popup unless they ask for compact
local function Compact(item)
  if item.test then return item.compact or false end
  return ns.PopupCompact(item)
end

local function Pop(item, onModel)
  local p = table.remove(pool) or Create()
  p.onModel = onModel
  item.compact = Compact(item)
  p.life, p.hold, p.outAge, p.hover, p.held = 0, ns.HoldTime(item.compact and 1 or item.quality), nil, false, 0
  p.cursorX, p.cursorY = GetCursorPosition()
  p.cursorMoved = false
  p.d = -40 -- slides in from just before its slot
  p:SetAlpha(0)
  table.insert(shown, 1, p)
  p:EnableMouse(not ClickThrough())
  p:SetFrameStrata(item.test and "DIALOG" or "HIGH") -- previews show above the settings window
  p:Show()
  p.fxDelay = IN_T -- the flash and sparks wait for the fade-in
  p:SetItem(item) -- after Show: the model needs a visible frame
  ns:PlayTierSound(item.quality or 1)
  driver:SetScript("OnUpdate", Update)
  return p
end

-- How many fit: tall styles at big sizes would stack past the middle of the screen
local function MaxShown()
  local probe = shown[1] or pool[1]
  local h = (probe and probe:GetHeight() or 180) * ns.PopupScale() + GAP
  local room = UIParent:GetHeight() * (1 - math.abs(Position().y)) - 90 -- from the start to the far edge, minus the bars
  return math.max(1, math.min(ns.PopupMax(), math.floor(room / h + 0.25)))
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

-- item: { link, id, count, quality, name, icon, equipLoc, ilvl, typeText, src, test, push, forceModel,
-- burstBest (the best quality looted with it) }
-- onModel(mode, fileID, why) is called once the display path is decided (/dl model uses it).
-- With the most on screen, a better item (or a preview) pushes the oldest out; anything else
-- waits for a free slot, so a rain's blues are all seen in turn. Setting popupCombat "defer" holds
-- popups until the fight is over.
function ns:ShowLoot(item, onModel)
  if ns.settings.popupCombat == "defer" and InCombatLockdown() and not item.test then
    afterCombat[#afterCombat + 1] = { item = item, onModel = onModel }
    return
  end
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

-- The fight is over (LootFeed's PLAYER_REGEN_ENABLED calls this): the held popups, one by one
function ns.PopupsAfterCombat()
  local list = afterCombat
  afterCombat = {}
  for i, w in ipairs(list) do C_Timer.After(0.3 + (i - 1) * 0.2, function() ns:ShowLoot(w.item, w.onModel) end) end
end

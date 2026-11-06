-- Dopamine Loot popups: one item per popup, drawn by the shared view (View.lua) in the chosen style,
-- stacked from a corner of the screen the player picks (default: right of the character, mid-screen,
-- picked in docs/mockups/placement.html), newest nearest the start. Up to "at once" on screen; more
-- wait their turn. Low rarities can come as a compact one-line popup, and by default nothing catches
-- the mouse (hovering still holds a popup and shows its tooltip).
-- Everything moves by hand in one OnUpdate: 3D models don't follow animation groups.
local _, ns = ...

local GAP, MAX_WAITING = 4, 12
local OUT_T, FAST_OUT_T, HOVER_MAX = 0.8, 0.25, 10
-- the entrance: it punches in a bit big, overshoots a touch small and settles (a compact line less)
local IMPACT_T, IMPACT, IMPACT_COMPACT = 0.32, 0.28, 0.1
local function EaseOutBack(t) local c = 2.2; return 1 + (c + 1) * (t - 1) ^ 3 + c * (t - 1) ^ 2 end
-- the Legendary moment (setting noLegendMoment): the screen dims, a pillar of light drops onto the
-- popup, which lands at MOMENT_HIT and plays in slow motion for SLOW_T
local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local MOMENT_HIT, MOMENT_T, SLOW_T, SLOW = 0.55, 2.2, 0.75, 0.4

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


local pool, shown, waiting, afterCombat = {}, {}, {}, {}
local ShowWaiting -- defined below ShowLoot; Update calls it
local driver = CreateFrame("Frame")

local function ShowTooltip(self)
  if self.item and self.item.link then
    ns.Tooltip():SetOwner(self, "ANCHOR_BOTTOM", 0, 4)
    ns.Tooltip():SetHyperlink(self.item.link)
    ns.Tooltip():Show()
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
    if ns.Tooltip():IsOwned(self) then ns.Tooltip():Hide() end
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
    if self.delay then self.outFor = 0.01 end -- a Legendary still waiting for its pillar just goes (and its moment ends)
    self:EnableMouse(false)
    if ns.Tooltip():IsOwned(self) then ns.Tooltip():Hide() end
  end
  return p
end

-- The Legendary moment: a dim over the screen, under the popups (a strata below theirs), and a
-- pillar of light dropping from the top of the screen onto the popup
local moment
local LOWER = { HIGH = "MEDIUM", DIALOG = "HIGH" }
local function StartMoment(p)
  if not moment then
    moment = CreateFrame("Frame", nil, UIParent)
    moment:SetAllPoints(UIParent)
    moment:EnableMouse(false)
    moment.dim = moment:CreateTexture(nil, "BACKGROUND")
    moment.dim:SetTexture("Interface\\Buttons\\WHITE8X8")
    moment.dim:SetVertexColor(0.02, 0.012, 0.04, 1)
    moment.dim:SetAllPoints()
    moment.pillar = moment:CreateTexture(nil, "ARTWORK")
    moment.core = moment:CreateTexture(nil, "ARTWORK", nil, 1)
    for _, t in ipairs({ moment.pillar, moment.core }) do
      t:SetTexture(MEDIA .. "Pillar")
      t:SetBlendMode("ADD")
    end
    moment.pillar:SetVertexColor(1, 0.72, 0.3, 1)
    moment.core:SetVertexColor(1, 0.95, 0.8, 1)
  end
  moment:SetFrameStrata(LOWER[p:GetFrameStrata()] or "MEDIUM")
  moment:SetFrameLevel(5000) -- over everything on its strata (bags, the quest log; the settings for a test)
  moment.p, moment.t = p, 0
  moment.dim:SetAlpha(0)
  moment.pillar:Hide()
  moment.core:Hide()
  moment:Show()
end
local function EndMoment()
  if moment then moment.p = nil; moment:Hide() end
end
local function UpdateMoment(dt)
  local m = moment
  m.t = m.t + dt
  local t = m.t
  if t >= MOMENT_T or not m.p:IsShown() then return EndMoment() end
  -- the dim: in quickly, held while the popup lands, then out
  m.dim:SetAlpha(0.55 * (t < 0.25 and t / 0.25 or t < 1.5 and 1 or math.max(0, 1 - (t - 1.5) / 0.6)))
  -- the pillar: its bright foot falls from the top onto the popup's item, then it narrows and fades
  local x, y = m.p.stage:GetCenter()
  if not x then return end
  local s = m.p.stage:GetEffectiveScale() / m:GetEffectiveScale()
  x, y = x * s, y * s
  local H = m:GetHeight()
  local u = math.min(1, t / MOMENT_HIT)
  local foot = H - (H - y) * u * u
  local fade = t < MOMENT_HIT and 1 or math.max(0, 1 - (t - MOMENT_HIT) / 1.4)
  local w = 90 * (t < MOMENT_HIT and 1 or 0.45 + 0.55 * fade)
  for i, tex in ipairs({ m.pillar, m.core }) do
    tex:ClearAllPoints()
    tex:SetPoint("BOTTOM", m, "BOTTOMLEFT", x, foot)
    tex:SetSize(i == 1 and w or w * 0.35, math.max(1, H - foot + 4))
    tex:SetAlpha((i == 1 and 0.85 or 1) * fade)
    if fade > 0 then tex:Show() else tex:Hide() end
  end
end

local function Release(p)
  if moment and moment.p == p then EndMoment() end
  if p.onModel then p.onModel("dismissed", nil, "closed before the model decided") end
  p:Hide()
  p.model:ClearModel()
  p.item, p.onModel, p.hover = nil, nil, false
  if ns.Tooltip():IsOwned(p) then ns.Tooltip():Hide() end
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
  if moment and moment.p then UpdateMoment(dt) end
  for i = #shown, 1, -1 do
    local p = shown[i]
    -- its own clock: stopped while a Legendary waits for its pillar, slowed as it lands
    local pdt = dt
    if p.delay then
      p.delay = p.delay - dt
      if p.delay > 0 then
        pdt = 0
      else
        p.delay, p.slow = nil, SLOW_T
        ns:PlayTierSound(p.item and p.item.quality or 5)
      end
    end
    if p.slow then
      p.slow = p.slow - dt
      if p.slow > 0 then pdt = pdt * SLOW else p.slow = nil end
    end
    p.life = p.life + pdt
    p.d = p.d + (slot[i] - p.d) * math.min(1, dt * 12)
    local alpha, pop = 1, 1
    if p.delay then
      alpha = 0
    elseif p.life < IMPACT_T then -- punches in: a bit big, a touch small, settled
      alpha = math.min(1, p.life / 0.05)
      local big = p.compactIn and IMPACT_COMPACT or IMPACT
      pop = 1 + big - big * EaseOutBack(p.life / IMPACT_T)
    end
    -- (the Mouse setting may change while it's up; a Legendary waiting for its pillar is not there yet)
    local wantMouse = not through and not p.outAge and not p.delay
    if p:IsMouseEnabled() ~= wantMouse then p:EnableMouse(wantMouse) end
    if through and not p.outAge and not p.delay then
      -- the mouse passes through: hovering is checked by hand, and only counts once the cursor has
      -- moved since the popup appeared and not while turning the camera (the cursor sits still then)
      local cx, cy = GetCursorPosition()
      if cx ~= p.cursorX or cy ~= p.cursorY then p.cursorMoved = true end
      local over = p.cursorMoved and not (IsMouselooking and IsMouselooking()) and OverHit(p, cx, cy)
      if over and not p.hover then p.hover = true; ShowTooltip(p)
      elseif not over and p.hover then p.hover = false; if ns.Tooltip():IsOwned(p) then ns.Tooltip():Hide() end end
    end
    if p.hover then p.held = (p.held or 0) + dt end
    if not p.outAge and (not p.hover or p.held > HOVER_MAX) then -- hovering holds it, up to HOVER_MAX
      p.hold = p.hold - pdt
      if p.hold <= 0 then p:Leave(OUT_T) end
    end
    if p.outAge then
      p.outAge = p.outAge + dt
      alpha = p.delay and 0 or math.max(0, 1 - p.outAge / p.outFor) -- (pushed out before it landed: stays unseen)
      p.d = p.d - dt * 20 -- drifts back toward where it came from as it fades
    end
    local scale = size * pop
    p:SetScale(scale)
    p:ClearAllPoints()
    -- the punch grows from the popup's middle, not its anchor corner: move the anchor by half the growth
    local e, point = (pop - 1) * size, pos.point
    local hx = point:find("LEFT") and 1 or point:find("RIGHT") and -1 or 0
    local vy = point:find("TOP") and -1 or point:find("BOTTOM") and 1 or 0
    local ox, oy = -e * hx * p:GetWidth() / 2, -e * vy * p:GetHeight() / 2
    p:SetPoint(point, UIParent, point, (bx + ox) / scale, (by - pos.dir * p.d + oy) / scale)
    p:SetAlpha(alpha)
    if pdt > 0 then p:Tick(pdt) end
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
  p.d = 0 -- it punches in at its slot (the others make room)
  p.compactIn, p.delay, p.slow = item.compact, nil, nil
  p:SetAlpha(0)
  table.insert(shown, 1, p)
  p:EnableMouse(not ClickThrough())
  p:SetFrameStrata(item.test and "DIALOG" or "HIGH") -- previews show above the settings window
  p:Show()
  p.fxDelay = 0.02 -- the flash and sparks go off with the impact
  p:SetItem(item) -- after Show: the model needs a visible frame
  -- a Legendary (full popup, out of combat, one at a time): the moment first, its sound on landing
  if (item.quality or 0) >= 5 and not item.compact and not ns.settings.noLegendMoment
    and not InCombatLockdown() and not (moment and moment.p) then
    p.delay = MOMENT_HIT
    StartMoment(p)
  else
    ns:PlayTierSound(item.quality or 1)
  end
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
-- onModel(mode, fileID, why) is called once the display path is decided (no caller since 1.0).
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

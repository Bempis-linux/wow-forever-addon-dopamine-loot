-- Dopamine Loot Create All tray (docs/mockups/batch.html "Satisfying heap"; the heap itself from
-- docs/mockups/polish-r1.html, H3 Tumble, picked 2026-11-10): during a Create All a tray slides out under the
-- profession window and every item made falls in, lands ON the heap (the floor or the items already there),
-- bounces, and rolls a step down the slope as it settles, so the heap grows into a mound. Once the heap is
-- as tall as the tray, it sinks a little with each new item (its bottom slides out of view under the
-- tray's floor), so a batch of hundreds stays full and moving. A count shows how far along it is. When the
-- batch is done the heap shakes and sparkles, then the tray slides back (the items go on to the Crafted
-- row, Craft.lua). Only for Create All (two items or more); anchored to ProfessionsFrame (read only), or the
-- screen's left side if the window is closed (the tests).
local _, ns = ...

local BORDER = "Interface\\COMMON\\WhiteIconFrame"
local STAR = "Interface\\Cooldown\\star4"
local TRAY_H, ICON, OPEN_T = 130, 26, 0.3
local FALL_T = 0.7                   -- one item's fall, bounce and roll
local ROW, COLW, TALL = ICON - 2, ICON + 2, 4 -- one item raises its column this much; column width (icons side by side, not overlapping); rows before it sinks
local FLOOR_Y = 2 + ICON / 2         -- an item's middle when it rests on the floor (heap coordinates, y up)

local tray, label, count, heap
local items = {}      -- the heap: { tex, border, x, y (its resting middle, heap content), roll, dir, rot, t }
local glints = {}
local state           -- { b (the batch), openT, closing, finaleT, shown, cols, sink, sinkShown }
local spare = {}

local function On() return not ns.settings.noCraft and not ns.settings.noCraftTray and ns.settings.enabled ~= false end
local function R(a, b) return a + math.random() * (b - a) end

local function Anchor()
  tray:ClearAllPoints()
  tray:SetFrameStrata("HIGH")
  local w = _G.ProfessionsFrame
  if w and w:IsShown() then
    tray:SetPoint("TOPLEFT", w, "BOTTOMLEFT", 10, 4)
    tray:SetPoint("TOPRIGHT", w, "BOTTOMRIGHT", -10, 4)
  else
    tray:SetPoint("TOPLEFT", UIParent, "LEFT", 40, -60) -- (a test from the settings window: above it)
    tray:SetWidth(520)
    tray:SetFrameStrata("FULLSCREEN_DIALOG")
  end
end

local function Item()
  local it = table.remove(spare)
  if not it then
    it = { tex = heap:CreateTexture(nil, "ARTWORK"), border = heap:CreateTexture(nil, "OVERLAY") }
    it.border:SetTexture(BORDER)
    it.border:SetAllPoints(it.tex)
  end
  it.tex:SetSize(ICON, ICON)
  it.tex:Show(); it.border:Show()
  return it
end
local function Drop(it) it.tex:Hide(); it.border:Hide(); spare[#spare + 1] = it end

local function Clear()
  for _, it in ipairs(items) do Drop(it) end
  wipe(items)
  for _, g in ipairs(glints) do g.on = false; g.tex:Hide() end
end

-- The heap's width (its anchors may not be resolved yet on the frame the tray opens)
local function Width()
  local w = heap:GetWidth()
  if not w or w < 50 then local t = tray:GetWidth(); w = (t and t > 50) and t - 12 or 500 end
  return w
end

-- The heap's columns: how many items each holds. An item lands near the middle and slides down the slope
-- (to a neighbour two or more items lower) until it rests.
local function HeightAt(c) return state.cols[c] or 0 end
local function Settle(c)
  for _ = 1, 12 do
    local h, l, r = HeightAt(c), HeightAt(c - 1), HeightAt(c + 1)
    if l <= h - 2 and (l <= r or r > h - 2) then c = c - 1 elseif r <= h - 2 then c = c + 1 else break end
  end
  return c
end
local function SinkRow() -- the full heap sinks one row
  state.sink = state.sink + ROW
  for k, v in pairs(state.cols) do state.cols[k] = math.max(0, v - 1) end
end

local function Glint(x, y, size, delay)
  local g
  for _, q in ipairs(glints) do if not q.on then g = q; break end end
  if not g then g = { tex = heap:CreateTexture(nil, "OVERLAY", nil, 2) }; g.tex:SetTexture(STAR); g.tex:SetBlendMode("ADD"); glints[#glints + 1] = g end
  g.on, g.t, g.x, g.y, g.size = true, -(delay or 0), x, y, size
  g.tex:Hide()
end

-- An item's fall (mockup H3): u 0..1 -> x offset, height above its rest, rotation (degrees, clockwise).
-- It drops in, lands a step up the slope with a bounce, then rolls down into place turning.
local function Fall(it, u)
  local top = TRAY_H + 15 - it.y + state.sinkShown -- (from above the tray, in its own terms)
  if u < 0.55 then local k = (u / 0.55) ^ 2; return 0, top + (6 - top) * k, it.rot0 + (it.rot - it.dir * 30 - it.rot0) * k end
  if u < 0.7 then local k = (u - 0.55) / 0.15; return it.roll * 0.4 * k, 6 + 6 * k, it.rot - it.dir * (30 - 15 * k) end
  if u < 0.9 then local k = (u - 0.7) / 0.2; return it.roll * (0.4 + 0.6 * k), 12 * (1 - k), it.rot - it.dir * 15 * (1 - k) end
  return it.roll, 0, it.rot
end

local function OnUpdate(_, dt)
  local s = state
  if not s then return end
  -- open / close: the tray slides out of the window's bottom edge
  s.openT = s.openT + dt
  local h
  if s.closing then
    s.closeT = s.closeT + dt
    local u = math.min(1, s.closeT / OPEN_T)
    h = TRAY_H * (1 - u * u)
    if u >= 1 then tray:Hide(); Clear(); state = nil; return end
  else
    local u = math.min(1, s.openT / OPEN_T)
    h = TRAY_H * (1 - (1 - u) ^ 3) * (u < 1 and (1 + 0.06 * math.sin(math.pi * u)) or 1)
  end
  tray:SetHeight(math.max(1, h))
  -- the profession window closed mid-batch: the tray goes with it
  if s.anchored and not s.closing and not (_G.ProfessionsFrame and _G.ProfessionsFrame:IsShown()) then s.closing = true end
  -- the heap sinking (smoothly) as it fills
  local sinking = s.sinkShown < s.sink
  if sinking then s.sinkShown = math.min(s.sink, s.sinkShown + dt * ROW / 0.3) end
  local shake = 0
  if s.finaleT then
    s.finaleT = s.finaleT + dt
    if s.finaleT < 0.32 then shake = 3 * math.sin(s.finaleT * 60) * (1 - s.finaleT / 0.32) end
  end
  local half = Width() / 2
  local i = 1
  while i <= #items do
    local it = items[i]
    it.t = it.t + dt
    local u = it.t / FALL_T
    local y = it.y - s.sinkShown
    if u >= 1 and y < -ICON then table.remove(items, i); Drop(it) -- (sunk out of view under the floor)
    else
      -- (a settled item only moves while the heap sinks or shakes)
      if u < 1 or not it.done or sinking or (s.finaleT and s.finaleT < 0.35) then
        local dx, up, deg = Fall(it, math.min(1, u))
        it.done = u >= 1
        it.tex:ClearAllPoints()
        it.tex:SetPoint("CENTER", heap, "BOTTOMLEFT", it.x - it.roll + dx + shake * (it.x > half and 1 or -1), y + up)
        local r = -math.rad(deg)
        it.tex:SetRotation(r); it.border:SetRotation(r)
        it.tex:SetAlpha(1); it.border:SetAlpha(1)
      end
      i = i + 1
    end
  end
  for _, g in ipairs(glints) do
    if g.on then
      g.t = g.t + dt
      local gu = g.t / 0.5
      if gu >= 1 then g.on = false; g.tex:Hide()
      elseif gu >= 0 then
        local k = g.size * math.sin(math.pi * math.min(1, gu * 1.4))
        g.tex:ClearAllPoints(); g.tex:SetPoint("CENTER", heap, "BOTTOMLEFT", g.x, g.y)
        g.tex:SetSize(math.max(0.1, k), math.max(0.1, k)); g.tex:SetRotation(gu); g.tex:SetAlpha(1 - gu); g.tex:Show()
      end
    end
  end
end

local function Create()
  tray = CreateFrame("Frame", nil, UIParent, "BackdropTemplate")
  tray:SetFrameStrata("HIGH")
  tray:SetClipsChildren(true)
  tray:SetBackdrop({ bgFile = "Interface\\Buttons\\WHITE8X8", edgeFile = "Interface\\Tooltips\\UI-Tooltip-Border", edgeSize = 14,
    insets = { left = 3, right = 3, top = 3, bottom = 3 } })
  tray:SetBackdropColor(0.07, 0.05, 0.03, 0.95)
  tray:SetBackdropBorderColor(0.45, 0.37, 0.24, 1)
  tray:Hide()
  label = tray:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  label:SetPoint("TOPLEFT", 12, -8)
  count = tray:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  count:SetPoint("TOPRIGHT", -12, -6)
  heap = CreateFrame("Frame", nil, tray)
  heap:SetPoint("TOPLEFT", 6, -4)
  heap:SetPoint("BOTTOMRIGHT", -6, 4)
  local floor = heap:CreateTexture(nil, "BACKGROUND")
  floor:SetTexture("Interface\\AddOns\\DopamineLoot\\Media\\Glow.tga")
  floor:SetVertexColor(0, 0, 0)
  floor:SetAlpha(0.6)
  floor:SetPoint("BOTTOM", 0, -6)
  floor:SetSize(260, 20)
  tray:SetScript("OnUpdate", OnUpdate)
end

local function Open(b)
  if not tray then Create() end
  Clear()
  label:SetText(((b.prof or "Crafting") .. " · Create All"):upper())
  label:SetTextColor(0.85, 0.78, 0.6) -- (a quiet header, as on the harvest window; not the profession color)
  count:SetText("")
  state = { b = b, openT = 0, closeT = 0, shown = 0, cols = {}, sink = 0, sinkShown = 0 }
  Anchor()
  state.anchored = _G.ProfessionsFrame ~= nil and _G.ProfessionsFrame:IsShown() -- (follows the window closing)
  tray:SetHeight(1)
  tray:Show()
end

local function Add(b, icon)
  if not state or state.b ~= b then return end
  state.shown = state.shown + 1
  local n = state.shown
  if b.total and n <= b.total then count:SetText(("%d / %d"):format(n, b.total)) else count:SetText(n) end
  -- where it rests: a column near the middle, then down the slope; a full heap sinks a row first
  local c0 = math.random(-1, 1)
  local c = Settle(c0)
  if HeightAt(c) >= TALL then SinkRow() end
  local h = HeightAt(c)
  state.cols[c] = h + 1
  local it = Item()
  it.tex:SetTexture(icon or b.icon or "Interface\\Icons\\INV_Misc_QuestionMark")
  it.border:SetVertexColor(1, 1, 1)
  it.dir = (c == c0) and (math.random() < 0.5 and -1 or 1) or (c > c0 and 1 or -1)
  it.roll = it.dir * 10
  it.x = Width() / 2 + c * COLW + R(-2, 2)
  it.y = FLOOR_Y + h * ROW + state.sink
  it.rot = R(-14, 14) + (c - c0) * 6
  it.rot0 = R(-60, 60)
  it.t, it.done = 0, false
  items[#items + 1] = it
end

-- Craft.lua's hooks
function ns.CraftBatchStart(b)
  if not On() then return end
  if (b.total or 1) > 1 then Open(b) end
end
function ns.CraftItemDone(b, icon)
  if not On() then return end
  if (not state or state.b ~= b) and b.n == 2 then Open(b); Add(b, icon) end -- (the count wasn't known: open at the 2nd)
  Add(b, icon)
end
function ns.CraftBatchDone(b)
  if not state or state.b ~= b then return end
  if #items == 0 then state.closing = true; return end -- (cancelled before anything was made)
  count:SetText(("%d / %d"):format(state.shown, state.shown)) -- (the final count, whatever the game said it would be)
  state.finaleT = 0
  local w = Width()
  for i = 1, 10 do Glint(w / 2 + R(-90, 90), R(20, TRAY_H - 40), R(10, 16), 0.15 + i * 0.04) end
  ns:PlayGatherFx("CraftDone")
  C_Timer.After(1.6, function() if state and state.b == b then state.closing = true end end)
end

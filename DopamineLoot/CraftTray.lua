-- Dopamine Loot Create All tray (docs/mockups/batch.html, "Satisfying heap"): during a Create All a tray
-- slides out under the profession window (its right side has the profession tabs) and every item made
-- tumbles into it and piles up with a bounce and a settle, so the heap visibly grows with the batch; a
-- count shows how far along it is. When the batch is done the heap gives a little shake and a sparkle,
-- then the tray slides back (the items go on to the Crafted row, Craft.lua).
-- Only for Create All (two items or more); anchored to ProfessionsFrame (read only), or the screen's left
-- side if the window is closed.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local BORDER = "Interface\\COMMON\\WhiteIconFrame"
local STAR = "Interface\\Cooldown\\star4"
local TRAY_H, ICON, FALL_T, OPEN_T = 112, 26, 0.5, 0.3
local MAX_SHOWN = 40


local tray, label, count, heap
local items = {}      -- the pile: { tex, border, x, y, t, rot, delay }
local glints = {}
local state           -- { b (the batch), openT, closing, finaleT, shown }
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
    return
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

local function Clear()
  for _, it in ipairs(items) do it.tex:Hide(); it.border:Hide(); spare[#spare + 1] = it end
  wipe(items)
  for _, g in ipairs(glints) do g.on = false; g.tex:Hide() end
end

-- The heap's width (its anchors may not be resolved yet on the frame the tray opens)
local function Width()
  local w = heap:GetWidth()
  if not w or w < 50 then local t = tray:GetWidth(); w = (t and t > 50) and t - 12 or 500 end
  return w
end

-- Where the n-th item settles: around the middle, the heap rising and narrowing as it grows
local function Spot(n, total)
  local w = Width()
  local spread = 0.36 * w * (1 - math.min(0.75, n / (total + 4)))
  return w / 2 + R(-spread, spread), 10 + math.min(TRAY_H - 52, math.sqrt(n) * 11) + R(-3, 3)
end

local function Glint(x, y, size, delay)
  local g
  for _, q in ipairs(glints) do if not q.on then g = q; break end end
  if not g then g = { tex = heap:CreateTexture(nil, "OVERLAY", nil, 2) }; g.tex:SetTexture(STAR); g.tex:SetBlendMode("ADD"); glints[#glints + 1] = g end
  g.on, g.t, g.x, g.y, g.size = true, -(delay or 0), x, y, size
  g.tex:Hide()
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
  -- items falling in: ease in, a small bounce, settle
  local shake = 0
  if s.finaleT then
    s.finaleT = s.finaleT + dt
    if s.finaleT < 0.32 then shake = 3 * math.sin(s.finaleT * 60) * (1 - s.finaleT / 0.32) end
  end
  -- the profession window closed mid-batch: the tray goes with it
  if s.anchored and not s.closing and not (_G.ProfessionsFrame and _G.ProfessionsFrame:IsShown()) then s.closing = true end
  local half = Width() / 2
  for _, it in ipairs(items) do
    it.t = it.t + dt
    local u = math.max(0, it.t / FALL_T)
    -- (a settled item is placed already: skip it, except while the finale shakes the heap)
    if not (u >= 1 and it.done and not (s.finaleT and s.finaleT < 0.35)) then
      it.done = u >= 1
      local y
      if u < 0.7 then local k = u / 0.7; y = TRAY_H + 10 - (TRAY_H + 10 - it.y) * k * k
      elseif u < 0.85 then y = it.y + 6 * math.sin(math.pi * (u - 0.7) / 0.15)
      else y = it.y end
      it.tex:ClearAllPoints()
      it.tex:SetPoint("CENTER", heap, "BOTTOMLEFT", it.x + shake * (it.x > half and 1 or -1), y)
      local r = it.rot * math.min(1, u)
      it.tex:SetRotation(r); it.border:SetRotation(r)
      it.tex:SetAlpha(it.t < 0 and 0 or 1); it.border:SetAlpha(it.t < 0 and 0 or 1)
    end
  end
  for _, g in ipairs(glints) do
    if g.on then
      g.t = g.t + dt
      local u = g.t / 0.5
      if u >= 1 then g.on = false; g.tex:Hide()
      elseif u >= 0 then
        local k = g.size * math.sin(math.pi * math.min(1, u * 1.4))
        g.tex:ClearAllPoints(); g.tex:SetPoint("CENTER", heap, "BOTTOMLEFT", g.x, g.y)
        g.tex:SetSize(math.max(0.1, k), math.max(0.1, k)); g.tex:SetRotation(u); g.tex:SetAlpha(1 - u); g.tex:Show()
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
  floor:SetTexture(MEDIA .. "Glow.tga")
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
  state = { b = b, openT = 0, closeT = 0, shown = 0 }
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
  if #items >= MAX_SHOWN then -- (a very long batch: the oldest at the bottom makes room)
    local old = table.remove(items, 1); old.tex:Hide(); old.border:Hide(); spare[#spare + 1] = old
  end
  local it = Item()
  it.tex:SetTexture(icon or b.icon or "Interface\\Icons\\INV_Misc_QuestionMark")
  it.border:SetVertexColor(1, 1, 1)
  it.x, it.y = Spot(n, math.max(n, b.total or n))
  it.t, it.rot = 0, R(-0.35, 0.35)
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
  state.finaleT = 0
  local w = Width()
  for i = 1, 10 do Glint(w / 2 + R(-90, 90), R(20, TRAY_H - 30), R(10, 16), 0.15 + i * 0.04) end
  ns:PlayGatherFx("CraftDone")
  C_Timer.After(1.6, function() if state and state.b == b then state.closing = true end end)
end

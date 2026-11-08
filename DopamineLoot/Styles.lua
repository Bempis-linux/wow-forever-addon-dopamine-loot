-- Dopamine Loot popup styles built on the shared view (View.lua), picked in docs/mockups/achievement.html:
--   achievement  the Capsule: a round emblem holding the item opens into a rounded bar (rarity and a
--                rarity gauge, the name, the type); the item level in a small round badge at its end
--   brush        a rough stroke of paint in the item's color swipes across under a big white name
--   runes        the name's letters start as glowing runes that flicker and settle into letters
--   forged       each letter is struck white-hot and cools to its color, sparks arcing off
--   ember        an ember edge sweeps across and burns the name in, embers and smoke rising
-- The last three share one layout: the name, a small diamond divider, one info line. Their sparks,
-- embers and smoke grow with rarity.
-- Each kit: Create(f) once per view; Reset(f) hides its parts before any layout; Layout(f) and
-- Set(f, item) for its own style (Set runs after the view filled in the item); Tick(f, fx) every frame
-- (fx = seconds since the popup faded in, negative before).
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local WHITE = "Interface\\Buttons\\WHITE8X8"
local GOLD = { 1, 0.78, 0.38 } -- a Legendary's rim
local Tex = ns.ViewTex

local function Clamp01(x) return x < 0 and 0 or x > 1 and 1 or x end
local function OutCubic(t) t = Clamp01(t); return 1 - (1 - t) ^ 3 end
local function Lerp(a, b, t) return a + (b - a) * t end
local function Rnd(a, b) return a + math.random() * (b - a) end
local function Measure(fs) return (fs.GetUnboundedStringWidth or fs.GetStringWidth)(fs) end
local function TextScale(fs, sc, face, size, flags)
  if fs.SetTextScale then fs:SetTextScale(sc); return end
  local px = math.floor(size * sc + 0.5) -- (no text scale on this client: whole font sizes)
  if px ~= fs.px then fs.px = px; fs:SetFont(face, px, flags) end
end
local function Gradient(t, r1, g1, b1, a1, r2, g2, b2, a2)
  if t.SetGradient and CreateColor then
    t:SetGradient("HORIZONTAL", CreateColor(r1, g1, b1, a1), CreateColor(r2, g2, b2, a2))
  else
    t:SetVertexColor(r2, g2, b2, math.max(a1, a2) * 0.6)
  end
end
local function QualityWord(q)
  return _G["ITEM_QUALITY" .. q .. "_DESC"] or ({ "Common", "Uncommon", "Rare", "Epic", "Legendary" })[q] or ""
end

local kits = {}
ns.STYLE_KITS = kits

-- Every kit keeps its parts in f.kit[name], so Reset can hide them all
local function Parts(f, name)
  f.kit = f.kit or {}
  f.kit[name] = f.kit[name] or { list = {} }
  local k = f.kit[name]
  return k, function(t) k.list[#k.list + 1] = t; return t end
end
local function HideAll(f, name)
  local k = f.kit and f.kit[name]
  if not k then return end
  for _, t in ipairs(k.list) do t:Hide() end
  k.done = nil
end
local function Pool(P, n, parent, layer, file, blend, sub)
  local list = {}
  for i = 1, n do list[i] = P(Tex(parent, layer, file, blend, sub)) end
  return list
end

---------------------------------------------------------------------------
-- Achievement: the Capsule
---------------------------------------------------------------------------
local EMB, BAR_H, TEXT_X = 96, 72, 62 -- emblem size, bar height, where the text starts (from the emblem's middle)
kits.achievement = {
  shine = true, -- (the view's shine sweep runs across the bar)
  Create = function(f)
    local c, P = Parts(f, "achievement")
    c.glow = P(Tex(f, "BACKGROUND", MEDIA .. "Glow", "ADD")) -- Epic and Legendary: the rim's glow
    -- the bar in three slices (the Pill texture's straight half stretched, then its round end)
    c.fill = P(Tex(f, "BORDER", MEDIA .. "Pill", nil, 0))
    c.fillEnd = P(Tex(f, "BORDER", MEDIA .. "Pill", nil, 0))
    c.rim = P(Tex(f, "BORDER", MEDIA .. "PillRim", nil, 1))
    c.rimEnd = P(Tex(f, "BORDER", MEDIA .. "PillRim", nil, 1))
    c.fill:SetTexCoord(0.47, 0.48, 0, 1); c.rim:SetTexCoord(0.47, 0.48, 0, 1)
    c.fillEnd:SetTexCoord(0.5, 1, 0, 1); c.rimEnd:SetTexCoord(0.5, 1, 0, 1)
    c.bevel = P(Tex(f, "BORDER", WHITE, nil, 1)) -- a thin light line along the top: the one material touch
    -- the emblem over the bar's left end: a dark disc, a soft glow of the item's color inside, the rim
    -- and a faint inner ring
    c.disc = P(Tex(f, "BORDER", MEDIA .. "Circle", nil, 2))
    c.discGlow = P(Tex(f, "BORDER", MEDIA .. "Glow", "ADD", 3))
    c.ring = P(Tex(f, "BORDER", MEDIA .. "Ring", nil, 4))
    c.ring2 = P(Tex(f, "BORDER", MEDIA .. "Ring", nil, 4))
    -- the rarity gauge (four bars) and the item-level badge, in front
    c.gauge = Pool(P, 4, f.fx, "ARTWORK", WHITE, nil, 4)
    c.badge = P(Tex(f.fx, "ARTWORK", MEDIA .. "Circle", nil, 5))
    c.badgeRing = P(Tex(f.fx, "ARTWORK", MEDIA .. "Ring", nil, 6))
    c.lvl = P(f.fx:CreateFontString(nil, "OVERLAY", "GameFontHighlight"))
    c.lvlTag = P(f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall"))
    c.lvl:SetFont(ns.TITLE_FONT or "Fonts\\FRIZQT__.TTF", 15, "")
    c.lvl:SetShadowColor(0, 0, 0, 1); c.lvl:SetShadowOffset(1, -1)
    c.lvlTag:SetFont("Fonts\\FRIZQT__.TTF", 7, "")
    c.emblemParts = { c.disc, c.ring, c.ring2, c.discGlow }
    c.barParts = { c.fill, c.rim, c.fillEnd, c.rimEnd, c.bevel }
    -- the three lines: the rarity (and gauge), the name, the type; where (y, moved apart in Set for a
    -- name on two lines) and when they fade in
    c.lineFS, c.lineY, c.lineAt = { f.tag, f.name, f.info }, { 21, 1, -20 }, { 0.38, 0.44, 0.52 }
  end,
  Reset = function(f) HideAll(f, "achievement") end,
  Layout = function(f)
    local c = f.kit.achievement
    local ex = f.L.stage[1] -- the emblem's middle, from the popup's middle
    for _, t in ipairs({ c.disc, c.ring }) do t:SetSize(EMB, EMB); t:SetPoint("CENTER", f, "CENTER", ex, 0) end
    c.discGlow:SetSize(EMB * 0.95, EMB * 0.95); c.discGlow:SetPoint("CENTER", f, "CENTER", ex, 4)
    c.ring2:SetSize(EMB - 10, EMB - 10); c.ring2:SetPoint("CENTER", f, "CENTER", ex, 0)
    c.fill:SetPoint("LEFT", f, "CENTER", ex, 0)
    c.rim:SetPoint("LEFT", f, "CENTER", ex, 0)
    c.fillEnd:SetPoint("LEFT", c.fill, "RIGHT"); c.rimEnd:SetPoint("LEFT", c.rim, "RIGHT")
    c.bevel:SetPoint("TOPLEFT", c.fill, "TOPLEFT", 0, -3)
    c.bevel:SetPoint("TOPRIGHT", c.fill, "TOPRIGHT", 0, -3)
    c.bevel:SetHeight(1)
    c.badge:SetSize(40, 40); c.badgeRing:SetSize(40, 40)
    c.badge:SetPoint("CENTER", c.fillEnd, "RIGHT", -6, 0); c.badgeRing:SetPoint("CENTER", c.badge, "CENTER")
    c.lvl:SetPoint("CENTER", c.badge, "CENTER", 0, 3)
    c.lvlTag:SetPoint("CENTER", c.badge, "CENTER", 0, -10)
    f.tag:SetPoint("LEFT", f, "CENTER", ex + TEXT_X, 21)
    f.name:SetPoint("LEFT", f, "CENTER", ex + TEXT_X, 1)
    f.name:SetWidth(230)
    f.name:SetJustifyH("LEFT")
    f.info:SetPoint("LEFT", f, "CENTER", ex + TEXT_X, -20)
    f.info:SetJustifyH("LEFT")
    f.badges:SetPoint("LEFT", f.info, "RIGHT", 10, 0)
    f.badges:SetJustifyH("LEFT")
    for i, g in ipairs(c.gauge) do
      g:SetSize(12, 4)
      if i == 1 then g:SetPoint("LEFT", f.tag, "RIGHT", 8, 0) else g:SetPoint("LEFT", c.gauge[i - 1], "RIGHT", 2, 0) end
    end
    f.shineClip:ClearAllPoints()
    f.shineClip:SetPoint("TOPLEFT", c.fill, "TOPLEFT")
    f.shineClip:SetPoint("BOTTOMRIGHT", c.fillEnd, "BOTTOMRIGHT")
    f.shineClip:Show()
    f.shine:SetSize(60, 110)
    f.shine:Hide()
    f.tag:Show()
  end,
  Set = function(f, item)
    local c = f.kit.achievement
    local q, r, g, b = f.q, f.r, f.g, f.b
    local rr, rg, rb = r, g, b
    if q >= 5 then rr, rg, rb = GOLD[1], GOLD[2], GOLD[3] end
    -- the item level moves into the badge; the line under the name keeps the type
    c.hasLvl = ns.ShowsItemLevel(item)
    if c.hasLvl then
      f.info:SetText(item.typeText or "")
      c.lvl:SetText(item.ilvl)
      c.lvlTag:SetText("ILVL")
    end
    -- a name on two lines pushes the rarity up and the type down by half its extra height
    local _, fontSize = f.name:GetFont()
    local extra = math.max(0, (f.name:GetStringHeight() or 0) - (fontSize or 19) * 1.3)
    c.lineY[1], c.lineY[3] = 21 + extra / 2, -20 - extra / 2
    -- the bar reaches past the longest line (the badge needs a little more room)
    local tw = math.max(Measure(f.name), Measure(f.tag) + 8 + 4 * 14,
      Measure(f.info) + (f.badges:GetText() ~= "" and Measure(f.badges) + 10 or 0))
    c.w = math.max(40, TEXT_X + math.min(tw, 230) + (c.hasLvl and 36 or 22) - BAR_H / 2)
    c.fill:SetSize(c.w, BAR_H); c.rim:SetSize(c.w, BAR_H)
    c.fillEnd:SetSize(BAR_H / 2, BAR_H); c.rimEnd:SetSize(BAR_H / 2, BAR_H)
    c.fill:SetVertexColor(0.1, 0.075, 0.045, 0.96); c.fillEnd:SetVertexColor(0.1, 0.075, 0.045, 0.96)
    c.rim:SetVertexColor(rr, rg, rb, 1); c.rimEnd:SetVertexColor(rr, rg, rb, 1)
    c.bevel:SetVertexColor(1, 1, 1, 0.12)
    c.disc:SetVertexColor(0.07, 0.05, 0.03, 0.97)
    c.discGlow:SetVertexColor(r * 0.7, g * 0.7, b * 0.7, 0.6)
    c.ring:SetVertexColor(rr, rg, rb, 1)
    c.ring2:SetVertexColor(rr, rg, rb, 0.35)
    c.badge:SetVertexColor(0.09, 0.065, 0.04, 1)
    c.badgeRing:SetVertexColor(rr, rg, rb, 1)
    c.lvl:SetTextColor(1, 1, 1)
    c.lvlTag:SetTextColor(math.min(1, r + 0.35), math.min(1, g + 0.35), math.min(1, b + 0.35))
    c.glow:ClearAllPoints()
    c.glow:SetPoint("CENTER", c.fill, "CENTER", BAR_H / 4 - EMB / 4, 0)
    c.glow:SetSize(c.w + EMB + 120, 190)
    c.glow:SetVertexColor(r, g, b, 1)
    c.glowA = q >= 5 and 0.55 or q >= 4 and 0.35 or 0
    c.lit = math.max(1, math.min(4, q - 1)) -- the gauge: Uncommon 1 bar .. Legendary 4
    for i, t in ipairs(c.gauge) do
      if i <= c.lit then t:SetVertexColor(r, g, b, 1) else t:SetVertexColor(1, 1, 1, 0.12) end
    end
  end,
  -- the emblem pops, the bar opens to the right, the lines fade in one after another, the gauge fills,
  -- the badge pops on last and a shine runs along the bar
  Tick = function(f, fx)
    local c = f.kit.achievement
    if c.done then return end
    local ex = f.L.stage[1]
    local t = Clamp01(fx / 0.3)
    local s = t < 0.6 and 1.1 * (t / 0.6) or 1.1 - 0.1 * ((t - 0.6) / 0.4)
    c.disc:SetSize(math.max(1, EMB * s), math.max(1, EMB * s))
    c.ring:SetSize(math.max(1, EMB * s), math.max(1, EMB * s))
    c.discGlow:SetSize(math.max(1, EMB * 0.95 * s), math.max(1, EMB * 0.95 * s))
    c.ring2:SetSize(math.max(1, (EMB - 10) * s), math.max(1, (EMB - 10) * s))
    for _, x in ipairs(c.emblemParts) do x:SetShown(fx >= 0) end
    local o = OutCubic((fx - 0.18) / 0.32)
    local open = o > 0
    c.fill:SetWidth(math.max(1, c.w * o)); c.rim:SetWidth(math.max(1, c.w * o))
    for _, x in ipairs(c.barParts) do x:SetShown(open) end
    c.glow:SetShown(c.glowA > 0 and open)
    c.glow:SetAlpha(c.glowA * o)
    -- the lines: the rarity (and gauge), the name, the type
    for k = 1, 3 do
      local fs, y, at = c.lineFS[k], c.lineY[k], c.lineAt[k]
      local u = Clamp01((fx - at) / 0.25)
      if not (k == 2 and f.lettersOn) then -- (an Epic's letters stamp the name in themselves)
        fs:ClearAllPoints()
        fs:SetPoint("LEFT", f, "CENTER", ex + TEXT_X - 6 * (1 - u), y)
        fs:SetAlpha(u)
      end
    end
    f.badges:SetAlpha(Clamp01((fx - 0.52) / 0.25))
    for i, g in ipairs(c.gauge) do
      g:SetShown(fx >= 0.38)
      local on = i <= c.lit and fx >= 0.55 + (i - 1) * 0.07
      if i <= c.lit then
        if on then g:SetVertexColor(f.r, f.g, f.b, 1) else g:SetVertexColor(1, 1, 1, 0.12) end
      end
      g:SetAlpha(Clamp01((fx - 0.38) / 0.25))
    end
    -- the badge: big, a touch small, settled
    local bt = Clamp01((fx - 0.75) / 0.26)
    local bs = bt < 0.6 and 1.15 * (bt / 0.6) or 1.15 - 0.15 * ((bt - 0.6) / 0.4)
    local showBadge = c.hasLvl and bt > 0
    c.badge:SetSize(math.max(1, 40 * bs), math.max(1, 40 * bs)); c.badge:SetShown(showBadge)
    c.badgeRing:SetSize(math.max(1, 40 * bs), math.max(1, 40 * bs)); c.badgeRing:SetShown(showBadge)
    c.lvl:SetShown(showBadge); c.lvlTag:SetShown(showBadge)
    c.lvl:SetAlpha(bt); c.lvlTag:SetAlpha(bt)
    local sp = (fx - 0.7) / 0.7
    if sp >= 0 and sp < 1 then
      f.shine:ClearAllPoints()
      f.shine:SetPoint("CENTER", f.shineClip, "LEFT", -30 + (f.shineClip:GetWidth() + 60) * sp, 0)
      f.shine:Show()
    elseif f.shine:IsShown() then f.shine:Hide() end
    if fx > 1.5 then c.done = true end
  end,
}

---------------------------------------------------------------------------
-- Brush stroke
---------------------------------------------------------------------------
local BRUSH_W, BRUSH_H, FLECKS = 400, 100, 9
kits.brush = {
  Create = function(f)
    local c, P = Parts(f, "brush")
    c.stroke = P(Tex(f, "BORDER", MEDIA .. "Brush", nil, 1))
    c.flecks = Pool(P, FLECKS, f.fx, "ARTWORK", MEDIA .. "Circle", nil, 1)
  end,
  Reset = function(f) HideAll(f, "brush") end,
  Layout = function(f)
    local c = f.kit.brush
    f.name:SetPoint("TOP", f.stage, "BOTTOM", 0, -4)
    f.name:SetWidth(f.L.w - 30)
    f.name:SetJustifyH("CENTER")
    f.name:SetShadowOffset(2, -2)
    c.stroke:SetPoint("LEFT", f.name, "CENTER", -BRUSH_W / 2, -2)
    f.info:SetPoint("TOP", f.name, "BOTTOM", 0, -8)
    f.info:SetJustifyH("CENTER")
    f.badges:SetPoint("TOP", f.info, "BOTTOM", 0, -4)
    f.badges:SetJustifyH("CENTER")
  end,
  Set = function(f, item)
    local c = f.kit.brush
    local r, g, b = f.r, f.g, f.b
    f.name:SetTextColor(1, 1, 1) -- white over the paint
    f.info:SetTextColor(1, 1, 1)
    local info = f.info:GetText() or ""
    f.info:SetText(QualityWord(f.q) .. (info ~= "" and "  ·  " .. info or ""))
    f:PrepareLetters() -- (again: an Epic's stamped letters take the white)
    Gradient(c.stroke, r * 0.4, g * 0.4, b * 0.4, 1, math.min(1, r + 0.25), math.min(1, g + 0.25), math.min(1, b + 0.25), 1)
    c.n = math.min(FLECKS, 3 + f.q)
    for i, m in ipairs(c.flecks) do
      m.x, m.y = Rnd(130, 190), Rnd(-28, 24) -- around the stroke's end
      local s = Rnd(3, 9)
      m:SetSize(s, s)
      m:SetVertexColor(r, g, b, 1)
      m.delay = 0.28 + i * 0.02
    end
  end,
  -- the stroke swipes in from the left, the name and the info fade in over it, the flecks fly off
  -- the stroke's end and stay
  Tick = function(f, fx)
    local c = f.kit.brush
    if c.done then return end
    local e = OutCubic((fx - 0.05) / 0.32)
    if e <= 0 then c.stroke:Hide() else
      c.stroke:SetSize(math.max(1, BRUSH_W * e), BRUSH_H)
      c.stroke:SetTexCoord(0, e, 0, 1)
      c.stroke:Show()
    end
    if not f.lettersOn then f.name:SetAlpha(Clamp01((fx - 0.3) / 0.25)) end
    f.info:SetAlpha(Clamp01((fx - 0.4) / 0.25))
    f.badges:SetAlpha(Clamp01((fx - 0.4) / 0.25))
    for i, m in ipairs(c.flecks) do
      local u = Clamp01((fx - m.delay) / 0.5)
      if i > c.n or u <= 0 then m:Hide() else
        local k = OutCubic(u)
        m:ClearAllPoints()
        m:SetPoint("CENTER", f.name, "CENTER", m.x - 40 * (1 - k), m.y + 6 * (1 - k))
        m:SetAlpha(math.min(1, u / 0.3))
        m:Show()
      end
    end
    if fx > 1 then c.done = true end
  end,
}

---------------------------------------------------------------------------
-- The fantasy three: shared layout (name, divider, info) and their letter-by-letter arrivals
---------------------------------------------------------------------------
kits.fantasy = { -- (not a style: the parts the three share)
  Create = function(f)
    local c, P = Parts(f, "fantasy")
    c.divL = P(Tex(f.fx, "ARTWORK", WHITE, nil, 3))
    c.divR = P(Tex(f.fx, "ARTWORK", WHITE, nil, 3))
    c.dia = P(Tex(f.fx, "ARTWORK", MEDIA .. "Diamond", nil, 4))
    c.glow = P(Tex(f, "BACKGROUND", MEDIA .. "Glow", "ADD"))
  end,
  Reset = function(f) HideAll(f, "fantasy") end,
}
local function FantasyLayout(f)
  local c = f.kit.fantasy
  f.name:SetPoint("TOP", f.stage, "BOTTOM", 0, -4)
  f.name:SetWidth(f.L.w - 20)
  f.name:SetJustifyH("CENTER")
  c.dia:SetSize(9, 9)
  c.dia:SetPoint("TOP", f.name, "BOTTOM", 0, -6)
  c.divL:SetSize(84, 1); c.divL:SetPoint("RIGHT", c.dia, "LEFT", -2, 0)
  c.divR:SetSize(84, 1); c.divR:SetPoint("LEFT", c.dia, "RIGHT", 2, 0)
  f.info:SetPoint("TOP", c.dia, "BOTTOM", 0, -5)
  f.info:SetJustifyH("CENTER")
  f.badges:SetPoint("TOP", f.info, "BOTTOM", 0, -3)
  f.badges:SetJustifyH("CENTER")
  c.glow:SetSize(320, 170)
  c.glow:SetPoint("CENTER", f.name, "CENTER", 0, 10)
end
local function FantasySet(f)
  local c = f.kit.fantasy
  local r, g, b = f.r, f.g, f.b
  local info = f.info:GetText() or ""
  f.info:SetText(QualityWord(f.q) .. (info ~= "" and "  ·  " .. info or ""))
  Gradient(c.divL, r, g, b, 0, r, g, b, 1)
  Gradient(c.divR, r, g, b, 1, r, g, b, 0)
  c.dia:SetVertexColor(math.min(1, r + 0.35), math.min(1, g + 0.35), math.min(1, b + 0.35), 1)
  c.glow:SetVertexColor(r, g, b, 1)
  -- the letters, whatever the rarity: these styles bring the name in letter by letter themselves
  f:PrepareLetters(true)
  f.ownLetters = true
  f.name:SetAlpha(f.lettersOn and 0 or 1)
end
-- the divider grows out from its diamond and the info fades in, from `at`; tint(t) may recolor the
-- divider (the forge cools it)
local function FantasyTail(f, fx, at)
  local c = f.kit.fantasy
  local u = OutCubic((fx - at) / 0.5)
  c.dia:SetShown(u > 0); c.divL:SetShown(u > 0); c.divR:SetShown(u > 0)
  c.divL:SetWidth(math.max(1, 84 * u)); c.divR:SetWidth(math.max(1, 84 * u))
  local a = Clamp01((fx - at - 0.15) / 0.4)
  f.info:SetAlpha(a); f.badges:SetAlpha(a)
end
-- all letters landed: the name itself again, crisp
local function LettersDone(f)
  for k = 1, f.letterCount or 0 do f.letters[k]:Hide() end
  f.name:SetAlpha(1)
  f.lettersOn = nil
end
local function PlaceLetter(f, l, dx, dy)
  l:ClearAllPoints()
  l:SetPoint("CENTER", f.name, l.anchor, l.cx + (dx or 0), dy or 0)
end
local function NameColor(f) return f.r, f.g, f.b end

---------------------------------------------------------------------------
-- Rune decode
---------------------------------------------------------------------------
local RUNE_AT, RUNE_STEP, SETTLE_T, LIFT_T, RUNE_SWAP = 0.35, 0.055, 0.55, 0.9, 0.07
local function RuneCell(t, i)
  local col, row = i % 4, math.floor(i / 4)
  t:SetTexCoord(col / 4, (col + 1) / 4, row / 4, (row + 1) / 4)
end
kits.runes = {
  Create = function(f)
    local c, P = Parts(f, "runes")
    c.runes = Pool(P, 48, f.fx, "ARTWORK", MEDIA .. "Runes", "ADD", 5)
    c.lifts = Pool(P, 48, f.fx, "ARTWORK", MEDIA .. "Runes", "ADD", 5)
  end,
  Reset = function(f) HideAll(f, "runes") end,
  Layout = FantasyLayout,
  Set = function(f)
    local c = f.kit.runes
    FantasySet(f)
    local fc = f.kit.fantasy
    fc.glowA = 0.22
    local lr, lg, lb = math.min(1, f.r + 0.4), math.min(1, f.g + 0.4), math.min(1, f.b + 0.4)
    local _, size = f.name:GetFont()
    c.size = (size or 22) * 1.15
    for i, rt in ipairs(c.runes) do
      rt:SetVertexColor(lr, lg, lb, 1); c.lifts[i]:SetVertexColor(lr, lg, lb, 1)
      rt.swap, rt.cell = 0, math.random(0, 15)
    end
  end,
  Tick = function(f, fx)
    local c, fc = f.kit.runes, f.kit.fantasy
    if c.done then return end
    fc.glow:SetShown(fx >= 0)
    fc.glow:SetAlpha(fc.glowA * Clamp01(fx / 0.8))
    local n = f.letterCount or 0
    local last = RUNE_AT + n * RUNE_STEP
    FantasyTail(f, fx, math.max(1, last + 0.1))
    if not f.lettersOn then -- (a name on two lines just fades in)
      f.name:SetAlpha(Clamp01((fx - 0.3) / 0.4))
      if fx > 2 then c.done = true end
      return
    end
    local r, g, b = NameColor(f)
    for k = 1, n do
      local l, rt, lift = f.letters[k], c.runes[k], c.lifts[k]
      if not rt then break end
      local blank = (l:GetText() or "") == " "
      local t = fx - RUNE_AT - (k - 1) * RUNE_STEP
      if blank or fx < 0 then
        rt:Hide(); lift:Hide(); l:Hide()
      elseif t < 0 then -- still a rune, flickering through others
        l:Hide()
        if fx >= rt.swap then rt.swap = fx + RUNE_SWAP; rt.cell = (rt.cell + math.random(1, 15)) % 16 end
        RuneCell(rt, rt.cell)
        rt:SetSize(c.size, c.size)
        rt:ClearAllPoints(); rt:SetPoint("CENTER", f.name, l.anchor, l.cx, 0)
        rt:SetAlpha(0.95 * Clamp01(fx / 0.15))
        rt:Show()
      else -- settled: the letter flashes white and cools to its color; its rune floats off
        rt:Hide()
        local u = Clamp01(t / SETTLE_T)
        l:SetTextColor(Lerp(1, r, u), Lerp(1, g, u), Lerp(1, b, u))
        PlaceLetter(f, l, 0, 3 * (1 - u))
        l:SetAlpha(1)
        l:Show()
        local lu = t / LIFT_T
        if lu < 1 then
          RuneCell(lift, rt.cell)
          local s = c.size * Lerp(1, 0.6, lu)
          lift:SetSize(s, s)
          lift:ClearAllPoints(); lift:SetPoint("CENTER", f.name, l.anchor, l.cx, 34 * OutCubic(lu))
          lift:SetAlpha(0.9 * (1 - lu))
          lift:Show()
        else lift:Hide() end
      end
    end
    if fx > last + LIFT_T + 0.1 then LettersDone(f); c.done = fx > last + 1.8 end
  end,
}

---------------------------------------------------------------------------
-- Forged letters
---------------------------------------------------------------------------
local FORGE_AT, FORGE_STEP, FORGE_T, SPARK_T = 0.25, 0.065, 1.3, 0.7
-- white-hot, then yellow, orange, then the item's color (u = 0..1 over FORGE_T)
local HEAT = { { 0, 1, 0.98, 0.9 }, { 0.12, 1, 0.96, 0.75 }, { 0.45, 1, 0.7, 0.28 } }
local HEAT_KEYS = { HEAT[1], HEAT[2], HEAT[3], { 1, 1, 1, 1 } } -- (the last key: the item's color, set per call)
local function HeatColor(u, r, g, b)
  local keys = HEAT_KEYS
  keys[4][2], keys[4][3], keys[4][4] = r, g, b
  for i = 1, #keys - 1 do
    local a, z = keys[i], keys[i + 1]
    if u <= z[1] then
      local t = (u - a[1]) / (z[1] - a[1])
      return Lerp(a[2], z[2], t), Lerp(a[3], z[3], t), Lerp(a[4], z[4], t)
    end
  end
  return r, g, b
end
kits.forged = {
  Create = function(f)
    local c, P = Parts(f, "forged")
    c.flashes = Pool(P, 48, f.fx, "ARTWORK", MEDIA .. "Glow", "ADD", 0)
    c.sparks = Pool(P, 120, f.fx, "ARTWORK", MEDIA .. "Mote", "ADD", 6)
  end,
  Reset = function(f) HideAll(f, "forged") end,
  Layout = FantasyLayout,
  Set = function(f)
    local c = f.kit.forged
    FantasySet(f)
    for _, t in ipairs(c.flashes) do t:SetVertexColor(1, 0.8, 0.5, 1) end
    -- sparks off every strike, more the rarer (Uncommon 1 a letter .. Legendary 4)
    local per, s = math.max(1, math.min(4, f.q - 1)), 0
    for k = 1, f.letterCount or 0 do
      local l = f.letters[k]
      if (l:GetText() or "") ~= " " then
        for _ = 1, per do
          if s >= #c.sparks then break end -- (a very long name: the pool's sparks are all used)
          s = s + 1
          local m = c.sparks[s]
          m.k, m.x, m.y = k, l.cx + Rnd(-3, 3), Rnd(-6, 6)
          m.dx, m.dy = Rnd(-30, 30), Rnd(12, 34)
          local size = Rnd(3, 5)
          m:SetSize(size, size)
          m:SetVertexColor(1, 0.86, 0.6, 1)
        end
      end
    end
    c.sparkCount, c.cooled = s, nil
    c.face, c.size, c.flags = f.name:GetFont(); c.size, c.flags = c.size or 22, c.flags or ""
  end,
  Tick = function(f, fx)
    local c, fc = f.kit.forged, f.kit.fantasy
    if c.done then return end
    local n = f.letterCount or 0
    local last = FORGE_AT + n * FORGE_STEP
    local at = math.max(1.05, last + 0.15)
    FantasyTail(f, fx, at)
    -- the divider cools from orange to the item's color
    local cu = Clamp01((fx - at) / 1.4)
    if cu ~= c.cooled then -- (only while it changes)
      c.cooled = cu
      local hr, hg, hb = Lerp(1, f.r, cu), Lerp(0.7, f.g, cu), Lerp(0.3, f.b, cu)
      Gradient(fc.divL, hr, hg, hb, 0, hr, hg, hb, 1)
      Gradient(fc.divR, hr, hg, hb, 1, hr, hg, hb, 0)
    end
    if not f.lettersOn then
      f.name:SetAlpha(Clamp01((fx - 0.3) / 0.4))
      if fx > at + 1.5 then c.done = true end
      return
    end
    local r, g, b = NameColor(f)
    for k = 1, n do
      local l, fl = f.letters[k], c.flashes[k]
      if not fl then break end
      local t = fx - FORGE_AT - (k - 1) * FORGE_STEP
      if t < 0 or (l:GetText() or "") == " " then l:Hide(); fl:Hide() else
        local u = Clamp01(t / FORGE_T)
        local lr, lg, lb = HeatColor(u, r, g, b)
        l:SetTextColor(lr, lg, lb)
        local e = Clamp01(u / 0.12)
        TextScale(l, Lerp(1.5, 1, OutCubic(e)), c.face, c.size, c.flags)
        PlaceLetter(f, l, 0, 12 * (1 - OutCubic(e)))
        l:SetAlpha(e)
        l:Show()
        -- the strike's flash, then the letter's heat glowing behind it as it cools
        local fs, fa
        if t < 0.4 then fs, fa = 44 * Lerp(0.4, 1.4, t / 0.4), 1 - t / 0.4
        else fs, fa = 30, 0.45 * Clamp01(1 - u / 0.6) end
        if fa > 0 then
          fl:SetSize(fs, fs)
          fl:ClearAllPoints(); fl:SetPoint("CENTER", f.name, l.anchor, l.cx, 0)
          fl:SetAlpha(fa)
          fl:Show()
        else fl:Hide() end
      end
    end
    -- sparks arc up off the strike and fall
    for i = 1, c.sparkCount do
      local m = c.sparks[i]
      local t = fx - FORGE_AT - (m.k - 1) * FORGE_STEP - 0.02
      local p = t / SPARK_T
      if p < 0 or p >= 1 then m:Hide() else
        local x, y
        if p < 0.45 then
          local e = OutCubic(p / 0.45)
          x, y = m.dx * 0.6 * e, m.dy * e
        else
          local q2 = (p - 0.45) / 0.55
          x, y = Lerp(m.dx * 0.6, m.dx, q2), m.dy - 44 * q2 * q2
        end
        local l = f.letters[m.k]
        m:ClearAllPoints(); m:SetPoint("CENTER", f.name, l.anchor, m.x + x, m.y + y)
        m:SetAlpha(p < 0.45 and 1 or 1 - (p - 0.45) / 0.55)
        m:Show()
      end
    end
    if fx > last + FORGE_T + 0.05 then
      LettersDone(f)
      for _, fl in ipairs(c.flashes) do fl:Hide() end
      c.done = fx > at + 1.5 and fx > last + SPARK_T + FORGE_T
    end
  end,
}

---------------------------------------------------------------------------
-- Ember burn-in
---------------------------------------------------------------------------
local BURN_AT, BURN_T, COOL_AFTER, COOL_T = 0.15, 1.1, 0.25, 0.7
kits.ember = {
  Create = function(f)
    local c, P = Parts(f, "ember")
    c.edge = P(Tex(f.fx, "ARTWORK", MEDIA .. "Glow", "ADD", 6))
    c.edgeWide = P(Tex(f.fx, "ARTWORK", MEDIA .. "Glow", "ADD", 5))
    c.heat = Pool(P, 48, f.fx, "ARTWORK", MEDIA .. "Glow", "ADD", 0)
    c.embers = Pool(P, 24, f.fx, "ARTWORK", MEDIA .. "Mote", "ADD", 6)
    c.smoke = Pool(P, 8, f.fx, "ARTWORK", MEDIA .. "Glow", nil, 1)
  end,
  Reset = function(f) HideAll(f, "ember") end,
  Layout = FantasyLayout,
  Set = function(f)
    local c = f.kit.ember
    FantasySet(f)
    c.edge:SetVertexColor(1, 0.95, 0.78, 1)
    c.edgeWide:SetVertexColor(1, 0.55, 0.15, 1)
    for _, t in ipairs(c.heat) do t:SetVertexColor(1, 0.5, 0.1, 1) end
    -- where the name runs, from the name's middle (the letters know; a wrapped name uses its width)
    local w = math.min(Measure(f.name), f.name:GetWidth())
    c.left, c.w = -w / 2, math.max(1, w)
    local nh = f.name:GetStringHeight() or 24
    c.h = nh
    local n = math.max(1, math.min(4, f.q - 1))
    c.emberCount, c.smokeCount = math.min(#c.embers, 6 + 4 * n), math.min(#c.smoke, 3 + n)
    for i, m in ipairs(c.embers) do
      local p = math.random()
      m.x, m.y, m.dx = c.left + p * c.w, Rnd(-6, 12), Rnd(-14, 14)
      m.at, m.life = BURN_AT + BURN_T * (0.1 + p) / 1.2, Rnd(1, 1.6)
      m:SetSize(4, 4)
      m:SetVertexColor(1, 0.75, 0.38, 1)
      m.i = i
    end
    for i, s in ipairs(c.smoke) do
      s.x, s.at = c.left + Rnd(0.05, 0.9) * c.w, 0.5 + (i - 1) * 0.15
      s:SetVertexColor(0.62, 0.58, 0.54, 1)
    end
  end,
  Tick = function(f, fx)
    local c = f.kit.ember
    if c.done then return end
    FantasyTail(f, fx, 1.15)
    -- the edge runs from a little before the name's start to a little past its end
    local p = (fx - BURN_AT) / BURN_T
    local ex = c.left - 0.1 * c.w + 1.2 * c.w * Clamp01(p)
    if p >= 0 and p < 1 then
      local a = math.min(1, p / 0.08, (1 - p) / 0.12)
      c.edge:SetSize(12, c.h + 16); c.edgeWide:SetSize(34, c.h + 24)
      c.edge:ClearAllPoints(); c.edge:SetPoint("CENTER", f.name, "CENTER", ex, 0); c.edge:Show()
      c.edgeWide:ClearAllPoints(); c.edgeWide:SetPoint("CENTER", f.name, "CENTER", ex, 0); c.edgeWide:Show()
      c.edge:SetAlpha(a); c.edgeWide:SetAlpha(0.55 * a)
    else c.edge:Hide(); c.edgeWide:Hide() end
    -- each letter burns in as the edge passes it, glowing hot, then cools to its color
    local r, g, b = NameColor(f)
    if f.lettersOn then
      for k = 1, f.letterCount or 0 do
        local l, ht = f.letters[k], c.heat[k]
        if not ht then break end
        local x = l.cx -- (from the name's middle: these styles center it)
        local passAt = BURN_AT + BURN_T * ((x - c.left + 0.1 * c.w) / (1.2 * c.w))
        local h = fx - passAt
        if h < 0 or (l:GetText() or "") == " " then l:Hide(); ht:Hide() else
          local k2 = Clamp01((h - COOL_AFTER) / COOL_T)
          l:SetTextColor(Lerp(1, r, k2), Lerp(0.85, g, k2), Lerp(0.56, b, k2))
          l:SetAlpha(Clamp01(h / 0.08))
          PlaceLetter(f, l)
          l:Show()
          if k2 < 1 then
            ht:SetSize(30, 34)
            ht:ClearAllPoints(); ht:SetPoint("CENTER", f.name, l.anchor, l.cx, 0)
            ht:SetAlpha(0.6 * (1 - k2) * Clamp01(h / 0.1))
            ht:Show()
          else ht:Hide() end
        end
      end
      if fx > BURN_AT + BURN_T + COOL_AFTER + COOL_T + 0.1 then
        LettersDone(f)
        for _, ht in ipairs(c.heat) do ht:Hide() end
      end
    else -- (a name on two lines: it just fades in behind the edge)
      f.name:SetAlpha(Clamp01(p))
    end
    -- embers rise where the edge passes, swaying; a little smoke drifts up after it
    for i = 1, c.emberCount do
      local m = c.embers[i]
      local u = (fx - m.at) / m.life
      if u < 0 or u >= 1 then m:Hide() else
        local sx = u < 0.5 and m.dx * u * 2 or Lerp(m.dx, -m.dx * 0.5, (u - 0.5) * 2)
        m:ClearAllPoints(); m:SetPoint("CENTER", f.name, "CENTER", m.x + sx, m.y + 58 * u)
        m:SetAlpha(u < 0.5 and Lerp(1, 0.9, u * 2) or 0.9 * (1 - (u - 0.5) * 2))
        m:Show()
      end
    end
    for i = 1, c.smokeCount do
      local s = c.smoke[i]
      local u = (fx - s.at) / 1.6
      if u < 0 or u >= 1 then s:Hide() else
        local size = 26 * Lerp(0.5, 2.2, u)
        s:SetSize(size, size)
        s:ClearAllPoints(); s:SetPoint("CENTER", f.name, "CENTER", s.x + 6 * u, 8 + 52 * u)
        s:SetAlpha(0.35 * (u < 0.3 and u / 0.3 or 1 - (u - 0.3) / 0.7))
        s:Show()
      end
    end
    if fx > 3.2 then c.done = true end
  end,
}

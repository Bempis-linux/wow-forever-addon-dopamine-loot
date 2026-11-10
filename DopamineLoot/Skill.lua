-- Dopamine Loot skill-ups (docs/mockups/gathering.html, round 3: G5). When a profession's skill goes
-- up ("Your skill in Herbalism has increased to 75."), a banner shows the new skill and a bar in the
-- profession's color filling toward what's next, with its icon at the bar's end: for Herbalism and
-- Mining the next herb or ore you can gather (the Classic skill levels; check them on Forever), for the
-- others the next rank cap (75, 150, 225, 300). Weapon and other skills are left out. Movable (Mover.lua).
-- Shared by gathering and (later) crafting.
local _, ns = ...

local BORDER = "Interface\\COMMON\\WhiteIconFrame"
local GetIcon = (C_Item and C_Item.GetItemIconByID) or GetItemIcon
local CAPS = { 75, 150, 225, 300 }

-- The profession's color (bar, glow) and, for gatherers, what each skill level opens up: { level, item ID, name }
local PROF = {
  Herbalism = { icon = 2447, color = { 0.18, 0.62, 0.23 }, light = { 0.56, 0.94, 0.48 }, unlocks = {
    { 1, 2447, "Peacebloom" }, { 15, 2449, "Earthroot" }, { 50, 785, "Mageroyal" }, { 70, 2450, "Briarthorn" },
    { 85, 3820, "Stranglekelp" }, { 100, 2453, "Bruiseweed" }, { 115, 3355, "Wild Steelbloom" }, { 120, 3369, "Grave Moss" },
    { 125, 3356, "Kingsblood" }, { 150, 3357, "Liferoot" }, { 160, 3818, "Fadeleaf" }, { 170, 3821, "Goldthorn" },
    { 185, 3358, "Khadgar's Whisker" }, { 195, 3819, "Wintersbite" }, { 205, 4625, "Firebloom" }, { 210, 8831, "Purple Lotus" },
    { 220, 8836, "Arthas' Tears" }, { 230, 8838, "Sungrass" }, { 235, 8839, "Blindweed" }, { 245, 8845, "Ghost Mushroom" },
    { 250, 8846, "Gromsblood" }, { 260, 13464, "Golden Sansam" }, { 270, 13463, "Dreamfoil" }, { 280, 13465, "Mountain Silversage" },
    { 285, 13466, "Plaguebloom" }, { 290, 13467, "Icecap" }, { 300, 13468, "Black Lotus" } } },
  Mining = { icon = 2770, color = { 0.78, 0.39, 0.16 }, light = { 1, 0.69, 0.44 }, unlocks = {
    { 1, 2770, "Copper Vein" }, { 65, 2771, "Tin Vein" }, { 75, 2775, "Silver Vein" }, { 125, 2772, "Iron Deposit" },
    { 155, 2776, "Gold Vein" }, { 175, 3858, "Mithril Deposit" }, { 230, 7911, "Truesilver Deposit" },
    { 245, 10620, "Small Thorium Vein" }, { 275, 10620, "Rich Thorium Vein" } } },
  Fishing = { icon = 6291, color = { 0.16, 0.49, 1 }, light = { 0.54, 0.78, 1 } },
  Skinning = { icon = 2318, color = { 0.6, 0.42, 0.23 }, light = { 0.88, 0.72, 0.5 } },
  -- crafting (docs/mockups/crafting-r5.html): the bar is made of the craft's material (SkillBar.lua)
  Leatherworking = { craft = true, color = { 0.69, 0.48, 0.27 }, light = { 0.9, 0.72, 0.5 } },
  Alchemy = { craft = true, color = { 0.6, 0.35, 0.88 }, light = { 0.82, 0.66, 1 } },
  Tailoring = { craft = true, color = { 0.85, 0.78, 0.63 }, light = { 1, 0.96, 0.85 } },
  Engineering = { craft = true, color = { 0.63, 0.71, 0.78 }, light = { 0.85, 0.92, 1 } },
  Cooking = { craft = true, color = { 0.88, 0.63, 0.31 }, light = { 1, 0.82, 0.55 } },
  Blacksmithing = { craft = true, color = { 0.88, 0.48, 0.16 }, light = { 1, 0.75, 0.45 } },
  Enchanting = { craft = true, color = { 0.54, 0.42, 1 }, light = { 0.78, 0.7, 1 } },
  ["First Aid"] = { craft = true, color = { 0.88, 0.35, 0.35 }, light = { 1, 0.62, 0.62 } },
}
-- the recipe line under a crafting skill-up, when the recipe just crafted changed color
local RECIPE = {
  [1] = "|cffffff40yellow|r: skill-ups from it come slower",
  [2] = "|cff40c040green|r: skill-ups from it are rare now",
  [3] = "|cff9d9d9dgray|r: no more skill-ups from it",
}
local DEFAULT = { color = { 0.85, 0.65, 0.13 }, light = { 1, 0.85, 0.4 } }
-- Professions (other skills such as weapons don't get a banner); localized names are added at login
local IS_PROF = { Herbalism = true, Mining = true, Skinning = true, Fishing = true, Alchemy = true, Blacksmithing = true,
  Enchanting = true, Engineering = true, Leatherworking = true, Tailoring = true, Cooking = true, ["First Aid"] = true,
  Jewelcrafting = true, Inscription = true }

local banner, shade, title, titleGlow, bar, unlock, unlockBorder, note, recipeLine
local Layout
local flair = 1 -- (0 with the Simple bar look: no title glow, no shade)
local pattern
local showT, showing
local shown = 0 -- (counts banners: a late recipe check only writes into its own)

local function Pattern()
  local s = _G.SKILL_RANK_UP
  if type(s) ~= "string" then return nil end
  local p = s:gsub("%%%d?%$?s", "\1"):gsub("%%%d?%$?d", "\2"):gsub("%p", "%%%0"):gsub("\1", "(.+)"):gsub("\2", "(%%d+)")
  return "^" .. p .. "$"
end

-- Adds this client's names for your professions (a non-English client)
local function LearnNames()
  if not GetProfessions or not GetProfessionInfo then return end
  local ok, a, b, c, d, e, f = pcall(GetProfessions)
  if not ok then return end
  for j = 1, 6 do -- (not ipairs: the list has holes, e.g. no archaeology)
    local i = select(j, a, b, c, d, e, f)
    local ok2, name = pcall(GetProfessionInfo, i)
    if ok2 and type(name) == "string" and not ns.Secret(name) then IS_PROF[name] = true end
  end
end

-- What's next for a profession at this level: from, to, the icon, the text under the bar
local function Next(name, level)
  local p = PROF[name]
  if p and p.unlocks then
    local prev = 0
    for _, u in ipairs(p.unlocks) do
      if u[1] > level then
        return prev, u[1], GetIcon and GetIcon(u[2]), (u[1] - level) .. " to " .. u[3]
      end
      prev = u[1]
    end
  end
  local prev = 0
  for _, cap in ipairs(CAPS) do
    if cap > level then return prev, cap, nil, (cap - level) .. " to " .. cap end
    prev = cap
  end
  return level - 1, level, nil, "Mastered"
end

-- The unlock this level reaches, if any: a new herb or ore (its icon and name, and the span the bar fills)
local function Reached(name, level)
  local p = PROF[name]
  if not (p and p.unlocks) then return nil end
  local prev = 0
  for _, u in ipairs(p.unlocks) do
    if u[1] == level and level > 1 then return u, prev end
    if u[1] < level then prev = u[1] end
  end
end

-- The profession's current cap (the game's max for your rank), or nil if the client doesn't say
local RANKS = { [75] = "Journeyman", [150] = "Expert", [225] = "Artisan" }
local function MaxRank(name)
  if not GetProfessions or not GetProfessionInfo then return nil end
  local ok, a, b, c, d, e, f = pcall(GetProfessions)
  if not ok then return nil end
  for j = 1, 6 do -- (not ipairs: the list has holes, e.g. no archaeology)
    local i = select(j, a, b, c, d, e, f)
    local ok2, n, _, _, max = pcall(GetProfessionInfo, i)
    if ok2 and n == name and type(max) == "number" and not ns.Secret(max) then return max end
  end
end

---------------------------------------------------------------------------
-- The unlock reveal (docs/mockups/gather-themes.html): under the banner, the new thing's icon drops in
-- dark, lights up with rings and glints, and a line says what's new: "You can now gather Briarthorn!",
-- or at a rank's cap "Fishing maxed: train Expert"
---------------------------------------------------------------------------
local reveal, revealIcon, revealBorder, revealLine, revealGlints, revealRings
local revealing -- { t0, color }
local REVEAL_AT, REVEAL_T = 0.95, 3.6
local STAR = "Interface\\Cooldown\\star4"
local RING = "Interface\\AddOns\\DopamineLoot\\Media\\Ring.tga"

local function CreateReveal()
  reveal = CreateFrame("Frame", nil, banner)
  reveal:SetSize(320, 80)
  reveal:SetPoint("TOP", banner, "BOTTOM", 0, -8)
  reveal:Hide()
  revealIcon = reveal:CreateTexture(nil, "ARTWORK")
  revealIcon:SetSize(44, 44)
  revealIcon:SetPoint("TOP", 0, 0)
  revealBorder = reveal:CreateTexture(nil, "OVERLAY")
  revealBorder:SetTexture(BORDER)
  revealBorder:SetAllPoints(revealIcon)
  revealLine = reveal:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  revealLine:SetPoint("TOP", revealIcon, "BOTTOM", 0, -8)
  revealRings, revealGlints = {}, {}
  for i = 1, 2 do
    local r = reveal:CreateTexture(nil, "OVERLAY", nil, 1)
    r:SetTexture(RING); r:SetBlendMode("ADD"); r:SetPoint("CENTER", revealIcon, "CENTER")
    revealRings[i] = r
  end
  for i = 1, 10 do
    local g = reveal:CreateTexture(nil, "OVERLAY", nil, 2)
    g:SetTexture(STAR); g:SetBlendMode("ADD")
    revealGlints[i] = { tex = g, dx = 0, dy = 0, d = 0 }
  end
end

local function StartReveal(icon, line, color)
  revealIcon:SetTexture(icon)
  revealLine:SetText(line)
  revealing = { color = color }
  for i, g in ipairs(revealGlints) do
    g.dx, g.dy, g.d = math.random(-55, 55), math.random(-30, 30), 0.5 + i * 0.04
    g.tex:SetVertexColor(color[1], color[2], color[3])
  end
  revealRings[1]:SetVertexColor(color[1], color[2], color[3])
  revealRings[2]:SetVertexColor(1, 0.96, 0.75)
  reveal:SetAlpha(0)
  reveal:Show()
end

-- t: seconds since the reveal began
local function AnimateReveal(t)
  if t < 0 then return end
  local c = revealing.color
  reveal:SetAlpha(math.min(1, t / 0.15, (REVEAL_T - t) / 0.4))
  local drop = t < 0.15 and (1 - t / 0.15) or 0
  revealIcon:ClearAllPoints()
  revealIcon:SetPoint("TOP", 0, 30 * drop)
  local pop = t < 0.15 and 0.6 + 0.48 * t / 0.15 or (t < 0.25 and 1.08 - 0.08 * (t - 0.15) / 0.1 or 1)
  revealIcon:SetSize(44 * pop, 44 * pop)
  local light = math.min(1, math.max(0, (t - 0.3) / 0.3)) -- dark, then lit
  revealIcon:SetVertexColor(light, light, light)
  revealBorder:SetVertexColor(c[1] * (0.3 + 0.7 * light), c[2] * (0.3 + 0.7 * light), c[3] * (0.3 + 0.7 * light))
  for i, r in ipairs(revealRings) do
    local u = (t - 0.6 - (i - 1) * 0.08) / (i == 1 and 0.7 or 0.5)
    if u > 0 and u < 1 then r:SetSize((i == 1 and 130 or 80) * (0.15 + 0.85 * u), (i == 1 and 130 or 80) * (0.15 + 0.85 * u)); r:SetAlpha(1 - u); r:Show()
    else r:Hide() end
  end
  for _, g in ipairs(revealGlints) do
    local u = (t - g.d) / 0.6
    if u > 0 and u < 1 then
      local s = 16 * math.sin(math.pi * math.min(1, u * 1.4))
      g.tex:ClearAllPoints(); g.tex:SetPoint("CENTER", revealIcon, "CENTER", g.dx, g.dy)
      g.tex:SetSize(math.max(0.1, s), math.max(0.1, s)); g.tex:SetAlpha(1 - u); g.tex:Show()
    else g.tex:Hide() end
  end
  if t >= REVEAL_T then reveal:Hide(); revealing = nil end
end

-- The bar sits under the title, moved left to make room when the next unlock's icon is at its end; the
-- note stays centered under the title, a little below the bar
function Layout(withIcon)
  local dx = withIcon and -13 or 0
  bar:ClearAllPoints(); bar:SetPoint("TOP", title, "BOTTOM", dx, 10)
  note:ClearAllPoints(); note:SetPoint("TOP", bar, "BOTTOM", -dx, -3)
end

local function Create()
  banner = CreateFrame("Frame", nil, UIParent)
  banner:SetSize(310, 74)
  banner:SetFrameStrata("FULLSCREEN_DIALOG") -- (a short banner; above the settings window for the test)
  banner:Hide()
  -- (docs/mockups/polish-r1.html, all six picked 2026-11-10: a soft shade so it reads on sunny ground,
  -- a stronger title glow, the bar centered unless the next unlock's icon sits at its end, room and an
  -- outline for the note; the bigger tools and the material touches are in SkillBar.lua)
  shade = banner:CreateTexture(nil, "BACKGROUND", nil, -8)
  shade:SetTexture("Interface\\AddOns\\DopamineLoot\\Media\\Glow.tga")
  shade:SetVertexColor(0, 0, 0)
  shade:SetPoint("CENTER", banner, "CENTER", 0, 2)
  shade:SetSize(400, 130)
  title = banner:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  title:SetPoint("TOP", 0, 0)
  title:SetTextColor(1, 1, 1) -- (the mockup: white, glowing in the profession's color)
  titleGlow = banner:CreateTexture(nil, "ARTWORK")
  titleGlow:SetTexture("Interface\\AddOns\\DopamineLoot\\Media\\Glow.tga")
  titleGlow:SetBlendMode("ADD")
  titleGlow:SetPoint("TOPLEFT", title, "TOPLEFT", -24, 12)
  titleGlow:SetPoint("BOTTOMRIGHT", title, "BOTTOMRIGHT", 24, -12)
  bar = ns.MakeSkillBar(banner) -- (its track sits 6 below the title; the tool rides above it; placed by Layout)
  unlock = banner:CreateTexture(nil, "ARTWORK")
  unlock:SetSize(20, 20)
  unlock:SetPoint("LEFT", bar.track, "RIGHT", 6, 0)
  unlockBorder = banner:CreateTexture(nil, "OVERLAY")
  unlockBorder:SetTexture(BORDER)
  unlockBorder:SetAllPoints(unlock)
  note = banner:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  local font, size = note:GetFont()
  if font then note:SetFont(font, size, "OUTLINE") end
  note:SetTextColor(0.94, 0.92, 0.86)
  Layout(false)
  recipeLine = banner:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  recipeLine:SetPoint("TOP", note, "BOTTOM", 0, -3)
  recipeLine:SetTextColor(0.85, 0.82, 0.72)
  CreateReveal()
  local function Animate(self, dt)
    showT = showT + dt
    local t = showT
    local life = revealing and REVEAL_AT + REVEAL_T or 2.9
    -- (the banner's own fade leaves the reveal, a child, at full strength until its own fade)
    self:SetAlpha(1)
    local own = math.min(1, t / 0.3, (life - t) / 0.4)
    shade:SetAlpha(own * flair * 0.55); title:SetAlpha(own); titleGlow:SetAlpha(own * flair * 0.8); bar:SetAlpha(own); note:SetAlpha(own); unlock:SetAlpha(own); unlockBorder:SetAlpha(own); recipeLine:SetAlpha(own)
    if showing then
      local u = math.min(1, math.max(0, (t - 0.3) / 0.7))
      bar:SetValue(showing.v0 + (showing.v1 - showing.v0) * (1 - (1 - u) ^ 3))
      if u >= 1 and not showing.tooled then showing.tooled = true; bar:PlayTool() end -- (the tool's motion as the fill lands)
    end
    if revealing then AnimateReveal(t - REVEAL_AT) end
    if t >= life then self:Hide(); reveal:Hide(); revealing = nil end
  end
  banner:SetScript("OnUpdate", Animate)
  ns.Mover.Register({ key = "skill", frame = banner, label = "Skill-ups", point = "TOP", x = 0, y = -150, w = 310, h = 74,
    preview = function(on)
      if on then -- a still sample while it's being placed
        banner:SetScript("OnUpdate", nil); banner:SetAlpha(1); banner:Show(); reveal:Hide(); revealing = nil
        title:SetAlpha(1); bar:SetAlpha(1); note:SetAlpha(1); unlock:SetAlpha(1); unlockBorder:SetAlpha(1)
        titleGlow:SetVertexColor(PROF.Herbalism.color[1], PROF.Herbalism.color[2], PROF.Herbalism.color[3]); titleGlow:SetAlpha(0.8); shade:SetAlpha(0.55); Layout(true)
        local p = PROF.Herbalism
        title:SetText("Herbalism |cff8ef07a64|r"); note:SetText("6 to Briarthorn"); recipeLine:SetText("")
        bar:SetProfession("Herbalism", p.color, p.light); bar:SetValue(0.7)
        if GetIcon then unlock:SetTexture(GetIcon(2450)); unlock:Show(); unlockBorder:Show() end
      else
        banner:Hide(); banner:SetScript("OnUpdate", Animate)
      end
    end })
end

-- Shows the banner: name (as the client says it), the new level. capped: this level is the rank's cap
-- (nil: ask the game). Reaching a new herb or ore, or a rank's cap, adds the unlock reveal.
function ns.ShowSkillUp(name, level, capped, recipeColor)
  if ns.settings.noSkillUp or not banner then return end
  if ns.Mover.IsUnlocked() then return end
  local p = PROF[name] or DEFAULT
  local from, to, icon, text = Next(name, level)
  local c, l = p.color, p.light
  revealing = nil
  reveal:Hide()
  local u, prev = Reached(name, level)
  if u then -- the bar fills up to the new herb or ore, then it's revealed
    from, to, icon = prev, level, GetIcon and GetIcon(u[2])
    text = "Unlocked!"
    StartReveal(icon, ("You can now gather |cffffffff%s|r!"):format(u[3]), l)
  else
    if capped == nil then local max = MaxRank(name); capped = max and max == level and max < 300 end
    if capped and RANKS[level] then
      from, to, text = level - 1, level, "Maxed for now"
      StartReveal(p.icon and GetIcon and GetIcon(p.icon) or "Interface\\Icons\\INV_Misc_Book_09",
        ("%s maxed: train |cffffffff%s|r"):format(name, RANKS[level]), l)
    end
  end
  title:SetText(("%s |cff%02x%02x%02x%d|r"):format(name, l[1] * 255, l[2] * 255, l[3] * 255, level))
  title:SetShadowColor(0, 0, 0, 1)
  titleGlow:SetVertexColor(c[1], c[2], c[3])
  -- the bar look (Professions page): Crafted, its material and tool, or Simple, a plain bar in its color with
  -- no glow, shade or next-unlock icon (a new herb or ore reached still gets its reveal)
  local simple = ns.settings.skillBarLook == "simple"
  flair = simple and 0 or 1
  bar:SetProfession(simple and "" or name, c, l)
  if simple and not u then icon = nil end
  note:SetText(text)
  recipeLine:SetText("")
  if p.craft then -- did the recipe just crafted change color? (it may update a moment after the skill)
    local r = ns.lastRecipe
    if recipeColor then recipeLine:SetText(recipeColor) -- (a test)
    elseif r and GetTime() - r.t < 15 and r.color and (not r.prof or r.prof == name) then
      local mine = shown + 1 -- (this banner, counted below)
      C_Timer.After(0.3, function()
        local now = ns.RecipeColor and ns.RecipeColor(r.id)
        if now and now > r.color and RECIPE[now] and banner:IsShown() and shown == mine then
          recipeLine:SetText(("|cffffffff%s|r is now %s"):format(r.name, RECIPE[now]))
        end
        r.color = now or r.color
      end)
    end
  end
  if icon then
    unlock:SetTexture(icon); unlock:Show()
    unlockBorder:SetVertexColor(l[1], l[2], l[3]); unlockBorder:Show()
  else unlock:Hide(); unlockBorder:Hide() end
  Layout(icon ~= nil)
  if p.craft and not u then from = 0 end -- (a crafting bar reads like the game's own: 78 / 150, not 3 / 75)
  local span = math.max(1, to - from)
  showing = { v0 = math.max(0, (level - 1 - from) / span), v1 = math.min(1, (level - from) / span) }
  bar:SetValue(showing.v0)
  showT = 0
  shown = shown + 1
  banner:SetAlpha(0)
  banner:Show()
  ns:PlaySkillUp()
  if revealing then C_Timer.After(REVEAL_AT + 0.55, function() if revealing then ns:PlayGatherFx("Unlock") end end) end
end

function ns:CHAT_MSG_SKILL(text)
  if self.Secret(text) or type(text) ~= "string" then return end
  pattern = pattern or Pattern()
  if not pattern then return end
  local name, level = text:match(pattern)
  level = tonumber(level)
  if name and level and IS_PROF[name] then ns.ShowSkillUp(name, level) end
end

ns.OnInit(function()
  Create()
  ns:RegisterEvents("CHAT_MSG_SKILL")
  C_Timer.After(6, LearnNames) -- the profession list can be empty for a few seconds after login
end)

-- Test (settings page): a skill-up for the gathering kind picked there
local NAMES = { herb = "Herbalism", ore = "Mining", fish = "Fishing", skin = "Skinning" }
local testLevel = {}
ns.AddAction("testskill", function(arg)
  local k, mode = arg:match("^(%a*)%s*(%a*)$")
  local name = NAMES[k] or "Herbalism"
  local level = (testLevel[name] or 63) + 1
  if mode == "unlock" then -- jump to the next unlock (or rank cap) and reach it
    local _, to = Next(name, level - 1)
    level = to
    testLevel[name] = level
    ns.ShowSkillUp(name, level, RANKS[level] ~= nil)
    return
  end
  testLevel[name] = level
  ns.ShowSkillUp(name, level, false)
end)

-- Test (Professions page, crafting): a skill-up for the crafting profession picked there; every other
-- press the recipe just crafted turns yellow, then green, then gray
local testRecipe = 0
local CRAFTS = { "Tailoring", "Leatherworking", "Alchemy", "Engineering", "Cooking", "Blacksmithing", "Enchanting", "First Aid",
  "Herbalism", "Mining", "Fishing", "Skinning" } -- (Show all: the gathering bars too)
ns.AddAction("testcraftskill", function(arg)
  if arg == "all" then -- every crafting bar in turn, each at a different level
    for i, n in ipairs(CRAFTS) do
      C_Timer.After((i - 1) * 3.2, function() testLevel[n] = math.random(20, 140); ns.ShowSkillUp(n, testLevel[n], false) end)
    end
    return
  end
  local name = PROF[arg] and PROF[arg].craft and arg or "Tailoring"
  local level = (testLevel[name] or 63) + 1
  testLevel[name] = level
  testRecipe = testRecipe % 6 + 1
  local line = testRecipe % 2 == 0 and ("|cffffffffTest recipe|r is now " .. RECIPE[testRecipe / 2]) or nil
  ns.ShowSkillUp(name, level, false, line)
end)

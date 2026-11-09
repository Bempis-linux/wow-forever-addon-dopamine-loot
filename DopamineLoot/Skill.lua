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
  Herbalism = { color = { 0.18, 0.62, 0.23 }, light = { 0.56, 0.94, 0.48 }, unlocks = {
    { 1, 2447, "Peacebloom" }, { 15, 2449, "Earthroot" }, { 50, 785, "Mageroyal" }, { 70, 2450, "Briarthorn" },
    { 85, 3820, "Stranglekelp" }, { 100, 2453, "Bruiseweed" }, { 115, 3355, "Wild Steelbloom" }, { 120, 3369, "Grave Moss" },
    { 125, 3356, "Kingsblood" }, { 150, 3357, "Liferoot" }, { 160, 3818, "Fadeleaf" }, { 170, 3821, "Goldthorn" },
    { 185, 3358, "Khadgar's Whisker" }, { 195, 3819, "Wintersbite" }, { 205, 4625, "Firebloom" }, { 210, 8831, "Purple Lotus" },
    { 220, 8836, "Arthas' Tears" }, { 230, 8838, "Sungrass" }, { 235, 8839, "Blindweed" }, { 245, 8845, "Ghost Mushroom" },
    { 250, 8846, "Gromsblood" }, { 260, 13464, "Golden Sansam" }, { 270, 13463, "Dreamfoil" }, { 280, 13465, "Mountain Silversage" },
    { 285, 13466, "Plaguebloom" }, { 290, 13467, "Icecap" }, { 300, 13468, "Black Lotus" } } },
  Mining = { color = { 0.78, 0.39, 0.16 }, light = { 1, 0.69, 0.44 }, unlocks = {
    { 1, 2770, "Copper Vein" }, { 65, 2771, "Tin Vein" }, { 75, 2775, "Silver Vein" }, { 125, 2772, "Iron Deposit" },
    { 155, 2776, "Gold Vein" }, { 175, 3858, "Mithril Deposit" }, { 230, 7911, "Truesilver Deposit" },
    { 245, 10620, "Small Thorium Vein" }, { 275, 10620, "Rich Thorium Vein" } } },
  Fishing = { color = { 0.16, 0.49, 1 }, light = { 0.54, 0.78, 1 } },
  Skinning = { color = { 0.6, 0.42, 0.23 }, light = { 0.88, 0.72, 0.5 } },
}
local DEFAULT = { color = { 0.85, 0.65, 0.13 }, light = { 1, 0.85, 0.4 } }
-- Professions (other skills such as weapons don't get a banner); localized names are added at login
local IS_PROF = { Herbalism = true, Mining = true, Skinning = true, Fishing = true, Alchemy = true, Blacksmithing = true,
  Enchanting = true, Engineering = true, Leatherworking = true, Tailoring = true, Cooking = true, ["First Aid"] = true,
  Jewelcrafting = true, Inscription = true }

local banner, title, bar, fill, unlock, unlockBorder, note
local pattern
local showT, showing

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
  for _, i in ipairs({ a, b, c, d, e, f }) do
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

local function Create()
  banner = CreateFrame("Frame", nil, UIParent)
  banner:SetSize(260, 56)
  banner:SetFrameStrata("FULLSCREEN_DIALOG") -- (a short banner; above the settings window for the test)
  banner:Hide()
  title = banner:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  title:SetPoint("TOP", 0, 0)
  bar = CreateFrame("StatusBar", nil, banner)
  bar:SetSize(200, 7)
  bar:SetPoint("TOP", title, "BOTTOM", -12, -6)
  bar:SetStatusBarTexture("Interface\\TargetingFrame\\UI-StatusBar")
  bar:SetMinMaxValues(0, 1)
  local bg = bar:CreateTexture(nil, "BACKGROUND")
  bg:SetPoint("TOPLEFT", -1, 1)
  bg:SetPoint("BOTTOMRIGHT", 1, -1)
  bg:SetColorTexture(0, 0, 0, 0.6)
  fill = bar:GetStatusBarTexture()
  unlock = banner:CreateTexture(nil, "ARTWORK")
  unlock:SetSize(20, 20)
  unlock:SetPoint("LEFT", bar, "RIGHT", 6, 0)
  unlockBorder = banner:CreateTexture(nil, "OVERLAY")
  unlockBorder:SetTexture(BORDER)
  unlockBorder:SetAllPoints(unlock)
  note = banner:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  note:SetPoint("TOP", bar, "BOTTOM", 12, -4)
  note:SetTextColor(0.85, 0.82, 0.72)
  local function Animate(self, dt)
    showT = showT + dt
    local t = showT
    self:SetAlpha(math.min(1, t / 0.3, (2.9 - t) / 0.4))
    if showing then
      local u = math.min(1, math.max(0, (t - 0.3) / 0.7))
      bar:SetValue(showing.v0 + (showing.v1 - showing.v0) * (1 - (1 - u) ^ 3))
    end
    if t >= 2.9 then self:Hide() end
  end
  banner:SetScript("OnUpdate", Animate)
  ns.Mover.Register({ key = "skill", frame = banner, label = "Skill-ups", point = "TOP", x = 0, y = -150, w = 260, h = 56,
    preview = function(on)
      if on then -- a still sample while it's being placed
        banner:SetScript("OnUpdate", nil); banner:SetAlpha(1); banner:Show()
        local c = PROF.Herbalism.color
        title:SetText("Herbalism |cff8ef07a64|r"); note:SetText("6 to Briarthorn"); bar:SetValue(0.7)
        bar:SetStatusBarColor(c[1], c[2], c[3])
        if GetIcon then unlock:SetTexture(GetIcon(2450)); unlock:Show(); unlockBorder:Show() end
      else
        banner:Hide(); banner:SetScript("OnUpdate", Animate)
      end
    end })
end

-- Shows the banner: name (as the client says it), the new level
function ns.ShowSkillUp(name, level)
  if ns.settings.noSkillUp or not banner then return end
  if ns.Mover.IsUnlocked() then return end
  local p = PROF[name] or DEFAULT
  local from, to, icon, text = Next(name, level)
  local c, l = p.color, p.light
  title:SetText(("%s |cff%02x%02x%02x%d|r"):format(name, l[1] * 255, l[2] * 255, l[3] * 255, level))
  title:SetShadowColor(c[1], c[2], c[3], 0.9)
  fill:SetVertexColor(c[1], c[2], c[3])
  bar:SetStatusBarColor(c[1], c[2], c[3])
  note:SetText(text)
  if icon then
    unlock:SetTexture(icon); unlock:Show()
    unlockBorder:SetVertexColor(l[1], l[2], l[3]); unlockBorder:Show()
  else unlock:Hide(); unlockBorder:Hide() end
  local span = math.max(1, to - from)
  showing = { v0 = math.max(0, (level - 1 - from) / span), v1 = math.min(1, (level - from) / span) }
  bar:SetValue(showing.v0)
  showT = 0
  banner:SetAlpha(0)
  banner:Show()
  ns:PlaySkillUp()
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
  local name = NAMES[arg] or "Herbalism"
  testLevel[name] = (testLevel[name] or 63) + 1
  ns.ShowSkillUp(name, testLevel[name])
end)

-- Dopamine Loot "Loot rain effects" settings page (Options > AddOns > Dopamine Loot > Loot rain
-- effects): a switch for every flourish in ns.RAIN_FX (Rain.lua), in two columns, and a test rain.
-- Also /dl rainfx.
local _, ns = ...

local panel, sub

local function Create()
  local UI = ns.UI
  panel = CreateFrame("Frame")
  panel:Hide() -- the Settings window shows it, so OnShow refills the fields on every open
  panel.name = "Loot rain effects"

  local title = UI.Label(panel, "GameFontNormalLarge", "Loot rain effects")
  title:SetPoint("TOPLEFT", 16, -16)
  local intro = UI.Label(panel, "GameFontHighlightSmall",
    "Turn each part of the loot rain on or off, then press Test to watch it.")
  intro:SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -6)

  local half = math.ceil(#ns.RAIN_FX / 2)
  local colTop, last = {}, nil
  for i, fx in ipairs(ns.RAIN_FX) do
    local cb = UI.Toggle(panel, fx.label, "noRain" .. fx.key, fx.tip .. " (/dl rainfx " .. fx.word .. " off)")
    if i == 1 then
      cb:SetPoint("TOPLEFT", intro, "BOTTOMLEFT", 0, -14)
      colTop[1] = cb
    elseif i == half + 1 then
      cb:SetPoint("TOPLEFT", colTop[1], "TOPLEFT", 300, 0)
    else
      cb:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 0, 2)
    end
    if i == half then colTop.bottom = cb end
    last = cb
  end

  local testLabel = UI.Label(panel, "GameFontHighlight", "Test with")
  testLabel:SetPoint("TOPLEFT", colTop.bottom, "BOTTOMLEFT", 4, -18)
  local testBox = UI.NumberBox(panel, 36, function() return ns.settings.testRain or 8 end,
    function(v) ns.settings.testRain = math.floor(v) end, 1, 60,
    "How many items the test rain drops (1 to 60). From 4 one is blue, from 8 one is purple, from 12 one is orange; some money too.")
  testBox:SetPoint("LEFT", testLabel, "RIGHT", 10, 0)
  local testAfter = UI.Label(panel, "GameFontHighlight", "items")
  testAfter:SetPoint("LEFT", testBox, "RIGHT", 8, 0)
  local test = UI.Button(panel, "Test", 56, function()
    testBox:ClearFocus() -- keeps a number typed without pressing Enter
    ns.RunCommand("rain", tostring(ns.settings.testRain or 8))
  end)
  test:SetPoint("LEFT", testAfter, "RIGHT", 10, 0)
  -- coin rains of a few sizes (/dl testcoins) and a quest reward (/dl testquest)
  local coinLabel = UI.Label(panel, "GameFontHighlight", "Test money")
  coinLabel:SetPoint("TOPLEFT", testLabel, "BOTTOMLEFT", 0, -18)
  local prev = coinLabel
  for _, amount in ipairs({ "54c", "35s 20c", "2g 35s", "25g" }) do
    local b = UI.Button(panel, amount, 70, function() ns.RunCommand("testcoins", amount) end)
    b:SetPoint("LEFT", prev, "RIGHT", prev == coinLabel and 10 or 4, 0)
    UI.Tip(b, "Rain " .. amount .. " as coins (/dl testcoins " .. amount .. ").")
    prev = b
  end
  local quest = UI.Button(panel, "Test quest reward", 150, function() ns.RunCommand("testquest") end)
  quest:SetPoint("TOPLEFT", coinLabel, "BOTTOMLEFT", -4, -14)
  UI.Tip(quest, "An item and some money, rained together the way a quest turn-in plays (/dl testquest).")

  -- where the loot flies from (/dl rainfrom)
  local fromLabel = UI.Label(panel, "GameFontHighlightSmall", "Loot flies from:")
  fromLabel:SetPoint("TOPLEFT", quest, "BOTTOMLEFT", 4, -16)
  local fromTips = {
    ground = "A fountain from the middle of the ground (where items land).",
    spread = "Items shoot up from anywhere along the middle of the ground; the best one from the middle.",
    below = "From just under the bottom edge of the screen.",
    middle = "From the middle of the screen, as the first versions did.",
  }
  local fromOptions = {}
  for _, v in ipairs(ns.RainCore.FROM) do
    fromOptions[#fromOptions + 1] = { value = v, label = ns.FROM_NAMES[v] .. (v == "ground" and " (default)" or ""),
      tip = fromTips[v] .. " (/dl rainfrom " .. v .. ")" }
  end
  local fromLast = UI.Choice(panel, fromOptions, function() return ns.settings.rainFrom or "ground" end,
    function(v) ns.settings.rainFrom = v ~= "ground" and v or nil end, fromLabel)

  -- the burst's sound (/dl opensound), in the second column beside it
  local openLabel = UI.Label(panel, "GameFontHighlightSmall", "Sound as the loot bursts out:")
  openLabel:SetPoint("TOPLEFT", fromLabel, "TOPLEFT", 296, 0)
  UI.Choice(panel, {
    { value = "size", label = "By haul size (recommended)",
      tip = "A few grays, whites or greens: no sound; 6 items or 1 gold: a soft pop; something Rare or better: a big burst." },
    { value = "always", label = "Always the big sound", tip = "Every rain starts with the big game sound." },
    { value = "never", label = "Never", tip = "No burst sound; the items and coins still whoosh as they fly." },
  }, function() return ns.settings.openSound or "size" end, function(v) ns.settings.openSound = v end, openLabel)

  local back = UI.Button(panel, "Main settings", 120, function() ns:OpenSettings() end)
  back:SetPoint("TOPLEFT", fromLast, "BOTTOMLEFT", 0, -14)

  panel:SetScript("OnShow", function() UI.Refresh() end)
  UI.Refresh() -- sub-pages may not get OnShow on their first open: fill the switches now

  if Settings.RegisterCanvasLayoutSubcategory and ns.settingsCategory then
    sub = Settings.RegisterCanvasLayoutSubcategory(ns.settingsCategory, panel, "Loot rain effects")
  else -- no subcategories: its own entry
    sub = Settings.RegisterCanvasLayoutCategory(panel, ns.TITLE .. " - Loot rain effects")
    Settings.RegisterAddOnCategory(sub)
  end
end

function ns:OpenRainFx()
  if not panel then Create() end
  Settings.OpenToCategory(sub:GetID())
end

ns.OnInit(function() if not panel then Create() end end)

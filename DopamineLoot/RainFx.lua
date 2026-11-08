-- Dopamine Loot "Loot rain" settings page (Options > AddOns > Dopamine Loot > Loot rain; a
-- plain page built with ns.Native in Settings.lua): when it rains, where the loot flies from and lands,
-- what happens afterwards, every effect switch from ns.RAIN_FX (Rain.lua) in groups, and tests.
local _, ns = ...

local sub

-- The effect switches by group (keys from ns.RAIN_FX); Gather and Escape are under "Afterwards"
local GROUPS = {
  { "Effects: movement", { "Best", "Windup", "Hang", "Escalate", "Hitstop", "Spacing" } },
  { "Effects: light and dust", { "Beam", "Landings", "Trails", "Shadows", "Ground", "Dust", "Pulse", "Names", "Poor" } },
  { "Effects: money", { "Coins", "Merge", "Twinkle" } },
}

local function FxToggle(cat, key)
  for _, fx in ipairs(ns.RAIN_FX) do
    if fx.key == key then
      ns.Native.Toggle(cat, "noRain" .. key, fx.label, fx.tip, true)
    end
  end
end

local function Money(copper)
  if copper == 0 then return "any amount" end
  return ns.MoneyName(copper)
end
local COIN_STEPS = { 0, 1000, 5000, 10000, 50000, 100000, 500000 }

local function Create()
  local N = ns.Native
  local cat, layout = N.Page("Loot rain", ns.settingsCategory)
  sub = cat

  N.Header(layout, "When")
  N.Slider(cat, "rainMin", "Rain from", 2, 20, 1, 3,
    "How many items looted at once start a loot rain (default 3). Fewer items show as popups instead.",
    function(v) return math.floor(v + 0.5) .. " items" end)
  N.Choice(cat, "coinRainMin", "Money rain from", function()
    local list = {}
    for _, c in ipairs(COIN_STEPS) do list[#list + 1] = { c, Money(c) .. (c == 10000 and " (default)" or "") } end
    local cur = ns.CoinRainMin()
    local listed = false
    for _, c in ipairs(COIN_STEPS) do if c == cur then listed = true end end
    if not listed then list[#list + 1] = { cur, Money(cur) } end
    return list
  end, 10000, "Money you loot rains as coins on its own (even without enough items for a rain) when it's at least this much. Quest reward money always rains.")
  N.Choice(cat, "rainAlways", "Always rain for", {
    { false, "Off (default)" }, { 2, "|cff1eff00Uncommon|r and up" }, { 3, "|cff0070ddRare|r and up" },
    { 4, "|cffa335eeEpic|r and up" }, { 5, "|cffff8000Legendary|r" },
  }, false, "Loot with an item of this rarity or better always rains, even a single item, so it gets the full show (its hang, comet and landing). Off: only enough items or money make it rain.")
  N.Choice(cat, "rainMinQuality", "Rain includes", {
    { 0, "Everything (default)" }, { 1, "|cffffffffCommon|r and up" }, { 2, "|cff1eff00Uncommon|r and up" },
    { 3, "|cff0070ddRare|r and up" },
  }, 0, "The lowest rarity that counts for the loot rain and flies in it. Everything (default) rains your gray and white loot too. Popups have their own setting: Show popups for, on the Popups page.")
  FxToggle(cat, "Calm")

  N.Header(layout, "How it comes out")
  ns.RainStyle() -- (moves an old Waterfall setting over to the Geyser before the choice reads it)
  local styles, tips = {}, {}
  for _, s in ipairs(ns.RAIN_STYLES) do
    styles[#styles + 1] = { s.key, s.label }
    tips[#tips + 1] = s.label:gsub(" %(default%)", "") .. ": " .. s.tip
  end
  N.Choice(cat, "rainStyle", "Animation", styles, "fountain", table.concat(tips, "\n\n"))

  N.Header(layout, "Where")
  local from = {}
  for _, v in ipairs(ns.RainCore.FROM) do
    from[#from + 1] = { v, ns.FROM_NAMES[v]:gsub("^%l", string.upper) .. (v == "ground" and " (default)" or "") }
  end
  N.Choice(cat, "rainFrom", "Loot comes from", from, "ground",
    "Where the loot shoots up from: the middle of the ground like a fountain, anywhere along the ground, from below the bottom of the screen, or the middle of the screen. (For the Fountain animation; the others have their own.)")
  N.Slider(cat, "rainFloor", "Landing height", 0, 30, 1, 0,
    "Where the loot lands, in percent of the screen height up from the bottom (0 = the bottom edge, the default). Raise it to have the loot land above your action bars.",
    function(v) return math.floor(v + 0.5) .. "%" end)

  N.Header(layout, "Afterwards")
  N.Choice(cat, "stayQuality", "Become popups", {
    { 2, "|cff1eff00Uncommon|r and up" }, { 3, "|cff0070ddRare|r and up (default)" }, { 4, "|cffa335eeEpic|r and up" },
  }, 3, "When the rain is over, items of this rarity and better become popups; the rest go into your bag.")
  FxToggle(cat, "Gather")
  N.Toggle(cat, "rainChord", "Chord at the end",
    "The rain ends on a soft chord once the last item is in your bag (off by default).")
  FxToggle(cat, "Escape")

  for _, g in ipairs(GROUPS) do
    N.Header(layout, g[1])
    for _, key in ipairs(g[2]) do FxToggle(cat, key) end
  end

  N.Header(layout, "Test")
  N.Slider(cat, "testRain", "Test rain size", 1, 60, 1, 8,
    "How many items the test rain drops: the best one (picked below) and lower items from your bags, with some money.",
    function(v) return math.floor(v + 0.5) .. " items" end)
  N.Choice(cat, "testRainBest", "Test rain's best item", {
    { 2, "|cff1eff00Uncommon|r" }, { 3, "|cff0070ddRare|r" }, { 4, "|cffa335eeEpic|r (default)" }, { 5, "|cffff8000Legendary|r" },
  }, 4, "The rarity of the best item in the test rain, so you can see each one's hang, fall and landing. The other items are always lower.")
  N.Button(layout, "Rain test items", "Test rain", function() ns.RunAction("rain", tostring(ns.settings.testRain or 8)) end,
    "Rains the number of test items set above.")
  N.Choice(cat, "testMoney", "Test money amount", {
    { "54c", "54c" }, { "35s 20c", "35s 20c" }, { "2g 35s", "2g 35s (default)" }, { "25g", "25g" },
  }, "2g 35s", "How much money the Test money button rains.")
  N.Button(layout, "Rain test money", "Test money", function() ns.RunAction("testcoins", ns.settings.testMoney or "2g 35s") end,
    "Rains the amount set above as coins.")
  N.Button(layout, "Simulate a quest reward", "Test reward", function() ns.RunAction("testquest") end,
    "An item and some money rained together, the way finishing a quest plays.")
end

function ns:OpenRainFx()
  if not sub then Create() end
  Settings.OpenToCategory(sub:GetID())
end

ns.OnInit(function() if not sub then Create() end end)

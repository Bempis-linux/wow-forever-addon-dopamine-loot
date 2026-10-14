-- Dopamine Loot "Loot rain" settings page (Options > AddOns > Dopamine Loot > Loot rain; the game's
-- native layout, ns.Native in Settings.lua): when it rains, where the loot flies from and lands,
-- what happens afterwards, every effect switch from ns.RAIN_FX (Rain.lua) in groups, and tests.
local _, ns = ...

local sub

-- The effect switches by group (keys from ns.RAIN_FX); Gather and Escape are under "Afterwards"
local GROUPS = {
  { "Effects: motion", { "Best", "Escalate", "Hitstop", "Spacing" } },
  { "Effects: light", { "Beam", "Trails", "Shadows", "Dust", "Pulse", "Names" } },
  { "Effects: money", { "Coins", "Merge" } },
}

local function FxToggle(cat, key)
  for _, fx in ipairs(ns.RAIN_FX) do
    if fx.key == key then
      ns.Native.Toggle(cat, "noRain" .. key, fx.label, fx.tip .. " (/dl rainfx " .. fx.word .. " off)", true)
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
  N.Slider(cat, "rainMin", "Rain from (items)", 2, 20, 1, 3,
    "How many items looted together make it rain (default 3). Fewer get popups.",
    function(v) return math.floor(v + 0.5) .. " items" end)
  N.Choice(cat, "coinRainMin", "Money alone rains from", function()
    local list = {}
    for _, c in ipairs(COIN_STEPS) do list[#list + 1] = { c, Money(c) .. (c == 10000 and " (default)" or "") } end
    local cur = ns.CoinRainMin() -- a custom amount from /dl coinrain shows too
    local listed = false
    for _, c in ipairs(COIN_STEPS) do if c == cur then listed = true end end
    if not listed then list[#list + 1] = { cur, Money(cur) } end
    return list
  end, 10000, "Money looted from a corpse rains as coins on its own (even with few items) from this much. Quest money always rains. Also /dl coinrain 1g.")

  N.Header(layout, "Where")
  local from = {}
  for _, v in ipairs(ns.RainCore.FROM) do
    from[#from + 1] = { v, ns.FROM_NAMES[v]:gsub("^%l", string.upper) .. (v == "ground" and " (default)" or "") }
  end
  N.Choice(cat, "rainFrom", "Loot flies from", from, "ground",
    "Where the loot shoots up from: the middle of the ground like a fountain, anywhere along the ground, from just under the bottom edge, or the middle of the screen. Also /dl rainfrom.")
  N.Slider(cat, "rainFloor", "Landing height", 0, 30, 1, 0,
    "Where the loot lands, as a percent of the screen height up from the bottom (0 = the bottom edge; raise it to land above your action bars).",
    function(v) return math.floor(v + 0.5) .. "%" end)

  N.Header(layout, "Afterwards")
  N.Choice(cat, "stayQuality", "Stay as popups", {
    { 2, "|cff1eff00Uncommon|r and up" }, { 3, "|cff0070ddRare|r and up (default)" }, { 4, "|cffa335eeEpic|r and up" },
  }, 3, "When the rain settles, items of this quality and better become popups; the rest go to your bag.")
  FxToggle(cat, "Gather")
  FxToggle(cat, "Escape")

  for _, g in ipairs(GROUPS) do
    N.Header(layout, g[1])
    for _, key in ipairs(g[2]) do FxToggle(cat, key) end
  end

  N.Header(layout, "Test")
  N.Slider(cat, "testRain", "Test rain size (items)", 1, 60, 1, 8,
    "How many items the test rain drops. From 4 one is blue, from 8 one is purple, from 12 one is orange; some money too.",
    function(v) return math.floor(v + 0.5) .. " items" end)
  N.Button(layout, "Rain the test items", "Test rain", function() ns.RunCommand("rain", tostring(ns.settings.testRain or 8)) end,
    "Rain that many test items (/dl rain 8).")
  N.Choice(cat, "testMoney", "Test money amount", {
    { "54c", "54c" }, { "35s 20c", "35s 20c" }, { "2g 35s", "2g 35s (default)" }, { "25g", "25g" },
  }, "2g 35s", "How much money the Test money button rains.")
  N.Button(layout, "Rain the test money", "Test money", function() ns.RunCommand("testcoins", ns.settings.testMoney or "2g 35s") end,
    "Rain that amount as coins (/dl testcoins 2g 35s).")
  N.Button(layout, "A quest reward", "Test reward", function() ns.RunCommand("testquest") end,
    "An item and some money, rained together the way a quest turn-in plays (/dl testquest).")
end

function ns:OpenRainFx()
  if not sub then Create() end
  Settings.OpenToCategory(sub:GetID())
end

ns.OnInit(function() if not sub then Create() end end)

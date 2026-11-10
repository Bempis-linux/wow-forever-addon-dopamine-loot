-- Dopamine Loot feed: your "You receive loot/item" chat lines -> item data -> a popup.
-- CHAT_MSG_LOOT self lines are the only record source (plan: one stream, no double counting).
-- Vendor purchases ("You receive item" while a merchant is open) are tagged "bought" and skipped.
local _, ns = ...
local M = ns.LootMsg

local patterns = {}
local merchantOpen = false
local GetInfo = (C_Item and C_Item.GetItemInfo) or GetItemInfo
local GetInfoInstant = (C_Item and C_Item.GetItemInfoInstant) or GetItemInfoInstant

local QUALITY_WORDS = {
  poor = 0, gray = 0, grey = 0, junk = 0, common = 1, white = 1, uncommon = 2, green = 2,
  rare = 3, blue = 3, epic = 4, purple = 4, legendary = 5, orange = 5,
}
-- preview items for qualities you may not have in your bags (well-known Classic items)
local TEST_IDS = { -- well-known Classic items by rarity (tests check each one's rarity and that it exists)
  [2] = { 15211, 1219, 2011 },          -- Militant Shortsword, Redridge Machete, Twisted Sabre
  [3] = { 5191, 7230, 2205 },           -- Cruel Barb, Smite's Mighty Hammer, Duskbringer
  [4] = { 12784, 811, 2244, 1728 },     -- Arcanite Reaper, Axe of the Deep Woods, Krol Blade, Teebu's Blazing Longsword
  [5] = { 19019, 17182 },               -- Thunderfury, Sulfuras
}

-- Two filters: the lowest rarity that gets a popup (setting minQuality, default Uncommon, Popups
-- page) and the lowest that rains (rainMinQuality, default Poor: everything, Loot rain page)
function ns.MinQuality() return ns.settings.minQuality or 2 end
function ns.RainMinQuality() return ns.settings.rainMinQuality or 0 end
local function WantsPopup(q) return not ns.settings.noPopup and q >= ns.MinQuality() end
local function WantsRain(q) return not ns.settings.noRain and q >= ns.RainMinQuality() end

local function TypeText(equipLoc, itemType, subType, classID)
  local slot = equipLoc and equipLoc ~= "" and _G[equipLoc] or nil
  if classID == 2 then return subType end                        -- weapons: "Two-Handed Swords"
  if slot and subType and subType ~= "" and subType ~= slot and classID == 4 then
    return subType .. " " .. slot                                -- armor: "Plate Head"
  end
  return slot or subType or itemType
end

-- Item data for a popup (calls fn once the client has the item's info cached)
function ns.ItemData(item, count, src, fn)
  local function Build()
    local name, link, quality, ilvl, _, itemType, subType, _, equipLoc, icon = GetInfo(item)
    if not name then return nil end
    local classID = GetInfoInstant and select(6, GetInfoInstant(item))
    if type(item) == "string" and item:find("|Hitem:", 1, true) then link = item end -- keep the exact link
    return {
      link = link, id = M.ItemID(link), count = count or 1, quality = quality, name = name, icon = icon,
      equipLoc = equipLoc, ilvl = ilvl, typeText = TypeText(equipLoc, itemType, subType, classID), src = src, classID = classID,
    }
  end
  local d = Build()
  if d then return fn(d) end
  local obj
  if Item and type(item) == "number" and Item.CreateFromItemID then obj = Item:CreateFromItemID(item)
  elseif Item and type(item) == "string" and Item.CreateFromItemLink then obj = Item:CreateFromItemLink(item) end
  -- an item ID that doesn't exist makes ContinueOnItemLoad raise an error: then nothing shows
  if obj and obj.ContinueOnItemLoad then
    pcall(obj.ContinueOnItemLoad, obj, function() local d2 = Build(); if d2 then fn(d2) end end)
  else
    C_Timer.After(0.5, function() local d2 = Build(); if d2 then fn(d2) end end)
  end
end

ns.OnInit(function()
  patterns = M.Build(_G)
  ns:RegisterEvents("CHAT_MSG_LOOT", "MERCHANT_SHOW", "MERCHANT_CLOSED")
end)

function ns:MERCHANT_SHOW() merchantOpen = true end
function ns:MERCHANT_CLOSED() merchantOpen = false end

function ns:CHAT_MSG_LOOT(text, _, _, _, _, _, _, _, _, _, _, guid)
  if self.Secret(text) then return end -- hidden loot line (secret value)
  local isSelf = not self.Secret(guid) and guid ~= nil and guid == UnitGUID("player")
  local link, count, src = M.Parse(text, patterns, isSelf)
  if not link then return end
  if src == "pushed" and merchantOpen then src = "bought" end
  -- the item going into your bags, for the bulging bag's drop-in (Bag.lua): known at once from the link
  local icon = GetInfoInstant and select(5, GetInfoInstant(link))
  if icon then ns.lastLootIcon, ns.lastLootT = icon, GetTime() end
  -- a gather (Gather.lua) goes to the harvest tally instead of the rain; Uncommon+ finds still pop up
  if self.settings.enabled == false then return end
  local gather, gatherId, gx, gy
  if src == "loot" and ns.GatherKind then gather, gatherId, gx, gy = ns.GatherKind() end
  if gather then
    ns.ItemData(link, count, src, function(d)
      ns.Gathered(d, gather, gatherId, gx, gy)
      if WantsPopup(d.quality or 0) and d.quality >= 2 then -- after the rare burst's finale
        local wait = ns.GatherRareDelay and ns.GatherRareDelay(gather) or 0
        if wait > 0 then C_Timer.After(wait, function() ns:ShowLoot(d) end) else ns:ShowLoot(d) end
      end
    end)
    return
  end
  -- something you crafted (Craft.lua): no popup, no rain; it joins the Crafted row once the batch is done
  -- (before the check below: the list still shows crafts with popups and rain both off)
  if src == "created" and ns.CraftTakes and self.settings.enabled ~= false then
    ns.ItemData(link, count, src, function(d)
      if not ns.CraftTakes(d) and not (self.settings.noPopup and self.settings.noRain) then ns.Collect(d) end
    end)
    return
  end
  if (self.settings.noPopup and self.settings.noRain) or self.settings.enabled == false or src == "bought" then return end
  ns.ItemData(link, count, src, function(d)
    local q = d.quality or 0
    if WantsPopup(q) or WantsRain(q) then ns.Collect(d) end -- the burst sorts out which below
  end)
end

---------------------------------------------------------------------------
-- Bursts: loot that arrives together (one loot window, one turn-in) is collected for a moment
-- (0.4 s after the last item, 2 s at most). 3+ items (setting) rain; so does money: always from a
-- quest turn-in, from loot once it reaches the "money rains from" amount (setting, default 1 gold).
-- Otherwise items get popups. A rain looted mid-fight waits and plays when combat ends (small
-- ones pop up right away).
---------------------------------------------------------------------------
local RAIN_MIN, QUIET, MAX_WAIT, COIN_RAIN_MIN = 3, 0.4, 2, 10000
local burst, burstStart, gen = nil, 0, 0
local afterCombat = {} -- rains looted mid-fight, played together when combat ends

function ns.RainMin() return ns.settings.rainMin or RAIN_MIN end
function ns.CoinRainMin() return ns.settings.coinRainMin or COIN_RAIN_MIN end

-- items: the burst's item data; items.copper: money that came with them; items.quest: a turn-in
local function Rains(items)
  if ns.settings.noRain then return false end
  if #items >= ns.RainMin() then return true end
  -- an item of this rarity or better always rains, even alone (setting rainAlways; off by default)
  local always = ns.settings.rainAlways
  if always then
    for _, d in ipairs(items) do if (d.quality or 0) >= always then return true end end
  end
  local copper = items.copper or 0
  if copper <= 0 or ns.settings.noRainCoins then return false end
  return items.quest or copper >= ns.CoinRainMin()
end

-- The part of a burst that rains: the items at or above the rain's rarity (and its money)
local function RainPart(items)
  local part = { copper = items.copper, quest = items.quest }
  for _, d in ipairs(items) do if WantsRain(d.quality or 0) then part[#part + 1] = d end end
  return part
end

-- It rains (the rain's items; what stays after it becomes popups, Loot rain page), or each item at
-- or above the popups' rarity gets a popup. Items that don't rain (below the rain's rarity) still
-- get their popup when it rains.
local function Play(items)
  local part = RainPart(items)
  local rained = Rains(part)
  if rained then ns:Rain(part, items.copper) end
  local best = 0 -- each popup knows the best it was looted with (an Uncommon beside a Rare goes compact)
  for _, d in ipairs(items) do best = math.max(best, d.quality or 0) end
  for _, d in ipairs(items) do
    local q = d.quality or 0
    if WantsPopup(q) and not (rained and WantsRain(q)) then d.burstBest = best; ns:ShowLoot(d) end
  end
end

local function FlushBurst()
  local items = burst
  burst = nil
  if not items then return end
  if InCombatLockdown() and Rains(RainPart(items)) then
    for _, d in ipairs(items) do afterCombat[#afterCombat + 1] = d end
    afterCombat.copper = (afterCombat.copper or 0) + (items.copper or 0)
    afterCombat.quest = afterCombat.quest or items.quest
    return
  end
  Play(items)
end

function ns:PLAYER_REGEN_ENABLED()
  if ns.openAfterCombat then ns.openAfterCombat = nil; ns:OpenSettings() end -- (/dl during the fight)
  if ns.PopupsAfterCombat then ns.PopupsAfterCombat() end
  if #afterCombat == 0 and not afterCombat.copper then return end
  local items = afterCombat
  afterCombat = {}
  C_Timer.After(0.5, function() Play(items) end)
end
ns.OnInit(function() ns:RegisterEvents("PLAYER_REGEN_ENABLED") end)

-- Add to the burst being collected (or start one), and flush it once loot stops arriving
local function Burst()
  if not burst then burst, burstStart = {}, GetTime() end
  gen = gen + 1
  local my = gen
  local wait = math.max(0, math.min(QUIET, burstStart + MAX_WAIT - GetTime()))
  C_Timer.After(wait, function() if my == gen then FlushBurst() end end)
  return burst
end

-- Loot and quest windows: money (and items) that arrive while one is open, or within a second of
-- it closing, belong to it. A quest's reward window is QUEST_COMPLETE until QUEST_FINISHED.
local lootOpen, lootClosedAt, questOpen, questClosedAt, money = false, 0, false, 0, nil
local function InQuest() return questOpen or GetTime() - questClosedAt <= 1 end
local function InLoot() return lootOpen or GetTime() - lootClosedAt <= 1 end

function ns.Collect(d)
  if ns.settings.noRain then return ns:ShowLoot(d) end -- nothing to collect for
  local b = Burst()
  b[#b + 1] = d
  if InQuest() then b.quest = true end
end

-- Money: the gain in your gold during a loot or quest window joins the burst. Read from GetMoney,
-- so no money line is parsed; vendor sales and mail don't count. The baseline is taken when a
-- window opens (in the world, so it's never the 0 from before login).
function ns:LOOT_OPENED() lootOpen, money = true, GetMoney() end
function ns:LOOT_CLOSED() lootOpen, lootClosedAt = false, GetTime() end
function ns:QUEST_COMPLETE() questOpen, money = true, GetMoney() end
function ns:QUEST_FINISHED() if questOpen then questOpen, questClosedAt = false, GetTime() end end
function ns:PLAYER_ENTERING_WORLD() money = GetMoney() end -- in the world: the real amount
local unclaimed, unclaimedAt = 0, 0 -- a gain outside any window, in case a turn-in claims it
-- the server's own turn-in (also for quests that skip the reward window): its second opens now
function ns:QUEST_TURNED_IN(_, _, moneyReward)
  questClosedAt = GetTime()
  -- its money may have come just before this event, with no window open: claim it now
  if (moneyReward or 0) > 0 and unclaimed > 0 and GetTime() - unclaimedAt <= 1 and not ns.settings.noRain then
    local b = Burst()
    b.copper, b.quest = (b.copper or 0) + unclaimed, true
  end
  unclaimed = 0
end
function ns:PLAYER_MONEY()
  local now = GetMoney()
  local gain = money and now - money or 0
  money = now
  if gain <= 0 or ns.settings.noRain or merchantOpen then return end
  local quest = InQuest()
  if not quest and not InLoot() then unclaimed, unclaimedAt = gain, GetTime(); return end
  local b = Burst()
  b.copper = (b.copper or 0) + gain
  if quest then b.quest = true end
end
ns.OnInit(function()
  ns:RegisterEvents("LOOT_OPENED", "LOOT_CLOSED", "QUEST_COMPLETE", "QUEST_FINISHED", "QUEST_TURNED_IN",
    "PLAYER_MONEY", "PLAYER_ENTERING_WORLD")
end)

---------------------------------------------------------------------------
-- Test actions (the settings pages' Test buttons)
---------------------------------------------------------------------------
-- Every item link in your bags and on you
local function ForEachOwn(fn)
  for slot = 1, 19 do
    local link = GetInventoryItemLink("player", slot)
    if link then fn(link) end
  end
  local NumSlots = C_Container and C_Container.GetContainerNumSlots or _G.GetContainerNumSlots
  local ItemLink = C_Container and C_Container.GetContainerItemLink or _G.GetContainerItemLink
  if NumSlots and ItemLink then
    for bag = 0, 4 do
      for slot = 1, NumSlots(bag) or 0 do
        local link = ItemLink(bag, slot)
        if link then fn(link) end
      end
    end
  end
end

local function OwnItems(quality)
  local found = {}
  ForEachOwn(function(link)
    local _, _, q, _, _, _, _, _, equipLoc = GetInfo(link)
    if q == quality then found[#found + 1] = { link = link, model = ns.MODEL_SLOTS[equipLoc or ""] } end
  end)
  -- prefer things with a model, so the preview shows off
  local withModel = {}
  for _, f in ipairs(found) do if f.model then withModel[#withModel + 1] = f end end
  local pick = (#withModel > 0 and withModel or found)
  return #pick > 0 and pick[math.random(#pick)].link or nil
end

-- opts: fight (as if in combat), best (the best quality looted with it). With opts a test follows
-- the real compact rule; without, it always shows the full popup.
local function Preview(item, count, opts)
  ns.ItemData(item, count, "loot", function(d)
    d.test, d.push = true, true
    if opts then
      d.burstBest = opts.best
      d.compact = ns.PopupCompact(d, opts.fight)
    end
    ns:ShowLoot(d)
  end)
end

local function TestItem(q) -- an item of this quality: one of yours first, else a well-known one
  local own = OwnItems(q)
  if own then return own end
  local ids = TEST_IDS[q]
  return ids and ids[math.random(#ids)]
end

-- Test popup: "epic", or "epic combat" for how it looks in a fight
-- A full popup of this rarity for the Arrivals page's Test buttons: the first item that loads (yours
-- of that rarity, else well-known ones), shown at that rarity
ns.AddAction("arrivaltest", function(arg)
  local q = math.min(math.max(tonumber(arg) or 4, 2), 5)
  local cands = {}
  local own = OwnItems(q)
  if own then cands[1] = own end
  for _, id in ipairs(TEST_IDS[q] or {}) do
    if not GetInfoInstant or GetInfoInstant(id) then cands[#cands + 1] = id end
  end
  if not cands[1] then cands[1] = TestItem(q) or 2589 end -- (anything: it's shown at that rarity)
  local done = false
  for _, it in ipairs(cands) do
    ns.ItemData(it, 1, "loot", function(d)
      if done then return end
      done = true
      d.quality, d.test, d.push = q, true, true
      ns:ShowLoot(d)
    end)
  end
end)

ns.AddAction("test", function(arg)
  local word, extra = arg:match("^(%S*)%s*(%S*)")
  local opts = extra == "combat" and { fight = true } or nil
  local it = TestItem(QUALITY_WORDS[word] or math.random(2, 5))
  if it then Preview(it, nil, opts) end
end)

-- an Uncommon looted beside a Rare: the Rare comes full, the Uncommon compact (Popups page: Low rarities)
ns.AddAction("testpair", function()
  Preview(TestItem(3), nil, { best = 3 })
  Preview(TestItem(2), nil, { best = 3 })
end)

-- Test rain of N items from your bags and gear (plus a blue, and a purple from 8 up, so you see the
-- good stuff stay) as if you'd looted them all at once
ns.AddAction("rain", function(arg)
  local n = math.min(math.max(math.floor(tonumber(arg) or 8), 1), 60)
  -- the best item is the rarity picked on the Loot rain page (setting testRainBest, default Epic):
  -- one of your own of that rarity if you have one (always loaded), else a well-known one; the rest
  -- are your own items of lower rarity only, so the best really is the best
  local best = ns.settings.testRainBest or 4
  local own = {}
  ForEachOwn(function(link)
    local q = select(3, GetInfo(link))
    if q and q < best then own[#own + 1] = link end
  end)
  local picks = {}
  while #picks < n - 1 do picks[#picks + 1] = #own > 0 and own[math.random(#own)] or 2589 end -- Linen Cloth
  local items, waiting, started = {}, #picks + 1, false
  local function Go()
    if started then return end
    started = true
    if #items > 0 then ns:Rain(items, n * math.random(150, 1800), true) end -- some test money too
  end
  -- the best: yours if you have one, else the first well-known one of that rarity this client has
  -- and loads (some classic items don't exist on every client yet: they'd never load)
  local mine = OwnItems(best)
  local candidates = mine and { mine } or {}
  if not mine then
    for _, id in ipairs(TEST_IDS[best]) do
      if not GetInfoInstant or GetInfoInstant(id) then
        if GetInfo(id) then table.insert(candidates, 1, id) else candidates[#candidates + 1] = id end -- loaded ones first
      end
    end
  end
  -- the first candidate that loads is the best, shown at the picked rarity (it's a test: what counts
  -- is that the rarity shows); if none has loaded in time, a filler item stands in for it
  local gotBest = false
  local function TakeBest(d)
    if gotBest then return end
    gotBest = true
    d.test, d.quality = true, best
    items[#items + 1] = d
    waiting = waiting - 1
    if waiting == 0 then Go() end
  end
  for _, it in ipairs(candidates) do ns.ItemData(it, 1, "loot", TakeBest) end
  local fillers = {}
  for _, it in ipairs(picks) do
    ns.ItemData(it, 1, "loot", function(d)
      d.test = true
      items[#items + 1] = d
      fillers[#fillers + 1] = d
      waiting = waiting - 1
      if waiting == 0 then Go() end
    end)
  end
  C_Timer.After(1.5, function()
    if not gotBest and fillers[1] then
      local copy = {}
      for k, v in pairs(fillers[1]) do copy[k] = v end
      TakeBest(copy)
    end
  end)
  C_Timer.After(3, Go) -- don't wait forever for an item the client won't load
end)

-- Money amounts: "1g 20s 5c", "35s", or plain copper
local function MoneyName(copper)
  local g, s, c = math.floor(copper / 10000), math.floor(copper / 100) % 100, copper % 100
  local out = {}
  if g > 0 then out[#out + 1] = g .. "g" end
  if s > 0 then out[#out + 1] = s .. "s" end
  if c > 0 or #out == 0 then out[#out + 1] = c .. "c" end
  return table.concat(out, " ")
end
ns.MoneyName = MoneyName

ns.AddAction("testcoins", function(arg)
  if ns.settings.noRainCoins then return end -- coins are switched off (Loot rain page)
  ns:Rain({}, ns.RainCore.ParseMoney(arg) or 23500, true)
end)

-- A quest reward: one of your green or blue items and some money, rained together
ns.AddAction("testquest", function()
  local pick = OwnItems(3) or OwnItems(2) or TEST_IDS[3][math.random(#TEST_IDS[3])]
  ns.ItemData(pick, 1, "received", function(d)
    d.test = true
    ns:Rain({ d }, math.random(3, 25) * 1000, true)
  end)
end)

-- Popups page, "Check any item ID": that item as a real popup, its model forced
ns.AddAction("model", function(arg)
  local id = tonumber(arg)
  if not id then return end
  ns.ItemData(id, 1, "loot", function(d)
    d.test, d.forceModel, d.push = true, true, true
    ns:ShowLoot(d)
  end)
end)

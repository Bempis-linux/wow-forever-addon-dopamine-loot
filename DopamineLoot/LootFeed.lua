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
local QUALITY_NAMES = { [0] = "poor", "common", "uncommon", "rare", "epic", "legendary" }
-- preview items for qualities you may not have in your bags (well-known Classic items)
local TEST_IDS = { [2] = { 15211 }, [3] = { 5191, 7230 }, [4] = { 12784, 19364 }, [5] = { 19019, 17182 } }

function ns.MinQuality() return ns.settings.minQuality or 2 end
function ns.ModelZoom() return ns.settings.modelZoom or 0.7 end -- 0.7: weapons fill the stage (tested)

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
      equipLoc = equipLoc, ilvl = ilvl, typeText = TypeText(equipLoc, itemType, subType, classID), src = src,
    }
  end
  local d = Build()
  if d then return fn(d) end
  local obj
  if Item and type(item) == "number" and Item.CreateFromItemID then obj = Item:CreateFromItemID(item)
  elseif Item and type(item) == "string" and Item.CreateFromItemLink then obj = Item:CreateFromItemLink(item) end
  if obj and obj.ContinueOnItemLoad then
    obj:ContinueOnItemLoad(function() local d2 = Build(); if d2 then fn(d2) end end)
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
  if self.Secret(text) then self.Debug("loot line hidden (secret value)"); return end
  local isSelf = guid ~= nil and not self.Secret(guid) and guid == UnitGUID("player")
  local link, count, src, key = M.Parse(text, patterns, isSelf)
  if self.settings.debug then
    -- the raw line only for your own loot: other players' lines name them
    if link then self.Debug("loot:", text, "->", src, "x" .. count, "(" .. tostring(key) .. ")")
    else self.Debug("loot line (not yours or not an item), from you:", tostring(isSelf)) end
  end
  if not link then return end
  if src == "pushed" and merchantOpen then src = "bought" end
  if self.settings.noPopup or self.settings.enabled == false or src == "bought" then return end
  ns.ItemData(link, count, src, function(d)
    if (d.quality or 0) >= ns.MinQuality() then ns.Collect(d) end
  end)
end

---------------------------------------------------------------------------
-- Bursts: loot that arrives together (one loot window, one turn-in) is collected for a moment
-- (0.4 s after the last item, 2 s at most). 3+ items (setting) rain; fewer get popups. A big
-- burst looted mid-fight waits and rains when combat ends (small ones pop up right away).
---------------------------------------------------------------------------
local RAIN_MIN, QUIET, MAX_WAIT = 3, 0.4, 2
local burst, burstStart, gen = nil, 0, 0
local afterCombat = {} -- big bursts looted mid-fight, rained together when combat ends

function ns.RainMin() return ns.settings.rainMin or RAIN_MIN end

local function Play(items)
  if #items >= ns.RainMin() and not ns.settings.noRain then
    ns:Rain(items)
  else
    for _, d in ipairs(items) do ns:ShowLoot(d) end
  end
end

local function FlushBurst()
  local items = burst
  burst = nil
  if not items then return end
  if InCombatLockdown() and #items >= ns.RainMin() and not ns.settings.noRain then
    for _, d in ipairs(items) do afterCombat[#afterCombat + 1] = d end
    return
  end
  Play(items)
end

function ns:PLAYER_REGEN_ENABLED()
  if #afterCombat == 0 then return end
  local items = afterCombat
  afterCombat = {}
  C_Timer.After(0.5, function() Play(items) end)
end
ns.OnInit(function() ns:RegisterEvents("PLAYER_REGEN_ENABLED") end)

function ns.Collect(d)
  if ns.settings.noRain then return ns:ShowLoot(d) end -- nothing to collect for
  if not burst then burst, burstStart = {}, GetTime() end
  burst[#burst + 1] = d
  gen = gen + 1
  local my = gen
  local wait = math.max(0, math.min(QUIET, burstStart + MAX_WAIT - GetTime()))
  C_Timer.After(wait, function() if my == gen then FlushBurst() end end)
end

---------------------------------------------------------------------------
-- Commands
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

local function Preview(item, count)
  ns.ItemData(item, count, "loot", function(d)
    d.test, d.push = true, true
    ns:ShowLoot(d)
  end)
end

ns.AddCommand("test", "preview a popup: /dl test [uncommon|rare|epic|legendary|itemID]", function(arg)
  local n = tonumber(arg)
  local id = (n and n > 5) and n or M.ItemID(arg) -- 0-5 are qualities, bigger numbers item IDs
  if id then return Preview(id) end
  local q = QUALITY_WORDS[arg] or n or math.random(2, 5)
  local own = OwnItems(q)
  if own then return Preview(own) end
  local ids = TEST_IDS[q]
  if not ids then
    ns.Print(("no %s item in your bags or gear to preview"):format(QUALITY_NAMES[q] or tostring(q)))
    return ns:ShowLog()
  end
  Preview(ids[math.random(#ids)])
end)

-- /dl rain N: N items from your bags and gear (plus a blue, and a purple from 8 up, so you see the
-- good stuff stay) rain down as if you'd looted them all at once
ns.AddCommand("rain", "preview loot rain: /dl rain [number of items, default 8]", function(arg)
  local n = math.min(math.max(math.floor(tonumber(arg) or 8), 1), 60)
  local own = {}
  ForEachOwn(function(link) own[#own + 1] = link end)
  local picks = {}
  if n >= 4 then picks[#picks + 1] = TEST_IDS[3][math.random(#TEST_IDS[3])] end
  if n >= 8 then picks[#picks + 1] = TEST_IDS[4][math.random(#TEST_IDS[4])] end
  while #picks < n do picks[#picks + 1] = #own > 0 and own[math.random(#own)] or 2589 end -- Linen Cloth
  local items, waiting, started = {}, #picks, false
  local function Go()
    if started then return end
    started = true
    if #items > 0 then ns:Rain(items) end
  end
  for _, it in ipairs(picks) do
    ns.ItemData(it, 1, "loot", function(d)
      d.test = true
      items[#items + 1] = d
      waiting = waiting - 1
      if waiting == 0 then Go() end
    end)
  end
  C_Timer.After(1.5, Go) -- don't wait forever for an item the client won't load
end)

-- How close the camera sits to item models in popups (smaller = bigger item)
ns.AddCommand("zoom", "item model size in popups: /dl zoom [0.3-2, default 0.7]", function(arg)
  local z = tonumber(arg)
  if z and z >= 0.3 and z <= 2 then ns.settings.modelZoom = z end
  ns.Print("model zoom: " .. (ns.ModelZoom()) .. " (try /dl test epic to see it)")
  ns:ShowLog()
end)

-- Experiment for the popup redesign: stand weapons upright by rolling the model
ns.AddCommand("roll", "tilt item models (experiment): /dl roll [degrees, e.g. 90]", function(arg)
  local d = tonumber(arg)
  if d then ns.settings.modelRoll = d % 360 end
  ns.Print("model roll: " .. (ns.settings.modelRoll or 0) .. " degrees (try /dl test epic)")
  ns:ShowLog()
end)

ns.AddCommand("model", "check how an item shows: /dl model <itemID>", function(arg)
  local id = tonumber(arg) or M.ItemID(arg)
  if not id then ns.Print("usage: /dl model <itemID>"); ns:ShowLog(); return end
  local answered = false
  C_Timer.After(3, function()
    if not answered then ns.Print("model check: no item info for " .. id .. " (unknown item?)"); ns:ShowLog() end
  end)
  ns.ItemData(id, 1, "loot", function(d)
    answered = true
    d.test, d.forceModel, d.push = true, true, true
    ns:ShowLoot(d, function(mode, fileID, why)
      ns.Print(("model check %s (%s): %s%s [%s]"):format(d.name, tostring(d.equipLoc), mode,
        fileID and (" file " .. fileID) or "", why))
      ns:ShowLog()
    end)
  end)
end)

ns.AddCommand("quality", "lowest quality that pops up: /dl quality [poor|common|uncommon|rare|epic]", function(arg)
  local q = QUALITY_WORDS[arg] or tonumber(arg)
  if q and q >= 0 and q <= 5 then ns.settings.minQuality = q end
  ns.Print("popups from quality: " .. (QUALITY_NAMES[ns.MinQuality()] or ns.MinQuality()))
  ns:ShowLog()
end)

-- One report of everything the plan marks "verify in game" (for the first test session)
ns.AddCommand("check", "report which game features this client has", function()
  local function Has(v) return v and "yes" or "NO" end
  local _, build, _, iface = GetBuildInfo()
  ns.Print(("client %s, interface %s"):format(tostring(build), tostring(iface)))
  for _, t in ipairs(M.TEMPLATES) do
    local s = _G[t[1]]
    ns.Print(("%s: %s"):format(t[1], type(s) == "string" and ('"' .. s:gsub("|", "||") .. '"') or "MISSING"))
  end
  ns.probeModel = ns.probeModel or CreateFrame("PlayerModel")
  local m = ns.probeModel
  ns.Print("PlayerModel:SetItem: " .. Has(m.SetItem) .. ", GetModelFileID: " .. Has(m.GetModelFileID)
    .. ", SetItemAppearance: " .. Has(m.SetItemAppearance))
  ns.Print("C_TransmogCollection: " .. Has(C_TransmogCollection) .. ", C_PlayerInfo.CanUseItem: "
    .. Has(C_PlayerInfo and C_PlayerInfo.CanUseItem) .. ", C_TooltipInfo: " .. Has(C_TooltipInfo))
  ns.Print("HandleModifiedItemClick: " .. Has(_G.HandleModifiedItemClick) .. ", GetMouseButtonClicked: "
    .. Has(GetMouseButtonClicked) .. ", Item mixin: " .. Has(Item and Item.CreateFromItemID)
    .. ", ITEM_QUALITY_COLORS: " .. Has(ITEM_QUALITY_COLORS))
  ns.Print("loot patterns built: " .. #patterns .. " of " .. #M.TEMPLATES)
  ns:ShowLog()
end)

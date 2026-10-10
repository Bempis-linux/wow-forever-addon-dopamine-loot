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
    if (d.quality or 0) >= ns.MinQuality() then ns:ShowLoot(d) end
  end)
end

---------------------------------------------------------------------------
-- Commands
---------------------------------------------------------------------------
local function OwnItems(quality)
  local found = {}
  local function Add(link)
    if not link then return end
    local _, _, q, _, _, _, _, _, equipLoc = GetInfo(link)
    if q == quality then found[#found + 1] = { link = link, model = ns.MODEL_SLOTS[equipLoc or ""] } end
  end
  for slot = 1, 19 do Add(GetInventoryItemLink("player", slot)) end
  local NumSlots = C_Container and C_Container.GetContainerNumSlots or _G.GetContainerNumSlots
  local ItemLink = C_Container and C_Container.GetContainerItemLink or _G.GetContainerItemLink
  if NumSlots and ItemLink then
    for bag = 0, 4 do
      for slot = 1, NumSlots(bag) or 0 do Add(ItemLink(bag, slot)) end
    end
  end
  -- prefer things with a model, so the preview shows off
  local withModel = {}
  for _, f in ipairs(found) do if f.model then withModel[#withModel + 1] = f end end
  local pick = (#withModel > 0 and withModel or found)
  return #pick > 0 and pick[math.random(#pick)].link or nil
end

local function Preview(item, count)
  ns.ItemData(item, count, "loot", function(d)
    d.test = true
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

ns.AddCommand("model", "check how an item shows: /dl model <itemID>", function(arg)
  local id = tonumber(arg) or M.ItemID(arg)
  if not id then ns.Print("usage: /dl model <itemID>"); ns:ShowLog(); return end
  local answered = false
  C_Timer.After(3, function()
    if not answered then ns.Print("model check: no item info for " .. id .. " (unknown item?)"); ns:ShowLog() end
  end)
  ns.ItemData(id, 1, "loot", function(d)
    answered = true
    d.test, d.forceModel = true, true
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

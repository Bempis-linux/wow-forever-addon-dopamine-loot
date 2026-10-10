-- Offline test for Dopamine Loot's loot-line parser (no game needed).
-- Run with the Lua bundled in the VS Code Lua extension (wow-preflight does):
--   lua-language-server.exe tools/test_lootmsg.lua
local root = (arg and arg[0] or ""):match("^(.-)tools[/\\]") or ""
local ns = {}
loadfile(root .. "DopamineLoot/LootMsg.lua")("DopamineLoot", ns)
local M = ns.LootMsg

-- enUS templates as the client defines them
local G = {
  LOOT_ITEM_SELF = "You receive loot: %s.",
  LOOT_ITEM_SELF_MULTIPLE = "You receive loot: %sx%d.",
  LOOT_ITEM_PUSHED_SELF = "You receive item: %s.",
  LOOT_ITEM_PUSHED_SELF_MULTIPLE = "You receive item: %sx%d.",
  LOOT_ITEM_CREATED_SELF = "You create: %s.",
  LOOT_ITEM_CREATED_SELF_MULTIPLE = "You create: %sx%d.",
  LOOT_ITEM = "%s receives loot: %s.", -- someone else's: must never match
}
local pats = M.Build(G)

local fails = 0
local function Expect(label, text, link, n, src, isSelf, patterns)
  local l, c, s = M.Parse(text, patterns or pats, isSelf)
  if l ~= link or c ~= n or s ~= src then
    fails = fails + 1
    print(("FAIL %s: got %s %s %s"):format(label, tostring(l), tostring(c), tostring(s)))
  else
    print("ok   " .. label)
  end
end

local SWORD = "|cff1eff00|Hitem:2489::::::::5:::::::::|h[Two-Handed Sword]|h|r"
local CLOTH = "|cffffffff|Hitem:2589::::::::5:::::::::|h[Linen Cloth]|h|r"
local DRINK = "|cffffffff|Hitem:159::::::::5:::::::::|h[Refreshing Spring Water]|h|r"
local BREW = "|cffffffff|Hitem:2686::::::::5:::::::::|h[Thunder Ale (Dark)]|h|r" -- parentheses and x in the name

Expect("single loot", "You receive loot: " .. SWORD .. ".", SWORD, 1, "loot")
Expect("stack loot", "You receive loot: " .. CLOTH .. "x3.", CLOTH, 3, "loot")
Expect("pushed (vendor/quest)", "You receive item: " .. DRINK .. "x5.", DRINK, 5, "pushed")
Expect("created", "You create: " .. CLOTH .. ".", CLOTH, 1, "created")
Expect("name with punctuation", "You receive loot: " .. BREW .. "x2.", BREW, 2, "loot")
Expect("someone else's loot", "Thrall receives loot: " .. SWORD .. ".", nil, nil, nil)
Expect("not loot", "You have learned a new recipe.", nil, nil, nil)
Expect("money line", "You loot 5 Copper", nil, nil, nil)
-- client without the templates: raw link fallback, only when the line is known to be ours
Expect("fallback self", "Loot: " .. CLOTH .. "x4.", CLOTH, 4, "loot", true, {})
Expect("fallback other", "Loot: " .. CLOTH .. "x4.", nil, nil, nil, false, {})
-- positional template forms ("%1$s") build too
Expect("positional", "Beute: " .. SWORD .. "x2.", SWORD, 2, "loot", nil,
  M.Build({ LOOT_ITEM_SELF_MULTIPLE = "Beute: %1$sx%2$d." }))

assert(M.ItemID(SWORD) == 2489, "ItemID")
assert(M.ItemID("item:6948") == 6948, "ItemID plain")
print(fails == 0 and "all passed" or (fails .. " failed"))

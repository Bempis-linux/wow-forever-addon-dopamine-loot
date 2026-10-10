-- Dopamine Loot loot lines: turns the client's "You receive loot: [item]x3." chat lines into
-- (link, count, source). Pure Lua, no game calls, so tools/test_lootmsg.lua can run it offline.
-- Only the *self* templates are matched: other players' loot ("X receives loot") never matches,
-- so a match is itself the "this is mine" check.
local _, ns = ...

local M = {}
ns.LootMsg = M

-- Most specific first: the _MULTIPLE forms end in "x%d", which the single forms would swallow
M.TEMPLATES = {
  { "LOOT_ITEM_SELF_MULTIPLE", "loot" },
  { "LOOT_ITEM_SELF", "loot" },
  { "LOOT_ITEM_PUSHED_SELF_MULTIPLE", "pushed" },
  { "LOOT_ITEM_PUSHED_SELF", "pushed" },
  { "LOOT_ITEM_CREATED_SELF_MULTIPLE", "created" },
  { "LOOT_ITEM_CREATED_SELF", "created" },
}

-- "You receive loot: %sx%d." -> "^You receive loot: (.+)x(%d+)%.$" (also handles "%1$s" forms)
function M.Pattern(template)
  local p = template:gsub("%%%d?%$?s", "\1"):gsub("%%%d?%$?d", "\2")
  p = p:gsub("%p", "%%%0")
  p = p:gsub("\1", "(.+)"):gsub("\2", "(%%d+)")
  return "^" .. p .. "$"
end

-- Build the pattern list from a table of global strings (_G in game, a fake in tests)
function M.Build(G)
  local list = {}
  for _, t in ipairs(M.TEMPLATES) do
    local s = G[t[1]]
    if type(s) == "string" and s ~= "" then
      list[#list + 1] = { pat = M.Pattern(s), src = t[2], key = t[1] }
    end
  end
  return list
end

-- Returns link, count, source, templateKey; nil if the line isn't loot you received.
-- isSelf: used only when the client has none of the templates (fallback on the raw item link).
function M.Parse(text, patterns, isSelf)
  if type(text) ~= "string" then return nil end
  for _, p in ipairs(patterns) do
    local link, n = text:match(p.pat)
    if link and link:find("|Hitem:", 1, true) then
      return link, tonumber(n) or 1, p.src, p.key
    end
  end
  if #patterns == 0 and isSelf then
    local link = text:match("|c%x+|Hitem:.-|h.-|h|r") or text:match("|Hitem:.-|h.-|h")
    if link then return link, tonumber(text:match("|rx(%d+)") or text:match("x(%d+)")) or 1, "loot", "fallback" end
  end
  return nil
end

-- Item ID from a link or "item:123" string
function M.ItemID(link)
  return tonumber(type(link) == "string" and link:match("item:(%d+)") or nil)
end

return M

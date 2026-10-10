-- Dopamine Loot core: namespace, saved data, event dispatch, slash commands
local ADDON, ns = ...
_G.DopamineLoot = ns -- for /dump DopamineLoot.db while debugging

ns.TITLE = "Dopamine Loot"
ns.PREFIX = "|cffffd100Dopamine Loot|r "
local DB_VERSION = 1

-- Replaced by the log window (Output.lua) once it loads; never prints to chat after that
function ns.Print(...) print(ns.PREFIX .. string.join(" ", tostringall(...))) end
function ns.Debug(...) if ns.settings and ns.settings.debug then ns.Print("|cff999999[debug]|r", ...) end end
function ns.Esc(s) return (s:gsub("%p", "%%%0")) end -- literal text for use in a pattern

-- Newer clients hide some unit values in combat and instances ("secret values"); passing one on
-- to another API is an error, so check anything read from a unit first
function ns.Secret(v) return issecretvalue ~= nil and issecretvalue(v) or false end

function ns.Version()
  local get = (C_AddOns and C_AddOns.GetAddOnMetadata) or GetAddOnMetadata
  return get and get(ADDON, "Version") or "?"
end

---------------------------------------------------------------------------
-- Saved data: settings are account-wide (DopamineLootDB.settings); game progress is per character
-- (DopamineLootCharDB), since an alt hasn't done what your main has
---------------------------------------------------------------------------
local inits = {}
-- Feature files register setup that needs saved data: ns.OnInit(function() ... end)
function ns.OnInit(fn) inits[#inits + 1] = fn end

local function InitDB()
  DopamineLootDB = DopamineLootDB or {}
  DopamineLootCharDB = DopamineLootCharDB or {}
  DopamineLootDB.settings = DopamineLootDB.settings or {}
  DopamineLootCharDB.version = DopamineLootCharDB.version or DB_VERSION
  ns.settings, ns.db = DopamineLootDB.settings, DopamineLootCharDB
end

---------------------------------------------------------------------------
-- Events: ns[EVENT_NAME](ns, ...) handles each one; feature files define handlers and call
-- ns:RegisterEvents("EVENT", ...) from an ns.OnInit function
---------------------------------------------------------------------------
local ev = CreateFrame("Frame")
ev:SetScript("OnEvent", function(_, event, ...)
  local fn = ns[event]
  if fn then fn(ns, ...) end
end)
ev:RegisterEvent("ADDON_LOADED")

function ns:RegisterEvents(...)
  for i = 1, select("#", ...) do pcall(ev.RegisterEvent, ev, (select(i, ...))) end
end

function ns:ADDON_LOADED(name)
  if name ~= ADDON then return end
  ev:UnregisterEvent("ADDON_LOADED")
  InitDB()
  self:RegisterEvents("PLAYER_LOGIN")
  for _, fn in ipairs(inits) do fn() end
end

function ns:PLAYER_LOGIN()
  local name = UnitName("player")
  if not self.Secret(name) then self.playerName = name end
end

---------------------------------------------------------------------------
-- Slash commands. Feature files add their own:
--   ns.AddCommand("stats", "show counts", function(args) ... end)
--   ns.AddToggle("sound", "noSound", "popup sound")   -> /dl sound off | on
-- Results go to the log window; only /dl help prints to chat (yellow).
---------------------------------------------------------------------------
local commands, order = {}, {}
function ns.AddCommand(name, help, fn)
  if not commands[name] then order[#order + 1] = name end
  commands[name] = { help = help, fn = fn }
end

-- Run a command as if typed (the settings page's Test buttons use this)
function ns.RunCommand(name, rest)
  local c = commands[name]
  if c and c.fn then c.fn(rest or "") end
end

local toggles = {}
function ns.AddToggle(word, key, label)
  toggles[word] = { key = key, label = label }
  ns.AddCommand(word .. " off | on", "turn the " .. label .. " off or on", nil)
end

local function ChatHelp(unknown)
  local Y = "|cffffff00"
  if unknown then print(ns.PREFIX .. Y .. ("unknown command \"%s\"|r"):format(unknown)) end
  print(ns.PREFIX .. Y .. "v" .. ns.Version() .. " commands:|r")
  local function Line(cmd, help) print(("  |cffffffff/dl%s|r - %s%s|r"):format(cmd, Y, help)) end
  if ns.ToggleUI then Line("", "open the settings") end
  for _, name in ipairs(order) do Line(" " .. name, commands[name].help) end
  Line(" log", "open or close the log window")
  Line(" debug", "toggle debug logging")
  Line(" help", "show this list")
end

SLASH_DOPAMINELOOT1 = "/dl"
SLASH_DOPAMINELOOT2 = "/dopamine"
SlashCmdList.DOPAMINELOOT = function(msg)
  msg = strtrim((msg or ""):lower())
  local word, rest = msg:match("^(%S*)%s*(.-)$")
  if msg == "" then
    if ns.ToggleUI then ns:ToggleUI() else ChatHelp() end
  elseif msg == "help" then
    ChatHelp()
  elseif msg == "log" then
    ns:ToggleLog()
  elseif msg == "debug" then
    ns.settings.debug = not ns.settings.debug or nil
    ns.Print("debug " .. (ns.settings.debug and "on" or "off"))
    ns:ShowLog()
  elseif toggles[word] and (rest == "on" or rest == "off") then
    ns.settings[toggles[word].key] = (rest == "off") or nil
    ns.Print(toggles[word].label .. " " .. rest)
    ns:ShowLog()
  elseif commands[word] and commands[word].fn then
    commands[word].fn(rest)
  else
    ChatHelp(msg)
  end
end

-- Minimap addon-compartment entry (## AddonCompartmentFunc in the .toc)
function DopamineLoot_OnCompartmentClick()
  if ns.ToggleUI then ns:ToggleUI() else ns:ToggleLog() end
end

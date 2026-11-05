-- Dopamine Loot core: namespace, saved data, event dispatch, /dl
local ADDON, ns = ...
_G.DopamineLoot = ns -- for /dump DopamineLoot.db while debugging

ns.TITLE = "Dopamine Loot"
local DB_VERSION = 1

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
  -- gone before 1.0: the dev tools' results and debug logging
  DopamineLootDB.assetCheck, DopamineLootDB.armorTest, DopamineLootDB.settings.debug = nil, nil, nil
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
  for _, fn in ipairs(inits) do -- one broken feature must not stop the ones after it
    local ok, err = pcall(fn)
    if not ok then geterrorhandler()(err) end
  end
end

function ns:PLAYER_LOGIN()
  local name = UnitName("player")
  if not self.Secret(name) then self.playerName = name end
end

---------------------------------------------------------------------------
-- Actions: the settings pages' Test buttons run them by name. Feature files add their own:
--   ns.AddAction("rain", function(arg) ... end)    ns.RunAction("rain", "8")
-- The only slash command is /dl, which opens the settings.
---------------------------------------------------------------------------
local actions = {}
function ns.AddAction(name, fn) actions[name] = fn end
function ns.RunAction(name, arg)
  local fn = actions[name]
  if fn then fn(arg or "") end
end

local function OpenSettings() if ns.ToggleUI then ns:ToggleUI() end end
SLASH_DOPAMINELOOT1 = "/dl"
SlashCmdList.DOPAMINELOOT = OpenSettings

-- Minimap addon-compartment entry (## AddonCompartmentFunc in the .toc)
function DopamineLoot_OnCompartmentClick() OpenSettings() end

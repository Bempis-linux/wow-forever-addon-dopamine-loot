-- Dopamine Loot "Sounds" and "Advanced" settings pages (the game's native layout, ns.Native in
-- Settings.lua). Sounds: the switch, the volume they follow, the popup sound picker (a game sound per
-- rarity, played as you pick it, plus our chime for Rare and up) and the rain's burst sound.
-- Advanced: the log, checks for bug reports, and the Blizzard assets tool.
local _, ns = ...

local sounds, advanced

-- Picking a sound plays it; "Defaults" resets all four rows in one go, which must not play four
-- sounds at once: only a frame with a single pick plays
local picks, pickQ = 0, nil
local function PickPlayed(q) -- returns the setter for row q: a pick plays what that popup sounds like
  return function()
    picks, pickQ = picks + 1, q
    if picks == 1 then
      C_Timer.After(0, function()
        if picks == 1 then ns:PreviewPopupSound(pickQ) end
        picks = 0
      end)
    end
  end
end

-- The game sounds this client has (a kit missing from SOUNDKIT can't play, so it isn't offered)
local function SoundOptions()
  local list = { { "none", "None" } }
  for _, s in ipairs(ns.POPUP_SOUNDS) do
    if SOUNDKIT and SOUNDKIT[s.key] then list[#list + 1] = { s.key, s.label } end
  end
  return list
end

local function CreateSounds()
  local N = ns.Native
  local cat, layout = N.Page("Sounds", ns.settingsCategory)
  sounds = cat

  N.Header(layout, "General")
  Settings.CreateCheckbox(cat, ns.soundSetting, "Every Dopamine Loot sound at once (the same switch as on the first page). /dl sound off")
  N.Choice(cat, "soundChannel", "Volume follows", {
    { "SFX", "Sound effects (default)" }, { "Master", "Master volume (plays with effects muted)" },
  }, "SFX", "Which of the game's volume sliders the sounds follow.")
  N.Button(layout, "Every popup sound", "Play all", function()
    for i, row in ipairs(ns.SOUND_ROWS) do
      C_Timer.After((i - 1) * 1.6, function() ns:PreviewPopupSound(row.q) end)
    end
  end, "Uncommon, Rare, Epic and Legendary popup sounds one after another, as popups play them.")

  -- One section per rarity, the same rows in the same order (only the game's own controls: see
  -- the kit's note on the settings list's shared frames): Sound, Our chime (Rare and up), Preview
  local COLOR = { [2] = "|cff1eff00", [3] = "|cff0070dd", [4] = "|cffa335ee", [5] = "|cffff8000" }
  for _, row in ipairs(ns.SOUND_ROWS) do
    local name = row.label:lower()
    N.Header(layout, COLOR[row.q] .. row.label .. "|r popups")
    N.Choice(cat, "sound" .. row.q, "Sound", SoundOptions, row.default,
      "The game sound a " .. name .. " popup plays. Picking one plays it.", PickPlayed(row.q))
    if row.q >= 3 then
      N.Toggle(cat, "noChime" .. row.q, "Our chime",
        "Our own chime on top, timed with the " .. name .. " arrival (the sparks, glints or shockwave).", true)
    end
    N.Button(layout, "Preview", "Play", function() ns:PreviewPopupSound(row.q) end,
      "What a " .. name .. " popup sounds like now: the game sound, plus our chime when it's on.")
  end

  N.Header(layout, "Loot rain")
  N.Choice(cat, "openSound", "As the loot bursts out", {
    { "size", "By haul size (default)" }, { "always", "Always the big sound" }, { "never", "Never" },
  }, "size", "A few grays, whites or greens: no sound; 6 items or 1 gold: a soft pop; something Rare or better: a big burst. Also /dl opensound.")
end

local function CreateAdvanced()
  local N = ns.Native
  local cat, layout = N.Page("Advanced", ns.settingsCategory)
  advanced = cat
  N.Header(layout, "Log and checks")
  N.Toggle(cat, "debug", "Debug logging", "Log every loot line as it's read (in the log window). Also /dl debug.")
  N.Button(layout, "The log window", "Open log", function() ns:ShowLog() end, "Everything Dopamine Loot reports (/dl log).")
  N.Button(layout, "Game features", "Check client", function() ns.RunCommand("check") end,
    "Report which game features this client has, for bug reports (/dl check).")
  N.Header(layout, "Blizzard assets")
  N.Button(layout, "The game's chests, glows, sounds, fonts", "Asset check", function() ns:OpenAssets() end,
    "See and hear the game's own assets that could join the show, and check which exist on this client (/dl assets).")
end

ns.OnInit(function()
  if not sounds then CreateSounds() end
  if not advanced then CreateAdvanced() end
end)

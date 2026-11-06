-- Dopamine Loot "Sounds" settings page (a plain page built with ns.Native in
-- Settings.lua). Sounds: the switch, the volume slider they follow, the popup sound picker (a game sound per
-- rarity, played as you pick it, plus our chime for Rare and up) and the rain's burst sound.
local _, ns = ...

local sounds

-- Picking a sound plays it; a change that sets several rows in one go must not play several
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
  N.Toggle(cat, "noSound", "Sounds", "Turns every Dopamine Loot sound on or off at once (the same switch as on the first page). The game's own sounds are not affected.", true)
  N.Choice(cat, "soundChannel", "Volume slider", {
    { "SFX", "Sound effects (default)" }, { "Master", "Master (plays even with effects muted)" },
  }, "SFX", "Which of the game's volume sliders (System > Audio) controls Dopamine Loot's sounds.")
  N.Button(layout, "Hear every popup sound", "Play all", function()
    for i, row in ipairs(ns.SOUND_ROWS) do
      C_Timer.After((i - 1) * 1.6, function() ns:PreviewPopupSound(row.q) end)
    end
  end, "Plays the Uncommon, Rare, Epic and Legendary popup sounds one after another, the way popups play them.")

  -- One section per rarity, the same rows in the same order:
  -- Sound, Extra chime (Rare and up), Preview
  local COLOR = { [2] = "|cff1eff00", [3] = "|cff0070dd", [4] = "|cffa335ee", [5] = "|cffff8000" }
  for _, row in ipairs(ns.SOUND_ROWS) do
    local name = row.q == 2 and "uncommon or lower" or row.label:lower()
    local a = name:match("^[aeiou]") and "an " or "a " -- an epic, a rare
    N.Header(layout, COLOR[row.q] .. row.label .. "|r popups")
    N.Choice(cat, "sound" .. row.q, "Sound", SoundOptions, row.default,
      "The game sound " .. a .. name .. " popup plays when it appears. Picking one plays it so you can hear it.", PickPlayed(row.q))
    if row.q >= 3 then
      N.Toggle(cat, "noChime" .. row.q, "Extra chime",
        "Adds Dopamine Loot's own chime on top of the game sound, timed with the popup's sparks as it arrives.", true)
    end
    N.Button(layout, "Hear it", "Play", function() ns:PreviewPopupSound(row.q) end,
      "Plays what " .. a .. name .. " popup sounds like with the settings above.")
  end

  N.Header(layout, "Loot rain")
  N.Choice(cat, "openSound", "Burst sound", {
    { "size", "By haul size (default)" }, { "always", "Always the big sound" }, { "never", "Never" },
  }, "size", "The sound as the loot bursts out at the start of a rain. By haul size: a few grays, whites or greens make no sound, 6 or more items or 1 gold a soft pop, anything Rare or better a big burst.")
end

ns.OnInit(function()
  if not sounds then CreateSounds() end
end)

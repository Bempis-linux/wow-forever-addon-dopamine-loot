-- Dopamine Loot sounds: one sound per item quality, from the game's own sound kits (played by ID,
-- nothing shipped). Each tier lists candidates best first; the first that the client reports it
-- will play is remembered. Retail-era kits may be missing on Forever: /dl sounds checks them all.
local _, ns = ...

-- quality: 0 poor, 1 common, 2 uncommon, 3 rare, 4 epic, 5 legendary, 6 artifact, 7 heirloom
local TIERS = {
  [0] = { "LOOT_WINDOW_COIN_SOUND", "IG_BACKPACK_COIN_OK" },
  [1] = { "LOOT_WINDOW_COIN_SOUND", "IG_BACKPACK_COIN_OK" },
  [2] = { "UI_TRANSMOG_ITEM_CLICK", "IG_BACKPACK_COIN_OK", "LOOT_WINDOW_COIN_SOUND" },
  [3] = { "UI_RAID_LOOT_TOAST_LESSER_ITEM_WON", "UI_ITEM_UPGRADE_UI_ITEM_UPGRADED_RARE", "UI_BONUS_LOOT_ROLL_END", "IG_BACKPACK_COIN_OK" },
  [4] = { "UI_EPICLOOT_TOAST", "UI_WARFORGED_ITEM_LOOT_TOAST", "UI_BONUS_LOOT_ROLL_END", "IG_BACKPACK_COIN_OK" },
  [5] = { "UI_LEGENDARY_LOOT_TOAST", "UI_EPICLOOT_TOAST", "UI_BONUS_LOOT_ROLL_END", "IG_BACKPACK_COIN_OK" },
}
ns.SOUND_TIERS = TIERS

local working = {} -- [quality] = kit key that played

ns.AddToggle("sound", "noSound", "loot sounds")

local function Channel() return ns.settings.soundChannel or "SFX" end

-- Play a kit by key; returns whether the client says it will play
function ns.PlayKit(key)
  local id = SOUNDKIT and SOUNDKIT[key]
  if not id then return false end
  local willPlay = PlaySound(id, Channel())
  return willPlay and true or false
end

function ns:PlayTierSound(quality, force)
  if self.settings.noSound and not force then return end
  local q = math.min(math.max(quality or 2, 0), 5)
  if working[q] and ns.PlayKit(working[q]) then return end
  for _, key in ipairs(TIERS[q]) do
    if ns.PlayKit(key) then working[q] = key; return end
  end
end

-- /dl sounds: play every candidate one after another and log which exist (for picking defaults)
ns.AddCommand("sounds", "play and check every loot sound", function()
  local list = {}
  for q = 0, 5 do
    for _, key in ipairs(TIERS[q]) do
      if not list[key] then list[key] = true; list[#list + 1] = { q = q, key = key } end
    end
  end
  ns:ShowLog()
  ns.Print(("checking %d sounds, one every 1.5 s"):format(#list))
  for i, s in ipairs(list) do
    C_Timer.After((i - 1) * 1.5, function()
      local id = SOUNDKIT and SOUNDKIT[s.key]
      local played = id and ns.PlayKit(s.key)
      ns.Print(("quality %d  %s (%s): %s"):format(s.q, s.key, tostring(id),
        not id and "not in SOUNDKIT" or played and "plays" or "will not play"))
    end)
  end
end)

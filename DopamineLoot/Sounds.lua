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

-- Arrival sounds: our own synthesized OGGs (tools/gen_sounds.sh), layered on the tier sound and
-- started by View.lua with the arrival effects (Rare spark ring, Epic ring, Legendary shockwave)
local ARRIVAL_FILE = "Interface\\AddOns\\DopamineLoot\\Media\\Arrival%s.ogg"
local ARRIVAL = { rare = "Rare", epic = "Epic", legendary = "Legendary" }
ns.AddToggle("arrivalsound", "noArrivalSound", "arrival sounds")

function ns:PlayArrivalSound(tier)
  if self.settings.noSound or self.settings.noArrivalSound or not ARRIVAL[tier] then return end
  PlaySoundFile(ARRIVAL_FILE:format(ARRIVAL[tier]), Channel())
end

-- Loot rain escalation: tick n (1 = the first item down) climbs a semitone per item, up to 15 steps
local STEP_FILE = "Interface\\AddOns\\DopamineLoot\\Media\\Tick%02d.ogg"
local lastStep = 0
function ns:PlayStepTick(n)
  if self.settings.noSound then return end
  local now = GetTime()
  if now - lastStep < 0.05 then return end -- a fast rattle skips ticks; the pitch still climbs
  lastStep = now
  PlaySoundFile(STEP_FILE:format(math.min(math.max((n or 1) - 1, 0), 14)), Channel())
end

-- The rain and money (tools/gen_sounds.sh): each set climbs a pentatonic step per call,
-- n = 1 for the first; a set never plays twice within its gap, so a fast burst can't buzz
local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local lastSet = {}
local function PlaySet(name, n, gap)
  if ns.settings.noSound then return end
  local now = GetTime()
  if now - (lastSet[name] or 0) < (gap or 0.04) then return end
  lastSet[name] = now
  PlaySoundFile(("%s%s%02d.ogg"):format(MEDIA, name, math.min(math.max((n or 1) - 1, 0), 10)), Channel())
end
function ns:PlayLaunchSound(isCoin, n) PlaySet(isCoin and "LaunchCoin" or "LaunchItem", n) end -- launched
function ns:PlayClink(n) PlaySet("Clink", n) end                                                -- a coin lands
function ns:PlayMergeSound(metal, k) PlaySet(metal == "gold" and "MergeGold" or "MergeSilver", 2 * k - 1, 0) end
function ns:PlayChestPop() -- a medium haul's burst: a soft pop (big hauls get a game sound)
  if not self.settings.noSound then PlaySoundFile(MEDIA .. "ChestPop.ogg", Channel()) end
end
function ns:PlayGatherSound()
  if not self.settings.noSound then PlaySoundFile(MEDIA .. "Gather.ogg", Channel()) end
end

-- Loot rain: one sound as the burst sprays out, a light coin tick on bounces
local BURST = { "UI_STORE_UNWRAP", "UI_GARRISON_COMMAND_TABLE_CHEST_UNLOCK", "UI_BONUS_LOOT_ROLL_END", "IG_BACKPACK_OPEN" }
local BOUNCE = { "LOOT_WINDOW_COIN_SOUND", "IG_BACKPACK_COIN_OK" }
TIERS.burst, TIERS.bounce = BURST, BOUNCE

local function PlayFirst(slot, list)
  if ns.settings.noSound then return end
  if working[slot] and ns.PlayKit(working[slot]) then return end
  for _, key in ipairs(list) do
    if ns.PlayKit(key) then working[slot] = key; return end
  end
end
function ns:PlayBurstSound() PlayFirst("burst", BURST) end
function ns:PlayBounceSound() PlayFirst("bounce", BOUNCE) end

-- /dl sounds: play every candidate one after another and log which exist (for picking defaults)
ns.AddCommand("sounds", "play and check every loot sound", function()
  local list = {}
  for _, slot in ipairs({ 0, 1, 2, 3, 4, 5, "burst", "bounce" }) do
    for _, key in ipairs(TIERS[slot]) do
      if not list[key] then list[key] = true; list[#list + 1] = { q = slot, key = key } end
    end
  end
  ns:ShowLog()
  ns.Print(("checking %d sounds, one every 1.5 s"):format(#list))
  for i, s in ipairs(list) do
    C_Timer.After((i - 1) * 1.5, function()
      local id = SOUNDKIT and SOUNDKIT[s.key]
      local played = id and ns.PlayKit(s.key)
      ns.Print(("%s  %s (%s): %s"):format(type(s.q) == "number" and ("quality " .. s.q) or s.q, s.key, tostring(id),
        not id and "not in SOUNDKIT" or played and "plays" or "will not play"))
    end)
  end
end)

-- Dopamine Loot sounds. Popups: per rarity a game sound (picked on the Sounds settings page, played
-- by ID, nothing shipped) plus, for Rare and up, our own chime with the arrival effects. The rain:
-- our pitch-climbing sets (the game can't change a sound's pitch) and a game sound for the burst.
local _, ns = ...

-- The popup sound choices: game sound kits (SOUNDKIT keys) by row. Row 2 covers Uncommon and below.
-- "none" plays nothing. Kits the client doesn't have are left out of the list.
ns.POPUP_SOUNDS = {
  { key = "LOOT_WINDOW_COIN_SOUND", label = "Coins" },
  { key = "IG_BACKPACK_COIN_OK", label = "Coin clink" },
  { key = "UI_TRANSMOG_ITEM_CLICK", label = "Soft click" },
  { key = "PICK_UP_GEMS", label = "Gems" },
  { key = "UI_RAID_LOOT_TOAST_LESSER_ITEM_WON", label = "Loot won (raid)" },
  { key = "UI_PERSONAL_LOOT_BANNER", label = "Personal loot banner" },
  { key = "UI_BONUS_LOOT_ROLL_END", label = "Bonus roll" },
  { key = "UI_STORE_UNWRAP", label = "Unwrap" },
  { key = "UI_EPICLOOT_TOAST", label = "Epic loot toast" },
  { key = "UI_WARFORGED_ITEM_LOOT_TOAST", label = "Warforged loot toast" },
  { key = "UI_LEGENDARY_LOOT_TOAST", label = "Legendary loot toast" },
  { key = "UI_GARRISON_COMMAND_TABLE_CHEST_UNLOCK_GOLD_SUCCESS", label = "Gold chest unlock" },
}
ns.SOUND_ROWS = { -- the rows on the Sounds page: rarity, label, default sound
  { q = 2, label = "Uncommon and lower", default = "UI_TRANSMOG_ITEM_CLICK" },
  { q = 3, label = "Rare", default = "UI_RAID_LOOT_TOAST_LESSER_ITEM_WON" },
  { q = 4, label = "Epic", default = "UI_EPICLOOT_TOAST" },
  { q = 5, label = "Legendary", default = "UI_LEGENDARY_LOOT_TOAST" },
}
local function Row(q) return math.min(math.max(q or 2, 2), 5) end

ns.AddToggle("sound", "noSound", "loot sounds")

local function Channel() return ns.settings.soundChannel or "SFX" end

-- Play a kit by key; returns whether the client says it will play
function ns.PlayKit(key)
  local id = SOUNDKIT and SOUNDKIT[key]
  if not id then return false end
  local willPlay = PlaySound(id, Channel())
  return willPlay and true or false
end

-- The sound picked for a rarity (setting "sound2".."sound5"); a kit this client lacks falls back to
-- the row's default, then to a plain coin clink, so a popup is never silent by accident
function ns.PopupSound(q)
  local r = Row(q)
  local key = ns.settings["sound" .. r] or ns.SOUND_ROWS[r - 1].default
  if key == "none" or (SOUNDKIT and SOUNDKIT[key]) then return key end
  key = ns.SOUND_ROWS[r - 1].default
  if SOUNDKIT and SOUNDKIT[key] then return key end
  return "IG_BACKPACK_COIN_OK"
end

function ns:PlayTierSound(quality, force)
  if self.settings.noSound and not force then return end
  local key = ns.PopupSound(quality)
  if key ~= "none" then ns.PlayKit(key) end
end

-- Arrival chimes: our own synthesized OGGs (tools/gen_sounds.sh), layered on the game sound and
-- started by View.lua with the arrival effects; each rarity's chime is a switch ("noChime3".."5")
local ARRIVAL_FILE = "Interface\\AddOns\\DopamineLoot\\Media\\Arrival%s.ogg"
local ARRIVAL = { rare = "Rare", epic = "Epic", legendary = "Legendary" }
local TIER_Q = { rare = 3, epic = 4, legendary = 5 }

function ns:PlayArrivalSound(tier, force)
  if not ARRIVAL[tier] then return end
  if not force and (self.settings.noSound or self.settings["noChime" .. TIER_Q[tier]]) then return end
  PlaySoundFile(ARRIVAL_FILE:format(ARRIVAL[tier]), Channel())
end

-- The old one switch for every chime (before 0.4.15) becomes the three per-rarity switches
ns.OnInit(function()
  if ns.settings.noArrivalSound then
    for q = 3, 5 do ns.settings["noChime" .. q] = true end
    ns.settings.noArrivalSound = nil
  end
end)

-- What a popup of this quality sounds like, both layers (the Play buttons on the Sounds page)
function ns:PreviewPopupSound(q)
  self:PlayTierSound(q, true)
  local tier = q >= 5 and "legendary" or q == 4 and "epic" or q == 3 and "rare" or nil
  if tier and not self.settings["noChime" .. q] then self:PlayArrivalSound(tier, true) end
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

local working = {} -- [list] = the kit that played last time
local function PlayFirst(list)
  if ns.settings.noSound then return end
  if working[list] and ns.PlayKit(working[list]) then return end
  for _, key in ipairs(list) do
    if ns.PlayKit(key) then working[list] = key; return end
  end
end
function ns:PlayBurstSound() PlayFirst(BURST) end
function ns:PlayBounceSound() PlayFirst(BOUNCE) end

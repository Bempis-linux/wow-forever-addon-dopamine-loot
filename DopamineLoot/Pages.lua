-- Dopamine Loot "Sounds" and "Advanced" settings pages (the game's native layout, ns.Native in
-- Settings.lua). Sounds: the switch, the volume they follow, the popup sound picker (a game sound per
-- rarity, played as you pick it, plus our chime for Rare and up) and the rain's burst sound.
-- Advanced: the log, checks for bug reports, and the Blizzard assets tool.
local _, ns = ...

local sounds, advanced

-- Picking a sound plays it; "Defaults" resets all four rows in one go, which must not play four
-- sounds at once: only a frame with a single pick plays
local picks, pickKey = 0, nil
local function PickPlayed(key)
  picks, pickKey = picks + 1, key
  if picks == 1 then
    C_Timer.After(0, function()
      if picks == 1 and pickKey ~= "none" then ns.PlayKit(pickKey) end
      picks = 0
    end)
  end
end

-- A sound row on the native page: its label, a dropdown where the native one sits and a speaker
-- button beside it that plays the picked sound (BugSack builds its sound row the same way on
-- Forever). The rows' frames are pooled, so our pieces are made once per frame and hidden on reset.
local SoundRow
if ScrollBoxFactoryInitializerMixin and SettingsElementHierarchyMixin and SettingsSearchableElementMixin
  and Settings.CreateCallbackHandleContainer then
  SoundRow = CreateFromMixins(ScrollBoxFactoryInitializerMixin, SettingsElementHierarchyMixin, SettingsSearchableElementMixin)

  function SoundRow:SetUp(setting, label, tip, options) -- ours; Blizzard never calls it
    ScrollBoxFactoryInitializerMixin.Init(self, "SettingsListElementTemplate")
    self.setting, self.options = setting, options
    self.data = { name = label, tooltip = tip }
    self:AddSearchTags(label)
  end

  function SoundRow:GetExtent() return 26 end

  function SoundRow:InitFrame(frame)
    local setting, options = self.setting, self.options
    frame:SetSize(280, 26)
    if not frame.cbrHandles then frame.cbrHandles = Settings.CreateCallbackHandleContainer() end
    frame.data = self.data
    frame.Text:SetFontObject("GameFontNormal")
    frame.Text:SetText(self.data.name)
    frame.Text:SetPoint("LEFT", 37, 0)
    frame.Text:SetPoint("RIGHT", frame, "CENTER", -85, 0)
    if not frame.dlDrop then
      frame.dlDrop = CreateFrame("DropdownButton", nil, frame, "WowStyle1DropdownTemplate")
      frame.dlDrop:SetPoint("LEFT", frame, "CENTER", -80, 0)
      frame.dlDrop:SetWidth(230)
      local play = CreateFrame("Button", nil, frame)
      play:SetSize(22, 22)
      play:SetPoint("LEFT", frame.dlDrop, "RIGHT", 8, 0)
      local icon = play:CreateTexture(nil, "ARTWORK")
      icon:SetAllPoints()
      icon:SetTexture("Interface\\Common\\VoiceChat-Speaker")
      icon:SetVertexColor(0.85, 0.85, 0.85)
      play:SetScript("OnEnter", function(b)
        icon:SetVertexColor(1, 0.82, 0)
        GameTooltip:SetOwner(b, "ANCHOR_TOP")
        GameTooltip:SetText("Play", 1, 1, 1, 1)
        GameTooltip:Show()
      end)
      play:SetScript("OnLeave", function() icon:SetVertexColor(0.85, 0.85, 0.85); GameTooltip:Hide() end)
      frame.dlPlay = play
    end
    local drop = frame.dlDrop
    frame.dlPlay:SetScript("OnClick", function()
      local v = setting:GetValue()
      if v ~= "none" then ns.PlayKit(v) end
    end)
    drop:SetupMenu(function(_, root)
      for _, o in ipairs(options()) do
        root:CreateRadio(o[2], function(v) return setting:GetValue() == v end, function(v) setting:SetValue(v) end, o[1])
      end
    end)
    local function Update()
      for _, o in ipairs(options()) do
        if o[1] == setting:GetValue() then
          if drop.OverrideText then drop:OverrideText(o[2]) else drop:SetText(o[2]) end
        end
      end
    end
    Update()
    frame.cbrHandles:SetOnValueChangedCallback(setting:GetVariable(), Update)
    drop:Show()
    frame.dlPlay:Show()
  end

  function SoundRow:Resetter(frame)
    if frame.cbrHandles then frame.cbrHandles:Unregister() end
    if frame.dlDrop then frame.dlDrop:Hide(); frame.dlPlay:Hide() end
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

  N.Header(layout, "Popup sounds", "A game sound for each rarity; picking one plays it. Rare and up can add our chime, timed with the sparks.")
  for _, row in ipairs(ns.SOUND_ROWS) do
    local tip = "The sound a " .. row.label:lower() .. " popup plays. Picking one plays it; the speaker plays it again."
    local setting = N.Choice(cat, "sound" .. row.q, row.label, SoundOptions, row.default, tip, PickPlayed, SoundRow ~= nil)
    if SoundRow then -- our row with a Play button (else the plain native dropdown was made above)
      local init = CreateFromMixins(SoundRow)
      init:SetUp(setting, row.label, tip, SoundOptions)
      layout:AddInitializer(init)
    end
    if row.q >= 3 then
      N.Toggle(cat, "noChime" .. row.q, "   with our chime",
        "Our own chime on top, timed with the " .. row.label:lower() .. " arrival (the sparks, glints or shockwave).", true)
    end
  end
  N.Button(layout, "Hear each rarity", "Play all", function()
    for i, row in ipairs(ns.SOUND_ROWS) do
      C_Timer.After((i - 1) * 1.6, function() ns:PreviewPopupSound(row.q) end)
    end
  end, "Uncommon, Rare, Epic and Legendary popup sounds one after another, both layers.")

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

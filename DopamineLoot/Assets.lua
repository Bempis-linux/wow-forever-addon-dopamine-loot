-- Dopamine Loot asset check (/dl assets and the "Blizzard assets" settings page): which of the
-- game's own models, textures, atlases, fonts and sounds exist on this client, and each one shown
-- or played so the user can pick by eye and ear (docs/design-review.md). Results go to the log and
-- are kept in DopamineLootDB.assetCheck to read after the session. Nothing here is used by the
-- show yet; picks get wired in afterwards, each with our own asset as the fallback.
local _, ns = ...

local WHITE = "Interface\\Buttons\\WHITE8X8"

-- Candidate models: game object fileIDs from AllTheThings' Forever data, plus Blizzard's mission
-- chests (creature displays). [V] all of them: that is what this check is for.
local MODELS = {
  { id = 196976, name = "Iron chest (Sunken, Pitted Iron)" },
  { id = 196979, name = "Locked / Ornate chest" },
  { id = 200953, name = "Large ornate chest (Shen'dralar)" },
  { id = 219372, name = "Strongbox (Arena, Alliance)" },
  { id = 200952, name = "Large Scarab Coffer" },
  { id = 199748, name = "Deadmines chest" },
  { id = 197617, name = "Lockbox A" },
  { id = 196982, name = "Lockbox B" },
  { id = 196988, name = "Footlocker A" },
  { id = 196989, name = "Footlocker B" },
  { id = 198238, name = "Footlocker C" },
  { id = 198754, name = "Barrow cache" },
  { id = 200442, name = "Sack (Stolen Supply Sack)" },
  { id = 197608, name = "Sack (oats, barley)" },
  { id = 190015, name = "Sack (corn, rye)" },
  { id = 200351, name = "Demon bag" },
  { id = 382335, name = "Light beam effect" },
  { display = 71671, name = "Mission chest, neutral (display)" },
  { display = 54912, name = "Mission chest, Alliance (display)" },
  { display = 54913, name = "Mission chest, Horde (display)" },
}
-- What the chest animations do (the user watched them on Footlocker A, 2026-10-12; 149 assumed)
local ANIM_NAMES = { [0] = "stand", [146] = "closes", [147] = "held shut", [148] = "opens", [149] = "held open?" }

local TEXTURES = {
  { file = "Interface\\Cooldown\\star4", add = true },
  { file = "Interface\\AchievementFrame\\UI-Achievement-Alert-Glow", add = true },
  { file = "Interface\\COMMON\\WhiteIconFrame" },
  { file = "Interface\\SpellActivationOverlay\\IconAlert", add = true },
  { file = "Interface\\SpellActivationOverlay\\IconAlertAnts", add = true },
  { file = "Interface\\LootFrame\\LootToast" },
  { file = "Interface\\Buttons\\UI-GroupLoot-Dice-Up" },
  { file = "Interface\\Icons\\INV_Box_01" },
  { file = "Interface\\Icons\\INV_Box_02" },
  { file = "Interface\\Icons\\INV_Box_04" },
  { file = "Interface\\Icons\\INV_Misc_Ornatebox" },
  { file = "Interface\\Icons\\INV_Misc_Bag_07" },
  { file = "Interface\\Icons\\INV_Misc_Bag_10" },
  { file = "Interface\\Icons\\INV_Misc_Coin_01" },
  { file = "Interface\\Icons\\INV_Misc_Coin_02" },
  { atlas = "loottoast-glow", add = true },
  { atlas = "LootToast-MoreAwesome" },
  { atlas = "LootToast-LessAwesome" },
  { atlas = "loottoast-sheen", add = true },
  { atlas = "loottoast-itemborder-blue" },
  { atlas = "loottoast-itemborder-purple" },
  { atlas = "loottoast-itemborder-orange" },
  { atlas = "LegendaryToast-background" },
  { atlas = "LegendaryToast-OrangeStarglow", add = true },
  { atlas = "LegendaryToast-particles1", add = true },
  { atlas = "LegendaryToast-ring1", add = true },
  { atlas = "BonusLoot-Chest" },
  { atlas = "BonusChest-Lock" },
  { atlas = "BonusChest-OrangeGlow-Wide", add = true },
  { atlas = "BonusChest-KeyholeBurst", add = true },
  { atlas = "lootroll-animreveal-a", add = true },
  { atlas = "CacheToast" },
  { atlas = "CacheToast-Glow", add = true },
  { atlas = "Toast-Flash", add = true },
  { atlas = "ui-achievement-bling", add = true },
  { atlas = "levelup-glow-gold", add = true },
  { atlas = "AftLevelup-WhiteStarBurst", add = true },
  { atlas = "ChallengeMode-SpikeyStar", add = true },
  { atlas = "bags-glow-white", add = true },
  { atlas = "bags-glow-green", add = true },
  { atlas = "bags-glow-blue", add = true },
  { atlas = "bags-glow-purple", add = true },
  { atlas = "bags-glow-orange", add = true },
  { atlas = "looting_itemcard_bg" },
}
for _, e in ipairs(TEXTURES) do e.name = e.atlas or e.file:match("([^\\]+)$") end

local SOUNDS = {
  { kit = "LOOT_WINDOW_COIN_SOUND" },
  { kit = "IG_BACKPACK_COIN_OK" },
  { kit = "IG_BACKPACK_OPEN" },
  { kit = "IG_BACKPACK_CLOSE" },
  { kit = "MONEY_FRAME_OPEN" },
  { kit = "IG_QUEST_LIST_COMPLETE" },
  { kit = "LOOT_WINDOW_OPEN_EMPTY" },
  { kit = "PICK_UP_GEMS" },
  { kit = "PUT_DOWN_GEMS" },
  { kit = "UI_CONTAINER_ITEM_OPEN" },
  { kit = "UI_STORE_UNWRAP" },
  { kit = "UI_GARRISON_COMMAND_TABLE_CHEST_UNLOCK" },
  { kit = "UI_GARRISON_COMMAND_TABLE_CHEST_UNLOCK_GOLD_SUCCESS" },
  { kit = "UI_BONUS_LOOT_ROLL_START" },
  { kit = "UI_BONUS_LOOT_ROLL_END" },
  { kit = "UI_RAID_LOOT_TOAST_LESSER_ITEM_WON" },
  { kit = "UI_EPICLOOT_TOAST" },
  { kit = "UI_WARFORGED_ITEM_LOOT_TOAST" },
  { kit = "UI_LEGENDARY_LOOT_TOAST" },
  { kit = "UI_PERSONAL_LOOT_BANNER" },
  { kit = "TRADING_POST_UI_COLLECTING_COINS" },
  { kit = "CATALOG_SHOP_GOLD_SHIMMER_START" },
  { kit = "UI_PROFESSIONS_NEW_RECIPE_LEARNED_TOAST" },
  { kit = "READY_CHECK" },
  { kit = "RAID_WARNING" },
  { id = 888, name = "Level up? (kit 888)" },
  { id = 12891, name = "Achievement? (kit 12891)" },
  { file = 567439, name = "Quest complete (file 567439)" },
  { item = true, name = "Item pickup sound (backpack slot 1)" },
}
for _, s in ipairs(SOUNDS) do s.name = s.name or s.kit end

local FONTS = {
  { file = "Fonts\\FRIZQT__.TTF", name = "Friz Quadrata (default UI)" },
  { file = "Fonts\\MORPHEUS.TTF", name = "Morpheus (our titles)" },
  { file = "Fonts\\SKURRI.TTF", name = "Skurri (big numbers)" },
  { file = "Fonts\\ARIALN.TTF", name = "Arial Narrow" },
  { file = "Fonts\\2002.TTF", name = "2002" },
  { file = "Fonts\\2002B.TTF", name = "2002 Bold" },
  { file = "Fonts\\NIM_____.ttf", name = "Nimrod" },
  { file = "Fonts\\K_Pagetext.TTF", name = "Book page" },
}
local FONT_SAMPLE = "12g 35s   x5   LEGENDARY!"

---------------------------------------------------------------------------
-- Checks (each returns found, detail) and the saved results
---------------------------------------------------------------------------
local function Store()
  DopamineLootDB.assetCheck = DopamineLootDB.assetCheck or {}
  local s = DopamineLootDB.assetCheck
  for _, k in ipairs({ "models", "textures", "fonts", "kits", "sounds" }) do s[k] = s[k] or {} end
  return s
end

local function Mark(found) return found and "|cff20ff20found|r" or "|cffff4040missing|r" end

local probeTex
local function CheckTexture(e)
  if e.atlas then
    local info = C_Texture and C_Texture.GetAtlasInfo and C_Texture.GetAtlasInfo(e.atlas)
    return info ~= nil, info and ("%dx%d"):format(info.width or 0, info.height or 0) or nil
  end
  probeTex = probeTex or UIParent:CreateTexture(nil, "BACKGROUND")
  probeTex:SetTexture(nil)
  probeTex:SetTexture(e.file)
  local id = probeTex.GetTextureFileID and probeTex:GetTextureFileID()
  return id ~= nil and id ~= 0, id and ("file " .. id) or nil
end

-- FontString:SetFont returns nothing: reset to a known font, set the candidate, see if it took
local probeFont
local function CheckFont(e)
  probeFont = probeFont or UIParent:CreateFontString(nil, "BACKGROUND")
  probeFont:SetFont("Fonts\\FRIZQT__.TTF", 20, "")
  pcall(probeFont.SetFont, probeFont, e.file, 20, "")
  local got = probeFont:GetFont()
  return got ~= nil and got:lower() == e.file:lower(), got
end

local function CheckKit(s)
  if not s.kit then return nil end
  return SOUNDKIT ~= nil and SOUNDKIT[s.kit] ~= nil, SOUNDKIT and SOUNDKIT[s.kit] and ("kit " .. SOUNDKIT[s.kit]) or nil
end

-- Plays one sound entry; returns what the client says
local function PlayEntry(s)
  local ch = ns.settings.soundChannel or "SFX"
  local ok, willPlay
  if s.kit then
    local id = SOUNDKIT and SOUNDKIT[s.kit]
    if not id then return "not in SOUNDKIT" end
    ok, willPlay = pcall(PlaySound, id, ch)
  elseif s.id then
    ok, willPlay = pcall(PlaySound, s.id, ch)
  elseif s.file then
    ok, willPlay = pcall(PlaySoundFile, s.file, ch)
  elseif s.item then
    if not (C_Sound and C_Sound.PlayItemSound and ItemLocation and Enum and Enum.ItemSoundType) then
      return "no C_Sound.PlayItemSound"
    end
    local loc = ItemLocation:CreateFromBagAndSlot(0, 1)
    if C_Item and C_Item.DoesItemExist and not C_Item.DoesItemExist(loc) then return "backpack slot 1 is empty" end
    ok = pcall(C_Sound.PlayItemSound, Enum.ItemSoundType.Pickup, loc)
    willPlay = ok
  end
  if not ok then return "error" end
  return willPlay and "plays (silence = the file is missing)" or "will not play"
end

-- Models: set after Show(); OnModelLoaded marks a real load, then the animations are scanned
local function ModelKey(e) return e.id and ("file " .. e.id) or ("display " .. e.display) end

local function LoadModel(m, e)
  m.expect, m.loaded = e, false
  if m.ClearModel then m:ClearModel() end
  if e.display then m:SetDisplayInfo(e.display) else m:SetModel(e.id) end
end

-- OnModelLoaded for the model asked for last (a late one from the previous model doesn't count)
local function OnModelLoaded(self) if self.expect then self.loaded = true end end

local function Evaluate(m, e, setOk, timedOut)
  local fileID = m.GetModelFileID and m:GetModelFileID()
  local anims = {}
  if setOk and m.HasAnimation then
    for a = 0, 260 do
      local ok, has = pcall(m.HasAnimation, m, a)
      if ok and has then anims[#anims + 1] = a end
    end
  end
  local r = {
    name = e.name, loaded = m.loaded and true or false, fileID = fileID, animList = anims,
    anims = table.concat(anims, " "),
  }
  -- a missing file may load the error placeholder instead, so the file must be the one asked for
  r.found = setOk and (r.loaded or #anims > 0) and (not e.id or fileID == e.id) or false
  r.timedOut = timedOut and not r.loaded or nil
  return r
end

local function Describe(r)
  return ("%s%s, model file %s, %d animations: %s"):format(Mark(r.found),
    r.timedOut and " (no load in 3 s)" or "", tostring(r.fileID), #r.animList,
    r.anims ~= "" and r.anims or "none")
end

-- Load e into m, then call done(result) once it loaded (plus a beat for its animations) or after
-- 3 s; stillWanted() false (page hidden, another pick) drops the result
local LOAD_TIMEOUT = 3
local function LoadAndEvaluate(m, e, stillWanted, done)
  local ok = pcall(LoadModel, m, e)
  local waited, settled = 0, false
  local ticker
  ticker = C_Timer.NewTicker(0.1, function()
    waited = waited + 0.1
    if not stillWanted() then ticker:Cancel(); return end
    if m.loaded and not settled then settled = true; return end -- one more tick for the animations
    if settled or waited >= LOAD_TIMEOUT or not ok then
      ticker:Cancel()
      local fine, r = pcall(Evaluate, m, e, ok, waited >= LOAD_TIMEOUT)
      if not fine then ns.Print("asset check error: " .. tostring(r)); r = nil end
      done(r) -- nil after an error: the check goes on
    end
  end)
end

local function RecordModel(e, r)
  Store().models[ModelKey(e)] = { name = r.name, found = r.found, loaded = r.loaded, fileID = r.fileID, anims = r.anims }
end

---------------------------------------------------------------------------
-- /dl assets: everything at once (no sounds are played); models one by one in a small box
---------------------------------------------------------------------------
local probe, probing

local function ProbeModels(i, missing)
  local e = MODELS[i]
  if not e then
    probe:Hide()
    probing = false
    ns.Print(("models: %d of %d found%s"):format(#MODELS - #missing, #MODELS,
      #missing > 0 and (" (missing: " .. table.concat(missing, ", ") .. ")") or ""))
    ns.Print("done; results are saved for the next session. Open the Blizzard assets page to see and hear each one.")
    return
  end
  probe:Show()
  LoadAndEvaluate(probe, e, function() return true end, function(r)
    if r then
      RecordModel(e, r)
      ns.Print(("  %s %s: %s"):format(ModelKey(e), e.name, Describe(r)))
      if not r.found then missing[#missing + 1] = e.name end
    end
    ProbeModels(i + 1, missing)
  end)
end

local function CheckList(title, list, check, bucket)
  local found, missing = 0, {}
  for _, e in ipairs(list) do
    local ok, detail = check(e)
    if ok ~= nil then
      Store()[bucket][e.name] = ok and (detail or true) or false
      if ok then found = found + 1 else missing[#missing + 1] = e.name end
    end
  end
  ns.Print(("%s: %d of %d found%s"):format(title, found, found + #missing,
    #missing > 0 and (" (missing: " .. table.concat(missing, ", ") .. ")") or ""))
end

local function CheckAll()
  if probing then ns.Print("the asset check is still running"); return end
  probing = true
  DopamineLootDB.assetCheck = nil -- a fresh record
  local s = Store()
  local version, build = GetBuildInfo()
  s.client, s.when = ("%s.%s"):format(version or "?", build or "?"), date("%Y-%m-%d %H:%M")
  ns:ShowLog()
  ns.Print("asset check (client " .. s.client .. ")")
  CheckList("textures and atlases", TEXTURES, CheckTexture, "textures")
  CheckList("fonts", FONTS, CheckFont, "fonts")
  CheckList("sound kits (in the table; press Play on the page to hear them)", SOUNDS, CheckKit, "kits")
  if not probe then
    -- on WorldFrame: hiding the UI (Alt+Z) mid-check would unload a model on UIParent
    probe = CreateFrame("PlayerModel", nil, WorldFrame)
    probe:SetSize(120, 120)
    probe:SetPoint("BOTTOMLEFT", 20, 140)
    probe:SetFrameStrata("DIALOG")
    probe:SetScript("OnModelLoaded", OnModelLoaded)
  end
  ns.Print(("checking %d models one by one (each shows in a box at the bottom left)"):format(#MODELS))
  ProbeModels(1, {})
end

ns.AddCommand("assets", "check which Blizzard models, textures, fonts and sounds this client has", CheckAll)

---------------------------------------------------------------------------
-- The "Blizzard assets" page: a viewer per kind, stepped with < and >
---------------------------------------------------------------------------
local panel, sub
local view = {}

local function Stepper(parent, list, width, onPick)
  local UI = ns.UI
  local s = CreateFrame("Frame", nil, parent)
  s:SetSize(width + 64, 22)
  local prev = UI.Button(s, "<", 26, function() s:Set(s.i - 1, true) end)
  prev:SetPoint("LEFT")
  local text = UI.Label(s, "GameFontHighlightSmall", "")
  text:SetWidth(width)
  text:SetJustifyH("CENTER")
  if text.SetWordWrap then text:SetWordWrap(false) end
  text:SetPoint("LEFT", prev, "RIGHT", 4, 0)
  local nxt = UI.Button(s, ">", 26, function() s:Set(s.i + 1, true) end)
  nxt:SetPoint("LEFT", text, "RIGHT", 4, 0)
  s.i = 1
  function s:Set(i, byUser)
    self.i = (i - 1) % #list + 1
    text:SetText(("%d/%d  %s"):format(self.i, #list, list[self.i].name))
    onPick(list[self.i], byUser)
  end
  return s
end

local function Box(parent, w, h)
  local b = CreateFrame("Frame", nil, parent, "BackdropTemplate")
  b:SetSize(w, h)
  b:SetBackdrop({
    bgFile = WHITE, edgeFile = "Interface\\Tooltips\\UI-Tooltip-Border",
    edgeSize = 12, insets = { left = 3, right = 3, top = 3, bottom = 3 },
  })
  b:SetBackdropColor(0.05, 0.05, 0.07, 1)
  b:SetBackdropBorderColor(0.4, 0.35, 0.28, 1)
  return b
end

local function PlayAnim(a)
  if not (view.model and a) then return end
  view.anim = a
  local ok = pcall(view.model.SetAnimation, view.model, a)
  view.animText:SetText(("animation %d%s%s"):format(a, ANIM_NAMES[a] and (" = " .. ANIM_NAMES[a]) or "",
    ok and "" or " (failed)"))
end

local function ShowModel(e)
  view.entry = e
  local m = view.model
  if not m:IsVisible() then return end -- set again when the page shows (models drop while hidden)
  view.info:SetText("loading...")
  view.animText:SetText("")
  view.facing, view.zoom = 0, 1
  local token = {}
  view.token = token
  LoadAndEvaluate(m, e, function() return view.token == token and m:IsVisible() end, function(r)
    if not r then return end
    pcall(m.SetFacing, m, 0)
    pcall(m.SetCamDistanceScale, m, 1)
    RecordModel(e, r)
    view.anims, view.animI = r.animList, 0
    view.info:SetText(Describe(r))
    ns.Print(("model %s %s: %s"):format(ModelKey(e), e.name, Describe(r)))
  end)
end

local function StepAnim(d)
  local list = view.anims
  if not list or #list == 0 then return end
  view.animI = ((view.animI or 0) + d - 1) % #list + 1
  PlayAnim(list[view.animI])
end

local function ShowTexture(e, byUser)
  local t, add = view.tex, view.addBlend
  t:SetTexCoord(0, 1, 0, 1)
  local found, detail = CheckTexture(e)
  if byUser then Store().textures[e.name] = found and (detail or true) or false end
  if e.atlas then
    local info = C_Texture and C_Texture.GetAtlasInfo and C_Texture.GetAtlasInfo(e.atlas)
    if info then
      pcall(t.SetAtlas, t, e.atlas, false)
      local w, h = info.width or 100, info.height or 100
      local k = math.min(170 / math.max(w, 1), 110 / math.max(h, 1))
      t:SetSize(w * k, h * k)
    else
      t:SetTexture(nil)
    end
  else
    t:SetTexture(e.file)
    t:SetSize(100, 100)
  end
  if add == nil then add = e.add end
  t:SetBlendMode(add and "ADD" or "BLEND")
  view.texInfo:SetText(("%s %s%s"):format(e.atlas and "atlas" or "texture", Mark(found),
    detail and (", " .. detail) or ""))
end

local function ShowFont(e, byUser)
  local found, detail = CheckFont(e)
  if byUser then Store().fonts[e.name] = found and (detail or true) or false end
  local ok = pcall(view.sample.SetFont, view.sample, e.file, 22, "OUTLINE")
  view.sample:SetText(ok and FONT_SAMPLE or "")
  view.fontInfo:SetText(Mark(found and ok))
end

local function Create()
  local UI = ns.UI
  panel = CreateFrame("Frame")
  panel:Hide() -- shown by the Settings window, so OnShow fires on every open
  panel.name = "Blizzard assets"

  local title = UI.Label(panel, "GameFontNormalLarge", "Blizzard assets")
  title:SetPoint("TOPLEFT", 16, -16)
  local intro = UI.Label(panel, "GameFontHighlightSmall",
    "The game's own chests, glows, sounds and fonts that could join the show. Step through them with < and >; " ..
    "results are logged and saved.")
  intro:SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -6)
  intro:SetWidth(600)
  local all = UI.Button(panel, "Check everything", 140, CheckAll)
  all:SetPoint("TOPLEFT", intro, "BOTTOMLEFT", -2, -10)
  UI.Tip(all, "Checks every candidate below and logs found or missing (/dl assets). Plays no sounds; " ..
    "the models flash by in a small box at the bottom left.")
  local log = UI.Button(panel, "Open log", 90, function() ns:ShowLog() end)
  log:SetPoint("LEFT", all, "RIGHT", 6, 0)

  ---------------------------------------------------------------- left: models
  local mLabel = UI.Label(panel, "GameFontNormal", "Chests and sacks (3D)")
  mLabel:SetPoint("TOPLEFT", all, "BOTTOMLEFT", 2, -14)
  local mStep = Stepper(panel, MODELS, 196, ShowModel)
  mStep:SetPoint("TOPLEFT", mLabel, "BOTTOMLEFT", -2, -4)
  local box = Box(panel, 264, 190)
  box:SetPoint("TOPLEFT", mStep, "BOTTOMLEFT", 0, -4)
  local m = CreateFrame("PlayerModel", nil, box)
  m:SetPoint("TOPLEFT", 4, -4)
  m:SetPoint("BOTTOMRIGHT", -4, 4)
  m:SetScript("OnModelLoaded", OnModelLoaded)
  -- drag to turn, wheel to zoom
  m:EnableMouse(true)
  m:EnableMouseWheel(true)
  m:SetScript("OnMouseDown", function(self) self.dragX = GetCursorPosition() end)
  m:SetScript("OnMouseUp", function(self) self.dragX = nil end)
  m:SetScript("OnUpdate", function(self)
    if not self.dragX then return end
    local x = GetCursorPosition()
    view.facing = (view.facing or 0) + (x - self.dragX) * 0.01
    self.dragX = x
    pcall(self.SetFacing, self, view.facing)
  end)
  m:SetScript("OnMouseWheel", function(self, d)
    view.zoom = math.min(math.max((view.zoom or 1) - d * 0.1, 0.2), 4)
    pcall(self.SetCamDistanceScale, self, view.zoom)
    view.animText:SetText(("zoom %.1f (wheel)"):format(view.zoom))
  end)
  view.model = m
  box:SetScript("OnShow", function() if view.entry then ShowModel(view.entry) end end)
  local info = UI.Label(panel, "GameFontHighlightSmall", "")
  info:SetPoint("TOPLEFT", box, "BOTTOMLEFT", 2, -4)
  info:SetWidth(270)
  view.info = info

  local aPrev = UI.Button(panel, "< anim", 64, function() StepAnim(-1) end)
  aPrev:SetPoint("TOPLEFT", info, "BOTTOMLEFT", -2, -8)
  local aNext = UI.Button(panel, "anim >", 64, function() StepAnim(1) end)
  aNext:SetPoint("LEFT", aPrev, "RIGHT", 4, 0)
  UI.Tip(aNext, "Play the next animation this model has (from the scan).")
  local aBox = UI.NumberBox(panel, 40, function() return view.anim or 0 end, function(v) PlayAnim(math.floor(v)) end,
    0, 999, "Type an animation number and press Enter to play it.")
  aBox:SetPoint("LEFT", aNext, "RIGHT", 10, 0)
  local quick = aPrev
  -- the animations every chest has (the scan found 0 and 146-149 on all of them)
  for i, a in ipairs({ 0, 146, 147, 148, 149 }) do
    local b = UI.Button(panel, tostring(a), 48, function() PlayAnim(a) end)
    if i == 1 then b:SetPoint("TOPLEFT", aPrev, "BOTTOMLEFT", 0, -4) else b:SetPoint("LEFT", quick, "RIGHT", 4, 0) end
    UI.Tip(b, ("Play animation %d (%s)."):format(a, ANIM_NAMES[a]))
    quick = b
  end
  local animText = UI.Label(panel, "GameFontHighlightSmall", "")
  animText:SetPoint("TOPLEFT", aPrev, "BOTTOMLEFT", 2, -32)
  view.animText = animText

  ---------------------------------------------------------------- right: textures, sounds, fonts
  local X = 310
  local tLabel = UI.Label(panel, "GameFontNormal", "Textures and atlases")
  tLabel:SetPoint("TOPLEFT", all, "BOTTOMLEFT", X, -14)
  local tStep = Stepper(panel, TEXTURES, 196, ShowTexture)
  tStep:SetPoint("TOPLEFT", tLabel, "BOTTOMLEFT", -2, -4)
  local tBox = Box(panel, 264, 120)
  tBox:SetPoint("TOPLEFT", tStep, "BOTTOMLEFT", 0, -4)
  local tex = tBox:CreateTexture(nil, "ARTWORK")
  tex:SetPoint("CENTER")
  view.tex = tex
  local texInfo = UI.Label(panel, "GameFontHighlightSmall", "")
  texInfo:SetPoint("TOPLEFT", tBox, "BOTTOMLEFT", 2, -4)
  view.texInfo = texInfo
  local blend = UI.Button(panel, "Blend", 60, function()
    if view.addBlend == nil then view.addBlend = true elseif view.addBlend then view.addBlend = false else view.addBlend = nil end
    tStep:Set(tStep.i, true)
  end)
  blend:SetPoint("TOPRIGHT", tBox, "BOTTOMRIGHT", 0, -2)
  UI.Tip(blend, "Cycle how the texture is drawn: as its kind suits (glows glow), always glowing (ADD), always plain.")

  local sLabel = UI.Label(panel, "GameFontNormal", "Sounds")
  sLabel:SetPoint("TOPLEFT", tBox, "BOTTOMLEFT", 0, -34)
  local sInfo = UI.Label(panel, "GameFontHighlightSmall", "")
  local sStep = Stepper(panel, SOUNDS, 196, function(s)
    local found, detail = CheckKit(s)
    sInfo:SetText(found == nil and "press Play" or (Mark(found) .. (detail and (", " .. detail) or "") .. "; press Play"))
  end)
  sStep:SetPoint("TOPLEFT", sLabel, "BOTTOMLEFT", -2, -4)
  local play = UI.Button(panel, "Play", 60, function()
    local s = SOUNDS[sStep.i]
    local result = PlayEntry(s)
    Store().sounds[s.name] = result
    sInfo:SetText(result)
    ns.Print(("sound %s: %s"):format(s.name, result))
  end)
  play:SetPoint("TOPLEFT", sStep, "BOTTOMLEFT", 0, -4)
  UI.Tip(play, "Play it once (with the sound channel from the main page).")
  sInfo:SetPoint("LEFT", play, "RIGHT", 8, 0)
  sInfo:SetWidth(196)

  local fLabel = UI.Label(panel, "GameFontNormal", "Fonts")
  fLabel:SetPoint("TOPLEFT", play, "BOTTOMLEFT", 2, -16)
  local fStep = Stepper(panel, FONTS, 196, ShowFont)
  fStep:SetPoint("TOPLEFT", fLabel, "BOTTOMLEFT", -2, -4)
  local sample = panel:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  sample:SetPoint("TOPLEFT", fStep, "BOTTOMLEFT", 2, -8)
  sample:SetTextColor(1, 0.82, 0)
  view.sample = sample
  local fontInfo = UI.Label(panel, "GameFontHighlightSmall", "")
  fontInfo:SetPoint("TOPLEFT", sample, "BOTTOMLEFT", 0, -6)
  view.fontInfo = fontInfo


  -- fill every viewer now: sub-pages may not get OnShow on their first open
  view.entry = MODELS[1]
  mStep:Set(1)
  tStep:Set(1)
  sStep:Set(1)
  fStep:Set(1)

  if Settings.RegisterCanvasLayoutSubcategory and ns.settingsCategory then
    sub = Settings.RegisterCanvasLayoutSubcategory(ns.settingsCategory, panel, "Blizzard assets")
  else
    sub = Settings.RegisterCanvasLayoutCategory(panel, ns.TITLE .. " - Blizzard assets")
    Settings.RegisterAddOnCategory(sub)
  end
end

function ns:OpenAssets()
  if not panel then Create() end
  Settings.OpenToCategory(sub:GetID())
end

ns.OnInit(function() if not panel then Create() end end)

---------------------------------------------------------------------------
-- Armor test (/dl armortest): can this client dress a mannequin? A throwaway probe for "armor in
-- 3D", removed once the real thing is built. Left: your body wearing the item; right: a close-up
-- of its slot. Results go to the log and DopamineLootDB.armorTest. [V] all of it.
---------------------------------------------------------------------------
local ARMOR_SLOTS = { -- equipLoc -> inventory slot
  INVTYPE_HEAD = 1, INVTYPE_SHOULDER = 3, INVTYPE_BODY = 4, INVTYPE_CHEST = 5, INVTYPE_ROBE = 5,
  INVTYPE_WAIST = 6, INVTYPE_LEGS = 7, INVTYPE_FEET = 8, INVTYPE_WRIST = 9, INVTYPE_HAND = 10,
  INVTYPE_CLOAK = 15, INVTYPE_TABARD = 19,
}
local SLOT_WORDS = {
  head = 1, shoulder = 3, shoulders = 3, shirt = 4, chest = 5, waist = 6, belt = 6, legs = 7, feet = 8,
  boots = 8, wrist = 9, wrists = 9, hands = 10, gloves = 10, back = 15, cloak = 15, tabard = 19,
}
-- close-up per slot: { toward the camera, down (shows higher parts), facing }. First guesses, tuned
-- in game with /dl armortest frame
local CLOSEUP = {
  [1] = { 1.6, -0.75 }, [3] = { 1.3, -0.6 }, [4] = { 1.1, -0.35 }, [5] = { 1.1, -0.35 },
  [6] = { 1.3, -0.05 }, [7] = { 0.8, 0.3 }, [8] = { 1.3, 0.75 }, [9] = { 1.3, 0 }, [10] = { 1.3, 0 },
  [15] = { 0.8, -0.3, math.pi }, [19] = { 1.1, -0.35 },
}
local TRYON = { [0] = "success", "wrong race", "not equippable", "data pending" }
local DRESS_METHODS = { "SetUnit", "SetAutoDress", "Undress", "TryOn", "UndressSlot", "SetSheathed",
  "IsGeoReady", "IsSlotVisible", "SetPortraitZoom", "SetKeepModelOnHide", "SetUseTransmogSkin" }
local armor, armorRun -- the test window; the current run { link, slot, bare }

local function ArmorWindow()
  if armor then return armor end
  local f = CreateFrame("Frame", nil, UIParent)
  f:SetSize(440, 380)
  f:SetPoint("CENTER", -220, 0)
  f:SetFrameStrata("DIALOG")
  local bg = f:CreateTexture(nil, "BACKGROUND")
  bg:SetAllPoints()
  bg:SetTexture(WHITE)
  bg:SetVertexColor(0, 0, 0, 0.75)
  f.title = f:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  f.title:SetPoint("TOP", 0, -10)
  local close = CreateFrame("Button", nil, f, "UIPanelCloseButton")
  close:SetPoint("TOPRIGHT", 2, 2)
  f.models = {}
  for i = 1, 2 do
    local ok, m = pcall(CreateFrame, "DressUpModel", nil, f)
    if not ok then return nil, m end
    m:SetSize(200, 330)
    m:SetPoint("BOTTOMLEFT", 13 + (i - 1) * 214, 12)
    f.models[i] = m
  end
  armor = f
  return f
end

local function Place(m, slot, closeup)
  local c = closeup and CLOSEUP[slot] or nil
  m:SetPosition(c and c[1] or 0, 0, c and c[2] or 0)
  m:SetFacing(c and c[3] or 0.4) -- turned a little toward you
end

local function Dress(m, i)
  local run = armorRun
  local tries = 0
  local function Apply(why)
    if run ~= armorRun then return end -- a newer test started
    tries = tries + 1
    if run.bare and m.Undress then m:Undress() end
    local ok, r = pcall(m.TryOn, m, run.link)
    Place(m, run.slot, i == 2)
    local geo = m.IsGeoReady and select(2, pcall(m.IsGeoReady, m))
    local vis = m.IsSlotVisible and select(2, pcall(m.IsSlotVisible, m, run.slot))
    local line = ("%s (%s): TryOn %s, geo ready %s, slot visible %s"):format(i == 1 and "body" or "close-up",
      why, ok and (TRYON[r] or tostring(r)) or ("error " .. tostring(r)), tostring(geo), tostring(vis))
    ns.Print("  " .. line)
    local log = DopamineLootDB.armorTest.lines
    log[#log + 1] = line
    if ok and r == 3 and tries < 4 then C_Timer.After(1, function() Apply("retry") end) end
  end
  local loaded = false
  m:SetScript("OnModelLoaded", function()
    if loaded then return end -- TryOn may reload the model: apply only on the first load
    loaded = true
    Apply("model loaded")
  end)
  m:Show()
  if m.SetAutoDress then m:SetAutoDress(not run.bare) end
  m:SetUnit("player")
  C_Timer.After(0.6, function() if not loaded then Apply("0.6 s, no load event yet") end end)
end

local function ArmorTest(arg)
  local words = {}
  for w in (arg or ""):gmatch("%S+") do words[#words + 1] = w:lower() end
  if words[1] == "off" then if armor then armor:Hide() end return end
  if words[1] == "frame" then -- tune the close-up: /dl armortest frame <toward> <down> [facing]
    local run, c = armorRun, armorRun and CLOSEUP[armorRun.slot]
    if not (run and armor and c) then ns.Print("run /dl armortest first"); return ns:ShowLog() end
    c[1], c[2], c[3] = tonumber(words[2]) or c[1], tonumber(words[3]) or c[2], tonumber(words[4]) or c[3]
    Place(armor.models[2], run.slot, true)
    ns.Print(("close-up for slot %d: %s %s %s"):format(run.slot, c[1], c[2], tostring(c[3] or 0.4)))
    return ns:ShowLog()
  end
  local bare = true
  if words[#words] == "dressed" then bare = false; table.remove(words) end
  local what = words[1] or "chest"
  local link = SLOT_WORDS[what] and GetInventoryItemLink("player", SLOT_WORDS[what])
  if not link then
    local id = tonumber(what) or tonumber((arg or ""):match("item:(%d+)"))
    if not id and not SLOT_WORDS[what] then
      ns.Print("usage: /dl armortest [chest | legs | head | ... | itemID] [dressed]; /dl armortest off")
      return ns:ShowLog()
    end
    if not id then ns.Print("nothing equipped in " .. what); return ns:ShowLog() end
    link = "item:" .. id
  end
  local GetInstant = (C_Item and C_Item.GetItemInfoInstant) or GetItemInfoInstant
  local equipLoc = select(4, GetInstant(link))
  local slot = SLOT_WORDS[what] or ARMOR_SLOTS[equipLoc or ""]
  if not slot then ns.Print(("%s is not armor this test can dress (%s)"):format(link, tostring(equipLoc))); return ns:ShowLog() end

  ns:ShowLog()
  DopamineLootDB.armorTest = { when = date("%Y-%m-%d %H:%M"), item = link:match("item:(%d+)"), slot = slot, lines = {} }
  local probe = CreateFrame("Frame") -- what exists: methods on a DressUpModel, the game's own dressing room
  local okWidget, test = pcall(CreateFrame, "DressUpModel", nil, probe)
  local found = {}
  for _, k in ipairs(DRESS_METHODS) do
    if okWidget and test[k] then found[#found + 1] = k else found[#found + 1] = k .. "=MISSING" end
  end
  local env = ("DressUpFrame.ModelScene %s, DressUpModelFrame %s, CreateFrame ModelScene %s, C_TransmogCollection %s"):format(
    tostring(DressUpFrame and DressUpFrame.ModelScene ~= nil), tostring(rawget(_G, "DressUpModelFrame") ~= nil),
    tostring(pcall(CreateFrame, "ModelScene", nil, probe)), tostring(C_TransmogCollection ~= nil))
  ns.Print("armor test: " .. link .. (bare and " on a bare body" or " over your own gear"))
  ns.Print("  DressUpModel: " .. (okWidget and table.concat(found, " ") or ("cannot be created: " .. tostring(test))))
  ns.Print("  " .. env)
  DopamineLootDB.armorTest.methods = okWidget and table.concat(found, " ") or tostring(test)
  DopamineLootDB.armorTest.env = env
  if not okWidget then return end
  local f, err = ArmorWindow()
  if not f then ns.Print("  the test window failed: " .. tostring(err)); return end
  armorRun = { link = link, slot = slot, bare = bare }
  f.title:SetText(("Armor test: slot %d  (/dl armortest off)"):format(slot))
  f:Show()
  for i, m in ipairs(f.models) do Dress(m, i) end
end

ns.AddCommand("armortest", "test armor on a mannequin: /dl armortest [chest | legs | ... | itemID] [dressed]", ArmorTest)

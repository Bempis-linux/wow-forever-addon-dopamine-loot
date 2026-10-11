-- Dopamine Loot settings: a page under Options > AddOns (also /dl and /dl settings).
-- Two columns: popups + sound on the left, loot rain + other on the right. Every effect has a
-- Test button; tests that take a number have a number field beside them.
local _, ns = ...

local panel, category
local refreshers = {} -- each control re-reads its setting when the page opens
local COL2 = 320

local QUALITIES = {
  { value = 0, label = "|cff9d9d9dPoor|r and up" },
  { value = 1, label = "|cffffffffCommon|r and up" },
  { value = 2, label = "|cff1eff00Uncommon|r and up (recommended)" },
  { value = 3, label = "|cff0070ddRare|r and up" },
  { value = 4, label = "|cffa335eeEpic|r and up" },
}
local TEST_WORDS = { [0] = "poor", "common", "uncommon", "rare", "epic", "legendary" }

local function Label(parent, font, text)
  local fs = parent:CreateFontString(nil, "OVERLAY", font)
  fs:SetJustifyH("LEFT")
  fs:SetText(text or "")
  return fs
end

local function Tip(frame, tip)
  if not tip then return end
  frame:SetScript("OnEnter", function(self)
    GameTooltip:SetOwner(self, "ANCHOR_RIGHT")
    GameTooltip:SetText(tip, 1, 1, 1, 1, true)
    GameTooltip:Show()
  end)
  frame:SetScript("OnLeave", function(self) if GameTooltip:IsOwned(self) then GameTooltip:Hide() end end)
end

local function Check(parent, label, tip)
  local cb = CreateFrame("CheckButton", nil, parent, "UICheckButtonTemplate")
  cb:SetSize(26, 26)
  local text = (cb.Text or cb.text) --[[@as FontString?]]
  if not text then
    text = cb:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    text:SetPoint("LEFT", cb, "RIGHT", 2, 0)
  end
  text:SetFontObject("GameFontHighlight")
  text:SetText(label)
  cb.label = text
  Tip(cb, tip)
  return cb
end

-- A checkbox bound to a "no..." setting flag (checked = feature on)
local function Toggle(parent, label, key, tip)
  local cb = Check(parent, label, tip)
  cb:SetScript("OnClick", function(self) ns.settings[key] = (not self:GetChecked()) or nil end)
  refreshers[#refreshers + 1] = function() cb:SetChecked(not ns.settings[key]) end
  return cb
end

-- Checkboxes that act as one choice: picking one unpicks the others
local function Choice(parent, options, get, set, below, extra)
  local rows, prev = {}, below
  for _, o in ipairs(options) do
    local cb = Check(parent, o.label, o.tip)
    cb:SetPoint("TOPLEFT", prev, "BOTTOMLEFT", 0, prev == below and -4 or 2)
    cb.value = o.value
    cb:SetScript("OnClick", function(self)
      set(self.value)
      for _, r in ipairs(rows) do r:SetChecked(r.value == self.value) end
    end)
    if extra then extra(cb, o) end
    rows[#rows + 1] = cb
    prev = cb
  end
  refreshers[#refreshers + 1] = function()
    local v = get()
    for _, r in ipairs(rows) do r:SetChecked(r.value == v) end
  end
  return prev
end

local function Button(parent, text, width, onClick)
  local b = CreateFrame("Button", nil, parent, "UIPanelButtonTemplate")
  b:SetSize(width, 22)
  b:SetText(text)
  b:SetScript("OnClick", onClick)
  return b
end

-- A small number field: Enter or clicking away keeps the value (clamped), Escape undoes
local function NumberBox(parent, width, get, set, min, max, tip, fmt)
  local e = CreateFrame("EditBox", nil, parent, "InputBoxTemplate")
  e:SetSize(width, 20)
  e:SetAutoFocus(false)
  e:SetJustifyH("CENTER")
  e:SetMaxLetters(5)
  local function Show() e:SetText((fmt or tostring)(get())) end
  local function Commit()
    local v = tonumber((e:GetText():gsub(",", "."))) -- "0,55" where a comma is the decimal mark
    if v then set(math.min(math.max(v, min), max)) end
    Show()
  end
  e:SetScript("OnEnterPressed", function(self) Commit(); self:ClearFocus() end)
  e:HookScript("OnEditFocusLost", Commit) -- hook: the template clears its highlight here
  e:SetScript("OnEscapePressed", function(self) Show(); self:ClearFocus() end)
  Tip(e, tip)
  refreshers[#refreshers + 1] = Show
  e.Show_ = Show
  if ns.settings then Show() end -- filled in now too: OnShow may not fire for a page shown on its first open
  return e
end

-- A drag slider with its number field beside it; both change the setting at once, and onChange
-- runs on every move (the live preview redraws). label above, min..max in steps.
local function Slider(parent, label, width, min, max, step, get, set, tip, fmt, onChange)
  fmt = fmt or function(v) return tostring(math.floor(v * 100 + 0.5) / 100) end
  local text = Label(parent, "GameFontHighlight", label)
  local s = CreateFrame("Slider", nil, parent, "BackdropTemplate")
  s:SetOrientation("HORIZONTAL")
  s:SetSize(width, 16)
  s:SetPoint("TOPLEFT", text, "BOTTOMLEFT", 0, -4)
  s:SetBackdrop({
    bgFile = "Interface\\Buttons\\UI-SliderBar-Background",
    edgeFile = "Interface\\Buttons\\UI-SliderBar-Border",
    tile = true, tileSize = 8, edgeSize = 8, insets = { left = 3, right = 3, top = 6, bottom = 6 },
  })
  s:SetThumbTexture("Interface\\Buttons\\UI-SliderBar-Button-Horizontal")
  s:SetMinMaxValues(min, max)
  s:SetValueStep(step)
  if s.SetObeyStepOnDrag then s:SetObeyStepOnDrag(true) end
  s:EnableMouseWheel(true)
  local box
  local quiet = false
  local function Apply(v)
    v = math.min(math.max(math.floor(v / step + 0.5) * step, min), max)
    set(v)
    if box then box:SetText(fmt(v)) end
    if onChange then onChange() end
  end
  s:SetScript("OnValueChanged", function(_, v) if not quiet then Apply(v) end end)
  s:SetScript("OnMouseWheel", function(self, d) self:SetValue(self:GetValue() + d * step) end)
  box = NumberBox(parent, 44, get, function(v)
    quiet = true; s:SetValue(v); quiet = false
    Apply(v)
  end, min, max, tip, fmt)
  box:SetPoint("LEFT", s, "RIGHT", 10, 0)
  Tip(s, tip)
  local function Sync() quiet = true; s:SetValue(get()); quiet = false end
  refreshers[#refreshers + 1] = Sync
  if ns.settings then Sync() end
  s.label = text
  return s, text
end

local function RefreshAll() for _, r in ipairs(refreshers) do r() end end

-- Shared with the "Popup look" page (Look.lua)
ns.UI = {
  Label = Label, Tip = Tip, Check = Check, Toggle = Toggle, Choice = Choice, Button = Button,
  NumberBox = NumberBox, Slider = Slider, Refresh = RefreshAll,
}

local function CreatePanel()
  panel = CreateFrame("Frame")
  panel.name = ns.TITLE

  local title = Label(panel, "GameFontNormalLarge", ns.TITLE)
  title:SetPoint("TOPLEFT", 16, -16)
  local version = Label(panel, "GameFontDisableSmall", "")
  version:SetPoint("LEFT", title, "RIGHT", 8, -1)
  refreshers[#refreshers + 1] = function() version:SetText("v" .. ns.Version()) end
  local intro = Label(panel, "GameFontHighlightSmall",
    "Loot that feels like loot: your drops pop up turning in 3D, and big hauls rain down.")
  intro:SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -6)

  ---------------------------------------------------------------- left: popups
  local popups = Label(panel, "GameFontNormal", "Popups")
  popups:SetPoint("TOPLEFT", intro, "BOTTOMLEFT", 0, -18)
  local popOn = Toggle(panel, "Show loot popups", "noPopup",
    "A card at the top of the screen for each item you loot, with the item turning in 3D.")
  popOn:SetPoint("TOPLEFT", popups, "BOTTOMLEFT", 0, -4)
  local minQ = Label(panel, "GameFontHighlightSmall", "Pop up for (Test shows one of that quality):")
  minQ:SetPoint("TOPLEFT", popOn, "BOTTOMLEFT", 4, -6)
  local last = Choice(panel, QUALITIES, function() return ns.MinQuality() end,
    function(v) ns.settings.minQuality = v end, minQ, function(cb, o)
      local test = Button(panel, "Test", 56, function() ns.RunCommand("test", TEST_WORDS[o.value]) end)
      test:SetPoint("LEFT", cb, "LEFT", 250, 0)
    end)
  local legendary = Button(panel, "Test legendary", 112, function() ns.RunCommand("test", "legendary") end)
  legendary:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 194, -2)

  local zoomLabel = Button(panel, "Popup look and live preview...", 220, function() ns:OpenLook() end)
  zoomLabel:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 4, -32)
  Tip(zoomLabel, "Style, size, 3D zoom, weapon tilt, spin and time on screen, with a live popup preview.")

  ---------------------------------------------------------------- left: sound
  local sound = Label(panel, "GameFontNormal", "Sound")
  sound:SetPoint("TOPLEFT", zoomLabel, "BOTTOMLEFT", -4, -22)
  local soundOn = Toggle(panel, "Play loot sounds", "noSound", "A sound for each popup, louder for better items.")
  soundOn:SetPoint("TOPLEFT", sound, "BOTTOMLEFT", 0, -4)
  last = Choice(panel, {
    { value = "SFX", label = "With sound effects", tip = "Follows your sound-effects volume (and its mute)." },
    { value = "Master", label = "With the master volume", tip = "Plays even with sound effects muted." },
  }, function() return ns.settings.soundChannel or "SFX" end, function(v) ns.settings.soundChannel = v end, soundOn)
  local checkSounds = Button(panel, "Check all sounds", 130, function() ns.RunCommand("sounds") end)
  checkSounds:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 4, -8)
  local arrivalOn = Toggle(panel, "Arrival sounds", "noArrivalSound",
    "A chime with the sparks for Rare and Epic, a boom and chord with the Legendary shockwave.")
  arrivalOn:SetPoint("TOPLEFT", checkSounds, "BOTTOMLEFT", -4, -6)
  local prev
  for _, q in ipairs({ "rare", "epic", "legendary" }) do
    local b = Button(panel, q:sub(1, 1):upper() .. q:sub(2), 80, function() ns.RunCommand("test", q) end)
    if prev then b:SetPoint("LEFT", prev, "RIGHT", 4, 0) else b:SetPoint("TOPLEFT", arrivalOn, "BOTTOMLEFT", 4, -4) end
    Tip(b, "Show a " .. q .. " test popup with its arrival and sound.")
    prev = b
  end

  ---------------------------------------------------------------- right: loot rain
  local rain = Label(panel, "GameFontNormal", "Loot rain")
  rain:SetPoint("TOPLEFT", intro, "BOTTOMLEFT", COL2, -18)
  local rainOn = Toggle(panel, "Rain big hauls", "noRain",
    "When you loot several items at once, they spray up and bounce down the screen. " ..
    "In combat it waits until the fight is over.")
  rainOn:SetPoint("TOPLEFT", rain, "BOTTOMLEFT", 0, -4)

  local minLabel = Label(panel, "GameFontHighlight", "Rain from")
  minLabel:SetPoint("TOPLEFT", rainOn, "BOTTOMLEFT", 4, -10)
  local minBox = NumberBox(panel, 36, function() return ns.RainMin() end,
    function(v) ns.settings.rainMin = math.floor(v) end, 2, 20,
    "How many items looted together make it rain (2 to 20, default 3). Fewer get popups.")
  minBox:SetPoint("LEFT", minLabel, "RIGHT", 10, 0)
  local minAfter = Label(panel, "GameFontHighlight", "items looted at once")
  minAfter:SetPoint("LEFT", minBox, "RIGHT", 8, 0)

  local floorLabel = Label(panel, "GameFontHighlight", "Land")
  floorLabel:SetPoint("TOPLEFT", minLabel, "BOTTOMLEFT", 0, -16)
  local floorBox = NumberBox(panel, 36, function() return ns.settings.rainFloor or 0 end,
    function(v) ns.settings.rainFloor = math.floor(v) end, 0, 30,
    "Where falling items land, as a percent of the screen height up from the bottom " ..
    "(0 = the bottom edge, up to 30; raise it to land above your action bars).")
  floorBox:SetPoint("LEFT", floorLabel, "RIGHT", 10, 0)
  local floorAfter = Label(panel, "GameFontHighlight", "% up from the bottom")
  floorAfter:SetPoint("LEFT", floorBox, "RIGHT", 8, 0)

  local stay = Label(panel, "GameFontHighlightSmall", "Stay on screen as popups afterwards:")
  stay:SetPoint("TOPLEFT", floorLabel, "BOTTOMLEFT", 0, -16)
  last = Choice(panel, {
    { value = 2, label = "|cff1eff00Uncommon|r and up" },
    { value = 3, label = "|cff0070ddRare|r and up (recommended)" },
    { value = 4, label = "|cffa335eeEpic|r and up" },
  }, function() return ns.settings.stayQuality or 3 end, function(v) ns.settings.stayQuality = v end, stay)

  local testLabel = Label(panel, "GameFontHighlight", "Test with")
  testLabel:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 4, -12)
  local testBox = NumberBox(panel, 36, function() return ns.settings.testRain or 8 end,
    function(v) ns.settings.testRain = math.floor(v) end, 1, 60,
    "How many items the test rain drops (1 to 60). From 4 one is blue, from 8 one is purple.")
  testBox:SetPoint("LEFT", testLabel, "RIGHT", 10, 0)
  local testAfter = Label(panel, "GameFontHighlight", "items")
  testAfter:SetPoint("LEFT", testBox, "RIGHT", 8, 0)
  local testRain = Button(panel, "Test", 56, function()
    testBox:ClearFocus() -- keeps a number typed without pressing Enter
    ns.RunCommand("rain", tostring(ns.settings.testRain or 8))
  end)
  testRain:SetPoint("LEFT", testAfter, "RIGHT", 10, 0)

  ---------------------------------------------------------------- right: other
  local other = Label(panel, "GameFontNormal", "Other")
  other:SetPoint("TOPLEFT", testLabel, "BOTTOMLEFT", -4, -26)
  local debug = Check(panel, "Debug logging", "Log every loot line as it's read (in the log window).")
  debug:SetPoint("TOPLEFT", other, "BOTTOMLEFT", 0, -4)
  debug:SetScript("OnClick", function(self) ns.settings.debug = self:GetChecked() or nil end)
  refreshers[#refreshers + 1] = function() debug:SetChecked(ns.settings.debug and true or false) end
  local log = Button(panel, "Open log", 100, function() ns:ShowLog() end)
  log:SetPoint("TOPLEFT", debug, "BOTTOMLEFT", 4, -10)
  local check = Button(panel, "Check client", 110, function() ns.RunCommand("check") end)
  check:SetPoint("LEFT", log, "RIGHT", 8, 0)
  Tip(check, "Report which game features this client has (for bug reports).")

  panel:SetScript("OnShow", function() for _, r in ipairs(refreshers) do r() end end)

  -- Forever uses the retail Settings window (Options > AddOns)
  category = Settings.RegisterCanvasLayoutCategory(panel, ns.TITLE)
  Settings.RegisterAddOnCategory(category)
  ns.settingsCategory = category
end

function ns:OpenSettings()
  if not panel then CreatePanel() end
  Settings.OpenToCategory(category:GetID())
end

ns.OnInit(function() if not panel then CreatePanel() end end)
ns.AddCommand("settings", "open the settings page", function() ns:OpenSettings() end)

-- /dl (and the minimap compartment) opens the settings until the inspector exists
function ns:ToggleUI() self:OpenSettings() end

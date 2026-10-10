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
local function NumberBox(parent, width, get, set, min, max, tip)
  local e = CreateFrame("EditBox", nil, parent, "InputBoxTemplate")
  e:SetSize(width, 20)
  e:SetAutoFocus(false)
  e:SetJustifyH("CENTER")
  e:SetMaxLetters(4)
  local function Show() e:SetText(tostring(get())) end
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
  return e
end

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

  local zoomLabel = Label(panel, "GameFontHighlight", "3D item size")
  zoomLabel:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 4, -32)
  local zoom = NumberBox(panel, 40, function() return ns.settings.modelZoom or 1 end,
    function(v) ns.settings.modelZoom = v end, 0.3, 2,
    "Camera distance for item models in popups: smaller numbers show the item bigger (0.3 to 2, default 1).")
  zoom:SetPoint("LEFT", zoomLabel, "RIGHT", 12, 0)
  local zoomTest = Button(panel, "Test", 56, function() ns.RunCommand("test", "epic") end)
  zoomTest:SetPoint("LEFT", zoom, "RIGHT", 8, 0)

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

  local stay = Label(panel, "GameFontHighlightSmall", "Stay on screen as popups afterwards:")
  stay:SetPoint("TOPLEFT", minLabel, "BOTTOMLEFT", 0, -16)
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
end

function ns:OpenSettings()
  if not panel then CreatePanel() end
  Settings.OpenToCategory(category:GetID())
end

ns.OnInit(function() if not panel then CreatePanel() end end)
ns.AddCommand("settings", "open the settings page", function() ns:OpenSettings() end)

-- /dl (and the minimap compartment) opens the settings until the inspector exists
function ns:ToggleUI() self:OpenSettings() end

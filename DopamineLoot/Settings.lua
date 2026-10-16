-- Dopamine Loot settings (Options > AddOns > Dopamine Loot; also /dl and /dl settings). One topic
-- per page (docs/mockups/settings.html): Dopamine Loot (the main switches, quick tests), Popups
-- (Look.lua, custom: it has the live preview), Loot rain (RainFx.lua), Sounds and Advanced
-- (Pages.lua), and the Blizzard assets tool (Assets.lua). All but Popups and the asset tool use the
-- game's native settings layout (ns.Native below); the custom pages share the controls in ns.UI.
local _, ns = ...

local category
local refreshers = {} -- each custom control re-reads its setting when its page opens

-- "Show popups for" choices, shared with the Popups page
ns.QUALITY_CHOICES = {
  { 0, "|cff9d9d9dPoor|r and up" },
  { 1, "|cffffffffCommon|r and up" },
  { 2, "|cff1eff00Uncommon|r and up (default)" },
  { 3, "|cff0070ddRare|r and up" },
  { 4, "|cffa335eeEpic|r and up" },
}

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

-- A dropdown in the game's own style (WowStyle1DropdownTemplate, as Baganator uses on Forever):
-- options = { { value, label, tip }, ... }; shows the picked one; set runs when you pick
local function Dropdown(parent, width, options, get, set, tip)
  local d = CreateFrame("DropdownButton", nil, parent, "WowStyle1DropdownTemplate")
  d:SetWidth(width)
  local radio = true -- radio entries show the picked one themselves; plain buttons need SetText
  d:SetupMenu(function(_, root)
    radio = root.CreateRadio ~= nil
    for _, o in ipairs(options) do
      local value = o[1]
      if radio then
        root:CreateRadio(o[2], function() return get() == value end, function() set(value) end, value)
      else
        root:CreateButton(o[2], function() set(value); d:SetText(o[2]) end)
      end
    end
  end)
  local function Show()
    if d.GenerateMenu then d:GenerateMenu() end
    if not radio then
      for _, o in ipairs(options) do if o[1] == get() then d:SetText(o[2]) end end
    end
  end
  if tip then -- hooked: the template has its own enter/leave behavior
    d:HookScript("OnEnter", function(self)
      GameTooltip:SetOwner(self, "ANCHOR_RIGHT")
      GameTooltip:SetText(tip, 1, 1, 1, 1, true)
      GameTooltip:Show()
    end)
    d:HookScript("OnLeave", function(self) if GameTooltip:IsOwned(self) then GameTooltip:Hide() end end)
  end
  refreshers[#refreshers + 1] = Show
  if ns.settings then Show() end
  return d
end

local function RefreshAll() for _, r in ipairs(refreshers) do r() end end

-- Shared by the custom pages ("Popups" in Look.lua, "Blizzard assets" in Assets.lua)
ns.UI = {
  Label = Label, Tip = Tip, Check = Check, Toggle = Toggle, Choice = Choice, Button = Button,
  NumberBox = NumberBox, Slider = Slider, Dropdown = Dropdown, Refresh = RefreshAll,
}

---------------------------------------------------------------------------
-- The native pages (Blizzard's own settings layout, as BugSack uses on Forever): the game's check
-- boxes, sliders and dropdowns, laid out for us and found by the Options search box. Every setting
-- is a proxy that reads and writes ns.settings, so the /dl commands and these pages share one value.
---------------------------------------------------------------------------
local N = {}
ns.Native = N
local function Var(key) return "DOPAMINELOOT_" .. key:upper() end

-- A /dl command changed a setting: an open page (native or custom) shows the new value at once
function ns.SettingChanged(key)
  if Settings and Settings.NotifyUpdate then pcall(Settings.NotifyUpdate, Var(key)) end
  RefreshAll()
end

function N.Page(name, parent)
  if parent then return Settings.RegisterVerticalLayoutSubcategory(parent, name) end
  local cat, layout = Settings.RegisterVerticalLayoutCategory(name)
  Settings.RegisterAddOnCategory(cat)
  return cat, layout
end

function N.Header(layout, text, tip)
  if CreateSettingsListSectionHeaderInitializer then
    layout:AddInitializer(CreateSettingsListSectionHeaderInitializer(text, tip))
  end
end

-- A check box. off = the setting is a "no..." flag (checked means on), as most of ours are
function N.Toggle(cat, key, label, tip, off)
  local setting = Settings.RegisterProxySetting(cat, Var(key), Settings.VarType.Boolean, label, off and true or false,
    function() if off then return not ns.settings[key] end return ns.settings[key] and true or false end,
    function(v) if off then ns.settings[key] = (not v) or nil else ns.settings[key] = v or nil end end)
  Settings.CreateCheckbox(cat, setting, tip)
  return setting
end

-- A slider with its value at the right; fmt(v) -> text (default: the number)
function N.Slider(cat, key, label, min, max, step, default, tip, fmt)
  local setting = Settings.RegisterProxySetting(cat, Var(key), Settings.VarType.Number, label, default,
    function() return ns.settings[key] or default end,
    function(v) ns.settings[key] = v end)
  local options = Settings.CreateSliderOptions(min, max, step)
  options:SetLabelFormatter(MinimalSliderWithSteppersMixin.Label.Right,
    fmt or function(v) return tostring(math.floor(v * 100 + 0.5) / 100) end)
  Settings.CreateSlider(cat, setting, options, tip)
  return setting
end

-- A dropdown: options = { { value, label, tip }, ... } or a function returning that; the default
-- value is stored as nil (every reader falls back to it); onSet(v) runs after a pick
function N.Choice(cat, key, label, options, default, tip, onSet)
  local kind = type(default) == "number" and Settings.VarType.Number or Settings.VarType.String
  local setting = Settings.RegisterProxySetting(cat, Var(key), kind, label, default,
    function() local v = ns.settings[key]; if v == nil then return default end return v end,
    function(v)
      if v == default then ns.settings[key] = nil else ns.settings[key] = v end
      if onSet then onSet(v) end
    end)
  local function Options()
    local c = Settings.CreateControlTextContainer()
    for _, o in ipairs(type(options) == "function" and options() or options) do c:Add(o[1], o[2], o[3]) end
    return c:GetData()
  end
  Settings.CreateDropdown(cat, setting, Options, tip)
  return setting
end

-- A button on its own row (label on the left, the button on the right)
function N.Button(layout, label, text, onClick, tip)
  if CreateSettingsButtonInitializer then
    layout:AddInitializer(CreateSettingsButtonInitializer(label, text, onClick, tip, true))
  end
end

---------------------------------------------------------------------------
-- The first page: the three main switches and quick tests
---------------------------------------------------------------------------
local TESTS = { { 2, "|cff1eff00Uncommon|r" }, { 3, "|cff0070ddRare|r" }, { 4, "|cffa335eeEpic|r" }, { 5, "|cffff8000Legendary|r" } }
local TEST_WORDS = { [2] = "uncommon", [3] = "rare", [4] = "epic", [5] = "legendary" }

local function CreateGeneral()
  local cat, layout = N.Page(ns.TITLE)
  category = cat
  ns.settingsCategory = cat
  N.Header(layout, "Features")
  N.Toggle(cat, "noPopup", "Loot popups", "A card at the top of the screen for each item you loot, the item turning in 3D. (/dl popup off)", true)
  N.Toggle(cat, "noRain", "Loot rain", "When you loot several things at once, they spray up and bounce down; the best lands last. In combat it waits until the fight is over. (/dl rain off)", true)
  ns.soundSetting = N.Toggle(cat, "noSound", "Sounds", "Every Dopamine Loot sound at once. (/dl sound off)", true)
  N.Header(layout, "Try it")
  N.Choice(cat, "testQuality", "Test popup quality", TESTS, 4, "Which quality the Test popup button shows.")
  N.Button(layout, "A popup", "Test popup", function() ns.RunCommand("test", TEST_WORDS[ns.settings.testQuality or 4]) end,
    "Show a test popup of the quality picked above (/dl test epic).")
  N.Button(layout, "A popup in combat", "Test combat", function() ns.RunCommand("test", TEST_WORDS[ns.settings.testQuality or 4] .. " combat") end,
    "The same popup as it looks in a fight (Popups page: In combat). /dl test epic combat")
  N.Button(layout, "Two items at once", "Test pair", function() ns.RunCommand("testpair") end,
    "An Uncommon looted beside a Rare: the Rare comes full, the Uncommon compact (/dl testpair).")
  N.Button(layout, "A loot rain", "Test rain", function() ns.RunCommand("rain", tostring(ns.settings.testRain or 8)) end,
    "Rain test loot (how many: on the Loot rain page). /dl rain 8")
  N.Button(layout, "A quest reward", "Test reward", function() ns.RunCommand("testquest") end,
    "An item and some money, rained together the way a quest turn-in plays (/dl testquest).")
end

function ns:OpenSettings()
  if not category then CreateGeneral() end
  Settings.OpenToCategory(category:GetID())
end

ns.OnInit(function() if not category then CreateGeneral() end end)
ns.AddCommand("settings", "open the settings page", function() ns:OpenSettings() end)

-- /dl (and the minimap compartment) opens the settings until the inspector exists
function ns:ToggleUI() self:OpenSettings() end

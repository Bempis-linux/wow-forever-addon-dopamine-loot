-- Dopamine Loot settings (Options > AddOns > Dopamine Loot; also /dl). One topic
-- per page (docs/mockups/settings.html): Dopamine Loot (the main switches, quick tests), Popups
-- (Look.lua, custom: it has the live preview), Loot rain (RainFx.lua), Sounds
-- (Pages.lua). All are custom (canvas) pages with our own frames: Popups (Look.lua) with ns.UI, the
-- others laid out by ns.Native below (not the game's native layout: see there).
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
    ns.Tooltip():SetOwner(self, "ANCHOR_RIGHT")
    ns.Tooltip():SetText(tip, 1, 1, 1, 1, true)
    ns.Tooltip():Show()
  end)
  frame:SetScript("OnLeave", function(self) if ns.Tooltip():IsOwned(self) then ns.Tooltip():Hide() end end)
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
  local function List() return type(options) == "function" and options() or options end -- a list, or a function making one
  local radio = true -- radio entries show the picked one themselves; plain buttons need SetText
  d:SetupMenu(function(_, root)
    radio = root.CreateRadio ~= nil
    for _, o in ipairs(List()) do
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
      for _, o in ipairs(List()) do if o[1] == get() then d:SetText(o[2]) end end
    end
  end
  if tip then -- hooked: the template has its own enter/leave behavior
    d:HookScript("OnEnter", function(self)
      ns.Tooltip():SetOwner(self, "ANCHOR_RIGHT")
      ns.Tooltip():SetText(tip, 1, 1, 1, 1, true)
      ns.Tooltip():Show()
    end)
    d:HookScript("OnLeave", function(self) if ns.Tooltip():IsOwned(self) then ns.Tooltip():Hide() end end)
  end
  refreshers[#refreshers + 1] = Show
  if ns.settings then Show() end
  return d
end

local function RefreshAll() for _, r in ipairs(refreshers) do r() end end

-- Shared by the custom page ("Popups" in Look.lua)
ns.UI = {
  Label = Label, Tip = Tip, Check = Check, Toggle = Toggle, Choice = Choice, Button = Button,
  NumberBox = NumberBox, Slider = Slider, Dropdown = Dropdown, Refresh = RefreshAll,
}

---------------------------------------------------------------------------
-- The plain pages (Dopamine Loot, Loot rain, Sounds): our own frames on a custom ("canvas") page,
-- laid out like the game's settings: a header per topic, then one row per setting, its label on the
-- left and its control in one column on the right; the page scrolls when it's long.
-- Not the game's native layout: native pages are drawn in the game's shared settings list, which
-- reuses its row frames for every page, so after ours were shown, Blizzard's own settings (the
-- nameplates, the Social page) ran "tainted by DopamineLoot" and broke (1.0.0, 2026-11-05).
-- Same calls as before: N.Page, N.Header, N.Toggle, N.Slider, N.Choice, N.Button.
---------------------------------------------------------------------------
local N = {}
ns.Native = N
local LABEL_W, ROW_H, HEADER_GAP = 230, 30, 14
local pages = {} -- category -> page { panel, content, y }

-- A page (parent: the main category, for a sub-page). Returns its category and its layout (the page).
function N.Page(name, parent)
  local panel = CreateFrame("Frame")
  panel:Hide() -- the Settings window shows it, so OnShow refills the controls on every open
  panel.name = name
  local title = Label(panel, "GameFontNormalLarge", name)
  title:SetPoint("TOPLEFT", 16, -16)
  local ok, scroll = pcall(CreateFrame, "ScrollFrame", nil, panel, "ScrollFrameTemplate")
  if not ok then scroll = CreateFrame("ScrollFrame", nil, panel, "UIPanelScrollFrameTemplate") end
  scroll:SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -8)
  scroll:SetPoint("BOTTOMRIGHT", -30, 10)
  local content = CreateFrame("Frame", nil, scroll)
  content:SetSize(560, 10)
  scroll:SetScrollChild(content)
  local page = { panel = panel, content = content, y = 0 }
  panel:SetScript("OnShow", function()
    content:SetWidth(math.max(400, scroll:GetWidth()))
    RefreshAll()
  end)
  local cat
  if parent then
    cat = Settings.RegisterCanvasLayoutSubcategory(parent, panel, name)
  else
    cat = Settings.RegisterCanvasLayoutCategory(panel, name)
    Settings.RegisterAddOnCategory(cat)
  end
  pages[cat] = page
  return cat, page
end

-- The next row's label on the left; returns it and the row's middle height for the control
local function Row(page, label, tip, height)
  height = height or ROW_H
  local text = Label(page.content, "GameFontHighlight", label)
  text:SetPoint("LEFT", page.content, "TOPLEFT", 4, page.y - height / 2)
  text:SetWidth(LABEL_W - 12)
  if text.SetWordWrap then text:SetWordWrap(false) end
  if tip then -- the label shows the tip too (a FontString can't, so a frame over it)
    local hit = CreateFrame("Frame", nil, page.content)
    hit:SetAllPoints(text)
    hit:EnableMouse(true)
    Tip(hit, tip)
  end
  page.y = page.y - height
  page.content:SetHeight(-page.y + 16)
  return text, page.y + height / 2
end
local function Place(page, control, middle, dx)
  control:ClearAllPoints()
  control:SetPoint("LEFT", page.content, "TOPLEFT", LABEL_W + (dx or 0), middle)
end

function N.Header(page, text)
  page.y = page.y - (page.y < 0 and HEADER_GAP or 0)
  local h = Label(page.content, "GameFontNormal", text)
  h:SetPoint("TOPLEFT", page.content, "TOPLEFT", 0, page.y - 4)
  local line = page.content:CreateTexture(nil, "ARTWORK")
  line:SetColorTexture(1, 1, 1, 0.12)
  line:SetHeight(1)
  line:SetPoint("TOPLEFT", h, "BOTTOMLEFT", 0, -4)
  line:SetPoint("RIGHT", page.content, "RIGHT", -8, 0)
  page.y = page.y - 26
  page.content:SetHeight(-page.y + 16)
end

-- A check box. off = the setting is a "no..." flag (checked means on), as most of ours are
function N.Toggle(cat, key, label, tip, off, onChange)
  local page = pages[cat]
  local _, middle = Row(page, label, tip)
  local cb = Check(page.content, "", tip)
  cb:SetScript("OnClick", function(self)
    if off then ns.settings[key] = (not self:GetChecked()) or nil else ns.settings[key] = self:GetChecked() or nil end
    if onChange then onChange() end
  end)
  refreshers[#refreshers + 1] = function()
    if off then cb:SetChecked(not ns.settings[key]) else cb:SetChecked(ns.settings[key] and true or false) end
  end
  Place(page, cb, middle, -4)
end

-- A drag slider with its number field; fmt(v) -> text for the field (default: the number)
function N.Slider(cat, key, label, min, max, step, default, tip, fmt)
  local page = pages[cat]
  local _, middle = Row(page, label, tip)
  -- the field takes the number only; the unit ("items", "%") from fmt stands after it
  local number = fmt and function(v) return (tostring(fmt(v)):match("^%-?[%d%.]+") or tostring(v)) end
  local s = Slider(page.content, "", 170, min, max, step, function() return ns.settings[key] or default end,
    function(v) ns.settings[key] = v end, tip, number)
  s.label:Hide()
  s:EnableMouseWheel(false) -- the wheel scrolls the page
  Place(page, s, middle)
  local unit = fmt and tostring(fmt(max)):match("^%-?[%d%.]+%s*(.-)$")
  if unit and unit ~= "" then
    local u = Label(page.content, "GameFontHighlightSmall", unit)
    u:SetPoint("LEFT", s, "RIGHT", 64, 0) -- past the number field (10 + 44 + a gap)
  end
end

-- A dropdown: options = { { value, label, tip }, ... } or a function returning that; the default
-- value is stored as nil (every reader falls back to it); onSet(v) runs after a pick
function N.Choice(cat, key, label, options, default, tip, onSet)
  local page = pages[cat]
  local _, middle = Row(page, label, tip)
  local d = Dropdown(page.content, 220, options,
    function() local v = ns.settings[key]; if v == nil then return default end return v end,
    function(v)
      if v == default then ns.settings[key] = nil else ns.settings[key] = v end
      if onSet then onSet(v) end
    end, tip)
  Place(page, d, middle)
end

-- A button on its own row (label on the left, the button on the right)
function N.Button(page, label, text, onClick, tip)
  local _, middle = Row(page, label, tip)
  local b = Button(page.content, text, 120, onClick)
  Tip(b, tip)
  Place(page, b, middle)
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
  N.Toggle(cat, "noPopup", "Loot popups",
    "Shows a card beside your character for each item you loot, with the item turning in 3D. More settings on the Popups page.", true)
  N.Toggle(cat, "noRain", "Loot rain",
    "When you loot several items at once (or a lot of money), they spray up and bounce down at the bottom of the screen; the best item lands last and becomes a popup. In combat it waits until the fight is over. More settings on the Loot rain page.", true)
  N.Toggle(cat, "noBag", "Bulging bag",
    "When your bags are nearly full (4 slots or fewer), the backpack button puffs up a notch with each item and strains at the seams; when they're full, the loot spills out and is sucked back in. Herb, mining and other special bags don't count.", true, function() if ns.SyncBag then ns.SyncBag() end end)
  N.Toggle(cat, "noBagCount", "Slots-left number",
    "The number of free slots in the bulging bag's corner, like a stack count (a red 0 when there's no room).", true, function() if ns.SyncBag then ns.SyncBag() end end)
  N.Toggle(cat, "noSound", "Sounds",
    "Turns every Dopamine Loot sound on or off at once. The game's own sounds are not affected. More settings on the Sounds page.", true)
  N.Header(layout, "Try it")
  N.Choice(cat, "testQuality", "Test popup rarity", TESTS, 4,
    "The rarity of the item the two test popup buttons below show.")
  N.Button(layout, "Show a popup", "Test popup", function() ns.RunAction("test", TEST_WORDS[ns.settings.testQuality or 4]) end,
    "Shows a test popup of the rarity picked above, using one of your own items when you have one.")
  N.Button(layout, "Show a popup in combat", "Test combat", function() ns.RunAction("test", TEST_WORDS[ns.settings.testQuality or 4] .. " combat") end,
    "The same test popup as it looks during a fight. What popups do in combat is set on the Popups page, under In combat.")
  N.Button(layout, "Show two popups", "Test pair", function() ns.RunAction("testpair") end,
    "An Uncommon looted together with a Rare: the Rare shows as a full popup and the Uncommon as a compact one-line popup.")
  N.Button(layout, "Start a loot rain", "Test rain", function() ns.RunAction("rain", tostring(ns.settings.testRain or 8)) end,
    "Rains test loot taken from your bags, with better items mixed in. How many items: Test rain size, on the Loot rain page.")
  N.Button(layout, "Fill the bag to bursting", "Test bag", function() ns.RunAction("testbag") end,
    "Plays the bulging bag: four items to full, the full-bag moment, then a big release. Your bags aren't touched.")
  N.Button(layout, "Simulate a quest reward", "Test reward", function() ns.RunAction("testquest") end,
    "An item and some money rained together, the way finishing a quest plays.")
end

function ns:OpenSettings()
  if not category then CreateGeneral() end
  Settings.OpenToCategory(category:GetID())
end

ns.OnInit(function() if not category then CreateGeneral() end end)

-- /dl and the minimap compartment open the settings
function ns:ToggleUI() self:OpenSettings() end

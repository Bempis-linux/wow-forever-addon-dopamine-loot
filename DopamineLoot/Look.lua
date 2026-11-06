-- Dopamine Loot "Popups" settings page (Options > AddOns > Dopamine Loot > Popups; custom, not native:
-- it has the live preview): when popups show, their look and the 3D item on the left, a live popup
-- on the right that changes as you drag. Pick the preview's quality and kind under it; "Show as a
-- real popup" pops one on screen with the same look; "Check any item ID" shows any item as a real popup.
local _, ns = ...

local PREVIEW_W, PREVIEW_H = 300, 250
local BASE = 0.68 -- the preview draws popups at this fraction of their real size, so they fit
local KINDS = {
  { key = "weapon", label = "Weapon", id = 12784, tip = "Preview a weapon: its 3D model, stood upright." }, -- Arcanite Reaper
  { key = "helm", label = "Helm", id = 12640, tip = "Preview a helm: its 3D model." },     -- Lionheart Helm
  { key = "other", label = "Potion", id = 13446, tip = "Preview an item with no 3D model (a potion): it shows as its icon on a card." }, -- Major Healing Potion
}
local QUALITY_NAMES = { [0] = "Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary" }
local QUALITY_SHORT = { [0] = "Gray", "White", "Green", "Blue", "Purple", "Orange" } -- the buttons (their color)

local panel, sub, box, view
local pick = { quality = 4, kind = "weapon" }
local items = {} -- kind -> item data, loaded once

-- Load a preview item; fn runs when it's ready (the key is fixed at request time)
local function Load(key, fn)
  for _, k in ipairs(KINDS) do
    if k.key == key then
      ns.ItemData(k.id, 1, "loot", function(data)
        items[key] = data
        if pick.kind == key then fn() end
      end)
    end
  end
end

-- Redraw the preview. what: "item" (style, quality, kind: full redraw), "frame" (zoom, tilt),
-- "size"; anything else needs no redraw (spin speed and time on screen are read each frame)
local function Changed(what)
  if not view or not box:IsVisible() then return end
  if what == "item" then
    local d = items[pick.kind]
    if not d then
      Load(pick.kind, function() Changed("item") end)
      return
    end
    local shown = {}
    for k, v in pairs(d) do shown[k] = v end
    shown.quality, shown.test = pick.quality, true
    shown.compact = ns.PopupCompact(shown) -- what this quality looks like now (low rarities, combat)
    view:SetItem(shown)
  elseif what == "frame" and view.mode == "model" then
    view:Frame()
  end
  if what == "size" or what == "item" then
    -- the real size relation between styles and sizes, shrunk only as far as the box needs
    view:SetScale(math.min(BASE * ns.PopupScale(), (PREVIEW_W - 12) / view:GetWidth(), (PREVIEW_H - 12) / view:GetHeight()))
  end
end

local function Create()
  local UI = ns.UI
  panel = CreateFrame("Frame")
  panel:Hide() -- the Settings window shows it, so OnShow refills the fields on every open
  panel.name = "Popups"

  local title = UI.Label(panel, "GameFontNormalLarge", "Popups")
  title:SetPoint("TOPLEFT", 16, -16)
  local intro = UI.Label(panel, "GameFontHighlightSmall",
    "A card for each item you loot. Every change shows in the preview on the right at once.")
  intro:SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -6)

  ---------------------------------------------------------------- left: when, look, placement, the 3D item
  -- every setting is one row: its label on the left, its control from LABEL_W on (the same column
  -- for all), grouped under a header per topic
  local LABEL_W = 120
  local last -- always a label in the left column, so everything stacks in one straight column
  local function Header(text)
    local h = UI.Label(panel, "GameFontNormal", text)
    h:SetPoint("TOPLEFT", last or intro, "BOTTOMLEFT", 0, -16)
    last = h
  end
  local function RowLabel(label, tip)
    local text = UI.Label(panel, "GameFontHighlight", label)
    text:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 0, -16)
    text:SetWidth(LABEL_W - 6)
    if text.SetWordWrap then text:SetWordWrap(false) end
    if tip then -- the label shows the tip too (a FontString can't, so a frame over it)
      local hit = CreateFrame("Frame", nil, panel)
      hit:SetAllPoints(text)
      hit:EnableMouse(true)
      UI.Tip(hit, tip)
    end
    return text
  end
  local function Pick(label, options, get, set, tip)
    local text = RowLabel(label, tip)
    local d = UI.Dropdown(panel, 164, options, get, set, tip)
    d:SetPoint("LEFT", text, "LEFT", LABEL_W, 0)
    last = text
  end
  local function Add(label, min, max, step, get, set, tip, what, fmt)
    local s, text = UI.Slider(panel, "", 96, min, max, step, get, set, tip, fmt, function() Changed(what) end)
    local row = RowLabel(label, tip)
    text:Hide()
    s:ClearAllPoints()
    s:SetPoint("LEFT", row, "LEFT", LABEL_W, 0)
    last = row
  end

  Header("When")
  Pick("Show loot from", ns.QUALITY_CHOICES, function() return ns.MinQuality() end,
    function(v) ns.settings.minQuality = v end,
    "The lowest rarity Dopamine Loot shows, as a popup or in the loot rain. Items below it are left out completely.")
  Add("Time on screen", 2, 15, 0.5, function() return ns.settings.popupHold or 5 end,
    function(v) ns.settings.popupHold = v end,
    "How long popups stay, in seconds. Rarer items stay longer: at the default 5, Uncommon and lower stay 2.5 s, Rare 4 s, Epic 6 s and Legendary 8 s. Hovering over a popup keeps it up (for up to 10 s more).", "none")
  Pick("Compact popups", {
    { "smart", "Smart (default)", "Poor and Common items always come as one line; an Uncommon too, unless it's the best item of what you looted." },
    { "always", "Uncommon and lower", "Poor, Common and Uncommon items always come as one line." },
    { "never", "Never", "Every item gets a full popup." },
  }, function() return ns.settings.popupLow or "smart" end,
    function(v) ns.settings.popupLow = v ~= "smart" and v or nil end,
    "A compact popup is a single line, the item's icon and name, instead of the full card. Which low-rarity items come that way.")
  Pick("In combat", {
    { "compact", "Compact (default)", "Every popup comes as a single line until the fight is over." },
    { "same", "Same as always", "Popups show as usual in combat." },
    { "defer", "Wait until after", "Popups wait and show one after another when the fight ends." },
  }, function() return ns.settings.popupCombat or "compact" end,
    function(v) ns.settings.popupCombat = v ~= "compact" and v or nil end,
    "What popups do while you're in combat.")

  Header("Look")
  local styles = {}
  for _, s in ipairs(ns.STYLES) do styles[#styles + 1] = { s.key, s.label, s.tip } end
  Pick("Style", styles, function() return ns.PopupStyle() end,
    function(v) ns.settings.popupStyle = v; Changed("item") end,
    "How popups look. Relic: the item floating in a soft glow, its name below. Beam: a cone of light rising under the item. Banner: a ribbon in the item's color with its name on it.")
  Add("Size", 0.5, 1.6, 0.05, ns.PopupScale, function(v) ns.settings.popupScale = v end,
    "How big popups are on screen, from 0.5 to 1.6 (default 0.8).", "size")
  Pick("Legendary", {
    { "on", "Legendary moment (default)", "The screen dims, a comet streaks down from the top of the screen onto the popup and it lands in slow motion. Never in combat." },
    { "off", "Like the others", "A Legendary pops up like any other popup, with its shockwaves and embers." },
  }, function() return ns.settings.noLegendMoment and "off" or "on" end,
    function(v) ns.settings.noLegendMoment = v == "off" or nil end,
    "How a Legendary popup arrives. To see it, pick Legendary under the preview and click Show as a real popup.")

  Header("Placement")
  local positions = {}
  for _, p in ipairs(ns.POPUP_POSITIONS) do positions[#positions + 1] = { p.key, p.label } end
  Pick("Position", positions, function() return ns.settings.popupPos or "midright" end,
    function(v) ns.settings.popupPos = v ~= "midright" and v or nil end,
    "Where on screen popups appear. The default, right of your character at mid-height, stays clear of the quest tracker, your buffs and the fight.")
  Pick("Popups at once", { { 1, "1" }, { 2, "2 (default)" }, { 3, "3" } }, ns.PopupMax,
    function(v) ns.settings.popupMax = v ~= 2 and v or nil end,
    "How many popups can be on screen together. More wait their turn, except that a better item cuts in.")
  Pick("Mouse clicks", {
    { "through", "Pass through (default)", "Clicks go to the world behind popups. Hovering over one still keeps it up and shows the item's tooltip." },
    { "item", "Popups catch clicks", "Click a popup to close it; Shift+click it to link the item in chat." },
  }, function() return ns.settings.popupMouse or "through" end,
    function(v) ns.settings.popupMouse = v ~= "through" and v or nil end,
    "Whether popups block mouse clicks or let them through to the world behind.")

  Header("The 3D item")
  -- shown as a size in percent (right = bigger); stored as the camera distance (modelZoom, 0.7 = 100%)
  Add("Item size (%)", 35, 230, 5, function() return math.floor(70 / ns.ModelZoom() + 0.5) end,
    function(v) ns.settings.modelZoom = 70 / math.max(v, 1) end,
    "How big 3D items show in popups, in percent: drag right for bigger, left for smaller. From 35 to 230 (default 100).",
    "frame", function(v) return tostring(math.floor(v + 0.5)) end)
  Add("Weapon tilt", 0, 355, 5, ns.WeaponTilt, function(v) ns.settings.weaponTilt = v end,
    "Turns weapons so they stand upright: 90 stands them up (default), 0 shows them the way the game draws them (lying down). If a weapon shows upside down, try 270.",
    "frame", function(v) return tostring(math.floor(v + 0.5)) end)
  Add("Sway speed", 0, 3, 0.1, ns.SpinSpeed, function(v) ns.settings.spinSpeed = v end,
    "How fast the item sways gently from side to side, from 0 (still) to 3 (default 0.9). Epic and better items first turn once all the way round.", "none")

  ---------------------------------------------------------------- right: the live preview
  box = CreateFrame("Frame", nil, panel, "BackdropTemplate")
  box:SetSize(PREVIEW_W, PREVIEW_H)
  box:SetPoint("TOPLEFT", intro, "BOTTOMLEFT", 300, -16)
  box:SetBackdrop({
    bgFile = "Interface\\Buttons\\WHITE8X8", edgeFile = "Interface\\Tooltips\\UI-Tooltip-Border",
    edgeSize = 12, insets = { left = 3, right = 3, top = 3, bottom = 3 },
  })
  box:SetBackdropColor(0.07, 0.06, 0.05, 1)
  box:SetBackdropBorderColor(0.4, 0.35, 0.28, 1)
  if box.SetClipsChildren then box:SetClipsChildren(true) end
  view = CreateFrame("Frame", nil, box)
  ns.CreateView(view)
  view:SetPoint("CENTER")
  box:SetScript("OnUpdate", function(_, dt) view:Tick(math.min(dt, 0.1)) end)
  box:SetScript("OnShow", function() Changed("item") end)

  local qLabel = UI.Label(panel, "GameFontHighlightSmall", "Preview rarity")
  qLabel:SetPoint("TOPLEFT", box, "BOTTOMLEFT", 2, -8)
  local qButtons, kButtons = {}, {}
  local function Mark(list, value)
    for _, b in ipairs(list) do if b.value == value then b:LockHighlight() else b:UnlockHighlight() end end
  end
  local prev
  for q = 0, 5 do
    local b = UI.Button(panel, QUALITY_SHORT[q], 48, function(self)
      pick.quality = self.value; Mark(qButtons, self.value); Changed("item")
    end)
    b.value = q
    local r, g, bl = ns.QualityColor(q)
    local fs = b:GetFontString()
    if fs then fs:SetTextColor(r, g, bl) end
    UI.Tip(b, "Preview how a popup looks for this rarity: " .. QUALITY_NAMES[q] .. ".")
    b:SetPoint("TOPLEFT", prev or qLabel, prev and "TOPRIGHT" or "BOTTOMLEFT", prev and 2 or 0, prev and 0 or -4)
    qButtons[#qButtons + 1] = b
    prev = b
  end
  local kLabel = UI.Label(panel, "GameFontHighlightSmall", "Preview item")
  kLabel:SetPoint("TOPLEFT", qButtons[1], "BOTTOMLEFT", 0, -8)
  prev = nil
  for _, k in ipairs(KINDS) do
    local b = UI.Button(panel, k.label, 82, function(self)
      pick.kind = self.value; Mark(kButtons, self.value); Changed("item")
    end)
    b.value = k.key
    UI.Tip(b, k.tip)
    b:SetPoint("TOPLEFT", prev or kLabel, prev and "TOPRIGHT" or "BOTTOMLEFT", prev and 4 or 0, prev and 0 or -4)
    kButtons[#kButtons + 1] = b
    prev = b
  end
  local function PopReal()
    local d = items[pick.kind]
    if not d then return Load(pick.kind, PopReal) end
    local copy = {}
    for k, v in pairs(d) do copy[k] = v end
    copy.quality, copy.test, copy.push = pick.quality, true, true
    copy.compact = ns.PopupCompact(copy)
    ns:ShowLoot(copy)
  end
  local real = UI.Button(panel, "Show as a real popup", 170, PopReal)
  UI.Tip(real, "Shows the previewed item as a real popup, where popups appear on your screen.")
  real:SetPoint("TOPLEFT", kButtons[1], "BOTTOMLEFT", 0, -10)

  -- Any item ID, shown in the preview's style as a real popup
  local idLabel = UI.Label(panel, "GameFontHighlightSmall", "Try any item ID:")
  idLabel:SetPoint("TOPLEFT", real, "BOTTOMLEFT", 0, -12)
  local itemID = 19019
  local idBox = UI.NumberBox(panel, 60, function() return itemID end, function(v) itemID = math.floor(v) end,
    1, 999999, "Type the ID of any item (from an item database website, the number in its address) to see how it looks as a popup.")
  idBox:SetPoint("LEFT", idLabel, "RIGHT", 10, 0)
  local idGo = UI.Button(panel, "Show", 60, function()
    idBox:ClearFocus()
    ns.RunAction("model", tostring(itemID))
  end)
  idGo:SetPoint("LEFT", idBox, "RIGHT", 6, 0)
  UI.Tip(idGo, "Shows the item with that ID as a real popup.")
  Mark(qButtons, pick.quality)
  Mark(kButtons, pick.kind)

  panel:SetScript("OnShow", function() UI.Refresh(); Mark(qButtons, pick.quality); Mark(kButtons, pick.kind) end)

  if Settings.RegisterCanvasLayoutSubcategory and ns.settingsCategory then
    sub = Settings.RegisterCanvasLayoutSubcategory(ns.settingsCategory, panel, "Popups")
  else -- no subcategories: its own entry
    sub = Settings.RegisterCanvasLayoutCategory(panel, ns.TITLE .. " - Popups")
    Settings.RegisterAddOnCategory(sub)
  end
end

function ns:OpenLook()
  if not panel then Create() end
  Settings.OpenToCategory(sub:GetID())
end

ns.OnInit(function() if not panel then Create() end end)

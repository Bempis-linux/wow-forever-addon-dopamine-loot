-- Dopamine Loot "Popup look" settings page (Options > AddOns > Dopamine Loot > Popup look): the
-- popup style and sliders on the left, a live popup on the right that changes as you drag. Pick the
-- preview's quality and kind (weapon, helm, something with no model) under it; "Show as a real
-- popup" pops one on screen with the same look.
local _, ns = ...

local PREVIEW_W, PREVIEW_H = 300, 250
local BASE = 0.68 -- the preview draws popups at this fraction of their real size, so they fit
local KINDS = {
  { key = "weapon", label = "Weapon", id = 12784 }, -- Arcanite Reaper
  { key = "helm", label = "Helm", id = 12640 },     -- Lionheart Helm
  { key = "other", label = "No model", id = 13446 }, -- Major Healing Potion
}
local QUALITY_NAMES = { [0] = "Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary" }

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
    view:SetItem(shown)
  elseif what == "frame" and view.mode == "model" then
    view:Frame()
  end
  if what == "size" or what == "item" then
    -- the real size relation between styles and sizes, shrunk only as far as the box needs
    view:SetScale(math.min(BASE * ns.PopupScale(), (PREVIEW_W - 12) / view:GetWidth(), (PREVIEW_H - 12) / view:GetHeight()))
  end
end
ns.LookChanged = Changed

-- After a chat command changed a look setting: sliders and preview follow
function ns.LookRefresh()
  if ns.UI then ns.UI.Refresh() end
  Changed("frame")
end

local function Create()
  local UI = ns.UI
  panel = CreateFrame("Frame")
  panel.name = "Popup look"

  local title = UI.Label(panel, "GameFontNormalLarge", "Popup look")
  title:SetPoint("TOPLEFT", 16, -16)
  local intro = UI.Label(panel, "GameFontHighlightSmall",
    "Pick a style and drag the sliders: the popup on the right changes as you go.")
  intro:SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -6)

  ---------------------------------------------------------------- left: style and sliders
  local styleLabel = UI.Label(panel, "GameFontNormal", "Style")
  styleLabel:SetPoint("TOPLEFT", intro, "BOTTOMLEFT", 0, -16)
  local options = {}
  for _, s in ipairs(ns.STYLES) do options[#options + 1] = { value = s.key, label = s.label, tip = s.tip } end
  local last = UI.Choice(panel, options, function() return ns.PopupStyle() end,
    function(v) ns.settings.popupStyle = v; Changed("item") end, styleLabel)

  local function Add(label, min, max, step, get, set, tip, what, fmt)
    local s, text = UI.Slider(panel, label, 150, min, max, step, get, set, tip, fmt, function() Changed(what) end)
    text:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 0, -14)
    last = s
    return s
  end
  local lookLabel = UI.Label(panel, "GameFontNormal", "Look")
  lookLabel:SetPoint("TOPLEFT", last, "BOTTOMLEFT", 0, -12)
  last = lookLabel
  Add("Size", 0.6, 1.6, 0.05, ns.PopupScale, function(v) ns.settings.popupScale = v end,
    "How big popups are on screen (0.6 to 1.6, default 1).", "size")
  Add("3D zoom", 0.3, 2, 0.05, ns.ModelZoom, function(v) ns.settings.modelZoom = v end,
    "Camera distance for item models: smaller is closer and bigger (0.3 to 2, default 0.7). Also /dl zoom.", "frame")
  Add("Weapon tilt", 0, 355, 5, ns.WeaponTilt, function(v) ns.settings.weaponTilt = v end,
    "Turns weapons so they stand up (0 = as the game draws them, 90 = upright, 270 if it stands on its head; default 90). Also /dl roll.",
    "frame", function(v) return tostring(math.floor(v + 0.5)) end)
  Add("Spin speed", 0, 3, 0.1, ns.SpinSpeed, function(v) ns.settings.spinSpeed = v end,
    "How fast the item turns (0 = still, default 0.9).", "none")
  Add("Time on screen (s)", 2, 15, 0.5, function() return ns.settings.popupHold or 5 end,
    function(v) ns.settings.popupHold = v end,
    "Seconds a popup stays (2 to 15, default 5); better items stay a little longer. Hovering holds it.", "none")

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

  local qLabel = UI.Label(panel, "GameFontHighlightSmall", "Quality")
  qLabel:SetPoint("TOPLEFT", box, "BOTTOMLEFT", 2, -8)
  local qButtons, kButtons = {}, {}
  local function Mark(list, value)
    for _, b in ipairs(list) do if b.value == value then b:LockHighlight() else b:UnlockHighlight() end end
  end
  local prev
  for q = 0, 5 do
    local b = UI.Button(panel, QUALITY_NAMES[q]:sub(1, 4), 48, function(self)
      pick.quality = self.value; Mark(qButtons, self.value); Changed("item")
    end)
    b.value = q
    local r, g, bl = ns.QualityColor(q)
    local fs = b:GetFontString()
    if fs then fs:SetTextColor(r, g, bl) end
    UI.Tip(b, QUALITY_NAMES[q])
    b:SetPoint("TOPLEFT", prev or qLabel, prev and "TOPRIGHT" or "BOTTOMLEFT", prev and 2 or 0, prev and 0 or -4)
    qButtons[#qButtons + 1] = b
    prev = b
  end
  local kLabel = UI.Label(panel, "GameFontHighlightSmall", "Item")
  kLabel:SetPoint("TOPLEFT", qButtons[1], "BOTTOMLEFT", 0, -8)
  prev = nil
  for _, k in ipairs(KINDS) do
    local b = UI.Button(panel, k.label, 82, function(self)
      pick.kind = self.value; Mark(kButtons, self.value); Changed("item")
    end)
    b.value = k.key
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
    ns:ShowLoot(copy)
  end
  local real = UI.Button(panel, "Show as a real popup", 170, PopReal)
  real:SetPoint("TOPLEFT", kButtons[1], "BOTTOMLEFT", 0, -10)

  -- /dl model on the page: any item ID, shown in the preview's style as a real popup, result logged
  local idLabel = UI.Label(panel, "GameFontHighlightSmall", "Check any item ID:")
  idLabel:SetPoint("TOPLEFT", real, "BOTTOMLEFT", 0, -12)
  local itemID = 19019
  local idBox = UI.NumberBox(panel, 60, function() return itemID end, function(v) itemID = math.floor(v) end,
    1, 999999, "An item ID (from a database site) to see how it shows; the result goes to the log.")
  idBox:SetPoint("LEFT", idLabel, "RIGHT", 10, 0)
  local idGo = UI.Button(panel, "Check", 60, function()
    idBox:ClearFocus()
    ns.RunCommand("model", tostring(itemID))
  end)
  idGo:SetPoint("LEFT", idBox, "RIGHT", 6, 0)
  Mark(qButtons, pick.quality)
  Mark(kButtons, pick.kind)

  panel:SetScript("OnShow", function() UI.Refresh(); Mark(qButtons, pick.quality); Mark(kButtons, pick.kind) end)

  if Settings.RegisterCanvasLayoutSubcategory and ns.settingsCategory then
    sub = Settings.RegisterCanvasLayoutSubcategory(ns.settingsCategory, panel, "Popup look")
  else -- no subcategories: its own entry
    sub = Settings.RegisterCanvasLayoutCategory(panel, ns.TITLE .. " - Popup look")
    Settings.RegisterAddOnCategory(sub)
  end
end

function ns:OpenLook()
  if not panel then Create() end
  Settings.OpenToCategory(sub:GetID())
end

ns.OnInit(function() if not panel then Create() end end)
ns.AddCommand("look", "open the popup look page with the live preview", function() ns:OpenLook() end)

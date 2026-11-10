-- Dopamine Loot movable frames: any of our frames can be dragged into place. A feature registers its
-- anchor frame once:
--   ns.Mover.Register({ key = "tally", frame = f, label = "Harvest tally", point = "TOPRIGHT",
--     x = -16, y = -200, w = 210, h = 120, preview = function(on) ... end })
-- and the frame is placed from the saved spot (ns.settings.pos[key]), else the default (point on
-- UIParent's same point, offset x, y). "Move frames" (a settings button: ns.Mover.Unlock) shows a
-- labeled box over every registered frame: drag to move, right-click to put it back; "Done" on the bar
-- at the top locks them again. preview(on) lets a frame show sample content while it's being placed.
-- Only our own frames are moved; the game's Edit Mode is left alone (no hooks into Blizzard's UI).
local _, ns = ...

local Mover = {}
ns.Mover = Mover

local list = {}   -- key -> def, in registration order in `order`
local order = {}
local unlocked = false
local bar         -- the "Done" bar shown while moving
local MIN_W, MIN_H = 80, 24

local function Saved() ns.settings.pos = ns.settings.pos or {}; return ns.settings.pos end

-- Puts a registered frame where it belongs (its saved spot, else the default)
function Mover.Apply(key)
  local d = list[key]
  if not d then return end
  local s = ns.settings and ns.settings.pos and ns.settings.pos[key]
  local p = s and s[1] or d.point
  d.frame:ClearAllPoints()
  d.frame:SetPoint(p, UIParent, p, s and s[2] or d.x or 0, s and s[3] or d.y or 0)
end

-- The x, y of a point ("TOPRIGHT", "CENTER", ...) on a frame's rectangle
local function PointXY(frame, p)
  local l, r, t, b = frame:GetLeft(), frame:GetRight(), frame:GetTop(), frame:GetBottom()
  if not l then return nil end
  local x = p:find("LEFT") and l or p:find("RIGHT") and r or (l + r) / 2
  local y = p:find("TOP") and t or p:find("BOTTOM") and b or (t + b) / 2
  return x, y
end

local function Size(d)
  local w, h = d.frame:GetWidth(), d.frame:GetHeight()
  return math.max(MIN_W, (w and w > 1) and w or d.w or MIN_W), math.max(MIN_H, (h and h > 1) and h or d.h or MIN_H)
end

-- The box over a frame while moving: drag it, right-click it to reset
local function Handle(d)
  if d.handle then return d.handle end
  local h = CreateFrame("Frame", nil, UIParent, "BackdropTemplate")
  h:SetFrameStrata("DIALOG")
  h:SetClampedToScreen(true)
  h:SetMovable(true)
  h:EnableMouse(true)
  h:RegisterForDrag("LeftButton")
  h:SetBackdrop({ bgFile = "Interface\\Buttons\\WHITE8X8", edgeFile = "Interface\\Buttons\\WHITE8X8", edgeSize = 1 })
  h:SetBackdropColor(0.25, 0.55, 1, 0.22)
  h:SetBackdropBorderColor(0.45, 0.75, 1, 0.9)
  local label = h:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  label:SetPoint("CENTER")
  label:SetText(d.label)
  h:SetScript("OnDragStart", function(self) self:StartMoving() end)
  h:SetScript("OnDragStop", function(self)
    self:StopMovingOrSizing()
    local p = d.point
    local x, y = PointXY(self, p)
    local ux, uy = PointXY(UIParent, p)
    if x and ux then
      local k = self:GetEffectiveScale() / UIParent:GetEffectiveScale()
      Saved()[d.key] = { p, math.floor((x * k - ux) + 0.5), math.floor((y * k - uy) + 0.5) }
    end
    Mover.Apply(d.key)
    Mover.Fit(d.key)
    if d.moved then pcall(d.moved) end
  end)
  h:SetScript("OnMouseUp", function(_, button)
    if button == "RightButton" then Mover.Reset(d.key) end
  end)
  h:SetScript("OnEnter", function(self)
    ns.Tooltip():SetOwner(self, "ANCHOR_TOP")
    ns.Tooltip():SetText(d.label, 1, 0.82, 0)
    ns.Tooltip():AddLine("Drag to move. Right-click: back to where it started.", 1, 1, 1, true)
    ns.Tooltip():Show()
  end)
  h:SetScript("OnLeave", function(self) if ns.Tooltip():IsOwned(self) then ns.Tooltip():Hide() end end)
  d.handle = h
  return h
end

-- Lays the box over its frame
function Mover.Fit(key)
  local d = list[key]
  if not (d and d.handle) then return end
  local w, h = Size(d)
  local x, y = PointXY(d.frame, d.point)
  d.handle:ClearAllPoints()
  d.handle:SetSize(w, h)
  if x then d.handle:SetPoint(d.point, UIParent, "BOTTOMLEFT", x, y) else d.handle:SetPoint("CENTER") end
end

local function Bar()
  if bar then return bar end
  bar = CreateFrame("Frame", nil, UIParent, "BackdropTemplate")
  bar:SetFrameStrata("DIALOG")
  bar:SetSize(420, 44)
  bar:SetPoint("TOP", 0, -60)
  bar:SetBackdrop({ bgFile = "Interface\\Buttons\\WHITE8X8", edgeFile = "Interface\\Tooltips\\UI-Tooltip-Border",
    edgeSize = 14, insets = { left = 3, right = 3, top = 3, bottom = 3 } })
  bar:SetBackdropColor(0.04, 0.04, 0.06, 0.92)
  -- two lines (a title and how it works), the bar sized to fit them and the Done button
  local t = bar:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  t:SetPoint("TOPLEFT", 14, -8)
  t:SetText(ns.TITLE .. ": move frames")
  local how = bar:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  how:SetPoint("TOPLEFT", t, "BOTTOMLEFT", 0, -3)
  how:SetText("Drag a blue box to move it. Right-click a box to put it back.")
  local done = CreateFrame("Button", nil, bar, "UIPanelButtonTemplate")
  done:SetSize(70, 22)
  done:SetPoint("RIGHT", -10, 0)
  done:SetText("Done")
  done:SetScript("OnClick", function() Mover.Lock() end)
  bar:SetSize(math.max(t:GetStringWidth(), how:GetStringWidth()) + 14 + 24 + 70 + 10, 46)
  return bar
end

function Mover.IsUnlocked() return unlocked end

-- Shows the boxes over every registered frame
function Mover.Unlock()
  unlocked = true
  for _, key in ipairs(order) do
    local d = list[key]
    if d.preview then pcall(d.preview, true) end
    Handle(d):Show()
    Mover.Fit(key)
  end
  Bar():Show()
end

function Mover.Lock()
  unlocked = false
  for _, key in ipairs(order) do
    local d = list[key]
    if d.handle then d.handle:Hide() end
    if d.preview then pcall(d.preview, false) end
  end
  if bar then bar:Hide() end
end

-- Back to the default spot (one frame, or all of them with no key)
function Mover.Reset(key)
  local pos = Saved()
  for _, k in ipairs(order) do
    if not key or k == key then
      pos[k] = nil
      Mover.Apply(k)
      if list[k].reset then pcall(list[k].reset) end
      if unlocked then Mover.Fit(k) end
    end
  end
end

-- def: key, frame, label, point (default "CENTER"), x, y, w, h (the box's size when the frame has
-- none yet), preview(on), moved() (after a drag), reset() (put back)
function Mover.Register(def)
  def.point = def.point or "CENTER"
  if not list[def.key] then order[#order + 1] = def.key end
  list[def.key] = def
  if ns.settings then Mover.Apply(def.key) end
  if unlocked then Handle(def):Show(); Mover.Fit(def.key) end
end

ns.OnInit(function() for _, key in ipairs(order) do Mover.Apply(key) end end)

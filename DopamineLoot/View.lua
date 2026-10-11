-- Dopamine Loot popup view: draws one item in one of four styles. The real popups (Popup.lua) and
-- the live preview on the settings page (Look.lua) both use it, so the preview is exactly what you
-- get. The item turns: its 3D model where the client has one (weapons stand upright), otherwise its
-- icon on a card that flips like a coin.
--   relic   just the item on a soft glow, name below
--   beam    a cone of light rising from a glowing disc, sparks drifting up through it
--   halo    a dark lens inside a ring in the quality color, details beside
--   banner  a ribbon in the quality color fading at both ends, the item on a diamond emblem, a shine
--           sweeping across now and then
-- Every style: the name in the game's title font, a flash of light as it appears, and an arrival by
-- rarity (Rare and Epic a spark ring; Legendary shockwaves and embers). The light holds still.
-- Models: set only after the frame is shown, and again when it's shown after being hidden (the
-- client drops them); never inside an animation group (moved and faded by hand).
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local QUESTION = "Interface\\Icons\\INV_Misc_QuestionMark"
-- the game's quest and zone title face; Latin only, so Cyrillic clients get its _CYR cut and
-- Asian clients keep the normal game font
local LOCALE = GetLocale and GetLocale() or "enUS"
local TITLE_FONT = (LOCALE == "ruRU" and "Fonts\\MORPHEUS_CYR.TTF")
  or ((LOCALE == "koKR" or LOCALE == "zhCN" or LOCALE == "zhTW") and nil)
  or "Fonts\\MORPHEUS.TTF"
local CARD = 56
local RISE, SPARKS, EMBERS = 8, 18, 6 -- beam's rising motes; arrival sparks; legendary embers
local FLASH_T, BURST_T, WAVE_T, FOUNTAIN_T = 0.45, 0.8, 0.9, 1.5
local GRAVITY = -420 -- legendary ember fountain, px/s^2

-- Arrival by rarity (every style): Rare a ring of sparks; Epic a bigger ring; Legendary
-- shockwaves, a fountain of embers and embers drifting up
local function Tier(q) return q >= 5 and "legendary" or q == 4 and "epic" or q == 3 and "rare" or nil end

ns.STYLES = {
  { key = "relic", label = "Relic", tip = "Just the item floating in a soft glow, the name below. No box." },
  { key = "beam", label = "Beam", tip = "A cone of light rises from a glowing disc under the item, sparks drifting up." },
  { key = "halo", label = "Halo lens", tip = "The item in a dark lens ringed in its color; details beside it." },
  { key = "banner", label = "Banner", tip = "A ribbon in the item's color, the item on a diamond emblem, a shine sweeping across." },
}
-- view size; the stage (x, y, width, height) where the item stands; where the text goes; the
-- clickable part (insets left, right, top, bottom: the empty glow around it lets clicks through);
-- zoom: camera distance multiplier so the item fits that style's frame
local LAYOUT = {
  relic = { w = 260, h = 230, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  beam = { w = 260, h = 250, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  halo = { w = 400, h = 190, stage = { -110, 0, 104, 116 }, text = "right", hit = { 15, 10, 15, 15 }, zoom = 1.3, font = 18 },
  banner = { w = 420, h = 170, stage = { -140, -6, 110, 150 }, text = "band", hit = { 20, 20, 30, 30 }, zoom = 1, font = 18 },
}

-- Items that have a model of their own; body armor is textures on a body (mannequin view later)
ns.MODEL_SLOTS = {
  INVTYPE_WEAPON = true, INVTYPE_2HWEAPON = true, INVTYPE_WEAPONMAINHAND = true, INVTYPE_WEAPONOFFHAND = true,
  INVTYPE_SHIELD = true, INVTYPE_HOLDABLE = true, INVTYPE_RANGED = true, INVTYPE_RANGEDRIGHT = true,
  INVTYPE_THROWN = true, INVTYPE_HEAD = true, INVTYPE_SHOULDER = true,
}
-- Long items that lie flat by default and get stood up (the "Weapon tilt" setting)
local UPRIGHT = {
  INVTYPE_WEAPON = true, INVTYPE_2HWEAPON = true, INVTYPE_WEAPONMAINHAND = true, INVTYPE_WEAPONOFFHAND = true,
  INVTYPE_RANGED = true, INVTYPE_RANGEDRIGHT = true, INVTYPE_THROWN = true, INVTYPE_HOLDABLE = true,
}

local FALLBACK_COLORS = {
  [0] = { 0.62, 0.62, 0.62 }, { 1, 1, 1 }, { 0.12, 1, 0 }, { 0, 0.44, 0.87 },
  { 0.64, 0.21, 0.93 }, { 1, 0.5, 0 }, { 0.9, 0.8, 0.5 }, { 0, 0.8, 1 },
}
function ns.QualityColor(q)
  local c = ITEM_QUALITY_COLORS and ITEM_QUALITY_COLORS[q]
  if c and c.r then return c.r, c.g, c.b end
  local f = FALLBACK_COLORS[q] or FALLBACK_COLORS[1]
  return f[1], f[2], f[3]
end

-- Look settings (all on the "Popup look" settings page)
function ns.PopupStyle()
  local s = ns.settings.popupStyle
  return LAYOUT[s or ""] and s or "relic"
end
function ns.PopupScale() return ns.settings.popupScale or 1 end
function ns.ModelZoom() return ns.settings.modelZoom or 0.7 end
function ns.WeaponTilt() return ns.settings.weaponTilt or 90 end
function ns.SpinSpeed() return ns.settings.spinSpeed or 0.9 end
function ns.HoldTime(q) -- seconds on screen: the setting, a little longer for better items
  return (ns.settings.popupHold or 5) + math.max(0, math.min(q or 2, 5) - 2) * 1
end

local function Tex(parent, layer, file, blend, sub)
  local t = parent:CreateTexture(nil, layer, nil, sub)
  t:SetTexture(file)
  if blend then t:SetBlendMode(blend) end
  return t
end

local function Badges(item)
  local b = {}
  if (item.count or 1) > 1 then b[#b + 1] = "|cffffffffx" .. item.count .. "|r" end
  if item.src == "created" then b[#b + 1] = "|cff9d9d9dcrafted|r"
  elseif item.src == "pushed" then b[#b + 1] = "|cff9d9d9dreceived|r" end
  if item.test then b[#b + 1] = "|cff9d9d9dpreview|r" end
  return table.concat(b, "   ")
end

-- Item level only means something on gear (weapons 2, armor 4)
local function ShowsItemLevel(item)
  if not item.ilvl or item.ilvl <= 1 then return false end
  if item.classID then return item.classID == 2 or item.classID == 4 end
  return item.equipLoc ~= nil and item.equipLoc ~= "" and item.equipLoc ~= "INVTYPE_NON_EQUIP_IGNORE"
end

function ns.CreateView(f)
  -- background art, all white textures tinted with the quality color
  f.glow = Tex(f, "BACKGROUND", MEDIA .. "Glow", "ADD")
  f.cone = Tex(f, "BACKGROUND", MEDIA .. "Cone", "ADD")
  f.lens = Tex(f, "BACKGROUND", MEDIA .. "Lens")
  f.halo = Tex(f, "BACKGROUND", MEDIA .. "Halo", "ADD", 1)
  f.banner = Tex(f, "BACKGROUND", MEDIA .. "Banner")
  f.bannerTop = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- the banner squashed thin: an edge line
  f.bannerBottom = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- that fades out at both ends
  f.disc = Tex(f, "BORDER", MEDIA .. "Disc", "ADD")
  f.line = Tex(f, "BORDER", "Interface\\Buttons\\WHITE8X8")
  f.shadow = Tex(f, "BORDER", MEDIA .. "Disc") -- relic: a soft shadow under the floating item
  -- banner v2: a diamond emblem behind the item, breaking the band's edges
  f.emblem = Tex(f, "BORDER", MEDIA .. "Diamond", nil, 2)
  f.emblemEdge = Tex(f, "BORDER", MEDIA .. "DiamondEdge", "ADD", 3)
  f.art = { f.glow, f.cone, f.lens, f.halo, f.banner, f.bannerTop, f.bannerBottom, f.disc, f.line,
    f.shadow, f.emblem, f.emblemEdge }
  -- banner v2: a streak of light sweeping across the band, clipped to it
  f.shineClip = CreateFrame("Frame", nil, f)
  if f.shineClip.SetClipsChildren then f.shineClip:SetClipsChildren(true) end
  f.shine = Tex(f.shineClip, "ARTWORK", MEDIA .. "Shine", "ADD") -- drawn tilted

  f.stage = CreateFrame("Frame", nil, f)
  f.model = CreateFrame("PlayerModel", nil, f.stage)
  f.model:SetAllPoints()
  f.card = CreateFrame("Frame", nil, f.stage)
  f.card:SetSize(CARD, CARD)
  f.card:SetPoint("CENTER")
  f.card.edge = Tex(f.card, "BACKGROUND", "Interface\\Buttons\\WHITE8X8")
  f.card.edge:SetAllPoints()
  f.card.icon = Tex(f.card, "ARTWORK", QUESTION)
  f.card.icon:SetPoint("TOPLEFT", 2, -2)
  f.card.icon:SetPoint("BOTTOMRIGHT", -2, 2)
  f.card.icon:SetTexCoord(0.07, 0.93, 0.07, 0.93)

  -- in front of the item: the arrival flash and the sparks
  f.fx = CreateFrame("Frame", nil, f)
  f.fx:SetAllPoints()
  f.fx:SetFrameLevel(f.stage:GetFrameLevel() + 5)
  -- (all in ARTWORK: under the text, which is OVERLAY)
  f.flash = Tex(f.fx, "ARTWORK", MEDIA .. "Glow", "ADD")
  f.waves = { Tex(f.fx, "ARTWORK", MEDIA .. "Wave", "ADD"), Tex(f.fx, "ARTWORK", MEDIA .. "Wave", "ADD") }
  local function Motes(n)
    local list = {}
    for i = 1, n do list[i] = Tex(f.fx, "ARTWORK", MEDIA .. "Mote", "ADD", 1) end
    return list
  end
  f.rise, f.sparks, f.embers = Motes(RISE), Motes(SPARKS), Motes(EMBERS)
  f.fxAll = { f.flash, f.waves[1], f.waves[2] }
  for _, list in ipairs({ f.rise, f.sparks, f.embers }) do
    for _, m in ipairs(list) do f.fxAll[#f.fxAll + 1] = m end
  end

  f.name = f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  f.info = f.fx:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  f.info:SetTextColor(0.8, 0.76, 0.68)
  f.badges = f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  if f.name.SetMaxLines then f.name:SetMaxLines(2) end
  f.name:SetShadowColor(0, 0, 0, 1)
  f.name:SetShadowOffset(1, -1)

  function f:Layout()
    local style = ns.PopupStyle()
    local L = LAYOUT[style]
    self.style, self.L = style, L
    self:SetSize(L.w, L.h)
    self:SetHitRectInsets(L.hit[1], L.hit[2], L.hit[3], L.hit[4])
    for _, t in ipairs(self.art) do t:Hide(); t:ClearAllPoints() end
    for _, t in ipairs(self.fxAll) do t:Hide(); t:ClearAllPoints() end
    for i, m in ipairs(self.rise) do -- beam's motes rise through the light all the time
      m:SetSize(5 + (i % 3), 5 + (i % 3))
      m:SetShown(style == "beam")
    end
    self.fx:SetFrameLevel(self.stage:GetFrameLevel() + 5)
    local sx, sy, sw, sh = L.stage[1], L.stage[2], L.stage[3], L.stage[4]
    self.stage:ClearAllPoints()
    self.stage:SetSize(sw, sh)
    if L.text == "below" then
      self.stage:SetPoint("TOP", self, "TOP", sx, sy)
    else
      self.stage:SetPoint("CENTER", self, "CENTER", sx, sy)
    end
    for _, t in ipairs({ self.flash, self.waves[1], self.waves[2] }) do t:SetPoint("CENTER", self.stage, "CENTER") end
    if TITLE_FONT then self.name:SetFont(TITLE_FONT, L.font, "") end
    local face = self.name:GetFont()
    if not (TITLE_FONT and face and face:lower():find("morpheus")) then self.name:SetFontObject("GameFontNormalLarge") end
    for _, fs in ipairs({ self.name, self.info, self.badges }) do fs:ClearAllPoints() end

    if style == "relic" or style == "beam" then
      if style == "relic" then
        self.glow:SetSize(210, 210)
        self.glow:SetPoint("CENTER", self.stage, "CENTER", 0, 0)
        self.glow:Show()
        self.shadow:SetSize(76, 14)
        self.shadow:SetPoint("CENTER", self.stage, "BOTTOM", 0, 4)
        self.shadow:Show()
      else
        -- the light widens toward the glowing disc the item hovers over, above the name
        self.disc:SetSize(150, 34)
        self.disc:SetPoint("CENTER", self.stage, "BOTTOM", 0, 10)
        self.disc:Show()
        self.cone:SetSize(150, L.h - 30)
        self.cone:SetPoint("BOTTOM", self.disc, "CENTER", 0, -14) -- its soft foot sinks into the disc
        self.cone:Show()
      end
      self.name:SetPoint("TOP", self.stage, "BOTTOM", 0, -6)
      self.name:SetWidth(L.w - 20)
      self.name:SetJustifyH("CENTER")
      self.info:SetPoint("TOP", self.name, "BOTTOM", 0, -3)
      self.info:SetJustifyH("CENTER")
      self.badges:SetPoint("TOP", self.info, "BOTTOM", 0, -3)
      self.badges:SetJustifyH("CENTER")
    elseif style == "halo" then
      for _, t in ipairs({ self.lens, self.halo }) do
        t:SetSize(176, 176)
        t:SetPoint("CENTER", self.stage, "CENTER", 0, 0)
        t:Show()
      end
      self.name:SetPoint("BOTTOMLEFT", self, "LEFT", 196, 6)
      self.name:SetWidth(L.w - 206)
      self.name:SetJustifyH("LEFT")
      self.line:SetSize(L.w - 210, 1)
      self.line:SetPoint("TOPLEFT", self, "LEFT", 196, 0)
      self.line:Show()
      self.info:SetPoint("TOPLEFT", self.line, "BOTTOMLEFT", 0, -6)
      self.info:SetJustifyH("LEFT")
      self.badges:SetPoint("TOPLEFT", self.info, "BOTTOMLEFT", 0, -4)
      self.badges:SetJustifyH("LEFT")
    else -- banner
      self.banner:SetSize(L.w, 58)
      self.banner:SetPoint("CENTER", self, "CENTER", 0, -6)
      self.banner:Show()
      self.bannerTop:SetSize(L.w, 2)
      self.bannerTop:SetPoint("BOTTOM", self.banner, "TOP", 0, -1)
      self.bannerTop:Show()
      self.bannerBottom:SetSize(L.w, 2)
      self.bannerBottom:SetPoint("TOP", self.banner, "BOTTOM", 0, 1)
      self.bannerBottom:Show()
      -- the emblem sits under the item, taller than the band so it breaks its edges
      local ex = L.w / 2 + L.stage[1] -- the stage's center, from the band's left edge
      for _, t in ipairs({ self.emblem, self.emblemEdge }) do
        t:SetSize(96, 96)
        t:SetPoint("CENTER", self.banner, "LEFT", ex, 0)
        t:Show()
      end
      self.shineClip:SetAllPoints(self.banner)
      self.shineClip:Show()
      self.shine:SetSize(90, 90)
      self.shine:Hide() -- Tick shows it for each sweep
      self.name:SetPoint("BOTTOMLEFT", self.banner, "LEFT", 150, 0)
      self.name:SetWidth(L.w - 190)
      self.name:SetJustifyH("LEFT")
      self.info:SetPoint("TOPLEFT", self.name, "BOTTOMLEFT", 0, -2)
      self.info:SetJustifyH("LEFT")
      self.badges:SetPoint("LEFT", self.info, "RIGHT", 12, 0) -- on the info line, inside the band
      self.badges:SetJustifyH("LEFT")
    end
    if style ~= "banner" then self.shineClip:Hide() end
  end

  -- Fill in an item. Call after the frame is shown (the model needs a visible frame).
  function f:SetItem(item)
    self.item = item
    self:Layout()
    local q = item.quality or 1
    local r, g, b = ns.QualityColor(q)
    self.r, self.g, self.b, self.q = r, g, b, q
    self.glow:SetVertexColor(r, g, b, 0.9)
    self.shadow:SetVertexColor(0, 0, 0, 0.6)
    self.emblem:SetVertexColor(r * 0.22, g * 0.22, b * 0.22, 0.95)
    self.emblemEdge:SetVertexColor(math.min(1, r + 0.2), math.min(1, g + 0.2), math.min(1, b + 0.2), 1)
    self.shine:SetVertexColor(math.min(1, r + 0.6), math.min(1, g + 0.6), math.min(1, b + 0.6), 0.55)
    self.cone:SetVertexColor(r, g, b, 0.85)
    self.disc:SetVertexColor(math.min(1, r + 0.25), math.min(1, g + 0.25), math.min(1, b + 0.25), 1)
    self.lens:SetVertexColor(r * 0.1, g * 0.1, b * 0.1, 0.9) -- nearly black with a hint of the color
    self.halo:SetVertexColor(r, g, b, 1)
    self.banner:SetVertexColor(r * 0.3, g * 0.3, b * 0.3, 0.92) -- dark ribbon so the name reads on it
    self.bannerTop:SetVertexColor(r, g, b, 1)
    self.bannerBottom:SetVertexColor(r, g, b, 1)
    if self.line.SetGradient and CreateColor then -- a divider that fades out to the right
      self.line:SetGradient("HORIZONTAL", CreateColor(r, g, b, 0.9), CreateColor(r, g, b, 0))
    else
      self.line:SetVertexColor(r, g, b, 0.6)
    end
    self.flash:SetVertexColor(math.min(1, r + 0.4), math.min(1, g + 0.4), math.min(1, b + 0.4), 1)
    local lr, lg, lb = math.min(1, r + 0.5), math.min(1, g + 0.5), math.min(1, b + 0.5) -- lighter tint
    for _, t in ipairs(self.fxAll) do
      if t ~= self.flash then t:SetVertexColor(lr, lg, lb, 1) end
    end
    self.waves[1]:SetVertexColor(r, g, b, 1)
    -- this arrival's sparks: a ring (rare, epic) or a fountain thrown up at random (legendary)
    self.tier = Tier(q)
    self.arrived = false
    local n = self.tier == "rare" and 8 or self.tier == "epic" and 14 or SPARKS
    self.sparkCount = n
    for i, m in ipairs(self.sparks) do
      if self.tier == "legendary" then
        m.vx, m.vy = (math.random() - 0.5) * 220, 180 + math.random() * 160
      else
        m.ang = i / n * 2 * math.pi + 0.3 -- spread over the sparks this tier shows: a full ring
      end
      local s = self.tier == "legendary" and 4 + (i % 4) or 7
      m:SetSize(s, s)
    end
    for i, m in ipairs(self.embers) do m.phase = i / EMBERS; m:SetSize(4 + (i % 3), 4 + (i % 3)) end
    -- the light holds still (brighter for better items); only the item turns
    local glow = q >= 4 and 0.9 or q >= 3 and 0.75 or 0.6
    self.glow:SetAlpha(glow)
    self.cone:SetAlpha(glow)
    self.disc:SetAlpha(0.9)
    self.halo:SetAlpha(0.9)
    self.card.edge:SetVertexColor(r, g, b, 1)
    self.card.icon:SetTexture(item.icon or QUESTION)
    self.name:SetText(item.name or "?")
    self.name:SetTextColor(r, g, b)
    local info = {}
    if item.typeText and item.typeText ~= "" then info[#info + 1] = item.typeText end
    if ShowsItemLevel(item) then info[#info + 1] = "item level " .. item.ilvl end
    self.info:SetText(table.concat(info, "  -  "))
    self.badges:SetText(Badges(item))
    if self.style == "banner" then
      -- badges ride the info line inside the band; under the name if there's no info, below it if too long
      self.badges:ClearAllPoints()
      local iw = self.info:GetText() ~= "" and self.info:GetStringWidth() or 0
      if iw == 0 then
        self.badges:SetPoint("TOPLEFT", self.name, "BOTTOMLEFT", 0, -2)
      elseif iw + 12 + self.badges:GetStringWidth() > self.L.w - 190 then
        self.badges:SetPoint("TOPLEFT", self.info, "BOTTOMLEFT", 0, -2)
      else
        self.badges:SetPoint("LEFT", self.info, "RIGHT", 12, 0)
      end
    end
    self.age = 0
    self.spin0 = (math.random() - 0.5) * 0.8 -- start facing roughly toward you
    self.card:SetWidth(CARD)
    self.card.icon:SetDesaturated(false)
    self.card.icon:SetVertexColor(1, 1, 1)
    self:SetModel()
  end

  -- The model path: SetItem, then OnModelLoaded (or a 1 s timeout) decides model or card
  function f:SetModel()
    local item, m = self.item, self.model
    self.mode = "card"
    self.card:Show()
    m:Hide()
    if not item or not (item.forceModel or ns.MODEL_SLOTS[item.equipLoc or ""]) or not m.SetItem then
      if self.onModel then self.onModel("card", nil, "no model path"); self.onModel = nil end
      return
    end
    m:Show()
    m:ClearModel()
    self.mode = "pending" -- before SetItem: a cached model can report loaded during the call
    self.pendingAge = 0
    if not pcall(m.SetItem, m, item.id) then
      self.mode = "card"
      m:Hide()
    end
  end

  function f:Frame() -- framing settings, applied whenever the model (re)loads or settings change
    local m = self.model
    m:SetPosition(0, 0, 0)
    if m.SetCamDistanceScale then m:SetCamDistanceScale(ns.ModelZoom() * ((self.L and self.L.zoom) or 1)) end
    if m.SetPitch then -- pitch tips the long axis up (roll spun it around its own length)
      local upright = self.item and UPRIGHT[self.item.equipLoc or ""]
      m:SetPitch(upright and math.rad(ns.WeaponTilt()) or 0)
    end
  end

  function f:CheckModel(why)
    if self.mode ~= "pending" then return end
    local m = self.model
    local fileID = m.GetModelFileID and m:GetModelFileID()
    if why == "loaded" or (fileID and fileID ~= 0) then
      self.mode = "model"
      self:Frame()
      self.card:Hide()
    else -- nothing loaded in time
      self.mode = "card"
      m:Hide()
      self.card:Show()
    end
    if self.onModel then self.onModel(self.mode, fileID, why); self.onModel = nil end
  end

  f.model:SetScript("OnModelLoaded", function()
    if f.mode == "model" then f:Frame() end -- reloaded after the UI was hidden: keep the framing
    f:CheckModel("loaded")
  end)
  f:HookScript("OnShow", function(self)
    if self.item and (self.mode == "model" or self.mode == "pending") then self.model:SetItem(self.item.id) end
  end)

  -- One frame of animation: the item turns, the light breathes, the effects play
  function f:Tick(dt)
    if not self.item then return end -- the preview ticks before its item has loaded
    self.age = (self.age or 0) + dt
    local age = self.age
    local angle = (self.spin0 or 0) + age * ns.SpinSpeed()
    if self.mode == "model" or self.mode == "pending" then
      self.model:SetFacing(angle)
    else
      local c = math.cos(angle * 1.3)
      local back = c < 0
      self.card:SetWidth(math.max(2, CARD * math.abs(c)))
      self.card.icon:SetDesaturated(back)
      local v = back and 0.45 or 1
      self.card.icon:SetVertexColor(v, v, v)
    end

    -- arrival effects start once the popup has faded in (fxDelay), or they'd play while invisible
    local fx = age - (self.fxDelay or 0)

    -- the arrival flash: a burst of light that grows and fades (bigger for better items)
    if fx >= 0 and fx < FLASH_T then
      local a = fx / FLASH_T
      local size = (70 + 190 * a) * (self.q >= 4 and 1.3 or 1)
      self.flash:SetSize(size, size)
      self.flash:SetAlpha((1 - a) * (self.q >= 3 and 0.9 or 0.6))
      self.flash:Show()
    elseif self.flash:IsShown() then
      self.flash:Hide()
    end

    -- beam style: motes rise through the light all the time
    if self.style == "beam" then
      for i, m in ipairs(self.rise) do
        local t = (age * 0.35 + i / RISE) % 1
        local x = math.sin(i * 2.7 + age * 0.8) * 30 * (1 - t * 0.6)
        m:SetPoint("CENTER", self.stage, "BOTTOM", x, 12 + t * 150)
        m:SetAlpha(math.sin(math.pi * t) * 0.9)
      end
    end
    if self.style == "banner" then
      -- a shine sweeps across the band on arrival, then again every few seconds
      local t = fx >= 0 and fx % 5 or -1
      if t >= 0 and t < 0.9 then
        local w = self.L.w
        self.shine:SetPoint("CENTER", self.shineClip, "LEFT", -40 + (w + 80) * (t / 0.9), 0)
        if not self.shine:IsShown() then self.shine:Show() end
      elseif self.shine:IsShown() then
        self.shine:Hide()
      end
    end
    if self.tier and fx >= 0 then self:Arrival(fx) end

    if self.mode == "pending" then
      self.pendingAge = (self.pendingAge or 0) + dt
      if self.pendingAge > 1 then self:CheckModel("timeout") end
    end
  end

  -- The arrival by rarity; fx = seconds since the popup finished fading in
  function f:Arrival(fx)
    local tier, sparks = self.tier, self.sparks
    local cy = self.L.stage[4] / 2 -- offsets below are from the stage's bottom: this is its middle
    local reach = 40 + self.L.stage[3] * 0.5
    if not self.arrived then -- first frame: show what this tier uses
      self.arrived = true
      ns:PlayArrivalSound(tier)
      for i, m in ipairs(sparks) do m:SetShown(i <= self.sparkCount) end
      self.waves[1]:SetShown(tier == "legendary")
      self.waves[2]:SetShown(tier == "legendary")
      for _, m in ipairs(self.embers) do m:SetShown(tier == "legendary") end
    end

    -- the burst (rare, epic: a ring flying out; legendary: a fountain that rises and falls back)
    local burstT = tier == "legendary" and FOUNTAIN_T or BURST_T
    if fx < burstT then
      local a = fx / burstT
      for i = 1, self.sparkCount do
        local m = sparks[i]
        if tier == "legendary" then
          m:SetPoint("CENTER", self.stage, "BOTTOM", m.vx * fx, cy + m.vy * fx + 0.5 * GRAVITY * fx * fx)
        else
          local dist = reach * (tier == "epic" and 1.25 or 1) * (1 - (1 - a) * (1 - a))
          m:SetPoint("CENTER", self.stage, "BOTTOM", math.cos(m.ang) * dist, cy + math.sin(m.ang) * dist)
        end
        m:SetAlpha(1 - a * a)
      end
    elseif sparks[1]:IsShown() then
      for _, m in ipairs(sparks) do m:Hide() end
    end

    if tier == "legendary" then
      -- two shockwaves ripple out
      for k, w in ipairs(self.waves) do
        local t = (fx - (k - 1) * 0.22) / WAVE_T
        if t >= 0 and t < 1 then
          local size = 40 + 300 * t
          w:SetSize(size, size)
          w:SetAlpha((1 - t) * 0.95)
        elseif t < 0 then
          w:SetAlpha(0) -- the second one waits a moment
        elseif w:IsShown() then
          w:Hide()
        end
      end
      -- embers drift up for as long as it stays
      for i, m in ipairs(self.embers) do
        local t = (fx * 0.3 + m.phase) % 1
        local x = math.sin(i * 1.9 + fx * 0.7) * 34
        m:SetPoint("CENTER", self.stage, "BOTTOM", x, 6 + t * (self.L.stage[4] + 40))
        m:SetAlpha(math.sin(math.pi * t) * 0.85 * math.min(1, fx / 0.6)) -- fade in after the shockwave
      end
    end
  end

  return f
end

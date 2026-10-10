-- Dopamine Loot popup view: draws one item in one of four styles. The real popups (Popup.lua) and
-- the live preview on the settings page (Look.lua) both use it, so the preview is exactly what you
-- get. The item turns: its 3D model where the client has one (weapons stand upright), otherwise its
-- icon on a card that flips like a coin.
--   relic   just the item on a soft glow, name below
--   beam    a cone of light rising from a glowing disc, sparks drifting up through it
--   halo    a dark lens inside a ring in the quality color, a bright arc sweeping round, details beside
--   banner  a ribbon in the quality color fading at both ends, the item standing over it
-- Every style: the name in the game's title font, a flash of light as it appears, and a burst of
-- sparks for Rare and better.
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
local MOTES = 8
local FLASH_T, BURST_T = 0.45, 0.8

ns.STYLES = {
  { key = "relic", label = "Relic", tip = "Just the item standing on a soft glow, the name below it. No box." },
  { key = "beam", label = "Beam", tip = "A cone of light rises from a glowing disc under the item, sparks drifting up." },
  { key = "halo", label = "Halo lens", tip = "The item in a dark lens ringed in its color, a bright arc sweeping round; details beside it." },
  { key = "banner", label = "Banner", tip = "A ribbon in the item's color, the item standing over it." },
}
-- view size; the stage (x, y, width, height) where the item stands; where the text goes; the
-- clickable part (insets left, right, top, bottom: the empty glow around it lets clicks through);
-- zoom: camera distance multiplier so the item fits that style's frame
local LAYOUT = {
  relic = { w = 260, h = 230, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  beam = { w = 260, h = 250, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  halo = { w = 400, h = 190, stage = { -110, 0, 104, 116 }, text = "right", hit = { 15, 10, 15, 15 }, zoom = 1.3, font = 18 },
  banner = { w = 420, h = 170, stage = { -140, 4, 110, 150 }, text = "band", hit = { 20, 20, 30, 30 }, zoom = 1, font = 18 },
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
  return LAYOUT[s or ""] and s or "halo"
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
  f.sweep = Tex(f, "BACKGROUND", MEDIA .. "Sweep", "ADD", 2)
  f.banner = Tex(f, "BACKGROUND", MEDIA .. "Banner")
  f.bannerTop = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- the banner squashed thin: an edge line
  f.bannerBottom = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- that fades out at both ends
  f.disc = Tex(f, "BORDER", MEDIA .. "Disc", "ADD")
  f.line = Tex(f, "BORDER", "Interface\\Buttons\\WHITE8X8")
  f.art = { f.glow, f.cone, f.lens, f.halo, f.sweep, f.banner, f.bannerTop, f.bannerBottom, f.disc, f.line }

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
  f.flash = Tex(f.fx, "ARTWORK", MEDIA .. "Glow", "ADD") -- under the text (OVERLAY)
  f.motes = {}
  for i = 1, MOTES do f.motes[i] = Tex(f.fx, "ARTWORK", MEDIA .. "Mote", "ADD") end

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
    self.motesShown = style == "beam" -- beam's motes rise all the time; others only burst
    for i, m in ipairs(self.motes) do
      local s = style == "beam" and 5 + (i % 3) or 7
      m:SetSize(s, s)
      m:ClearAllPoints()
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
    self.flash:ClearAllPoints()
    self.flash:SetPoint("CENTER", self.stage, "CENTER")
    if TITLE_FONT then self.name:SetFont(TITLE_FONT, L.font, "") end
    local face = self.name:GetFont()
    if not (TITLE_FONT and face and face:lower():find("morpheus")) then self.name:SetFontObject("GameFontNormalLarge") end
    for _, fs in ipairs({ self.name, self.info, self.badges }) do fs:ClearAllPoints() end

    if style == "relic" or style == "beam" then
      if style == "relic" then
        self.glow:SetSize(210, 210)
        self.glow:SetPoint("CENTER", self.stage, "CENTER", 0, 0)
        self.glow:Show()
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
      for _, t in ipairs({ self.lens, self.halo, self.sweep }) do
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
      self.name:SetPoint("BOTTOMLEFT", self.banner, "LEFT", 150, 0)
      self.name:SetWidth(L.w - 190)
      self.name:SetJustifyH("LEFT")
      self.info:SetPoint("TOPLEFT", self.name, "BOTTOMLEFT", 0, -2)
      self.info:SetJustifyH("LEFT")
      self.badges:SetPoint("TOPLEFT", self.banner, "BOTTOMLEFT", 150, -4)
      self.badges:SetJustifyH("LEFT")
    end
  end

  -- Fill in an item. Call after the frame is shown (the model needs a visible frame).
  function f:SetItem(item)
    self.item = item
    self:Layout()
    local q = item.quality or 1
    local r, g, b = ns.QualityColor(q)
    self.r, self.g, self.b, self.q = r, g, b, q
    self.glow:SetVertexColor(r, g, b, 0.9)
    self.cone:SetVertexColor(r, g, b, 0.85)
    self.disc:SetVertexColor(math.min(1, r + 0.25), math.min(1, g + 0.25), math.min(1, b + 0.25), 1)
    self.lens:SetVertexColor(r * 0.1, g * 0.1, b * 0.1, 0.9) -- nearly black with a hint of the color
    self.halo:SetVertexColor(r, g, b, 1)
    self.sweep:SetVertexColor(math.min(1, r + 0.5), math.min(1, g + 0.5), math.min(1, b + 0.5), 1)
    self.banner:SetVertexColor(r * 0.3, g * 0.3, b * 0.3, 0.92) -- dark ribbon so the name reads on it
    self.bannerTop:SetVertexColor(r, g, b, 1)
    self.bannerBottom:SetVertexColor(r, g, b, 1)
    if self.line.SetGradient and CreateColor then -- a divider that fades out to the right
      self.line:SetGradient("HORIZONTAL", CreateColor(r, g, b, 0.9), CreateColor(r, g, b, 0))
    else
      self.line:SetVertexColor(r, g, b, 0.6)
    end
    self.flash:SetVertexColor(math.min(1, r + 0.4), math.min(1, g + 0.4), math.min(1, b + 0.4), 1)
    for _, m in ipairs(self.motes) do m:SetVertexColor(math.min(1, r + 0.5), math.min(1, g + 0.5), math.min(1, b + 0.5), 1) end
    self.glowBase = q >= 4 and 0.9 or q >= 3 and 0.75 or 0.6
    self.card.edge:SetVertexColor(r, g, b, 1)
    self.card.icon:SetTexture(item.icon or QUESTION)
    self.name:SetText(item.name or "?")
    self.name:SetTextColor(r, g, b)
    local info = {}
    if item.typeText and item.typeText ~= "" then info[#info + 1] = item.typeText end
    if ShowsItemLevel(item) then info[#info + 1] = "item level " .. item.ilvl end
    self.info:SetText(table.concat(info, "  -  "))
    self.badges:SetText(Badges(item))
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
    local pulse = math.min(1, (self.glowBase or 0.6) + 0.15 * math.sin(age * 2.4))
    self.glow:SetAlpha(pulse)
    self.cone:SetAlpha(pulse)
    self.disc:SetAlpha(0.8 + 0.2 * math.sin(age * 3))
    self.halo:SetAlpha(0.8 + 0.2 * math.sin(age * 2))
    if self.style == "halo" then self.sweep:SetRotation(age * 1.8) end -- head first round the rim

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

    -- sparks: beam style keeps them rising through the light; Rare+ in other styles get a burst
    if self.style == "beam" then
      for i, m in ipairs(self.motes) do
        local t = (age * 0.35 + i / MOTES) % 1
        local x = math.sin(i * 2.7 + age * 0.8) * 30 * (1 - t * 0.6)
        m:SetPoint("CENTER", self.stage, "BOTTOM", x, 12 + t * 150)
        m:SetAlpha(math.sin(math.pi * t) * 0.9)
      end
    elseif self.q >= 3 and fx >= 0 and fx < BURST_T then
      local a = fx / BURST_T
      local dist = (40 + self.L.stage[3] * 0.5) * (1 - (1 - a) * (1 - a))
      for i, m in ipairs(self.motes) do
        local ang = i / MOTES * 2 * math.pi + 0.4
        m:SetPoint("CENTER", self.stage, "BOTTOM", math.cos(ang) * dist, self.L.stage[4] / 2 + math.sin(ang) * dist)
        m:SetAlpha(1 - a)
        if not self.motesShown then m:Show() end
      end
      self.motesShown = true
    elseif self.motesShown and self.style ~= "beam" then
      for _, m in ipairs(self.motes) do m:Hide() end
      self.motesShown = false
    end

    if self.mode == "pending" then
      self.pendingAge = (self.pendingAge or 0) + dt
      if self.pendingAge > 1 then self:CheckModel("timeout") end
    end
  end

  return f
end

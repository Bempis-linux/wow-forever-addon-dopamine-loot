-- Dopamine Loot popup view: draws one item in one of four styles. The real popups (Popup.lua) and
-- the live preview on the settings page (Look.lua) both use it, so the preview is exactly what you
-- get. The item sways gently (Epic and better turn once to face you first): its 3D model where the
-- client has one (weapons stand upright), otherwise its icon on a card that tilts.
--   relic   just the item on a soft glow, name below
--   beam    a cone of light rising from a glowing disc (sparks drifting up through it for Rare+)
--   toast   the game's own loot toast: the icon in a framed banner, name beside it (Blizzard art,
--           so only where the client has the atlases; otherwise Relic)
--   banner  a ribbon in the quality color fading at both ends, the item on a diamond emblem, a shine
--           sweeping across now and then
-- Every style: the name in the game's title font, a flash of light as it appears, and an arrival
-- that grows with rarity (picked in docs/mockups/popups.html): Rare a burst of sparks; Epic star
-- glints (the game's star4) and a bigger burst; Legendary more of both, two shockwaves and embers.
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
local STAR = "Interface\\Cooldown\\star4" -- the game's four-point sparkle
local RISE, SPARKS, GLINTS, EMBERS = 5, 22, 7, 6 -- beam's rising motes; burst sparks; star glints; embers
local FLASH_T, WAVE_T, GLINT_T = 0.45, 0.9, 0.42

-- Arrival by rarity (every style): how many burst sparks, how far and long they fly (k), how many
-- glints; Legendary also gets two shockwaves and embers drifting up
local function Tier(q) return q >= 5 and "legendary" or q == 4 and "epic" or q == 3 and "rare" or nil end
local ARRIVAL = {
  rare = { sparks = 10, k = 1, glints = 0 },
  epic = { sparks = 14, k = 1.15, glints = 5 },
  legendary = { sparks = 22, k = 1.3, glints = 7 },
}

-- The loot toast, laid out like the game's own (LootWonAlertFrameTemplate, AlertFrameSystems.xml):
-- a 276 x 96 frame; the 52 x 52 icon at (22, -23) from its top left in a border by quality; a label
-- line beside the icon's top; the name in the dark box beside it (167 x 33, two lines, centered).
-- The frame: the plain one below Rare (LessAwesome), the default one for Rare and Epic (a slice of
-- LootToast.blp), the gold one for a Legendary (MoreAwesome, the game's "upgraded" toast).
local TOAST_FILE = "Interface\\LootFrame\\LootToast"
local TOAST_COORDS = { 0.28222656, 0.55175781, 0.578125, 0.953125 }
local TOAST_LESS, TOAST_MORE, TOAST_GLOW, TOAST_SHEEN = "LootToast-LessAwesome", "LootToast-MoreAwesome", "loottoast-glow", "loottoast-sheen"
local TOAST_BORDER = { -- the game's LOOT_BORDER_BY_QUALITY
  [1] = "loottoast-itemborder-white", [2] = "loottoast-itemborder-green", [3] = "loottoast-itemborder-blue",
  [4] = "loottoast-itemborder-purple", [5] = "loottoast-itemborder-orange",
}
local function HasAtlas(name) return C_Texture and C_Texture.GetAtlasInfo and C_Texture.GetAtlasInfo(name) ~= nil end
local toastOK
function ns.ToastAvailable()
  if toastOK == nil then toastOK = HasAtlas(TOAST_MORE) and HasAtlas(TOAST_LESS) and HasAtlas(TOAST_GLOW) and HasAtlas(TOAST_SHEEN) end
  return toastOK
end

ns.STYLES = {
  { key = "relic", label = "Relic", tip = "Just the item floating in a soft glow, the name below. No box." },
  { key = "beam", label = "Beam", tip = "A cone of light rises from a glowing disc under the item; sparks drift up through it for Rare and better." },
  { key = "toast", label = "Toast", tip = "The game's own loot toast: the item's icon in a framed banner, the name beside it." },
  { key = "banner", label = "Banner", tip = "A ribbon in the item's color, the item on a diamond emblem, a shine sweeping across." },
}
-- view size; the stage (x, y, width, height) where the item stands; where the text goes; the
-- clickable part (insets left, right, top, bottom: the empty glow around it lets clicks through);
-- zoom: camera distance multiplier so the item fits that style's frame
local LAYOUT = {
  relic = { w = 260, h = 230, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  beam = { w = 260, h = 250, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  toast = { w = 276, h = 96, stage = { -90, -1, 52, 52 }, text = "toast", hit = { 4, 4, 4, 4 }, zoom = 1, font = 15, icon = true },
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
  if s == "halo" then s = "toast"; ns.settings.popupStyle = s end -- Halo lens was dropped in 0.4.7; Toast took its place
  if s == "toast" and not ns.ToastAvailable() then s = "relic" end
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
  -- toast: the game's loot toast frame and its glow (atlases set in Layout)
  f.toastBg = Tex(f, "BACKGROUND")
  f.toastGlow = Tex(f, "BACKGROUND", nil, "ADD", 1)
  f.banner = Tex(f, "BACKGROUND", MEDIA .. "Banner")
  f.bannerTop = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- the banner squashed thin: an edge line
  f.bannerBottom = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- that fades out at both ends
  f.disc = Tex(f, "BORDER", MEDIA .. "Disc", "ADD")
  f.line = Tex(f, "BORDER", "Interface\\Buttons\\WHITE8X8")
  f.shadow = Tex(f, "BORDER", MEDIA .. "Disc") -- relic: a soft shadow under the floating item
  -- banner v2: a diamond emblem behind the item, breaking the band's edges
  f.emblem = Tex(f, "BORDER", MEDIA .. "Diamond", nil, 2)
  f.emblemEdge = Tex(f, "BORDER", MEDIA .. "DiamondEdge", "ADD", 3)
  f.art = { f.glow, f.cone, f.toastBg, f.toastGlow, f.banner, f.bannerTop, f.bannerBottom, f.disc, f.line,
    f.shadow, f.emblem, f.emblemEdge }
  -- banner v2: a streak of light sweeping across the band, clipped to it (toast: the game's sheen)
  f.shineClip = CreateFrame("Frame", nil, f)
  if f.shineClip.SetClipsChildren then f.shineClip:SetClipsChildren(true) end
  f.shine = Tex(f.shineClip, "ARTWORK", MEDIA .. "Shine", "ADD") -- drawn tilted
  f.sheen = Tex(f.shineClip, "ARTWORK", nil, "ADD")

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
  f.card.border = Tex(f.card, "OVERLAY") -- toast: the item border around the icon
  f.card.border:SetPoint("CENTER")

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
  f.glints = {}
  for i = 1, GLINTS do f.glints[i] = Tex(f.fx, "ARTWORK", STAR, "ADD", 2) end
  f.fxAll = { f.flash, f.waves[1], f.waves[2] }
  for _, list in ipairs({ f.rise, f.sparks, f.glints, f.embers }) do
    for _, m in ipairs(list) do f.fxAll[#f.fxAll + 1] = m end
  end

  f.name = f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  f.info = f.fx:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  f.info:SetTextColor(0.8, 0.76, 0.68)
  f.badges = f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  if f.name.SetMaxLines then f.name:SetMaxLines(2) end
  if f.name.SetWordWrap then f.name:SetWordWrap(true) end
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
    for i, m in ipairs(self.rise) do m:SetSize(4 + (i % 2), 4 + (i % 2)) end -- beam's motes (SetItem shows them for Rare+)
    local cs = L.icon and L.stage[3] or CARD
    self.card:SetSize(cs, cs)
    self.card.border:Hide()
    self.shine:Hide()
    self.sheen:Hide()
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
    self.info:SetWidth(0) -- only the toast gives its label line a fixed width

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
    elseif style == "toast" then
      -- the game's loot toast (frame chosen by quality in SetItem), its glow and its sheen
      self.toastBg:SetSize(L.w, L.h)
      self.toastBg:SetPoint("CENTER", self, "CENTER", 0, 0)
      self.toastBg:Show()
      self.toastGlow:SetAtlas(TOAST_GLOW, false)
      self.toastGlow:SetSize(286, 109)
      self.toastGlow:SetPoint("CENTER", self, "CENTER", 0, 0)
      self.toastGlow:SetAlpha(0) -- Tick flares it on arrival
      self.toastGlow:Show()
      self.shineClip:SetAllPoints(self.toastBg)
      self.shineClip:Show()
      self.sheen:SetAtlas(TOAST_SHEEN, false)
      self.sheen:SetSize(171, 75)
      self.sheen:Hide() -- Tick sweeps it across once
      -- the label line beside the icon's top: the item's type and level
      self.info:SetPoint("TOPLEFT", self, "TOPLEFT", 81, -18)
      self.info:SetWidth(167)
      self.info:SetJustifyH("LEFT")
      -- the name fills the dark box: two lines at most, centered up and down
      self.name:SetPoint("TOPLEFT", self, "TOPLEFT", 84, -42)
      self.name:SetPoint("BOTTOMLEFT", self, "TOPLEFT", 84, -75)
      self.name:SetWidth(167)
      self.name:SetJustifyH("LEFT")
      if self.name.SetJustifyV then self.name:SetJustifyV("MIDDLE") end
      self.badges:SetPoint("TOPLEFT", self, "TOPLEFT", 84, -77)
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
    if style ~= "banner" and style ~= "toast" then self.shineClip:Hide() end
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
    if self.style == "toast" then
      -- the frame by quality: plain below Rare, the default for Rare and Epic, gold for a Legendary
      local bg = self.toastBg
      if q >= 5 then
        bg:SetAtlas(TOAST_MORE, false)
      elseif q >= 3 or not HasAtlas(TOAST_LESS) then
        bg:SetTexture(TOAST_FILE)
        bg:SetTexCoord(TOAST_COORDS[1], TOAST_COORDS[2], TOAST_COORDS[3], TOAST_COORDS[4])
      else
        bg:SetAtlas(TOAST_LESS, false)
      end
      bg:SetSize(self.L.w, self.L.h)
      -- the game's item border in the quality's color (at its own size), else a tinted icon frame
      local bd, border = self.card.border, TOAST_BORDER[math.max(1, math.min(q, 5))]
      if border and HasAtlas(border) then
        bd:SetAtlas(border, true)
        bd:SetVertexColor(1, 1, 1, 1)
      else
        bd:SetTexture("Interface\\COMMON\\WhiteIconFrame")
        bd:SetTexCoord(0, 1, 0, 1) -- an atlas from an earlier toast left its coordinates behind
        bd:SetVertexColor(r, g, b, 1)
        bd:SetSize(self.L.stage[3] * 1.18, self.L.stage[3] * 1.18)
      end
      bd:Show()
      self.toastGlow:SetVertexColor(1, 1, 1, 1) -- the game's own gold glow, as its toasts have
    end
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
    -- this arrival: a burst of uneven sparks thrown mostly up and out, slowing as they go, and star
    -- glints popping around the item; more, bigger and farther the rarer it is
    self.tier = Tier(q)
    self.arrived = false
    local A = ARRIVAL[self.tier or ""]
    self.sparkCount, self.glintCount = A and A.sparks or 0, A and A.glints or 0
    if A then
      local reach = (40 + self.L.stage[3] * 0.5) / 105 -- the mockup's distances were for a 130-wide stage
      local spread = self.tier == "legendary" and 0.95 or 0.8
      for _, m in ipairs(self.sparks) do
        local ang = math.pi / 2 + (math.random() * 2 - 1) * math.pi * spread
        local sp = (140 + math.random() * 190) * A.k * reach
        m.vx, m.vy = math.cos(ang) * sp, math.sin(ang) * sp
        m.delay, m.life, m.tw = math.random() * 0.09, (0.45 + math.random() * 0.5) * A.k, math.random() * 6.28
        local s = (1.6 + math.random() * 2) * (0.9 + 0.1 * A.k) * 4.5
        m:SetSize(s, s)
      end
      for i, m in ipairs(self.glints) do
        local ang, rr = math.random() * 2 * math.pi, 105 * reach * (0.42 + math.random() * 0.38)
        m.x, m.y = math.cos(ang) * rr, math.sin(ang) * rr * 0.85
        m.delay = 0.05 + (i - 1) * 0.075 + math.random() * 0.05
        m.size = (14 + math.random() * 8) * (self.tier == "legendary" and 1.25 or 1) * 2.2 -- star4 has room around the star
        m.rot = (math.random() - 0.5) * 0.6
      end
    end
    for i, m in ipairs(self.embers) do m.phase = i / EMBERS; m:SetSize(4 + (i % 3), 4 + (i % 3)) end
    for _, m in ipairs(self.rise) do m:SetShown(self.style == "beam" and q >= 3) end -- beam's sparks: Rare and up
    -- the light holds still (brighter for better items); only the item turns
    local glow = q >= 4 and 0.9 or q >= 3 and 0.75 or 0.6
    self.glow:SetAlpha(glow)
    self.cone:SetAlpha(glow)
    self.disc:SetAlpha(0.9)
    self.card.edge:SetVertexColor(r, g, b, 1)
    self.card.icon:SetTexture(item.icon or QUESTION)
    self.name:SetText(item.name or "?")
    -- a long name: a size or two smaller until it fits on one line (wrapping to two only if even
    -- the smallest doesn't), so it never spills out of the band or the toast
    local face, size, flags = self.name:GetFont()
    if face and size then
      local width = self.name:GetWidth()
      local measure = self.name.GetUnboundedStringWidth or self.name.GetStringWidth
      local s = self.L.font
      while s > self.L.font - 5 and width > 0 and measure(self.name) > width do
        s = s - 1
        self.name:SetFont(face, s, flags or "")
      end
    end
    self.name:SetTextColor(r, g, b)
    local info = {}
    if item.typeText and item.typeText ~= "" then info[#info + 1] = item.typeText end
    if ShowsItemLevel(item) then info[#info + 1] = "item level " .. item.ilvl end
    self.info:SetText(table.concat(info, "  -  "))
    self.badges:SetText(Badges(item))
    local iw = self.info:GetText() ~= "" and self.info:GetStringWidth() or 0
    if self.style == "banner" then
      -- badges ride the info line inside the band; under the name if there's no info, below it if too long
      self.badges:ClearAllPoints()
      if iw == 0 then
        self.badges:SetPoint("TOPLEFT", self.name, "BOTTOMLEFT", 0, -2)
      elseif iw + 12 + self.badges:GetStringWidth() > self.L.w - 190 then
        self.badges:SetPoint("TOPLEFT", self.info, "BOTTOMLEFT", 0, -2)
      else
        self.badges:SetPoint("LEFT", self.info, "RIGHT", 12, 0)
      end
    elseif self.style == "toast" and iw > 0 and iw + 10 + self.badges:GetStringWidth() <= 167 then
      -- toast: badges join the label line when they fit (else they stay under the name's box)
      self.badges:ClearAllPoints()
      self.badges:SetPoint("LEFT", self.info, "LEFT", iw + 10, 0)
    end
    self.age = 0
    self.cardW = self.L.icon and self.L.stage[3] or CARD
    -- weapons stood upright show their edge at facing 0: a quarter turn shows the flat side
    self.face = (UPRIGHT[item.equipLoc or ""] and ns.WeaponTilt() ~= 0) and math.pi / 2 or 0
    self.card:SetWidth(self.cardW)
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
    if self.L and self.L.icon then -- this style shows the icon (toast)
      if self.onModel then self.onModel("card", nil, "style shows the icon"); self.onModel = nil end
      return
    end
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
    -- it sways gently side to side around facing you; Epic and better first turn once all the way
    -- round (easing out) to face you (the "Sway speed" setting; 0 holds it still)
    local speed, angle = ns.SpinSpeed(), 0
    local TURN = 1.4
    if speed > 0 then
      if self.q >= 4 and age < TURN then
        local a = age / TURN
        angle = (1 - (1 - a) * (1 - a) * (1 - a)) * 2 * math.pi
      else
        local t = self.q >= 4 and age - TURN or age
        angle = (self.q >= 4 and 0.3 or 0.45) * math.sin(t * speed)
      end
    end
    if self.mode == "model" or self.mode == "pending" then
      self.model:SetFacing(angle + (self.face or 0))
    elseif not self.L.icon then -- a card tilts with the sway and never shows its back
      self.card:SetWidth(self.cardW * (0.78 + 0.22 * math.abs(math.cos(angle))))
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

    -- beam style, Rare and up: a few motes rise slowly through the light
    if self.style == "beam" and self.q >= 3 then
      for i, m in ipairs(self.rise) do
        local t = (age * 0.2 + i / RISE) % 1
        local x = math.sin(i * 2.1) * 26 * (1 - t * 0.5)
        m:SetPoint("CENTER", self.stage, "BOTTOM", x, 12 + t * 150)
        m:SetAlpha(math.sin(math.pi * t) * 0.7)
      end
    end
    if self.style == "toast" then
      -- the game's toast glow flares once as it arrives, then its sheen sweeps across once
      local g = fx >= 0 and fx < 0.8 and math.sin(math.pi * fx / 0.8) or 0
      self.toastGlow:SetAlpha(g)
      local t = fx - 0.15
      if t >= 0 and t < 0.85 then
        local w = self.shineClip:GetWidth()
        self.sheen:SetPoint("CENTER", self.shineClip, "LEFT", -60 + (w + 120) * (t / 0.85), 0)
        if not self.sheen:IsShown() then self.sheen:Show() end
      elseif self.sheen:IsShown() then
        self.sheen:Hide()
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
    local tier, sparks, glints = self.tier, self.sparks, self.glints
    if not self.arrived then -- first frame: show what this tier uses
      self.arrived = true
      ns:PlayArrivalSound(tier)
      self.fxDone = false
      self.waves[1]:SetShown(tier == "legendary")
      self.waves[2]:SetShown(tier == "legendary")
      for _, m in ipairs(self.embers) do m:SetShown(tier == "legendary") end
    end

    -- the burst: each spark leaves after its own short delay, flies fast and slows (drag), sinks a
    -- little, twinkles and fades; the glints pop in and out one after another, turning slightly
    if not self.fxDone then
      local live = false
      for i, m in ipairs(sparks) do
        local t = fx - (m.delay or 0)
        if i <= self.sparkCount and t >= 0 and t < m.life then
          local travel = (1 - math.exp(-4 * t)) / 4
          m:SetPoint("CENTER", self.stage, "CENTER", m.vx * travel, m.vy * travel - 70 * t * t)
          m:SetAlpha(math.max(0, (1 - t / m.life) * (0.7 + 0.3 * math.sin(t * 38 + m.tw))))
          if not m:IsShown() then m:Show() end
          live = true
        elseif m:IsShown() then
          m:Hide()
        end
        if i <= self.sparkCount and t < 0 then live = true end
      end
      for i, m in ipairs(glints) do
        local t = fx - (m.delay or 0)
        if i <= self.glintCount and t >= 0 and t < GLINT_T then
          local u = t / GLINT_T
          local grow = math.sin(math.pi * u)
          m:SetPoint("CENTER", self.stage, "CENTER", m.x, m.y)
          m:SetSize(math.max(1, m.size * grow), math.max(1, m.size * grow))
          m:SetRotation(m.rot + u * 0.6)
          m:SetAlpha(grow)
          if not m:IsShown() then m:Show() end
          live = true
        elseif m:IsShown() then
          m:Hide()
        end
        if i <= self.glintCount and t < 0 then live = true end
      end
      if not live then self.fxDone = true end
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

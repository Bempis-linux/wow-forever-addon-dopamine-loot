-- Dopamine Loot popup view: draws one item in one of three styles. The real popups (Popup.lua) and
-- the live preview on the settings page (Look.lua) both use it, so the preview is exactly what you
-- get. The item sways gently (Epic and better turn once to face you first): its 3D model where the
-- client has one (weapons stand upright), otherwise its icon on a card that tilts.
--   relic   just the item on a soft glow, name below
--   beam    a cone of light rising from a glowing disc (sparks drifting up through it for Rare+)
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
-- The 3D model's frame is this much bigger than its stage, and the camera this much farther away,
-- so items look the same size but long ones (Thunderfury) reach out past the popup instead of being
-- cut off at the stage's edges; the text stays in front of it
local MODEL_ROOM = 1.8
local SPLASH_W, SPLASH_H = 400, 100 -- the Splash banner (SplashBand.tga is 512x128)
local STAR = "Interface\\Cooldown\\star4" -- the game's four-point sparkle
local RISE, SPARKS, GLINTS, EMBERS = 5, 22, 7, 6 -- beam's rising motes; burst sparks; star glints; embers
local FLASH_T, WAVE_T, GLINT_T = 0.45, 0.9, 0.42

-- Arrival by rarity (every style): how many burst sparks, how far and long they fly (k), how many
-- glints; Legendary also gets two shockwaves and embers drifting up
local function Tier(q) return q >= 5 and "legendary" or q == 4 and "epic" or q == 3 and "rare" or q == 2 and "uncommon" or nil end
local ARRIVAL = {
  uncommon = { sparks = 6, k = 0.8, glints = 0 }, -- (a full Uncommon popup: its arrival, or these few sparks)
  rare = { sparks = 10, k = 1, glints = 0 },
  epic = { sparks = 14, k = 1.15, glints = 5 },
  legendary = { sparks = 22, k = 1.3, glints = 7 },
}

ns.STYLES = {
  { key = "relic", label = "Relic (default)", tip = "The item floating in a soft glow, its name below. No box around it." },
  { key = "beam", label = "Beam", tip = "A cone of light rising from a glowing disc under the item; for Rare and better, sparks drift up through it." },
  { key = "banner", label = "Banner", tip = "A ribbon in the item's color with its name on it, the item on a diamond emblem, a shine sweeping across." },
  { key = "splash", label = "Splash", tip = "A slanted banner slashes in behind a big name, with speed lines and a shine; the rarity is stamped on. Thicker the rarer: a crossing second banner for Epic, gold trim for Legendary." },
  { key = "aura", label = "Aura", tip = "The item in an aura of its color: soft wisps of light rise behind it and its glow breathes; the rarity under the name." },
  { key = "achievement", label = "Achievement", tip = "A small medallion with the item beside a name plate, like an achievement toast." },
}
-- view size; the stage (x, y, width, height) where the item stands; where the text goes; the
-- clickable part (insets left, right, top, bottom: the empty glow around it lets clicks through);
-- zoom: camera distance multiplier so the item fits that style's frame
local LAYOUT = {
  relic = { w = 260, h = 230, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  beam = { w = 260, h = 250, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 19 },
  banner = { w = 420, h = 170, stage = { -140, -6, 110, 150 }, text = "band", hit = { 20, 20, 30, 30 }, zoom = 1, font = 18 },
  splash = { w = 380, h = 240, stage = { 0, -4, 130, 150 }, text = "below", hit = { 70, 70, 0, 0 }, zoom = 1, font = 24 },
  aura = { w = 260, h = 250, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 }, zoom = 1, font = 20 },
  achievement = { w = 360, h = 140, stage = { -116, 0, 104, 130 }, text = "right", hit = { 0, 26, 30, 30 }, zoom = 1.9, font = 18 }, -- (zoom: the camera farther back, so the item fits in its medallion)
  -- low rarities and combat (Popup.lua decides): one line, the icon and the name
  compact = { w = 260, h = 30, stage = { -116, 0, 22, 22 }, text = "compact", hit = { 0, 0, 0, 0 }, zoom = 1, font = 14, icon = true },
}

-- Items that have a model of their own; body armor is textures on a body, so it shows as a card
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
  if s == "halo" or s == "toast" then s = "relic"; ns.settings.popupStyle = s end -- both set aside (0.4.7, 0.4.14)
  return LAYOUT[s or ""] and s or "relic"
end
function ns.PopupScale() return ns.settings.popupScale or 0.8 end
function ns.ModelZoom() return ns.settings.modelZoom or 0.7 end
function ns.WeaponTilt() return ns.settings.weaponTilt or 90 end
function ns.SpinSpeed() return ns.settings.spinSpeed or 0.9 end
-- Seconds on screen by rarity: the setting is the base (default 5),
-- times 0.5 up to Uncommon (and compact), 0.8 Rare, 1.2 Epic, 1.6 Legendary: 2.5 / 4 / 6 / 8 s
local HOLD = { [0] = 0.5, 0.5, 0.5, 0.8, 1.2, 1.6 }
function ns.HoldTime(q)
  return (ns.settings.popupHold or 5) * HOLD[math.min(math.max(q or 2, 0), 5)]
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
  f.banner = Tex(f, "BACKGROUND", MEDIA .. "Banner")
  f.bar = Tex(f, "BACKGROUND", "Interface\\Buttons\\WHITE8X8") -- compact: a dark strip fading to the right
  f.bannerTop = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- the banner squashed thin: an edge line
  f.bannerBottom = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- that fades out at both ends
  f.disc = Tex(f, "BORDER", MEDIA .. "Disc", "ADD")
  f.line = Tex(f, "BORDER", "Interface\\Buttons\\WHITE8X8")
  f.shadow = Tex(f, "BORDER", MEDIA .. "Disc") -- relic: a soft shadow under the floating item
  -- banner v2: a diamond emblem behind the item, breaking the band's edges
  f.emblem = Tex(f, "BORDER", MEDIA .. "Diamond", nil, 2)
  f.emblemEdge = Tex(f, "BORDER", MEDIA .. "DiamondEdge", "ADD", 3)
  -- relic and beam: a soft dark plate behind the name and info (fading out at both ends, so it's
  -- no box) and a thin underline in the quality color that fades out to both sides
  local WHITE = "Interface\\Buttons\\WHITE8X8"
  f.plateL, f.plateR = Tex(f, "BORDER", WHITE, nil, -1), Tex(f, "BORDER", WHITE, nil, -1) -- under the disc and shadow
  f.underL, f.underR = Tex(f, "BORDER", WHITE, nil, 2), Tex(f, "BORDER", WHITE, nil, 2)
  -- Splash: the slanted banner (and a crossing one for Epic, gold trim for Legendary), its edge lines,
  -- an info tab, speed lines and the rarity stamp (picked in docs/mockups/popup-designs.html)
  f.splashBand = Tex(f, "BORDER", MEDIA .. "SplashBand", nil, 1)
  f.splashBand2 = Tex(f, "BORDER", MEDIA .. "SplashBand", nil, 2) -- (solid, not additive: over the main band it must not blow out to white)
  f.splashEdge = Tex(f, "BORDER", MEDIA .. "SplashEdge", "ADD", 3)
  f.splashTrim = Tex(f, "BORDER", MEDIA .. "SplashEdge", "ADD", 4)
  f.tabBack = Tex(f, "BORDER", MEDIA .. "Glow", nil, 5) -- (a soft dark shadow under the info, no box)
  -- Aura: a breathing glow and soft wisps of light rising behind the item
  f.auraGlow = Tex(f, "BACKGROUND", MEDIA .. "Glow", "ADD")
  f.wisps = {}
  for i = 1, 14 do f.wisps[i] = Tex(f, "BACKGROUND", MEDIA .. "Glow", "ADD", 1) end
  -- Achievement: a ribbon: the band (0) and its edge lines (1) start behind the medallion, whose dark
  -- disc (2), ring in the quality color (3) and inner glow (4) sit on top of their left end
  f.achPlate = Tex(f, "BORDER", WHITE, nil, 0)
  f.achLine = Tex(f, "BORDER", WHITE, nil, 1)
  f.achLine2 = Tex(f, "BORDER", WHITE, nil, 1)
  f.medalDisc = Tex(f, "BORDER", MEDIA .. "Disc", nil, 2)
  f.medalRing = Tex(f, "BORDER", MEDIA .. "Wave", "ADD", 3)
  f.medalGlow = Tex(f, "BORDER", MEDIA .. "Glow", "ADD", 4)
  f.art = { f.glow, f.cone, f.bar, f.banner, f.bannerTop, f.bannerBottom, f.disc, f.line,
    f.shadow, f.emblem, f.emblemEdge, f.plateL, f.plateR, f.underL, f.underR,
    f.splashBand, f.splashBand2, f.splashEdge, f.splashTrim, f.tabBack, f.auraGlow,
    f.medalGlow, f.medalDisc, f.medalRing, f.achPlate, f.achLine, f.achLine2 }
  for _, t in ipairs(f.wisps) do f.art[#f.art + 1] = t end
  -- banner v2: a streak of light sweeping across the band, clipped to it
  f.shineClip = CreateFrame("Frame", nil, f)
  if f.shineClip.SetClipsChildren then f.shineClip:SetClipsChildren(true) end
  f.shine = Tex(f.shineClip, "ARTWORK", MEDIA .. "Shine", "ADD") -- drawn tilted

  f.stage = CreateFrame("Frame", nil, f)
  f.model = CreateFrame("PlayerModel", nil, f.stage)
  f.model:SetPoint("CENTER") -- sized in Layout: bigger than the stage, so long weapons are not cut off
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
  f.glints = {}
  for i = 1, GLINTS do f.glints[i] = Tex(f.fx, "ARTWORK", STAR, "ADD", 2) end
  f.fxAll = { f.flash, f.waves[1], f.waves[2] }
  for _, list in ipairs({ f.rise, f.sparks, f.glints, f.embers }) do
    for _, m in ipairs(list) do f.fxAll[#f.fxAll + 1] = m end
  end

  -- relic and beam: a streak of light sweeping across the name as it lands (twice for a Legendary);
  -- clipped to the name, above it
  f.nameClip = CreateFrame("Frame", nil, f.fx)
  if f.nameClip.SetClipsChildren then f.nameClip:SetClipsChildren(true) end
  f.nameClip:SetFrameLevel(f.fx:GetFrameLevel() + 2)
  f.nameShine = Tex(f.nameClip, "OVERLAY", MEDIA .. "Shine", "ADD")
  f.nameShine:Hide()

  -- Splash: speed lines streaking across, and the rarity stamp (a plate with a white edge and a word)
  f.speed = {}
  for i = 1, 3 do f.speed[i] = Tex(f.fx, "ARTWORK", MEDIA .. "Glow", "ADD"); f.fxAll[#f.fxAll + 1] = f.speed[i] end
  f.stampEdge = Tex(f.fx, "ARTWORK", WHITE, nil, 3)
  f.stampBack = Tex(f.fx, "ARTWORK", WHITE, nil, 4)
  f.fxAll[#f.fxAll + 1] = f.stampEdge
  f.fxAll[#f.fxAll + 1] = f.stampBack
  f.stamp = f.fx:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
  f.stamp:SetFont("Fonts\\FRIZQT__.TTF", 12, "OUTLINE")
  -- the rarity word (Aura, Achievement), spaced out
  f.tag = f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  -- Epic and better: the name's letters stamp in one after another (one text each; see Letters)
  f.letters, f.measure = {}, f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  f.measure:Hide()

  f.name = f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  f.info = f.fx:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  f.info:SetTextColor(0.8, 0.76, 0.68)
  if f.info.SetWordWrap then f.info:SetWordWrap(false) end -- one line in every style
  f.badges = f.fx:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  if f.name.SetMaxLines then f.name:SetMaxLines(2) end
  if f.name.SetWordWrap then f.name:SetWordWrap(true) end
  f.name:SetShadowColor(0, 0, 0, 1)
  f.name:SetShadowOffset(1, -1)

  function f:Layout()
    local style = self.styleOverride or ns.PopupStyle()
    local L = LAYOUT[style]
    self.style, self.L = style, L
    self:SetSize(L.w, L.h)
    self:SetHitRectInsets(L.hit[1], L.hit[2], L.hit[3], L.hit[4])
    for _, t in ipairs(self.art) do t:Hide(); t:ClearAllPoints() end
    for _, t in ipairs(self.fxAll) do t:Hide(); t:ClearAllPoints() end
    for i, m in ipairs(self.rise) do m:SetSize(4 + (i % 2), 4 + (i % 2)) end -- beam's motes (SetItem shows them for Rare+)
    local cs = L.icon and L.stage[3] or CARD
    self.card:SetSize(cs, cs)
    self.shine:Hide()
    self.nameShine:Hide()
    self.shineTimes = nil
    self.fx:SetFrameLevel(self.stage:GetFrameLevel() + 5)
    self.nameClip:SetFrameLevel(self.fx:GetFrameLevel() + 2)
    local sx, sy, sw, sh = L.stage[1], L.stage[2], L.stage[3], L.stage[4]
    self.stage:ClearAllPoints()
    self.stage:SetSize(sw, sh)
    self.model:SetSize(sw * MODEL_ROOM, sh * MODEL_ROOM) -- more room than its stage (see MODEL_ROOM)
    if L.text == "below" then
      self.stage:SetPoint("TOP", self, "TOP", sx, sy)
    else
      self.stage:SetPoint("CENTER", self, "CENTER", sx, sy)
    end
    for _, t in ipairs({ self.flash, self.waves[1], self.waves[2] }) do t:SetPoint("CENTER", self.stage, "CENTER") end
    if TITLE_FONT then self.name:SetFont(TITLE_FONT, L.font, "") end
    local face = self.name:GetFont()
    if not (TITLE_FONT and face and face:lower():find("morpheus")) then self.name:SetFontObject("GameFontNormalLarge") end
    for _, fs in ipairs({ self.name, self.info, self.badges, self.tag, self.stamp }) do fs:ClearAllPoints() end
    self.info:SetTextColor(0.8, 0.76, 0.68)
    self.tag:Hide()
    self.info:SetWidth(0) -- (no limit, unless a style sets one)
    self.stamp:Hide()
    self.name:SetAlpha(1)
    for _, l in ipairs(self.letters) do l:Hide() end
    self.lettersOn = nil

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
    elseif style == "splash" then
      -- the banner runs across under the item's foot; the name sits on it, the info on a dark tab
      -- below; the bands are anchored by their left (right for the crossing one) and revealed by Tick
      self.splashBand:SetPoint("LEFT", self.stage, "BOTTOM", -SPLASH_W / 2, -26)
      self.splashEdge:SetPoint("LEFT", self.stage, "BOTTOM", -SPLASH_W / 2, -26)
      self.splashTrim:SetPoint("LEFT", self.stage, "BOTTOM", -SPLASH_W / 2 - 6, -26)
      self.splashBand2:SetPoint("RIGHT", self.stage, "BOTTOM", SPLASH_W / 2 - 30, -30)
      self.name:SetPoint("CENTER", self.stage, "BOTTOM", 0, -24)
      self.name:SetWidth(L.w - 30)
      self.name:SetJustifyH("CENTER")
      self.info:SetPoint("TOP", self.name, "BOTTOM", 0, -12)
      self.info:SetJustifyH("CENTER")
      self.tabBack:SetPoint("CENTER", self.info, "CENTER", 0, 0)
      self.tabBack:SetVertexColor(0, 0, 0, 0.8)
      self.tabBack:Show()
      self.badges:SetPoint("TOP", self.info, "BOTTOM", 0, -8)
      self.badges:SetJustifyH("CENTER")
      self.stamp:SetPoint("CENTER", self.stage, "BOTTOMRIGHT", 34, 10)
      self.shineClip:SetAllPoints(self.splashBand)
      self.shineClip:Show()
      self.shine:SetSize(90, 120)
      self.shine:Hide()
    elseif style == "aura" then
      -- like the Relic, without the plate: the name, the rarity word spaced out, the info
      self.auraGlow:SetPoint("CENTER", self.stage, "CENTER", 0, -10)
      self.auraGlow:Show()
      self.name:SetPoint("TOP", self.stage, "BOTTOM", 0, -6)
      self.name:SetWidth(L.w - 20)
      self.name:SetJustifyH("CENTER")
      self.tag:SetPoint("TOP", self.name, "BOTTOM", 0, -3)
      self.info:SetPoint("TOP", self.tag, "BOTTOM", 0, -3)
      self.info:SetJustifyH("CENTER")
      self.badges:SetPoint("TOP", self.info, "BOTTOM", 0, -3)
      self.badges:SetJustifyH("CENTER")
      self.tag:Show()
      for _, w in ipairs(self.wisps) do w.age = nil end
    elseif style == "achievement" then
      -- one ribbon: the medallion (a dark disc with a ring in the item's color and a soft glow inside)
      -- sits on the left end of a dark band edged top and bottom by lines in the item's color; band
      -- and lines start behind the medallion and fade out to the right, the text between them
      self.medalGlow:SetSize(96, 96)
      self.medalGlow:SetPoint("CENTER", self.stage, "CENTER")
      self.medalDisc:SetSize(112, 112)
      self.medalDisc:SetPoint("CENTER", self.stage, "CENTER")
      self.medalRing:SetSize(124, 124)
      self.medalRing:SetPoint("CENTER", self.stage, "CENTER")
      self.achPlate:SetSize(290, 70)
      self.achPlate:SetPoint("LEFT", self.stage, "CENTER", 0, 0)
      if self.achPlate.SetGradient and CreateColor then
        self.achPlate:SetGradient("HORIZONTAL", CreateColor(0.03, 0.025, 0.02, 0.9), CreateColor(0.03, 0.025, 0.02, 0))
      else
        self.achPlate:SetVertexColor(0.03, 0.025, 0.02, 0.7)
      end
      self.achLine:SetSize(290, 1.5)
      self.achLine:SetPoint("BOTTOMLEFT", self.achPlate, "TOPLEFT", 0, 0)
      self.achLine2:SetSize(290, 1.5)
      self.achLine2:SetPoint("TOPLEFT", self.achPlate, "BOTTOMLEFT", 0, 0)
      for _, t in ipairs({ self.medalGlow, self.medalDisc, self.medalRing, self.achPlate, self.achLine, self.achLine2 }) do t:Show() end
      self.tag:SetPoint("TOPLEFT", self.stage, "CENTER", 70, 26)
      self.name:SetPoint("TOPLEFT", self.tag, "BOTTOMLEFT", 0, -2)
      self.name:SetWidth(200)
      self.name:SetJustifyH("LEFT")
      self.info:SetPoint("TOPLEFT", self.name, "BOTTOMLEFT", 0, -2)
      self.info:SetJustifyH("LEFT")
      self.info:SetWidth(200) -- (stays on the plate)
      self.badges:SetPoint("LEFT", self.info, "RIGHT", 10, 0)
      self.badges:SetJustifyH("LEFT")
      self.tag:Show()
    elseif style == "compact" then
      -- one line: the icon, then the name on a dark strip that fades out to the right
      self.bar:SetPoint("TOPLEFT", self, "TOPLEFT", 0, 0)
      self.bar:SetPoint("BOTTOMRIGHT", self, "BOTTOMRIGHT", 0, 0)
      if self.bar.SetGradient and CreateColor then
        self.bar:SetGradient("HORIZONTAL", CreateColor(0, 0, 0, 0.75), CreateColor(0, 0, 0, 0))
      else
        self.bar:SetVertexColor(0, 0, 0, 0.6)
      end
      self.bar:Show()
      self.name:SetPoint("LEFT", self.stage, "RIGHT", 7, 0)
      self.name:SetWidth(L.w - L.stage[3] - 20)
      self.name:SetJustifyH("LEFT")
      self.badges:SetPoint("LEFT", self.name, "RIGHT", 6, 0)
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
    if style ~= "banner" and style ~= "splash" then self.shineClip:Hide() end
  end

  -- Fill in an item. Call after the frame is shown (the model needs a visible frame).
  function f:SetItem(item)
    self.item = item
    self.styleOverride = item.compact and "compact" or nil -- Popup.lua decides (low rarity, combat)
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
    local qr, qg, qb = math.min(1, r + 0.35), math.min(1, g + 0.35), math.min(1, b + 0.35) -- lighter tint
    -- Splash: the banner in the item's color, white edges, a lighter crossing band (Epic+), gold trim
    -- (Legendary); Tick reveals them
    self.splashBand:SetVertexColor(r * 0.85, g * 0.85, b * 0.85, 0.95)
    self.splashEdge:SetVertexColor(1, 1, 1, 0.9)
    self.splashBand2:SetVertexColor(r * 0.5, g * 0.5, b * 0.5, 0.9) -- a darker stripe of the same color, crossing it
    self.splashTrim:SetVertexColor(1, 0.82, 0.4, 1)
    -- the rarity word (the stamp in Splash; the tag in Aura and Achievement)
    local word = (_G["ITEM_QUALITY" .. q .. "_DESC"] or ({ "Common", "Uncommon", "Rare", "Epic", "Legendary" })[q] or ""):upper()
    self.stamp:SetText(word .. "!")
    self.tag:SetText(word)
    self.tag:SetTextColor(qr, qg, qb)
    -- Aura and Achievement
    self.auraGlow:SetVertexColor(qr, qg, qb, 1)
    for _, w in ipairs(self.wisps) do w:SetVertexColor(r, g, b, 1) end
    self.medalGlow:SetVertexColor(r, g, b, 0.45)
    self.medalDisc:SetVertexColor(0.08, 0.06, 0.03, 0.95)
    self.medalRing:SetVertexColor(r, g, b, 1)
    if self.achLine.SetGradient and CreateColor then -- the line above the name, fading out to the right
      self.achLine:SetGradient("HORIZONTAL", CreateColor(r, g, b, 0.9), CreateColor(r, g, b, 0))
      self.achLine2:SetGradient("HORIZONTAL", CreateColor(r, g, b, 0.6), CreateColor(r, g, b, 0))
    else
      self.achLine:SetVertexColor(r, g, b, 0.6)
      self.achLine2:SetVertexColor(r, g, b, 0.4)
    end
    self.disc:SetVertexColor(math.min(1, r + 0.25), math.min(1, g + 0.25), math.min(1, b + 0.25), 1)
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
    -- (after the tint above: Splash's speed lines are white, its stamp a plate in the item's color
    -- with a white edge, so the white word reads on it)
    for _, t in ipairs(self.speed) do t:SetVertexColor(1, 1, 1, 1) end
    self.stampBack:SetVertexColor(r, g, b, 1)
    self.stampEdge:SetVertexColor(1, 1, 1, 1)
    self.waves[1]:SetVertexColor(r, g, b, 1)
    -- this arrival: a burst of uneven sparks thrown mostly up and out, slowing as they go, and star
    -- glints popping around the item; more, bigger and farther the rarer it is
    self.tier = self.style ~= "compact" and Tier(q) or nil -- a compact popup has no arrival
    self.arrived, self.bigArrival = false, nil
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
    -- the smallest doesn't), so it never spills out of the band
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
    self.info:SetText(self.style == "compact" and "" or table.concat(info, "  ·  "))
    self.badges:SetText(Badges(item))
    if self.style == "compact" then -- the name only as wide as it is, so the badges follow it on the strip
      local bw = self.badges:GetText() ~= "" and self.badges:GetStringWidth() + 6 or 0
      local measure = self.name.GetUnboundedStringWidth or self.name.GetStringWidth
      self.name:SetWidth(math.max(20, math.min(measure(self.name) + 2, self.L.w - self.L.stage[3] - 20 - bw)))
    end
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
    end
    if self.style == "relic" or self.style == "beam" then self:Plate(iw) end
    -- Splash: the info tab only when there's info; the stamp's width at its normal size (it's
    -- scaled up by hand as it slams in)
    self.tabBack:SetShown(self.style == "splash" and (self.info:GetText() or "") ~= "")
    self.tabBack:SetSize(self.info:GetStringWidth() + 90, 36)
    if self.stamp.SetTextScale then self.stamp:SetTextScale(1) else self.stamp:SetFont("Fonts\\FRIZQT__.TTF", 12, "OUTLINE") end
    self.stampW = self.stamp:GetStringWidth()
    self.splashDone, self.wispT = nil, 0
    self:PrepareLetters()
    -- the name's shine waits until its letters have landed (Relic and Beam)
    if self.lettersOn and self.shineTimes then
      local wait = 0.15 + (self.letterCount or 0) * 0.05 + 0.26
      for k, t0 in ipairs(self.shineTimes) do self.shineTimes[k] = t0 + wait end
    end
    self.arrivalGen = (self.arrivalGen or 0) + 1 -- (an arrival still running from the last item stops)
    if ns.ItemAlpha then ns.ItemAlpha(self, 1) else self.stage:SetAlpha(1) end -- (an arrival may fade the item in; one cut short must not leave it faded)
    self.age = 0
    self.cardW = self.L.icon and self.L.stage[3] or CARD
    -- weapons stood upright show their edge at facing 0: a quarter turn shows the flat side
    self.face = (UPRIGHT[item.equipLoc or ""] and ns.WeaponTilt() ~= 0) and math.pi / 2 or 0
    self.card:SetWidth(self.cardW)
    self.card.icon:SetDesaturated(false)
    self.card.icon:SetVertexColor(1, 1, 1)
    self:SetModel()
  end

  -- Relic and beam: the plate behind the text, the underline under the name and the name's shine,
  -- sized to the text as it is now (iw = the info line's width, 0 if there is none)
  function f:Plate(iw)
    local measure = self.name.GetUnboundedStringWidth or self.name.GetStringWidth
    local nw = math.min(measure(self.name), self.name:GetWidth())
    local nh = self.name:GetStringHeight() or 20
    local half = math.max(nw, iw) / 2 + 36
    local h = nh + (iw > 0 and (self.info:GetStringHeight() or 12) + 4 or 0) + 12
    local r, g, b = self.r, self.g, self.b
    local gradient = self.plateL.SetGradient and CreateColor
    for i, t in ipairs({ self.plateL, self.plateR }) do
      t:SetSize(half, h)
      t:SetPoint(i == 1 and "TOPRIGHT" or "TOPLEFT", self.name, "TOP", 0, 6)
      if gradient then -- dark in the middle, clear at the ends
        local clear, dark = CreateColor(0, 0, 0, 0), CreateColor(0, 0, 0, 0.55)
        t:SetGradient("HORIZONTAL", i == 1 and clear or dark, i == 1 and dark or clear)
      else
        t:SetVertexColor(0, 0, 0, 0.35)
      end
      t:Show()
    end
    for i, t in ipairs({ self.underL, self.underR }) do
      t:SetSize(nw / 2 + 10, 1)
      t:SetPoint(i == 1 and "TOPRIGHT" or "TOPLEFT", self.name, "BOTTOM", 0, -1)
      if gradient then
        local clear, full = CreateColor(r, g, b, 0), CreateColor(r, g, b, 0.9)
        t:SetGradient("HORIZONTAL", i == 1 and clear or full, i == 1 and full or clear)
      else
        t:SetVertexColor(r, g, b, 0.6)
      end
      t:Show()
    end
    -- the shine: Uncommon and up, brighter from Epic, twice for a Legendary
    self.nameClip:ClearAllPoints()
    self.nameClip:SetPoint("CENTER", self.name, "CENTER")
    self.nameClip:SetSize(nw + 16, nh + 8)
    self.nameShine:SetSize(40, (nh + 8) * 2)
    local a = self.q >= 4 and 0.9 or 0.5
    self.nameShine:SetVertexColor(math.min(1, r + 0.6), math.min(1, g + 0.6), math.min(1, b + 0.6), a)
    self.shineTimes = self.q >= 5 and { 0.25, 1.5 } or self.q >= 2 and { 0.25 } or nil
  end

  -- Epic and better: the name is laid out letter by letter (one text each, at the place the whole
  -- name puts it) so Tick can stamp them in one after another; the name itself shows again once they
  -- have all landed. Only for a name on one line (a wrapped one just shows).
  function f:PrepareLetters()
    self.lettersOn = nil
    for _, l in ipairs(self.letters) do l:Hide() end
    if self.q < 4 or self.style == "compact" then return end
    local text = self.name:GetText() or ""
    local face, size, flags = self.name:GetFont()
    if not face or text == "" then return end
    local measure = self.name.GetUnboundedStringWidth or self.name.GetStringWidth
    local total = measure(self.name)
    if total <= 0 or total > self.name:GetWidth() then return end
    self.measure:SetFont(face, size, flags or "")
    local mw = self.measure.GetUnboundedStringWidth or self.measure.GetStringWidth
    local left = self.name:GetJustifyH() == "LEFT" and 0 or -total / 2 -- from the name's left or middle
    local anchor = self.name:GetJustifyH() == "LEFT" and "LEFT" or "CENTER"
    local r, g, b = self.name:GetTextColor()
    local prefix, i = "", 0
    for ch in text:gmatch("[%z\1-\127\194-\244][\128-\191]*") do
      i = i + 1
      local l = self.letters[i]
      if not l then l = self.fx:CreateFontString(nil, "OVERLAY"); self.letters[i] = l end
      l:SetFont(face, size, flags or "")
      l:SetText(ch)
      l:SetTextColor(r, g, b)
      l:SetShadowColor(0, 0, 0, 1)
      l:SetShadowOffset(1, -1)
      -- its middle, from the anchor: the right edge of the text up to and including it, less half of
      -- it (measuring the text so far would drop a trailing space and bunch the words together)
      self.measure:SetText(prefix .. ch)
      local right = mw(self.measure)
      self.measure:SetText(ch)
      l.cx = left + right - mw(self.measure) / 2
      l.anchor, l.size, l.face, l.flags = anchor, size, face, flags or ""
      l:Hide()
      prefix = prefix .. ch
    end
    self.letterCount = i
    self.lettersOn = i > 0
  end
  local LETTER_AT, LETTER_STEP, LETTER_T = 0.15, 0.05, 0.26
  function f:Letters(fx)
    local n = self.letterCount
    if fx >= LETTER_AT + n * LETTER_STEP + LETTER_T then -- all down: the name itself again, crisp
      for k = 1, n do self.letters[k]:Hide() end
      self.name:SetAlpha(1)
      self.lettersOn = nil
      return
    end
    self.name:SetAlpha(0)
    for k = 1, n do
      local l = self.letters[k]
      local t = fx - LETTER_AT - (k - 1) * LETTER_STEP
      if t < 0 then
        l:Hide()
      else
        local u = math.min(1, t / LETTER_T)
        -- slams in big, a touch small, settled
        local sc = u < 0.7 and 2.6 - 1.68 * (u / 0.7) or 0.92 + 0.08 * ((u - 0.7) / 0.3)
        if l.SetTextScale then l:SetTextScale(sc)
        else -- (no text scale on this client: a font size, whole sizes only, set when it changes)
          local px = math.floor(l.size * sc + 0.5)
          if px ~= l.px then l.px = px; l:SetFont(l.face, px, l.flags) end
        end
        l:ClearAllPoints()
        l:SetPoint("CENTER", self.name, l.anchor, l.cx, 0)
        l:SetAlpha(math.min(1, u / 0.3))
        l:Show()
      end
    end
  end

  local function Clamp01(x) return x < 0 and 0 or x > 1 and 1 or x end
  local function TextScale(fs, sc, face, size, flags)
    if fs.SetTextScale then fs:SetTextScale(sc); return end
    local px = math.floor(size * sc + 0.5) -- (whole sizes, set only when it changes)
    if px ~= fs.px then fs.px = px; fs:SetFont(face, px, flags) end
  end
  -- Splash: the banner slashes in from the left (the crossing one from the right, Epic+), speed lines
  -- streak across, a shine runs along it, the name zips in (Epic+: its letters stamp in instead), and
  -- the rarity stamp lands; the banner is thicker the rarer
  function f:SplashTick(fx)
    if self.splashDone then return end -- (everything has settled: nothing left to move)
    local q = self.q
    local h = SPLASH_H * (0.8 + 0.1 * (math.min(q, 5) - 2))
    local e = 1 - (1 - Clamp01(fx / 0.3)) ^ 3
    for _, t in ipairs({ self.splashBand, self.splashEdge, q >= 5 and self.splashTrim or nil }) do
      if e <= 0 then t:Hide() else
        local extra = t == self.splashTrim and 12 or 0
        t:SetSize(math.max(1, (SPLASH_W + extra) * e), h + extra * 0.6)
        t:SetTexCoord(0, e, 0, 1)
        t:Show()
      end
    end
    if q >= 4 then
      local e2 = 1 - (1 - Clamp01((fx - 0.2) / 0.28)) ^ 3
      if e2 <= 0 then self.splashBand2:Hide() else
        self.splashBand2:SetSize(math.max(1, 340 * e2), h * 0.42)
        self.splashBand2:SetTexCoord(1 - e2, 1, 1, 0) -- flipped top to bottom: slants the other way
        self.splashBand2:Show()
      end
    end
    for i, s in ipairs(self.speed) do
      local p = (fx - (0.04 + (i - 1) * 0.05)) / 0.35
      if p >= 0 and p < 1 then
        s:ClearAllPoints()
        s:SetPoint("CENTER", self.stage, "BOTTOM", -200 + 420 * p, -10 - (i - 1) * 14)
        s:SetSize(120, 4)
        s:SetAlpha(math.sin(math.pi * p) * 0.9)
        s:Show()
      elseif s:IsShown() then s:Hide() end
    end
    local sp = (fx - 0.45) / 0.7
    if sp >= 0 and sp < 1 then
      self.shine:ClearAllPoints()
      self.shine:SetPoint("CENTER", self.shineClip, "LEFT", -45 + (self.shineClip:GetWidth() + 90) * sp, 0)
      self.shine:Show()
    elseif self.shine:IsShown() then self.shine:Hide() end
    -- the name zips in from the left (below Epic)
    if q < 4 then
      local zt = Clamp01((fx - 0.12) / 0.3)
      local ze = 1 - (1 - zt) ^ 3
      self.name:ClearAllPoints()
      self.name:SetPoint("CENTER", self.stage, "BOTTOM", -160 * (1 - ze), -24)
      self.name:SetAlpha(zt)
    end
    -- the stamp lands: big, then punched down to size
    local st = fx - 0.38
    if st < 0 then
      self.stamp:Hide(); self.stampBack:Hide(); self.stampEdge:Hide()
    else
      local u = Clamp01(st / 0.26)
      local sc = 2.6 - 1.6 * (1 - (1 - u) ^ 3)
      TextScale(self.stamp, sc, "Fonts\\FRIZQT__.TTF", 12, "OUTLINE")
      local w, ht = (self.stampW or 40) * sc + 12, 18 * sc -- (its width at normal size, scaled by hand)
      self.stampBack:ClearAllPoints(); self.stampBack:SetPoint("CENTER", self.stamp, "CENTER")
      self.stampBack:SetSize(w, ht)
      self.stampEdge:ClearAllPoints(); self.stampEdge:SetPoint("CENTER", self.stamp, "CENTER")
      self.stampEdge:SetSize(w + 4, ht + 4)
      local a = Clamp01(st / 0.08)
      for _, t in ipairs({ self.stamp, self.stampBack, self.stampEdge }) do t:SetAlpha(a); t:Show() end
    end
    if fx > 1.3 then self.splashDone = true end -- (this frame drew the settled state; the shine ended at 1.15)
  end
  -- Aura: the glow breathes, and soft wisps of light rise behind the item, drifting
  function f:AuraTick(dt, age)
    local fade = math.min(1, age / 0.5)
    self.auraGlow:SetSize(210, 210)
    self.auraGlow:SetAlpha((0.45 + 0.15 * math.sin(age * 2)) * fade)
    self.wispT = (self.wispT or 0) - dt
    for _, w in ipairs(self.wisps) do
      if not w.age and self.wispT <= 0 then -- a new wisp from just under the item
        self.wispT = 0.12
        w.age, w.life, w.x0, w.r, w.ph = 0, 1.6 + math.random() * 0.8, (math.random() * 2 - 1) * 34, 28 + math.random() * 24, math.random() * 6.28
      end
      if w.age then
        w.age = w.age + dt
        local u = w.age / w.life
        if u >= 1 then
          w.age = nil
          w:Hide()
        else
          w:ClearAllPoints()
          w:SetPoint("CENTER", self.stage, "BOTTOM", w.x0 + math.sin(w.age * 1.6 + w.ph) * 12 * u, 10 + u * 170)
          local size = w.r * (1 + u * 1.4) * 2
          w:SetSize(size, size)
          w:SetAlpha(math.sin(math.pi * u) * 0.38 * fade)
          w:Show()
        end
      end
    end
  end

  -- The model path: SetItem, then OnModelLoaded (or a 1 s timeout) decides model or card
  function f:SetModel()
    local item, m = self.item, self.model
    self.mode = "card"
    self.card:Show()
    m:Hide()
    if self.L and self.L.icon then -- the compact line shows the icon, never a model
      if self.onModel then self.onModel("card", nil, "compact popup"); self.onModel = nil end
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
    if m.SetCamDistanceScale then m:SetCamDistanceScale(ns.ModelZoom() * ((self.L and self.L.zoom) or 1) * MODEL_ROOM) end
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
    if fx >= 0 and fx < FLASH_T and self.style ~= "compact" then
      local a = fx / FLASH_T
      local size = (70 + 190 * a) * (self.q >= 4 and 1.3 or 1)
      self.flash:SetSize(size, size)
      self.flash:SetAlpha((1 - a) * (self.q >= 3 and 0.9 or 0.6))
      self.flash:Show()
    elseif self.flash:IsShown() then
      self.flash:Hide()
    end

    if self.style == "splash" then self:SplashTick(fx) end
    if self.style == "aura" then self:AuraTick(dt, age) end
    if self.lettersOn then self:Letters(fx) end

    -- beam style, Rare and up: a few motes rise slowly through the light
    if self.style == "beam" and self.q >= 3 then
      for i, m in ipairs(self.rise) do
        local t = (age * 0.2 + i / RISE) % 1
        local x = math.sin(i * 2.1) * 26 * (1 - t * 0.5)
        m:SetPoint("CENTER", self.stage, "BOTTOM", x, 12 + t * 150)
        m:SetAlpha(math.sin(math.pi * t) * 0.7)
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
    -- the name's shine: one sweep across it (two for a Legendary)
    if self.shineTimes then
      local at
      for _, t0 in ipairs(self.shineTimes) do
        local u = (fx - t0) / 0.6
        if u >= 0 and u < 1 then at = u end
      end
      if at then
        local cw = self.nameClip:GetWidth()
        self.nameShine:ClearAllPoints()
        self.nameShine:SetPoint("CENTER", self.nameClip, "LEFT", -24 + (cw + 48) * at, 0)
        if not self.nameShine:IsShown() then self.nameShine:Show() end
      elseif self.nameShine:IsShown() then
        self.nameShine:Hide()
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
    if self.bigArrival then return end -- the arrival engine (Arrivals.lua) is playing it
    if not self.arrived then -- first frame: show what this tier uses
      self.arrived = true
      ns:PlayArrivalSound(tier)
      -- a real popup plays the arrival picked for its rarity (Arrivals page), unless it's "Simple"
      if self.isPopup and ns.PlayArrival and ns.PlayArrival(self, self.q) then
        self.bigArrival = true
        return
      end
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

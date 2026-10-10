-- Dopamine Loot popup view: draws one item in one of four styles. The real popups (Popup.lua) and
-- the live preview on the settings page (Look.lua) both use it, so the preview is exactly what you
-- get. The item turns: its 3D model where the client has one (weapons stand upright), otherwise its
-- icon on a card that flips like a coin.
--   relic   just the item on a soft glow, name below
--   beam    a light column rising behind the item, a ring at its feet
--   halo    a ring in the quality color fading both ways (the banner bent round), details beside it
--   banner  a ribbon in the quality color fading at both ends, the item standing over it
-- Models: set only after the frame is shown, and again when it's shown after being hidden (the
-- client drops them); never inside an animation group (moved and faded by hand).
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local QUESTION = "Interface\\Icons\\INV_Misc_QuestionMark"
local CARD = 56

ns.STYLES = {
  { key = "relic", label = "Relic", tip = "Just the item standing on a soft glow, the name below it. No box." },
  { key = "beam", label = "Beam", tip = "A column of light rises behind the item; it hovers over a ring." },
  { key = "halo", label = "Halo lens", tip = "A ring in the item's color around it, details beside it." },
  { key = "banner", label = "Banner", tip = "A ribbon in the item's color, the item standing over it." },
}
local LAYOUT = { -- view size, the stage (where the item stands), where the text goes, and the
  -- clickable part (insets left, right, top, bottom: the empty glow around it lets clicks through)
  relic = { w = 260, h = 230, stage = { 0, -8, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 } },
  beam = { w = 260, h = 240, stage = { 0, -14, 130, 150 }, text = "below", hit = { 55, 55, 0, 0 } },
  halo = { w = 400, h = 180, stage = { -110, 0, 120, 150 }, text = "right", hit = { 15, 10, 15, 15 } },
  banner = { w = 420, h = 170, stage = { -140, 4, 110, 150 }, text = "band", hit = { 20, 20, 30, 30 } },
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
function ns.WeaponTilt() return ns.settings.modelRoll or 90 end
function ns.SpinSpeed() return ns.settings.spinSpeed or 0.9 end
function ns.HoldTime(q) -- seconds on screen: the setting, a little longer for better items
  return (ns.settings.popupHold or 5) + math.max(0, math.min(q or 2, 5) - 2) * 1
end

local function Tex(parent, layer, file, blend)
  local t = parent:CreateTexture(nil, layer)
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

function ns.CreateView(f)
  -- background art, all white textures tinted with the quality color
  f.glow = Tex(f, "BACKGROUND", MEDIA .. "Glow", "ADD")
  f.beam = Tex(f, "BACKGROUND", MEDIA .. "Beam", "ADD")
  f.halo = Tex(f, "BACKGROUND", MEDIA .. "Halo", "ADD")
  f.banner = Tex(f, "BACKGROUND", MEDIA .. "Banner")
  f.bannerTop = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- the banner squashed thin: an edge line
  f.bannerBottom = Tex(f, "BORDER", MEDIA .. "Banner", "ADD") -- that fades out at both ends
  f.ring = Tex(f, "BORDER", MEDIA .. "Ring", "ADD")
  f.line = Tex(f, "BORDER", "Interface\\Buttons\\WHITE8X8")

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

  f.name = f:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  f.info = f:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  f.info:SetTextColor(0.8, 0.76, 0.68)
  f.badges = f:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  if f.name.SetMaxLines then f.name:SetMaxLines(2) end

  function f:Layout()
    local style = ns.PopupStyle()
    local L = LAYOUT[style]
    self.style = style
    self:SetSize(L.w, L.h)
    self:SetHitRectInsets(L.hit[1], L.hit[2], L.hit[3], L.hit[4])
    for _, t in ipairs({ self.glow, self.beam, self.halo, self.banner, self.bannerTop, self.bannerBottom, self.ring, self.line }) do
      t:Hide(); t:ClearAllPoints()
    end
    local sx, sy, sw, sh = L.stage[1], L.stage[2], L.stage[3], L.stage[4]
    self.stage:ClearAllPoints()
    self.stage:SetSize(sw, sh)
    if L.text == "below" then
      self.stage:SetPoint("TOP", self, "TOP", sx, sy)
    else
      self.stage:SetPoint("CENTER", self, "CENTER", sx, sy)
    end
    for _, fs in ipairs({ self.name, self.info, self.badges }) do fs:ClearAllPoints() end

    if style == "relic" or style == "beam" then
      if style == "relic" then
        self.glow:SetSize(210, 210)
        self.glow:SetPoint("CENTER", self.stage, "CENTER", 0, 0)
        self.glow:Show()
      else
        self.beam:SetSize(110, L.h)
        self.beam:SetPoint("BOTTOM", self.stage, "BOTTOM", 0, -6)
        self.beam:Show()
        self.ring:SetSize(110, 26)
        self.ring:SetPoint("CENTER", self.stage, "BOTTOM", 0, 2)
        self.ring:Show()
      end
      self.name:SetPoint("TOP", self.stage, "BOTTOM", 0, -6)
      self.name:SetWidth(L.w - 20)
      self.name:SetJustifyH("CENTER")
      self.info:SetPoint("TOP", self.name, "BOTTOM", 0, -3)
      self.info:SetJustifyH("CENTER")
      self.badges:SetPoint("TOP", self.info, "BOTTOM", 0, -3)
      self.badges:SetJustifyH("CENTER")
    elseif style == "halo" then
      self.halo:SetSize(176, 176)
      self.halo:SetPoint("CENTER", self.stage, "CENTER", 0, 0)
      self.halo:Show()
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
    self.r, self.g, self.b = r, g, b
    self.glow:SetVertexColor(r, g, b, 0.9)
    self.beam:SetVertexColor(r, g, b, 0.9)
    self.halo:SetVertexColor(r, g, b, 1)
    self.banner:SetVertexColor(r * 0.3, g * 0.3, b * 0.3, 0.92) -- dark ribbon so the name reads on it
    self.bannerTop:SetVertexColor(r, g, b, 1)
    self.bannerBottom:SetVertexColor(r, g, b, 1)
    self.ring:SetVertexColor(r, g, b, 0.9)
    self.line:SetVertexColor(r, g, b, 0.6)
    self.glowBase = q >= 4 and 0.9 or q >= 3 and 0.75 or 0.6
    self.card.edge:SetVertexColor(r, g, b, 1)
    self.card.icon:SetTexture(item.icon or QUESTION)
    self.name:SetText(item.name or "?")
    self.name:SetTextColor(r, g, b)
    local info = {}
    if item.typeText and item.typeText ~= "" then info[#info + 1] = item.typeText end
    if item.ilvl and item.ilvl > 1 and item.equipLoc and item.equipLoc ~= "" then info[#info + 1] = "item level " .. item.ilvl end
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
    if m.SetCamDistanceScale then m:SetCamDistanceScale(ns.ModelZoom()) end
    if m.SetRoll then
      local upright = self.item and UPRIGHT[self.item.equipLoc or ""]
      m:SetRoll(upright and math.rad(ns.WeaponTilt()) or 0)
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

  -- One frame of animation: the item turns, the light breathes
  function f:Tick(dt)
    if not self.item then return end -- the preview ticks before its item has loaded
    self.age = (self.age or 0) + dt
    local angle = (self.spin0 or 0) + self.age * ns.SpinSpeed()
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
    local pulse = math.min(1, (self.glowBase or 0.6) + 0.15 * math.sin(self.age * 2.4))
    self.glow:SetAlpha(pulse)
    self.beam:SetAlpha(pulse)
    self.halo:SetAlpha(0.75 + 0.25 * math.sin(self.age * 2))
    if self.mode == "pending" then
      self.pendingAge = (self.pendingAge or 0) + dt
      if self.pendingAge > 1 then self:CheckModel("timeout") end
    end
  end

  return f
end

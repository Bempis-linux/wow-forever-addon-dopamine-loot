-- Dopamine Loot popups: one dark card per item, top middle of the screen, newest on top. The item
-- turns slowly on a beam of its quality color: its 3D model where the client has one (weapons,
-- shields, helms, shoulders), otherwise its icon on a card that flips like a coin.
-- Everything moves by hand in one OnUpdate: 3D models don't follow animation groups, and the
-- model is set only after the frame is shown (the client drops models on hidden frames).
local _, ns = ...

local W, H, STAGE = 330, 96, 88
local TOP_Y, GAP, MAX_SHOWN = -150, 6, 3
local IN_T, OUT_T, FAST_OUT_T = 0.3, 0.8, 0.25
local HOLD = { [0] = 3, 3, 4.5, 5.5, 7, 9 } -- seconds on screen by quality (hover holds)
local SPIN = 0.9                            -- radians per second
local CARD = 50
local QUESTION = "Interface\\Icons\\INV_Misc_QuestionMark"

-- Items that have a model of their own; body armor is textures on a body (mannequin view later)
ns.MODEL_SLOTS = {
  INVTYPE_WEAPON = true, INVTYPE_2HWEAPON = true, INVTYPE_WEAPONMAINHAND = true, INVTYPE_WEAPONOFFHAND = true,
  INVTYPE_SHIELD = true, INVTYPE_HOLDABLE = true, INVTYPE_RANGED = true, INVTYPE_RANGEDRIGHT = true,
  INVTYPE_THROWN = true, INVTYPE_HEAD = true, INVTYPE_SHOULDER = true,
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

ns.AddToggle("popup", "noPopup", "loot popups")

local pool, shown = {}, {}
local driver = CreateFrame("Frame")

local function Gradient(tex, r, g, b, bottomA, topA)
  if tex.SetGradient and CreateColor then
    tex:SetColorTexture(1, 1, 1, 1)
    tex:SetGradient("VERTICAL", CreateColor(r, g, b, bottomA), CreateColor(r, g, b, topA))
  else
    tex:SetColorTexture(r, g, b, (bottomA + topA) / 2)
  end
end

local function Create()
  local p = CreateFrame("Button", nil, UIParent, "BackdropTemplate")
  p:SetSize(W, H)
  p:SetFrameStrata("HIGH")
  p:SetClampedToScreen(true)
  p:RegisterForClicks("LeftButtonUp", "RightButtonUp")
  p:SetBackdrop({
    bgFile = "Interface\\Buttons\\WHITE8X8",
    edgeFile = "Interface\\Tooltips\\UI-Tooltip-Border",
    edgeSize = 14, insets = { left = 3, right = 3, top = 3, bottom = 3 },
  })
  p:SetBackdropColor(0.04, 0.03, 0.025, 0.94)

  -- the stage: a beam of quality color rising behind the item, and a pulsing glow
  local s = CreateFrame("Frame", nil, p)
  s:SetSize(STAGE, STAGE)
  s:SetPoint("LEFT", 4, 0)
  p.stage = s
  p.beam = s:CreateTexture(nil, "BACKGROUND")
  p.beam:SetPoint("TOPLEFT", 2, -2)
  p.beam:SetPoint("BOTTOMRIGHT", -2, 2)
  p.glow = s:CreateTexture(nil, "BORDER")
  p.glow:SetTexture("Interface\\Buttons\\UI-ActionButton-Border")
  p.glow:SetBlendMode("ADD")
  p.glow:SetSize(STAGE * 1.5, STAGE * 1.5)
  p.glow:SetPoint("CENTER")
  -- a soft floor line the item "stands" on
  p.floor = s:CreateTexture(nil, "BORDER", nil, 1)
  p.floor:SetSize(STAGE * 0.7, 2)
  p.floor:SetPoint("BOTTOM", 0, 10)

  p.model = CreateFrame("PlayerModel", nil, s)
  p.model:SetPoint("TOPLEFT", 2, -2)
  p.model:SetPoint("BOTTOMRIGHT", -2, 2)
  p.model:SetScript("OnModelLoaded", function() p:CheckModel("loaded") end)

  p.card = CreateFrame("Frame", nil, s)
  p.card:SetSize(CARD, CARD)
  p.card:SetPoint("CENTER", 0, 4)
  p.card.edge = p.card:CreateTexture(nil, "BACKGROUND")
  p.card.edge:SetAllPoints()
  p.card.icon = p.card:CreateTexture(nil, "ARTWORK")
  p.card.icon:SetPoint("TOPLEFT", 2, -2)
  p.card.icon:SetPoint("BOTTOMRIGHT", -2, 2)
  p.card.icon:SetTexCoord(0.07, 0.93, 0.07, 0.93)

  p.name = p:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
  p.name:SetPoint("TOPLEFT", s, "TOPRIGHT", 10, -12)
  p.name:SetPoint("RIGHT", -12, 0)
  p.name:SetJustifyH("LEFT")
  if p.name.SetMaxLines then p.name:SetMaxLines(2) end
  p.info = p:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  p.info:SetPoint("TOPLEFT", p.name, "BOTTOMLEFT", 0, -5)
  p.info:SetPoint("RIGHT", -12, 0)
  p.info:SetJustifyH("LEFT")
  p.badges = p:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  p.badges:SetPoint("TOPLEFT", p.info, "BOTTOMLEFT", 0, -4)
  p.badges:SetJustifyH("LEFT")

  p:SetScript("OnEnter", function(self)
    self.hover = true
    if self.item and self.item.link then
      GameTooltip:SetOwner(self, "ANCHOR_BOTTOM", 0, -4)
      GameTooltip:SetHyperlink(self.item.link)
      GameTooltip:Show()
    end
  end)
  p:SetScript("OnLeave", function(self)
    self.hover = false
    if GameTooltip:IsOwned(self) then GameTooltip:Hide() end
  end)
  p:SetScript("OnClick", function(self, button)
    if button == "LeftButton" and IsModifiedClick("CHATLINK") and self.item.link then
      ChatEdit_InsertLink(self.item.link) -- into your chat box; you press Enter yourself
      return
    end
    self:Leave(FAST_OUT_T)
  end)
  -- start fading out; a fading popup no longer catches clicks meant for the world under it
  function p:Leave(duration)
    if self.outAge then return end
    self.outAge, self.outFor, self.hover = 0, duration, false
    self:EnableMouse(false)
    if GameTooltip:IsOwned(self) then GameTooltip:Hide() end
  end

  -- Show the model once it loads; the card if nothing loaded in time. The file id is only reported
  -- (/dl model): whether GetModelFileID works for SetItem models on Forever is unverified.
  function p:CheckModel(why)
    if self.mode ~= "pending" then return end
    local m = self.model
    local fileID = m.GetModelFileID and m:GetModelFileID()
    if why == "loaded" or (fileID and fileID ~= 0) then
      self.mode = "model"
      m:SetPosition(0, 0, 0)
      if m.SetCamDistanceScale then m:SetCamDistanceScale(1) end
      self.card:Hide()
    else -- timed out without a model
      self.mode = "card"
      m:Hide()
      self.card:Show()
    end
    if self.onModel then self.onModel(self.mode, fileID, why); self.onModel = nil end
  end
  -- the client drops models on hidden frames (Alt+Z, cinematics): set it again when shown
  p:HookScript("OnShow", function(self)
    if self.item and (self.mode == "model" or self.mode == "pending") then
      self.model:SetItem(self.item.id)
    end
  end)
  return p
end

local function Release(p)
  if p.onModel then p.onModel("dismissed", nil, "closed before the model decided") end
  p:Hide()
  p.model:ClearModel()
  p.item, p.onModel, p.hover = nil, nil, false
  if GameTooltip:IsOwned(p) then GameTooltip:Hide() end
  pool[#pool + 1] = p
end

local function Update(_, dt)
  dt = math.min(dt, 0.1)
  for i = #shown, 1, -1 do
    local p = shown[i]
    p.age = p.age + dt
    -- slide toward this popup's slot (new ones push the old ones down)
    local targetY = TOP_Y - (i - 1) * (H + GAP)
    p.y = p.y + (targetY - p.y) * math.min(1, dt * 12)
    local alpha, scale = 1, 1
    if p.age < IN_T then
      local a = p.age / IN_T
      alpha = a
      scale = 1 + 0.15 * (1 - a) * (1 - a) -- pops in slightly big and settles
    end
    if not p.outAge and not p.hover then
      p.hold = p.hold - dt
      if p.hold <= 0 then p:Leave(OUT_T) end
    end
    if p.outAge then
      p.outAge = p.outAge + dt
      alpha = math.max(0, 1 - p.outAge / p.outFor)
      p.y = p.y + dt * 20 -- drift up as it fades
    end
    p:SetScale(scale)
    p:SetPoint("TOP", UIParent, "TOP", 0, p.y / scale)
    p:SetAlpha(alpha)
    -- the item turns; the glow breathes
    local angle = p.spin0 + p.age * SPIN
    if p.mode == "model" or p.mode == "pending" then
      p.model:SetFacing(angle)
    else
      local c = math.cos(angle * 1.3)
      p.card:SetWidth(math.max(2, CARD * math.abs(c)))
      p.card.icon:SetDesaturated(c < 0) -- the back of the card
      p.card.icon:SetVertexColor(c < 0 and 0.45 or 1, c < 0 and 0.45 or 1, c < 0 and 0.45 or 1)
    end
    p.glow:SetAlpha(p.glowBase + 0.25 * math.sin(p.age * 3))
    if p.mode == "pending" and p.age > 1 then p:CheckModel("timeout") end
    if p.outAge and p.outAge >= p.outFor then
      table.remove(shown, i)
      Release(p)
    end
  end
  if #shown == 0 then driver:SetScript("OnUpdate", nil) end
end

local function Badges(item)
  local b = {}
  if (item.count or 1) > 1 then b[#b + 1] = "|cffffffffx" .. item.count .. "|r" end
  if item.src == "created" then b[#b + 1] = "|cff9d9d9dcrafted|r"
  elseif item.src == "pushed" then b[#b + 1] = "|cff9d9d9dreceived|r" end
  if item.test then b[#b + 1] = "|cff9d9d9dpreview|r" end
  return table.concat(b, "   ")
end

-- item: { link, id, count, quality, name, icon, equipLoc, ilvl, typeText, src, test, forceModel }
-- onModel(mode, fileID, why) is called once the display path is decided (/dl model uses it)
function ns:ShowLoot(item, onModel)
  local p = table.remove(pool) or Create()
  p.item, p.onModel = item, onModel
  local q = item.quality or 1
  local r, g, b = ns.QualityColor(q)
  p:SetBackdropBorderColor(r, g, b, 0.95)
  Gradient(p.beam, r, g, b, 0.55, 0)
  p.glow:SetVertexColor(r, g, b)
  p.glowBase = q >= 4 and 0.7 or q >= 3 and 0.5 or 0.3
  p.floor:SetColorTexture(r, g, b, 0.5)
  p.card.edge:SetColorTexture(r, g, b, 1)
  p.card.icon:SetTexture(item.icon or QUESTION)
  p.name:SetText(item.name or "?")
  p.name:SetTextColor(r, g, b)
  local info = {}
  if item.typeText and item.typeText ~= "" then info[#info + 1] = item.typeText end
  if item.ilvl and item.ilvl > 1 and item.equipLoc and item.equipLoc ~= "" then info[#info + 1] = "item level " .. item.ilvl end
  p.info:SetText(table.concat(info, "  -  "))
  p.badges:SetText(Badges(item))

  p.age, p.hold, p.outAge, p.hover = 0, HOLD[math.min(q, 5)] or 4, nil, false
  p.spin0 = math.random() * 6.28
  p.y = TOP_Y + 40
  p:SetAlpha(0)
  p:ClearAllPoints()
  p:SetPoint("TOP", UIParent, "TOP", 0, p.y)
  table.insert(shown, 1, p)
  for i = MAX_SHOWN + 1, #shown do shown[i]:Leave(FAST_OUT_T) end -- too many: the oldest leave quickly
  p.mode = "card"
  p.card:SetWidth(CARD) -- a reused popup keeps the last frame's flip
  p.card.icon:SetDesaturated(false)
  p.card.icon:SetVertexColor(1, 1, 1)
  p.card:Show()
  p.model:Hide()
  p:EnableMouse(true)
  p:Show()

  -- model only after Show(); the card stays until the model has loaded (CheckModel)
  if (item.forceModel or ns.MODEL_SLOTS[item.equipLoc or ""]) and p.model.SetItem then
    p.model:Show()
    p.model:ClearModel()
    p.mode = "pending" -- before SetItem: a cached model can report loaded during the call
    if not pcall(p.model.SetItem, p.model, item.id) then
      p.mode = "card"
      p.model:Hide()
    end
  end
  if p.mode == "card" and p.onModel then p.onModel("card", nil, "no model path"); p.onModel = nil end

  self:PlayTierSound(q)
  driver:SetScript("OnUpdate", Update)
  return p
end

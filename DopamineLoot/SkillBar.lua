-- Dopamine Loot skill bars (docs/mockups/crafting-feel.html, crafting-r4.html, crafting-r5.html): for a
-- crafting profession the skill-up bar is made of its craft's material, and filling it does what that
-- material does; a small tool rides the end of the fill and makes one motion on the skill-up.
--   Tailoring       a stitched line runs through it                       (tool: a needle dips)
--   Leatherworking  a leather strip with punched holes, the fill stitched  (an awl punches)
--   Alchemy         a glass tube of liquid with a wobbling surface         (a drop falls in)
--   Engineering     a gauge of cells that light one by one                 (a wrench clicks)
--   Cooking         the filled part browned with grill marks              (a spatula flips)
--   Blacksmithing   iron, white-hot at the working end, cooling behind     (a hammer taps, sparks)
--   Enchanting      engraved runes that light as the fill reaches them     (a wand glints)
--   First Aid       a clean bandage strip printed with small red crosses   (a pin clips)
-- Other professions (gathering) get a plain bar in their color. ns.MakeSkillBar(parent) returns a frame
-- with :SetProfession(name, color, light), :SetValue(0..1) and :PlayTool().
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local WHITE = "Interface\\Buttons\\WHITE8X8"
local STAR = "Interface\\Cooldown\\star4"
local W, H = 200, 10

local function Grad(tex, dir, r1, g1, b1, r2, g2, b2, a1, a2)
  tex:SetTexture(WHITE)
  if not pcall(tex.SetGradient, tex, dir, CreateColor(r1, g1, b1, a1 or 1), CreateColor(r2, g2, b2, a2 or 1)) then tex:SetVertexColor(r1, g1, b1, a1 or 1) end
end

-- the material per profession: built once into the bar's layers; refresh(bar, v) for value-dependent parts
local STYLE = {}

STYLE.Tailoring = { tool = "Needle", toolColor = { 0.9, 0.9, 0.95 },
  build = function(b, again) Grad(b.fillTex, "HORIZONTAL", 0.66, 0.6, 0.44, 1, 0.96, 0.85); if again then return end
    for i = 0, 24 do local d = b:Over("ARTWORK"); d:SetColorTexture(1, 1, 1, 0.75); d:SetSize(5, 2); d:SetPoint("LEFT", b.track, "LEFT", 3 + i * 8, 0) end end }
STYLE.Leatherworking = { tool = "Awl", toolColor = { 0.85, 0.82, 0.78 }, back = { 0.16, 0.1, 0.05 },
  build = function(b, again) Grad(b.fillTex, "VERTICAL", 0.54, 0.35, 0.19, 0.78, 0.56, 0.38); if again then return end
    for i = 0, 24 do
      for _, y in ipairs({ 3, -3 }) do local h = b:Over("OVERLAY"); h:SetTexture(MEDIA .. "Circle.tga"); h:SetVertexColor(0.04, 0.02, 0.01); h:SetSize(3, 3); h:SetPoint("CENTER", b.track, "LEFT", 4 + i * 8 + (y > 0 and 0 or 4), y) end
      local s = b:Inner("ARTWORK"); s:SetColorTexture(0.94, 0.85, 0.66, 1); s:SetSize(5, 2); s:SetPoint("LEFT", b.inner, "LEFT", 2 + i * 8, 0)
    end end }
STYLE.Alchemy = { tool = "Petal", toolRot = math.pi, toolColor = { 0.78, 0.62, 1 },
  build = function(b, again) Grad(b.fillTex, "VERTICAL", 0.48, 0.23, 0.82, 0.82, 0.66, 1); if again then return end
    local hi = b:Over("OVERLAY"); hi:SetColorTexture(1, 1, 1, 0.18); hi:SetHeight(2); hi:SetPoint("TOPLEFT", b.track, "TOPLEFT", 2, -1); hi:SetPoint("TOPRIGHT", b.track, "TOPRIGHT", -2, -1)
    b.surface = b:Over("OVERLAY"); b.surface:SetTexture(MEDIA .. "Circle.tga"); b.surface:SetVertexColor(0.72, 0.54, 1); b.surface:SetSize(8, H) end,
  refresh = function(b, v, t) if b.surface then b.surface:ClearAllPoints(); b.surface:SetPoint("CENTER", b.track, "LEFT", W * v, 0); b.surface:SetWidth(4 + 4 * (0.5 + 0.5 * math.sin(t * 6))) end end }
STYLE.Engineering = { tool = "Wrench", toolColor = { 0.8, 0.85, 0.9 },
  build = function(b, again) b.fillTex:SetColorTexture(0, 0, 0, 0); b.cells = {}; if again then return end
    for i = 0, 14 do local c = b:Over("ARTWORK"); c:SetSize(11.3, H - 2); c:SetPoint("LEFT", b.track, "LEFT", 1 + i * 13.3, 0); b.cells[i + 1] = c end end,
  refresh = function(b, v) for i, c in ipairs(b.cells or {}) do if (i - 0.5) / #b.cells <= v then c:SetColorTexture(0.78, 0.88, 0.97, 1) else c:SetColorTexture(0.1, 0.12, 0.14, 1) end end end }
STYLE.Cooking = { tool = "Spatula", toolColor = { 0.85, 0.85, 0.85 }, back = { 0.16, 0.11, 0.06 },
  build = function(b, again) b.fillTex:SetColorTexture(0.78, 0.48, 0.23, 1); if again then return end
    for i = 0, 30 do local m = b:Inner("ARTWORK"); m:SetTexture(MEDIA .. "Streak.tga"); m:SetVertexColor(0.3, 0.13, 0.03); m:SetSize(16, 16); m:SetRotation(-0.96); m:SetPoint("CENTER", b.inner, "LEFT", 4 + i * 7, 0) end end }
STYLE.Blacksmithing = { tool = "Hammer", toolColor = { 0.75, 0.75, 0.78 }, back = { 0.1, 0.1, 0.11 },
  build = function(b, again) Grad(b.fillTex, "HORIZONTAL", 0.23, 0.23, 0.25, 0.88, 0.31, 0.1); if again then return end
    b.hot = b:Inner("ARTWORK", 1); Grad(b.hot, "HORIZONTAL", 0.88, 0.31, 0.1, 1, 0.9, 0.63) end,
  refresh = function(b, v) if b.hot then local w = math.max(1, W * v * 0.3); b.hot:ClearAllPoints(); b.hot:SetPoint("TOPLEFT", b.inner, "TOPLEFT", W * v - w, 0); b.hot:SetSize(w, H) end end }
STYLE.Enchanting = { tool = "Star", toolColor = { 0.85, 0.78, 1 }, back = { 0.07, 0.05, 0.13 },
  build = function(b, again) Grad(b.fillTex, "HORIZONTAL", 0.23, 0.16, 0.48, 0.54, 0.42, 1); b.runes = {}; if again then return end
    for i = 0, 9 do local r = b:Over("OVERLAY"); local n = (i * 7) % 16; r:SetTexture(MEDIA .. "Runes.tga")
      r:SetTexCoord((n % 4) / 4, (n % 4 + 1) / 4, math.floor(n / 4) / 4, (math.floor(n / 4) + 1) / 4); r:SetSize(10, 10); r:SetPoint("CENTER", b.track, "LEFT", 10 + i * 20, 0); r:SetBlendMode("ADD"); b.runes[i + 1] = r end end,
  refresh = function(b, v) for i, r in ipairs(b.runes or {}) do local lit = (i - 0.5) / #b.runes <= v; r:SetVertexColor(lit and 1 or 0.6, lit and 1 or 0.55, 1); r:SetAlpha(lit and 1 or 0.22) end end }
STYLE["First Aid"] = { tool = "Pin", toolColor = { 0.85, 0.85, 0.9 }, back = { 0.16, 0.15, 0.13 },
  build = function(b, again) b.fillTex:SetColorTexture(0.95, 0.93, 0.89, 1); if again then return end
    for i = 0, 14 do
      local x = 6 + i * 14
      local h1 = b:Inner("ARTWORK"); h1:SetColorTexture(0.82, 0.19, 0.19, 1); h1:SetSize(6, 2); h1:SetPoint("CENTER", b.inner, "LEFT", x, 0)
      local h2 = b:Inner("ARTWORK"); h2:SetColorTexture(0.82, 0.19, 0.19, 1); h2:SetSize(2, 6); h2:SetPoint("CENTER", b.inner, "LEFT", x, 0)
    end end }

local TOOLFILE = { Needle = MEDIA .. "Needle.tga", Awl = MEDIA .. "Awl.tga", Petal = MEDIA .. "Petal.tga", Wrench = MEDIA .. "Wrench.tga",
  Spatula = MEDIA .. "Spatula.tga", Hammer = MEDIA .. "Hammer.tga", Star = STAR, Pin = MEDIA .. "Pin.tga" }

-- each tool's motion on a skill-up: u 0..1 -> dx, dy, rotation, scale, alpha
local MOTION = {
  Needle = function(u) local k = math.sin(math.pi * u); return 0, -5 * k, 0.35 * k, 1, 1 end,
  Awl = function(u) local k = math.sin(math.pi * u); return 0, -6 * k, 0, 1, 1 end,
  Petal = function(u) return 0, 6 - 12 * u, 0, 1, u < 0.8 and 1 or (1 - u) * 5 end,
  Wrench = function(u) return 0, 0, -0.7 * math.sin(math.pi * u), 1, 1 end,
  Spatula = function(u) return 0, 6 * math.sin(math.pi * u), -2 * math.pi * u, 1, 1 end,
  Hammer = function(u) local k = u < 0.4 and u / 0.4 or 1 - (u - 0.4) / 0.6; return 0, 2 * k, 0.5 - 0.7 * k, 1, 1 end,
  Star = function(u) return 0, 0, u, 1 + 0.6 * math.sin(math.pi * u), 1 end,
  Pin = function(u) local k = math.sin(math.pi * u); return 0, -4 * k, 0, 1 + 0.2 * k, 1 end,
}

function ns.MakeSkillBar(parent)
  local b = CreateFrame("Frame", nil, parent)
  b:SetSize(W, H + 20)
  b.track = b:CreateTexture(nil, "BACKGROUND")
  b.track:SetSize(W, H)
  b.track:SetPoint("BOTTOMLEFT", 0, 4)
  b.edge = b:CreateTexture(nil, "BACKGROUND", nil, -1)
  b.edge:SetColorTexture(0, 0, 0, 0.9)
  b.edge:SetPoint("TOPLEFT", b.track, -1, 1); b.edge:SetPoint("BOTTOMRIGHT", b.track, 1, -1)
  -- the filled part: a clipping frame as wide as the value, holding a full-width inner frame (its patterns)
  b.clip = CreateFrame("Frame", nil, b)
  b.clip:SetPoint("TOPLEFT", b.track, "TOPLEFT")
  b.clip:SetSize(1, H)
  b.clip:SetClipsChildren(true)
  b.inner = CreateFrame("Frame", nil, b.clip)
  b.inner:SetPoint("TOPLEFT", b.track, "TOPLEFT")
  b.inner:SetSize(W, H)
  b.fillTex = b.inner:CreateTexture(nil, "BACKGROUND")
  b.fillTex:SetAllPoints(b.inner)
  b.top = CreateFrame("Frame", nil, b) -- above the fill: patterns over the whole bar
  b.top:SetAllPoints(b)
  b.top:SetFrameLevel(b.clip:GetFrameLevel() + 2)
  b.tool = b.top:CreateTexture(nil, "OVERLAY", nil, 3)
  b.tool:SetSize(14, 14)
  b.made = {} -- the textures the current style made
  b.sets = {} -- each style's textures and parts, built once: [name] = { made, cells, runes, hot, surface }
  function b:Over(layer, sub) local t = self.top:CreateTexture(nil, layer, nil, sub); self.made[#self.made + 1] = t; return t end
  function b:Inner(layer, sub) local t = self.inner:CreateTexture(nil, layer, nil, sub); self.made[#self.made + 1] = t; return t end
  b.value, b.toolT = 0, nil

  -- color: { r, g, b } for the plain bar (gathering), light: its bright end
  function b:SetProfession(name, color, light)
    for _, t in ipairs(self.made) do t:Hide() end
    self.toolT = nil
    local st = STYLE[name]
    self.style = st
    local back = st and st.back or { 0, 0, 0 }
    self.track:SetColorTexture(back[1], back[2], back[3], 0.65)
    self.fillTex:SetVertexColor(1, 1, 1, 1) -- (clears a previous style's gradient)
    if st then
      local set = self.sets[name]
      if not set then -- built the first time this style shows, kept after that
        self.made, self.cells, self.runes, self.hot, self.surface = {}, nil, nil, nil, nil
        st.build(self)
        set = { made = self.made, cells = self.cells, runes = self.runes, hot = self.hot, surface = self.surface }
        self.sets[name] = set
      else
        st.build(self, true) -- (only the fill again)
      end
      self.made, self.cells, self.runes, self.hot, self.surface = set.made, set.cells, set.runes, set.hot, set.surface
      for _, t in ipairs(self.made) do t:Show() end
      self.tool:SetTexture(TOOLFILE[st.tool]); self.tool:SetVertexColor(st.toolColor[1], st.toolColor[2], st.toolColor[3])
      self.tool:SetBlendMode(st.tool == "Star" and "ADD" or "BLEND"); self.tool:Show()
    else
      local c, l = color or { 1, 0.82, 0 }, light or { 1, 0.95, 0.6 }
      Grad(self.fillTex, "HORIZONTAL", c[1], c[2], c[3], l[1], l[2], l[3])
      self.made = {}
      self.tool:Hide()
    end
    self:SetValue(self.value)
  end

  function b:SetValue(v)
    v = math.max(0, math.min(1, v or 0))
    self.value = v
    self.clip:SetWidth(math.max(0.5, W * v))
    if self.style and self.style.refresh then self.style.refresh(self, v, GetTime()) end
    if not self.toolT then self:PlaceTool(0) end
  end

  function b:PlaceTool(u)
    if not self.style then return end
    local dx, dy, rot, sc, al = 0, 0, 0, 1, 1
    if u > 0 then dx, dy, rot, sc, al = MOTION[self.style.tool](u) end
    self.tool:ClearAllPoints()
    self.tool:SetPoint("BOTTOM", self.track, "LEFT", W * self.value + dx, 2 + dy)
    self.tool:SetSize(14 * sc, 14 * sc)
    self.tool:SetRotation((self.style.toolRot or 0) + rot)
    self.tool:SetAlpha(al)
  end

  function b:PlayTool() self.toolT = 0 end

  b:SetScript("OnUpdate", function(self, dt)
    if self.style and self.style.refresh and self.style == STYLE.Alchemy then self.style.refresh(self, self.value, GetTime()) end
    if self.toolT then
      self.toolT = self.toolT + dt
      local u = self.toolT / 0.4
      if u >= 1 then self.toolT = nil; self:PlaceTool(0) else self:PlaceTool(u) end
    end
  end)
  return b
end

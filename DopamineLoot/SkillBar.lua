-- Dopamine Loot skill bars, made to match docs/mockups/crafting-picks.html (round 4's crafting bars with
-- round 5's fixes, and the gathering bars proposed there): each profession's bar is made of its material
-- and a small tool (our own drawings in the mockup's emoji style, tools/render-media.html) sits on the bar's
-- top edge at the end of the fill. On a skill-up the fill grows, then the tool makes the mockup's motion
-- with its sound (and sparks, pollen, chips or a ripple).
--   Crafting   Tailoring (stitched line, needle) · Leatherworking (punched strip, pin) · Alchemy (glass tube,
--              drop) · Engineering (gauge cells, wrench) · Cooking (grill stripes, pan) · Blacksmithing
--              (iron heating to white, hammer) · Enchanting (runes lighting, sparkle) · First Aid (bandage
--              with red crosses, paperclip)
--   Gathering  Herbalism (green stem with leaves, sprout) · Mining (layered stone, pick) · Fishing (water,
--              bobber) · Skinning (hide with fur grain, knife)
-- Any other profession gets a plain gradient bar. ns.MakeSkillBar(parent) returns a frame with
-- :SetProfession(name, color, light), :SetValue(0..1) and :PlayTool(). Gradients stretch with the fill
-- (as in the mockup's CSS); patterns stay put and show as the fill reaches them.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local WHITE = "Interface\\Buttons\\WHITE8X8"
local W, H = 260, 12
local function Hex(s) return tonumber(s:sub(1, 2), 16) / 255, tonumber(s:sub(3, 4), 16) / 255, tonumber(s:sub(5, 6), 16) / 255 end

-- A gradient on a texture: dir "H" left to right, "V" top to bottom (colors as "rrggbb")
local function Grad(tex, dir, c1, c2)
  tex:SetTexture(WHITE)
  local r1, g1, b1 = Hex(c1)
  local r2, g2, b2 = Hex(c2)
  local A, B = CreateColor(r1, g1, b1, 1), CreateColor(r2, g2, b2, 1)
  if dir == "V" then A, B = B, A end -- (the game's VERTICAL runs bottom to top)
  if not pcall(tex.SetGradient, tex, dir == "V" and "VERTICAL" or "HORIZONTAL", A, B) then tex:SetVertexColor(r1, g1, b1, 1) end
end

---------------------------------------------------------------------------
-- The materials. track: the empty bar's color; stops: the fill's gradient, stretched with it
-- ({ from, to, c1, c2 } as fractions of the fill, left to right), or vstops (top to bottom); build(b):
-- the patterns; refresh(b, v, t): parts that follow the value or wobble. tool: { file, size, how far
-- below the bar's top edge its middle sits }; motion: keyframes (see Frame)
---------------------------------------------------------------------------
local STYLE = {}
local function Dashes(b, where, y, w, period, color, alpha, x0)
  local r, g, bb = Hex(color)
  for x = x0 or 3, W - 3 - w, period do
    local d = where == "inner" and b:Inner("ARTWORK") or b:Over("ARTWORK")
    d:SetColorTexture(r, g, bb, alpha or 1); d:SetSize(w, 2)
    d:SetPoint("TOPLEFT", where == "inner" and b.inner or b.track, "TOPLEFT", x, -y)
  end
end
local function Spot(b, where, file, color, w, h, x, y, rot)
  local t = where == "inner" and b:Inner("ARTWORK") or b:Over("OVERLAY")
  t:SetTexture(file); t:SetVertexColor(Hex(color)); t:SetSize(w, h)
  t:SetPoint("CENTER", where == "inner" and b.inner or b.track, "TOPLEFT", x, -y)
  if rot then t:SetRotation(math.rad(rot)) end
  return t
end
local CIRCLE, STREAK = MEDIA .. "Circle.tga", MEDIA .. "Streak.tga"

STYLE.Tailoring = { track = "000000", trackA = 0.65, stops = { { 0, 1, "a89870", "fff4d8" } },
  tool = { "ToolNeedle", 24, 3 }, motion = { { 0, 0, 0 }, { 0, 5, 20 }, { 0, 0, 0 } },
  build = function(b) Dashes(b, "over", 5, 6, 10, "ffffff", 0.75) end }
STYLE.Leatherworking = { track = "2a1a0e", vstops = { "c89060", "8a5a30" },
  tool = { "ToolPin", 20, -2 }, motion = { { 0, 0 }, { 0, 6 }, { 0, 0 } },
  build = function(b)
    for x = 4, W - 4, 8 do Spot(b, "over", CIRCLE, "0a0604", 3, 3, x, 2); Spot(b, "over", CIRCLE, "0a0604", 3, 3, x + 4, 10) end
    Dashes(b, "inner", 5, 6, 10, "f0d8a8", 1, 2)
  end }
STYLE.Alchemy = { track = "1a1422", vstops = { "d0a8ff", "7a3ad0" }, wobble = "b88aff",
  tool = { "ToolDrop", 20, -2 }, motion = { { 0, -6, 0, 1, 1, 1 }, { 0, 6, 0, 1, 1, 0.2 }, { 0, 0, 0, 1, 1, 1 } },
  build = function(b)
    local hi = b:Over("OVERLAY"); hi:SetColorTexture(1, 1, 1, 0.22); hi:SetHeight(1)
    hi:SetPoint("TOPLEFT", b.track, "TOPLEFT", 2, -1); hi:SetPoint("TOPRIGHT", b.track, "TOPRIGHT", -2, -1)
  end }
STYLE.Engineering = { track = "000000", stops = {}, glow = "c8e0f8",
  tool = { "ToolWrench", 20, -1 }, motion = { { 0, 0, 0 }, { 0, 0, -40 }, { 0, 0, 0 } },
  build = function(b) b.cells = {}
    for i = 0, math.floor(W / 13) - 1 do
      local c = b:Over("ARTWORK"); c:SetSize(11, H); c:SetPoint("TOPLEFT", b.track, "TOPLEFT", i * 13, 0); b.cells[#b.cells + 1] = c
    end
  end,
  refresh = function(b, v)
    for i, c in ipairs(b.cells or {}) do
      if (i - 1) * 13 + 6 <= W * v then c:SetColorTexture(Hex("c8e0f8")) else c:SetColorTexture(Hex("1a1e24")) end
    end
  end }
STYLE.Cooking = { track = "2a1c10", stops = { { 0, 1, "c87a3a", "c87a3a" } },
  tool = { "ToolPan", 20, -1 }, motion = { { 0, 0, 0 }, { 0, -6, -200 }, { 0, 0, -360 } },
  build = function(b) for x = -6, W + 6, 10 do Spot(b, "inner", STREAK, "6a3410", 20, 20, x, H / 2, -35) end end }
STYLE.Blacksmithing = { track = "1a1a1c", stops = { { 0, 0.55, "3a3a40", "6a3a2a" }, { 0.55, 0.82, "6a3a2a", "e0501a" }, { 0.82, 1, "e0501a", "ffe7a0" } }, glow = "ff7828",
  tool = { "ToolHammer", 20, -1 }, motion = { { 0, -2, -30 }, { 0, 2, 10 }, { 0, 0, 0 } }, bits = { n = 5, color = "ffd27a", size = 2, up = true, spread = 14 } }
STYLE.Enchanting = { track = "120c22", stops = { { 0, 1, "3a2a7a", "8a6aff" } },
  tool = { "ToolSparkle", 18, -1 }, motion = { { 0, 0, 0, 1 }, { 0, 0, 0, 1.6 }, { 0, 0, 0, 1 } }, toolGlow = true,
  build = function(b) b.runes = {}
    for i = 0, 9 do
      local r = b:Over("OVERLAY"); local n = (i * 7) % 16
      r:SetTexture(MEDIA .. "Runes.tga"); r:SetTexCoord((n % 4) / 4, (n % 4 + 1) / 4, math.floor(n / 4) / 4, (math.floor(n / 4) + 1) / 4)
      r:SetSize(10, 10); r:SetPoint("CENTER", b.track, "LEFT", W * (i + 0.5) / 10, 0); b.runes[i + 1] = r
    end
  end,
  refresh = function(b, v) for i, r in ipairs(b.runes or {}) do local lit = (i - 0.5) / #b.runes < v; r:SetBlendMode(lit and "ADD" or "BLEND"); r:SetAlpha(lit and 1 or 0.2) end end }
STYLE["First Aid"] = { track = "2a2622", stops = { { 0, 1, "f2ede2", "f2ede2" } },
  tool = { "ToolClip", 18, -2 }, motion = { { 0, -6, 0 }, { 0, 0, 0, 1.2, 0.8 }, { 0, 0, 0 } },
  build = function(b) for x = 7, W - 4, 15 do Spot(b, "inner", WHITE, "d03030", 7, 2, x, H / 2); Spot(b, "inner", WHITE, "d03030", 2, 7, x, H / 2) end end }
-- gathering (proposed in crafting-picks.html, picked 2026-11-09)
STYLE.Herbalism = { track = "10180c", stops = { { 0, 0.7, "1e6a28", "4ab83a" }, { 0.7, 1, "4ab83a", "8ef07a" } },
  tool = { "ToolSprout", 20, -2 }, motion = { { 0, 4, 0, 0.6 }, { 0, -4, 0, 1.25 }, { 0, 0, 0, 1 } }, bits = { n = 6, color = "f0ff90", size = 2, up = true, spread = 12 },
  build = function(b) for x = 3, W, 13 do Spot(b, "inner", CIRCLE, "c8ffb0", 6, 4, x + 3, 4); Spot(b, "inner", CIRCLE, "a8f090", 6, 4, x + 9, 9) end end }
STYLE.Mining = { track = "161412", stops = {},
  tool = { "ToolPick", 20, -2 }, motion = { { 0, -3, -35 }, { 0, 2, 15 }, { 0, 0, 0 } }, bits = { n = 5, color = "a89a8a", size = 3, up = true, spread = 14 },
  build = function(b)
    local bands = { { 6, "4a4440" }, { 3, "5a524c" }, { 5, "3e3a36" } }
    local x, i = 0, 0
    while x < W do
      local band = bands[i % 3 + 1]
      local t = b:Inner("BACKGROUND", 1); t:SetColorTexture(Hex(band[2])); t:SetSize(band[1], H); t:SetPoint("TOPLEFT", b.inner, "TOPLEFT", x, 0)
      x, i = x + band[1], i + 1
    end
    for fx = 2, W, 17 do Spot(b, "inner", CIRCLE, "f0a860", 2.5, 2.5, fx, 3) end
    for fx = 10, W, 23 do Spot(b, "inner", CIRCLE, "ffe0b0", 2, 2, fx, 8) end
  end }
STYLE.Fishing = { track = "08121c", vstops = { "8ac8ff", "2a7ae0", "1a4a9a" }, wobble = "6ab0ff",
  tool = { "ToolBobber", 18, -3 }, motion = { { 0, 0 }, { 0, 6 }, { 0, -2 }, { 0, 0 } }, ripple = true,
  build = function(b)
    local hi = b:Inner("ARTWORK"); hi:SetColorTexture(1, 1, 1, 0.5); hi:SetHeight(1)
    hi:SetPoint("TOPLEFT", b.inner, "TOPLEFT", 0, -2); hi:SetPoint("TOPRIGHT", b.inner, "TOPRIGHT", 0, -2)
  end }
STYLE.Skinning = { track = "1c130b", vstops = { "d0a070", "8a5a30" },
  tool = { "ToolKnife", 20, -1 }, motion = { { -0.2, 0, -20, 1, 1, 1, 0 }, { 0.3, -2, 10, 1, 1, 1, 1 }, { 0, 0, 0, 1, 1, 1, 0 } }, bits = { n = 3, color = "ffffff", size = 2, spread = 16 },
  build = function(b) for x = -4, W + 4, 4 do Spot(b, "inner", STREAK, "fff0d2", 14, 14, x, H / 2, 25):SetAlpha(0.3) end end }

-- A motion keyframe: { dx, dy, degrees, scale x, scale y, alpha, flash } in the mockup's CSS terms (y down,
-- degrees clockwise; a dx under 1 is a fraction of the tool's width, as the knife's translateX(-70%))
local function Frame(k) return k[1] or 0, k[2] or 0, k[3] or 0, k[4] or 1, k[5] or k[4] or 1, k[6] or 1, k[7] or 0 end
local MOTION_T = 0.38

function ns.MakeSkillBar(parent)
  local b = CreateFrame("Frame", nil, parent)
  b:SetSize(W, H + 22)
  b.track = b:CreateTexture(nil, "BACKGROUND")
  b.track:SetSize(W, H)
  b.track:SetPoint("BOTTOMLEFT", 0, 4)
  b.edge = b:CreateTexture(nil, "BACKGROUND", nil, -1)
  b.edge:SetColorTexture(0, 0, 0, 1)
  b.edge:SetPoint("TOPLEFT", b.track, -1, 1); b.edge:SetPoint("BOTTOMRIGHT", b.track, 1, -1)
  b.glow = b:CreateTexture(nil, "BACKGROUND", nil, -2) -- (the mockup's box-shadow around a hot or lit fill)
  b.glow:SetTexture(MEDIA .. "Glow.tga"); b.glow:SetBlendMode("ADD")
  -- the filled part: a clipping frame as wide as the value; in it the gradient (stretched with it) and a
  -- full-width inner frame for the patterns that stay put
  b.clip = CreateFrame("Frame", nil, b)
  b.clip:SetPoint("TOPLEFT", b.track, "TOPLEFT")
  b.clip:SetSize(1, H)
  b.clip:SetClipsChildren(true)
  b.inner = CreateFrame("Frame", nil, b.clip)
  b.inner:SetPoint("TOPLEFT", b.track, "TOPLEFT")
  b.inner:SetSize(W, H)
  b.segs = {}
  b.top = CreateFrame("Frame", nil, b) -- above the fill: patterns over the whole bar, the tool
  b.top:SetAllPoints(b)
  b.top:SetFrameLevel(b.clip:GetFrameLevel() + 2)
  b.wobble = b.top:CreateTexture(nil, "ARTWORK", nil, 2) -- (the liquid's surface at the fill's end)
  b.wobble:SetTexture(CIRCLE)
  b.tool = b.top:CreateTexture(nil, "OVERLAY", nil, 3)
  b.toolHi = b.top:CreateTexture(nil, "OVERLAY", nil, 4) -- (a bright copy: the knife's flash, the sparkle's glow)
  b.toolHi:SetBlendMode("ADD")
  b.bits, b.made, b.sets = {}, {}, {}
  function b:Over(layer, sub) local t = self.top:CreateTexture(nil, layer, nil, sub); self.made[#self.made + 1] = t; return t end
  function b:Inner(layer, sub) local t = self.inner:CreateTexture(nil, layer, nil, sub); self.made[#self.made + 1] = t; return t end
  b.value = 0

  local function Seg(i)
    local s = b.segs[i]
    if not s then s = b.clip:CreateTexture(nil, "BACKGROUND"); b.segs[i] = s end
    s:Show()
    return s
  end
  function b:PlaceFill()
    local w = math.max(0.5, W * self.value)
    self.clip:SetWidth(w)
    for _, s in ipairs(self.segs) do
      if s.from then
        s:ClearAllPoints()
        if s.vert then s:SetPoint("TOPLEFT", self.clip, "TOPLEFT", 0, -H * s.from); s:SetSize(w, math.max(0.5, H * (s.to - s.from)))
        else s:SetPoint("TOPLEFT", self.clip, "TOPLEFT", w * s.from, 0); s:SetSize(math.max(0.5, w * (s.to - s.from)), H) end
      end
    end
    if self.glow:IsShown() then
      self.glow:ClearAllPoints(); self.glow:SetPoint("TOPLEFT", self.track, "TOPLEFT", -8, 8); self.glow:SetSize(w + 16, H + 16)
    end
  end

  -- name: the profession (the client's English name); color, light: { r, g, b } for the plain bar
  function b:SetProfession(name, color, light)
    for _, t in ipairs(self.made) do t:Hide() end
    for _, s in ipairs(self.segs) do s:Hide(); s.from = nil end
    self.toolT = nil
    local st = STYLE[name]
    self.style, self.styleName = st, st and name:gsub("%s", "") or nil
    self.cells, self.runes = nil, nil
    if not st then -- a plain bar in the profession's color
      self.track:SetColorTexture(0, 0, 0, 0.65)
      local c, l = color or { 1, 0.82, 0 }, light or { 1, 0.95, 0.6 }
      local s = Seg(1); s.from, s.to, s.vert = 0, 1, false
      s:SetTexture(WHITE); s:SetVertexColor(1, 1, 1, 1)
      if not pcall(s.SetGradient, s, "HORIZONTAL", CreateColor(c[1], c[2], c[3], 1), CreateColor(l[1], l[2], l[3], 1)) then s:SetVertexColor(c[1], c[2], c[3]) end
      self.made = {}
      self.tool:Hide(); self.toolHi:Hide(); self.glow:Hide(); self.wobble:Hide()
      self:SetValue(self.value)
      return
    end
    local r, g, bb = Hex(st.track)
    self.track:SetColorTexture(r, g, bb, st.trackA or 1)
    if st.vstops then
      local n = #st.vstops - 1
      for i = 1, n do local s = Seg(i); s.vert, s.from, s.to = true, (i - 1) / n, i / n; s:SetVertexColor(1, 1, 1, 1); Grad(s, "V", st.vstops[i], st.vstops[i + 1]) end
    else
      for i, sp in ipairs(st.stops) do local s = Seg(i); s.vert, s.from, s.to = false, sp[1], sp[2]; s:SetVertexColor(1, 1, 1, 1); Grad(s, "H", sp[3], sp[4]) end
    end
    local set = self.sets[name]
    if not set then -- the patterns are built the first time this style shows, kept after that
      self.made = {}
      if st.build then st.build(self) end
      set = { made = self.made, cells = self.cells, runes = self.runes }
      self.sets[name] = set
    end
    self.made, self.cells, self.runes = set.made, set.cells, set.runes
    for _, t in ipairs(self.made) do t:Show() end
    local file = MEDIA .. st.tool[1] .. ".tga"
    self.tool:SetTexture(file); self.tool:Show()
    self.toolHi:SetTexture(file); self.toolHi:Hide()
    if st.glow then self.glow:SetVertexColor(Hex(st.glow)); self.glow:SetAlpha(0.5); self.glow:Show() else self.glow:Hide() end
    if st.wobble then self.wobble:SetVertexColor(Hex(st.wobble)); self.wobble:Show() else self.wobble:Hide() end
    self:SetValue(self.value)
  end

  function b:SetValue(v)
    self.value = math.max(0, math.min(1, v or 0))
    self:PlaceFill()
    if self.style and self.style.refresh then self.style.refresh(self, self.value) end
    if not self.toolT then self:PlaceTool(0) end
  end

  -- u: 0..1 through the motion (0: at rest)
  function b:PlaceTool(u)
    local st = self.style
    if not st then return end
    local size, below = st.tool[2], st.tool[3]
    local dx, dy, deg, sx, sy, al, fl = 0, 0, 0, 1, 1, 1, 0
    if u > 0 then
      local keys = st.motion
      local e = (1 - (1 - u) * (1 - u)) * (#keys - 1) -- (ease-out, across the keyframes)
      local i = math.min(#keys - 1, math.floor(e) + 1)
      local f = e - (i - 1)
      local ax, ay, ad, asx, asy, aa, af = Frame(keys[i])
      local bx, by, bd, bsx, bsy, ba, bf = Frame(keys[i + 1])
      dx, dy, deg = ax + (bx - ax) * f, ay + (by - ay) * f, ad + (bd - ad) * f
      sx, sy, al, fl = asx + (bsx - asx) * f, asy + (bsy - asy) * f, aa + (ba - aa) * f, af + (bf - af) * f
      if math.abs(dx) < 1 then dx = dx * size end
    end
    for _, t in ipairs({ self.tool, self.toolHi }) do
      t:ClearAllPoints()
      t:SetPoint("CENTER", self.track, "TOPLEFT", W * self.value + dx, -below - dy)
      t:SetSize(size * sx, size * sy)
      t:SetRotation(-math.rad(deg))
    end
    self.tool:SetAlpha(al)
    local glow = st.toolGlow and (sx - 1) / 0.6 or fl
    if glow > 0.01 then self.toolHi:SetAlpha(math.min(1, glow) * 0.8); self.toolHi:Show() else self.toolHi:Hide() end
  end

  -- little bits from the tool (sparks, pollen, chips, a flash) and the bobber's ripple
  local function Bit()
    for _, q in ipairs(b.bits) do if not q.on then return q end end
    local q = { tex = b.top:CreateTexture(nil, "OVERLAY", nil, 5) }
    b.bits[#b.bits + 1] = q
    return q
  end
  function b:Burst()
    local st = self.style
    local x0, y0 = W * self.value, -st.tool[3] - st.tool[2] * 0.3
    if st.bits then
      local o = st.bits
      for _ = 1, o.n do
        local q = Bit()
        q.on, q.t, q.life, q.x, q.y, q.ring = true, 0, 0.45, x0, y0, nil
        q.dx, q.dy = math.random(-o.spread, o.spread), o.up and math.random(4, 18) or math.random(-4, 10)
        q.tex:SetTexture(CIRCLE); q.tex:SetBlendMode("ADD"); q.tex:SetVertexColor(Hex(o.color)); q.tex:SetSize(o.size, o.size)
      end
    end
    if st.ripple then
      local q = Bit()
      q.on, q.t, q.life, q.x, q.y, q.dx, q.dy, q.ring = true, 0, 0.6, x0, -st.tool[3] - st.tool[2] * 0.45, 0, 0, true
      q.tex:SetTexture(MEDIA .. "Ring.tga"); q.tex:SetBlendMode("ADD"); q.tex:SetVertexColor(Hex("bfe0ff"))
    end
  end

  function b:PlayTool()
    if not self.style then return end
    self.toolT = 0
    self:Burst()
    ns:PlayGatherFx("Tool" .. self.styleName)
    if self.style.refresh then self.style.refresh(self, self.value) end -- (runes light as the tool lands)
  end

  b:SetScript("OnUpdate", function(self, dt)
    local st = self.style
    if st and st.wobble then -- the liquid's surface sways at the end of the fill
      self.wobble:ClearAllPoints(); self.wobble:SetPoint("CENTER", self.track, "LEFT", W * self.value, 0)
      self.wobble:SetSize(10 * (0.8 + 0.2 * math.sin(GetTime() * 5.7)), H)
    end
    if self.toolT then
      self.toolT = self.toolT + dt
      local u = self.toolT / MOTION_T
      if u >= 1 then self.toolT = nil; self:PlaceTool(0) else self:PlaceTool(u) end
    end
    for _, q in ipairs(self.bits) do
      if q.on then
        q.t = q.t + dt
        local u = q.t / q.life
        if u >= 1 then q.on = false; q.tex:Hide()
        else
          q.tex:ClearAllPoints()
          q.tex:SetPoint("CENTER", self.track, "TOPLEFT", q.x + q.dx * u, q.y + q.dy * u)
          if q.ring then local k = 0.3 + 1.3 * u; q.tex:SetSize(20 * k, 6 * k) end
          q.tex:SetAlpha(1 - u); q.tex:Show()
        end
      end
    end
  end)
  return b
end

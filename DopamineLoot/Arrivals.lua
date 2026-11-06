-- Dopamine Loot popup arrivals: the show a popup makes as it lands, picked per rarity on the
-- Arrivals settings page (designed in docs/mockups/popup-designs.html, rounds 1-8).
--   Uncommon  Fireflies, Emerald flare, Geyser
--   Rare      Sapphire flare, Aurora arch, Reverse disintegration, Light pool (all with a ring wave)
--   Epic      Implosion (then the galaxy), Eclipse, Starfall
--   Legendary Supernova, Meteor shower, Golden seal (after the comet of the Legendary moment, Popup.lua)
-- "Simple" keeps the old arrival (View.lua: a spark burst, glints, shockwaves by rarity).
-- Everything is drawn on two full-screen layers of pooled textures around the popup's item: one in
-- front of the popups, one just behind them (a strata lower). Effects are scripts that run each frame
-- from one OnUpdate; particles are plain tables. Coordinates are UIParent units from its bottom left
-- (y up); sizes scale with the popup's own scale.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local STAR = "Interface\\Cooldown\\star4" -- the game's four-point sparkle
local WHITE = "Interface\\Buttons\\WHITE8X8"
local LOWER = { HIGH = "MEDIUM", DIALOG = "HIGH" }

-- The choices per rarity (setting "arrival" .. q); the first is the default
ns.ARRIVALS = {
  [2] = { { "fireflies", "Fireflies" }, { "emerald", "Emerald flare" }, { "geyser", "Geyser" }, { "simple", "Simple sparks" } },
  -- ("disint", Reverse disintegration, set aside for 1.1.0: back to its first version plus the fade, later)
  [3] = { { "sapphire", "Sapphire flare" }, { "aurora", "Aurora arch" }, { "pool", "Light pool" }, { "simple", "Simple sparks" } },
  [4] = { { "implode", "Implosion and galaxy" }, { "eclipse", "Eclipse" }, { "starfall", "Starfall" }, { "simple", "Simple sparks" } },
  [5] = { { "supernova", "Supernova" }, { "meteors", "Meteor shower" }, { "seal", "Golden seal" }, { "simple", "Simple sparks" } },
}
function ns.ArrivalFor(q)
  local list = ns.ARRIVALS[math.min(q or 0, 5)]
  if not list then return "simple" end
  local pick = ns.settings["arrival" .. math.min(q, 5)]
  for _, o in ipairs(list) do if o[1] == pick then return pick end end
  return list[1][1]
end

local front, back, driver
local pools, effects, parts = {}, {}, {}

local function Layers(strata)
  if not front then
    front = CreateFrame("Frame", nil, UIParent)
    back = CreateFrame("Frame", nil, UIParent)
    for _, f in ipairs({ front, back }) do f:SetAllPoints(UIParent); f:EnableMouse(false) end
    driver = CreateFrame("Frame")
  end
  -- (shared by every arrival: re-strata only while nothing plays, or a test popup's effects would
  -- jump behind a real one's and back)
  if effects[1] or parts[1] then return end
  front:SetFrameStrata(strata)
  front:SetFrameLevel(5000)
  back:SetFrameStrata(LOWER[strata] or "MEDIUM")
  back:SetFrameLevel(5100) -- (above the Legendary moment's dim)
end

-- A pooled texture: where = front or back, file, blend ("ADD" or nil), sub = draw sublevel
local function Get(where, file, blend, sub)
  local key = (where == front and "f" or "b") .. file .. (blend or "") .. (sub or 0)
  local pool = pools[key]
  if not pool then pool = {}; pools[key] = pool end
  local t = table.remove(pool)
  if not t then
    t = where:CreateTexture(nil, "ARTWORK", nil, sub or 0)
    t:SetTexture(file)
    if blend then t:SetBlendMode(blend) end
    t.poolKey = key
  end
  t:Show()
  return t
end
local function Put(t)
  if not t then return end
  t:Hide()
  t:ClearAllPoints()
  local pool = pools[t.poolKey]
  pool[#pool + 1] = t
end
local function Place(t, x, y, w, h, a, r, g, b, anchor)
  t:ClearAllPoints()
  t:SetPoint(anchor or "CENTER", UIParent, "BOTTOMLEFT", x, y)
  t:SetSize(math.max(1, w), math.max(1, h or w))
  if r then t:SetVertexColor(r, g, b, 1) end
  t:SetAlpha(math.max(0, math.min(1, a)))
end

local function Rnd(a, b) return a + math.random() * (b - a) end
local function Light(r, g, b, k) k = k or 0.45; return math.min(1, r + k), math.min(1, g + k), math.min(1, b + k) end

-- Where an effect draws: the popup's item (its stage), in UIParent units, and the popup's scale
local function Origin(e)
  local st = e.view and e.view.stage
  if not st then return e.x, e.y, e.s end
  local x, y = st:GetCenter()
  if not x then return e.x, e.y, e.s end
  local k = st:GetEffectiveScale() / UIParent:GetEffectiveScale()
  e.x, e.y, e.s = x * k, y * k, k
  return e.x, e.y, e.s
end

---------------------------------------------------------------------------
-- Particles: { t, x, y, vx, vy, age, life, size, grav, drag, r, g, b, a, steer, blink, halo, tw }
---------------------------------------------------------------------------
local function Particle(where, file, x, y, vx, vy, life, size, r, g, b, o)
  o = o or {}
  local p = { where = where, file = file, x = x, y = y, vx = vx, vy = vy, age = -(o.delay or 0), life = life, size = size,
    grav = o.grav or 0, drag = o.drag or 0, r = r, g = g, b = b, a = o.a or 1, steer = o.steer, blink = o.blink,
    halo = o.halo, ph = math.random() * 6.28, star = o.star, fade = o.fade or "out", e = o.e }
  parts[#parts + 1] = p
  return p
end
-- n sparks thrown from x, y: up = a fan upward (fan: its half-width in radians)
local function Burst(x, y, n, speed, s, r, g, b, o)
  o = o or {}
  for _ = 1, n do
    local an = o.up and (math.pi / 2 + (math.random() * 2 - 1) * (o.fan or 1.4)) or math.random() * 2 * math.pi
    local v = Rnd(0.45, 1) * speed * s
    local cr, cg, cb = r, g, b
    if o.colors then local c = o.colors[math.random(#o.colors)]; cr, cg, cb = c[1], c[2], c[3] end
    Particle(front, MEDIA .. "Mote", x, y, math.cos(an) * v, math.sin(an) * v, Rnd(0.5, 0.9) * (o.life or 1),
      Rnd(4, 8) * (o.size or 1) * s, cr, cg, cb, { grav = (o.grav or 160) * s, drag = o.drag or 2.6, delay = o.delay and Rnd(0, o.delay) })
  end
end
-- star glints popping around x, y one after another
local function Glints(x, y, n, spread, s, delay)
  for i = 1, n do
    Particle(front, STAR, x + Rnd(-spread, spread) * s, y + Rnd(-spread * 0.9, spread * 0.8) * s, 0, 0, 0.45,
      Rnd(26, 40) * s, 1, 1, 1, { delay = (delay or 0) + (i - 1) * 0.075, star = true, fade = "sin" })
  end
end

local function UpdateParts(dt)
  for i = #parts, 1, -1 do
    local p = parts[i]
    p.age = p.age + dt
    if p.age >= p.life then
      Put(p.tex); Put(p.haloTex)
      table.remove(parts, i)
    elseif p.age >= 0 then
      if p.steer then p.steer(p, dt) else
        local d = math.exp(-p.drag * dt)
        p.vx, p.vy = p.vx * d, p.vy * d - p.grav * dt
      end
      p.x, p.y = p.x + p.vx * dt, p.y + p.vy * dt
      local u = p.age / p.life
      local a = p.fade == "sin" and math.sin(math.pi * u) or (1 - u)
      if p.blink then a = a * (0.35 + 0.65 * math.max(0, math.sin(p.age * 8 + p.ph))) end
      a = a * p.a
      if not p.tex then p.tex = Get(p.where, p.file, "ADD") end
      local size = p.star and p.size * math.sin(math.pi * u) or p.size
      Place(p.tex, p.x, p.y, size, size, a, p.r, p.g, p.b)
      if p.star then p.tex:SetRotation(u * 0.6) end
      if p.halo then
        if not p.haloTex then p.haloTex = Get(p.where, MEDIA .. "Glow", "ADD") end
        Place(p.haloTex, p.x, p.y, size * 3.2, size * 3.2, a * 0.3, p.r, p.g, p.b)
      end
    end
  end
end

---------------------------------------------------------------------------
-- Effects: { t, life, view, run(e, dt) } own their textures (e.tex[name]) and drop them at the end
---------------------------------------------------------------------------
local function Effect(view, life, run, delay)
  local e = { t = -(delay or 0), life = life, view = view, run = run, tex = {}, gen = view and view.arrivalGen }
  Origin(e)
  effects[#effects + 1] = e
  return e
end
local function T(e, name, where, file, blend, sub) -- the effect's own texture by name
  local t = e.tex[name]
  if not t then t = Get(where, file, blend, sub); e.tex[name] = t end
  return t
end
local function EndEffect(e) for _, t in pairs(e.tex) do Put(t) end; e.tex = {} end

-- a ring wave from x, y out to radius (a thin ring, round)
local function Ring(view, r, g, b, radius, life, delay, width)
  Effect(view, life, function(e)
    local x, y, s = Origin(e)
    local u = e.t / e.life
    local rad = (10 + (radius - 10) * (1 - (1 - u) ^ 3)) * s
    Place(T(e, "w", front, MEDIA .. "Wave", "ADD"), x, y, rad * 2, rad * 2, (1 - u) * 0.95 * (width or 1), r, g, b)
  end, delay)
end
-- a horizontal light streak (the soft glow stretched thin), bright in the middle
local function Streak(e, name, x, y, w, h, a, r, g, b)
  Place(T(e, name, front, MEDIA .. "Glow", "ADD"), x, y, w, h, a, r, g, b)
end
local function StarAt(e, name, x, y, size, a, rot)
  local t = T(e, name, front, STAR, "ADD", 2)
  Place(t, x, y, size, size, a, 1, 1, 1)
  t:SetRotation(rot or 0)
end
local function Shake(view, t) if view and view.Shake then view:Shake(t) end end

---------------------------------------------------------------------------
-- The arrivals: A[key](view, x, y, s, r, g, b) at the moment it lands
---------------------------------------------------------------------------
local A = {}

-- Uncommon: fireflies burst out with a glow, gather into a ring around the item, then drift up and away
function A.fireflies(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  local cols = { { lr, lg, lb }, { 0.91, 1, 0.6 }, { r, g, b }, { 1, 0.96, 0.63 } }
  local home = Effect(view, 3, function(e) Origin(e) end) -- follows the item, for the ring they gather into
  for i = 1, 28 do
    local an, v = math.random() * 6.28, Rnd(180, 320) * s
    local c = cols[(i % 4) + 1]
    Particle(front, MEDIA .. "Mote", x, y, math.cos(an) * v, math.sin(an) * v, Rnd(2.4, 3), Rnd(4, 6) * s, c[1], c[2], c[3], {
      delay = Rnd(0, 0.1), blink = true, halo = true, ph = i,
      steer = function(p, dt)
        local hx, hy = home.x, home.y - 20 * s
        if p.age > 0.5 and p.age < 1.4 then -- into a ring around the item
          local ang = (i / 28) * 6.28 + p.age * 1.8
          local tx, ty = hx + math.cos(ang) * 70 * s, hy + math.sin(ang) * 34 * s
          p.vx, p.vy = p.vx + (tx - p.x) * 14 * dt, p.vy + (ty - p.y) * 14 * dt
          local d = math.exp(-4 * dt); p.vx, p.vy = p.vx * d, p.vy * d
        elseif p.age >= 1.4 then -- then up and away
          p.vy = p.vy + 260 * s * dt
          p.vx = p.vx + Rnd(-200, 200) * s * dt
        else
          local d = math.exp(-2.2 * dt); p.vx, p.vy = p.vx * d, p.vy * d
        end
      end })
  end
  Ring(view, lr, lg, lb, 100, 0.5)
  Glints(x, y, 2, 30, s)
end

-- Uncommon: a soft green flare (a light streak and a star) with pollen drifting out
function A.emerald(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  Effect(view, 1.2, function(e)
    local ox, oy, sc = Origin(e)
    local u = e.t / e.life
    local a = u < 0.15 and u / 0.15 or 1 - (u - 0.15) / 0.85
    local w = 420 * (0.6 + 0.4 * math.min(1, e.t / 0.25)) * sc
    Streak(e, "a", ox, oy, w, 5 * sc, a * 0.9, 0.96, 1, 0.91)
    Streak(e, "b", ox, oy, w * 0.8, 24 * sc, a * 0.55, lr, lg, lb)
    Streak(e, "c", ox, oy, w * 0.35, 64 * sc, a * 0.25, r, g, b)
    StarAt(e, "s", ox, oy, 80 * a * sc, a)
  end)
  for i = 1, 26 do
    local c = i % 3 == 0 and { 1, 0.98, 0.82 } or { lr, lg, lb }
    Particle(front, MEDIA .. "Mote", x + Rnd(-20, 20) * s, y + Rnd(-10, 10) * s, Rnd(-160, 160) * s, Rnd(-40, 60) * s,
      Rnd(1.4, 2.2), Rnd(3, 5) * s, c[1], c[2], c[3], { delay = Rnd(0, 0.3), grav = -15 * s, drag = 1.4, fade = "sin" })
  end
  Ring(view, lr, lg, lb, 110, 0.6, 0.05)
end

-- Uncommon: one smooth column of light shoots up through the item, thins and dissolves upward; a mist
-- ring spreads at its base; a few soft droplets fall back
function A.geyser(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  Effect(view, 1.3, function(e)
    local ox, oy, sc = Origin(e)
    local base = oy - 90 * sc
    local up = 1 - (1 - math.min(1, e.t / 0.35)) ^ 3
    local thin = math.max(0, (e.t - 0.35) / 0.95)
    local top, bottom = base + 460 * up * sc, base + 380 * thin * thin * sc
    local w = 40 * (1 - thin * 0.85) * sc
    local h = math.max(1, top - bottom)
    local fade = 1 - thin * 0.6
    Place(T(e, "c1", back, MEDIA .. "Glow", "ADD"), ox, (top + bottom) / 2, w * 1.6, h * 1.25, 0.32 * fade, r, g, b)
    Place(T(e, "c2", back, MEDIA .. "Glow", "ADD"), ox, (top + bottom) / 2, w, h * 1.2, 0.6 * fade, lr, lg, lb)
    Place(T(e, "c3", back, MEDIA .. "Glow", "ADD"), ox, (top + bottom) / 2, w * 0.3, h * 1.15, 0.8 * fade, 1, 1, 1)
    local mu = math.min(1, e.t / 0.8)
    local rx = (30 + 120 * (1 - (1 - mu) ^ 2)) * sc
    Place(T(e, "m", back, MEDIA .. "Glow", "ADD"), ox, base, rx * 2, rx * 0.5, (1 - mu) * 0.6, lr, lg, lb)
  end)
  Burst(x, y - 40 * s, 18, 560, s, lr, lg, lb, { up = true, fan = 0.22, grav = 700, drag = 0.8, life = 1.6, size = 0.9, delay = 0.15 })
end

-- Rare: a big horizontal lens flare across the item with a bright star and small ghost rings
function A.sapphire(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  Effect(view, 1.1, function(e)
    local ox, oy, sc = Origin(e)
    local u = e.t / e.life
    local a = u < 0.15 and u / 0.15 or 1 - (u - 0.15) / 0.85
    local w = 520 * (0.6 + 0.4 * math.min(1, e.t / 0.2)) * sc
    Streak(e, "a", ox, oy, w, 7 * sc, a, 1, 1, 1)
    Streak(e, "b", ox, oy, w, 30 * sc, a, lr, lg, lb)
    StarAt(e, "s", ox, oy, 110 * (1 + 0.2 * math.sin(e.t * 20)) * a * sc, a)
    for i, gh in ipairs({ { 60, 10, 0.5 }, { 110, 18, 0.3 }, { -80, 7, 0.4 } }) do
      Place(T(e, "g" .. i, front, MEDIA .. "Wave", "ADD"), ox + gh[1] * sc, oy - gh[1] * 0.15 * sc, gh[2] * 2 * sc, gh[2] * 2 * sc, a * gh[3] * 2, lr, lg, lb)
    end
  end)
  Glints(x, y, 4, 60, s)
end

-- Rare: the aurora's rippling ribbon of light, three bands rising off an arch over the item
local AURORA_STRIPS = 30
function A.aurora(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  local cols = { { 0.5, 1, 0.83 }, { lr, lg, lb }, { 0.78, 0.66, 1 } }
  Effect(view, 1.8, function(e)
    local ox, oy, sc = Origin(e)
    local u = e.t / e.life
    local a = u < 0.15 and u / 0.15 or (1 - (u - 0.15) / 0.85) ^ 1.2
    local rise = math.max(0, u - 0.4) * 70 * sc
    for band = 1, 3 do
      local amp, off, hgt, R0 = (12 + band * 6) * sc, band * 1.7, (46 + band * 16) * sc, (150 + band * 14) * sc
      local c = cols[band]
      for i = 0, AURORA_STRIPS do
        local k = i / AURORA_STRIPS
        local w = math.sin(math.pi * k)
        local an = math.pi * (0.95 - 0.9 * k) -- left to right, over the top
        local px = ox + math.cos(an) * R0
        local py = oy - 30 * sc + math.sin(an) * R0 * 0.75 + rise + math.sin(i * 0.37 + e.t * 3.2 + off) * amp * w
        local t = T(e, band .. ":" .. i, back, MEDIA .. "Pillar", "ADD")
        Place(t, px, py - 6 * sc, 17 * sc, hgt * w + 6 * sc, a * w * (0.5 - band * 0.09) * (0.75 + 0.25 * math.sin(i * 0.9 + e.t * 6)), c[1], c[2], c[3], "BOTTOM")
      end
    end
  end)
  for i = 1, 16 do
    local an = math.pi * Rnd(0.05, 0.95)
    local c = i % 2 == 0 and cols[1] or cols[2]
    Particle(front, MEDIA .. "Mote", x + math.cos(an) * 150 * s, y - 30 * s + math.sin(an) * 110 * s, Rnd(-8, 8) * s, Rnd(20, 50) * s,
      Rnd(1.2, 1.8), Rnd(3, 4.5) * s, c[1], c[2], c[3], { delay = Rnd(0, 0.6), grav = -10 * s, drag = 0.6, fade = "sin" })
  end
end

-- Epic: the blast after the implosion (and the galaxy that swirls up behind the item after it)
local function EpicBlast(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  Burst(x, y, 34, 520, s, lr, lg, lb, { grav = 60, drag = 2.4, life = 1.1, size = 1.3 })
  Ring(view, 1, 1, 1, 70, 0.3, 0, 1)
  Ring(view, lr, lg, lb, 140, 0.7)
  Ring(view, 1, 1, 1, 190, 0.8, 0.2, 0.6)
  Glints(x, y, 12, 105, s)
  Shake(view, 0.25)
end
local function Galaxy(view, r, g, b, delay)
  local lr, lg, lb = Light(r, g, b)
  local stars = {}
  for i = 1, 80 do stars[i] = { a = math.random() * 6.28, r = Rnd(20, 140), z = Rnd(3, 6), white = i % 4 == 0 } end
  Effect(view, 2.2, function(e, dt)
    local ox, oy, sc = Origin(e)
    local u = e.t / e.life
    local grow = math.min(1, e.t / 0.5)
    local a = math.min(1, e.t * 3) * (1 - u) * 0.95
    for i, st in ipairs(stars) do
      st.a = st.a + dt * (2.6 / (st.r / 40 + 0.4))
      local t = T(e, i, back, MEDIA .. "Mote", "ADD")
      Place(t, ox + math.cos(st.a) * st.r * grow * sc, oy - 20 * sc + math.sin(st.a) * st.r * 0.45 * grow * sc, st.z * sc, st.z * sc, a,
        st.white and 1 or lr, st.white and 1 or lg, st.white and 1 or lb)
    end
  end, delay)
end

-- Epic: motes rush into the item from all around, then blast out; the galaxy swirls up behind it
function A.implode(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  local motes = {}
  for i = 1, 26 do
    local an, d = math.random() * 6.28, Rnd(150, 240)
    motes[i] = { math.cos(an) * d, math.sin(an) * d * 0.8 }
  end
  Effect(view, 0.45, function(e)
    local ox, oy, sc = Origin(e)
    local u = math.min(1, e.t / 0.45)
    local k = 1 - u * u * u -- distance left: they speed up as they fall in
    for i, m in ipairs(motes) do
      local sz = (5 + 3 * (1 - k)) * sc
      Place(T(e, i, front, MEDIA .. "Mote", "ADD"), ox + m[1] * k * sc, oy + m[2] * k * sc, sz, sz, math.min(1, e.t * 4), lr, lg, lb)
    end
    if e.t >= e.life and not e.blasted then -- (its last frame runs at exactly life)
      e.blasted = true
      EpicBlast(view, ox, oy, sc, r, g, b)
      Galaxy(view, r, g, b, 0.25)
    end
  end)
end

-- Epic: a corona of light; a dark disc slides in front of it; it flares; then it bursts
function A.eclipse(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  Effect(view, 1.0, function(e)
    local ox, oy, sc = Origin(e)
    local grow = math.min(1, e.t / 0.3)
    local cov = math.min(1, math.max(0, (e.t - 0.15) / 0.4))
    local rad = 54 * grow * sc
    local fadeC = 1 - math.max(0, (e.t - 0.8) / 0.2)
    Place(T(e, "c1", back, MEDIA .. "Glow", "ADD", 0), ox, oy, rad * 4.4, rad * 4.4, 0.9 * fadeC, r, g, b)
    Place(T(e, "c2", back, MEDIA .. "Glow", "ADD", 1), ox, oy, rad * 2.8, rad * 2.8, 0.9 * fadeC, lr, lg, lb)
    Place(T(e, "c3", back, MEDIA .. "Glow", "ADD", 2), ox, oy, rad * 2.0, rad * 2.0, 0.8 * fadeC, 1, 1, 1)
    local disc = T(e, "d", back, MEDIA .. "Disc", nil, 5)
    Place(disc, ox + (1 - cov) * 70 * sc, oy, rad * 1.95, rad * 1.95, 0.92 * (1 - math.max(0, (e.t - 0.75) / 0.25)), 0.04, 0.02, 0.06)
    local flare = math.max(0, math.min(1, (e.t - 0.45) / 0.15)) * (1 - math.max(0, (e.t - 0.7) / 0.3))
    Streak(e, "f1", ox, oy, 640 * sc, 6 * sc, flare, 1, 1, 1)
    Streak(e, "f2", ox, oy, 560 * sc, 32 * sc, flare * 0.9, lr, lg, lb)
    StarAt(e, "s", ox, oy, 140 * flare * sc, flare)
    if e.t >= 0.72 and not e.burst then
      e.burst = true
      Burst(ox, oy, 40, 540, sc, lr, lg, lb, { grav = 60, drag = 2.4, life = 1.2, size = 1.3 })
      Glints(ox, oy, 12, 110, sc)
      Ring(view, lr, lg, lb, 150, 0.7)
      Ring(view, 1, 1, 1, 210, 0.8, 0.15, 0.6)
      Shake(view, 0.25)
    end
  end)
end

-- Epic: purple stars streak down at angles onto the item one after another, each bursting as it hits,
-- the last one with the big burst
function A.starfall(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  local N = 6
  for i = 1, N do
    local last = i == N
    local side = i % 2 == 0 and 1 or -1
    local dx, dy, dur = side * Rnd(140, 260), Rnd(260, 340), 0.32
    Effect(view, dur, function(e)
      local ox, oy, sc = Origin(e)
      local u = math.min(1, e.t / dur)
      local k = 1 - u * u -- distance left
      local hx, hy = ox + dx * k * sc, oy + dy * k * sc
      StarAt(e, "h", hx, hy, (last and 56 or 34) * sc, 1, e.t * 3)
      for j = 1, 6 do -- its trail: fading motes behind it along its path
        local kj = math.min(1, k + j * 0.06)
        local sz = ((last and 9 or 6) - j * 0.8) * sc
        Place(T(e, "t" .. j, front, MEDIA .. "Mote", "ADD"), ox + dx * kj * sc, oy + dy * kj * sc, sz, sz, 1 - j / 7, lr, lg, lb)
      end
      if e.t >= dur and not e.hit then -- (its last frame runs at exactly dur)
        e.hit = true
        if last then
          Burst(ox, oy, 40, 540, sc, lr, lg, lb, { grav = 60, drag = 2.4, life = 1.2, size = 1.3 })
          Glints(ox, oy, 12, 110, sc)
          Ring(view, lr, lg, lb, 150, 0.7)
          Ring(view, 1, 1, 1, 210, 0.8, 0.15, 0.6)
          Shake(view, 0.25)
        else
          Ring(view, lr, lg, lb, 60 + i * 10, 0.4)
          Burst(ox, oy, 8, 260, sc, lr, lg, lb, { grav = 80, life = 0.8 })
          Glints(ox, oy, 1, 30, sc)
        end
      end
    end, (i - 1) * 0.16)
  end
end

-- Legendary (after the comet): a white flash, a screen-wide golden flare, three shockwaves, a blast of
-- gold sparks, then a golden halo that lingers with embers rising
local GOLD = { { 1, 0.82, 0 }, { 1, 0.69, 0.25 }, { 1, 0.95, 0.75 } }
function A.supernova(view, x, y, s, r, g, b)
  Shake(view, 0.3)
  Effect(view, 0.4, function(e) -- the flash
    local t = T(e, "w", front, WHITE, nil, -8)
    t:ClearAllPoints()
    t:SetAllPoints(UIParent)
    t:SetVertexColor(1, 1, 1, 1)
    t:SetAlpha(0.45 * (1 - e.t / e.life))
  end)
  Effect(view, 1.4, function(e) -- the flare
    local ox, oy, sc = Origin(e)
    local u = e.t / e.life
    local a = u < 0.08 and u / 0.08 or (1 - (u - 0.08) / 0.92) ^ 1.4
    Streak(e, "a", ox, oy, 1100 * sc, 8 * sc, a, 1, 1, 1)
    Streak(e, "b", ox, oy, 900 * sc, 44 * sc, a * 0.8, 1, 0.75, 0.38)
    Streak(e, "c", ox, oy, 500 * sc, 120 * sc, a * 0.3, r, g, b)
    StarAt(e, "s", ox, oy, 190 * a * sc, a)
  end)
  Ring(view, 1, 1, 1, 120, 0.35)
  Ring(view, 1, 0.82, 0, 220, 0.8, 0.08)
  Ring(view, r, g, b, 320, 1, 0.2, 0.7)
  for _ = 1, 3 do Burst(x, y, 24, 640, s, 1, 0.82, 0, { grav = 120, drag = 2, life = 1.4, size = 1.4, colors = GOLD }) end
  Glints(x, y, 14, 130, s)
  Effect(view, 3.2, function(e, dt) -- the halo that lingers, embers rising off it
    local ox, oy, sc = Origin(e)
    local a = math.min(1, e.t / 0.4) * (1 - math.max(0, (e.t - 2.4) / 0.8))
    local rad = (92 + 6 * math.sin(e.t * 2)) * sc
    Place(T(e, "h", back, MEDIA .. "Wave", "ADD"), ox, oy, rad * 2, rad * 2, a, 1, 0.82, 0.3)
    e.ember = (e.ember or 0) - dt
    if e.ember <= 0 and a > 0.2 then
      e.ember = 0.06
      local c = GOLD[math.random(3)]
      Particle(front, MEDIA .. "Mote", ox + Rnd(-80, 80) * sc, oy - Rnd(20, 60) * sc, Rnd(-10, 10) * sc, Rnd(40, 80) * sc,
        Rnd(1.2, 2), Rnd(3, 5) * sc, c[1], c[2], c[3], { grav = -15 * sc, drag = 0.5, fade = "sin" })
    end
  end, 0.4)
end

-- How see-through the popup's item is (an arrival can fade it in): the model fades by itself (3D
-- models don't follow their frame's alpha), the icon card with the stage
local function ItemAlpha(view, a)
  view.stage:SetAlpha(a)
  if view.model and view.model.SetModelAlpha then view.model:SetModelAlpha(a) end
end
ns.ItemAlpha = ItemAlpha

-- Rare: reverse disintegration: specks of light pour in from all around and stay lit where they land,
-- so a glowing shape of the item builds up from the bottom behind a fine scanline; the item itself is
-- only a faint ghost until the line reaches the top, then it snaps in with a flash and the specks
-- scatter away (a 3D model can't be revealed slice by slice, so the specks do the building)
local DIS_FROM, DIS_T, DIS_FLY, DIS_GHOST = 0.2, 0.75, 0.42, 0.12
function A.disint(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  ItemAlpha(view, 0)
  local stage = view.stage
  local W, H = stage:GetWidth() * 0.5, stage:GetHeight() * 0.9
  local specks = {}
  for i = 1, 80 do
    local fy = (i - 1) / 79 -- spread evenly up the item, so the shape builds all the way
    specks[i] = { tx = (math.random() - 0.5) * W * 0.55, ty = (fy - 0.5) * H, an = math.random() * 6.28, d = Rnd(120, 240),
      sw = Rnd(-1.6, 1.6), land = DIS_FROM + fy * DIS_T + Rnd(-0.03, 0.03), out = math.random() * 6.28 }
  end
  local snapAt = DIS_FROM + DIS_T
  Effect(view, snapAt + 0.6, function(e)
    local ox, oy, sc = Origin(e)
    local since = e.t - snapAt -- after the snap (< 0 before it)
    for i, p in ipairs(specks) do
      local t = T(e, i, front, MEDIA .. "Mote", "ADD")
      local white = i % 4 == 0
      local cr, cg, cb = white and 1 or lr, white and 1 or lg, white and 1 or lb
      local u = (e.t - (p.land - DIS_FLY)) / DIS_FLY
      if u <= 0 then
        t:SetAlpha(0)
      elseif u < 1 then -- flying in, speeding up and curving
        local k = (1 - u) ^ 2
        local an = p.an + p.sw * k
        Place(t, ox + (p.tx + math.cos(an) * p.d * k) * sc, oy + (p.ty + math.sin(an) * p.d * k * 0.8) * sc, 4 * sc, 4 * sc,
          math.min(1, u * 4), cr, cg, cb)
      elseif since < 0 then -- landed: it stays lit, part of the glowing shape
        Place(t, ox + p.tx * sc, oy + p.ty * sc, 4.5 * sc, 4.5 * sc, 0.8, cr, cg, cb)
      else -- the snap: it scatters away and fades
        local v = since / 0.4
        Place(t, ox + (p.tx + math.cos(p.out) * 60 * v) * sc, oy + (p.ty + math.sin(p.out) * 60 * v) * sc, 4 * sc, 4 * sc,
          math.max(0, 1 - v), cr, cg, cb)
      end
    end
    local rev = math.min(1, math.max(0, (e.t - DIS_FROM) / DIS_T))
    local line = rev > 0 and rev < 1
    local ly = oy + (rev - 0.5) * H * sc
    Place(T(e, "l1", front, MEDIA .. "Glow", "ADD"), ox, ly, W * 1.3 * sc, 3 * sc, line and 1 or 0, 1, 1, 1)
    Place(T(e, "l2", front, MEDIA .. "Glow", "ADD"), ox, ly, W * 1.1 * sc, 10 * sc, line and 0.6 or 0, lr, lg, lb)
    if view.stage == stage then -- a faint ghost while it builds, then it snaps in
      ItemAlpha(view, since < 0 and DIS_GHOST * rev or DIS_GHOST + (1 - DIS_GHOST) * math.min(1, since / 0.1))
    end
    local fl = since >= 0 and math.max(0, 1 - since / 0.3) or 0 -- the flash as it snaps in
    Place(T(e, "f", front, MEDIA .. "Glow", "ADD"), ox, oy, (120 + 80 * (1 - fl)) * sc, (160 + 80 * (1 - fl)) * sc, fl * 0.8, 1, 1, 1)
    if since >= 0 and not e.done then
      e.done = true
      Glints(ox, oy, 4, 50, sc)
      Ring(view, lr, lg, lb, 110, 0.5)
    end
    if e.t >= e.life then ItemAlpha(view, 1) end
  end)
end

-- Rare: the item rises out of a glowing pool of light: ripples spread across it, the item's
-- reflection shimmers in it, droplets fall back in
function A.pool(view, x, y, s, r, g, b)
  local lr, lg, lb = Light(r, g, b)
  local stage = view.stage
  ItemAlpha(view, 0.2)
  Effect(view, 2.2, function(e)
    local ox, oy, sc = Origin(e)
    local py = oy - stage:GetHeight() * 0.5 * sc - 4 * sc -- the pool, at the item's foot
    local a = math.min(1, e.t / 0.2) * (1 - math.max(0, (e.t - 1.6) / 0.6))
    if view.stage == stage then ItemAlpha(view, 0.2 + 0.8 * math.min(1, e.t / 0.55)) end
    Place(T(e, "p", back, MEDIA .. "Glow", "ADD"), ox, py, 150 * sc, 30 * sc, a * 0.7, lr, lg, lb) -- (kept small: at the item's foot, clear of the text and the next popup)
    Place(T(e, "pw", back, MEDIA .. "Glow", "ADD", 1), ox, py, 48 * sc, 10 * sc, a * 0.45, 1, 1, 1)
    for k = 1, 3 do -- ripples spreading over it, one after another
      local rt = ((e.t + (k - 1) * 0.45) % 1.35) / 1.35
      local rr = (14 + 66 * rt) * sc
      Place(T(e, "r" .. k, front, MEDIA .. "Wave", "ADD"), ox, py, rr * 2, rr * 0.4, a * (1 - rt) * 0.7, lr, lg, lb)
    end
    local refl = T(e, "f", back, MEDIA .. "Pillar", "ADD", 2) -- the reflection: the pillar upside down
    refl:SetTexCoord(0, 1, 1, 0)
    Place(refl, ox + math.sin(e.t * 6) * 2 * sc, py, 20 * sc, 30 * sc, a * 0.3 * (0.8 + 0.2 * math.sin(e.t * 9)), lr, lg, lb, "TOP")
    if e.t >= e.life then ItemAlpha(view, 1) end
  end)
  Burst(x, y - stage:GetHeight() * 0.5 * s, 14, 300, s, lr, lg, lb, { up = true, fan = 0.45, grav = 700, drag = 0.8, life = 1.2,
    colors = { { 1, 1, 1 }, { lr, lg, lb } } })
end

-- Legendary (after the comet): golden meteors keep raining down around the item, each landing with a
-- small burst and ring; the last lands on the item with a flash
function A.meteors(view, x, y, s, r, g, b)
  Shake(view, 0.25)
  Ring(view, 1, 0.82, 0, 200, 0.7)
  Burst(x, y, 30, 480, s, 1, 0.82, 0, { grav = 120, drag = 2, life = 1.1, colors = GOLD })
  local N = 8
  for i = 1, N do
    local last = i == N
    local dx, dy = last and 0 or Rnd(-200, 200), last and 0 or Rnd(-80, 60) -- where it lands, from the item
    local fx, fy, dur = Rnd(80, 160), Rnd(380, 460), 0.42                     -- where it falls from, from there
    Effect(view, dur, function(e)
      local ox, oy, sc = Origin(e)
      local u = math.min(1, e.t / dur)
      local k = 1 - u * u
      local tx, ty = ox + dx * sc, oy + dy * sc
      local hx, hy = tx + fx * k * sc, ty + fy * k * sc
      local hs = (last and 52 or 28) * sc
      Place(T(e, "h", front, MEDIA .. "Glow", "ADD"), hx, hy, hs, hs, 1, 1, 0.92, 0.7)
      StarAt(e, "s", hx, hy, hs * 0.9, 1, e.t * 4)
      for j = 1, 7 do -- its trail
        local kj = math.min(1, k + j * 0.05)
        local sz = ((last and 10 or 7) - j * 0.8) * sc
        Place(T(e, "t" .. j, front, MEDIA .. "Mote", "ADD"), tx + fx * kj * sc, ty + fy * kj * sc, sz, sz, 1 - j / 8, 1, 0.69 + j * 0.03, 0.25)
      end
      if e.t >= dur and not e.hit then
        e.hit = true
        Ring(view, 1, 0.82, 0, last and 220 or 70, last and 0.8 or 0.45)
        Burst(tx, ty, last and 40 or 12, last and 520 or 260, sc, 1, 0.82, 0, { up = true, grav = 500, life = 1, colors = GOLD })
        if last then
          Shake(view, 0.3)
          Glints(ox, oy, 12, 120, sc)
          Effect(view, 0.35, function(f) -- a flash as the last one hits
            local t = T(f, "w", front, WHITE, nil, -8)
            t:ClearAllPoints(); t:SetAllPoints(UIParent); t:SetVertexColor(1, 1, 1, 1)
            t:SetAlpha(0.4 * (1 - f.t / f.life))
          end)
        end
      end
    end, 0.25 + (i - 1) * 0.14)
  end
end

-- Legendary (after the comet): a huge ring of golden light stamps down behind the item (marks around
-- it, gems at the quarters), spins as it settles, then bursts into gold dust
function A.seal(view, x, y, s, r, g, b)
  Shake(view, 0.25)
  Ring(view, 1, 1, 1, 160, 0.35, 0.18)
  Burst(x, y, 30, 420, s, 1, 0.82, 0, { grav = 60, drag = 2.2, life = 1, colors = GOLD, delay = 0.18 })
  Effect(view, 1.9, function(e)
    local ox, oy, sc = Origin(e)
    local slam = math.min(1, e.t / 0.18)
    local scale = 2.6 - 1.6 * (1 - (1 - slam) ^ 3)
    local a = e.t < 1.3 and math.min(1, e.t / 0.08) or math.max(0, 1 - (e.t - 1.3) / 0.25)
    local rr = 110 * scale * sc
    local spin = e.t * (1.6 - math.min(1, e.t) * 1.2)
    Place(T(e, "g", back, MEDIA .. "Glow", "ADD"), ox, oy, rr * 2.6, rr * 2.6, a * 0.45, 1, 0.75, 0.3)
    Place(T(e, "r1", back, MEDIA .. "Wave", "ADD", 1), ox, oy, rr * 2, rr * 2, a, 1, 0.83, 0.42)
    Place(T(e, "r2", back, MEDIA .. "Wave", "ADD", 1), ox, oy, rr * 1.68, rr * 1.68, a * 0.8, 1, 0.83, 0.42)
    for i = 1, 24 do -- marks between the two rings; gems (stars) at the quarters
      local an = i / 24 * 6.28 + spin
      if i % 6 == 0 then
        local t = T(e, "m" .. i, back, STAR, "ADD", 2)
        Place(t, ox + math.cos(an) * rr, oy + math.sin(an) * rr, 30 * sc, 30 * sc, a, 1, 0.95, 0.75)
        t:SetRotation(an)
      else
        Place(T(e, "m" .. i, back, MEDIA .. "Mote", "ADD", 2), ox + math.cos(an) * rr * 0.92, oy + math.sin(an) * rr * 0.92, 5 * sc, 5 * sc, a, 1, 0.83, 0.42)
      end
    end
    if e.t >= 1.3 and not e.dust then -- it bursts into gold dust
      e.dust = true
      for _ = 1, 60 do
        local an = math.random() * 6.28
        local c = GOLD[math.random(3)]
        Particle(front, MEDIA .. "Mote", ox + math.cos(an) * 110 * sc, oy + math.sin(an) * 110 * sc, math.cos(an) * Rnd(60, 200) * sc,
          math.sin(an) * Rnd(60, 200) * sc + 40 * sc, Rnd(0.8, 1.4), Rnd(3, 5) * sc, c[1], c[2], c[3], { grav = 80 * sc, drag = 1.6 })
      end
      Ring(view, 1, 0.82, 0, 200, 0.6)
      Glints(ox, oy, 8, 120, sc)
    end
  end)
end

---------------------------------------------------------------------------
-- Driving it
---------------------------------------------------------------------------
local function Update(_, dt)
  dt = math.min(dt, 0.05)
  for i = #effects, 1, -1 do
    local e = effects[i]
    e.t = e.t + dt
    local gone = e.view and (not e.view:IsShown() or e.view.arrivalGen ~= e.gen) -- closed, or a new item
    if e.t >= e.life or gone then
      -- its last frame still runs (a blast at the very end must not be skipped at a low frame rate)
      if not gone and e.t - dt < e.life then e.t = e.life; e.run(e, dt) end
      EndEffect(e)
      table.remove(effects, i)
    elseif e.t >= 0 then
      e.run(e, dt)
    end
  end
  UpdateParts(dt)
  if not effects[1] and not parts[1] then driver:SetScript("OnUpdate", nil) end
end

-- Play the arrival chosen for this quality on a popup's view; returns false for "simple" (View.lua
-- then plays its own)
function ns.PlayArrival(view, q)
  local key = ns.ArrivalFor(q)
  local fn = A[key]
  if not fn then return false end
  Layers(view:GetFrameStrata())
  local st = view.stage
  local x, y = st:GetCenter()
  if not x then return false end
  local k = st:GetEffectiveScale() / UIParent:GetEffectiveScale()
  local r, g, b = ns.QualityColor(q)
  fn(view, x * k, y * k, k, r, g, b)
  driver:SetScript("OnUpdate", Update)
  return true
end

---------------------------------------------------------------------------
-- The Arrivals settings page: a choice per rarity and a Test button for each
---------------------------------------------------------------------------
local sub
local TIERS = {
  { 2, "|cff1eff00Uncommon|r", "uncommon" }, { 3, "|cff0070ddRare|r", "rare" },
  { 4, "|cffa335eeEpic|r", "epic" }, { 5, "|cffff8000Legendary|r", "legendary" },
}
local TIPS = {
  fireflies = "A swarm of fireflies bursts out, gathers into a ring around the item, then drifts up and away, blinking.",
  emerald = "A soft green light streak and star flare across the item, with pollen drifting out.",
  geyser = "A column of light shoots up through the item, thins and dissolves upward; a mist ring at its base.",
  sapphire = "A big horizontal lens flare across the item with a bright star and small ghost rings.",
  aurora = "Ribbons of northern lights ripple up off an arch over the item.",
  implode = "Motes rush into the item, blast out with a shake, then a galaxy swirls up behind it.",
  eclipse = "A dark disc slides in front of a corona of light; it flares across the screen, then bursts.",
  starfall = "Stars streak down at angles onto the item one after another, each bursting as it hits.",
  supernova = "After the comet: a flash, a screen-wide golden flare, three shockwaves, a blast of gold and a lingering halo.",
  disint = "Specks of light swirl in from all around onto the item, which appears as a glowing scanline sweeps up it.",
  pool = "The item rises out of a glowing pool of light: ripples spread, its reflection shimmers, droplets fall back in.",
  meteors = "After the comet: golden meteors rain down around the item, each with a small burst; the last hits the item with a flash.",
  seal = "After the comet: a huge ring of golden light stamps down behind the item, spins as it settles, then bursts into gold dust.",
  simple = "The quieter arrival: a burst of sparks, with star glints from Epic and shockwaves for Legendary.",
}
local function Create()
  local N = ns.Native
  local cat, layout = N.Page("Arrivals", ns.settingsCategory)
  sub = cat
  for _, tier in ipairs(TIERS) do
    local q, label, word = tier[1], tier[2], tier[3]
    N.Header(layout, label .. " popups")
    local opts, tipList = {}, {}
    for i, o in ipairs(ns.ARRIVALS[q]) do
      opts[i] = { o[1], o[2] .. (i == 1 and " (default)" or ""), TIPS[o[1]] }
      tipList[#tipList + 1] = o[2] .. ": " .. TIPS[o[1]]
    end
    N.Choice(cat, "arrival" .. q, "Arrival", opts, ns.ARRIVALS[q][1][1],
      "How " .. (q == 2 and "an Uncommon" or q == 5 and "a Legendary" or q == 4 and "an Epic" or "a Rare") ..
      " popup arrives.\n\n" .. table.concat(tipList, "\n"))
    N.Button(layout, "See it", "Test", function() ns.RunAction("arrivaltest", tostring(q)) end,
      "Shows " .. word .. " test popup with the arrival picked above.")
  end
end
ns.OnInit(function() if not sub then Create() end end)

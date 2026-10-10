-- Generates Dopamine Loot's popup art into DopamineLoot/Media/ as uncompressed 32-bit TGAs: white with
-- alpha, tinted in game with SetVertexColor (the item's quality color). Original, deterministic art.
-- Run with the language server's Lua (wow-preflight finds it):
--   lua-language-server.exe tools/gen_textures.lua      (writes into DopamineLoot/Media/)
--   Glow      soft round light (style A "Relic")
--   Halo      clear center, a ring fading both ways, thin bright rim (style C "Halo lens")
--   Banner    a band fading to nothing at both ends, bright edge lines (style D "Banner")
--   Cone, Disc   beam v2: a light cone and the glowing floor disc
--   Mote      a small soft spark (rising motes, sparkle bursts)
--   Lens, Sweep  halo v2: the dark lens inside the ring and the bright arc that sweeps round it
--   Wave      a thin glowing ring that expands (legendary shockwave)
--   Rays      soft light spokes from the center (epic arrival)
local root = (arg and arg[0] or ""):match("^(.-)tools[/\\]") or ""
local DIR = root .. "DopamineLoot/Media/"

local function Canvas(w, h) return { w = w, h = h, a = {} } end

-- fn(u, v) -> alpha, with u, v in 0..1 and v = 0 at the BOTTOM
local function Fill(c, fn)
  for y = 0, c.h - 1 do
    for x = 0, c.w - 1 do
      local u, v = (x + 0.5) / c.w, 1 - (y + 0.5) / c.h
      c.a[y * c.w + x] = math.max(0, math.min(1, fn(u, v)))
    end
  end
  return c
end

local function Write(name, c)
  local f = assert(io.open(DIR .. name .. ".tga", "wb"))
  f:write(string.char(0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    c.w % 256, math.floor(c.w / 256), c.h % 256, math.floor(c.h / 256), 32, 0x28)) -- top-left origin
  for y = 0, c.h - 1 do
    local row = {}
    for x = 0, c.w - 1 do
      row[x + 1] = string.char(255, 255, 255, math.floor(c.a[y * c.w + x] * 255 + 0.5))
    end
    f:write(table.concat(row))
  end
  f:close()
  print(("wrote %s%s.tga (%dx%d)"):format(DIR, name, c.w, c.h))
end

local function Bump(x, center, width) return math.exp(-((x - center) / width) ^ 2) end
local function R(u, v) return math.sqrt((u - 0.5) ^ 2 + (v - 0.5) ^ 2) * 2 end -- 0 center, 1 edge

Write("Glow", Fill(Canvas(128, 128), function(u, v)
  local r = R(u, v)
  return r >= 1 and 0 or 0.9 * (1 - r) ^ 1.3
end))

Write("Halo", Fill(Canvas(256, 256), function(u, v)
  local r = R(u, v)
  local band = 0.42 * Bump(r, 0.76, 0.1)    -- the ring, fading inward and outward (soft, see-through)
  local rim = 0.85 * Bump(r, 0.86, 0.008)   -- thin bright rim
  local haze = 0.12 * Bump(r, 0.86, 0.16)   -- a faint haze around the rim
  return r > 0.99 and 0 or band + rim + haze
end))



-- Beam v2: a cone of light, wide and bright at the floor, narrowing and fading as it rises
Write("Cone", Fill(Canvas(128, 256), function(u, v)
  local half = 0.46 - 0.3 * v                     -- half-width shrinks going up
  local x = math.abs(u - 0.5) / half
  local across = x >= 1 and 0 or (1 - x * x) ^ 1.5 -- soft sides
  local core = 0.6 * Bump(u, 0.5, 0.05 + 0.04 * (1 - v))
  local foot = math.min(1, v / 0.14) ^ 1.5           -- fades in from the bottom edge: no hard line
  return (0.75 * across + core * across) * (1 - v) ^ 1.3 * foot
end))

-- Beam v2: the glowing floor disc (squashed into an ellipse in game)
Write("Disc", Fill(Canvas(128, 128), function(u, v)
  local r = R(u, v)
  return r >= 1 and 0 or 0.9 * Bump(r, 0, 0.32) + 0.45 * (1 - r) ^ 1.5
end))

-- A small soft spark (rising motes, sparkle bursts)
Write("Mote", Fill(Canvas(16, 16), function(u, v)
  local r = R(u, v)
  return r >= 1 and 0 or Bump(r, 0, 0.35) + 0.3 * (1 - r)
end))

-- Halo v2: a dark lens inside the ring so the item stands out (tinted almost black in game)
Write("Lens", Fill(Canvas(128, 128), function(u, v)
  local r = R(u, v)
  if r < 0.66 then return 0.85 end
  return r > 0.8 and 0 or 0.85 * (0.8 - r) / 0.14
end))

-- Halo v2: a bright arc riding the rim, head at the top, tail fading behind it; turned in game
Write("Sweep", Fill(Canvas(256, 256), function(u, v)
  local r = R(u, v)
  local ang = math.atan(u - 0.5, v - 0.5)          -- 0 at the top, growing clockwise
  if ang < 0 then ang = ang + 2 * math.pi end
  local tail = 1.1                                 -- radians of tail
  local along = ang > tail and 0 or (1 - ang / tail) ^ 2
  return along * (Bump(r, 0.86, 0.014) + 0.35 * Bump(r, 0.86, 0.05))
end))

Write("Banner", Fill(Canvas(256, 64), function(u, v)
  local ends = math.sin(math.pi * u) ^ 1.6           -- fades to nothing at both ends
  local body = 0.8 * (v > 0.12 and v < 0.88 and 1 or 0)
  local lines = Bump(v, 0.1, 0.025) + Bump(v, 0.9, 0.025)
  return ends * (body + lines)
end))

Write("Wave", Fill(Canvas(128, 128), function(u, v)
  local r = R(u, v)
  return r >= 1 and 0 or Bump(r, 0.88, 0.03) + 0.35 * Bump(r, 0.85, 0.1)
end))

Write("Rays", Fill(Canvas(256, 256), function(u, v)
  local r = R(u, v)
  if r >= 1 then return 0 end
  local ang = math.atan(u - 0.5, v - 0.5)
  local spokes = math.max(0, math.cos(6 * ang)) ^ 10 + 0.5 * math.max(0, math.cos(6 * ang + math.pi)) ^ 16
  return spokes * (1 - r) ^ 0.9 * math.min(1, r / 0.12)
end))

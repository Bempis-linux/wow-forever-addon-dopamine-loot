-- Generates Dopamine Loot's popup art into DopamineLoot/Media/ as uncompressed 32-bit TGAs: white with
-- alpha, tinted in game with SetVertexColor (the item's quality color). Original, deterministic art.
-- Run with the language server's Lua (wow-preflight finds it):
--   lua-language-server.exe tools/gen_textures.lua      (writes into DopamineLoot/Media/)
--   Glow      soft round light (style A "Relic")
--   Banner    a band fading to nothing at both ends, bright edge lines (style D "Banner")
--   Cone, Disc   beam v2: a light cone and the glowing floor disc
--   Mote      a small soft spark (rising motes, sparkle bursts)
--   Wave      a thin glowing ring that expands (legendary shockwave)
--   Diamond, DiamondEdge, Shine   banner v2: the emblem behind the item and the shine sweep
--   Pillar, Vignette   loot rain: the light pillar over resting Rare+, the Epic screen-edge pulse
--   Chest*, Pouch*, Rays   deprecated chest show (written to deprecated/chest-show/Media/)
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


-- Banner v2: a diamond emblem behind the item (a dark fill and a bright edge, tinted separately)
local function D(u, v) return math.abs(u - 0.5) + math.abs(v - 0.5) end -- 0.5 = the diamond's edge
Write("Diamond", Fill(Canvas(128, 128), function(u, v)
  local d = D(u, v)
  return d < 0.44 and 0.92 or (d < 0.47 and 0.92 * (0.47 - d) / 0.03 or 0)
end))
Write("DiamondEdge", Fill(Canvas(128, 128), function(u, v)
  local d = D(u, v)
  return Bump(d, 0.455, 0.007) + 0.3 * Bump(d, 0.455, 0.03)
end))

-- Banner v2: a soft streak of light, drawn tilted (square, so it needs no rotation in game)
local SHINE_TILT = 0.35
Write("Shine", Fill(Canvas(128, 128), function(u, v)
  local du, dv = u - 0.5, v - 0.5
  local c, s = math.cos(SHINE_TILT), math.sin(SHINE_TILT)
  local across, along = du * c - dv * s, du * s + dv * c
  return 0.8 * Bump(across, 0, 0.07) * math.cos(math.pi * math.min(0.5, math.abs(along) * 1.1))
end))

-- Loot rain: a pillar of light over resting Rare+ (bright at its foot, fading up; tinted in game)
Write("Pillar", Fill(Canvas(64, 256), function(u, v)
  return 0.7 * Bump(u, 0.5, 0.2) * (1 - v) ^ 1.4 + 0.6 * Bump(u, 0.5, 0.05) * (1 - v) ^ 0.8
end))

-- Loot rain: the screen-edge pulse when an Epic+ lands (clear middle, soft glow at the edges)
Write("Vignette", Fill(Canvas(256, 256), function(u, v)
  local t = math.max(0, math.min(1, (R(u, v) - 0.55) / 0.75))
  return t * t * (3 - 2 * t)
end))

-- Deprecated (the chest show was set aside 2026-10-14): these go to deprecated/chest-show/Media/,
-- not into the addon. See deprecated/chest-show/README.md.
DIR = root .. "deprecated/chest-show/Media/"

-- The treasure chest and the loot pouch (chest show). Every layer is a 128 x 128 square sharing the
-- same center, so in game they stack exactly, tint separately (wood, iron, gold) and can all turn
-- together. The chest's seam (where the lid meets the body) is at v = 0.6; the pouch's mouth at 0.72.
local function Smooth(e0, e1, x) local t = math.max(0, math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t) end
local AA = 0.008 -- soft edge, about one pixel
local function InRect(u, v, x0, x1, y0, y1) -- 1 inside, soft at the edges
  return Smooth(x0 - AA, x0 + AA, u) * (1 - Smooth(x1 - AA, x1 + AA, u)) * Smooth(y0 - AA, y0 + AA, v) * (1 - Smooth(y1 - AA, y1 + AA, v))
end
local function InEllipse(u, v, cx, cy, rx, ry) -- 1 inside, soft at the edge
  local d = math.sqrt(((u - cx) / rx) ^ 2 + ((v - cy) / ry) ^ 2)
  return 1 - Smooth(1 - AA / math.min(rx, ry), 1 + AA / math.min(rx, ry), d)
end
local L, Rr, B0, SEAM, LT = 0.1, 0.9, 0.25, 0.6, 0.72 -- body left/right/bottom, seam, lid shoulder
local function Body(u, v) return InRect(u, v, L, Rr, B0, SEAM) end
local function Lid(u, v) return math.max(InRect(u, v, L, Rr, SEAM, LT), InEllipse(u, v, 0.5, LT, 0.4, 0.085) * (v >= LT - 0.01 and 1 or 0)) end
local function Rim(inside, u, v, fn) -- a band just inside a shape's edge: inside minus a shrunk copy
  return math.max(0, inside - fn(u, v))
end
local function Bands(u, v) return math.max(InRect(u, v, 0.255, 0.305, 0, 1), InRect(u, v, 0.695, 0.745, 0, 1)) end

Write("ChestBody", Fill(Canvas(128, 128), Body))
Write("ChestPlanks", Fill(Canvas(128, 128), function(u, v)
  return InRect(u, v, L, Rr, B0, SEAM) * math.max(Bump(v, B0 + 0.35 / 3, 0.006), Bump(v, B0 + 0.7 / 3, 0.006))
end))
Write("ChestBands", Fill(Canvas(128, 128), function(u, v)
  local body = Body(u, v)
  local inner = InRect(u, v, L + 0.018, Rr - 0.018, B0 + 0.018, SEAM - 0.012)
  return math.max(body * Bands(u, v), Rim(body, u, v, function() return inner end))
end))
Write("ChestLid", Fill(Canvas(128, 128), Lid))
Write("ChestLidBands", Fill(Canvas(128, 128), function(u, v)
  local lid = Lid(u, v)
  local inner = math.max(InRect(u, v, L + 0.018, Rr - 0.018, SEAM + 0.012, LT), InEllipse(u, v, 0.5, LT, 0.382, 0.067) * (v >= LT - 0.01 and 1 or 0))
  return math.max(lid * Bands(u, v), math.max(0, lid - inner))
end))
Write("ChestLock", Fill(Canvas(128, 128), function(u, v)
  local plate = InRect(u, v, 0.45, 0.55, 0.54, 0.665)
  local hole = math.max(InEllipse(u, v, 0.5, 0.615, 0.014, 0.014), InRect(u, v, 0.494, 0.506, 0.57, 0.615))
  return math.max(0, plate - hole)
end))
Write("ChestSeam", Fill(Canvas(128, 128), function(u, v)
  local across = Smooth(L - 0.02, L + 0.06, u) * (1 - Smooth(Rr - 0.06, Rr + 0.02, u))
  return across * (Bump(v, SEAM, 0.01) + 0.45 * Bump(v, SEAM, 0.045))
end))

local PCX, PCY, PRX, PRY, MOUTH = 0.5, 0.36, 0.3, 0.27, 0.72
local function Sack(u, v)
  return math.max(InEllipse(u, v, PCX, PCY, PRX, PRY), InRect(u, v, 0.43, 0.57, 0.55, MOUTH), InEllipse(u, v, 0.5, MOUTH, 0.1, 0.035))
end
Write("PouchBody", Fill(Canvas(128, 128), Sack))
Write("PouchShade", Fill(Canvas(128, 128), function(u, v) -- darker toward the bottom and the left
  return Sack(u, v) * (0.75 * (1 - Smooth(0.12, 0.5, v)) + 0.35 * (1 - Smooth(0.2, 0.55, u)))
end))
Write("PouchString", Fill(Canvas(128, 128), function(u, v) return InRect(u, v, 0.4, 0.6, 0.615, 0.645) end))
Write("PouchMouth", Fill(Canvas(128, 128), function(u, v) return InEllipse(u, v, 0.5, MOUTH, 0.085, 0.028) end))

-- Chest show: soft light spokes from the center (the rays out of a chest bursting open)
Write("Rays", Fill(Canvas(256, 256), function(u, v)
  local r = R(u, v)
  if r >= 1 then return 0 end
  local ang = math.atan(u - 0.5, v - 0.5)
  local spokes = math.max(0, math.cos(6 * ang)) ^ 10 + 0.5 * math.max(0, math.cos(6 * ang + math.pi)) ^ 16
  return spokes * (1 - r) ^ 0.9 * math.min(1, r / 0.12)
end))

-- Generates Dopamine Loot's popup art into DopamineLoot/Media/ as uncompressed 32-bit TGAs: white with
-- alpha, tinted in game with SetVertexColor (the item's quality color). Original, deterministic art.
-- Run with the language server's Lua (wow-preflight finds it):
--   lua-language-server.exe tools/gen_textures.lua      (writes into DopamineLoot/Media/)
--   Glow      soft round light (style A "Relic")
--   Halo      clear center, a ring fading both ways, thin bright rim (style C "Halo lens")
--   Ring      a thin ring (style B's floor ring, squashed into an ellipse)
--   Beam      a light column, strong at the bottom, fading up and to the sides (style B "Beam")
--   Banner    a band fading to nothing at both ends, bright edge lines (style D "Banner")
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
  local band = 0.75 * Bump(r, 0.74, 0.14)  -- the ring, fading inward and outward
  local rim = 0.95 * Bump(r, 0.86, 0.012)  -- thin bright rim
  local inner = 0.35 * Bump(r, 0.6, 0.008) -- a fainter inner line
  return r > 0.98 and 0 or band + rim + inner
end))

Write("Ring", Fill(Canvas(128, 128), function(u, v)
  local r = R(u, v)
  return Bump(r, 0.88, 0.05) + 0.4 * Bump(r, 0.88, 0.14)
end))

Write("Beam", Fill(Canvas(64, 256), function(u, v)
  local side = Bump(u, 0.5, 0.36)
  local core = 0.5 * Bump(u, 0.5, 0.06)
  return (0.8 * side + core) * math.sin(math.pi * u) * (1 - v) ^ 1.1 -- sin: no hard side edges
end))

Write("Banner", Fill(Canvas(256, 64), function(u, v)
  local ends = math.sin(math.pi * u) ^ 1.6           -- fades to nothing at both ends
  local body = 0.8 * (v > 0.12 and v < 0.88 and 1 or 0)
  local lines = Bump(v, 0.1, 0.025) + Bump(v, 0.9, 0.025)
  return ends * (body + lines)
end))

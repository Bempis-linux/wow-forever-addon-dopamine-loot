-- Offline test for Dopamine Loot's loot rain physics and ordering (no game needed).
-- Run with the Lua bundled in the VS Code Lua extension (wow-preflight does):
--   lua-language-server.exe tools/test_rain.lua
local root = (arg and arg[0] or ""):match("^(.-)tools[/\\]") or ""
local ns = {}
loadfile(root .. "DopamineLoot/Rain.lua")("DopamineLoot", ns)
local C = ns.RainCore

local fails = 0
local function Check(label, ok, detail)
  if ok then print("ok   " .. label) else fails = fails + 1; print("FAIL " .. label .. (detail and (": " .. detail) or "")) end
end

-- 1. Sprites launched like the game does (Rain.lua's launch) stay on screen, under the top edge,
-- and come to rest in time, at small and big UI scales and at 15 and 60 fps
math.randomseed(7)
local b
for _, H in ipairs({ 768, 1080, 1700 }) do
  for _, fps in ipairs({ 60, 15 }) do
    local W, k = H * 16 / 9, H / 768
    b = { left = 40, right = W - 40, floor = 2, k = k }
    local worstTime, outside = 0, 0
    for _ = 1, 200 do
      local s = { x = W / 2, y = H * 0.38, vx = math.random(-320, 320) * k,
                  vy = (math.random(650, 950) + 150) * k, e = 0.45 + math.random() * 0.2 }
      local t = 0
      while not s.resting and t < 10 do
        C.Advance(s, 1 / fps, b)
        t = t + 1 / fps
        if s.x < b.left or s.x > b.right or s.y < b.floor or s.y + 40 > H then outside = outside + 1 end
      end
      if t > worstTime then worstTime = t end
    end
    local tag = ("H=%d %dfps"):format(H, fps)
    Check(tag .. ": sprites stay on screen", outside == 0, outside .. " steps outside")
    Check(tag .. ": every sprite rests within 4.5 s", worstTime <= 4.5, ("worst %.2f s"):format(worstTime))
  end
end
b = { left = 40, right = 1880, floor = 270 }

-- 2. A long hitch (dt = 0.5 s) can't push a sprite through the floor
local s = { x = 500, y = b.floor + 5, vx = 0, vy = -2000, e = 0.6 }
C.Step(s, 0.5, b)
Check("a hitch doesn't tunnel through the floor", s.y >= b.floor, ("y = %.1f"):format(s.y))

-- 3. Bounces get lower each time
local h = { x = 500, y = b.floor, vx = 0, vy = 900, e = 0.65 }
local peaks, top, rising = {}, h.y, true
for _ = 1, 600 do
  C.Step(h, 1 / 60, b)
  if h.vy > 0 then rising = true; top = math.max(top, h.y)
  elseif rising then rising = false; peaks[#peaks + 1] = top; top = -math.huge end
  if h.resting then break end
end
local lower = #peaks >= 2
for i = 2, #peaks do if peaks[i] >= peaks[i - 1] then lower = false end end
Check("each bounce is lower than the last", lower, #peaks .. " peaks")

-- 4. Launch order: worst first, best last, ties in loot order
local items = { { quality = 4, n = "epic" }, { quality = 2, n = "g1" }, { quality = 1, n = "w" },
                { quality = 2, n = "g2" }, { quality = 3, n = "rare" } }
local order = C.LaunchOrder(items)
local names = {}
for i, it in ipairs(order) do names[i] = it.n end
Check("launch order worst to best", table.concat(names, ",") == "w,g1,g2,rare,epic", table.concat(names, ","))

-- 5. Who stays on screen
Check("rare stays at threshold 3", C.Stays({ quality = 3 }, 3))
Check("green fades at threshold 3", not C.Stays({ quality = 2 }, 3))

print(fails == 0 and "all passed" or (fails .. " failed"))

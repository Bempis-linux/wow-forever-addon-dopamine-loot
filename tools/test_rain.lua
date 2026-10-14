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

-- 6. The best item's straight-up launch stays under the top edge and lands where it started
for _, H in ipairs({ 768, 1080, 1700 }) do
  local k = H / 768
  local bb = { left = 40, right = H * 2 - 40, floor = 2, k = k }
  local s6 = { x = H, y = H * 0.38, vx = 0, vy = C.BEST_VY * k, e = 0.5 }
  local peak, t = 0, 0
  while not s6.resting and t < 10 do C.Advance(s6, 1 / 60, bb); peak = math.max(peak, s6.y); t = t + 1 / 60 end
  Check(("H=%d: the best item peaks under the top edge"):format(H), peak + 40 < H, ("peak %.0f of %d"):format(peak, H))
  Check(("H=%d: the best item lands in the middle"):format(H), s6.x == H, ("x %.1f"):format(s6.x))
end

-- 7. Launch timing: escalation speeds up, and a burst takes about as long either way
for _, n in ipairs({ 3, 8, 20, 40 }) do
  local plain, esc, faster = 0, 0, true
  for i = 1, n do
    plain = plain + C.Interval(i, n, false)
    local v = C.Interval(i, n, true)
    if i > 1 and v > C.Interval(i - 1, n, true) + 1e-9 then faster = false end
    esc = esc + v
  end
  Check(("n=%d: escalation never slows down"):format(n), faster)
  Check(("n=%d: the escalating burst lasts under 2 s"):format(n), esc < 2, ("%.2f s"):format(esc))
end

-- 8. Coins: which and how many; mixed in with the first items
local function Plan(copper)
  local n = { gold = 0, silver = 0, copper = 0 }
  for _, kind in ipairs(C.CoinPlan(copper)) do n[kind] = n[kind] + 1 end
  return n, #C.CoinPlan(copper)
end
Check("no money, no coins", #C.CoinPlan(0) == 0 and #C.CoinPlan(nil) == 0)
Check("1 copper: 1 coin, 2 copper: 2 coins", #C.CoinPlan(1) == 1 and #C.CoinPlan(2) == 2)
local p, n = Plan(5)
Check("5 copper: 5 copper coins", p.copper == 5 and n == 5, n .. " coins")
p = Plan(54)
Check("54 copper: only copper coins", p.copper > 5 and p.silver == 0 and p.gold == 0)
p = Plan(3520)
Check("35s 20c: mostly silver, a few copper", p.silver > 10 and p.copper == 3 and p.gold == 0)
p, n = Plan(20000)
Check("2g: 2 gold coins and silver filling out", p.gold == 2 and p.silver > 10 and p.copper == 0, n .. " coins")
_, n = Plan(10 ^ 9)
Check("never more than MAX_COINS", n == C.MAX_COINS)
local order = C.CoinPlan(12340)
Check("coins launch copper, then silver, then gold", order[1] == "copper" and order[#order] == "gold")
local mixed = C.Mix({ { n = "a" }, { n = "b" }, { n = "c" } }, { "copper", "silver" })
local shape = {}
for i, it in ipairs(mixed) do shape[i] = it.coin and "$" or it.n end
Check("coins go out among the first items", table.concat(shape) == "a$b$c", table.concat(shape))
local many = C.Mix({ { n = "a" } }, { "copper", "copper", "silver" })
local coinCount = 0
for _, it in ipairs(many) do if it.coin then coinCount = coinCount + 1 end end
Check("every coin is queued even with few items", #many == 4 and coinCount == 3)
Check("coins only, no items", #C.Mix({}, { "gold" }) == 1)
-- merge-up: piles of the coin below that join into each top coin; change stays as it is
local function MPlan(copper)
  local coins, merges = C.MergePlan(copper)
  local n, piles = { gold = 0, silver = 0, copper = 0 }, {}
  for _, c in ipairs(coins) do
    n[c.coin] = n[c.coin] + 1
    if c.group then piles[c.group] = (piles[c.group] or 0) + 1 end
  end
  return n, merges, piles, #coins
end
local mn, mm, mp = MPlan(23540)
Check("2g 35s 40c: two piles of silver become two gold", #mm == 2 and mm[1].into == "gold" and mp[1] == 10 and mp[2] == 10)
Check("2g 35s 40c: some silver and copper change stays", mn.silver > 20 and mn.copper > 0 and mn.gold == 0)
mn, mm, mp = MPlan(3520)
Check("35s 20c: piles of copper become silver (5 at most)", #mm == 5 and mm[1].into == "silver" and mp[1] == 5)
mn, mm = MPlan(54)
Check("54c: copper only, nothing merges", #mm == 0 and mn.copper > 0 and mn.silver == 0)
local _, m25, _, n25 = MPlan(251234)
local whole = select(1, MPlan(251234)).gold
Check("25g: 5 piles, 6 more whole gold, under 50 coins", #m25 == 5 and whole == 6 and n25 < 50, n25 .. " coins")
local mixedM = C.Mix({ { n = "a" } }, (C.MergePlan(23540)))
local grouped = 0
for _, it in ipairs(mixedM) do if it.coin and it.group then grouped = grouped + 1 end end
Check("merge piles keep their group in the launch queue", grouped == 20)
-- 10. The chest's opening sound follows the haul's size
local grays = { { quality = 0 }, { quality = 0 }, { quality = 1 } }
Check("a few grays and copper: small", C.HaulSize(grays, 54) == "small")
Check("1 gold makes it medium", C.HaulSize(grays, 10000) == "medium")
Check("6 items make it medium", C.HaulSize({ {}, {}, {}, {}, {}, {} }, 0) == "medium")
Check("anything Rare makes it big", C.HaulSize({ { quality = 0 }, { quality = 3 } }, 0) == "big")
Check("coins only, little money: small", C.HaulSize({}, 3520) == "small")
Check("money parses: 1g 20s 5c", C.ParseMoney("1g 20s 5c") == 12005)
Check("money parses: plain copper and 35s", C.ParseMoney("250") == 250 and C.ParseMoney("35s") == 3500)
Check("money rejects junk", C.ParseMoney("lots") == nil)

-- 9. Spacing: resting items never overlap, Rare+ with names keep a name's width apart
local taken = {}
local overlap = false
for i = 1, 30 do
  local x = C.Slot(600 + (i % 3) * 5, { half = 20 }, taken, 40, 1880)
  for _, o in ipairs(taken) do if math.abs(o.x - x) < 46 then overlap = true end end
  taken[#taken + 1] = { x = x, half = 20 }
end
Check("30 items piled on one spot spread without overlapping", not overlap)
local wide = { { x = 600, half = 20, wide = true } }
local wx = C.Slot(600, { half = 20, wide = true }, wide, 40, 1880)
Check("two named items keep 150 apart", math.abs(wx - 600) >= 150, ("%.0f"):format(wx))

-- 11. Launching from the ground: faster, so it peaks as high as from the middle
local function Peak(y, vy, k) return y + vy * vy / (2 * -C.GRAVITY * k) end
local vy0 = C.LaunchSpeed(800, 2, 292, 1)
Check("from the ground it peaks where it would from the middle",
  math.abs(Peak(2, vy0, 1) - Peak(292, 800, 1)) < 0.5, ("%.1f vs %.1f"):format(Peak(2, vy0, 1), Peak(292, 800, 1)))
local vyK = C.LaunchSpeed(800 * 1.4, 2, 292 * 1.4, 1.4)
Check("the same at another screen scale", math.abs(Peak(2, vyK, 1.4) - Peak(292 * 1.4, 800 * 1.4, 1.4)) < 0.5)
Check("from the middle the speed is unchanged", C.LaunchSpeed(800, 292, 292, 1) == 800)

print(fails == 0 and "all passed" or (fails .. " failed"))

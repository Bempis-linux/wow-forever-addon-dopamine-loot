-- Dopamine Loot loot rain, the pure part (ns.RainCore): physics, launch timing and order, coins,
-- spacing. No game calls here, so tools/test_rain.lua runs it offline; Rain.lua draws with it.
local _, ns = ...

local Core = {}
ns.RainCore = Core

Core.GRAVITY = -1800     -- px/s^2
Core.MIN_BOUNCE = 170    -- below this vertical speed a sprite stops bouncing and rests
Core.FRICTION = 0.82     -- sideways speed kept per bounce
Core.BEST_VY = 1150      -- the best item's launch speed: peaks around 85% of the screen height

-- Where the loot flies from (setting rainFrom): "ground" (a fountain from the ground's middle),
-- "spread" (anywhere along the middle half of the ground; the best still from the middle), "below"
-- (from just under the bottom edge) or "middle" (the middle of the screen, the 0.3 rain).
Core.FROM = { "ground", "spread", "below", "middle" }

-- The launch speed that peaks as high from y0 as speed vy does from mid: launched lower, it flies
-- faster (k = the screen scale, as in Step)
function Core.LaunchSpeed(vy, y0, mid, k)
  local rise = math.max(0, mid - y0)
  return math.sqrt(vy * vy + 2 * -Core.GRAVITY * (k or 1) * rise)
end

-- One physics step for a sprite {x, y, vx, vy, e (restitution), resting, bounces}.
-- bounds = {left, right, floor, k}; k scales gravity and speeds with the screen height (UI scale)
-- so the arc looks the same at any UI scale. Returns "bounce" when it hit the floor this step.
function Core.Step(s, dt, b)
  if s.resting then return nil end
  dt = math.min(dt, 1 / 30) -- a hitch can't tunnel a sprite through the floor
  local k = b.k or 1
  s.vy = s.vy + Core.GRAVITY * k * dt
  s.x = s.x + s.vx * dt
  s.y = s.y + s.vy * dt
  if s.x < b.left then s.x, s.vx = b.left, math.abs(s.vx) * 0.8
  elseif s.x > b.right then s.x, s.vx = b.right, -math.abs(s.vx) * 0.8 end
  if s.y <= b.floor and s.vy < 0 then
    s.y = b.floor
    s.bounces = (s.bounces or 0) + 1
    local up = -s.vy * (s.e or 0.65)
    s.vx = s.vx * Core.FRICTION
    if up < Core.MIN_BOUNCE * k then
      s.vy, s.vx, s.resting = 0, 0, true
    else
      s.vy = up
    end
    return "bounce"
  end
  return nil
end

-- A whole frame in small steps: real time at any frame rate (no slow motion at 15 fps).
-- Returns true if the sprite bounced during the frame.
function Core.Advance(s, dt, b)
  local bounced = false
  while dt > 0 and not s.resting do
    local h = math.min(dt, 1 / 30)
    if Core.Step(s, h, b) then bounced = true end
    dt = dt - h
  end
  return bounced
end

-- Launch order: lowest quality first, so the best item comes out last (ties keep input order)
function Core.LaunchOrder(items)
  local order = {}
  for i, it in ipairs(items) do order[i] = { i = i, q = it.quality or 0 } end
  table.sort(order, function(a, b) if a.q ~= b.q then return a.q < b.q end return a.i < b.i end)
  local out = {}
  for k, o in ipairs(order) do out[k] = items[o.i] end
  return out
end

function Core.Stays(item, stayQuality) return (item.quality or 0) >= stayQuality end

-- Which note (0..top) the n-th sound of a run plays (n = 1 for the first): it climbs the scale,
-- then keeps moving in a little phrase over the top notes instead of repeating the highest one
local PHRASE = { -4, -2, 0, -3, -1, -5, -2, 0 }
function Core.Melody(n, top)
  n = math.max(1, math.floor(n or 1))
  if n <= top + 1 then return n - 1 end
  return math.max(0, top + PHRASE[(n - top - 2) % #PHRASE + 1])
end

-- Seconds between launch i and i+1 of n. Escalation starts slow and rattles out faster
-- (the whole burst takes about as long either way).
function Core.Interval(i, n, escalate)
  if not escalate then return math.min(0.09, 1.4 / n) end
  local start = math.min(0.17, 2.4 / n)
  local t = n > 1 and (i - 1) / (n - 1) or 1
  return start - start * 0.7 * (1 - (1 - t) * (1 - t))
end

-- The coins a sum of money rains as, in launch order (copper, silver, gold): more money, more
-- coins (a log curve, 30 at most, never more coins than copper pieces). Real gold pieces come out
-- as gold coins (up to half), copper as a few copper, and silver fills the rest, so 2 gold rains
-- as 2 gold and 28 silver, 35 silver as 26 silver, 54 copper as 14 copper.
Core.MAX_COINS = 30
function Core.CoinPlan(copper)
  local plan = {}
  copper = math.floor(copper or 0)
  if copper <= 0 then return plan end
  local n = math.floor(3 + 6.5 * math.log(copper) / math.log(10))
  n = math.min(math.max(3, n), Core.MAX_COINS, copper)
  local g, s, c = math.floor(copper / 10000), math.floor(copper / 100) % 100, copper % 100
  local gold = g > 0 and math.max(1, math.min(g, math.floor(n / 2))) or 0
  local hasSilver = g > 0 or s > 0
  local cop = c > 0 and math.min(c, hasSilver and 3 or n) or 0
  local silver = hasSilver and math.max(n - gold - cop, s > 0 and 1 or 0) or 0
  if not hasSilver then cop = n end
  for _ = 1, cop do plan[#plan + 1] = "copper" end
  for _ = 1, silver do plan[#plan + 1] = "silver" end
  for _ = 1, gold do plan[#plan + 1] = "gold" end
  return plan
end

-- Coins that merge up: each top coin you got (gold, else silver; 5 at most) sprays out as a pile of
-- the coin below that later joins up into it; more than 5 come whole (up to 6 more), and the change
-- that can't make a whole top coin stays as it is. Copper alone has nothing to join into.
-- Returns coins (entries {coin = kind, group = pile or nil}, shuffled) and merges ({group, into}).
-- 2g 35s 40c: 2 piles of 10 silver -> 2 gold, plus 4 silver and 4 copper of change.
function Core.MergePlan(copper)
  copper = math.floor(copper or 0)
  local g, s, c = math.floor(copper / 10000), math.floor(copper / 100) % 100, copper % 100
  local top = g > 0 and "gold" or s > 0 and "silver" or nil
  local coins, merges = {}, {}
  if not top then
    for i, kind in ipairs(Core.CoinPlan(copper)) do coins[i] = { coin = kind } end
    return coins, merges
  end
  local lower, have = top == "gold" and "silver" or "copper", top == "gold" and g or s
  local piles = math.min(have, 5)
  local per = math.max(5, math.min(10, math.floor(26 / piles)))
  for p = 1, piles do
    merges[p] = { group = p, into = top }
    for _ = 1, per do coins[#coins + 1] = { coin = lower, group = p } end
  end
  for _ = piles + 1, math.min(have, piles + 6) do coins[#coins + 1] = { coin = top } end
  local leftS = top == "gold" and s or 0
  for _ = 1, leftS > 0 and math.min(leftS, 2 + math.floor(leftS / 12)) or 0 do coins[#coins + 1] = { coin = "silver" } end
  for _ = 1, c > 0 and math.min(c, 2 + math.floor(c / 20)) or 0 do coins[#coins + 1] = { coin = "copper" } end
  for i = #coins, 2, -1 do -- shuffled, so the piles' coins land all over
    local j = math.random(i)
    coins[i], coins[j] = coins[j], coins[i]
  end
  return coins, merges
end

-- The launch queue: items in order with the coins mixed in among the first ones (money comes
-- out with the junk, the good stuff after); coins = a CoinPlan (kinds) or MergePlan (entries)
function Core.Mix(items, coins)
  local out = {}
  local extra = #coins - #items -- more coins than items: the rest go out first
  local ci = 1
  local function Coin()
    local c = coins[ci]
    ci = ci + 1
    return type(c) == "table" and c or { coin = c }
  end
  for _ = 1, math.max(0, extra) do out[#out + 1] = Coin() end
  for _, it in ipairs(items) do
    out[#out + 1] = it
    if coins[ci] then out[#out + 1] = Coin() end
  end
  return out
end

-- How big a haul is, for the burst's sound: "big" with anything Rare or better, "medium"
-- from 6 items or 1 gold, else "small" (a few grays, whites or greens and some copper)
function Core.HaulSize(items, copper)
  for _, it in ipairs(items) do if (it.quality or 0) >= 3 then return "big" end end
  if #items >= 6 or (copper or 0) >= 10000 then return "medium" end
  return "small"
end

-- "1g 20s 5c", "1g20s", "35s", "250" (copper) -> copper, or nil
function Core.ParseMoney(text)
  text = (text or ""):lower():gsub("%s+", "")
  if text == "" then return nil end
  if text:match("^%d+$") then return tonumber(text) end
  local total, rest = 0, text
  for num, unit in text:gmatch("(%d+)([gsc])") do
    total = total + tonumber(num) * (unit == "g" and 10000 or unit == "s" and 100 or 1)
  end
  rest = rest:gsub("%d+[gsc]", "")
  if rest ~= "" then return nil end
  return total
end

-- Where a resting sprite settles so it doesn't overlap the others: the nearest free x to x.
-- me and each taken = {x (target), half (half width), wide (keeps a name's width)}.
function Core.Slot(x, me, taken, left, right)
  local function Free(px)
    for _, o in ipairs(taken) do
      local gap = (me.wide and o.wide) and 150 or me.half + o.half + 6
      if math.abs(o.x - px) < gap then return false end
    end
    return true
  end
  for k = 0, 400 do
    for sign = 1, -1, -2 do
      local px = x + sign * k * 6
      if px >= left and px <= right and Free(px) then return px end
    end
  end
  return x
end

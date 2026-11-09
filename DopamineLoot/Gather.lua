-- Dopamine Loot gathering (docs/mockups/gathering.html round 3, personalized per profession in
-- docs/mockups/gather-themes.html). Gathering is addictive already: this adds to it without getting in
-- the way for hours.
--   Every gather bursts where you clicked, in the profession's own style:
--     Herbalism  petals spiral up and pollen drifts off on a breeze; rare: a flower blooms open
--     Mining     three pick strikes in rhythm (sparks, chips), a settling dust puff; rare gem: a star flare
--                and prismatic glints
--     Fishing    rings ripple out, droplets fly, the fish flips on its way; rare: a big shimmering leap
--     Skinning   a quick knife-glint slash, fur tufts drifting down, the hide flops on its way; rare: a
--                long shine sweep
--   and the pieces fly into the harvest window; a soft note climbs a step with each gather of a run (it
--   starts low again after 8 s without gathering).
--   The harvest window: what you gathered this session, grouped by profession (Herbs, Ore, Fish,
--   Leather), in the game's look; the pace ("37 in 12 min · ~185/h") and what the haul sells for; a
--   "+N" that adds up while gathers come fast; a full stack (the item's real stack size) stamps a gold
--   "×N" badge on its row with a shine. It lingers by how much you gather (12 s for one herb picked on
--   the way, up to 90 s farming), steps away when a fight starts, hides on right-click; it comes back
--   on the next gather. Movable (Mover.lua: "Move frames").
--   Rare finds (Uncommon or better) get the bigger burst; their popup comes from the normal loot feed.
--   Calm: after many gathers in 10 minutes (setting gatherCalm, default 40; 0 = never) the bursts get
--   small and silent; the window, stacks and rare finds stay as they are.
-- What counts as a gather (decided once per loot window, kept until a second after it closes): fishing
-- loot; an herb or ore/stone from a game object (a node); a creature's loot that is all leather and
-- hides (skinning). Gathered items don't rain: LootFeed hands them here.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local BORDER = "Interface\\COMMON\\WhiteIconFrame"
local STAR = "Interface\\Cooldown\\star4" -- the game's four-point sparkle
local WHITE = "Interface\\Buttons\\WHITE8X8"
local MORPHEUS = "Fonts\\MORPHEUS.TTF"
local GetInfo = (C_Item and C_Item.GetItemInfo) or GetItemInfo
local GetInfoInstant = (C_Item and C_Item.GetItemInfoInstant) or GetItemInfoInstant
local GetIcon = (C_Item and C_Item.GetItemIconByID) or GetItemIcon
local TRADE_GOODS = 7
local SUB_HERB, SUB_METAL_STONE, SUB_LEATHER = 9, 7, 6
local NOTE_RESET, CALM_WINDOW, GRACE, MERGE_T, MAX_ROWS, MAX_FX = 8, 600, 1, 1.5, 8, 120
-- How long the window stays after the last gather: 12 s for a herb picked on the way while questing,
-- 2 s more for each gather in the last 10 minutes, up to 90 s in a real farming run
local LINGER_MIN, LINGER_PER, LINGER_MAX = 12, 2, 90
local ROW_W, ROW_H, SEC_H, TOP_H = 230, 26, 16, 32
local TEST_FIRST = 100000 -- test gathers number from here: they don't count toward calm

-- Each profession's section in the window: its name, color, and an item whose icon heads it
local PROF = {
  herb = { label = "Herbs", color = { 0.31, 0.75, 0.29 }, icon = 2447 },
  ore = { label = "Ore", color = { 0.82, 0.48, 0.23 }, icon = 2770 },
  fish = { label = "Fish", color = { 0.23, 0.55, 1 }, icon = 6291 },
  skin = { label = "Leather", color = { 0.69, 0.48, 0.27 }, icon = 2318 },
}

local layer, tally, header, total, paceText, valueText
local rows, rowList = {}, {}       -- rows by item; every row in display order
local sections, sectionOrder = {}, {}
local fx, tweens = {}, {}
local fxOn = false                 -- any particle alive (else the particle loop is skipped)
local kind, kindUntil, lootOpen = nil, 0, false
local nodeX, nodeY
local lootId, poppedId = 0, -1
local detected = false             -- decided once per loot window (LOOT_READY may fire twice with autoloot)
local step, lastGather = 0, -999
local hist = {}                    -- times of recent real gathers (calm, linger)
local sum, value, sessionStart = 0, 0, nil
local lastShown = -999
local dismissedAt                  -- set when the window is sent away early (right-click, combat)

local function On() return not ns.settings.noGather and ns.settings.enabled ~= false end
local function CalmLimit() local v = ns.settings.gatherCalm; if v == nil then return 40 end return v end
local function Calm()
  local now, limit = GetTime(), CalmLimit()
  while hist[1] and now - hist[1] > CALM_WINDOW do table.remove(hist, 1) end
  return limit > 0 and #hist >= limit
end
local function Linger()
  Calm() -- (drops gathers older than 10 minutes)
  return math.min(LINGER_MAX, LINGER_MIN + LINGER_PER * #hist)
end
local function R(a, b) return a + math.random() * (b - a) end

---------------------------------------------------------------------------
-- What counts as a gather
---------------------------------------------------------------------------
local function Detect()
  if IsFishingLoot and IsFishingLoot() then return "fish" end
  local n = GetNumLootItems and GetNumLootItems() or 0
  local fromObject, fromCreature, herb, ore, any, allLeather = false, false, false, false, false, true
  for i = 1, n do
    local link = GetLootSlotLink and GetLootSlotLink(i)
    if link and not ns.Secret(link) and GetInfoInstant then
      any = true
      local _, _, _, _, _, classID, subID = GetInfoInstant(link)
      if classID == TRADE_GOODS and subID == SUB_HERB then herb = true end
      -- (a gem alone doesn't make it mining: chests drop gems too; a node always gives ore or stone)
      if classID == TRADE_GOODS and subID == SUB_METAL_STONE then ore = true end
      if not (classID == TRADE_GOODS and subID == SUB_LEATHER) then allLeather = false end
    end
    if GetLootSourceInfo then
      local ok, guid = pcall(GetLootSourceInfo, i)
      if ok and not ns.Secret(guid) and type(guid) == "string" then
        if guid:find("^GameObject") then fromObject = true elseif guid:find("^Creature") then fromCreature = true end
      end
    end
  end
  if fromObject and herb then return "herb" end
  if fromObject and ore then return "ore" end
  if fromCreature and any and allLeather then return "skin" end
end

-- Where the burst goes: the cursor (you clicked the node), else a bit below the middle of the screen
local function NodePoint()
  local s = UIParent:GetEffectiveScale()
  local x, y = GetCursorPosition()
  local w, h = UIParent:GetWidth(), UIParent:GetHeight()
  if x and x > 0 then
    x, y = x / s, y / s
    if x > 40 and x < w - 40 and y > 80 and y < h - 40 then return x, y end
  end
  return w / 2 - 120, h * 0.4
end

local function OnLootReady()
  if detected then return end
  detected = true
  if not On() then kind = nil; return end
  lootId = lootId + 1
  kind = Detect()
  kindUntil = math.huge
  if kind then nodeX, nodeY = NodePoint() end
end

-- The loot feed asks: is this loot line from a gather? The kind (nil if not), this gather's number and
-- where its node was, captured now (the item's data may arrive later, after the next gather started)
function ns.GatherKind()
  if not On() or not kind then return nil end
  if lootOpen or GetTime() <= kindUntil then return kind, lootId, nodeX, nodeY end
end

---------------------------------------------------------------------------
-- Little effects: plain textures moved in one OnUpdate, and tweens.
-- Fx o: file, x, y (screen), vx, vy, g (falling), or path(u) -> dx, dy, rot; size .. size1; life, delay;
-- rot, spin; r, gg, b, a; add (additive); fade (fades all the way), pulse (grows in and out: glints)
---------------------------------------------------------------------------
local function Fx(o)
  local p
  for _, q in ipairs(fx) do if not q.on then p = q; break end end
  if not p then
    if #fx >= MAX_FX then return end
    p = { tex = layer:CreateTexture(nil, "OVERLAY") }
    fx[#fx + 1] = p
  end
  p.on, p.t, fxOn = true, -(o.delay or 0), true
  p.x, p.y, p.vx, p.vy, p.g, p.path = o.x, o.y, o.vx or 0, o.vy or 0, o.g or 0, o.path
  p.size, p.size1, p.life, p.a = o.size, o.size1 or o.size, o.life, o.a or 1
  p.rot, p.spin, p.fade, p.pulse, p.flat = o.rot or 0, o.spin or 0, o.fade, o.pulse, o.flat or 1
  p.tex:SetTexture(o.file)
  p.tex:SetVertexColor(o.r or 1, o.gg or 1, o.b or 1)
  p.tex:SetBlendMode(o.add and "ADD" or "BLEND")
  p.tex:SetRotation(p.rot)
  p.tex:Hide()
end

local function Tween(dur, fn, delay) tweens[#tweens + 1] = { t = -(delay or 0), dur = dur, fn = fn } end

local function StepFx(dt)
  fxOn = false
  for _, p in ipairs(fx) do
    if p.on then
      fxOn = true
      p.t = p.t + dt
      if p.t >= p.life then p.on = false; p.tex:Hide()
      elseif p.t >= 0 then
        local u = p.t / p.life
        local x, y, rot
        if p.path then
          local dx, dy, r = p.path(u)
          x, y, rot = p.x + dx, p.y + dy, r
        else
          x, y = p.x + p.vx * p.t, p.y + p.vy * p.t - 0.5 * p.g * p.t * p.t
          rot = p.rot + p.spin * p.t
        end
        local s = p.pulse and p.size1 * math.sin(math.pi * math.min(1, u * 1.4)) or p.size + (p.size1 - p.size) * u
        p.tex:ClearAllPoints()
        p.tex:SetPoint("CENTER", UIParent, "BOTTOMLEFT", x, y)
        p.tex:SetSize(math.max(0.1, s), math.max(0.1, s * p.flat))
        p.tex:SetRotation(rot)
        p.tex:SetAlpha(p.a * (p.fade and (1 - u) or math.min(1, (1 - u) * 4)))
        p.tex:Show()
      end
    end
  end
end

local function Step(_, dt)
  if fxOn then StepFx(dt) end
  for i = #tweens, 1, -1 do
    local w = tweens[i]
    w.t = w.t + dt
    if w.t >= 0 then
      local u = math.min(1, w.t / w.dur)
      w.fn(u)
      if u >= 1 then table.remove(tweens, i) end
    end
  end
  -- the window fades after a while without gathering, or at once when dismissed (not while it's being placed)
  if tally and tally:IsShown() and not (ns.Mover and ns.Mover.IsUnlocked()) then
    local now = GetTime()
    local start, dur = lastShown + Linger(), 0.6
    if dismissedAt then start, dur = dismissedAt, 0.3 end
    if now > start then
      local a = 1 - (now - start) / dur
      if a <= 0 then tally:Hide(); tally:SetFrameStrata("MEDIUM") else tally:SetAlpha(math.min(tally:GetAlpha(), a)) end
    end
  end
end

-- Hides the window now (right-click, a fight starting); it comes back on the next gather
local function Dismiss()
  if tally and tally:IsShown() and not (ns.Mover and ns.Mover.IsUnlocked()) then dismissedAt = GetTime() end
end

local function Glint(x, y, size, r, g, b, life, delay)
  Fx({ file = STAR, x = x, y = y, size = size, size1 = size, pulse = true, life = life, delay = delay, add = true, r = r, gg = g, b = b,
    rot = R(0, 0.5), spin = 1 })
end
local function Sound(name, delay, quiet)
  if quiet then return end
  if delay and delay > 0 then C_Timer.After(delay, function() ns:PlayGatherFx(name) end) else ns:PlayGatherFx(name) end
end

---------------------------------------------------------------------------
-- The bursts, one per profession. m: 1, or 0.4 when calm (quiet: no sounds); icon: the rare's icon
---------------------------------------------------------------------------
local BURST = {} -- the whole gather's burst (with the rare part when the gather itself is rare)
local RARE = {}  -- the rare part alone (a rare item arriving after the gather's first line)

function BURST.herb(x, y, rare, m, quiet)
  local colors = { { 1, 0.84, 0.93 }, { 1, 1, 1 }, { 1, 0.6, 0.82 }, { 0.78, 0.94, 0.54 } }
  for i = 1, math.floor(12 * m + 0.5) do -- petals spiral up
    local a0, c = i / 12 * 2 * math.pi, colors[(i - 1) % 4 + 1]
    Fx({ file = MEDIA .. "Petal.tga", x = x, y = y, size = R(7, 10), life = R(1, 1.4), delay = i * 0.015, r = c[1], gg = c[2], b = c[3],
      path = function(u) local a = a0 + u * 4.2; local r = 6 + 34 * u; return math.cos(a) * r + 30 * u * u, 70 * u + 10 * math.sin(a), a end })
  end
  for i = 1, math.floor(9 * m + 0.5) do -- pollen drifting off on a breeze
    Fx({ file = MEDIA .. "Mote.tga", x = x + R(-10, 10), y = y + R(-6, 6), vx = R(20, 60), vy = R(20, 50), g = -8, size = R(5, 8),
      life = R(1.4, 2), delay = 0.2 + i * 0.04, add = true, fade = true, r = 1, gg = 0.95, b = 0.63 })
  end
  if rare then RARE.herb(x, y, quiet) end
end
-- G2 "Golden seed" (docs/mockups/gather-polish.html, 1b): a seed of light lifts out of the herb, hangs a
-- beat, then cracks open: light rays flash out, a ring of leaves unfolds, and gold pollen showers down
local SEED_UP, OPEN = 44, 0.9
function RARE.herb(x, y, quiet)
  Fx({ file = MEDIA .. "Mote.tga", x = x, y = y + 6, size = 16, life = OPEN + 0.05, add = true, r = 1, gg = 0.89, b = 0.54,
    path = function(u)
      local t = u * (OPEN + 0.05)
      local e = 1 - (1 - math.min(1, t / 0.45)) ^ 2
      return 0, SEED_UP * e + (t > 0.45 and 2 * math.sin((t - 0.45) * 20) or 0), 0
    end })
  for i = 0, 5 do -- its little trail
    Fx({ file = MEDIA .. "Mote.tga", x = x + R(-3, 3), y = y + 6 + i * 7, size = 5, life = 0.6, delay = i * 0.06, add = true, fade = true,
      r = 1, gg = 0.89, b = 0.54, path = function() return 0, 0, 0 end })
  end
  local cx, cy = x, y + 6 + SEED_UP
  -- it cracks open
  Fx({ file = MEDIA .. "Ring.tga", x = cx, y = cy, size = 12, size1 = 90, life = 0.5, delay = OPEN, add = true, r = 1, gg = 0.89, b = 0.54 })
  Glint(cx, cy, 56, 1, 0.96, 0.75, 0.5, OPEN)
  for i = 0, 11 do -- rays flashing out (a streak from the middle outward, turning a little)
    local a = i / 12 * 2 * math.pi
    Fx({ file = MEDIA .. "Streak.tga", x = cx, y = cy, size = 10, size1 = 90, life = 1.4, delay = OPEN, add = true, a = 0.8,
      r = 1, gg = 0.86, b = 0.47,
      path = function(u) local s = 10 + 80 * math.min(1, u * 2.5); local r = a + 0.26 * u; return math.cos(r) * s / 2, math.sin(r) * s / 2, r end })
  end
  for i = 0, 9 do -- a ring of leaves unfolding
    local a = i / 10 * 2 * math.pi
    Fx({ file = MEDIA .. "Petal.tga", x = cx, y = cy, size = 6, size1 = 16, life = 1.6, delay = OPEN, r = 0.45, gg = 0.8, b = 0.3,
      path = function(u) local e = 1 - (1 - math.min(1, u / 0.4)) ^ 3; return math.sin(a) * 30 * e, math.cos(a) * 30 * e, -a end })
  end
  for i = 1, 26 do -- gold pollen showering down
    Fx({ file = MEDIA .. "Mote.tga", x = cx + R(-10, 10), y = cy, vx = R(-110, 110), vy = R(20, 140), g = 160, size = R(4, 7),
      life = R(1.1, 1.7), delay = OPEN + 0.05 + i * 0.01, add = true, fade = true, r = 1, gg = 0.83, b = 0.29 })
  end
  Sound("RareHerb", OPEN, quiet)
end

function BURST.ore(x, y, rare, m, quiet)
  local strikes = m < 1 and 1 or 3
  for k = 0, strikes - 1 do -- pick strikes in rhythm: a glint, sparks, chips
    local t, sx, sy = k * 0.14, x + R(-10, 10), y + R(-4, 12)
    Glint(sx, sy, 26 + k * 5, 1, 0.96, 0.78, 0.3, t)
    Sound("Strike0" .. k, t, quiet)
    for _ = 1, 5 do
      Fx({ file = MEDIA .. "Mote.tga", x = sx, y = sy, vx = R(-160, 160), vy = R(60, 200), g = 700, size = 4, life = R(0.25, 0.45),
        delay = t, add = true, r = 1, gg = 0.82, b = 0.48 })
    end
    for i = 1, 4 do
      local c = ({ { 0.54, 0.48, 0.42 }, { 0.69, 0.63, 0.56 }, { 0.78, 0.48, 0.23 } })[(i - 1) % 3 + 1]
      Fx({ file = MEDIA .. "Diamond.tga", x = sx, y = sy, vx = R(-110, 110), vy = R(50, 150), g = 650, size = R(4, 7), life = R(0.4, 0.7),
        delay = t, spin = R(-10, 10), r = c[1], gg = c[2], b = c[3] })
    end
  end
  for _ = 1, math.floor(6 * m + 0.5) do -- a dust puff that settles
    Fx({ file = MEDIA .. "Circle.tga", x = x + R(-14, 14), y = y - 14, vx = R(-30, 30), vy = R(8, 26), g = 4, size = R(10, 16), size1 = 32,
      life = R(1, 1.5), delay = 0.32, fade = true, a = 0.35, r = 0.67, gg = 0.61, b = 0.55 })
  end
  if rare then RARE.ore(x, y, quiet, nil, 0.38) end
end
function RARE.ore(x, y, quiet, _, d) -- a gem: a star flare and prismatic glints (d: after the strikes)
  d = d or 0
  Glint(x, y + 20, 80, 1, 1, 1, 0.7, d)
  Glint(x, y + 20, 54, 0.49, 1, 0.69, 0.7, d + 0.06)
  local prism = { { 1, 0.42, 0.42 }, { 1, 0.83, 0.29 }, { 0.49, 1, 0.69 }, { 0.42, 0.78, 1 }, { 0.75, 0.54, 1 } }
  for i, c in ipairs(prism) do
    for j = 1, 3 do Glint(x + R(-40, 40), y + 20 + R(-30, 36), R(10, 16), c[1], c[2], c[3], 0.6, d + 0.12 + i * 0.06 + j * 0.03) end
  end
  Sound("RareOre", d, quiet)
end

function BURST.fish(x, y, rare, m, quiet, icon)
  for k = 0, (m < 1 and 0 or 2) do -- rings rippling out on the water
    Fx({ file = MEDIA .. "Ring.tga", x = x, y = y - 24, size = 10, size1 = 70 + k * 40, flat = 0.3, life = 1, delay = k * 0.18, a = 0.8, r = 0.75, gg = 0.9, b = 1,
      path = function() return 0, 0, 0 end })
  end
  for _ = 1, math.floor(12 * m + 0.5) do
    Fx({ file = MEDIA .. "Circle.tga", x = x + R(-8, 8), y = y - 18, vx = R(-80, 80), vy = R(100, 200), g = 650, size = R(3, 5),
      life = R(0.5, 0.8), r = 0.81, gg = 0.93, b = 1 })
  end
  Sound("Splash", 0, quiet)
  if rare then RARE.fish(x, y, quiet, icon) end
end
function RARE.fish(x, y, quiet, icon) -- a big shimmering leap
  Fx({ file = icon or MEDIA .. "Mote.tga", x = x, y = y, size = 30, life = 1.1,
    path = function(u) return 90 * u, 130 * math.sin(math.pi * u), 0.7 - 1.4 * u end })
  for i = 0, 13 do
    local u = i / 14
    Glint(x + 90 * u + R(-6, 6), y + 130 * math.sin(math.pi * u) + R(-6, 6), R(10, 15), 0.75, 0.9, 1, 0.5, i * 0.07)
  end
  Fx({ file = MEDIA .. "Ring.tga", x = x + 90, y = y - 24, size = 10, size1 = 120, flat = 0.3, life = 0.9, delay = 1, a = 0.9, r = 0.75, gg = 0.9, b = 1 })
  Sound("RareFish", 0, quiet)
end

-- A knife glint: a streak at angle a (radians, 0.49 = up-right), w long; tip: a bright point running
-- along the blade as it cuts; life, alpha: optional (an afterimage is fainter and lingers)
local function Slash(x, y, w, a, delay, tip, life, alpha)
  local ca, sa = math.cos(a), math.sin(a)
  Fx({ file = MEDIA .. "Streak.tga", x = x, y = y, size = 10, size1 = w, life = life or 0.4, delay = delay, add = true, rot = a, a = alpha,
    path = function(u) return 4 * u * ca, 4 * u * sa, a end })
  if tip then
    Fx({ file = MEDIA .. "Mote.tga", x = x, y = y, size = 9, life = 0.4, delay = delay, add = true,
      path = function(u) local d = -w / 2 + w * u; return d * ca, d * sa, 0 end })
  end
end
local function Tufts(x, y, n) -- soft, fluffy fur tufts drifting down
  for i = 1, n do
    local dx, ph = R(-50, 50), i
    Fx({ file = MEDIA .. "Glow.tga", x = x, y = y, size = R(12, 17), life = R(1.1, 1.6), delay = 0.08 + i * 0.02, fade = true,
      r = 0.76, gg = 0.56, b = 0.36, a = 0.85,
      path = function(u) return dx * u + 8 * math.sin(u * 9 + ph), 30 * math.sin(math.pi * math.min(u * 1.6, 1)) - 50 * u * u, 0 end })
  end
end
function BURST.skin(x, y, rare, m, quiet)
  if rare then -- the rare's double slash replaces the single one
    Tufts(x, y, 6)
    RARE.skin(x, y, quiet)
    return
  end
  -- N1 "Glint and scraps" (docs/mockups/gather-polish.html): the glint with a fainter afterimage, a second
  -- quick flick the other way, leather scraps tumbling with the tufts
  Slash(x, y + 6, 90, 0.49, 0)
  Slash(x - 6, y + 2, 90, 0.49, 0.04, false, 0.5, 0.5)
  Slash(x + 10, y + 14, 50, -0.56, 0.18, false, 0.28)
  Sound("Slash", 0, quiet)
  Sound("Slash", 0.18, quiet)
  Tufts(x, y, math.floor(7 * m + 0.5))
  local scraps = { { 0.54, 0.35, 0.19 }, { 0.63, 0.47, 0.31 }, { 0.42, 0.25, 0.13 } }
  for i = 1, math.floor(4 * m + 0.5) do
    local c = scraps[(i - 1) % 3 + 1]
    Fx({ file = MEDIA .. "Diamond.tga", x = x, y = y, vx = R(-90, 90), vy = R(60, 140), g = 420, size = R(5, 8), life = R(0.6, 0.9),
      spin = R(-9, 9), r = c[1], gg = c[2], b = c[3] })
  end
end
function RARE.skin(x, y, quiet) -- R1 "Double slash": two glints cross in an X, a flash where they meet, sparks
  local cy = y + 10
  Slash(x, cy, 170, 0.56, 0)
  Slash(x, cy, 170, -0.56, 0.12)
  Sound("Slash", 0, quiet)
  Sound("Slash", 0.12, quiet)
  Fx({ file = MEDIA .. "Ring.tga", x = x, y = cy, size = 10, size1 = 70, life = 0.4, delay = 0.17, add = true })
  Glint(x, cy, 46, 1, 1, 1, 0.5, 0.17)
  Glint(x, cy, 30, 1, 0.88, 0.69, 0.5, 0.22)
  for k = 0, 1 do
    local a = k == 0 and 0.56 or -0.56
    for _ = 1, 6 do
      local d = R(-80, 80)
      Fx({ file = MEDIA .. "Mote.tga", x = x + d * math.cos(a), y = cy + d * math.sin(a), vx = R(-60, 60), vy = R(20, 90), g = 300,
        size = 5, life = R(0.35, 0.6), delay = 0.05 + k * 0.12, add = true, r = 1, gg = 0.91, b = 0.75 })
    end
  end
  Sound("RareSkin", 0.17, quiet)
end

---------------------------------------------------------------------------
-- The harvest window: a header (Harvest, total), the pace and value line, then a section per
-- profession with its rows
---------------------------------------------------------------------------
local function QualityColor(q)
  local c = ITEM_QUALITY_COLORS and ITEM_QUALITY_COLORS[q or 1]
  if c then return c.r, c.g, c.b end
  return 1, 1, 1
end

local function Layout()
  local y = -TOP_H
  for _, k in ipairs(sectionOrder) do
    local s = sections[k]
    if #s.rows > 0 then
      s.head:ClearAllPoints()
      s.head:SetPoint("TOPRIGHT", tally, "TOPRIGHT", 0, y)
      s.head:Show()
      y = y - SEC_H
      for _, row in ipairs(s.rows) do
        row:ClearAllPoints()
        row:SetPoint("TOPRIGHT", tally, "TOPRIGHT", 0, y)
        y = y - ROW_H - 2
      end
      y = y - 3
    else
      s.head:Hide()
    end
  end
  tally:SetHeight(-y)
end

local function Section(k)
  local s = sections[k]
  if s then return s end
  local P = PROF[k] or PROF.herb
  local c = P.color
  local head = CreateFrame("Frame", nil, tally)
  head:SetSize(ROW_W, SEC_H)
  local ic = head:CreateTexture(nil, "ARTWORK")
  ic:SetSize(12, 12)
  ic:SetPoint("LEFT", 4, 0)
  ic:SetTexture(GetIcon and GetIcon(P.icon) or nil)
  ic:SetTexCoord(0.08, 0.92, 0.08, 0.92)
  local text = head:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  text:SetPoint("LEFT", ic, "RIGHT", 4, 0)
  text:SetText(P.label:upper())
  text:SetTextColor(c[1], c[2], c[3])
  local line = head:CreateTexture(nil, "ARTWORK")
  line:SetTexture(WHITE)
  line:SetHeight(1)
  line:SetPoint("LEFT", text, "RIGHT", 6, 0)
  line:SetPoint("RIGHT", head, "RIGHT", -4, 0)
  if not pcall(line.SetGradient, line, "HORIZONTAL", CreateColor(c[1], c[2], c[3], 0.6), CreateColor(c[1], c[2], c[3], 0)) then
    line:SetVertexColor(c[1], c[2], c[3], 0.4)
  end
  s = { head = head, rows = {}, color = c }
  sections[k] = s
  sectionOrder[#sectionOrder + 1] = k
  return s
end

local function NewRow(d, s)
  local row = CreateFrame("Frame", nil, tally)
  row:SetSize(ROW_W, ROW_H)
  if row.SetClipsChildren then row:SetClipsChildren(true) end -- (the shine stays inside)
  local bg = row:CreateTexture(nil, "BACKGROUND")
  bg:SetAllPoints()
  bg:SetTexture(WHITE)
  if not pcall(bg.SetGradient, bg, "HORIZONTAL", CreateColor(0, 0, 0, 0.62), CreateColor(0, 0, 0, 0.04)) then bg:SetVertexColor(0, 0, 0, 0.4) end
  local stripe = row:CreateTexture(nil, "BORDER")
  stripe:SetPoint("TOPLEFT"); stripe:SetPoint("BOTTOMLEFT")
  stripe:SetWidth(2)
  stripe:SetColorTexture(s.color[1], s.color[2], s.color[3], 0.9)
  row.flash = row:CreateTexture(nil, "BORDER", nil, 1)
  row.flash:SetAllPoints()
  row.flash:SetColorTexture(1, 0.83, 0.29, 0)
  local icon = row:CreateTexture(nil, "ARTWORK")
  icon:SetSize(ROW_H - 4, ROW_H - 4)
  icon:SetPoint("LEFT", 4, 0)
  icon:SetTexture(d.icon)
  local border = row:CreateTexture(nil, "OVERLAY")
  border:SetTexture(BORDER)
  border:SetAllPoints(icon)
  border:SetVertexColor(QualityColor(d.quality))
  row.icon = icon
  local name = row:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  name:SetPoint("LEFT", icon, "RIGHT", 7, 0)
  name:SetPoint("RIGHT", row, "RIGHT", -76, 0)
  name:SetJustifyH("LEFT")
  if name.SetWordWrap then name:SetWordWrap(false) end
  name:SetText(d.name)
  name:SetTextColor(QualityColor(d.quality))
  local count = row:CreateFontString(nil, "OVERLAY", "NumberFontNormalLarge") -- (kept if the font below fails)
  count:SetFont(MORPHEUS, 16, "OUTLINE")
  count:SetPoint("RIGHT", -6, 0)
  count:SetTextColor(1, 0.82, 0)
  row.count = count
  -- "+N" just left of the count, bold and outlined (the stack badge steps aside while it shows)
  local plus = row:CreateFontString(nil, "OVERLAY", "NumberFontNormal")
  plus:SetFont("Fonts\\FRIZQT__.TTF", 13, "OUTLINE")
  plus:SetPoint("RIGHT", count, "LEFT", -5, 0)
  plus:SetTextColor(0.45, 1, 0.35)
  plus:SetShadowColor(0, 0, 0, 1)
  plus:SetShadowOffset(1, -1)
  plus:SetAlpha(0)
  row.plus = plus
  -- the full-stack badge: a small gold plate "×N"
  local badge = CreateFrame("Frame", nil, row)
  badge:SetSize(26, 15)
  badge:SetPoint("RIGHT", count, "LEFT", -5, 0)
  local plate = badge:CreateTexture(nil, "BACKGROUND")
  plate:SetPoint("TOPLEFT", -1, 1); plate:SetPoint("BOTTOMRIGHT", 1, -1)
  plate:SetColorTexture(0, 0, 0, 0.9)
  local gold = badge:CreateTexture(nil, "BORDER")
  gold:SetAllPoints()
  gold:SetTexture(WHITE)
  if not pcall(gold.SetGradient, gold, "VERTICAL", CreateColor(0.85, 0.65, 0.13, 1), CreateColor(1, 0.89, 0.54, 1)) then gold:SetVertexColor(1, 0.8, 0.3) end
  local bt = badge:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  bt:SetPoint("CENTER", 0, 0)
  bt:SetTextColor(0.1, 0.07, 0.02)
  bt:SetShadowOffset(0, 0)
  badge.text = bt
  badge:Hide()
  row.badge = badge
  -- the shine sweeps inside its own clipping frame (a frame clips its children, not its own textures)
  local clip = CreateFrame("Frame", nil, row)
  clip:SetAllPoints()
  if clip.SetClipsChildren then clip:SetClipsChildren(true) end
  local shine = CreateFrame("Frame", nil, clip)
  shine:SetSize(70, ROW_H)
  local st = shine:CreateTexture(nil, "OVERLAY")
  st:SetAllPoints()
  st:SetTexture(MEDIA .. "Shine.tga")
  st:SetBlendMode("ADD")
  st:SetVertexColor(1, 0.9, 0.6)
  shine:Hide()
  row.shine = shine
  row.n, row.plusN, row.plusT, row.testN = 0, 0, -999, 0
  row.maxStack = select(8, GetInfo(d.link or d.id or 0)) or 1
  row.price = select(11, GetInfo(d.link or d.id or 0)) or 0
  row.used = GetTime()
  return row
end
local function RemoveRow(row)
  row.dead = true -- (a piece still flying to it counts into a fresh row instead)
  row:Hide()
  for i, r in ipairs(rowList) do if r == row then table.remove(rowList, i); break end end
  for _, s in pairs(sections) do
    for i, r in ipairs(s.rows) do if r == row then table.remove(s.rows, i); break end end
  end
  for key, r in pairs(rows) do if r == row then rows[key] = nil end end
end

local function Row(d, k)
  local key = d.id or d.name
  local row = rows[key]
  if row then row.used = GetTime(); return row end
  if #rowList >= MAX_ROWS then -- drop the one updated longest ago
    local old
    for _, r in ipairs(rowList) do if not old or r.used < old.used then old = r end end
    RemoveRow(old)
  end
  local s = Section(k)
  row = NewRow(d, s)
  rows[key] = row
  rowList[#rowList + 1] = row
  s.rows[#s.rows + 1] = row
  Layout()
  row:SetAlpha(0)
  Tween(0.25, function(u) row:SetAlpha(u) end)
  return row
end

-- "+N" beside the row; gathers within MERGE_T seconds add up on the same label
local function Plus(row, n)
  local now = GetTime()
  row.plusN = (now - row.plusT < MERGE_T) and row.plusN + n or n
  row.plusT = now
  row.plus:SetText("+" .. row.plusN)
  local my = now
  row.plusAt = my
  Tween(1.9, function(u)
    if row.plusAt ~= my then return end
    local a = u < 0.75 and 1 or 1 - (u - 0.75) / 0.25
    row.plus:SetAlpha(a)
    row.badge:SetAlpha(1 - a)
    row.plus:SetTextHeight(13 * (u < 0.12 and 1.35 - 0.35 * u / 0.12 or 1))
  end)
end

local function Money(copper)
  if GetCoinTextureString then return GetCoinTextureString(copper) end
  return ns.MoneyName and ns.MoneyName(copper) or tostring(copper)
end

-- The pace and value line: "37 in 12 min · ~185/h" (the rate after two minutes), what the haul sells for
local function Meta()
  if not sessionStart then return end
  local secs = math.max(1, GetTime() - sessionStart)
  local text = ("%d in %d min"):format(sum, math.max(1, math.ceil(secs / 60)))
  if secs >= 120 then text = text .. (" · ~%d/h"):format(math.floor(sum * 3600 / secs + 0.5)) end
  paceText:SetText(text)
  valueText:SetText(value > 0 and ("worth " .. Money(value)) or "")
end

-- A full stack: the badge stamps on, a shine sweeps the row, glints, a chime
local function Milestone(row, stacks)
  row.plusAt = nil -- the "+N" steps aside at once so the stamp is seen
  row.plus:SetAlpha(0)
  row.badge.text:SetText("×" .. stacks)
  row.badge:SetWidth(row.badge.text:GetStringWidth() + 10)
  row.badge:Show()
  Tween(0.42, function(u)
    local s = u < 0.6 and 2.2 - 1.3 * u / 0.6 or 0.9 + 0.1 * (u - 0.6) / 0.4
    row.badge:SetScale(s)
    row.badge:SetAlpha(math.min(1, u / 0.3))
  end)
  row.shine:Show()
  Tween(0.7, function(u)
    row.shine:ClearAllPoints()
    row.shine:SetPoint("LEFT", row, "LEFT", -70 + (ROW_W + 80) * u, 0)
    if u >= 1 then row.shine:Hide() end
  end)
  Tween(1.1, function(u) row.flash:SetAlpha(0.35 * (1 - u)) end)
  local l, b, w, h = row:GetLeft(), row:GetBottom(), row:GetWidth(), row:GetHeight()
  if l then
    local k = row:GetEffectiveScale() / UIParent:GetEffectiveScale()
    for i = 1, 8 do Glint((l + R(10, w - 10)) * k, (b + R(0, h)) * k, R(12, 18), 1, 0.89, 0.54, 0.5, i * 0.05) end
  end
  ns:PlayGatherStack()
end

-- test: from a test button (kept apart: the next real gather takes them back out)
local testSum = 0
local function Count(row, add, test)
  local before = row.n
  row.n = row.n + add
  sum = sum + add
  value = value + add * (row.price or 0)
  if test then row.testN = row.testN + add; testSum = testSum + add end
  row.count:SetText(row.n)
  total:SetText(sum)
  Meta()
  Tween(0.22, function(u) local w = 1 - u; row.count:SetTextColor(1, 0.82 + 0.18 * w, w) end)
  local size = row.maxStack or 1
  if size > 1 and math.floor(row.n / size) > math.floor(before / size) then Milestone(row, math.floor(row.n / size)) end
end

-- The first real gather after tests: the test amounts come back out (rows only tests filled go away)
local function ClearTests()
  if testSum == 0 then return end
  for i = #rowList, 1, -1 do
    local row = rowList[i]
    if row.testN > 0 then
      row.n = row.n - row.testN
      sum = sum - row.testN
      value = value - row.testN * (row.price or 0)
      row.testN = 0
      if row.n <= 0 then RemoveRow(row) else row.count:SetText(row.n) end
    end
  end
  testSum = 0
  if sum <= 0 then sum, value, sessionStart = 0, 0, nil end
  total:SetText(sum > 0 and sum or "")
  Layout()
  paceText:SetText(""); valueText:SetText("")
  Meta()
end

local function ShowTally()
  if ns.settings.noGatherTally then return false end
  lastShown, dismissedAt = GetTime(), nil
  tally:SetAlpha(1)
  tally:Show()
  return true
end

-- A piece flying from the node into its row (icon + border pairs, reused). style: "flip" (a fish turns
-- over), "flop" (a hide wobbles), or nil
local pieces = {}
local function Piece()
  for _, p in ipairs(pieces) do if not p.busy then p.busy = true; return p end end
  local p = { t = layer:CreateTexture(nil, "OVERLAY"), b = layer:CreateTexture(nil, "OVERLAY", nil, 1), busy = true }
  p.b:SetTexture(BORDER)
  p.b:SetAllPoints(p.t)
  pieces[#pieces + 1] = p
  return p
end
local function Fly(icon, x0, y0, row, delay, style, onArrive)
  local p = Piece()
  local t, b = p.t, p.b
  t:SetTexture(icon)
  t:Hide(); b:Hide()
  Tween(0.6, function(u)
    local x1, y1 = row.icon:GetCenter()
    local k = row:GetEffectiveScale() / UIParent:GetEffectiveScale()
    x1, y1 = (x1 or x0) * k, (y1 or y0) * k
    local e = u * u * (3 - 2 * u)
    local s = 22 * (1 - 0.45 * u)
    local rot = 0
    if style == "flip" then rot = -2 * math.pi * math.min(1, u * 1.4)
    elseif style == "flop" then rot = 0.4 * math.sin(u * 14) * (1 - u) end
    t:ClearAllPoints()
    t:SetPoint("CENTER", UIParent, "BOTTOMLEFT", x0 + (x1 - x0) * e, y0 + (y1 - y0) * e + 75 * math.sin(math.pi * u))
    t:SetSize(s, s)
    t:SetRotation(rot); b:SetRotation(rot)
    t:Show(); b:Show()
    if u >= 1 then t:Hide(); b:Hide(); t:SetRotation(0); b:SetRotation(0); p.busy = false; onArrive() end
  end, delay)
end
local FLIGHT = { fish = "flip", skin = "flop" }

---------------------------------------------------------------------------
-- A gathered item (from the loot feed, or a test). Each gather (one loot window) bursts and plays its
-- note once; every item flies into the window.
---------------------------------------------------------------------------
function ns.Gathered(d, k, id, x, y)
  if not layer then return end
  k = BURST[k] and k or (BURST[kind or ""] and kind) or "herb"
  id = id or lootId
  x, y = x or nodeX, y or nodeY
  if not x then x, y = NodePoint() end
  local rare = (d.quality or 1) >= 2 or d.rare
  local now = GetTime()
  local test = id > TEST_FIRST
  -- a test is shown above the settings window (the window drops back down when it fades)
  if test then tally:SetFrameStrata("FULLSCREEN_DIALOG") end
  if id ~= poppedId then -- the gather itself: burst, note, calm count
    poppedId = id
    if not test then hist[#hist + 1] = now end
    local calm = Calm()
    if now - lastGather >= NOTE_RESET then step = 0 end
    lastGather = now
    step = step + 1
    local quiet = calm and not rare
    BURST[k](x, y, rare, quiet and 0.4 or 1, quiet, d.icon)
    if not quiet and not ns.settings.noGatherNotes then ns:PlayGatherNote(step) end
  elseif rare then
    RARE[k](x, y, false, d.icon)
  end
  if not d.name or not ShowTally() then return end
  if not test then ClearTests() end
  sessionStart = sessionStart or now
  local row = Row(d, k)
  local n = d.count or 1
  Plus(row, n)
  local count = math.min(n, 3)
  local wait = rare and (k == "fish" and 0.9 or 0.4) or 0.12
  for i = 1, count do
    local add = (i == count) and (n - count + 1) or 1
    Fly(d.icon, x, y + 10, row, wait + (i - 1) * 0.09, FLIGHT[k], function()
      if row.dead then row = Row(d, k) end -- (its row was dropped while this piece flew)
      Count(row, add, test)
    end)
  end
end

---------------------------------------------------------------------------
-- Setup, events, tests
---------------------------------------------------------------------------
local function Create()
  layer = CreateFrame("Frame", nil, UIParent)
  layer:SetAllPoints(UIParent)
  layer:SetFrameStrata("FULLSCREEN_DIALOG") -- bursts and flying pieces (above the settings window for tests)
  layer:SetFrameLevel(100) -- (above the window too, when a test raises it to the same strata)
  layer:SetScript("OnUpdate", Step)
  tally = CreateFrame("Frame", nil, UIParent)
  tally:SetFrameStrata("MEDIUM")
  tally:SetSize(ROW_W, TOP_H)
  tally:Hide()
  -- right-click sends it away until the next gather (only clicks on it are caught; it's small)
  tally:EnableMouse(true)
  tally:SetScript("OnMouseUp", function(_, button) if button == "RightButton" then Dismiss() end end)
  tally:SetScript("OnEnter", function(self)
    ns.Tooltip():SetOwner(self, "ANCHOR_LEFT")
    ns.Tooltip():SetText("Harvest", 1, 0.82, 0)
    ns.Tooltip():AddLine("What you gathered this session, how fast, and what it sells for at a vendor. Right-click to hide it; it comes back on your next gather.", 1, 1, 1, true)
    ns.Tooltip():Show()
  end)
  tally:SetScript("OnLeave", function(self) if ns.Tooltip():IsOwned(self) then ns.Tooltip():Hide() end end)
  header = tally:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  header:SetPoint("TOPLEFT", 4, 0)
  header:SetText("Harvest")
  total = tally:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  total:SetPoint("TOPRIGHT", -6, 0)
  total:SetText("")
  paceText = tally:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  paceText:SetPoint("TOPLEFT", 4, -15)
  paceText:SetTextColor(0.73, 0.69, 0.6)
  valueText = tally:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  valueText:SetPoint("TOPRIGHT", -6, -15)
  local wantSample, sampleRow
  ns.Mover.Register({ key = "tally", frame = tally, label = "Harvest window", point = "TOPRIGHT", x = -18, y = -230,
    w = ROW_W, h = 90, preview = function(on)
      if ns.settings.noGatherTally then return end
      if on then -- a sample row while it's being placed (when the window is empty)
        if #rowList == 0 and not wantSample then
          wantSample = true
          ns.ItemData(2447, 1, "test", function(d)
            if wantSample and #rowList == 0 then sampleRow = Row(d, "herb"); sampleRow.count:SetText("12") end
          end)
        end
        tally:SetAlpha(1); tally:Show()
      else
        wantSample = false
        if sampleRow then -- take the sample out (unless a real gather counted into it meanwhile)
          if sampleRow.n == 0 then RemoveRow(sampleRow); Layout() else sampleRow.count:SetText(sampleRow.n) end
          sampleRow = nil
        end
        if #rowList == 0 then tally:Hide() end
        lastShown = GetTime()
      end
    end })
end

ns.OnInit(function()
  Create()
  ns:RegisterEvents("LOOT_READY", "LOOT_OPENED", "LOOT_CLOSED", "PLAYER_REGEN_DISABLED")
  -- a fight starts: the window steps out of the way (back on the next gather)
  local regen = ns.PLAYER_REGEN_DISABLED
  ns.PLAYER_REGEN_DISABLED = function(self, ...)
    if regen then regen(self, ...) end
    Dismiss()
  end
  -- LootFeed.lua handles LOOT_OPENED and LOOT_CLOSED too: run both
  local opened, closed = ns.LOOT_OPENED, ns.LOOT_CLOSED
  ns.LOOT_OPENED = function(self, ...)
    if opened then opened(self, ...) end
    lootOpen = true
    OnLootReady() -- (once per window: a no-op after LOOT_READY)
  end
  ns.LOOT_CLOSED = function(self, ...)
    if closed then closed(self, ...) end
    lootOpen, detected = false, false
    kindUntil = GetTime() + GRACE
  end
end)

function ns:LOOT_READY() OnLootReady() end

-- Test gathers (settings page): kind = herb / ore / fish / skin; rare: a find with the big burst
local TEST_ITEMS = { herb = { 2447, 765 }, ore = { 2770, 2835 }, fish = { 6291 }, skin = { 2318 } }
local TEST_RARE = { herb = 818, ore = 818, fish = 818, skin = 818 } -- Tigerseye (Uncommon)
local testId = TEST_FIRST
local function TestGather(k, rare, count)
  if not layer then return end
  testId = testId + 1
  local id = testId
  local w, h = UIParent:GetWidth(), UIParent:GetHeight()
  local x, y = w / 2 - 140, h * 0.42
  local items = TEST_ITEMS[k] or TEST_ITEMS.herb
  ns.ItemData(items[1 + (count and 0 or math.random(#items) - 1)], count or math.random(1, 3), "test", function(d) ns.Gathered(d, k, id, x, y) end)
  if rare then
    ns.ItemData(TEST_RARE[k] or 818, 1, "test", function(d)
      d.rare, d.test = true, true -- (a test popup shows above the settings window)
      ns.Gathered(d, k, id, x, y)
      if ns.MinQuality and (d.quality or 0) >= ns.MinQuality() and not ns.settings.noPopup then ns:ShowLoot(d) end
    end)
  end
end
ns.AddAction("testgather", function(arg)
  local k, mode = arg:match("^(%a+)%s*(%a*)$")
  k = TEST_ITEMS[k] and k or "herb"
  if mode == "run" then
    for i = 0, 4 do C_Timer.After(i * 0.3, function() TestGather(k) end) end
  elseif mode == "stack" then -- tops the first item up to just under a full stack, then gathers into it
    local d0 = TEST_ITEMS[k][1]
    ns.ItemData(d0, 1, "test", function(d)
      if not ShowTally() then return end
      local row = Row(d, k)
      local size = row.maxStack or 20
      local need = size - row.n % size
      if need > 3 then Count(row, need - 3, true) end
      C_Timer.After(0.3, function() TestGather(k, false, 3) end)
    end)
  else
    TestGather(k, mode == "rare")
  end
end)

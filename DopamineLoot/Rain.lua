-- Dopamine Loot loot rain: a burst of loot sprays up from the middle of the screen, falls, and
-- bounces on an invisible trampoline. Items launch worst first; the best waits a beat, flies
-- higher and lands in the middle. When it settles, the good stuff (Rare+ by default) becomes
-- popups and the rest is pulled into your bag. Money rains as coins with a rolling total.
-- Every flourish is a switch on the "Loot rain effects" page (ns.RAIN_FX; /dl rainfx).
-- The physics, launch timing, spacing and order are pure functions (ns.RainCore) tested offline by
-- tools/test_rain.lua; the drawing below drives plain textures from one OnUpdate.
local _, ns = ...

local Core = {}
ns.RainCore = Core

Core.GRAVITY = -1800     -- px/s^2
Core.MIN_BOUNCE = 170    -- below this vertical speed a sprite stops bouncing and rests
Core.FRICTION = 0.82     -- sideways speed kept per bounce
Core.BEST_VY = 1150      -- the best item's launch speed: peaks around 85% of the screen height

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

-- How big a haul is, for the chest's opening sound: "big" with anything Rare or better, "medium"
-- from 6 items or 1 gold, else "small" (a few grays, whites or greens and some copper)
function Core.HaulSize(items, copper)
  for _, it in ipairs(items) do if (it.quality or 0) >= 3 then return "big" end end
  if #items >= 6 or (copper or 0) >= 10000 then return "medium" end
  return "small"
end

-- The container a haul comes out of (the chest show): the loot pouch for a small haul, the treasure
-- chest for the rest (medium: a quick pop open; big: it shakes while the light in its seams climbs
-- the rarities to the best one, then the lid bursts off), the golden chest with a Legendary in it.
-- opts = {shake, tease} (the switches). Returns {kind, size, best, shakeT, steps}.
function Core.BoxPlan(items, copper, opts)
  local size, best = Core.HaulSize(items, copper), -1
  for _, it in ipairs(items) do best = math.max(best, it.quality or 0) end
  local kind = best >= 5 and "gold" or size == "small" and "pouch" or "chest"
  local shakeT = kind == "pouch" and 0.22 or kind == "gold" and 1.3 or size == "big" and 0.9 or 0.35
  if kind ~= "pouch" and not opts.shake then shakeT = 0.15 end
  local steps, top = {}, math.max(best, 1)
  if opts.tease and (kind == "gold" or size == "big") then
    for q = 1, top do steps[#steps + 1] = q end
  else
    steps[1] = kind == "chest" and 1 or top
  end
  return { kind = kind, size = size, best = best, shakeT = shakeT, steps = steps }
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

---------------------------------------------------------------------------
-- Drawing (game only)
---------------------------------------------------------------------------
if not CreateFrame then return end

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local WHITE = "Interface\\Buttons\\WHITE8X8"
-- the game's own coin icons (the money frame's), bigger for better metal
local COIN = {
  gold = { file = "Interface\\MoneyFrame\\UI-GoldIcon", size = 24 },
  silver = { file = "Interface\\MoneyFrame\\UI-SilverIcon", size = 21 },
  copper = { file = "Interface\\MoneyFrame\\UI-CopperIcon", size = 19 },
}
local SIZE, MAX_SPRITES = 40, 40
local FADE_T, SQUASH_T, SETTLE_HOLD = 0.6, 0.09, 0.7
local GHOSTS, GHOST_EVERY, DUST = 6, 0.035, 7
local BEST_PAUSE, STOP_T, SHAKE_T, PULSE_T = 0.55, 0.22, 0.3, 0.6
local GATHER_T, JOIN_T, FLASH_T = 0.45, 0.32, 0.4

-- The effects, each a switch (setting "noRain" .. key; all on by default)
ns.RAIN_FX = {
  { key = "Best", word = "best", label = "Best item last", tip = "The best item waits a beat, flies higher and lands in the middle, then becomes its popup." },
  { key = "Escalate", word = "escalate", label = "Escalation", tip = "Launches start slow and speed up; each landing tick is a little higher in pitch." },
  { key = "Pulse", word = "pulse", label = "Epic edge glow", tip = "The edges of the screen glow in the item's color when an Epic or better lands." },
  { key = "Spacing", word = "spacing", label = "Spacing", tip = "Resting items spread out side by side instead of piling up." },
  { key = "Dust", word = "dust", label = "Dust puff", tip = "A small puff of dust where an item first hits the ground." },
  { key = "Gather", word = "gather", label = "Gather into the bag", tip = "When it settles, what doesn't stay as a popup flies into your backpack." },
  { key = "Trails", word = "trails", label = "Trails", tip = "Rare and better items leave a fading trail in their color." },
  { key = "Coins", word = "coins", label = "Coins", tip = "Money you loot rains as coins, with a total that counts up." },
  { key = "Merge", word = "merge", label = "Coins merge up", tip = "Gold arrives as a pile of silver (silver as copper) that joins up into it once it lands; the change stays as it is." },
  { key = "Shadows", word = "shadows", label = "Floor shadows", tip = "A soft shadow under each item, smaller the higher it flies." },
  { key = "Beam", word = "beam", label = "Loot beam", tip = "A pillar of light over resting Rare and better items, taller for the best one." },
  { key = "Hitstop", word = "hitstop", label = "Hit-stop", tip = "A split second of slow motion and a small shake when the best item lands." },
  { key = "Names", word = "names", label = "Name labels", tip = "Rare and better items show their name while they rest." },
  { key = "Chest", word = "chest", label = "Treasure chest", tip = "Loot comes out of a container: a pouch for small hauls, the treasure chest for bigger ones, a golden chest for a Legendary." },
  { key = "Models", word = "models", label = "Game chests (3D)", tip = "The pouch, chest and golden chest are the game's own 3D sack and chests, and the lid really opens. Off: our drawn ones." },
  { key = "Shake", word = "shake", label = "Chest shake", tip = "The chest rattles before it opens, longer for better hauls." },
  { key = "Tease", word = "tease", label = "Rarity tease", tip = "While it shakes, light from the chest's seams climbs white, green, blue, purple... up to the best item inside." },
  { key = "Burst", word = "burst", label = "Lid burst", tip = "On a big haul the lid flies off and rays of light in the best item's color shine out." },
  { key = "Escape", word = "escape", label = "Skip with Escape", tip = "Escape ends the rain at once; the good items still become popups." },
}
-- The switches, read once per frame (RefreshFx) rather than per sprite
local fxOn = {}
local function RefreshFx()
  for _, fx in ipairs(ns.RAIN_FX) do fxOn[fx.key] = not ns.settings["noRain" .. fx.key] end
end
local function On(key) return fxOn[key] end

ns.AddToggle("rain", "noRain", "loot rain")
local OPEN_NAMES = { size = "by haul size", always = "always the big sound", never = "never" }
ns.AddCommand("opensound", "the treasure chest's opening sound: /dl opensound [size | always | never]", function(arg)
  arg = (arg or ""):lower():match("%S+")
  if OPEN_NAMES[arg] then
    ns.settings.openSound = arg ~= "size" and arg or nil
    if ns.UI then ns.UI.Refresh() end
  end
  ns.Print("treasure chest opening sound: " .. OPEN_NAMES[ns.settings.openSound or "size"])
  ns:ShowLog()
end)

ns.AddCommand("rainfx", "loot rain effects: /dl rainfx [name off|on]", function(arg)
  local word, value = (arg or ""):lower():match("^(%S+)%s+(%S+)$")
  for _, fx in ipairs(ns.RAIN_FX) do
    if word == fx.word and (value == "on" or value == "off") then
      ns.settings["noRain" .. fx.key] = value == "off" or nil
      if ns.UI then ns.UI.Refresh() end
      ns.Print(("%s: %s"):format(fx.label, value))
      return ns:ShowLog()
    end
  end
  ns.Print("loot rain effects (/dl rainfx <name> off|on):")
  for _, fx in ipairs(ns.RAIN_FX) do
    ns.Print(("  %s (%s): %s"):format(fx.word, fx.label, ns.settings["noRain" .. fx.key] and "off" or "on"))
  end
  ns:ShowLog()
end)

local layer, top, driver, escFrame
local box, HideBox, LoadGameBox -- the chest show's container (further down)
local sprites, pool, dust = {}, {}, {}
local bounds = {}
local state -- nil | the running rain (see ns:Rain)
local lastTick = 0
local Skip

local function Layer()
  if layer then return layer end
  layer = CreateFrame("Frame", nil, UIParent)
  layer:SetAllPoints(UIParent)
  layer:SetFrameStrata("FULLSCREEN_DIALOG")
  layer:EnableMouse(false)
  -- in front of the sprites: names, the counter, the money total, the bag glow, the edge pulse
  top = CreateFrame("Frame", nil, layer)
  top:SetAllPoints()
  top:SetFrameLevel(layer:GetFrameLevel() + 20)
  layer.count = top:CreateFontString(nil, "OVERLAY", "GameFontNormalHuge")
  layer.money = top:CreateFontString(nil, "OVERLAY", "GameFontHighlightLarge")
  layer.money:SetPoint("TOP", layer.count, "BOTTOM", 0, -4)
  layer.pulse = top:CreateTexture(nil, "BACKGROUND")
  layer.pulse:SetTexture(MEDIA .. "Vignette")
  layer.pulse:SetAllPoints()
  layer.pulse:Hide()
  layer.bagGlow = top:CreateTexture(nil, "ARTWORK")
  layer.bagGlow:SetTexture(MEDIA .. "Glow")
  layer.bagGlow:SetBlendMode("ADD")
  layer.bagGlow:SetVertexColor(1, 0.85, 0.4)
  layer.bagGlow:Hide()
  layer.flashTex = {} -- merge flashes, made as needed
  driver = CreateFrame("Frame")
  -- Escape: a named frame in UISpecialFrames, shown while it rains; Escape hides it, which skips
  escFrame = CreateFrame("Frame", "DopamineLootRainSkip", UIParent)
  escFrame:SetSize(1, 1)
  escFrame:Hide()
  -- (hidden with the UI too, on Alt+Z or a cinematic: only a real Escape skips)
  escFrame:SetScript("OnHide", function() if state and UIParent:IsShown() then Skip() end end)
  if UISpecialFrames then table.insert(UISpecialFrames, "DopamineLootRainSkip") end
  -- the UI back after Alt+Z or a cinematic: the game's container dropped its model while hidden
  layer:HookScript("OnShow", function()
    if state and state.box and state.box.game and not state.box.hidden then LoadGameBox(state.box) end
  end)
  return layer
end

local function Tex(parent, layerName, file, blend)
  local t = parent:CreateTexture(nil, layerName)
  t:SetTexture(file)
  if blend then t:SetBlendMode(blend) end
  t:Hide()
  return t
end

local function Sprite()
  local s = table.remove(pool)
  if s then return s end
  local f = CreateFrame("Frame", nil, Layer())
  f:SetFrameLevel(layer:GetFrameLevel() + 5)
  -- all three layers hang off the frame's edges, so the squash stretches them together, and
  -- each gets the same rotation (a plain color texture wouldn't rotate, so the edge is a file)
  f.edge = f:CreateTexture(nil, "BACKGROUND")
  f.edge:SetTexture(WHITE)
  f.edge:SetAllPoints()
  f.icon = f:CreateTexture(nil, "ARTWORK")
  f.icon:SetPoint("TOPLEFT", 2, -2)
  f.icon:SetPoint("BOTTOMRIGHT", -2, 2)
  f.icon:SetTexCoord(0.07, 0.93, 0.07, 0.93)
  f.glow = f:CreateTexture(nil, "OVERLAY")
  f.glow:SetTexture("Interface\\Buttons\\UI-ActionButton-Border")
  f.glow:SetBlendMode("ADD")
  f.glow:SetPoint("TOPLEFT", -SIZE * 0.4, SIZE * 0.4)
  f.glow:SetPoint("BOTTOMRIGHT", SIZE * 0.4, -SIZE * 0.4)
  -- behind the sprites (on the layer): its shadow, its beam and its trail
  s = { f = f, ghosts = {} }
  s.shadow = Tex(layer, "BACKGROUND", MEDIA .. "Disc")
  s.shadow:SetVertexColor(0, 0, 0, 1)
  s.beam = Tex(layer, "BORDER", MEDIA .. "Pillar", "ADD")
  for i = 1, GHOSTS do s.ghosts[i] = Tex(layer, "ARTWORK", WHITE, "ADD") end
  s.name = top:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  s.name:SetShadowColor(0, 0, 0, 1)
  s.name:SetShadowOffset(1, -1)
  s.name:Hide()
  return s
end

local function Release(s)
  s.f:Hide()
  s.shadow:Hide()
  s.beam:Hide()
  s.name:Hide()
  for _, g in ipairs(s.ghosts) do g:Hide() end
  s.ghostsShown = false
  pool[#pool + 1] = s
end

local function Tick(quality)
  local now = GetTime()
  if now - lastTick < 0.07 then return end -- many bounces at once would be a buzz
  lastTick = now
  if quality >= 3 then ns:PlayTierSound(quality) else ns:PlayBounceSound() end
end

local function MoneyText(copper)
  if GetCoinTextureString then return GetCoinTextureString(copper) end
  local g, s, c = math.floor(copper / 10000), math.floor(copper / 100) % 100, copper % 100
  return (g > 0 and g .. "g " or "") .. ((g > 0 or s > 0) and s .. "s " or "") .. c .. "c"
end

-- The backpack button's middle in the layer's coordinates (bottom right if it's hidden)
local function BagPoint()
  local b = _G.MainMenuBarBackpackButton
  if b and b:IsVisible() then
    local x, y = b:GetCenter()
    if x then
      local r = b:GetEffectiveScale() / layer:GetEffectiveScale()
      return x * r, y * r
    end
  end
  return layer:GetWidth() - 60, 40
end

local function Finish()
  local st = state
  state = nil -- first: hiding the Escape frame below must not skip again
  for _, s in ipairs(sprites) do Release(s) end
  wipe(sprites)
  for _, d in ipairs(dust) do d:Hide() end
  if layer then
    layer.count:SetAlpha(0)
    layer.money:SetAlpha(0)
    layer.pulse:Hide()
    layer.bagGlow:Hide()
    for _, t in ipairs(layer.flashTex) do t:Hide() end
    HideBox()
    layer:ClearAllPoints()
    layer:SetAllPoints(UIParent)
  end
  if escFrame and escFrame:IsShown() then escFrame:Hide() end
  if driver then driver:SetScript("OnUpdate", nil) end
  return st
end

-- Escape: end now; what would have stayed still becomes popups, one after another
function Skip()
  local st = Finish()
  if not st then return end
  local keep = {}
  for _, item in ipairs(st.all) do
    if not st.handedOff[item] and Core.Stays(item, st.stayQuality) then keep[#keep + 1] = item end
  end
  for i, item in ipairs(keep) do C_Timer.After((i - 1) * 0.15, function() ns:ShowLoot(item) end) end
end

local function Launch(st, item, isBest, W, H, k)
  local s = Sprite()
  s.item, s.coin, s.best = item, item.coin, isBest
  s.q = item.coin and 0 or (item.quality or 1)
  s.size = item.coin and COIN[item.coin].size or SIZE
  s.x, s.y = W / 2 + math.random(-20, 20), math.max(H * 0.38, bounds.floor + H * 0.13)
  s.vx = math.random(-320, 320) * k
  s.vy = (math.random(650, 950) + (s.q >= 3 and 150 or 0)) * k -- the good stuff flies higher
  s.e = 0.45 + math.random() * 0.2
  s.spin = (math.random() - 0.5) * 8
  if s.coin then s.vy, s.e = math.random(500, 850) * k, 0.5 end
  if isBest then s.x, s.vx, s.vy, s.e, s.spin = W / 2, 0, Core.BEST_VY * k, 0.5, 0 end
  s.rot, s.bounces, s.resting, s.squash = 0, 0, false, 0
  s.tx, s.leaving, s.leaveAt, s.handed, s.inBag, s.alpha, s.shrink = nil, nil, nil, nil, nil, 1, 1
  s.restAge, s.trailT, s.trail = 0, 0, {}
  s.joining, s.mx, s.my, s.delay = nil, nil, nil, nil
  local r, g, b = ns.QualityColor(s.q)
  s.r, s.g, s.b = r, g, b
  s.f.edge:SetVertexColor(r, g, b, 1)
  -- a coin is just the game's coin icon, round, no box; an item is its icon in a quality frame
  local icon = s.f.icon
  icon:ClearAllPoints()
  if s.coin then
    s.f.edge:Hide()
    icon:SetAllPoints()
    icon:SetTexCoord(0, 1, 0, 1)
    icon:SetTexture(COIN[item.coin].file)
  else
    s.f.edge:Show()
    icon:SetPoint("TOPLEFT", 2, -2)
    icon:SetPoint("BOTTOMRIGHT", -2, 2)
    icon:SetTexCoord(0.07, 0.93, 0.07, 0.93)
    icon:SetTexture(item.icon or "Interface\\Icons\\INV_Misc_QuestionMark")
  end
  s.f.glow:SetVertexColor(r, g, b)
  s.f.glow:SetShown(s.q >= 3)
  s.shadow:SetShown(On("Shadows"))
  s.beam:SetVertexColor(r, g, b, 1)
  for _, gh in ipairs(s.ghosts) do gh:SetVertexColor(r, g, b, 1) end
  s.name:SetText(not s.coin and item.name or "")
  s.name:SetTextColor(r, g, b)
  s.f:SetAlpha(1)
  s.f:Show()
  sprites[#sprites + 1] = s
  -- leaving the treasure chest: a whoosh that climbs through the burst (the best has its moment
  -- on landing; a coin made by a merge has its chime)
  if not isBest and not item.merged then
    if s.coin then st.coinsOut = st.coinsOut + 1 else st.itemsOut = st.itemsOut + 1 end
    ns:PlayLaunchSound(s.coin, s.coin and st.coinsOut or st.itemsOut)
  end
  return s
end

local function Puff(x, y)
  for _ = 1, DUST do
    local d
    for _, c in ipairs(dust) do if not c:IsShown() then d = c; break end end
    if not d then
      d = Tex(layer, "ARTWORK", MEDIA .. "Mote")
      d:SetVertexColor(0.75, 0.68, 0.58, 1)
      dust[#dust + 1] = d
    end
    d.x, d.y = x + (math.random() - 0.5) * SIZE, y
    d.vx, d.vy, d.age = (math.random() - 0.5) * 140, 20 + math.random() * 50, 0
    d:Show()
  end
end

local function OnLand(st, s)
  if s.coin then
    if s.item.merged then return end -- its chime already rang
    st.coinsLanded = st.coinsLanded + 1
    ns:PlayClink(st.coinsLanded) -- a clink a step higher per coin down
    return
  end
  st.landed = st.landed + 1
  if s.best and On("Hitstop") then st.stopT, st.shake = STOP_T, SHAKE_T end
  if s.q >= 3 then Tick(s.q)
  elseif On("Escalate") then ns:PlayStepTick(st.landed)
  else Tick(0) end
  if On("Dust") then Puff(s.x, bounds.floor) end
  if On("Pulse") and s.q >= 4 then
    st.pulseAge = 0
    layer.pulse:SetVertexColor(s.r, s.g, s.b, 1)
  end
end

-- Everything down, coins that merge up first: each pile gathers on its middle, one after another
local function StartMerge(st)
  st.mergeStarted, st.hold = true, 0
  for i, m in ipairs(st.merges) do
    m.members = {}
    local sum = 0
    for _, s in ipairs(sprites) do
      if s.coin and s.item.group == m.group and not s.leaving then
        m.members[#m.members + 1] = s
        sum = sum + s.x
      end
    end
    if m.members[1] then
      m.x = sum / #m.members
      m.at = st.age + (i - 1) * 0.28
      for j, s in ipairs(m.members) do
        s.joining, s.mx, s.my, s.delay, s.tx = m, s.x, s.y, (j - 1) * 0.02, nil
      end
    else
      m.done = true
    end
  end
end

-- Everything down: the good stuff becomes popups (left to right), the rest gathers or fades
local function Settle(st)
  st.settleAt = st.age
  local order = {}
  for _, s in ipairs(sprites) do order[#order + 1] = s end
  table.sort(order, function(a, b) return a.x < b.x end)
  local pd, gd = 0, 0
  for _, s in ipairs(order) do
    if not s.coin and Core.Stays(s.item, st.stayQuality) then
      s.leaving, s.leaveAt, pd = "popup", st.age + pd, pd + 0.15
    elseif On("Gather") then
      s.leaving, s.leaveAt, gd = "gather", st.age + 0.35 + gd, gd + 0.045
      s.sx, s.sy = s.x, s.y
    else
      s.leaving, s.leaveAt = "fade", st.age + 0.35
    end
  end
end

---------------------------------------------------------------------------
-- The chest show: the container the rain comes out of (Core.BoxPlan picks it). Every layer is a
-- 128-unit square with the same center, so they stack, tint apart (wood, iron, gold) and turn
-- together; the chest's seam is 0.1 of its size above the center, the pouch's mouth 0.22.
---------------------------------------------------------------------------
local BOX = 128
local WOOD, WOOD_LID, PLANK, IRON = { 0.42, 0.27, 0.14 }, { 0.5, 0.32, 0.17 }, { 0.22, 0.13, 0.06 }, { 0.3, 0.3, 0.33 }
local GOLD, GOLD_LID, GOLD_PLANK, GOLD_TRIM = { 0.8, 0.6, 0.16 }, { 0.86, 0.65, 0.2 }, { 0.55, 0.4, 0.1 }, { 1, 0.93, 0.6 }
-- (box, the frame and its layers, is made once by MakeBox)

-- The game's own containers (switch "Models"; picked by the user on the Blizzard assets page): the
-- model file, the size of its frame and its camera distance. The chests stand shut on animation 0, play 148 to open and
-- hold 149 open (146 closes, 147 holds shut); the sack has no animations, so it is jiggled by hand.
local GAME_BOX = {
  pouch = { file = 200442, size = 150, cam = 1 }, -- Stolen Supply Sack
  chest = { file = 219372, size = 210, cam = 1 }, -- Strongbox
  gold = { file = 200953, size = 250, cam = 2.6 },  -- the large ornate chest (a big model: camera pulled back)
}
local ANIM_SHUT, ANIM_OPEN, ANIM_OPENED, ANIM_OPEN_T = 0, 148, 149, 0.6
local MODEL_WAIT = 0.6 -- not loaded by then: our drawn container takes over

local function MakeBox()
  box = CreateFrame("Frame", nil, layer)
  box:SetAllPoints()
  box:SetFrameLevel(layer:GetFrameLevel() + 2) -- behind the sprites: they come out of it
  local function T(file, lay, _, blend) return Tex(box, lay, MEDIA .. file, blend) end -- sublevels set below
  box.rays = T("Rays", "BACKGROUND", nil, "ADD")
  box.inner = T("Glow", "BORDER", nil, "ADD")
  box.body, box.planks = T("ChestBody", "ARTWORK"), T("ChestPlanks", "ARTWORK")
  box.bands, box.lock = T("ChestBands", "ARTWORK"), T("ChestLock", "ARTWORK")
  box.seam = T("ChestSeam", "OVERLAY", nil, "ADD")
  box.lid, box.lidBands = T("ChestLid", "OVERLAY"), T("ChestLidBands", "OVERLAY")
  box.pBody, box.pShade = T("PouchBody", "ARTWORK"), T("PouchShade", "ARTWORK")
  box.pString, box.pMouth = T("PouchString", "ARTWORK"), T("PouchMouth", "OVERLAY")
  box.planks:SetDrawLayer("ARTWORK", 1); box.bands:SetDrawLayer("ARTWORK", 2); box.lock:SetDrawLayer("ARTWORK", 3)
  box.lidBands:SetDrawLayer("OVERLAY", 2)
  box.pShade:SetDrawLayer("ARTWORK", 1); box.pString:SetDrawLayer("ARTWORK", 2)
  box.chest = { box.body, box.planks, box.bands, box.lock }
  box.lidParts = { box.lid, box.lidBands }
  box.pouch = { box.pBody, box.pShade, box.pString }
  box.sparks = {}
  for i = 1, 6 do box.sparks[i] = T("Mote", "OVERLAY", nil, "ADD") end
  box.all = { box.rays, box.inner, box.seam, box.pMouth }
  for _, list in ipairs({ box.chest, box.lidParts, box.pouch, box.sparks }) do
    for _, t in ipairs(list) do box.all[#box.all + 1] = t end
  end
  -- the game's container: above the glows behind it, below the sprites coming out of it; the light
  -- inside an open chest sits in front of the model (still behind the sprites)
  local m = CreateFrame("PlayerModel", nil, box)
  m:SetFrameLevel(box:GetFrameLevel() + 1)
  m:SetScript("OnModelLoaded", function(self) self.loaded, self.anim = true, nil end) -- anim set again
  m:Hide()
  box.model = m
  box.front = CreateFrame("Frame", nil, box)
  box.front:SetAllPoints()
  box.front:SetFrameLevel(box:GetFrameLevel() + 2)
  box.light = Tex(box.front, "ARTWORK", MEDIA .. "Glow", "ADD")
  box.all[#box.all + 1] = box.light
end

function HideBox()
  if box then
    for _, t in ipairs(box.all) do t:Hide() end
    box.model:Hide()
  end
end

-- Load the game's container (b.game) into the model frame, placed and sized first (models load
-- for the frame they're in), shown, cleared, then set; OnModelLoaded marks it ready
function LoadGameBox(b)
  local m, g = box.model, b.game
  m:ClearAllPoints()
  m:SetPoint("CENTER", layer, "BOTTOMLEFT", b.x, b.y - 0.12 * g.size)
  m:SetSize(g.size, g.size)
  m:SetAlpha(1)
  m:Show() -- models are set after Show()
  m.loaded, m.anim, m.loadStart = false, nil, GetTime()
  if m.ClearModel then m:ClearModel() end
  if not pcall(m.SetModel, m, g.file) then b.game = nil; m:Hide(); return end
  pcall(m.SetPosition, m, 0, 0, 0)
  pcall(m.SetCamDistanceScale, m, g.cam or 1)
  pcall(m.SetFacing, m, 0)
end

-- Load the three containers once, unseen, so the first show of a session needn't wait for the disk
local function WarmGameBoxes()
  Layer()
  if not box then MakeBox() end
  local m = box.model
  local files = { GAME_BOX.pouch.file, GAME_BOX.chest.file, GAME_BOX.gold.file }
  local function Next(i)
    if state then return end -- a show started: it loads its own
    if not files[i] then if m.ClearModel then m:ClearModel() end; m:Hide(); return end
    m:ClearAllPoints()
    m:SetPoint("BOTTOMLEFT", layer, "BOTTOMLEFT", 0, 0)
    m:SetSize(2, 2)
    m:SetAlpha(0)
    m:Show()
    pcall(m.SetModel, m, files[i])
    C_Timer.After(1, function() Next(i + 1) end)
  end
  Next(1)
end
ns.OnInit(function() C_Timer.After(8, WarmGameBoxes) end)

-- Dress the layers for this haul's container (colors) and hide what it doesn't use
local function SetUpBox(b)
  if not box then MakeBox() end
  for _, t in ipairs(box.all) do t:Hide() end
  b.game = On("Models") and GAME_BOX[b.kind] or nil
  if b.game then LoadGameBox(b) else box.model:Hide() end
  local gold = b.kind == "gold"
  local function Tint(t, c, a) t:SetVertexColor(c[1], c[2], c[3], a or 1) end
  if b.kind == "pouch" then
    Tint(box.pBody, { 0.54, 0.35, 0.17 }); Tint(box.pShade, { 0, 0, 0 }, 0.45)
    Tint(box.pString, { 0.8, 0.65, 0.35 }); Tint(box.pMouth, { 0.12, 0.07, 0.03 })
  else
    Tint(box.body, gold and GOLD or WOOD); Tint(box.planks, gold and GOLD_PLANK or PLANK)
    Tint(box.bands, gold and GOLD_TRIM or IRON); Tint(box.lock, gold and { 1, 0.97, 0.8 } or { 0.85, 0.68, 0.3 })
    Tint(box.lid, gold and GOLD_LID or WOOD_LID); Tint(box.lidBands, gold and GOLD_TRIM or IRON)
    for _, sp in ipairs(box.sparks) do Tint(sp, { 1, 0.97, 0.78 }) end
  end
  local r, g, bl = ns.QualityColor(math.max(b.best, 1))
  b.r, b.g, b.b = r, g, bl
  box.rays:SetVertexColor(r, g, bl, 1)
  box.inner:SetVertexColor(math.min(1, r + 0.3), math.min(1, g + 0.3), math.min(1, bl + 0.3), 1)
end

local function Rattle()
  if not ns.settings.noSound then
    PlaySoundFile(("%sChestRattle%d.ogg"):format(MEDIA, math.random(3)), ns.settings.soundChannel or "SFX")
  end
end

-- The container opens: the rain starts, with the opening sound (setting openSound)
local function OpenBox(st, b)
  b.open, b.openT = true, 0
  st.nextLaunch = st.age
  local open = ns.settings.openSound or "size"
  if open == "never" or ns.settings.noSound then return end
  local file = b.kind == "gold" and "ChestBurstGold" or b.kind == "pouch" and "PouchPop"
    or b.size == "big" and "ChestBurst" or "ChestPop"
  if open == "always" then file = b.kind == "gold" and "ChestBurstGold" or "ChestBurst" end
  PlaySoundFile(MEDIA .. file .. ".ogg", ns.settings.soundChannel or "SFX")
end

-- Shake, climb the tease, open
local function UpdateBox(st, dt)
  local b = st.box
  b.t = b.t + dt
  if b.open then b.openT = b.openT + dt; return end
  local u = math.min(1, b.t / b.shakeT)
  if b.kind ~= "pouch" and On("Shake") then -- knocks, quicker as it builds
    b.rattle = b.rattle - dt
    if b.rattle <= 0 then b.rattle = 0.11 - 0.05 * u; Rattle() end
  end
  local idx = math.min(#b.steps, math.floor(u * #b.steps) + 1)
  if idx > b.idx then -- the light climbs a rarity: a chime a step up and a flash
    b.idx, b.flash = idx, 1
    if not ns.settings.noSound then
      PlaySoundFile(("%sTease%02d.ogg"):format(MEDIA, math.min(idx - 1, 5)), ns.settings.soundChannel or "SFX")
    end
  end
  if b.t >= b.shakeT then OpenBox(st, b) end
end

-- The game's container (b.game): the model moved by hand (shake, the sack's jiggle and hop), the
-- chest's own animations for the lid, and our light around it: the rarity tease glowing behind it
-- while it shakes, then the light inside, the rays and the gold's glitter once open
local function DrawGameBox(b, k, u, fade, Place)
  local m, size = box.model, b.game.size
  local cx, mouth = b.x, b.y
  local jx, hop, turn, a = 0, 0, 0, fade
  if b.kind == "pouch" then
    if b.open then -- it hops as it bursts open, then fades away
      local t = b.openT
      hop = math.max(0, 120 * t - 200 * t * t) * k
      a = fade * math.max(0, 1 - math.max(0, t - 0.5) / 0.5)
    else
      jx, turn = math.sin(b.t * 45) * 3, math.sin(b.t * 30) * 0.15
    end
  elseif not b.open and On("Shake") then
    local amp = 1.5 + 5 * u
    jx, turn = (math.random() - 0.5) * 2 * amp, (math.random() - 0.5) * 0.2 * u
  end
  m:ClearAllPoints()
  m:SetPoint("CENTER", layer, "BOTTOMLEFT", cx + jx, mouth - 0.12 * size + hop)
  m:SetSize(size, size)
  pcall(m.SetFacing, m, turn)
  m:SetAlpha(a)
  pcall(m.SetModelAlpha, m, a)
  if b.kind ~= "pouch" and m.loaded then -- shut, opening, then held open
    local want = not b.open and ANIM_SHUT or b.openT < ANIM_OPEN_T and ANIM_OPEN or ANIM_OPENED
    if m.anim ~= want then pcall(m.SetAnimation, m, want); m.anim = want end
  end
  if b.kind == "pouch" then return end
  local big = b.size == "big" or b.kind == "gold"
  if not b.open then
    local r, g, bl = ns.QualityColor(b.steps[b.idx] or 1)
    local glow = big and 0.25 + 0.6 * u or 0.15
    box.inner:SetVertexColor(r, g, bl, 1)
    Place(box.inner, cx + jx, mouth - 0.1 * size, size * (0.9 + 0.2 * u), 0, math.min(1, glow + b.flash))
  else -- the light inside, in front of the open chest
    box.inner:Hide()
    box.light:SetVertexColor(math.min(1, b.r + 0.3), math.min(1, b.g + 0.3), math.min(1, b.b + 0.3), 1)
    Place(box.light, cx, mouth, 90 + 40 * math.min(1, b.openT * 3), 0, math.max(0, 1 - b.openT / 1.5) * 0.9)
  end
  if b.open and On("Burst") and big and b.openT < 1.4 then
    Place(box.rays, cx, mouth, 330, b.openT * 0.3, (1 - b.openT / 1.4) * 0.8)
  else
    box.rays:Hide()
  end
  if b.kind == "gold" then
    for i, sp in ipairs(box.sparks) do
      local t = b.t * 3 + i
      Place(sp, cx + math.cos(t) * size * 0.32, mouth + 18 + math.sin(t * 1.3) * 26, 7, 0, 0.5 + 0.5 * math.sin(t * 5))
    end
  end
end

local function DrawBox(st, k, dt)
  local b = st.box
  local fade = st.settleAt and math.max(0, 1 - (st.age - st.settleAt) / FADE_T) or 1
  if b.hidden then return end
  if fade <= 0 then b.hidden = true; return HideBox() end
  local cx, mouth = b.x, b.y
  local u = math.min(1, b.t / b.shakeT)
  b.flash = math.max(0, (b.flash or 0) - dt * 4)
  local function Place(t, x, y, size, rot, alpha)
    t:ClearAllPoints()
    t:SetPoint("CENTER", layer, "BOTTOMLEFT", x, y)
    t:SetSize(size, size)
    t:SetRotation(rot or 0)
    t:SetAlpha((alpha or 1) * fade)
    t:Show()
  end
  if b.game and not box.model.loaded and GetTime() - (box.model.loadStart or 0) > MODEL_WAIT then
    b.game = nil -- the model didn't come in time: our drawn container from here on
    box.model:Hide()
  end
  if b.game then return DrawGameBox(b, k, u, fade, Place) end
  if b.kind == "pouch" then
    local jig = b.open and 0 or math.sin(b.t * 45) * 0.12
    local deflate = b.open and math.min(1, b.openT / 0.8) or 0
    local a = b.open and math.max(0, 1 - math.max(0, b.openT - 0.6) / 0.5) or 1
    local cy = mouth - 0.22 * BOX
    for _, t in ipairs(box.pouch) do
      Place(t, cx, cy, BOX, 0, a)
      t:SetSize(BOX * (1 + jig), BOX * (1 - 0.3 * deflate)) -- jiggles, then sags as it empties
    end
    if b.open then Place(box.pMouth, cx, cy, BOX, 0, a) else box.pMouth:Hide() end
    return
  end
  local jx, rot = 0, 0
  if not b.open and On("Shake") then
    local amp = 1.5 + 5 * u
    jx, rot = (math.random() - 0.5) * 2 * amp, (math.random() - 0.5) * 0.08 * u
  end
  local cy = mouth - 0.1 * BOX
  for _, t in ipairs(box.chest) do Place(t, cx + jx, cy, BOX, rot) end
  -- the seam's light (climbing the rarities while it shakes), then the light inside once open
  local q = b.steps[b.idx] or 1
  local r, g, bl = ns.QualityColor(q)
  local glow = b.open and 1 or (b.size == "big" or b.kind == "gold") and 0.3 + 0.7 * u or 0.2
  box.seam:SetVertexColor(r, g, bl, 1)
  Place(box.seam, cx + jx, cy, BOX, rot, math.min(1, glow + b.flash))
  if b.open then
    Place(box.inner, cx, mouth, 90 + 40 * math.min(1, b.openT * 3), 0, math.max(0, 1 - b.openT / 1.5) * 0.9)
  else
    box.inner:Hide()
  end
  -- the lid: shut, flying off (a big haul's burst) or tipped back
  local big = b.size == "big" or b.kind == "gold"
  for _, t in ipairs(box.lidParts) do
    if not b.open then
      Place(t, cx + jx, cy, BOX, rot)
    elseif On("Burst") and big then
      local tt = b.openT
      if tt < 0.7 then Place(t, cx + 40 * tt, cy + (320 * tt - 300 * tt * tt) * k, BOX, -2.2 * tt, 1 - tt / 0.7) else t:Hide() end
    else
      Place(t, cx - 6, cy + 0.06 * BOX, BOX, 0.45)
    end
  end
  -- rays out of the open chest in the best item's color
  if b.open and On("Burst") and big and b.openT < 1.4 then
    Place(box.rays, cx, mouth, 330, b.openT * 0.3, (1 - b.openT / 1.4) * 0.8)
  else
    box.rays:Hide()
  end
  if b.kind == "gold" then -- lucky gold glitters
    for i, sp in ipairs(box.sparks) do
      local a = b.t * 3 + i
      Place(sp, cx + math.cos(a) * 70, mouth + 18 + math.sin(a * 1.3) * 26, 7, 0, 0.5 + 0.5 * math.sin(a * 5))
    end
  end
end

local function Update(_, dt)
  local st = state
  if not st then return Finish() end
  RefreshFx()
  -- hit-stop: time crawls for a moment while the screen shakes (the layer only moves while shaking)
  if st.stopT > 0 then st.stopT = st.stopT - dt; dt = dt * 0.2 end
  if st.shake > 0 or st.shaken then
    local ox, oy = 0, 0
    if st.shake > 0 then
      st.shake = math.max(0, st.shake - dt * (st.stopT > 0 and 5 or 1))
      local a = 4 * st.shake / SHAKE_T
      ox, oy = (math.random() - 0.5) * 2 * a, (math.random() - 0.5) * 2 * a
    end
    st.shaken = st.shake > 0 -- one last frame puts it back at (0, 0)
    layer:ClearAllPoints()
    layer:SetPoint("TOPLEFT", UIParent, "TOPLEFT", ox, oy)
    layer:SetPoint("BOTTOMRIGHT", UIParent, "BOTTOMRIGHT", ox, oy)
  end

  st.age = st.age + dt
  local W, H = layer:GetWidth(), layer:GetHeight()
  local k = H / 768 -- physics constants are tuned for a 768-unit-tall UI
  bounds.left, bounds.right, bounds.k = SIZE, W - SIZE, k
  bounds.floor = 2 + H * (ns.settings.rainFloor or 0) / 100

  -- the container shakes and opens first; then the next sprites launch on schedule (the best a
  -- beat after the rest)
  if st.box then
    UpdateBox(st, dt)
    DrawBox(st, k, dt)
  end
  if not st.box or st.box.open then
    while st.queue[1] and st.age >= st.nextLaunch do
      Launch(st, table.remove(st.queue, 1), false, W, H, k)
      st.launched = st.launched + 1
      st.nextLaunch = st.nextLaunch + Core.Interval(st.launched, st.total, On("Escalate"))
      if not st.queue[1] then st.lastLaunch = st.age end
    end
    if st.best and not st.queue[1] then
      st.bestAt = st.bestAt or st.age + BEST_PAUSE
      if st.age >= st.bestAt then
        Launch(st, st.best, true, W, H, k)
        st.best, st.lastLaunch = nil, st.age
      end
    end
  end

  local allResting = not st.queue[1] and not st.best
  -- coins joining up: each pile hops together, and when its last coin arrives the bigger coin
  -- pops out of a flash with its chime (one pile after another)
  local merging = false
  for _, m in ipairs(st.merges) do
    if m.at and not m.done then merging = true end
    if m.at and not m.done and st.age >= m.at then
      allResting = false
      if not m.started then m.started = true; ns:PlayGatherSound() end
      local arrived = true
      for _, s in ipairs(m.members) do
        local u = math.min(1, math.max(0, (st.age - m.at - s.delay) / JOIN_T))
        local e = u * u
        s.x = s.mx + (m.x - s.mx) * e
        s.y = s.my + math.sin(math.pi * u) * 46 * k
        s.shrink = 1 - 0.35 * e
        if u < 1 then arrived = false end
      end
      if arrived then
        m.done = true
        for i = #sprites, 1, -1 do
          if sprites[i].joining == m then Release(table.remove(sprites, i)) end
        end
        local c = Launch(st, { coin = m.into, merged = true }, false, W, H, k)
        c.x, c.y, c.vx, c.vy, c.e, c.spin = m.x, bounds.floor, 0, 430 * k, 0.35, 0
        st.mergesDone = st.mergesDone + 1
        ns:PlayMergeSound(m.into, st.mergesDone)
        st.flashes[#st.flashes + 1] = { x = m.x, y = bounds.floor + c.size / 2, age = 0 }
      end
    elseif m.at and not m.done then
      allResting = false
    end
  end
  local taken
  for _, s in ipairs(sprites) do
    if not s.leaving and not s.joining then
      if Core.Advance(s, dt, bounds) then
        s.squash = SQUASH_T
        if s.bounces == 1 then OnLand(st, s) elseif s.bounces == 2 and not s.coin then Tick(0) end
      end
      if not s.resting then
        allResting = false
        s.rot = s.rot + s.spin * dt
      else
        s.rot = s.rot * (1 - math.min(1, dt * 10)) -- settle upright
        s.restAge = s.restAge + dt
        if not s.tx then
          if s.best then
            s.tx = W / 2 -- the best owns the middle: whatever rests there makes room
            if On("Spacing") then
              for _, o in ipairs(sprites) do if o ~= s and o.tx and math.abs(o.tx - s.tx) < 150 then o.tx = nil end end
            end
          elseif On("Spacing") then
            taken = taken or {}
            wipe(taken)
            for _, o in ipairs(sprites) do
              if o ~= s and o.tx and not o.leaving then
                taken[#taken + 1] = { x = o.tx, half = o.size / 2, wide = On("Names") and o.q >= 3 and not o.coin }
              end
            end
            s.tx = Core.Slot(s.x, { half = s.size / 2, wide = On("Names") and s.q >= 3 and not s.coin },
              taken, bounds.left, bounds.right)
          end
        end
        if s.tx then s.x = s.x + (s.tx - s.x) * math.min(1, dt * 8) end
      end
    end
    if s.squash > 0 then s.squash = s.squash - dt end
    -- a ghost every few frames, so they spread out along the arc instead of hiding under it
    s.trailT = s.trailT + dt
    if s.trailT >= GHOST_EVERY then
      s.trailT = 0
      if On("Trails") and s.q >= 3 and not s.coin and not s.resting and not s.leaving then
        table.insert(s.trail, 1, { x = s.x, y = s.y, rot = s.rot })
        if #s.trail > GHOSTS then table.remove(s.trail) end
      elseif s.trail[1] then
        table.remove(s.trail)
      end
    end
  end

  -- settle once everything rests (or it's been going long enough), after a moment to look
  if st.lastLaunch and not st.settleAt and (allResting or (not merging and st.age > st.lastLaunch + 4.5)) then
    st.hold = st.hold + dt
    if st.hold >= SETTLE_HOLD then
      if st.merges[1] and not st.mergeStarted then StartMerge(st) else Settle(st) end
    end
  end

  local bx, by
  if st.settleAt then
    local busy = false
    for _, s in ipairs(sprites) do
      if st.age < s.leaveAt then
        busy = true
      else
        local t = st.age - s.leaveAt
        if s.leaving == "popup" then
          if not s.handed then
            s.handed, st.handedOff[s.item] = true, true
            local item = s.item
            ns:ShowLoot(item)
          end
          s.y = s.y + dt * 500 -- rises toward the popups as it fades
          s.alpha = math.max(0, 1 - t / 0.5)
          if t < 0.5 then busy = true end
        elseif s.leaving == "gather" then
          if not bx then bx, by = BagPoint() end
          local u = math.min(1, t / GATHER_T)
          local e = u * u
          local cx, cy = (s.sx + bx) / 2, math.max(s.sy, by) + 220 * k
          s.x = (1 - e) * (1 - e) * s.sx + 2 * (1 - e) * e * cx + e * e * bx
          s.y = (1 - e) * (1 - e) * s.sy + 2 * (1 - e) * e * cy + e * e * by - s.size / 2
          s.shrink = 1 - 0.6 * e
          if u >= 1 and not s.inBag then
            s.inBag = true
            st.gathered, st.bagBump = st.gathered + 1, 1
            if On("Escalate") then ns:PlayStepTick(st.gathered) elseif st.gathered % 3 == 1 then Tick(0) end
          end
          if not s.inBag then busy = true end
        else
          s.alpha = math.max(0, 1 - t / FADE_T)
          if t < FADE_T then busy = true end
        end
      end
    end
    if not busy then
      st.fadeOut = st.fadeOut + dt
      if st.fadeOut >= FADE_T then return Finish() end
    end
  end

  -- draw the sprites and what hangs off them
  local floor = bounds.floor
  for _, s in ipairs(sprites) do
    local f = s.f
    if s.inBag then
      f:Hide()
      s.shadow:Hide()
    else
      local size = s.size * s.shrink
      local w, h = size, size
      if s.squash > 0 then w, h = size * 1.3, size * 0.7 end
      f:SetSize(w, h)
      f.edge:SetRotation(s.rot)
      f.icon:SetRotation(s.rot)
      f.glow:SetRotation(s.rot)
      f:SetAlpha(s.alpha)
      f:ClearAllPoints()
      f:SetPoint("BOTTOM", layer, "BOTTOMLEFT", s.x, s.y)
      if s.shadow:IsShown() then
        local near = math.max(0, 1 - (s.y - floor) / (400 * k))
        s.shadow:SetSize(s.size * (0.6 + 0.7 * near), 8 + 6 * near)
        s.shadow:SetAlpha(0.45 * near * s.alpha)
        s.shadow:ClearAllPoints()
        s.shadow:SetPoint("CENTER", layer, "BOTTOMLEFT", s.x, floor - 2)
      end
    end
    -- the beam and the name: Rare+ at rest, until it leaves
    local good = s.q >= 3 and not s.coin and s.resting and (not s.leaving or s.leaving == "popup")
    local fadeIn = math.min(1, s.restAge / 0.3) * s.alpha
    if good and On("Beam") then
      local bh = (s.best and 260 or 170) * k
      s.beam:SetSize(30, bh)
      s.beam:ClearAllPoints()
      s.beam:SetPoint("BOTTOM", layer, "BOTTOMLEFT", s.x, s.y + 4)
      s.beam:SetAlpha(fadeIn * 0.9)
      s.beam:Show()
    elseif s.beam:IsShown() then
      s.beam:Hide()
    end
    if good and On("Names") and not s.leaving then
      s.name:ClearAllPoints()
      s.name:SetPoint("BOTTOM", layer, "BOTTOMLEFT", s.x, s.y + SIZE + 8)
      s.name:SetAlpha(fadeIn)
      s.name:Show()
    elseif s.name:IsShown() then
      s.name:Hide()
    end
    if s.trail[1] or s.ghostsShown then -- most sprites (all coins) never trail: skip them cheaply
      for i, gh in ipairs(s.ghosts) do
        local p = s.trail[i]
        if p then
          local u = i / (#s.trail + 1)
          local gs = s.size * (1 - 0.45 * u)
          gh:SetSize(gs, gs)
          gh:SetRotation(p.rot)
          gh:SetAlpha(0.45 * (1 - u))
          gh:ClearAllPoints()
          gh:SetPoint("CENTER", layer, "BOTTOMLEFT", p.x, p.y + s.size / 2)
          gh:Show()
        elseif gh:IsShown() then
          gh:Hide()
        end
      end
      s.ghostsShown = s.trail[1] ~= nil
    end
  end

  for _, d in ipairs(dust) do
    if d:IsShown() then
      d.age = d.age + dt
      if d.age >= 0.45 then
        d:Hide()
      else
        d.x, d.y, d.vy = d.x + d.vx * dt, d.y + d.vy * dt, d.vy - 60 * dt
        local u = d.age / 0.45
        d:SetSize(6 + 14 * u, 6 + 14 * u)
        d:SetAlpha(0.5 * (1 - u))
        d:ClearAllPoints()
        d:SetPoint("CENTER", layer, "BOTTOMLEFT", d.x, d.y)
      end
    end
  end

  -- the edge glow, the bag's flash, the counter and the money total
  if st.pulseAge then
    st.pulseAge = st.pulseAge + dt
    if st.pulseAge >= PULSE_T then
      st.pulseAge = nil
      layer.pulse:Hide()
    else
      layer.pulse:SetAlpha(math.sin(math.pi * st.pulseAge / PULSE_T) * 0.55)
      layer.pulse:Show()
    end
  end
  -- a burst of light where a pile of coins joined up
  for i, fl in ipairs(st.flashes) do
    local t = layer.flashTex[i]
    if not t then
      t = Tex(top, "ARTWORK", MEDIA .. "Glow", "ADD")
      t:SetVertexColor(1, 0.95, 0.75)
      layer.flashTex[i] = t
    end
    fl.age = fl.age + dt
    local u = fl.age / FLASH_T
    if u >= 1 then
      t:Hide()
    else
      local size = 30 + 90 * u
      t:SetSize(size, size)
      t:ClearAllPoints()
      t:SetPoint("CENTER", layer, "BOTTOMLEFT", fl.x, fl.y)
      t:SetAlpha(1 - u)
      t:Show()
    end
  end
  if st.bagBump > 0 then
    if not bx then bx, by = BagPoint() end
    st.bagBump = math.max(0, st.bagBump - dt * 4)
    layer.bagGlow:SetSize(70 + 30 * st.bagBump, 70 + 30 * st.bagBump)
    layer.bagGlow:ClearAllPoints()
    layer.bagGlow:SetPoint("CENTER", layer, "BOTTOMLEFT", bx, by)
    layer.bagGlow:SetAlpha(st.bagBump)
    layer.bagGlow:Show()
  elseif layer.bagGlow:IsShown() then
    layer.bagGlow:Hide()
  end
  local textAlpha = st.fadeOut > 0 and math.max(0, 1 - st.fadeOut / FADE_T) or 1
  layer.count:SetText(st.landed + st.extra > 0 and ("+%d"):format(st.landed + st.extra) or "")
  layer.count:SetAlpha(textAlpha)
  layer.count:ClearAllPoints()
  layer.count:SetPoint("CENTER", layer, "BOTTOM", 0, H * 0.5)
  if st.coins > 0 or st.baseCopper > 0 then
    if st.coins > 0 then
      local target = st.copper * st.coinsLanded / st.coins
      st.shownCopper = st.shownCopper + (target - st.shownCopper) * math.min(1, dt * 6)
      if st.coinsLanded == st.coins and st.copper - st.shownCopper < 1 then st.shownCopper = st.copper end
    end
    layer.money:SetText((st.coinsLanded > 0 or st.baseCopper > 0)
      and MoneyText(st.baseCopper + math.floor(st.shownCopper + 0.5)) or "")
    layer.money:SetAlpha(textAlpha)
  end
end

-- items: list of item data (ns.ItemData); copper: money looted with them (optional).
-- Plays the rain; Rare+ (setting) end as popups.
function ns:Rain(items, copper)
  copper = copper or 0
  RefreshFx()
  local carried, baseCopper, oldBox = 0, 0, nil
  if state then
    if not state.settleAt then
      -- a new burst while one is still in the air: everything not yet handed off joins the new one,
      -- and the money total carries on from what it already shows
      local merged = {}
      for _, s in ipairs(sprites) do if not s.coin then merged[#merged + 1] = s.item end end
      for _, it in ipairs(state.queue) do if not it.coin then merged[#merged + 1] = it end end
      if state.best then merged[#merged + 1] = state.best end
      for _, it in ipairs(items) do merged[#merged + 1] = it end
      items, carried = merged, state.extra or 0
      local shown = math.floor(state.shownCopper)
      baseCopper = state.baseCopper + shown
      copper = copper + math.max(0, state.copper - shown)
      oldBox = state.box
      Finish()
    else
      Skip() -- already settling: the good items still waiting in line pop up now
    end
  end
  Layer()
  local list = Core.LaunchOrder(items)
  local extra = carried
  if #list > MAX_SPRITES then -- keep the best MAX_SPRITES; the rest only count
    local cut = #list - MAX_SPRITES
    extra = extra + cut
    local trimmed = {}
    for i = cut + 1, #list do trimmed[#trimmed + 1] = list[i] end
    list = trimmed
  end
  local all = {}
  for i, it in ipairs(list) do all[i] = it end
  local best
  local plan, merges = {}, {}
  if On("Coins") then
    if On("Merge") then plan, merges = Core.MergePlan(copper) else plan = Core.CoinPlan(copper) end
  end
  local coins = #plan
  -- the best flies last; a lone item (a quest reward) does too when coins rain with it
  if On("Best") and (#list > 1 or (#list == 1 and coins > 0)) then best = table.remove(list) end
  if not list[1] and not best and coins == 0 then return end
  local queue = Core.Mix(list, plan)
  state = {
    age = 0, nextLaunch = 0, queue = queue, launched = 0, total = #queue, best = best, extra = extra,
    all = all, handedOff = {}, stayQuality = ns.settings.stayQuality or 3,
    landed = 0, copper = coins > 0 and copper or 0, coins = coins, coinsLanded = 0, shownCopper = 0,
    baseCopper = On("Coins") and baseCopper or 0,
    hold = 0, fadeOut = 0, gathered = 0, bagBump = 0, stopT = 0, shake = 0,
    merges = merges, mergesDone = 0, flashes = {}, coinsOut = 0, itemsOut = 0,
  }
  layer.count:SetText("")
  layer.money:SetText("")
  layer.money:SetAlpha(1)
  if On("Escape") then escFrame:Show() end
  if On("Chest") then
    -- out of a container: nothing leaves until it opens (UpdateBox opens it, with its sound)
    local b = Core.BoxPlan(all, copper, { shake = On("Shake"), tease = On("Tease") })
    local W, H = layer:GetWidth(), layer:GetHeight()
    local floor = 2 + H * (ns.settings.rainFloor or 0) / 100
    b.x, b.y = W / 2, math.max(H * 0.38, floor + H * 0.13) -- where Launch sends things from
    b.t, b.idx, b.open, b.openT, b.rattle, b.flash = 0, 1, false, 0, 0, 0 -- idx 1: the first color needs no chime
    SetUpBox(b)
    state.box, state.nextLaunch = b, math.huge
    if oldBox then -- loot joining a rain in progress: the container carries on, it does not start over
      if oldBox.open then b.open, b.openT, b.t, state.nextLaunch = true, oldBox.openT, oldBox.t, 0
      else b.t, b.idx = math.min(oldBox.t, b.shakeT), math.min(oldBox.idx, #b.steps) end
    end
  else
    -- no container: the opening sound alone, as big as the haul (setting openSound)
    local open = ns.settings.openSound or "size"
    local size = open == "always" and "big" or open == "never" and "small" or Core.HaulSize(all, copper)
    if size == "big" then ns:PlayBurstSound() elseif size == "medium" then ns:PlayChestPop() end
  end
  driver:SetScript("OnUpdate", Update)
end

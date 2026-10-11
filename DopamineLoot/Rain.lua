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

-- How many coin sprites a sum of money gets: a few for copper, more for gold, 14 at most
function Core.CoinCount(copper)
  if not copper or copper <= 0 then return 0 end
  return math.min(14, 4 + math.floor(math.log(copper + 1) / math.log(10) * 2))
end

-- The launch queue: items in order with coins mixed in among the first ones (money comes out
-- with the junk, the good stuff after)
function Core.Mix(items, coins)
  local out = {}
  for i, it in ipairs(items) do
    out[#out + 1] = it
    if i <= coins then out[#out + 1] = { coin = true } end
  end
  for _ = #items + 1, coins do table.insert(out, 1, { coin = true }) end
  return out
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
local COIN_ICON = "Interface\\Icons\\INV_Misc_Coin_01"
local SIZE, COIN_SIZE, MAX_SPRITES = 40, 20, 40
local FADE_T, SQUASH_T, SETTLE_HOLD = 0.6, 0.09, 0.7
local GHOSTS, GHOST_EVERY, DUST = 6, 0.035, 7
local BEST_PAUSE, STOP_T, SHAKE_T, PULSE_T = 0.55, 0.22, 0.3, 0.6
local GATHER_T = 0.45

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
  { key = "Shadows", word = "shadows", label = "Floor shadows", tip = "A soft shadow under each item, smaller the higher it flies." },
  { key = "Beam", word = "beam", label = "Loot beam", tip = "A pillar of light over resting Rare and better items, taller for the best one." },
  { key = "Hitstop", word = "hitstop", label = "Hit-stop", tip = "A split second of slow motion and a small shake when the best item lands." },
  { key = "Names", word = "names", label = "Name labels", tip = "Rare and better items show their name while they rest." },
  { key = "Escape", word = "escape", label = "Skip with Escape", tip = "Escape ends the rain at once; the good items still become popups." },
}
-- The switches, read once per frame (RefreshFx) rather than per sprite
local fxOn = {}
local function RefreshFx()
  for _, fx in ipairs(ns.RAIN_FX) do fxOn[fx.key] = not ns.settings["noRain" .. fx.key] end
end
local function On(key) return fxOn[key] end

ns.AddToggle("rain", "noRain", "loot rain")
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
  driver = CreateFrame("Frame")
  -- Escape: a named frame in UISpecialFrames, shown while it rains; Escape hides it, which skips
  escFrame = CreateFrame("Frame", "DopamineLootRainSkip", UIParent)
  escFrame:SetSize(1, 1)
  escFrame:Hide()
  -- (hidden with the UI too, on Alt+Z or a cinematic: only a real Escape skips)
  escFrame:SetScript("OnHide", function() if state and UIParent:IsShown() then Skip() end end)
  if UISpecialFrames then table.insert(UISpecialFrames, "DopamineLootRainSkip") end
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
  s.size = item.coin and COIN_SIZE or SIZE
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
  local r, g, b = ns.QualityColor(s.q)
  if s.coin then r, g, b = 0.95, 0.75, 0.2 end
  s.r, s.g, s.b = r, g, b
  s.f.edge:SetVertexColor(r, g, b, 1)
  s.f.icon:SetTexture(s.coin and COIN_ICON or item.icon or "Interface\\Icons\\INV_Misc_QuestionMark")
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
    st.coinsLanded = st.coinsLanded + 1
    Tick(0)
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

  -- launch the next sprites on schedule; the best waits a beat after the rest
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

  local allResting = not st.queue[1] and not st.best
  local taken
  for _, s in ipairs(sprites) do
    if not s.leaving then
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
  if st.lastLaunch and not st.settleAt and (allResting or st.age > st.lastLaunch + 4.5) then
    st.hold = st.hold + dt
    if st.hold >= SETTLE_HOLD then Settle(st) end
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
  local carried, baseCopper = 0, 0
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
  if On("Best") and #list > 1 then best = table.remove(list) end
  if not list[1] and not best then return end
  local coins = On("Coins") and Core.CoinCount(copper) or 0
  local queue = Core.Mix(list, coins)
  state = {
    age = 0, nextLaunch = 0, queue = queue, launched = 0, total = #queue, best = best, extra = extra,
    all = all, handedOff = {}, stayQuality = ns.settings.stayQuality or 3,
    landed = 0, copper = coins > 0 and copper or 0, coins = coins, coinsLanded = 0, shownCopper = 0,
    baseCopper = On("Coins") and baseCopper or 0,
    hold = 0, fadeOut = 0, gathered = 0, bagBump = 0, stopT = 0, shake = 0,
  }
  layer.count:SetText("")
  layer.money:SetText("")
  layer.money:SetAlpha(1)
  if On("Escape") then escFrame:Show() end
  ns:PlayBurstSound()
  driver:SetScript("OnUpdate", Update)
end

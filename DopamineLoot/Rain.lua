-- Dopamine Loot loot rain: a burst of loot sprays up from the middle of the screen, falls, and
-- bounces on an invisible trampoline. Items launch worst first so the best lands last. When it
-- settles, the small stuff fades where it lies and the good stuff (Rare+ by default) stays: it
-- becomes a popup with its turning model.
-- The physics and the "who stays" rule are pure functions (ns.RainCore) tested offline by
-- tools/test_rain.lua; the drawing below drives plain textures from one OnUpdate.
local _, ns = ...

local Core = {}
ns.RainCore = Core

Core.GRAVITY = -1800     -- px/s^2
Core.MIN_BOUNCE = 170    -- below this vertical speed a sprite stops bouncing and rests
Core.FRICTION = 0.82     -- sideways speed kept per bounce

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

---------------------------------------------------------------------------
-- Drawing (game only)
---------------------------------------------------------------------------
if not CreateFrame then return end

local SIZE, MAX_SPRITES, MAX_TIME = 40, 40, 4.5
local FADE_T = 0.6
-- where items land: ns.settings.rainFloor percent of the screen height up from the bottom (0 = the edge)
local SQUASH_T = 0.09

ns.AddToggle("rain", "noRain", "loot rain")

local layer, driver
local sprites, pool = {}, {}
local bounds = {}
local state -- nil | { age, launchAt, queue, count, staying, done }
local lastTick = 0

local function Layer()
  if layer then return layer end
  layer = CreateFrame("Frame", nil, UIParent)
  layer:SetAllPoints(UIParent)
  layer:SetFrameStrata("FULLSCREEN_DIALOG")
  layer:EnableMouse(false)
  layer.count = layer:CreateFontString(nil, "OVERLAY", "GameFontNormalHuge")
  layer.count:SetPoint("CENTER", layer, "BOTTOM", 0, 0)
  driver = CreateFrame("Frame")
  return layer
end

local function Sprite()
  local s = table.remove(pool)
  if s then return s end
  local f = CreateFrame("Frame", nil, Layer())
  f:SetSize(SIZE, SIZE)
  -- all three layers hang off the frame's edges, so the squash stretches them together, and
  -- each gets the same rotation (a plain color texture wouldn't rotate, so the edge is a file)
  f.edge = f:CreateTexture(nil, "BACKGROUND")
  f.edge:SetTexture("Interface\\Buttons\\WHITE8X8")
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
  return { f = f }
end

local function Tick(quality)
  local now = GetTime()
  if now - lastTick < 0.07 then return end -- many bounces at once would be a buzz
  lastTick = now
  if quality >= 3 then ns:PlayTierSound(quality) else ns:PlayBounceSound() end
end

local function Finish()
  for _, s in ipairs(sprites) do s.f:Hide(); pool[#pool + 1] = s end
  wipe(sprites)
  if layer then layer.count:SetAlpha(0) end
  state = nil
  if driver then driver:SetScript("OnUpdate", nil) end
end

local function Update(_, dt)
  local st = state
  if not st then return Finish() end
  st.age = st.age + dt
  local W, H = layer:GetWidth(), layer:GetHeight()
  local k = H / 768 -- physics constants are tuned for a 768-unit-tall UI
  bounds.left, bounds.right, bounds.k = SIZE, W - SIZE, k
  bounds.floor = 2 + H * (ns.settings.rainFloor or 0) / 100

  -- launch the next sprites on schedule
  while st.queue[1] and st.age >= st.nextLaunch do
    local item = table.remove(st.queue, 1)
    local s = Sprite()
    s.item, s.q = item, item.quality or 1
    s.x, s.y = W / 2 + math.random(-20, 20), math.max(H * 0.38, bounds.floor + H * 0.13)
    s.vx = math.random(-320, 320) * k
    s.vy = (math.random(650, 950) + (s.q >= 3 and 150 or 0)) * k -- the good stuff flies higher
    s.e = 0.45 + math.random() * 0.2
    s.spin = (math.random() - 0.5) * 8
    s.rot, s.bounces, s.resting, s.squash, s.stays = 0, 0, false, 0, false
    local r, g, b = ns.QualityColor(s.q)
    s.f.edge:SetVertexColor(r, g, b, 1)
    s.f.icon:SetTexture(item.icon or "Interface\\Icons\\INV_Misc_QuestionMark")
    s.f.glow:SetVertexColor(r, g, b)
    s.f.glow:SetShown(s.q >= 3)
    s.f:SetAlpha(1)
    s.f:Show()
    sprites[#sprites + 1] = s
    st.nextLaunch = st.nextLaunch + st.interval
  end

  local allResting = #st.queue == 0
  for _, s in ipairs(sprites) do
    if Core.Advance(s, dt, bounds) then
      s.squash = SQUASH_T
      if s.bounces <= 2 then Tick(s.bounces == 1 and s.q or 0) end
    end
    if not s.resting then
      allResting = false
      s.rot = s.rot + s.spin * dt
    else
      s.rot = s.rot * (1 - math.min(1, dt * 10)) -- settle upright
    end
    local w, h = SIZE, SIZE
    if s.squash > 0 then
      s.squash = s.squash - dt
      w, h = SIZE * 1.3, SIZE * 0.7
    end
    s.f:SetSize(w, h)
    s.f.edge:SetRotation(s.rot)
    s.f.icon:SetRotation(s.rot)
    s.f.glow:SetRotation(s.rot)
    s.f:ClearAllPoints()
    s.f:SetPoint("BOTTOM", layer, "BOTTOMLEFT", s.x, s.y)
  end

  -- the counter climbs as items land
  if st.count then
    local landed = 0
    for _, s in ipairs(sprites) do if s.bounces > 0 then landed = landed + 1 end end
    layer.count:SetText(("+%d"):format(landed + st.extra))
    layer.count:SetAlpha(st.fadeAge and math.max(0, 1 - st.fadeAge / FADE_T) or 1)
    layer.count:SetPoint("CENTER", layer, "BOTTOM", 0, H * 0.5)
  end

  -- everything down (or time's up): small stuff fades, good stuff becomes popups
  if (allResting or st.age > MAX_TIME) and not st.fadeAge then
    st.fadeAge = 0
    local delay = 0
    for _, s in ipairs(sprites) do
      if Core.Stays(s.item, st.stayQuality) then
        s.stays = true
        local item = s.item
        C_Timer.After(delay, function() ns:ShowLoot(item) end)
        delay = delay + 0.15
      end
    end
  end
  if st.fadeAge then
    st.fadeAge = st.fadeAge + dt
    local a = math.max(0, 1 - st.fadeAge / FADE_T)
    for _, s in ipairs(sprites) do
      if s.stays then -- rises toward the popups as it fades
        s.y = s.y + dt * 500
        s.f:SetPoint("BOTTOM", layer, "BOTTOMLEFT", s.x, s.y)
      end
      s.f:SetAlpha(a)
    end
    if st.fadeAge >= FADE_T then Finish() end
  end
end

-- items: list of item data (ns.ItemData). Plays the rain; Rare+ (setting) end as popups.
function ns:Rain(items)
  local carried = 0
  if state then
    -- a new burst while one is still in the air: everything not yet handed off joins the new one
    if not state.fadeAge then
      local merged = {}
      for _, s in ipairs(sprites) do merged[#merged + 1] = s.item end
      for _, it in ipairs(state.queue) do merged[#merged + 1] = it end
      for _, it in ipairs(items) do merged[#merged + 1] = it end
      items, carried = merged, state.extra or 0
    end
    Finish()
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
  state = {
    age = 0, nextLaunch = 0, queue = list, extra = extra, count = true,
    interval = math.min(0.09, 1.4 / #list), stayQuality = ns.settings.stayQuality or 3,
  }
  layer.count:SetText("")
  ns:PlayBurstSound()
  driver:SetScript("OnUpdate", Update)
end

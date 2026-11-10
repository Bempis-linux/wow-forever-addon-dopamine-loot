-- Dopamine Loot bulging bag (docs/mockups/bag-final.html, the final version). With 4 normal bag slots or
-- fewer left, the backpack button puffs up: a copy of its own icon with the game's quality border on it,
-- amber to red, and the slots left in its corner.
--   Swelling: the item you looted drops into the top of the bag and the bag gulps it down; the fuller it
--   is, the lower and wider it sits (a heavy sag, a slower wobble); soft lumps press out at its edges;
--   at 2 and 1 left the leather creaks and the border beats like a heart instead of breathing (faster
--   when full); at the last slot it trembles.
--   Full (the game's "Inventory is full"): the item flies at the bag, bounces off the top and tumbles
--   back; a padlock snaps shut over it with a clunk and the bag shakes "no". Trying again within a few
--   seconds shakes it harder; a third time it slumps, sinks and dims with a tired sigh.
--   Release (space freed): it breathes out and settles, a gold glint runs around its border, a green
--   "+N" floats up, and a puff of dust drifts out of the top (more the more was freed).
-- Special bags (herb, mining...) aren't counted. Nothing is drawn while 5+ slots are free, or while the
-- backpack button is hidden; we only read the button's place, never touch it.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local BORDER = "Interface\\COMMON\\WhiteIconFrame" -- the game's item-slot quality border, tinted
local FALLBACK_ICON = "Interface\\Buttons\\Button-Backpack-Up"
local THRESHOLD = 4   -- slots left when the bag starts to strain
local TRIES_T = 4     -- seconds in which a new "full" counts as trying again
local DROP_T = 0.32   -- the looted item dropping into the bag
local MAX_FX = 40

local f, back, icon, border, borderGlow, count, plusText
local borderA = 0
local fx = {}
local free                -- normal slots free, as last counted (nil until the first count)
local shown = 99          -- the count the bag shows (the test plays its own)
local held = 0            -- how puffed up the bag stays (0..1)
local motion              -- the running shape change: f(u) -> sx, sy, dy (a list of steps, played in turn)
local shake, slump, plusT -- the "no" shake, the tired slump, the "+N" float
local tries = {}
local testing = false
local gen = 0             -- raised when the bag is reset or switched off: late timers check it and stop

local function Pressure(n) return n > THRESHOLD and 0 or (THRESHOLD + 1 - n) / (THRESHOLD + 1) end
local function Rest(n) return Pressure(n) * 0.9 end
local function R(a, b) return a + math.random() * (b - a) end
local function Enabled() return not ns.settings.noBag end
local function Play(name) ns:PlayGatherFx(name) end

-- The resting shape for a puff h (0..1): bigger, and sitting lower and wider the fuller it is
local function Shape(h)
  local s = 1 + 0.14 * h
  return s * (1 + 0.1 * h), s * (1 - 0.06 * h)
end

-- Normal bag slots free (bagFamily 0; herb, mining and other special bags don't count)
local function CountFree()
  local num = C_Container and C_Container.GetContainerNumFreeSlots or _G.GetContainerNumFreeSlots
  if not num then return nil end
  local total = 0
  for bag = 0, (NUM_BAG_SLOTS or 4) do
    local ok, n, family = pcall(num, bag)
    if ok and n and (family == nil or family == 0) then total = total + n end
  end
  return total
end

local function Button()
  local b = _G.MainMenuBarBackpackButton
  if b and b:IsVisible() and b:GetCenter() then return b end
end

-- The backpack button's own icon (an atlas or a file), so the bag looks like the game's
local function CopyIcon(b)
  local i = b.icon or b.Icon or (b:GetName() and _G[b:GetName() .. "IconTexture"])
  if i and i.GetAtlas and i:GetAtlas() then icon:SetAtlas(i:GetAtlas()); return end
  local t = i and i:GetTexture()
  icon:SetTexture(t or FALLBACK_ICON)
  icon:SetTexCoord(0, 1, 0, 1)
end

---------------------------------------------------------------------------
-- Little effects: plain textures moved in OnUpdate. Fx o: file, x, y (from the bag's middle), vx, vy, g;
-- size .. size1; life, delay; spin; r, gg, b, a; add; or path(u) -> dx, dy, scale, alpha, rot
---------------------------------------------------------------------------
local function Fx(o)
  local p
  for _, q in ipairs(fx) do if not q.on then p = q; break end end
  if not p then
    if #fx >= MAX_FX then return end
    p = { tex = f:CreateTexture(nil, "OVERLAY") }
    fx[#fx + 1] = p
  end
  p.on, p.t = true, -(o.delay or 0)
  p.x, p.y, p.vx, p.vy, p.grav = o.x or 0, o.y or 0, o.vx or 0, o.vy or 0, o.g or 0
  p.size, p.size1, p.life, p.spin, p.a, p.path = o.size, o.size1 or o.size, o.life, o.spin or 0, o.a or 1, o.path
  p.tex:SetTexture(o.file)
  p.tex:SetVertexColor(o.r or 1, o.gg or 1, o.b or 1)
  p.tex:SetBlendMode(o.add and "ADD" or "BLEND")
  p.tex:SetRotation(0)
  p.tex:Hide()
end

local function StepFx(dt)
  local any = false
  for _, p in ipairs(fx) do
    if p.on then
      p.t = p.t + dt
      if p.t >= p.life then
        p.on = false; p.tex:Hide()
      elseif p.t >= 0 then
        any = true
        local u = p.t / p.life
        local x, y, s, a, rot
        if p.path then
          local dx, dy, sc, al, r = p.path(u)
          x, y, s, a, rot = p.x + dx, p.y + dy, p.size * (sc or 1), p.a * (al or 1), r or 0
        else
          x, y = p.x + p.vx * p.t, p.y + p.vy * p.t - 0.5 * p.grav * p.t * p.t
          s, a, rot = p.size + (p.size1 - p.size) * u, p.a * (1 - u), p.spin * p.t
        end
        p.tex:ClearAllPoints()
        p.tex:SetPoint("CENTER", f, "CENTER", x, y)
        p.tex:SetSize(math.max(0.1, s), math.max(0.1, s))
        p.tex:SetRotation(rot)
        p.tex:SetAlpha(math.max(0, math.min(1, a)))
        p.tex:Show()
      end
    end
  end
  return any
end

---------------------------------------------------------------------------
-- Drawing: the icon (squashed around the bag's bottom), its border, the count
---------------------------------------------------------------------------
local W = 30 -- the button's size in our frame's units (read each frame)

local function Strain(p, full)
  if p <= 0 then return 0.69, 0.54, 0.23, 0.7 end
  return 1, full and 0.24 or 0.78, 0.35, 0.35 + 0.65 * p
end

local function Draw(sx, sy, ox, oy)
  local p = Pressure(shown)
  local r, g, b, al = Strain(p, shown == 0)
  local w, h = W * 0.9 * sx, W * 0.9 * sy
  icon:ClearAllPoints()
  icon:SetPoint("CENTER", f, "CENTER", ox, oy + (h - W * 0.9) / 2) -- the bottom stays put
  icon:SetSize(w, h)
  border:SetVertexColor(r, g, b)
  borderGlow:SetVertexColor(r, g, b)
  borderGlow:SetSize(w * 1.18, h * 1.18)
  borderA = al
end

-- Shape changes. Each step: { dur, f(u) -> sx, sy }; steps play one after another
local function Play2(steps) motion = { i = 1, t = 0, steps = steps } end
-- volume kept: wide and short, then tall and narrow, dying out, while easing between two shapes
local function Wobble(fromX, fromY, toX, toY, amp, dur, slow)
  return { dur = dur, f = function(u)
    local e = 1 - (1 - u) ^ 3
    local a = amp * math.exp(-(slow and 3.2 or 4.2) * u) * math.cos(u * math.pi * (slow and 3.2 or 5.5))
    local sx, sy = fromX + (toX - fromX) * e, fromY + (toY - fromY) * e
    return sx * (1 + a), sy / (1 + a)
  end }
end
-- the gulp: a dip down as it swallows, then a bulge up, then the wobble
local function Gulp(fx0, fy0, tx, ty)
  return { dur = 0.42, f = function(u)
    local k = { { 0, fx0, fy0 }, { 0.25, fx0 * 1.08, fy0 * 0.84 }, { 0.55, tx * 0.94, ty * 1.12 }, { 1, tx, ty } }
    for i = 1, #k - 1 do
      local a, b = k[i], k[i + 1]
      if u <= b[1] then local e = (u - a[1]) / (b[1] - a[1]); e = e * e * (3 - 2 * e); return a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e end
    end
    return tx, ty
  end }
end
-- the relief: it breathes out (dips below its new size), then settles with a small wobble
local function Relief(fx0, fy0, tx, ty, k)
  return { dur = 0.8 + 0.4 * k, f = function(u)
    local dip = math.sin(math.pi * math.min(u / 0.5, 1)) * (0.05 + 0.1 * k)
    local e = math.min(u / 0.4, 1)
    local a = 0.05 * math.exp(-3 * u) * math.sin(u * math.pi * 4)
    local sx, sy = fx0 + (tx - fx0) * e - dip, fy0 + (ty - fy0) * e - dip * 0.6
    return sx * (1 + a), sy / (1 + a)
  end }
end

local dirty = true -- something changed: redraw even if nothing moves
-- The slots left, in the corner like a stack count: amber, a red 0 when full
local function ShowCount()
  dirty = true
  if not count then return end
  if ns.settings.noBagCount or shown > THRESHOLD then count:Hide(); return end
  count:SetText(shown)
  if shown == 0 then count:SetTextColor(1, 0.35, 0.27) else count:SetTextColor(1, 0.82, 0.48) end
  count:Show()
end

local function ClearFx()
  gen = gen + 1
  for _, p in ipairs(fx) do p.on = false; p.tex:Hide() end
  motion, shake, slump, plusT = nil, nil, nil, nil
  if plusText then plusText:Hide() end
end

local elapsed, lastX, lastY, lastW, tremT, jx, jy = 0, nil, nil, nil, 0, 0, 0
local function OnUpdate(_, dt)
  if not Enabled() then ClearFx(); f:Hide(); return end
  local b = Button()
  if not b then f:SetAlpha(0); return end -- hidden for now (a vehicle, a pet battle): keep watching
  f:SetAlpha(1)
  -- follow the button (Edit Mode or a bag addon may move it)
  local r = b:GetEffectiveScale() / UIParent:GetEffectiveScale()
  local x, y = b:GetCenter()
  x, y, W = x * r, y * r, b:GetWidth() * r
  if x ~= lastX or y ~= lastY or W ~= lastW then
    lastX, lastY, lastW, dirty = x, y, W, true
    f:ClearAllPoints()
    f:SetPoint("CENTER", UIParent, "BOTTOMLEFT", x, y)
    f:SetSize(W, W)
  end
  elapsed = elapsed + dt

  local sx, sy = Shape(held)
  if motion then
    local st = motion.steps[motion.i]
    motion.t = motion.t + dt
    local u = math.min(1, motion.t / st.dur)
    sx, sy = st.f(u)
    if u >= 1 then
      motion.i, motion.t = motion.i + 1, 0
      if not motion.steps[motion.i] then motion, dirty = nil, true end -- (its last frame still gets drawn)
    end
  end
  local ox, oy, dim = 0, 0, 1
  if shake then -- side to side, dying out
    shake.t = shake.t + dt
    local u = shake.t / shake.dur
    if u >= 1 then shake, dirty = nil, true else ox = shake.amp * math.sin(u * math.pi * 6) * (1 - u) end
  end
  if slump then -- sinks, stays down a moment, comes back up; the border dims
    slump.t = slump.t + dt
    local u = slump.t / 1.6
    if u >= 1 then slump, dirty = nil, true else
      local k = u < 0.4 and u / 0.4 or (u < 0.8 and 1 or 1 - (u - 0.8) / 0.2)
      oy = oy - 4 * k
      sx, sy = sx * (1 + 0.06 * k), sy * (1 - 0.1 * k)
      dim = 1 - 0.55 * k
    end
  end
  local moving = motion or shake or slump
  if shown <= 1 and not motion and not slump then -- the last slot: it trembles at rest (30 times a second)
    tremT = tremT + dt
    if tremT >= 1 / 30 then
      tremT = 0
      jx, jy = R(-0.6, 0.6), R(-0.4, 0.4)
      moving = true
    end
  elseif jx ~= 0 or jy ~= 0 then
    jx, jy, moving = 0, 0, true
  end
  if moving or dirty then
    dirty = false
    Draw(sx, sy, ox + jx, oy + jy)
  end
  -- the border breathes (2.4 s); at 2 and 1 left it beats like a heart, faster when full
  local p = Pressure(shown)
  local period = (shown <= 2) and (shown == 0 and 0.55 or 0.75) or 2.4
  local breath
  if shown <= 2 then
    local ph = (elapsed % period) / period
    breath = 0.55 + 0.45 * math.max(math.exp(-ph * 14), 0.8 * math.exp(-math.abs(ph - 0.22) * 14))
  else
    breath = 0.65 + 0.35 * (0.5 + 0.5 * math.sin(elapsed * 2 * math.pi / period))
  end
  border:SetAlpha(borderA * breath * dim)
  borderGlow:SetAlpha(0.45 * p * breath * dim)
  -- the green "+N" floating up
  if plusT then
    plusT = plusT + dt
    local u = math.max(0, plusT) / 1.4
    if u >= 1 then plusT = nil; plusText:Hide() else
      plusText:ClearAllPoints()
      plusText:SetPoint("BOTTOM", f, "TOP", 0, -6 + 26 * (1 - (1 - u) ^ 2))
      plusText:SetAlpha(u < 0.2 and u / 0.2 or 1 - (u - 0.2) / 0.8)
      plusText:SetTextHeight(15 * (u < 0.2 and 0.6 + 0.55 * u / 0.2 or 1.15 - 0.15 * math.min(1, (u - 0.2) / 0.2)))
    end
  end
  local busy = StepFx(dt)
  if held <= 0 and not motion and not shake and not slump and not plusT and not busy and shown > THRESHOLD then
    f:Hide() -- nothing to show: the game's own button is back on its own
  end
end

local function Create()
  if f then return end
  f = CreateFrame("Frame", nil, UIParent)
  f:SetFrameStrata("HIGH")
  f:SetSize(W, W)
  f:Hide()
  icon = f:CreateTexture(nil, "ARTWORK")
  back = f:CreateTexture(nil, "BORDER") -- covers the game's icon under ours, moving with ours
  back:SetPoint("TOPLEFT", icon, "TOPLEFT", 1, -1)
  back:SetPoint("BOTTOMRIGHT", icon, "BOTTOMRIGHT", -1, 1)
  back:SetColorTexture(0.05, 0.04, 0.02, 1)
  borderGlow = f:CreateTexture(nil, "BACKGROUND", nil, 1)
  borderGlow:SetTexture(BORDER)
  borderGlow:SetBlendMode("ADD")
  borderGlow:SetPoint("CENTER", icon, "CENTER")
  border = f:CreateTexture(nil, "OVERLAY")
  border:SetTexture(BORDER)
  border:SetAllPoints(icon)
  count = f:CreateFontString(nil, "OVERLAY", "NumberFontNormal")
  count:SetPoint("BOTTOMRIGHT", icon, "BOTTOMRIGHT", -2, 2)
  count:SetJustifyH("RIGHT")
  count:Hide()
  plusText = f:CreateFontString(nil, "OVERLAY", "NumberFontNormal")
  plusText:SetFont("Fonts\\FRIZQT__.TTF", 15, "OUTLINE")
  plusText:SetTextColor(0.45, 1, 0.35)
  plusText:Hide()
  f:SetScript("OnUpdate", OnUpdate)
end

-- Starts drawing (if the button is there). Returns false when nothing can be shown.
local function Wake()
  if not Enabled() or not Button() then return false end
  Create()
  CopyIcon(Button())
  f:Show()
  ShowCount()
  return true
end

---------------------------------------------------------------------------
-- What happens
---------------------------------------------------------------------------
-- The item just looted (LootFeed.lua remembers it), for the drop-in and the bounce-off
local function LootIcon()
  if ns.lastLootIcon and GetTime() - (ns.lastLootT or 0) < 2 then return ns.lastLootIcon end
  if GetNumLootItems and GetNumLootItems() > 0 then
    local tex = GetLootSlotInfo(1)
    if tex and not ns.Secret(tex) then return tex end
  end
end

-- soft lumps pressing out at the edges, n of them
local function Lumps(n, r, g, b)
  for i = 1, n do
    local side, k = i % 4, R(-0.35, 0.35)
    local x = side == 0 and -W * 0.45 or side == 1 and W * 0.45 or k * W
    local y = side == 2 and W * 0.45 or side == 3 and -W * 0.35 or k * W
    Fx({ file = MEDIA .. "Glow.tga", x = x, y = y, size = W * 0.55, life = 0.65, delay = 0.12 + i * 0.04, add = true, r = r, gg = g, b = b,
      path = function(u) local up = math.min(1, u / 0.3); return 0, 0, 0.4 + 0.75 * up - 0.35 * math.max(0, u - 0.3), up < 1 and up * 0.95 or 0.95 * (1 - (u - 0.3) / 0.7) end })
  end
end

local function Pump(n) -- a slot was filled
  shown = n
  ShowCount()
  if Pressure(n) <= 0 or not Wake() then held = Rest(n); return end
  local before, p = held, Pressure(n)
  held = Rest(n)
  local fx0, fy0 = Shape(before)
  local tx, ty = Shape(held)
  local tex = LootIcon()
  local wait = 0
  local steps = {}
  if tex then -- the item drops into the top of the bag, shrinking in (the bag holds its old shape meanwhile)
    wait = DROP_T
    Fx({ file = tex, x = 0, y = W * 1.7, size = 22, life = DROP_T,
      path = function(u) local e = u * u; return 0, -W * 1.3 * e, 1 - 0.75 * e, u < 0.85 and 1 or (1 - u) / 0.15 end })
    steps[1] = { dur = DROP_T, f = function() return fx0, fy0 end }
  end
  steps[#steps + 1] = Gulp(fx0, fy0, tx, ty)
  steps[#steps + 1] = Wobble(tx, ty, tx, ty, 0.12 + 0.08 * p, 0.8, true)
  Play2(steps)
  local my = gen
  local function Swallow()
    if my ~= gen or not Enabled() then return end
    Play("BagGulp")
    local r, g, b = Strain(p, n == 0)
    Lumps(math.max(1, THRESHOLD + 1 - n), r, g, b)
    if n <= 2 then Play("BagCreak" .. math.random(2)) end
  end
  if wait > 0 then C_Timer.After(wait, Swallow) else Swallow() end
end

local function Release(n, freed) -- space was freed: a breath out, a glint, "+N", dust
  local before = held
  shown = n
  held = Rest(n)
  ShowCount()
  if before <= 0 or not Wake() then return end
  local k = math.min(freed, 6) / 6
  local fx0, fy0 = Shape(before)
  local tx, ty = Shape(held)
  Play2({ Relief(fx0, fy0, tx, ty, k) })
  Play(k > 0.5 and "BagExhale" or "BagSigh")
  -- a gold glint running once around the border
  local half = W * 0.47
  Fx({ file = MEDIA .. "Mote.tga", size = 12, life = 0.7, delay = 0.25, add = true, r = 1, gg = 0.87, b = 0.45,
    path = function(u)
      local d = u * 8 * half
      local side, o = math.floor(d / (2 * half)), d % (2 * half)
      local x, y
      if side == 0 then x, y = -half + o, half elseif side == 1 then x, y = half, half - o
      elseif side == 2 then x, y = half - o, -half else x, y = -half, -half + o end
      return x, y, 1, u > 0.85 and (1 - u) / 0.15 or 1
    end })
  -- "+N" floats up
  plusText:SetText("+" .. freed)
  plusText:SetAlpha(0)
  plusText:Show()
  plusT = -0.1
  -- a puff of dust and a couple of motes
  for i = 1, math.floor(4 + 10 * k + 0.5) do
    local sz = R(6, 10) + 6 * k
    Fx({ file = MEDIA .. "Circle.tga", x = R(-3, 3), y = W / 2, vx = R(-30, 30), vy = R(30, 60) * (1 + k), g = 10, size = sz,
      size1 = sz * (1.8 + k), life = R(0.7, 1.1) + 0.3 * k, delay = R(0, 0.12), r = 0.86, gg = 0.82, b = 0.75, a = 0.4 })
    if i <= 2 then
      Fx({ file = MEDIA .. "Mote.tga", x = R(-6, 6), y = W / 2, vx = R(-20, 20), vy = R(40, 70), size = 6, life = 1.3, delay = 0.15,
        add = true, r = 1, gg = 0.91, b = 0.66 })
    end
  end
end

-- The padlock snapping shut over the bag
local function Padlock()
  Fx({ file = MEDIA .. "Lock.tga", x = 0, y = W * 0.05, size = W * 0.75, life = 1.5, r = 0.85, gg = 0.66, b = 0.25,
    path = function(u)
      local dy, s
      if u < 0.22 then local e = u / 0.22; dy, s = W * 0.7 * (1 - e) - 2 * e, 0.7 + 0.38 * e
      elseif u < 0.32 then local e = (u - 0.22) / 0.1; dy, s = -2 * (1 - e), 1.08 - 0.08 * e
      else dy, s = 0, 1 - 0.05 * math.max(0, (u - 0.78) / 0.22) end
      return 0, dy, s, u < 0.15 and u / 0.15 or (u > 0.78 and (1 - u) / 0.22 or 1)
    end })
  local my = gen
  C_Timer.After(0.3, function() if my == gen and Enabled() then Play("BagClunk") end end)
end

local function Full()
  if not Wake() then return end
  if free == 0 or testing then shown = 0 end -- (an error with space left still plays; the count stays true)
  if held < Rest(shown) then held = Rest(shown) end
  ShowCount()
  local now = GetTime()
  for i = #tries, 1, -1 do if now - tries[i] > TRIES_T then table.remove(tries, i) end end
  tries[#tries + 1] = now
  local level = math.min(3, #tries)
  -- the item flies at the bag, bounces off the top and tumbles back where it came from
  local tex = LootIcon()
  local hit = 0
  local my = gen
  if tex then
    hit = 0.33
    local x0, y0, top = -W * 2.4, W * 2.6, W * 0.6
    Fx({ file = tex, x = 0, y = 0, size = 22, life = 1.1,
      path = function(u)
        if u < 0.3 then local e = (u / 0.3) ^ 2; return x0 * (1 - e), y0 + (top - y0) * e + W * 1.2 * math.sin(math.pi * u / 0.3), 1, 1, 0 end
        local v = (u - 0.3) / 0.7
        local e = 1 - (1 - v) ^ 2
        return x0 * e, top + (y0 - top) * e + W * 2 * math.sin(math.pi * v), 1, v > 0.8 and (1 - v) / 0.2 or 1, 9.4 * v
      end })
    C_Timer.After(hit, function()
      if my ~= gen or not Enabled() then return end
      Play("BagBoing")
      local sx, sy = Shape(held)
      Play2({ { dur = 0.22, f = function(u) local k = math.sin(math.pi * u); return sx * (1 + 0.06 * k), sy * (1 - 0.14 * k) end } })
    end)
  end
  local function React()
    if my ~= gen or not Enabled() then return end
    if not f:IsShown() then Wake() end
    if level == 3 then -- a tired slump
      slump = { t = 0 }
      Play("BagSlump")
      return
    end
    shake = { t = 0, dur = level == 2 and 0.52 or 0.38, amp = (level == 2 and 7 or 3.5) * W / 38 }
    Play("BagShake")
    Padlock()
  end
  if hit > 0 then C_Timer.After(hit, React) else React() end
end

-- After a test, or when the switch changes: show the real count again, no animation
local function Sync()
  gen = gen + 1 -- (late timers from before stop)
  free = CountFree() or free
  if free then shown = free; held = Rest(free) end
  if held > 0 then Wake() end
  ShowCount()
end
ns.SyncBag = Sync

---------------------------------------------------------------------------
-- Events
---------------------------------------------------------------------------
function ns:BAG_UPDATE_DELAYED()
  local n = CountFree()
  if not n then return end
  local old = free
  free = n
  if testing then return end -- the test's end syncs
  if not old or not Enabled() then -- the first count (after login), or switched off: no animation
    shown, held = n, Rest(n)
    if held > 0 and Wake() then ShowCount() end
    return
  end
  if n < old then Pump(n) elseif n > old then Release(n, n - old) end
end

local function IsFullError(errorType, msg)
  if ns.Secret(errorType) or ns.Secret(msg) then return false end
  local code = _G.LE_GAME_ERR_INV_FULL -- (not on every client: compare the message too)
  if code and errorType == code then return true end
  return msg ~= nil and (msg == _G.ERR_INV_FULL or msg == _G.INVENTORY_FULL)
end

function ns:UI_ERROR_MESSAGE(errorType, msg)
  if testing or not Enabled() then return end
  if IsFullError(errorType, msg) then Full() end
end

-- Test bag (settings page): four items to full, three tries at a full bag, then a big release
ns.AddAction("testbag", function()
  if testing or not Enabled() or not Button() then return end -- (one test at a time)
  testing = true
  wipe(tries)
  shown, held = THRESHOLD, Rest(THRESHOLD)
  Wake()
  local info = C_Container and C_Container.GetContainerItemInfo
  local ok, it = pcall(info or error, 0, 1)
  ns.lastLootIcon = ok and it and it.iconFileID or "Interface\\Icons\\INV_Misc_Coin_01"
  for i = 1, THRESHOLD do
    C_Timer.After(0.75 * (i - 1), function() ns.lastLootT = GetTime(); Pump(THRESHOLD - i) end)
  end
  local t = 0.75 * THRESHOLD + 0.3
  for i = 0, 2 do C_Timer.After(t + i * 1.3, function() ns.lastLootT = GetTime(); Full() end) end
  C_Timer.After(t + 3 * 1.3 + 0.8, function() Release(6, 6) end)
  C_Timer.After(t + 3 * 1.3 + 2.6, function() testing = false; ns.lastLootIcon = nil; Sync() end)
end)

ns.OnInit(function()
  ns:RegisterEvents("BAG_UPDATE_DELAYED", "PLAYER_ENTERING_WORLD", "UI_ERROR_MESSAGE")
  -- LootFeed.lua handles PLAYER_ENTERING_WORLD too: run both (OnInit runs after every file loaded)
  local prev = ns.PLAYER_ENTERING_WORLD
  ns.PLAYER_ENTERING_WORLD = function(self, ...)
    if prev then prev(self, ...) end
    -- bags may not be loaded yet: let the first BAG_UPDATE_DELAYED count silently (no puff at login),
    -- or count in 2 s if none comes
    free = nil
    C_Timer.After(2, function() if not free and not testing then Sync() end end)
  end
end)

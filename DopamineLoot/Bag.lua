-- Dopamine Loot bulging bag (docs/mockups/gathering.html, round 3: Game art + Squash & wobble).
-- With 4 normal bag slots or fewer left, the backpack button puffs up: a copy of its own icon swells a
-- notch with each slot filled and only partly deflates, inside a ring of ours that glows and splits apart
-- under the strain; at the last slot it trembles. Each change lands with a squash (wide and short), a
-- stretch and a short settling wobble. Full (the game's "Inventory is full"): it strains, the drawstring
-- whips out, the loot spills out the top and is sucked back in, and it shakes "nope" (the whole show at
-- most every 4 s; sooner, a small nope only). Freeing space lets it out: a sigh for one slot, a big
-- exhale for six. Special bags (herb, mining...) aren't counted. Nothing is drawn while 5+ slots are
-- free, or while the backpack button is hidden; we only read the button's place, never touch it.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local FALLBACK_ICON = "Interface\\Buttons\\Button-Backpack-Up"
local THRESHOLD = 4          -- slots left when the bag starts to strain
local FULL_GAP = 4           -- seconds between two full-bag shows
local DASHES = 12            -- the ring's segments
local MAX_FX = 32

local f                      -- the overlay frame (created on first use)
local icon, glow, whip, bubble, bubbleText
local dashes, fx = {}, {}
local free                   -- normal slots free, as last counted (nil until the first count)
local shown = 99             -- the count the bag shows (the test plays its own)
local held = 0               -- how puffed up the bag stays (0..1)
local motion, nope, openT    -- the running squash, the "nope" wiggle, the snap's open time span
local lastFull = -999
local testing = false

local function Pressure(n) return n > THRESHOLD and 0 or (THRESHOLD + 1 - n) / (THRESHOLD + 1) end
local function Rest(n) return Pressure(n) * 0.9 end
local function Size(h) return 1 + 0.16 * h end

local function Enabled() return not ns.settings.noBag end

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
-- Little effects: puffs of air or dust, spilled items, rings. Plain textures, moved in OnUpdate.
---------------------------------------------------------------------------
local function Fx(o) -- o: file, x, y, vx, vy, g, size, size1, life, r, g_, b, a, spin, delay
  local p
  for _, q in ipairs(fx) do if not q.on then p = q; break end end
  if not p then
    if #fx >= MAX_FX then return end
    p = { tex = f:CreateTexture(nil, "OVERLAY") }
    fx[#fx + 1] = p
  end
  p.on, p.t = true, -(o.delay or 0)
  p.x, p.y, p.vx, p.vy, p.grav = o.x or 0, o.y or 0, o.vx or 0, o.vy or 0, o.g or 0
  p.size, p.size1, p.life, p.spin, p.a = o.size, o.size1 or o.size, o.life, o.spin or 0, o.a or 1
  p.path = o.path -- spill: up and out, then sucked back in
  p.tex:SetTexture(o.file)
  p.tex:SetVertexColor(o.r or 1, o.gg or 1, o.b or 1)
  p.tex:SetBlendMode(o.add and "ADD" or "BLEND")
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
        local u, x, y = p.t / p.life, nil, nil
        if p.path then -- out to (vx, vy), a beat there, back into the bag
          local e = u < 0.45 and math.sin(u / 0.45 * math.pi / 2) or (u < 0.62 and 1 or 1 - ((u - 0.62) / 0.38) ^ 2)
          x, y = p.x + p.vx * e, p.y + p.vy * e
        else
          x, y = p.x + p.vx * p.t, p.y + p.vy * p.t - 0.5 * p.grav * p.t * p.t
        end
        local s = p.size + (p.size1 - p.size) * u
        p.tex:ClearAllPoints()
        p.tex:SetPoint("CENTER", f, "CENTER", x, y)
        p.tex:SetSize(s, s)
        p.tex:SetRotation(p.spin * p.t)
        p.tex:SetAlpha(p.a * (p.path and math.min(1, u / 0.1, (1 - u) / 0.15) or (1 - u)))
        p.tex:Show()
      end
    end
  end
  return any
end

local function Ring(size, r, g, b, life, delay)
  Fx({ file = MEDIA .. "Ring.tga", size = size * 0.15, size1 = size, life = life, r = r, gg = g, b = b, a = 0.9, add = true, delay = delay })
end

---------------------------------------------------------------------------
-- Drawing: the icon, the ring and the glow, squashed around the bag's bottom
---------------------------------------------------------------------------
local W = 30 -- the button's size in our frame's units (read each frame)

local function Strain(p, full)
  if p <= 0 then return 0.69, 0.54, 0.23, 0.7 end
  return 1, full and 0.24 or 0.78, 0.35, 0.35 + 0.65 * p
end

local function Draw(s, a, open, rot, jx, jy)
  local p = Pressure(shown)
  local sx, sy = s * (1 + a), s / (1 + a)
  local lift = W / 2 * (sy - 1) -- squash around the bottom: the middle rises as it stretches
  local r, g, b, al = Strain(p, shown == 0)
  -- the icon puffs up inside the ring too
  local k = 1 + 0.14 * held
  icon:ClearAllPoints()
  icon:SetPoint("CENTER", f, "CENTER", jx + rot * W, lift + jy + open * 4) -- rot: the "nope" head-shake
  icon:SetSize(W * 0.9 * k * sx, W * 0.9 * k * sy)
  -- the ring: segments that split apart under strain (and burst outward at the snap)
  local radius = W * 0.62 + open * 5
  local circ = 2 * math.pi * radius
  local gap = circ / DASHES * (0.08 + 0.35 * p)
  local len = circ / DASHES - gap
  local half = len / 2 / radius -- each segment: an arc's chord, drawn as a line
  for i, d in ipairs(dashes) do
    local an = (i - 0.5) / DASHES * 2 * math.pi
    d:SetStartPoint("CENTER", f, radius * math.cos(an - half) * sx + jx, radius * math.sin(an - half) * sy + lift + jy)
    d:SetEndPoint("CENTER", f, radius * math.cos(an + half) * sx + jx, radius * math.sin(an + half) * sy + lift + jy)
    d:SetThickness(1.5 + 0.8 * p)
    d:SetColorTexture(r, g, b, al * (1 - 0.5 * open))
  end
  glow:ClearAllPoints()
  glow:SetPoint("CENTER", f, "CENTER", 0, lift)
  local gs = W * (2 + 0.2 * held) * s
  glow:SetSize(gs, gs)
  glow:SetVertexColor(r, g, b)
  glow:SetAlpha(0.55 * p)
end

-- The squash: volume kept, wide and short first, then tall and narrow, dying out, while the size
-- eases from s0 to s1 (over: an extra swell on the way that only partly goes back down)
local function Squash(s0, s1, amp, dur, over)
  motion = { t = 0, dur = dur, f = function(u)
    local s = s0 + (s1 - s0) * (1 - (1 - u) ^ 3) + (over or 0) * math.sin(math.pi * math.min(u / 0.4, 1))
    return s, amp * math.exp(-4.2 * u) * math.cos(u * math.pi * 5.5)
  end }
end

-- The release: it dips below its new size, then settles; deeper and longer the more was freed
local function Deflate(s0, s1, k)
  local low = 1 - 0.03 - 0.13 * k
  motion = { t = 0, dur = 0.45 + 0.45 * k, f = function(u)
    local dip = math.sin(math.pi * math.min(u / 0.55, 1)) * s1 * (1 - low)
    return s0 + (s1 - s0) * math.min(u / 0.4, 1) - dip, 0.06 * k * math.exp(-4 * u) * math.sin(u * math.pi * 5)
  end }
end

local dirty = true -- something changed: redraw even if nothing moves
local function ShowBubble()
  dirty = true
  if not bubble then return end
  if ns.settings.noBagCount or shown > THRESHOLD then bubble:Hide(); return end
  bubbleText:SetText(shown == 0 and "Full" or (shown .. " left"))
  local tex = bubble.bg
  if shown == 0 then tex:SetVertexColor(1, 0.35, 0.24); bubbleText:SetTextColor(1, 1, 1)
  else tex:SetVertexColor(1, 0.75, 0.25); bubbleText:SetTextColor(0.1, 0.07, 0.02) end
  bubble:SetWidth(bubbleText:GetStringWidth() + 14)
  bubble:Show()
end

local function ClearFx()
  for _, p in ipairs(fx) do p.on = false; p.tex:Hide() end
  whip.t = nil; whip:Hide()
  motion, nope, openT = nil, nil, nil
end

local elapsed, lastX, lastY, lastW, tremT, jx, jy = 0, nil, nil, nil, 0, 0, 0
local back -- the dark square covering the game's icon under ours
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
    back:SetSize(W * 0.86, W * 0.86)
  end
  elapsed = elapsed + dt

  local s, a = Size(held), 0
  if motion then
    motion.t = motion.t + dt
    local u = motion.t / motion.dur
    if u >= 1 then motion = nil else s, a = motion.f(u) end
  end
  local rot = 0
  if nope then
    nope.t = nope.t + dt
    local u = nope.t / nope.dur
    if u >= 1 then nope = nil else rot = nope.amp * math.sin(u * math.pi * 4) * (1 - u) end
  end
  local open = 0
  if openT then
    local t = elapsed - openT
    if t > 0.85 then openT = nil elseif t > 0 then open = math.min(1, t / 0.08, (0.85 - t) / 0.15) end
  end
  local moving = motion or nope or openT or whip.t
  if shown <= 1 and open == 0 and not motion then -- the last slot: it trembles at rest (30 times a second)
    tremT = tremT + dt
    if tremT >= 1 / 30 then
      tremT = 0
      jx, jy = math.random() * 1.2 - 0.6, math.random() * 0.8 - 0.4
      moving = true
    end
  elseif jx ~= 0 or jy ~= 0 then
    jx, jy, moving = 0, 0, true
  end
  if moving or dirty then
    dirty = false
    Draw(s, a, open, rot, jx, jy)
  end
  -- the drawstring whipping out
  if whip.t then
    whip.t = whip.t + dt
    local u = whip.t / 0.52
    if u >= 1 then whip.t = nil; whip:Hide() else
      local e = 1 - (1 - math.min(u / 0.3, 1)) ^ 3
      local an = math.rad(20 + 120 * e + (u > 0.3 and 35 * math.sin(math.min((u - 0.3) / 0.4, 1) * math.pi) or 0))
      local len = 34 * (u < 0.3 and 0.15 + 0.85 * e or 1 - 0.4 * (u - 0.3) / 0.7)
      local oy = W / 2 + 2
      whip:SetStartPoint("CENTER", f, 0, oy)
      whip:SetEndPoint("CENTER", f, len * math.cos(an), oy + len * math.sin(an))
      whip:SetColorTexture(1, 0.85, 0.45, u < 0.6 and 1 or 1 - (u - 0.6) / 0.4)
      whip:Show()
    end
  end
  local busy = StepFx(dt)
  if held <= 0 and not motion and not nope and not openT and not whip.t and not busy and shown > THRESHOLD then
    f:Hide() -- nothing to show: the game's own button is back on its own
  end
end

local function Create()
  if f then return end
  f = CreateFrame("Frame", nil, UIParent)
  f:SetFrameStrata("HIGH")
  f:SetSize(W, W)
  f:Hide()
  glow = f:CreateTexture(nil, "BACKGROUND")
  glow:SetTexture(MEDIA .. "Glow.tga")
  glow:SetBlendMode("ADD")
  back = f:CreateTexture(nil, "BORDER")
  back:SetPoint("CENTER")
  back:SetColorTexture(0.05, 0.04, 0.02, 1)
  back:SetSize(W * 0.86, W * 0.86)
  icon = f:CreateTexture(nil, "ARTWORK")
  for i = 1, DASHES do dashes[i] = f:CreateLine(nil, "OVERLAY") end
  whip = f:CreateLine(nil, "OVERLAY")
  whip:SetThickness(2)
  whip:Hide()
  bubble = CreateFrame("Frame", nil, f)
  bubble:SetSize(40, 16)
  bubble:SetPoint("BOTTOM", f, "TOP", 0, 10)
  bubble.bg = bubble:CreateTexture(nil, "BACKGROUND")
  bubble.bg:SetAllPoints()
  bubble.bg:SetTexture(MEDIA .. "Circle.tga") -- stretched: a rounded lozenge
  bubbleText = bubble:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  bubbleText:SetPoint("CENTER", 0, 0)
  bubble:Hide()
  f:SetScript("OnUpdate", OnUpdate)
end

-- Starts drawing (if the button is there). Returns false when nothing can be shown.
local function Wake()
  if not Enabled() or not Button() then return false end
  Create()
  local b = Button()
  CopyIcon(b)
  f:Show()
  ShowBubble()
  return true
end

---------------------------------------------------------------------------
-- What happens
---------------------------------------------------------------------------
local function Pump(n) -- a slot was filled
  shown = n
  ShowBubble()
  if Pressure(n) <= 0 or not Wake() then held = Rest(n); return end
  local before, p = held, Pressure(n)
  held = Rest(n)
  Squash(Size(before), Size(held), 0.2 + 0.1 * p, 0.95, 0.1 + 0.06 * p)
end

local function Release(n, freed) -- space was freed: a sigh for one slot, a big exhale for six
  local before = held
  shown = n
  held = Rest(n)
  ShowBubble()
  if before <= 0 or not Wake() then return end
  local k = math.min(freed, 6) / 6
  Deflate(Size(before), Size(held), k)
  for _ = 1, math.floor(3 + 15 * k + 0.5) do
    local sz = 6 + math.random() * 4 + 6 * k
    Fx({ file = MEDIA .. "Circle.tga", x = math.random(-3, 3), y = W / 2, vx = (math.random() * 40 - 20) * (1 + k),
      vy = (40 + math.random() * 30) * (1 + 0.8 * k), g = 20, size = sz, size1 = sz * (1.6 + k),
      life = 0.5 + math.random() * 0.3 + 0.3 * k, r = 0.9, gg = 0.88, b = 0.84, a = 0.45 })
  end
  if k > 0.5 then Ring(W * 1.6, 0.9, 0.88, 0.84, 0.5) end
end

-- Icons to spill: what's left in the loot window, else items from the bags
local function SpillIcons()
  local list = {}
  if GetNumLootItems then
    for i = 1, GetNumLootItems() do
      local tex = GetLootSlotInfo(i)
      if tex and not ns.Secret(tex) then list[#list + 1] = tex end
    end
  end
  local info = C_Container and C_Container.GetContainerItemInfo
  for bag = 0, 4 do
    if #list >= 5 or not info then break end
    local slots = (C_Container.GetContainerNumSlots and C_Container.GetContainerNumSlots(bag)) or 0
    for slot = 1, slots do
      local ok, it = pcall(info, bag, slot)
      if ok and it and it.iconFileID then list[#list + 1] = it.iconFileID end
      if #list >= 5 then break end
    end
  end
  if #list == 0 then list[1] = "Interface\\Icons\\INV_Misc_Coin_01" end
  return list
end

local function Full()
  if not Wake() then return end
  if free == 0 or testing then shown = 0 end -- (an error with space left still plays; the count stays true)
  if held < Rest(shown) then held = Rest(shown) end
  ShowBubble()
  local now = GetTime()
  if now - lastFull < FULL_GAP then -- too soon: a small "nope" only
    nope = { t = 0, dur = 0.26, amp = 0.09 }
    return
  end
  lastFull = now
  -- strains: tall and tight first
  Squash(Size(held), Size(held), -0.12, 0.38, 0.07)
  C_Timer.After(0.15, function() -- the snap: the drawstring whips out, a tiny pop, the loot spills
    if not f then return end
    openT = elapsed
    whip.t = 0
    Ring(18, 1, 0.92, 0.66, 0.28)
    Ring(10, 1, 1, 1, 0.2)
    local icons = SpillIcons()
    for i = 1, math.min(5, #icons) do
      Fx({ file = icons[i], x = 0, y = W / 2 + 2, vx = (i - (math.min(5, #icons) + 1) / 2) * 14 + math.random(-4, 4),
        vy = 36 + math.random() * 18, size = 9, size1 = 14, life = 0.9, spin = (math.random() - 0.5) * 2, path = true })
    end
    for _ = 1, 8 do
      local sz = 5 + math.random() * 4
      Fx({ file = MEDIA .. "Circle.tga", x = 0, y = W / 2, vx = math.random(-50, 50), vy = 30 + math.random() * 40, g = 40,
        size = sz, size1 = sz * 2, life = 0.5 + math.random() * 0.3, r = 0.78, gg = 0.7, b = 0.59, a = 0.5 })
    end
    ns:PlayChestPop()
  end)
  C_Timer.After(1.0, function() -- sucked back in, pulled shut: "nope"
    if not f then return end
    Squash(Size(held), Size(held), 0.14, 0.42)
    nope = { t = 0, dur = 0.48, amp = 0.16 }
  end)
end

-- After a test, or when the switch changes: show the real count again, no animation
local function Sync()
  free = CountFree() or free
  if free then shown = free; held = Rest(free) end
  if held > 0 then Wake() end
  ShowBubble()
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
    if held > 0 and Wake() then ShowBubble() end
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

-- Test bag (settings page): four items to full, the full show, then a big release
ns.AddAction("testbag", function()
  if testing or not Enabled() or not Button() then return end -- (one test at a time)
  testing = true
  lastFull = -999
  shown, held = THRESHOLD, Rest(THRESHOLD)
  Wake()
  for i = 1, THRESHOLD do C_Timer.After(0.65 * (i - 1), function() Pump(THRESHOLD - i) end) end
  C_Timer.After(0.65 * THRESHOLD + 0.1, Full)
  C_Timer.After(0.65 * THRESHOLD + 2.6, function() Release(6, 6) end)
  C_Timer.After(0.65 * THRESHOLD + 4.2, function() testing = false; Sync() end)
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

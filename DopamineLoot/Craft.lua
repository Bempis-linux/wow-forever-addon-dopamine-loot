-- Dopamine Loot crafting (docs/mockups/crafting-r4.html, crafting-r5.html, firstaid-r6.html, batch.html).
-- Every craft has a cast in game. While it casts, the profession's work plays beside your character, its
-- beats spread over the cast (punches and a stitch, bubbles boiling over, stitches, a ratchet, sizzles and a
-- flip, taps, runes, a salve and wraps), and the payoff lands exactly when the item is made (a tug, a cork,
-- a snip, a boing, a "tss", a CLANG, a ping, a click). Simple shapes only, sounds that feel physical.
-- Create All: every item plays it; the game already makes its own craft sounds, so after the first item
-- the work beats are silent, and from the 4th item it all gets smaller and the payoff quieter. Crafted items
-- don't pop up or rain: they go to the loot column (a "Crafted" row), once the batch is done.
-- What counts as a craft: a cast that UnitCastingInfo marks as a trade skill. The profession is the one the
-- profession window shows (C_TradeSkillUI.GetBaseProfessionInfo), by its English name; others get a small
-- generic touch. Reads only: no hooks into Blizzard's frames.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local STAR = "Interface\\Cooldown\\star4"
local WHITE = "Interface\\Buttons\\WHITE8X8"
local MAX_FX, FULL_ITEMS = 120, 3
local GAP_END = 1.6 -- seconds after an item with no new cast: the batch is over

local layer
local fx = {}
local craft      -- the cast now: { guid, prof, t0, T, item }
local batch      -- the run of casts: { n, total, items = { [key] = d }, order = {}, prof }
local lastDone = -999

local function On() return not ns.settings.noCraft and ns.settings.enabled ~= false end
local function R(a, b) return a + math.random() * (b - a) end
local function Sound(name) ns:PlayGatherFx(name) end -- (Sounds.lua: the sound switch and channel)

---------------------------------------------------------------------------
-- Little effects (plain textures moved in one OnUpdate). Fx o: file, x, y (screen), w, h (default size),
-- delay, life, r, gg, b, a, add, coords {l, r, t, b}, rot; and path(u) -> dx, dy, scale, alpha, rot,
-- or vx, vy, g (falling) with grow
---------------------------------------------------------------------------
local function Fx(o)
  local p
  for _, q in ipairs(fx) do if not q.on then p = q; break end end
  if not p then
    if #fx >= MAX_FX then return end
    p = { tex = layer:CreateTexture(nil, "OVERLAY") }
    fx[#fx + 1] = p
  end
  p.on, p.t = true, -(o.delay or 0)
  layer:Show()
  p.x, p.y, p.w, p.h = o.x, o.y, o.w or o.size, o.h or o.size
  p.vx, p.vy, p.g, p.grow, p.life, p.a, p.path, p.rot = o.vx or 0, o.vy or 0, o.g or 0, o.grow or 1, o.life, o.a or 1, o.path, o.rot or 0
  p.fade = o.fade
  p.tex:SetTexture(o.file)
  if o.coords then p.tex:SetTexCoord(o.coords[1], o.coords[2], o.coords[3], o.coords[4]) else p.tex:SetTexCoord(0, 1, 0, 1) end
  p.tex:SetVertexColor(o.r or 1, o.gg or 1, o.b or 1)
  p.tex:SetBlendMode(o.add and "ADD" or "BLEND")
  p.tex:SetRotation(0)
  p.tex:Hide()
end

local function Step(self, dt)
  local any = false
  for _, p in ipairs(fx) do
    if p.on then
      any = true
      p.t = p.t + dt
      if p.t >= p.life then p.on = false; p.tex:Hide()
      elseif p.t >= 0 then
        local u = p.t / p.life
        local x, y, s, a, rot
        if p.path then
          local dx, dy, sc, al, r = p.path(u)
          x, y, s, a, rot = p.x + dx, p.y + dy, sc or 1, al or 1, r or p.rot
        else
          x, y = p.x + p.vx * p.t, p.y + p.vy * p.t - 0.5 * p.g * p.t * p.t
          s, a, rot = 1 + (p.grow - 1) * u, p.fade and (1 - u) or math.min(1, (1 - u) * 4), p.rot
        end
        p.tex:ClearAllPoints()
        p.tex:SetPoint("CENTER", UIParent, "BOTTOMLEFT", x, y)
        p.tex:SetSize(math.max(0.1, p.w * s), math.max(0.1, p.h * s))
        p.tex:SetRotation(rot)
        p.tex:SetAlpha(math.max(0, math.min(1, p.a * a)))
        p.tex:Show()
      end
    end
  end
  if not any then self:Hide() end -- (nothing playing: no OnUpdate until the next effect)
end

-- A mark that holds, then fades (holes, stitches, strokes): grows in quickly, stays, fades at the end
local function Mark(o) o.path = function(u) return 0, 0, u < 0.12 and (o.pop or 1.5) - ((o.pop or 1.5) - 1) * u / 0.12 or 1, u > 0.82 and (1 - u) / 0.18 or 1 end; Fx(o) end
local function Glint(x, y, size, life, delay, r, g, b)
  Fx({ file = STAR, x = x, y = y, size = size, life = life or 0.35, delay = delay, add = true, r = r, gg = g, b = b,
    path = function(u) return 0, 0, math.sin(math.pi * math.min(1, u * 1.4)), 1, 0.5 * u end })
end
local function Ring(x, y, size, life, delay, r, g, b)
  Fx({ file = MEDIA .. "Ring.tga", x = x, y = y, size = size, life = life, delay = delay, add = true, r = r, gg = g, b = b,
    path = function(u) return 0, 0, 0.12 + 0.88 * u, 1 - u end })
end
local function Dot(o) o.file = o.file or MEDIA .. "Circle.tga"; o.fade = o.fade ~= false; Fx(o) end

-- Runs fn after t seconds unless the craft it belongs to has ended (cancelled)
local function After(t, guid, fn)
  if t <= 0 then fn() return end
  C_Timer.After(t, function() if craft and craft.guid == guid then fn() end end)
end

---------------------------------------------------------------------------
-- The professions. work(x, y, T, guid, s, loud): the beats over the cast (s: size; loud: beats make sound);
-- payoff(x, y, s, quiet, icon)
---------------------------------------------------------------------------
local P = {}

P.Leatherworking = { -- four punches, the thread runs straight through the holes, a tug and a glint
  work = function(x, y, T, guid, s, loud)
    local gap = 20 * s
    local x0 = x - 30 * s
    for i = 0, 3 do
      After(T * (0.18 + i * 0.16), guid, function()
        Mark({ file = MEDIA .. "Circle.tga", x = x0 + i * gap, y = y, size = 5 * s, life = T * (0.82 - i * 0.16) + 0.5, r = 0.08, gg = 0.05, b = 0.02, pop = 1.7 })
        Mark({ file = MEDIA .. "Ring.tga", x = x0 + i * gap, y = y, size = 7 * s, life = T * (0.82 - i * 0.16) + 0.5, r = 0.91, gg = 0.75, b = 0.54, pop = 1.7 })
        if loud then Sound("LeatherThok") end
      end)
    end
    for i = 0, 2 do
      After(T * (0.8 + i * 0.05), guid, function()
        Mark({ file = WHITE, x = x0 + i * gap + gap / 2, y = y, w = gap - 8 * s, h = 2, life = T * 0.2 + 0.5, r = 0.91, gg = 0.75, b = 0.54, pop = 1 })
        if loud then Sound("LeatherZip") end
      end)
    end
  end,
  payoff = function(x, y, s, quiet) Glint(x + 44 * s, y, 14 * s, 0.35); Sound(quiet and "LeatherTugQ" or "LeatherTug") end,
}

local POTION = { { 0.75, 0.54, 1 }, { 0.62, 1, 0.54 }, { 1, 0.48, 0.54 }, { 0.48, 0.78, 1 }, { 1, 0.83, 0.29 } }
P.Alchemy = { -- bubbles boil harder and harder (a new color each time), a foam burst, the cork pops
  work = function(x, y, T, guid, s, loud)
    local c = POTION[math.random(#POTION)]
    if loud then Sound("AlchClink") end
    for w = 0, 3 do
      After(T * (0.15 + w * 0.17), guid, function()
        for _ = 1, 2 + w * 2 do
          Dot({ x = x + R(-8, 8) * s, y = y, vx = R(-8, 8), vy = R(30 + w * 15, 60 + w * 20) * s, g = -20, size = R(3, 5 + w) * s, life = R(0.4, 0.6),
            r = c[1], gg = c[2], b = c[3] })
        end
        if loud then Sound("AlchGlug") end
      end)
    end
    After(T * 0.86, guid, function()
      for _ = 1, 8 do Dot({ x = x + R(-12, 12) * s, y = y + 18 * s, vx = R(-40, 40), vy = R(20, 60), g = 60, size = R(8, 12) * s, life = R(0.5, 0.8), a = 0.75 }) end
      Ring(x, y + 18 * s, 46 * s, 0.35, 0, c[1], c[2], c[3])
      if loud then Sound("AlchFoam") end
    end)
  end,
  payoff = function(x, y, s, quiet)
    Fx({ file = WHITE, x = x, y = y + 10 * s, w = 8 * s, h = 10 * s, life = 0.6, r = 0.63, gg = 0.44, b = 0.25,
      path = function(u) return 18 * u * s, 66 * math.sin(math.pi * u * 0.9) * s, 1, 1 - u end })
    Sound(quiet and "AlchCorkQ" or "AlchCork")
  end,
}

P.Tailoring = { -- the needle dips in and out four times, each stitch appearing, then a snip
  work = function(x, y, T, guid, s, loud)
    local x0 = x - 31 * s
    for i = 0, 3 do
      After(T * (0.2 + i * 0.16), guid, function()
        Mark({ file = WHITE, x = x0 + i * 18 * s, y = y, w = 10 * s, h = 2, life = T * (0.8 - i * 0.16) + 0.45, r = 0.96, gg = 0.92, b = 0.82, pop = 1 })
        if loud then Sound("TailorFwip") end
      end)
    end
  end,
  payoff = function(x, y, s, quiet)
    for k = -1, 1, 2 do -- two short strokes closing, like a snip (Streak.tga: a thin line through a square, so it turns)
      Fx({ file = MEDIA .. "Streak.tga", x = x + 44 * s, y = y, size = 16 * s, life = 0.35, add = true, rot = k * 0.5,
        path = function(u) return 0, 0, 1, 1 - u, k * 0.5 * (1 - math.min(1, u * 3)) end })
    end
    Glint(x + 44 * s, y, 12 * s, 0.3)
    Sound(quiet and "TailorSnipQ" or "TailorSnip")
  end,
}

P.Engineering = { -- two gears ratchet in steps (click, click, click), then a spring boings with a little puff
  work = function(x, y, T, guid, s, loud)
    for g = 0, 1 do
      local big = g == 0
      Fx({ file = MEDIA .. "Gear.tga", x = x + (big and -8 or 13) * s, y = y + (big and 0 or 13) * s, size = (big and 28 or 18) * s, life = T + 0.4,
        r = 0.78, gg = 0.83, b = 0.88,
        path = function(u) local t = u * (T + 0.4); local k = (t >= T * 0.3 and 1 or 0) + (t >= T * 0.45 and 1 or 0) + (t >= T * 0.6 and 1 or 0)
          return 0, 0, 1, u > 0.9 and (1 - u) * 10 or 1, (big and 1 or -1.5) * k * 0.4 end })
    end
    for i = 0, 2 do After(T * (0.3 + i * 0.15), guid, function() if loud then Sound("EngTick") end end) end
  end,
  payoff = function(x, y, s, quiet)
    Dot({ x = x + 26 * s, y = y + 12 * s, vx = 8, vy = 30, g = -10, size = 14 * s, grow = 2, life = 0.8, a = 0.4 })
    Glint(x + 24 * s, y + 10 * s, 12 * s, 0.3)
    Sound(quiet and "EngBoingQ" or "EngBoing")
  end,
}

P.Cooking = { -- two sizzle spatters, a flip with a whoosh, it lands with a "tss" and steams
  work = function(x, y, T, guid, s, loud, icon)
    for k = 0, 1 do
      After(T * (0.3 + k * 0.15), guid, function()
        for _ = 1, 4 do Dot({ x = x + R(-10, 10) * s, y = y - 8 * s, vx = R(-60, 60), vy = R(60, 120), g = 500, size = 3 * s, life = 0.35, r = 1, gg = 0.88, b = 0.63, add = true }) end
        if loud then Sound("CookSizzle") end
      end)
    end
    After(T * 0.62, guid, function()
      Fx({ file = icon or MEDIA .. "Circle.tga", x = x, y = y, size = 22 * s, life = T * 0.38,
        path = function(u) return 44 * u * s, 50 * math.sin(math.pi * u) * s, 1, 1, -2 * math.pi * u end })
      if loud then Sound("CookWhoosh") end
    end)
  end,
  payoff = function(x, y, s, quiet)
    for i = 0, 2 do
      local ph = i
      Fx({ file = MEDIA .. "Glow.tga", x = x + 44 * s - 8 + i * 8, y = y + 6, w = 7 * s, h = 22 * s, life = 0.8, delay = i * 0.06, a = 0.5,
        path = function(u) return 4 * math.sin(u * 6 + ph), 30 * u * s, 1, math.sin(math.pi * u) end })
    end
    Sound(quiet and "CookTssQ" or "CookTss")
  end,
}

P.Blacksmithing = { -- tap, tap with sparks, then the heavy CLANG with a glow and the quench hiss
  work = function(x, y, T, guid, s, loud)
    for k = 0, 1 do
      After(T * (0.35 + k * 0.27), guid, function()
        Glint(x, y, 14 * s, 0.22, 0, 1, 0.82, 0.48)
        for _ = 1, 3 do Dot({ file = MEDIA .. "Mote.tga", x = x, y = y, vx = R(-90, 90), vy = R(50, 140), g = 700, size = 4, life = 0.35, add = true, r = 1, gg = 0.7, b = 0.25, fade = false }) end
        if loud then Sound("SmithTap") end
      end)
    end
  end,
  payoff = function(x, y, s, quiet)
    Glint(x, y, 24 * s, 0.3, 0, 1, 0.82, 0.48)
    for _ = 1, math.floor(8 * s + 0.5) do Dot({ file = MEDIA .. "Mote.tga", x = x, y = y, vx = R(-120, 120), vy = R(60, 200), g = 700, size = 4, life = R(0.3, 0.5), add = true, r = 1, gg = 0.7, b = 0.25, fade = false }) end
    Dot({ file = MEDIA .. "Glow.tga", x = x, y = y, size = 30 * s, grow = 0.6, life = 0.6, add = true, r = 1, gg = 0.35, b = 0.12, a = 0.6 })
    Dot({ x = x, y = y + 6, vx = 0, vy = 40, g = -10, size = 16 * s, grow = 2, life = 0.7, a = 0.35 })
    Sound(quiet and "SmithClangQ" or "SmithClang")
    if not quiet then C_Timer.After(0.08, function() Sound("SmithHiss") end) end
  end,
}

local RUNES = 4 -- Runes.tga is a 4 x 4 sheet
P.Enchanting = { -- three runes stamp around it on rising chimes, then they're drawn in
  work = function(x, y, T, guid, s, loud)
    for i = 0, 2 do
      local a = math.pi / 2 + i * 2 * math.pi / 3
      local rx, ry = math.cos(a) * 30 * s, math.sin(a) * 30 * s
      local n = math.random(0, 15)
      local c = { (n % RUNES) / RUNES, (n % RUNES + 1) / RUNES, math.floor(n / RUNES) / RUNES, (math.floor(n / RUNES) + 1) / RUNES }
      After(T * (0.3 + i * 0.14), guid, function()
        local left = T * (0.7 - i * 0.14)
        Fx({ file = MEDIA .. "Runes.tga", coords = c, x = x + rx, y = y + ry, size = 16 * s, life = left, add = true, r = 0.85, gg = 0.78, b = 1,
          path = function(u) local k = u; if k < 0.7 then return 0, 0, k < 0.08 and 1.6 - 7.5 * k or 1, 1 end
            local v = (k - 0.7) / 0.3; return (44 * s - rx) * v, -ry * v, 1 - 0.6 * v, 1 - 0.5 * v end })
        if loud then Sound("EnchChime" .. (i + 1)) end
      end)
    end
  end,
  payoff = function(x, y, s, quiet) Glint(x + 44 * s, y, 26 * s, 0.35, 0, 1, 1, 1); Ring(x + 44 * s, y, 36 * s, 0.3, 0, 0.78, 0.69, 1); Sound(quiet and "EnchPingQ" or "EnchPing") end,
}

P["First Aid"] = { -- a soft green glow, two white strokes wrap across, a click and a glint
  work = function(x, y, T, guid, s, loud)
    After(T * 0.3, guid, function()
      Mark({ file = MEDIA .. "Glow.tga", x = x, y = y, size = 22 * s, life = T * 0.7 + 0.4, r = 0.49, gg = 1, b = 0.54, add = true, a = 0.9 })
      if loud then Sound("AidPat") end
    end)
    for i = 0, 1 do
      After(T * (0.52 + i * 0.18), guid, function()
        Mark({ file = WHITE, x = x, y = y + (i == 0 and 3 or -3) * s, w = 30 * s, h = 3, life = T * (0.48 - i * 0.18) + 0.45, r = 0.97, gg = 0.96, b = 0.92, pop = 1 })
        if loud then Sound("AidTap") end
      end)
    end
  end,
  payoff = function(x, y, s, quiet) Glint(x + 18 * s, y, 12 * s, 0.35); Sound(quiet and "AidClickQ" or "AidClick") end,
}

local DEFAULT = { -- any other profession: a glint and a ring
  work = function(...) end,
  payoff = function(x, y, s, quiet) Glint(x, y, 22 * s, 0.35); Ring(x, y, 40 * s, 0.4, 0, 1, 0.85, 0.4); Sound(quiet and "CraftDoneQ" or "CraftDone") end,
}

---------------------------------------------------------------------------
-- What's being crafted
---------------------------------------------------------------------------
-- The open profession, as one of P's keys: by its English name, else by the Enum.Profession key of
-- info.profession (any client language: "FirstAid" -> "First Aid")
local function Norm(s) return (s:gsub("%s", ""):lower()) end
local BYNORM = {}
for k in pairs(P) do BYNORM[Norm(k)] = k end
local function Profession()
  if not (C_TradeSkillUI and C_TradeSkillUI.GetBaseProfessionInfo) then return nil end
  local ok, info = pcall(C_TradeSkillUI.GetBaseProfessionInfo)
  if not ok or type(info) ~= "table" then return nil end
  local name = info.professionName
  if type(name) == "string" and not ns.Secret(name) and P[name] then return name end
  local id = info.profession
  if id ~= nil and not ns.Secret(id) and Enum and Enum.Profession then
    for key, v in pairs(Enum.Profession) do
      if v == id and BYNORM[Norm(key)] then return BYNORM[Norm(key)] end
    end
  end
  return (type(name) == "string" and not ns.Secret(name)) and name or nil
end

-- A craft is a trade skill cast while a profession window is open (gathering casts don't count)
local function WindowOpen()
  local w = _G.ProfessionsFrame or _G.TradeSkillFrame
  return w and w:IsShown()
end
function ns.CraftProfession(name) return P[name] or DEFAULT end

-- Where it plays: just right of your character (the middle of the screen, a little below)
local function Spot() return UIParent:GetWidth() / 2 + 70, UIParent:GetHeight() * 0.46 end

local function Remaining()
  if C_TradeSkillUI and C_TradeSkillUI.GetRemainingRecasts then
    local ok, n = pcall(C_TradeSkillUI.GetRemainingRecasts)
    if ok and type(n) == "number" and not ns.Secret(n) then return n end
  end
end

local function EndBatch()
  local b = batch
  batch = nil
  if not b then return end
  if ns.CraftBatchDone then ns.CraftBatchDone(b) end -- the tray's finale (CraftTray.lua)
  -- the crafted items go to the loot column, one row each, after the finale
  C_Timer.After(b.n > 1 and 1.6 or 0, function()
    for _, key in ipairs(b.order) do
      local d = b.items[key]
      if d then
        d.crafted = true
        if not (ns.PickedUp and ns.PickedUp(d)) then ns.Collect(d) end -- (no list: the normal popup)
      end
    end
  end)
end

local function Start(guid, T, icon, test, profName)
  local name = profName or Profession()
  local p = P[name] or DEFAULT
  local now = GetTime()
  if not batch or now - lastDone > GAP_END then
    if batch then EndBatch() end
    local rem = test and test.left or Remaining()
    batch = { n = 0, total = rem and rem + 1 or nil, items = {}, order = {}, prof = name, icon = icon }
    if ns.CraftBatchStart then ns.CraftBatchStart(batch) end
  end
  batch.n = batch.n + 1
  batch.testLeft = test and test.left or nil
  craft = { guid = guid, prof = p, t0 = now, T = T, icon = icon, test = test }
  local x, y = Spot()
  local full = batch.n <= FULL_ITEMS
  p.work(x, y, T, guid, full and 1 or 0.65, batch.n == 1, icon)
  -- a safety: if this cast never ends by an event we hear (a loading screen...), close it anyway
  local my = batch
  C_Timer.After(T + GAP_END + 1, function()
    if craft and craft.guid == guid then craft = nil; lastDone = GetTime() end
    if batch == my and not craft and GetTime() - lastDone > GAP_END then EndBatch() end
  end)
end

local function Done(guid)
  if not craft or craft.guid ~= guid then return end
  local p, n = craft.prof, batch and batch.n or 1
  local x, y = Spot()
  p.payoff(x, y, n <= FULL_ITEMS and 1 or 0.65, n > FULL_ITEMS, craft.icon)
  if ns.CraftItemDone and batch then ns.CraftItemDone(batch, craft.icon) end
  craft = nil
  lastDone = GetTime()
  local my = batch
  -- the batch is over when the game says nothing is left, or no new cast comes
  local rem = Remaining()
  if craft == nil and my and my.testLeft ~= nil then rem = my.testLeft end
  -- (0.8 s even when the game says none are left: it may count down before the last cast starts)
  local wait = (rem == 0) and 0.8 or GAP_END
  C_Timer.After(wait, function() if batch == my and not craft and GetTime() - lastDone >= wait - 0.05 then EndBatch() end end)
end

local function Cancel(guid) -- only our craft's own cast: another spell failing doesn't end a batch
  if not (craft and craft.guid == guid) then return end
  craft = nil
  lastDone = GetTime()
  local my = batch
  if my then C_Timer.After(0.3, function() if batch == my and not craft then EndBatch() end end) end
end

-- A "You create" line (LootFeed.lua): the item belongs to the batch (or a craft that just ended); it
-- doesn't pop up or rain. Returns true when taken (false: the caller shows it the normal way).
function ns.CraftTakes(d)
  if not On() then return false end
  if batch and not craft and GetTime() - lastDone > GAP_END then EndBatch() end -- (a stale batch)
  if not batch and GetTime() - lastDone > 3 then return false end
  local b = batch
  if not b then -- the line came after the batch ended: a row now
    d.crafted = true
    return ns.PickedUp ~= nil and ns.PickedUp(d) or false
  end
  local key = d.id or d.name
  if b.items[key] then b.items[key].count = (b.items[key].count or 1) + (d.count or 1)
  else b.items[key] = d; b.order[#b.order + 1] = key end
  if not b.icon then b.icon = d.icon end
  return true
end

---------------------------------------------------------------------------
-- Events: the player's casts
---------------------------------------------------------------------------
local ev = CreateFrame("Frame")
ev:SetScript("OnEvent", function(_, event, unit, guid)
  if unit ~= "player" or ns.Secret(guid) then return end
  if event == "UNIT_SPELLCAST_START" then
    if not On() or not WindowOpen() then return end
    local ok, _, _, tex, startMs, endMs, isTrade = pcall(UnitCastingInfo, "player")
    if not ok or ns.Secret(isTrade) or not isTrade or ns.Secret(startMs) or ns.Secret(endMs) or not startMs or not endMs then return end
    local T = math.max(0.4, (endMs - startMs) / 1000)
    Start(guid, T, (not ns.Secret(tex)) and tex or nil)
  elseif event == "UNIT_SPELLCAST_SUCCEEDED" then
    Done(guid) -- (also when switched off mid-cast: the batch still ends)
  else -- interrupted, failed, stopped
    Cancel(guid)
  end
end)

ns.OnInit(function()
  layer = CreateFrame("Frame", nil, UIParent)
  layer:SetAllPoints(UIParent)
  layer:SetFrameStrata("FULLSCREEN_DIALOG")
  layer:SetFrameLevel(90)
  layer:SetScript("OnUpdate", Step)
  layer:Hide() -- (shown while effects play)
  for _, e in ipairs({ "UNIT_SPELLCAST_START", "UNIT_SPELLCAST_SUCCEEDED", "UNIT_SPELLCAST_INTERRUPTED", "UNIT_SPELLCAST_FAILED", "UNIT_SPELLCAST_STOP" }) do
    pcall(ev.RegisterUnitEvent, ev, e, "player")
  end
end)

-- Tests (Gathering page): one craft or a short Create All of the profession picked, with a fake cast
local testN = 0
ns.AddAction("testcraft", function(arg)
  if not On() then return end
  local name, count = arg:match("^(.-)%s*(%d*)$")
  count = tonumber(count) or 1
  if not P[name] then name = "Tailoring" end
  local T = 1.4
  local icon = "Interface\\Icons\\INV_Fabric_Linen_01"
  for i = 0, count - 1 do
    C_Timer.After(i * (T + 0.15), function()
      testN = testN + 1
      local guid = "test" .. testN
      Start(guid, T, icon, { left = count - 1 - i }, name)
      C_Timer.After(T, function()
        Done(guid)
        if i == 0 then ns.CraftTakes({ id = 0, name = "Test craft", icon = icon, quality = 1, count = count, test = true }) end
      end)
    end)
  end
end)

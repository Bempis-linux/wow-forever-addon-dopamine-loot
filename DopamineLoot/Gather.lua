-- Dopamine Loot gathering (docs/mockups/gathering.html, round 3: G2, G4, G7). Gathering is addictive
-- already: this adds to it without getting in the way for hours.
--   Every gather: a small burst in the node's style where you clicked (leaves and petals, rock chips
--   with a spark, a splash, tufts), and the pieces fly into the harvest tally; a soft note that climbs
--   a step with each gather of a run (it starts low again after 8 s without gathering).
--   The harvest tally: what you gathered this session, in the game's look (item icons with quality
--   borders, names in the quality color, gold counts); a "+N" beside a row adds up while gathers come
--   fast; a full stack (the item's real stack size) flashes its row. It fades after a while without
--   gathering and comes back on the next. Movable (Mover.lua: "Move frames").
--   Rare finds (Uncommon or better) get a bigger burst; their popup comes from the normal loot feed.
--   Calm: after many gathers in 10 minutes (setting gatherCalm, default 40; 0 = never) the bursts get
--   small and the notes stop; the tally, stacks and rare finds stay as they are.
-- What counts as a gather (decided when the loot window is ready, kept until a second after it closes):
-- fishing loot; an herb or ore/stone/gem from a game object (a node); a creature's loot that is all
-- leather and hides (skinning). Gathered items don't rain: LootFeed hands them here.
local _, ns = ...

local MEDIA = "Interface\\AddOns\\DopamineLoot\\Media\\"
local BORDER = "Interface\\COMMON\\WhiteIconFrame"
local WHITE = "Interface\\Buttons\\WHITE8X8"
local MORPHEUS = "Fonts\\MORPHEUS.TTF"
local GetInfo = (C_Item and C_Item.GetItemInfo) or GetItemInfo
local GetInfoInstant = (C_Item and C_Item.GetItemInfoInstant) or GetItemInfoInstant
local TRADE_GOODS, GEM = 7, 3
local SUB_HERB, SUB_METAL_STONE, SUB_LEATHER = 9, 7, 6
local NOTE_RESET, CALM_WINDOW, GRACE, MERGE_T, MAX_ROWS, MAX_FX = 8, 600, 1, 1.5, 8, 80
-- How long the tally stays after the last gather: 12 s for a herb picked on the way while questing,
-- 2 s more for each gather in the last 10 minutes, up to 90 s in a real farming run
local LINGER_MIN, LINGER_PER, LINGER_MAX = 12, 2, 90
local ROW_W, ROW_H = 210, 26

local layer, tally, header, total
local rows, rowList = {}, {}       -- by item name; in display order
local fx, tweens = {}, {}
local kind, kindUntil, lootOpen = nil, 0, false
local nodeX, nodeY
local lootId, poppedId = 0, -1
local step, lastGather = 0, -999
local hist = {}                    -- times of recent gathers (calm)
local sum = 0
local lastShown = -999
local dismissedAt                  -- set when the tally is sent away early (right-click, combat)

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

local detected = false -- decided once per loot window (LOOT_READY may fire twice with autoloot)
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
-- Little effects: plain textures moved in one OnUpdate, and tweens
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
  p.x, p.y, p.vx, p.vy, p.g = o.x, o.y, o.vx or 0, o.vy or 0, o.g or 0
  p.size, p.size1, p.life, p.spin, p.a, p.flat = o.size, o.size1 or o.size, o.life, o.spin or 0, o.a or 1, o.flat or 1
  p.fade = o.fade
  p.tex:SetTexture(o.file)
  p.tex:SetVertexColor(o.r or 1, o.gg or 1, o.b or 1)
  p.tex:SetBlendMode(o.add and "ADD" or "BLEND")
  p.tex:SetRotation(0)
  p.tex:Hide()
end

local function Tween(dur, fn, delay) tweens[#tweens + 1] = { t = -(delay or 0), dur = dur, fn = fn } end

local fxOn = false -- any particle alive (else the loop below is skipped)
local function Step(_, dt)
  if fxOn then
  fxOn = false
  for _, p in ipairs(fx) do
    if p.on then
      fxOn = true
      p.t = p.t + dt
      if p.t >= p.life then p.on = false; p.tex:Hide()
      elseif p.t >= 0 then
        local u = p.t / p.life
        local s = p.size + (p.size1 - p.size) * u
        p.tex:ClearAllPoints()
        p.tex:SetPoint("CENTER", UIParent, "BOTTOMLEFT", p.x + p.vx * p.t, p.y + p.vy * p.t - 0.5 * p.g * p.t * p.t)
        p.tex:SetSize(s, s * p.flat)
        if p.spin ~= 0 then p.tex:SetRotation(p.spin * p.t) end
        p.tex:SetAlpha(p.a * (p.fade and (1 - u * 0.6) or 1) * math.min(1, (1 - u) * 4))
        p.tex:Show()
      end
    end
  end
  end
  for i = #tweens, 1, -1 do
    local w = tweens[i]
    w.t = w.t + dt
    if w.t >= 0 then
      local u = math.min(1, w.t / w.dur)
      w.fn(u)
      if u >= 1 then table.remove(tweens, i) end
    end
  end
  -- (Dismiss is below; Step only reads dismissedAt)
  -- the tally fades after a while without gathering, or at once when dismissed (not while it's being placed)
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

-- Hides the tally now (right-click, a fight starting); it comes back on the next gather
local function Dismiss()
  if tally and tally:IsShown() and not (ns.Mover and ns.Mover.IsUnlocked()) then dismissedAt = GetTime() end
end

local function R(a, b) return a + math.random() * (b - a) end

-- The node's burst. m: 1 normal, 0.4 calm; rare: bigger, with rings
local KIND = {
  herb = { { 0.48, 0.83, 0.29 }, { 0.72, 0.94, 0.44 }, { 0.94, 0.88, 0.44 }, { 1, 0.6, 0.82 } },
  ore = { { 0.54, 0.48, 0.42 }, { 0.69, 0.63, 0.56 }, { 0.78, 0.48, 0.23 }, { 1, 0.94, 0.69 } },
  fish = { { 0.75, 0.9, 1 }, { 0.54, 0.78, 1 }, { 1, 1, 1 } },
  skin = { { 0.63, 0.47, 0.31 }, { 0.85, 0.72, 0.56 }, { 0.42, 0.29, 0.19 } },
}
local function Burst(k, x, y, rare, m)
  local colors = KIND[k] or KIND.herb
  local n = math.floor((rare and 26 or 10) * m + 0.5)
  for i = 1, n do
    local c = colors[(i - 1) % #colors + 1]
    if k == "herb" then
      Fx({ file = MEDIA .. "Diamond.tga", x = x + R(-8, 8), y = y + R(-4, 10), vx = R(-70, 70) * m, vy = R(60, 140) * m, g = 160,
        size = R(5, 8), life = R(0.6, 1), spin = R(-7, 7), r = c[1], gg = c[2], b = c[3] })
    elseif k == "ore" then
      local spark = i % 4 == 0
      Fx({ file = MEDIA .. (spark and "Mote.tga" or "Diamond.tga"), x = x + R(-6, 6), y = y + R(-6, 6), vx = R(-120, 120) * m, vy = R(60, 170) * m,
        g = 600, size = spark and R(5, 8) or R(3, 6), life = R(0.4, 0.7), spin = R(-9, 9), r = c[1], gg = c[2], b = c[3], add = spark })
    elseif k == "fish" then
      Fx({ file = MEDIA .. "Circle.tga", x = x + R(-6, 6), y = y - 8, vx = R(-70, 70) * m, vy = R(90, 180) * m, g = 650,
        size = R(2.5, 4.5), life = R(0.5, 0.8), r = c[1], gg = c[2], b = c[3] })
    else
      Fx({ file = MEDIA .. "Circle.tga", x = x + R(-8, 8), y = y + R(-6, 8), vx = R(-50, 50) * m, vy = R(30, 80) * m, g = 40,
        size = R(3, 5), life = R(0.7, 1.1), fade = true, r = c[1], gg = c[2], b = c[3], a = 0.8 })
    end
  end
  if k == "fish" then
    Fx({ file = MEDIA .. "Ring.tga", x = x, y = y - 14, size = 14, size1 = 70 * m + 20, flat = 0.3, life = 0.6, r = 0.75, gg = 0.9, b = 1, a = 0.8 })
  end
  if rare then
    Fx({ file = MEDIA .. "Ring.tga", x = x, y = y, size = 20, size1 = 140, life = 0.6, r = 0.12, gg = 1, b = 0, add = true })
    Fx({ file = MEDIA .. "Ring.tga", x = x, y = y, size = 12, size1 = 80, life = 0.45, r = 1, gg = 0.96, b = 0.75, add = true })
  end
end

---------------------------------------------------------------------------
-- The harvest tally
---------------------------------------------------------------------------
local function QualityColor(q)
  local c = ITEM_QUALITY_COLORS and ITEM_QUALITY_COLORS[q or 1]
  if c then return c.r, c.g, c.b end
  return 1, 1, 1
end

local function Layout()
  local y = -18
  for _, row in ipairs(rowList) do
    row:ClearAllPoints()
    row:SetPoint("TOPRIGHT", tally, "TOPRIGHT", 0, y)
    y = y - ROW_H - 3
  end
  tally:SetHeight(-y)
end

local function NewRow(d)
  local row = CreateFrame("Frame", nil, tally)
  row:SetSize(ROW_W, ROW_H)
  local bg = row:CreateTexture(nil, "BACKGROUND")
  bg:SetAllPoints()
  bg:SetTexture(WHITE)
  if not pcall(bg.SetGradient, bg, "HORIZONTAL", CreateColor(0, 0, 0, 0.62), CreateColor(0, 0, 0, 0.04)) then bg:SetVertexColor(0, 0, 0, 0.4) end
  row.flash = row:CreateTexture(nil, "BORDER")
  row.flash:SetAllPoints()
  row.flash:SetColorTexture(1, 0.83, 0.29, 0)
  local icon = row:CreateTexture(nil, "ARTWORK")
  icon:SetSize(ROW_H - 4, ROW_H - 4)
  icon:SetPoint("LEFT", 2, 0)
  icon:SetTexture(d.icon)
  local border = row:CreateTexture(nil, "OVERLAY")
  border:SetTexture(BORDER)
  border:SetAllPoints(icon)
  border:SetVertexColor(QualityColor(d.quality))
  row.icon = icon
  local name = row:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  name:SetPoint("LEFT", icon, "RIGHT", 7, 0)
  name:SetPoint("RIGHT", row, "RIGHT", -44, 0)
  name:SetJustifyH("LEFT")
  if name.SetWordWrap then name:SetWordWrap(false) end
  name:SetText(d.name)
  name:SetTextColor(QualityColor(d.quality))
  local count = row:CreateFontString(nil, "OVERLAY", "NumberFontNormalLarge") -- (kept if the font below fails)
  count:SetFont(MORPHEUS, 16, "OUTLINE")
  count:SetPoint("RIGHT", -6, 0)
  count:SetTextColor(1, 0.82, 0)
  row.count = count
  -- "+N" just left of the count, bold and outlined (the stack mark steps aside while it shows)
  local plus = row:CreateFontString(nil, "OVERLAY", "NumberFontNormal")
  plus:SetFont("Fonts\\FRIZQT__.TTF", 13, "OUTLINE")
  plus:SetPoint("RIGHT", count, "LEFT", -5, 0)
  plus:SetTextColor(0.45, 1, 0.35)
  plus:SetShadowColor(0, 0, 0, 1)
  plus:SetShadowOffset(1, -1)
  plus:SetAlpha(0)
  row.plus = plus
  local stack = row:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  stack:SetPoint("RIGHT", count, "LEFT", -4, 0)
  stack:SetTextColor(1, 0.83, 0.29)
  row.stack = stack
  row.n, row.plusN, row.plusT, row.maxStack = 0, 0, -999, select(8, GetInfo(d.link or d.id or 0)) or 1
  row.used = GetTime()
  return row
end

local function Row(d)
  local key = d.id or d.name
  local row = rows[key]
  if row then row.used = GetTime(); return row end
  if #rowList >= MAX_ROWS then -- drop the one updated longest ago
    local old, oi = nil, nil
    for i, r in ipairs(rowList) do if not old or r.used < old.used then old, oi = r, i end end
    old:Hide()
    table.remove(rowList, oi)
    for k, r in pairs(rows) do if r == old then rows[k] = nil end end
  end
  row = NewRow(d)
  rows[key] = row
  rowList[#rowList + 1] = row
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
    row.stack:SetAlpha(1 - a)
    row.plus:SetTextHeight(13 * (u < 0.12 and 1.35 - 0.35 * u / 0.12 or 1))
  end)
end

local function Count(row, add)
  local before = row.n
  row.n = row.n + add
  sum = sum + add
  row.count:SetText(row.n)
  total:SetText(sum)
  Tween(0.22, function(u) local w = 1 - u; row.count:SetTextColor(1, 0.82 + 0.18 * w, w) end)
  local size = row.maxStack or 1
  if size > 1 and math.floor(row.n / size) > math.floor(before / size) then -- a full stack
    local s = math.floor(row.n / size)
    row.stack:SetText(s == 1 and "1 stack" or (s .. " stacks"))
    Tween(0.9, function(u) row.flash:SetAlpha(0.35 * (1 - u)) end)
    ns:PlayGatherStack()
  end
end

local function ShowTally()
  if ns.settings.noGatherTally then return false end
  lastShown, dismissedAt = GetTime(), nil
  tally:SetAlpha(1)
  tally:Show()
  return true
end

-- A piece flying from the node into its row (icon + border pairs, reused)
local pieces = {}
local function Piece()
  for _, p in ipairs(pieces) do if not p.busy then p.busy = true; return p end end
  local p = { t = layer:CreateTexture(nil, "OVERLAY"), b = layer:CreateTexture(nil, "OVERLAY", nil, 1), busy = true }
  p.b:SetTexture(BORDER)
  p.b:SetAllPoints(p.t)
  pieces[#pieces + 1] = p
  return p
end
local function Fly(icon, x0, y0, row, delay, onArrive)
  local p = Piece()
  local t, b = p.t, p.b
  t:SetTexture(icon)
  t:Hide(); b:Hide()
  Tween(0.55, function(u)
    local x1, y1 = row.icon:GetCenter()
    local k = row:GetEffectiveScale() / UIParent:GetEffectiveScale()
    x1, y1 = (x1 or x0) * k, (y1 or y0) * k
    local e = u * u * (3 - 2 * u)
    local s = 22 * (1 - 0.45 * u)
    t:ClearAllPoints()
    t:SetPoint("CENTER", UIParent, "BOTTOMLEFT", x0 + (x1 - x0) * e, y0 + (y1 - y0) * e + 70 * math.sin(math.pi * u))
    t:SetSize(s, s)
    t:Show(); b:Show()
    if u >= 1 then t:Hide(); b:Hide(); p.busy = false; onArrive() end
  end, delay)
end

---------------------------------------------------------------------------
-- A gathered item (from the loot feed, or a test). Each gather (one loot window) bursts and plays its
-- note once; every item flies into the tally.
---------------------------------------------------------------------------
local TEST_FIRST = 100000 -- test gathers number from here: they don't count toward calm
function ns.Gathered(d, k, id, x, y)
  if not layer then return end
  k = k or kind or "herb"
  id = id or lootId
  x, y = x or nodeX, y or nodeY
  if not x then x, y = NodePoint() end
  local rare = (d.quality or 1) >= 2 or d.rare
  local now = GetTime()
  local test = id > TEST_FIRST
  -- a test is shown above the settings window (the tally drops back down when it fades)
  if test then tally:SetFrameStrata("FULLSCREEN_DIALOG") end
  if id ~= poppedId then -- the gather itself: burst, note, calm count
    poppedId = id
    if not test then hist[#hist + 1] = now end
    local calm = Calm()
    if now - lastGather >= NOTE_RESET then step = 0 end
    lastGather = now
    step = step + 1
    Burst(k, x, y, rare, (calm and not rare) and 0.4 or 1)
    if not calm and not ns.settings.noGatherNotes then ns:PlayGatherNote(step) end
  elseif rare then
    Burst(k, x, y, true, 1)
  end
  if not d.name or not ShowTally() then return end
  local row = Row(d)
  local n = d.count or 1
  Plus(row, n)
  local pieces = math.min(n, 3)
  for i = 1, pieces do
    local add = (i == pieces) and (n - pieces + 1) or 1
    Fly(d.icon, x, y + 10, row, (i - 1) * 0.09, function() Count(row, add) end)
  end
end

---------------------------------------------------------------------------
-- Setup, events, tests
---------------------------------------------------------------------------
local function Create()
  layer = CreateFrame("Frame", nil, UIParent)
  layer:SetAllPoints(UIParent)
  layer:SetFrameStrata("FULLSCREEN_DIALOG") -- bursts and flying pieces (above the settings window for tests)
  layer:SetScript("OnUpdate", Step)
  tally = CreateFrame("Frame", nil, UIParent)
  tally:SetFrameStrata("MEDIUM")
  tally:SetSize(ROW_W, 40)
  tally:Hide()
  -- right-click sends it away until the next gather (only clicks on it are caught; it's small)
  tally:EnableMouse(true)
  tally:SetScript("OnMouseUp", function(_, button) if button == "RightButton" then Dismiss() end end)
  tally:SetScript("OnEnter", function(self)
    ns.Tooltip():SetOwner(self, "ANCHOR_LEFT")
    ns.Tooltip():SetText("Harvest", 1, 0.82, 0)
    ns.Tooltip():AddLine("What you gathered this session. Right-click to hide it; it comes back on your next gather.", 1, 1, 1, true)
    ns.Tooltip():Show()
  end)
  tally:SetScript("OnLeave", function(self) if ns.Tooltip():IsOwned(self) then ns.Tooltip():Hide() end end)
  header = tally:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  header:SetPoint("TOPLEFT", 4, 0)
  header:SetText("Harvest")
  total = tally:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  total:SetPoint("TOPRIGHT", -6, 0)
  total:SetText("")
  local wantSample, sampleRow
  ns.Mover.Register({ key = "tally", frame = tally, label = "Harvest tally", point = "TOPRIGHT", x = -18, y = -230,
    w = ROW_W, h = 90, preview = function(on)
      if ns.settings.noGatherTally then return end
      if on then -- a sample row while it's being placed (when the tally is empty)
        if #rowList == 0 and not wantSample then
          wantSample = true
          ns.ItemData(2447, 1, "test", function(d)
            if wantSample and #rowList == 0 then sampleRow = Row(d); sampleRow.count:SetText("12") end
          end)
        end
        tally:SetAlpha(1); tally:Show()
      else
        wantSample = false
        if sampleRow then -- take the sample out (unless a real gather counted into it meanwhile)
          if sampleRow.n == 0 then
            sampleRow:Hide()
            for i, r in ipairs(rowList) do if r == sampleRow then table.remove(rowList, i); break end end
            for key, r in pairs(rows) do if r == sampleRow then rows[key] = nil end end
            Layout()
          else
            sampleRow.count:SetText(sampleRow.n)
          end
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
  -- a fight starts: the tally steps out of the way (back on the next gather)
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
local function TestGather(k, rare)
  if not layer then return end
  testId = testId + 1
  local id = testId
  local w, h = UIParent:GetWidth(), UIParent:GetHeight()
  local x, y = w / 2 - 140, h * 0.42
  local items = TEST_ITEMS[k] or TEST_ITEMS.herb
  ns.ItemData(items[math.random(#items)], math.random(1, 3), "test", function(d) ns.Gathered(d, k, id, x, y) end)
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
  else
    TestGather(k, mode == "rare")
  end
end)

-- Dopamine Loot "Picked up" list (docs/mockups/cohesion.html, V1 "two lanes, one row look"): the small
-- finds that used to come as one-line popups (gray and white items, an Uncommon that isn't the best of its
-- loot, everything during a fight) list here instead, as rows in the harvest window's look, at the top of
-- the loot column on the right (the harvest window hangs under it). The same item again merges ("×2").
-- Each row leaves on its own, ROW_LIFE seconds after it came (or last merged): the list only shows what
-- you just picked up, never a log (the dungeon recap is for that). Big finds keep their popup right of
-- your character. Setting noFeed: off brings the one-line popups back.
local _, ns = ...

local MAX_ROWS, ROW_LIFE, ROW_OUT, ROW_H, ROW_GAP, HEAD_H = 6, 4, 0.4, 26, 2, 18

local feed, head
local rows, list = {}, {}   -- by item; in display order (oldest on top)
local spare = {}            -- rows put away, reused for the next items
local tweens = {}

function ns.FeedOn() return not ns.settings.noFeed end

local function Tween(dur, fn) tweens[#tweens + 1] = { t = 0, dur = dur, fn = fn } end

local function Height() return #list > 0 and HEAD_H + #list * (ROW_H + ROW_GAP) or 0 end

local function Layout()
  local y = -HEAD_H
  for _, row in ipairs(list) do
    row:ClearAllPoints()
    row:SetPoint("TOPRIGHT", feed, "TOPRIGHT", 0, y)
    y = y - ROW_H - ROW_GAP
  end
  feed:SetHeight(math.max(1, Height()))
  ns.SetFeedHeight(Height())
  -- the header says what's in it: "Crafted" when it's only things you made (Craft.lua)
  local allCrafted = #list > 0
  for _, row in ipairs(list) do if not row.crafted then allCrafted = false end end
  if head then head:SetText(allCrafted and "Crafted" or "Picked up") end
end

local function Clear()
  for _, row in ipairs(list) do row:Hide(); spare[#spare + 1] = row end
  wipe(list); wipe(rows)
  feed:Hide()
  feed:SetFrameStrata("MEDIUM")
  ns.SetFeedHeight(0)
end

local function CountText(row) row.count:SetText(row.n > 1 and ("×" .. row.n) or "") end

local function OnUpdate(_, dt)
  for i = #tweens, 1, -1 do
    local w = tweens[i]
    w.t = w.t + dt
    local u = math.min(1, w.t / w.dur)
    w.fn(u)
    if u >= 1 then table.remove(tweens, i) end
  end
  -- each row slides away on its own once its time is up; the rows under it close the gap
  local now, gone = GetTime(), false
  for i = #list, 1, -1 do
    local row = list[i]
    local u = (now - row.at - ROW_LIFE) / ROW_OUT
    if u >= 1 then
      row:Hide()
      table.remove(list, i)
      rows[row.key] = nil
      spare[#spare + 1] = row
      gone = true
    elseif u > 0 then
      row:SetAlpha(1 - u)
      row:ClearAllPoints()
      row:SetPoint("TOPRIGHT", feed, "TOPRIGHT", 18 * u * u, -HEAD_H - (i - 1) * (ROW_H + ROW_GAP))
    end
  end
  if gone then
    if #list == 0 then Clear() else Layout() end
  end
end

-- A small find. Returns true when it was listed (else the caller shows its one-line popup).
function ns.PickedUp(d)
  if not feed or not ns.FeedOn() or not ns.NewLootRow or not d.icon then return false end
  if ns.Mover and ns.Mover.IsUnlocked() then return false end
  feed:SetAlpha(1)
  if d.test then feed:SetFrameStrata("FULLSCREEN_DIALOG") end -- a test shows above the settings window
  feed:Show()
  local key = d.id or d.name
  local row = rows[key]
  local n = d.count or 1
  if row then -- the same item again: it merges (and its time starts over)
    row.n = row.n + n
    row.at = GetTime()
    row:SetAlpha(1)
    Layout()
    CountText(row)
    Tween(0.25, function(u) local w = 1 - u; row.count:SetTextColor(1, 0.91 + 0.09 * w, 0.66 + 0.34 * w) end)
  else
    if #list >= MAX_ROWS then -- the oldest makes room
      local old = table.remove(list, 1)
      old:Hide()
      spare[#spare + 1] = old
      rows[old.key] = nil
    end
    row = table.remove(spare)
    if row and ns.SetLootRow then ns.SetLootRow(row, d); row:Show() else row = ns.NewLootRow(d, nil, feed) end
    row.n, row.key, row.at, row.crafted = n, key, GetTime(), d.crafted
    CountText(row)
    rows[key] = row
    list[#list + 1] = row
    Layout()
    row:SetAlpha(0)
    Tween(0.26, function(u) -- slides in from the right
      row:SetAlpha(u)
      row:ClearAllPoints()
      local i = 0
      for j, r in ipairs(list) do if r == row then i = j end end
      if i > 0 then row:SetPoint("TOPRIGHT", feed, "TOPRIGHT", 14 * (1 - u) ^ 2, -HEAD_H - (i - 1) * (ROW_H + ROW_GAP)) end
    end)
  end
  ns:PlayTierSound(d.quality or 1)
  return true
end

ns.OnInit(function()
  if not ns.LootColumn then return end
  feed = CreateFrame("Frame", nil, UIParent)
  feed:SetFrameStrata("MEDIUM")
  feed:SetSize(230, 1)
  feed:SetPoint("TOPRIGHT", ns.LootColumn, "TOPRIGHT", 0, 0)
  feed:Hide()
  head = feed:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  head:SetPoint("TOPLEFT", 4, 0)
  head:SetText("Picked up")
  feed:SetScript("OnUpdate", OnUpdate)
end)

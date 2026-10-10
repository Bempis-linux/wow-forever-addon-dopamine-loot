-- Dopamine Loot popups: small gold-bordered notes. ns:Notify merges a burst of notices into one
-- popup with one sound; the optional login toast greets you once per login.
-- Off switches: /dl notify off, /dl sound off, /dl toast off.
local ADDON, ns = ...

local LOGIN_TOAST = false -- greet on login with version, help hint, and a greeting (Data/Greetings.lua)
local ICON = "Interface\\Icons\\INV_Misc_Book_09"         -- login toast icon
local NOTICE_ICON = "Interface\\Icons\\INV_Misc_Note_01"  -- notice icon
local SOUND = SOUNDKIT and SOUNDKIT.IG_ABILITY_PAGE_TURN   -- soft page turn
local FADE, TOAST_FOR, NOTICE_FOR, MAX_LINES = 1.5, 7, 4, 3

ns.AddToggle("notify", "noNotify", "notice popups")
ns.AddToggle("sound", "noSound", "popup sound")
if LOGIN_TOAST then
  ns.AddToggle("toast", "noToast", "login popup")
  ns.AddCommand("toast", "show the login popup again", function() ns:ShowToast() end)
end

-- A note with an icon, a title and a few lines. Hover holds it; click runs onClick; it fades.
local function Popup(name, width, iconPath, y, showFor)
  local t = CreateFrame("Button", name, UIParent, "BackdropTemplate")
  t:SetSize(width, 64)
  t:SetPoint("TOP", 0, y)
  t:SetFrameStrata("DIALOG")
  t:SetBackdrop({
    bgFile = "Interface\\Tooltips\\UI-Tooltip-Background",
    edgeFile = "Interface\\Tooltips\\UI-Tooltip-Border",
    tile = true, tileSize = 16, edgeSize = 16,
    insets = { left = 4, right = 4, top = 4, bottom = 4 },
  })
  t:SetBackdropColor(0.05, 0.04, 0.02, 0.92)
  t:SetBackdropBorderColor(1, 0.82, 0, 0.9)
  t.icon = t:CreateTexture(nil, "ARTWORK")
  t.icon:SetSize(40, 40)
  t.icon:SetPoint("TOPLEFT", 12, -12)
  t.icon:SetTexture(iconPath)
  t.title = t:CreateFontString(nil, "OVERLAY", "GameFontNormal")
  t.title:SetPoint("TOPLEFT", t.icon, "TOPRIGHT", 12, -1)
  t.body = t:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  t.body:SetPoint("TOPLEFT", t.title, "BOTTOMLEFT", 0, -4)
  t.body:SetPoint("RIGHT", -14, 0)
  t.body:SetJustifyH("LEFT")
  t.body:SetSpacing(3)

  local fade = t:CreateAnimationGroup()
  local alpha = fade:CreateAnimation("Alpha")
  alpha:SetFromAlpha(1)
  alpha:SetToAlpha(0)
  alpha:SetDuration(FADE)
  alpha:SetStartDelay(showFor)
  fade:SetScript("OnFinished", function() t:Hide() end)
  t.fade = fade
  t:SetScript("OnEnter", function(self) self.fade:Stop(); self:SetAlpha(1) end)
  t:SetScript("OnLeave", function(self) self.fade:Play() end)
  t:SetScript("OnClick", function(self)
    self.fade:Stop()
    self:Hide()
    if self.onClick then self.onClick() end
  end)
  t:Hide()

  function t:Pop(title, body)
    self.title:SetText(title)
    self.body:SetText(body)
    self:SetHeight(math.max(64, 38 + self.body:GetStringHeight()))
    self.fade:Stop()
    self:SetAlpha(1)
    self:Show()
    self.fade:Play()
  end
  return t
end
ns.Popup = Popup

---------------------------------------------------------------------------
-- Login toast (optional)
---------------------------------------------------------------------------
local function Greeting()
  local h = tonumber(date("%H"))
  local slot = (h >= 5 and h < 12) and "morning" or (h >= 12 and h < 17) and "afternoon"
    or (h >= 17 and h < 21) and "evening" or "night"
  local g = ns.GREETINGS and ns.GREETINGS[slot]
  if not g then return nil end
  local pool = {}
  for _, line in ipairs(g.all or {}) do pool[#pool + 1] = line end
  for _, line in ipairs(g[UnitFactionGroup("player")] or {}) do pool[#pool + 1] = line end
  if #pool == 0 then return nil end
  local pick = pool[math.random(#pool)]
  if pick == ns.settings.lastGreeting and #pool > 1 then
    repeat pick = pool[math.random(#pool)] until pick ~= ns.settings.lastGreeting
  end
  ns.settings.lastGreeting = pick
  return pick
end

local toast
function ns:ShowToast()
  toast = toast or Popup(ADDON .. "Toast", 440, ICON, -140, TOAST_FOR)
  toast.onClick = function() if ns.ToggleUI then ns:ToggleUI() end end
  local greeting = Greeting()
  toast:Pop(ns.TITLE .. " v" .. ns.Version(), "Type |cffffff00/dl help|r to list commands."
    .. (greeting and ("\n|cffe6cc80" .. greeting .. "|r") or ""))
end

function ns:PLAYER_ENTERING_WORLD(isInitialLogin)
  if LOGIN_TOAST and isInitialLogin and not self.settings.noToast then
    C_Timer.After(3, function() ns:ShowToast() end)
  end
end

---------------------------------------------------------------------------
-- Notices: ns:Notify(title, line, onClick). Everything within a moment becomes one popup and one
-- sound, titled by the first notice, up to MAX_LINES lines.
---------------------------------------------------------------------------
local notice
local pending = {}

local function Flush()
  local list = pending
  pending = {}
  if #list == 0 then return end
  local lines, seen = {}, {}
  for _, n in ipairs(list) do
    if n.line and not seen[n.line] then
      seen[n.line] = true
      lines[#lines + 1] = n.line
    end
  end
  if #lines > MAX_LINES then
    local more = #lines - MAX_LINES
    for i = #lines, MAX_LINES + 1, -1 do lines[i] = nil end
    lines[#lines + 1] = ("|cff9d9d9d...and %d more|r"):format(more)
  end
  notice = notice or Popup(ADDON .. "Notice", 340, NOTICE_ICON, -230, NOTICE_FOR)
  notice.onClick = list[1].onClick
  notice:Pop(list[1].title, table.concat(lines, "\n"))
  if SOUND and not ns.settings.noSound then PlaySound(SOUND) end
end

function ns:Notify(title, line, onClick)
  if self.settings.noNotify or self.quiet then return end
  pending[#pending + 1] = { title = title, line = line, onClick = onClick }
  if #pending == 1 then C_Timer.After(0.4, Flush) end
end

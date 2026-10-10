-- Dopamine Loot output: everything the addon has to say goes to a log window instead of chat.
-- Text is selectable; "Select all" highlights it for Ctrl+C (addons can't reliably write the
-- clipboard themselves, so this is the BugSack approach).
local ADDON, ns = ...

local MAX_LINES = 500
local lines = {} -- this session only: not saved (lines can name your character)
local win

-- Plain text: no color codes, links, or inline textures (they'd be copied as raw escape codes)
local function Plain(s)
  s = s:gsub("|c%x%x%x%x%x%x%x%x", ""):gsub("|r", "")
  s = s:gsub("|H.-|h(.-)|h", "%1"):gsub("|T.-|t", "")
  return s
end

local function Render()
  if not win then return end
  win.box:SetText(table.concat(lines, "\n"))
  win.count:SetText(("%d lines"):format(#lines))
end

local function CreateWindow()
  local name = ADDON .. "Log"
  local ok, w = pcall(CreateFrame, "Frame", name, UIParent, "PortraitFrameTemplate")
  if not ok then w = CreateFrame("Frame", name, UIParent, "BasicFrameTemplateWithInset") end
  w:SetSize(560, 380)
  w:SetPoint("CENTER", 0, 80)
  w:SetFrameStrata("DIALOG")
  w:SetToplevel(true)
  w:EnableMouse(true)
  w:SetMovable(true)
  w:SetClampedToScreen(true)
  w:RegisterForDrag("LeftButton")
  w:SetScript("OnDragStart", w.StartMoving)
  w:SetScript("OnDragStop", w.StopMovingOrSizing)
  w:Hide()
  table.insert(UISpecialFrames, name)
  if w.SetTitle then w:SetTitle(ns.TITLE .. " - Log")
  elseif w.TitleText then w.TitleText:SetText(ns.TITLE .. " - Log") end
  if w.SetPortraitToAsset then w:SetPortraitToAsset("Interface\\Icons\\INV_Misc_Note_01") end

  local scroll = CreateFrame("ScrollFrame", name .. "Scroll", w, "UIPanelScrollFrameTemplate")
  scroll:SetPoint("TOPLEFT", 16, -66)
  scroll:SetPoint("BOTTOMRIGHT", -34, 44)
  local bg = w:CreateTexture(nil, "BACKGROUND", nil, 1)
  bg:SetPoint("TOPLEFT", scroll, -4, 4)
  bg:SetPoint("BOTTOMRIGHT", scroll, 4, -4)
  bg:SetColorTexture(0, 0, 0, 0.4)
  w.scroll = scroll

  local box = CreateFrame("EditBox", nil, scroll)
  box:SetMultiLine(true)
  box:SetAutoFocus(false)
  box:SetFontObject("ChatFontNormal")
  box:SetWidth(500)
  box:SetScript("OnEscapePressed", function(self) self:ClearFocus() end)
  -- read-only: typing puts the log back, but selecting and Ctrl+C still work
  box:SetScript("OnTextChanged", function(_, userInput) if userInput then Render() end end)
  scroll:SetScrollChild(box)
  w.box = box
  scroll:EnableMouse(true)
  scroll:SetScript("OnMouseDown", function() box:SetFocus() end)

  local function Button(text, width, onClick)
    local b = CreateFrame("Button", nil, w, "UIPanelButtonTemplate")
    b:SetSize(width, 22)
    b:SetText(text)
    b:SetScript("OnClick", onClick)
    return b
  end
  local copy = Button("Select all", 96, function()
    box:SetFocus()
    box:HighlightText()
    w.hint:SetText("Press Ctrl+C to copy")
  end)
  copy:SetPoint("BOTTOMLEFT", 14, 14)
  local clear = Button("Clear", 70, function() wipe(lines); Render() end)
  clear:SetPoint("LEFT", copy, "RIGHT", 6, 0)
  local close = Button("Close", 70, function() w:Hide() end)
  close:SetPoint("BOTTOMRIGHT", -14, 14)
  w.hint = w:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
  w.hint:SetPoint("LEFT", clear, "RIGHT", 10, 0)
  w.count = w:CreateFontString(nil, "OVERLAY", "GameFontDisableSmall")
  w.count:SetPoint("RIGHT", close, "LEFT", -10, 0)
  w:SetScript("OnShow", function() w.hint:SetText(""); Render() end)
  win = w
end

-- Add a line to the log (doesn't open the window: ns:ShowLog does)
function ns.Log(...)
  lines[#lines + 1] = date("%H:%M:%S ") .. Plain(string.join(" ", tostringall(...)))
  if #lines > MAX_LINES then table.remove(lines, 1) end
  if win and win:IsShown() then Render() end
end
ns.Print = ns.Log -- nothing goes to chat from here on

function ns:ShowLog()
  if not win then CreateWindow() end
  win:Show()
  Render()
  C_Timer.After(0, function() win.scroll:SetVerticalScroll(win.scroll:GetVerticalScrollRange()) end)
end

function ns:ToggleLog()
  if win and win:IsShown() then win:Hide() else self:ShowLog() end
end

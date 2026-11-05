# Switch the game between the dev files (a junction to this repo) and a released copy (the CurseForge
# app's install, or a release zip). Both use the same SavedVariables, so settings carry over.
#
#   powershell -ExecutionPolicy Bypass -File tools/addon-mode.ps1 status  -Client "<WoW>\_forever_"
#   powershell -ExecutionPolicy Bypass -File tools/addon-mode.ps1 dev     -Client "<WoW>\_forever_"
#   powershell -ExecutionPolicy Bypass -File tools/addon-mode.ps1 release -Client "<WoW>\_forever_" [-Zip <release.zip>]
#
# The copy not in use is parked in <client>\Interface\<Name>.release (outside AddOns, so the game
# ignores it). The junction is only ever removed as a link: the repo files are never touched.
# After switching: /reload in game (or log in).
param(
  [Parameter(Mandatory = $true, Position = 0)][ValidateSet("status", "dev", "release")][string]$Mode,
  [Parameter(Mandatory = $true)][string]$Client,
  [string]$Name = "DopamineLoot",
  [string]$Source,
  [string]$Zip
)
$ErrorActionPreference = "Stop"
# the dev files: <repo>\<Name>, next to this tools folder ($PSScriptRoot is empty in param defaults on 5.1)
if (-not $Source) { $Source = Join-Path (Split-Path $PSScriptRoot -Parent) $Name }

$addons = Join-Path $Client "Interface\AddOns"
$live = Join-Path $addons $Name
$park = Join-Path $Client ("Interface\" + $Name + ".release")
if (-not (Test-Path $addons)) { throw "No AddOns folder at $addons" }
if (-not (Test-Path (Join-Path $Source "$Name.toc"))) { throw "No dev addon at $Source" }

function Version($dir) {
  $toc = Join-Path $dir "$Name.toc"
  if (-not (Test-Path $toc)) { return "?" }
  $line = Select-String -Path $toc -Pattern "^## Version:\s*(.+)$" | Select-Object -First 1
  if ($line) { return $line.Matches[0].Groups[1].Value.Trim() } else { return "?" }
}
function IsJunction($path) {
  if (-not (Test-Path $path)) { return $false }
  $item = Get-Item -LiteralPath $path -Force
  return [bool]($item.Attributes -band [IO.FileAttributes]::ReparsePoint)
}
function LinkTarget($path) { return (Get-Item -LiteralPath $path -Force).Target }
function Status {
  if (IsJunction $live) { "In use: DEV files (junction to $(LinkTarget $live)), version $(Version $Source)" }
  elseif (Test-Path $live) { "In use: RELEASED copy in AddOns, version $(Version $live)" }
  else { "In use: nothing (no $Name in AddOns)" }
  if (Test-Path $park) { "Parked: released copy, version $(Version $park)" } else { "Parked: nothing" }
  if (Get-Process -Name "Wow*" -ErrorAction SilentlyContinue) { "The game is running: /reload after a switch." }
}
function RemoveJunction {
  # Directory.Delete on a junction removes only the link, never what it points to
  [IO.Directory]::Delete($live)
  if (-not (Test-Path (Join-Path $Source "$Name.toc"))) { throw "The dev files are missing after removing the link: stop and check $Source" }
}

switch ($Mode) {
  "status" { Status }
  "dev" {
    if (IsJunction $live) { "Already on the dev files." }
    else {
      if (Test-Path $live) {
        if (Test-Path $park) { throw "Both $live and $park exist: move one away by hand first." }
        Move-Item -LiteralPath $live -Destination $park
        "Parked the released copy (version $(Version $park))."
      }
      New-Item -ItemType Junction -Path $live -Target $Source | Out-Null
      "Switched to the DEV files (version $(Version $Source))."
    }
    Status
  }
  "release" {
    # refuse before changing anything
    if ($Zip -and (Test-Path $park)) { throw "A released copy is already parked at ${park}: run release without -Zip to use it, or delete it by hand first." }
    if ($Zip -and -not (Test-Path $Zip)) { throw "No zip at $Zip" }
    if (IsJunction $live) { RemoveJunction; "Removed the dev link (the repo is untouched)." }
    elseif (Test-Path $live) { if (-not $Zip) { "Already on the released copy."; Status; break } else { throw "A released copy is already in AddOns; switch to dev first to replace it." } }
    if ($Zip) {
      $tmp = Join-Path ([IO.Path]::GetTempPath()) ("addon-mode-" + [guid]::NewGuid())
      Expand-Archive -LiteralPath $Zip -DestinationPath $tmp
      if (-not (Test-Path (Join-Path $tmp "$Name\$Name.toc"))) { Remove-Item $tmp -Recurse -Force; throw "The zip has no $Name\$Name.toc" }
      Move-Item -LiteralPath (Join-Path $tmp $Name) -Destination $live
      Remove-Item $tmp -Recurse -Force
      "Installed the released copy from the zip (version $(Version $live))."
    }
    elseif (Test-Path $park) {
      Move-Item -LiteralPath $park -Destination $live
      "Switched to the RELEASED copy (version $(Version $live))."
    }
    else {
      "No released copy yet: install Dopamine Loot with the CurseForge app now (it goes into AddOns), or run again with -Zip <release zip>."
    }
    Status
  }
}

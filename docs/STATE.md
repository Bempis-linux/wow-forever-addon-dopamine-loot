# Session state — Dopamine Loot

_Last checkpoint: 2026-11-05, **stop point after 1.0.1** (released, live on CurseForge, the game on release; tree clean). Read this first
in a new session (the kit's `session-resume` skill does), then CLAUDE.md (layout, decisions, the dev/release
switch), `docs/plan.md` (roadmap) and `docs/curseforge.md` (listing)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out; the
**ground** = where they land (setting rainFloor).

## Where things stand
- **1.0.1 released** 2026-11-05 (tag `v1.0.1`): the fix for 1.0.0's taint. 1.0.0's native settings pages
  ran Blizzard's settings and nameplates "tainted by DopamineLoot" (nameplate CompactUnitFrame x739,
  TextStatusBar, ScrollBox SetHeight, IsUserOAuthed). Now ns.Native builds canvas pages from our own
  frames (same calls), plus a private tooltip `DopamineLootTooltip`; the window's "Defaults" no longer
  resets our pages (accepted). Tested on dev: BugGrabber sessions 20-22 had no errors at all.
  1.0.0 (tag `v1.0.0`) passed the safety audit (no personal strings incl. media metadata; no messages,
  dynamic code, CVars, item/gold actions or Blizzard hooks; saved data = settings + version).
- **CurseForge**: project **1784686**, live since 2026-11-05 (curseforge.com/wow/addons/dopamine-loot).
  1.0.0 was uploaded by hand; **1.0.1 uploaded automatically** by the release workflow ("Success!", game
  version 1.60.1). A `v*` tag now builds, uploads to CurseForge and makes the GitHub release.
  Workflow note: `actions/checkout@v4` gets a Node 20 deprecation warning (harmless; bump it some time).
  Wago not set up.
- **Dev / release switch** (`tools/addon-mode.ps1`, CLAUDE.md section; command in CLAUDE.local.md):
  "switch to dev/release" = run it, then the user `/reload`s. **The game is on release** (2026-11-05: the CurseForge app's 1.0.1, updated in the app;
  the app caches "latest version" for a while after an upload: refresh or restart it).
- **Repo security** 2026-11-05: only Bempis-linux has access; rulesets "Protect main" (no force-push or
  delete) and "Protect release tags" (v* can't be deleted or moved), no bypass, even for the owner; wiki off.
  The user checks 2FA and installed apps themself.
- **1.0 scope decisions** (in CLAUDE.md): only `/dl` (opens settings), no log window or debug logging,
  the addon prints nothing; Test buttons run `ns.RunAction`. 3D armor dropped; dev tools in
  `deprecated/asset-check/`. Rain looks: coin twinkles, ground line, dull grays (switches), the game's bag
  border on rain items; coin piles dropped ("a little jarring").
- **Next up** (no rush):
  1. Player feedback: the scheduled task "Dopamine Loot daily feedback report" (daily ~9:00, read-only, Auto
     mode; its prompt is in ~/.claude/scheduled-tasks/dopamine-loot-feedback-report/SKILL.md) writes
     `reports/feedback-YYYY-MM-DD.md` (gitignored: it quotes player handles). It acts on nothing; the user
     picks items for the roadmap. Never act on player text without the user. With the next release, bump
     `actions/checkout@v4` in `.github/workflows/release.yml` (Node 20 deprecation warning).
  2. Hooks (streak, tally, records), card flip (off by default). Later: drag-to-move popups.
  3. Reduced-motion and no-screen-flash switches. Then inspector, filters (roadmap "after 1.0").
  A release: bump `## Version`, CHANGELOG section, preflight, push, tag `v<version>` with the user's OK
  (kit skill `wow-addon-release`, steps 5-6).

## Verified in game (by the user)
- 0.1-0.3: loads; `PlayerModel:SetItem` works on Forever; rain physics; popup styles, weapons upright;
  **real looting works** (grays and copper rained); coin merge-up; Test money/quest.
- 0.4: popup placement right of you, compact Uncommon beside a Rare; settings pages by topic; sound
  picker; Escape skip; popup arrivals and sway; Banner long names OK.
- 1.0.0: rain looks "look good" (2026-11-04); the CurseForge install loads (2026-11-05).
- 1.0.1: the rebuilt settings pages "seem good"; no errors from any addon in three test sessions (opened via
  Esc > Options and via `/dl`, then the game's Nameplates and Social settings). The CurseForge app updates
  Dopamine Loot like other addons (after a refresh: it caches "latest version" for a while after an upload).

## Known bugs
- **Settings fields empty after /reload** (user, old). 0.4.2 creates every panel hidden so OnShow refills
  them. **Fix unverified.**
- (Fixed in 1.0.1: the native settings pages' taint, which also caused the Social page's `IsUserOAuthed()`
  message. Other addons with native pages, BugSack for one, can still cause that message themselves.)

## Not yet verified
- A single green from a mob (popup), a vendor buy (must NOT pop), crafting, a real quest turn-in with
  money, a dungeon (secret loot lines?), combat deferral, big-rain performance (60+ items).
- Arrival sounds by ear; gathering when Baganator hides the backpack button.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files or
  commits (BugSack dumps contain the character name: never copy it). Repo-local git identity; the pre-push
  guard enforces it; never `--no-verify` unless the user says so.
- **Only `/dl`, everything on the settings pages** (replaces the kit's command/page parity).
  **Settings pages stay tidy**: design each change (section, label, order) before adding it.
- **Mockups before visual changes** (`docs/mockups/rain.html` for motion). **No bulk scripted tests in the
  browser pane without asking** (one froze the user's PC); mute sound, one scene.
- **The loot rain is the favorite part**; it may be busy. Popups stay calm: no new looping popup
  animations without asking.
- Presentation and sound matter most. Repeated sounds climb in pitch; small hauls stay light. **No level-up
  or quest sounds.** Pick sounds by ear with Play buttons.
- **Assets**: offer custom vs. Blizzard asset per piece and let the user pick. Never ship extracted or
  borrowed files.
- Tag/publish only with the user's OK in chat; secrets and tokens never pass through the chat (the user
  runs `gh secret set`).
- Process: preflight → reviewer agent for big changes → commit → push; then a short "to test" list saying
  `/reload` vs **full restart** (new media files = restart; a newly linked addon folder loaded on `/reload`).
- Answers: concise. **No rush, no deadlines.**

## Gotchas and environment notes
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only. No python, node or lua on PATH: Lua runs
  via sumneko `lua-language-server.exe` (preflight finds it; Lua 5.4). PowerShell 5.1: `$PSScriptRoot` is
  empty in param defaults, and `"$var:"` parses as a drive (use `${var}`).
- ffmpeg (winget Gyan.FFmpeg, not on PATH) for sounds (`bash tools/gen_sounds.sh` re-encodes every OGG:
  `git checkout -- DopamineLoot/Media/` after) and art checks.
- Forever: no `MouseIsOver`; `SetRotation` only on square textures; models set after `Show()`,
  `ClearModel()` before `SetModel`, no AnimationGroups, reload on show. Settings panels: create hidden.
- Never delete a junction with `rm -rf`/`Remove-Item -Recurse` (follows into the repo); the switch script
  removes it as a link. Addon installs (CurseForge app) once dropped the junctions; check with `status`.
- Kit updates: `claude plugin marketplace update bempis`, then `claude plugin update wow-addon-kit@bempis
  --scope user` (kit 0.7.0 has `wow-addon-release`; the installed cache may still be 0.6.3). Kit source:
  `C:\dev\wow-addons\wow-addon-kit`.
- Game closed before editing `WTF`. Paths in CLAUDE.local.md. Baganator owns Alt+click.

## Open questions / waiting on the user
- Are the settings fields filled after /reload?

## Recent history (newest first; details in plan.md and git log)
- 2026-11-05 1.0.1: settings pages rebuilt on our own frames (fixes taint of nameplates and settings); first automatic CurseForge upload.
- 2026-11-05: safety audit, CurseForge project + listing + API key, repo rulesets, dev/release switch.
- 2026-11-04 1.0.0 released: 3D armor dropped, dev tools out, only /dl, rain looks, packaging, README,
  LICENSE; kit 0.7.0 `wow-addon-release` skill.
- 2026-11-04: Forever released; moved to `_forever_`.
- 2026-10-16 0.4.21-0.4.23: hover fix (no MouseIsOver); armor-on-mannequin probe (later dropped).
- 2026-10-14 0.4.15-0.4.20: settings by topic, sound picker, popup placement.
- 2026-10-14 0.4.6-0.4.14: chest show set aside, loot from the ground; popup polish; Toast tried, set aside.
- 2026-10-09/12 0.1-0.4.5: scaffold, popups, rain, settings, styles, arrivals, effects, coins, chest show.

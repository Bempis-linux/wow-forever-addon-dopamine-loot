# Session state — Dopamine Loot

_Last checkpoint: 2026-10-09, after the scaffold + plan. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md and `docs/plan.md`._

## Where things stand
- **0.2.0** pushed (the user asked for rain + a settings window before filters, so the roadmap's
  "rain lite" moved up): `Rain.lua` (pure physics `ns.RainCore` + sprite pool; worst first, best last;
  Rare+ stays as popups; merges a new burst into one in flight; scales with UI height; substeps at
  low fps; `tools/test_rain.lua`), burst collector in `LootFeed.lua` (0.4 s quiet / 2 s max; 3+ →
  rain; big bursts in combat wait for PLAYER_REGEN_ENABLED), popup waiting queue (max 3 on screen;
  better items and previews push the oldest out), `Settings.lua` (Options > AddOns; `/dl` opens it):
  popups on/off, min quality with a Test per quality, 3D size number + Test, sound on/off + channel +
  check all, rain on/off, "rain from N", stay quality, test rain with a number field + Test, debug,
  log, check client. Commands added: `/dl rain [n]`, `/dl zoom`, `/dl settings`. Two reviewer runs; fixed.
- In progress: none. Waiting on the user's 0.2 test.
- **Next up**: 0.3 look & feel pass: pick a popup concept (mockups A Relic, B Beam, C Inspect lens,
  D Banner shown in chat 2026-10-10) and rain ideas (plan "Rain ideas"); then 0.4 filters (seen set/NEW,
  upgrade badge), 0.5 inspector, 0.6 chest show. 0.2.2 adds `/dl roll <deg>` to test upright weapons
  (`Model:SetRoll`) for the popup redesign; result not known yet.
- User feedback 2026-10-10: popup card frame "doesn't look super great"; wants just the item (weapons
  vertical) with a highlight behind; rain is "an extremely good start"; landing height now a setting.

## 0.3.0 (pushed, not yet seen in game)
- `View.lua`: shared popup view, 4 styles (relic, beam, halo = default, banner) on generated art
  (`tools/gen_textures.lua` → `Media/Glow|Halo|Ring|Beam|Banner.tga`, white tinted by quality);
  weapons stood up with `Model:SetRoll` ("Weapon tilt", default 90, unverified in game); per-style
  click areas (SetHitRectInsets); popups fit-limited (2 for tall styles).
- `Look.lua`: Options > AddOns > Dopamine Loot > **Popup look** (`/dl look`): style choice, sliders
  (size, 3D zoom, weapon tilt, spin speed, time on screen) with number fields, live preview box with
  quality + kind (weapon/helm/no model) buttons, "Show as a real popup", "Check any item ID".
  Settings helpers shared as `ns.UI` (Slider is new). Reviewer run; 11 findings fixed.
- Needs a **full restart** (new files and textures).
- 0.3.1: first in-game run spammed `View.lua:274 spin0 nil` (preview box OnUpdate ticked before its
  async item loaded); `Tick` now returns until an item is set. Lesson: OnUpdate on a view must guard
  for "nothing set yet".
- 0.3.1 screenshots (user): all four styles draw; preview works; `SetRoll` spins a weapon around
  its own length (not upright) → 0.3.2 uses `Model:SetPitch` (setting `weaponTilt`, 0-355, default
  90; 270 if upside down). Number boxes were empty on first open of the Look page (OnShow didn't
  fire) → filled at creation. Halo was "a little ugly" (fat, harsh band) → thinner, softer band + crisp
  rim (closer to mockup C2); Beam's ring overlapped the name → ring above the name, light rises from it.

## Verified in game (by the user, 0.2.0 video 2026-10-10)
- Rain works and the user likes the physics ("pretty good honestly"); Rare stays as a popup; "+N"
  counter; no icon-border glitch from SetRotation + SetTexCoord. Settings page fits (COL2 = 320), Test
  buttons and number fields work. Zoom 0.6 visibly bigger than 1 → default now 0.7 (0.2.1).
- 0.2.1: floor moved from 25% height to the screen bottom (user request). Not yet seen in game.
- 0.1.0 scaffold loads, `/dl help` prints the commands.
- 0.1.1: popups with **rotating 3D models** (Thunderfury, Smite's Mighty Hammer, Arcanite Reaper);
  `/dl model 12784` → "model file 144817 [loaded]" (`SetItem` + `GetModelFileID` work on Forever);
  `/dl test` with qualities; `/dl sounds` plays.

## Not yet verified
- 0.2.0 everything: rain (`/dl rain 8`, `/dl rain 30`), settings page layout (right column at
  COL2 = 320; not clipped?), number fields, combat deferral, real looting (popup + rain from a
  multi-item corpse), `/dl check` output (loot templates present?). Icon rotation + tex-coord crop
  on rain sprites (`SetRotation` with `SetTexCoord`) may show icon borders: watch for it.
- Model framing: Arcanite Reaper looked small at zoom 1 (screenshot); `/dl zoom` / the 3D size field
  exists to tune it.
- Later: Alt+Right-click on a bag item doesn't use it; `GetMouseButtonClicked()` inside the
  `HandleModifiedItemClick` hook (0.3).

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is the handle **Bempis**. Never the real name, email,
  Windows username, Battle.net account ID, character names or realm in anything tracked, committed or
  pushed. Repo-local git identity (Bempis + GitHub noreply); never touch the global git config.
  `.privacy-patterns`, `CLAUDE.local.md` and `.luarc.json` (machine paths) stay gitignored. The kit's
  pre-push hook enforces it; never `--no-verify` unless the user says so.
- Same working style as Loredex: only `/dl help` prints to chat; everything else goes to the log window
  or popups. Original assets and flavor text only.
- Presentation and sound matter most; the chest show should feel like Vampire Survivors' treasure chest.
- Inspector shortcut: Alt+Right-click. ffmpeg (winget) is OK to install at 0.5 for original chimes.
- Process: preflight → commit → push after each working increment; reviewer agent before big changes.
  The user tests in game and sends screenshots; give a short "to test" list and say `/reload` vs restart.
- Answers: concise summaries.
- **Every new `/dl` command also goes on the settings page** with meaningful controls (number fields
  or drag sliders, Test buttons); visual settings drive a **live popup preview** on the page with a
  quality and kind (weapon/armor/non-equippable) picker. Now a kit rule (house-style 0.5.0).
- Popups: all four styles as options; C2 halo lens is the favorite. Weapons upright.
- Rain ideas all accepted (plan "Rain ideas"); floor shadows low priority; Escape-to-skip a setting.

## Gotchas and environment notes
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only.
- The user sends test **videos** (`%USERPROFILE%\Videos\Captures\*.mp4`). ffmpeg is installed (winget
  Gyan.FFmpeg; binaries under `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*\...\bin`, not on
  PATH until a new shell). Contact sheet: `-vf "fps=1,scale=640:-1,drawtext=fontfile=C\\:/Windows/Fonts/arial.ttf:text='%{pts\:hms}':...,tile=3x3"`
  into the scratchpad, then Read the PNGs; full frames with `-ss <t> -frames:v 1`.
- Kit plugin is installed twice (user scope + Loredex project scope). After pushing a kit change:
  `claude plugin marketplace update bempis`, then `claude plugin update wow-addon-kit@bempis --scope user`
  (and the project-scope update from the Loredex folder). The CLI lives under %APPDATA%\Claude\claude-code.
- Game must be closed before editing anything under the client's `WTF` folder.
- 3D models: set after `Show()`; no AnimationGroups on frames holding models (drive by hand).
- Baganator is installed and uses Alt+click; Questie, ATT, HuntersFieldGuide also installed (see plan).
- Loredex's `_reference/wow-ui-source` is empty; Blizzard UI code is read from the Ketho annotations.

## Open questions / waiting on the user
- (none)

## Recent history (newest first)
- 2026-10-10 0.2.0: loot rain, settings page with Test buttons, popup queue, combat deferral.
- 2026-10-09 0.1.1: first loot popups (model or card), tier sounds, test/check commands.
- 2026-10-09 0.1.0: scaffolded with wow-addon-kit 0.4.0 (privacy guard), plan written and settled.

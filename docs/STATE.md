# Session state — Dopamine Loot

_Last checkpoint: 2026-10-16, after 0.4.21. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md (layout, decisions), `docs/plan.md` (roadmap; 0.4 row =
popups + rain) and `docs/design-review.md` (custom vs. Blizzard asset per piece; picks at the top)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out (the spawn
point, middle of the screen); the **ground** = where they land (setting rainFloor).

## Where things stand
- **0.4.21 pushed**, tree clean. 0.4 = popup polish, popup placement, settings by topic, rain from the
  ground.
- **Popup placement (0.4.20; placement looks good to the user; compact/combat via the 0.4.21 tests unverified)**: user picked right of you mid-screen; Poor/Common compact,
  an Uncommon compact unless it's the best of its loot (`burstBest`). Mockup defaults for the rest:
  size 0.8 (the user's saved 1.05 kept), 2 at once, time by rarity 2.5/4/6/8 s, clicks pass through
  (hover holds up to 10 s, not while mouselooking), compact in combat. Popup.lua `POPUP_POSITIONS`,
  `ns.PopupCompact`; View "compact" layout (one line, icon, no model, no arrival).
- **Settings (0.4.15-0.4.19)**: pages Dopamine Loot (native: 3 switches, tests), Popups (custom,
  Look.lua: rows When / Look / Placement / The 3D item + live preview + item ID check), Loot rain,
  Sounds (per rarity: Sound dropdown, Our chime, Preview/Play; Play all), Advanced (all native,
  Settings.lua `ns.Native`), Blizzard assets. **Known game bug, accepted**: after any addon's native
  page was shown, scrolling the game's Social page blocks `IsUserOAuthed()` and blames that addon
  (reproduced with BugSack alone). Custom rows on the pooled settings frames were removed (0.4.18).
- **Popups** (View.lua): arrival by rarity (`ARRIVAL`, star4 glints from Epic), sway (Epic+ turn once),
  weapons face you, long names shrink. Styles Relic (default), Beam, Banner; Toast set aside in
  `deprecated/toast/` (README: what needs work).
- **Loot rain** flies from the ground (setting `rainFrom`: ground fountain default / spread / below /
  middle; all four kept; `Core.LaunchSpeed`). Loot beams stay. The chest show (0.4.0-0.4.5) is in
  `deprecated/chest-show/` (README; not loaded; generators write its media there).
- `Assets.lua`: `/dl assets` + "Blizzard assets" page, kept as a tool.
- **Next up**:
  1. User tests 0.4.21 (`/reload`): hovering a popup no longer errors (0.4.20 called `MouseIsOver`,
     which Forever lacks: Popup.lua `OverHit` now); Test combat and Test pair buttons (first settings
     page; `/dl test epic combat`, `/dl testpair`) show compact popups.
  2. **Armor in 3D** (user asked): body armor on a mannequin in popups (DressUpModel; test first).
  3. Hooks (streak, tally, records), card flip (off by default). Later: drag-to-move popups.
  4. Reduced-motion and no-screen-flash switches. Then 0.5 inspector, 0.6 filters.

## Verified in game (by the user)
- 0.1-0.2: loads; `/dl help`; `PlayerModel:SetItem` works on Forever; rain physics; settings page.
- 0.3: popup styles, preview + sliders, weapons upright; rain effects; **real looting works** (grays
  and copper rained, coins included); coin merge-up, Test money/quest; opening sound by size.
- 0.4: popup placement right of you (0.4.20), Popups and Sounds pages tidy (0.4.19-0.4.20); the chest show worked (now set aside); Escape skip; asset check; popup arrivals and sway; settings pages by topic and the sound picker work (0.4.15-0.4.18); the Social-page "blocked" popup is a game bug (reproduced with BugSack)
  "looking pretty good"; weapons face you while swaying (0.4.8); Banner long names OK (0.4.9).

## Known bugs
- **Settings fields empty after /reload** (user). 0.4.2 creates every settings panel hidden so the
  Settings window's Show() fires OnShow (which refills them). **Fix unverified.**
- Old BugGrabber `View.lua spin0 nil` (sessions 15-16) is already fixed; ignore unless it returns.

## Not yet verified
- A single green from a mob (popup), a vendor buy (must NOT pop), crafting, a real quest turn-in
  with money, a dungeon (secret loot lines? `/dl debug`), combat deferral, big-rain performance.
- Arrival sounds by ear; gathering when Baganator hides the backpack button.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files
  or commits (BugSack dumps contain the character name: never copy it). Repo-local git identity;
  the pre-push guard enforces it; never `--no-verify` unless the user says so.
- **Every `/dl` command also gets a settings control** (house-style parity). **Settings pages must stay tidy** (user, 2026-10-14; kit 0.6.2 rule): design each settings change (section, label, order) before adding it; no messy appended rows.
- **Mockups before visual changes** (`docs/mockups/rain.html` for motion). **Never run bulk scripted
  tests in the browser pane without asking** (one froze the user's PC); read the console instead.
- **The loot rain is the user's favorite part**; it may be busy. Popups stay calm: no new looping
  popup animations without asking.
- Presentation and sound matter most. Repeated sounds climb in pitch; small hauls stay light.
  **No level-up or quest sounds** (confusing). The user prefers picking sounds by ear with Play
  buttons over describing them.
- **Assets**: Blizzard assets (by path/fileID/atlas/SOUNDKIT) are welcome where they fit; offer
  custom vs. Blizzard per piece and let the user pick (kit 0.6.0 house style). Never ship
  extracted or borrowed files.
- Only `/dl help` prints to chat.
- Process: preflight → reviewer agent for big changes → commit → push; then a short "to test" list
  saying `/reload` vs **full restart** (new files, .toc = restart).
- Answers: concise. **No rush, no deadlines.**

## Gotchas and environment notes
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only (sed is fine for plain text).
  No python. No node/lua on PATH: Lua runs via the sumneko `lua-language-server.exe`
  (preflight finds it); it is Lua 5.4.
- ffmpeg (winget Gyan.FFmpeg, not on PATH) for sounds (`bash tools/gen_sounds.sh`, which re-encodes
  every OGG: `git checkout -- DopamineLoot/Media/` after) and art checks.
- `MouseIsOver` (FrameXML helper) does not exist on Forever: check hit rects by hand.
- New media files need a full game restart. `SetRotation` only on square textures. Models: set
  after `Show()`, placed and sized first, `ClearModel()` before `SetModel`, no AnimationGroups;
  models drop while hidden (reload on show). Big world models need `SetCamDistanceScale` > 1.
- Settings pages: create the panel hidden (`panel:Hide()`) or OnShow never fires.
- Roadmap: name upcoming work, not version numbers (fixes keep taking the next patch number).
- Kit updates: `claude plugin marketplace update bempis`, then `claude plugin update
  wow-addon-kit@bempis --scope user`. Kit source: `C:\dev\wow-addons\wow-addon-kit`.
- Game closed before editing `WTF`. Paths in CLAUDE.local.md. Baganator owns Alt+click.

## Open questions / waiting on the user
- Are the settings fields filled after /reload?

## Recent history (newest first; details in plan.md and git log)
- 2026-10-16 0.4.21: hover error fixed (no MouseIsOver on Forever); compact and combat popup tests.
- 2026-10-14 0.4.20: popup placement (right of you, compact low rarities, click-through).
- 2026-10-14 0.4.15-0.4.19: settings rebuilt by topic, sound picker, Sounds page tidied.
- 2026-10-14 0.4.6-0.4.14: chest show set aside, loot flies from the ground; popup polish (arrival by
  rarity, sway, weapons face you, long names); Toast style tried (0.4.7-0.4.13), set aside.
- 2026-10-12 0.4.1-0.4.5: asset check, design review (kit 0.6.0 rule), chest show with game models.
- 2026-10-11 0.4.0: drawn chest show. 0.3.10-0.3.11: coins, quest money, chest sounds.
- 2026-10-09/10 0.1-0.3.9: scaffold, popups, rain, settings, four styles, arrivals, rain effects.

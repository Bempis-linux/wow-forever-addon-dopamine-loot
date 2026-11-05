# Session state — Dopamine Loot

_Last checkpoint: 2026-11-04, 1.0.0 committed (first release; tag not pushed yet). Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md (layout, decisions), `docs/plan.md` (roadmap) and
`docs/design-review.md` (custom vs. Blizzard asset per piece; picks at the top)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out (the spawn
point, middle of the screen); the **ground** = where they land (setting rainFloor).

## Where things stand
- **WoW: Forever released 2026-11-04**: client folder `_forever_` (Interface still 16001, build 1.60.1).
  Junctions for DopamineLoot and Loredex were missing there and were recreated 2026-11-04 (an addon install
  had dropped them). `/reload` picked up the newly linked addons (the "new addon = restart" rule was wrong;
  new media files still need a restart). Release account started fresh (no beta saved data). Installed
  there: BugGrabber, BugSack, Syndicator, EasyFishing (no Baganator yet). Paths in CLAUDE.local.md.
- **1.0.0 = first release** (user, 2026-11-04: "scrap the 3D armor view, clean up for a full first
  release"). Picks: version 1.0.0; the asset tool + armortest out of the addon (`deprecated/asset-check/`,
  README keeps the DressUpModel findings; Core InitDB clears `assetCheck`/`armorTest`); `deprecated/`
  stays in the repo; distribution = GitHub release zip + CurseForge/Wago. Added `.pkgmeta` (WeakAuras
  layout: `package-as: DopamineLoot`, `move-folders: DopamineLoot/DopamineLoot: DopamineLoot`),
  `.github/workflows/release.yml` (BigWigs packager on a `v*` tag), CHANGELOG.md, MIT LICENSE, README for
  players. **Not done yet**: user pushes/approves the tag `v1.0.0` (the first real packager run, unverified);
  CurseForge/Wago projects (user creates them, then `## X-Curse-Project-ID` / `## X-Wago-ID` in the .toc and
  `CF_API_KEY` / `WAGO_API_TOKEN` repo secrets); check whether CurseForge lists a WoW Forever game version.
- **Only `/dl`** (user, 2026-11-04: "we should only need /dl to open the settings page"): every other
  command, `/dopamine`, the log window (Output.lua), debug logging and the Advanced page are gone; the
  addon prints nothing. Test buttons run `ns.RunAction` (LootFeed.lua: test, testpair, rain, testcoins,
  testquest, model). The item ID check on the Popups page just shows the popup (no report).
  Overrides the kit's command/page parity rule for this project (CLAUDE.md).
- **Popup placement (0.4.20; verified: placement, compact Uncommon beside a Rare via Test pair, 0.4.21)**: user picked right of you mid-screen; Poor/Common compact,
  an Uncommon compact unless it's the best of its loot (`burstBest`). Mockup defaults for the rest:
  size 0.8 (the user's saved 1.05 kept), 2 at once, time by rarity 2.5/4/6/8 s, clicks pass through
  (hover holds up to 10 s, not while mouselooking), compact in combat. Popup.lua `POPUP_POSITIONS`,
  `ns.PopupCompact`; View "compact" layout (one line, icon, no model, no arrival).
- **Settings (0.4.15-0.4.19)**: pages Dopamine Loot (native: 3 switches, tests), Popups (custom,
  Look.lua: rows When / Look / Placement / The 3D item + live preview + item ID check), Loot rain,
  Sounds (per rarity: Sound dropdown, Our chime, Preview/Play; Play all) (all native,
  Settings.lua `ns.Native`). **Known game bug, accepted**: after any addon's native
  page was shown, scrolling the game's Social page blocks `IsUserOAuthed()` and blames that addon
  (reproduced with BugSack alone). Custom rows on the pooled settings frames were removed (0.4.18).
- **Popups** (View.lua): arrival by rarity (`ARRIVAL`, star4 glints from Epic), sway (Epic+ turn once),
  weapons face you, long names shrink. Styles Relic (default), Beam, Banner; Toast set aside in
  `deprecated/toast/` (README: what needs work). Body armor stays a tilting card (3D armor dropped).
- **Loot rain** flies from the ground (setting `rainFrom`: ground fountain default / spread / below /
  middle; all four kept; `Core.LaunchSpeed`). Loot beams stay. The chest show (0.4.0-0.4.5) is in
  `deprecated/chest-show/` (README; not loaded; generators write its media there).
- **Next up**:
  1. Release: user checks 1.0.0 in game (`/dl` opens settings, no Advanced page, Test buttons work), then tag `v1.0.0`
     with the kit's new `wow-addon-release` skill (kit 0.7.0, written from this release; steps 5-6).
  1b. **Rain looks built** (picked 2026-11-04 in rain.html, "New look"): coin twinkles (gold often, silver
      less; switch Twinkle), ground line (Ground), dull grays (Poor), and the game's bag border on every item
      (WhiteIconFrame on a black rim; replaced the plain edge, no setting). Coin piles
      **dropped** (user: "a little jarring"). Not yet seen in game.
  2. Hooks (streak, tally, records), card flip (off by default). Later: drag-to-move popups.
  3. Reduced-motion and no-screen-flash switches. Then inspector, filters (roadmap "after 1.0").

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
  with money, a dungeon (secret loot lines? no debug logging since 1.0), combat deferral, big-rain performance.
- Arrival sounds by ear; gathering when Baganator hides the backpack button.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files
  or commits (BugSack dumps contain the character name: never copy it). Repo-local git identity;
  the pre-push guard enforces it; never `--no-verify` unless the user says so.
- **Only `/dl`, everything on the settings pages** (user, 2026-11-04; replaces command/page parity). **Settings pages must stay tidy** (user, 2026-10-14; kit 0.6.2 rule): design each settings change (section, label, order) before adding it; no messy appended rows.
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
- The addon prints nothing (no chat, no log window; 1.0).
- Process: preflight → reviewer agent for big changes → commit → push; then a short "to test" list
  saying `/reload` vs **full restart** (new media = restart; a newly linked addon folder loaded on `/reload`, 2026-11-04).
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
- Game closed before editing `WTF`. Paths in CLAUDE.local.md (client `_forever_` since 2026-11-04). Baganator owns Alt+click.

## Open questions / waiting on the user
- Are the settings fields filled after /reload?

## Recent history (newest first; details in plan.md and git log)
- 2026-11-04 1.0.0: first release prep (3D armor dropped, dev tools out, packaging, README, LICENSE).
- 2026-11-04: Forever released; moved to `_forever_` (docs, local paths, privacy patterns).
- 2026-10-16 0.4.22-0.4.23: `/dl armortest` probe for armor on a mannequin.
- 2026-10-16 0.4.21: hover error fixed (no MouseIsOver on Forever); compact and combat popup tests.
- 2026-10-14 0.4.20: popup placement (right of you, compact low rarities, click-through).
- 2026-10-14 0.4.15-0.4.19: settings rebuilt by topic, sound picker, Sounds page tidied.
- 2026-10-14 0.4.6-0.4.14: chest show set aside, loot flies from the ground; popup polish (arrival by
  rarity, sway, weapons face you, long names); Toast style tried (0.4.7-0.4.13), set aside.
- 2026-10-12 0.4.1-0.4.5: asset check, design review (kit 0.6.0 rule), chest show with game models.
- 2026-10-11 0.4.0: drawn chest show. 0.3.10-0.3.11: coins, quest money, chest sounds.
- 2026-10-09/10 0.1-0.3.9: scaffold, popups, rain, settings, four styles, arrivals, rain effects.

# Session state — Dopamine Loot

_Last checkpoint: 2026-10-12, after 0.4.5. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md (layout, decisions), `docs/plan.md` (roadmap; 0.4 row =
the chest show) and `docs/design-review.md` (custom vs. Blizzard asset per piece; picks at the top)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out (the spawn
point, middle of the screen); the **ground** = where they land (setting rainFloor).

## Where things stand
- **0.4.5 pushed**, working tree clean. 0.3 (look & feel) is done; 0.4 (chest show) in progress.
- The chest show's containers are the **game's own models** since 0.4.3 (user's picks on the
  Blizzard assets page): sack 200442 = pouch, Strongbox 219372 = chest, large ornate chest 200953 =
  gold. Rain.lua: `GAME_BOX {file, size, cam}`, `LoadGameBox`, `DrawGameBox`, `WarmGameBoxes`;
  lid anims 0 shut → 148 opens → 149 held open (`ANIM_OPEN_T` 0.6 s). Switch "Game chests (3D)"
  (`noRainModels`); the drawn containers (0.4.0) are the fallback. Details: design-review.md.
- 0.4.5: loot starts inside the container's mouth and grows out (user reported it seemed to spawn
  above/beside). **Unverified**; if still off, the model's vertical placement (`b.y - 0.12*size`)
  vs. its real opening needs tuning per model from a screenshot taken as it opens.
- `Assets.lua` (0.4.1): `/dl assets` + "Blizzard assets" sub-page (main page → Other): model/
  animation viewer (wheel shows zoom), textures/atlases, sounds with Play, fonts. Results in
  `DopamineLootDB.assetCheck`.
- **Next up**:
  1. User tests 0.4.5 (`/reload`): Test rain 3 / 8 / 12, does loot come out of the sack / Strongbox /
     gold chest? Settings fields filled after /reload (0.4.2 fix)?
  2. Remaining design-review picks: star4 sparkles, SKURRI counter font, "Blizzard toast" popup
     style, bags-glow on rain icons; Blizzard sounds as choices with Play buttons.
  3. 0.4.6 hooks: loot streak (30 s window; from x3 small hauls get the chest; x5 fanfare; "streak
     ended" summary), session tally, personal records banners.
  4. 0.4.7 card flip (click), off by default.
  5. 0.4.8 settings cleanup (user asked): pages by topic, better controls; go through every setting
     with the user first (keep/improve/merge/drop), mockup first.
  6. Reduced-motion and no-screen-flash switches. Then 0.5 inspector, 0.6 filters.

## Verified in game (by the user)
- 0.1-0.2: loads; `/dl help`; `PlayerModel:SetItem` works on Forever; rain physics; settings page.
- 0.3: all four popup styles, preview + sliders, weapons upright; rain effects; **real looting works**
  (grays and copper rained, coins included); coin merge-up, Test money/quest; opening sound by size.
- 0.4.0-0.4.4: pouch / chest / golden chest at test rain 3 / 8 / 12; Escape skip; effects page not
  cut off; asset check runs and saves; game sack and Strongbox look right, lid opens and stays open;
  gold chest fits at cam 2.6 ("better").

## Known bugs
- **Settings fields empty after /reload** (user). 0.4.2 creates every settings panel hidden so the
  Settings window's Show() fires OnShow (which refills them). **Fix unverified.**
- Old BugGrabber `View.lua spin0 nil` (sessions 15-16) is already fixed; ignore unless it returns.

## Not yet verified
- A single green from a mob (popup), a vendor buy (must NOT pop), crafting, a real quest turn-in
  with money, a dungeon (secret loot lines? `/dl debug`), combat deferral, big-rain performance.
- Arrival sounds by ear; gathering when Baganator hides the backpack button; Alt+Z mid chest show
  (the model should reload with the UI).

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files
  or commits (BugSack dumps contain the character name: never copy it). Repo-local git identity;
  the pre-push guard enforces it; never `--no-verify` unless the user says so.
- **Every `/dl` command also gets a settings control** (house-style parity).
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
- New media files need a full game restart. `SetRotation` only on square textures. Models: set
  after `Show()`, placed and sized first, `ClearModel()` before `SetModel`, no AnimationGroups;
  models drop while hidden (reload on show). Big world models need `SetCamDistanceScale` > 1.
- Settings pages: create the panel hidden (`panel:Hide()`) or OnShow never fires.
- Roadmap version labels shift when fixes take a patch number; renumber plan.md + this file together.
- Kit updates: `claude plugin marketplace update bempis`, then `claude plugin update
  wow-addon-kit@bempis --scope user`. Kit source: `C:\dev\wow-addons\wow-addon-kit`.
- Game closed before editing `WTF`. Paths in CLAUDE.local.md. Baganator owns Alt+click.

## Open questions / waiting on the user
- Does loot now come out of each container (0.4.5)? Are the settings fields filled?

## Recent history (newest first; details in plan.md and git log)
- 2026-10-12 0.4.5: loot rises out of the container's mouth. 0.4.4: gold chest camera.
- 2026-10-12 0.4.3: game containers with real lid animations. 0.4.2: settings fields fix.
- 2026-10-12 0.4.1: asset check; design review; kit 0.6.0 custom vs. Blizzard rule.
- 2026-10-11 0.4.0: drawn chest show containers. 0.3.10-0.3.11: coins, quest money, chest sounds.
- 2026-10-09/10 0.1-0.3.9: scaffold, popups, rain, settings, four styles, arrivals, rain effects.

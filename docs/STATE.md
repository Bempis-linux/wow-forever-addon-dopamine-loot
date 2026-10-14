# Session state — Dopamine Loot

_Last checkpoint: 2026-10-14, after 0.4.11. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md (layout, decisions), `docs/plan.md` (roadmap; 0.4 row =
popups + rain) and `docs/design-review.md` (custom vs. Blizzard asset per piece; picks at the top)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out (the spawn
point, middle of the screen); the **ground** = where they land (setting rainFloor).

## Where things stand
- **0.4.11 pushed**, tree clean. 0.4.11: Toast frames are atlases only (plain LessAwesome up to Rare, gold MoreAwesome for Epic+; the LootToast.blp slice from retail coords drew a broken bar on Forever); the label line never wraps (shrinks up to 2 pt). 0.4 = popup polish + loot rain from the ground (chest show set aside).
- **Popups** (View.lua; picks from `docs/mockups/popups.html`): arrival by rarity (`ARRIVAL`: Rare 10
  burst sparks; Epic 14 + 5 star4 glints; Legendary 22 + 7 glints, 2 shockwaves, embers); sway, Epic+
  turn once first ("Sway speed" = setting `spinSpeed`); upright weapons face you (`self.face` pi/2);
  long names shrink up to 5 pt, then wrap to 2; Beam motes Rare+ only. Styles: Relic (default), Beam,
  **Toast**, Banner. Halo lens dropped (a saved "halo" becomes "toast").
- **Toast** (0.4.10): Blizzard's own layout from LootWonAlertFrameTemplate (annotations'
  AlertFrameSystems.xml): 276x96, icon 52 at (22,-23), label line (our info) at (81,-18), name in the
  dark box (84,-42, 167x33). Frame by quality: LessAwesome below Rare, the default LootToast.blp
  slice for Rare/Epic, gold MoreAwesome for Legendary; border LOOT_BORDER_BY_QUALITY. **Unverified**
  (0.4.9 had the name outside the box, a misplaced icon, gold border on every rarity).
- **Loot rain** flies from the ground (setting `rainFrom`: ground fountain default / spread / below /
  middle; all four kept; `Core.LaunchSpeed`). Loot beams stay. The chest show (0.4.0-0.4.5) is in
  `deprecated/chest-show/` (README; not loaded; generators write its media there).
- `Assets.lua`: `/dl assets` + "Blizzard assets" page, kept as a tool.
- **Next up**:
  1. User tests 0.4.11 (`/reload`): Toast at each rarity incl. a long name, clicking through them in the preview; rain "Loot flies from";
     settings fields filled after /reload?
  2. **Sound picker** per rarity with Play buttons: the game's own loot sounds (check they play)
     and ours, layered or alone. User: our synthesized sounds feel artificial, no punch (current and
     "short stab" best, "swell" bad); a little more drama, short, not tiresome; **no level-up/quest**.
  3. **Popup placement**: popups feel "in your face" and get in the way; satisfying but **not
     blocking**. Mockup first (position, size, hold time, click-through, compact low tiers).
  4. **Armor in 3D** (user asked): body armor on a mannequin in popups (DressUpModel; test first).
  5. Hooks (streak, tally, records), card flip (off by default), settings cleanup (pages by topic;
     every setting discussed with the user first, mockup first).
  6. Reduced-motion and no-screen-flash switches. Then 0.5 inspector, 0.6 filters.

## Verified in game (by the user)
- 0.1-0.2: loads; `/dl help`; `PlayerModel:SetItem` works on Forever; rain physics; settings page.
- 0.3: popup styles, preview + sliders, weapons upright; rain effects; **real looting works** (grays
  and copper rained, coins included); coin merge-up, Test money/quest; opening sound by size.
- 0.4: the chest show worked (now set aside); Escape skip; asset check; popup arrivals and sway
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
- Roadmap: name upcoming work, not version numbers (fixes keep taking the next patch number).
- Kit updates: `claude plugin marketplace update bempis`, then `claude plugin update
  wow-addon-kit@bempis --scope user`. Kit source: `C:\dev\wow-addons\wow-addon-kit`.
- Game closed before editing `WTF`. Paths in CLAUDE.local.md. Baganator owns Alt+click.

## Open questions / waiting on the user
- Are the settings fields filled after /reload?

## Recent history (newest first; details in plan.md and git log)
- 2026-10-14 0.4.6-0.4.10: chest show set aside, loot flies from the ground; popup polish (arrival by
  rarity, sway, weapons face you, long names); Toast style on the game's own toast layout.
- 2026-10-12 0.4.1-0.4.5: asset check, design review (kit 0.6.0 rule), chest show with game models.
- 2026-10-11 0.4.0: drawn chest show. 0.3.10-0.3.11: coins, quest money, chest sounds.
- 2026-10-09/10 0.1-0.3.9: scaffold, popups, rain, settings, four styles, arrivals, rain effects.

# Session state — Dopamine Loot

_Last checkpoint: 2026-10-12, with 0.4.1. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md (layout, decisions), `docs/plan.md` (roadmap: 0.3
row = everything done in look & feel; 0.4 row = the chest show plan) and `docs/design-review.md`
(custom vs. Blizzard asset per piece, awaiting the user's picks)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out (the spawn
point, middle of the screen); the **ground** = where they land (setting rainFloor).

## Where things stand
- **0.4.1 pushed** (asset check), with 0.4.0 (chest show containers): neither seen in game yet.
  0.3 (look & feel) is done.
- 2026-10-12: the user wants **Blizzard assets used where they fit** (not only our generated ones);
  kit 0.6.0 made "custom vs. Blizzard options per piece" a house-style rule. `docs/design-review.md`
  lists every piece with both options (recommendations: real 3D chest models with their open
  animation, star4 sparkles, SKURRI numbers, quest-complete sound; keep our pitch-climbing sets,
  physics, rays). 0.4.1 adds `Assets.lua`: `/dl assets` + the "Blizzard assets" sub-page (button under
  Other on the main page): steppers for chest/sack models (animation scan, Closed 148 / Opening 154 /
  Stand 0, drag to turn, wheel to zoom), textures/atlases, sounds (Play), fonts. Results saved in
  `DopamineLootDB.assetCheck` (read it with wow-test-debug).
- 0.4.0: the rain comes out of a container (`Core.BoxPlan`, Rain.lua "The chest show" section): the
  **loot pouch** for small hauls (jiggles, bursts, sags), the **treasure chest** (medium: quick pop;
  big = any Rare+: it shakes, the seam's light climbs white→green→blue→purple to the best item with a
  chime each step, then the lid flies off with rays), the **golden chest** for a Legendary. Layered
  128-unit square textures tinted in game (Chest*, Pouch*, Rays) from tools/gen_textures.lua; sounds
  ChestRattle1-3, Tease00-05, ChestBurst, ChestBurstGold, PouchPop (tools/gen_sounds.sh). Switches
  Chest/Shake/Tease/Burst on the effects page; the openSound setting still picks the opening sound.
- **Next up** (the 0.4 row in docs/plan.md has the full plan, picked in the mockup):
  1. User tests 0.4.0 + 0.4.1 together (full restart: new textures, sounds, Assets.lua): Test rain 8
     (chest + tease + burst), 12 (golden chest), 3 (pouch), Test money 54c (pouch); Escape during the
     shake; then the Blizzard assets page and `/dl assets`.
  2. Read `DopamineLootDB.assetCheck`, the user picks per row of design-review.md, wire the picks in
     (each with our asset as fallback and a switch back), record the picks in plan.md.
  3. 0.4.2 hooks: loot streak (30 s window; from x3 small hauls get the chest; x5 fanfare; "streak
     ended" summary), session tally, personal records banners.
  4. 0.4.3 card flip (click), off by default: Rare+ fly out as "?" until their card is flipped.
  5. 0.4.4 settings cleanup (user asked 2026-10-12): pages organized by topic, better controls,
     discuss every setting with the user first (keep/improve/merge/drop), mockup first. Fix the empty
     fields bug (Known bugs) sooner if cheap.
  6. Reduced-motion and no-screen-flash switches. Lucky drops skipped (idea: Questie drop rate <5%).
  7. Then 0.5 inspector, 0.6 filters (NEW/UPGRADE badges; swapped with the chest show).

## Verified in game (by the user)
- 0.1-0.2: loads; `/dl help`; models via `PlayerModel:SetItem` work on Forever; rain physics liked;
  settings page, Test buttons, number fields, landing height.
- 0.3: all four popup styles, preview + sliders, weapons upright, flash + sparks; the calmer 0.3.7.
- 0.3.9-0.3.11: rain effects "look pretty good"; **real looting works** (a level 3 mob's grays and
  copper rained, coins included); coin icons, merge-up, Test money/quest buttons; opening sound by
  haul size ("looking good").

## Known bugs
- **Settings fields show empty** when the settings page is opened (reported 2026-10-12; unsure whether
  after login, after /reload, or on any reopen: ask/repro). Likely the same cause as the OnShow
  gotcha below: panels are created shown, so OnShow (which refills the fields) doesn't fire; try
  `panel:Hide()` after CreateFrame in Settings.lua, Look.lua, RainFx.lua (Assets.lua already does).

## Not yet verified
- A single green from a mob (popup), a vendor buy (must NOT pop), crafting ("crafted" badge), a real
  quest turn-in with money (coins + the reward item last; QUEST_TURNED_IN path), a dungeon (are loot
  lines secret values? `/dl debug`), combat deferral, performance with a big rain + popups.
- 0.3.8 arrival sounds by ear in game; Escape skip; gathering with Bagnon/Baganator hiding the
  backpack button (falls back to bottom right).
- 0.4.0 on screen: the effects page now has 18 switches (2 x 9): is "Main settings" cut off at the
  bottom? (add a scroll frame if so). The open chest stays until the rain settles and covers the best
  item's beam behind it: fade the body after ~1.5 s if that looks wrong.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files
  or commits (pasted BugSack dumps contain the character name: never copy it). Repo-local git
  identity; the kit's pre-push guard enforces it; never `--no-verify` unless the user says so.
- **Every `/dl` command also gets a settings control** (house-style "Settings page parity").
  Settings pages may scroll when they need to; none does yet.
- **Mockups before visual changes; motion ideas as an HTML mockup** the user toggles
  (`docs/mockups/rain.html`), then port. **Never run bulk or fast-forwarded scripted tests in the
  browser pane without asking** (one froze the user's PC and spammed sound); read the console instead.
- **The loot rain is the user's favorite part**; it may be busy. The popups stay calm (the user found
  idle animation "a little overboard", 0.3.7): no new looping popup animations without asking.
- Presentation and sound matter most. Sounds: chest sounds differ from ground sounds; repeated sounds
  climb in pitch (pentatonic sets) so they never sound like one note; small hauls stay light.
- Only `/dl help` prints to chat. Assets: Blizzard assets (models, textures, icons, sounds by path
  or ID) are welcome where they fit, not only our generated ones; in design, offer custom vs.
  Blizzard options per piece and let the user pick. Never ship extracted or borrowed files.
- Process: preflight → reviewer agent for big changes → commit → push; then a short "to test" list
  saying `/reload` vs **full restart** (new files: textures, sounds, .toc = restart).
- Answers: concise. **No rush, no deadlines**: never reorder work because of a date.

## Gotchas and environment notes
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only (sed is fine for plain text).
- No node/lua on PATH: Lua runs via the sumneko `lua-language-server.exe` (preflight finds it), e.g.
  `lua-language-server.exe tools/gen_textures.lua`. It is Lua 5.4: no `math.log10` (use log/log(10)).
- ffmpeg (winget Gyan.FFmpeg, `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*\...\bin`, not on
  PATH): renders sounds (`bash tools/gen_sounds.sh`), art checks (tinted `lutrgb` overlays on a dark
  `color` source → PNG), video contact sheets. **gen_sounds.sh re-encodes every OGG with new bytes**:
  afterwards `git checkout -- DopamineLoot/Media/` keeps only the new (untracked) files.
- WoW only finds media files that existed at client start: new textures/sounds need a full restart.
- `Texture:SetRotation` only on square textures (non-square skews); ColorTextures don't rotate;
  generated textures must be power-of-two. Models: set after `Show()`, no AnimationGroups.
- Settings sub-pages may never fire OnShow on first open: fill controls at creation. Likely cause
  (reviewer, 2026-10-12): the panel frame is created shown; `panel:Hide()` after CreateFrame (done in
  Assets.lua) lets the Settings window's Show() fire OnShow every open. Look.lua and RainFx.lua could do the same.
- Kit plugin updates: `claude plugin marketplace update bempis`, then `claude plugin update
  wow-addon-kit@bempis --scope user` (CLI under `%APPDATA%\Claude\claude-code`).
- Game closed before editing `WTF`. BugGrabber: `<client>\WTF\Account\<account>\SavedVariables\
  !BugGrabber.lua` (paths in CLAUDE.local.md). Baganator owns Alt+click; Questie, ATT, Details installed.

## Open questions / waiting on the user
- None. (Decided: pouch for small hauls, 30 s streak, lucky drops later, card flip off by default.)

## Recent history (newest first; details in the plan's 0.3/0.4 rows and git log)
- 2026-10-12 0.4.1: asset check (/dl assets, Blizzard assets page); design review of custom vs. Blizzard assets; kit 0.6.0 rule.
- 2026-10-11 0.4.0: chest show containers (pouch, chest with shake/tease/burst, golden chest).
- 2026-10-11 0.3.11: opening sound by haul size. 0.3.10: coin icons, merge-up, quest money, chest sounds.
- 2026-10-10 0.3.9: loot rain effects. 0.3.8: arrival sounds. 0.3.7: calmer popups. 0.3.6: Relic v2 default.
- 2026-10-09/10 0.1-0.3.5: scaffold, popups with 3D models, rain, settings, four styles, rarity arrivals.

# Session state — Dopamine Loot

_Last checkpoint: 2026-11-12, 1.4.0 design in progress (no code yet). Read this first in a new session (the
`session-resume` skill does), then CLAUDE.md and `docs/plan.md` ("1.4.0 scope, revised 2026-11-12" holds every
round and pick). Older detail: git log, CHANGELOG.md._

## Where things stand
- **1.3.1 is the latest release** (2026-11-10; CurseForge project 1784686). A code check of 1.3 on 2026-11-12
  found no tech debt (two stale notes fixed). **The game is on the RELEASED copy**: switch to dev before
  testing new work (`tools/addon-mode.ps1`, command in CLAUDE.local.md; then `/reload`).
- **1.4.0 = Leveling + the dungeon recap** (set 2026-11-12 after a CurseForge comment asking for "numbers go
  up" moments). The dice roll moved to 1.5 (needs a group to test). Design only so far; mockups in
  `docs/mockups/`, all picks in plan.md:
  - **Bars family = Ring + road** (bars.html → skillup-r2/r3.html "B"): the skill-up is a ring drawn in the
    profession's material, its tool riding the head, the next unlock at the seam, the next unlocks in a row.
    It replaces the 1.3 skill-up bar and sets the look for XP and rep.
  - **XP picked: xp-r10.html** (10 rounds), all on the game's XP bar (cover the new part, reveal as XP
    lands): Combined (swell + segment pops + spark to a ring at the bar's end with the next level) + chain
    counter + session glow + quiet kills / loud milestones; **kills = Rain from above, quests = Comet +
    impact**. Open: With-loot handling and the "Calm when busy" sound policy.
  - **Rep picked** (rep-r1/r2.html): Sweep on the game's rep bar (only while shown); other factions = setting
    Faction rings (default, draggable via Move frames) / Picked-up rows / Off; losses quiet; quiet repeats;
    new standing = Ring + road banner. No faction icons in the API: a hand-made factionID → icon table.
  - **Level-up picked: levelup-r4.html**: Ascension every level (halo rises from your feet, stats float up
    into a column on your LEFT), Cinematic every 10 levels growing out of Ascension (road of decades, the
    unlock shown big); mid-fight a small ring, the full moment after the fight.
- **Next up** (one thing at a time, the user's wish this release): the **dungeon recap** (plan.md "1.4.0:
  Dungeons" part 2: brainstorm, API checks, mockups); then
  the **crafting animations redesign per profession** (several unique designs each, like the popup rounds);
  then API checks in game and build. API findings so far: plan.md (XP, PLAYER_LEVEL_UP payload is probably
  retail's: snapshot stats ourselves; rep chat strings, name → factionID scan).
- **Waiting on the user**: paste `docs/curseforge.md` into the CurseForge page.

## Verified in game (by the user)
- Everything shipped in 1.0-1.3.1 (details in git history of this file).
## Not yet verified
- The recipe-color line after a real crafting skill-up (`relativeDifficulty` read works: `/dump` gave 3).
- Big real batches (100+) sinking the pile; `/dl` in combat opening after the fight; a dungeon (secret loot
  text?); a vendor buy must not pop; gathering when Baganator hides the backpack button.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files or commits
  (BugSack dumps contain the character name: never copy it). Never `--no-verify` unless the user says so.
- **Only `/dl`**; everything is a control on a settings page. Main on/off switches on the first page; a
  feature's page holds its details (CLAUDE.md "Settings layout"). Design each settings change before adding it.
- **Mockups before visual changes; the user picks.** Mockups must show exactly what the game will do (render
  the mockups' own sounds; tools drawn in the mockup's style). Options must be **clearly different** (rejected
  as "too similar" twice). Test on the user's grounds (dark, dirt, grass, bright).
- **Simple shapes** (lines, dots, rings, glints, real item icons) over drawn objects (memory file). **Polish
  only what the user names** (memory file).
- Effects stay pleasant over hundreds of crafts: Create All items play at **full size**; only the sounds
  step down (full, then quiet copies, then silent beats).
- Presentation and sound matter most; repeated sounds climb in pitch; no level-up or quest sounds; pick sounds
  by ear. Assets: offer custom vs. Blizzard per piece; never ship extracted or borrowed files.
- **No bulk scripted runs in the browser pane without asking** (one froze the user's PC); mute, one scene.
  The silent offline media render (below) was allowed.
- **1.4.0 process** (2026-11-12): **one thing at a time** (1.3 juggled many ideas and was rushed at the end);
  wide exploration first, like the popups (popup-designs.html), no cap on rounds; branch out by **staging**
  (around the character, whole screen, the game's own bars), never **lottery/chance metaphors** (card flips
  rejected for good: the addon supplements the game's systems; memory file). No new bars on screen: work on
  the game's own XP/rep bars. **Fatigue matters**: "dopamine is the goal but it mustn't get exhausting over a
  long session" (fast kills + loot): calm sound policies, quiet repeats. **Info in one place**: effects for
  an always-visible element (the XP bar) live on it (memory file). Vary the thing the user names ("how the
  bar gains XP" meant the arrival, not the look).
- Tag/publish only with the user's OK in chat ("Tested, publish it" / "lets just release"). Secrets never
  pass through the chat. Each minor release (1.x.0) replaces the "What's new" block in `docs/curseforge.md`.
- Process: preflight → reviewer agent for big changes → commit → push → a short "to test" list saying
  `/reload` vs **full restart** (new files = restart). Answers concise. No rush.

## Gotchas and environment notes
- **Media pipeline**: `tools/render-media.ps1` (background) serves `tools/render-media.html` (the mockups'
  sound code + our SVGs) on :8765; in the browser pane `await renderAll()`, then `bash tools/convert-media.sh`
  into `DopamineLoot/Media` (clear stale `tools/out/` first). `gen_craft_sounds.sh` is superseded.
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only. No python/node/lua on PATH (Lua via
  lua-language-server, found by preflight). ffmpeg via winget (on PATH in Git Bash).
- Forever: no `MouseIsOver`; `SetRotation` only on square textures; models set after `Show()`; no
  AnimationGroups; settings panels created hidden. Craft.lua `Fx{ sub = n }` sets the draw sublevel and
  `axis = "x"/"y"` scales one side only.
- Never delete a junction with `rm -rf`/`Remove-Item -Recurse` (CLAUDE.md). The CurseForge app caches
  "latest version" a while after an upload. Browser pane: close old mockup tabs when a new file won't open.
- Kit: wow-addon-kit 0.7.1 (`claude plugin update wow-addon-kit@bempis --scope user` with the desktop app's
  CLI, path in CLAUDE.local.md). Game closed before editing `WTF`. Baganator owns Alt+click.
- Repo: rulesets protect main and `v*` tags (no force-push/delete); Wago not set up.

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out; the **ground** =
where they land; the **harvest window** / **loot column** (side column with "Picked up"); the **pile** = the
Create All tray.

## Open questions / waiting on the user
- XP: With-loot handling; Calm-when-busy (maybe addon-wide: loot,
  gathering, crafting and XP sharing one sound budget).
- Paste the CurseForge description; update the release copy to 1.3.1 in the app.

## Recent history (newest first; details in CHANGELOG and git log)
- 2026-11-12 1.4.0 design day: scope (leveling + recap), bars family, skill-up, XP, rep, level-up rounds.
- 2026-11-10 1.3.1: Leatherworking = leather-r3 A. 1.3.0: the professions release.
- 2026-11-09 1.2.x: rain animations, new popup styles. 2026-11-06 1.1.0: the flair update.
- 2026-11-05 1.0.1: settings rebuilt on our own frames (taint fix); first automatic CurseForge upload.
- 2026-11-04 1.0.0: first release on WoW Forever.

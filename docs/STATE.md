# Session state — Dopamine Loot

_Last checkpoint: 2026-11-10, after **1.3.1** (released). Read this first in a new session (the
`session-resume` skill does), then CLAUDE.md and `docs/plan.md`. Older detail: git log, CHANGELOG.md and
plan.md (this file was trimmed from 46 KB on 2026-11-10; the full old text is in git history)._

## Where things stand
- **1.3.1 released** 2026-11-10 (tags `v1.3.0`, `v1.3.1`; GitHub release zips + automatic CurseForge upload,
  project 1784686, game version 1.60.1). 1.3.0 = the professions release (CHANGELOG); 1.3.1 = Leatherworking
  hotfix. Working tree clean, pushed.
- **The game is on the RELEASED copy** (CurseForge app install; it was 1.3.0, the user updates it to 1.3.1 in
  the app). Switch to dev before testing new work (`tools/addon-mode.ps1`, command in CLAUDE.local.md; then the
  user `/reload`s). Only install/update through the app while on release.
- **Next up: 1.4.0 Dungeons** = the **dice roll** (group loot rolls) and the **dungeon recap**. Plan:
  `docs/plan.md` "1.4.0: Dungeons" (ideas, events to verify, data). Order: brainstorm with the user (questions
  with recommended picks) → API checks (wow-api-researcher agent; is loot chat text a secret value inside an
  instance?) → mockups → the user picks → build. The user was out of session time until Wednesday 2026-11-12.
- **Waiting on the user**: paste the rewritten CurseForge description (`docs/curseforge.md`, with the
  "What's new in 1.3.0" block on top) into the CurseForge project page.

## Verified in game (by the user)
- 1.0-1.2: popups, styles, arrivals, rain (all three animations), settings pages, sounds, CurseForge install.
- 1.3.0 (tested before publishing, 2026-11-10): bulging bag; gathering (mining and fishing "100%"); harvest
  window; side column; Move frames; crafting effects by the cast bar; Create All pile (H3 Tumble) with real item
  icons and a correct count ("5 / 26" = made + left); skill-up banners (material bars + tools); the settings
  reorganization (first-page switches, Professions page, Bar look Crafted/Simple).
- 1.3.1: Leatherworking "A Bold and lit" tested on dev before the user said release.
## Not yet verified
- The recipe-color line after a real crafting skill-up (`relativeDifficulty` read works: `/dump` gave 3).
- Big real batches (100+) sinking the pile; `/dl` in combat opening after the fight; a dungeon (secret loot
  text?); a vendor buy must not pop; gathering when Baganator hides the backpack button.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files or commits
  (BugSack dumps contain the character name: never copy it). Never `--no-verify` unless the user says so.
- **Only `/dl`**; everything is a control on a settings page. Main on/off switches on the first page; a
  feature's page holds its details (CLAUDE.md "Settings layout"). Design each settings change before adding it.
- **Mockups before visual changes; the user picks.** Mockups must show exactly what the game will do (the user
  found the game "nothing like the mockups" once: the fix was rendering the mockups' own sounds and drawing the
  tools in the mockup's style). Don't change skill-ups in game without a mockup and approval. Options in a
  mockup must be clearly different (round 1 of Leatherworking "all look the same"). Test on the real grounds
  the user plays on (dark, dirt, grass, bright).
- **Simple shapes** (lines, dots, rings, glints, real item icons) over drawn objects (memory file). **Polish
  only what the user names** (memory file).
- Effects must stay pleasant over hundreds of crafts: in a Create All every item plays at **full size**
  (shrinking looked awkward); only the sounds step down (full, quiet copies for items 2-3, silent beats from
  the 4th; the "item made" sound stays, quiet from the 4th). The game plays its own craft sounds too.
- Presentation and sound matter most; repeated sounds climb in pitch; no level-up or quest sounds; pick sounds
  by ear. Assets: offer custom vs. Blizzard per piece; never ship extracted or borrowed files.
- **No bulk scripted runs in the browser pane without asking** (one froze the user's PC); mute, one scene.
  The silent offline media render (below) was allowed.
- Tag/publish only with the user's OK in chat ("Tested, publish it" / "lets just release"). Secrets never
  pass through the chat. Each minor release (1.x.0) replaces the "What's new" block in `docs/curseforge.md`.
- Process: preflight → reviewer agent for big changes → commit → push → a short "to test" list saying
  `/reload` vs **full restart** (new files = restart). Answers concise. No rush.

## Gotchas and environment notes
- **Media pipeline** (sounds and tool art, 2026-11-10): `tools/render-media.html` holds the mockups' WebAudio
  sound code and our own SVG drawings. Run `powershell -ExecutionPolicy Bypass -File tools/render-media.ps1`
  (background), open `http://localhost:8765/` in the browser pane, run `await renderAll()` (silent,
  OfflineAudioContext), then `bash tools/convert-media.sh` (WAV → OGG trimmed, PNG → TGA bottom-up) into
  `DopamineLoot/Media`. `tools/out/` is gitignored; delete a stale render from it before converting.
  `tools/gen_craft_sounds.sh` is superseded (it would overwrite the rendered sounds).
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only. No python/node/lua on PATH (Lua via
  lua-language-server, found by preflight). ffmpeg via winget (on PATH in Git Bash).
- Forever: no `MouseIsOver`; `SetRotation` only on square textures; models set after `Show()`; no
  AnimationGroups; settings panels created hidden. Craft.lua `Fx{ sub = n }` sets the draw sublevel and
  `axis = "x"/"y"` scales one side only.
- Never delete a junction with `rm -rf`/`Remove-Item -Recurse`; the switch script removes it as a link. The
  CurseForge app caches "latest version" a while after an upload.
- Kit: wow-addon-kit 0.7.1 (`claude plugin update wow-addon-kit@bempis --scope user` with the desktop app's
  CLI, path in CLAUDE.local.md). Game closed before editing `WTF`. Baganator owns Alt+click.
- Repo: rulesets protect main and `v*` tags (no force-push/delete); Wago not set up.

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out; the **ground** =
where they land; the **harvest window** / **loot column** (side column with "Picked up"); the **pile** = the
Create All tray.

## Open questions / waiting on the user
- Old: are the settings fields filled after /reload? (fix in 0.4.2, never confirmed; no recent complaints)
- Paste the CurseForge description; update the release copy to 1.3.1 in the app.

## Recent history (newest first; details in CHANGELOG and git log)
- 2026-11-10 1.3.1: Leatherworking = leather-r3 A "Bold and lit" (the B tan strip blended into dirt).
- 2026-11-10 1.3.0: the professions release (gathering, crafting, Create All pile, skill-up bars, bag, side
  column, Move frames, settings reorganized); sounds rendered from mockup code; First Aid = firstaid-r7 P2.
- 2026-11-09 1.2.1 / 1.2.0: rain animations (Fountain, Quick burst, Big bang), new popup styles.
- 2026-11-06 1.1.0: the flair update (arrivals per rarity, money tally, sounds by ear).
- 2026-11-05 1.0.1: settings rebuilt on our own frames (taint fix); first automatic CurseForge upload.
- 2026-11-04 1.0.0: first release on WoW Forever.

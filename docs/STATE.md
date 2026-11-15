# Session state — Dopamine Loot

_Last checkpoint: 2026-11-15, skill-up gains: **all four gatherers DONE** (rounds 29-52); **Blacksmithing round 55 (ringing steel + four gold inlay designs) shown, waiting on the pick**; then the rest of the **crafters, one at a
time**. Read this first (the `session-resume` skill does), then CLAUDE.md and `docs/plan.md` ("1.4.0 scope, revised
2026-11-12": every round and pick, newest at the end of "2. Skill-up gains"). Older detail: git log._

## Where things stand
- **1.3.1 is the latest release** (2026-11-10). **The game is on the RELEASED copy**: switch to dev before testing new
  work (`tools/addon-mode.ps1`, command in CLAUDE.local.md; then `/reload`). Everything is committed and pushed.
- **1.4.0 = Leveling + the dungeon recap + the crafting redesign + a cohesion pass.** Design only so far. Order (plan.md
  "1.4.0 order"): professions first (crafting DONE in design; skill-up gains now; then the Create All pile, gathering,
  the loot window), build them; then XP, rep, level-up; the dungeon recap last (may slip to 1.5.0).
- **Crafting redesign: design DONE** (`docs/mockups/craft-compare.html`; Phase 2 + Phase 3 Polish for all ten; picks in
  plan.md "Phase 2 done for all 10" and "Crafting Phase 3 Polish"; loudness Even, `LOUD_GAIN.even`).
- **Skill-up gains** (`docs/mockups/skillup-p2.html`, the only page; the `<h1>` says the round):
  - SET: the 1.3-style header (no backing, the game's text shadow) and bar (dark track, thin gold border, notches,
    the next unlock's icon at the end, "N to X" under it). Each profession uses the bar as a frame: parts may
    reach outside it, like the craft rings' tools. Finales are per profession. The page's option buttons show
    letters only.
  - **Herbalism DONE:** the Vine breaking out of a slim 6 px bar (no add-on). Finale: Sickle sweep (a gold slash
    runs the bar, leaves shear off). Sound: Thumb piano (a note + a soft fifth, varied).
  - **Fishing DONE:** a water bar (bright surface over the fill, Depth bands texture), the reel at the start
    paying out line, the bobber at the front. Add-on: the swell. Sound: Water drops (two plinks, varied; the
    swell a shower; no reel sound; Fishing's built-in strike muted). Finale: a big fish surfs a big swell and is
    flung into the icon.
  - **Skinning DONE:** the cut + a stroke, + Fur flies. Finale: the reticle locks on the icon; fast chops drop
    the hide away notch by notch; the reticle tightens and turns 90° in steps. Sound: its **original** sounds
    (the user preferred them), with only the step-down and a slight pitch variation.
  - **Mining DONE:** the Blast. The mined part is a dug channel and the rock ahead stays solid; each skill-up a
    charge at the front (flash, muffled thump, chunks and dust, the bar kicks, a hot glow). No add-on. Finale:
    every blast throws ore (the chain runs; nuggets land, bounce, roll into the icon). Sound: as now (thump +
    pebbles, clinks).
  - **Next: the crafters**, one at a time: Blacksmithing, Leatherworking, Alchemy, Tailoring, Engineering,
    Enchanting; then Cooking, First Aid. Same steps per profession: base design (pitch first) → add-ons →
    finale → sound. Rules from crafting still apply: **no echo** with the craft ring (no ring, no tool riding
    at the tip); a crafting batch can be 100 casts.
  - Unlocks per profession and the bar code are on the page. The full record is in plan.md.

## How the skill-up page works (for the next session)
- Options are the `FAM` slots `PA`-`PD`, set by `Object.assign(FAM, {PA: rNN('A'), ...})`; the last assignment
  wins. Each `rNN(K)` returns `{name, desc, note, draw(top)}`, and draw routes the other professions to their
  done looks. The latest is `r52`.
- `barModule(top, mode, V)`: modes `A` inside the bar, `B` breaks out (6 px), `F` the Fishing water.
- Hooks on V:
  - `grow`, `over`, `after` (drawn over the icon)
  - `tip`, `unlockX`, `unlockY`, `iconPulse`, `shake(info) -> [dx, dy]`
  - `finAt`: seconds from the fill to the payoff (chime, lit icon, flash), so the finale plays first
- Globals that override Fishing:
  - `window.FSW(x)`: the surface lift
  - `window.FTEX`: the texture
  - `window.FSND(i)`: the skill-up sound
  - `window.FREEL`: the reel clicks (`false` = silent)
- Muting a profession's built-in strike: swap `S.p.snd` during the draw.
- Muting a base's sounds: swap `window.tone`/`window.noise` with no-ops around the base `over`.
- Sound helpers:
  - `fat45(i)`: the step-down
  - `pick45(i, span)`: varied scale notes
  - instruments: `kal`, `mallet`, `drop`, `bell45`, `pluck`, `drum46`
- Checking: `requestAnimationFrame = () => 0`, then step `S.age` by hand (a `stepTo(K, moment, T)` helper)
  and zoom on [380, 50, 740, 200]. This freezes the tab and the user may be watching. Afterwards, close it
  and reopen the page fresh (`preview_start` with the file URL). A new tab from `tabs_create` + `navigate`
  still comes to the front.
- No node or python on this machine: insert code with `sed "<line>r file"` from the scratchpad.

## The compare page (crafting)
- Profession buttons 1-10; Final round / Exploration. Mute only the run (`play(); S.mute = true`). Loudness check
  offline via an OfflineAudioContext replay. No `shadowBlur` inside rotated transforms (perf).

## Verified in game (by the user)
- Everything shipped in 1.0-1.3.1.
## Not yet verified
- The recipe-color line after a real crafting skill-up; big batches (100+) sinking the pile; `/dl` in combat; a
  dungeon (secret loot text?); vendor buys must not pop; gathering with Baganator's bags.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**. Never `--no-verify` unless the user says so. Tag or
  publish only with the user's OK in chat.
- **Only `/dl`**; everything is a control on a settings page.
- **Mockups first, the user picks.** Four options per round, each a **clearly different mechanism**. Keep the
  current pick as A when comparing; mixes on request. **Pitch one-liners before building** a new direction.
  **One profession at a time.** **Bold add-ons**; destructive for Mining; picking, not cultivating, for Herbalism.
- **Sound fatigue, always** (addon rule; CLAUDE.md; style guide "Sound"):
  - gentle, but not monotone or boring
  - no hiss, sharp clicks or cartoon pitch drops
  - notes varied from a scale
  - repeats step down across systems
  - a skill-up folds under the craft sound in a batch
  - rare milestones in full
- **Simple shapes** over drawn objects; **no zig-zag**; no outlines; **polish only what's named**; **no
  lottery**; **info in one place**; **no echo between systems**.
- Show pages with the **`/view`** skill (`/view pc` = browser pane, `/view phone` = SendUserFile; the mode is in
  memory). On Remote Control, send pages with SendUserFile.
- No bulk scripted runs in the browser pane; one scene, sound off for checks. Answers concise.

## Gotchas and environment notes
- Media pipeline: `tools/render-media.ps1` (serves `tools/render-media.html` on :8765), `await renderAll()` in the
  pane, then `bash tools/convert-media.sh`.
- Bash collapses `\\`: write Lua with Write/Edit. `grep -F -i -f` on the privacy file crashes Git Bash's grep:
  check patterns one at a time. sed: an unescaped apostrophe in a JS string breaks the page (use ’).
- Forever: no `MouseIsOver`; `SetRotation` only on square textures; models after `Show()`; no AnimationGroups.
- Never delete a junction with `rm -rf`. Kit: wow-addon-kit 0.8.1.
- Words: "Leatherworking" sometimes means Skinning; the pile = the Create All tray.

## Open questions / waiting on the user
- XP: with-loot handling; Calm-when-busy (maybe one addon-wide sound budget).
- Paste `docs/curseforge.md` into CurseForge; update the release copy to 1.3.1 in the app.

## Recent history (newest first)
- 2026-11-15: skill-up gatherers DONE (rounds 15-52: header + bar set, Herbalism, Fishing, Skinning, Mining: look,
  finale, sound); the sound-fatigue rule; the `/view` skill.
- 2026-11-14: skill-up Phase 2 rounds 1-14 (own module, grows along the line); 1.4.0 order revised; crafting Phase 3
  Polish done (3 beats, loudness Even).
- 2026-11-13: crafting Phase 2 second pass, Smelting + Disenchanting. 2026-11-12: 1.4.0 design scope, style guide.
- 2026-11-10 1.3.1. 2026-11-04 1.0.0 on WoW Forever.

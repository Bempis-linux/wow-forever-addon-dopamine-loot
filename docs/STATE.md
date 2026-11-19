# Session state — Dopamine Loot

_Last checkpoint: 2026-11-19 (stop point: Cooking skill-up DONE, next Enchanting). Kept short on purpose (the start-up hook loads it into every session): status, the current
focus and pointers. Detail lives in the workstream file named below; history in git log._

## Where things stand
- **1.3.1 is the latest release** (2026-11-10). **The game is on the RELEASED copy**: switch to dev before testing new
  work (`tools/addon-mode.ps1`, command in CLAUDE.local.md; then `/reload`).
- **1.4.0 = the professions redesign + leveling (+ the dungeon recap if the budget allows).** Design only so far. The
  to-do order is plan.md "1.4.0 order" (unchanged): 1 crafting API checks (done), **2 skill-up gains (now)**, 3 the
  Create All pile, 4 gathering, 5 the loot window, 6 build the professions; 7-10 XP, rep, level-up, build; 11 dungeon
  recap; 12 release. Crafting redesign: design DONE (`docs/mockups/craft-compare.html`).
- **Current focus: skill-up gains. Next: Enchanting. Read `docs/skillup.md` first, its "Next: Enchanting (start here)"**
  (Enchanting's craft ring to avoid, how Cooking ran, the page cap housekeeping to do first), then brainstorm. Don't read
  plan.md or `docs/skillup-rounds.md` unless an old round's detail is needed. Done: Herbalism, Fishing, Skinning, Mining,
  Blacksmithing, Leatherworking, Alchemy, Tailoring, Engineering, **Cooking** (2026-11-19, rounds 167-183). Left: Enchanting,
  First Aid; then revisit Alchemy and Tailoring (the user, 2026-11-19); then 1.4.0 item 3 (the Create All pile).
  **Before any design pitch, use the kit skill `wow-design-ideas`** (updated after Cooking, see Gotchas).
- Side projects (not 1.4.0, don't read unless asked): `docs/side-projects/` (murloc/: the murloc + peon companion).

## Not yet verified in game
- The recipe-color line after a real crafting skill-up; big batches (100+) sinking the pile; `/dl` in combat; a
  dungeon (secret loot text?); vendor buys must not pop; gathering with Baganator's bags.

## User preferences (beyond CLAUDE.md and memory, which hold the design rules)
- Privacy first: the only public identity is **Bempis**. Never `--no-verify` unless the user says so. Tag or publish
  only with the user's OK in chat. Only `/dl`; everything is a control on a settings page.
- Mockups first, the user picks. **Pitch one-liners before building** a new direction; keep the current pick as A.
  **One profession at a time.** Show pages with the `/view` skill. Answers concise.

## Gotchas
- Media pipeline: `tools/render-media.ps1` (serves `tools/render-media.html` on :8765), `await renderAll()` in the
  pane, then `bash tools/convert-media.sh`.
- Bash collapses `\\`: write Lua with Write/Edit. `grep -F -i -f` on the privacy file crashes Git Bash's grep: check
  patterns one at a time. sed: an unescaped apostrophe in a JS string breaks a page (use ’). No node or python here.
- Forever: no `MouseIsOver`; `SetRotation` only on square textures; models after `Show()`; no AnimationGroups.
- Never delete a junction with `rm -rf`. Kit: wow-addon-kit 0.9.0 installed. The Cooking lessons were added to
  `wow-design-ideas` in the kit repo (`C:/dev/wow-addons/wow-addon-kit`, sections 3b and 8, the sound notes) on 2026-11-19:
  **uncommitted there** (waiting on the user's OK to commit, bump and push the kit).
- `skillup-p2.html` is at 523.5 KB of the 524,288-byte cap: archive Cooking's code first (see skillup.md "Next").
- Words: "Leatherworking" sometimes means Skinning; the pile = the Create All tray.
- Crafting compare page: profession buttons 1-10; mute only the run (`play(); S.mute = true`); no `shadowBlur` inside
  rotated transforms (perf).

## Open questions / waiting on the user
- XP: with-loot handling; Calm-when-busy (maybe one addon-wide sound budget).
- Paste `docs/curseforge.md` into CurseForge; update the release copy to 1.3.1 in the app.

## Recent history (newest first)
- 2026-11-19: Cooking skill-up DONE (rounds 167-183, 17 rounds; the user's most successful session): the angled
  board cleaver (Carrot, Cucumber, Sausage, rotating after a finale), elbow-arc chop with hit-stop and a flipping slice; slice
  ripple + still shaker, apex shing, board shockwave + chunk spray; finale slam, slash, mince, flip, stuck, the mince into a
  bowl into the recipe; sound v3 warm (two a skill-up, six in the finale).
- 2026-11-19: Engineering skill-up DONE (rounds 124-166: the Revolver drum gear train in a blueprint housing, inked
  steps on long gaps; finale Overheat and blow-out + warning beacon + victory fountain; sound
  Electric, refined: 3 soft events a skill-up, a quiet beating-chord unlock). Took 43 rounds; the lessons are in the
  new kit skill `wow-design-ideas`.
- 2026-11-18: Tailoring skill-up DONE (rounds 118-123: a clothesline in bar mode X, line dips; finale gust and fold;
  sound Wooden pegs). Brainstorm → base → finales for the two favorites → add-ons → sound took 6 rounds.
- 2026-11-17: Alchemy skill-up DONE (rounds 98-117: a bench of bottles in bar mode X, neighbor clink; finale fizz,
  pop, spray + rain back; sound Bubbly). New: barModule mode X (the bar is an object), a gap switch (5/15/50) on the page;
  the 1.4.0 list gained 2b, a rank-up celebration.
- 2026-11-16: skill-ups split out (`docs/skillup.md`, `docs/skillup-rounds.md`; plan.md no longer holds the rounds);
  STATE.md cut to this; the murloc moved to `docs/side-projects/`.
- 2026-11-15: skill-up gatherers and Blacksmithing DONE (rounds 15-82). 2026-11-14: crafting Phase 3 Polish done.
- 2026-11-10 1.3.1. 2026-11-04 1.0.0 on WoW Forever.

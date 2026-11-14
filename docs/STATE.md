# Session state — Dopamine Loot

_Last checkpoint: 2026-11-14 night, skill-up Phase 2 round 9 judged, nothing locked; next: tighten the layout, then one bold round; kit 0.8.1. Read this
first (the `session-resume` skill does), then CLAUDE.md and `docs/plan.md` ("1.4.0 scope, revised 2026-11-12":
every round and pick). Older detail: git log, CHANGELOG.md._

## Where things stand
- **1.3.1 is the latest release** (2026-11-10). **The game is on the RELEASED copy**: switch to dev before
  testing new work (`tools/addon-mode.ps1`, command in CLAUDE.local.md; then `/reload`).
- **1.4.0 = Leveling + the dungeon recap + the crafting redesign + a cohesion pass.** Design only; picks in
  plan.md: bars family Ring + road; XP xp-r10 (kills Rain, quests Comet + impact); rep Sweep + faction rings;
  level-up levelup-r4; dungeon recap Slim strip + Final medallion; style guide `docs/style-guide.md`.
- **Crafting redesign, in progress** (`docs/mockups/craft-compare.html`; Ring + batch replaces the cast bar
  during trade-skill casts). Run with the kit's **`wow-design-rounds`** skill (the user: keep using it):
  Phase 1 Inspiration done; **Phase 2 Finalization done for all 10** (plan.md "Phase 2 done for all 10"):
  Blacksmithing **F Hammer + heat**, Leatherworking **Burnished**, Alchemy **Boil over + bubbles**, Tailoring
  **Plucked + runs down**, Engineering **Wrench 4 turns + it starts up**, Cooking **Toss the pan + burner +
  sizzle**, Enchanting **F Motes + moon sparkle**, First Aid **E Splint + heft + relief**, **9 Smelting K**
  (a mould turning clockwise under a fixed spout, 3 punchy beats, heat gradient, glug beats, crack + clatter
  + tink finale), **10 Disenchanting H** (Burn away: the icon burns from its edges, embers feed the ring,
  storm into implosion, then the dust; the feel: "the item is actually getting destroyed").
- **Phase 3 Polish done** (2026-11-14; plan.md "Crafting Phase 3 Polish"): 3 beats + the finale for all ten; fill as
  picked, plus Leatherworking now punchy (each punch slams the fill to its hole; punchy = the hits: Blacksmithing,
  Engineering, Cooking, Smelting, Leatherworking); ring widths, tool placement and finale lengths as picked (Alchemy's tube
  and Smelting's mould stay thicker); loudness **Even** (every profession about -29 dB at its loudest; per-profession gains
  in `LOUD_GAIN.even`, Blacksmithing x0.38, Tailoring x3.63). The page's Polish panel opens on the decided settings.
- **Next up (1.4.0 order, revised 2026-11-14; plan.md "1.4.0 order")**: professions first: crafting API checks DONE (Smelting
  = a Mining window cast; Disenchant = spell 13262, not a trade-skill cast; burn grid works),
  then Phase 2 for skill-up gains, the Create All pile, gathering, the loot window (Picked-up rows / harvest window);
  build them; then Phase 2 for XP, rep, level-up; build; the dungeon recap last if the weekly budget allows (may slip to
  1.5.0, not moved yet). Phase 3 Polish for everything but crafting moves to 1.4.1+.
- **Skill-up gains, Phase 2 in progress, 9 rounds, nothing locked** (`docs/mockups/skillup-p2.html`, the only page;
  there is no skillup-p3; the title says the round; older rounds stay in the code, off the panel; full record in
  plan.md under "2. Skill-up gains"). **Goal (the user): clear progression AND a frame easy to make unique, in fun
  ways, per profession**; then a per-profession pass like crafting's. **Decided: its own draggable module**, apart from
  the craft rings. **Rules learned:** progression first (an amount building toward a visible goal), sound and light are
  add-ons; **no echo** (the skill-up must not share the craft ring's form: no ring, no tool riding; memory
  no-echo-between-systems); compact (a quick progress update); no blocky square frame; the theme in words is in
  `docs/style-guide.md` ("The theme in one line"). Dropped along the way: Ring + road (echo), whole journey (too big),
  pips (repeated icons), countdown, icon colors in, stamp, bell, horizon, and more (plan.md).
  **Round 9 (current panel, keys 1-4):** A One notched line ("simple, gets the point across"), B Poured in (the
  profession's vessel, a portion poured per skill-up: "each one unique and can be built on"), C Lifted up (likes
  only Herbalism's stalk lifting the icon), D The line is the container (likes only Herbalism's planter trough).
  **"The one" isn't found yet.** The user: **the presentation needs work** (lots of unused space; could show more
  info or design) but **don't over-design**. **Next session: tighten the layout first** (a compact module that uses its
  space: more info or design), then one bold round built from what's liked (A's simplicity, B's per-profession
  vessels, Herbalism's growing plant); pitch the one-liners first.
- **Budget (the user, 2026-11-14):** fewer, bolder rounds; pitch one-liners in chat before building a round; a fresh
  session per sub-system with a checkpoint at each lock (kit 0.8.1 `wow-design-rounds` "budget rule"). The dungeon
  recap is the release valve.
- Everything is committed and pushed (2026-11-14 night).

## The compare page (how it works, for the next session)
- Profession buttons 1-10 (keys 1-9, 0); a Round switch: **Final round** (the FINAL sets) / Exploration (ITER).
- Final round: A is always the current pick; `finalPick` sets what opens. `p2Start(prof)` began the second
  pass (the first-pass sets live in `P2A`; `P2S(prof)` makes options that borrow from a sibling by letter use
  their own set). Options are `{ name, desc, work, payoff, overlay, ownSound }`; `ownSound` silences the
  1.3 side's beat sounds so the new side plays its own.
- Checking: mute only the run (`play(); S.mute = true`), never untick the Sound box; one scene at a time.
- Loudness check without playing: render a craft offline (log `Sound` calls over synthetic `frame()` steps, replay them into an
  OfflineAudioContext behind a Proxy for `A` whose currentTime is the event time; loudest 50 ms RMS in dB).
- Mockup perf: no `shadowBlur` inside rotated or mirrored transforms (Smelting dropped to 12 fps); use a soft wide
  stroke or halo. The page timer now keeps timers added from inside a timer (nested effects used to vanish).
- sed gotchas: an unescaped apostrophe in a JS string breaks the page (use ’); plan.md edits with quotes:
  write the text to a scratch file and insert it with `sed "<line>r file"`.

## Verified in game (by the user)
- Everything shipped in 1.0-1.3.1 (details in git history of this file).
## Not yet verified
- The recipe-color line after a real crafting skill-up; big batches (100+) sinking the pile; `/dl` in
  combat; a dungeon (secret loot text?); vendor buys must not pop; gathering with Baganator's bags.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files or
  commits. Never `--no-verify` unless the user says so.
- **Only `/dl`**; everything is a control on a settings page (CLAUDE.md "Settings layout").
- **Mockups first, the user picks.** Options must be **clearly different in mechanism and in structure**
  (a round of "a tool, four even steps" ×3 was rejected; memory file). Keep the current pick as A; mixes on
  request; don't lock until the user says so ("I wasn't done yet").
- **Phase 2 means entirely new designs inspired by all the picks** (like the user's wrench sketch), not
  add-ons; add-ons only once a new design is chosen. One sub-system at a time.
- Feel notes: Enchanting = magical, not "science"; First Aid = patching yourself up after a fight, rough,
  no glowing healer magic, and the user tired of bandage motifs except the splint; nothing that repeats
  another profession's finale (item flying up = Cooking's). Steam that blooms at the end read as awkward.
- **Simple shapes** over drawn objects; **polish only what the user names**; **no lottery/chance**; **info in
  one place**; fatigue over long sessions (quiet repeats, sounds step down in batches).
- **No bulk scripted runs in the browser pane**; mute, one scene. Answers concise.
- Tag/publish only with the user's OK in chat. Process: preflight → reviewer → commit → push → test list.

## Gotchas and environment notes
- **Media pipeline**: `tools/render-media.ps1` serves `tools/render-media.html` on :8765; in the browser
  pane `await renderAll()`, then `bash tools/convert-media.sh` into `DopamineLoot/Media`.
- Bash collapses `\\`: write Lua with Write/Edit. No python/node/lua on PATH; ffmpeg via winget. `grep -F -i
  -f` on the privacy file crashes Git Bash's grep: check patterns one at a time.
- Forever: no `MouseIsOver`; `SetRotation` only on square textures; models after `Show()`; no AnimationGroups.
- Never delete a junction with `rm -rf`. Browser pane: close old tabs when a file won't open.
- Kit: **wow-addon-kit 0.8.1** (adds `wow-design-rounds` with the budget rule, `wow-mockup-to-addon`); update with
  `claude plugin update wow-addon-kit@bempis --scope user` (CLI path in CLAUDE.local.md); restart to load.

**Words the user uses:** treasure chest, ground, harvest window / loot column, the pile (Create All tray).

## Open questions / waiting on the user
- XP: With-loot handling; Calm-when-busy (maybe one addon-wide sound budget).
- Paste `docs/curseforge.md` into CurseForge; update the release copy to 1.3.1 in the app.

## Recent history (newest first)
- 2026-11-14 night: skill-up Phase 2 rounds 3-9 (all in skillup-p2.html); rules learned: progression first, no echo with
  the craft ring, compact, no blocky frame; the theme put into words (style guide); nothing locked yet.
- 2026-11-14 1.4.0 order revised (professions first); crafting API checks done in game; skill-up Phase 2 rounds 1-2
  (own module decided); kit 0.8.1 budget rule.
- 2026-11-14 Crafting phase 3 Polish done (3 beats, Leatherworking punchy, loudness Even).
- 2026-11-13 Crafting phase 2 second pass (all 8 locked), Smelting + Disenchanting added; kit 0.8.0.
- 2026-11-12 1.4.0 design: scope, bars, XP, rep, level-up, recap, style guide, crafting phase 1.
- 2026-11-10 1.3.1. 2026-11-09 1.2.x. 2026-11-06 1.1.0. 2026-11-04 1.0.0 on WoW Forever.

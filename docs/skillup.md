# Skill-ups: the workstream (1.4.0, item 2)

The current focus. Read this file (not plan.md) when working on skill-ups. Page: `docs/mockups/skillup-p2.html` (the
only page; its `<h1>` says the round). Every round is in `docs/skillup-rounds.md` (read only for an old round's detail).
Design rules that apply everywhere are in CLAUDE.md and memory.

## Next: Alchemy (start here)

1. **Pitch first** (it worked; building blind missed six rounds on Leatherworking): 6-8 one-line directions via
   AskUserQuestion (multi-select), the user picks which to build, then build them. Four options per round, each a
   different mechanism; keep the current pick as A when iterating.
2. Steps, one at a time: **base → add-ons → finale → sound**, each locked before the next.
3. **Alchemy's craft ring to avoid** (it's on screen with the skill-up): *Boil over + bubbles* (bubbles livelier each
   beat, foam rises over the tube and spills; made = the cork pops, steam). So no tube boiling over and no cork.
   Liquid, color, glass, bubbles as a material are fine (no-echo forbids the ring's tool/signature shape, not materials).
4. **Bar scale, decided for Leatherworking:** a crafter's bar counts to the **next recipe unlock** (a few points), not
   the whole 75-point rank, so each skill-up is a big visible step (~1/5 of the bar), like a gatherer's. Do the same for
   Alchemy: make an Alchemy profile like `LWB92` (span e.g. [120,125], `unlocks` = recipe names + icons, `v`, `five`,
   `unlockV`) and rebuild `S` with it in the draw (see `r96`). Confirm with the user in the first pitch.
5. **Lessons from Leatherworking** (rounds 83-97):
   - Bold: use the bar as a frame or a stage, not just a fill inside it (memory "Bold add-ons").
   - It must *feel like the profession* (working the material), not objects colored like it.
   - Drawn objects look crude; prefer simple shapes (streaks, rings, glints) and real icons. A tool can be implied by
     its motion (Leatherworking's "Strike only": a swing streak + impact ring, no mallet).
   - Order matters: the effect follows the material (the pegs are struck *after* the hide lands).
   - No zig-zags or wavy lines, ever (memory "No zig-zag").
   - When the user remembers an old option, search the page's option names and `skillup-rounds.md`, then show the
     candidates **on their original bar and scale** (round 90 A found Pegged out that way).
6. Page housekeeping before the first Alchemy round: the page is ~522 KB of a 512 KiB (524,288 byte) cap; move
   Leatherworking's unused round code to `skillup-p2-old-rounds.js` (keep `r97('C')` and what it uses: `r96`,
   `FIN96.B`, `LW94.C`, `ADD93.B/D`, `VAR21.Skinning.B`, `LWB92`, `SET97.C` and the helpers). Check the closing `};`.

Then Tailoring, Engineering, Enchanting; then Cooking, First Aid (one at a time).

## Done

- **Header and bar (all):** the 1.3-style header (no backing, the game's text shadow) and bar (dark track, thin gold
  border, notches, the next unlock's icon at the end, "N to X" under it). Each profession uses the bar as a frame:
  parts may reach outside it. Finales per profession. Option buttons show letters only.
- **Herbalism:** the Vine breaking out of a slim 6 px bar. Finale: Sickle sweep. Sound: Thumb piano.
- **Fishing:** a water bar, the reel at the start, the bobber at the front; add-on the swell. Finale: a big fish surfs
  a swell into the icon. Sound: Water drops (Fishing's built-in strike muted).
- **Skinning:** the cut + a stroke, + Fur flies. Finale: the reticle locks on the icon, fast chops drop the hide away
  notch by notch, the reticle tightens and turns 90° in steps. Sound: its original sounds + the step-down.
- **Mining:** the Blast (a dug channel, a charge at the front each skill-up). Finale: every blast throws ore into the
  icon. Sound: thump + pebbles, clinks.
- **Blacksmithing (2026-11-16):** an open-top magma bar (gradient depth bands) with a small anvil left of it; swamp
  bubbles at the head; each skill-up the anvil flings sparks into the magma (clank). Finale: molten beads rise and are
  struck to iron, a crate, a peon runs off with it. Finale sound: Scurry. No booms, chimes or dings.
- **Leatherworking (2026-11-17):**
  - Bar: **Pegged out** exactly as on Skinning (`VAR21.Skinning.B`), counted to the next recipe (`LWB92`).
  - Each skill-up: the hide pulls taut to the new front; then a bright swing streak + white impact ring sets the top
    peg, then the bottom one (pegs appear on the hit; `window.PEGAT94` = .42); then the loose excess drops away as
    tumbling scraps (`LW94.C` + `ADD93.D`).
  - Finale **One sweep**: .8 s after the bar fills the hide rolls up from the start while a strike knocks out each peg
    pair just ahead of the roll; the roll hops into the recipe icon as one big streak lands on it (`FIN96.B`).
  - Sound **Wooden mallet + creak** (`SET97.C`): a gentle leather creak as the hide pulls; a soft mallet knock per peg
    (varied notes, the bottom a step lower); a faint rustle for the scraps; finale knocks climb the scale, a low knock
    on the icon, a soft two-note mallet close (replaces the default chime). Through the `window.SND97` hooks.
  - The locked whole: `r97('C')`.

## Crafting rings, as locked (don't echo them)

The skill-up plays while the craft ring is on screen, so it must not copy a ring's **tool** or signature shape
(materials, colors, heat, sparks are fine). Locked 2026-11-14 (`docs/mockups/craft-compare.html`; 3 beats + a finale):
| Profession | Ring | Avoid in the skill-up |
|---|---|---|
| Blacksmithing | Hammer + heat: three hammer blows, spark fans, bellows flare; CLANG = spark burst, shockwave, cooling steam | the hammer |
| Leatherworking | Burnished: 3 punches knock crumbs off, a thread whips round leaving a stitched line, a warm gloss runs round | the punch, the thread whip, the gloss sweep |
| Alchemy | Boil over + bubbles: bubbles livelier each beat, foam rises over the tube and spills; made = cork pops, steam | the tube boiling over, the cork |
| Tailoring | Plucked + runs down: a spool feeds thread, plucked on the beats, runs down to the core, loose end whips | the spool, plucked thread |
| Engineering | Wrench, 3 turns: the wrench's ring end round a hex bolt, the handle swings, ratchet ticks; boing + puff | the wrench, the ratchet, boing |
| Cooking | Toss the pan + burner + sizzle: a frying pan tossed three times, the food hops and flips | the pan toss |
| Enchanting | Motes + moon sparkle: motes draw a triangle and a star, the moon-phase finale sparkle | motes drawing shapes, the moon |
| First Aid | Splint + heft + relief: splint sticks tied with dust and a jolt, a double-tug knot, a warm glow | the splint, the knot |
| Smelting | Smooth turn: one long pour into a turning mould, pumps surge the stream | the pour into a mould |
| Disenchanting | Burn away + embers + storm into implosion | burning away, implosion |
Skinning's skill-up (a knife cut through a hide) is taken too.

## How the skill-up page works

- Options are the `FAM` slots `PA`-`PH` (keys 1-8; unset slots hide), set by `Object.assign(FAM, {PA: rNN('A'), ...})`;
  the last assignment wins (`delete FAM.PC` hides leftovers). Each `rNN(K)` returns `{name, desc, note, draw(top)}`;
  draw routes other professions to their done looks (`r82('A')` covers the gatherers and Blacksmithing).
- The page opens on a profession and moment via `setTimeout` clicks near the end of the newest round; a later one
  wins, so use a small delay (60 ms) to override.
- **Size cap:** the pane loads the page as one `data:` snapshot (a separate .js beside it does NOT load) and refuses
  pages over **524,288 bytes**. Check `wc -c`; move rejected code to `docs/mockups/skillup-p2-old-rounds.js` (not
  loaded) as you go. **A cut that drops a closing `};` stops the whole page silently** (it happened in round 95):
  after cutting, check `typeof FAM` in the pane.
- `barModule(top, mode, V)`: modes `A` inside the bar (clipped), `B` breaks out (6 px), `F` Fishing water, `M`
  open-top. Hooks on V: `grow` (clipped in mode A), `over` (unclipped, after the border), `after` (over the icon),
  `tip`, `unlockX`, `unlockY`, `iconPulse`, `shake(info) -> [dx, dy]`, `finAt` (seconds from the fill to the payoff,
  so the finale plays first). `info`: `x0, x1, ly, X(v), Xi(x), tipX, lo, v, N, hitAge, done, f`.
- A per-profession profile (like `LWB92`) is swapped in by rebuilding `S` in the draw:
  `PROF[name] = P; S = build(); restore` (see `r96`).
- Timing helpers: `S.hits` (strike start times), `HIT` = .15 (the landing), `pegs93(I)`/`hits83(I)` (this run's
  skill-ups with `t` since landing, `a`/`b` the front before/after), `ts95()` (seconds since the bar filled),
  `once(key, fn)`, `landed(key, at, fn)`, `spawn({...})` particles (`dot`, `sq`, `star`, `ring`, `leaf`).
- Sound: `tone(f, t, vol, dec, type, f2, att)`, `noise(t, dur, vol, f, q, type, hit)`; instruments `kal`, `mallet`,
  `bell45`, `pluck`, `drum46`; `fat45(i)` the step-down, `pick45(i, span)` varied scale notes, `PENT42` the scale.
  **Start offsets must be >= 0** (a negative one throws and freezes the page with sound on). The default unlock
  chime is in `payoff()`; a profession's own goes through a hook (Blacksmithing `FINSND78`, Leatherworking `SND97`).
- Blacksmithing plumbing: `V69(F)`, `mag62`, `MAGLIFT`, `FILL70`, `INGOTS72`, `r77('C')`, `r80('D')`; hooks
  `FINSND78`, `PS81`, `LDSND72`, `NOSWARM72`. Fishing globals: `FSW`, `FTEX`, `FSND`, `FREEL`.
- Checking: run each option with the sound off (`document.getElementById('snd').checked = false`), read console
  errors, zoom a still on the bar (about [400, 90, 700, 190] in the pane). One scene; no bulk runs (memory). Close the
  tab and reopen fresh afterwards.
- No node or python on this machine: insert code with `sed "<line>r file"` from the scratchpad; check the line
  number first (an empty one inserts after every line).

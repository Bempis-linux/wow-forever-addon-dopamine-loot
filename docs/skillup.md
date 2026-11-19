# Skill-ups: the workstream (1.4.0, item 2)

The current focus. Read this file (not plan.md) when working on skill-ups. Page: `docs/mockups/skillup-p2.html` (the
only page; its `<h1>` says the round). Every round is in `docs/skillup-rounds.md` (read only for an old round's detail).
Design rules that apply everywhere are in CLAUDE.md and memory.

## Next: Enchanting (start here)

**Before any pitch: use the kit skill `wow-design-ideas`** (kit 0.9.0): the brief, the gates, the finale formula and the sound rules written from Engineering’s 43 rounds. **Revisit later (user, 2026-11-19): Alchemy and Tailoring**, which suffered the same struggles; redo them with that skill once the remaining professions are done (or when the user asks).

Engineering is DONE (2026-11-19, rounds 124-166; see Done). Its round log is in `docs/skillup-rounds.md`. What Engineering
taught (memory has the rules): whole designs, not reskins or add-ons; one idea per option; dramatic finales (a long
build-up, a held beat, a big payoff, an aftermath); sounds mechanical (or fitting), never chimey, and check the phone
can hear them (Phone boost). Enchanting's craft ring to avoid: **Motes + moon sparkle** (craft-compare `finalPick.Enchanting
= 'F'`: motes draw the circle, then a moon sparkle). The steps below were written for Engineering and still apply.

## How to run a profession (written before Engineering)

1. **Brainstorm first, whole stories, the bar is an object** (barModule mode `X`). Pitch 6-8 one-liners via
   AskUserQuestion (multi-select), build only the picks. Alchemy took 20 rounds of tweaks before the bar became an
   object; Tailoring went brainstorm → base (5) → finales for the two favorites → add-ons → sound in 6 rounds (118-123).
   Do it that way: when the user can't decide between bases, show a finale for each.
2. Steps, one at a time: **base → (finale) → add-ons → sound**, each locked before the next. Keep the current pick as A
   when iterating; options must differ in the whole scene (bar, action, payoff), not one element (memory "Clearly
   different options"). When the user says start clean, bring new ideas. Keep it simple: one bar, one action, one payoff.
3. **Engineering's craft ring to avoid:** *Wrench, 3 turns* (the wrench's ring end round a hex bolt, the handle swings,
   ratchet ticks; boing + puff). So no wrench, no ratchet, no boing. Gears, bolts as parts, sparks, steam are fine.
4. **Bar scale:** the bar runs from the last unlock to the next recipe (step 1/gap; the gap switch shows 5/15/50 points:
   `GAP104`); an object bar is N objects, N = gap capped at 15, each filling over gap/N points (`g111`). Make a profile
   like `tlb118(g)` (span, recipe unlocks + icons) and rebuild `S` in the draw (see `r122`). The finale plays when it
   fills (`finAt` + `ts95()`); a rank-up celebration is a later item (plan.md 1.4.0 order, 2b).
5. **Lessons** (Leatherworking, Alchemy, Tailoring): use the bar as a frame or stage; it must feel like the profession;
   simple shapes and real icons (emoji via `emo98`) over drawn objects; the effect follows the material; no zig-zags;
   name options by their page letter and confirm a letter that names another option; sounds soft from the start; no
   plucked timbre for Tailoring-like threads.
6. **Page** (as of round 158): ~521 KB of the 524,288-byte cap; old code goes to `docs/mockups/skillup-p2-old-rounds.js` (check each moved block is balanced, and that the page still loads). Before Engineering’s first round move Tailoring’s unused code out (keep
   `r122('A')` and what it uses: `SET122.A`, `clothes121`, `line121`, `FN120.A1`, `posts120`, `line120`, `tlb118`,
   `WEAR118`, `CLR118`, `emo98`) and Alchemy's done `r117('C')` with its helpers. Checking: freeze + step time
   (`shG`), close the tab after a freeze (navigating does not reload).

**Quality bar (user, 2026-11-18):** uniqueness and fidelity dropped after the first four (Herbalism, Fishing,
Mining, Blacksmithing); too many "items on a shelf" (a row of N objects). Every base must **work with the bar**: name
what the fill is made of, what happens at its front on a skill-up, and how the scene reacts beyond the frame; pitch
the finale with it (the whole story). Fewer options built richer beats eight thin ones. Compare each round against the
first four and the craft rings, not against the last profession.

**Mining revisit note (user, 2026-11-18):** round 128 D Sapper’s rail cart also reads as Mining and the user likes it: consider a rail line + ore cart lurching forward for Mining later. Round 127 E Demolition front is close to Mining's animation; add its elements to the Mining skill-up later (scorched char fill with embers near the front, a red dynamite bundle that blows with flash/fireball/shockwave/debris, then a fresh bundle drops in). The user may also revisit Leatherworking, Alchemy and Tailoring later (quality bar above).

After Enchanting: Cooking, First Aid (one at a time).

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
- **Alchemy (2026-11-17, rounds 98-117):**
  - Bar: **a bench of bottles** (mode `X`, no track): a workbench with faint bottle outlines; each point the next bottle
    (a herb's color, a gold seal) drops onto the bench with a little bounce and dust; a long gap fills each bottle over a
    few points (`bench113`, `g111`).
  - Each skill-up add-on: **neighbor clink**: the landing bottle bumps its neighbor, which wobbles (`AO115.B`).
  - Finale **Fizz, pop, spray** (the user's idea): every bottle fizzes and shakes harder, the seals pop left to right in
    one rising "trrrink", each sprays up like a shaken soda can, the levels drop; then the potion **rains back down** onto
    the bench in splashing drops (`chain114('B')` + `AO115.B.fin`). Seals, not corks (the ring owns the cork pop).
  - Sound **Bubbly** (`SET117.C`): a soft thunk + a rising bubble blip per bottle, a tiny plink for the clink; finale:
    slow bubble blips (fizz), soft rising "bloop" pops up the scale, a gentle spray, a few plips of rain, a bubbly
    three-note close (via `window.SND97.pay`).
  - The locked whole: `r117('C')`.
- **Tailoring (2026-11-18, rounds 118-123):**
  - Bar: **a clothesline** (mode `X`): two wooden posts and a gently sagging line; each point the next garment (real
    icons: shirt, socks, scarf, gloves…) flies up, two pegs clip it, it swings and settles and sways with the others;
    empty spots show faint pegs (`clothes121`, `WEAR118`).
  - Add-on **line dips**: the line dips under the new garment in two straight segments and springs back, the neighbors
    bob (`line121`).
  - Finale **gust and fold**: wind streaks, every garment flaps hard; then they fold into squares onto a stack by the
    post, and the stack hops into the recipe icon (`FN120.A1`).
  - Sound **Wooden pegs** (`SET122.A`): a soft air swish, two light wooden clicks, a soft low hum for the dip; finale: a
    gentle wind, cloth pats, wooden taps climbing for the folds, a two-note wooden close (via `window.SND97.pay`).
  - The locked whole: `r122('A')`.
- **Engineering (2026-11-19, rounds 124-166):**
  - Bar: **the Revolver drum gear train** in one blueprint housing (`A142`): a brass frame, rounded left with the
    revolver drum sitting in the curve, square right next to the recipe icon; blueprint drawings of the cogs in the
    empty slots; a trolley on a rail inside the frame with a jointed arm.
  - Each skill-up: the arm fetches a cog from the drum (the drum turns one chamber only when a cog leaves it), carries
    it over (it bobs and lines its teeth up while held), winds up and presses it into its drawing; the row turns two
    teeth. Gaps over 15: each point inks a wedge of the next drawing into metal; the arm waits by the drum and sets the
    cog on the last wedge.
  - Finale **Overheat and blow-out** (`FX145`): the drum overheats to white-hot, heat creeps along the frame, the row
    blurs, steam jets, cogs rattle; a held beat; BANG (radial flash, three shockwaves, hard shake), every cog thrown
    up and the recipe launched; the cogs rain back into their slots, the recipe lands, the drum cools. No leftover
    smoke, no end hatch.
  - Add-ons (finale): **Warning beacon** (`WB149`: a red rotating beacon sweeping two beams, two-tone buzzer) and
    **Victory fountain** (`VF149`: the rebuilt row spins up, golden sparks from the recipe). Base theme `BASE150`.
  - Sound **Electric, refined** (`SS150.E2` on `SS150.EL`, `snd150`, quiet defaults `NO164`): each skill-up three soft
    events: a gentle beating hum (two close sines) stepping through a 5-note scale with a tiny low spark as the cog
    seats, two soft hum blips as the row turns, a hum blip + soft spark as the drum turns (no pickup sound); long gaps a
    soft high blip. Finale: the hum climbs in three steps with soft crackles; silence in the held beat; the blast
    powers down (a hum falling into a deep thump, a fading crackle); every returning cog a soft climbing hum blip; the
    beacon, fountain and ping silent; the unlock is a soft beating chord ending on a spark, no louder than a skill-up
    (`window.ENGPAY` replaces the default chime; the reveal ding is skipped for Engineering).
  - Lessons (sound): woody vs metal (short bandpassed noise reads as wood); dropped the ka-thunk; the whole set was
    over-stimulating next to the crafting animation until cut to 3 soft events per skill-up; the unlock must sit at the
    skill-up's level; no pitch sweeps (siren); the phone boost must stay gentle (x2, light compressor).
  - The locked whole: `r126('A')` with `ENG126.A = E150('E2')`.

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
- `barModule(top, mode, V)`: modes `X` no track at all (the scene draws the whole bar; use it when the bar is an object), `A` inside the bar (clipped), `B` breaks out (6 px), `F` Fishing water, `M`
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

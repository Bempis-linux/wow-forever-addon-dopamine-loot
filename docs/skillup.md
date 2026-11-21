# Skill-ups: the workstream (1.4.0, item 2)

The current focus. Read this file (not plan.md) when working on skill-ups. Page: `docs/mockups/skillup-p2.html` (the
only page; its `<h1>` says the round). Every round is in `docs/skillup-rounds.md` (read only for an old round's detail).
Design rules that apply everywhere are in CLAUDE.md and memory.

## Next: First Aid (start here)

Done: Herbalism, Fishing, Skinning, Mining, Blacksmithing, Leatherworking, Alchemy, Tailoring, Engineering, **Cooking**
(2026-11-19), **Enchanting** (2026-11-20, rounds 184-238, page `docs/mockups/enchant.html`; its entries are at the end of this file). Left: **First Aid**; then revisit **Alchemy and Tailoring** with `wow-design-ideas`
(user, 2026-11-19). Optional revisits: the Mining and Leatherworking notes below.

- **Before any pitch: use the kit skill `wow-design-ideas`** (updated after Cooking: section 3b on satisfying motion, section
  8 on what made Cooking fast, the sound notes on "tinky" and "a lot going on").
- Enchanting's craft ring to avoid: **Motes + moon sparkle** (craft-compare `finalPick.Enchanting = 'F'`: motes draw a
  triangle and a star, then a moon-phase sparkle). So no motes drawing shapes, no moon.
- **How Cooking ran (17 rounds, 167-183; the user called it the most successful session):** pitch whole ideas and build only
  the picks (several pitches in a row when the user wants more); critique my own build against the gates before redesigning;
  when the user couldn't decide I recommended one with reasons; then look, motion (menus of named refinements), add-ons (each
  its own option), finale (the user's idea arranged on the formula), a cleanup pass on stills, sound (lead with one set).
- **Round 184 (2026-11-19, in progress):** Cooking's code moved to the old-rounds file (page 476 KB, then 513 KB with
  r184). Pitched A Blade glow, B Runed rod, C Dust to arcane glass, D Crystal spine, E Arcane tether, F Vellum scroll,
  G Runestone frame, H Ley line; the user picked B, C, F, G, built as `r184(K)` (`EN184`, profile `enb184`, page keys
  1-4) with sketched finales and placeholder sounds. The user liked C's dust idea (not its build) and F, wanted more ideas.
- **Round 185:** B and G moved to the old-rounds file. Pitched I Essence rolls the dust, J Dust through a stencil, K Dust
  runs the tablet, L Dust brush stroke; picked I, J, L, built as `EN184.I/J/L` beside C and F (keys 1-5: C, F, I, J, L).
  Page 514 KB. The user disliked all three (moved out). What they want: **dust as a material worked by something each
  skill-up, like Engineering's cogs and Cooking's slices, not a fill sliding right**; from F they liked the unrolling.
- **Round 186:** pitched M Rune seal on the scroll, N Essence merge, O Wand carving, P Shard grindstone; picked N and O,
  built as `EN184.N/O` (keys 3-4; C and F kept as 1-2). Page 515 KB. The user wanted a complete pivot (no dust).
- **Round 187:** C, F, N, O moved out. Pitched Q Sword in the stone, R Riffling tome, S Levitating bridge, T Animated broom,
  then U Animated armor, V Sword vs. dummy, W Golem and boulder; picked R, T, U, V, W, built as `EN184.R/T/U/V/W`
  (keys 1-5; helpers `pos187`, `floor187`). Page 512 KB. The user: "not really hitting", back to the vellum or dust.
- **Round 188:** round 187 moved out; C and F restored (keys 1-2). Built M Seal stamp (F's unrolling + a brass seal dipped
  in dust that slams onto the fresh vellum), C2 Dust to glass v2 (bigger pouch and rod, glass in chunks), F2 Vellum scroll
  v2 (bigger scroll, weighty roll, bold sigils) as `EN184.M/C2/F2` (keys 3-5; helpers `scroll188`, `roll188`,
  `front188`, `sigilsOn188`, `liftOff188`). Page 519 KB (near the cap: move unpicked options out first next round).
- **Round 189 (the user's idea):** runes written across a broadsword; at the finale the sword powers up with the complete
  enchantment. Built as `EN184.SW` (key 1; `blade189`, `hilt189`, `rod189`): the blade is the bar (hilt at the start, point
  at the recipe), an enchanting rod traces each rune; finale: runes ignite, edges glow, held glint at the point, power-up
  flash + shockwave + edge sparks + beam into the recipe, the enchant glow and a sheen stay on the blade. M kept as key 2;
  C, F, C2, F2 moved out. Page 505 KB. The user: go this direction, with structurally different builds.
- **Round 190:** M moved out. Built four more sword builds on shared helpers (`sword190` local sword, `fin190`,
  `runeB190`, `drawRune190`, `power190`): SB runes fly from a tome by the hilt, SC drawn from a scabbard (hilt pulled
  toward the recipe, the mouth's rune ring inscribes; finale: scabbard drops, the sword flips to point at the recipe),
  SD reforged from shards (ghost outline, a heap under the hilt, shards snap in with seam runes), SE a rune ring slides
  along the blade printing runes. Keys 1-5: SW, SB, SC, SD, SE. Page 515 KB.
- **Round 191: picked SE (the rune ring scan).** The user: like Cooking's ingredients, each finished sword gets its own
  element with its own finale: arcane (violet), fire (red-orange), lightning (light blue). Rounds 189-190 moved out; SE
  rebuilt as `se191(el)` with palettes `EL191` (`sword191`, `rune191`, `bolt191` smooth lightning arcs, `flames191`):
  arcane = beam; fire = edge flames build, the blade bursts into flame, a fireball arcs into the recipe, embers, it
  keeps burning; lightning = arcs crackle between runes, a flash, three arcs from along the blade into the recipe, arcs
  keep crawling. Keys 1-4: Arcane, Fire, Lightning, rotating (`elCur191`, a new element after each finale, never the
  same twice). Page 501 KB. The user: "pretty cool start"; next general improvements (look, cohesion, the skill-up's impact).
- **Round 192: SE v2** (`se192`, `sword192`, `band192`): a beveled sword (two-tone bevels, fuller, flared gold guard with an
  element gem, wrapped grip, pommel, a shadow); the enchanted stretch carries the element tint + a charged fuller line; the
  ring is a solid band with rune ticks. Each skill-up: charge (tightens, spins up, sparks drawn in), a hair of pull-back,
  a snap with a smear, an overshoot and clamp; the hit: freeze, squash, the rune burns in white, a shockwave ellipse, a
  spark spray, a jolt, a pulse back to the guard gem. Keys 1-4 v2 (Arcane, Fire, Lightning, rotating), 5 v1 rotating.
  Page 517 KB (near the cap). The user: impact good, but the design looked unchanged.
- **Round 193:** v1 moved out; `se192(el, style)` takes a look (`SWD193`, `BND193`): Dark runeblade (`swordDark193`:
  blackened steel, element lines along the edges behind the ring, angular iron guard, big gem) and Icon style
  (`swordIcon193`: thick dark outline, flat two-tone shading, bold highlight, chunky gold hilt; `stones193` rune stones
  orbit instead of a band). Keys 1-3 Dark, 4-6 Icon (Arcane, Fire, Lightning), 7 v2 Arcane. Page 514 KB.
- **Round 194: Dark runeblade picked; "heavily clean up the design"; work on Fire only for now (other elements later).**
  Style `clean` (`swordClean194`, `bandClean194`, knobs in `se192` keyed on `style === 'clean'`): slimmer crisp blade with a
  faceted point and one bevel line, no shadow blob, no tinted wash (thin element edge lines + crisp bright runes, no dark
  grooves or halos), a readable iron hilt (straight guard, socketed gem, banded grip, round pommel), a crisp ring with
  little bloom, calmer steady flames after the finale. Keys: 1 Clean Fire, 2 Dark Fire.
- **Round 195** (the user: "definitely going the right way"; wants ideas for the ring, animations and rune placement, and
  liked the Icon look's spinning stones). Cleanup moved sigils, vellum, dish, v2/Dark/Icon swords out (se192 now falls back
  to the clean sword and band). `se195(kind)` on the clean Fire sword (`fireFin195` shared fire payoff, `heat195`):
  A current band (`EN184.A` = Clf); B orbiting rune stones (`stones193`): the front stone breaks orbit and slams in as an
  inlaid rune in a square socket, an ember from the gem becomes a new stone; C revolver collar: indexes a rune face, slides,
  deposits it in an ember-gold cartouche; D branding clamp: jaws heat iron to white, clamp, brand a big rune (steam),
  it cools to ember. Keys 1-4. Page 517 KB.
- **Round 196:** the user kept A (the clean band) and asked for variations of it. B, C, D moved out. se192 gained hooks:
  `cln` (any style starting with "clean"), `PL195[style]` (rune y offset, scale, a `pre` draw), `LEAN195` (the snap's
  smear) and `CARRY195` (the next rune). A2 `bandTilt196` + an engraved script line with diamond stops; A3 `bandDouble196`
  + two staggered rune rows on the bevels; A4 `bandCarry196` (the next rune glows inside the band, handed over on the
  hit). `wrap196` sets names/descs. Keys 1-4: A, A2, A3, A4. Page 509 KB.
- **Round 197: A locked as the base** ("we can easily do add-ons"); add-ons per element, Fire first. Hook: se192 calls
  `window.ADD197(state)` at the end of its draw; `wrapAdd197(name, desc, fn)` on `BASE197 = se192('fire', 'clean')`.
  `ADDF197`: embers (trail + burst + sizzles, each skill-up), heat (white-hot bloom on the steel round the new rune +
  a warm afterglow, each skill-up), runeflame (a flame jets from the new rune and dances there until the next, each
  skill-up), wave (a wall of flame sweeps the blade as it fires, finale). Keys 1-4 add-ons, 5 plain A. Page 515 KB.
- **Round 198:** the user kept **Heat bloom**; finales wait until every element's add-ons are done (Fire first). Heat bloom
  fixed: the afterglow is a rounded glow wrapping the ring (it was a square that ended before it), and every hit in
  `S.hits` blooms and fades out fully over 1.6 s (se192's `hitT` stops at .6 and `o` moves on, which cut it short).
  New, each on Heat bloom (`both198`): `ringfire` (flame tongues round the band, flare on charge, burst on the hit),
  `trail` (flames along both edges behind the snap, burning down), `scorch` (a lasting soot halo + cooling rim per rune).
  Keys: 1 Heat bloom, 2 + Ring of fire, 3 + Fire trail, 4 + Scorch halo. Page 519 KB (near the cap).
- **Round 199:** the user's idea: the ring ripples slightly like a living flame (`bandFlame199`, amplitude `FLAMEAMP199`:
  a wavering outline, the top licking up in a flicker, red edge / orange body / pale core, the odd ember; style `cleanF`,
  `BASE199`, `flame199(name, desc, amp)` with Heat bloom). The user also saw a square edge while the ring moves: it was
  the clean sword's glowing edge lines ending flat at the ring (hidden by the ring's glow at rest); they now fade out over
  their last 18 px. Unpicked round-197 add-ons moved out. Keys: 1 subtle (.7), 2 stronger (1.4), 3 current ring, 4-6
  Heat bloom + Ring of fire / Fire trail / Scorch halo. Page 519 KB.
- **Round 200: Fire locked so far = the subtle living-flame ring (amp .7) + Heat bloom** (Ring of fire, Fire trail,
  Scorch halo not picked). The user wants add-ons for the skill-up hit: `hits200` (per hit in `S.hits`), `ADDF197`
  fireWave (a flaming shockwave ellipse), flare (a fan of flame tongues round a white core), fountain (a dense spray of
  molten sparks), flash (a white-hot flash, the blade catches the light, warm firelight flares round the sword);
  `hit200` wraps them on the locked base. Keys 1-4, 5 the base alone.
- **Round 201: Fire LOCKED** = the subtle living-flame ring (`bandFlame199`, amp .7) + Heat bloom + Fire shockwave (K1) +
  Flame flare (K2): `EN184.FIRE`. Unpicked code moved out (PL195 kept as `{}`, `LEAN195`/`CARRY195` still declared).
  **Lightning, the same way:** base = storm ring (`bandStorm201`: fast shimmer, flicker, little arcs jumping off; style
  `cleanS`) + Charge glow (`ADDF197.charge`, blue-white bloom + crackle, the Heat bloom counterpart); hit add-ons arcBurst
  (arcs to bare steel and the last runes), chain (rune to rune back to the gem), staticWave (a ring of short arcs); each
  skill-up crawl (arcs along the edges for a second). `storm201` wraps them. Keys 1 base, 2-5 add-ons, 6 Fire locked.
  Page 521 KB. Then Arcane the same way; finales after all three elements' add-ons.
- **Round 202: Lightning kept** = storm ring + Charge glow + Arc burst (S1) + Chain to the gem (S2) + Spark crawl (S4).
  The user: improve the electricity on the ring and the arc burst. `bolt202` (irregular bends on a smooth path, tapered,
  forks, strikes in ~40 ms via `grow`, flickers and re-strikes, glow/body/white core); `bandStorm202` (shimmering band,
  arcs hugging its surface, flaring hot spots, branching discharges kept below the header); arcBurst re-strikes three
  times with target flashes; chain and crawl use bolt202. `BASE202`, `zap202(name, desc, ZAP202)`; old sparks kept as
  `EN184.Z0` (`OLD202`). Keys 1 normal, 2 intense, 3 old, 4 Fire locked. Leatherworking r96/r97 + home184 moved to the
  old-rounds file for room. Page 522 KB.
- **Round 203: Lightning LOCKED** = Z1 (`EN184.STORM` = `zap202(..., 1)`): storm ring (`bandStorm202`) + Charge glow +
  Arc burst + Chain to the gem + Spark crawl, `bolt202` at normal strength. Replaced Lightning code and the old
  Leatherworking helpers (tok90..FIN96; ts95 kept) moved out. **Arcane, the same way:** base = mana-weave ring
  (`bandWeave203`: two violet strands twisting round each other, breathing, star glints running round; style `cleanA`)
  + Arcane surge (`ADDF197.surge`: violet-white bloom + a twinkling star glint on the new rune). Hit add-ons ripple
  (three rings out), glints (a burst of spinning star glints), echo (a ghost of the rune lifts and grows), stream (mana
  flows down the fuller into the gem); each skill-up runeWave (a shimmer runs back along the runes). `arc203` wraps them.
  Keys 1 base, 2-6 add-ons. Page 519 KB. After Arcane: finales for all three elements.
- **Round 204: Arcane kept** = mana-weave ring + Arcane surge + Rune echo (R3) + Mana stream (R4) (`kept204`). The user
  asked for another round, not counterparts of the other elements: blink (the band vanishes mid-snap, an afterimage, it
  reappears in a flash; `BLINK204` scales the band via style `cleanA2`), missiles (three arcane missiles fly from the
  gem into the band while it charges), prism (the new rune splits into rose/ice/violet copies and recombines), trail
  (star glints along the snap's path). `arc204(name, desc, fn, blink)`, `BASE204`. Keys 1 kept, 2-5 add-ons.
  **Page 523 KB: at the cap; move unpicked code out before the next round.**
- **Round 205: Arcane LOCKED** = mana-weave ring + Arcane surge + Rune echo + Mana stream + Arcane missiles (Q2) +
  Prismatic split (Q3). `LOCK205[el]` holds each element's locked add-ons (Fire: heat, fireWave, flare; Lightning:
  charge, arcBurst, chain, crawl; Arcane: surge, echo, stream, missiles, prism); `BASES205` the locked bases. **Finales**
  (`FIN205`, `fin205(el, name, desc, fn)`; se192 switches `NOPAY205` (no old payoff) and `NOFL205` (no old build-up
  flames)): Fire molten (heat crawls out, runes melt into a molten line, white held beat, a ring of flame + fireball,
  cools) and engulf (the user's "bursts into flame": flames creep along, sink to embers, the whole sword bursts, a stream
  of fire into the recipe, settles); Lightning sky (arcs build, dark held beat, a big branching bolt from above onto the
  point, discharge into the recipe) and ball (laps guard to point faster, the band collapses into a ball, it shoots into
  the recipe and bursts); Arcane barrage (missiles stream faster, rune ghosts lift in rose/ice/violet, collapse into the
  point, beam + ripples) and well (mana streams into the gem, an orb swells, a wave down the blade, a beam). Keys 1-6.
  To fit, the page's full-line comments were stripped (archived in the old-rounds file) and unpicked add-ons moved out.
  **Page 524,052 bytes, 236 under the cap: anything new needs code moved out first.**
- **Round 206:** the user: the finales aren't dramatic enough; Fire first. Keep Molten core's heating; a new payoff from
  the user's reference image (a sword thrust like a spear, fire tearing backward off the blade in a big billowing plume,
  white core to yellow, orange, red, smoke, embers streaking back). `FIN205.spear(big)`: Molten core's build-up and held
  beat, then the whole scene lunges 24 px (`THX205`, a new offset in se192) so the point pierces the recipe, a solid
  widening fire cone + billowing flame clouds + ember streaks behind the hilt (`plume206`), then it eases back, the plume
  breaks up, the steel cools. Lightning and Arcane finales (sky, ball, barrage, well) moved to the old-rounds file for
  room; redo them after Fire. Keys 1 spear, 2 bigger plume, 3 Molten core. Page 520 KB.
- **Round 207: Fire finale LOCKED = Spear thrust, bigger plume (`EN184.SPB`).** se192's old payoff block, stones193, SP
  and FM moved out. Lightning finales (`FIN205.storm`, `FIN205.over`; `dark207` a soft elliptical darkening/flash):
  Storm call (the module darkens, distant bolts behind, arcs race between runes; held dark beat with one spark at the
  point; three branching bolts strike the guard, blade and point with a flash; arcs discharge into the recipe) and
  Overcharge (the blade glows, arcs lash out in all directions; held beat as they're pulled into the point; one massive
  branching discharge plus three arcs from along the blade into the recipe, two shockwave rings, arcs burst round the
  recipe). Keys 1 Storm call, 2 Overcharge, 3 Fire locked. Page 521 KB.
- **Round 208:** the user asked for more Lightning finale ideas; built all four picks: rail (runes charge like capacitors,
  a white sphere swells at the point, a straight beam through the recipe with two arcs along it), tspear (arcs coil round
  the blade, it lunges via `THX205` with a forked bolt leading and a shredded wake of arcs), chainR (an arc hops rune to
  rune, growing; the last hop arcs up and over into the recipe and branches down to the ground), tesla (Jacob's-ladder
  rungs climb the blade; a big arc whips up and over into the recipe). Keys 1-6: Storm call, Overcharge, Railgun,
  Thunder spear, Chain reaction, Tesla coil. For room, the locked Fire finale code (molten, plume206, spear206, SPB) and
  the unused FIRE/STORM option lines moved to the old-rounds file (rebuild Fire's finale from there). Page 522 KB.
  Lesson: the point sits ~14 px from the recipe, so any payoff "from the point" must arc up and over or start along the
  blade, or it doesn't read.
- **Round 209:** the user: none of the six read as dramatic; "2 new big and bold ideas, much more dramatic". The strip-sized
  finales moved out. Both new ones break far out of the bar (se192 gained `THY205` for a vertical shake; `shake209`,
  `veil209` soft elliptical darkening/flash, `eblade209` an energy blade, `big209` wrapper): lblade (the area darkens, a
  150 px crackling energy blade grows from the point and rises steeply, hums, then slashes down through the recipe in a
  giant arc with afterimages, a white flash, a hard shake, sparks; it retracts) and thunder (a wide dark storm with
  distant bolts flashing in it; a dark held beat; a massive branching bolt slams the point from far above, the whole
  module flashes white, a 230 px shockwave dome of arcs, hard shake, sparks rain). Keys 1-2. Page 516 KB.
  Lesson: the phone/pane screen is narrow (~500 px): big effects must go up or around, not far to the right.
- **Round 210: Thunderstrike picked.** The user: a circular explosion instead of the arc, and a godzilla-ray power-up
  ("whum.... whum..... whumwhumwhum"). `FB184`/`FP184` are now `let` and r184's draw sets them per option (`Z.fb`, `Z.fp`,
  default 1.3/1.65); Thunderstrike v2 (`FIN205.thunder2`, `EN184.LX3`) uses fb 2.4, fp 2.75, finAt 3.0. Pulses `PUL210`
  (13 whums, 0.65 s apart slowing to 0.03 s), each a wave of light down the blade, a pulse ring at the point, the blade
  and point brighter, a small shake; a held beat (FP-.2) with arcs sucked into the point; then the bolt from above, a
  white core, three full expanding rings, 14 radial arcs, sparks in every direction, a hard shake. Sound `whum210` (a low
  sine whum rising in pitch, louder each time; a deep boom + crack). Keys 1 v2, 2 v1. Page 521 KB.
- **Round 211:** the user likes v2; fixes: the power-up waves looked "square-y" (a gradient rectangle with a hard
  front) and are now soft oval glows; the blade wash is a gradient guard→point; the explosion was laggy at the end:
  radial arcs 14 → 9 without branches, sparks 70 → 34, ring blur only on the first ring, the second sky bolt without
  branches (worst explosion frame ~6 ms in the pane).
- **Round 212:** the user: improve the final explosion. Replaced the white dot, thin rings and straight radial arcs with:
  a plasma fireball (white → ice blue, swells in .16 s and fades), two thick soft shockwave bands (radial gradients,
  230 and 170 px), arcs crawling along the first band's edge as it grows, 14 light streaks fading toward their tips, and
  22 twinkling static stars that linger. Gradients only, no shadow blur (worst frame ~5 ms). Old explosion in the
  old-rounds file.
- **Round 213:** the user: the sparks around and before the explosion need work. Power-up: energy streaks spiral into
  the point (4 → 18 as the charge builds, gradient-tailed). Held beat: six steady tendrils reach in from round the point
  (rate 12, no per-frame reroll). Explosion: the gravity-falling dots became 30 bright streaks that burst outward and slow
  to a stop (drag, gradient tails). Lightning blade (LX1) and Thunderstrike v1 (LX2) moved out for room (page was over the
  cap); the page shows only `LX3`. Worst frame ~5 ms (warm). Page 520 KB.
- **Round 214:** the user meant the bolt flash right before the shockwave and the arcs during/after it (re-rolled
  scribbles). Rebuilt like real lightning: `strike214` a fixed channel (`chan214`, smoothed, never re-rolled) with three
  fixed branches: a thin leader crawls down in the last .1 s of the held beat, then the return stroke flashes and
  re-strikes on the same path (`FLK214` flicker) and fades by .5 s; `ringArcs214` arcs that follow the shockwave curve,
  holding shape and flickering. The user likes Zinogre-style sparks (a style cue only): `pops214`, 26 bright points that
  flash and snap into a tiny crackling burst around the blast over 1.2 s (replacing the twinkling stars). Whirl-ins
  slowed (speed .9 + .7c, at most 13). Worst frame ~4.5 ms. Page 523 KB.
- **Round 215:** the user: the lightning arcs still look "too rectangular" (and likes the end sparks). Guess: every arc's
  glow was one wide, flat, hard-edged translucent stroke round the core, which reads as a rectangular band. `bolt202` and
  `drawChan214` now draw a soft falloff (three wide strokes at low alpha, then the body and a thin core), no shadow blur.
  Added a **speed control** (Normal, ¼, very slow, Pause; `window.SLOWMO` scales `frame`'s dt) under the moment buttons
  so the user can freeze the fast moments and point at them.
- **Round 216:** with the speed control the user caught it: (1) the arcs round the point in the held beat (short
  squiggles starting/stopping abruptly) and (2) the distant storm bolts, which start and end mid-air ("clipped within an
  invisible square window"). (1) `curl215`: six tendrils curl inward along a spiral into the point, each fading from
  nothing at its outer end to bright at the point, slight jitter, flicker. (2) the storm bolts are gone; the storm shows
  as sheet lightning (soft flashes lighting patches of the dark, flicker pattern). The strike from above stays. LX3's
  desc shortened to fit: page 524,246 bytes, 42 under the cap (move code out before adding anything).
  Lesson: an effect that ends mid-air with a hard tip reads as clipped; fade ends or start them off-screen.
- **Round 217:** the user also meant the arcs riding the shockwave round the final sparks; wants "wispy remainder sparks".
  `ringArcs214` removed; `wisps216`: 14 wisps drift out and up after the blast, each a bright head with a softly curving
  tail fading to nothing, over ~1.1 s. Spark pops kept. Unused option lines (L1, K1, K2, Z1, R0) moved out for room.
  Page 523 KB.
- **Round 218:** the user's screenshot showed the culprit after the explosion: the spark pops' crackle lines (5 curved
  lines up to ~20 px, spider-leg-like). `pops214` redesigned: a bright point blooming into a soft glow, with 4 tiny flecks
  (≤12 px, gradient tails) flicking outward, over .35 s; no long lines. Old version in the old-rounds file.
- **Lightning finale LOCKED (2026-11-19) = Thunderstrike v2, `EN184.LX3`** (`FIN205.thunder2`, fb 2.4 / fp 2.75 / finAt 3.0):
  sheet-lightning storm; whum power-up (`PUL210`, soft oval waves down the blade, point pulses, energy streaks spiralling
  in); held beat with `curl215` tendrils curling into the point and the leader descending; `strike214` fixed-path strike
  with re-strikes; plasma fireball, two soft shockwave bands, light streaks, outward spark streaks, `pops214` soft pops,
  `wisps216` drifting wisps; `whum210` sound. **Next: the Arcane finale**, big and bold from the start (the lessons
  below), then the rotating whole (Fire / Lightning / Arcane, a new element after each finale) and the sound pass.
  Lessons from Fire and Lightning finales: strip-sized effects never read as dramatic; go far out of the bar (up and
  around, the screen is narrow); nothing may end mid-air with a hard tip; arcs re-rolled every frame look like scribbles,
  hold a shape and flicker instead; glow must fade softly, never a flat hard-edged band; give the user the Speed row to
  point at fast moments.
- **Round 219: Arcane finales**, big from the start (the Lightning finale code is parked in the old-rounds file like
  Fire's; `smooth214`, `chan214`, `drawChan214`, `veil209`, `shake209` stay). `bigA219(name, desc, fn, fb, fp, snd)`.
  `rift` (Reality rift: darkness, a violet tear above the point opening with six pulses, flecks; held: it gapes with
  rays; a torrent of light down onto the point, a nova of soft bands + a glyph ring; the rift snaps shut), `nova` (runes
  lift off and orbit the sword faster with afterimages; held: frozen, tinted violet; they slam back, a nova of two glyph
  rings + bands + a pink-white flash), `shatter` (Shattered time: the page really slows, `window.WARP` scales frame's dt,
  r184 resets it each frame; colour drains to violet via a source-atop tint; held: cracks race out; then a snapshot of
  the frozen frame shatters into 12 panes flying out, time snaps back). Sounds `sndA219`. Keys 1-3. Page 522 KB.
- **Round 220:** the user: Arcane nova "pretty cool", wants more drama; Reality rift "not put together" (dropped; rift and
  shatter moved out). Built the user's picks: `nova2` Nova, amplified (`EN184.AN2`, fb 2.2/fp 2.55: the runes spread into a
  huge spinning glyph circle with two soft rings and afterimages, the sword rising into it via `THY205`; held: it locks
  and blazes; three cascading novas with glyph rings, bands, a violet-white flash, hard shakes) and `starfall`
  (`EN184.AST`: 26 falling stars, accelerating, each lighting its rune; held: a huge star gathers above the point with
  turning rays; it crashes down: flash, bands, a crater ring, a spray of star particles). `softRing220`, sounds `snd220`
  (gentle pentatonic tinks per star). Glyph rings and orbit runes draw without shadow blur (perf). Keys 1 Nova amplified,
  2 Starfall, 3 Arcane nova. Page 523 KB.
- **Arcane finale LOCKED (2026-11-19) = Starfall (`EN184.AST`, `FIN205.starfall`, fb 2 / fp 2.4).** All three elements are
  now locked (ring, add-ons, finale). **Next: the rotating whole** (one option: Fire / Lightning / Arcane, a new element
  after each finale, never the same twice) **and the sound pass.** The page can't hold all three finales at once (cap
  524,288; Fire's and Lightning's finale code are parked in the old-rounds file): make a dedicated Enchanting page
  (`docs/mockups/enchant.html`: a copy of skillup-p2.html with the other professions' old rounds cut, keeping
  barModule and its helpers) and assemble Fire SPB + Lightning LX3 + Arcane AST there.
- **Round 221: the whole, on its own page `docs/mockups/enchant.html`** (353 KB). Built from skillup-p2.html by a pruning
  script (scratchpad `prune.ps1`: lines 250 to `PROF.Enchanting` are split into top-level statements by bracket depth,
  and only definitions reachable from the rest are kept; the other professions' FAM/setTimeout lines are dropped), then
  the parked Fire finale (molten, plume206, spear206, SPB) and Lightning finale (PUL210 … LX3) pasted back from the
  old-rounds file. `ROTFAM221`: Rotating (a new element after each finale, never the same twice, `rotI221`), plus Fire,
  Lightning, Arcane alone. Opens on "Reaching the next unlock" with Loop on. Checked: all moments/gaps, six finales in a
  row rotated Fire, Lightning, Arcane, Fire, Arcane, Fire; warm frames under 4 ms. skillup-p2.html stays as the round
  history (other professions' done looks). **Next: the sound pass** for the whole (each skill-up's sounds per element,
  the finales; the sound-fatigue rules).
- **Round 222: sound pass v1** (enchant.html): `HIT222[el](v, n)` two sounds a skill-up: a warm low thump (104-118 Hz) +
  the element's texture (Fire a soft lowpass crackle, Lightning a short muffled bandpass zap, Arcane nothing extra), then
  a scale note (`PENT42`, folded into one octave) as the rune settles (Fire triangle at 196, Lightning two detuned sines
  at 220, Arcane a sine at 262 + a faint fifth), stepping down via `fat45`. `snd222(el)` on SPB/LX3/AST. Finales: Fire
  three rising roars, held silent, boom + whoosh (`FINSND222.fire`); Lightning keeps `whum210`; Arcane soft low triangle
  chimes on every other star, held silent, boom + a low chord (`FINSND222.arcane`). "Hear a skill-up" row (Fire,
  Lightning, Arcane). Checked silently (no errors, no negative offsets); not listened to.
- **Round 223:** the user: the Lightning and Arcane finales sounded better before. Lightning's finale sound (`whum210`)
  never changed; only its skill-up hit did, so `EN184.LX3.snd = BASE202.snd` again (se192's: a soft hum while charging, a
  wooden knock, a second hum a step up). Arcane's finale back to `snd220('star')` (a chime on every star climbing the
  pentatonic scale, boom + the higher closing chord); Arcane's skill-up keeps `snd222('arcane')`. Fire keeps the new set.
  The Lightning Hear button plays the restored sound.
- **Round 224:** the user: the page shows the three locked element families; 2-3 sound design families for skill-ups and
  finales (finales dramatic; skill-ups impactful but lowkey, in line with the crafting animation). Options 1 Fire, 2
  Lightning, 3 Arcane, 4 Rotating. `SFAM224` with a Sound family row (`SF224`): A Deep impact (low punchy thump + a
  whisper of the element + a settling note; finale: low tones rising per beat, silent held beat, sub boom + low chord),
  B Resonant (one struck ringing low note per skill-up coloured per element; finale: a drone building a tone per beat,
  silence, a ringing chord bloom over a boom), C Elemental (Fire whoomph + faint crackles, Lightning low zap, Arcane
  shimmer-in + low glass ping; finales Fire roars / Lightning whums / Arcane star chimes). Build beats per element
  (`BEATS224`: Fire 0/.45/.9, Lightning the whum times, Arcane every other star). `sfSnd224`/`sfFin224` on SPB/LX3/AST;
  Hear buttons play the current family. Checked silently (no errors, no negative offsets).
- **Round 225:** the user: A/B/C not liked; Elemental is the way; Resonant suits Arcane's charging finale (Starfall);
  "a little too safe", but skill-ups must stay in line with the crafting animation; and since the step-down (`fat45`:
  1, 1, .85, .7, .55, .5) quiets repeats, there's room for some drama. `SFAM224.D` Elemental, bolder (default): Fire
  80 Hz body + a big lowpass whoomph + 6 scattered crackles (`crackle225`) + a settle note; Lightning 98 Hz body + a zap
  + a snap + a short detuned buzz + a settle pair; Arcane a shimmer-in, a low whoom, a ringing glass note (`ring224`).
  An accent layer only on loud hits (`acc(v)`: full at v=1, gone at v≤.6): Fire a short rising whoosh into the hit,
  Lightning a rolling rumble, Arcane a high shimmer tail. Finales: Fire heavier roars with a low tone stepping up +
  crackles, silent held, sub boom + long whoosh + crackling + rumble tail; Lightning louder whums into a thunderclap
  (crack + snap + sub + a long rolling rumble); Arcane the Resonant beat drone per star + the Resonant bloom + a sub +
  a shimmer tail. A, B, C stay to compare. Checked silently.
- **Round 228:** the user: D was "just louder"; wanted new sounds with Elemental as the reference. New synth helpers
  (`nz228` noise with a moving filter cutoff, `osc228` oscillator through a moving lowpass, `fm228` FM with a decaying
  index, `grains228` crackle grains; pitch never sweeps). Families: **E Material** (Fire a torch breath bright→dark +
  wood crackle; Lightning an arc-welder sputter of grains over a thump; Arcane rubbed glass swelling into an FM glass
  ping; finales: breaths into a torch roar / FM hum pulses into a thunder crack + long rumble / a glass tone ringing per
  star into a glass-bell bloom), **F Spellcraft** (Fire an FM growl flare; Lightning a ring-mod zap; Arcane a bell
  swelling in from a filtered rush; finales: growls stacking a step per beat / FM hum pulses into a zap cluster /
  FM bells per star into a bell-chord bloom), **G Cinematic** (every hit a whoosh-in + sub/punch impact + the
  element; finales: sawtooth braams whose filter opens per beat, silent held, a massive impact + braam chord + the
  element's tail; Arcane uses the Resonant beats/bloom). Arcane's finale charge rings per star in every family (the
  user liked Resonant there). A, B, D removed; row shows C (reference), E, F, G; default E. Long sessions (user,
  2026-11-20): the step-down is the fatigue protection; in the addon step to a ~40% floor by ~10 and reset after a
  ~10 s pause. Checked silently.
- **Round 229: Lightning sound first.** The user: likes a crackling electricity sound with some depth on the skill-up;
  no super-loud finales (Fire's and the "snap" explosion: "a stick being snapped, not an explosion"). `crk229` a real
  crackle (sparse random pops of varying size in one buffer, bandpassed ~1.1-1.3 kHz, lowpassed 3.2 kHz; shapes decay /
  swell / even), `hum229` a low electric hum (detuned pair + 2nd/3rd harmonics). `LV229` variants with a row and
  Hear skill-up / Hear finale end buttons (`LSEL229`): 1 Live wire (crackle burst over a 60 Hz hum + thump; pay: soft
  45 Hz boom, rolling rumble, fading crackle), 2 Arc (crackle swelling in as the band charges, an FM buzz hum on the
  hit; pay: a crackle surge over a deep FM hum and a low boom), 3 Static discharge (a tight crackle + a sparse sizzle
  tail over a sub thump; pay: boom + rumble + lingering crackle pops). Finale build for all: the whums with crackle
  thickening from the 3rd whum; no sharp crack anywhere. Measured offline (peak / loudest 50 ms): hits ~.03 / .01 vs
  the old hit .018 / .009; pays .05-.07 / .02-.03 vs the old explosion .065 / .033. The page opens on Lightning.
- **Round 230:** the user: not into round 229; clean the page up (easy settings, reads well on mobile and PC); start
  Lightning sound from scratch via `wow-design-ideas`; no sound families; only Lightning on the page (my phone-speaker
  theory was wrong: it's taste). enchant.html panel rebuilt: "Enchanting · Lightning", Moment (segmented), Sound &
  playback (Sound, Loop, the Lightning sound row, Hear buttons, Speed, Phone boost), the description; at ≤760 px the
  panel becomes a bottom sheet under the scene with bigger buttons. Only Lightning in FAM; old family rows hidden.
  Pitched four directions, the user picked all: `LV230` (`hit(t, v, n)`, optional `pre`, `build(t, i, c)` per whum,
  `pay(t)`): 1 Tesla coil (detuned sawtooth buzz through a closing filter + dense crackle; finale buzz opening per whum
  into a roaring arc), 2 Pocket storm (a tiny thunder roll + crackle edge; finale rolling thunder closer per whum into a
  deep crash, no sharp transient), 3 Plasma charge (an FM charging hum into an FM thrum + crackle; finale FM charge
  stepping up per whum into a deep plasma blast), 4 Electric sizzle (a hot sizzle + crackle + a low inharmonic FM
  metal ring; finale sizzle swelling into a burst with a ringing metal chord). Hear "Skill-up" / "Whole finale".
  Measured: hits at the old hit's level, payoffs under the old explosion.
- **Round 231:** the user: crackle should be an accent, not the front; Pocket storm sounded like a drum (a low sine thump
  + a short low noise roll reads as a drum). Remade `LV230` (Pocket storm and Electric sizzle replaced): a tone leads,
  crackle faint and late (~.01, after .15-.3 s), no low thumps. 1 Tesla coil (detuned saw buzz with an octave layer
  through a closing filter), 2 Plasma charge (FM charge swell into an FM thrum), 3 Power-up (new: a two-step filtered
  saw "vmm–VMM"; finale a power-up step per whum into an opening saw chord), 4 Charged metal (a low inharmonic FM ring
  + a breath of air; finale rings stacking per whum into a ringing chord + whoosh). Measured loudest 50 ms: hits
  .007-.009 (old hit .009), payoffs .020-.025 (old explosion .032).
- **Round 232:** the user likes the **Power-up skill-up** and wants a slight crackle behind it matching the arcs on the
  hit; no finale landed; the finale should sound like a storm. Lesson (user): **don't match the finale to the
  skill-up's timbre**; design the finale as its own sound. `SKILL232`: Power-up + three soft crackles at 0/.12/.24 s
  (the arc burst's strikes). Storm finales `LFIN232` (events per beat on the build, a silent hush, a payoff):
  G Gathering storm (wind `gust232` rising, distant rolls `roll232` closer each time, hush, `thunder232`: five ripping
  lowpassed bursts over .2 s + a long rolling rumble + a slow-attack sub, no fast thump), W Storm with the whums (early
  whums low rolling swells, the fast late ones soft crackle), D Downpour (`rain232` building + wind + rolls; thunder,
  rain lingering). New row (the old sound row hidden): Hear skill-up, finale picker, Hear the finale. Measured: skill-up
  .007, builds .006-.007, thunder .022-.023 (old explosion .032).
- **Round 233:** the user picked **Storm with the whums** (likes the whums and the explosion); didn't like the wind
  bed ("gathering cloud/rain" hiss); the whole finale was a little too loud next to the skill-ups. W now has no wind;
  rolls and late crackle x.7, `thunder232(t, .68)`; default LF232 = 'W'. Measured loudest 50 ms: skill-up .0068,
  build .0046, thunder .0163 (was .023).
- **Lightning sound LOCKED (2026-11-20):** skill-up `SKILL232` (Power-up: a two-step filtered saw "vmm–VMM" + three soft
  crackles on the arc strikes); finale **Storm with the whums** (`LFIN232.W`: early whums low rolling swells, late ones
  soft crackle, no wind, a silent hush, `thunder232(t, .68)` ripping crack + rolling rumble + slow-attack sub).
  **Sound lessons (Lightning, apply to Fire and Arcane):** a tone leads the skill-up; crackle/texture is a faint accent,
  never the front; no fast low thumps (low sine + short low noise = a drum); **design the finale as its own sound, not a
  bigger skill-up**; the user loves the whums; keep the finale only ~2.4x a skill-up's loudest 50 ms; measure offline
  against the old sounds. **Next: Fire sound** (same method), then Arcane.
- **(done)** `skillup-p2.html` was at 523.5 KB of the 524,288-byte cap. Before Enchanting's first round move Cooking's
  code to `skillup-p2-old-rounds.js` (everything from the `PROF.Cooking` line to the end of round 183, keeping only shared
  helpers the new round reuses), check the page still loads (`typeof FAM`), and switch the page to Enchanting in the round's
  code (see how `r167` sets `profName`). Cooking's locked whole stays recoverable from the old-rounds file and git.

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

Next: First Aid; then revisit Alchemy and Tailoring (one at a time).

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
- **Cooking (2026-11-19, rounds 167-183):**
  - Base: **the angled board cleaver**: a board seen from ~30 degrees, the ingredient lying along it (Carrot, Cucumber or
    Sausage links; it changes at random only after a finale, never inside a bar); at most 15 pieces to the next recipe
    (`slots169`), a long gap scores the notch deeper each point.
  - Each skill-up (chop v3, `chopV174` + `drawArc174`): the cleaver glides to the cut, rises on an elbow arc and hangs with a
    glint, swings down with a smear and bites into the food (its near half drawn over the blade); hit-stop, shake, cut line,
    board nick; the slice pops out in front-left of the blade, flips, lands with a squash and a second small bounce.
  - Add-ons: slice ripple (a hop wave back through the stack; the still salt shaker at the back-left hops last), apex shing,
    impact = board shockwave + chunk spray.
  - Finale v2 (`fin179`): slam, the coins jump, one slash halves them in the air, the halves rain into a heap, mince finer chop
    by chop; the cleaver flips and hangs; it sticks edge-first (shockwave), the mince clouds up and rains into a wooden bowl
    that slid on, the shaker's quick sprinkle, the bowl hops into the recipe; the next ingredient slides on. No white board
    flash (`V.noFlash`).
  - Sound **v3 warm** (`SX183`): two sounds a skill-up (a weighted thock + a warm crunch, a squish for sausage; a low wooden
    tock on landing); the finale six, one per beat (slam, air shhk, climbing mince chops, THUNK, a soft pour, three low woody
    toks over a warm tone), the held beat silent.
  - The locked whole: `r167('B', K183)` (`K183.B`) with its helpers.

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
- **Checking without the user (Cooking):** freeze the page (`frame = () => {}`), step a scene with a `goTo(fam, moment, age)`
  helper (`S.age += 1/120`, draw, `stepP`), and paint crops of `cv` at 3x into an overlay canvas to read stills; the first
  paint after a fresh load can come back blank, paint twice. Check sound code silently: `ac(); OUT.gain.value = 0`, sound on,
  run every moment, then close the tab and reopen it fresh for the user.

- **Round 234 (Fire sound, from scratch):** enchant.html now shows Fire only (Lightning's rows hidden). Four skill-ups, each a
  different mechanism with a tone in front and embers as a faint accent: A Kindle (a rising glide), B Forge ring (struck hot
  metal, FM), C Flame breath (a pitched resonant whoosh), D Catch (a two-note chord whose filter opens, slow attack). Four
  finales on the Molten core beats (0 / .45 / .9, hush, thrust at FP): Forge heart (three heat whums, blowtorch roar), Furnace
  door (a growing roar cut to silence, then a dragon breath panning right to left with the plume), Heat chord (a note per
  beat, the chord opens and bends down as it cools), Ignition (a pilot whistle climbing, a round WHUMPH, a jet roar panning
  off). Trimmed offline (trim234) to the Lightning levels: skill-ups .0068, finales about .0165.
- **Round 235:** Fire skill-up **Kindle (A) LOCKED**. The round-234 finales: none liked, "way too loud in comparison" (they
  measured equal to Lightning's finale, but broad noise roars sound far louder than they measure: lesson, for fire keep
  roar out and set finales lower, about 1.5x a skill-up, .0105). New finales, tone- or air-led: Bellows (three breaths
  brightening a glow tone, a soft fwoom, a rising warm tone), Rising glow (one tone climbing through the heating, a chord
  blooming), Phoenix (soft storm-style whums, a soaring cry, two wingbeats), Flame flutter (a flutter growing per beat,
  sweeping right to left over a sinking tone).
- **Round 236:** the round-235 finales don't hit: "I want something more like an impact". Four impacts on the thrust over
  one shared build (three soft storm-style whums, held beat silent): Fireball (crack, bloom, a sinking boom, embers), Anvil
  slam (a heavy ringing clang, low weight, a spark whoosh off behind), Inhale and slam (the held beat a rising inhale cut by
  a hard slam), Blaze crack (a warm ripping crack, layered like the thunderclap, into a crackling blaze). Impacts trimmed to
  .013 loudest 50 ms (about 1.9x a skill-up; short, so it reads quieter than the long roars of round 234).
- **Fire sound LOCKED (2026-11-20):** skill-up **Kindle** (FSK234.A: a warm triangle+filtered-saw glide up a fifth, a
  soft air breath, faint embers; trim .78). Finale **Blaze crack** (FFIN236.B): three soft storm-style heat whums
  (whum236, trim 1.38) on the Molten core beats, a silent held beat, then a warm layered ripping crack into a crackling
  blaze (trim 1.43, .013 loudest 50 ms). Lessons: the user wants the finale to land as an **impact** (a transient, a body,
  a tail), not a swell or a tune; long wide-band roars sound far louder than they measure, so keep them out; the
  thunderclap-style layered rip worked for both Lightning and Fire; the whums carry across elements. Next: Arcane sound.
- **Round 237 (Arcane sound, from scratch):** enchant.html now shows Arcane only (Fire rows hidden, Fire's locked sounds
  stay wired on SPB). Skill-ups (tone-led, a faint high glint the only accent, all .0068): A Singing bowl (inharmonic ring),
  B Rune chime (two FM bells a fifth apart), C Mana swell (detuned sines swelling in), D Arcane voice (a formant "ahh",
  vox237). Starfall finales (stars land at FB*.95*sqrt(j/26)+.32; the crash at FP+.12), each ending in an impact at .013,
  builds about .006-.008: Falling chimes (a chime per star climbing a scale, a rising tone on the held beat, glassy crack +
  boom + bowl), Arcane whums (five violet whums speeding up, a hush, a crystal ripping crack + bowl), Glass rain (glass
  grains per star, a high bowl note held, a big bowl struck hard), Star choir (a voice added per half second, one high
  voice held, the full choir opening over a boom).
- **Arcane sound LOCKED (2026-11-20):** skill-up **Mana swell** (ASK237.C: two detuned sines swelling in, a fifth and a
  soft octave, a faint glint; trim .93); finale **Glass rain** (AFIN237.G: glass grains per landing star, a high 784 Hz
  bowl note held while the big star gathers, then a big bowl struck hard with a low weight under it; build trim 2.2,
  impact .53 = .013). **All Enchanting sound LOCKED.** Round 238: enchant.html is the rotating whole again (FAM PA =
  ROTFAM221) with every locked sound wired (checked silently: each element fires its own skill-up and finale through the
  rotation), plus a row hearing each element's skill-up and finale on its own. Levels: skill-ups .0068, builds .006-.01,
  impacts .013 (Lightning's thunder .0163). The user approved the whole: **Enchanting DONE (2026-11-20).** Next: First Aid.

## First Aid (started 2026-11-20)

- **Round 239:** a page of its own, `docs/mockups/firstaid.html` (pruned from enchant.html: the shared harness up to the gap
  switch + round 239 + the speed row and the shared tail; 303 KB). Pitched A Wrapped limb, B Unit-frame heal, C Heartbeat vein,
  D Salve seal, E Field cot, F Bandage roller; the user picked A, B, D, E, built as `FA239.A/B/D/E` through `r239(K)`
  (profile `fab239`, unlock Mageweave Bandage at 150; front helper `fr239`; finale beats FB239 1.2 / FP239 1.6, shared whums
  `whum239`; page keys 1-4). Each one has a base and a sketched finale. The sounds are placeholders.
- **Round 240:** none of round 239 liked: "too much bandage", "not fun enough"; start fresh. Pitched G Draw the venom, H Knit the
  bone, I Wash the wound, J Back on your feet; the user picked **I**. Round 239's code was replaced (it's still in git, commit 7857d82).
  There are four ways to wash, each a different mechanism, built as `FA239.A-D` on `skin240` (grimy skin, washed clean from the front,
  wet beads, a finale shine): A Waterskin gush (squeezed bag, a gush along the bar; finale: a wave crashes into the recipe), B Bucket
  throw (dip in a tub, swing, a slug of water smacks the front; finale: a sheet lands left to right), C Scrub and suds (a brush
  scrubs, the suds pop; finale: a foam heap pops in a chain), D Sponge slam (squash, two squirting fans; finale: it swells, then a
  huge slam). Per-hit jolts go through `Z.jolt`. Sounds are placeholders.
- **Round 241:** the user liked **C Scrub and suds** (to reuse maybe) and wanted new animations. Pitched K Pluck the arrows,
  L Pop it back in, M Knead the knots, N Ice the swelling, O Stitch it shut, P Cool the burn, Q Suck the venom, R Shake it off;
  the user picked L, N, O, P and R. Round 240's A, B and D code was removed (it's in git, commit 55ae031). Built as `FA239.L/N/O/P/R`
  (keys 1-5, C Scrub as 6). Helpers: `seg241` (the bar's pieces via g111, each fixed by the animated front), `damp241`, `hand241`,
  `steam241`. Each one has a sketched finale. The sounds are placeholders.
- **Round 242:** the user went back to round 239's **A Wrapped limb** and wants the look and the animation heavily reworked.
  Rounds 240 and 241 were removed from the page (they're in git, commit 731dbe0; the user liked C Scrub and suds, which may be reused).
  The page now has A (round 239) for reference plus four redesigns on one shared look: `arm242` (a rounder shaded forearm, wounds
  that can turn, `fist242`), `wrap242` (shaded helical gauze bands with a slanted leading edge; options loose, phase, glow,
  wave, blur), `roll242` (a 3D roll with an end spiral), `strand242`, `lint242`, `seeps242`. W1 Close-up 3D wrap (the roll orbits
  in depth, a tug snugs the wrap in), W2 Medic's hands (one hand passes the roll over and under, the other pins and pats; the
  finale ends in a thumbs-up), W3 The arm spins (it turns on its axis while the bands scroll like a screw; the roll rides on top
  and shrinks), W4 The flick (the roll flies in a loose spiral and the loops cinch with a snap; the finale is a lasso, then a whip
  crack). Keys 1-5.
- **Round 243:** **W1 is the base.** The user: the wrap "awkwardly grows" while it wraps (the cause: W1 drew the whole wrap loose,
  1.6 px fatter, during a skill-up). Using `wow-design-ideas`, I critiqued W1 (the roll bobs on a line instead of orbiting, the bands
  come from a sliding edge, the arm doesn't react) and pitched changes plus new takes. The user picked all four changes (Laid by the
  roll, True orbit, Arm reacts, Cinch snap) and two new takes (Kit-fed bandage, Pad then wrap). W2-W4 were removed (they're in git,
  commit 74161ea). Shared state `wst243` (the old region tight, the new turns loose until the cinch, the band being laid cut
  at `ycut` under the roll, the roll on a true orbit with `behind`), `react243` (a flinch on covering a cut, a clench on the tug,
  the hand relaxing: `fist243`), `wrapAll243`; `wrap242` gained `left`, `ycut` and `noEdge`, and its bands sit at fixed
  positions. Keys: 1 W1 (as it was), 2 V2 W1 refined, 3 K Kit-fed (an open kit by the elbow feeds the gauze, its roll empties;
  finale: the lid slams, the gauze snaps free, the clip pins the end), 4 PW Pad then wrap (a hand presses a pad, then the roll
  wraps over it; finale: the pads glow through like lanterns).
- **Round 244:** the user: V2, K and PW "were add-ons, not redesigns"; they rejected structural pitches (Tabletop, Roll the bandage,
  Rip the linen, Wrapped hand) and asked for new designs of the linen, the arm, the hand and the animation on the same base. Built
  four whole looks, each with its own motion (`ST244`, `r244(K)`, `FA239.A-D`; `geom244`: a shaped forearm with a muscle swell and
  a slim wrist; `hand244`: a real hand with fingers that open as more is covered). A Painted (warm, woven linen; smooth), B Bold (thick
  outlines, flat cel shading, chunky fist; snappy squash and stretch, a comic burst), C Battle-worn (scarred dirty arm, a leather
  bracer, a fingerless glove, rough stained linen with frayed fibers; hurried, two jerky tugs, dust), D Mageweave (violet cloth with
  gold-trimmed bands and a sheen, an open hand that glows; floating roll, a light pulse, no jolt). V2 is key 5. K and PW are
  in git (commit 63d41e9).
- **Round 245 (a new theme, the user's concept):** the user doesn't like the First Aid theme (wraps, wounds) or the locked First Aid
  ring much. I suggested supply crates; the user ruled out one long crate and gave the concept: **crates across the bar**. Up to
  15 points it's one crate per point, each getting a bandage roll, then shut and stamped with a green plus; above 15, each crate
  takes several items before it's packed. Built as `FA239.A-D` on `draw245` (`plan245`: crates via g111, items per crate, an event
  per hit with land, lid and stamp times; `crate245` is a 3/4-view wooden crate whose lid stands open on its back edge and swings
  shut, or a cardboard box with flaps and tape; `parcel245` is paper that folds up; `station245` is the supplies basket plus the green ink
  pad and stamp at the start; `carry245` tosses or rolls along the lids; `stampPose245`). A Toss and lid (as described), B Roll along
  the lids, C Flap box, D Paper parcel. Finale (shared sketch): the crates hop in a wave three times, the stamp hangs over the
  last crate, slams, every plus flashes in a chain, and the last crate hops into the recipe. The wrap rounds (239-244) are in git
  (commit 5b27d1c). A ring redesign for the crate theme was mentioned, but nothing is decided.
- **Round 246: A (Toss and lid) picked.** The user: the bandages clip through; the stamp belongs on the front, not the top; make the
  crates look good and crate-like, with bigger bandages; better, more satisfying animation. `FA239.A2` = `draw246`: `crate246`
  (front planks with gaps and grain, corner posts, rails, a diagonal brace, nails, straw, a floor shadow; the open lid stands behind
  the opening (`lid246`, drawn first) and is drawn over the top once past halfway; items are clipped above the front boards and hidden
  as the lid shuts), `stampFace246` (the stamp face-on: it turns to face the crate, holds, presses the front, and the plus pops on
  the front), `plan246` (lid slam at +.45, stamp at +1.0). Motion: a basket puff on launch, a low arc (it must stay under the header)
  with spin, a bounce in the straw, an accelerating lid slam with a rebound and jiggling neighbours, a stamp wind-up, a thump with
  ink flecks. Keys: 1 A2, 2 A (round 245).
- **Round 247:** the user: "much better direction"; the stamp "clips all of a sudden" (it switched from side-on to a big face-on
  block in one frame). `stampMorph247`: one shape that turns (th 0 = side-on: the rubber strip below and the handle up; th 1 = face-on
  from behind: a rubber frame and the knob in the middle). Path: pad, then an arc to above the crate, then it turns and comes forward
  (scale 1.6), presses in, thumps, lifts, turns back and goes home; the finale's stamp does the same, held big. I checked the frames
  in a 12-still strip.
- **Round 248:** the user: make it more cohesive; the stamp, basket and crates "are all just sitting there". Pitched Packing bench,
  Supply wagon, Medic's tent stall and Shared look only; the user picked **Supply wagon** and **Medic's tent stall**. `draw246` takes hooks
  through `window.H248` (`dy` for the station, `back` and `front` draws); one wood (`WOOD248`, `plank248`) and one green.
  WG: a flatbed deck with stakes, the basket and pad on the tailboard, two spoked wheels (`wheel248`) off the springs; the
  load bounces (`thump248`: lands, lid slams, stamps); finale: it rocks with the hop waves, then lurches a wheel-turn forward. TS
  (`tent248`): a canvas awning with a green trim and tabs over the whole module (the title is the stall's sign), poles, a plank floor,
  a supplies table at the start; finale: a green-cross banner unfurls by the left pole and the tabs flutter. Also: the crates are lower
  (base ly+13, hh <= 18) and the open lids lean back (.38π) so they stay out of the header. Keys: 1 WG, 2 TS, 3 A2.
- **Round 249: Supply wagon picked**, but "awkwardly long". A compact wagon (`FA239.WG`; the round-248 wagon is `WGold`): the crate area is
  136 px (`WGA249`, `wlay249`), and the whole wagon is about 190 px with the tailboard, from cx-94 to cx+94, plus a short tongue toward
  the recipe; it sits higher (base ly+9) with a front rail (a wagon bed), wheels of r 7. Up to 6 crates stand in one row; more load in two
  staggered rows (`wsize249`, `wpos249`: the back row first, raised 7 px, then the front row, whose crates build from a dashed outline
  with a pop). `draw246` hooks: `by` (base), `dx`/`dy` (station), `size`, `lay`, `exists`, `back`, `front`. Known: the "N to X" line
  overlaps the wagon's deck (it's drawn over it).

# Skill-up gains: the round-by-round record

Moved out of docs/plan.md (1.4.0 order, item 2) on 2026-11-16. The current state, rules and the page's workings are in
docs/skillup.md; read this file only for an old round's detail. New rounds are appended at the end.

2. Skill-up gains, Phase 2 (Phase 1 pick: Ring + road). Right after crafting: they share the Ring.
   **Goal (the user, 2026-11-14): clear progression AND a frame that's easy to make unique, in fun ways, per
   profession.** Two steps, like crafting: (a) lock the general skill-up design (as the craft Ring was locked);
   (b) then a per-profession pass, rounds of unique designs for every profession (gatherers and secondary skills
   too). Round 5 restated: A and B most on theme; C (Building up) "kind of cool, an alchemy bottle or liquid magma"
   but seems less customizable as a general frame.
   Phase 2 round 1 (2026-11-14, `docs/mockups/skillup-p2.html`, built on skillup-r3's engine; what the crafting picks
   taught: a tool acting on the ring, punchy steps, the work's own place): **A. Ring + road** (the Phase 1 lock),
   **B. Around the craft ring** (no banner: a skill ring unspools around the craft ring at the cast bar, or around the
   gathered node beside you; number and road beside it), **C. Comet + impact** (A's banner, each point flies from the
   work to the ring head; 70 ms freeze, jolt, overshoot; the XP quest comet's language), **D. Stepping stones** (no ring:
   a row of stones to the next unlock, the tool hops one per skill-up and lights it; the last hop lands on the unlock).
   Round 1 → "these options aren't very differing" (A-C all a ring in a banner); D (stepping stones) not liked. The
   user asked: skill-ups inside the craft rings (one draggable module) or a separate draggable module (two)? Leaning
   two ("we aren't restricted by the design of the crafting rings"). My view: two (gatherers have no craft ring, so
   skill-ups need their own home anyway; one place for every skill-up; a Create All batch keeps the ring busy).
   **Decided: two modules** (skill-ups are their own draggable module; an optional spark from the craft ring can link
   them). Round 2 (same page, the round-1 options kept in the code but off the panel), each a different way to show
   progress: A. Ring + road (the lock), **B. Odometer** (a big rolling counter, each digit snaps up with a tick and
   overshoot; a thin material line under it to the next unlock), **C. It comes to you** (no bar: the next unlock waits as
   far away as the points left and hops closer each skill-up, then snaps into your skill ring), **D. The tool charges**
   (the tool icon fills with color bottom-up as the gauge; full, it swings once onto the unlock icon).
   Round 2 → "not fully feeling the new options" (not tested option by option; it was built before the budget rule was
   applied). Round 3 (2026-11-14, same page, keys 1-4; round 2's code kept, off the panel), pitched first, each carried
   by something no other option uses: A. Ring + road (the lock), **B. Piece by piece** (the next unlock's icon, faint
   from the start in 16 pieces; each skill-up slams a piece in from below, the piece being earned fills from its
   bottom; the last closes the seams, flash, the name lands), **C. The stamp** (no gauge: each skill-up stamps a round
   seal with the new number, panel jolt, dust ring, thud; stamps pile askew; the unlock stamps a bigger gold seal with
   its icon, double thud), **D. The bell** (only the profession's icon in a round frame; each skill-up strikes it like
   a bell: swings, light rings ripple, a chime whose note climbs as the unlock nears (8 notes, a run a step each); the
   unlock = the top note as a chord, the unlock rises out of it). Dropped at the pitch: the material piling up as real
   icons (too close to the Create All pile).
   Round 3 → **A still the favourite**, **D (the bell) liked**; B "a little too playful" (dropped); C "cool but not
   quite the theme of this addon" (dropped).
   The user then asked for new iterations in the A + D direction (resonance: sound and light) and for words on the
   theme (now in docs/style-guide.md, "The theme in one line"). Round 4 (same page, keys 1-4; rounds 2-3 kept in the
   code, off the panel), pitched first: A. Ring + road (the lock), **B. Singing ring** (A, but the ring is the bell:
   on each strike the arc shimmers, a point of light runs from the seam to the head, light rings go out, a chime
   climbs with the fill; closing = the chord + a wide gold ripple), **C. Ripple reach** (D's bell with the road as
   faint circles around it, the next unlock nearest; each strike's ripple reaches further, leaving a soft light pool;
   touching the next circle lights it, the icon pops, the chord), **D. Tightening string** (no ring: a string from
   your skill to the next unlock, slack while far; each skill-up plucks it, it vibrates, tightens and sounds higher;
   at the unlock it snaps taut with a flash). Shared: the 8-note scale (`SCALE8`, `noteDeg`: higher as the unlock
   nears, a run a step each), the bell and pluck sounds.
   **After the lock (the user, 2026-11-14): a per-profession pass for skill-ups**, like crafting's Phase 2 for all
   ten: the locked skill-up design gets its own look per profession (material, tool, sound, finale; crafters and
   gatherers incl. Skinning, Fishing, First Aid, Cooking), not just the five sample professions on the page.
   Round 4 → "uniquely cool but don't give off a progression feel like A does"; B "just A with some more sound
   effects, not bad but not what I was expecting on a new iteration". Learned: a skill-up design must read as
   progression first (an amount building toward a visible goal, the road ahead); sound and light are add-ons.
   The per-profession pass is run like crafting: first the general skill-up design (as the Ring was), then
   rounds of unique designs per profession.
   Round 5 (same page, keys 1-4; rounds 2-4 kept in the code, off the panel), pitched first, progression first:
   A. Ring + road (the lock), **B. The whole journey** (the career 1-300 on one line in its four ranks, zoomed on your
   stretch: the lit trail in the material, unlocks ahead as icons, the tool at the head; an unlock zooms out to the
   whole career for ~1.5 s, then back), **C. Building up** (a column of the material, one block per point, the coming
   unlocks as ledges on its side; each skill-up drops a block with weight (thud, puff, settle); the view climbs; the
   ledge lights at the unlock), **D. The horizon** (a road into the distance, one mark per skill point flowing toward
   you; the next unlock stands on it and grows as it nears, the later ones further back; at the unlock it arrives,
   pops and steps aside).
   Round 5 → "pretty cool options"; **A and B fit the theme** better than D (dropped). **C is a per-profession
   idea**: "an alchemy bottle filling up, or a pile of molten metal". The user wants **customizability, or designs
   unique per profession** (structure question for the next step: a general look + per-profession forms, and what
   the player can choose).
   Round 6 (same page, key 1; A and B plain on keys 2-3; rounds 2-5 kept in the code): **A vs B, dressed**, to
   judge which frame customizes best before the lock. A (Ring + road) on top and B (The whole journey) below on one
   clock, both dressed per profession through three hooks every frame calls (`DRESS[prof].head` at the head,
   `.icon` on each unlock icon, `.unlock` at the unlock): Alchemy (the liquid bubbles at the head, a drop splashes in
   per skill-up, reached unlocks bubble, the unlock boils over), Blacksmithing (white-hot head dripping molten metal,
   reached unlocks glow with heat, a spark fountain + clang), Herbalism (a bud rides the head, reached unlocks bloom
   with petals, a petal burst). Tailoring and Mining undressed.
   Round 6 → **A still looks the cleanest**; B "takes up a lot of space for something I'd prefer to be a quick
   progress update". Seeing both dressed together was "a little overwhelming": **the same look in two places feels
   off** (the echo). That applies to A too: it shares the craft ring's form (a material arc with the tool at the head),
   and the skill-up comes right after the craft. New rule: skill-ups get their own form, compact (a quick progress
   update), sharing the colors and materials, not the ring and the tool. The user asked for new designs for this.
   Round 7 (same page, keys 1-4; rounds 2-6 kept in the code), pitched first: compact quick updates, **no ring and
   no tool** (no echo of the craft ring), each with an obvious per-profession slot: A. Ring + road (reference),
   **B. Pips to the unlock** (a slim strip: profession icon, name + skill, a row of up to 12 pips counting down to the
   next unlock's icon; a long stretch makes each pip a few points, filling partway; the pip is the profession's shape:
   drops, sparks, leaves, stitches, ore chips; the unlock sweeps light along them), **C. The unlock fills up** (the
   next unlock's icon in a game frame fills from the bottom with the material: bubbling liquid, molten metal with a
   glowing top, a climbing vine, rows of thread, ore; a splash per skill-up; full = the icon lights), **D. Countdown**
   (a big number of points left beside the unlock's icon; the digit changes per profession: Alchemy melts and drips,
   Blacksmithing lands white-hot and cools to gold, Herbalism sprouts with two leaves, others roll; at zero the
   unlock lights).
   Round 7 → **A dropped for skill-ups** (the echo: "the Blacksmithing skill-up and the animation are basically the
   same thing"); **D dropped**; **B and C are the direction** but "not 100% happy": B, "I don't like seeing a bunch
   of the same icon over and over in a row"; C, "a cool idea but not quite implemented well".
   Round 8 (same page, keys 1-3; rounds 2-7 kept in the code), pitched first: A. The unlock fills up (round 7 C, the
   reference), **B. One notched line** (B without repeated icons: one slim line of the material to the next unlock's
   icon, notches one per point (or per few, up to 15); the notch the material reaches does the profession's thing: a
   drip, sparks, a bud opening, a stitch knot, an ore chip; the unlock flashes the line), **C. The icon colors in** (C
   cleaner: nothing covers the icon; it starts grey and colors in from the bottom; a thin edge in the profession's
   style marks the level: wavy liquid with bubbles, a white-hot edge with a heat tint, vine tips, a stitched seam, a
   jagged ore seam; full = all color, pop).
   Round 8 → **C "a big step backwards"** (dropped). What the user liked in A (round 7's fill): **a container filling
   up with the materials inside**; they want *different ideas of that kind*, "not the same thing done a slightly
   different way". **B (One notched line) is moving forward**: "I like that direction, looks like we could
   personalize it". B becomes the reference for round 9.
   Round 9 (same page, keys 1-4; rounds 2-8 kept in the code), pitched first; "the wall" the user disliked = a
   literal blocky square frame (a shaped vessel is fine): A. One notched line (round 8 B, the reference),
   **B. Poured in** (the profession's vessel beside your skill: flask, crucible, pot, cup, bin; each skill-up delivers
   a portion from above: a drop, a molten stream from a ladle, a seed (the plant grows taller), a thread strand, an
   ore chunk; it lands with the tool's sound and the level rises; the next unlock waits at the brim), **C. Lifted up**
   (no container: the material builds up under the next unlock's icon and lifts it to a thin goal line: a liquid
   column, stacked ingots cooling below a hot top, a stalk with leaves, thread winding up, a pillar of ore chunks; a
   bounce per skill-up; touching the line lights it), **D. The line is the container** (the notched line becomes a
   long, low container in the profession's look: a glass tube, a mould channel with a hot front, a planter trough
   with sprouts, a seam being sewn, ore on a cart track; each skill-up surges the front forward; notches on the rim).
   Round 9 → (the user, stopping for the night 2026-11-14) **A "pretty simple and gets the point across"**; **B "I
   like how each one is unique and can be built on"**; C: "really like the Herbalism animation" (the stalk lifting the
   icon), not the rest; D: likes Herbalism's (the planter trough with sprouts), "the others aren't bad but I'm not
   fully feeling this one". Overall: **"the one" not found yet**, not all in on any option; **the presentation needs
   work**: space is used poorly (a lot of empty space), it could show more info or more design; "I don't want to
   over-design". Liked so far: A's simplicity, B's per-profession uniqueness, Herbalism's growing plant (in C and D).
   Next session: tighten the layout first (use the space: a compact module that carries more info or design), then
   one bold round built from those likes; pitch it first.
   Round 10 (same page, keys 1-2; rounds 2-9 kept in the code, off the panel), pitched first. **The tighter layout**
   (both options): one slim module (~282x66, no dead band): line 1 the name, the skill rolling, then "/ 150 Journeyman"
   small (the rank cap and rank); the next unlock with its icon and "N to go" in gold (crafters: "Expert rank at 150");
   gatherers add "then" and the two unlocks after it as small icons with levels. **A. The notched vessel** (round 9 B +
   A): the profession's vessel at the left, as tall as the module, with A's notches up its side (up to 10, the top one
   gold = the brim = the unlock); each skill-up pours a portion in and the notch it reaches lights and does the
   profession's thing. **B. It grows along the line** (A + the Herbalism plant): A's line is alive and grows toward the
   unlock's icon at its end, a step per skill-up: a vine with leaves and a bud (Herbalism), a blade white-hot at the tip
   cooling to steel (Blacksmithing), a crystal growing facet by facet (Alchemy), a seam stitching itself (Tailoring), a
   vein of ore with glints (Mining); faint notches under it count the points.
   The user expected four options (rounds have four; "fewer, bolder rounds" means fewer rounds, not fewer options), so
   round 10 got two more (keys 3-4, all four now 300 wide): **C. The module fills** (the whole panel is the container:
   the material rises behind the text, dim, with a surface line; notches on the right edge; full = the panel flashes and
   the corner icon pops) and **D. From one to the other** (an hourglass: the top bulb is the points still to go, the
   bottom the points done; each skill-up runs a portion through the neck in the profession's material).
   Round 10 → **B "It grows along the line" picked** ("pretty good"); the user wants add-ons/variations of B before
   locking it and moving on to the per-profession pass.
   Round 11 (same page, keys 1-4; rounds 2-10 kept in the code), pitched first, add-ons to B, each on a different
   part: A. B as it is (reference), **B. The tip does something** (a flourish at the tip per skill-up: a leaf unfurls,
   a white-hot flash, a facet glint, the seam pulls taut with a knot, a crack with an ore glint), **C. The unlocks on
   the line** (no "then" text: the next three unlocks sit on the line at their levels, the next one bigger; at an
   unlock the view slides on and what grew slides off left; crafters see only the rank cap), **D. The growth turns
   into the unlock** (quiet skill-ups; at the unlock the growth runs into the icon from the left, then dresses it:
   the vine winds round and flowers, white-hot cooling to gold, crystal shards burst, a stitched frame, a stone shell
   cracks open).
   Round 11 → **LOCKED (2026-11-15): the general skill-up design is "It grows along the line"** in the tighter
   layout (round 10 B = round 11 A). The user likes **B (a flourish at the tip per skill-up)** and **C (the unlocks on
   the line, the view slides on)** as **ideas to draw on per profession**, not locked into the general design. D (the
   growth turns into the unlock) not picked. Next: the per-profession pass (all twelve: Alchemy, Blacksmithing,
   Enchanting, Engineering, Leatherworking, Tailoring, Cooking, First Aid, Fishing, Herbalism, Mining, Skinning).
   **Per-profession pass, round 12: the gatherers** (same page, keys 1-4; the option names change with the profession;
   `VAR[prof][A-D]` hooks into `growModule(top, mode, V)`: `grow`, `road`, `tip`, `mark`, `unlockX`). Order: gatherers,
   then crafters, then the secondary skills. Skinning (sample unlocks: beast levels) and Fishing (sample unlocks:
   waters) added; Mining got its later ores and a `past` color list. Pitched first; the user swapped Skinning C (lacing:
   **no zig-zag designs**, memory no-zigzag). Herbalism: A Vine, B Roots and shoots, C Buds on the line (open into the
   herb), D A leaf per point (tip flourish, a flower every fifth point). Mining: A Ore vein, B The tunnel (dig face,
   ore pockets ahead), C The crack (jumps forward, ore glint), D Changing ore (the line's ore color by level).
   Skinning: A The cut (knife glint), B Peeled strip (curl rides the tip), C Scraped clean (fur to smooth leather),
   D Tracks (claw marks to the beasts on the line). Fishing: A The cast (bobber, ripple), B The stream (the fish jumps),
   C Ripples (lit water), D The reel (the fish is pulled in to the reel).
   **Round 12 feedback (2026-11-15):** Fishing: likes D The reel and A The cast; combine them (the cast with the reel at
   the line's start, so the line doesn't come from nowhere), then add-ons to that. Skinning: happy with A The cut;
   add-ons next. Herbalism: A Vine the favorite, may stay; B-D read as variations of A, wants clearly different ideas.
   Mining: none clicked; all new. Round 13 pitched in chat first.
   **Round 13: the gatherers again** (same page, keys 1-4; `VAR13`, `r13`; `growModule` gained `V.over` (drawn outside
   the clip) and `V.unlockY`). Fishing (rod and reel + add-ons): A Rod and reel (the reel at the line's start pays out
   line with clicks, the bobber hops on), B + Taut line (snaps tight with a twang, sags again), C + A bite (the bobber
   dips under with a splash), D + The catch (at the unlock the reel spins in and the fish leaps into its place).
   Skinning (the cut + add-ons): A as it is, B + It opens (the edges part in straight lines behind the glint), C + One
   stroke per skill-up (a whoosh and the new piece flashes), D + Clean finish (the glint flicks off, a strip drops, the
   beast's icon bounces in). Herbalism: A Vine, B Seed to bloom (one plant rides the tip: seed, sprout, bud, blooms at
   the unlock), C Sap rising (a jointed reed fills with glowing sap, a light pulse per skill-up), D Herbalist's sketch
   (ink draws the herb on a journal strip). Mining: A Breaks away (rock chips off to show the glowing seam), B Molten
   vein (white-hot tip cooling behind, embers), C Geode (quartz crystals grow in, a gleam sweeps them), D Lantern in the
   dark (the glow lights the vein, ore glints twinkle ahead).
   **Round 13 feedback (2026-11-15):** the add-ons barely changed the animation (the user: "not providing enough of a
   difference from the base"; aim for the crafting page's range, memory bold-addons). Fishing: B + C merged into the new
   A (rod and reel + taut line + a bite); wants add-ons that differ more. Herbalism: stays A Vine (Sap rising looks nice
   but doesn't feel like herbalism); add-ons to the vine next. Skinning: C (one stroke per skill-up) is good, the rest
   too weak; D looked like nothing changed. Mining: A Breaks away is a cool idea but not there yet; Molten vein reads as
   Blacksmithing. Round 14 pitched in chat first.
   **Round 14** (`VAR14`, `r14`; `growModule` gained `V.iconK`, `fishCast` an `o.dx`). The user asked for more Mining
   bases before add-ons. Fishing (on rod, reel, taut line, a bite): A the new base, B + The fight (bobber dragged with a
   wake, a fin, the reel buzzes), C + The school (fish shadows gather, one per skill-up; at the unlock they scatter and a
   big one bites), D + Landed (the fish hauled out, swings over, flops onto the module, flips into the unlock icon).
   Skinning (on the cut + a stroke): A the new base, B + The flap (the hide flips back piece by piece with a slap), C +
   The haul (leather pieces fly onto a pile at the end, the pile slides into the icon), D + New pelt (the hide rolls up
   and off, the next beast's pelt rolls out). Herbalism (on the vine): A Vine, B + In bloom (a flower per skill-up, the
   whole vine blossoms at the unlock, petals blow into the icon), C + Picking (a sprig flies into the Herbalism icon,
   which bounces, "+1"), D + Rain (a shower from a small cloud, the leaves shake, the vine surges). Mining bases: A
   Breaks away (reworked: bigger chunks, dust), B Sorting the rubble (stone tumbles off, the ore stays lined up), C
   Shockwave (the band jolts, a wave runs ahead, ore jumps, the unlock icon rattles), D Ore cart (rails laid behind a
   cart filling with ore; it dumps into the icon).
   Round 14 picks paused (2026-11-15): the user wants to reconsider the frame first. "I liked the old bars because it
   was nice and clean and a nice quick popup... they should be a nice pass-by": a cleaner, simpler look that still
   holds the animations. **Finales are per profession**, like the crafting ones (not one general finale); they come in
   the profession rounds (round 14's unlock add-ons are finales already).
   **Round 15** (`LAYOUT15`, `cleanModule`, `r15`; the growth is each profession's round 14 A): A The 1.3 banner back (no
   panel, soft shade, glowing title, bar + next unlock's icon, "6 to Wild Steelbloom" under it), B Just a line (no panel,
   small name/level and "N to X" over a thin line), C One slim row (26 px, like the Picked-up rows: icon, name, bar,
   unlock icon; fading row + gold hairline), D The edge is the bar (a small panel whose bottom gold hairline is the
   progress line; the unlock icon on its corner).
   **Round 15 → B "Just a line" picked** (2026-11-15), but it must read on every ground: some text was hard to read on
   bright ground, and Fishing's animation was hard to see there. **Round 16** (`VIS16`, `r16`, `visBack`; `text()` takes a
   global `OUTLINE`, the growth and particles a drop-shadow `HALO` filter; the page opens on Bright): A Outlined (thick dark
   text outline, a thin dark edge on the line, growth, particles and icon; no backing), B Soft shade (the 1.3 banner's
   soft dark shade, no edges), C Fading strip (a dark strip fading out at both ends), D Outline + light shade.
   Round 16 feedback: **no outlines** (A and D out); the soft shade made it look too big; the fading strip "isn't bad";
   the others read fine, so Fishing's own animation should read better. **Round 17** (`VIS17`, `r17`, `hStrip`; global
   `FISHR` redraws Fishing: a deep-blue water band, a thicker cream line, a bigger bobber with a gold tip, a dark disc
   behind the reel): A Fading strip (as round 16 C), B Slim, soft strip (hugs the text and line, soft on all edges), C Two
   strips (one behind the text row, a thin band behind the line, the ground between), D Strip + gold hairline (the style
   guide's hairline along its bottom, fading with it).
   Round 17 feedback: **no background on the header text**; the animations go **in a bar like the 1.3 skill-ups** ("the
   clear show that a skill bar was increasing"); redesign professions that don't fit; **parts may reach outside the bar**,
   like the tools and parts attached to the craft rings. **Round 18** (`FIT18`, `barModule`, `r18`; the 1.3 bar: centered
   header with the game's text shadow, a dark track with a thin gold border, notches, the next unlock's icon at its end,
   "N to X" under it; Fishing's water now fills only up to the bobber): A Inside the bar (clipped), B Breaking out (a 6 px
   bar, the growth full size over it), C On the bar (a plain fill in the profession's color; the growth rides the top
   edge), D Lively front (a plain fill; its last few points are the growth itself). Seen while checking: Mining's rock
   band and Skinning's hide span the whole bar, so their progress shows only as the seam or the cut (rework candidates).
   **Round 18 → the header and the bar are SET** (2026-11-15; the user: "the design of the header and the bar themselves
   I like"); the four fits were meant per profession, not one for all: **Herbalism breaks out** (round 18 B, the 6 px
   bar), **Mining inside**, **Skinning inside** (the user wrote "Leatherworking"), **Fishing: the whole bar is water, the
   bobber sits on top, the bar's top is the water's surface** (no border there; maybe a light line toward the top that
   doesn't fight the waves). **Round 19** (`FIT19`, `SURF19`, `fishBar`, `r19`; FAM A-D differ only for Fishing): Fishing
   surfaces A a light line under the crests, B the waves are the edge (bigger waves, foam glints), C a faint gold border
   the waves wash over, D a bright surface over the filled water only. The bobber floats at the fill's front, its line
   runs up-left to an off-frame rod, it dips with a splash each skill-up.
   **Round 19 → Fishing D** (the bright surface over the filled water), **keeping the reel, rod and line animations** from
   round 14 A ("I really liked those"). **Round 20** (`r20`, A-D the same): the reel sits at the bar's left end (attached,
   like the craft rings' tools), pays out line with clicks; each skill-up the line snaps taut with a twang and shivers,
   then sags back toward the water; the bobber floats at the fill's front and dips with a splash.
   **Fishing LOCKED** (2026-11-15, round 20): the water bar, D surface, the reel and line. Next: new Mining options and
   one more pass for Herbalism and Skinning in the set bar (pitched first).
   **Round 21** (`VAR21`, `r21`; `barModule(top, mode, V)`; pitched first, the user swapped Skinning's "Peel back"):
   Mining (inside): A Breaks away (in the bar), B Ore stacks up (a chunk drops in from above per skill-up, thunk, dust),
   C The mine shaft (a dark tunnel, beams, warm light; a new beam drops in at the front), D Nuggets fly (a nugget arcs
   from the front onto a pile by the next unlock's icon). Herbalism (breaks out): A Vine, B Tall grass (blades out of the
   top, a clump springs up), C A row of flowers (one opens on top per skill-up and stays), D Roots and shoots (the bar is
   soil; shoots out of the top, roots out of the bottom). Skinning (inside): A The cut + a stroke, B Pegged out (pegs
   punch in at the front, the hide pulls taut), C Laid down (a cut piece flips down into the bar with a slap, fur and
   pale sides alternating), D Tanned (pale pink hide cures to tan under a bright sweep).
   Round 21 feedback: Mining: the tunnel combined with the mine cart. Herbalism: likes B Tall grass and D Roots and
   shoots, wants a mix of both (in place of the flowers). Skinning: Laid down is cool but reads as Leatherworking; stay on
   A The cut + a stroke and show add-ons. **Round 22** (`VAR22`, `r22`, `tunnelBase`, `mcart`): Mining A The cart at the
   front (rolls on each skill-up, heap grows, dumps into the icon at the unlock), B The ore train (a new cart rolls in from
   the mine mouth and couples on), C The shuttle (one cart runs out to the dig face, tips onto the ore heap, rolls back),
   D Loading the cart (the cart waits outside the mouth; a chunk rolls back into it each skill-up; at the unlock it rolls
   the length and dumps). Herbalism A Vine, B Tall grass, C Meadow over roots (B + D), D Roots and shoots (roots now a
   darker brown). Skinning A the base, B + Fur flies (tufts burst up and drift down; a big burst at the unlock), C + The
   hide parts (the cut springs open, pale edges lift out of the bar, settles a little open), D + Swoosh (a bright crescent
   trail bigger than the bar per slash; an X of two slashes at the unlock).
   Round 22 feedback: **one profession at a time from now on** (several at once is too time consuming): Herbalism first,
   torn between Vine and Tall grass, wants two more options to help pick. **Round 23** (`VAR23`, `r23`, `sprig`): A Vine,
   B Tall grass, C Vine through the meadow (both together, the vine in front of the grass), D Picked herbs (herb sprigs
   of three kinds stand side by side out of the bar; a fresh one pops up at the front each skill-up).
   Round 23 feedback: C (the mix) was not liked; new C and D wanted (Picked herbs out too). **Round 24** (`VAR23.Herbalism.C/D`
   replaced; `frond`, `broadLeaf`): A Vine, B Tall grass, C Unfurling ferns (a fiddlehead coil pushes up at the front each
   skill-up and unrolls into a frond, leaflets opening), D Broad leaves (big overlapping leaves; a folded one rises and opens
   wide at the front each skill-up).
   Round 24 feedback: C and D were "completely similar to previous": every Herbalism option so far was some kind of
   sprout growing at each tick. **Round 25** (`VAR23.Herbalism.C/D` replaced; `butterfly`): A Vine, B Tall grass, C Gathered
   in (nothing grows: a picked herb is tossed in from above, tumbles and lands flat in the bar with a thump; the bar fills
   like a bundle), D The butterfly (the bar is a pale meadow and color is the progress: a butterfly flutters in, lands at
   the front, the meadow there turns vivid with blossoms in a puff of pollen, then it flies off).
   **Round 25 → Herbalism base: A Vine** (breaking out of the slim bar); explore add-ons. **Round 26** (`VAR26`, `r26`):
   A Vine, B + The gust (wind streaks race along, the whole vine leans and springs back, leaves tear loose; at the unlock
   a big gust swirls leaves into the icon), C + Sunbeam (a shaft of light falls on the tip, the bud lights, golden motes;
   at the unlock the light sweeps the whole vine), D + The butterfly (flutters in, settles on the bud, lifts off; at the
   unlock it flies to the herb's icon and lands on it).
   Round 26 feedback: no butterfly, no sunbeam; add-ons should be about **herbs being picked, not cultivated**; mid-round:
   "it may be a new design instead of an add-on". **Round 27** (`VAR26.Herbalism.B/C/D` replaced; `satchel` kept unused): A
   Vine, B The harvest row (new design: herbs stand along the whole bar; each skill-up the one at the front is plucked and
   flies up, a cut stem left; the picked part glows green), C Tied in bundles (new design: a handful drops in at the front
   and a twine wraps it; tied bundles side by side), D Plucked (the vine kept; each skill-up the herb at its tip snaps off
   in a leaf spray and the vine whips back; at the unlock the whole vine is pulled up into the icon). The gust is out.
   Round 27 feedback: none of the picking designs liked; back to add-ons to the Vine. **Round 28** (`VAR28`, `r28`): A Vine,
   B + The gust (back from round 26, not rejected), C + Tracking the herb (Find Herbs: a yellow tracking dot on the next
   herb's icon brightens as you close in; each skill-up two radar rings ping out of it; at the unlock a big ping, found),
   D + Dew run (a dew drop slides the whole vine to the tip and drips off with a plink; at the unlock a run of drops
   splashes into the icon).
   Round 28 pick: **Herbalism LOCKED as A, the Vine on its own** (breaking out of the slim bar; no add-on). The gust,
   tracking the herb and the dew run are out. Next for Herbalism: its finale when the bar fills (pitched first).
   **Round 29** (`VAR29`, `r29`; finales for the locked Vine; `V.finAt` delays the payoff so the finale plays first,
   `V.iconPulse` swells the icon): A The pick (the tip bud swells into the herb, tugs, snaps off, arcs into the icon; the
   vine whips back), B Sickle sweep (a gold slash runs the bar, leaves shear off and scatter, cut stem left), C Leaf wave
   (light runs root to tip, each leaf flicks up and sends a green spark into the icon, rising notes), D Pulled in (the
   whole vine slides into the icon, faster and faster, the icon bulging; the empty bar flashes).
   Round 29 pick: **Herbalism finale B, Sickle sweep. Herbalism DONE** (the Vine + Sickle sweep). Next: Skinning, on
   top of round 22 B + Fur flies (the user liked it; wants more add-ons over it, pitched first).
   **Round 30** (`VAR30`, `r30`; Skinning, the cut + a stroke + Fur flies, add-ons on top, each with its finale):
   A Fur flies (round 22 B as it is), B + Fur settles (the tufts land on the bar's top edge and stay, a fringe along the
   cut; finale: shaken off in one cloud into the icon), C + Snap the pelt (a ripple runs the bar and cracks at the end
   with a thwap; finale: a big snap flings fur into the icon), D + Pelt pile (a pelt pops from the cut onto a stack
   beside the icon; finale: the stack slides into the icon). Paw prints were pitched for D; the user swapped it out.
   Round 30 feedback: B-D not liked; **A Fur flies kept for sure**; three more, then probably move on. **Round 31**
   (`VAR31`, `r31`; `V.shake` jolts the whole module): A Fur flies, B + Leather pops (a small leather item square rises
   from the cut with "+1" and a loot tick; finale: a run of leather leaps into the icon), C + Heavy cuts (each cut
   jolts the module down and back with a deep thunk, a dust ring, a flash where the blade went in; finale: three heavy
   chops along the bar), D + Streak (skill-ups in a row: x2, x3... at the cut, warmer and bigger, the new cut glowing,
   a climbing note; finale: the streak flies into the icon).
   Round 31 pick: **Skinning LOCKED as A, the cut + a stroke + Fur flies** (no other add-on). **Round 32** (`VAR32`,
   `r32`; finales): A Fur vortex (fur lifts off the cut and spins into the icon as a swarm, rising whoosh), B Big reveal
   (the next beasts' icon looms big and faint over the module, then drops into its slot with a thump and a fur ring),
   C Beast roars (the icon shakes and growls, three sound-wave arcs roll back along the bar, the bar rattles, fur blown
   left), D Freeze-frame (a last burst of fur, an impact frame: the bar flashes white and everything stops a beat, then
   the fur zips into the icon).
   Round 32 feedback: not liked, all similar (hide and fur effects; Fur flies already throws fur every skill-up).
   **Round 33** (`VAR33`, `r33`; no fur; `V.after` draws over the icon): A Trap snaps (two straight jaws swing up from
   the bar's end and clap shut on the icon, metal clack + jolt, then open), B Claw rake (three glowing gold claw marks
   rake across the whole module in one swipe), C Target lock (a reticle slides from the bar's start, closes on the icon,
   locks gold with a click), D Rank refill (the notches light one by one in ticks, the bar drains in a blink and refills
   in gold, a rising note).
   Round 33 feedback: mix C Target lock with D Rank refill, but instead of the refill **the hide gets chopped up** (at
   the notches). **Round 34** (`VAR34`, `r34`, `retic`, `reticRun`, `chopPieces`, `chopGrow`): A Lock, then chop (the
   reticle locks on the icon, then the hide is chopped notch by notch, pieces drop away, the bar left empty), B Chop,
   then lock (pieces hop up and fly into the icon, the reticle locks as the last goes in), C The reticle chops (it steps
   notch to notch, locking on each, and the hide is chopped there; ends locked on the icon), D Chop + gold refill
   (pieces drop away, the empty bar refills gold while the reticle locks).
   Round 34 feedback: likes all; the fast chops (A, B, D) are the most satisfying. Recommended A's order (lock first:
   aim, then strike) with B's pieces flying into the icon (they land on the reward instead of falling away; D's refill
   is one beat too many). **Round 35** (`VAR35`, `fin35(cfg)`, `CFG35`): A Lock, then chop into it (the reticle locks,
   fast chops left to right, each piece flies into the locked icon, the reticle pulses and a note climbs per landing,
   the icon lights on the last), B Faster chops (.045 s apart, shorter hop), C Chopped from the icon end (right to
   left, the nearest piece first), D The reticle tightens (a step tighter and a little turn per landing, fully closed at
   the last).
   Round 35 pick: D The reticle tightens, but turning 90 degrees in all, and the leather pieces just fall away like round
   34 (not sucked into the reticle). **Round 36** (`VAR36`, `fin36(turn)`): the reticle locks, fast chops (.07 s) drop
   the pieces away, a note climbs per chop, the reticle tightens a step per chop; A turns 90 degrees in steps, B turns
   smoothly, C snaps the whole 90 on the last chop, D steps with an overshoot (ratchet).
   Round 36 pick: **A, turning 90 degrees in steps. Skinning DONE**: the cut + a stroke + Fur flies; finale: the reticle
   slides in and locks on the icon, fast chops (.07 s) drop the hide away notch by notch with a climbing note, the reticle
   tightens and turns a step per chop (90 degrees in all), the icon lights after the last. Next: Mining.
   Then Fishing, as it was close to done (the user: bold, unique add-ons, then its finale). **Round 37** (`VAR37`,
   `r37`, `fishShape`; `window.FSW(x)` lifts the water surface): A as locked, B + Fish jumps (a fish leaps out ahead of
   the bobber, arcs over with a glint, dives back in with a plop), C + Reeled in (the bobber is yanked under, a fish is
   hauled out and zips back along the line into the reel, a wet slap and clicks), D + The swell (a hump of water with
   foam rolls from the reel along the filled water, lifting the line and heaving the bobber).
   Round 37 pick: **D The swell**, but not its sound; also improve the waves texture inside the water (the drifting
   white dashes don't look good). **Round 38** (`VAR38`, `swell38`, `TEX38`, `SND38`; `window.FTEX` replaces the dashes):
   texture + sound paired only to keep four options (pick each separately): A Caustics (two thin weaving lines of light)
   + a soft low rush, B Depth bands (two darker wavy layers sliding at different speeds) + a deep wave lap, C Sun glitter
   (glints near the surface twinkling) + three watery bloops, D Sheen + bubbles (a soft light band drifting, bubbles
   rising) + no extra sound.
   Round 38 picks: **texture B Depth bands, swell sound A (the soft low rush)**. The sound disliked in round 37 was the
   skill-up sound itself (the bobber dip: the triangle twang + the cartoon bloop 520 -> 180 Hz). **Round 39** (`VAR39`,
   `FSND39`; `window.FSND(i)` replaces it): A the current sound, B a natural plop (low water burst + spray hiss),
   C a plucked line (one string note rising per skill-up + light splash), D splash only (no tones).
   Round 39 pick: **B the natural plop**; improve its splash. **Round 40** (`VAR40`, `SPL40`, `plop40`): the plop, then
   A spray hiss (as round 39), B droplets falling back (short spray, then tiny falling plinks), C bubbles (soft splash,
   then little rising blips), D a fuller sploosh (three noise layers, bright to dark, no notes).
   Round 40 feedback: rework Fishing's whole sound as four options, **gentle, not grating** (the bobber already sounded
   annoying; no hiss after the splash). Found: the "bobber" sound was mostly Fishing's built-in strike sound (`PROF.Fishing.snd`:
   a 380 -> 140 Hz drop + a 1800 Hz noise) plus the reel's 4.2 kHz clicks, under everything. **Round 41** (`VAR41`,
   `SET41`; `window.FREEL` replaces the reel clicks, `S.p.snd` muted during the draw): A Calm water (a warm low
   two-note bloop with no pitch drop + low water; faint low rush; three soft wooden ticks), B Chimes (a soft bell note per
   skill-up up a five-note scale; a quiet warm chord for the swell; no reel), C Deep pond (a deep soft thoomp; low
   rumble; slow low ratchet), D Minimal (one soft rising note per skill-up, nothing else).
   Round 41 feedback: A-C a little too monotone/boring. **Round 42** (`VAR42`, `SET42`, `mallet`, `drop`, `kal`): livelier
   but gentle, varying per skill-up: A Water marimba (a three-note rising mallet motif per skill-up, climbing; the swell a
   soft run up and down; the reel a tiny rising zip), B Water drops (two plinking drops per skill-up on varied scale notes;
   the swell a light shower of tiny drops; no reel), C Thumb piano (a two-note fifth with a soft echo, moving up per
   skill-up; the swell a low pluck + two high notes; two soft reel taps), D Minimal (round 41 D, for comparison).
   Round 42 feedback: much better; torn between B and C. Recommended B (fits the water on screen, stays light when
   skill-ups stack, never repeats the same way) with C's warmer swell; **D replaced by that hybrid** (B's drops + C's swell,
   no reel). The option buttons now show letters only ("A. Water marimba", no "1.").
   Round 42 pick: **B Water drops** (two plinking drops per skill-up on varied scale notes, climbing; the swell a light
   shower of tiny drops; no reel sound; Fishing's built-in strike sound muted). **Round 43** (`VAR43`, `FIN43`, finales):
   A The big catch (the reel spins in a run of drops, the next waters' fish is hauled out at the bobber and lands in its
   slot), B Tidal wave (one big swell with a foaming curl rolls the whole bar and crashes over the icon in spray),
   C Ripples (three wide rings spread from the bobber across the module, a light shower of drops lands with tiny rings),
   D Leaping school (five fish leap along the bar one after another, the last into the icon).
   Round 43 feedback: mix B Tidal wave with D Leaping school. **Round 44** (`VAR44`, `FIN44`, `wave44`, `leap44`): A The
   school rides the wave (fish leap out of the crest as it passes; the last leaps from the crash into the icon), B School,
   then the wave (the leaps first, then the swell crashes over the icon), C The wave, then the school (the swell crashes
   first, the school leaps in its wake, the last into the icon), D A big fish surfs it (one big fish rides the crest, small
   fish hop alongside, the crash flings it into the icon).
   Round 44 pick: **D A big fish surfs it. Fishing DONE**: the water bar (bright surface over the fill, Depth bands
   texture), the reel and line, the bobber; + the swell each skill-up; sounds: Water drops (round 42 B: two plinking
   drops per skill-up on varied scale notes, a light shower for the swell, no reel; Fishing's built-in strike sound
   gone); finale: one big swell with a big fish riding its crest, small fish hopping alongside, the crash flings it into
   the icon. Next (the user): revisit Herbalism's sound the same way, then Mining. New rule for sound over long sessions
   (Skinning/Mining in quick succession, craft batches of 100, Disenchanting): see docs/style-guide.md "Long sessions".
   The user then made **sound fatigue an addon-wide rule** (every repeated sound: XP, skill-ups, loot, craft beats;
   CLAUDE.md + style guide "Sound"). **Round 45** (`SET45`, `r45`; Herbalism's sound; the old one was a chirpy upward
   glide + a 4 kHz hiss, and the sickle a noise swish): four gentle sets, notes varied from a scale, the first two
   skill-ups full then a step quieter each (floor .5), each with the Sickle sweep finale sound: A Stem pluck (a soft
   plucked note; the sweep a pluck run up + a low pluck), B Garden bells (a small soft bell; a bell run down + a two-bell
   chord), C Wooden marimba (two mallet notes; a mallet run up + a low note), D Thumb piano (a note + a soft fifth; a
   run up + a chord with an echo).
   Round 45 pick: **D Thumb piano. Herbalism DONE** (the Vine; Sickle sweep finale; sounds: a warm thumb-piano note + a
   soft fifth per skill-up on varied scale notes, stepping down after two in a row; the sweep a quick run up landing on a
   chord with an echo). Skinning's sounds were made before the fatigue rule (the slash whoosh, the chop clicks); revisit them
   too.
   **Round 46** (`SET46`, `r46`; Skinning's sound: all hiss before, the strike 2.6/5.2 kHz noise, the stroke 2.2 kHz, the
   finale clicks 2-3.8 kHz; now only soft low noise bands, 300-700 Hz): four sets for the cut, the reticle lock, each
   chop and after the last, notes varied, stepping down after two in a row: A Soft leather (a muted low slap + a low wooden
   tick; woody chop taps climbing), B Blade ring (a soft swish + the knife's gentle bell ring; bell chop taps, a two-bell
   chord), C Hunter's drum (a low frame-drum tap; the chops roll on the drum, one deep hit to end), D Low marimba (one low
   mallet note + soft swish; mallet chops climbing, a low chord).
   Round 46 feedback: **the user prefers Skinning's original sounds** (the swishy strike, the stroke whoosh, the finale
   chop clicks and the reticle tones). Kept as they were; for the long-session rule only the step-down applies (full for
   the first two in a row, then quieter, floor .5) plus a slight pitch variation, not a new timbre. **Skinning DONE.**
   Next: Mining.
   Mining pitches: the user asked for designs that use the bar as a frame, not confined to it (like the reel, bobber,
   vine). **Round 47** (`MIN47`, `r47`, `rockFill`, `pickaxe`, `crystal`; sounds by the fatigue rule, Mining's built-in
   strike muted): A Ore ridge (a chunk breaks off at the front, nuggets burst up and land on the bar's top edge, a lumpy
   ridge; finale: a glint runs along it, the nuggets roll into the icon), B Cart on the rails (the bar is the track; a cart
   on top at the front rolls on each skill-up, a nugget drops in; finale: it rolls to the end and tips into the icon),
   C The pick at the start (a pickaxe hangs at the bar's start like the reel; each swing sends a gold crack along the
   rock; finale: a big swing splits the slab, ore flies into the icon), D Crystals (ore crystals jut up and down out of
   the bar; a new cluster with a glint each skill-up; finale: they ring and flash in turn, shatter into sparkles into the
   icon).
   Round 47 feedback: new ideas; A, C, D too similar (ridge, crack, crystals); options must all differ; **destructive,
   like mining is**. **Round 48** (`MIN48`, `r48`, `dug48` for the mined channel, `rockAhead` for the rock still ahead):
   A Blast (a charge at the front: flash, muffled thump, chunks blown out, dust, the bar kicks, the blasted part glows hot;
   finale: a chain of blasts, the last bursts the icon open), B Collapse (the rock ahead is a wall of blocks; its blocks
   drop out of the bar into a rubble pile below with soft thuds; finale: a rumble, a dust cloud rolls along and clears to
   show the icon), C Shatter (a web of straight cracks and shards flying; faint crack marks stay; finale: the whole bar
   shatters, shards funnel into the icon), D Crushed to gravel (gravel pours from the bar's bottom into a mound beneath;
   finale: the mound slides along and pours into the icon).
   Round 48 pick: **Mining base LOCKED: A Blast** (the mined part a dug-out channel, the rock ahead solid; each skill-up a
   charge at the front: flash, muffled thump, chunks and dust, the bar kicks, the blasted part glows hot; its finale for now
   a chain of blasts ending in the icon). Next: add-ons on top of it, then its finale and sound, like the others.
   **Round 49** (`ADD49`, `blast49`, `vein49`; add-ons on the Blast): A Blast as is, B + Ore pops (each blast throws a
   shining nugget up; it lands ahead with a clink, bounces, rolls along the bar top into the icon, which bumps), C + The
   fuse (before each blast a lit spark races along the bar from its start to the front, fizzing softly, a faint burnt line),
   D + Veins revealed (each blast uncovers a gold vein streak in the dug channel, flashing with a soft glint; they stay and
   glint now and then).
   Round 49 pick: **A, the Blast with no add-on**. Next: Mining's finale (the chain of blasts is the placeholder), then its
   sound.
   **Round 50** (`FIN50`, `fin50`; Mining finales on the Blast): A Chain reaction (the placeholder: blasts run down the
   bar, the last bursts the icon open), B The big one (a charge glows at the end, one huge blast: a soft white flash, a
   shockwave ring, a hard jolt, debris rains down, the icon revealed in the dust), C Breakthrough (the last blast breaks
   through at the end and warm gold rays pour out around the icon, a warm rising chord), D Ore shower (a fountain of ore
   nuggets rains onto the bar with clinks and bounces, then rolls into the icon).
   Round 50 feedback: mix A Chain reaction with D Ore shower. **Round 51** (`MIX51`, `fin51`, `ore51`, `boom51`): A Every
   blast throws ore (the chain runs; each blast throws nuggets that land ahead, bounce, roll into the icon), B Chain, then
   the shower (the chain first, then one bigger blast throws the whole fountain), C The shower sets off the chain (one blast
   at the start throws the ore; each nugget landing further along sets off a blast there; the last lands on the icon),
   D The chain juggles the ore (a bundle of nuggets is thrown on from blast to blast down the bar, the last into the icon).
   Round 51 pick: **A Every blast throws ore** (Mining's finale). Next: Mining's sound (now: a muffled low thump + a soft
   pebble patter per blast, nugget clinks; Mining's built-in hissy strike muted).
   **Round 52** (`SET52`, `mine52`; Mining sound; the base's own sounds muted under each set): A As now (a muffled thump +
   pebble patter; small high clinks), B Deep drum (a deep soft drum hit, pitch varying, low gravel rustle; the chain rolls
   on the drum climbing; wooden-tap landings), C Rumble + glint (a short low rumble with a soft bell glint, varying; the
   chain rumbles with glints climbing; tiny bell taps), D Stone knock (a soft-edged hammer-on-stone knock + two pebbles;
   the chain knocks up a scale with a low chord at the icon; small knocks). All step down after two in a row.
   Round 52 pick: **A As now. Mining DONE**: the Blast (the mined part a dug channel, the rock ahead solid; each skill-up a
   charge at the front: flash, muffled thump, chunks and dust, the bar kicks, the blasted part glows hot), no add-on;
   finale: every blast throws ore (the chain runs down the bar, each blast throws nuggets that land, bounce and roll into the
   icon, the last bursts it open); sound: the muffled thump + pebble patter, high clinks for nuggets, stepping down after two
   in a row. **All four gatherers DONE** (Herbalism, Fishing, Skinning, Mining). Next: the crafters, one at a time, then
   Cooking and First Aid.
   **Crafters, Blacksmithing first.** Round 53 (2026-11-15, base design, pitched first; no ring, no hammer, no tool at the
   tip, no white-hot cooling, since the craft ring has those; sound a gentle placeholder): **A. Plate by plate** (overlapping
   steel plates with gold rivets; each skill-up drops a plate in from above, a thud, the bar kicks, dust, the rivet glints),
   **B. Folded steel** (layered steel; each skill-up a copy comes down from above while the bar squeezes into its lower half,
   they press together, a sheen runs along the denser pattern), **C. Drawn out** (the steel stretches past its new mark,
   thinning, a bright streak, then springs back and settles), **D. Polished edge** (dark rough iron fill; a bright grinding
   point runs along the newest part leaving mirror steel, sparks fly off backwards out of the bar, a glint at the end).
   Round 53 → **none; four new ideas** (the user). Round 54 (pitched first): **A. The blade** (the bar a sword blade
   tapering to a point; each skill-up lengthens it, a glint slides to the point and sparkles), **B. Ringing steel** (a steel
   rod that hums and shivers along its length on each skill-up, a soft tuning-fork tone), **C. Iron filings** (packed
   filings; each skill-up a stream swirls in from around the bar as if by a magnet, packs on with a shiver, a few stand up at
   the front), **D. Gold inlay** (dark steel; each skill-up engraves a gold line further, curls above and below, a bright
   point leads, the new end gleams).
   Round 54 → "I like the ringing steel animation"; the gold inlay "pretty cool, I like the coloring and the design but I
   want to see more options". Round 55: **B's ringing on D's dark steel + gold** (the whole bar, inlay included, shivers;
   a shine runs along the gold; the new end gleams; the tuning-fork tone), four inlay designs: **A. Curls** (round 54 D's),
   **B. Braid** (two gold lines weaving, beads at the crossings), **C. Runes** (short gold runs with marks between: a dot, a
   pair of strokes, a diamond), **D. Leaf scroll** (one flowing gold scroll, a small leaf at each crest and dip).
   Round 55 → keep A; the rest too close: the user named what they liked as hints for **new directions**, and gold isn't
   required. Round 56 (pitched; Twisted bar swapped out): **A. Ringing steel, curls** (round 55 A), **B. Rust flakes off**
   (a rust crust cracks on the newest part and flakes tumble below the bar, clean steel underneath), **C. Straightened**
   (ahead of the fill, raw bent stock sags below the bar; each skill-up snaps the next section straight with a jolt),
   **D. Raised ridge** (flat steel; the newest part's ridge swells up as if pushed from behind, a highlight runs the crest,
   a soft thud).
   Round 56 → "just a simple gray bar moving forward, nothing really blacksmithy". Lesson: avoiding the craft ring's
   hammer, heat and sparks stripped out the blacksmithing; no-echo forbids shared **shapes**, not materials, so heat,
   embers and the anvil come back in new forms (still no hammer). Round 57: **A. Ringing steel, curls** (kept), **B. Forge
   coals** (a glowing coal bed, flickering, embers drifting up; each skill-up a gust flares a wave down the bar and puffs
   embers at the new end), **C. On the anvil** (a dark anvil under the bar, horn to the left; each skill-up the bar jumps
   and drops onto it, the face flashes, scale flakes bounce off), **D. Forged chain** (an iron chain; a red-hot link drops
   onto the front, swings into place with a clink, darkens to iron).
   The page hit the browser pane's 512 KiB limit: rejected rounds 53-54 moved to `docs/mockups/skillup-p2-old-rounds.js`
   (not loaded). Keep the page under 512 KiB (move rejected rounds out as it grows).
   Round 57 → C "way too big"; Forge coals not liked. **Echo, clarified (the user): mainly don't replicate the hammer**;
   a magma-like liquid is fine (instead of white-hot metal); idea: Ironforge's forges fed with magma from the mountain.
   Round 58 (rounds 56-57 moved to the archive file): **A. Ringing steel, curls** (kept), **B. Anvil at the start** (a small
   black anvil just left of the bar; each skill-up its face flashes and throws a low arc of sparks along the bar onto the
   front, which flares and grows), **C. Magma channel** (magma flowing in the bar with dark crust drifting, the rounded front
   hottest; each skill-up a surge rolls down from the start and pushes the front on), **D. Ironforge falls** (a thin stream
   of magma falls from above onto the front; each skill-up it pours heavier, the front splashes, spits droplets and grows,
   then back to a trickle).
   Round 58 → "improve on B and D, see where we can go". Round 59: **A. Spark fuse** (the anvil flashes; a spark runs along
   the bar's top like a lit fuse, crackling, and bursts in a fan at the front), **B. Spark shower** (the anvil flings a spray
   that rains along the whole bar, each spark glinting where it lands, the last past the front), **C. Falls and mound** (the
   stream falls from a glowing opening above onto the front; each skill-up it pours heavier and piles a glowing mound, heat
   shimmers, the mound slumps forward into the bar), **D. Forge at the start** (both: magma falls onto the anvil at the start
   and overflows into the bar; each skill-up a heavier pour, sparks off the anvil, a surge rolls down and pushes the front).
   Round 59 → improve B and C. B's sound "too chimey for an anvil getting hit"; C's magma texture should be more bubbly,
   with a wavy top like Fishing's water. Round 60 (rounds 58-59 options moved to the archive file): **A. Shower, anvil
   tink** (59 B, a warm glow behind the anvil; sound: a short damped metal strike + soft thud), **B. Lingering sparks,
   clank** (the sparks stay as hot specks that twinkle and fade over 1.5 s; sound: a lower, fuller clank), **C. Falls,
   bubbling** (59 C in a new magma: a wavy glowing surface, bubbles rising, doming and popping; the pour mounds the surface,
   it slumps forward, a swell runs back), **D. Gloops** (the same magma; an opening above drips now and then; each skill-up
   a big glob drops and plops in: the surface dips and rebounds, splash, swell back, the front grows).
   Round 60 → **B nice: keep adding on to it** (Lingering sparks + clank). Magma "much better" but the bubbles are awkward
   and the texture still not liked; wants a better lava-fall feel, or a wave from the left that grows. **Two tracks at once
   → 8 options** (the page now has slots 1-8; keys 1-8). Round 61: sparks (add-ons on 60 B): **A. Lingering sparks** (as
   picked), **B. Chain flare** (once landed, a flare runs speck to speck to the front and bursts in a fan), **C. Ember pile**
   (the sparks roll to the front and gather into a glowing pile riding on it; each skill-up adds), **D. The anvil heats up**
   (the anvil's face glows hotter through a run, bigger showers; cools between runs). Magma (no bubbles; three textures):
   **E. Lava curtain** (a wide glowing sheet with streaks falls onto the front; crust plates over glowing cracks; mound,
   slump, swell), **F. Wave from the left** (no fall; flowing streak texture; each skill-up a wave rises at the start and
   rolls along growing, crashes at the front with spray), **G. Ironforge fall at the start** (the sheet falls into the start;
   the lava flows to the front; each skill-up the fall surges and a swell rides to the front), **H. Veined lava rock** (dark
   cooled rock with glowing veins; a heat pulse runs through them, the front cracks open further, chips fall).
   The pane loads the page as one snapshot (a data: URL), so a separate .js beside it doesn't load: all live code stays
   inline; unused rounds go to `skillup-p2-old-rounds.js`.
   Round 61 → **the anvil designs are nice** (to iterate on later: Lingering sparks + Chain flare / Ember pile / The anvil
   heats up). First **the magma's look itself, before its animations**: still not liked, and the bar showed behind the
   waves; it should be open at the top like Fishing's. Round 62 (barModule mode `M`: border on the sides and bottom only,
   the wavy surface is the bar's top edge, dark cooled lava ahead of the fill; a skill-up only eases the fill on): **A. Flow
   streaks** (round 61's texture, as the reference), **B. Depth bands** (soft heat layers, pale yellow under the surface to
   deep red at the bottom, edges swaying), **C. Marbled** (molten orange with long bright and dark swirls drifting), **D.
   Painted** (like the game's lava textures: flat warm orange, big soft yellow highlights and dark red shadows drifting).
   Round 62 → **Depth bands kept as A**; iterate. Round 63: **A. Depth bands**, **B. Glowing core** (bands inside out: a
   thin dark skin on top, the hottest pale layer mid-bar, cooling toward the bottom), **C. Crusted bands** (the bands under
   dark crust islands drifting on the surface, bright magma in the gaps), **D. Flowing bands** (each layer slides toward the
   front at its own speed, top fastest; a faint shine on each edge).
   Round 63 → "just variations of depth bands": the user wanted **three different designs** (not variations), one of them
   **bubbly: bubbles appear slowly on the top and pop**. Round 64 (63 moved to the archive): **A. Depth bands**, **B.
   Bubbling** (plain deep molten orange; now and then a glossy dome swells slowly on the surface for ~1.5 s, then pops: a
   flash and two droplets; a few at a time), **C. Convection cells** (bright rounded cells packed with dark cooler seams,
   drifting, each breathing), **D. Glossy molten** (smooth deep molten metal, a mirror highlight riding the wave crests, a
   slow sheen, a warm rim light below).
   Round 64 → **Bubbling liked**; wants bubbling designs that differ in **both the bubbles and the magma** (again, not
   slight variations). Round 65 (unused 62/64 looks archived): **A. Bubbling** (as picked), **B. Crust blisters** (dark crust
   with a web of glowing cracks; rarely a big crust blister swells 2-3 s, cracks glowing hotter, splits: flash, a gout of
   lava, a bright patch that crusts over), **C. Boiling patch** (deep red calm magma; one hot spot wanders the bar and boils
   there: many quick small bubbles, tiny glints, heat shimmer), **D. Thick gloops** (matte molten rock; slow bulbs rise and
   stretch tall on a neck, burst with a thick splat, rings of ripples run both ways along the surface).
   Round 65 → **mix C + D: C's bubbles (Boiling patch), D's pops (thick splat + ripples)**; D's rising bulb not liked
   (improve the rise); the magma: **Depth bands with more of a gradient** between the bands. Round 66 (all: gradient depth
   bands, the boiling hot spot wandering, small bubbles each popping D's way): **A. Boil, every pop a splat**, **B. + a big
   bubble: round** (every few seconds a glossy round bubble inflates smoothly, wobbles, bursts: bigger splat, strong
   ripples), **C. + a big heave** (the surface itself heaves into a smooth mound with a bright stretched skin, bursts), **D.
   Heave + heat plume** (C, and the bands bow upward over the hot spot).
   Round 66 → the user expected **just slower bubbles that pop and splat, concentrated at the head** (no wandering patch, no
   big bubble). And **mix the anvil with this magma**: each skill-up the anvil sparks and shoots magma into the bar, or a
   big wave rolls toward the left. Round 67 (all: the anvil at the start, gradient depth bands, slow bubbles only at the
   head popping with a splat + ripples; the anvil's clank): **A. The anvil throws magma** (sparks, a glob skims along the
   bar onto the head: big splat, ripples, the head moves on), **B. Big wave to the left** (the head heaves, a big wave rolls
   back to the anvil and crashes in sparks), **C. Throw, then the wave back** (A then B), **D. Sparks into the magma** (the
   Lingering sparks shower lands on the magma, each spark a tiny ring of ripples). Gotcha: anything arcing more than ~5 px
   above the bar passes behind the header text.
   Round 67 → **D LOCKED: Sparks into the magma** (the anvil's Lingering-sparks shower lands on the magma, tiny ripples;
   the clank). Next: the head's bubbles and splat should feel like **swamp bubble pops**. Round 68 (all: a thin glossy film
   dome swells slowly at the head, pops; a dimple and soft ripples; silent): **A. Film burst** (a thin bright ring flicks out
   flat, tiny droplets), **B. Gas puff** (a little puff of smoky swamp gas curls up and fades, no droplets), **C. Blub-blub
   cluster** (one pop then a few smaller ones beside it in quick succession), **D. Thick blorp** (the dome stretches up into
   a peak, bursts with one fat droplet that falls back with a plip; the surface dips then bounces up past level).
   → "a little more noticeable": domes ~1.5x bigger and more opaque, five slots a bit more often, deeper dimples, bigger
   ripples, rings and puffs.
   **Bubbles picked: A. Film burst + the thick splat of round 65 D** (the pop also throws a thick splat). Blacksmithing base
   so far: the anvil at the start; gradient depth-band magma in the open-top bar; swamp bubbles at the head (film burst +
   splat); skill-up = Sparks into the magma. Next: finale, then sound.
   Round 69 (finale, pitched first; "Reaching the next unlock"): **A. Eruption** (the head boils harder and heaves, then a
   fountain of magma arcs into the icon, which fills with glowing magma), **B. The anvil’s big shower** (three quick flashes
   + clanks, then one huge shower along the whole bar, ripples everywhere, the last sparks set the icon blazing), **C. The
   great wave** (the magma swells into one wave rolling from the anvil to the end, crashing over the icon in droplets), **D.
   Forged in the magma** (the icon hops into the head, the magma boils up around it, it rises out glowing and dripping).
   Round 69 → none; four new, one where **the magma drains**. Round 70: **A. The drain** (the level sinks and tilts, a glowing
   stream spills from the end into the icon and fills it; the channel lies empty a breath, then fresh magma rushes back from
   the anvil), **B. Crust and crack** (the bar crusts over dark, cracks open in a chain anvil to end with light bursting
   through, the crust shatters into chips, the last crack blazes the icon), **C. Fire across the surface** (a spark from the
   anvil lights the surface; flames race along the bar, the icon bursts into flame), **D. Overflow** (the level swells past
   the bar’s top, spills over the lower edge in stretching drips, the overflow fills the icon, the level settles).
   Round 70 → **C kept as A**; three more ideas, one where the molten **hardens into ingots that get shipped off** (crate or
   cart). Round 71: **A. Fire across the surface**, **B. Ingots, shipped** (seams split the bar into seven moulds, each cools
   to an iron ingot; a crate drops in by the icon; the ingots hop in one by one from the end with clinks; the crate slides
   off, the icon lights; fresh magma flows back from the anvil), **C. Ember swarm** (embers lift off the whole surface and
   stream as a swirling ribbon into the icon), **D. The blade rises** (a sword rises out of the magma along the bar,
   dripping, a shine runs its edge, it slides into the icon). Old gatherer rounds 20, 28, 33, 40 (nothing else used them)
   moved to the archive file for page space.
   Round 71 → **Ember swarm kept as A**; explore add-ons on it; the ingots and the blade cleaned up and more satisfying,
   each with the ember swarm. Round 72 (six options, keys 1-6): **A. Ember swarm**, **B. + vortex** (the ribbon whirls round
   the icon tightening, then implodes into it with a flash), **C. + heat wake** (the surface flares and ripples where embers
   lift; a glowing wake follows the ribbon down the bar), **D. + ash rain** (once lit, the icon breathes the embers back out
   as glowing ash that drifts down onto the magma with tiny ripples), **E. Ingots, shipped (clean)** (a bright cut sweeps the
   bar into seven moulds; a cooling wave turns them to iron, their heat lifting as the swarm; a crate drops in; the ingots
   fly in one by one in an even rhythm and stack 4 + 3, the crate dipping each time; a lid thunks on; the crate glides off),
   **F. The blade rises (clean)** (a whole sword, fuller, gold crossguard, wrapped grip, pommel, rises smoothly, magma
   sheeting off in drips, its heat lifting as the swarm; cools to steel; a glint runs to the tip; it turns and flies into
   the icon).
   Round 72 → iterate **the ingots and the blade, without the ember swarm**. Round 73: **A. Ingots into a crate** (72 E, no
   swarm), **B. Ingots onto a cart** (same clean start; a mine cart rolls in on a short track under the bar’s end; the row of
   ingots slides along the bar step by step like a conveyor, the end one tipping into the cart each time with a clink; the
   cart rolls away), **C. The blade rises (lying)** (72 F, no swarm), **D. The blade rises upright** (point first out of the
   head, standing upright, drips; a glint climbs to the point; it tips over toward the icon and flies in).
   Round 73 → **the blade scrapped**; more ingot variations that differ in what the ingots do (not the same animation
   slightly changed). Round 74 (all start the same: the cut into seven moulds, the cooling wave): **A. Into a crate**, **B.
   Dominoes** (they stand up on end one by one, then topple in a chain of clacks toward the end, the last onto the icon),
   **C. Fuse into one** (they slide together into a tight row, clacking, and fuse with a flash into one big gleaming ingot
   that hops into the icon), **D. Pyramid on the icon** (they hop one by one onto the top of the icon and stack 4-2-1, a
   shine runs over it, the icon lights under it like a trophy).
   Round 74 → the user expected **different animations of the ingots being CREATED**. Round 75 (the ending shared: round 72
   E’s crate): **A. Cut and cool** (the bright cut, the cooling wave), **B. Beading up** (the magma pulls apart, necks thin
   and snap between seven wobbling blobs, each firms into an ingot, then cools), **C. Crust and shrink** (the bar skins over
   dark, seams crack open glowing, each piece shrinks as it cools into an ingot, the gap glow fading), **D. Rise from the
   depths** (glowing ingots rise one by one out of the magma in no set order, dripping, while its level sinks to empty).
   The unlock “ding” (the shared payoff’s bright four-note arpeggio) was annoying: for Blacksmithing it is now a soft low
   thump with a warm low hum (other professions unchanged; the real sound comes in the sound step). The banner’s own two-note
   chime (reveal) was the ding the user meant: silenced for Blacksmithing (confirmed gone).
   Round 75 → **mix B and D**, plus an option where the ingots stay molten beads and then, fast, left to right, each is hit
   and shaped into an ingot (a satisfying “blink”). Round 76 (formation 0-1.65 s, then the crate ending shifted .5 s): **A.
   Rising beads** (beads rise out of the sinking magma in no set order, then firm into ingots and cool), **B. Beads, then the
   blink** (the bar beads up, the beads sit glowing, then rat-a-tat left to right each is struck in a white flash and snaps
   into an ingot: squash + spring back, three sparks, a soft tap a step higher; then a cooling wave), **C. Rising beads, then
   the blink**, **D. Blink to iron** (each blink shapes and cools at once: a line of finished iron races left to right).
   Round 76 → **A (rising beads) + D (blink to iron)**, more **sparky and chunky**, the sound “too chime-y”. Round 77 (the
   combination; harder strikes: deeper squash, the bar jolts each strike; no chimes, the crate landings in the same family):
   **A. Iron clank** (short damped low metal clank + soft crunch; a fan of spark streaks), **B. Heavy thud** (deep thud with
   gravel; a big high shower of sparks, harder kick), **C. Crunch + scale** (gritty crunch + low knock; sparks and dark scale
   flakes tumbling off), **D. Clank + ember spray** (the clank; embers spray sideways toward the next bead like a fuse).
   Round 77 → **C LOCKED: the finale animation** = rising beads, struck to iron left to right with the crunch + scale, then
   the crate (round 72 E’s ending). The ding was back: it was the old “dress” bell (metal 660 Hz) in the payoff; now off for
   Blacksmithing, the crate lid a low thud. Finale sound, round 78 (a low pound with reverb, as asked; a WebAudio convolver
   with a generated impulse): **A. Low pound, big hall** (one deep pound, a long dark reverb), **B. Double pound** (the second
   lower and heavier, medium reverb), **C. Pound + forge breath** (the pound + a soft rush of air into the reverb), **D. Short
   room pound** (tight, a short stone-room reverb).
   Round 78 → “a little too low and they all sound the same”; wants **a chunky boom**, and one option **like a boss dying in
   Final Fantasy**. Round 79 (a saturated bus + reverb; louder mids): **A. Punchy boom** (a kick that punches and drops, a
   saturated mid thump, a short crunch, medium reverb), **B. Blast** (noise sweeping bright to dark like a blast wave, deep
   rumble, long tail), **C. Swell + slam** (a half-second rising rush into a big chunky boom), **D. Boss falls** (a low
   crumbling rumble flickering in fast pulses and sinking for ~1 s, then one last deep boom into a long reverb).
   Round 79 → **Punchy boom liked**; make it more blacksmithy: a little “ting” first like a firing pin, or the sound of the
   last metal being forged; and for fun one option where **a peon runs off with the crate**. Round 80: **A. Punchy boom**,
   **B. Pin ting + boom** (a tiny bright dry ting, a beat later the boom), **C. Last strike + boom** (a short damped anvil
   clang with grit, not a bell, then the boom), **D. Peon runs off with it** (B’s sound; as the lid drops a little peon,
   simple shapes, runs in, hoists the crate overhead and runs off kicking up dust; the icon lights). Dead helpers moved to
   the archive file.
   Round 80 → **D LOCKED: the peon runs off with the crate.** Its sounds, round 81 (footsteps, the grab, the dash and the
   closing hit; the footsteps stop just before the hit so the run builds into it): **A. Ting + boom** (as 80 D), **B. Scamper +
   pop** (wooden pitter-patter, a little hup, an airy whoosh, a rounder pop + tiny ting), **C. Rattling crate** (the ingots
   clatter in the crate with each step; a wooden thunk on the grab; ting + boom), **D. Drum steps into the boom** (the steps
   are little drum hits climbing and quickening, landing on the punchy boom).
   Round 81 → “all sound the same and don’t match the peon running away; they all sound like a boom”. Round 82 (no boom at
   all; the running is the sound, louder; the icon lighting small): **A. Scurry and whoosh** (quick light footsteps, the
   ingots jingling in the crate, a grunt on the lift, a whoosh as it zips off; a soft airy puff at the light), **B. Heavy
   plod** (slow deep footfalls, a strained grunt and small grunts, creaking wood; a distant thunk as the crate is set down),
   **C. Running tune** (the steps a low plucked bass line climbing a scale; a warm two-note low pluck at the light), **D.
   Distant crash** (footsteps fading off, a beat of quiet, then an off-screen clattering crash and a yelp as it trips).
   Round 82 → **A without the whoosh. BLACKSMITHING DONE (2026-11-16).** Finale sound: Scurry (quick light footsteps, the
   ingots jingling in the crate, a grunt on the lift, no whoosh; a soft airy puff when the icon lights). Full Blacksmithing
   skill-up: the anvil + gradient depth-band magma in the open-top bar; swamp bubbles at the head (film burst + thick
   splat); skill-up = Sparks into the magma (clank); finale = rising beads struck to iron (crunch + scale) → crate → the
   peon runs off with it; no chimes or dings anywhere. Next: the other crafters, in a new session.
   **Leatherworking (crafter 2), 2026-11-16.** No punch (the craft ring's Burnished tool) and no knife cut through a hide
   (Skinning's skill-up). Round 83 (base design, pitched first, placeholder sounds; the page's comment lines moved to
   skillup-p2-old-rounds.js to get under 512 KiB; `PROF.Leatherworking` added, span 75-150 to Expert): **A. Unrolling hide**
   (a rolled hide at the front pokes out over the bar, rolls forward and lays the hide down, the new piece slaps flat: flash,
   hop, dust; the roll thins toward the rank), **B. Dye soaks in** (pale raw leather; a dye drop falls on the front, a dark
   wet edge with ragged fingers seeps ahead, glossy, dries to brown with a slow sheen), **C. Tooled pattern** (a plain strap;
   the newest part is pressed: the strap dips, a dark pressure mark, the impression darker for a moment, a dull thump; first
   drawn as a wavy scroll with leaves, which the user called "the exact zigzag I ruled out", so now two straight border
   lines and a row of round ring stamps), **D. Stretched and tacked** (the hide ahead hangs loose and wrinkled off the bar;
   each skill-up pulls it taut with a creak, a brass tack pair drops in with a glint, the loose part shivers).
   Round 83 → "not liking most outside of A; don't play it safe with inside-the-bar animations, explore" (the user pushes
   for options beyond simple in-bar fills: the bar is a frame, things can stand on it, fly at it, wrap it). Round 84 (A
   kept; built straight away, not pitched): **B. Boot stomp** (a leather boot stands on the bar at the front, taps its
   toe; each skill-up it hops, tilts back and stomps: the bar dips, dust both sides, a fresh bootprint in the leather;
   the fill is a trail of prints), **C. Hide throw** (each skill-up a whole hide sails in from above, turning, and lands
   draped over the front with a slap, flaps hanging over both edges and bouncing; the fill is a row of overlapping hides
   in varied tans), **D. Grip wrap** (the fill is wrapped like a sword grip, slanted turns all one way; the loose tail
   hangs from the front and sways; each skill-up it swings round the bar, behind and back over, and cinches a new turn
   with a creak). Page at ~520 KB: move round 83 B-D (`LW83.B-D`) to the archive before the next round.
   Round 84 → "Grip wrap isn't a bad idea; more different options". Round 85 (A = Grip wrap; round 83 B-D and 84 B-C moved
   to the archive file; the grip wrap's sound started at a negative time, which threw and froze the page with sound on:
   sound offsets must be >= 0): **B. Sling** (a leather sling whirls left of the bar; each skill-up it whips faster and
   lets go, a stone arcs along the bar and thuds into the front, dust), **C. Fringe** (leather fringe hangs under the
   filled part swaying; new strands drop in at the front and a swing runs back along the whole fringe), **D. Belt and
   buckle** (the fill is a belt, a brass buckle at the front; each skill-up the belt is yanked through: the buckle jolts on,
   the strap thins for a moment, a tension streak runs back, the prong drops with a click and a glint).
   Round 85 → "still not fully liking these; four new ones". Round 86 (built straight away; simple shapes + the item
   icon, each beyond the bar; round 85 B-D archived; key 5 = Grip wrap kept): **A. Trampoline** (the bar is a hide
   stretched in its frame, tanned behind the fill, raw ahead; a leather boot icon bounces at the front; each skill-up it
   flies high and lands hard on the new front, the hide sags deep out of the frame's bottom and springs it back up),
   **B. Lasso** (a rawhide loop circles above the front; each skill-up it's thrown ahead, drops round the bar, the rope
   snaps taut and drags it back to the front, pulling the fill on), **C. Scraps fly in** (leather scraps in varied tans
   fly in from all around and slap onto the front at once, the front bulges past the bar's edges, dust), **D. Sail** (a
   small leather sail on the front flutters; each skill-up a gust streaks in from the left, the sail bellies out, the
   mast leans, the front lurches on).
   Round 86 → "I kind of like the scraps fly in, but none of the options give a leatherworking feel"; asked to see again
   "one Skinning option that was like pulling leather to the next point". Round 87: **A. Scraps fly in** (86 C) and three
   old Skinning options on the Leatherworking bar, as they were: **B. Peeled strip** (early rounds: the fur side rolls
   away behind the front showing the pale inner side, the strip rolls up into a curl riding the front), **C. Pegged out**
   (round 21 B: pegs at the top and bottom edges; each skill-up a new pair punches in at the front and the hide pulls taut
   to them), **D. Laid down** (round 21 C, "reads as Leatherworking": a cut piece flips down into the bar with a slap,
   fur and pale sides alternating); key 5 = Grip wrap.
   Round 87 → "none of these"; the one meant was **Skinning round 30 C, Snap the pelt** (a hump runs along the whole bar
   and cracks at the end with a thwap). Round 88 (round 86 A/B/D archived): **A. Snap the pelt** on the tanned strip
   (the hump runs from the start and cracks at the front, flecks fly, the front jumps on), **B. Scraps fly in** (liked),
   **C. Scraps + snap** (the scraps slap on, then the snap runs down and settles them), **D. Pull to the point** (the
   front is drawn out past its point, thinner and paler, creak, springs back; the slack runs back down as a hump to the
   start); key 5 = Grip wrap.
   Round 88 → "four new ideas". Pitched eight first (rounds kept missing); the user picked **all eight**. Round 89 (keys
   1-8; rounds 86-88 code archived, Grip wrap and Scraps fly in off the buttons): **A. Through the rollers** (a thick
   raw hide ahead, taller than the bar; two rollers at the front draw it in, a flat strap comes out behind, flecks),
   **B. Wet-molded bosses** (cuir bouilli: a row of raised round bosses; each skill-up steam and the next boss pushes
   up, a finished one glints), **C. The hide spreads out** (the fill is a whole hide spreading above and below the bar
   with leg flaps; the newest part unfolds with a flop), **D. Studded strap** (a stud drops in at the front, set with a
   squash and a glint; bigger studs at notches), **E. Beaten hide** (a hide hangs over the front; a paddle beats it,
   dust clouds above and below, beaten part darker), **F. Patchwork from a pile** (a scrap heap left of the bar; a
   scrap hops off and drops into the gap at the front, straight seam glints), **G. Shaped on a form** (a limp wet end
   droops over the front; a block rises from under the bar and presses it level, steam, creak; the block drops, it
   holds), **H. Armor pieces** (each notch section is an armor piece with an item icon; the front section fills with
   scraps; full, it locks on with a thump and a pop).
   Round 89 → "none of these": the drawn shapes **look too crude**, it's the **wrong idea of leatherworking**, and **too
   busy**. The user again pointed to a Skinning option never found yet: "like a tarp thinly stretched and pulled to the
   next point". No round's text says that; best match: **Pegged out** (round 21 B), which at Skinning's scale (each
   skill-up ~1/5 of the bar) pulls the loose hide taut to the next pegs; at Leatherworking's scale (75 points, ~3 px a
   step) round 87 C couldn't read the same. Round 90 (round 89 archived): **A. Pegged out as it was, on Skinning's bar**
   (to confirm), **B. Pulled thin to the next peg** (pegs at the notches; from the last pegs to the front the leather is
   pulled out thin like a tarp, pale, see-through, pinched, tension lines; each skill-up pulls it further and it
   shivers; at the next notch pegs punch in and it settles into thick leather), **C. Tarp across the gap** (the next
   pegs already wait at the next notch; a thin tarp spans the whole gap and fills in thicker with each tug; at the notch
   new pegs pop in further on).
   Round 90 → **A, Pegged out: "that was the one"**; iterate and add on to it. Asked (pitched): peg scale → **a peg pair
   per notch** (round 90 B, the hide pulled thin like a tarp to the next pegs); add-ons → all four pitched. Round 91
   (keys 1-5; the single skill-up now starts at 124 so every moment reaches a notch): **A. Pegged out (the base)**,
   **B. + Mallet taps the pegs** (at the notch a small mallet taps the top peg, then the bottom one, a tok each, the hide
   jolts), **C. + Tension shiver** (when the pegs go in, the older pegs wobble one after another back to the start and a
   ripple of light runs back over the leather), **D. + Scraps trimmed off** (the loose excess at the front drops away as
   a few tumbling scraps), **E. + Stretched hide sheen** (a soft glint slides along only the stretch just finished).
   Round 91 → "I liked Pegged out when it stretched further; lock that in first" (before add-ons); the single-skill-up
   view of 91 A was "still not how I liked it". Round 92, which stretch: **A. the Skinning original** (reference),
   **B. Bigger steps** (Leatherworking's bar runs to the next recipe unlock, 5 points, `LWB92`, so each skill-up pegs
   ~1/5 of the bar, pegs per point exactly as on Skinning), **C. Pulled far, springs back** (rank-long bar, per-notch
   pegs; each skill-up yanks the thin hide ~30 px ahead, it springs back), **D. Tarp across the gap** (round 90 C).
   Round 92 → "definitely A; use B as the base and iterate on it, it's a more plain version". **LEATHERWORKING BASE
   LOCKED: Pegged out exactly as on Skinning, on a bar counted to the next recipe** (`LWB92`, 5 points here; a crafter's
   bar now runs to the next recipe unlock like a gatherer's to the next node/beasts). Round 93 (round 91 add-ons
   archived and rebuilt per skill-up): **A. the locked base**, **B. + Mallet taps the pegs**, **C. + Tension shiver**
   (each older peg pair flashes and wobbles in turn back to the start, a light ripple runs back), **D. + Scraps trimmed
   off**, **E. + Stretched hide sheen** (a glint along the stretch just pegged).
   Round 93 → likes **B (mallet) and D (scraps trimmed)**, but the mallet "doesn't look too good". Round 94 (rounds
   90/92 leftovers archived): four mallet treatments, each with the scraps: **A. Rawhide mallet** (a wrapped leather
   head on a tapered handle, swings from the wrist: wind-up, fast swing with a short motion trail, tok, a small ring,
   a rebound; top peg then bottom), **B. Silhouette mallet** (one clean dark shape with a warm rim light), **C. Strike
   only** (no mallet: a bright swing streak onto each peg, a white impact ring), **D. One big blow** (a bigger mallet,
   one heavier blow drives both pegs at once, the bar dips, a deeper tok).
   Round 94 feedback: the hammer must come **after** the hide lands ("doesn't make sense it's hammered if it's not
   there yet"). Fixed on all four: the hide pulls taut to the new front first (~.1-.35 s after the skill-up lands), the
   pegs appear only when the mallet hits (`window.PEGAT94` = .42 delays `VAR21.Skinning.B`'s new pegs and their tok;
   taps at .42 top / .6 bottom), the scraps trim after the taps (.72).
   Round 94 → **C. Strike only + scraps, LOCKED** (2026-11-16). Leatherworking skill-up = Pegged out on the recipe bar;
   each skill-up the hide pulls taut to the new front, then a bright swing streak + white impact ring sets each peg (top,
   then bottom, a tok each), then the loose excess drops away as scraps. Next: the finale (reaching the next recipe).
   Finale pitches (A Strike cascade, B Pegs pop + hide rolls up, C Pulled into the icon, D Folds into the item): the
   user chose A and B. Round 95 (keys 1-2, opens on "Reaching the next unlock"; both start .8 s after the bar fills,
   after the last strikes and scraps): **A. Strike cascade** (strike streaks re-set every peg pair start to end, a ring
   and a tok each climbing a soft scale, the last big streak lands on the recipe icon, which lights), **B. Pegs pop,
   hide rolls up** (the hide rolls up from the start, the pegs popping out just ahead of the roll, which grows; at the
   end the roll hops off into the recipe icon, which lights). Page note: archiving round 94 cut LW94's closing `};`,
   so the page didn't run until it was restored: check the closing line when cutting objects.
   Round 95 → "mix A and B". Round 96 (round 95 code archived): **A. Cascade, then roll** (the strike cascade re-sets every
   peg, a breath, then the hide rolls up popping the pegs ahead of the roll; the roll hops into the recipe icon just as
   one big streak lands on it), **B. One sweep** (the hide rolls up while a strike lands on each peg pair just ahead of
   the roll and knocks it out, toks climbing; the roll hops in as the big streak lands on the icon).
   Round 96 → **B. One sweep, LOCKED** (2026-11-16). Next: Leatherworking's sound.
   Round 97 (the look locked; four sound sets through the `window.SND97` hook: taut, strike (top/bottom), scraps, ftok
   (each finale peg), big (the streak on the icon), pay (the icon lights; replaces the default chime); notes from
   `pick45`/PENT42, step-down `fat45`): **A. Soft leather** (soft low rub; low wooden toks, bottom a step lower; two faint
   pats; climbing soft toks, a low thump, a warm two-note close), **B. Hide drum** (a brush on the skin; frame-drum taps
   with a skin slap; a ghost tap; a climbing drum roll, a deep tap, two low hits), **C. Wooden mallet + creak** (a gentle
   leather creak; soft mallet knocks; a faint rustle; climbing knocks, a low knock, a two-note mallet close), **D.
   Plucked lace** (a soft stretching breath; low plucks, bottom a fifth below; a soft pat; climbing plucks, a deep pluck,
   a low pluck + fifth).
   Round 97 → **C. Wooden mallet + creak. LEATHERWORKING DONE** (2026-11-17): Pegged out on the recipe bar, strike
   streaks set the pegs, scraps trimmed; finale One sweep; sound Wooden mallet + creak (`r97('C')`). Next: Alchemy.

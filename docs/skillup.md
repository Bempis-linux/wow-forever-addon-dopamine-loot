# Skill-ups: the workstream (1.4.0, item 2)

The current focus. Read this file (not plan.md) when working on skill-ups. Page: `docs/mockups/skillup-p2.html` (the
only page; its `<h1>` says the round). The full round-by-round record is `docs/skillup-rounds.md` (rounds 1-85 and on;
read only when you need an old round's detail). Rules that apply everywhere are in CLAUDE.md and memory.

## Where it stands
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
  - **Blacksmithing DONE (2026-11-16):**
    - The bar: open at the top like Fishing's (mode `M`): the magma's wavy glowing surface is the top edge, dark
      cooled lava ahead of the fill. Magma = **depth bands blended as a gradient** (`bandsGrad66`).
    - A small black **anvil** just left of the bar (rim light, warm glow behind).
    - Idle: slow **swamp bubbles at the head** only: a glossy film dome swells (~1.5 s) and pops as a **Film
      burst** (a flat bright ring) + a **thick splat** + a dimple and ripples. Silent.
    - Skill-up: **Sparks into the magma**: the anvil flings its Lingering-sparks shower along the bar; each spark
      lands with a tiny ring of ripples; the head moves on. Sound: the anvil **clank** (`anvClank60`).
    - Finale (reaching the next unlock): **molten beads rise** out of the sinking magma in no set order, then
      left to right each is **struck to iron** in one flash (squash, the bar jolts) with **crunch + scale**
      (gritty crunch + low knock; sparks and dark scale flakes); a **crate** drops in, the ingots fly in and
      stack 4 + 3, a lid thunks on; then **a peon runs in, hoists the crate and runs off with it**; the icon
      lights. The ding is gone (banner chime + old dress bell muted for Blacksmithing).
    - Finale sound: **Scurry** (round 82 A, no whoosh): quick light footsteps, the ingots jingling in the crate,
      a grunt on the lift, a soft airy puff when the icon lights. The user disliked every boom here (it drowned the
      peon) and every chime/ding.
  - **Leatherworking, in progress (2026-11-16): the base, round 85 waiting on the pick.** A Grip wrap (kept from round
    84 D: the fill wrapped like a sword grip, the loose tail swings round and cinches a new turn), B Sling (whirls left
    of the bar, a stone arcs to the front), C Fringe (strands hang under the fill, a swing runs back along them), D Belt
    and buckle (yanked through a brass buckle, tension streak, prong click). Rejected: round 83 B-D (Dye soaks in,
    Tooled pattern (its wavy scroll read as a zig-zag), Stretched and tacked), round 84 B-C (Boot stomp, Hide throw);
    A Unrolling hide (83 A) was liked, now parked. The user: **don't play it safe with in-bar fills; use the bar as a
    frame or a stage.** Code: `LW85`/`r85`/`near85`, `LW84` (A Unrolling hide, D Grip wrap), `LW83.A`, helpers
    `hide83` (leather strip), `hits83`/`last83` (this run's skill-ups), `LWS83` (the option's sound),
    `PROF.Leatherworking`. Sound offsets must be >= 0 (a negative start throws and freezes the page with sound on).
  - **Next: the other crafters** in a new session, one at a time: Leatherworking, Alchemy, Tailoring,
    Engineering, Enchanting; then Cooking, First Aid. Same steps per profession: base design (pitch first) →
    add-ons → finale → sound. Rules: **no echo** with the craft ring = mainly don't copy its **tool**
    (materials, heat, sparks are fine); a crafting batch can be 100 casts. Lessons from Blacksmithing: options
    must be **clearly different designs, not variations** of one; when the user names what they like it's a
    hint for new directions; keep the profession's identity (avoiding everything the ring uses made "a gray
    bar, nothing blacksmithy"); show **8 options** (keys 1-8) when iterating two things at once.
  - Unlocks per profession and the bar code are on the page. The full record is in docs/skillup-rounds.md.

## Crafting rings, as locked (don't echo them)

The skill-up bar plays while the craft ring is on screen, so it must not copy a ring's **tool** or signature shape
(materials, colors, heat, sparks are fine). The locked picks (crafting Phase 2 + Phase 3 Polish done 2026-11-14;
`docs/mockups/craft-compare.html`; every ring has 3 beats + a finale):
| Profession | Ring | Avoid in the skill-up |
|---|---|---|
| Blacksmithing | Hammer + heat: three hammer blows, spark fans along the curve, bellows flare + embers; CLANG = spark burst, shockwave, cooling wave with steam | the hammer |
| Leatherworking | Burnished: 3 punches knock leather crumbs off, a bright thread whips once round leaving a stitched line, then a warm gloss runs round (polished brown, thin bright edge) | the punch, the thread whip, the gloss sweep |
| Alchemy | Boil over + bubbles: bubbles livelier each beat, foam rises over the tube and spills; made = cork pops, steam | the tube boiling over, the cork |
| Tailoring | Plucked + runs down: a spool feeds thread, plucked on the beats, runs down to the bare core spinning faster, loose end whips | the spool, plucked thread |
| Engineering | Wrench, 3 turns: the ring is the wrench's ring end round a hex bolt, the handle swings, ratchet ticks; then boing + puff | the wrench, the ratchet, boing |
| Cooking | Toss the pan + burner + sizzle: a frying pan tossed three times, the food hops and flips, sizzle | the pan toss |
| Enchanting | Motes + moon sparkle: motes draw a triangle and a star, the moon-phase finale sparkle | motes drawing shapes, the moon |
| First Aid | Splint + heft + relief: splint sticks tied on with dust and a jolt, the knot a double tug with a glint, a warm glow and motes after | the splint, the knot |
| Smelting | Smooth turn: one long pour into a turning mould, pumps make the stream surge; glug + clatter + tink | the pour into a mould |
| Disenchanting | Burn away + embers + storm into implosion: violet fire eats the icon, ash, a storm implodes | burning away, implosion |
Skinning's skill-up (the cut + a stroke through a hide) is taken too: no knife cuts in Leatherworking.

## How the skill-up page works
- Options are the `FAM` slots `PA`-`PH` (keys 1-8; slots left unset hide), set by `Object.assign(FAM, {PA:
  rNN('A'), ...})`; the last assignment wins. Each `rNN(K)` returns `{name, desc, note, draw(top)}`, and draw
  routes the other professions to their done looks. The latest is `r83` (Leatherworking; other professions route to `r82('A')`). Comment-only lines were moved to the archive file (2026-11-16) to fit 512 KiB; page now ~511 KB.
- **Size limit:** the pane loads the page as one `data:` snapshot (a separate .js beside it does NOT load) and
  refuses pages over **512 KiB** (524,288 bytes). Check `wc -c`; move rejected rounds and dead helpers to
  `docs/mockups/skillup-p2-old-rounds.js` (not loaded) as you go. Watch for a stray `};` when cutting objects.
- Blacksmithing plumbing: `V69(F)` builds a finale V from `{finAt, lift, tip, fin, after}`; `mag62` draws the
  magma (`TEX62.G66` = gradient bands), `MAGLIFT(x)` lifts its surface, `FILL70` overrides where the fill ends;
  `INGOTS72` is the crate ending, `r77('C')` the locked formation (shifted by `SH76`), `r80('D')` the peon;
  sound hooks: `window.FINSND78` (the payoff sound), `PS81` (peon step/grab/dash), `LDSND72` (crate landings),
  `NOSWARM72` (no ember swarm).
- `barModule(top, mode, V)`: modes `A` inside the bar, `B` breaks out (6 px), `F` the Fishing water, `M` open-top (sides + bottom border; the growth draws the whole bar). Slots `PA`-`PH` (keys 1-8); unassigned slots hide.
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


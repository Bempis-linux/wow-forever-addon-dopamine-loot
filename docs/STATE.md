# Session state — Dopamine Loot

_Last checkpoint: 2026-11-09, after 1.2.1 (released and on CurseForge; the game stays on dev). **Mockup round 3**
of docs/mockups/gathering.html is up (the user took Claude's shortlist): bag B1 (Game art: the backpack icon in our
splitting ring, vs. the leather bag), B2 squash and stretch + settle wobble (vs. Straight), B4 drawstring whip + pop
ring, B5 sigh vs. big exhale, B6 herb bag no strain, B7 full moment at most every 4 s, B9 switch + Test bag; gathering
G2 game-style tally docked under the minimap or beside the bag, G4 merging "+N", G5 skill bar in the profession's
color with the unlock icon, G7 notes reset after 8 s idle, calm automatic after N gathers in 10 min (demo 12; default
in game open, 40?). Crafting unchanged. **The user picked Game art + Squash; the bag is built (Bag.lua, untested in
game):** switches "Bulging bag" / "Slots-left bubble" and "Test bag" on the first page; ring and drawstring are Line
widgets (2026-11-09 after testing: drawstring removed, the ring replaced by then (the edge and bubble "look like tests") bag-frame.html round 2 picks H1 + T1: the game's WhiteIconFrame quality border tinted amber/red, breathing, and the slots left as a corner number in NumberFontNormal; the user likes the animations); not shown at 5+ free; full moment from UI_ERROR_MESSAGE (verify `/dump LE_GAME_ERR_INV_FULL, ERR_INV_FULL`
and `/dump MainMenuBarBackpackButton.icon:GetAtlas(), MainMenuBarBackpackButton.icon:GetTexture()`). Known: the
bag pumps when the loot arrives, before a loot rain's gather reaches it (maybe hold it until the gather). Version
not bumped (bumped at release). **Gotcha (2026-11-09):** commit 055406a deleted all of DopamineLoot/Media by
accident (restored in 947a51e from v1.2.1); check `git status` for mass deletions before committing. The game was actually on the RELEASE copy (1.2.1), not dev;
switched to dev 2026-11-09 for the bag test (the stale parked 1.1.0 renamed to Interface\DopamineLoot.old-1.1.0 so
the script could park 1.2.1; delete it when the user agrees). Check `addon-mode.ps1 status` before each test. **The bag is
accepted in game** ("pretty good", 2026-11-09; the full moment from a real full bag and the rain timing not seen yet).
**Gathering built 2026-11-09, untested in game:** Gather.lua, Skill.lua, GatherPage.lua, and Mover.lua (the user:
make the tally draggable from the start, as a general system for other frames like the popups next; no hooks into
the game's Edit Mode, our own "Move frames" overlay instead). Calm after 40 gathers in 10 min (setting gatherCalm,
0 = never). Sounds from tools/gen_gather_sounds.sh (GatherNote00..10, GatherStack, SkillUp; not picked by ear yet).
Gathered items skip the rain; Uncommon+ finds still pop up. To verify in game: `/dump C_Item.GetItemInfoInstant(2447)`
(expect returns 6,7 = 7,9; 2770 -> 7,7; 2318 -> 7,6), LOOT_READY count per gather (/etrace), the burst at the cursor
(clicked node) vs. the interact key, the skill unlock levels (Classic's). User test 2026-11-09: "pretty good right off
the bat"; +N made bigger/outlined; tally visibility picked: linger 12 s + 2 s per gather in 10 min (max 90), hides
when combat starts, right-click dismisses (all come back on the next gather). Then the user wanted gathering personalized per profession: brainstorm picks
(2026-11-09) in docs/mockups/gather-themes.html: themed bursts (herb petals spiral + pollen, rare a bloom; mining three
strikes + chips + dust, rare gem star flare + prismatic glints; fishing ripples + droplets + the fish flips, rare a
leap; skinning knife glint + fur tufts + the hide flops, rare a shine sweep), the harvest window with sections per
profession, session pace ("17 in 1 min, ~1530/h"), vendor value, full-stack milestones (badge "x1" + shine + chime),
and the unlock reveal for skill-ups ("You can now gather Briarthorn!"; at a rank cap "maxed: train Expert"). Not
picked: themed skill bars, quiet routine skill-ups, rank-cap nudge as its own item. Waiting for the user's look.
**Built 2026-11-09 (all of it, the user: "Build all of it"), untested in game:** Gather.lua BURST/RARE per
profession (Petal.tga, Streak.tga from gen_textures.lua; star4 glints), the window's sections, pace, "worth" value,
full-stack badge + shine + glints; Skill.lua unlock reveal (Reached / MaxRank via GetProfessions; "maxed: train X");
sounds Strike00..02, Splash, Slash, Rare*, Unlock (tools/gen_gather_sounds.sh, not picked by ear). Test gathers count
in the window until the next real gather takes them out. **User test 2026-11-09:** mining and fishing (normal, rare,
sounds) are "100%", keep as is (don't touch); herbalism and skinning rares need work (the herb bloom shows as a flat
ring of small pink dots in game), and polish the herb and skin normal bursts. Mockup docs/mockups/gather-polish.html:
herb normal Current/N1 leaves and petals/N2 gentle swirl, herb rare Current/R1 Blossom/R2 Petal storm/R3 Golden
bloom; skin normal Current/N1 glint and scraps/N2 clean cut, skin rare Current/R1 Double slash/R2 Pelt sheen/R3
Trophy. **Picks (2026-11-09):** skinning N2 Clean cut + R1 Double slash (built in Gather.lua: Slash() with a tip,
Tufts(), RARE.skin = the X); herbalism normal stays as is; none of the herb options landed, but Golden bloom is "a good
idea": round 2 in the same file; the user picked **G2 Golden seed** (built: RARE.herb, the seed rises, cracks open at
0.9 s: rays (Streak.tga), leaf ring (Petal.tga tinted green), pollen shower). The user wants new designs for the normal
herb gather too: section 1c (H1 Dandelion, H2 Leaf flutter, H3 Gold sparkle, H4 Pluck pop), waiting for a pick.
Correction: the user meant skinning **N1 Glint and scraps** (not N2): built (afterimage, a second flick, leather
scraps). Asked for an Omnislash-style rare: mockup R4 Flurry (dim, ~11 slashes from every angle speeding up, a beat
of stillness, a big final slash with a flash, shockwave, sparks, a small shake). **The user likes both: switchable**
(setting skinRare "slash" default / "flurry", Gathering page; built, no screen shake in game). Herb normal: **H4 Pluck
pop** (built: green ring, leaf confetti, pollen puff, HerbPop.ogg). New sounds: HerbPop, FlurryHit, FlurryFinal.
Nitpicks (2026-11-09, done): a rare find's item (popup + flight) waits for the finale: ns.GatherRareDelay (herb: after
the seed opens, OPEN + 0.25; skin Flurry: FLURRY_FINAL + 0.25; others 0); default skinning back to one slash (keeps
scraps and tufts). The user isn't 100% happy with the skinning sounds (the rare is "pretty good"): candidates in
docs/mockups/skin-sounds.html (tools/gen_skin_sound_candidates.sh, embedded): normal N0 now/N1 soft swish/N2 blade
shing/N3 leather rip/N4 swish and thump/N5 snick; Double slash R0 now/R1 twin shing chord/R2 swishes and gong/R3
shing and sparkle; Flurry F0 now/F1 shing storm/F2 whoosh storm. **The user kept the current sounds** (2026-11-09).
**Release plan (2026-11-09):** a cohesion pass first, then release 1.3.0 (bag, gathering, Move frames, popup layout).
The user: mixing compact and full popups "seems kind of messy". Picked: **two lanes + one row look**: big cards stay
right of the character; compact popups leave that stack and become harvest-style rows (icon with quality border,
name in its color, gold count, x2 merging) in a "Picked up" feed in the right-hand column with the harvest window.
Mockup docs/mockups/cohesion.html (in game units, 1366x768): V1 Picked up above Harvest / V2 one window, two
sections / V3 below; small items of a big loot in the column or "With it" under the card. Finding: at the default
63% a 300-wide card overlaps a right column (ends 1160, column starts 1118): move the default to ~55%. Waiting for picks.
**Built 2026-11-09 (picked V1 + in the column; untested in game):** Feed.lua "Picked up" list (ns.PickedUp; compact
popups route there from ShowLoot and the waiting queue; setting noFeed; rows pooled via ns.SetLootRow), Gather.lua
loot column anchor (Mover key "tally", label "Loot column"; the harvest window hangs under the list via
ns.SetFeedHeight), shared row ns.NewLootRow; popups draggable (Mover key "popups", position "custom"; default
midright 0.63 -> 0.55); Move frames bar text fixed (two lines). Next: harvest window polish (the pace line repeats
the total, tiny section icons, ragged counts; max 3 sections in real play: 2 gathering professions + fishing), then
release 1.3.0. Mockup docs/mockups/harvest-polish.html (now vs. picks): header H1 time and rate / H2 one line / H3 rate
only; sections S1 plain words / S2 color pip / S3 pip + section total; counts C1 fixed column / C2 quiet numbers.
**Picked H1 + S2 + C2, built** (pace "18 min · ~98/h"; Diamond.tga pip with a glow per section; counts in
NumberFontNormal pale gold, fixed 26 wide right-aligned; the stack mark = three gold bars + the number). The user on
Picked up: it must not linger ("that's what the dungeon recap is for"): **each row leaves on its own 4 s after it came
(or last merged)**, sliding out, the rows below close the gap; the list hides when empty (built, untested).
**2026-11-09 evening:** the user tested the 1.3.0 set (BugGrabber: no new errors; old ones from Nov 5 / Nov 8 only).
Release checklist addition: `/dl` in combat is blocked (OpenToCategory is protected, Nov 8 error): open after combat.
1.3.0 = the professions release: **crafting goes in too** (round 2 mockup: Create All pile, skill bar, recipe colors).
First: a final bulging bag. Picks: swelling = item drops in + gulp, heavy sag, bulging lumps, creaks + heartbeat border
at 2/1 left; full = item bounces off back to the loot window, padlock clunk, escalating tries (harder shake, then a
tired slump); release = relief settle with a gold glint around the border, "+N" freed, dust puff. Mockup
docs/mockups/bag-final.html (each idea a switch). **The user: "Build all of them": built** (Bag.lua rewritten: Shape()
sag, Gulp/Wobble/Relief steps, Lumps, heartbeat border at <=2, bounce-off, Padlock (Lock.tga from gen_textures.lua),
tries -> shake / harder / slump, glint around the border, "+N", dust; sounds Bag* from gen_gather_sounds.sh; the
looted icon from LootFeed (ns.lastLootIcon, GetItemInfoInstant)). Reviewed, 9 fixes (a gen counter stops late timers;
the dark backing follows the icon). Untested in game. Next: crafting for 1.3.0.
**Crafting (2026-11-09):** picks: Create All = a pile card in the big-moments spot counting up, the profession's closing
flourish and a line "x12 Silk Bandage · Tailoring +4", then a "Crafted" row in the loot column; themes per profession
(smith sparks, alchemy bubbles, tailoring thread + snip, leather stitches, engineering gears + puff, enchanting runes,
cooking steam, first aid wrap + green cross); a single craft = its own themed animation + a row (no popup); the
recipe color heads-up as a line under the skill-up bar. Mockup docs/mockups/crafting.html (game units). The user:
keep considering cohesiveness of all elements while building (pile card in the popup style; Crafted joins the
Picked up list; one profession color everywhere).
**Round 2 feedback:** crafting stays separate from the popups; Create All was "a little boring": more whimsy, attached to
the profession window (under it: its right side has tabs), a profession finale; 2 (Crafted joins Picked up) and 3 (one
color per profession) agreed; profession-specific skill-up touches, not ornate. Ranking of the round 1 single-craft
animations, best first: tailoring, engineering, cooking, blacksmithing, enchanting, first aid, alchemy, leatherworking.
Round 2 mockup (crafting.html): a tray under the window filled per profession (stack: tailoring, cooking, first aid;
rack: alchemy, blacksmithing; conveyor: engineering; orbit: enchanting; clothesline: leatherworking), a counter, finales
(ribbon + bow, cloche + steam ding, quench steam + glints, belt + firework, sigil, red-cross seal + green pulse, corks
popping, maker's stamps), bar touches per profession, reworked singles for the bottom four. Waiting for the verdict.
In game: verify the profession window's frame name on Forever before anchoring the tray.
**Round 2 verdict:** alchemy and leatherworking "way better" (leather sounds liked; the zigzag thread not). New ranking
of single crafts: leather, alchemy, tailoring, engineering, cooking, blacksmithing, enchanting, first aid. Wanted:
improve all, simple and satisfying for hundreds of crafts. Skill bars: tailoring (the stitched line) best by far, the
rest equal and less unique. Round 3 mockup docs/mockups/crafting-feel.html: every single = 2-4 work beats + one payoff
(~1 s, slight randomness), leather with a straight running stitch; a separate "batch touch" per item (the payoff only,
pitch walking up; x12 and x30 fast to test fatigue); skill bars where the material IS the bar (leather strip with
holes + stitch, alchemy glass tube, engineering gauge cells, cooking grill marks, blacksmith white-hot iron, enchanting
runes lighting, first aid bandage with red crosses).
**Round 3 verdict:** skill bars "much better" (asked about a tiny icon: proposed a tool riding the fill tip). Animations:
really like leather, tailoring, cooking, enchanting (tidy a little); like engineering, blacksmithing; first aid much
better; alchemy least favorite. Sounds: really like leather; like tailoring, cooking, enchanting; engineering and
blacksmithing "going the right way, not there yet"; alchemy least favorite. Round 4 mockup docs/mockups/crafting-r4.html:
alchemy A (round 2 restored) / B pour and mix / C boil-over with new glass sounds (clink, glug, hollow cork); engineering
E1 metal ratchet + springy boing / E2 clockwork + bell; blacksmithing S1 anvil ring / S2 heavy hammer + long ring + hiss;
tidied leather, tailoring, cooking, enchanting (payoff at one spot); skill bars with a tool at the tip. Waiting.
**Round 4 verdict:** alchemy = C Boil-over (with the glass sounds); engineering = E1 metal ratchet (the user wrote "S1"
under Engineering, read as E1: confirm); blacksmithing sounds "more like a bell than a hammer"; first aid wants more
ideas; skill bars "awesome" (fix: the needle emoji showed as a square -> a drawn needle / texture in game; the alchemy
drop too blue -> the bar's purple). The batch touches are "awkward", and the Create All tray is "a decent start but not
what I'm looking for": brainstorm + mockup both together next. Round 5 mockup docs/mockups/crafting-r5.html: hammer
sounds H1 forge hammer / H2 tap, tap, CLANG / H3 dull iron; first aid F1 salve and wrap / F2 stitch a cross / F3 roll
toss / F4 pulse; the two bar fixes. Waiting.
After that: popups movable via Mover. Read this first
in a new session (the kit's `session-resume` skill does), then CLAUDE.md (layout, decisions, the dev/release
switch), `docs/plan.md` (roadmap) and `docs/curseforge.md` (listing)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out; the
**ground** = where they land (setting rainFloor).

## Where things stand
- **1.2.0 released** 2026-11-09 (tag `v1.2.0`, CHANGELOG): rain animations Fountain / Quick burst / Big bang
  (polished: even ring or fan, speed by weight, neat row, quiet finale), Finale for the best, the Vacuum
  gather, popup styles Achievement (Capsule) / Rune decode / Forged letters, the item level inscribed in the
  underline (Relic, Beam, Aura) and Splash's slanted block, Reverse disintegration back. Workflow: CurseForge
  "Uploading DopamineLoot-v1.2.0-forever.zip (1.60.1 release) ... Success!", GitHub release made, zip checked
  (one DopamineLoot/ folder). Stop point: **the game stays on dev** (the user's choice, to keep working).
- **1.2.1 released** 2026-11-09 (tag `v1.2.1`; CurseForge upload "Success!"): **the neat row is removed** (the user: after the loot settles it "jarringly
  shifts the items around"); items stay where they land, Spread out still nudges them apart as each rests.
  **New priority (the user, 2026-11-09), before the roadmap:** 1. **the bulging bag** (our own overlay on
  the backpack button: rounder the fuller; with few slots left each loot makes it swell/wobble, amber
  stitches, a "N left" bubble; full: the item bounces off, the bag shakes "no", dust, red "Bags full");
  2. **gathering pops** ("gathering is addictive already: add to it without being annoying for hours"):
  a small themed burst at the node (leaves/petals, rock chips + spark, splash ring, tufts), pieces arc into a
  **harvest tally** (session counts per material, "+N", fades when idle), rare finds (gems, rare herbs/fish)
  get a bigger burst + the normal popup, **skill-ups** with a bar to the next unlock, **calm** after many
  gathers (smaller, silent; the tally still counts). Mockup: docs/mockups/gathering.html (round 1, no picks
  yet). 3. then **profession crafting** (rounds off professions; the Create All finale).
  **Brainstorm picks (2026-11-09):** bag = the pressure story (the user's idea: "swelling like it's about to
  pop"): pumps up a notch per loot and only partly deflates, strain tells (tight drawstring, stitches glowing
  apart, trembles at the last slot), full = strains, drawstring snaps open, loot spills out the top and is
  sucked back in, "nope" shake; release = "pfff" deflate when space frees; count bubble optional.
  Gathering core: node burst, harvest tally, climbing notes per run, skill-ups with a bar to the next
  unlock, rare finds = full popup, calm after long runs; extras: stack milestones (20), session recap on stop.
  Crafting: Create All pile with a count + closing flourish, the same skill bar, recipe color heads-up
  (orange -> yellow -> green -> gray). Mockup docs/mockups/gathering.html round 2 shows all of it; the user
  likes it (2026-11-09) and wants a polish pass next session.
  **Polish ideas** (written 2026-11-09 for the next session; the user picks, then mockup round 3):
  Bag, visual: B1 the bag drawn from game art (the backpack icon in a ring) vs. our own leather bag, both
  shown; B2 squash-and-stretch with a short settle wobble instead of a straight scale; B3 the strain light
  in the bag's own color for special bags (herb bag green, mining bag stone); B4 the snap: the drawstring
  whips out as a line, a tiny "pop" ring; B5 the release puff shaped by how much was freed (a sigh vs. a
  big exhale). Bag, functional: B6 count only normal bags (bagFamily 0), herbs into an herb bag don't
  strain it; B7 the full-bag moment fires on the real "Inventory is full" error (loot left in the window),
  at most once every few seconds; B8 the overlay follows the backpack button and hides with it (Baganator
  or Edit Mode moving it); B9 a switch and a "Test bag" button on a page; B10 the threshold (4 slots) as a
  setting; B11 quieter in combat (no sound, small wobble).
  Gathering, visual: G1 node bursts tuned per material tier (copper chips vs. thorium chips with a blue
  glint; peacebloom petals vs. golden sansam gold motes); G2 the tally in the game's style (item icons with
  quality borders, Morpheus numbers) and docked under the minimap or beside the bag (placeable later with
  edit mode); G3 the tally row slides to the top when it changes; G4 the "+N" counts merging when gathers
  come fast; G5 the skill bar in the profession's color with the unlock's icon at its end; G6 a rare find's
  burst in the node's style, not the generic one. Gathering, functional: G7 the notes reset after 8 s idle,
  and "calm" kicks in after N gathers in 10 min (setting), dropping back after a break; G8 the tally per
  session and per zone, kept until logout (or a reset button), the recap after 60 s idle; G9 stacks use the
  item's real stack size (GetItemInfo maxStack), not 20; G10 skill-ups from CHAT_MSG_SKILL diffing
  GetProfessionInfo, the next unlock from a small table per profession (Tin 65, Silverleaf 70...); G11
  rare = item quality >= Uncommon from a gather, or a small list (Black Lotus, Arcane Crystal) for the
  Legendary treatment; G12 a Gathering settings page: on/off per kind, tally on/off, sounds, calm.
  Crafting, visual: C1 the pile shows the real item icon stacking with a slight fan; C2 the closing
  flourish in the profession's style (anvil sparks, a potion fizz, a snip of thread); C3 the recipe chip
  next to the trade skill window, or as a toast if the window is closed; C4 a "+N skill" summary on the
  closing line ("×12 Silk Bandage · Tailoring +4"). Crafting, functional: C5 batch "You create" lines
  into one pile (the burst collector), end on UPDATE_TRADESKILL_CAST_STOPPED or a 2 s gap; C6 single crafts
  stay a normal popup; C7 recipe colors from the trade skill API's difficulty (verify on Forever) or the
  skill thresholds; C8 crafted items skip the rain; C9 cancel mid-batch closes the pile with the count so
  far. Shared: S1 one "Professions" settings page for gathering + crafting; S2 every piece follows the
  existing Calm / sound / combat rules; S3 one shared skill-bar widget for gathering and crafting. APIs for all of this
  (researched 2026-11-09, evidence from Forever addons RoadToSixty, NodeSight, Narcissus, EasyFishing):
  - Bag space: C_Container.GetContainerNumFreeSlots(0..4) -> free, bagFamily; count only bagFamily == 0;
    BAG_UPDATE_DELAYED. Full bags: UI_ERROR_MESSAGE (errorType, msg): errorType == LE_GAME_ERR_INV_FULL or
    msg == ERR_INV_FULL (verify both with /dump); no CHAT_MSG_LOOT then, the item stays in the window.
    Backpack button: read MainMenuBarBackpackButton's center as Rain.lua's BagPoint does (no touching it).
  - Gather source: at LOOT_READY (LOOT_OPENED fallback) IsFishingLoot() = fishing; GetLootSourceInfo(slot)
    GUID "GameObject-" + ore/herb item class = mining/herbalism (pcall, issecretvalue guard); "Creature-" with
    only leather/hide = skinning; isFromItem = disenchant/container. Don't use gather spell IDs (Forever has
    its own). Tag the CHAT_MSG_LOOT records until LOOT_CLOSED.
  - Skill-ups: CHAT_MSG_SKILL as a trigger, then diff GetProfessions()/GetProfessionInfo(i) (pcall; nil
    holes; may be empty for ~5 s after login). GetSkillLineInfo does NOT exist on Forever.
    C_SkillInfo.GetSkillLineInfoByID(186) may (verify).
  - Crafting: "You create" CHAT_MSG_LOOT lines (LootMsg.lua already has them); batch them; the end via
    UPDATE_TRADESKILL_CAST_STOPPED or a quiet gap.
  - To /dump in game: LE_GAME_ERR_INV_FULL, ERR_INV_FULL, SKILL_RANK_UP, C_SkillInfo, loot source GUIDs.
  Ideas list from 2026-11-09 (not picked yet): roll-win dice + WON stamp, junk-selling finale, AH-money mail
  rain, trophy shelf (best drops in 3D), first-of-its-kind moments, gold milestones, lucky drop, screenshot
  at an Epic's peak.
  Open / next: the Aura animation rework (heartbeat, sunbeam, framed word: pushed to later), then the
  roadmap: mail / craft finales (verify APIs), edit mode, stats. docs/curseforge.md's description still
  lists 1.1.0's features (the user updates the project page by hand if wanted).
- **1.1.0 released** 2026-11-06 (tag `v1.1.0`): the flair update (CHANGELOG): popup arrivals per rarity
  (Arrivals page), Splash and Aura styles, the Legendary comet, rain flair and sounds picked by ear, money
  tally, split filters, Always rain for. Not tested together in game by the user beyond the pieces above.
- **1.0.1 released** 2026-11-05 (tag `v1.0.1`): the fix for 1.0.0's taint. 1.0.0's native settings pages
  ran Blizzard's settings and nameplates "tainted by DopamineLoot" (nameplate CompactUnitFrame x739,
  TextStatusBar, ScrollBox SetHeight, IsUserOAuthed). Now ns.Native builds canvas pages from our own
  frames (same calls), plus a private tooltip `DopamineLootTooltip`; the window's "Defaults" no longer
  resets our pages (accepted). Tested on dev: BugGrabber sessions 20-22 had no errors at all.
  1.0.0 (tag `v1.0.0`) passed the safety audit (no personal strings incl. media metadata; no messages,
  dynamic code, CVars, item/gold actions or Blizzard hooks; saved data = settings + version).
- **CurseForge**: project **1784686**, live since 2026-11-05 (curseforge.com/wow/addons/dopamine-loot).
  1.0.0 was uploaded by hand; **1.0.1 uploaded automatically** by the release workflow ("Success!", game
  version 1.60.1). A `v*` tag now builds, uploads to CurseForge and makes the GitHub release.
  Workflow note: `actions/checkout` bumped to v5 (Node 20 warning).
  Wago not set up.
- **Dev / release switch** (`tools/addon-mode.ps1`, CLAUDE.md section; command in CLAUDE.local.md):
  "switch to dev/release" = run it, then the user `/reload`s. **The game is on dev** (switched 2026-11-07 for
  testing; 1.1.0 is the parked release copy). The CurseForge app caches "latest version" for a while after an
  upload: refresh or restart it.
- **Repo security** 2026-11-05: only Bempis-linux has access; rulesets "Protect main" (no force-push or
  delete) and "Protect release tags" (v* can't be deleted or moved), no bypass, even for the owner; wiki off.
  The user checks 2FA and installed apps themself.
- **1.0 scope decisions** (in CLAUDE.md): only `/dl` (opens settings), no log window or debug logging,
  the addon prints nothing; Test buttons run `ns.RunAction`. 3D armor dropped; dev tools in
  `deprecated/asset-check/`. Rain looks: coin twinkles, ground line, dull grays (switches), the game's bag
  border on rain items; coin piles dropped ("a little jarring").
- **Next up** (no rush). **Immediate list for the next session (the user, 2026-11-06):**
  1. **Release skill: done** 2026-11-06: kit updated 0.6.3 → 0.7.1 (has `wow-addon-release`; active after a
     Claude restart). Use it for the next release. 1.1.0 was released by hand.
  2. **1.1.0 reached CurseForge** (workflow log: "Uploading DopamineLoot-v1.1.0-forever.zip (1.60.1 release)
     ... Success!"). Left: the user updates in the CurseForge app (on release), fully restarts, tests 1.1.0.
  3. **Reworked 2026-11-07, untested in game:** **Reverse disintegration** is back (3a59dc9's specks + the
     item fading in via ItemAlpha; listed again for Rare). **Achievement** redesigned over mockup rounds 10-17
     (docs/mockups/achievement.html, now only the keepers): the user kept **Capsule 3** (round emblem opening
     into a rounded bar; rarity word + 4-bar rarity gauge, name, type; item level in a round badge at the
     end; thin bevel, inner emblem ring; only the rim changes with rarity: Epic glow, Legendary glow + gold
     rim) as Achievement, plus four new styles: **Brush stroke**, **Rune decode**, **Forged letters**,
     **Ember burn-in** (the last three share name / diamond divider / one info line; effects scale with
     rarity). Built in `DopamineLoot/Styles.lua` (kits hooked into View.lua); new textures Circle, Ring,
     Pill, PillRim, Brush, Runes. The old ribbon Achievement code is removed. Rejected along the way:
     Plaque, Headline, Crest, Framed toast, Swallowtail, Diamond HUD, Arch, coin/gem/seal emblems ("over
     designed"), Neon, Torn reveal, Comic burst, Sticker slap, Kinetic type, Glitch, Quill script, Mist
     summon. The NEW / upgrade marks from the mockup aren't built: the addon keeps no seen-items data yet.
  4. **Popup sounds per arrival animation** (the user, 2026-11-07): each arrival (Fireflies, Emerald flare,
     Geyser, Sapphire flare, Aurora arch, Light pool, Implosion, Eclipse, Starfall, Supernova, Meteor shower,
     Golden seal, the Legendary comet) gets its own sound, timed to its beats. Builds on flair step 3 (layered
     hit sounds: our own OGGs, mixable with game kits per layer). Mockup with Play buttons first; the user picks by ear.
  5. Roadmap (plan.md, Ideas): **class-themed popup animations/styles**; accessibility (reduce motion, no
     flashes) tabled; drag-to-move popups, the NEW badge, the bag sparkle.
  **New order (the user, 2026-11-07, replaces 4-5 for now; in plan.md's Roadmap "next" row):** 1. new
  animations: loot rain variants (their "big bang": a central burst bouncing off all screen edges, settling
  at the bottom; plus more) and finales for Open All mail / Create All crafts (verify the APIs first);
  2. an edit mode to drag the popups and the money tally into place; 3. stats: loot streak, session tally.
  Dungeon recap stays on the roadmap. Popup sounds per arrival (4) waits.
  **Rain animations (2026-11-08, untested in game):** setting `rainStyle`, "Animation" under "How it comes
  out" on the Loot rain page, from docs/mockups/rain-variants.html round 5: **Fountain** (default, unchanged),
  **Quick burst** (new: a friend found the Fountain overstimulating; the Fountain's wind-up, then everything
  blows up at once in one wide fan with a flash; the best keeps the hang + slam), **Big bang** (wind-up at
  screen center, bounces off all four edges; best held in the core, which collapses into it, then drops and
  slams). Firework, Vortex, Meteor shower and Geyser were built 2026-11-07 (fcfd311) and **dropped by the
  user 2026-11-08**; a saved removed choice moves to Quick burst. The switch key `Hang` is now "Finale for the
  best" and gates every animation's finale (Big bang's core too). Core.Step still reads `gmul` (unused now).
  The user: Quick burst "looks pretty good" (2026-11-08). **Vacuum gather** (setting `rainGather` "one" default /
  "vacuum", "How it gathers" under Afterwards; mockup round 6), untested in game: a 0.28 s inhale (lift, tremble,
  motes rushing to the bag), then everything sucked in together on a tight cubic curve, one gulp (rings, sparks,
  ChestPop) instead of a ring and note per item. 2026-11-09: a wave from the bag outward, each item its own arc,
  bend, speed, spin and lift (the user: "Wayyy better"). Big bang's opening flash softened (flashA 1 -> 0.3, the
  big ring 0.9 -> 0.5: "a little too shocking"). **Brush stroke and Ember burn-in popup styles removed** by the
  user 2026-11-09 (a saved one falls back to Relic; Brush.tga deleted).
  **Polish round (2026-11-09, untested in game):** Big bang (mockup rain-variants.html round 8): one colored ring
  and a 0.07 s hit-stop (Hitstop switch) instead of a flash, the dim fades out, motes spiral in, loot on the
  golden angle with speed by weight (Weight: coins 1.3 .. grays 0.76), soft walls (s.we 0.5) and air drag
  (s.air), slow spin, the core collapses once 80% of the loot is down, then the neat row (Core.NeatRow, also
  Quick burst, with Spread out on). Quick burst: even shuffled fan, speed by weight. Popups (achievement.html
  round 18): Achievement gauge 13x6 and brighter, clearer rarity word, name 21; flat icons centered in the
  emblem (cardY), the level badge text centered. Rune decode / Forged letters: 14 px more under the item, the
  info line = colored rarity + type, the item level in a round badge on the divider. Proposed next (mockup
  docs/mockups/info-line.html): the user picked Banner (badge at the band's right end; line = colored rarity +
  type; built 2026-11-09) and likes the colored, simpler line; round 2 of the mockup tries four badge spots
  (A on the item, B end of the name, C divider under the name, D a small tag on the line) for Relic, Beam,
  Aura, Splash. Round 3 picks (2026-11-09), built: Relic, Beam, Aura = D, a small "iLvl 63" tag (pill) at the end of
  the line (the user: D looks best, B (end of the name) uses space better: open whether to move it); Splash = E,
  a number block at the banner's left end (upright in game; the mockup's is slanted with the banner).
  **Reverted 2026-11-09 after the user saw them in game** ("kind of ugly"; never wanted Rune/Forged changed):
  Rune decode and Forged letters (spacing, divider badge, line), Banner's badge and line, and the Relic/Beam/Aura
  tag are back as they were at 5ad893b. Kept: Achievement's polish (gauge, rarity word, name 21) and Splash's
  number block ("isn't terrible"). Lesson: polish only what the user named; don't touch styles they're happy with.
  Correction (same day): the user wanted the mockup picks kept to iterate on, so the Relic/Beam/Aura "iLvl" tag
  (D) and Splash's block (E) are back; only Rune decode, Forged letters and Banner stay as before. Next: iterate
  on the tag/block look in game (the user finds them a bit ugly in game).
  Round 4 mockup (info-line.html, the user said "go with your suggestions"): Gem or Readout for the item level
  (Relic, Beam, Aura), an upgrade arrow, a reworked Aura (heartbeat glow, sunbeam column with dust, framed
  rarity word, bigger name), Splash's block slanted. Picks: **Splash's slanted block** (built: SlantBlock/SlantRim
  textures, 52x44); the Gem and Readout didn't feel "final"; the Aura animation rework is pushed to later.
  Then round 5 (2026-11-09): **the inscribed number, number only** (built, untested): Relic, Beam, Aura show the
  item level white with a soft glow in a gap of the name's underline (f:Underline, insNum, insGlow); the line is
  colored rarity + type (Aura: type). The iLvl pill is gone.
  **Upgrade arrow API (researched 2026-11-09, works on Forever per Road to Sixty / Narcissus):**
  GetInventoryItemLink("player", slot) (nil = empty, a plain read, no taint/secret); level via
  (C_Item.GetDetailedItemLevelInfo or GetDetailedItemLevelInfo)(link); our own equipLoc -> slot table (no
  API): HEAD 1 .. HAND 10, FINGER {11,12}, TRINKET {13,14}, CLOAK 15, WEAPON {16,17}, WEAPONMAINHAND/2H 16,
  OFFHAND/SHIELD/HOLDABLE 17, RANGED/RANGEDRIGHT/THROWN/RELIC 18 (Forever has slot 18); compare against the
  lower slot (empty = 0). GetInventorySlotInfo is behind a deprecation setting: use the numbers.
  Next after testing: mail / craft finales (verify APIs first).
  Player feedback: the scheduled task "Dopamine Loot daily feedback report" (daily ~6:00 a.m. Central; read-only;
  prompt in ~/.claude/scheduled-tasks/dopamine-loot-feedback-report/SKILL.md) writes `reports/feedback-*.md`
  (gitignored). It acts on nothing; never act on player text without the user.
  **Shelved by the user 2026-11-06:** hooks (streak, tally, records), the streak jackpot, card flip; the
  inspector, filters beyond the NEW badge and stats are pushed back.
  **Popup design history** (docs/mockups/popup-designs.html, rounds 1-9): kept: styles Splash (final build),
  Aura (wisps), Relic, Beam, Banner; arrivals Fireflies, Emerald flare, Geyser v3; Sapphire flare, Aurora arch,
  Light pool; Implosion-galaxy, Eclipse, Starfall; Supernova, Meteor shower, Golden seal; letter stamp Epic+.
  Rejected: Sigil, Shrine, Portal, Breakout, Glass, Ornate, Showcase, Winged crest, Medallion; lightning,
  ice shards, rays, crossing beams, starburst, orbit, constellation, frost bloom (too mage-like), phoenix,
  sun crown, treasure eruption, sunrise, void rift. Sounds: docs/mockups/sounds.html (round 5 picked).
  A release: bump `## Version`, CHANGELOG section (dated), README, preflight, push, tag `v<version>` with the
  user's OK; the tag's workflow uploads to CurseForge and makes the GitHub release.

## Verified in game (by the user)
- 0.1-0.3: loads; `PlayerModel:SetItem` works on Forever; rain physics; popup styles, weapons upright;
  **real looting works** (grays and copper rained); coin merge-up; Test money/quest.
- 0.4: popup placement right of you, compact Uncommon beside a Rare; settings pages by topic; sound
  picker; Escape skip; popup arrivals and sway; Banner long names OK.
- 1.0.0: rain looks "look good" (2026-11-04); the CurseForge install loads (2026-11-05).
- 1.0.1: the rebuilt settings pages "seem good"; no errors from any addon in three test sessions (opened via
  Esc > Options and via `/dl`, then the game's Nameplates and Social settings). The CurseForge app updates
  Dopamine Loot like other addons (after a refresh: it caches "latest version" for a while after an upload).

## Known bugs
- **Settings fields empty after /reload** (user, old). 0.4.2 creates every panel hidden so OnShow refills
  them. **Fix unverified.**
- (Fixed in 1.0.1: the native settings pages' taint, which also caused the Social page's `IsUserOAuthed()`
  message. Other addons with native pages, BugSack for one, can still cause that message themselves.)

## Not yet verified
- A single green from a mob (popup), a vendor buy (must NOT pop), crafting, a real quest turn-in with
  money, a dungeon (secret loot lines?), combat deferral, big-rain performance (60+ items).
- Arrival sounds by ear; gathering when Baganator hides the backpack button.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**; nothing else personal in tracked files or
  commits (BugSack dumps contain the character name: never copy it). Repo-local git identity; the pre-push
  guard enforces it; never `--no-verify` unless the user says so.
- **Only `/dl`, everything on the settings pages** (replaces the kit's command/page parity).
  **Settings pages stay tidy**: design each change (section, label, order) before adding it.
- **Mockups before visual changes** (`docs/mockups/rain.html` for motion; popups: popup-designs.html). The user wants bold, dramatic arrivals ("you've been playing it a little safe"), never janky; no radial light rays. **No bulk scripted tests in the
  browser pane without asking** (one froze the user's PC); mute sound, one scene.
- **The loot rain is the favorite part**; it may be busy. Popups stay calm: no new looping popup
  animations without asking.
- Presentation and sound matter most. Repeated sounds climb in pitch; small hauls stay light. **No level-up
  or quest sounds.** Pick sounds by ear with Play buttons.
- **Assets**: offer custom vs. Blizzard asset per piece and let the user pick. Never ship extracted or
  borrowed files.
- Tag/publish only with the user's OK in chat; secrets and tokens never pass through the chat (the user
  runs `gh secret set`).
- Process: preflight → reviewer agent for big changes → commit → push; then a short "to test" list saying
  `/reload` vs **full restart** (new media files = restart; a newly linked addon folder loaded on `/reload`).
- Answers: concise. **No rush, no deadlines.**

## Gotchas and environment notes
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only. No python, node or lua on PATH: Lua runs
  via sumneko `lua-language-server.exe` (preflight finds it; Lua 5.4). PowerShell 5.1: `$PSScriptRoot` is
  empty in param defaults, and `"$var:"` parses as a drive (use `${var}`).
- ffmpeg (winget Gyan.FFmpeg, not on PATH) for sounds (`bash tools/gen_sounds.sh` re-encodes every OGG:
  `git checkout -- DopamineLoot/Media/` after) and art checks.
- Forever: no `MouseIsOver`; `SetRotation` only on square textures; models set after `Show()`,
  `ClearModel()` before `SetModel`, no AnimationGroups, reload on show. Settings panels: create hidden.
- Never delete a junction with `rm -rf`/`Remove-Item -Recurse` (follows into the repo); the switch script
  removes it as a link. Addon installs (CurseForge app) once dropped the junctions; check with `status`.
- Kit updates: `claude plugin marketplace update bempis`, then `claude plugin update wow-addon-kit@bempis
  --scope user`, run with the desktop app's CLI (not on PATH; newest
  `%LOCALAPPDATA%\Claude-Data\claude_*\claude-code\<ver>\<hash>\claude.exe`). Installed: 0.7.1. Kit source:
  `C:\dev\wow-addons\wow-addon-kit`.
- Game closed before editing `WTF`. Paths in CLAUDE.local.md. Baganator owns Alt+click.

## Open questions / waiting on the user
- Are the settings fields filled after /reload?

## Recent history (newest first; details in plan.md and git log)
- 2026-11-06 1.1.0 released: flair pass: rain flair + sounds picked by ear + money tally + split filters + always-rain; popup redesign mockups rounds 1-6.
- 2026-11-05 1.0.1: settings pages rebuilt on our own frames (fixes taint of nameplates and settings); first automatic CurseForge upload.
- 2026-11-05: safety audit, CurseForge project + listing + API key, repo rulesets, dev/release switch.
- 2026-11-04 1.0.0 released: 3D armor dropped, dev tools out, only /dl, rain looks, packaging, README,
  LICENSE; kit 0.7.0 `wow-addon-release` skill.
- 2026-11-04: Forever released; moved to `_forever_`.
- 2026-10-16 0.4.21-0.4.23: hover fix (no MouseIsOver); armor-on-mannequin probe (later dropped).
- 2026-10-14 0.4.15-0.4.20: settings by topic, sound picker, popup placement.
- 2026-10-14 0.4.6-0.4.14: chest show set aside, loot from the ground; popup polish; Toast tried, set aside.
- 2026-10-09/12 0.1-0.4.5: scaffold, popups, rain, settings, styles, arrivals, effects, coins, chest show.

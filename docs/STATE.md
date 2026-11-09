# Session state — Dopamine Loot

_Last checkpoint: 2026-11-09, **stop point after 1.2.1**, night of 2026-11-09 (released and on CurseForge; the game
stays on dev). Next session: the user picks from docs/mockups/gathering.html (bulging bag, gathering pops). Read this first
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
  yet). 3. then **profession crafting** (rounds off professions; the Create All finale). APIs for all of this
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

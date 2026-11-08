# Session state — Dopamine Loot

_Last checkpoint: 2026-11-07, after 1.1.0: five new popup styles built (Achievement Capsule, Brush stroke, Rune decode, Forged letters, Ember burn-in), untested in game; the game is on dev. Read this first
in a new session (the kit's `session-resume` skill does), then CLAUDE.md (layout, decisions, the dev/release
switch), `docs/plan.md` (roadmap) and `docs/curseforge.md` (listing)._

**Words the user uses:** the **treasure chest** = where the rain's items and coins come out; the
**ground** = where they land (setting rainFloor).

## Where things stand
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
  **Built 2026-11-07, untested in game:** the rain animations (setting `rainStyle`, "Animation" under "How it
  comes out" on the Loot rain page): Fountain (default, unchanged), Big bang (0.75 s wind-up at screen center,
  pulled-in motes, dim, flash; bounces off all four edges via bounds.top), Firework, Vortex, Meteor shower,
  Waterfall (picked in docs/mockups/rain-variants.html; the user liked all, slot reels rejected). Code: STYLE /
  StyleLaunch / *Ctl controllers in Rain.lua; Core.Step got `gmul` (gravity multiplier; `s.g` is the green
  channel!) and an optional ceiling. Next on the list after testing: mail / craft finales (verify APIs first).
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

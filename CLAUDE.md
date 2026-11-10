# Dopamine Loot

A World of Warcraft addon. General WoW addon knowledge, house style, and tooling come from the
**wow-addon-kit** plugin (`wow-addon-dev` skill); this file holds only what's specific to Dopamine Loot.

## Target

| | |
|---|---|
| Clients | WoW Forever |
| `## Interface:` | `16001` (recompute with the kit's `clients.sh` after game patches) |
| Addon folder | `DopamineLoot/` (linked into each client's `Interface\AddOns\` with a junction) |
| Slash command | `/dl` only: opens the settings (1.0: every other command, the log window and debug logging were removed) |
| Saved data | `DopamineLootDB` (account: settings), `DopamineLootCharDB` (per character: seen items, recent loot, stats) |
| Client folder | `_forever_` (product `wowf`; released 2026-11-04, the beta was `_classic_beta_`) |

Machine paths (WoW root, client folders, account folder) are in `CLAUDE.local.md` (gitignored).

## Layout

```
DopamineLoot/            the addon; load order in DopamineLoot.toc
  Core.lua                 saved data, events, /dl, Test actions (ns.AddAction, ns.RunAction)
  LootMsg.lua              pure parser of "You receive loot" lines (tools/test_lootmsg.lua)
  Sounds.lua               popup sounds per rarity (settings sound2..5, game kits) + our chimes (noChime3..5), rain sets (OGG)
  View.lua                 the popup view: Relic, Beam, Banner, Splash, Aura; model or tilting card, flash, arrivals by rarity
  Styles.lua               more popup styles as kits hooked into View: Achievement (Capsule), Rune decode,
                           Forged letters
  Popup.lua                popup stack, motion, waiting queue (uses View)
  RainCore.lua             loot rain, the pure part: ns.RainCore (physics, timing, spacing, coins; tools/test_rain.lua)
  Rain.lua                 loot rain drawing: sprites and every effect (ns.RAIN_FX switches)
  LootFeed.lua             CHAT_MSG_LOOT -> item data -> burst collector (+ looted money) -> popup or rain
  Bag.lua                  the bulging bag: overlay on the backpack button at <=4 free normal slots (squash,
                           game quality border + corner count, full-bag snap on UI_ERROR_MESSAGE, release puff)
  Mover.lua                drag-to-move for any of our frames: ns.Mover.Register{key, frame, label, point, x, y,
                           preview}; "Move frames" (Unlock) / Done (Lock) / Reset; saved in settings.pos
  Gather.lua               gathering: detect at LOOT_READY (fishing, node herb/ore, all-leather skinning), node
                           burst, harvest tally (movable), merging +N, climbing notes (GatherNote*), calm
  Feed.lua                 "Picked up" list: compact popups become harvest-style rows at the top of the loot column
  CraftTray.lua            Create All tray under ProfessionsFrame: items tumble into a heap, count, shake + sparkle
  Craft.lua                crafting: trade-skill casts (window open) play the profession's work beats over the cast,
                           the payoff when made; batches; crafted items -> Crafted rows (tools/gen_craft_sounds.sh)
  Skill.lua                skill-up banner (CHAT_MSG_SKILL): bar in the profession's color to the next unlock
  SkillBar.lua             skill bars: crafting ones made of the material with a tool at the tip (ns.MakeSkillBar)
  GatherPage.lua           "Professions" page (native): gathering, crafting, skill-up look, tests
  Settings.lua             first page + helpers: ns.Native (plain pages on our own frames: Toggle, Slider, Choice, Button),
                           ns.UI (custom controls incl. Dropdown)
  Look.lua                 "Popups" page (custom: live preview): when, style, size, the 3D item, item ID check
  RainFx.lua               "Loot rain" page (native): when, where, afterwards, effects by group, tests
  Pages.lua                "Sounds" page (native): popup sound picker
  Media/*.tga, *.ogg       original art (tools/gen_textures.lua, white, tinted in game) and sounds
                           (tools/gen_sounds.sh, ffmpeg-synthesized)
docs/plan.md             design, data model, roadmap, rain ideas
docs/mockups/            HTML mockups (rain.html: the rain prototype, same physics, effect toggles)
docs/STATE.md            session handoff
tools/                   gen_textures.lua, gen_sounds.sh, test_*.lua (run by wow-preflight),
                         addon-mode.ps1 (switch the game between the dev files and a released copy)
deprecated/chest-show/   the set-aside chest show (Rain.lua as of 0.4.5, media, README); not loaded
deprecated/toast/        the set-aside Toast popup style (View.lua as of 0.4.13, an unfinished diff, README)
deprecated/asset-check/  the dev tools taken out for 1.0: /dl assets page and /dl armortest (Assets.lua, README)
.pkgmeta, .github/       release packaging: BigWigs packager; a pushed v* tag builds the GitHub release zip
CHANGELOG.md             player-facing release notes (the packager uses it as the release changelog)
docs/curseforge.md       CurseForge listing copy (summary, description, categories) checked against its moderation rules
reports/                 daily feedback reports from the scheduled task (gitignored: they quote player handles)
```

## Session continuity (read first)

- **Start of every session**: read `docs/STATE.md` (skill `session-resume`) and follow its preferences.
- **Keep it current** (skill `session-checkpoint`): after every pushed increment, whenever something is
  learned that isn't written down, and before the user stops or resets. Nothing important may live only
  in the chat.

## Workflow

- Before every in-game test and every push: `wow-preflight`.
- After the user tests: `wow-test-debug`.
- Unsure an API exists on the target client: `wow-api-researcher` agent.

## Privacy

Public repo under the handle **Bempis**, the only personal identifier allowed anywhere tracked. Nothing
else personal in tracked files or commits (real name, email, Windows username, Battle.net ID, character
names, realm); `.privacy-patterns` (gitignored) lists the strings preflight blocks. Repo-local git
identity only; never change the global git config.

## Addon-specific notes

Decisions (don't undo without asking; details in `docs/plan.md`):
- `CHAT_MSG_LOOT` self lines are the only record source; the loot-window snapshot is for timing/fallback;
  bag events never create records.
- Default filter Uncommon+; NEW/UPGRADE are badges and louder tiers, not filters.
- Inspector opens with **Alt+Right-click** (Baganator owns Alt+click), configurable.
- 3+ shown items, quest money, or loot money from a setting (default 1g) → loot rain (Vampire-Survivors
  feel); deferred in combat. The loot flies up from the ground by default (setting `rainFrom`). Animations (setting
  `rainStyle`, 2026-11-08): Fountain (default), Quick burst, Big bang; Firework, Vortex, Meteor shower and Geyser
  were dropped by the user (a removed choice moves to Quick burst). The gather into the bag is one by one or a
  Vacuum (setting `rainGather`). The chest
  show (containers, shake, rarity tease) was set aside 2026-10-14: `deprecated/chest-show/`, not loaded.
- Seen set and loot history per character; settings account-wide. No login toast.
- **Settings layout** (0.4.15, from docs/mockups/settings.html; 1.3.0): pages Dopamine Loot (a main switch
  for every feature, Move frames, quick tests), Popups (custom), Arrivals, Loot rain, Sounds, Professions
  (native: gathering details, Create All pile, skill-up bar look Crafted/Simple, tests); Advanced and Blizzard
  assets removed for 1.0. Main on/off switches live on the first page only; a feature's page holds its details.
  Native unless a page needs a live preview.
- **Settings pages only** (user, 2026-11-04; overrides the kit's command/page parity): `/dl` opens the
  settings and there are no other commands. Every setting and test is a control on a page (number field
  or drag slider, choice, Test button); visual settings update a live preview on the page. Test buttons
  run `ns.RunAction`. No log window: the addon prints nothing.
- Popup styles Relic (default) / Beam / Banner / Splash / Aura / Achievement / Rune decode / Forged
  letters (Brush stroke and Ember burn-in dropped by the user 2026-11-09; the last three picked in docs/mockups/achievement.html, 2026-11-07; Halo lens dropped 0.4.7; the Toast style set aside 0.4.14:
  `deprecated/toast/`, README lists what needs work)
  are all options; weapons stand upright
  (`Model:SetPitch`, not SetRoll). Arrivals by rarity play in every style: Rare a burst of sparks,
  Epic adds star4 glints, Legendary more of both plus two shockwaves and embers (picked in
  docs/mockups/popups.html). Items sway; Epic+ turn once first. Keep popup animations simple.
- Popup placement (0.4.20, picked in docs/mockups/placement.html): right of the character, mid-screen by
  default; Poor/Common come compact (one line), an Uncommon too unless it is the best of its loot; clicks
  pass through (hover holds, up to 10 s); 2 at once; time on screen by rarity; compact in combat.
- Visual changes: show mockups first, the user picks, then build. Generated art comes from
  `tools/gen_textures.lua` (check it rendered with ffmpeg before pushing).
- Assets: Blizzard's game assets (models, textures, icons, sounds, referenced by path or ID) and our
  own generated ones are both fine; pick what fits. **When designing, present both as options**
  (custom vs. Blizzard asset for each piece) and let the user choose. Never ship files we didn't make
  (no extracted game files or other addons' media in `Media/`). Models driven by hand in `OnUpdate`,
  set after `Show()`, no AnimationGroups.

## Dev files vs. the released copy (tools/addon-mode.ps1)

The user plays either the dev files (a junction to this repo) or a released copy (the CurseForge app's
install, or a release zip); "switch to dev" / "switch to release" means run the script (exact command
with the client path in CLAUDE.local.md), then tell the user to `/reload`. `status` shows which is in use.
The copy not in use is parked in `<client>\Interface\DopamineLoot.release` (outside AddOns). Both share
the saved data.
- **Only install or update through the CurseForge app while on release.** On dev, `AddOns\DopamineLoot`
  is the junction. Seen 2026-11-05: installing while on dev, the app replaced the junction with its own
  folder (the repo was untouched), but an update might write through it instead (`git status` shows
  it; `git checkout -- DopamineLoot` undoes it). Keep auto-update off for Dopamine Loot in the app.
- Never remove the junction with `rm -rf` or `Remove-Item -Recurse` (that follows the link into the
  repo); the script removes it as a link only.

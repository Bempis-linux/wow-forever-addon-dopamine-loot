# Dopamine Loot

A World of Warcraft addon. General WoW addon knowledge, house style, and tooling come from the
**wow-addon-kit** plugin (`wow-addon-dev` skill); this file holds only what's specific to Dopamine Loot.

## Target

| | |
|---|---|
| Clients | WoW Forever |
| `## Interface:` | `16001` (recompute with the kit's `clients.sh` after game patches) |
| Addon folder | `DopamineLoot/` (linked into each client's `Interface\AddOns\` with a junction) |
| Slash command | `/dl` (also `/dopamine`) |
| Saved data | `DopamineLootDB` (account: settings), `DopamineLootCharDB` (per character: seen items, recent loot, stats) |
| Client folder | `_classic_beta_` until launch on 2026-11-04 (release folder TBD; re-point the junction then) |

Machine paths (WoW root, client folders, account folder) are in `CLAUDE.local.md` (gitignored).

## Layout

```
DopamineLoot/            the addon; load order in DopamineLoot.toc
  Core.lua                 saved data, events, /dl commands (ns.AddCommand, ns.RunCommand)
  Output.lua               log window (all output except /dl help)
  LootMsg.lua              pure parser of "You receive loot" lines (tools/test_lootmsg.lua)
  Sounds.lua               popup sounds per rarity (settings sound2..5, game kits) + our chimes (noChime3..5), rain sets (OGG)
  View.lua                 the popup view: 3 styles, model or tilting card, flash, arrivals by rarity
  Popup.lua                popup stack, motion, waiting queue (uses View)
  Rain.lua                 loot rain: pure ns.RainCore (physics, timing, spacing, coins; tools/test_rain.lua)
                           + sprites and every effect (ns.RAIN_FX switches, /dl rainfx)
  LootFeed.lua             CHAT_MSG_LOOT -> item data -> burst collector (+ looted money) -> popup or rain
  Settings.lua             first page (native) + helpers: ns.Native (native pages: Toggle, Slider, Choice, Button),
                           ns.UI (custom controls incl. Dropdown), ns.SettingChanged (a command updates open pages)
  Look.lua                 "Popups" page (custom: live preview): when, style, size, the 3D item, item ID check
  RainFx.lua               "Loot rain" page (native): when, where, afterwards, effects by group, tests
  Pages.lua                "Sounds" (popup sound picker) and "Advanced" pages (native)
  Assets.lua               "Blizzard assets" sub-page + /dl assets: checks and previews game models,
                           textures, sounds, fonts (docs/design-review.md)
  Media/*.tga, *.ogg       original art (tools/gen_textures.lua, white, tinted in game) and sounds
                           (tools/gen_sounds.sh, ffmpeg-synthesized)
docs/plan.md             design, data model, roadmap, rain ideas
docs/mockups/            HTML mockups (rain.html: the rain prototype, same physics, effect toggles)
docs/STATE.md            session handoff
tools/                   gen_textures.lua, gen_sounds.sh, test_*.lua (run by wow-preflight)
deprecated/chest-show/   the set-aside chest show (Rain.lua as of 0.4.5, media, README); not loaded
deprecated/toast/        the set-aside Toast popup style (View.lua as of 0.4.13, an unfinished diff, README)
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
  feel); deferred in combat. The loot flies up from the ground by default (setting `rainFrom`). The chest
  show (containers, shake, rarity tease) was set aside 2026-10-14: `deprecated/chest-show/`, not loaded.
- Seen set and loot history per character; settings account-wide. No login toast.
- **Settings layout** (0.4.15, from docs/mockups/settings.html): pages Dopamine Loot (3 main switches, quick
  tests), Popups (custom), Loot rain, Sounds, Advanced (native), Blizzard assets (custom tool). One topic
  per page: on/off, when, look, test. Native unless a page needs a live preview.
- **Settings page parity** (kit house-style): every `/dl` command that changes a setting or runs a
  test also has a control on the settings page (number field or drag slider, choice, Test button);
  visual settings update a live preview on the page.
- Popup styles Relic (default) / Beam / Banner (Halo lens dropped 0.4.7; the Toast style set aside 0.4.14:
  `deprecated/toast/`, README lists what needs work)
  are all options; weapons stand upright
  (`Model:SetPitch`, not SetRoll). Arrivals by rarity play in every style: Rare a burst of sparks,
  Epic adds star4 glints, Legendary more of both plus two shockwaves and embers (picked in
  docs/mockups/popups.html). Items sway; Epic+ turn once first. Keep popup animations simple.
- Visual changes: show mockups first, the user picks, then build. Generated art comes from
  `tools/gen_textures.lua` (check it rendered with ffmpeg before pushing).
- Assets: Blizzard's game assets (models, textures, icons, sounds, referenced by path or ID) and our
  own generated ones are both fine; pick what fits. **When designing, present both as options**
  (custom vs. Blizzard asset for each piece) and let the user choose. Never ship files we didn't make
  (no extracted game files or other addons' media in `Media/`). Models driven by hand in `OnUpdate`,
  set after `Show()`, no AnimationGroups.

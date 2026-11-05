# Dopamine Loot

Loot that feels like loot. A World of Warcraft addon for **WoW: Forever** (Interface `16001`).

- **Loot popups**: each item you loot shows up beside your character as a card, with the item turning in
  3D. Rare, Epic and Legendary items arrive with sparks, glints and shockwaves. Three styles: Relic,
  Beam and Banner.
- **Loot rain**: loot three or more things at once, a pile of money or a quest reward, and it all bursts
  up from the ground, bounces and settles, with the best item landing last. Coins merge into silver and
  gold, Rare+ items get a light beam, and everything gathers into your bag.
- **Sounds**: a sound per rarity (the game's own, picked by ear) plus coin and launch sounds that climb in
  pitch as the loot keeps coming.

It stays out of the way: common loot and loot in combat come as one compact line, clicks pass through
the popups, and the rain waits until the fight is over.

## Install

Download `DopamineLoot-v<version>-forever.zip` from the
[releases](https://github.com/Bempis-linux/wow-forever-addon-dopamine-loot/releases) and unzip it into
`World of Warcraft\_forever_\Interface\AddOns\`, so that you have `AddOns\DopamineLoot\DopamineLoot.toc`.
Then restart the game (or `/reload` if it is already running).

## Use

Type `/dl` (or go to **Options > AddOns > Dopamine Loot**). Everything is on the settings pages, each
with Test buttons:

| Page | What's there |
|---|---|
| Dopamine Loot | switch popups, the rain and sounds on or off; quick tests |
| Popups | when they show, style, size, placement, the 3D item, with a live preview |
| Loot rain | when it rains, where the loot flies from, every effect as its own switch, tests |
| Sounds | the sound for each rarity (Play to hear it), our chime for Rare and up |

## Bugs and ideas

Open an issue on GitHub. Say what you looted and what you saw (a screenshot helps), and paste any Lua
error (BugSack shows them).

## Development

Built with the [wow-addon-kit](https://github.com/Bempis-linux/wow-addon-kit) Claude Code plugin. Design
and roadmap: [docs/plan.md](docs/plan.md). Releases are built by the BigWigs packager
(`.pkgmeta`, `.github/workflows/release.yml`) when a `v*` tag is pushed. MIT license.

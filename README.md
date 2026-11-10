# Dopamine Loot

Loot that feels like loot. A World of Warcraft addon for **WoW: Forever** (Interface `16001`).

- **Loot popups**: each item you loot shows up beside your character as a card, with the item turning in
  3D. Each rarity arrives with its own show, picked on the Arrivals page: fireflies or an emerald flare for
  green, a sapphire flare or an aurora for blue, an implosion, eclipse or starfall for purple, and for a
  Legendary the screen dims and a comet streaks down before a supernova. Styles: Relic, Beam, Banner,
  Splash, Aura, Achievement, Rune decode and Forged letters.
- **Loot rain**: loot several things at once, a pile of money or a quest reward, and it all bursts up and
  settles: as a Fountain, a Quick burst or a Big bang from the middle of the screen. The best item gets a
  finale and slams down, harder the rarer it is. Coins merge into silver and gold, Rare+ items get a light
  beam, everything gathers into your bag (one by one, or in one quick vacuum) and a money tally counts it
  up above the bag.
- **Sounds**: a sound per rarity (the game's own, picked by ear) plus soft thuds, a pouch and coins for the
  rain, moving gently in pitch as the loot keeps coming.
- **Gathering**: every herb, ore, fish or skin bursts where you gathered it, with its own sound, and flies
  into a harvest window that tallies the session by profession (pace, worth, full stacks). Rare finds get
  their own moment. It calms down by itself on long farming runs.
- **Crafting**: while you craft, a small touch of your profession plays by your cast bar (punches in a
  leather strip, a potion boiling over, stitches and a snip, gears, a sizzle and a flip, hammer taps, runes,
  a green plus) and lands when the item is made. A Create All drops every item into a growing pile under the
  profession window.
- **Skill-ups**: a banner with your new skill and a bar toward what's next, made of the profession's
  material with a little tool that moves (or a simple bar, if you prefer), and a reveal when you can gather
  something new.
- **Bulging bag**: when your bags are nearly full, the backpack button swells with each item and creaks;
  when full, items bounce off a padlock.
- **Side column**: small loot lists as rows under "Picked up" instead of popping up. Popups, the column and
  the skill-up banner can be dragged where you want them (Move frames).

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
| Dopamine Loot | switch each feature on or off (popups, rain, side column, gathering, crafting, skill-ups, bag, sounds); move frames; quick tests |
| Popups | when they show, style, size, placement, the 3D item, the Legendary moment, with a live preview |
| Arrivals | how each rarity arrives, with a Test button for each |
| Loot rain | when it rains and what rains, where the loot flies from, every effect as its own switch, tests |
| Sounds | the sound for each rarity (Play to hear it), our chime for Rare and up |
| Professions | the harvest window, notes and calm for gathering; the Create All pile; the skill-up bar look; tests for all of it |

## Bugs and ideas

Open an issue on GitHub. Say what you looted and what you saw (a screenshot helps), and paste any Lua
error (BugSack shows them).

## Development

Built with the [wow-addon-kit](https://github.com/Bempis-linux/wow-addon-kit) Claude Code plugin. Design
and roadmap: [docs/plan.md](docs/plan.md). Releases are built by the BigWigs packager
(`.pkgmeta`, `.github/workflows/release.yml`) when a `v*` tag is pushed. MIT license.

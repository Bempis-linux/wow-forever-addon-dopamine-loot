# Dopamine Loot


## 1.0.2 (unreleased)

- Internal cleanup: code left over from the old chat commands removed. Nothing changes in game.
## 1.0.1 (2026-11-05)

- **Fixed:** errors from the game's own nameplates, health bars and settings that blamed Dopamine Loot
  ("execution tainted by DopamineLoot"). They could start after opening Dopamine Loot's settings and
  then using the game's settings, nameplates in particular. Dopamine Loot's settings pages are now built
  entirely from its own frames and no longer touch the game's settings list.
- The settings pages look and work as before. They no longer appear in the Options search box.

## 1.0.0 (2026-11-04)

The first release, for WoW: Forever.

- **Loot popups**: a card beside your character for each item you loot, with the item turning in 3D
  (weapons, shields, helms, shoulders and more; other items as a tilting card). Three styles: Relic,
  Beam, Banner. Rare, Epic and Legendary items arrive with sparks, glints and shockwaves. Common loot
  and loot in combat come as one compact line. Clicks pass through; hover to hold a card.
- **Loot rain**: loot three or more things at once (or a good amount of money, or a quest reward) and it
  bursts up from the ground, bounces down and settles, with the best item landing last. Coins merge
  into silver and gold and twinkle where they lie, Rare+ items get a light beam and their name, gray
  junk lands dull and heavy, and everything gathers into your bag. Items wear the game's own bag
  border, and a faint line of light marks the ground. It waits until combat is over. Press Escape to
  skip it.
- **Sounds**: a sound per rarity from the game's own sounds, picked by ear on the Sounds page, with our
  own chime for Rare and up; coin, launch and merge sounds in the rain that climb in pitch.
- **Settings** (Options > AddOns > Dopamine Loot, or `/dl`): the main switches and tests; Popups with a
  live preview; Loot rain with every effect as a switch; Sounds. `/dl` is the only command.

# Dopamine Loot

## 1.1.0 (unreleased)

- **Loot rain flair**: a wind-up glow and burst before the loot comes out, in the color of the best item; the
  best item hangs at the top with a glint and slams down; Rare and better land with a shockwave and sparks in their
  color; the bag takes each item in with a little flash. Each is a switch on the Loot rain page.
- **Loot rain sounds**, picked by ear: items land with a soft thud and a light puff of dust, Rare and Epic
  with a soft note on top; into the bag, a soft pouch and a coin settling in. They move gently up and down
  in pitch, every sound has two variants, and a fast rain thins its sounds out instead of rattling. The best
  item's slam has its own boom. A soft chord at the end is a switch (off by default). Shockwaves rise from
  the ground as half circles.
- **Popup flair**: popups punch in with a little overshoot; a light sweeps once across the name (twice for a
  Legendary); Relic and Beam names sit on a soft dark plate with a thin underline in the item's color. A
  **Legendary moment**: the screen dims, a comet streaks down onto the popup and it lands in slow motion
  (Popups page: Legendary; never in combat).
- **Popups and the rain filter separately**: "Show popups for" (Popups page) now only affects popups; the new
  "Rain includes" (Loot rain page, default everything) decides what rains, so gray and white loot rains
  again. Turning popups off no longer stops the rain. The 3D "Item size" slider now grows to the right.
- **The best item's drop by rarity**: gray and white best items just land; from green up the best hangs and
  slams down, longer and harder the rarer it is, with a comet trail from Rare and a bigger shockwave, more
  sparks and more shake for Epic and Legendary.
- **Money tally**: the rain's money total and item count sit right above your bag and count up as things go
  in, popping with each coin as a glint zips into it; at the end the total punches up and a shimmer runs
  across it, with a gold glow from 1 gold and a burst of sparks from 10 gold.
- **Calm when repeated**: a few rains with nothing Rare or better within two minutes get quicker and use fewer
  sounds (a switch under When). Rare and better always get the full show.
- **Settings reworded**: every label and tooltip says plainly what it does; the Popups page labels show their
  tooltip too, and the preview buttons have one.
- Test popups no longer show a gray "preview" tag.
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

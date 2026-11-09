# Dopamine Loot

## 1.2.0 (2026-11-09)

New ways for the loot rain to play out, three new popup styles, and a cleaner look for the item level.

- **Loot rain animations** (Loot rain page, "Animation"):
  - **Fountain** (default): the loot sprays up one piece after another, as before.
  - **Quick burst**: a short Fountain. Everything blows up at once in an even fan, and lands in a neat row.
  - **Big bang**: a point of light swells in the middle of the screen, then bursts. The loot flies out in an
    even ring, bounces off the screen edges and settles into a neat row, while the best item waits in the
    glowing core until the rest has landed, then drops and slams down.
- **Finale for the best**: replaces "Hang time for the best" and covers every animation (your old choice
  carries over).
- **Vacuum** (Loot rain page, "How it gathers"): instead of one by one, everything trembles for a moment and
  is sucked into your bag in one quick wave, with one gulp at the end. Quiet on calm repeats.
- **New popup styles**: **Achievement** (a round emblem opening into a rounded bar, with a rarity gauge and
  the item level in a badge), **Rune decode** (the name's letters start as glowing runes and settle into
  letters) and **Forged letters** (each letter struck white-hot, cooling to its color, with sparks).
- **Item level**: Relic, Beam and Aura show it in a gap in the line under the name, with the rarity and the
  type below; Splash shows it in a slanted block cut into its banner.
- **Reverse disintegration** is back as a Rare arrival: specks of light gather and the item fades in.
- Fixes: an item shown as an icon now sits in the middle of the Achievement emblem; a few rain sounds and
  flashes now respect the calm and slow-motion switches.

## 1.1.0 (2026-11-06)

The flair update: new popup arrivals and styles, a livelier loot rain with new sounds, and clearer settings.

- **Popup arrivals by rarity** (new Arrivals page: a choice per rarity, each with a Test button):
  - Uncommon: Fireflies, Emerald flare or Geyser.
  - Rare: Sapphire flare, Aurora arch or Light pool, each with a ring wave.
  - Epic: Implosion and galaxy, Eclipse or Starfall. Epic and Legendary names stamp in letter by letter.
  - Legendary: Supernova, Meteor shower or Golden seal, after the comet of the Legendary moment.
  - Or Simple sparks, for a quieter popup.
- **New popup styles**: **Splash** (a slanted banner slashes in behind a big name with speed lines, a shine
  and a rarity stamp; a crossing banner for Epic, gold trim for Legendary) and **Aura** (soft wisps of light
  rise behind the item).
- **Legendary moment**: the screen dims, a comet streaks down onto the popup and it lands in slow motion
  (Popups page: Legendary; never in combat).
- **Popup flair**: popups punch in with a little overshoot; a light sweeps across the name; Relic and Beam
  names sit on a soft dark plate with a thin underline in the item's color. Long weapons are no longer cut
  off. The 3D "Item size" slider now grows to the right.
- **Loot rain flair**: a wind-up glow and burst before the loot comes out, in the color of the best item;
  Rare and better land with a shockwave rising from the ground and sparks in their color; landings squash
  and spring back; the bag takes each item in with a little flash. Each is a switch on the Loot rain page.
- **The best item's drop by rarity**: gray and white best items just land; from green up the best hangs at
  the top and slams down, longer and harder the rarer it is, with a comet trail from Rare and a bigger
  shockwave, more sparks and more shake for Epic and Legendary.
- **Loot rain sounds**, picked by ear: items land with a soft thud and a light puff of dust (Rare and Epic
  with a soft note on top); into the bag, a soft pouch and a coin settling in. They move gently up and down
  in pitch, every sound has two variants, and a fast rain thins its sounds out instead of rattling. The best
  item's slam has its own boom. A soft chord at the end is a switch (off by default).
- **Money tally**: the rain's money total and item count sit right above your bag and count up as things go
  in, popping with each coin; at the end the total punches up and a shimmer runs across it, with a gold glow
  from 1 gold and a burst of sparks from 10 gold.
- **Popups and the rain filter separately**: "Show popups for" (Popups page) now only affects popups; the new
  "Rain includes" (Loot rain page, default everything) decides what rains, so gray and white loot rains
  again. Turning popups off no longer stops the rain.
- **Always rain for** (Loot rain page, off by default): loot with an item of the picked rarity or better
  always rains, even a single item, so it gets its full show.
- **Calm when repeated**: rains with nothing Rare or better, a few within two minutes, get quicker and use
  fewer sounds. Rare and better always get the full show.
- **Tests**: the test rain lets you pick its best item's rarity, and a new test replaces a rain that's still
  running instead of joining it.
- **Settings reworded**: every label and tooltip says plainly what it does.

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

# Dopamine Loot style guide

Written 2026-11-12 for the 1.4.0 cohesion pass: every piece of UI should read as one addon, not "a hodge
podge of random features" (the user). It records what's been picked so far and, marked **Decide**, where the
shipped 1.3 UI and the 1.4 designs disagree. Nothing changes in game until the user picks (docs/plan.md,
"Cohesion pass"). The overview mockup is `docs/mockups/cohesion-r1.html`.

## The theme in one line (2026-11-14)

**The game's own interface, quietly made to feel earned.** The user asked for words on the theme; this is the
test a new design must pass (round 3 of skill-ups: a puzzle assembling was "a little too playful", a rubber stamp
"cool but not quite the theme").
- **It belongs to the game**: the game's golds, fonts, item icons, coins and dark gold-lined panels; it looks like
  something Blizzard could have shipped, never a toy laid on top.
- **Craft and material**: progress is made of the work itself (heated iron, thread, liquid, stone); tools act,
  beats land like real hits.
- **Light and sound carry the reward**: rings, glints, ripples, chimes; simple shapes, not drawn props.
- **Satisfying, not silly**: weighty and restrained; it calms down over long sessions and in combat; it adds to the
  game's systems, never turns them into a gamble.

## Principles (from the user's picks)

- **A supplement to the game's own systems.** Effects celebrate what the game already gave you; no lottery or
  chance metaphors (memory: no card flips).
- **Info in one place.** If the game already shows something (the XP bar, the rep bar, the cast bar), our
  effects live on it, not in a second spot.
- **Simple shapes.** Lines, dots, rings, glints and real item icons; no drawn objects (memory).
- **Calm repeats, big milestones.** Repeated things get quieter (sounds step down, kills stay light); rare
  things (quests, a level, a dungeon cleared, a 10th level) get the full show.
- **Stays out of the way.** Popups to the right of the character, our panels movable (Move frames), nothing
  over the action bars in combat.

## Shapes

- **The Ring family** is the addon's signature, used for skill-ups (Ring + road), the ring at the XP bar's
  end, faction rings, the level-up halo (Ascension) and the "Dungeon cleared" medallion. One recipe:
  a dark disc behind; a faint full track; the arc in the system's color filling clockwise from the top; a
  bright head dot while it moves; a white flash and a shockwave ring when it closes.
- **The road**: a thin line with stops (rings) along it: the next unlocks (skill-up), the standings (rep),
  the bosses (recap timeline), the decades (Cinematic level-up).
- **Glints**: four-point stars, never larger than the thing they sit on.

## Color

| Role | Color | Notes |
|---|---|---|
| Item quality | the game's quality colors | always for item names and icon borders |
| Our accent gold | `#ffd36a` (1, 0.83, 0.42) | rings, roads, CLEARED, records, money |
| The game's label gold | `#ffd100` (1, 0.82, 0) | only where we echo the game's own text |
| XP | purple `#a35cf0`, light `#dcb8ff`; rested blue `#4f8ae6` | everything XP and level |
| Reputation | the standing's color (green family, Exalted gold); losses dim red | |
| Professions | each profession's color (Skill.lua) | skill-ups, crafting, gathering |
| Panels | near-black `rgba(8,8,12,.9)` | see Panels |
| Text | warm white `#e8e2d0`, muted `#9a927e` | |

**Decided (golds, 2026-11-12):** two only: our accent gold `#ffd36a` and the game's label gold `#ffd100`.
The code's other golds (`1,.83,.29`, `1,.85,.4`, `1,.82,.48`) move to the accent gold.

## Money

**Rule (the user, 2026-11-12):** money is always shown the way the game's bags show it: the number, then the
coin, for each denomination, e.g. `2 [gold coin] 39 [silver coin] 53 [copper coin]`. Never "2g 39s 53c".
In game: `GetCoinTextureString(copper)` (or the game's gold, silver and copper coin icons next to the
numbers); leave out leading zero denominations as the game does. Applies everywhere: the loot rain's tally,
the recap, rows, tooltips, settings. Mockups draw small coins in the game's colors.

## Type

| Use | Font in game | Mockup stand-in |
|---|---|---|
| Item names, big titles (popup name, dungeon name, level number) | Morpheus (`TITLE_FONT`) | Georgia |
| Labels, numbers, counters, rows | Friz Quadrata (the game's UI font), OUTLINE over the world | system sans |
| Small caps labels (LEVEL, CLEARED, BEST DROP) | Friz Quadrata, wide letter spacing | system sans, letter-spaced |

**Decided (titles, 2026-11-12):** Morpheus only for item names and the two biggest titles (the dungeon
name, the level number); everything else in Friz Quadrata.

## Panels

Three styles exist today:

1. **Tooltip box**: the game's tooltip border on dark brown (the Create All tray, the Popups page preview box).
2. **Fading rows**: black rows fading to the right with a color stripe (harvest window, side column
   "Picked up", the rep Picked-up rows).
3. **Dark rounded panel with a gold hairline** (the 1.4 designs: the skill-up pill, the level-up column,
   the recap strip, the Final medallion).

**Decided (panels, 2026-11-12):** (3) for anything that is a panel or a banner, (2) for lists of rows,
(1) retired: the Create All tray (and the Popups page preview box) restyled as (3).

## Motion

- **Pop**: a quick overshoot (ease-back) when something arrives; counts punch when they finish.
- **Shockwave**: a white ring plus one in the system's color when a ring closes or a milestone lands.
- **Counting up**: numbers roll (digits that change roll up) or climb; never jump.
- **Impact** (quest turn-ins, the best drop): a freeze-frame of about 70 ms, a small shake, a low thump. Rare.
- Durations: a kill's effect under 1 s; a skill-up or rep banner about 3 s; a recap about 6.5 s; a milestone
  level-up up to about 9 s.

## Sound

- Soft taps and chimes climbing in pitch for repeats; quiet copies after the first few (Create All, kills).
- One reward chime at a time ("Calm when busy", still open for XP; maybe addon-wide).
- No level-up or quest sounds of our own (the game plays its own); the impact thump is the exception for
  punch on quest turn-ins.

## Decisions (cohesion pass, agreed by the user 2026-11-12)

1. Two golds (Color).
2. Morpheus for item names and the biggest titles only; Friz for the rest (Type).
3. One panel family; the Create All tray and the Popups page preview restyled (Panels).
4. Every Ring-family piece drawn from the same recipe (Shapes).
5. Money shown with the game's coins, as in the bags (Money).

To build in 1.4.0 (the 1.3 pieces that change): the tray's panel, the gold values in code, the money text in
the loot rain's tally, any serif titles in the 1.4 pieces (they become Friz).

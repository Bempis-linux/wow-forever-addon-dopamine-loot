# The chest show (set aside 2026-10-14)

Not loaded by the addon and not shipped: kept so the work isn't lost if we pick it up again.

The user found the chest, pouch, shake, rarity tease and lid burst "a bit much", and preferred the loot
flying up from the ground (0.4.6, setting `rainFrom`). What was built, 0.4.0 to 0.4.5:

- **Containers**: a loot pouch for small hauls, the treasure chest for bigger ones (medium: quick pop;
  big = any Rare+: it shakes, the light in its seams climbs white → green → blue → purple to the best
  item with a chime each step, then the lid bursts off with rays), the golden chest for a Legendary.
- **Drawn** (0.4.0): layered 128-unit textures tinted in game (`Media/Chest*`, `Pouch*`, `Rays`).
- **Game models** (0.4.3, picked by the user on the Blizzard assets page): sack 200442, Strongbox
  219372, large ornate chest 200953 (camera distance 2.6, a big model). Chest lid animations: 0 shut,
  148 opens, 149 holds open (146 closes, 147 holds shut). Verified in game.
- **Loot leaving the container** (0.4.5): starts inside the mouth, behind the container until it
  crosses the mouth, growing from 0.3 (never verified in game).
- **Sounds**: `ChestRattle1-3`, `Tease00-05`, `ChestBurst`, `ChestBurstGold`, `PouchPop`.

## Files

- `Rain-0.4.5.lua`: the whole `DopamineLoot/Rain.lua` as of 0.4.5 (commit e956c6a), chest show
  included. The pieces: `Core.BoxPlan`; the "chest show" section (`GAME_BOX`, `MakeBox`, `HideBox`,
  `LoadGameBox`, `WarmGameBoxes`, `SetUpBox`, `Rattle`, `OpenBox`, `UpdateBox`, `DrawGameBox`,
  `DrawBox`); `MOUTH_HALF`/`INSIDE` in `Launch`; the `RAIN_FX` switches Chest, Models, Shake, Tease,
  Burst; the box branch in `ns:Rain` and `Update`; the layer's OnShow model reload.
- `Media/`: the textures and sounds above. `tools/gen_textures.lua` and `tools/gen_sounds.sh` still
  generate them, into this folder.
- Their offline tests (`Core.BoxPlan`) are in git history: `tools/test_rain.lua` at e956c6a.

To bring it back: diff `Rain-0.4.5.lua` against the current `Rain.lua`, move the media back into
`DopamineLoot/Media/` (full game restart), and launch from the container instead of `rainFrom`.

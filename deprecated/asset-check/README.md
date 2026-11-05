# The asset check and the armor probe (set aside 2026-11-04, for 1.0)

Not loaded by the addon: developer tools, taken out of the release so players never see them.

## Files

- `Assets-0.4.23.lua`: `DopamineLoot/Assets.lua` as of 0.4.23. To use it again, copy it back into
  `DopamineLoot/`, add `Assets.lua` as the last line of `DopamineLoot.toc`, put the "Blizzard assets"
  button back on the Advanced page (Pages.lua, `ns:OpenAssets()`), and remove the line in Core.lua
  `InitDB` that clears `DopamineLootDB.assetCheck` and `armorTest`.
  - `/dl assets` and the "Blizzard assets" settings sub-page: checks which of the game's models,
    textures, atlases, fonts and sounds exist on this client and shows or plays each one. Results went to
    `DopamineLootDB.assetCheck`. What it found is in `docs/design-review.md`.
  - `/dl armortest [chest | legs | ... | itemID] [dressed]`: a probe for body armor on a mannequin
    (DressUpModel). Left: the full body; right: a close-up of the slot.

## What we know about armor on a mannequin (Forever 1.60.1, beta)

- Every DressUpModel method exists, and so does ModelScene. There is no `SetCustomRace`.
- `SetAutoDress(false)` gives a bare body.
- `TryOn` reported success but nothing showed, because the geometry wasn't loaded yet (`IsGeoReady` was
  false at `OnModelLoaded`). 0.4.23 waited for `IsGeoReady` before dressing; it was never run in game.
- `SetPosition` z: a positive value lifts the body; the full view centers on the hips.

The user dropped the 3D armor view on 2026-11-04 (before 1.0). Body armor keeps the tilting card.

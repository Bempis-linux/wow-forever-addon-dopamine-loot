# The Toast popup style (set aside 2026-10-14)

Not loaded by the addon: kept so it can be picked up again. A popup style built from the game's own
loot toast art (it replaced the Halo lens style in 0.4.7). A saved "toast" style now falls back to
Relic.

## Files

- `View-0.4.13.lua`: `DopamineLoot/View.lua` as of 0.4.13, toast included. The pieces: the
  `TOAST_*` constants and `ns.ToastAvailable`, the `toast` entries in `ns.STYLES` and `LAYOUT`,
  `toastBg`/`toastGlow`/`sheen`/`card.border` in `CreateView`, the `toast` branch in `Layout`, the
  toast blocks in `SetItem` (frame, border, label line, badges) and `Tick` (glow flare, sheen sweep),
  and the icon-only check at the top of `SetModel` (`L.icon`). Look.lua listed it only when
  `ns.ToastAvailable()`.
- `unfinished-0.4.14.diff`: the next attempt, never tested: one frame for every rarity, a stack
  count on the icon, "crafted"/"received"/"preview" on the label line only when they fit.

## What we know (Forever client 1.60.1)

- Blizzard's layout (LootWonAlertFrameTemplate, `AlertFrameSystems.xml` in the API annotations):
  frame 276 x 96; icon 52 x 52 at (22, -23) from the top left; label line at the icon's top right
  (+7, +5), 167 x 16; item name at (+10, -19) from the icon's top right, 167 x 33, two lines,
  centered vertically; glow `loottoast-glow` 286 x 109; sheen 171 x 75 sweeping +165 px.
- Atlas sizes on this client (from `/dl assets`): `LootToast-LessAwesome` 276 x 80,
  `LootToast-MoreAwesome` 276 x 96, `loottoast-glow` 285 x 105, item borders 58 x 58,
  `loottoast-sheen` 171 x 75.
- The default toast frame is a slice of `Interface\LootFrame\LootToast` (retail coordinates
  0.2822, 0.5518, 0.5781, 0.9531); **on Forever that slice draws a broken bar**: the file's layout
  differs.
- Borders by quality: the game's `LOOT_BORDER_BY_QUALITY` atlases (`loottoast-itemborder-white`,
  `-green`, `-blue`, `-purple`, `-orange`).

## What needs work

1. **The two frames have different inner boxes**: the gold MoreAwesome frame's dark box is smaller
   and its border thicker, so Blizzard's text positions don't fit it (the name ran to its edges).
   Either use one frame for all rarities (the plain one stretched to 276 x 96 looked right in game,
   0.4.12) or give each frame its own text positions, measured from a screenshot.
2. **Drawn at its native 276 x 80 the plain frame** no longer matched the 96-tall text positions
   (0.4.13 looked worse); stretched to 96 it looked right.
3. **The label line is narrow (167 px)**: details plus badges don't fit; shrinking the font made it
   unreadable. Put a stack count on the icon (as the game does) and drop the other badges when
   they don't fit.
4. Check every rarity by clicking through them in the Popup look preview, and a long name
   (Thunderfury) before calling it done.

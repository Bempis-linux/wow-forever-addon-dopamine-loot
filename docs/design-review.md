# Design review: custom vs. Blizzard assets (2026-10-12)

Every visual and audio piece of Dopamine Loot, what it uses now, and the Blizzard asset that could replace or
join it (house-style "Assets: custom vs. Blizzard"). The user picks per row; the picks go into `plan.md`.

Evidence comes from the wow-api-researcher pass (annotations plus addons that load on Forever: ATT's
Forever DB, Questie, Details, Baganator). **[V]** means unproven on Forever: the in-game asset check
(proposed below) settles it. Every Blizzard asset keeps our custom one as its fallback.

## Picks and findings (2026-10-12, after the in-game asset check)

- **Containers (built in 0.4.3, switch "Game chests (3D)")**: loot pouch → sack model **200442**
  (Stolen Supply Sack); treasure chest → **219372** (Strongbox); golden chest → **200953** (large ornate
  chest). Our drawn containers stay as the fallback and behind the switch.
- **Chest animations** (seen on Footlocker A): 146 closes, 147 does nothing visible (held shut),
  148 opens; 149 untested (assumed held open). Chests stand shut on 0. Sacks, one lockbox, one
  footlocker and the barrow cache have no animations; 219372 and 200952 also have 153/154.
- **Client facts**: every listed texture and atlas exists (including the retail loot-toast,
  LegendaryToast, BonusChest and bags-glow atlases); all fonts but Nimrod; all 25 sound kits are in
  the table; the 3 mission-chest creature displays don't load.
- **Sounds**: the user likes most of them but **no level-up or quest sounds** (they'd be confused
  with the real events). The user prefers not to describe sounds one by one: offer Blizzard sounds as
  choices with Play buttons on the settings page (settings cleanup) instead.
- Still open: sparkles (star4), counter font (SKURRI), a "Blizzard toast" popup style, bags-glow
  on rain icons.

## Animation

| Piece | Now (custom) | Blizzard option | Recommendation |
|---|---|---|---|
| Chest opening | Layered flat textures; the lid is moved by hand | A real 3D chest (`PlayerModel:SetModel(fileID)`) with its **own open animation** (`SetAnimation`; Blizzard's mission chest uses 148 = closed, 154 = opening, 0 = idle after). [V] the IDs per model with a `HasAnimation` scan | **Blizzard model**; keep our shake (moving the frame by hand), seam light and rays as overlays |
| Shake / squash / physics / flips | By hand in `OnUpdate` | None (Blizzard has no physics to borrow) | Keep |
| Spell effects | Our glows and waves | `ApplySpellVisualKit` (low confidence: probably needs a creature model); effect model 382335 (Eastern Plaguelands beam, the "victory fanfare" beam) [V] | Try 382335 only for the Legendary reveal; skip spell kits |

## Art

| Piece | Now (custom) | Blizzard option | Recommendation |
|---|---|---|---|
| Treasure chest | ChestBody/Lid/Bands/Lock/Planks/Seam textures | Models from ATT's Forever DB: **196976** (Sunken / Pitted Iron Chest, 43 objects use it), **196979** (Locked / Ornate Chest), **219372** (Alliance Strongbox) [V] | Model, picked in game from these three |
| Golden chest (Legendary) | The chest tinted gold | **200953** (Shadowforge Cache, Treasure of the Shen'dralar: the large ornate one) [V] | Model, so it's a different chest, not a recolor |
| Loot pouch (small hauls) | PouchBody/Mouth/String/Shade textures | Sack models **200442** (Stolen Supply Sack), **197608**, **190015** [V]; or the bag icon `INV_Misc_Bag_*` | Sack model if it reads well at small size; else keep ours |
| Coins | Already Blizzard (`UI-GoldIcon` etc.) | No coin-pile model exists | Keep |
| Light rays behind the chest | Rays.tga (rotated, tinted) | `UI-Achievement-Alert-Glow` (big flash), retail `BonusChest-OrangeGlow-Wide` atlas [V] | Keep ours (it rotates and tints); add the achievement glow as the burst flash |
| Sparkles / motes | Mote.tga | `Interface\Cooldown\star4` (Blizzard's sparkle star, ADD blend; proven) | **Blizzard**: star4 for sparks, it reads as "WoW" instantly |
| Rain icon border | Already Blizzard (`UI-ActionButton-Border`) | `bags-glow-green/blue/purple/orange` atlases (the bag "new item" glow, proven via Baganator) | Try bags-glow for Uncommon+ |
| Loot beam (resting Rare+) | Pillar.tga | Effect model 382335 [V]; one model per beam is costly | Keep ours; the model only on the best item, if at all |
| Screen-edge glow, vignette, shadows, dust, trails | Our textures | Nothing fitting | Keep |
| Popup styles (Relic, Beam, Halo lens, Banner) | Our textures | A fifth style **"Blizzard toast"** from the retail loot-toast atlases (`LootToast-MoreAwesome`, `loottoast-glow`, `LegendaryToast-*`) [V: may be missing on Forever] | Add it as an option if the atlases exist; keep Relic as the default |
| Icon/quality frame on cards | Our edge texture | `Interface\COMMON\WhiteIconFrame` tinted by quality (proven) | Either; Blizzard is cheaper to keep consistent |

## Sound

| Piece | Now | Blizzard option | Recommendation |
|---|---|---|---|
| Tier sounds (popup) | Already Blizzard kits, falling back by tier; which ones play on Forever is **still unknown** (`/dl sounds` never run) | Classic-era kits that surely exist: `LOOT_WINDOW_COIN_SOUND`, `IG_BACKPACK_COIN_OK`, `IG_QUEST_LIST_COMPLETE`; quest-complete file 567439 (proven via Questie) | Run `/dl sounds` first, then decide |
| Arrival sounds (Rare/Epic/Legendary) | Our synthesized OGGs | Retail toast kits (`UI_EPICLOOT_TOAST`, `UI_LEGENDARY_LOOT_TOAST`) [V] | Option per tier in the sound picker |
| Chest opening (big haul) | Blizzard kit chain (`UI_STORE_UNWRAP` → garrison chest unlock → bonus roll end → backpack open) [V] | Same list; no chest-open sound file found | Keep, verify which one actually plays |
| Pouch pop, chest pop, rattle, tease, burst | Ours | None found | Keep |
| Rising-pitch sets (launch, clink, merge, ticks) | Ours: pentatonic climbs | Blizzard sounds can't change pitch | **Keep ours**: this is the core feel |
| Quest money rain | Our coin sounds | 567439 quest complete layered on the burst | Blizzard, layered |
| Gather into the bag | Gather.ogg | `IG_BACKPACK_OPEN`/`CLOSE` (proven); `C_Sound.PlayItemSound` = the item's own pickup sound (cloth, metal...) [V: needs the bag slot] | Try the item's own sound for the best item; backpack open as fallback |
| Level-up / achievement fanfare | Not used | Kits 888 / 12891, not in SOUNDKIT [V, low] | Candidate for personal records (0.4.1 hooks) |

## Design (type and frames)

| Piece | Now | Blizzard option | Recommendation |
|---|---|---|---|
| Title font | Already Blizzard: MORPHEUS.TTF | Fancy36/40Font | Keep |
| Counters (rolling total, streak x3) | Default font | `SKURRI.TTF` (Blizzard's big combat-number font) [V] | Blizzard: punchy numbers |
| Settings / log windows | Blizzard templates | | Keep |

## Proposed next step

An **asset check** before swapping anything: `/dl assets` and a Test button on the settings page (parity)
that loads each candidate (models by fileID, atlases, textures, sound kits, fonts) and logs found / missing,
plus a **model picker** on the effects page: shows each chest/sack model, its animation IDs, and Play buttons
for them, so the user picks the chests by eye. One in-game session settles every [V] above; then the chosen
swaps go in, each with our custom asset as fallback and a setting to switch back.

# Dopamine Loot — design & roadmap

Loot that *feels* like loot. When you pick something up, it pops onto the screen as a slowly spinning 3D
model with a quality-colored glow and a satisfying sound. Big hauls become a **treasure-chest show**: coins
and items spray out, bounce on an invisible trampoline, a counter climbs like a slot machine, and the best
item is revealed last. Any item (recent loot, or Alt+Right-click in your bags) can be opened in a
**Resident-Evil-style inspector**: drag to turn it, zoom, light it, read its tooltip.

| | |
|---|---|
| Client | WoW: Forever only (beta folder `_classic_beta_`, `## Interface: 16001`; release folder TBD at launch 2026-11-04) |
| Folder / TOC | `DopamineLoot/DopamineLoot.toc` (plain unsuffixed TOC, Forever only) |
| Slash | `/dl`, `/dopamine` (no collision among installed addons) |
| Saved data | `DopamineLootDB` (account: settings), `DopamineLootCharDB` (per character: seen items, recent loot, stats) |

Evidence key used below: **[A]** = in the Ketho API annotations (`~/.vscode/extensions/ketho.wow-api-0.22.3/Annotations/`,
retail 12.0.1); **[F]** = used by an addon that loads on Forever (16001) in `<client>\Interface\AddOns\`, or
verified in game by Loredex; **[V]** = unproven on Forever: verify in game with the `/dump` given.
`_reference/wow-ui-source` in the Loredex repo is empty, so Blizzard UI code was read from the annotations'
`FrameXML` folder.

---

## Goals

1. Make every worthwhile drop a small celebration, and a big haul a big one, without spamming trash.
2. Show the actual item in 3D wherever the client can, with a good-looking fallback where it can't.
3. Let you *look at* your stuff: an inspector you can turn in your hands.
4. Native presentation: Blizzard's own assets referenced by path/ID (models, textures, icons, sounds) or
   our own generated ones, whichever fits; design offers both. No shipped copies of game files or of art
   or audio from other games or addons.
5. Never get in the way: every popup/effect has an off switch, combat mode is calmer, nothing prints to
   chat except `/dl help`.

## Core concepts

| Term | Meaning |
|---|---|
| **Loot event** | One item (with count) or one money amount that *you* received. Source: `loot` (corpse/chest/fishing/roll won), `created` (crafting), `pushed` (quest reward, purchase, other "You receive item"), `money` |
| **Burst** | Loot events that arrive together (one loot window, one quest turn-in): collected for ~0.4 s, max 2 s |
| **Hype tier** (0-5) | How loud the celebration is. From quality, bumped by *new*, *upgrade*, *always-show* categories, vendor value. Drives sound, glow, rain behavior, screen flourish |
| **Popup** | Single-item card: model or spinning card, name in quality color, badges (NEW, UPGRADE, BoE, xN) |
| **Loot rain / chest show** | What a burst of 3+ shown items becomes (see "The chest show") |
| **Inspector** | Window with a big draggable 3D view, tooltip beside it, recent loot list |
| **Seen set** | Per-character set of item IDs this character has ever had (seeded from bags/bank/equipped) |

## Features (user's idea, all kept)

### 1. Loot popup with filters
A popup per shown item (or one merged card for a stack burst of the same item). Filters, all toggleable in
Settings (pure function in `Filters.lua`, offline-tested):

- **Quality threshold**: Poor / Common / **Uncommon (default)** / Rare / Epic / Legendary.
- **Only new**: never-seen item IDs for this character (seen set, seeded at first login so existing gear
  isn't "new").
- **Only upgrades**: see "Upgrade detection" (heuristic; the badge shows even when the filter is off).
- *Suggested filters*:
  - **Ignore**: quest items (`classID 12`), junk (gray), stackable trade goods/reagents (`classID 7` with
    stack > 1), consumables (`classID 0`), items bought from a vendor (`pushed` while a merchant is open).
  - **Always show** (overrides threshold and "ignore"): BoE of green+ (`bindType 2`), recipes (`classID 9`),
    mounts/pets (`classID 15`, subclass 5/2), bags (`classID 1`), anything with vendor value ≥ X.
  - **Whitelist / blacklist** by item ID (Settings list + `/dl watch|ignore <item>`); blacklist beats all.
  - **Money threshold**: coins only celebrate at ≥ X copper (default 1 silver); smaller money is silent.
  - **Only in instances** (`IsInInstance()` [A]) and **sources** (loot / crafted / quest rewards /
    purchases).
- Precedence: blacklist > whitelist > always-show > ignore rules > (threshold AND new-only AND upgrades-only).

### 2. 3D model in the popup
The item's model, slowly rotating (`SetFacing` in `OnUpdate`), on a quality-colored glow. Which items have a
model and how to show the rest: see "Showing items in 3D".

### 3. Loot rain, as a treasure-chest opening
User note: it should feel like **Vampire Survivors' treasure chest**: coins and items spraying and raining
down, slot-machine escalation, gold burst, rising-pitch sounds, a final reveal of the best item. We take the
*feel*, not the assets: all art is generated by our own tool scripts or is game UI referenced by path/ID,
all sounds are built-in game sound kits or original chimes we synthesize. See "The chest show" below.

### 4. Sound and presentation
Quality-tiered sounds, quality-colored glow/beam, screen flourish for epic+; sound picker per tier with Play
buttons (Loredex's Settings pattern); "Master channel" option so it plays with SFX muted (BugSack pattern).

### 5. Inspector
Open from the **recent loot list** or **Alt+Right-click** (changeable) an item in bags (also works on the character sheet and
chat links, since they go through the same hook). Drag to rotate, wheel to zoom, right-drag to pan,
turntable toggle, lighting presets, reset; tooltip beside the model; "Try on" for armor.

### Suggestions (mine, all optional)
- **Loot log / history** in the inspector's list (per character, newest 200, filterable by quality).
- **Session "dopamine meter"**: a small bar that fills with each celebration and decays; session summary
  (items, money, best drop) in the log window on `/dl stats`.
- **Best drop of the session** and **first-of-its-kind milestones** per character ("first blue!", "first
  epic!") get an extra flourish once.
- **Streaks**: combo counter for rapid loots (slot-machine multiplier on screen); a "dry streak" note ("37
  items since your last blue") in stats.
- **Share a drop**: a button in the popup/inspector inserts the item link into your chat edit box (you press
  Enter yourself; never auto-sent).
- **Screenshot mode**: `/dl shot` replays the reveal, hides the UI for a moment, calls `Screenshot()`
  [A][V], restores the UI.
- **Dungeon recap**: when you leave an instance, a chest show of everything good you got in the run.
- **Fatigue guard**: diminishing returns when many celebrations fire in a minute (smaller, quieter).
- **Accessibility**: reduced-motion mode (no shake, no rain physics, simple fade) and a "no screen flashes"
  switch (photosensitivity); both in Settings.
- `/dl test` previews (single, rain, chest, per quality), a Settings page in Options > AddOns, a minimap
  button + addon compartment entry, combat behavior options (see UI).

---

## Events and APIs (verified)

### Detecting received loot

| Source | Gives | Evidence | Use |
|---|---|---|---|
| `CHAT_MSG_LOOT` `(text, playerName, languageName, channelName, playerName2, specialFlags, zoneChannelID, channelIndex, channelBaseName, languageID, lineID, guid, ...)` | "You receive loot: [link]x3." etc., one line per item received, for loot window, rolls, quest rewards, purchases, crafting | [A] `Core/Data/Event.lua:309`; [F] `Questie/Modules/EventHandler/EventHandler.lua:347` (Questie_Camelot.toc = 16001), self check by name in `Questie/Modules/QuestieAnnounce.lua:216` | **Primary record source** |
| Global strings `LOOT_ITEM_SELF`, `LOOT_ITEM_SELF_MULTIPLE`, `LOOT_ITEM_PUSHED_SELF`, `LOOT_ITEM_PUSHED_SELF_MULTIPLE`, `LOOT_ITEM_CREATED_SELF`, `LOOT_ITEM_CREATED_SELF_MULTIPLE` | Localized templates ("You receive loot: %s.", "...: %sx%d.") | Not in the annotations, not used by installed addons. **[V]** `/dump LOOT_ITEM_SELF, LOOT_ITEM_SELF_MULTIPLE, LOOT_ITEM_PUSHED_SELF, LOOT_ITEM_PUSHED_SELF_MULTIPLE, LOOT_ITEM_CREATED_SELF, LOOT_ITEM_CREATED_SELF_MULTIPLE` | Build Lua patterns from them (escape magic chars, `%s`→`(.+)`, `%d`→`(%d+)`, try `_MULTIPLE` first). Matching a *self* template is itself the "is it me" check: other players' loot uses `LOOT_ITEM` ("%s receives loot") and never matches. Fallback if a global is nil: `text:match("\|Hitem:(%d+)")` + `x(%d+)`, with `guid == UnitGUID("player")` as the self check |
| `LOOT_READY(autoloot)` / `LOOT_OPENED(autoLoot, isFromItem)` + `GetNumLootItems()`, `GetLootSlotLink(i)`, `GetLootSlotInfo(i)` (icon, name, qty, currencyID, quality, locked, isQuestItem, questID, isActive, isCoin), `GetLootSourceInfo(i)` | The whole loot window up front | [A] `Event.lua:919-920`, `Wiki.lua:5481-5508, 5820`; [F] Loredex `World.lua:168` (verified in game), AllTheThings `Contributor.lua:4054` | **Pre-roll**: know the burst size immediately (start the chest's anticipation before items arrive); fallback record source if chat text is secret |
| `LOOT_SLOT_CLEARED(lootSlot)`, `LOOT_CLOSED` | A slot was taken / the window closed | [A] `Event.lua:923, 910` | Close the burst; confirm snapshot slots in the fallback path |
| `CHAT_MSG_MONEY` / `PLAYER_MONEY` + `GetMoney()` | Money looted | [A] `Event.lua:310, 1152`, `PlayerScriptDocumentation.lua:240`; [F] Questie `EventHandler.lua:270` | Money = `GetMoney()` delta while a loot window is open or ≤ 1 s after `LOOT_CLOSED`; quest money from `QUEST_TURNED_IN(questID, xp, money)` [F Loredex `Capture.lua:408`]. No string parsing needed |
| `ITEM_PUSH(bagSlot, iconFileID)`, `BAG_UPDATE(bagID)`, `BAG_UPDATE_DELAYED`, `BAG_NEW_ITEMS_UPDATED`, `C_NewItems.IsNewItem(bag, slot)` | Bag changes | [A] `Event.lua:135-141, 837`, `NewItemsDocumentation.lua`; [F] ATT `Quests.lua:2230` (BAG_NEW_ITEMS_UPDATED) | **Not** a record source (it would double count). `BAG_UPDATE_DELAYED` refreshes the seen-set seed and finds the bag slot of a new item (for "Inspect" → `ItemLocation`) |
| `QUEST_LOOT_RECEIVED`, `SHOW_LOOT_TOAST*`, `ENCOUNTER_LOOT_RECEIVED`, `LOOT_ITEM_ROLL_WON` | Retail personal-loot/toast systems | [A] only | Don't use: quest rewards and won rolls already produce `CHAT_MSG_LOOT` self lines; retail toasts are likely absent on Forever |
| Mail attachments | No chat line (as far as known) | — | Later: `hooksecurefunc("TakeInboxItem")`, reading `GetInboxItemLink` first. Off by default |

**Recommendation and dedupe**
1. One stream of loot events, from `CHAT_MSG_LOOT` self matches. Skip lines whose `text` is a secret value
   (`issecretvalue`; the 12.x restriction may be active in instances/combat: **[V]** log it in a dungeon).
2. `LOOT_OPENED` takes a snapshot `{slot → link, qty, quality, isCoin}`. Each chat event *claims* the first
   unclaimed snapshot slot with the same item ID and count. At `LOOT_CLOSED` + 0.5 s, snapshot slots that
   were cleared (`LOOT_SLOT_CLEARED`) but never claimed are added **only if chat was secret during this
   window** (fallback); otherwise they're dropped (left on the corpse, or taken by someone else).
3. Burst collector: opens on the first event and closes 0.4 s after the last one, at `LOOT_CLOSED` + 0.3 s, or
   after 2 s. The same item ID in one burst merges counts.
4. Source tagging: which template matched (`loot` / `pushed` / `created`); `pushed` while `MERCHANT_SHOW` is
   open → `bought` (filtered out by default).
5. Debug (`/dl debug on`): log every raw `CHAT_MSG_LOOT` arg (text, playerName2, guid) to the log window in the
   first test session. That confirms the self check and the secret behavior on Forever.

### Item info

| API | Evidence | Note |
|---|---|---|
| `C_Item.GetItemInfo(item)` → name, link, quality, itemLevel, minLevel, type, subType, stackCount, equipLoc, texture, sellPrice, classID, subclassID, bindType, expansionID, setID, isCraftingReagent, **itemDescription** | [A] `ItemDocumentation.lua:220-240`; [F] Baganator `Sorting/BagUsageChecks.lua` | Can be nil if uncached: use `Item:CreateFromItemLink(link):ContinueOnItemLoad(fn)` [F] Auctionator `Source/Groups/BagCache.lua`. Freshly looted items are normally cached |
| `C_Item.GetItemInfoInstant(item)` → itemID, type, subType, equipLoc, icon, classID, subClassID | [A] `:251`; [F] Baganator `API/ItemButton.lua` | Never nil for valid IDs; first pass for filters |
| `C_Item.GetDetailedItemLevelInfo(item)` | [A] `:126`; [F] Syndicator `Search/CheckItem.lua`, Baganator `Sorting/ItemFields.lua` | Item level for upgrades |
| `C_Item.GetItemStats(link)` | [A] `:366`; [F] Syndicator `CheckItem.lua:790` | Stat weights (later) |
| `C_Item.IsEquippableItem`, `C_Item.IsDressableItemByID` | [A] `:470-483`; IsDressableItemByID [F] Syndicator `CheckItem.lua:234` | Which display path to use |
| `GetInventoryItemLink("player", slot)` | [A] `Wiki.lua:5076`; [F] Syndicator `Tracking/EquippedCache.lua:26` | Equipped item per slot |
| `C_PlayerInfo.CanUseItem(itemID)` | [A] `PlayerInfoDocumentation.lua:20`; **[V]** `/dump C_PlayerInfo.CanUseItem and C_PlayerInfo.CanUseItem(2489)` | Usability for upgrades |
| `C_TooltipInfo.GetHyperlink(link)` | [A] `TooltipInfoDocumentation.lua:121`; [F] guarded (`if C_TooltipInfo`) in Syndicator `CheckItem.lua:514` | Fallback usability check (red "requires" lines). **[V]** `/dump C_TooltipInfo and #C_TooltipInfo.GetHyperlink("item:2489").lines` |

### Showing items in 3D

What exists:

| API | Evidence |
|---|---|
| `PlayerModel` (→ `CharacterModelBase`) `:SetItem(itemID, appearanceModID?, itemVisualID?)` | [A] `Widget/Base/CharacterModelBase.lua:79`; no installed Forever addon calls it: **[V]** |
| `:SetItemAppearance(itemAppearanceID, itemVisualID?, itemSubclass?)` | [A] `:85`; ATT `UI/Game Tooltip.lua:157` uses it, but only behind `C_TransmogCollection` (may be nil on Forever) |
| `:SetDisplayInfo(displayID)`, `:SetCreature(npcID)` | [A] `:64-69`; [F] HuntersFieldGuide `UI.lua:2243`, ATT `Game Tooltip.lua:123`, Loredex portraits |
| `Model:SetModel(fileID)`, `GetModelFileID()`, `SetFacing`, `SetPitch`, `SetRoll`, `SetPosition`, `SetViewTranslation`, `SetLight(enabled, ModelLight)`, `SetGlow`, `SetModelAlpha`, `SetTransform` | [A] `Widget/Frame/Model/Model.lua` (SetLight `:239`, SetModel `:244`); `ModelLight` = {omnidirectional, point, ambientIntensity/Color, diffuseIntensity/Color} `SharedScriptObjectModelLightDocumentation.lua:2`; SetModel [F] ATT `Game Tooltip.lua:186` |
| `OnModelLoaded` script | [A] `Widget/UIType/ScriptType.lua:36`; [F] Loredex `UI.lua:172` |
| `DressUpModel:SetUnit("player")`, `:Undress()`, `:TryOn(link, slotName)` | [A] `DressUpModel.lua:111-114`; ATT `Classes/Transmog.lua:126` (behind the transmog guard, so not proof) |
| `DressUpItemLink(link)` (Blizzard's dressing room) | [F] Baganator `ItemButton.lua:966`, Questie `QuestieJourneyUtils.lua:183`, Auctionator |
| `ModelScene` + actors (`CreateActor`, `SetModelByFileID`, `SetModelByCreatureDisplayID`, `TryOn`) | [A] `Widget/Frame/ModelScene*.lua`; Syndicator creates one only on retail (`Search/Utilities.lua:48`, its `IsRetail` excludes Forever) |
| `C_TransmogCollection.GetItemInfo(item)` → appearanceID, modifiedAppearanceID; `GetSourceInfo` | [A] `TransmogItemsDocumentation.lua:194, 227`; every user nil-guards it: **[V]** `/dump C_TransmogCollection and C_TransmogCollection.GetItemInfo(2489)` |
| `C_ModelInfo` | [A] only ModelScene registry functions (`UIModelInfoDocumentation.lua`); **no** item → model lookup |

There is no API that maps an item to its model file, so the display path is chosen per item kind:

1. **Weapons, shields, held off-hands, helms, shoulders**: `PlayerModel:SetItem(itemID)`. After
   `OnModelLoaded`, a non-nil, non-zero `GetModelFileID()` means success. Otherwise try path 2.
2. **If `C_TransmogCollection` exists**: `SetItemAppearance(appearanceID)` (ATT's tooltip approach).
3. **Body armor (chest, legs, hands, feet, wrist, waist, back, shirt, tabard)**: these are textures on a
   body, not standalone models. "Mannequin" view: `DressUpModel` with `SetUnit("player")`, `Undress()`,
   `TryOn(link)`, camera zoomed to the slot region. Used in the inspector and for epic+ popups; normal popups
   use the card (cheaper, easier to read).
4. **No model (consumables, reagents, recipes, quest items, junk)**: the **spinning card**. A frame with the
   item icon (`SetTexture(icon)`) on a quality-bordered card; the back face is an original card-back
   texture. Fake 3D flip: width = `baseWidth * abs(cos(angle))`, swap front/back when `cos < 0`, a slight
   vertical scale, and a shadow ellipse that shrinks with the width. Coins use the same trick with an
   original coin texture.
5. Optional later: a generic 3D prop for non-model items (`SetModel(fileID)` of a sack/chest model);
   FileDataIDs would have to be found and **[V]**-verified first.

**[V] test for paths 1-4** (run in game, `/reload` after):
`/run local m=CreateFrame("PlayerModel",nil,UIParent) m:SetSize(300,300) m:SetPoint("CENTER") m:Show() m:SetItem(2489) DLM=m`
then `/dump DLM:GetModelFileID()`; repeat with a helm ID, a chest ID and the Hearthstone (6948, expect no
model); `/run DLM:Hide()`.

Model gotchas (from Loredex STATE.md and the kit's conventions):
- Set the model **after `Show()`**, and again every time it's shown (the client drops models while hidden).
- **No AnimationGroups on frames that hold models**: models don't follow Translation/Alpha animations.
  Drive position, scale and alpha by hand in `OnUpdate` (`SetPoint`, `SetAlpha`, `SetModelAlpha`).
- Model frames are expensive: cap live models (see Performance under Risks).

### Bag Alt+Right-click hook (inspector)

- Blizzard bag buttons: `ContainerFrameItemButtonMixin:OnClick` calls `self:OnModifiedClick(button)`
  whenever *any* modifier is held, instead of using the item (annotations
  `FrameXML/Annotations/AddOns/Blizzard_UIPanels_Game/Mainline/ContainerFrame.lua.annotated.lua:1489-1503`).
  `OnModifiedClick` calls `HandleModifiedItemClick(link, itemLocation)` (`:1584-1610`). So Alt+click never
  uses or moves the item.
- **Baganator** (installed) live bag buttons inherit `ContainerFrameItemButtonTemplate`
  (`Baganator/ItemViewCommon/ItemButton.xml:11`), so the same path runs; its cached/bank views call
  `HandleModifiedItemClick(link)` directly (`ItemButton.lua:785, 1271`).
- The character sheet and chat item links also go through `HandleModifiedItemClick` (retail FrameXML).
- **Hook**: `hooksecurefunc("HandleModifiedItemClick", function(link, itemLocation) ... end)`. It is a
  post-hook: no taint, nothing replaced. Open the inspector when the chosen modifier matches exactly (Alt
  only: `IsAltKeyDown() and not IsShiftKeyDown() and not IsControlKeyDown()`) and the link is an item.
  `HandleModifiedItemClick` is a global on Forever ([F]: Baganator and Questie call it), but its definition
  is not in the annotations: **[V]** `/dump HandleModifiedItemClick ~= nil`.
- **Conflict**: Baganator uses plain Alt+click for "highlight similar items" (`ItemButton.lua:512, 559`). Our default is
  therefore Alt+Right-click (settled with the user); the modifier/button is selectable in Settings.
- Combat: the inspector is our own unprotected frame, so it opens in combat. Nothing secure is touched.

### Sound

| API | Evidence |
|---|---|
| `PlaySound(soundKitID, channel?, forceNoDuplicates?, runFinishCallback?)` → `willPlay, soundHandle` | [A] `Core/Data/Wiki.lua:7840`; [F] Loredex `Toast.lua:138` |
| `PlaySoundFile(fileOrFileDataID, channel?)` → `willPlay, soundHandle` | [A] `Wiki.lua:7847`; [F] BugSack `core.lua:56` plays its own shipped `Media/error.ogg` |
| `StopSound(handle, fadeout?)` | [A] `Wiki.lua:8775` |
| `SOUNDKIT` table | [A] `FrameXML/Annotations/AddOns/Blizzard_SharedXML/Mainline/SoundKitConstants.lua.annotated.lua`; [F] retail-era kits `UI_JOURNEYS_OPEN_LORE_BOOK` and `UI_TRANSMOG_PAGE_TURN` play on Forever (Loredex sound picker, confirmed by the user) |

There is no pitch control, so **rising pitch = a set of our own chime files** at ascending semitones.

Candidate built-in kits (all in the SOUNDKIT table; **[V]** each with `/dump PlaySound(SOUNDKIT.NAME)`.
A false `willPlay` or silence means the kit is missing on Forever; the Settings picker hides kits that report
false):

| Use | Kit (ID) |
|---|---|
| Common/uncommon pop | `LOOT_WINDOW_COIN_SOUND` (120), `IG_BACKPACK_COIN_OK` (865), `UI_TRANSMOG_ITEM_CLICK` (62538) |
| Rare | `UI_RAID_LOOT_TOAST_LESSER_ITEM_WON` (51402), `UI_ITEM_UPGRADE_UI_ITEM_UPGRADED_RARE` (187607) |
| Epic | `UI_EPICLOOT_TOAST` (31578), `UI_WARFORGED_ITEM_LOOT_TOAST` (51561) |
| Legendary | `UI_LEGENDARY_LOOT_TOAST` (63971) |
| Chest anticipation / open | `UI_BONUS_LOOT_ROLL_START` (31579), `UI_BONUS_LOOT_ROLL_END` (31581), `UI_GARRISON_COMMAND_TABLE_CHEST_UNLOCK` (44331), `UI_STORE_UNWRAP` (64329), `UI_CONTAINER_ITEM_OPEN` (143054) |
| Gold burst | `UI_GARRISON_COMMAND_TABLE_CHEST_UNLOCK_GOLD_SUCCESS` (44332), `TRADING_POST_UI_COLLECTING_COINS` (218228) |
| Inspector open/turn | `UI_TRANSMOG_OPEN_WINDOW` (62544), `IG_BACKPACK_OPEN`, `UI_TRANSMOG_ITEM_CLICK` |
| New/first-of-kind | `UI_PROFESSIONS_NEW_RECIPE_LEARNED_TOAST` (73919), `UI_CHALLENGES_NEW_RECORD` (33338) |

These play game sounds by ID, so nothing is redistributed. Shipped audio is original only (see Risks:
tooling).

### Other APIs used

- Settings page: `Settings.RegisterCanvasLayoutCategory`, `Settings.RegisterAddOnCategory`,
  `Settings.OpenToCategory(id)` [F] Loredex `Settings.lua:147-155`.
- Window: `PortraitFrameTemplate` + `UISpecialFrames` [F] Loredex `UI.lua:971-985`; recent list with
  `WowScrollBoxList` (kit conventions, [F] Auctionator `RecentsContainer.lua:128`).
- Item tooltip beside the model: our own `GameTooltip` frame with `GameTooltipTemplate`, `:SetHyperlink(link)`
  [F] Baganator `ItemButton.lua:537`.
- Drag-rotate/zoom pattern: [F] HuntersFieldGuide `UI.lua:2205-2221` (MIT): `OnMouseDown` stores
  `GetCursorPosition()`, `OnUpdate` turns `SetFacing` by the x delta, `OnMouseWheel` → `SetCamDistanceScale`.
- Minimap button: Loredex `Minimap.lua` pattern; compartment: `## AddonCompartmentFunc` (the scaffold has it).
- Upgrade plugin (optional): Pawn's `PawnShouldItemLinkHaveUpgradeArrowUnbudgeted(link)`, called the way
  Baganator does (`Baganator/API/Pawn.lua:62`), only if Pawn is loaded.

---

## Upgrade detection (Forever, Classic-era items)

Inputs: `equipLoc` → inventory slots (`INVTYPE_FINGER` → 11/12, `INVTYPE_TRINKET` → 13/14, `INVTYPE_WEAPON` →
16/17, `INVTYPE_2HWEAPON` → 16, ...), item level, quality, required level, usability.

v1 heuristic (`Upgrade.lua`, pure, offline-tested with fake equipped data):
1. Not equippable, or not usable (`C_PlayerInfo.CanUseItem` → tooltip red lines → class armor table
   fallback: cloth/leather/mail/plate by class and level 40) → not an upgrade.
2. Required level above yours → "upgrade at level N" badge, no upgrade bump yet.
3. Empty slot → upgrade.
4. Compare item level against the equipped item: rings/trinkets/1H for dual-wielders against the *lower* of
   the two, a 2H against the average of main + off hand, a 1H against the main hand. It is an upgrade if
   `ilvl` is higher by 1 or more, or equal with higher quality.

Limits (say so in the Settings help text): Classic item level ignores which stats matter to your class (a
caster ring with Strength "wins"), weapon skills are not checked, and set bonuses are ignored. Later:
per-class default stat weights over `C_Item.GetItemStats` (user-editable), and Pawn when installed.

---

## The chest show (loot rain)

> **Set aside 2026-10-14** (see the 0.4 roadmap row and `deprecated/chest-show/README.md`): the rain now
> flies up from the ground with no container. The text below is the original design.

Triggered when a burst has **3+ shown items** (setting), or money over the threshold plus 2+ items. A lighter
version ("rain lite": icons only, no chest, no reveal) plays when every item is below Rare. The full show plays
when the burst contains Rare+ or 6+ items. **Click anywhere on it or press Escape to skip to the final state.**

Phases (all timings tunable, total about 2.5-4 s):
1. **Anticipation (0-0.6 s)**: an original chest sprite appears center-low and shakes with growing amplitude;
   light rays (original texture, rotated by hand) fade in behind it; ticking chimes rise in pitch. It starts on
   `LOOT_OPENED` when the snapshot already predicts a burst, so there is no wait.
2. **Burst (0.6 s)**: the lid pops; coins spray in a fountain (money → coin count, capped at 30 sprites), plus
   one icon per item. Items launch **in ascending hype order** so the best lands last.
3. **Bounce**: every sprite falls under gravity onto an invisible "trampoline" line at ~25% screen height,
   bounces with restitution 0.55-0.75 and a squash on impact (wider and flatter for 0.08 s), drifts sideways,
   and bounces off the screen edges. Each bounce plays a short pitched tick, quieter as it settles.
4. **Slot-machine escalation**: a counter above the chest rolls up (money looted + vendor value of the
   items), with rolling digits and a tick per step whose pitch climbs. A quality-colored flash plays each time
   a higher-quality item lands ("blue!", "PURPLE!").
5. **Gold burst**: when the counter finishes, a ring of coins and sparkles pops outward with the gold sound.
6. **Final reveal**: the screen dims slightly (vignette), and the best item rises to the center in a beam of
   its quality color: its 3D model (or spinning card) turns, with its name in large quality-colored type,
   badges, and the tier sound. Epic+ adds a brief screen-edge glow pulse (off with "no screen flashes").
7. **Settle**: low-tier sprites fade where they lie; higher-tier items (at or above a setting, default Rare)
   shrink into a row of small rotating cards at the top of the screen for a few seconds. Click one to inspect it.

Implementation notes:
- One `OnUpdate` on a single driver frame runs while anything animates; it is cleared
  (`SetScript("OnUpdate", nil)`) when idle. Physics per sprite: `x, y, vx, vy, spin, scale, bounces, state`;
  semi-implicit Euler with `dt` clamped to 1/30 s so a hitch cannot tunnel a sprite through the floor.
- **Frame pools**: icon sprites are plain `Frame` + `Texture` (cheap); coins are textures on one parent.
  Sprites come from a pool; after warm-up, no frames are created per burst.
- **Models only in the reveal and the settle row** (max 1 + 3 live models), driven by hand, never inside an
  AnimationGroup. Everything else is textures, where AnimationGroups would be allowed, but driving everything
  from the one `OnUpdate` keeps timing consistent.
- Strata `FULLSCREEN_DIALOG`; the whole layer ignores the mouse (`EnableMouse(false)`) except the skip
  catcher during the show and the settle cards.
- The physics step and the "who stays" decision are pure functions (core of `Rain.lua`) with offline tests:
  sprites stay in bounds, settle within the time cap, and the best item is always launched last.

## Data model

```lua
DopamineLootDB = {           -- account-wide
  version = 1,
  settings = {
    enabled = true, debug = false, noSound = false, soundChannel = "SFX",   -- or "Master"
    popup  = { on = true, duration = 4, scale = 1, point = { "TOP", 0, -180 }, maxQueue = 5, model = true },
    rain   = { on = true, minItems = 3, fullShowQuality = 3, stayQuality = 3, maxSprites = 40, reducedMotion = false },
    flash  = true,                        -- screen flourishes (photosensitivity switch)
    combat = "compact",                   -- "full" | "compact" | "defer" | "off"
    filters = {
      minQuality = 2, newOnly = false, upgradesOnly = false,
      ignore = { quest = true, junk = true, tradeStacks = true, consumables = false, bought = true },
      always = { boe = true, recipes = true, mounts = true, pets = true, bags = false, minValue = nil },
      sources = { loot = true, created = true, pushed = true },
      moneyMin = 100, instancesOnly = false,
      whitelist = { [itemID] = true }, blacklist = { [itemID] = true },
    },
    sounds = { [quality] = "SOUNDKIT_KEY" },      -- or "dl:chime"; picked in Settings
    inspector = { modifier = "ALT", button = "RightButton", turntable = true, light = "studio" },
    minimap = { hide = false, angle = 200 },
  },
}

DopamineLootCharDB = {       -- per character
  version = 1,
  seeded = true,              -- seen set built from bags/bank/equipped on first login
  seen = { [itemID] = firstSeenTime },
  recent = { { t, id, link, n, q, src, zone } },     -- ring buffer, newest 200
  stats = {
    byQuality = { [q] = count }, money = copper, best = { link, q, ilvl, t },
    firsts = { [q] = t },     -- first-of-its-kind milestones already celebrated
    sinceRare = n,            -- dry streak counter (items since the last Rare+)
  },
}
```

- Keys are item IDs, never names. Item links are stored as the game gives them (they hold no player name).
- **Never stored**: chat text, other players' names or GUIDs (group-loot lines for others never match the self
  templates), the player's name, the realm.
- Seen-set seed: bags + equipped at the first `PLAYER_ENTERING_WORLD`; bank contents when the bank is opened
  (`BANKFRAME_OPENED` [V]). Items seen through loot are added on receipt.
- Schema `version` with migrations in `ADDON_LOADED`. The ring buffer is trimmed on insert.

## UI

- **Popup** (`Popup.lua`): a top-center stack (max 3 visible, the rest queued; same-item bursts merge as
  "x5"). Gold-bordered dark card with the model or spinning card on the left, the name in quality color, and a
  line of badges (NEW, UPGRADE, BoE, ilvl, xN). It slides down and fades by hand in `OnUpdate`. Hover holds;
  left-click opens the inspector; right-click dismisses; Shift+click puts the link in your chat edit box.
- **Chest show / rain** (`Rain.lua`, `Chest.lua`): as above.
- **Inspector** (`Inspector.lua`): a `PortraitFrameTemplate` window with a dark "examine" panel:
  - Left: recent loot list (ScrollBox, quality-colored rows, filter by quality, search).
  - Center: a big model on a vignette backdrop with a soft floor shadow. Left-drag rotates (yaw; vertical drag
    pitches if `SetPitch` behaves on item models [V]), the wheel zooms, right-drag pans, double-click resets.
    Buttons: Turntable on/off, Light (Studio / Warm lamp / Moonlight / Dramatic, via `SetLight`), Background
    (dark / parchment / quality color), Try on (armor → mannequin view), Share.
  - Right: the item tooltip (`GameTooltipTemplate`), then the item's description typed out letter by letter
    (a nod to the RE item box; the description comes from `GetItemInfo`'s `itemDescription`).
  - An open sound and a quick "turn into view" rotation on open. Escape closes.
- **Settings** (Options > AddOns > Dopamine Loot): sections Popups, Chest show, Filters, Sounds (per tier:
  dropdown + Play), Inspector, Combat, Accessibility; a "Preview" button for each effect.
- **Minimap button** (left: inspector, right: settings) + **addon compartment** (the scaffold's
  `DopamineLoot_OnCompartmentClick`).
- **Log window** (`Output.lua`, scaffold): all output except `/dl help`.
- **Combat** (`PLAYER_REGEN_DISABLED/ENABLED` [A]): the default **compact** mode shows popups at 75% size, no
  chest show and no screen flashes; bursts during combat are queued and played as one chest show when combat
  ends ("defer" does that for everything). None of this touches protected frames, so it is about distraction,
  not taint.

## Commands

All output goes to the log window except `help` (yellow chat). An unknown subcommand prints
`unknown command "x"` and the list.

| Command | Does |
|---|---|
| `/dl` | Toggle the inspector (recent loot) |
| `/dl help` | List the commands in chat (yellow) |
| `/dl test [poor/common/uncommon/rare/epic/legendary]` | Preview a popup (a random fitting item from your bags, or a curated ID list) |
| `/dl test rain [n]`, `/dl test chest` | Preview the rain / the full chest show |
| `/dl inspect <item link or ID>` | Open the inspector on an item |
| `/dl stats` | Session and lifetime stats to the log |
| `/dl settings` | Open the Settings page |
| `/dl popup`, `rain`, `sound`, `flash` + `off`/`on` | Quick switches (each popup type has one) |
| `/dl watch <item>`, `/dl ignore <item>` | Whitelist / blacklist |
| `/dl reseed` | Rebuild the seen set from bags/equipped (asks for confirmation) |
| `/dl log`, `/dl debug on/off`, `/dl model <itemID>` | Log window; raw event logging; model-path probe (which display path worked, plus `GetModelFileID()`) |

## File layout (proposed)

```
DopamineLoot/
  Core.lua        saved data, defaults, event dispatch, /dl commands (scaffold)
  Output.lua      log window (scaffold)
  LootFeed.lua    CHAT_MSG_LOOT parsing, loot-window snapshot, money, burst collector, dedupe
  Filters.lua     filter rules + hype tier (pure)
  Upgrade.lua     slot mapping + upgrade heuristic (pure core)
  Display.lua     item -> display path (model / mannequin / card), model pool and caps
  Popup.lua       popups (the scaffold has the toast; extend it)
  Rain.lua        sprite pool, physics, settle logic
  Chest.lua       chest-show sequencing (phases, counter, reveal)
  Sounds.lua      tier -> sound, kit availability probe, chime player
  Inspector.lua   inspector window, recent list, Alt+Right-click hook
  Settings.lua    Options > AddOns page
  Minimap.lua     minimap button
  Media/          generated textures (chest, card back, coin, rays, glow, sparkle) and chimes
tools/
  test_lootmsg.lua  test_filters.lua  test_upgrade.lua  test_rain.lua   (offline, run by wow-preflight)
  gen_textures.lua  (writes the Media/*.tga, like Loredex's gen_scribble.lua)
  gen_chimes.lua    (synthesizes the pitch-stepped chimes; see Risks)
```

## Decisions (proposed; confirm with the user)

- `CHAT_MSG_LOOT` self lines are the only record source; the loot-window snapshot is for timing and fallback.
- The seen set is per character (the user's "for this character"); an account-wide "never seen on any
  character" view can come later.
- The quality threshold defaults to Uncommon; New and Upgrade are badges and tier bumps, not filters, by default.
- Popups and effects are drawn by hand in `OnUpdate`, with no AnimationGroups on anything holding a model.
- Sounds: built-in kits by ID first; shipped audio is original only. No Vampire Survivors (or other game) art
  or audio, only the feel.
- Only `/dl help` prints to chat; no login toast by default (see open questions).

## Risks

| Risk | Mitigation |
|---|---|
| `PlayerModel:SetItem` is unproven on Forever; armor pieces have no standalone model | The v0.1 test settles it; the `/dl model` probe; mannequin + card fallbacks are designed in from the start |
| Loot global strings missing or different on Forever | The v0.1 `/dump` + debug log; fallback parse on the item hyperlink and the `guid` arg |
| Chat text secret in instances/combat (12.x) | `issecretvalue` guard; loot-window snapshot fallback; test in a dungeon |
| Double counting (chat + snapshot + bag events) | One record source; snapshot slots are claimed; bag events never create records |
| Performance: many models, big bursts, `OnUpdate` cost | Max 4 live models; sprites are pooled textures (cap 40 + 30 coins); the driver stops when idle; reduced-motion mode; fatigue guard |
| Distraction/danger in combat | Compact or deferred mode by default in combat |
| Photosensitivity (flashes, shake) | "No screen flashes" and reduced-motion switches; flashes are soft fades, never strobing |
| Built-in sound kits missing from Forever's data | `PlaySound` returns `willPlay`: probe each kit once, hide missing ones in the picker, fall back to `LOOT_WINDOW_COIN_SOUND` |
| No pitch control for "rising" sounds | Ship original pitch-stepped chimes. This needs tooling: there is no ffmpeg/encoder on this machine yet, and the Python on PATH is the Store stub. Either install ffmpeg (winget) to encode OGG, or verify whether `PlaySoundFile` plays a WAV from the addon folder **[V]**. OGG is proven (BugSack) |
| The upgrade heuristic is wrong for stat-mismatched items | Labeled "likely upgrade"; stat weights / Pawn later; it never hides Rare+ unless the user asks |
| Alt+click overlaps Baganator's "highlight similar" | Default Alt+Right-click, configurable (settled) |
| Licensing | Reuse patterns only from MIT code (HuntersFieldGuide). Questie (GPL) and Scrap/EpicLootFeed (All Rights Reserved) are reference only. No copied art/audio; game sounds and icons are referenced by ID/path, not shipped |
| Uncached item info for test previews | `Item:ContinueOnItemLoad` before showing |

## Prior art

| Addon | Does | Clients | Takeaway |
|---|---|---|---|
| HuntersFieldGuide (installed, MIT) | Rotating creature models with drag/zoom | Forever | Inspector drag pattern `UI.lua:2205-2221` |
| AllTheThings (installed) | Rotating models on tooltips (`SetDisplayInfo`, `SetItemAppearance`) | Forever + others | Item-appearance path behind a transmog guard (`UI/Game Tooltip.lua:148-160`) |
| Baganator / Syndicator (installed) | Bags; upgrade plugin API; Forever detection `build >= 16000 and < 20000` | Forever + others | Modified-click flow, Pawn hook (`API/Pawn.lua:62`), `IsForever` check (`Syndicator/Core/Constants.lua:18`) |
| EpicLootFeed (CurseForge, All Rights Reserved) | Animated glowing loot popups | Retail, Classic | Validates the idea; no 3D, filters or sounds described |
| Dragon Toast, LootToastUI, Simple Scrolling Loot | Loot toasts / scrolling feeds | Classic flavors | No 3D models, no chest show, no inspector |
| Sleek Gold Loot | Animated coins flying into bags | All | Similar coin "juice"; ours is part of the chest show |

None found that combines 3D item popups, a chest-style loot rain and an inspector, or that targets Forever.
No existing addon named "Dopamine Loot" was found.

## Roadmap

| Version | Scope (each adds one visible capability) |
|---|---|
| **0.1** done | `CHAT_MSG_LOOT` self parsing -> a **single popup** with the rotating `PlayerModel:SetItem` model (card fallback), quality sound, quality threshold; `/dl test`, `/dl model`, `/dl check`, `/dl sounds`. Verified: SetItem works on Forever |
| **0.2** done | (reordered at the user's request) **Loot rain (lite)** + **Settings page** with Test buttons and number fields; burst collector, popup queue, combat deferral, landing height, `/dl rain N`. Offline: `test_rain.lua` |
| **0.3** done | **Look & feel pass** (0.3.0-0.3.11): four popup styles on generated art (Relic v2 = default, Beam v2, Halo lens v2, Banner v2), weapons upright via `Model:SetPitch`, title font, arrival flash, **arrivals by rarity in every style** (Rare spark ring; Epic bigger ring; Legendary shockwaves + ember fountain + rising embers), Popup look page with live preview + sliders; 0.3.7 calmed it down (no breathing light, halo sweep, relic rays, epic rays/orbit); 0.3.8 **arrival sounds** (original synthesized OGGs per tier, timed with the arrival, toggle + Test buttons); 0.3.9 **loot rain effects** (see "Rain ideas"), each a switch on its own settings page; 0.3.10 **money**: coins as the game's money icons, coins merge up (silver piles join into gold), quest money always rains, loot money from 1g (setting), treasure-chest and coin sounds.; 0.3.11 chest opening sound by haul size. (No-flash and reduced-motion switches moved to 0.4.) |
| **0.4** in progress | **0.4.7 popup polish** (picked in `docs/mockups/popups.html`): arrival by rarity (Rare burst; Epic + star4 glints; Legendary more + 2 shockwaves + embers), sway (Epic+ turn once first), cards tilt, Beam motes Rare+ only, Halo lens replaced by **Toast** (the game's loot-toast atlases, icon not model). 0.4.8: weapons face you, long names fit. Next: **0.4.9 per-rarity sound picker** with the game's own sounds (Play buttons; the user found our synthesized ones artificial), then **popup placement** (less in the way; mockup first). **Set aside 2026-10-14: the chest show** (the user: "a bit much"; code and media in `deprecated/chest-show/`, README there). **0.4.6 loot flies from the ground** (setting `rainFrom`: ground fountain = default, spread along the ground, from below the bottom edge, or the middle of the screen; launched faster so it peaks as high), then **0.4.7+ popup polish** (styles, arrivals, more dramatic but short sounds; mockup first). History of the chest show: (mocked up and picked in `docs/mockups/rain.html`, "Chest show" section). 0.4.0 **containers**: loot pouch for small hauls, treasure chest (medium: quick pop; big: shake + rarity tease white→…→best + lid burst with rays), golden chest for a Legendary; layered generated art (Chest*, Pouch*, Rays) and sounds (ChestRattle, Tease, ChestBurst(Gold), PouchPop); switches Chest/Shake/Tease/Burst. 0.4.3 **game containers**: sack 200442, Strongbox 219372, large ornate chest 200953 (gold) as PlayerModels with their own lid animations (0 shut, 148 opens, 149 held open), shake/hop by hand, our tease glow behind and the light in front; switch "Game chests (3D)", drawn ones as fallback. 0.4.1 **asset check** (`/dl assets`, "Blizzard assets" page: chest/sack models with animation scan, textures/atlases, sounds, fonts; results in DopamineLootDB.assetCheck; see docs/design-review.md), then the picked Blizzard assets wired in with ours as fallback. 0.4.6 **hooks**: loot streak (30 s window; x2, x3… each step bigger: small hauls get the chest from x3, more shake/tease; x5 fanfare; "streak ended" summary), session tally, personal records banners. 0.4.7 **card flip (click)**, off by default: Rare+ fly out as "?" and land as face-down cards you click to flip (auto after 8 s), then popups. Lucky drops skipped for now (idea: Questie drop rate under ~5% → golden chest). Also: reduced-motion and no-screen-flash switches. 0.4.8 **settings cleanup** (requested 2026-10-12): reorganize the main page and sub-pages so each page has one clear topic instead of a mix; better controls than what we have; go through every setting with the user (keep, improve, merge, drop) before building, mockup first. (The empty settings fields bug was fixed in 0.4.2.) |
| **0.5** | **Inspector**: recent loot list, Alt+Right-click hook, drag/zoom/pan, turntable, lighting presets, tooltip + typed description, mannequin "Try on", spinning card for non-model items, share to chat; minimap button |
| **0.6** | (swapped with 0.4 on 2026-10-11: the user can test the chest show with Test buttons, filters need real play) **Filters**: seen set (seed + NEW badge), ignore/always-show/whitelist/blacklist, sources, money threshold, instances-only; ilvl **upgrade badge** + upgrades-only filter; per-tier sound picker. NEW/UPGRADE should count as "big" for the chest. Offline: `test_filters.lua`, `test_upgrade.lua` |
| **0.7** | **Stats & milestones**: dopamine meter, session/lifetime stats, best drop, first-of-kind celebrations, dry-streak and combo counters, `/dl stats` |
| **0.8** | **Smarter upgrades**: usability via `C_PlayerInfo.CanUseItem`/tooltip, per-class stat weights (editable), Pawn when present; "upgrade at level N" |
| later | Popup position (drag to move, like the rain landing height); per-style default zoom/tilt presets; dungeon recap show, screenshot mode, mail attachments, account-wide "never seen" view, sound packs, 3D props for non-model items, localization |

### Rain ideas (picked with the user 2026-10-10)

**Built in 0.3.9** (the user tried every one in `docs/mockups/rain.html` and wants them all, each a switch on
the "Loot rain effects" page): best item last, escalation (speeding launches + rising-pitch ticks), Epic
screen-edge glow, spacing, dust puff, gathering into the bag, trails, coins with a rolling total, floor shadows,
plus three added from the mockup: **loot beam** over resting Rare+, **hit-stop** when the best lands, **name
labels** on resting Rare+; and skip with Escape. The user: the rain is the part they like most and it should
feel the best, before the popups get more polish.
Still open: **click to inspect** a resting item (needs the 0.5 inspector).
Test checklist for 0.1 (in game, after a full restart for the new addon):
`/dump select(4, GetBuildInfo())` (16001); the global-string `/dump` above; loot a mob (single popup); loot
a green; buy something from a vendor (source `pushed`); `/dl model 2489` plus a helm, a chest and the
Hearthstone; `/dl debug on` in a dungeon to see whether loot text is secret.

## Ideas / later

- Per-zone "best drop here" memory; a small trophy shelf of your all-time top 10 in the inspector.
- "Loot goblin" whimsical one-liners on rare moments (original lines, rotating, never the same twice in a row).
- An account-wide collection log ("first time any of your characters saw this").
- A bag-open sparkle on items received since you last opened your bags (`C_NewItems.IsNewItem`).
- Rarity flavor from QuestieDB drop rates if installed (an item with a 0.5% drop chance gets a tier bump).
- Export a drop as a short text card for sharing outside the game (selectable text in the log window).
- A keybinding for the inspector.

## Settled with the user (2026-10-09)

1. **Default filter**: Uncommon+; NEW and UPGRADE are badges and louder tiers; "only new" off.
2. **Inspector shortcut**: **Alt+Right-click** (avoids Baganator's Alt+click "highlight similar"), selectable
   in Settings. In the `HandleModifiedItemClick` post-hook, check `GetMouseButtonClicked() == "RightButton"`
   plus Alt only. **[V]**: Alt+Right-click on a bag item must not use/equip it (any modifier routes to
   `OnModifiedClick`, see above), and `GetMouseButtonClicked` must report the button inside the hook.
3. **Chimes**: built-in sound kits until 0.5; then install ffmpeg (winget) and ship original synthesized OGG
   chimes for the rising-pitch climb.
4. **Login toast**: none.
5. **Shows**: 3+ shown items → loot rain; any Rare+ or 6+ items → full chest show; in combat, deferred until
   combat ends.

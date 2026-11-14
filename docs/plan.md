# Dopamine Loot — design & roadmap

Loot that *feels* like loot. When you pick something up, it pops onto the screen as a slowly spinning 3D
model with a quality-colored glow and a satisfying sound. Big hauls become a **treasure-chest show**: coins
and items spray out, bounce on an invisible trampoline, a counter climbs like a slot machine, and the best
item is revealed last. Any item (recent loot, or Alt+Right-click in your bags) can be opened in a
**Resident-Evil-style inspector**: drag to turn it, zoom, light it, read its tooltip.

| | |
|---|---|
| Client | WoW: Forever only (client folder `_forever_`, `## Interface: 16001`; released 2026-11-04, the beta was `_classic_beta_`) |
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
| `/dl test [poor/common/uncommon/rare/epic/legendary] [combat]` | Preview a popup (a random fitting item from your bags, or a curated ID list); `combat`: as it looks in a fight |
| `/dl testpair` | An Uncommon looted beside a Rare (the Uncommon comes compact) |
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
| **0.4** done | **0.4.7-0.4.14 popup polish** (picked in `docs/mockups/popups.html`): arrival by rarity (Rare burst; Epic + star4 glints; Legendary more + 2 shockwaves + embers), sway (Epic+ turn once first), cards tilt, Beam motes Rare+ only, Halo lens dropped; a **Toast** style (the game's loot-toast art) was tried and set aside (`deprecated/toast/`). 0.4.8: weapons face you, long names fit. 0.4.15: settings rebuilt by topic (native pages, custom Popups) with the per-rarity sound picker. Next: with the game's own sounds (Play buttons; the user found our synthesized ones artificial), then **popup placement** (less in the way; mockup first), then body armor in 3D on a mannequin (probed in 0.4.22-0.4.23, **dropped 2026-11-04**: `deprecated/asset-check/`). **Set aside 2026-10-14: the chest show** (the user: "a bit much"; code and media in `deprecated/chest-show/`, README there). **0.4.6 loot flies from the ground** (setting `rainFrom`: ground fountain = default, spread along the ground, from below the bottom edge, or the middle of the screen; launched faster so it peaks as high), then **0.4.7+ popup polish** (styles, arrivals, more dramatic but short sounds; mockup first). History of the chest show: (mocked up and picked in `docs/mockups/rain.html`, "Chest show" section). 0.4.0 **containers**: loot pouch for small hauls, treasure chest (medium: quick pop; big: shake + rarity tease white→…→best + lid burst with rays), golden chest for a Legendary; layered generated art (Chest*, Pouch*, Rays) and sounds (ChestRattle, Tease, ChestBurst(Gold), PouchPop); switches Chest/Shake/Tease/Burst. 0.4.3 **game containers**: sack 200442, Strongbox 219372, large ornate chest 200953 (gold) as PlayerModels with their own lid animations (0 shut, 148 opens, 149 held open), shake/hop by hand, our tease glow behind and the light in front; switch "Game chests (3D)", drawn ones as fallback. 0.4.1 **asset check** (`/dl assets`, "Blizzard assets" page: chest/sack models with animation scan, textures/atlases, sounds, fonts; results in DopamineLootDB.assetCheck; see docs/design-review.md), then the picked Blizzard assets wired in with ours as fallback. 0.4.6 **hooks**: loot streak (30 s window; x2, x3… each step bigger: small hauls get the chest from x3, more shake/tease; x5 fanfare; "streak ended" summary), session tally, personal records banners. 0.4.7 **card flip (click)**, off by default: Rare+ fly out as "?" and land as face-down cards you click to flip (auto after 8 s), then popups. Lucky drops skipped for now (idea: Questie drop rate under ~5% → golden chest). Also: reduced-motion and no-screen-flash switches. 0.4.8 **settings cleanup** (requested 2026-10-12): reorganize the main page and sub-pages so each page has one clear topic instead of a mix; better controls than what we have; go through every setting with the user (keep, improve, merge, drop) before building, mockup first. (The empty settings fields bug was fixed in 0.4.2.) |
| **1.0** done | **First release** (2026-11-04): the dev tools (asset check, armor probe) moved to `deprecated/asset-check/`; README for players, CHANGELOG, MIT LICENSE; BigWigs packager (`.pkgmeta`, `.github/workflows/release.yml`: a `v*` tag builds the GitHub release zip; CurseForge/Wago once the .toc has their project IDs and the repo their secrets) |
| **1.1** next (order set 2026-11-06) | **Flair pass first** (accessibility tabled the same day). **Accessibility**: reduce-motion and no-flash switches. Then **drag-to-move popups**, the **NEW badge** (seen set, from the Filters row) and the **bag sparkle** on new items. Then a **flair pass** on the rain and popups (mockups first): the Legendary moment plus new ideas (visual flair, explosiveness, cleaner visual design and sound; a marvel every time, never tiring). **Shelved 2026-11-06**: hooks (streak, tally, records), the streak jackpot, card flip; the rows below are pushed back. |
| **1.3** done | **The professions release** (2026-11-10): gathering effects + harvest window, crafting effects by the cast bar + the Create All pile (H3 Tumble, sinks when full), skill-up banner with material bars and tools (or Simple), bulging bag, the side column ("Picked up"), Move frames, settings reorganized (main switches on the first page, a Professions page). Sounds rendered from the mockups' own code (tools/render-media.html). |
| **1.4** next (set 2026-11-10) | **Dungeons**: the **dice roll** and the **dungeon recap**. See "1.4.0: Dungeons" below. |
| **next** (order set 2026-11-07) | 1. **New animations** (mockups first): **loot rain variants** (built 2026-11-07/08, `rainStyle`, docs/mockups/rain-variants.html round 5: Fountain (default), **Quick burst** (a short Fountain, everything at once; a friend found the Fountain overstimulating) and **Big bang**; Firework, Vortex, Meteor shower and Geyser were built and then dropped by the user 2026-11-08; the switch "Finale for the best" (key Hang) covers every animation) and **finales for Open All mail and Create All crafting**, something other than the rain or popups (APIs to verify first). 2. **Edit mode**: drag to place the popups and the money tally. 3. **Stats** (separate from milestones): loot streak, session tally (un-shelved from the hooks). Also on the list: the **dungeon recap** show. |
| after 1.0 | **Inspector**: recent loot list, Alt+Right-click hook, drag/zoom/pan, turntable, lighting presets, tooltip + typed description, mannequin "Try on", spinning card for non-model items, share to chat; minimap button |
| after 1.0 | (swapped with 0.4 on 2026-10-11: the user can test the chest show with Test buttons, filters need real play) **Filters**: seen set (seed + NEW badge), ignore/always-show/whitelist/blacklist, sources, money threshold, instances-only; ilvl **upgrade badge** + upgrades-only filter; per-tier sound picker. NEW/UPGRADE should count as "big" for the chest. Offline: `test_filters.lua`, `test_upgrade.lua` |
| after 1.0 | **Stats & milestones**: dopamine meter, session/lifetime stats, best drop, first-of-kind celebrations, dry-streak and combo counters, `/dl stats` |
| after 1.0 | **Smarter upgrades**: usability via `C_PlayerInfo.CanUseItem`/tooltip, per-class stat weights (editable), Pawn when present; "upgrade at level N" |
| later | Popup position (drag to move, like the rain landing height); per-style default zoom/tilt presets; dungeon recap show, screenshot mode, mail attachments, account-wide "never seen" view, sound packs, 3D props for non-model items, localization |

### 1.4.0 order, revised 2026-11-14 (the user: nail down the 1.3 professions first)

Everything designed so far counts as **Phase 1 done** (wow-design-rounds). 1.4.0 runs Phase 2 (Finalization) on what
is left; **Phase 3 Polish for these moves to 1.4.1+** (crafting's polish took more context than expected; it is done).
The dungeon recap stays in 1.4.0 for now, last, and may slip to 1.5.0 depending on the weekly budget.

Professions (from 1.3.0):
1. Crafting: the in-game API checks (Smelting window's name, is disenchant a trade-skill cast, the 8x8 burn grid).
   **Done 2026-11-14 (checked in game by the user, a UNIT_SPELLCAST_START watcher printing UnitCastingInfo + the
   profession):** Smelting = "Smelt Copper" spell 2657, isTradeSkill **true**, professionName **"Mining"** (so the build
   maps a Mining window cast to the Smelting look). Disenchanting = spell **13262**, isTradeSkill **false**, no profession
   (no window): detect it by spell ID at UNIT_SPELLCAST_START, outside the window check. A normal craft (Light Armor Kit
   2152) = true, "Leatherworking". The burn grid works: 64 textures (8x8) of one image via SetTexCoord, every other one
   hidden, drew a clean checkerboard.
2. Skill-up gains, Phase 2 (Phase 1 pick: Ring + road). Right after crafting: they share the Ring.
   **Goal (the user, 2026-11-14): clear progression AND a frame that's easy to make unique, in fun ways, per
   profession.** Two steps, like crafting: (a) lock the general skill-up design (as the craft Ring was locked);
   (b) then a per-profession pass, rounds of unique designs for every profession (gatherers and secondary skills
   too). Round 5 restated: A and B most on theme; C (Building up) "kind of cool, an alchemy bottle or liquid magma"
   but seems less customizable as a general frame.
   Phase 2 round 1 (2026-11-14, `docs/mockups/skillup-p2.html`, built on skillup-r3's engine; what the crafting picks
   taught: a tool acting on the ring, punchy steps, the work's own place): **A. Ring + road** (the Phase 1 lock),
   **B. Around the craft ring** (no banner: a skill ring unspools around the craft ring at the cast bar, or around the
   gathered node beside you; number and road beside it), **C. Comet + impact** (A's banner, each point flies from the
   work to the ring head; 70 ms freeze, jolt, overshoot; the XP quest comet's language), **D. Stepping stones** (no ring:
   a row of stones to the next unlock, the tool hops one per skill-up and lights it; the last hop lands on the unlock).
   Round 1 → "these options aren't very differing" (A-C all a ring in a banner); D (stepping stones) not liked. The
   user asked: skill-ups inside the craft rings (one draggable module) or a separate draggable module (two)? Leaning
   two ("we aren't restricted by the design of the crafting rings"). My view: two (gatherers have no craft ring, so
   skill-ups need their own home anyway; one place for every skill-up; a Create All batch keeps the ring busy).
   **Decided: two modules** (skill-ups are their own draggable module; an optional spark from the craft ring can link
   them). Round 2 (same page, the round-1 options kept in the code but off the panel), each a different way to show
   progress: A. Ring + road (the lock), **B. Odometer** (a big rolling counter, each digit snaps up with a tick and
   overshoot; a thin material line under it to the next unlock), **C. It comes to you** (no bar: the next unlock waits as
   far away as the points left and hops closer each skill-up, then snaps into your skill ring), **D. The tool charges**
   (the tool icon fills with color bottom-up as the gauge; full, it swings once onto the unlock icon).
   Round 2 → "not fully feeling the new options" (not tested option by option; it was built before the budget rule was
   applied). Round 3 (2026-11-14, same page, keys 1-4; round 2's code kept, off the panel), pitched first, each carried
   by something no other option uses: A. Ring + road (the lock), **B. Piece by piece** (the next unlock's icon, faint
   from the start in 16 pieces; each skill-up slams a piece in from below, the piece being earned fills from its
   bottom; the last closes the seams, flash, the name lands), **C. The stamp** (no gauge: each skill-up stamps a round
   seal with the new number, panel jolt, dust ring, thud; stamps pile askew; the unlock stamps a bigger gold seal with
   its icon, double thud), **D. The bell** (only the profession's icon in a round frame; each skill-up strikes it like
   a bell: swings, light rings ripple, a chime whose note climbs as the unlock nears (8 notes, a run a step each); the
   unlock = the top note as a chord, the unlock rises out of it). Dropped at the pitch: the material piling up as real
   icons (too close to the Create All pile).
   Round 3 → **A still the favourite**, **D (the bell) liked**; B "a little too playful" (dropped); C "cool but not
   quite the theme of this addon" (dropped).
   The user then asked for new iterations in the A + D direction (resonance: sound and light) and for words on the
   theme (now in docs/style-guide.md, "The theme in one line"). Round 4 (same page, keys 1-4; rounds 2-3 kept in the
   code, off the panel), pitched first: A. Ring + road (the lock), **B. Singing ring** (A, but the ring is the bell:
   on each strike the arc shimmers, a point of light runs from the seam to the head, light rings go out, a chime
   climbs with the fill; closing = the chord + a wide gold ripple), **C. Ripple reach** (D's bell with the road as
   faint circles around it, the next unlock nearest; each strike's ripple reaches further, leaving a soft light pool;
   touching the next circle lights it, the icon pops, the chord), **D. Tightening string** (no ring: a string from
   your skill to the next unlock, slack while far; each skill-up plucks it, it vibrates, tightens and sounds higher;
   at the unlock it snaps taut with a flash). Shared: the 8-note scale (`SCALE8`, `noteDeg`: higher as the unlock
   nears, a run a step each), the bell and pluck sounds.
   **After the lock (the user, 2026-11-14): a per-profession pass for skill-ups**, like crafting's Phase 2 for all
   ten: the locked skill-up design gets its own look per profession (material, tool, sound, finale; crafters and
   gatherers incl. Skinning, Fishing, First Aid, Cooking), not just the five sample professions on the page.
   Round 4 → "uniquely cool but don't give off a progression feel like A does"; B "just A with some more sound
   effects, not bad but not what I was expecting on a new iteration". Learned: a skill-up design must read as
   progression first (an amount building toward a visible goal, the road ahead); sound and light are add-ons.
   The per-profession pass is run like crafting: first the general skill-up design (as the Ring was), then
   rounds of unique designs per profession.
   Round 5 (same page, keys 1-4; rounds 2-4 kept in the code, off the panel), pitched first, progression first:
   A. Ring + road (the lock), **B. The whole journey** (the career 1-300 on one line in its four ranks, zoomed on your
   stretch: the lit trail in the material, unlocks ahead as icons, the tool at the head; an unlock zooms out to the
   whole career for ~1.5 s, then back), **C. Building up** (a column of the material, one block per point, the coming
   unlocks as ledges on its side; each skill-up drops a block with weight (thud, puff, settle); the view climbs; the
   ledge lights at the unlock), **D. The horizon** (a road into the distance, one mark per skill point flowing toward
   you; the next unlock stands on it and grows as it nears, the later ones further back; at the unlock it arrives,
   pops and steps aside).
   Round 5 → "pretty cool options"; **A and B fit the theme** better than D (dropped). **C is a per-profession
   idea**: "an alchemy bottle filling up, or a pile of molten metal". The user wants **customizability, or designs
   unique per profession** (structure question for the next step: a general look + per-profession forms, and what
   the player can choose).
   Round 6 (same page, key 1; A and B plain on keys 2-3; rounds 2-5 kept in the code): **A vs B, dressed**, to
   judge which frame customizes best before the lock. A (Ring + road) on top and B (The whole journey) below on one
   clock, both dressed per profession through three hooks every frame calls (`DRESS[prof].head` at the head,
   `.icon` on each unlock icon, `.unlock` at the unlock): Alchemy (the liquid bubbles at the head, a drop splashes in
   per skill-up, reached unlocks bubble, the unlock boils over), Blacksmithing (white-hot head dripping molten metal,
   reached unlocks glow with heat, a spark fountain + clang), Herbalism (a bud rides the head, reached unlocks bloom
   with petals, a petal burst). Tailoring and Mining undressed.
   Round 6 → **A still looks the cleanest**; B "takes up a lot of space for something I'd prefer to be a quick
   progress update". Seeing both dressed together was "a little overwhelming": **the same look in two places feels
   off** (the echo). That applies to A too: it shares the craft ring's form (a material arc with the tool at the head),
   and the skill-up comes right after the craft. New rule: skill-ups get their own form, compact (a quick progress
   update), sharing the colors and materials, not the ring and the tool. The user asked for new designs for this.
   Round 7 (same page, keys 1-4; rounds 2-6 kept in the code), pitched first: compact quick updates, **no ring and
   no tool** (no echo of the craft ring), each with an obvious per-profession slot: A. Ring + road (reference),
   **B. Pips to the unlock** (a slim strip: profession icon, name + skill, a row of up to 12 pips counting down to the
   next unlock's icon; a long stretch makes each pip a few points, filling partway; the pip is the profession's shape:
   drops, sparks, leaves, stitches, ore chips; the unlock sweeps light along them), **C. The unlock fills up** (the
   next unlock's icon in a game frame fills from the bottom with the material: bubbling liquid, molten metal with a
   glowing top, a climbing vine, rows of thread, ore; a splash per skill-up; full = the icon lights), **D. Countdown**
   (a big number of points left beside the unlock's icon; the digit changes per profession: Alchemy melts and drips,
   Blacksmithing lands white-hot and cools to gold, Herbalism sprouts with two leaves, others roll; at zero the
   unlock lights).
   Round 7 → **A dropped for skill-ups** (the echo: "the Blacksmithing skill-up and the animation are basically the
   same thing"); **D dropped**; **B and C are the direction** but "not 100% happy": B, "I don't like seeing a bunch
   of the same icon over and over in a row"; C, "a cool idea but not quite implemented well".
   Round 8 (same page, keys 1-3; rounds 2-7 kept in the code), pitched first: A. The unlock fills up (round 7 C, the
   reference), **B. One notched line** (B without repeated icons: one slim line of the material to the next unlock's
   icon, notches one per point (or per few, up to 15); the notch the material reaches does the profession's thing: a
   drip, sparks, a bud opening, a stitch knot, an ore chip; the unlock flashes the line), **C. The icon colors in** (C
   cleaner: nothing covers the icon; it starts grey and colors in from the bottom; a thin edge in the profession's
   style marks the level: wavy liquid with bubbles, a white-hot edge with a heat tint, vine tips, a stitched seam, a
   jagged ore seam; full = all color, pop).
   Round 8 → **C "a big step backwards"** (dropped). What the user liked in A (round 7's fill): **a container filling
   up with the materials inside**; they want *different ideas of that kind*, "not the same thing done a slightly
   different way". **B (One notched line) is moving forward**: "I like that direction, looks like we could
   personalize it". B becomes the reference for round 9.
   Round 9 (same page, keys 1-4; rounds 2-8 kept in the code), pitched first; "the wall" the user disliked = a
   literal blocky square frame (a shaped vessel is fine): A. One notched line (round 8 B, the reference),
   **B. Poured in** (the profession's vessel beside your skill: flask, crucible, pot, cup, bin; each skill-up delivers
   a portion from above: a drop, a molten stream from a ladle, a seed (the plant grows taller), a thread strand, an
   ore chunk; it lands with the tool's sound and the level rises; the next unlock waits at the brim), **C. Lifted up**
   (no container: the material builds up under the next unlock's icon and lifts it to a thin goal line: a liquid
   column, stacked ingots cooling below a hot top, a stalk with leaves, thread winding up, a pillar of ore chunks; a
   bounce per skill-up; touching the line lights it), **D. The line is the container** (the notched line becomes a
   long, low container in the profession's look: a glass tube, a mould channel with a hot front, a planter trough
   with sprouts, a seam being sewn, ore on a cart track; each skill-up surges the front forward; notches on the rim).
   Round 9 → (the user, stopping for the night 2026-11-14) **A "pretty simple and gets the point across"**; **B "I
   like how each one is unique and can be built on"**; C: "really like the Herbalism animation" (the stalk lifting the
   icon), not the rest; D: likes Herbalism's (the planter trough with sprouts), "the others aren't bad but I'm not
   fully feeling this one". Overall: **"the one" not found yet**, not all in on any option; **the presentation needs
   work**: space is used poorly (a lot of empty space), it could show more info or more design; "I don't want to
   over-design". Liked so far: A's simplicity, B's per-profession uniqueness, Herbalism's growing plant (in C and D).
   Next session: tighten the layout first (use the space: a compact module that carries more info or design), then
   one bold round built from those likes; pitch it first.
   Round 10 (same page, keys 1-2; rounds 2-9 kept in the code, off the panel), pitched first. **The tighter layout**
   (both options): one slim module (~282x66, no dead band): line 1 the name, the skill rolling, then "/ 150 Journeyman"
   small (the rank cap and rank); the next unlock with its icon and "N to go" in gold (crafters: "Expert rank at 150");
   gatherers add "then" and the two unlocks after it as small icons with levels. **A. The notched vessel** (round 9 B +
   A): the profession's vessel at the left, as tall as the module, with A's notches up its side (up to 10, the top one
   gold = the brim = the unlock); each skill-up pours a portion in and the notch it reaches lights and does the
   profession's thing. **B. It grows along the line** (A + the Herbalism plant): A's line is alive and grows toward the
   unlock's icon at its end, a step per skill-up: a vine with leaves and a bud (Herbalism), a blade white-hot at the tip
   cooling to steel (Blacksmithing), a crystal growing facet by facet (Alchemy), a seam stitching itself (Tailoring), a
   vein of ore with glints (Mining); faint notches under it count the points.
   The user expected four options (rounds have four; "fewer, bolder rounds" means fewer rounds, not fewer options), so
   round 10 got two more (keys 3-4, all four now 300 wide): **C. The module fills** (the whole panel is the container:
   the material rises behind the text, dim, with a surface line; notches on the right edge; full = the panel flashes and
   the corner icon pops) and **D. From one to the other** (an hourglass: the top bulb is the points still to go, the
   bottom the points done; each skill-up runs a portion through the neck in the profession's material).
3. Create All pile (CraftTray), Phase 2: its own system (the Ring is only the cast bar's new look); the one link is the
   handoff, the made item landing in the pile at the end of the cast, so it comes while crafting is fresh.
4. Gathering animations, Phase 2 (node burst, merging +N, climbing notes, the harvest tally).
5. The loot window ("Picked up" rows / harvest window, the loot column), Phase 2. After gathering: gathering feeds it.
6. Build the professions set (wow-mockup-to-addon), test in game.
Leveling:
7. XP, Phase 2 (Phase 1 pick: xp-r10, kills Rain, quests Comet + impact).
8. Rep, Phase 2 (Sweep + faction rings).
9. Level-up, Phase 2 (levelup-r4: Ascension, Cinematic every tenth level).
10. Build leveling, test in game.
Last, if the weekly budget allows (else 1.5.0):
11. Dungeon recap, Phase 2 (Slim strip + Final medallion), then build.
12. Release 1.4.0.
1.4.1+: Phase 3 Polish for skill-up, gathering, the loot window, XP, rep and level-up.

### 1.4.0 scope, revised 2026-11-12: Leveling + the dungeon recap

Brainstormed with the user 2026-11-12 after a CurseForge comment asking for "numbers go up" moments (XP, levels).
**1.4.0 = Leveling + the dungeon recap** (both testable solo). The dice roll moves to **1.5** (it needs a real
group to test). Design process as in 1.3: no cap on mockup rounds. Picked leveling pieces (all four, plus one of
the user's own):
- **XP bar flourish**: a glow runs along the game's XP bar on kill/quest XP; bigger chunks sweep bigger; rested
  XP its own tint.
- **Level progress ticks**: a small "+10%" climb every tenth of a level.
- **Level-up moment**: a banner with the new level and what it unlocks (talent point, trainer spells, mount at
  40). Silent (the game plays its own; "no level-up sounds" preference).
- **Level-up summary** (the user's idea, from RPGs): the stats tick up from the old values to the new level's
  (health, mana, Strength, Agility, Stamina, Intellect, Spirit, talent points).
- **Reputation gains**: the rep bar fills; a banner on a new standing (Friendly to Honored).
- To verify on Forever: `PLAYER_XP_UPDATE`, `CHAT_MSG_COMBAT_XP_GAIN`, `PLAYER_LEVEL_UP` (Classic payload:
  level, hp, mana, talent points, the five stat deltas), `UnitXP`/`UnitXPMax`/`GetXPExhaustion`, `UnitStat`,
  `UPDATE_FACTION`/`CHAT_MSG_COMBAT_FACTION_CHANGE`, `GetWatchedFactionInfo`, the XP bar frame
  (`MainMenuExpBar`?) and whether other bar addons replace it.
- No damage numbers (they'd compete with the combat UI).
- **API findings** (wow-api-researcher, 2026-11-12; evidence from RoadToSixty/Loredex on Forever + Ketho
  annotations; no Blizzard UI source locally):
  - Kill XP: `CHAT_MSG_COMBAT_XP_GAIN` (proven on Forever; the combat log is blocked), match
    `COMBATLOG_XPGAIN_FIRSTPERSON` as a prefix so the rested tail still matches. Quest XP: `QUEST_TURNED_IN
    (questID, xpReward, moneyReward)` (proven). `UnitXP`/`UnitXPMax`/`GetXPExhaustion`/`GetMaxPlayerLevel` (60).
  - `PLAYER_LEVEL_UP` fires, but its payload is probably **retail's** (level, hp, power, talents, pvp slots,
    str, agi, sta, int; no spirit), not Classic's. **Snapshot the stats ourselves** (`UnitStat` 1-5,
    `UnitHealthMax`, `UnitPowerMax`) and diff them; guard for secret values.
  - Rep: `C_Reputation.GetWatchedFactionData`/`GetFactionDataByID` (the old GetFactionInfo family is missing),
    `UPDATE_FACTION`, `CHAT_MSG_COMBAT_FACTION_CHANGE` (`FACTION_STANDING_INCREASED_BONUS` first), and an event
    `FACTION_STANDING_CHANGED(factionID, standing)` (works on Forever, per Loredex). Labels
    `FACTION_STANDING_LABEL1..8`, colors `FACTION_BAR_COLORS`.
  - Bars: Forever has the retail UI, so probably `StatusTrackingBarManager` (Edit Mode), not `MainMenuExpBar`.
  - Secret values: system/skill chat is secret in instances; guard every chat text with `issecretvalue`.
  - To `/dump` in game: `COMBATLOG_XPGAIN_FIRSTPERSON, COMBATLOG_XPGAIN_EXHAUSTION1`; `StatusTrackingBarManager ~=
    nil, MainMenuExpBar ~= nil`; `UnitCharacterPoints, GetUnspentTalentPoints`; PLAYER_LEVEL_UP's args at a level.
- **Redesigns of 1.3 pieces** (the user, 2026-11-12: 1.3 went straight to final designs without the wide
  exploration the popups got in popup-designs.html):
  1. **Bars first**: one exploration page (`docs/mockups/bars.html`) with 5-6 clearly different bar families,
     each shown as skill-up, XP flourish, level-up (+ stat summary) and rep. The picked family replaces the
     skill-up bar and sets the look of every 1.4.0 bar.
     Round 1 (bars.html, 6 families): the user's top three, in order: **Ring, Constellation, Segments**. Worry:
     losing the horizontal bar's per-profession designs. Round 2 (skillup-r2.html, skill-ups only): each bar
     drawn in the profession's material, its tool riding the tip, unlocks in the design. The user: **Ring and
     Constellation** ("Ring is the cleanest, Constellation shows milestone icons"). Round 3
     (skillup-r3.html): Ring, Ring + road (next unlocks in a row beside it), Milestone ring (unlocks on the
     ring at their levels), Constellation. **Picked 2026-11-12: Ring + road** (skillup-r3.html "B"): the ring
     in the profession's material with its tool riding the head, the next unlock at the seam, the next few
     unlocks in a row beside it with their levels (crafters: the text line). It sets the look for XP and rep.
     Then XP, then rep, one at a time (the user has ideas for both).
  XP and rep (the user, 2026-11-12): **no new bars; work on the game's own XP and rep bars** (overlays).
  Milestones get the big moments: the +10% tick, a new rep standing (banner), the level-up screen. Ideas:
  **orbs flying into the XP/rep bar** (in game the bar jumps at once, so we cover the new part and reveal it
  as the orbs land); **any rep gain** reacts, not only the watched faction; the rep bar can be hidden: then
  draw nothing on it (another way to show the gain). XP round 1: docs/mockups/xp-r1.html.
  XP round 1 → the user liked **Comet, Stream, Burst & gather** but "not 100% there, not sure why". Round 2
  (xp-r2.html) keeps those three with switches to find what's missing: the bar drinks it in (bulge, ripple,
  head flare), a counter, snappier, orbs from the character or just above the bar, sound (notes per orb /
  whoosh + chime / soft taps + chime); and a **Kill + loot** moment (is XP with a loot popup too much?):
  together / XP waits / XP goes small. Everything a switch.
  XP round 2 → **Snappier and the Counter are in**; "the bar drinks it in" optional (not felt); direction
  **Stream** (it follows the count-up; still not 100%); sound **soft taps + chime**, but worried about fatigue
  with fast kills + loot ("dopamine is the goal but it mustn't get exhausting over a long session"). The
  With-loot choices were too subtle. Round 3 (xp-r3.html): four streams (Stream, Stream with a head, Ribbon,
  Sparkle stream), a Grinding moment (8 kills / 11 s, 5 with loot), a **Calm when busy** sound policy (one
  reward chime at a time; XP chimes wear off 100/70/50/35% then taps only, 30 s window; ≤6 taps per kill;
  quest and +10% always sound) with an on-screen sound log, and clearer With-loot (XP waits 1 s / XP goes
  quiet). The calm idea could become addon-wide (loot, gathering, crafting share one budget).
  XP round 3 → **Stream stays the pick** (with Snappier + Counter); Ribbon "kind of cool but doesn't feel
  snappy" (a snappier Ribbon is a possible later try); Stream with a head and Sparkle stream not liked.
  **Open, the user is thinking:** the With-loot handling (Together / XP waits / XP goes quiet; the
  difference is now clear) and the Calm-when-busy policy (no verdict yet). Moving on to other pieces.
  The user is **still not 100% happy with the XP picks**; revisit after rep.
  XP round 4 (xp-r4.html, after rep and level-up were picked): Stream (reference), **Snappy ribbon** (the
  Ribbon about twice as fast), **Sweep** (no motes: a light runs over the new part while the counter climbs,
  like the rep pick; XP stays on the bar), **Head ring** (a small ring over the fill's end fills as the
  counter counts, closes and drops into the bar). Counter + Snappier in all; Grinding, the sound log and the
  With-loot choices carried over.
  XP round 4 → **Sweep and Snappy ribbon best**, but "not varying enough to decide". Round 5 (xp-r5.html)
  varies **where XP shows**: on the bar (Sweep), from you to the bar (Snappy ribbon), **at your feet**
  (Feet halo: a ground ring = your level progress, grows per gain; when full it becomes the Ascension halo
  that rises into the level-up), **with your loot** (Picked-up row "+245 XP", merges kills "×3", a thin
  progress line; the game's bar just updates).
  XP round 5 → **XP lives on the XP bar** (the user): it's always visible, unlike other systems, so effects
  should use it; no second place to look (Feet halo "really cool" but splits the info from the bar; the
  Picked-up row is out). Round 6 (xp-r6.html), all on the bar: Sweep, Snappy ribbon, **Segment pop** (the
  game bar's 20 segments pop as a gain completes them), **Bar swell** (the bar swells, the new part fills
  like liquid with a wave), **Ring at the end** (a ring at the bar's right end holds the next level, a spark
  runs along the bar to it; Ring + road on XP; on a level-up it closes and launches the Ascension).
  XP round 6 → the user asked for 3+4+5 together: **Combined** (swell + segment pops + ring at the end) is
  the **new baseline, likely the pick**. Round 7 (xp-r7.html) varies one thing each: **Chain counter** (one
  climbing counter "+1,470 XP ×6" through a pull, 4 s ends it; swell/pops grow with the chain), **Rolling
  bulge** (a bulge rolls along the bar instead of the whole-bar swell), **Ring with info** ("~33 kills to
  24" / "~3 more quests" above the ring, from the last gain), **Session glow** (this session's part of the
  bar shimmers), **Quiet kills, loud milestones** (plain kills: light swell + counter; quests and 10%
  crossings: the full show).
  XP round 7 → **behaviour picked: Combined + Chain counter + Session glow + Quiet kills, loud milestones.**
  But "these options aren't varying the design of our XP intake": round 8 (xp-r8.html) keeps that behaviour
  and varies the **look** of the intake (fill, segment pops, spark run, ring): Liquid (today's), Crystal,
  Ember, Runes, Starlight, Spark.
  XP round 8 → "can barely tell the difference; I meant how the bar *gains* XP, like Comet/Stream". Round 9
  (xp-r9.html): the picked behaviour in the Liquid look, driven by the **arrival** (the bar swells while XP
  lands, pops as it completes segments, the ring spark when all is in): Stream, Snappy ribbon, Comet, Burst &
  gather, **Rain from above** (drops onto the new part), **Along the bar** (a pulse enters at the left end and
  runs along the fill), **From the ring** (a pulse comes back from the next-level ring, the fill reaches out).
  XP round 9 → **liked: Stream and Comet** ("look much better with the bar animations") **and Rain from above,
  Along the bar**; out: Snappy ribbon, Burst & gather, From the ring (its back-and-forth pulse "kind of
  cool": a detail to reuse). Idea: pair them by size, matching quiet kills / loud milestones: kills =
  Rain or Along (short, at the bar), quests and big gains = Comet or Stream (a journey from you).
  **Kills = Rain from above (picked).** Quests: Stream or Comet undecided; the user wants quest turn-ins
  **punchy**. Round 10 (xp-r10.html, kills always Rain): Stream, Comet, **Comet + impact** (freeze-frame
  ~70 ms, small shake, a shockwave both ways along the bar, a low thump, the counter slams big), **Charge &
  slam** (the stream gathers into a ball above the fill's end, then slams down), **Barrage** (three comets,
  each harder and higher, the last with the full impact), **Stream + finisher** (the stream brings ~70%, a
  comet slams the rest home).
  **XP PICKED (2026-11-12, xp-r10.html):** on the game's XP bar, Liquid look. Behaviour: Combined (the bar
  swells and fills like liquid while XP lands; completed segments pop; a spark runs to the ring at the bar's
  end holding the next level) + **chain counter** (one climbing "+N XP ×k", 4 s ends it) + **session glow**
  + **quiet kills, loud milestones** (plain kills: light swell + counter; quests and 10% crossings: full
  show). Arrival: **kills = Rain from above**; **quest turn-ins = Comet + impact** (freeze-frame ~70 ms,
  small shake, shockwave both ways along the bar, low thump, the counter slams). The +10% tick stays.
  Still open: the With-loot handling and the Calm-when-busy sound policy.
  Rep round 1 (rep-r1.html): watched faction on the game's rep bar (Stream like XP / Sweep); other factions or
  a hidden bar: Faction rings (mini Ring above the bars) / Picked-up rows (side column) / Over your head;
  same-faction gains within 3 s add up in one counter (kill rep); new standing = Ring + road banner (the
  ring closes, the standing rolls over, the road is Neutral…Exalted, a perk line); Exalted bigger and gold.
  Rep round 1 → **Sweep** on the watched bar. Other factions as a **setting**: the user likes Faction rings,
  rings over the head or over the bar (careful: action bars sit above the XP bar) or draggable, and the
  Picked-up rows (clean when one kill moves many factions: Bloodsail kills raise four goblin towns and
  lower the pirates). Wants **quiet repeats** and faction **icons** if the API has them.
  Rep round 2 (rep-r2.html): setting Picked-up rows (proposed default) / Faction rings / Off; rings: two at
  most then "+N more", placed above the action bars / over your head / dragged (Move frames); **losses**
  shown quietly (dim red, no sound, no pop); Bloodsail moments (one kill, five kills); quiet repeats (one
  tick per kill however many factions; 100/70/50/35% then silent within 30 s; a new standing always chimes).
  **Rep picked (2026-11-12):** watched faction = **Sweep** on the game's rep bar (only while it's shown);
  other factions (and a hidden bar) = setting **Faction rings (default) / Picked-up rows / Off**; the rings
  are **draggable** (Move frames; default spot clear of the action bars, to settle when building); rows are
  the informative option. Two rings at most then "+N more"; losses quiet; quiet repeats; same-faction gains
  within 3 s add up; new standing = Ring + road banner.
  Level-up round 1 (levelup-r1.html): four layouts, all silent, Stream into the bar first: Ring + road
  (ring left, stats in two columns), Grand ring (big ring high in the middle, each stat pops out as a small
  ring around its lower half), Ledger (RPG list: old → new rolling, gain in purple), Road of levels (levels
  as a road, the ring rolls to the new stop, next big stops: talents 10, riding 40, 60; stats in a strip).
  Moments: level 24, **mid-fight** (a small ring now, the full screen once the fight ends), level 10
  (talents open), level 40 (riding). Options: dim the world, stat tick sounds (off).
  Level-up round 1 → the user likes **Grand ring** and **Ledger** most. Round 2 (levelup-r2.html): Grand
  ring, **Medallion** (the grand ring as a medallion on the Ledger card), Ledger, **Ringed ledger** (bigger
  level ring, a small ring per row that fills as it rolls); exit: **the stats fly into you** (motes into
  the character, a ring rises) or fade; in game hover holds it and a click closes it.
  Level-up round 2 → "the options are a little too similar". Round 3 (levelup-r3.html) differs in staging:
  **Ascension** (a light column and halo rise from your feet over your head, the stats float up off you
  into a column beside it), **Cinematic** (letterbox bars, a huge faint ring behind a giant number, the
  stats in one row across the screen), **Card flip** (eight face-down cards flip one by one to show each
  gain); Grand ring and Ledger kept to compare; exit choice kept.
  Level-up round 3 → **Ascension and Cinematic** liked ("nice way of branching out"); **Card flip rejected
  for good**: no lottery/chance-style designs anywhere, the addon supplements the game's systems.
  Level-up round 4 (levelup-r4.html): **Ascension for every level, Cinematic for every tenth level**
  (10, 20 … 60; the user: "every 10 levels deserves a cinematic milestone, especially for Classic"). The
  milestone **grows out of Ascension** (switch): the halo rises from your feet, flies up and becomes the huge
  ring as the film bars slide in. Each milestone: the road of decades (10…60, the new stop lights), the
  stats row, its unlock shown big (talents 10, riding 40, the top 60 "your XP bar retires"; 20/30/50 say
  where you are on the climb). Ascension's stat column moved to the **left** (popups come in on the right).
  Mid-fight: a small ring now, the full moment after the fight (the Cinematic never plays in combat).
  **Level-up picked (2026-11-12): round 4 as the direction** ("Nice, I'm liking this"); polish details
  later if needed.
  Rep API findings (wow-api-researcher 2026-11-12): **no faction icons in the API** (FactionData has none;
  only retail renown has art; RoadToSixty uses one generic Achievement_Reputation_01 for all). So: a
  hand-made factionID -> game icon table (~40 Classic factions; check each path in game), generic icon as
  fallback. Chat: only FACTION_STANDING_INCREASED(_BONUS) proven on Forever; DECREASED/_GENERIC variants
  unverified (`/run` list check in game); build patterns from _G at runtime, longest first, escape magic
  chars (RoadToSixty ChatPatterns.lua does this). Name -> factionID: no lookup API; scan
  GetNumFactions/GetFactionDataByIndex (expand collapsed headers, re-collapse, guard re-entry) once at login
  or for an unknown name, then cache; FACTION_STANDING_CHANGED gives the ID directly. FACTION_BAR_COLORS
  probably exists (keep a fallback); labels FACTION_STANDING_LABEL1..8. **After the XP pick: iterate on the level-up
  screen** (the user wants its own rounds).
     **Crafting redesign started 2026-11-12, one profession at a time, Blacksmithing first.** The user wants
     all four stagings explored: on the cast bar, beside it (1.3's spot), at the item in the profession
     window, around the character. Round 1 (docs/mockups/craft-bs-r1.html): **On the cast bar** (the fill is
     the metal heating red→white; beats strike its end with sparks and a squash; made = flash, quench steam,
     cools to steel, the icon pops out of its end), **Beside the bar** (the item's icon on an ember spot,
     jolted and heated per beat, quenched, gold ring "+1"), **At the item** (the recipe icon in the window
     heats and sparks; made = quench, then it flies out of the window into the bag, which bumps), **Around
     you** (sparks off your hands, a ground ring per beat; made = an ember fountain, the item rises over your
     head). Single craft + Create All ×5 with the 1.3 sound step-down.
     Round 1 → **keep 1.3's work beats** ("kind of unique"; the bar animation would lose them). The user's
     idea: **replace the game's cast bar while crafting** with our own. Round 2 (craft-bs-r2.html): 1.3's
     beats unchanged, and the bar: 1.3 as now / **Heated bar** (our bar, the fill heats like metal, the icon
     and time on it) / **Ring cast** (a Ring-recipe ring in the profession's color, the icon inside, time
     under; closes with a flash + shockwave) / **Ring + batch** (an outer thin ring for the Create All,
     "3 / 5"). **Feasibility (wow-api-researcher 2026-11-12): yes, by alpha only.** `PlayerCastingBarFrame`
     (not protected, but a UIParent-managed frame): `HookScript("OnEvent")` and on UNIT_SPELLCAST_START with
     `select(6, UnitCastingInfo("player"))` (isTradeskill) set alpha 0, else 1 (Blizzard resets alpha 1 at
     each cast start, so the hook must run after it); never Hide/Show, SetParent, UnregisterEvent,
     SetAndUpdateShowCastbar or SetPoint (tainted layout → blocked actions in combat). Leave it alone while
     `isInEditMode`; restore alpha 1 when the batch ends or the feature is off. Read its rect for our bar's
     spot (as Spot() does), re-read at each cast start; `IsAttachedToPlayerFrame()` tells the locked look.
     Retail swaps in `OverlayPlayerCastingBarFrame` inside the Professions window when locked: check on
     Forever, alpha it too. Cast times may be secret in combat (guard). Keep our bar across Create All gaps
     (end on GAP_END). Unproven on Forever (no addon here hides the bar): in-game `/run` tests listed in the
     agent's report; taint check with `/console taintLog 1`.
     Round 2 → **Ring + batch picked** for the bar. Round 3 (craft-bs-r3.html): where 1.3's beats go around
     it, the payoff always at the instant the ring closes: **Beside** / **Attached** (a short gold hairline
     ties the beat spot to the ring; the closing flash runs down it into the CLANG; room for wide beats; my
     recommendation) / **Inside** (on the icon in the ring; cramped for Leatherworking/Tailoring) / **On the
     arc** (taps strike the arc's moving head, payoff at the top).
     Round 3 → **direction (the user): Ring + batch replaces the cast bar for every profession; the new beats
     go "On the arc".** Work through all eight professions until the user is happy with each. Every
     profession mockup from now on is **side by side on one clock**: left = Ring + batch with 1.3's animation
     beside it (as shipped), right = Ring + batch with the new iteration. Page: docs/mockups/craft-compare.html.
     Compare round 1 (2026-11-12): the left side ports all eight 1.3 effects from Craft.lua (Leatherworking
     = leather-r3 A, First Aid = firstaid-r7 P2) with 1.3's sounds; the right side is a first "on the arc"
     version of each: Blacksmithing taps on the arc head, CLANG at the top; Leatherworking holes punched into
     the arc, the thread along the ring; Alchemy bubbles and foam off the head, the cork off the top;
     Tailoring stitches on the arc, the snip at the top; Engineering a gear riding the head, ratcheting;
     Cooking spatters off the head, the food flips over the ring to the top, steam; Enchanting runes stamped
     on the arc, drawn in to the top; First Aid the plus drawn on the top seam, lit by the ring's closing.
     Blacksmithing iterations (the compare page's right side, "New iteration" A-D; left stays 1.3):
     **A. Arc taps** (round 1), **B. Heated arc** (the ring's stroke glows hot behind the head and cools to
     dark red; taps flash it white-hot; the CLANG turns the whole ring white-hot, then quench steam and it
     cools), **C. Sparks along the arc** (each tap throws sparks off along the ring's curve; the CLANG bursts
     sparks outward from the whole ring with a shockwave), **D. Forge marks** (each tap leaves a glowing notch
     across the ring that cools; the CLANG flashes them, the ring "rings" in ripples, steam).
     The user asked for **B + C mixed: E. Heated + sparks** (the heated stroke and white-hot tap flashes, C's
     sparks along the curve and outward burst at the CLANG, then the quench steam); the page opens on E.
     E → "the heated animation looks a little laggy, the sparks along the arc are nice". The heated stroke was
     60 glowing segments a frame; now one conic color sweep + one soft glow pass (0.18 ms a frame), tap
     flashes as small bright spots. In game it would be a texture (cheap either way).
     **BLACKSMITHING LOCKED (2026-11-12): E. Heated + sparks** on Ring + batch. **Process from here (the user):**
     get a direction locked for every profession on the compare page first; then a **final round of new ideas
     for each profession**, once the whole set has a clearer direction.
     Leatherworking iterations (same timing as 1.3: four punches, the thread, the tug): **A. Arc holes**
     (round 1), **B. Leather strap** (the ring's stroke becomes a tan strap as it fills, holes punched in it,
     the thread laces along it, the tug cinches the ring with a flash), **C. Crumbs and whip** (each punch
     knocks leather crumbs off; a bright thread whips once around the whole ring leaving a stitched line),
     **D. Lacing** (holes alternate inside/outside the ring, the thread zigzags between them like a boot lace
     and pulls tight at the tug). The page opens Leatherworking on B.
     → **C liked**, but "I was expecting more unique animations, not 4 similar" (A/B/D were all "holes +
     thread"; saved as a memory rule: every option a different mechanism). Round 2 keeps **C** and adds three
     different mechanisms: **E. Hide stretch** (the shape changes: a wobbly raw hide pulled into a true circle
     beat by beat, snapping taut with a twang), **F. Tooled pattern** (marks stamped in: embossed chevrons
     stamped around the ring stretch by stretch, a light sweep around it at the end), **G. Rivets** (objects
     set in: brass rivets hammered into the ring, shining one after another at the end).
     **LEATHERWORKING LOCKED (2026-11-12): C. Crumbs and whip** (E/F/G not liked). Fix: the four punches sit
     evenly, one per quarter (at 12.5/37.5/62.5/87.5% of the cast; 1.3's .18-.66 left a gap at the top-left),
     the whip runs right after the last (89-99%). More ideas wait for the final round.
     Alchemy iterations (four mechanisms, 1.3's beats): **A. Bubbles off the head** (particles; round 1),
     **B. Glass tube** (material: the ring is a glass tube filling with the potion, a sloshing liquid end,
     bubbles drifting inside, a surge per beat, foam, the cork pops), **C. Transmutation** (color: a reagent
     drop falls into the ring's center each beat with a ripple and the ring's color shifts a step toward the
     potion; a flash and a colored smoke puff when made), **D. Vapors** (rising smoke: colored wisps curl up
     off the ring, thicker each beat; vapor rings float up from the top when made).
     → the user liked something in each (A simple; A/B the cork popping; B very clean; C's finale: the ring
     glow and the shine at the top; D's vapor texture along the ring) and asked for a mix: **E. The mix** =
     B's glass tube + D's vapor wisps while filling; when made C's finale (center flash, colored smoke, the
     ring glowing in the potion's color, the shine at the top) + the cork popping. The page opens on E.
     E colors (the user): **the fill always purple** (no random potion color), and at the flash it **shifts to
     magenta-pink** like C's color change (ring, flash and smoke); each Create All item starts purple again.
     **ALCHEMY LOCKED (2026-11-12): E. The mix.** The glass tube stays (it gives Alchemy its material look);
     the user may revisit how busy it is in the final round.
     Tailoring iterations (four mechanisms, 1.3's beats .2/.36/.52/.68 and the snip): **A. Stitches on the
     arc** (marks added; round 1), **B. Thread wrap** (material: the stroke becomes wound thread, a bead of
     thread circling the head, each beat pulls a turn tight; the snip cuts the loose end at the top and a
     shine runs once round the wrap), **C. Silk ribbon** (flowing cloth: a pale-blue ribbon fluttering most
     near the head, a ripple travels back per beat; when made it snaps flat with a sheen and the snip),
     **D. Spool** (a feeder: a spool above the ring pays thread down and round, spinning faster each beat;
     the snip cuts between spool and ring, the spool spins down, the thread glints).
     **TAILORING LOCKED (2026-11-12): D. Spool** ("hands down the most unique"). Fix: the cut, sweep and snap are per item
     (Create All items 2+ lost the thread from the spool).
     Engineering iterations (four mechanisms, 1.3's clicks .3/.45/.6, then the boing + puff): **A. Gear on the arc**
     (an object riding; round 1), **B. Clockwork ring** (the ring itself moves: teeth grow on the filled part,
     the whole ring jolts a notch per click; a spring shoots up from the top and wobbles), **C. Live wire**
     (electricity: a crackle along the ring, a bolt from the head into the item per click; made = the whole
     ring discharges into the item, a flash, a puff), **D. Fuse** (the ring is a fuse cord burnt by a sizzling
     spark, a crackle of sparks per click; at the top a small friendly bang: flash, shockwave ring, smoke).
     → the user: A definitely works, C a cool idea, D a really cool idea; asked for D with an explosion:
     **E. Fuse + explosion** = D's fuse, then the item in the middle blows up: a fireball swelling well past the
     ring (white core, orange, red edge), sparks and dark debris flying out, two shockwaves, a smoke cloud
     drifting up; cartoon-sized, over in about a second.
     → the user: E definitely unique; A's turning gear liked; **keep 1.3's final sound (the boing, EngBoing)**,
     "really like the sound design", specifically the final sound. **F. Gear + explosion** = A's gear riding
     the head (no fuse) + E's explosion: "not really cohesive"; E stays its own idea.
     **ENGINEERING LOCKED for now (2026-11-12): A. Gear on the arc.** For the final round: iterate on A's
     turning-gears idea (the user leans to A); keep E (Fuse + explosion) on the table as its own option.
     Cooking iterations (four mechanisms, 1.3's sizzles .3/.45, the flip .62, the tss): **A. Flip over the ring**
     (round 1: spatters off the head, the food flips over the ring to the top, steam), **B. The burner** (the ring
     is the heat: the stroke glows like a stove coil, dull red to orange to yellow-white, heat shimmer inside;
     oil pops along the hot part, a lick of flame round the ring on the flip; made = a gold flare + steam),
     **C. On the spit** (the food itself cooks: the item turns on the spot and browns step by step, fat drips
     onto the ring's bottom with a flare, a quick full turn on the flip; made = face-on, a glaze shine, steam),
     **D. Season and serve** (things fall in: a pinch of salt, pepper and herbs sprinkles onto the food each
     beat and it bobs; made = warm gold "smells good" lines curl up).
     → the user: A the most unique; likes B's burner towards the end; C and D "interesting but not a fit".
     **E. Flip on the burner** = A's flip over the ring + B's burner as the stroke (heating up, the flame
     lick on the flip, the gold flare when made): "pretty cool"; asked for other designs instead of C and D.
     New **C. Grill marks** (marks seared onto the food: each sizzle sears a glowing stripe across the item,
     cooling to brown, with a wisp of smoke; the flip turns it over and the next sears cross the first, so it
     ends cross-hatched; made = the marks glow once + steam) and **D. Kitchen timer** (the ring is a timer:
     minute ticks light up around it, a pointer rides the head, the ticks jitter on each sizzle and rattle on
     the flip; made = it dings: all ticks flash, sound-wave arcs ring out from the top, then steam). The page
     opens on E. → "fun ideas"; **COOKING LOCKED (2026-11-12): E. Flip on the burner.**
     Enchanting iterations (four mechanisms, 1.3's chimes .3/.44/.58, the ping): **A. Runes on the arc** (round 1:
     runes stamped where the head is, drawn in to the top), **B. Magic circle** (lines drawn: each chime draws a
     glowing line corner to corner, a triangle inscribed in the ring; made = a second triangle flips in to make a
     star, the circle turns a little and flashes), **C. Orbiting motes** (each chime adds a bright mote orbiting
     the item, faster and closer each time, with a trail; made = they spiral into the item, it flares),
     **D. Shimmer and aura** (light: each chime sends a violet wave once round the ring, the item glows a
     little more; made = a white sheen across the item and a soft pulsing violet aura).
     → the user likes B and C but together they'd be overwhelming; leans to B. **E. Motes draw the circle** =
     one element doing both: each chime a mote travels corner to corner drawing B's line and rests at the
     corner (no orbiting); made = the motes draw the second triangle into a star, the circle turns and
     flashes, the motes spiral into the item, it flares. → "Nice": **ENCHANTING LOCKED (2026-11-12): E.**
     First Aid iterations (four mechanisms, 1.3's taps .4/.62, the done chime): **A. Plus on the seam** (round 1),
     **B. Heartbeat** (the ring is a pulse trace: a calm line with a sharp blip where each tap lands; made = the
     ring beats once, lub-dub, two green pulses), **C. Healing rise** (little green plus signs drift up from the
     ring, more on each tap; made = a column of soft green light rises through the item, glints at the top),
     **D. Mending ring** (a cracked green shell round the ring, broken at the taps and the top; each tap pulls a
     crack shut, the top one closes as it finishes and the shell glows whole).
     → the user: none really stand out; Heartbeat the most unique but its trace (outside the ring) overlapped
     the batch bar. Fix: B's trace is now the ring's own stroke, blips pointing in toward the item, clear of
     the batch bar.
     → the user wanted other options in place of A, C and D too, and noticed First Aid had a 1-2-final beat
     where the others go 1-2-3-final. **First Aid now taps three times** (.3/.46/.62, rising: AidTapA/B + a new
     AidTapC, then 1.3's done chime); in the mockup these iterations play their own taps (the 1.3 side's taps go
     silent). Round 2: **A. Salve** (drops that spread: a drop of green salve lands on the ring at each tap and
     spreads into a glossy patch; made = the patches coat the whole ring and a shine travels round), **B.
     Heartbeat** (kept, three blips), **C. Cross of light** (beams: a vertical beam through the item, then a
     horizontal one, the third tap brightens them with glints at the tips; made = the plus flashes and widens),
     **D. Soothing ripples** (ripples moving in from the ring to the item, each stronger, the item glows calm
     green; made = the glow swells like a slow breath, a last ripple goes out).
     → the user: still not feeling it; likes D's animations. **The feel is wrong: too healer/medic.** It should
     feel like **patching yourself up after a battle, or making a remedy in the wild with what you have**
     (rough, hands-on, cloth and herbs; not glowing green magic). Round 3 (D kept): **A. Field dressing** (a creased
     linen strip winds round the ring, each tap a hard tug cinches it tight with a puff of dust; made = a knot
     pulled at the top), **B. Slap on a patch** (each tap slaps a cloth strip across the ring at a rough angle,
     it lands big and squashes flat; made = a last strip over the top, all pressed down with a soft thump),
     **C. Crushed herbs** (leaf bits in the ring are ground round on each tap, smaller and darker into a paste;
     made = pressed onto the item as a dark green poultice dab, a cool ripple), **D. Soothing ripples** (kept).
     → the user likes A most and wants **more iterations of A later** (final round); for now A + D:
     **E. Dressing + ripples** = A's linen strip and tugs, each tug sending one of D's ripples in to the item
     (it warms to a calm glow); made = the knot at the top + D's slow-breath swell.
     **FIRST AID LOCKED (2026-11-12): E. Dressing + ripples.**
     **Every profession has a direction (2026-11-12):** Blacksmithing E (heated + sparks), Leatherworking C
     (crumbs and whip), Alchemy E (glass tube + vapors, purple to magenta), Tailoring D (spool), Engineering A
     (gear on the arc; E fuse + explosion kept as its own option), Cooking E (flip on the burner), Enchanting E
     (motes draw the circle), First Aid E (dressing + ripples; three taps now). Next: the final round of new
     ideas per profession (the user's plan), incl. iterations of Engineering A's gears, First Aid A's dressing,
     and maybe Alchemy's glass tube.
     **Final round (started 2026-11-12)**: craft-compare.html has a Round switch (Final round / Exploration
     rounds); in the final round A is always the locked design and B-D are new takes on it.
     Blacksmithing: its rhythm was 1-2-final too (tap, tap, CLANG), so B-D strike **three times** (.3/.46/.62,
     the taps rising: SmithT1-3 = H2.strike(0 / .75 / 1.5)). **B. The weld** (the ring's starting end heats up
     as the head comes round; the CLANG welds them: a flash, a molten bead on the seam dripping sparks, cooling
     white to orange to dark), **C. Bellows** (the whole ring at one heat, each tap a bellows pump: it flares
     hotter step by step, embers drift up; the CLANG goes white-hot, then a cooling wave runs round from the
     top with steam where it passes), **D. Hammered facets** (each tap flattens the ring into a short straight
     facet where it lands; the CLANG trues it round in a flash with the spark burst).
     → the user: combine A and C: **E. Heated + bellows** = A's stroke (white-hot at the head, cooling behind) and
     spark fans + each of three taps a bellows pump flaring the whole ring with embers; the CLANG = A's spark
     burst and shockwave, then C's cooling wave with steam. **BLACKSMITHING FINAL: E. Heated + bellows** (locked 2026-11-12).
     Leatherworking final round (A = locked Crumbs and whip; B-D play their own thoks on the four quarter punches,
     which the locked version borrows from 1.3 slightly off its punches): **B. Slack, then taut** (the thread whips
     through the holes hanging slack, sagging between them; the tug snaps it taut with a twang, it shivers and
     settles), **C. Stitch as you go** (after each punch a stitch runs from the last hole to the new one with a
     zip; the last stretch to the top whips shut at the end, the knot glints), **D. Burnished** (as locked, then
     the finish: a warm gloss runs round, leaving polished brown leather with a thin bright edge).
     **LEATHERWORKING FINAL: D. Burnished** (2026-11-12).
     Alchemy final round (A = the locked mix; B-D each change one thing): **B. Distillation** (each beat a single
     drop falls from above onto the liquid's end with a splash, a bright ripple runs back along it), **C. Layers
     that mix** (each beat pours a new shade of purple so the tube shows bands; when made the bands swirl and run
     together into the magenta), **D. Boil over** (bubbles grow livelier each beat; near the end foam rises over
     the top of the tube and spills a little; made = the cork pops and the foam settles with steam).
     → the user really likes D and asked for the exploration rounds' A bubbles off the head with it: **E. Boil over +
     bubbles** = D + bubbles boiling up off the liquid's moving end (a trickle while it fills, a rising burst each
     beat, more and bigger every beat, in the potion's purple). The end steam at the top looked awkward (the user):
     E now puffs foam off the head at 86% like the exploration A (light purple puffs + a ring) instead. Still a
     growing "steam" at the very top near the end: that was the boil-over foam, fixed at the top; it now rises off
     the head and travels with it to the top as the ring closes (in D and E). **ALCHEMY FINAL: E. Boil over +
     bubbles** (2026-11-12).
     Tailoring final round (A = the locked Spool; B-D change one thing each): **B. Needle leads** (a small bright
     needle rides the head pulling the thread, which goes round as a running stitch weaving in and out; the needle
     dips through on each beat), **C. Plucked thread** (the taut thread from the spool shivers like a string on each
     beat, a bead of light running down it; at the snip the cut end springs back up and curls), **D. Spool runs
     down** (the thread wound on the spool thins as the ring fills, the spool hops on each beat; at the snip the
     loose end whips round the nearly empty spool).
     → the user likes C and D; the running out should be more obvious: D's spool is now bigger and its thread runs
     down to the bare dark core, spinning faster as it empties. **E. Plucked + runs down** = C + D. The bigger spool
     was "a little too fat": back to the normal spool (as D first was), E = plain C + D. **TAILORING FINAL:
     E. Plucked + runs down** (2026-11-12).
     Engineering final round (A = the locked gear on the arc; new takes on its turning gears): **B. Meshing pair**
     (like 1.3's two gears: a second smaller gear meshes with the head gear just outside the ring, the two turning
     against each other, ratcheting together on each click; made = they spin up together), **C. Gears left behind**
     (each click drops a small meshed gear on the ring where the head is, three end up round it, ticking on every
     click; made = all spin together), **D. Wind up, let go** (a winding gear at the top turns a step tighter on
     each click, shaking a little by the third; made = it lets go, the head gear whirs once round the ring back to
     the top, then the boing).
     → the user likes the direction of B and D but isn't fully feeling them. Round 2: **E. Pair + wind-up** (B + D: the
     meshing pair rides the head with a few sparks per click, the winding gear at the top strains; made = it lets
     go and the pair whirs once round back to the top), **F. E + the spring** (a coiled spring shoots up out of the
     winding gear and wobbles with the boing, sparks off the teeth), **G. Drive the item** (the meshing pair rides
     the head and the item in the middle turns a notch on each click, like the end of the gear train; made = one
     full turn, settles face-on).
     → the user didn't mean combining B and D, only liked the direction; idea: **a ratchet turning**. E-G replaced with
     three ratchets in different places: **E. Ratchet at the head** (the gear becomes a saw-toothed ratchet wheel
     with a pawl; each click it turns one tooth and the pawl snaps into the next notch; made = the pawl lifts, the
     wheel spins free), **F. The ring is the ratchet** (saw teeth grow along the outside of the filled ring, a pawl
     rests on them at the head; each click the ring jolts one tooth; made = the pawl lifts away and the ring spins
     free once), **G. Ratchet round the item** (a big ratchet wheel round the item inside the ring, its pawl at
     the top, one tooth per click while the gear rides the head; made = it spins free).
     → "not quite": the user's idea (a sketch): **a wrench turns something 3-4 times, each turn steps the bar one
     section, then the finish** (no smooth fill). Built as **H. Wrench, 4 turns** and **I. Wrench, 3 turns**: the ring is
     the wrench's ring end round the item, the handle sticks out and swings; each forward swing turns the bolt (a hex
     round the item) and steps the ring one whole section with a solid click (sparks at the step), the swing back
     ticks twice (the ratchet); then the boing + puff. The smooth fill is hidden, the track shows its sections
     (bright steel fill, dark empty track). Own sounds (EngTick per turn, quiet ticks back).
     → "exactly what I was thinking"; can't decide 3 or 4, 4 feels more like tinkering. **Baseline from here: A
     (locked gear) and the wrench with 4 turns.** The round was trimmed to: A, **B. Wrench, 4 turns** (was H),
     **C. Wrench drives the gear** (the swings as B, the locked gear rides the end of the fill and rolls through each
     new section with the swing), **D. Seat the bolts** (a hex bolt stands proud at the end of each section; each
     swing spins the next one down flush with a flash, its section lights), **E. The crank** (the handle goes all
     the way round once per turn, four full turns, the section filling as it goes, a click at the end of each).
     The earlier B-G and the 3-turn wrench stay in the code but off the buttons.
     → "cool iterations, but I was thinking you would come up with 2/3 different animations, not variations of the same
     wrench" (the clearly-different rule again: new ideas means new mechanisms). C-E replaced (the wrench variants stay
     in the code, off the buttons): **C. Parts snap in** (assembly: on each click a part, a gear then a bolt then a
     spring, flies in from outside and snaps onto the ring at the head; made = they all flash), **D. Pressure gauge**
     (the ring is a gauge with ticks and a red zone before the top; a needle rises in jerky steps, trembling more as
     pressure builds; made = a valve at the top pops a quick jet up with the boing, the needle drops back),
     **E. Blueprint** (while it fills the ring and the item are a pale-blue blueprint with drafting lines sketched
     inside, more each click; made = a bright line sweeps across printing it into the real item).
     → the user sticks with **Wrench, 4 turns** and asked for add-ons like Alchemy's. C-E replaced again (round 4 kept
     in the code): **C. Sparks and strain** (sparks spray where the wrench bites on each turn, each turn harder: the
     handle trembles more, the fourth is the tightest with a bigger burst), **D. It starts up** (finale: light races
     round the four sections twice, the bolt glows and spins once, then the boing), **E. The spring** (finale: a
     coiled spring shoots up out of the top and wobbles with the boing, a few sparks off it).
     → likes It starts up, not C or E: **ENGINEERING FINAL: D. Wrench, 4 turns + it starts up** (2026-11-12).
     Cooking final round (A = the locked Flip on the burner; B-D each add one thing): **B. Sizzling pan** (little pops of
     hot oil spit off the burner the whole time, more the hotter it gets), **C. Golden brown** (made = the item browns
     to a warm gold and a glaze shine sweeps across it), **D. Flambé** (on the flip a burst of flame leaps up round the
     top of the ring, embers drifting after, in place of the small lick).
     → **The user clarified the final pass (2026-11-12):** it is for ENTIRELY NEW designs inspired by the first-pass
     picks (as the wrench was), not add-ons; the first pass was inspiration (the user may still keep a first-pass
     design). One profession at a time. After Enchanting and First Aid, a **final-final polish/idea round for all 8**
     with the same intent. (The kit now has this process as the skill `wow-design-rounds`, and
     `wow-mockup-to-addon` for the build.) Cooking redone (the add-ons stay in the code, off the buttons): **B. Stir
     the pot** (a pot from above, a spoon stirs four laps, each lap fills a quarter, the stew swirls and bubbles more
     each lap; made = a big bubble pops), **C. Toss the pan** (a frying pan with a handle; three tosses, the food hops
     up and lands with a sizzle, each toss a third; the third flips it right over), **D. Chop it in** (a knife at the
     side chops three times, the cut pieces tumble into the middle round the food; made = they sizzle bright). Opens
     on B.
     **Run order from here (the user, 2026-11-12, now with the `wow-design-rounds` skill):** finish Phase 2 one profession
     at a time (Cooking pick, Enchanting, First Aid); then Phase 2 once more across all 8 (the skill came half way, so the
     earlier professions get new designs too); then Phase 3, Polish.
     Cooking pick: **C. Toss the pan** ("definitely C, my favorite"), with the burner added: **E. Toss the pan + burner**
     (the pan's ring heats as it steps, dull red, orange, yellow-white; a lick of flame round the ring as the big flip
     lands; made = a gold flare). + A's little sizzle (a spatter off the end of the fill on each landing).
     The third toss now hangs in the air longer (30% of the cast, higher) and
     lands right at the end of the cast, so the final sizzle (CookTss) plays as it lands; no extra sizzle before it.
     **COOKING FINAL (phase 2): E. Toss the pan + burner + sizzle, long last toss** ("very nice", 2026-11-12).
     Enchanting phase 2 (A = the locked Motes draw the circle; new designs from what the user liked across the picks: a
     tool you can see working, stepped progress, a material, glow building up, a "starts up" finale): **B. Rune by rod**
     (a glowing rod writes a rune round the item in three strokes, each steps the ring a third and ends on a chime;
     made = the rune flashes and shrinks into the item; own chime timing .3/.6/.9), **C. Dust to crystal** (arcane dust
     drifts in toward the head the whole time; each chime packs it into a violet crystal growing out of the ring; made =
     the crystals flash and beam into the item), **D. Tuning the ring** (the ring hums like a singing bowl rim:
     shimmering and uneven at first, each chime rings waves round it, it settles truer; made = a pure bright circle and
     two rings of sound).
     → not B or C; D "kind of cool" but would be awkward mixed with A (A locks three positions on the circle). New B and C
     (the rod and crystals stay in the code): **B. Armillary** (each chime a thin ring of light appears round the item,
     tilted and spinning in 3D; made = all three swing flat into line and merge into one bright circle), **C. Woven
     light** (the ring's stroke is two strands of light braiding; each chime pulls a bright knot that stays; made = the
     braid pulls tight into one line and a pulse runs round through the knots).
     → "B is very cool"; mix **B and D** (the user first wrote "B & C" by mistake); C (woven) out, one more in its place.
     **E. Armillary + tuning** (D's humming ring, uneven at first, rings with waves on each chime as an armillary ring
     appears and spins, settling truer between chimes; made = the rings swing flat as the ring rings pure, a flash, two
     rings of sound). New **C. Script band** (a band of tiny runes round the outside of the ring lights up one by one as
     it fills, turning a notch on each chime; made = all flare, the band shrinks onto the item; it sits where the batch
     bar goes in Create All, so it would move inside the ring if picked).
     → C crashed on click (my B+D swap deleted its rune shapes; fixed). Then: the armillary is cool but reads **"science"
     rather than "magical"**; rework B, C, D, drop E (C "wasn't bad"). Magical = runes, soft drifting light, sparkles,
     things floating and absorbed, nothing precise. **B. Sigil rings** (each chime a circle of glowing runes appears round
     the item, tilted and slowly turning, shedding sparkles, violet to pink; made = they spiral in and collapse into the
     item in a sparkle burst), **C. Rising runes** (a band of runes inside the ring lights up as it fills; on each chime
     the freshly lit runes lift off and drift into the item, which glows more; made = the rest swirl in, it flares),
     **D. Arcane flame** (soft violet flames lick up off the filled ring, tips pink, surging taller each chime; made = a
     tall crown of flame that calms into a glowing halo). Earlier B-E stay in the code.
     → "A is still top contender but the effects for D are pretty cool": **E. Motes + arcane flame** (A as locked, the
     motes drawing the triangle and the star, with D's violet flames licking off the filled ring, surging each chime;
     made = the star and the spiral, the flames flare into a crown and calm into a halo).
     **ENCHANTING FINAL for now (phase 2): E. Motes + arcane flame** (2026-11-13; "still not 100% in", revisit in the
     second phase 2).
     First Aid phase 2 (A = the locked Dressing + ripples; the feel: patching up after a fight / a remedy in the wild,
     hands-on steps, a firm finish): **B. Splint it** (two sticks laid along the item, each tap a linen tie wraps across
     and cinches, three ties top to bottom; made = the middle tie knotted with a tug), **C. Wash it clean** (the item
     starts grimy with dirt and blood; each tap water splashes down from above and washes a third away; made = it
     shines clean), **D. Stitch it shut** (a red gash across the ring and item; each tap a curved needle leaves a
     cross-stitch and the red fades; made = tied off, the gash gone).
     **FIRST AID FINAL for now (phase 2): B. Splint it** (2026-11-13).
     **Phase 2, first pass done (2026-11-13):** Blacksmithing E Heated + bellows, Leatherworking D Burnished, Alchemy E
     Boil over + bubbles, Tailoring E Plucked + runs down, Engineering D Wrench 4 turns + it starts up, Cooking E Toss
     the pan + burner + sizzle, Enchanting E Motes + arcane flame (not 100%), First Aid B Splint it (for now). The
     first six were done before the user clarified that phase 2 means entirely new designs, so the second phase 2 pass
     (next, one profession at a time, Blacksmithing first) brings new designs to all eight.
     **Phase 2, second pass** (the user: "lets continue", 2026-11-13). The page keeps each first-pass set (P2A) and starts
     a fresh one with A = the current pick (options that borrowed from a sibling by letter now look it up in their own
     set, P2S, so A plays exactly as picked). Blacksmithing: **B. Hammer and anvil** (a hammer over the top of the ring
     strikes three times with sparks, each blow forges a third that glows white-hot and cools; the CLANG is the fourth
     blow), **C. Quench** (the ring heats evenly in the forge as it fills, sparks on each tap; made = it plunges into a
     line of water, a burst of steam, the glow snuffed to dark steel, a cool shine), **D. Cast in the mould** (a dark
     mould ring; a crucible over the top tips three times, each pour runs molten metal a third round the channel; made =
     the CLANG cracks the mould, its pieces fall away, the cast ring cools with a shine).
     → "B and D I like the direction of"; mixes asked for: **E. Cast + bellows** (D, and before each pour the bellows pump
     the crucible: it glows hotter and throws embers, the metal in the channel flares brighter), **F. Hammer + heat** (B's
     three hammer blows, each with A's spark fan along the curve and A's bellows flare + embers; the CLANG with A's spark
     burst and shockwave, then A's cooling wave with steam). Opens on F.
     → "F is the obvious choice but I like how unique E is": E fits **smelting** (pouring metal into a mould is what
     smelting ore does; Blacksmithing is the hammer). **BLACKSMITHING FINAL (phase 2b): F. Hammer + heat** (2026-11-13).
     **New crafting sub-systems (the user, 2026-11-13): 9 = Smelting** (Mining's crafting side, its own trade-skill
     window; nothing in the addon handles it yet; A = Cast + bellows) and **10 = Disenchanting** (Enchanting's
     disenchant cast). Both get phase 2 after the eight. To check: the Smelting window's name on Forever; whether
     disenchant is a trade-skill cast (isTradeskill) or a plain spell.
     Leatherworking (phase 2b; A = Burnished; each new one is four steps you can count, with its own thoks on them):
     **B. Cut the pattern** (a small knife cuts round the leather band in four strokes leaving a bright cut line and
     curling shavings; made = the cut piece lifts free with a shadow under it), **C. Dye it** (raw pale leather; a dauber
     dabs four times and dark dye soaks out over a quarter each; made = a polish shine sweeps round), **D. Set the studs**
     (a small mallet taps four metal studs into the strap, each popping in with a glint; made = the studs catch the light
     one after another).
     → "not feeling the new options" (they shared one structure: a tool working four even steps). Round 2, varied in
     structure: **B. Whip crack** (the ring is a braided whip; on the four beats it lashes a crack out from the head with
     a flash at the tip; made = a big crack from the top), **C. Belt and buckle** (a strap whose tip slides round,
     punched on each beat; made = the tip pulls through the buckle at the top, the prong drops in, it cinches), **D.
     Patchwork** (four curved leather pieces in different tans drop into place on the beats; made = a thread whips
     round through the seams).
     **LEATHERWORKING FINAL (phase 2b): A. Burnished, kept** (2026-11-13).
     Alchemy (phase 2b; A = Boil over + bubbles; each new one a different structure): **B. Two flasks** (a blue flask left
     and a red one right take turns pouring into the ring on the beats, the liquid mixing toward purple; made = magenta
     flash, cork), **C. The vortex** (the potion swirls round the item inside the ring, each beat spinning it faster;
     made = it collapses into the item with a magenta flash, cork), **D. Fill the flask** (a round flask outline round
     the item fills a quarter per beat with a wobble and bubbles; made = full, magenta flash, a cork pushed in and
     popping). Opens on B.
     → "I like A the most, B as an idea"; mix A and B with the fill **starting at the bottom and climbing both sides,
     meeting at the top**: **E. Twin pour** (the blue flask left and red flask right pour in turns on the beats; the glass
     tube fills from the bottom up both sides, blue up the left, red up the right, each end bubbling with bubbles boiling
     off and vapor; near the end both ends foam as they close in; they meet at the top: purple, magenta flash, the cork
     pops where they met).
     The user's flask ideas: **C. The flask fills (blows up)** (replaces the vortex: the whole ring is a round flask with a
     corked neck, filling bottom to top, bubbling harder and sloshing each beat; made = it blows up: glass shards, a magenta
     burst, the item flies up, spins once and drops back glowing), **F. Full flask, shaking (blows up)** (full from the
     start, shaking harder each beat with sloshing, faster bubbles and a new crack per beat; same blow-up). Note: the flask
     covers the batch bar in Create All; it would need the bar outside it if picked.
     → "I still really like the animations for A"; for F: keep a progress bar, no cracks or breaking, bubble more
     intensely each shake, the item and liquid fly up out of the flask as the cork pops. **F reworked** (the flask sits
     inside the ring, which stays the progress bar; each shake the bubbles get more, faster, bigger and the surface rolls;
     made = the cork pops, a magenta spray and the item fly up out of the neck, the item spins and drops back).
     My view (asked): A, since the user keeps coming back to it, F's item flying up repeats Cooking's toss, and a pop and
     spray a hundred times in a Create All tires. **ALCHEMY FINAL (phase 2b): A. Boil over + bubbles, kept** (2026-11-13).
     Tailoring (phase 2b; A = Plucked + runs down; each new one a different structure): **B. On the loom** (warp threads
     inside the ring, a shuttle flies back and forth laying rows of cloth from the top down behind the item, rows beaten
     tight on the beats; made = the snip cuts it free, a sheen), **C. Embroidery hoop** (the ring is a wooden hoop with a
     clamp holding cloth; a needle stitches a four-petal flower round the item, a petal per beat; made = snip at the clamp,
     the petals glint in turn), **D. Spinning wheel** (spokes turn round the item; a tuft of wool at the side is spun into
     thread that winds onto the rim, faster each beat; made = snip, the wheel spins down, the thread glints). Opens on B.
     **TAILORING FINAL (phase 2b): A. Plucked + runs down, kept** (2026-11-13).
     Engineering (phase 2b; A = Wrench, 4 turns + it starts up; each new one a different structure): **B. Conveyor and press**
     (the ring is a conveyor belt carrying gears, bolts and springs round; one drops into the item on each click; made = a
     stamping press comes down on the item with the boing and a puff), **C. Wire it up** (red, blue and yellow wires snake
     in from outside one per click and plug into sockets on the ring with a spark; made = current runs round through the
     sockets, the item lights blue-white), **D. Lever and lights** (a lever at the side is pulled on each click, lighting
     the next of three bulbs on the ring; made = all flash, the item hops with a puff, the lever springs back). Opens on B.
     **ENGINEERING FINAL (phase 2b): A. Wrench, 4 turns + it starts up, kept** (2026-11-13).
     Cooking (phase 2b; A = Toss the pan + burner + sizzle; each new one a different structure): **B. Lid rattles** (the
     ring is a pot with a lid on top; it rattles, hopping higher with a puff of steam each beat; made = the lid pops off and
     lifts away, warm steam), **C. Rising in the oven** (an oven glow warms inside the ring; the food puffs up a little bigger
     each beat and browns; made = risen golden, a shine, the glow fades), **D. Batter spreads** (batter spreads outward
     from round the food to the ring, bubbles popping on it each beat; made = the edge crisps golden). Opens on B.
     → the lid is "really cool but kind of awkward with the ring shape": **E. Lid from above** (the pot seen from above: the
     ring is its rim, a round metal lid with a knob sits inside over the food; it rattles and hops each beat with a shadow
     and steam puffing from its edge; made = the lid lifts off up and away showing the food, warm steam). Opens on E.
     "E is really cool but I think A fits best": **COOKING FINAL (phase 2b): A. Toss the pan + burner + sizzle, kept** (2026-11-13).
     Enchanting (phase 2b; A = Motes + arcane flame, "not 100%"; new ones magical, each a different structure): **B.
     Starfall** (tiny stars drift down onto the ring; each chime a shooting star streaks down and lands with a sparkle, the
     ring brighter each time; made = a big star falls onto the item and bursts), **C. Moon phases** (a pale moon behind the
     item waxes a phase each chime, crescent, half, gibbous; made = full, a silver-violet halo, stars twinkle round the
     ring), **D. Arcane bloom** (each chime a layer of glowing violet petals unfolds from behind the item, bigger and
     paler each time; made = the bloom opens fully, flares, the petals scatter as sparkles). Opens on B.
     → mix B and C, replace D: **E. Starfall moon** (the moon behind the item waxes a phase each time a shooting star lands on
     it on a chime, the ring glowing brighter, tiny stars drifting down; made = a big star falls, the moon turns full, halo,
     stars twinkle), new **D. Echoes** (three ghostly echoes of the item float round it; each chime one drifts in and merges
     with a ripple, the item glowing stronger; made = it flares, a ring of light, sparkles rise). Opens on E.
     → "A is still the best, but remove the arcane flames and add the finale sparkle flair the moon phases has": **F. Motes +
     moon sparkle** (the first-pass Motes draw the circle, no flames; made = the star and spiral plus a silver-violet halo
     and stars twinkling round the ring). Opens on F.
     **ENCHANTING FINAL (phase 2b): F. Motes + moon sparkle** (2026-11-13).
     First Aid (phase 2b; A = Splint it; after-battle and hands-on, each a different structure): **B. Tourniquet** (a linen
     strap round the ring with a stick knotted in at the top; each tap twists it a half turn and the strap cinches in a
     notch; made = the stick tucked and locked with a tug), **C. Catch your breath** (the ring breathes, ragged and quick at
     first, slower and deeper as it fills, a deep breath on each tap with a ripple in to the item; made = calm, a warm glow
     eases out), **D. Bandage roll** (a small linen roll rolls round the ring laying the bandage behind it, thinner as it
     runs out, bumping on each tap; made = the end tucked in at the top with a tug). Opens on B.
     → "First Aid is kind of hard ... maybe lean away from the bandage motifs". Round 2 without bandages: **B. Draw out the
     venom** (a cure like anti-venom: the ring starts sickly green; each tap draws a dark green drop out and away, the colour
     shifting toward warm gold; made = clean warm gold glow), **C. By the campfire** (a small campfire beside the ring,
     lower left; the ring warms from cold blue to amber to orange, embers rising; each tap stokes the fire; made = warm all
     round, the fire settles), **D. Second wind** (wind streaks sweep round the ring, a stronger gust each tap; made = a
     final gust spirals in and lifts the item a touch). Opens on B.
     → "iterate on A ... add more to this to make it better; the most cohesive to First Aid". Add-ons on Splint it, each adding
     one thing: **B. Splint + ripples** (a warm ripple runs in to the item on each tie, the item warming), **C. Splint + heft**
     (each cinch puffs dust off the sticks and jolts the splint, the knot a double tug with a glint), **D. Splint + relief**
     (after the knot a warm golden glow pulses out once and soft motes drift up). Opens on B.
     → mix C and D: **E. Splint + heft + relief** (each tie cinches with dust and a jolt, the knot a double tug with a glint,
     then the warm golden glow and rising motes). Opens on E.
     **FIRST AID FINAL (phase 2b): E. Splint + heft + relief** (2026-11-13). **Phase 2 second pass done for all eight.**
     **9. Smelting** (phase 2; on the page as profession 9: no 1.3 animation, own sounds: hammer taps SmithT1-3 on .3/.46/.62,
     the CLANG + hiss when done; mockup item a Copper Bar): **A. Cast + bellows** (Blacksmithing's E, the user's pick for
     smelting), **B. Melt it down** (lumps of grey ore round the ring glow and slump, a few melting into the molten pool on
     each tap; made = all molten, the CLANG, it cools to copper), **C. Skim the slag** (the ring is molten metal with dark
     slag floating; each tap a skimmer sweeps a third round and flicks the slag off; made = pure bright metal, the CLANG),
     **D. Crack the ore** (the ring is a crust of ore; each tap a glowing crack splits it, molten veins showing; made = the
     crust bursts and its chips fall away, a bright molten band, the CLANG). Opens on B.
     → "Definitely A, how can we improve on it?" Add-ons on Cast + bellows, each adding one thing: **B. + Ore in the
     crucible** (before each pour a few grey lumps of ore drop into the crucible and sink in with a glow and a spit of
     sparks), **C. + Sparks and drips** (sparks splash where the stream hits the channel, glowing drips fall off the lip
     between pours, heat shimmer above the crucible), **D. + Cools to copper** (after the mould cracks, a cooling wave runs
     round from the top, white-hot to copper, then a shine sweeps the item). Opens on B.
     → "B and D, but what about the crucible itself": **E. B + D, new crucible** (a bigger iron crucible with a rounded bowl,
     a light rim and outline and a pouring spout, over the top-left of the ring; the molten metal glows inside, hotter on each
     bellows pump, its level dropping with each pour; it tips smoothly to pour from the spout and settles back; ore drops in
     before each pour; when the mould cracks it lifts away empty and the cast cools to copper with a shine). Opens on E.
     → the user **did not like this crucible** (2026-11-13, stop point). **Next session, first thing: new crucible designs**
     for Smelting (A = Cast + bellows with B's ore drops and D's copper cooling kept; only the crucible changes), then
     Disenchanting (phase 2, sub-system 10), then Phase 3 Polish.
     Smelting, new vessels (2026-11-14; the cast + bellows, ore drops and copper cooling stay, only the vessel changes):
     **B. Ladle** (a long-handled ladle reaches in from the upper right, its bowl over the ring's top; it dips and tips to
     pour from the lip; draws back out at the end), **C. Tongs and pot** (tongs carry a small pot in from the right at the
     start, tip it on each pour, carry it away empty at the end), **D. Furnace sluice** (no crucible: a small stone furnace
     above the ring with a glowing mouth, a stone trough down to the ring and an iron gate that lifts on each pour; dims at
     the end). The add-ons and the disliked crucible stay in the code, off the buttons. Opens on B.
     → "something more connected to the ring, like the spool for Tailoring or the wrench for Engineering": vessels joined to
     the ring (ladle, tongs, sluice off the buttons): **B. Hinged crucible** (the crucible sits on the ring's rim at the top on
     an iron hinge and bracket; each pour it swings forward and tips straight into the channel; folds back flat at the end),
     **C. Turning mould** (a spout fixed over the top; the ring is the mould and turns a third under it with each pour, like
     the wrench's steps, its notches sliding by; ore drops into the spout's hopper), **D. Bellows on the ring** (the ring is
     the furnace; a bellows hinged to its side squeezes on each beat with a puff of air into the ring, the metal melting into
     the channel a third per pump; one last squeeze at the end). All keep the copper cooling finale. Opens on B.
     → "turning mould would be the direction; some variations, and keep the bellows". Redrawn from scratch (turnMould): a
     fixed spout + hopper over the top, the ring the mould turning under it; the bellows pump before each pour (the hopper
     flares and throws embers, the cast metal flares); ore drops into the hopper; made = the CLANG cracks the mould away and
     the cast cools to copper in a wave from the top. **B. Turning mould + bellows** (a third per pour), **C. Smooth turn**
     (one long pour, the mould turning steadily; four pumps make the stream surge thicker), **D. Four turns** (four stepped
     quarter turns ticking like a ratchet, like the wrench), **E. Ingot moulds** (three bar-shaped cavities with walls between;
     each pour fills one as it passes under the spout; ends with three ingots cooling to copper). Opens on B.
     → iterating on Smooth turn: (1) "why are the moulds going counter clockwise?" They turned against the clockwise fill so
     the pour stayed under the spout; **F. Smooth turn, clockwise + ore splash** mirrors it: the mould turns clockwise and the
     metal trails away clockwise from the spout (checked: at 45% the metal is on the right). (2) "more feedback when the ore
     drops in": three bigger outlined lumps drop into the hopper before each of the four pumps and land with a splash
     (molten spits up out of it, the hopper flares bright, a ripple, a soft hiss SmithHissQ). Page fix found on the way: a
     timer scheduled from inside another timer was dropped (the timer list was rebuilt by filter); now due timers run after
     the list is rebuilt, so nested effects (e.g. sparks after ore lands) play. Opens on F.
     → "super laggy": measured 11-13 fps for F (Tailoring 88); switching shadowBlur off gave 82, so the cause was glow
     (shadowBlur) drawn inside the rotated and mirrored mould. The glows are now soft wide strokes and halos instead: F runs
     at ~125 fps, same look. (Mockup rule: no shadowBlur inside rotated/scaled transforms; it is slow in the browser, and the
     game draws glows as textures anyway.)
     → feedback on F: no tick marks round the ring; 4 beats + finale too repetitive with this sound, so **3 beats + the
     finale**; each beat punchier, a noticeable jump on the bar (still slow and smooth between). **F reworked: Smooth turn, 3
     punchy beats** (the mould turns slowly the whole time: 40% of the ring spread over the cast; on each beat at .25/.5/.75
     it lurches forward another 20% in a tenth of the cast with a little overshoot (eBack): the ore lands with its splash and
     hiss, SmithT1-3 rising, the stream gushes thicker, the cast flares white-hot, sparks spray from the spout; then the CLANG
     and the copper cooling). ~97 fps. The 4-pump version kept in the code (SM_F_V1). Opens on F.
     → "Better; focus on improving the sound and the actual bar effects; the sound should be noticeable but out of the way".
     Bar effects (G and H): the cast is white-hot where it leaves the spout and cools along the ring (orange, red); on each
     beat a bright wave runs back along the new chunk and the ring pops out a touch (6%). Smelting gets its own, softer
     sounds instead of the anvil (the 1.3 side's payoff now plays an option's own finale if it names one): **G = sound 1**,
     a low soft plop + short sizzle per beat (SmeltPlop1-3, rising), finale a muted mould crack + small bright chime
     (SmeltCrack); **H = sound 2**, a soft double glug + faint sizzle per beat (SmeltGlug1-3), finale a low gentle gong +
     hiss (SmeltGong). Same visuals, the user picks by ear. ~91 fps. Opens on G.
     → likes the effects and the glug, not the gong finale ("doesn't really match the animation": the mould cracks, its pieces
     fall, it cools). Finales with the glug beats: **I. Glug + crack and clatter** (a sharp crack as the mould splits, the
     pieces clattering down as a quick scatter of small clicks, a soft cooling hiss; SmeltClatter), **J. Glug + crack and
     chime** (G's muted crack + small bright chime). Opens on I.
     → likes both ("chime feels more like something was attained"). My view (asked): the clatter, since crafted items already
     get their loot sound by rarity, every other finale is a material sound (Enchanting and First Aid already end on chimes),
     and smelting runs in big batches; a middle way: **K. Glug + clatter + tink** (I's crack and clatter, the last piece
     landing with one small bright tink like a coin, then the cooling hiss; SmeltClatterTink). Opens on K.
     **SMELTING FINAL (phase 2): K. Smooth turn, 3 punchy beats, bar effects, glug + clatter + tink** (2026-11-14).
     **10. Disenchanting** (phase 2, no first pass; on the page as profession 10, key 0; no 1.3 animation; the centre shows
     the green item being taken apart and the dust pops in where it was at the end). Sound: three beats stepping DOWN in
     pitch (DisNote1-3, the reverse of Enchanting's rising chimes: the magic taken apart), the finale a soft poof of dust with
     a faint shimmer (DisPoof). Beats .3/.5/.7. **A. Unravel** (each beat a glowing violet thread is pulled out of the item to
     the ring, the item dimming; made = it crumbles into a poof of dust), **B. Shatter** (each beat a glowing crack splits
     further across the item; made = it shatters, the pieces spin and dissolve into dust), **C. Grindstone** (the ring is a
     grindstone turning round the item; each beat a crunch, a spray of dust and sparks off the wheel, the item shrinking;
     made = ground away into dust), **D. Seals break** (three small rune seals round the item snap one per beat; made = the
     bound magic bursts out as dust and motes). Opens on A.
     → "not feeling these animations or sounds"; the feel wanted: **the item is actually getting destroyed** (the game never
     gives that feeling). Round 2: the destruction happens to the item icon itself; destruction sounds per beat, the finale a
     deeper burst into dust (DisBurst), then the dust pops in. **A. Burn away** (violet fire eats the icon from its edges, a
     glowing burn edge and ash flakes; each beat burns a big chunk with a crackle, DisCrackle), **B. Crush** (crushed a step
     per beat with a crunch, flatter and wider, cracks and chips flying; DisCrunch1-3), **C. Disintegrate** (a band per beat
     rips into small fragments that spin into the ring as violet sparks; DisRip), **D. Break apart** (cracks into four jagged
     pieces that wrench further apart each beat, light pouring out; DisCrack; made = the pieces blow out). 68-76 fps. Opens on A.
     → "Burn away is very very cool", **locked as the item animation** (2026-11-14). The user worries whether it's possible in
     game: plan = an 8x8 grid of slices of the icon (SetTexCoord per tile), each tinted to the burn edge then hidden as the
     burn passes (the mockup draws exactly that); verify on Forever with wow-api-researcher before the build; if it fails,
     look at other options. Add-ons on it: **B. + Embers feed the ring** (embers off the burning edge are drawn into the ring,
     sparking where they land, a stream on each beat), **C. + Scorched ring** (the filled ring chars dark behind a glowing
     violet burn line at its head, sparks flicking off, flaring on each beat; made = the charred ring glows once), **D. +
     Essence rises** (on each beat two or three glowing essence orbs lift out of the fire and float above the ring; made = they
     sink back into the dust as it appears, which flares). 75-100 fps. Opens on B.
     → "B for sure" (Burn away + embers feed the ring); finale variations, each with its own sound: **E. B + implosion**
     (what's left collapses inward to a bright violet point with a falling whoosh, then pops: shockwave ring, sparks;
     DisImplode), **F. B + ember storm** (the embers lift off the ring all the way round and spiral into the middle where the
     dust appears, a rising shimmer; DisStorm), **G. B + afterimage crumble** (a glowing violet outline of the item hangs a
     moment, then crumbles into ash that settles into the dust; DisCrumble). Opens on E.
     → E and F combined: **H. B + storm into implosion** (the embers lift off the ring and spiral inward while the remains
     collapse to a bright violet point; as they meet (~0.4 s) it pops: shockwave ring, sparks, the dust appears; the sound a
     rising shimmer into the pop, DisStormPop). Opens on H.
     **DISENCHANTING FINAL (phase 2): H. Burn away + embers feed the ring + storm into implosion** (2026-11-14).
     **Phase 2 done for all 10 (2026-11-14):** Blacksmithing F Hammer + heat · Leatherworking Burnished · Alchemy Boil over
     + bubbles · Tailoring Plucked + runs down · Engineering Wrench, 4 turns + it starts up · Cooking Toss the pan + burner +
     sizzle · Enchanting F Motes + moon sparkle · First Aid E Splint + heft + relief · Smelting K Smooth turn, 3 punchy beats,
     bar effects, glug + clatter + tink · Disenchanting H Burn away + embers + storm into implosion. Next: Phase 3, Polish
     (make all ten read as one addon), then API checks in game and the build.
  **Crafting Phase 3, Polish (started 2026-11-14).** The compare page has a "Play all ten" reel (each final pick in turn on
  the same ring). Audit of where the ten drift apart; each is a decision for the user, not a silent change:
  1. **Beat count**: 3 beats + finale (Blacksmithing, Cooking, Enchanting, First Aid, Smelting, Disenchanting) vs 4
     (Leatherworking punches, Alchemy, Tailoring, Engineering turns). The user found 4 + finale too repetitive on Smelting.
  2. **How the ring fills**: stepped/punchy chunks (Blacksmithing, Engineering, Cooking, Smelting) vs smooth (the other six).
  3. **Ring recipe** (style guide: one Ring recipe): stroke widths differ (thread 1.8, tube 8, metal 4-5, leather 6-7), and
     some rings are fully custom while others are the default stroke with extras.
  4. **Tools outside the ring**: hammer top-right, spool top, wrench handle right, pan handle lower-left, hopper top, splint
     over the item; no shared rule for where tools sit.
  5. **Finale length and size**: from a short cork pop / snip to long ones (Blacksmithing CLANG + shockwave + cooling wave
     + steam; Engineering's start-up chase; Smelting's cooling; Disenchanting's storm + implosion).
  6. **Loudness**: the Blacksmithing anvil and CLANG are much louder than the new softer families (Smelting glug,
     Disenchanting crackle); the user wants sounds "noticeable but out of the way".
  7. **Leatherworking timing**: its punches land on even quarters but its punch sounds still use 1.3's .18-.66 beats.
     Polish 1 (beat count) in progress: the Polish panel has a **Beats** switch ("As picked" / "3 for all"; the reel follows
     it). 3-beat versions: Leatherworking Burnished with 3 punches (at 1/6, 1/2, 5/6, its own thoks, the whip as before),
     Alchemy Boil over + bubbles with 3 beats (.2/.42/.64, own glug sounds), Tailoring Plucked + runs down with 3 beats
     (.22/.44/.66, own fwips), Engineering the wrench with 3 turns + it starts up (the user earlier felt 4 turns read as more
     "tinkering": a possible exception). Point 7 turned out moot: the locked Burnished already plays its own thoks on its
     punches.
     **Polish 1 decided 2026-11-14: "3 for all"** (3 beats + the finale for every profession; the switch now opens on it).
     **Polish 2 decided 2026-11-14: "As picked"** (punchy only where the profession or animation calls for it). The **Fill** switch ("As picked" / "Punchy for all"). Punchy gives the six smooth
     fills (Leatherworking, Alchemy, Tailoring, Enchanting, First Aid, Disenchanting) Smelting's feel: a slow creep to 40%,
     each of the 3 beats lands a 20% jump with a little overshoot (`fillOf` in `state()`, so every overlay follows).
     **Leatherworking punchy, decided 2026-11-14** (the rule: hits jump, flows creep; now its picked fill, the switch button
     removed): the ring creeps and each punch slam the fill to that hole (1/6, 1/2, 5/6) with a little
     overshoot, then runs to the end under the whip (`lwFill`). Punchy: Blacksmithing, Engineering, Cooking, Smelting, Leatherworking.
     **Polish 3 decided 2026-11-14: "As picked"** (the tube and the mould are the material). Measured (strokes on the ring at mid-craft): the default ring (5 px faint track, 5 px
     arc in the profession's color, white head dot) as is for Leatherworking, Tailoring, Enchanting, First Aid,
     Disenchanting; Blacksmithing, Engineering and Cooking cover it and repaint their own arc at the same 5 px (heat, steel,
     flame tones); only Alchemy (11 px glass tube, 8 px liquid) and Smelting (10 px mould, 9 px stone, 4 px metal) are
     thicker. A **Ring** switch ("As picked" / "One width (5 px)") brings those two to the shared width (Alchemy tube 7,
     liquid 5; Smelting mould 8, stone 7, metal 5), keeping their look (`withRingWidths`).
     **Polish 4 decided 2026-11-14: "As picked"** (the user: the tool placements make sense for what each tool is).
     **Polish 5 decided 2026-11-14: "As picked"** (the user: finales are per profession, uniqueness is good).
     **Polish 6 decided 2026-11-14: "Even"** (every profession about -29 dB at its loudest; the build uses these gains). Measured offline (each final pick's whole craft rendered, the loudest 50 ms, dB):
     Blacksmithing -20.6, Alchemy -25.8, Engineering -26.1, Enchanting -26.2, Disenchanting -30.2, First Aid -30.4,
     Leatherworking -31.2, Cooking -32.9, Smelting -34.0, Tailoring -40.2. A **Loudness** switch: "As picked" / "Cap the
     loud 4" (Blacksmithing, Alchemy, Engineering, Enchanting down to about -28; checked -27.3..-28.0) / "Even" (every
     profession to about -29; checked -28.6..-29.7, Tailoring raised 3.6x). Per-profession gains in `LOUD_GAIN`.
     **Phase 3 Polish done 2026-11-14** (all 7 points). Next: API checks in game, then the build with wow-mockup-to-addon.
     Alchemy follow-up ("by end I mean the end of the animation"): the expanding "steam" after the last beat was
     the colored smoke cloud from the locked mix's finale rising from the middle past the top; Alchemy E no longer
     has it (the flash, the magenta glow and the cork stay; the puff comes off the head at 86%).
  2. **Then crafting animations, per profession**: several unique designs for every crafting profession
     (not one concept adapted), like the popup rounds.

  **Dungeon recap brainstorm (2026-11-12):** appears **on leaving** the instance (zone out or hearth; a short
  "Dungeon cleared" moment when the last boss dies; a disconnect or /reload inside keeps the run going).
  Shows **all of**: bosses + time (the bosses as a road of rings), the best drop moment then every item
  (quality borders, counts), money looted + vendor value counting up, XP/levels/rep gained (in the picked
  looks). Stagings to mock up: **Ring + road card**, **Loot rain replay** ("gather it all again" into a
  tally), **Cinematic** (letterbox + chapter title "The Deadmines, cleared"). History: **last 10 runs per
  character**, reopened from a settings page, with records (fastest clear, best drop). Mockup:
  docs/mockups/recap-r1.html.
  Recap round 1 → **Loot rain replay "definitely in the spirit of the addon"**; the user's idea: **replay the
  run in order**: the boss road as a timeline, the loot raining out at the moment it was received. Round 2
  (recap-r2.html): the run compressed to ~8.5 s with a clock, drops leave the road at their minute (trash
  between bosses, boss loot at the boss, the best drop where it happened), small drops merge / counts climb:
  **Timeline → tally** (the road on a card, drops hop into a grid, counters climb) and **Timeline → ground →
  gather** (drops fall from the marker onto the ground around you like the loot rain, then are pulled into
  the tally card), with round 1's rain replay to compare. Building it needs a timestamp per drop in the run
  record (we already see each CHAT_MSG_LOOT line: store GetServerTime/GetTime offset).
  Recap round 2 → **picked: Timeline → tally** (the running gold/XP tally; the loot rain already plays all
  through the run, so the recap sums up at the end), **replay shortened to 6 s**. Wanted: a better visual
  design for the window, and a better "Dungeon cleared" that does **not** show the road (the recap shows it).
  Round 3 (recap-r3.html): window designs **Refined / Gilded** (Achievement style, double gold rail, boss
  medallions, framed slots) **/ Glass** (translucent, thin white rail, light numerals) **/ Wide banner**
  (road on top, loot left, totals stacked right); "Dungeon cleared": **Final medallion** (the last boss's
  ring closes, gold shockwave, CLEARED) **/ Chapter lines** (gold lines sweep in to the name) **/ Pennant**
  (a banner drops from the top: emblem, name, CLEARED, 6 / 6).
  Recap round 3 → **"Dungeon cleared" = Final medallion (picked**; matches the skill-up rework). Window:
  **the Wide banner direction**. The lag was the mockup test harness (manual frame steps spawned hundreds of
  animation loops), and the finish added ~3 s past the 6 s replay. Round 4 (recap-r4.html): **the whole recap
  in ~6.5 s** (4.6 s replay + a quick finish; measured in real time), one animation loop; **Wide**, **Wide
  gilded**, **Wide medallion** (the Final medallion at the left end is the run's clock: its ring fills with
  the replay and closes with the gold shockwave + CLEARED at 38:12), **Slim strip** (adapts: one row of loot
  when wide enough, two otherwise).
  **RECAP PICKED (2026-11-12, recap-r4.html "Slim strip"):** on leaving the instance, a slim strip near the
  top: the name and time on one line, the boss road as the run's timeline (a marker + clock, the run in
  ~4.6 s), each drop leaving the road at its minute into the loot row (counts climb, small drops merge), the
  totals inline (money looted, vendor value, XP, level), then CLEARED, the best drop (with when/which boss)
  and the record badge; about 6.5 s in all. "Dungeon cleared" on the last boss = **Final medallion**. History:
  last 10 runs per character. Build needs per-drop timestamps, an instanceID → boss list table, the
  RoadToSixty-style run model.
- **Cohesion pass (added by the user 2026-11-12):** make every piece of UI look like one addon, not "a hodge
  podge of random features". Plan: (1) a **style guide** written from what's been picked (colors: panel
  darks, gold, XP purple, quality colors; type: serif titles vs. system labels/numbers; shapes: the Ring
  family, rounded panels, gold hairlines, glints; motion: pops, shockwaves, counters; sounds); (2) an
  **overview mockup** with every piece side by side on one game screen (popups, rain, harvest window/side
  column, bag, Create All pile, crafting effects, skill-up ring, XP bar, rep rings, level-up, recap strip,
  settings) to spot the odd ones out; (3) the user picks what changes; (4) the crafting redesign follows the
  guide. Probably before the crafting redesign.
  **Started 2026-11-12 (cohesion first, the user):** `docs/style-guide.md` (principles, the Ring recipe,
  colors, type, panels, motion, sound, open decisions) and `docs/mockups/cohesion-r1.html` (all 12 pieces side
  by side or on the game screen, with flags). Survey of the 1.3 code: fonts are Morpheus (`TITLE_FONT`, item
  names) + Friz Quadrata; **five golds** in the code; **three panel styles** (tooltip box on brown: Create All
  tray and the Popups page preview; fading rows: harvest/side column; dark rounded + gold hairline: 1.4).
  Open decisions: two golds; where Morpheus goes; one panel family (restyle the tray); one Ring recipe.
  **Agreed 2026-11-12: all four**, plus a rule from the user: **money is shown with the game's coins, as in
  the bags** ("2 [gold] 39 [silver] 53 [copper]", `GetCoinTextureString`), never "2g 39s 53c". Details and
  the build list in docs/style-guide.md "Decisions".
  **Recap API findings** (wow-api-researcher 2026-11-12; proof: saved data of one Ragefire Chasm run by
  RoadToSixty and Loredex on 16001):
  - **CHAT_MSG_LOOT and CHAT_MSG_COMBAT_XP_GAIN are readable inside 5-man dungeons** (not secret). Secret in
    instances: system, skill and trade-skill messages, mob names/GUIDs, the loot source. CHAT_MSG_MONEY and
    CHAT_MSG_COMBAT_FACTION_CHANGE inside dungeons: unproven (use a `GetMoney()` difference for money). Keep
    `issecretvalue` guards everywhere; raids/battlegrounds unproven. Fallbacks that work: LOOT_READY/OPENED +
    GetLootSlotLink, BAG_UPDATE_DELAYED, ITEM_PUSH.
  - Enter/leave: PLAYER_ENTERING_WORLD(isInitialLogin, isReloadingUi) + IsInInstance + GetInstanceInfo (8th
    = instanceID). Save the run per character; /reload inside = same run. **Copy RoadToSixty's run model**: a
    death sends you outside, so coming back to the same instanceID within a gap is the same run; logging
    out inside too. Something non-dungeon showed as a "party" instance ("Ruins of Lordaeron", 48 s): filter
    on maxPlayers/difficulty or "a boss was killed".
  - **ENCOUNTER_END(encounterID, name, difficulty, size, success) fires** in Classic dungeons (Ragefire's
    four bosses 2732-2735 recorded). BOSS_KILL/ENCOUNTER_START unproven. **Boss totals: no proven API** (EJ,
    lockouts unproven): a hand-made instanceID → encounter list table (the final boss = the last entry).
  - Timing: GetTime for durations, GetServerTime for saved times (time() differs from server time on this
    PC). LFG/scenario completion events unproven.
  - Vendor value: C_Item.GetItemInfo 11th return (sellPrice) works; nil until cached
    (GET_ITEM_INFO_RECEIVED); multiply by the stack.
  - In-game checks (inside a dungeon): CHAT_MSG_MONEY / FACTION_CHANGE secret? (`issecretvalue` print),
    `/dump GetInstanceLockTimeRemaining()`, the EJ encounter list, `/dump GetInstanceInfo()` at Undercity.

### 1.4.0: Dungeons (set by the user 2026-11-10; the dice roll moved to 1.5 on 2026-11-12)

Process as always: brainstorm with the user (a few questions with recommended picks), mockups
(docs/mockups/), the user picks, then build. Simple shapes and real item icons, not drawn objects.

**1. The dice roll** (group loot: Need / Greed / Pass on a dropped item)
- Idea so far (STATE ideas list 2026-11-09): dice tumble when the roll resolves, the numbers come up, a
  **WON** stamp and the item's popup when you win; a gentle, short miss when you lose. Other players' rolls
  shown small (who rolled what), the winner highlighted. Must not get in the way in a pull.
- To verify on Forever first (wow-api-researcher agent, then `/dump` in a group): `START_LOOT_ROLL(rollID,
  rollTime, lootHandle)`, `CANCEL_LOOT_ROLL`, `GetLootRollItemInfo(rollID)`, `GetLootRollItemLink(rollID)`,
  the roll result chat lines (`CHAT_MSG_LOOT` with the globals `LOOT_ROLL_ROLLED_NEED`, `LOOT_ROLL_ROLLED_GREED`,
  `LOOT_ROLL_YOU_WON`, `LOOT_ROLL_WON`, `LOOT_ROLL_ALL_PASSED`, ...), `LOOT_ROLLS_COMPLETE` (retail?), and
  whether chat text is a secret value in an instance (12.x restriction; plan.md risks table).
- A won item already arrives as a "You receive loot" line: the popup must not show twice (the roll show
  hands its item to the popup, or the popup waits for it).
- Test buttons on a settings page (a pretend roll: won, lost, all passed), as for everything else.

**2. The dungeon recap** (the side column's rows leave in 4 s on purpose: "that's what the dungeon recap is
for", the user 2026-11-09)
- When you leave an instance (or the run completes), a recap of the run: time, bosses killed, the best drop
  (a popup-like moment), every item you got (icons in quality borders, counts), money looted + vendor value,
  rolls won, maybe XP and reputation gained. Ideas to brainstorm: a card vs. the loot-rain style "gather it
  all again"; a chest/tally count-up (the slot-machine idea, plan.md "Chest show" notes); reopening the last
  recaps from the settings (saved per character: a short history).
- To verify: instance enter/leave (`PLAYER_ENTERING_WORLD` + `IsInInstance()` / `GetInstanceInfo()`,
  `ZONE_CHANGED_NEW_AREA`), boss kills (`ENCOUNTER_END(encounterID, name, difficulty, size, success)`,
  `BOSS_KILL`), XP (`PLAYER_XP_UPDATE`), reputation (`CHAT_MSG_COMBAT_FACTION_CHANGE`), the LFG completion
  event if Forever has the dungeon finder, and what a disconnect / hearth mid-run should do.
- Data: a run record in DopamineLootCharDB (start time, instance name, items, money, bosses), started on
  entering, closed on leaving; must survive /reload inside the dungeon.

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

- **Class-themed popup animations and styles** (the user, 2026-11-06, after Frost bloom felt "like it belongs
  to a mage"): arrivals and styles themed by class (frost and arcane for mages, holy light for paladins,
  nature for druids...), as an option next to the rarity arrivals; maybe the player's own class by default.

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

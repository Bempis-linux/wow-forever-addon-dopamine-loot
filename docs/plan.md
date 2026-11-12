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

# Session state — Dopamine Loot

_Last checkpoint: 2026-10-09, after the scaffold + plan. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md and `docs/plan.md`._

## Where things stand
- **0.1.1** (roadmap 0.1) pushed: `LootMsg.lua` (pure parser of the `LOOT_ITEM_*SELF*` templates,
  `tools/test_lootmsg.lua`), `LootFeed.lua` (CHAT_MSG_LOOT → item data → popup; vendor buys skipped;
  `/dl test`, `/dl model`, `/dl quality`, `/dl check`), `Sounds.lua` (tier kits with fallbacks, `/dl sounds`),
  `Popup.lua` (dark card, quality beam + glow, `PlayerModel:SetItem` for weapons/shields/helms/
  shoulders with flipping icon-card fallback, max 3 stacked, hover holds, Shift+click links,
  click dismisses). Reviewer run; its 10 findings fixed.
- In progress: none. Waiting on the user's first 0.1 test.
- **Next up**: tune from the test (model camera/zoom, which sounds exist), then **0.2** filters +
  Settings page + seen set (NEW) + upgrade badge.

## Verified in game (by the user)
- 0.1.0 scaffold loads (in the AddOns list), `/dl help` prints the commands.

## Not yet verified
- 0.1.1 everything. The three big unknowns: loot global strings (`/dl check`), `PlayerModel:SetItem`
  on Forever (`/dl model <id>`; does `GetModelFileID` report a file?), which SOUNDKIT ids play
  (`/dl sounds`). Model camera framing is a guess (`SetPosition(0,0,0)`, cam distance 1).
- Later: Alt+Right-click on a bag item doesn't use it; `GetMouseButtonClicked()` inside the
  `HandleModifiedItemClick` hook (0.3).

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is the handle **Bempis**. Never the real name, email,
  Windows username, Battle.net account ID, character names or realm in anything tracked, committed or
  pushed. Repo-local git identity (Bempis + GitHub noreply); never touch the global git config.
  `.privacy-patterns`, `CLAUDE.local.md` and `.luarc.json` (machine paths) stay gitignored. The kit's
  pre-push hook enforces it; never `--no-verify` unless the user says so.
- Same working style as Loredex: only `/dl help` prints to chat; everything else goes to the log window
  or popups. Original assets and flavor text only.
- Presentation and sound matter most; the chest show should feel like Vampire Survivors' treasure chest.
- Inspector shortcut: Alt+Right-click. ffmpeg (winget) is OK to install at 0.5 for original chimes.
- Process: preflight → commit → push after each working increment; reviewer agent before big changes.
  The user tests in game and sends screenshots; give a short "to test" list and say `/reload` vs restart.
- Answers: concise summaries.

## Gotchas and environment notes
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only.
- Game must be closed before editing anything under the client's `WTF` folder.
- 3D models: set after `Show()`; no AnimationGroups on frames holding models (drive by hand).
- Baganator is installed and uses Alt+click; Questie, ATT, HuntersFieldGuide also installed (see plan).
- Loredex's `_reference/wow-ui-source` is empty; Blizzard UI code is read from the Ketho annotations.

## Open questions / waiting on the user
- (none)

## Recent history (newest first)
- 2026-10-09 0.1.1: first loot popups (model or card), tier sounds, test/check commands.
- 2026-10-09 0.1.0: scaffolded with wow-addon-kit 0.4.0 (privacy guard), plan written and settled.

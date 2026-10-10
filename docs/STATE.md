# Session state — Dopamine Loot

_Last checkpoint: 2026-10-09, after the scaffold + plan. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md and `docs/plan.md`._

## Where things stand
- Scaffolded with wow-addon-kit (0.1.0: Core, log window, popup helper; `/dl`, `/dopamine`), linked into
  `_classic_beta_`, plan written (`docs/plan.md`) and its open questions settled with the user.
- In progress: none.
- **Next up: 0.1** (plan roadmap): `CHAT_MSG_LOOT` self parsing → one popup with the rotating
  `PlayerModel:SetItem` model (icon-card fallback), quality sound (built-in kits), quality threshold;
  `/dl test`, `/dl model <id>`, `/dl debug` raw loot logging; `tools/test_lootmsg.lua`.

## Verified in game (by the user)
- (nothing yet)

## Not yet verified
- Addon loads (full game restart the first time), `/dl help` lists commands in chat.
- The three big unknowns 0.1 settles: loot global strings (`LOOT_ITEM_SELF*`), `PlayerModel:SetItem` on
  Forever, which SOUNDKIT ids play. Also: Alt+Right-click on a bag item doesn't use it, and
  `GetMouseButtonClicked()` works inside the `HandleModifiedItemClick` hook.

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
- 2026-10-09 0.1.0: scaffolded with wow-addon-kit 0.4.0 (privacy guard), plan written and settled.

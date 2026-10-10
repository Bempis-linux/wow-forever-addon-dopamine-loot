# Dopamine Loot

A World of Warcraft addon. General WoW addon knowledge, house style, and tooling come from the
**wow-addon-kit** plugin (`wow-addon-dev` skill); this file holds only what's specific to Dopamine Loot.

## Target

| | |
|---|---|
| Clients | WoW Forever |
| `## Interface:` | `16001` (recompute with the kit's `clients.sh` after game patches) |
| Addon folder | `DopamineLoot/` (linked into each client's `Interface\AddOns\` with a junction) |
| Slash command | `/dl` (also `/dopamine`) |
| Saved data | `DopamineLootDB` (account: settings), `DopamineLootCharDB` (per character: seen items, recent loot, stats) |
| Client folder | `_classic_beta_` until launch on 2026-11-04 (release folder TBD; re-point the junction then) |

Machine paths (WoW root, client folders, account folder) are in `CLAUDE.local.md` (gitignored).

## Layout

```
DopamineLoot/          the addon (folder name == .toc name)
docs/plan.md       design, data model, roadmap (wow-addon-planner writes the first version)
tools/test_*.lua   offline tests for pure logic, run by wow-preflight
```

## Session continuity (read first)

- **Start of every session**: read `docs/STATE.md` (skill `session-resume`) and follow its preferences.
- **Keep it current** (skill `session-checkpoint`): after every pushed increment, whenever something is
  learned that isn't written down, and before the user stops or resets. Nothing important may live only
  in the chat.

## Workflow

- Before every in-game test and every push: `wow-preflight`.
- After the user tests: `wow-test-debug`.
- Unsure an API exists on the target client: `wow-api-researcher` agent.

## Privacy

Public repo under the handle **Bempis**, the only personal identifier allowed anywhere tracked. Nothing
else personal in tracked files or commits (real name, email, Windows username, Battle.net ID, character
names, realm); `.privacy-patterns` (gitignored) lists the strings preflight blocks. Repo-local git
identity only; never change the global git config.

## Addon-specific notes

Decisions (don't undo without asking; details in `docs/plan.md`):
- `CHAT_MSG_LOOT` self lines are the only record source; the loot-window snapshot is for timing/fallback;
  bag events never create records.
- Default filter Uncommon+; NEW/UPGRADE are badges and louder tiers, not filters.
- Inspector opens with **Alt+Right-click** (Baganator owns Alt+click), configurable.
- 3+ shown items → loot rain; Rare+ or 6+ → full chest show (Vampire-Survivors feel); deferred in combat.
- Seen set and loot history per character; settings account-wide. No login toast.
- **Settings page parity** (kit house-style): every `/dl` command that changes a setting or runs a
  test also has a control on the settings page (number field or drag slider, choice, Test button);
  visual settings update a live preview on the page.
- Popup styles A Relic / B Beam / C Halo lens (C2, user favorite) / D Banner are all options.
- Presentation: original assets only (generated textures, synthesized chimes) or game sounds by ID;
  never copied art/audio. Models driven by hand in `OnUpdate`, set after `Show()`, no AnimationGroups.

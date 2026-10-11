# Session state — Dopamine Loot

_Last checkpoint: 2026-10-10, with 0.3.8. Read this first in a new session (the kit's
`session-resume` skill does), then CLAUDE.md (layout, decisions) and `docs/plan.md` (roadmap, rain ideas)._

## Where things stand
- **0.3.8 pushed** (arrival sounds), not yet heard in game. Roadmap 0.1 and 0.2 done; **0.3 look & feel in progress**
  (plan roadmap row 0.3 lists what's done and what's left).
- Done in 0.3: four popup styles (Relic v2 = default, Beam v2, Halo lens v2, Banner v2) on generated art;
  weapons upright via `Model:SetPitch` (setting `weaponTilt`, default 90); MORPHEUS title font;
  arrival flash; **arrivals by rarity in every style** (Rare 8-spark ring; Epic 14-spark ring;
  Legendary 2 shockwaves + ember fountain + rising embers); Popup look page (`/dl look`)
  with live preview, quality/kind pickers, sliders (size, 3D zoom, weapon tilt, spin, time on screen).
- 0.3.8 arrival sounds: original OGGs synthesized by `tools/gen_sounds.sh` (ffmpeg aevalsrc: soft
  bells, pads, falling-sine booms, aecho room). Rare = two bells; Epic = thump, arpeggio, blooming
  chord, shimmer (user wanted Epic "more satisfying, they aren't common in classic"); Legendary =
  deep two-layer boom + bell chord + sparkle. Played by `ns:PlayArrivalSound(tier)` (PlaySoundFile)
  on the arrival's first frame in View.lua, on top of the tier SOUNDKIT sound. Setting
  `noArrivalSound` (`/dl arrivalsound off|on`), settings checkbox + Rare/Epic/Legendary Test
  buttons (run `/dl test <q>`). User approved draft v2 by ear (WAVs sent in chat); tweak later.
- 0.3.7 (user: "went a little overboard"): removed the breathing glow/cone/disc/halo (light is now
  static, brighter for better items), the halo sweep arc, relic rays + pulsing core, epic rays and
  orbiting sparks; deleted Sweep.tga and Rays.tga. Kept (user likes them): spark bursts, legendary
  shockwaves/embers, banner shine, arrival flash, beam's rising motes, the turning item.
- 0.3.6 (Relic v2 + Banner v2, Relic the default): floor shadow under the relic; banner diamond emblem (Diamond + DiamondEdge art), Shine streak sweeping the band every
  5 s (drawn pre-tilted in a square texture: `SetRotation` on a non-square box skews it), badges on
  the info line (under the name if no info, below info if too long; placed in SetItem). Saved
  settings keep the style already picked; only fresh settings get Relic.
- **Next up** (suggested order):
  1. **Real-play verification** whenever the user plays (see "Not yet verified"; biggest unknown).
  2. Hear 0.3.8 in game (full restart: new OGG files): settings Test buttons; loudness vs the game.
  3. The picked rain ideas (plan "Rain ideas": best item last,
     escalation with rising-pitch chimes via ffmpeg, spacing + dust puff, gathering into the bag,
     trails, coins, Escape-to-skip setting; floor shadows low priority).
  4. 0.4 filters (seen set/NEW, upgrade badge), 0.5 inspector (Alt+Right-click), 0.6 chest show.

## Verified in game (by the user)
- 0.1: addon loads; `/dl help`; `PlayerModel:SetItem` + `GetModelFileID` work on Forever
  (`/dl model 12784` → file 144817); `/dl test` qualities; `/dl sounds` plays.
- 0.2 (video): rain physics liked; Rare stays as a popup; "+N" counter; settings page fits
  (COL2 = 320); Test buttons and number fields work; floor at the screen bottom (0.2.1) confirmed.
- 0.3 (screenshots): all four styles draw; preview + sliders work; weapons stand upright with pitch
  90 and turn; Relic "looks really good"; flash + sparks liked; Beam v2 / Halo v2 approved from mockups.

## Not yet verified
- **Real looting has never been seen**: every test so far used previews. Check: `/dl check` (do the
  `LOOT_ITEM_SELF*` templates exist?), loot a green from a mob (popup), a 3+ item corpse (rain), a
  vendor buy (must NOT pop), crafting ("crafted" badge), a quest reward ("received"), a dungeon
  (are loot lines secret values? `/dl debug` logs them), combat deferral (big loot mid-fight rains
  after combat), performance with 3 popups + rain.
- 0.2.2 rain sprites rotating/squashing as one piece; landing-height field.
- 0.3.4 beam foot (no hard line), 0.3.5 rarity arrivals (all styles), 0.3.3 item level hidden on
  non-gear, the title font on screen.
- 0.5 later: Alt+Right-click on a bag item doesn't use it; `GetMouseButtonClicked()` in the
  `HandleModifiedItemClick` hook.

## User preferences (stated in chat; follow them)
- **Privacy first**: the only public identity is **Bempis**. Never the real name, email, Windows
  username, Battle.net account ID, character names or realm in anything tracked or pushed (pasted
  BugSack dumps contain the character name: never copy it). Repo-local git identity; kit pre-push
  guard enforces it; never `--no-verify` unless the user says so.
- **Every `/dl` command also gets a settings control** (number field or drag slider, Test button);
  visual settings drive the live preview (kit house-style "Settings page parity").
- **Mockups before visual changes**; the user picks, then build. All styles stay as options.
- **Restraint in motion**: the user found constant ambient animation too much (0.3.7). Keep looping
  effects rare; one-shot arrival bursts are welcome. Don't add new idle animations without asking.
- Presentation and sound matter most; the chest show should feel like Vampire Survivors' chest.
- Only `/dl help` prints to chat. Original assets only (generated art; game sounds by ID).
- Process: preflight → commit → push each increment; reviewer agent before big changes. The user
  tests in game and sends screenshots or **videos**; give a short "to test" list and say `/reload`
  vs full restart (new files or changed textures = restart).
- Answers: concise summaries.
- **No rush and no deadlines**: the user is not racing to finish. Never suggest changing plans or
  priorities because of a date (beta end, launch); order work by what makes the addon better.

## Gotchas and environment notes
- Bash tool collapses `\\` to `\`: write Lua with Write/Edit only (sed is fine for plain text).
- **Videos**: ffmpeg is installed (winget Gyan.FFmpeg, under
  `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*\...\bin`, not on PATH). Contact sheet:
  `-vf "fps=1,scale=640:-1,drawtext=fontfile=C\\:/Windows/Fonts/arial.ttf:text='%{pts\:hms}':x=8:y=8:fontsize=28:fontcolor=yellow:box=1:boxcolor=black,tile=3x3"`
  into the scratchpad, then Read the PNGs. Art check: overlay the TGAs tinted with `lutrgb` on a
  dark color source and Read the PNG.
- Kit plugin is installed at user scope and at the Loredex project scope: after a kit push run
  `claude plugin marketplace update bempis`, then `claude plugin update wow-addon-kit@bempis
  --scope user` and the plain update (CLI under `%APPDATA%\Claude\claude-code`).
- Models: set after `Show()`, re-set OnShow; no AnimationGroups on model frames. `SetRoll` spins a
  weapon around its own length; `SetPitch` stands it up.
- OnUpdate on a view must guard for "nothing set yet" (0.3.1 spammed `spin0 nil` from the preview).
- Settings sub-pages may never fire OnShow on first open: fill controls at creation.
- Texture rotation works (`Texture:SetRotation`) on square boxes only (a non-square box skews);
  a ColorTexture doesn't rotate, use a file. Generated textures must be power-of-two sizes.
- Run `tools/gen_textures.lua` with the sumneko lua-language-server exe as the Lua runtime
  (`lua-language-server.exe tools/gen_textures.lua`, as preflight does for the tests).
- Game must be closed before editing the client's `WTF` folder. BugGrabber saves to
  `<client>\WTF\Account\<account>\SavedVariables\!BugGrabber.lua` (see CLAUDE.local.md).
- Baganator owns Alt+click; Questie, ATT, HuntersFieldGuide, Details are installed.

## Open questions / waiting on the user
- (none: Relic is the default, both v2 versions approved)

## Recent history (newest first)
- 2026-10-10 0.3.8: arrival sounds per tier (synthesized OGGs).
- 2026-10-10 0.3.7: calmer look (static light; no halo sweep, relic rays, epic rays/orbit).
- 2026-10-10 0.3.6: Relic v2 (default) and Banner v2 (emblem, shine sweep).
- 2026-10-10 0.3.5: arrivals by rarity in every style (Wave, Rays art).
- 2026-10-10 0.3.4: beam light fades into its disc.
- 2026-10-10 0.3.3: Beam v2, Halo v2, title font, arrival flash and sparks.
- 2026-10-10 0.3.2: weapons upright (pitch), softer halo, look page fills its numbers.
- 2026-10-10 0.3.0-0.3.1: four popup styles, Popup look page with live preview; preview nil fix.
- 2026-10-10 kit 0.5.0: settings page parity rule; kit 0.4.x: pre-push privacy guard.
- 2026-10-10 0.2.x: loot rain, settings page, landing height, rain sprites in sync.
- 2026-10-09 0.1.x: scaffold, plan, first popups with 3D models.

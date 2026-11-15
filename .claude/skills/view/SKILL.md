---
name: view
description: Show the user a mockup page (docs/mockups/*.html) the right way for where they are: in the desktop app's browser pane on PC, or as a sent file on the phone (Remote Control). "/view phone" or "/view pc" switches the mode and remembers it; "/view" alone, or "/view <page>", shows the current mockup in the current mode. Use whenever a mockup round is ready to show, and when the user says they are on their phone or back on the PC.
---

# View mockups on the PC or the phone

The user reviews mockups either at the PC (the Claude desktop app, with its browser pane) or on the phone
(Remote Control: no browser pane and no access to repo files, only files sent to them).

## The mode

- The current mode is in the auto-memory file `view-mode.md` (`pc` or `phone`). If it is missing, use `pc`.
- If a tool result or reminder this turn says the user is working over Remote Control, treat it as `phone`
  even if the memory says `pc`, and mention it in one line.

## Arguments

- `phone` or `pc`: write the new mode to `view-mode.md` (update the existing file; keep its frontmatter), then
  show the current mockup in that mode.
- A page name or path (for example `skillup-p2` or `docs/mockups/craft-compare.html`): show that page.
- Nothing: show the mockup this session last worked on (else the page named in docs/STATE.md as current).

## Showing a page

**PC (`pc`)**: open it in the browser pane.
1. `mcp__Claude_Browser__tabs_context`. Close any tab already on that page (it may hold an old copy, or one
   left frozen or muted by a check), then open it fresh:
   `mcp__Claude_Browser__preview_start` with `url: file:///<absolute path with forward slashes>`.
2. Don't script or bulk-test it there (memory: no heavy browser tests).

**Phone (`phone`)**: send it.
- `SendUserFile` with the page, `display: "render"`, `status: "normal"` (or `"proactive"` if the user isn't
  in the middle of a reply), and a one-line caption saying what to try (the option keys, the moment to pick).

Then, either way, end with the same short text as usual: the options in a few words each, what wasn't
checked, and the question.

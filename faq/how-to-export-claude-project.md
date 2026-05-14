# How to export a Claude.ai project

Claude.ai groups related conversations into **Projects** — each with its
own custom Instructions and shared knowledge files. The standard
**Save to project** menu in Claude.ai does not offer any way to export a
project as a whole; you can only export individual chats one at a time.

AI Chat Archive (v0.3.0+) adds a dedicated **Project Export** mode that
bundles an entire project — Instructions, knowledge files, every
conversation, every attachment — into one ZIP. This page walks through it
end to end.

> Project Export is a paid feature, gated by the same license as Batch
> Export. See [pricing](../docs/pricing.md) for tiers and the
> [features page](../docs/features.md) for what every paid plan includes.

## Step 1: Open the project page

Navigate to the project you want to export:

```
https://claude.ai/project/<project-uuid>
```

You can get there from the **Projects** section in the Claude.ai sidebar,
or by clicking the project chip at the top of any chat that belongs to it.

The extension only shows the Project Export button when the URL matches
`/project/<uuid>` — not on plain `/chat/<id>` pages.

## Step 2: Open the extension and pick a format

Click the AI Chat Archive icon in the toolbar to open the popup, then pick
your format:

- **Markdown** (`.md`) — for Obsidian, Notion, grep, future ingestion.
- **HTML** (`.html`) — self-contained per-chat archive, browsable offline.
- **JSON** (`.json`) — programmatic ingestion / custom pipelines.
- **TXT** (`.txt`) — compliance archives, search indexes, raw text.

**PDF is not supported for Project Export.** Use single-chat export if you
specifically need a PDF for one conversation in the project.

If you want to bundle uploaded files alongside the transcripts, check
**Include attachments in the ZIP** in the popup.

## Step 3: Click "Export this project"

You have two equivalent triggers:

- **Popup**: the paid card on a project page shows an **Export this
  project (ZIP)** button. Click it.
- **Floating action button on the page**: while on a `/project/<id>` page,
  AI Chat Archive injects a small floating button. Click it to start the
  same export without opening the popup. The floating button shows a live
  progress panel during the run.

Free users see an upsell variant of the button instead, which opens the
checkout page.

## Step 4: Watch the progress

Project Export runs in this order:

1. **Lists knowledge docs** — fetches the project's text knowledge from
   `/projects/<id>/docs`.
2. **Lists files** — fetches binary uploads from `/projects/<id>/files`.
3. **Writes the files index** — once all knowledge files have been added
   to the archive (or their cancelled tail recorded), `files/_INDEX.md`
   is written so it reflects the actual names that landed.
4. **Iterates conversations** — for each chat in the project, fetches the
   full transcript and (if enabled) any attachments.
5. **Writes the conversation index** — `_INDEX.md` is added with the
   per-conversation status of each entry.
6. **Finalizes** — generates and downloads the ZIP.

The popup progress bar and the on-page floating panel both reflect the
current step. You can cancel mid-run: conversations that were never
reached are marked **`Not run`** in `_INDEX.md`, and any remaining
knowledge files are logged in `files/_SKIPPED.md` with reason `cancelled
by user`.

## Step 5: Open the ZIP

The ZIP is named after the project (sanitized for filesystem safety).
Inside, the layout is:

```
<Project Name>/
  README.md             # project overview + notes on what's NOT included
  metadata.json         # machine-readable project metadata
  instructions.md       # project Instructions (prompt template)
  files/
    _INDEX.md           # table of every file with type + date
    <text docs + binaries>
    _SKIPPED.md         # only when downloads failed or you cancelled
  conversations/
    <date>_<title>/
      <title>.<ext>     # transcript in your chosen format
      attachments/      # only when 'Include attachments' was on
  _INDEX.md             # OK / Skipped: empty / Failed: <error> / Not run
  _INCOMPLETE.md        # only when /docs or /files listing failed
```

The `conversations/` folder follows the same naming and attachment
conventions as the [ZIP bundle structure spec](../spec/zip-bundle-structure.md),
so importers that already handle batch ZIPs handle project ZIPs without
changes.

## What's not included (and why)

- **Memory.** The project "Memory" panel in the claude.ai UI is not exposed
  by any reachable REST endpoint. The `README.md` inside the ZIP states
  this explicitly so future readers know the omission is intentional, not
  an export bug. Project Instructions and knowledge docs — both of which
  you edit directly — are exported in full.
- **Sharing / collaborator info.** For privacy, the export does not list
  who else has access to the project.
- **Workspace UI state.** Sidebar layout, pinned messages, and similar
  interface state are not project content.

## Troubleshooting

**The button doesn't appear.**
Confirm the URL is `claude.ai/project/<uuid>`, not `claude.ai/chat/<id>`.
Project Export deliberately hides on chat pages — use Batch Export there.

**I see an "Upgrade" / upsell button instead.**
Project Export is a paid feature. Activate a license in the popup and the
button flips to the working variant without needing a reload.

**The export stops with `_INCOMPLETE.md` in the ZIP.**
The `/docs` or `/files` listing call failed (network error, expired
session). Re-run while signed in. The conversations folder is still
populated normally; only the knowledge `files/` directory may be partial.

**I started Batch Export while Project Export was running (or vice
versa).**
The extension blocks this with a reciprocal mutex — one paid export at a
time. Wait for the running one to finish or cancel it.

## Related

- [Does AI Chat Archive work with Claude Projects?](does-it-work-with-projects.md)
- [How to export a single Claude chat](how-to-export-claude-chat.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)
- [Pricing](../docs/pricing.md)
- [Features](../docs/features.md)

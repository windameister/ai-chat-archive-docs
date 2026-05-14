# Does AI Chat Archive work with Claude Projects?

**Yes** — and there's a dedicated **Project Export** mode that bundles the
entire project (instructions, knowledge docs, all conversations, attachments)
into one ZIP. Open any `claude.ai/project/<id>` page and you'll see the
project-export button in the popup and a floating button on the page.

Project Export shipped in v0.3.0 and is gated by the paid license, same as
batch export.

## Two ways to export Project content

Pick the one that matches your goal:

| Goal | Use | Where |
|---|---|---|
| "I want everything from **this one project**" | **Project Export** (paid) | On a `claude.ai/project/<id>` page |
| "I want **every conversation** in my account — projects or not" | **Batch Export** (paid) | On a `claude.ai/chat/<id>` page |
| "I just want **this one chat**" | Single-chat export (free) | On any conversation page |

Both ZIPs follow the same per-conversation folder pattern, so anything you
import from a batch ZIP will import the same way from a project ZIP.

## What Project Export bundles

A single ZIP, named after the project, containing:

- **`README.md`** — overview: project name, ID, creator, dates, counts, and a
  note on what's not included.
- **`metadata.json`** — machine-readable mirror of the project metadata.
- **`instructions.md`** — the project's Instructions (the "prompt template"
  shown in the claude.ai sidebar), wrapped in a verbatim fenced block.
- **`files/`** — everything from the project's "Files" panel:
  - Text knowledge docs as Markdown.
  - Uploaded binaries (PDF, images, etc.) in their original format.
  - `_INDEX.md` — table listing every file with its type and date, written
    after the ZIP is finalized so the names in the index match what's actually
    on disk.
  - `_SKIPPED.md` — only present if some files failed to download.
- **`conversations/`** — one folder per chat, named `<date>_<title>`. Each
  folder holds the transcript in your chosen format and, if **Include
  attachments** is on, an `attachments/` subfolder. Same layout as
  [the batch-export ZIP](../spec/zip-bundle-structure.md).
- **`_INDEX.md`** — table of every conversation with status: `OK` /
  `Skipped: empty` / `Failed: <reason>`.
- **`_INCOMPLETE.md`** — only present if the `/docs` or `/files` listing call
  failed; flags that the `files/` directory may be incomplete.

## Example ZIP layout

```
<Project Name>/
  README.md
  metadata.json
  instructions.md
  files/
    _INDEX.md
    design-notes.md
    architecture.pdf
    logo.png
    _SKIPPED.md         # only if some files failed
  conversations/
    2026-05-12_API-design-review/
      API-design-review.md
      attachments/      # only when 'Include attachments' is on
    2026-05-13_Auth-refactor/
      Auth-refactor.md
  _INDEX.md
  _INCOMPLETE.md        # only if /docs or /files listing failed
```

## What's *not* in the export

- **Memory.** The "Memory" panel that appears on some project pages in the
  claude.ai web UI is not exposed by any REST endpoint we've been able to
  reach. The bundled `README.md` documents this explicitly so it's clear
  it's not a bug. Project Instructions and knowledge docs (which you edit
  directly) are exported in full.
- **Sharing / collaborator info** — for privacy, the export does not list
  who else has access to the project.
- **Workspace UI state** (sidebar position, pinned messages, etc.) — Claude.ai
  interface state, not project content.

## Format support

Project Export supports four of the five formats: **Markdown**, **HTML**,
**JSON**, **TXT**.

**PDF is not supported for Project Export.** PDF generation uses the
browser's print pipeline, which can only run on one foregrounded chat at a
time — the same constraint that excludes PDF from batch ZIP mode. If you
need PDFs of project chats, open each one individually and use single-chat
export.

## Related

- [How to export a Claude project (step-by-step)](how-to-export-claude-project.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)
- [Features](../docs/features.md)
- [Pricing](../docs/pricing.md)

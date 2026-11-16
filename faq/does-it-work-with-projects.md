---
title: "Does It Work with Claude Projects? — AI Chat Archive Docs"
description: "Does AI Chat Archive work with Claude Projects? Yes: Pro exports instructions, files and chats as one ZIP in Markdown, HTML, JSON or TXT; single chats are free."
---

# Does AI Chat Archive work with Claude Projects?

**Yes.** AI Chat Archive Pro exports classic projects and Projects Beta as a
ZIP with instructions, available knowledge or Library files (including uploaded
PDFs), and conversations in Markdown, HTML, JSON or TXT. Open the project and
choose **Export this project (ZIP)** in the toolbar popup. PDF transcripts
are available through free single-chat export and the browser print dialog.

Supported project pages are `claude.ai/project/<uuid>`,
`claude.ai/cowork/project/<uuid>` and `claude.ai/code/project/chan_<id>`.
The floating **Export project** button appears on classic project pages and
the Beta project overview; on a selected Beta thread, use the popup for the
whole-project ZIP. See [the walkthrough](how-to-export-claude-project.md).

Project Export shipped in v0.3.0 and is gated by the paid license, same as
batch export.

## Two ways to export Project content

Pick the one that matches your goal:

| Goal | Use | Where |
|---|---|---|
| "I want everything from **this one project**" | **Project Export** (Pro) | On a classic or Beta project page (URLs above) |
| "I want **every conversation** in my account — projects or not" | **Batch Export** (paid) | On a `claude.ai/chat/<id>` page |
| "I just want **this one chat**" | Single-chat export (free) | On any conversation page |

Both ZIPs follow the same per-conversation folder pattern, so anything you
import from a batch ZIP will import the same way from a project ZIP.

## What Project Export bundles

A ZIP archive, named after the project, containing:

- **`README.md`** — overview: project name, ID, creator, dates, counts, and a
  note on what's not included.
- **`metadata.json`** — machine-readable mirror of the project metadata.
- **`instructions.md`** — the project's Instructions (the "prompt template"
  shown in the claude.ai sidebar), wrapped in a verbatim fenced block.
- **`files/`** — available knowledge files from the classic "Files" panel or
  Beta Library:
  - Text knowledge docs as Markdown.
  - Available uploaded binaries, including PDFs and images. Classic projects
    may supply a preview or thumbnail when no original asset is available;
    Beta Library files retain their folders and original bytes.
  - `_INDEX.md` — table listing every file with its type and date, written
    after all knowledge files have been added to the archive (and any
    cancelled tail recorded) so the names in the index match what was
    actually written.
  - `_SKIPPED.md` — only present if some files failed to download or you
    cancelled mid-run.
- **`conversations/`** — one folder per chat, Cowork task or Beta thread,
  named `<date>_<title>`. Beta exports include the project conversation,
  imported conversations and continued threads with their original context. Each
  folder holds the transcript in your chosen format and, if **Include
  attachments** is on, available uploads in `attachments/` and Cowork files
  in `outputs/`. Chat attachments follow the layout in
  [the batch-export ZIP](../spec/zip-bundle-structure.md).
- **`_INDEX.md`** — table of every conversation with status: `OK` /
  `Skipped: <reason>` / `Failed: <error>` / `Incomplete: <reason>` /
  `Not run` (the last appears when
  you cancel mid-run and some conversations were never reached).
- **`_INCOMPLETE.md`** — reports detected inventory or content omissions;
  check it along with any per-conversation omission reports.

Project knowledge and Library downloads do not depend on **Include
attachments**; that setting adds available conversation uploads and outputs.
Large exports can be split into ZIP parts; follow **How to combine the
parts.txt** in the first part and keep all parts.

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
  _INCOMPLETE.md        # detected inventory or content omissions
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

**Project transcripts cannot be exported as PDF.** Uploaded PDFs in the
project's knowledge or Library area are still included as files in `files/`
when downloadable. To save a project chat or Beta thread as a PDF transcript,
open it individually and use free single-chat PDF export, then choose
**Save as PDF** or print to PDF in the browser print dialog.

## Related

- [How to export a Claude project (step-by-step)](how-to-export-claude-project.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)
- [Features](../docs/features.md)
- [Pricing](../docs/pricing.md)

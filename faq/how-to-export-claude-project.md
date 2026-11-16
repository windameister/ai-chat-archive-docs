---
title: "Export a Claude Project as ZIP — AI Chat Archive Docs"
description: "Export classic Claude projects and Projects Beta with Pro. Download instructions, uploaded PDFs and files, plus chats in Markdown, HTML, JSON or TXT."
---

# How to export a Claude.ai project

Open the project page and choose **Export this project (ZIP)** in AI Chat
Archive Pro. Classic projects and **Projects Beta** are supported. The ZIP
includes instructions, available knowledge or Library files (including
uploaded PDFs), and conversations in **Markdown, HTML, JSON or TXT**.
Project transcripts cannot be exported as PDF; to save an individual chat
as PDF, use single-chat export and the browser's print dialog.

> **See the [Claude project download page](https://aichatarchive.app/claude-project-download)**
> for installation links, a demo, and an overview of what the ZIP includes.

Project Export requires **AI Chat Archive Pro**, separate from your Claude
subscription. The website's **Lifetime license is $39**, paid once, with a
**14-day refund window**. See [pricing](../docs/pricing.md) for all plans and
the [refund policy](https://aichatarchive.app/refund) for details. Single-chat
export is free in all five formats: PDF, Markdown, HTML, JSON and TXT.

## Step 1: Open the project page

Install AI Chat Archive and activate Pro. For a website purchase, enter your
license key in the extension popup and click **Apply**. Safari purchases use
Apple's in-app purchase flow through **Upgrade to Pro** in the popup.

While signed in to Claude, open the project you want to download from
**Projects** or **Projects Beta**. The extension recognizes these URLs:

| Project page | Supported URL |
|---|---|
| Classic project | `https://claude.ai/project/<uuid>` |
| Project under Cowork | `https://claude.ai/cowork/project/<uuid>` |
| Projects Beta | `https://claude.ai/code/project/chan_<id>` |

Use your project's actual URL: classic project IDs are UUIDs, while Beta
project IDs start with `chan_`. A standalone chat at `/chat/<uuid>` or a
Cowork task at `/cowork/cse_<id>` has its own export controls; open the
parent project for a whole-project ZIP.

## Step 2: Open the extension and pick a format

Click the AI Chat Archive toolbar icon, then choose a transcript format:

- **Markdown** (`.md`) — editable notes for Obsidian, Notion or a text editor.
- **HTML** (`.html`) — conversations you can read in a browser offline.
- **JSON** (`.json`) — structured data for scripts and other tools.
- **Plain text** (`.txt`) — a text copy without Markdown or HTML formatting.

This choice applies to the **conversation transcripts**. It does not
convert your uploaded project files. Project Export always tries to download
the knowledge or Library files, regardless of the **Include attachments in
the ZIP** setting. Turn that setting on if you also want available uploads
and generated files from the conversations, including Cowork outputs.

### Are uploaded PDFs included?

**Yes, when downloadable.** PDFs uploaded to the project's knowledge area or
Library are saved as files in `files/` inside the ZIP. Beta Library files
retain their folder structure and original bytes. For classic projects, the
exporter uses the original document when available, but may use a preview
or thumbnail if that is the asset Claude provides. Open important files to
check the saved version; failed downloads appear in `files/_SKIPPED.md`.

### Can project chat transcripts be PDFs?

**Project ZIP transcripts use Markdown, HTML, JSON or TXT, not PDF.** To
save a PDF of a project chat or Beta thread, open that conversation, choose
single-chat **PDF** export, and select **Save as PDF** or your system's
print-to-PDF option in the browser print dialog. This is free, with no daily
cap. PDF rendering happens in your browser.

## Step 3: Click "Export this project"

Choose either entry point:

- **Toolbar popup:** click **Export this project (ZIP)** after choosing
  your format. This works on classic and Beta project pages, including a
  Beta page with a thread selected.
- **On-page button:** from the classic project page or the Beta project
  overview, click **Export project**, then choose Markdown, HTML, JSON or
  Plain text from its menu to start the ZIP export.

On Projects Beta, the popup also offers **Export project conversation** or
**Export selected conversation** for a single transcript. When a Beta thread
or imported conversation is selected, the floating **Export** button also
exports that selection. For the whole project, use **Export this project
(ZIP)** in the popup or return to the project overview.

## Step 4: Keep the Claude tab open

The extension retrieves the project's instructions, knowledge or Library
files, and conversations, then builds the archive in your browser. Beta
archives include the project conversation, threads, imported chats and
Cowork tasks. Continued threads include their original context and new
replies; an imported conversation already included in a continuation is not
exported again as a separate item. Classic archives also include associated
Cowork tasks when accessible.

You can close the extension popup while the export runs, but keep the Claude
tab open. Use **Cancel** in the popup to stop. The archive records unreached
conversations as `Not run` and remaining knowledge files as cancelled.

Large exports can download as **several ZIP parts**. Allow multiple
downloads if your browser asks, keep every part, and follow **How to combine
the parts.txt** in the first part to extract them into the same folder. The
last part contains the conversation index. If an interrupted export offers
**Resume previous export** in the popup, use it to continue with the same
format and attachment setting.

## Step 5: Open and check the ZIP

The archive uses the project name. A typical Markdown export contains:

```text
<Project Name>/
  README.md             # project overview and exclusions
  metadata.json         # project metadata
  instructions.md       # custom instructions
  files/
    _INDEX.md           # included project files
    research.pdf        # an uploaded PDF, when downloadable
    notes.md
    _SKIPPED.md         # file failures or cancellations, when present
  conversations/
    <date>_<title>/
      <title>.md        # transcript in the format you selected
      attachments/      # available chat attachments, when enabled
      outputs/          # available Cowork outputs, when enabled
  _INDEX.md             # conversation status and ZIP part, if applicable
  _INCOMPLETE.md        # detected inventory or content omissions
```

The layout varies with the project content and export settings. Beta Library
subfolders remain under `files/`. Individual conversation folders can also
contain `_SKIPPED.md` and `_INCOMPLETE.md` reports.

Start with the root `_INDEX.md` and `files/_INDEX.md`, then review any
omission reports. To keep only the project documents, copy `files/` from
the extracted archive; keep `instructions.md` too if you need the setup.
See [how to download project files](how-to-download-files-from-claude-project.md)
for more detail.

## What's not included

- **Automatic project Memory.** Custom instructions and accessible knowledge
  or Library files are exported separately.
- **Sharing or collaborator settings and workspace UI state**, such as the
  sidebar layout.
- **Scheduled-task definitions, repository clones and connector
  configuration** in Projects Beta.
- **Unavailable file content.** Detected omissions are reported. Cowork
  files may fall back to a durable copy with a warning if their latest
  version cannot be verified. Shell-created files with no visible output
  path or delivery record may be missing.

## Troubleshooting

**The project export button is missing.**
Check the URL against the three supported formats above. On a selected Beta
thread, use the toolbar popup's project action or return to the project
overview. If the extension was just installed or updated, reload the Claude
tab. If you have hidden the floating button in settings, use the popup.

**The project button is disabled or asks me to upgrade.**
Choose Markdown, HTML, JSON or TXT instead of PDF for the project ZIP. If
the button asks for an upgrade, activate AI Chat Archive Pro; a Claude
subscription alone does not unlock it.

**A file or conversation is missing.**
Check `_INDEX.md`, `files/_SKIPPED.md`, and any `_INCOMPLETE.md` reports at
the project root or inside conversation folders. They identify detected
listing, transcript or download problems. Retry while signed in with access
to the project. A warning about an unavailable source does not mean the
extension can recover it.

**Another export is already running.**
Wait for it to finish or cancel it before starting another project or batch
export in the same tab. The extension also prevents exporting the same
project in two tabs at once.

## Related

- [Claude project download: setup and demo](https://aichatarchive.app/claude-project-download)
- [Does AI Chat Archive work with Claude Projects?](does-it-work-with-projects.md)
- [How to export a single Claude chat](how-to-export-claude-chat.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)
- [Pricing](../docs/pricing.md)

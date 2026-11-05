---
title: "Download Files from a Claude Project — AI Chat Archive Docs"
description: "Download Claude project files with AI Chat Archive Pro: save knowledge files and available PDFs or images in a ZIP, with instructions and conversations."
---

# How to download files from a Claude project

**Short answer:** Run AI Chat Archive's [Project Export](https://aichatarchive.app/claude-project-download) and open the `files/`
folder in the ZIP. Text knowledge documents are saved as Markdown, and
uploaded files such as PDFs and images are saved as files alongside them when
they can be downloaded. Project Export is a paid feature; single-chat export
is free.

## What "project files" means

Every project has a knowledge area — the **Files** panel on classic projects,
or **Library** on Beta Projects — holding the documents the project uses as
context:

- **Text knowledge documents** you created or pasted.
- **Uploaded files**: PDFs, images, spreadsheets, and other documents.

Project Export saves them together with the project's instructions and
conversations in one ZIP.

## Steps

1. Install AI Chat Archive and activate a paid license. (Single-chat export
   is free if you want to test first.)
2. Open the project: a classic project at `claude.ai/project/<id>`, or a Beta
   project at `claude.ai/code/project/<id>`.
3. Click **Export this project (ZIP)** in the extension popup, or
   **Export project** on the page, and pick Markdown, HTML, JSON or TXT for
   the conversation transcripts.
4. Wait while the extension retrieves the project files and conversations
   and builds the ZIP.
5. Unzip the download, open the project-named folder, then open its `files/`
   folder. Start with
   `files/_INDEX.md`, which lists the files included. On Beta Projects,
   Library folders keep their structure.

Your choice of transcript format does not convert the files in `files/`, and
you do not need the **Include attachments in the ZIP** option for project
knowledge files — Project Export always tries to download them, whatever that
setting is. That option only
adds available files attached to individual conversations.

## Are uploaded PDFs included?

Yes, when they can be downloaded. Uploaded PDFs are saved in `files/` as PDF
files; they are not converted to Markdown. For classic projects the exporter
prefers the actual document but may fall back to an available preview or
thumbnail. Files that fail or are cancelled are listed in `files/_SKIPPED.md`.

What is not available is a PDF transcript of the whole project: Project
Export writes conversations as Markdown, HTML, JSON or TXT. PDF export goes
through the browser's print dialog one conversation at a time, so to get a
PDF of a project chat, open that conversation and use single-chat PDF export,
which is free.

## How this differs from Claude's own export

Claude's **Save to project** menu does not offer a way to export a project as
a whole. Claude's official data export is requested from Settings → Privacy
and arrives as an email link; it is an account-data export rather than a
download of one selected project.

## If a file is missing

- A file that failed or was cancelled appears in `files/_SKIPPED.md`.
- If a project listing failed, the ZIP also contains `_INCOMPLETE.md`,
  warning that the archive may be partial.
- Automatic project Memory is not included in the export.

## Related

- [How to export a Claude project (full walkthrough)](how-to-export-claude-project.md)
- [Does AI Chat Archive work with Claude Projects?](does-it-work-with-projects.md)
- [PDF vs HTML vs Markdown](pdf-vs-html-vs-markdown.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)

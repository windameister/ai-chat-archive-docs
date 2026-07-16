# How to export a Claude Cowork task

Claude's **Cowork** surface (the "Cowork" toggle next to "Chat", grouped
under **Chats and tasks** in the sidebar) runs agentic, multi-step tasks —
Claude works in a cloud sandbox, runs tools, searches the web, and produces
files. A Cowork task lives at a URL like:

```
https://claude.ai/cowork/cse_<id>
```

It is a **different kind of session** from an ordinary chat or a Project,
and Claude.ai gives you no way to export one. AI Chat Archive (**v0.3.8+**)
adds first-class Cowork export: the full transcript in every format, plus
the files the task produced.

> The **transcript** is free in every format. Bundling the task's **output
> files** into the ZIP is a paid feature, gated by the same license as
> Project / Batch export — see [pricing](../docs/pricing.md).

## What "Cowork" is, and how it differs from a chat or project

- A **chat** (`/chat/<id>`) is a plain conversation.
- A **project** (`/cowork/project/<id>`) groups chats with shared
  instructions and knowledge files — see
  [how to export a project](how-to-export-claude-project.md).
- A **Cowork task** (`/cowork/cse_<id>`) is an agent run: Claude executes
  a goal step by step, using tools (Bash, file edits, web search) and
  delivering output files to an **Outputs** panel. Under the hood it is a
  Claude Code session, which is why the standard export options don't reach
  it.

## Step 1: Open the Cowork task

Open the task you want to save:

```
https://claude.ai/cowork/cse_<id>
```

You can get there from **Chats and tasks** in the Claude.ai sidebar, or by
opening any task from the Cowork surface.

## Step 2: Export it

Two ways, exactly like a normal chat:

- **Floating button** — click the **Export** button AI Chat Archive shows
  on the page. On a Cowork task it automatically moves aside so it never
  covers Claude's right-hand Progress / Outputs / Context panel.
- **Toolbar popup** — click the extension icon, pick a format, and export.

Pick any format:

- **Markdown** (`.md`) — for Obsidian, Notion, grep, future ingestion.
- **HTML** (`.html`) — self-contained, browsable offline.
- **PDF** — a clean printable copy.
- **JSON** (`.json`) — programmatic ingestion.
- **TXT** (`.txt`) — raw text.

## What you get

The export reconstructs the task as a readable transcript:

- Your prompts and Claude's replies, in order.
- A readable trace of the **tools** the task ran (commands, file writes,
  web searches) and their results — the agentic work, not a wall of raw
  logs. Internal scaffolding is filtered out.
- **Output files** (paid): every file the task delivered to the Outputs
  panel — PDFs, spreadsheets, Word documents, images, text — downloaded
  with their real bytes and bundled into the ZIP under `outputs/`.

Long tasks export **in full** — the extension pages through the entire
event history, so nothing is truncated. Non-Latin content and filenames
(e.g. Chinese) are preserved end to end, including inside the ZIP.

## What isn't covered (yet)

- **Batch export of Cowork tasks** — export is one task at a time. Batch
  and Project export cover chats and projects respectively.
- The task's live sandbox environment itself — only the transcript and the
  delivered output files are exported, not the container.

## Related

- [Does it work with Claude Projects?](does-it-work-with-projects.md)
- [How to export a Claude chat](how-to-export-claude-chat.md)
- [What every paid plan includes](../docs/features.md)

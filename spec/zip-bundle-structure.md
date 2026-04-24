# AI Chat Archive — ZIP bundle structure

When a user runs **bulk export** (a paid-tier feature) or exports a single conversation
with **Include attachments in the ZIP** checked, AI Chat Archive produces a single
`.zip` archive with a deterministic layout.

This document specifies that layout so third-party importers can reliably traverse it.

## Top-level contents

```
ai-chat-archive-{YYYY-MM-DD}-{HHMMSS}.zip
├── 2026-03-12_Designing-a-REST-API/
│   ├── Designing-a-REST-API.md
│   └── attachments/
│       ├── design-brief.pdf
│       └── screenshot.png
├── 2026-03-14_Refactoring-the-auth-layer/
│   ├── Refactoring-the-auth-layer.md
│   └── attachments/
│       └── error-log.txt
├── 2026-04-02_Late-night-debug-session/
│   ├── Late-night-debug-session.md
│   └── _SKIPPED.md
└── …
```

- Exactly one **top-level folder per conversation**. No shared flat directory.
- Folder name is `{created_at_date}_{safe_title}`.
- Each folder contains a single transcript file — `.md` or `.html` depending on the
  format the user picked — named after the conversation's safe title.
- If the conversation had attachments and the user opted to bundle them, an
  `attachments/` subfolder sits alongside the transcript.
- If *some* attachments failed to download (private files, expired URLs, etc.), the
  folder contains a `_SKIPPED.md` listing each one and the reason.

## Folder-name convention

```
{created_at_date}_{safe_title}
```

- `created_at_date` — the conversation's creation date, formatted `YYYY-MM-DD`.
  Time component is omitted so folders sort naturally.
- `safe_title` — the conversation's title, sanitized:
  - Spaces replaced with `-`.
  - Characters illegal on Windows/macOS/Linux filesystems (`<>:"/\|?*` and control
    characters) replaced with `-`.
  - Collapsed runs of `-` trimmed.
  - Truncated to 80 characters to stay under Windows `MAX_PATH`.
  - If the title was empty, the fallback is `Untitled-Conversation`.

Example:
- Original title: `"My project: v2 🎉 (final)"`
- Sanitized folder: `2026-03-12_My-project-v2-final`

## Transcript file

The transcript's filename matches the folder's `safe_title`, with an extension matching
the format:

- `.md` — see [Markdown format](markdown-format.md)
- `.html` — see [HTML format](html-format.md)

PDF is not supported in ZIP mode because PDF generation uses the browser's print
pipeline, which cannot be batched.

## `attachments/` subfolder

Present only when:

1. The conversation has at least one attachment or file, **and**
2. The user checked **Include attachments in the ZIP**.

Files inside preserve their original filenames, with the same sanitization rules as
folder names. If two attachments share a name, the second gets a `-2` suffix and so on.

The transcript's `> 📎 Attachment: {name}` references use the **sanitized name**, so
an importer can join `{folder}/attachments/{sanitized-name}` reliably.

## `_SKIPPED.md`

If one or more attachments could not be downloaded during export, AI Chat Archive
writes a `_SKIPPED.md` file into the conversation folder:

```markdown
# Files that could not be downloaded

- design-brief.pdf — network error
- old-prototype.fig — attachment expired
```

The transcript is still produced in full; only the binary attachments are missing.

## What's *not* in the ZIP

- **Metadata files** like `manifest.json`, `conversations.json`, or any machine
  index. Each conversation is self-describing via its transcript.
- **Hidden system files** (`.DS_Store`, `Thumbs.db`). The ZIP is written by the
  extension directly, never by the OS.
- **Compression metadata** beyond what `DEFLATE` naturally produces. No encryption,
  no passwords, no AES.
- **Attachments for conversations the user did not select.** Bulk export respects
  the current filter — filtered-out chats are never touched.

## Stability guarantees

- **Stable since:** v0.2.0 (March 2026).
- **Top-level layout (one folder per conversation) is frozen.** Future versions will
  not flatten or introduce a metadata index at the root.
- **Folder-name pattern is frozen** — importers can regex
  `^\d{4}-\d{2}-\d{2}_(.+)/` to extract titles.
- **`attachments/` subfolder placement is frozen.**

## Related

- [Markdown format](markdown-format.md)
- [HTML format](html-format.md)
- [Obsidian integration](../integrations/obsidian/)

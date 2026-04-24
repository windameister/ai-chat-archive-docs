# Getting started

This page walks you through installing AI Chat Archive and running your first export.
It takes about two minutes.

## 1. Install from the Chrome Web Store

1. Open the [Chrome Web Store listing](https://chromewebstore.google.com/detail/ai-chat-archive/).
2. Click **Add to Chrome**.
3. When prompted, approve the permissions (see [Privacy](privacy.md) for what each
   permission does).

The extension works in any Chromium-based browser: Chrome, Edge, Brave, Arc, Opera.
Firefox is not currently supported.

## 2. Open a Claude.ai conversation

Navigate to any conversation at <https://claude.ai>. The extension lights up only on
`claude.ai` pages — it cannot see anything else.

## 3. Click the extension icon

A small popup appears. You'll see:

- A **format** dropdown (PDF, HTML, Markdown).
- A big orange **Export this conversation** button.
- An advanced settings panel (collapsed by default).

## 4. Pick a format

| Format | Best for | Notes |
|---|---|---|
| **PDF** | Sharing, printing, archival | Rendered through Chrome's print engine. Attachments cannot be bundled. Free tier: 3 PDFs/day. |
| **HTML** | Browsing offline, web archival | Self-contained single file with embedded CSS. Looks like claude.ai. |
| **Markdown** | Notes, Obsidian, Notion, grep | Pure text. Attachments referenced but not embedded. See [spec](../spec/markdown-format.md). |

Unsure? Start with **Markdown** — it's the most portable.

## 5. Click Export

Your file appears in Downloads within a second or two. That's it.

## Bulk export (paid)

To export every conversation at once:

1. Activate a paid license (see [Pricing](pricing.md)).
2. In the popup, the **Full export** section unlocks.
3. Optionally check **Include attachments in the ZIP** to bundle uploaded files.
4. Click **Export all**.

A ZIP appears in Downloads with one folder per conversation. Layout is documented in
[spec/zip-bundle-structure.md](../spec/zip-bundle-structure.md).

## What to try next

- Drop an exported Markdown file into [Obsidian](../integrations/obsidian/) to see
  how it renders in a note-taking vault.
- Read [features.md](features.md) for the full capability list.
- Got questions? Browse the [FAQ](../faq/).

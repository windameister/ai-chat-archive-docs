# How to export a Claude.ai conversation

Claude.ai does not currently offer a built-in way to export a conversation. This page
walks through every practical option, from the quickest (copy-paste) to the most
polished (a dedicated browser extension).

## Option 1: Copy-paste (free, quick, loses fidelity)

1. Open the conversation at <https://claude.ai>.
2. Scroll to the top.
3. Select the entire conversation (`Cmd/Ctrl-A` usually works inside the message
   container; sometimes you need to click-and-drag).
4. Copy (`Cmd/Ctrl-C`).
5. Paste into a note app, document, or text editor.

**What you get:** plain text with most of the visible content.

**What you lose:**
- Artifacts (code panels, SVGs, Mermaid diagrams) appear as flat text.
- Attachments you uploaded are gone entirely.
- Claude's Markdown formatting (headings, lists, code blocks) usually becomes plain
  text, not real Markdown.
- Timestamps, Project metadata, and thinking blocks don't come through.

Fine for a single short chat. Painful above ~5 messages.

## Option 2: Print to PDF (free, saves visual state)

1. On the conversation page, press `Cmd/Ctrl-P` to open the print dialog.
2. Choose **Save as PDF**.
3. Save to a location on your disk.

**What you get:** a PDF that looks roughly like what you saw on screen.

**What you lose:**
- Conversation isn't paginated properly — long conversations can span 100+
  badly-formatted pages.
- Sidebar and page chrome leak into the PDF.
- Artifacts inside scroll containers get cropped.
- No attachments.
- No Markdown source — you can't grep or re-import into a note app.

Works in a pinch. Not great for archival.

## Option 3: AI Chat Archive (free for singles, paid for bulk)

A Chrome extension purpose-built for Claude export.

1. Install [AI Chat Archive](https://chromewebstore.google.com/detail/ai-chat-archive/jeocjmohgejjmlfdhdeddjceehpahblj)
   from the Chrome Web Store.
2. Open any Claude.ai conversation.
3. Click the extension icon in the toolbar.
4. Pick your format: **PDF**, **HTML**, **Markdown**, JSON, or TXT.
5. Click **Export this conversation**.

**What you get:**
- A clean, paginated file (or a self-contained HTML, or a Markdown doc).
- Artifacts rendered properly (code with syntax highlighting, SVGs inline, HTML
  widgets sandboxed).
- Timestamps preserved in your chosen format (local / UTC / ISO-8601).
- Optional: include Claude's thinking blocks, or tool-call metadata.
- A single click. No copy-paste, no print dialog, no manual cleanup.

**For bulk backup** (all your conversations at once, including attachments):

1. Activate a paid license (Starter $3.99/mo, Pro $29.88/yr, **Lifetime $19** —
   launch promo, normally $39).
2. Check **Include attachments in the ZIP** in the extension popup.
3. Click **Export all**.
4. You get a ZIP with one folder per conversation, attachments bundled.

See the [getting-started guide](../docs/getting-started.md) for the full walkthrough.

## Option 4: Anthropic API + custom script (developers only)

If you're comfortable writing code:

1. Get an Anthropic API key from <https://console.anthropic.com>.
2. Call the Messages API to list conversation IDs for your account.
3. For each ID, fetch the full conversation history.
4. Write code to render the JSON into whatever format you want.

**Pros:** complete programmatic control, no extension needed.

**Cons:** requires hours of glue code, rate-limited, API usage isn't free, and
reinvents work already done by AI Chat Archive.

## Which should I pick?

| Your situation | Recommended option |
|---|---|
| I want to save one conversation, right now, five seconds | Copy-paste |
| I need a shareable PDF I'll email someone | AI Chat Archive → PDF |
| I want to archive my full Claude history | AI Chat Archive → bulk ZIP |
| I'm building a knowledge base in Obsidian / Notion | AI Chat Archive → Markdown |
| I'm writing a custom data pipeline | Anthropic API + script |

## Related

- [PDF vs HTML vs Markdown: which format to pick?](pdf-vs-html-vs-markdown.md)
- [Claude vs ChatGPT: which is easier to export?](claude-vs-chatgpt-export.md)
- [AI Chat Archive: getting started](../docs/getting-started.md)

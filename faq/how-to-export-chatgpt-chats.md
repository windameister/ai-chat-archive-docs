# How to export a ChatGPT conversation

**Short answer:** to save a single ChatGPT conversation as a clean file (PDF, Markdown,
HTML, JSON, or TXT), install the [AI Chat Archive](https://aichatarchive.app/chatgpt-exporter)
browser extension, open the chat, and click Export. It runs entirely in your browser —
nothing is uploaded — and PDF export is free with no daily cap. ChatGPT's own built-in
export is bulk-only (an email-delivered ZIP) and awkward for a single chat.

This page compares every practical option.

## Option 1: AI Chat Archive extension (recommended, unlimited free PDF)

A browser extension that adds an Export button to `chatgpt.com`.

1. Install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/ai-chat-archive/jeocjmohgejjmlfdhdeddjceehpahblj)
   (also on Edge, Firefox, and Safari).
2. Open the conversation on <https://chatgpt.com>.
3. The first time, click **Enable on ChatGPT** in the extension popup to grant access to
   `chatgpt.com` (a one-time, opt-in permission). The page reloads and a green **Export**
   button appears.
4. Click **Export** and pick a format: **PDF, Markdown, HTML, JSON, or TXT**.
5. The file downloads straight to your machine.

**What you get:**

- **Unlimited free PDF** — no daily cap. Many ChatGPT exporters limit free PDF to ~3/day
  and paywall the rest; this one doesn't.
- **Images embedded** — pictures ChatGPT generated *and* images you uploaded are inlined
  into the HTML and PDF, so the file looks like the conversation.
- **Projects and custom GPTs** — the Export button also appears on conversations inside a
  ChatGPT Project and on chats with a custom GPT, not just plain chats.
- **Clean transcript** — code blocks, tables, and CJK (Chinese/Japanese/Korean) text render
  correctly; browsing/tool scaffolding and citation markers are stripped.
- **100% local** — the extension reads the conversation from `chatgpt.com` using your
  existing session and writes the file locally. No account, no upload, no telemetry.

**Paid features** (one-time license): **batch export** of your entire ChatGPT history as a
single ZIP, and **attachment bundling** — the original uploaded files, at full quality, in
an `attachments/` folder next to the transcript. (Viewing your images inline in HTML/PDF is
free; getting the original files as a ZIP is the paid part.)

## Option 2: ChatGPT's native export (bulk only, email-delivered)

ChatGPT has a built-in account-wide export.

1. Go to **Settings → Data Controls → Export data**.
2. Confirm; ChatGPT emails you a download link (it expires after ~24 hours).
3. The ZIP contains a single monolithic `chat.html` plus a `conversations.json`.

**What you get:** every conversation, in one archive, for free.

**What you lose / the friction:**

- It's **bulk only** — there's no "export this one conversation" button.
- The HTML is **one giant file**, not one file per conversation.
- **Attachments are referenced, not bundled** — the binaries don't ride along.
- The download link **expires** and the feature is **rate-limited** (you can't run it
  repeatedly).
- The UX is built for "I'm leaving the platform," not "back up this chat."

## Option 3: Copy-paste (free, quick, loses fidelity)

Select the conversation, copy, and paste into a note or document.

**What you lose:** images, formatting (headings/lists/code often flatten to plain text),
and any structure. Fine for one short chat; painful beyond a few messages.

## Which should I pick?

- **One conversation, or a few, cleanly** → AI Chat Archive (Option 1). One click, PDF/
  Markdown/HTML, images included, free.
- **Everything at once, and you don't mind post-processing** → ChatGPT native export
  (Option 2), or AI Chat Archive's paid batch export for a per-conversation ZIP with
  attachments.
- **A one-off snippet** → copy-paste (Option 3).

## Related

- [ChatGPT exporter — landing page](https://aichatarchive.app/chatgpt-exporter)
- [Claude vs ChatGPT: which is easier to export?](claude-vs-chatgpt-export.md)
- [PDF vs HTML vs Markdown — which should I pick?](pdf-vs-html-vs-markdown.md)
- [Does it send my data anywhere?](does-it-send-data-anywhere.md)

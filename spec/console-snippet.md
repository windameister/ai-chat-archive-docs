# Console snippets — paste-into-DevTools export

Two minimal, zero-install JavaScript snippets that download the conversation you're
currently viewing on Claude.ai. Open-source under MIT, intended as:

- a **fallback** when the extension is broken or you can't install it,
- a **reference implementation** of the Markdown format spec,
- and the open-source backstop for the "open-source console scripts available"
  claim in our Chrome Web Store listing.

Both snippets call only `claude.ai`'s own API using your existing session cookie.
They never talk to a third-party server. Read them line by line before running.

> **Important.** Claude's internal API can change without notice. If a snippet
> stops working, [install the AI Chat Archive extension](https://chromewebstore.google.com/detail/ai-chat-archive/jeocjmohgejjmlfdhdeddjceehpahblj) — it ships fixes faster than this page does.

---

## Markdown export

Downloads the current conversation as a single `.md` file matching the
[Markdown format spec](/spec/markdown-format/).

### Use it

1. Open the conversation you want to export at `https://claude.ai/chat/...`.
2. Open your browser's developer tools (`F12` or `Cmd+Option+J` on macOS) and
   switch to the **Console** tab.
3. Paste the script below and press Enter. The `.md` file appears in your
   Downloads folder.

```js
/* AI Chat Archive — single-conversation Markdown export (console snippet)
 * License: MIT.
 *
 * Paste into the browser console while viewing a Claude.ai conversation
 * (https://claude.ai/chat/...). Downloads the active branch as a Markdown
 * file matching the format spec at:
 * https://docs.aichatarchive.app/spec/markdown-format/
 *
 * Calls only claude.ai's own API with your existing session cookie. No
 * third-party services. Read it line by line before running.
 */
(async () => {
  const m = location.pathname.match(/\/chat\/([0-9a-f-]+)/);
  if (!m) {
    alert('Open a Claude.ai conversation first (URL like /chat/UUID).');
    return;
  }
  const conversationId = m[1];

  // 1. Pick the org. /api/organizations returns an array; first one wins.
  const orgs = await fetch('/api/organizations', { credentials: 'include' }).then(r => r.json());
  if (!orgs?.length) throw new Error('No organization found.');
  const orgId = orgs[0].uuid;

  // 2. Fetch the conversation, including tool calls + artifacts.
  const url = `/api/organizations/${orgId}/chat_conversations/${conversationId}`
            + `?tree=True&rendering_mode=messages&render_all_tools=true`;
  const conv = await fetch(url, { credentials: 'include' }).then(r => r.json());

  // 3. Flatten the messages — `chat_messages` is sometimes a tree, sometimes flat.
  const messages = flatten(conv.chat_messages);

  // 4. Build the Markdown document.
  const md = buildMarkdown(conv, messages);

  // 5. Trigger a download.
  download(md, `${safeName(conv.name || 'untitled')}.md`);
  console.log(`Exported ${messages.length} messages.`);

  // ---------- helpers ----------

  function flatten(node) {
    if (!node) return [];
    if (Array.isArray(node)) return node;
    const out = [];
    (function walk(n) {
      if (!n) return;
      if (n.message || n.content || n.text) out.push(n);
      (n.children || []).forEach(walk);
    })(node);
    return out;
  }

  function buildMarkdown(conv, messages) {
    const lines = [`# ${conv.name || 'Untitled Conversation'}`, ''];
    const meta = [];
    if (conv.created_at) meta.push(`Created: ${fmt(conv.created_at)}`);
    if (conv.updated_at) meta.push(`Updated: ${fmt(conv.updated_at)}`);
    if (meta.length) lines.push(`> ${meta.join(' | ')}`, '');
    lines.push('---', '');

    for (const msg of messages) {
      const sender = msg.sender || msg.role;
      if (sender !== 'human' && sender !== 'assistant') continue;
      const ts = fmt(msg.created_at);
      const label = sender === 'human' ? 'Human' : 'Claude';
      lines.push(`## ${label}${ts ? ` (${ts})` : ''}:`, '');

      // Attachment / file references (no binaries; that's a paid feature).
      const refs = [
        ...(msg.attachments || []).map(a => {
          const size = a.file_size ? ` (${(a.file_size / 1024).toFixed(1)} KB)` : '';
          return `> 📎 Attachment: ${a.file_name || 'attachment'}${size}`;
        }),
        ...(msg.files || []).map(f => `> 📎 File: ${f.file_name || 'file'}`),
      ];
      if (refs.length) lines.push(...refs, '');

      lines.push(renderBlocks(msg.content), '', '---', '');
    }
    return lines.join('\n');
  }

  function renderBlocks(content) {
    if (typeof content === 'string') return content;
    if (!Array.isArray(content)) return '';
    const out = [];
    for (const b of content) {
      if (b.type === 'text') {
        out.push(b.text || '');
      } else if (b.type === 'tool_use') {
        const input = typeof b.input === 'string' ? b.input : JSON.stringify(b.input, null, 2);
        out.push('```json', `// tool: ${b.name}`, input, '```');
      } else if (b.type === 'tool_result') {
        out.push('```', `// tool result${b.tool_use_id ? ' for ' + b.tool_use_id : ''}`, renderBlocks(b.content), '```');
      } else if (b.type === 'image') {
        out.push(`> 🖼️ Image: ${b.source?.media_type || 'image'}`);
      } else if (b.type === 'document') {
        out.push(`> 📄 Document: ${b.title || b.name || 'document'}`);
      } else if (b.type === 'thinking') {
        // Skip thinking blocks by default — they're internal reasoning.
      } else if (b.text) {
        out.push(b.text);
      }
    }
    return out.join('\n\n');
  }

  function fmt(ts) {
    if (!ts) return null;
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d.toLocaleString();
  }

  function safeName(name) {
    return name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 120) || 'untitled';
  }

  function download(text, filename) {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
})();
```

---

## Raw JSON export

Downloads the conversation as the unmodified Claude API response. Useful when you
want to feed it into your own renderer or post-processor.

### Use it

Paste into the same console as above, press Enter. A `.json` file appears.

```js
/* AI Chat Archive — raw JSON dump (console snippet)
 * License: MIT.
 *
 * Downloads the current Claude.ai conversation as the raw API response
 * (.json). Useful as input for custom format converters or post-processors.
 */
(async () => {
  const id = location.pathname.match(/\/chat\/([0-9a-f-]+)/)?.[1];
  if (!id) return alert('Open a Claude.ai conversation first (URL like /chat/UUID).');

  const orgs = await fetch('/api/organizations', { credentials: 'include' }).then(r => r.json());
  const url = `/api/organizations/${orgs[0].uuid}/chat_conversations/${id}`
            + `?tree=True&rendering_mode=messages&render_all_tools=true`;
  const conv = await fetch(url, { credentials: 'include' }).then(r => r.json());

  const blob = new Blob([JSON.stringify(conv, null, 2)], { type: 'application/json' });
  const filename = (conv.name || 'untitled').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '.json';
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: filename });
  a.click();
})();
```

---

## What these snippets deliberately don't do

These are not a one-to-one substitute for the Chrome extension. They cover
**single-conversation Markdown / JSON** export, which is the most common case.
Everything past that is in the extension only:

- **Batch export** — sweeping every conversation in your account into a single
  ZIP. The ZIP layout is documented in [`/spec/zip-bundle-structure/`](/spec/zip-bundle-structure/),
  but no console-snippet equivalent is published.
- **Attachment / file binaries** — these snippets only print attachment **names**;
  the extension downloads the bytes too and packs them into the ZIP.
- **Generated documents** (Claude-produced docx / xlsx / py / images) come through
  as references here; the extension fetches them.
- **PDF and HTML rendering** — bigger code; only in the extension.
- **No-branding output** — every export from these snippets is unbranded already
  (no footer); the toggle exists in the extension for licensed users so the same
  point applies.

If those are what you need, [install the extension](https://chromewebstore.google.com/detail/ai-chat-archive/jeocjmohgejjmlfdhdeddjceehpahblj).

---

## If it stops working

Claude's internal API isn't a public contract; field names and routes have changed
before and will change again. When that happens:

1. The first sign is usually `fetch` returning `404` or `403`, or the script
   throwing on missing fields.
2. **First check:** install or update the extension. We ship API-compatibility
   fixes there fastest.
3. **If you're stuck without the extension** (corporate-locked browser, etc.):
   open an issue at [ai-chat-archive-docs](https://github.com/windameister/ai-chat-archive-docs/issues)
   so we can update this page.

---

## License

Both snippets are licensed under the [MIT License](https://opensource.org/license/mit).
Reuse, modify, redistribute — the only ask is keeping the license header in your copy.

The surrounding documentation on this site is licensed CC BY 4.0; the code blocks
above are MIT.

---

## Related

- [Markdown format spec](/spec/markdown-format/) — what these snippets target
- [HTML format spec](/spec/html-format/) — extension-only, for reference
- [ZIP bundle structure](/spec/zip-bundle-structure/) — what batch export produces
- [Privacy model](/docs/privacy/) — what data the extension touches and why

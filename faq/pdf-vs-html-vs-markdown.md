# PDF vs HTML vs Markdown — which export format should I pick?

**Quick answer:**

- **PDF** if you're going to share, print, or send to a lawyer / client / reviewer.
- **HTML** if you want to browse the conversation offline or keep a faithful web-style
  archive.
- **Markdown** if you're putting it into Obsidian, Notion, a wiki, or grepping it
  later.

Below is the full comparison.

## Side-by-side

| | **PDF** | **HTML** | **Markdown** |
|---|---|---|---|
| Visual fidelity to Claude.ai | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Editability | ❌ Locked | Partial (copy-paste) | ✅ Fully editable |
| Self-contained (no network) | ✅ | ✅ | ✅ |
| Works in note-taking apps | ❌ | Partial | ✅ Perfectly |
| Searchable with `grep` | ❌ | Partial | ✅ |
| File size (typical) | 800 KB – 3 MB | 300 KB – 1 MB | 20 – 200 KB |
| Bundles attachments in ZIP | ❌ (can't) | ✅ Paid | ✅ Paid |
| Free-tier daily limit | 3/day | Unlimited | Unlimited |
| Round-trip to Claude.ai | ❌ No | ❌ No | ❌ No |
| Good for long-term archive | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Pick PDF if…

- You need to **share the conversation with a non-technical person**.
- You need to **print** the conversation.
- You're submitting the conversation as **evidence** (legal, compliance, academic
  citation) and need a format that cannot be trivially edited.
- You want the conversation to look **exactly** like what you saw in Claude.

**Trade-offs:**

- Can't bundle attachments. Uploaded files and Claude-generated `present_files`
  don't fit into PDF output.
- Capped at 3 per day on the free tier. Paid license removes the cap.
- Once generated, you can't easily edit or re-process the content.

## Pick HTML if…

- You want an **offline-browsable** archive you can open anytime in any browser.
- You want the **Claude visual style preserved** (typography, colors, artifact
  panels) but still want a flexible format.
- You're archiving conversations for **your own web-based tools** — the
  resulting HTML is clean, semantic, and parseable.
- You want artifacts rendered as **live HTML / SVG** (inside sandboxed iframes)
  rather than flattened to a screenshot.

**Trade-offs:**

- Not ideal for editing or importing into note apps.
- Slightly heavier than Markdown for the same content.

## Pick Markdown if…

- You use **Obsidian, Notion, Logseq, Roam, or any other note app** — Markdown
  slots right in. See the [Obsidian integration](../integrations/obsidian/).
- You want to **grep, sed, or otherwise process** conversation archives as
  plain text.
- You're building a **personal knowledge base** and want a format you can edit,
  link between, and refactor.
- You want the **smallest possible file** per conversation.

**Trade-offs:**

- Loses some visual fidelity — artifacts become labeled code blocks, widgets
  become base64-encoded SVG references.
- Claude's syntax highlighting isn't preserved (most Markdown renderers do
  their own highlighting, so this is usually fine).

## Pick JSON or TXT if…

These are the secondary formats, rarely the right answer but sometimes exactly
what you need:

- **JSON** — you're writing a script that ingests conversations programmatically.
  The export is the raw Claude API response, unmodified.
- **TXT** — you need the conversation in a format with zero markdown syntax,
  zero HTML tags, zero anything except plain text (e.g., feeding to a
  compliance archive that rejects formatted input).

## My conversations have attachments. Does that change anything?

Yes — **only HTML and Markdown (in ZIP mode) preserve attachments**. PDF
can't bundle binaries.

So if your workflow is "save this conversation + the PDFs I uploaded":

1. Pick **HTML** or **Markdown**.
2. Check **Include attachments in the ZIP** (paid feature).
3. You get a folder with the transcript + an `attachments/` subfolder.

## Still can't decide?

Start with **Markdown**. It's the most portable — you can always convert it to
HTML (`pandoc`, any static site generator) or PDF (`pandoc`, `wkhtmltopdf`)
later, but you can't cleanly go the other direction.

## Related

- [Markdown format spec](../spec/markdown-format.md)
- [HTML format spec](../spec/html-format.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)
- [Obsidian integration](../integrations/obsidian/)

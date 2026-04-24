# AI Chat Archive — Markdown export format

This document specifies the Markdown representation AI Chat Archive produces when
exporting a Claude.ai conversation. If you are writing an importer (Obsidian plugin,
search indexer, static-site ingest), this page is the canonical reference.

All examples below are taken from real output. The format is stable across releases; any
breaking change will be flagged in the [changelog](../docs/changelog.md) and a new
version string will appear in `llms.txt`.

## Document skeleton

```markdown
# {Conversation title}

> Created: {locale-formatted timestamp} | Updated: {locale-formatted timestamp}

---

## Human ({timestamp}):

{attachment references, if any}

{message body}

---

## Claude ({timestamp}):

{message body, with artifacts / widgets / tool calls rendered inline}

---

{…alternating Human / Claude blocks…}
```

Every exported file starts with a single `#` H1 containing the conversation title, an
optional blockquote with creation / update timestamps, and a horizontal rule before the
first message.

- If Claude.ai did not give the conversation a title, the file uses
  `Untitled Conversation`.
- Timestamps default to the user's browser locale. Users can switch to UTC or ISO-8601
  in the extension's advanced settings; if they do, every timestamp in the file —
  including the metadata block and every `## Human (…)` / `## Claude (…)` heading —
  switches uniformly.

## Turn headings

Each turn begins with an H2. Two senders are supported:

```markdown
## Human (2026-04-23 14:07):
## Claude (2026-04-23 14:07):
```

If the source message has no timestamp, the parenthetical is dropped:

```markdown
## Human:
## Claude:
```

Turns are separated by a blank line and a horizontal rule:

```markdown
(previous turn body)

---

## Claude (…):
```

## Human-turn attachment references

When a human turn has uploaded attachments or files, AI Chat Archive writes them as
blockquote lines **before** the message body, so an importer can pick them up without
parsing the message itself:

```markdown
## Human (2026-04-23 14:07):

> 📎 Attachment: design-brief.pdf (234.5 KB)
> 📎 Attachment: screenshot.png (88.1 KB)
> 📎 File: brand-guide.pdf

Can you review these and suggest what's missing?
```

Two distinct prefixes exist:

- `> 📎 Attachment: {name} ({size})` — files uploaded directly into the message
  (`attachments` array). Size is omitted when not available.
- `> 📎 File: {name}` — files attached via the Projects file picker (`files` array).

The actual binary is **not** embedded in the Markdown file. See
[ZIP bundle structure](zip-bundle-structure.md) for how attachments travel alongside
the transcript in bulk export mode.

## Message body

Message content is a sequence of typed blocks. The extension flattens them into
Markdown using the following rules:

| Source block | Rendered as |
|---|---|
| `text` | Plain Markdown, passed through unchanged (Claude already returns valid Markdown). |
| `thinking` | Fenced block labelled `> 💭 Claude's thinking`, omitted by default; included only when the user enables `includeThinking`. |
| `tool_use` — `artifact` | Fenced code block with the artifact's language, preceded by `**Artifact: {title}**`. |
| `tool_use` — `show_widget` | Either an inline SVG (for SVG widgets) or an HTML block stored in the companion `_widgets/` folder, referenced by filename. |
| `tool_use` — `present_files` | A bullet list of filenames; the files themselves are bundled into the ZIP. |
| Any other `tool_use` | Dropped from Markdown output (tool calls are implementation noise; enable "Include tool calls" in settings to keep them). |

## Artifact example

```markdown
## Claude (2026-04-23 14:08):

Here's the component:

**Artifact: Login form (React)**

​```jsx
export function LoginForm() {
  return <form>…</form>;
}
​```

And a quick explanation…
```

Artifacts always carry a language tag inferred from Claude's `artifact_type` field
(e.g. `application/vnd.ant.code` → the code's own language, `text/html` → `html`,
`image/svg+xml` → `svg`). When multiple versions of the same artifact exist in the
conversation, only the final version is rendered in-line; earlier versions are listed
in an appendix (see [Versioned artifacts](#versioned-artifacts) below).

## Versioned artifacts

If Claude rewrote an artifact across multiple turns, the Markdown file ends with an
appendix:

```markdown
---

## Artifact history

### Login form — earlier versions

- [v1](#artifact-login-form-v1) — Initial draft
- [v2](#artifact-login-form-v2) — Added email validation
```

Each entry links to an in-file anchor where the full earlier version is preserved as a
fenced code block. This preserves round-trip fidelity without cluttering the main
conversation flow.

## Free vs paid output

The free tier appends a single-line attribution footer to each exported file:

```markdown

---

Exported with [AI Chat Archive](https://aichatarchive.app) · Runs entirely in your browser
```

A paid license removes this line. The rest of the format is identical across tiers.

## What's *not* in the Markdown

- The user's Claude account ID, workspace ID, or any other identifier.
- HTTP fetch URLs for attachments (those resolve server-side and would rot).
- Inline base64 of images — binary assets are always bundled separately in ZIP mode,
  or dropped in standalone Markdown mode.
- Any tracking pixels, IDs, or referrer markers.

## Stability guarantees

- **Stable since:** v0.2.0 (March 2026).
- **Header format is stable**: `# {title}`, `## Human (…):`, `## Claude (…):` will not
  change without a major version bump.
- **Attachment prefixes are stable**: `> 📎 Attachment:` and `> 📎 File:` — safe to
  regex for.
- **Block rendering rules may be extended** — new `tool_use` variants may gain
  dedicated renderers, but existing ones are frozen.

If you're parsing these files programmatically and want to be alerted to format
changes, subscribe to the [changelog](../docs/changelog.md) or watch this repository.

## Related

- [HTML format](html-format.md)
- [ZIP bundle structure](zip-bundle-structure.md)
- [How does it handle Claude Artifacts?](../faq/how-does-it-handle-artifacts.md)

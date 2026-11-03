---
description: "Claude Artifacts export: preserve code, SVG, HTML and Mermaid output in supported formats, with final versions inline and earlier versions kept in an appendix."
---

# How does AI Chat Archive handle Claude Artifacts?

**Short answer:** Artifacts are exported inline in the transcript, with full fidelity
for code, SVG, and HTML. Earlier versions of rewritten artifacts are preserved in a
collapsible appendix.

Claude Artifacts are the "standalone outputs" Claude generates — a React component, an
SVG diagram, a Markdown document, an HTML page — displayed in Claude's right-side panel.
Because artifacts are first-class deliverables, AI Chat Archive treats them
specifically, not as plain message content.

## What you get, by format

### Markdown export (`.md`)

Each artifact becomes a titled fenced code block:

````markdown
**Artifact: Login form (React)**

```jsx
export function LoginForm() {
  return <form>…</form>;
}
```
````

The language tag comes from Claude's `artifact_type` field. Supported:

| Claude artifact type | Markdown language tag |
|---|---|
| `application/vnd.ant.code` | The code's own language (`javascript`, `python`, …) |
| `text/markdown` | `markdown` |
| `text/html` | `html` |
| `image/svg+xml` | `svg` |
| `application/vnd.ant.react` | `jsx` |
| `application/vnd.ant.mermaid` | `mermaid` |

### HTML export (`.html`)

Artifacts render in a styled panel with the artifact title, type icon, and the
artifact body:

- **Code artifacts** — highlighted code block.
- **HTML artifacts** — rendered inside a sandboxed `<iframe srcdoc="...">`, so
  the artifact visually renders while its scripts don't leak into the exported
  document.
- **SVG artifacts** — inline `<svg>`, with Claude's CSS custom properties
  (`--color-text-primary`, etc.) resolved at export time so the SVG looks the
  same in the exported HTML as it did in Claude.
- **Mermaid artifacts** — pre-rendered to SVG at export time.

### PDF export (`.pdf`)

PDF is produced by feeding the HTML export to Chrome's print pipeline, so
artifacts render exactly as they do in HTML — with one caveat: interactive HTML
widgets are frozen at their initial state (PDF is static).

### JSON export (`.json`)

The full Claude API response, unmodified. Artifact blocks appear as:

```json
{
  "type": "tool_use",
  "name": "artifacts",
  "input": {
    "command": "create",
    "id": "login-form",
    "type": "application/vnd.ant.react",
    "title": "Login form",
    "content": "export function LoginForm() { ... }"
  }
}
```

Use this if you're building a downstream tool that needs the raw structure.

## Multiple versions of the same artifact

When you ask Claude to rewrite an artifact ("add email validation", "make it
dark mode"), Claude creates new versions of the same artifact ID.

**AI Chat Archive shows the final version inline in the conversation,** then
appends a **version appendix** at the end of the file:

```markdown
---

## Artifact history

### Login form — earlier versions

- [v1](#artifact-login-form-v1) — Initial draft
- [v2](#artifact-login-form-v2) — Added email validation
- v3 — (final, inline in Turn 5)
```

Each entry links to an in-file anchor where the full earlier version is
preserved. This preserves round-trip fidelity (you can reconstruct any version
from the export) without cluttering the conversation flow with duplicates.

## `present_files` — files Claude generates mid-conversation

Distinct from artifacts, `present_files` are downloadable files Claude
generates during the conversation (e.g., an Excel file from a code-interpreter
session).

- **In Markdown / HTML**: listed inline as a bulleted file list.
- **In ZIP bundles**: the binary files are bundled into
  `{conversation-folder}/attachments/` so they download together with the
  transcript. See [ZIP bundle structure](../spec/zip-bundle-structure.md).

## Widgets (`show_widget`)

Claude's `show_widget` tool calls — the inline SVG illustrations and HTML
interactive widgets produced by the visualize skill — are always exported
(regardless of the "include artifacts" toggle), because they're user-visible
creative output rather than internal scaffolding.

- **SVG widgets**: inline in Markdown as a base64 data URI; inline `<svg>` in
  HTML.
- **HTML widgets**: saved as a companion file in a `_widgets/` folder and
  referenced from the transcript.

## What's *not* included

- **Interactive state.** If you ran a React artifact and clicked buttons, the
  post-click state isn't captured — only the initial render.
- **Live code execution results** from the code-interpreter sandbox are
  captured as `present_files` and text output, but the sandbox itself isn't
  replayable.
- **Real-time collaboration edits** to an artifact (if they exist in future
  Claude versions) — only committed versions are exported.

## Related

- [Markdown format spec](../spec/markdown-format.md)
- [HTML format spec](../spec/html-format.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)

# AI Chat Archive — HTML export format

This document specifies the HTML representation AI Chat Archive produces when
exporting a Claude.ai conversation to HTML.

The HTML output is designed to be **self-contained** and look visually identical
to Claude's own web UI in light mode. You can open the file in any browser —
today or ten years from now — and the conversation renders correctly without
any network access.

## Document skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{Conversation title}</title>
  <style>
    /* Embedded CSS: typography, colors, code-block styling */
  </style>
</head>
<body>
  <article class="conversation">
    <header>
      <h1>{Conversation title}</h1>
      <p class="meta">
        Created: {timestamp} · Updated: {timestamp}
      </p>
    </header>

    <section class="turn turn-human" data-sender="human" data-timestamp="...">
      <h2>Human</h2>
      <div class="attachments">…</div>
      <div class="body">…</div>
    </section>

    <section class="turn turn-assistant" data-sender="assistant" data-timestamp="...">
      <h2>Claude</h2>
      <div class="body">…</div>
    </section>

    <!-- …alternating turns… -->

    <footer class="branding">…</footer>
  </article>
</body>
</html>
```

## Key design choices

- **Self-contained.** All CSS is inlined into a `<style>` block. No external
  stylesheet, no `<link>`, no webfont fetches. The file works offline forever.
- **No JavaScript.** The export is static HTML. Widgets with interactive behavior
  are rendered as static SVG / HTML snapshots — they won't re-run, but they will
  render correctly.
- **Semantic structure.** Each turn is wrapped in `<section class="turn">` with
  `data-sender` and `data-timestamp` attributes so importers / search indexers
  can parse turns without regex.
- **Light-mode only.** The HTML matches Claude.ai's light-mode palette and
  typography. Dark-mode support would require user preference detection; instead,
  you can override `prefers-color-scheme` in your own CSS if needed.

## Turn structure

Each turn is a `<section>` element with two modifiers:

```html
<section class="turn turn-human"
         data-sender="human"
         data-timestamp="2026-04-23T14:07:12Z">
  <h2>Human <time>2026-04-23 14:07</time></h2>
  <div class="attachments">
    <div class="attachment">
      <span class="icon">📎</span>
      <span class="name">design-brief.pdf</span>
      <span class="size">234.5 KB</span>
    </div>
  </div>
  <div class="body">
    <p>Can you review these and suggest what's missing?</p>
  </div>
</section>
```

- `class="turn turn-human"` vs `class="turn turn-assistant"` — lets CSS target
  the two senders independently.
- `data-sender` — programmatic access without class-name parsing.
- `data-timestamp` — always ISO-8601 in the data attribute regardless of the
  display format. The human-readable form in `<time>` respects the user's
  timestamp preference.

## Attachments

Attachments appear as `<div class="attachment">` entries in a
`<div class="attachments">` container before the `<div class="body">`. The entry
contains:

- `<span class="icon">📎</span>` — visual marker.
- `<span class="name">` — original filename.
- `<span class="size">` — human-readable size (omitted when unknown).

Binaries themselves are **not** embedded. See
[zip-bundle-structure.md](zip-bundle-structure.md) for how attachments travel
alongside the HTML in ZIP mode.

## Code blocks

Claude's code blocks render as:

```html
<pre class="code"><code class="language-{lang}">...</code></pre>
```

- `language-{lang}` follows the highlight.js convention so downstream tools can
  re-highlight if they want.
- Syntax highlighting is baked in at export time using Claude's own color
  palette, so the block looks the same offline as online.

## Artifacts

Claude-generated artifacts render as a styled panel:

```html
<aside class="artifact" data-artifact-type="{type}">
  <header>
    <span class="artifact-icon">📄</span>
    <span class="artifact-title">{title}</span>
  </header>
  <div class="artifact-body">
    <!-- For code artifacts: highlighted code block -->
    <!-- For HTML artifacts: iframe with srcdoc -->
    <!-- For SVG artifacts: inline SVG -->
  </div>
</aside>
```

The artifact panel visually distinguishes itself from regular code blocks so
readers can tell "this is a standalone output" at a glance.

## Widgets

Claude's `show_widget` tool calls render in one of two ways:

- **SVG widgets**: inline `<svg>` element in the body. Claude's CSS custom
  properties (`--color-text-primary`, etc.) are resolved at export time so the
  widget renders even when the parent page's CSS is missing.
- **HTML widgets**: wrapped in a sandboxed `<iframe srcdoc="...">` so the
  widget's script / styles don't leak into the surrounding document.

## Free vs paid output

Free-tier HTML exports include a small `<footer class="branding">` at the
document bottom:

```html
<footer class="branding">
  Exported with
  <a href="https://aichatarchive.app">AI Chat Archive</a>
  · Runs entirely in your browser
</footer>
```

Paid licenses remove this footer. All other HTML structure is identical.

## Security: XSS hardening

Claude conversations can contain user-uploaded content. The HTML export
sanitizes every block before embedding it:

- **Script tags are stripped** entirely (`<script>`, `<iframe src>`,
  `javascript:` URLs, event handlers like `onclick`).
- **URL attributes** (`href`, `src`, etc.) are restricted to:
  - `#anchor` (internal references)
  - `data:` URIs on **resource** attributes only (`src`, `poster`,
    `xlink:href` — not clickable `href`)
  - Everything else is rewritten to `#`.
- **CSS `url()` references** are stripped of external fetches.
- **`@import` rules** are removed from inline `<style>`.

Result: opening a malicious exported file can't execute attacker-controlled
code, fetch external resources, or track you.

## Stability guarantees

- **Stable since:** v0.2.95 (January 2026).
- **Class names** (`.turn`, `.turn-human`, `.turn-assistant`, `.attachment`,
  `.artifact`, `.code`, `.branding`) are **frozen**. Third-party CSS overrides
  will continue to work across versions.
- **Data attributes** (`data-sender`, `data-timestamp`, `data-artifact-type`)
  are frozen.
- **Security sanitization** may tighten over time (we reserve the right to
  strip more aggressively), but will not loosen.

## Related

- [Markdown format](markdown-format.md)
- [ZIP bundle structure](zip-bundle-structure.md)

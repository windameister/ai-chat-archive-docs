# Format specs

Canonical specifications for what AI Chat Archive produces when it exports a
Claude.ai conversation. If you're writing an importer, a search indexer, an
Obsidian plugin, or anything else that ingests the output, these pages are the
contract.

The formats are versioned via the [changelog](/docs/changelog/) — any
breaking change ships there with a new version string.

## Per-format specs

- **[Markdown format](/spec/markdown-format/)** — what every `.md` export looks
  like, header by header. The portable, edit-friendly format.
- **[HTML format](/spec/html-format/)** — self-contained `.html` exports
  with embedded CSS, preserved artifacts and widgets. The visual-fidelity
  format.
- **[ZIP bundle structure](/spec/zip-bundle-structure/)** — the folder layout
  inside a batch-export ZIP (paid feature): one folder per conversation,
  attachments subfolder, `_INDEX.md` table of contents.

## Reference implementation

- **[Console snippets](/spec/console-snippet/)** — MIT-licensed JavaScript
  snippets you can paste into DevTools. The Markdown snippet is a working
  reference implementation of the spec above; the JSON snippet dumps the
  raw API response for custom post-processors.

## Stability

The format spec is **frozen at v0.2.0 and forward-compatible**. Future
additions append new fields or sections; existing fields keep their shape. If
that ever changes, the changelog will say so explicitly.

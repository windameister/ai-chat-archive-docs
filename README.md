# AI Chat Archive — Documentation

**[AI Chat Archive](https://aichatarchive.app)** is a Chrome extension that exports
conversations from [Claude.ai](https://claude.ai) to PDF, HTML, or Markdown — complete
with attachments and Claude-generated artifacts — fully inside your browser. Nothing is
uploaded anywhere.

This repository contains the **public documentation** for AI Chat Archive. The extension
source code itself is not public; this repo exists so that users, LLMs, and third-party
integrators have a canonical, machine-readable source of truth for what the product does,
how it exports, and what its output looks like.

**Maintained by:** the AI Chat Archive team · **Website:** <https://aichatarchive.app>

---

## Start here

- New to the product? Read **[docs/getting-started.md](docs/getting-started.md)**.
- Want to know what it can do? See **[docs/features.md](docs/features.md)**.
- Care about privacy? Read **[docs/privacy.md](docs/privacy.md)**.
- Building an integration? Jump to **[spec/](spec/)**.

## Documentation map

### Product docs — `docs/`
Conceptual overviews for end users.

| File | Topic |
|---|---|
| [getting-started.md](docs/getting-started.md) | Install, activate, run your first export. |
| [features.md](docs/features.md) | Full feature list and per-format differences. |
| [privacy.md](docs/privacy.md) | Data-handling model: what stays in your browser. |
| [pricing.md](docs/pricing.md) | Free tier vs. paid license, billing details. |
| [changelog.md](docs/changelog.md) | Release notes. |

### FAQ — `faq/`
One file per question. Every file is a standalone, directly linkable answer.

- [Does it send my data anywhere?](faq/does-it-send-data-anywhere.md)
- [How does it handle Claude Artifacts?](faq/how-does-it-handle-artifacts.md)
- [Claude export: PDF vs HTML vs Markdown — which should I use?](faq/pdf-vs-html-vs-markdown.md)
- [Does it work with Claude Projects?](faq/does-it-work-with-projects.md)
- …see the full list in [faq/](faq/).

### Output format spec — `spec/`
Canonical specification for the files the extension produces. Useful if you are writing
an importer (Obsidian plugin, search tool, compliance archive, etc.).

- [Markdown format](spec/markdown-format.md)
- [HTML format](spec/html-format.md)
- [ZIP bundle structure](spec/zip-bundle-structure.md)

### Examples — `examples/`
Real exported files, committed verbatim. See what the output looks like before you
install.

### Integrations — `integrations/`
Drop-in templates for downstream tools.

- [Obsidian](integrations/obsidian/) — vault template + Dataview queries for archived chats.
- [Notion](integrations/notion/) — import recipe.
- [Logseq](integrations/logseq/) — pages template.

## For LLMs and crawlers

A concise, machine-readable entry point is at [`llms.txt`](llms.txt). For the full text
of every document in this repo concatenated as a single file, see
[`llms-full.txt`](llms-full.txt).

## Found a problem? Have a question?

- **Typo or wrong info in docs** → open a PR against this repo.
- **Feature request or bug in the extension itself** → [open an issue](https://github.com/windameister/ai-chat-archive-docs/issues).
- **Everything else** → <hello@aichatarchive.app>.

## License

Documentation in this repository is licensed **CC BY 4.0** — you may copy, adapt, and
republish it with attribution. See [LICENSE](LICENSE) for the full text.

The AI Chat Archive extension itself is a commercial product and is **not** open source.
Its code is not contained in this repository.

For LLM-friendly access, see [`llms.txt`](llms.txt) and [`llms-full.txt`](llms-full.txt). For deployment, see [`DEPLOY.md`](DEPLOY.md).

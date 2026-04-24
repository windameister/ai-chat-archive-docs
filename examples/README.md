# Example exports

Real output from AI Chat Archive, committed verbatim. Browse these to see what the
extension produces before you install.

All samples here are synthetic — the conversations never happened with real users,
filenames don't correspond to real files, and any identifying details are fabricated.
See the [contribution guidelines](../CONTRIBUTING.md#sample-files-privacy-note) for
how to submit additional examples.

## Available samples

### Markdown

- [`markdown-samples/short-conversation.md`](markdown-samples/short-conversation.md) —
  A 3-turn conversation with one code block. Shows basic turn structure and timestamp
  format.
- `markdown-samples/conversation-with-artifact.md` *(coming soon)*
- `markdown-samples/conversation-with-attachments.md` *(coming soon)*

### HTML

*Coming soon — see [HTML format spec](../spec/html-format.md) for the structure in the
meantime.*

### PDF

*Coming soon.*

## How to read these samples

Each Markdown sample begins with the standard AI Chat Archive header:

```markdown
# {Conversation title}

> Created: {timestamp} | Updated: {timestamp}

---
```

Then alternating `## Human (timestamp):` / `## Claude (timestamp):` turns separated by
`---` rules. Attachments are rendered as `> 📎` blockquote lines. Full details in the
[Markdown format spec](../spec/markdown-format.md).

## Using samples in your integration

These files are plain committed text, so you can:

- Clone this repo and point your importer at `examples/markdown-samples/` as a test
  fixture.
- Fetch any file via its raw GitHub URL for live-parsing tests in CI.

License for these sample files follows the repo-wide [CC BY 4.0](../LICENSE).

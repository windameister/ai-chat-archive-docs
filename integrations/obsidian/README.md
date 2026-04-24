# Using AI Chat Archive exports in Obsidian

This guide shows how to take a Markdown export from AI Chat Archive and turn it into a
first-class note in your Obsidian vault — with metadata, backlinks, and a Dataview
query that lists every archived Claude conversation.

**Prerequisites:**

- Obsidian installed.
- AI Chat Archive installed and producing Markdown exports.
- A vault you're happy to modify (or create a new one first to experiment).
- Optional but recommended: [Dataview](https://github.com/blacksmithgu/obsidian-dataview)
  community plugin.

## 1. Drop exports into a dedicated folder

Create a folder in your vault — `_archive/claude/` is a good pick. Move every exported
`.md` file into it.

```
YourVault/
├── _archive/
│   └── claude/
│       ├── 2026-03-12 Designing a REST API.md
│       ├── 2026-03-14 Refactoring the auth layer.md
│       └── …
├── Daily/
├── Projects/
└── …
```

## 2. Add a frontmatter header to each export

AI Chat Archive's Markdown doesn't include YAML frontmatter (we keep the format
platform-neutral). Add it yourself so Obsidian can index, filter, and Dataview-query
the notes.

Open each export and prepend:

```yaml
---
source: claude.ai
type: conversation
created: 2026-03-12
updated: 2026-03-12
tags: [claude, archive]
---
```

**Or, automated:** set up Obsidian's [Templater](https://github.com/SilentVoid13/Templater)
plugin with this snippet that auto-adds frontmatter based on the `Created:` line
that AI Chat Archive writes:

```js
<%*
const content = await tp.file.content;
const createdMatch = content.match(/Created:\s*([^\s|]+)/);
const updatedMatch = content.match(/Updated:\s*([^\s|]+)/);
const fm = [
  '---',
  'source: claude.ai',
  'type: conversation',
  `created: ${createdMatch?.[1] ?? 'unknown'}`,
  `updated: ${updatedMatch?.[1] ?? 'unknown'}`,
  'tags: [claude, archive]',
  '---',
  ''
].join('\n');
tR += fm;
%>
```

## 3. A Dataview query that lists every Claude conversation

Create a note called `Claude archive.md` in your vault:

````markdown
# Claude conversation archive

```dataview
TABLE
  created AS "Created",
  updated AS "Updated",
  length(file.outlinks) AS "Outlinks"
FROM "_archive/claude"
WHERE source = "claude.ai"
SORT created DESC
```
````

You now have a live table of every archived Claude conversation, sorted by date.

## 4. Backlink from your daily notes

When you reference a past conversation in a daily note:

```markdown
## 2026-04-23 Daily

Worked on the v3 API spec again. See [[2026-03-12 Designing a REST API]] for
the earlier thread.
```

Obsidian creates a wiki-link. The archived conversation now appears in the note's
**Backlinks** pane, and over time your archive becomes a web of "past Claude thinking"
you can traverse from any direction.

## 5. Bundling attachments alongside

If you exported with **Include attachments in the ZIP** (paid feature), unzip each
conversation folder into your vault. Obsidian resolves relative links inside Markdown
files — so `> 📎 Attachment: design-brief.pdf` next to a physical
`attachments/design-brief.pdf` in the same folder gets the attachment rendered inline
in Obsidian's preview.

```
_archive/claude/
├── 2026-03-12_Designing-a-REST-API/
│   ├── Designing-a-REST-API.md         ← transcript
│   └── attachments/
│       └── design-brief.pdf            ← Obsidian renders this inline
└── …
```

## 6. Search across all Claude chats

With everything imported:

- **Search** (`Cmd/Ctrl-Shift-F`) across your full Claude history from one place.
- **Graph view** shows conversations connected to whatever else you've linked them to.
- **Tags** (`#claude`) filter the graph to show just the Claude subgraph.

You now have a fully local, permanently searchable Claude archive that grows as you
chat.

## Related

- [Markdown format spec](../../spec/markdown-format.md)
- [Features](../../docs/features.md)
- [PDF vs HTML vs Markdown](../../faq/pdf-vs-html-vs-markdown.md)

# Does AI Chat Archive work with Claude Projects?

**Short answer:** Yes, with full fidelity. Project conversations export exactly like
regular conversations, with an added note about which project they belong to and their
attached project files referenced.

Claude Projects are workspaces that bundle a conversation with project-level instructions,
uploaded knowledge files, and shared context. AI Chat Archive treats project
conversations as first-class citizens.

## What's exported from a Project conversation

- **All turns** (Human / Claude), as with any conversation.
- **The project name** — recorded in the conversation metadata.
- **Project knowledge files** — the files you attached to the Project (not to a
  specific message) are listed as `> 📎 File: {name}` references in the transcript.
- **Custom project instructions** — captured as a metadata block at the top of the
  transcript, before the first turn.
- **Any artifacts or uploaded message-attachments** — handled the same way as in a
  standalone conversation.

## What bulk export does with Projects

When you run **Bulk export** (paid tier), every conversation is exported — whether or
not it belongs to a Project. The ZIP's folder naming doesn't distinguish Project chats
from standalone chats; both live at the top level:

```
ai-chat-archive-2026-04-24.zip
├── 2026-03-12_Designing-a-REST-API/          ← standalone
├── 2026-03-14_Refactoring-the-auth-layer/    ← Project chat
└── …
```

The transcript itself names the Project in its metadata block, so you can still
group them in post-processing.

## Are Project files bundled?

Yes, when **Include attachments in the ZIP** is checked:

- **Message-level uploads** (files you dropped into a specific turn) → bundled into
  the per-conversation `attachments/` folder.
- **Project-level knowledge files** (files attached to the Project itself, shared
  across all its conversations) → bundled into a shared `_project-files/` folder at
  the ZIP root, referenced from each conversation that uses them.

The per-conversation transcript retains inline references (`> 📎 File: {name}`) so
you can trace from any chat back to the project files it used.

## What's *not* exported

- **The live Project workspace UI state** (sidebar position, pinned messages, etc.)
  — these are Claude.ai interface state, not conversation content.
- **Shared Projects' collaborator list** — for privacy reasons, we don't export who
  else has access to a shared Project.
- **Cross-conversation links** inside a Project — if Claude cited "see our earlier
  chat about X", the link points at claude.ai and won't resolve offline.

## Example: a Project chat in Markdown

```markdown
# API design review

> Created: 2026-04-20 10:15 | Updated: 2026-04-20 11:47
> Project: REST API refactor
> Project instructions: You are helping design a v3 REST API. Prefer REST conventions
> over GraphQL. Use explicit error codes.

---

## Human (2026-04-20 10:15):

> 📎 File: api-spec-v2.openapi.yaml
> 📎 File: auth-flow-diagram.png

Can you review the attached spec and suggest improvements for v3?

---

## Claude (2026-04-20 10:16):

Here are my notes on the v2 spec...
```

## Related

- [Markdown format spec](../spec/markdown-format.md)
- [ZIP bundle structure](../spec/zip-bundle-structure.md)
- [Features](../docs/features.md)

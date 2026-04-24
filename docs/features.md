# Features

AI Chat Archive is a Chrome extension that exports Claude.ai conversations. This page
is the full capability list, grouped by what it does and which tier unlocks what.

For a two-minute install → first export walkthrough, see
[getting-started.md](getting-started.md).

## Export formats

AI Chat Archive exports to **five** formats. The first three are the primary ones
promoted; JSON and TXT exist for power users who need structured or stripped-down
output.

| Format | Extension | Best for | Attachments bundled? |
|---|---|---|---|
| **PDF** | `.pdf` | Sharing, printing, archival | ❌ (browser-print limitation) |
| **HTML** | `.html` | Offline browsing, web archival | ✅ in ZIP mode (paid) |
| **Markdown** | `.md` | Obsidian, Notion, grep, notes | ✅ in ZIP mode (paid) |
| JSON | `.json` | Programmatic ingestion | ✅ in ZIP mode (paid) |
| Plain text | `.txt` | Compliance archives, search indexes | ✅ in ZIP mode (paid) |

See the [format specs](../spec/) for the exact structure each one produces.

## What gets captured

Every export includes, by default:

- **All human and assistant messages** in chronological order.
- **Message timestamps** (local, UTC, or ISO-8601 — your pick in advanced settings).
- **Code blocks** with their language tags preserved.
- **Claude-generated artifacts** — final version inline, earlier versions in an
  appendix.
- **Widgets** (Claude's `show_widget` output) — SVG widgets rendered inline; HTML
  widgets saved next to the transcript.
- **`present_files`** — files Claude generates during the conversation are listed
  inline and bundled into the ZIP.
- **Uploaded attachment references** — attachment names and sizes shown in the
  transcript. The binaries themselves are only bundled in paid ZIP mode.

Can be toggled in advanced settings:

- **Include Claude's thinking** (off by default) — exports hidden `thinking` blocks
  for Opus and Sonnet models that expose them.
- **Include tool calls** (off by default) — exports tool-use blocks that don't have
  a dedicated renderer (web search, code execution metadata, etc.).

Never captured:

- Your Claude account ID, workspace ID, or login session.
- Any conversation you didn't explicitly export.
- Analytics / telemetry — the extension produces none.

## Free tier

Available to every user, no license required:

- Export the **currently open** conversation.
- All 5 formats (PDF, HTML, Markdown, JSON, TXT).
- Advanced settings (timestamp format, thinking inclusion, tool-call inclusion).
- **PDF daily quota: 3 per day.** HTML / Markdown / JSON / TXT have no quota.
- A single attribution line in the exported file footer.

Free tier is enough for occasional backups and casual users.

## Paid tier (one license)

Activates with a license key from <https://aichatarchive.app>. Unlocks:

- **Bulk export** — every conversation on your Claude account in one ZIP.
- **Include attachments in the ZIP** — bundle uploaded files and
  Claude-generated `present_files` alongside their transcripts. See the
  [ZIP bundle structure](../spec/zip-bundle-structure.md).
- **Unlimited PDF exports** — no more 3/day cap.
- **No branding footer** in exported files.
- **Filter by date, title, or project** before bulk export (upcoming).

See [pricing.md](pricing.md) for tier prices.

## Privacy-first architecture

- Runs entirely in your browser. No AI Chat Archive server. No proxy.
- Declares only 3 `host_permissions`: `claude.ai`, `aichatarchive.app`, `api.polar.sh`.
- License activation sends **only the license key** to Polar (payment provider).
  Never sends conversation data.
- No analytics, no telemetry, no "phone home".

Full details in [privacy.md](privacy.md).

## Browser support

- **Chrome** (primary target).
- **Chromium-based browsers**: Edge, Brave, Arc, Opera, Vivaldi. All supported.
- **Firefox**: not supported.
- **Safari**: not supported.

## What it *doesn't* do (and won't)

Scope discipline keeps the product sharp. The following are explicitly out of scope:

- ❌ Editing, searching, or manipulating conversations inside Claude.ai (that's a
  different product category).
- ❌ Syncing exports to cloud storage. Your OS already does this better.
- ❌ Scheduled / automatic background exports without your click. This would require
  standing permissions we don't want.
- ❌ Exporting conversations from other platforms (ChatGPT, Gemini, Copilot).
  Maybe in separate products — not this one.

## Related

- [Pricing](pricing.md)
- [Privacy model](privacy.md)
- [Output format spec](../spec/)
- [Changelog](changelog.md)

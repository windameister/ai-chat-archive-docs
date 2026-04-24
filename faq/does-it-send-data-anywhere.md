# Does AI Chat Archive send my data anywhere?

**Short answer: No. Your conversation content never leaves your browser.**

AI Chat Archive is a client-side Chrome extension. When you click **Export**, the
extension reads your conversation directly from Claude.ai through the same authenticated
session your browser is already using, renders it into PDF / HTML / Markdown locally,
and writes the file to your Downloads folder. There is no "AI Chat Archive server" in
the middle.

## What the extension does with your data

| Step | Where it happens | What is sent where |
|---|---|---|
| Read conversation | Your browser → `claude.ai` | The same API call Claude.ai makes itself when you open a chat. No third parties involved. |
| Download attachments (paid, optional) | Your browser → `claude.ai`'s attachment CDN | Binary fetch of files you already uploaded. Goes to your machine only. |
| Render Markdown / HTML / PDF | Your browser, locally | Nothing is sent anywhere. |
| Save the output | Browser Downloads API | File is written to disk on your machine. |

## What the extension *does* talk to over the network

Two things, and only two:

1. **`claude.ai`** — to fetch the conversation and attachments being exported. This is
   the same origin you're already logged into; the extension reuses your existing
   cookies.
2. **`api.polar.sh`** — *only* when you activate or renew a paid license. The extension
   sends your license key to Polar (our payment provider) to verify it. It never sends
   your conversations.

No analytics, no telemetry, no crash reports, no "phone-home" pings. If you run the
extension with your browser's network tab open, you will see exactly these requests and
nothing else.

## How you can verify this yourself

- Open Chrome DevTools → Network tab before clicking Export.
- Watch every request. You will see calls to `claude.ai` (to read the chat) and
  nothing else.
- The extension's manifest declares `host_permissions` for `claude.ai` and `polar.sh`
  only. Chrome enforces these — the extension cannot reach any other host even if the
  code tried to.

## Why this matters

Most "export your AI conversations" tools route your data through a cloud service,
which means:

- They can read every conversation you export.
- Your conversations live on their logs and backups.
- A breach at that vendor exposes your chats.

AI Chat Archive exists specifically so this doesn't happen. The extension is designed
around one rule: **if the data would have to leave your machine, the feature doesn't
ship.** PDF rendering, Markdown generation, attachment bundling, ZIP packaging — all
implemented client-side so the data path stays local.

## Related

- [Privacy model overview](../docs/privacy.md)
- [How does it handle Claude Artifacts?](how-does-it-handle-artifacts.md)

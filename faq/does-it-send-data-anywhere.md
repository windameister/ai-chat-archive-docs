---
title: "Does Exporting Send My Data Anywhere? — AI Chat Archive Docs"
description: "Does AI Chat Archive send data anywhere? Exports run in your browser; only Claude or ChatGPT is read for content, and Polar gets your key for license checks."
---

# Does AI Chat Archive send my data anywhere?

**Short answer: chat content is processed in your browser and is not uploaded to our servers.** License checks send Polar only your key, never chat content.

AI Chat Archive is a client-side Chrome extension. When you click **Export**, the
extension reads your conversation directly from Claude.ai (or chatgpt.com) through the
same authenticated session your browser is already using, renders it into PDF / HTML /
Markdown locally, and writes the file to your Downloads folder. There is no
"AI Chat Archive server" in the middle.

## What the extension does with your data

| Step | Where it happens | What is sent where |
|---|---|---|
| Read conversation | Your browser → `claude.ai` / `chatgpt.com` | The same API call the site itself makes when you open a chat. No third parties involved. |
| Download attachments / embed images | Your browser → the provider's API/asset endpoints (ChatGPT: possibly signed storage/CDN URLs too) | Binary fetch of files and images in the conversation; happens in free image-embedded exports too. Goes to your machine only. |
| Render Markdown / HTML / PDF | Your browser, locally | Nothing is sent during this step. |
| Save the output | Browser print dialog / file download | File is written to disk on your machine. |

## What the extension *does* talk to over the network

Three categories of traffic:

1. **The chat providers' APIs — `claude.ai` and `chatgpt.com`.** The extension fetches
   the conversations being exported from the same origins you're already logged into,
   reusing your existing cookies: `claude.ai` for Claude chats and `chatgpt.com` when
   you export a ChatGPT conversation.
2. **Provider file and image downloads.** When an export includes attachments or
   embedded images — this includes free single-chat exports with images embedded in
   the HTML or PDF — the extension fetches the file and image bytes too. With Claude
   they come from Claude's own API/asset endpoints, using the same existing session as
   every other Claude request. ChatGPT works the same way against its own API and may
   additionally return temporary signed download URLs on storage/CDN infrastructure,
   which the extension fetches without credentials because the signature authorizes
   them. Either way the host is chosen by the provider and can vary per file; the bytes
   come to your machine, never to us.
3. **`api.polar.sh`** — *only* when you activate, renew, or periodically revalidate a
   paid license. The extension sends your license key to Polar (our payment provider)
   to verify it. It never sends your conversations.

No analytics, no telemetry, no crash reports, no "phone-home" pings, and no server
operated by AI Chat Archive appears anywhere in these flows.

## How you can verify this yourself

- Open Chrome DevTools → Network tab before clicking Export.
- Watch every request. You will see calls to `claude.ai` or `chatgpt.com` (to read the
  chat), attachment/image byte fetches from the provider's own API/asset endpoints —
  and, for ChatGPT, credential-free fetches of the signed URLs above — when the export
  includes attachments or images, and a request to `api.polar.sh` when a license is
  activated or revalidated.
- The extension's manifest declares `host_permissions` for `claude.ai`, `chatgpt.com`
  and `api.polar.sh` only. Those permissions grant privileged cross-origin access to
  just those three origins; they are not a complete list of reachable hosts and not a
  firewall — content scripts can still make ordinary requests the target site permits
  via CORS, which is how the file and image downloads above reach provider-chosen hosts,
  including ChatGPT's credential-free signed URLs. What the architecture rules
  out is a server of ours receiving your chats: there is no AI Chat Archive host in
  the data path at all.

## Why this matters

Most "export your AI conversations" tools route your data through a cloud service,
which means:

- They can read every conversation you export.
- Your conversations live on their logs and backups.
- A breach at that vendor exposes your chats.

AI Chat Archive exists specifically so this doesn't happen. The extension is designed
around one rule: **export processing happens in your browser, without uploading chat content to our servers.** License checks send Polar only your key, never chat content. PDF rendering, Markdown generation, attachment bundling, ZIP packaging — all
implemented client-side so the data path stays local.

## Related

- [Privacy model overview](../docs/privacy.md)
- [How does it handle Claude Artifacts?](how-does-it-handle-artifacts.md)

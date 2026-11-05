---
description: "AI Chat Archive privacy: chats are processed in your browser with no analytics or telemetry. Paid license checks contact Polar with your key, not your chats."
---

# Privacy model

AI Chat Archive is designed around one rule: **your conversation data is processed in your browser and never uploaded to our servers**. License checks send Polar only your key, never chat content.

This page is the technical overview. For the question "does it send my data anywhere?"
answered in plain English, see
[faq/does-it-send-data-anywhere.md](../faq/does-it-send-data-anywhere.md).

## Threat model

We assume a Claude.ai user who wants their conversation history backed up locally
without:

1. Trusting a third-party cloud service with the full content of their chats.
2. Giving a third party their Claude session cookie.
3. Running unreviewable server-side code on their data.

AI Chat Archive's architecture makes (1), (2), and (3) structurally impossible, not
just promised.

## Data flows

### While exporting

```
┌──────────────────────┐        ┌──────────────┐        ┌────────────────┐
│  AI Chat Archive     │  read  │  claude.ai   │        │  Your disk     │
│  (runs in your tab)  │◀──────▶│  API         │        │  (Downloads/)  │
│                      │                                │                │
│  Renders PDF / HTML  │─────────── write to ──────────▶│                │
│  / Markdown locally  │                                │                │
└──────────────────────┘                                └────────────────┘
```

There is no fourth box. No AI Chat Archive server, no proxy, no analytics pipeline.

### While activating a paid license

```
┌──────────────────────┐   license key   ┌──────────────┐
│  AI Chat Archive     │────────────────▶│  polar.sh    │
│  (popup UI)          │◀────────────────│  (billing)   │
│                      │  valid / invalid │              │
└──────────────────────┘                  └──────────────┘
```

Only the license key travels, only to Polar, only during activation and periodic
revalidation. Your conversations are never part of this traffic.

## What the extension is permitted to do

Chrome enforces the permissions declared in `manifest.json`. AI Chat Archive declares:

| Permission | Why it's needed |
|---|---|
| `host_permissions: ["https://claude.ai/*"]` | Read Claude conversations and attachments via the same API Claude.ai's own web app uses. |
| `host_permissions: ["https://chatgpt.com/*"]` | Read ChatGPT conversations the same way when you export from ChatGPT. |
| `host_permissions: ["https://api.polar.sh/*"]` | Validate paid license keys and periodically revalidate them. |
| `storage` | Keep settings and license state (`chrome.storage.sync`) plus temporary local export data (`chrome.storage.local`). |
| `unlimitedStorage` | Hold large PDF hand-off payloads (base64 images included) in local storage while an export renders. |

The extension cannot reach any host not on this list. If the extension tried to POST
your conversation to a third-party server, the browser would block the request — the
manifest is the ceiling of what it can do. Files reach your Downloads folder through
the normal browser print dialog and download flow, which need no special permission.

## Storage on your device

Two different browser storage areas are used, and the distinction matters:

**`chrome.storage.sync` — settings and license state**

- Your settings: format and theme preferences, timestamp style, and similar options.
- Your license key and its last validation result, if you have activated a key.

If you are signed into Chrome, Google synchronizes this data across devices via your
Google account; we never have access to it. (In the Safari App Store build, the Apple
in-app-purchase entitlement is kept in local storage instead, because it is tied to
that Mac.)

**`chrome.storage.local` — temporary export data**

- **PDF hand-off payloads.** For a PDF export, the full conversation (including images
  embedded as base64) is passed from the chat tab to the extension's print page
  through a local storage key. The print page deletes that key as soon as the PDF is
  rendered or the page closes; payloads left behind by a closed tab are swept
  automatically after a period of inactivity.
- **Export-resume checkpoints.** Long batch and project exports record progress so an
  interrupted run can resume instead of starting over. The checkpoint is cleared when
  the export finishes and is pruned if it sits unused for two weeks.

These local copies never leave your device. The privacy guarantee is about *network
upload*, not about storage: conversation content temporarily lives in the browser's
own storage while an export is built, and is never uploaded to our servers. We do not
store your conversations anywhere outside your browser.

## How to verify

- Open Chrome DevTools → **Network** tab before clicking Export.
- Every request is visible. You will see only `claude.ai` or `chatgpt.com` traffic
  during a conversation export, and a round-trip to `api.polar.sh` when a license is
  activated or revalidated (the result is cached for a week, so this is not per
  export).
- Open the extension's `manifest.json` (via `chrome://extensions` → **Details** →
  **Inspect views: service worker** → the Sources tab). The declared permissions are
  authoritative.

## What this means in practice

- If Claude.ai is down, export is down. There is no cached copy of your data
  anywhere outside your browser.
- Uninstalling the extension does not remove files you already exported; those remain in your downloads folder. Chat content is not uploaded to our servers, and license checks send Polar only your key, never chat content.
- If AI Chat Archive, Inc. ceases operations tomorrow, your already-exported files
  keep working forever. They are plain PDF / HTML / Markdown on your disk with no
  DRM and no phone-home.

## Related

- [FAQ: does it send my data anywhere?](../faq/does-it-send-data-anywhere.md)
- [Pricing](pricing.md)

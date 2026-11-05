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

There is no AI Chat Archive server, proxy, or analytics pipeline in this diagram.
Exports that include attachments or images — including free single-chat exports with
images embedded in the HTML or PDF — also fetch the file and image bytes. Claude serves
those bytes from its own API/asset endpoints using your existing session; ChatGPT may
additionally return temporary signed download URLs on storage/CDN hosts, which the
extension fetches without credentials (see below).

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

The declared `host_permissions` name the three origins the extension is granted
*privileged* cross-origin access to: the two chat APIs and Polar. They are not a list
of every host the extension can contact, and they are not a firewall: a content script
can make the same ordinary cross-origin requests a web page can when the target allows
CORS. The extension relies on this for exports that include attachments or embedded images —
free inlined images included — which fetch their bytes from the providers' own
API/asset endpoints using the existing session. ChatGPT's flow may also hand back
temporary signed download URLs on storage/CDN hosts it chooses; those are fetched
without credentials, because the signature already authorizes them, and the host can
vary per file. What the architecture does rule out is any AI Chat Archive server in the data
path: there is no host of ours that could receive your conversations, and no
permission is requested that points at one. Files reach your Downloads folder through
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
  through a local storage key. The print page removes that key as soon as it has
  received the payload, before rendering. Closing the print page instead asks the
  source tab to cancel; it does not delete the key. A payload abandoned mid-export
  (for example, by a closed tab) becomes eligible for cleanup after 15 minutes without
  activity and is swept the next time a PDF export starts.
- **Export-resume checkpoints.** Long batch and project exports record progress so an
  interrupted run can resume instead of starting over. The checkpoint is cleared when
  the export finishes. A checkpoint older than two weeks is removed the next time that
  export scope is checked for resumable progress; there is no background timer, so an
  export you never open again can leave its checkpoint beyond two weeks.

These local copies never leave your device. The privacy guarantee is about *network
upload*, not about storage: conversation content temporarily lives in the browser's
own storage while an export is built, and is never uploaded to our servers. We do not
store your conversations anywhere outside your browser.

## How to verify

- Open Chrome DevTools → **Network** tab before clicking Export.
- Every request is visible. During an export you will see calls to `claude.ai` or
  `chatgpt.com`, plus attachment/image byte fetches from the provider's own API/asset
  endpoints — and, for ChatGPT, credential-free fetches of the signed URLs described
  above — when the export includes those; a round-trip to `api.polar.sh` happens only
  when a license is activated or revalidated (the result is cached for a week, so
  this is not per export).
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

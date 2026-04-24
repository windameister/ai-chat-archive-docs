# Privacy model

AI Chat Archive is designed around one rule: **your conversation data never leaves
your browser**.

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
| `host_permissions: ["https://claude.ai/*"]` | Read conversations and attachments via the same API Claude.ai's own web app uses. |
| `host_permissions: ["https://api.polar.sh/*"]` | Validate paid license keys. |
| `downloads` | Write exported files into the Downloads folder. |
| `storage` | Remember user settings (format preference, timestamp style, license key). |

The extension cannot reach any host not on this list. If the extension tried to POST
your conversation to a third-party server, Chrome would block the request — the
manifest is the ceiling of what it can do.

## Local storage

The extension stores only the following in Chrome's `chrome.storage.local`:

- Your format preferences (PDF / HTML / Markdown).
- Your timestamp style.
- Your license key, if activated.
- Daily PDF export counter (free tier: 3 PDFs/day).

Never stored: conversation content, attachment bytes, or any identifier tied to your
Claude account.

## How to verify

- Open Chrome DevTools → **Network** tab before clicking Export.
- Every request is visible. You will see only `claude.ai` traffic during a conversation
  export, and — if applicable — a single round-trip to `api.polar.sh` during license
  activation.
- Open the extension's `manifest.json` (via `chrome://extensions` → **Details** →
  **Inspect views: service worker** → the Sources tab). The declared permissions are
  authoritative.

## What this means in practice

- If Claude.ai is down, export is down. There is no cached copy of your data
  anywhere outside your browser.
- If you uninstall the extension, every byte it ever handled is gone — because
  nothing was ever persisted.
- If AI Chat Archive, Inc. ceases operations tomorrow, your already-exported files
  keep working forever. They are plain PDF / HTML / Markdown on your disk with no
  DRM and no phone-home.

## Related

- [FAQ: does it send my data anywhere?](../faq/does-it-send-data-anywhere.md)
- [Pricing](pricing.md)

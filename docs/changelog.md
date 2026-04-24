# Changelog

Release notes for AI Chat Archive. For a live feed of fixes between releases, see
the [extension's Chrome Web Store listing](https://chromewebstore.google.com/detail/ai-chat-archive/).

Versions follow Chrome's required numeric format (no semver suffixes).

## v0.2.119 — April 2026

- PDF quota-exceeded message wraps cleanly into two lines (fixes a layout shift).
- Dev tooling + store-review assets moved out of the shipped bundle.

## v0.2.118 — April 2026

- Quieted the PDF-format hints; removed the `DEV-` license backdoor used only in
  development.

## v0.2.117 — April 2026

- Surfaced PDF format limitations inline (attachments can't bundle into a printed PDF,
  the thinking toggle does nothing in PDF) instead of letting users hit them.

## v0.2.116 — April 2026

- **"Include attachments" auto-enables on first license activation.** Past users who
  activate a license now get the ZIP-with-attachments experience by default,
  without hunting through advanced settings.

## v0.2.115 — April 2026 — Polar license validation

- **New:** full online license validation against Polar.
- Licenses are re-checked at install time and every 24 hours.
- 7-day offline grace window: if validation can't reach Polar (offline, rate limit),
  the license keeps working.
- Revoked licenses return the extension to free-tier behavior on next check.

## v0.2.114 — March 2026

- Fixed: popup version string now pulled from `manifest.json`, no more drift between
  the shipped version and what the popup displays.

## v0.2.113 — March 2026

- Fixed: **"Include tool calls & artifacts"** toggle now actually hides tool-call
  blocks from the exported transcript when disabled.

## v0.2.112 — March 2026

- PDF daily quota surfaces on the Export button when depleted, with inline Upgrade
  link.
- Consolidated paid UI into a single card. Floating Export button on claude.ai can
  now be hidden via settings.

## v0.2.110 — March 2026

- **New:** PDF daily quota (3/day) for free tier.
- Batch export and over-quota PDF routes go to the checkout link.

## v0.2.108 — March 2026

- PDF typography overhaul — headings, spacing, and code blocks now match Claude's
  own UI conventions.

## v0.2.105 — February 2026

- Fixed: PDF logo renders reliably across viewers.
- Icon bundles transparent corners for clean display on colored backgrounds.
- Added print-header tip for users on Chromium variants that strip `@page`.

## v0.2.102 — February 2026 — Designed branding

- New custom icon.
- Zoho-style branding footer on free-tier exports.
- Tighter print spacing.

## v0.2.100 — February 2026

- Fixed: PDF export now opens reliably and produces readable output across
  Chromium variants.

## v0.2.95 — January 2026 — HTML + PDF launch

- **New:** HTML export (free tier).
- **New:** PDF export via the browser print pipeline (free tier).
- Batch export gated behind paid tier.

## v0.2.90 — December 2025

- Branding footer on free-tier exports; paid license removes it.

## v0.2.85 — November 2025

- Fixed: `present_files` bundle correctly when they only appear in tool-use blocks.

## Format stability pledge

Once a format is shipped, its structure is frozen in place unless the version
signals a major change. Specifically:

- Markdown headers (`# title`, `## Human (…):`, `## Claude (…):`) will not rename.
- Attachment prefixes (`> 📎 Attachment:`, `> 📎 File:`) will not change.
- ZIP layout (`{date}_{safe-title}/attachments/`) is frozen.

Third-party importers can rely on these invariants. See the
[format specs](../spec/) for details.

## Older versions

Pre-0.2.85 releases were internal or private-alpha and are not documented here.

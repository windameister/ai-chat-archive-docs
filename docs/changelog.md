# Changelog

Release notes for AI Chat Archive. For a live feed of fixes between releases, see
the [extension's Chrome Web Store listing](https://chromewebstore.google.com/detail/ai-chat-archive/jeocjmohgejjmlfdhdeddjceehpahblj).

Versions follow Chrome's required numeric format (no semver suffixes).

## v0.2.141 — May 2026 — Claude-style theme is the default

- HTML and PDF exports now default to a warmer cream-and-serif theme
  that mirrors reading a chat on claude.ai. The cleaner archival look
  is still available as **Document** theme in popup → Advanced →
  Export theme.
- Existing users who explicitly chose Document on a dev build keep
  their preference; everyone else picks up the new default on the
  first export after updating.

## v0.2.139 — May 2026 — Claude-style PDF goes full-bleed

- The cream now reaches the paper edges instead of leaving a 14 mm
  white frame around the content. PDF print path moved from
  `@page margin` to `body padding` so the page itself is full-bleed
  while the content keeps its breathing room.
- Document theme PDFs unchanged — the historical 14 mm `@page` margin
  is preserved so headers/footers Chrome draws there have somewhere
  to live.
- For the cream to actually print: tick **Background graphics** in
  Chrome's print dialog. The in-page tip banner calls this out
  prominently and Chrome remembers the toggle next time.

## v0.2.135 — May 2026 — Claude-style export theme (opt-in)

- New optional theme that uses Iowan Old Style / Charter for Latin
  body text, Songti SC / Hiragino Mincho for CJK, and a warm
  `#f9f5ee` page background. Reads like a printed page from the
  Claude web app.
- popup → Advanced → Export theme — pick **Claude-style** or
  **Document**; the default is Document until the v0.2.141
  switch above.
- Phase 2 typography lift in the same release: PingFang SC /
  Hiragino Sans GB / Heiti SC added to the default font fallback
  stack so Japanese and older macOS Chinese render in the right
  visual register.

## v0.2.133 — April 2026 — Markdown rendering polish

- GFM tables (`| col | col |` style) now render as proper `<table>`
  elements with header / body, alignment, and inline-md inside cells.
  Used to leak as raw pipe-and-dash text in HTML/PDF exports.
- v0.2.134 follow-up: ATX headings (`#` through `######`), horizontal
  rules (`---`, `***`, `___`), blockquotes (`> …`), and inline
  links (`[label](url)`) all render in HTML/PDF exports. Markdown
  exports were already fine — this closes the gap between the two.
- v0.2.127: colored diagram nodes from Claude's `visualize` widgets
  (`c-blue`, `c-amber`, `c-green`, etc.) now keep their colors in
  the exported SVG. They used to collapse to all-black flowcharts.

## v0.2.128 — April 2026 — Welcome page on first install

- Fresh installs open the [aichatarchive.app/welcome](https://aichatarchive.app/welcome)
  walkthrough in a new tab so users find the floating Export button
  without hunting through Chrome's puzzle-piece menu.
- v0.2.129: welcome URL is locale-aware — Japanese-Chrome users land
  on `/ja/welcome`, Korean on `/ko/welcome`, etc. — across the 10
  shipping locales.
- v0.2.130: skipped on enterprise-policy and sideloaded installs so
  IT-managed deployments don't surprise employees with an external
  tab.

## v0.2.126 — April 2026 — Pick which messages to export

- New **Choose messages…** entry on the floating Export menu opens a
  side panel with a checkbox per turn. Pick exactly which messages
  go into the export — useful when only the last reply is worth
  keeping.
- Two presets: **All** (default) and **Last turn** (last user
  question + last Claude answer).
- Works for every export format including PDF; the print page picks
  up the selection via URL params.

## v0.2.125 — April 2026 — Floating button → format menu

- The on-page Export button used to export in a single fixed default
  format. It now opens a small menu so you can pick Markdown / HTML /
  PDF / JSON / Plain text per export, without having to open the
  toolbar popup to change format. Keyboard navigation supported.

## v0.2.124 — April 2026 — Localized CWS listing

- Chrome Web Store listing title and short description now ship in 9
  locales: **en, zh-CN, zh-TW, ja, ko, es, it, de, pt-BR**. Catches
  native-language Web Store search across the 80% of CWS install
  funnels we couldn't reach before.
- v0.2.132 added French (fr) — 10 locales total.

## v0.2.123 — April 2026 — Free unlimited PDF

- Daily 3-PDF cap removed. PDF generation runs entirely on your
  machine via the browser's print pipeline — there's no server cost
  to cap.
- The paid tier's three remaining benefits stand: bulk export of
  every conversation as a ZIP, attachment bundling (real file bytes
  alongside the transcript), and no branding footer on exported
  files.

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

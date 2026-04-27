// Build the docs site: walk the repo, render every .md to .html with a clean
// theme, and copy the raw .md alongside so LLM crawlers can still fetch the
// canonical markdown. Output goes to _build/.

import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname, extname, basename } from 'node:path';
import { marked } from 'marked';

const SRC = '.';
const OUT = '_build';

const BASE_URL = 'https://docs.aichatarchive.app';
const SITE_NAME = 'AI Chat Archive Documentation';

// Note on Web Analytics: this site is served through Cloudflare, and the
// `aichatarchive.app` zone has CF Web Analytics auto-inject enabled at the
// edge. The beacon is added to HTML responses by Cloudflare, not by this
// build, so there is intentionally no analytics injection in `wrap()`.
// If we ever switch off auto-inject (e.g. to use Plausible/Umami), inject
// the snippet inside `wrap()` next to <link rel="canonical">.

const SKIP_DIRS = new Set([
  '.git', 'node_modules', '_build', '.wrangler',
]);

const SKIP_FILES = new Set([
  // Tooling / repo metadata that shouldn't be served
  'package.json', 'package-lock.json', 'build.js', 'bun.lock',
  '_config.yml', '.gitignore', '.assetsignore',
  // GitHub-only files (not for the published site)
  'CONTRIBUTING.md', 'DEPLOY.md', 'LICENSE', 'CNAME',
  // index.md is rendered specially as the homepage
  'index.md',
]);

// Paths (not just basenames) to skip. The repo-root README.md exists for
// GitHub's repo overview but is redundant with index.md on the deployed site.
// Nested README.md files (e.g. integrations/obsidian/README.md) are kept and
// become their containing directory's index page.
const SKIP_PATHS = new Set([
  'README.md',
]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (!SKIP_FILES.has(entry.name) && !SKIP_PATHS.has(relative(SRC, path))) {
      yield path;
    }
  }
}

const wrap = (title, body, currentPath, schema) => {
  // Build a "..back to home" crumb only when not at root
  const crumb = currentPath === '/' ? '' :
    `<nav class="crumbs"><a href="/">← AI Chat Archive Docs</a></nav>`;

  // schema.org JSON-LD block — improves how the page appears in Google's
  // search results (rich snippets for FAQ, article markup for docs).
  const schemaBlock = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — AI Chat Archive Docs</title>
  <meta name="description" content="Documentation for AI Chat Archive — a Chrome extension that exports Claude.ai conversations to PDF, HTML, or Markdown.">
  <link rel="canonical" href="${BASE_URL}${currentPath}">
  ${schemaBlock}
  <style>
    :root {
      --brand: #c96442;
      --brand-hover: #b85636;
      --bg: #faf6f0;
      --bg-soft: #f5f1eb;
      --text: #1f1a17;
      --muted: #6a5a4c;
      --border: #ecdfcd;
    }
    * { box-sizing: border-box; }
    body {
      font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", system-ui, sans-serif;
      color: var(--text);
      background: var(--bg);
      max-width: 760px;
      margin: 0 auto;
      padding: 32px 20px 80px;
    }
    nav.crumbs {
      font-size: 14px;
      color: var(--muted);
      margin-bottom: 24px;
    }
    nav.crumbs a {
      color: var(--brand);
      text-decoration: none;
    }
    nav.crumbs a:hover { text-decoration: underline; }
    h1 { font-size: 32px; line-height: 1.2; margin: 12px 0 24px; letter-spacing: -0.01em; }
    h2 { font-size: 22px; line-height: 1.25; margin: 36px 0 12px; padding-top: 8px; }
    h3 { font-size: 18px; line-height: 1.3; margin: 28px 0 8px; }
    p, ul, ol, table, pre, blockquote { margin: 0 0 16px; }
    a { color: var(--brand); }
    a:hover { color: var(--brand-hover); }
    ul, ol { padding-left: 28px; }
    li { margin: 4px 0; }
    code {
      background: var(--bg-soft);
      border: 1px solid var(--border);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    pre {
      background: var(--bg-soft);
      border: 1px solid var(--border);
      padding: 14px 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 14px;
    }
    pre code { background: none; border: none; padding: 0; font-size: inherit; }
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 14px;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 8px 12px;
      text-align: left;
      vertical-align: top;
    }
    th { background: var(--bg-soft); font-weight: 600; }
    blockquote {
      border-left: 3px solid var(--brand);
      margin: 0 0 16px;
      padding: 4px 0 4px 16px;
      color: var(--muted);
      font-style: normal;
    }
    hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
    img { max-width: 100%; height: auto; }
    footer {
      margin-top: 80px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      color: var(--muted);
      font-size: 13px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    footer a { color: var(--brand); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    footer .raw {
      margin-left: auto;
      color: var(--muted);
    }
  </style>
</head>
<body>
  ${crumb}
  ${body}
  <footer>
    <a href="https://aichatarchive.app">aichatarchive.app</a>
    <span>·</span>
    <a href="https://github.com/windameister/ai-chat-archive-docs">GitHub</a>
    <span>·</span>
    <span>Licensed CC BY 4.0</span>
    <span class="raw"><a href="${currentPath === '/' ? '/index.md' : currentPath.replace(/\/$/, '.md').replace(/^\//, '/')}">view as raw markdown</a></span>
  </footer>
</body>
</html>`;
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])
  );
}

// Rewrite relative .md links to clean URLs (drop .md, keep relative path).
function rewriteLinks(md, fromPath) {
  return md.replace(/\]\(([^)\s#]+?)(\#[^)]*)?\)/g, (m, url, frag = '') => {
    if (/^https?:|^mailto:|^#/.test(url)) return m;
    if (!url.endsWith('.md')) return m;
    const clean = url.replace(/\.md$/, '/');
    return `](${clean}${frag})`;
  });
}

// Compute the URL path a source file maps to in the built site.
// Examples:
//   index.md                              -> /
//   docs/privacy.md                       -> /docs/privacy/
//   spec/zip-bundle-structure.md          -> /spec/zip-bundle-structure/
//   integrations/obsidian/README.md       -> /integrations/obsidian/
//   examples/README.md                    -> /examples/
function urlPathFor(srcPath) {
  if (srcPath === 'index.md') return '/';
  if (basename(srcPath) === 'README.md') {
    const dir = dirname(srcPath);
    return dir === '.' ? '/' : '/' + dir + '/';
  }
  return '/' + srcPath.replace(/\.md$/, '/');
}

// Extract a "short answer" — the first paragraph after the H1 — from an FAQ
// markdown file, with markdown formatting flattened to plain prose. Used as
// the `acceptedAnswer.text` in the QAPage JSON-LD.
function extractShortAnswer(md) {
  const lines = md.split('\n');
  let foundH1 = false;
  const para = [];
  for (const line of lines) {
    if (!foundH1) {
      if (/^#\s+/.test(line)) foundH1 = true;
      continue;
    }
    if (line.trim() === '' && para.length === 0) continue;
    if (line.trim() === '') break;
    para.push(line);
  }
  return para.join(' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build the schema.org JSON-LD object for a given page. Returns null for
// pages we don't want to mark up (e.g. examples). Conventions:
//   /                  -> WebSite + publisher Organization
//   /faq/*             -> QAPage with mainEntity Question + acceptedAnswer
//   /docs/* or /spec/* -> TechArticle
function buildSchema(srcPath, title, md, urlPath) {
  const fullUrl = BASE_URL + urlPath;
  const publisher = {
    "@type": "Organization",
    name: "AI Chat Archive",
    url: "https://aichatarchive.app",
  };

  if (urlPath === '/') {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
      publisher,
    };
  }

  if (urlPath.startsWith('/faq/')) {
    const answer = extractShortAnswer(md);
    return {
      "@context": "https://schema.org",
      "@type": "QAPage",
      url: fullUrl,
      mainEntity: {
        "@type": "Question",
        name: title,
        text: title,
        answerCount: 1,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
          url: fullUrl,
        },
      },
    };
  }

  if (urlPath.startsWith('/docs/') || urlPath.startsWith('/spec/')) {
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: title,
      url: fullUrl,
      publisher,
    };
  }

  // Other paths (examples/, integrations/) — no schema for now.
  return null;
}

// Strip Jekyll-style YAML front matter (`---\n...\n---\n`) from the head of
// a markdown file. Future-proofs the build against any source file that
// carries SEO/meta metadata at the top.
function stripFrontMatter(md) {
  if (!md.startsWith('---\n')) return md;
  const end = md.indexOf('\n---\n', 4);
  if (end === -1) return md;
  return md.slice(end + 5).replace(/^\n+/, '');
}

async function buildOne(srcPath) {
  const fileRaw = await readFile(srcPath, 'utf8');
  const raw = stripFrontMatter(fileRaw);
  const isIndex = srcPath === 'index.md';
  const title = (raw.match(/^#\s+(.+)$/m) || [])[1] || basename(srcPath, '.md');
  const adjusted = rewriteLinks(raw, srcPath);
  const bodyHtml = marked.parse(adjusted, { gfm: true, breaks: false });
  const urlPath = urlPathFor(srcPath);
  const schema = buildSchema(srcPath, title, raw, urlPath);
  const html = wrap(title, bodyHtml, urlPath, schema);

  // Write raw markdown alongside HTML so LLMs can still fetch canonical .md
  const rawOut = join(OUT, srcPath);
  await mkdir(dirname(rawOut), { recursive: true });
  await writeFile(rawOut, raw);

  // Write HTML at the clean URL.
  //   index.md             -> _build/index.html
  //   foo/README.md        -> _build/foo/index.html  (directory index)
  //   foo/bar.md           -> _build/foo/bar/index.html
  if (isIndex) {
    await writeFile(join(OUT, 'index.html'), html);
  } else if (basename(srcPath) === 'README.md') {
    const targetDir = join(OUT, dirname(srcPath));
    await mkdir(targetDir, { recursive: true });
    await writeFile(join(targetDir, 'index.html'), html);
  } else {
    const dir = join(OUT, srcPath.replace(/\.md$/, ''));
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), html);
  }
}

// Write a sitemap.xml listing every URL the site exposes. Helps Google
// Search Console + Bing Webmaster Tools index everything quickly.
async function writeSitemap(srcPaths) {
  const today = new Date().toISOString().slice(0, 10);
  const baseUrl = 'https://docs.aichatarchive.app';
  const urls = srcPaths
    .filter(p => p.endsWith('.md'))
    .map(p => urlPathFor(p))
    .filter((p, i, arr) => arr.indexOf(p) === i)  // dedupe
    .sort();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => `  <url><loc>${baseUrl}${u}</loc><lastmod>${today}</lastmod></url>`),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(join(OUT, 'sitemap.xml'), xml);
}

async function copyAsIs(srcPath) {
  const dst = join(OUT, srcPath);
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(srcPath, dst);
}

async function build() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

  const builtPaths = [];

  // Render every .md (except SKIP_FILES) to HTML + keep raw .md
  for await (const path of walk(SRC)) {
    const rel = relative(SRC, path);
    if (extname(rel) === '.md') {
      await buildOne(rel);
      builtPaths.push(rel);
    } else {
      await copyAsIs(rel);
    }
  }

  // index.md is special: served at root
  if (existsSync('index.md')) {
    await buildOne('index.md');
    builtPaths.push('index.md');
  }

  await writeSitemap(builtPaths);

  console.log(`✓ Built site to ${OUT}/ (${builtPaths.length} pages)`);
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});

// Offline validation of the exact assets Cloudflare will serve. No network or deps.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { marked } from 'marked';

const ROOT = resolve('_build');
const ORIGIN = 'https://docs.aichatarchive.app';
const errors = [];
const files = new Map();
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.set('/' + relative(ROOT, path).split(sep).join('/'), path);
  }
}
await walk(ROOT);
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m => [m[1].toLowerCase(), decode(m[2] ?? m[3])]));
const pages = new Map();
for (const [path, file] of files) {
  if (!path.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  const canonicalPath = path.endsWith('/index.html') ? path.slice(0, -10) : path;
  const tags = [...html.matchAll(/<[a-z][^>]*>/gi)].map(m => attrs(m[0]));
  const canonicals = tags.filter(a => a.rel?.split(/\s+/).includes('canonical'));
  if (canonicals.length !== 1 || canonicals[0].href !== ORIGIN + canonicalPath) {
    errors.push(`${path}: canonical must be exactly ${ORIGIN}${canonicalPath}`);
  }
  pages.set(canonicalPath, { html, tags, ids: new Set(tags.flatMap(a => [a.id, a.name].filter(Boolean))), noindex: tags.some(a => a.name === 'robots' && /\bnoindex\b/.test(a.content)) });
}

let linkCount = 0;
function checkLink(href, context) {
  if (!href || /^(mailto:|tel:|data:|javascript:)/i.test(href)) return;
  let url;
  try { url = new URL(href, ORIGIN + context); }
  catch { errors.push(`${context}: invalid URL ${href}`); return; }
  if (url.origin !== ORIGIN) return;
  linkCount++;
  let path;
  try { path = decodeURIComponent(url.pathname); }
  catch { errors.push(`${context}: invalid encoded path ${href}`); return; }
  const page = pages.get(path);
  if (page) {
    if (url.hash && !page.ids.has(decodeURIComponent(url.hash.slice(1)))) errors.push(`${context}: missing anchor ${href}`);
  } else if (files.has(path) && !path.endsWith('.html')) {
    // Raw Markdown and other assets are valid links, without HTML canonicals.
  } else {
    errors.push(`${context}: missing page or noncanonical path ${href}`);
  }
}
for (const [path, page] of pages) {
  for (const tag of page.tags) {
    if (tag.href) checkLink(tag.href, path);
    if (tag.src) checkLink(tag.src, path);
  }
}
for (const name of ['llms.txt', 'llms-full.txt']) {
  const html = marked.parse(await readFile(join(ROOT, name), 'utf8'));
  for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
    const a = attrs(tag[0]);
    if (a.href) checkLink(a.href, '/' + name);
    if (a.src) checkLink(a.src, '/' + name);
  }
}
const sitemap = await readFile(join(ROOT, 'sitemap.xml'), 'utf8');
const listed = new Set();
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const loc = decode(match[1]);
  const url = new URL(loc);
  const page = pages.get(url.pathname);
  if (url.origin !== ORIGIN || loc !== ORIGIN + url.pathname || !page) errors.push(`sitemap: not a canonical built page: ${loc}`);
  if (page?.noindex) errors.push(`sitemap: noindex page included: ${loc}`);
  if (listed.has(url.pathname)) errors.push(`sitemap: duplicate ${loc}`);
  listed.add(url.pathname);
}
for (const [path, page] of pages) {
  if (!page.noindex && !listed.has(path)) errors.push(`sitemap: missing indexed page ${path}`);
}
const redirects = new Map();
for (const line of (await readFile(join(ROOT, '_redirects'), 'utf8')).split('\n')) {
  if (!line.trim() || line.trim().startsWith('#')) continue;
  const [from, to, status] = line.trim().split(/\s+/);
  if (redirects.has(from)) errors.push(`redirect: duplicate source ${from}`);
  if (status !== '301') errors.push(`redirect: expected 301 for ${from}`);
  redirects.set(from, to);
}
for (const [from, to] of redirects) {
  if (!pages.has(to)) errors.push(`redirect: target is not a canonical built page: ${from} -> ${to}`);
  if (redirects.has(to)) errors.push(`redirect: chain or loop: ${from} -> ${to}`);
  if (pages.has(from)) errors.push(`redirect: shadows a canonical page: ${from}`);
}
for (const path of pages.keys()) {
  for (const alias of [path + 'index.html', ...(path === '/' ? [] : [path.slice(0, -1)])]) {
    if (redirects.get(alias) !== path) errors.push(`redirect: missing ${alias} -> ${path}`);
  }
}
// Keep the FAQ directory useful and prevent index-page Question markup.
const faq = pages.get('/faq/');
if (!faq) errors.push('FAQ index missing');
else {
  if (/"@type":"FAQPage"/.test(faq.html)) errors.push('FAQ index must not emit single-answer FAQPage markup');
  for (const path of pages.keys()) {
    if (path.startsWith('/faq/') && path !== '/faq/' && !faq.tags.some(a => a.href === path)) errors.push(`FAQ index: missing ${path}`);
  }
}
for (const [path, page] of pages) {
  if (path.startsWith('/examples/') && path !== '/examples/' && !page.noindex) errors.push(`sample page must be noindex: ${path}`);
}
if (errors.length) {
  console.error(errors.map(e => `✗ ${e}`).join('\n'));
  process.exitCode = 1;
} else console.log(`✓ Link check passed: ${pages.size} HTML pages, ${linkCount} internal links, ${listed.size} sitemap URLs, ${redirects.size} direct 301 redirects`);

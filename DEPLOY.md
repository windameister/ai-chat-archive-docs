# Deployment guide — `docs.aichatarchive.app`

This is the one-time setup for publishing this docs repo to
**<https://docs.aichatarchive.app>** via Cloudflare Pages.

We pick Cloudflare Pages over GitHub Pages because:

- The main site (`aichatarchive.app`) is already on Cloudflare Pages — same infra
  pattern.
- Cloudflare's edge is faster than GitHub Pages.
- Cloudflare's GitHub App is already installed on this account, so connecting a
  new repo takes 30 seconds.

After setup, `git push` to `main` is the entire publish workflow — Pages rebuilds
and goes live in ~30 seconds.

## Step 1. The repo is already on GitHub (public)

The docs repo lives at <https://github.com/windameister/ai-chat-archive-docs> with
`main` as the default branch. Already pushed; nothing to do here.

## Step 2. Connect Cloudflare Pages to the repo

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create**.
2. Pick **Pages** → **Connect to Git**.
3. Select **GitHub** → **windameister/ai-chat-archive-docs**.
4. Click **Begin setup**.

## Step 3. Build settings

Enter these in the Pages setup wizard:

| Field | Value |
|---|---|
| **Project name** | `ai-chat-archive-docs` |
| **Production branch** | `main` |
| **Framework preset** | None |
| **Build command** | `npm install && npm run build` |
| **Build output directory** | `_build` |
| **Root directory** | *(leave blank)* |
| **Environment variables** | *(none needed)* |

The `npm run build` script runs `node build.js`, which renders every `.md` to a
themed HTML page under `_build/` while also keeping the raw `.md` accessible
for LLM crawlers. See [`build.js`](build.js) for the source.

Click **Save and Deploy**. The first build runs (~45 seconds) and deploys to
`https://ai-chat-archive-docs.pages.dev`.

## Step 4. Add the custom domain

Once the first deploy succeeds:

1. In the Pages project, go to **Custom domains** → **Set up a custom domain**.
2. Enter `docs.aichatarchive.app`.
3. Click **Continue**.
4. Cloudflare auto-creates the necessary DNS record (since the zone is on the
   same Cloudflare account). HTTPS is provisioned automatically.

Wait 60 seconds, then:

```bash
curl -sIL https://docs.aichatarchive.app --noproxy "*" | head -5
# Expected: HTTP/2 200, content-type: text/html
```

## Step 5. Verify LLM-friendliness

After the site is live, check that raw markdown URLs still work alongside the
rendered HTML:

```bash
curl -s https://docs.aichatarchive.app/llms.txt          | head -5
curl -s https://docs.aichatarchive.app/docs/privacy.md   | head -5
curl -s https://docs.aichatarchive.app/llms-full.txt     | head -5
```

All three should return raw text content (`text/plain` for `.txt`,
`text/markdown` for `.md`).

## Step 6. Link the docs from the main site

Edit `aichatarchive-site` (private) and add a footer link:

```html
<a href="https://docs.aichatarchive.app">Docs</a>
```

Push it. CF Pages auto-rebuilds the main site. The reverse links in this repo
already exist (in `README.md`, `index.md`, `llms.txt`).

This step matters for SEO — Google's link graph picks up the signal that the
docs subdomain is authoritative because the main domain links to it.

## Local development

Run the build locally to preview before pushing:

```bash
cd ai-chat-archive-docs
npm install
npm run build
# Open _build/index.html in a browser, or run:
npx serve _build
```

`build.js` is intentionally tiny (~150 lines, one dependency). If you want a
fancier docs theme later (search, versioning, dark mode), swap to MkDocs,
VitePress, or Astro Starlight — the `_build` directory contract stays the same.

## Ongoing workflow

```bash
# Edit files locally…
git add .
git commit -m "docs: add FAQ on Claude API rate limits"
git push

# Cloudflare Pages auto-rebuilds. Live in ~30 seconds.
```

## Optional: deploy via Wrangler CLI

If you ever want to push a one-off deploy without committing (e.g., previewing
a draft):

```bash
# 1. Authenticate (creates an API token under the hood)
export CLOUDFLARE_API_TOKEN=<your-pages-token>

# 2. Build and deploy
npm run deploy   # = npm run build && npx wrangler pages deploy _build ...
```

To create the API token: <https://dash.cloudflare.com/profile/api-tokens> →
**Create Token** → template **Edit Cloudflare Workers** (covers Pages).
Account scope: your CF account. Zone scope: All zones (so wrangler can also
configure the custom domain).

## Post-launch SEO checklist

- [ ] Submit sitemap to Google Search Console: this site auto-emits a basic
      navigation; you can also publish `/sitemap.xml` later by extending
      `build.js`.
- [ ] Submit to Bing Webmaster Tools.
- [ ] Verify `llms.txt` is reachable: `curl https://docs.aichatarchive.app/llms.txt`.
- [ ] Check a few FAQ pages rank on Google for their target queries within 2
      weeks (e.g., `how to export claude chat`).
- [ ] Add the docs URL to the main site's `robots.txt` as a permitted sitemap
      entry.

## If you ever want to ditch CF Pages

Two alternatives, in case Cloudflare goes sideways:

- **GitHub Pages**: this repo also has a Jekyll-compatible `_config.yml` and
  `CNAME`. Toggle it on at
  `https://github.com/windameister/ai-chat-archive-docs/settings/pages` →
  Source `main / (root)`. CF DNS just needs `docs` → `windameister.github.io`
  (gray cloud).
- **Vercel / Netlify**: connect the repo, build command `npm run build`, output
  directory `_build`. Same setup.

The build is portable; the deploy target is just configuration.

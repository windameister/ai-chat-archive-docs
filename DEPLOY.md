# Deployment guide — `docs.aichatarchive.app`

This is the one-time setup for publishing this docs repo to
**<https://docs.aichatarchive.app>** via GitHub Pages. The guide assumes
you already own `aichatarchive.app` and manage its DNS in Cloudflare (inferred
from the site repo's `wrangler.jsonc`).

Everything below is a one-time configuration. After it's done, `git push` is the
entire publish workflow — Pages rebuilds on every push to `main` within ~60 seconds.

## Step 1. Create the GitHub repo and push

From the repo root:

```bash
# Stage everything and make the first commit
git add -A
git commit -m "Initial commit: docs repo scaffold for AI Chat Archive"

# Create the repo on GitHub (public) and push
gh repo create windameister/ai-chat-archive-docs \
  --public \
  --source=. \
  --remote=origin \
  --description "Public documentation for AI Chat Archive — a Chrome extension that exports Claude.ai conversations." \
  --push
```

If you prefer the GitHub UI: create an empty public repo named
`ai-chat-archive-docs`, then:

```bash
git remote add origin git@github.com:windameister/ai-chat-archive-docs.git
git branch -M main
git push -u origin main
```

## Step 2. Enable GitHub Pages

Once the repo is on GitHub:

1. Go to `https://github.com/windameister/ai-chat-archive-docs/settings/pages`.
2. Under **Source**, select **Deploy from a branch**.
3. Under **Branch**, pick **`main`** and the folder **`/` (root)**.
4. Click **Save**.

GitHub starts the first build. It takes 30–120 seconds. When done, the page shows:

> Your site is live at `https://windameister.github.io/ai-chat-archive-docs/`

Open that URL to confirm the site is rendering before moving on.

## Step 3. Attach the custom domain

The `CNAME` file in this repo already contains `docs.aichatarchive.app`, so when
GitHub Pages builds the site it automatically expects that domain.

1. Go back to the Pages settings page.
2. Under **Custom domain**, enter `docs.aichatarchive.app` (should already be filled
   in from the `CNAME` file).
3. Leave **Enforce HTTPS** **unchecked for now** — you need DNS to propagate first.

## Step 4. Add the DNS record in Cloudflare

In the Cloudflare dashboard for `aichatarchive.app`, add a **CNAME** record:

| Type | Name | Target | Proxy status |
|---|---|---|---|
| `CNAME` | `docs` | `windameister.github.io` | **DNS only (gray cloud)** |

**Important:** set the proxy to **DNS only** (gray cloud, not orange). GitHub
Pages handles its own TLS. If Cloudflare proxies the request, you hit
certificate-chain issues.

Wait 5–10 minutes. You can watch propagation with:

```bash
dig docs.aichatarchive.app +short
# Expected output:
# windameister.github.io.
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153
```

## Step 5. Enable HTTPS

Once DNS resolves:

1. Back in the repo's Pages settings, wait for **"DNS check successful"** to
   appear next to your custom domain.
2. Check **Enforce HTTPS**.
3. Pages provisions a Let's Encrypt certificate automatically (takes 5–20
   minutes). Wait until the banner disappears.

Verify:

```bash
curl -I https://docs.aichatarchive.app
# Expected: HTTP/2 200, strict-transport-security header
```

## Step 6. Link the docs from the main site

Edit `aichatarchive-site` (the main site repo) and add a link in the footer:

```html
<a href="https://docs.aichatarchive.app">Docs</a>
```

This step matters for SEO — Google's link graph picks up the signal that the docs
subdomain is authoritative because the main domain links to it.

Also add a reverse link (already in this repo's `README.md` and `index.md`).

## Step 7. Verify LLM-friendliness

After the site is live, check these URLs return the raw markdown/text files (not
HTML-wrapped):

```bash
curl https://docs.aichatarchive.app/llms.txt
# Should return the raw llms.txt content, not a Jekyll-rendered HTML page.

curl https://docs.aichatarchive.app/llms-full.txt
# Same — raw text of the full concatenated docs.
```

If either returns an HTML page, check that `_config.yml` has them in the `include:`
list (they should — this repo's config already does).

## Ongoing workflow

After setup, publishing new docs is just:

```bash
# Edit files locally…
git add .
git commit -m "docs: add FAQ on Claude API rate limits"
git push

# Pages rebuilds automatically. Changes live in ~60 seconds.
```

## If you'd rather use Cloudflare Pages instead of GitHub Pages

Skip Step 2–3 above. In Cloudflare dashboard → Pages → **Connect to Git** →
select this repo → build settings:

- **Build command:** *(leave empty — static site)*
- **Build output directory:** `/`
- **Framework preset:** none

After first build, in Pages → **Custom domains**, add `docs.aichatarchive.app`.
Cloudflare auto-configures DNS + TLS.

Trade-off: Pages' Jekyll preview (the theme rendering, syntax highlighting) won't
happen — Cloudflare Pages serves raw markdown as `.md` files. Good for LLMs, worse
for human browsers who'd see unstyled markdown. Decide based on whether the docs are
primarily consumed by humans (GitHub Pages + Jekyll) or by machines (Cloudflare Pages,
raw markdown).

The default choice in this repo (Jekyll + GitHub Pages) is fine for both — the
rendered HTML is still parseable by LLMs, and humans get a clean themed site.

## Post-launch SEO checklist

After the site is live at `docs.aichatarchive.app`:

- [ ] Submit sitemap to Google Search Console:
      `https://docs.aichatarchive.app/sitemap.xml`
- [ ] Submit to Bing Webmaster Tools.
- [ ] Add the docs URL to the main site's `robots.txt` as a permitted sitemap
      entry.
- [ ] Verify `llms.txt` is reachable and valid.
- [ ] Check a few FAQ pages rank on Google for their target queries within 2 weeks.

# 🎁 Gift Genius AI — Free Gift Recommender

A bilingual (Arabic / English), mobile-friendly gift recommender for Egypt, designed to expand to Saudi Arabia, UAE and USA. Built with **vanilla HTML/CSS/JavaScript + Cloudflare Workers + optional Gemini API**.

## Features

- Four-step guided gift questionnaire (recipient, occasion, hobbies, preferences, budget, country/city)
- AI-generated gift concepts via Gemini with a server-side API key
- **Fallback curated recommendations when Gemini is unavailable or not configured**
- Google Shopping, Amazon, Jumia, Noon, and Google Maps **search links**
- Favorites saved locally in the browser
- RTL Arabic and English UI; mobile responsive
- No mandatory registration, database, paid subscription or custom domain
- Country-specific shopping links and currency labels (EG/SA/AE/US)

> **Important:** This project recommends gift *ideas* and builds shopping **search links**. It does **not** scrape seller pages, validate inventory, retrieve live product prices, or guarantee shopping results. All results are explicitly labeled unverified.

## Quick start (local)

Requires Node.js 20+.

```bash
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars and enter your Gemini key (optional)
npm run dev
```

Open the localhost URL printed by Wrangler. Even without a key, the site works with curated recommendations.

## Get a FREE Gemini API key

1. Go to https://aistudio.google.com/apikey and create an API key in a project with eligible free quota.
2. For local development, put it in `.dev.vars` as `GEMINI_API_KEY=...`.
3. For Cloudflare deployment, set an encrypted secret called `GEMINI_API_KEY` in **Workers & Pages → your Worker → Settings → Variables and Secrets**; or use `npx wrangler secret put GEMINI_API_KEY`.
4. Configure `GEMINI_MODEL` in `wrangler.jsonc` if the default model is no longer covered by the project's free quota.

**Free-tier limits vary by model, project, region and date.** The app falls back to curated ideas on rate limit/error. To absolutely avoid charges, do not enable paid billing on the AI project. A Cloudflare Free plan and supported free model are needed for a zero-cost launch.

## Deploy from GitHub (recommended)

1. Create a GitHub repository (e.g. `gift-genius-ai`) and upload **all the contents** of this folder, not the enclosing folder.
2. Log in to https://dash.cloudflare.com/ and select **Workers & Pages → Create**.
3. Choose to import/connect your GitHub repository and use **Workers** deployment. Use the repository's `wrangler.jsonc` configuration (build step is not needed for this static-assets Worker).
4. Deploy and open the provided `*.workers.dev` URL.
5. In Cloudflare, configure the `GEMINI_API_KEY` secret and redeploy if required.
6. Test `https://your-worker.workers.dev/api/health` — it returns whether `aiConfigured` is true (does not reveal the key).

Alternative deployment from terminal:

```bash
npm install
npx wrangler login
npm run deploy
npx wrangler secret put GEMINI_API_KEY
```

A **GitHub Pages-only deployment** would serve only the HTML and cannot run `/api/recommendations`; use Cloudflare Workers to host the site and the API in one deployment.

## Repo structure

```text
public/           Frontend static HTML/CSS/JS and icon
src/index.js      Worker API, Gemini call, API fallback
src/engine.js     Input validation, shopping links, curated gift ideas
 tests/           Node built-in unit tests
wrangler.jsonc    Cloudflare deploy config
```

## Run checks

```bash
npm run check
```

## Security and privacy

- Gemini API key is **never sent to the client**.
- All gift suggestions are unverified and should not be treated as prices/availability.
- Client-side favorites remain on the user's device (`localStorage`).
- Form responses are sent to the Worker and, when configured, to Gemini to generate ideas. Do not enter sensitive personal details.
- No analytics, cookies for tracking, logins or payment processing are included.
- API is public and **there is not yet a robust distributed per-user rate limit**. Do not assume the Cloudflare `DAILY_REQUEST_LIMIT` variable imposes a quota; it is reserved for future integration. For a public/high-traffic release, add rate limiting and abuse protection and monitor provider quotas.

## Free-first constraints

- No paid API or Places API integration; Maps links launch a Google Maps search.
- No live price comparisons or stock verification.
- No automatic buying.
- AI availability depends on current Gemini free-tier quota, and Cloudflare service quotas apply.

## Licence

MIT — see LICENSE.

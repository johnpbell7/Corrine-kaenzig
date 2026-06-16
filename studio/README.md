# Corrine Kaenzig — Sanity Studio (content backend)

This is the editing backend for the portfolio. Corrine logs into the Studio,
edits/adds/reorders projects and site details, and the public `index.html` reads
that content. The 18 existing entries are imported by the seed script below, so
nothing is re-typed by hand.

> **Note:** this folder needs Node.js (18+). It was authored but not run in the
> environment that generated it — follow the steps below to install and verify.

## 1. Create the Sanity project

```bash
cd studio
npm install
npx sanity login            # opens browser; sign in (Google/GitHub)
npx sanity init --env       # creates a project, writes project id; choose dataset "production"
```

`sanity init` will print/store your **project id**. Put it (and the dataset) in a
`.env` file — copy `.env.example`:

```
SANITY_STUDIO_PROJECT_ID=xxxxxxxx
SANITY_STUDIO_DATASET=production
```

## 2. Seed the 18 existing entries

Create an **Editor token** at https://sanity.io/manage → your project → API → Tokens,
then run the one-time import (it uploads every image + brand wordmark and creates
all 18 projects + site settings):

```bash
SANITY_API_TOKEN=your_editor_token npm run seed
```

Re-running is safe — it uses fixed document ids and overwrites.

## 3. Run the Studio

```bash
npm run dev      # http://localhost:3333
```

You'll see **Site settings** and a drag-to-reorder **Projects** list, pre-filled
with all 18 entries. Edit any field, drag images in to replace them (this is where
the higher-res originals go), reorder, delete, or add new projects.

## 4. Deploy the Studio for Corrine

```bash
npm run deploy   # pick a hostname -> https://<name>.sanity.studio
```

Send Corrine that URL and invite her at sanity.io/manage (Members → Invite). She
edits there; no code, no GitHub.

## 5. Make the site read from Sanity

The public site reads **published** content with no token, so:

```bash
# allow public read
npx sanity dataset visibility set production public

# allow the website's browser requests (CORS) — add each origin you serve from
npx sanity cors add http://localhost:8000 --no-credentials
npx sanity cors add https://your-live-domain.com --no-credentials
```

Then open the repo's `index.html` and set the project id near the top of the last
`<script>`:

```js
const SANITY = { projectId: "xxxxxxxx", dataset: "production", apiVersion: "2024-01-01" };
```

While `projectId` is `""` the site uses its built-in copy of the content, so it
never breaks. Once set, it pulls everything live from Sanity. Commit + deploy the
site as usual.

## Schema summary

- **project** — brand, title, slug, role, discipline (`Art Director` | `Stylist`,
  drives the filter), year, summary, bullets, images (first = card/hero), videos
  (YouTube/Vimeo/Drive/Instagram/Facebook), optional official logo, featuredInHero,
  order (drag handle).
- **siteSettings** (single doc) — availability, contact email/phone/location,
  about portrait + lead + body, services, clients (name + optional logo),
  hero deck projects.

# Corrine Kaenzig — Stylist & Art Director

Portfolio site for Corrine Kaenzig. This repo currently holds the **production prototype** — a single, self-contained `index.html` (HTML + CSS + GSAP) with all content, images and brand wordmarks inlined.

## View it

Open `index.html` in a browser, or serve the folder:

```bash
# any static server, e.g.
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's in the prototype

- **Hero** — oversized Anton title, a sliding deck of project images, animated `CK` monogram intro (ring draws on, name fades up) built with GSAP.
- **Work grid** — 18 projects with an `All / Art Director / Stylist` filter that animates with GSAP Flip.
- **Project overlay** — opens per project with a staged reveal; supports **embedded video** (YouTube, Vimeo incl. private hash, Google Drive, Instagram, Facebook) plus a stills gallery. Scroll-locked, focus-trapped, keyboard + prev/next navigable.
- **About, Services, Clients, Contact** sections with scroll-reveal and word-by-word heading animations.
- **Lenis** smooth scroll, fully `prefers-reduced-motion` safe.

### Where the content lives (today)

All content is in the final `<script>` block in `index.html`:

- `PROJECTS` — the array of portfolio entries (single source of truth). Each object: `brand`, `title`, `role`, `discipline` (`Art Director` | `Stylist`, drives the filter), `year`, `summary`, `bullets[]`, `images[]` (keys into `window.IMG`), optional `videos[]` (any of the supported providers), optional `logo` (key into `window.LOGOS`).
- `window.IMG` — base64 images, keyed.
- `window.LOGOS` — 18 typographic brand wordmarks (vector SVG, set in the site fonts — **not** trademark reproductions; swap for official logo files when available).

To add a project today you append one object to `PROJECTS` and add its image(s) to `window.IMG`. **This is exactly what the backend (below) will replace** so Corrine can do it without touching code.

## Backend / CMS — Sanity (`studio/`)

Corrine edits content in a **Sanity Studio** (a friendly visual editor — add/edit/reorder/delete projects, drag images in, one-click publish). The site reads from Sanity with a **built-in fallback**, so it never breaks before it's configured.

- All 18 existing entries (+ images, brand wordmarks, site settings) are imported by a one-time seed script — nothing is re-typed.
- The git site stays exactly as-is; the only change is that `PROJECTS` / `IMG` / `LOGOS` can be sourced from Sanity. While `SANITY.projectId` in `index.html` is `""`, the site uses its inlined content (current behaviour).

**Full setup, seeding and "go live" steps:** see [`studio/README.md`](studio/README.md).

Quick version:
```bash
cd studio && npm install && npx sanity login && npx sanity init --env
SANITY_API_TOKEN=<editor-token> npm run seed   # imports the 18 entries + assets
npm run dev                                     # edit at localhost:3333
npm run deploy                                  # hosted Studio URL for Corrine
```
Then set `projectId` in `index.html`, make the dataset public, and add the site's origin to CORS (all in the studio README).

## Brand / design tokens

See `BRIEF.md` for the full design system (colours, type, spacing) and the original production brief.

## Credit

Design & build prototype iterated with Claude Code.

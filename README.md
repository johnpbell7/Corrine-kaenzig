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

## Backend / CMS — in progress

The goal: let Corrine **add, edit, reorder and delete** portfolio entries (and videos, images, logos, site details) through an admin UI — no code. The site will read its content from that backend instead of the hardcoded `PROJECTS` array. Architecture is being finalised; see the open discussion / next commits.

## Brand / design tokens

See `BRIEF.md` for the full design system (colours, type, spacing) and the original production brief.

## Credit

Design & build prototype iterated with Claude Code.

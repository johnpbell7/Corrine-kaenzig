# Build Brief — Corrine Kaenzig Portfolio (production)

Build a production portfolio site for **Corrine Kaenzig — Stylist & Art Director**. A static prototype is attached (`corrine-kaenzig.html`); use it as the visual and interaction reference, then **rebuild it properly** with a CMS backend, real assets, and refined motion. Improve the overall feel where you see opportunities — keep the direction, raise the craft.

---

## 1. Stack

- **Next.js (App Router) + TypeScript**, deployed on **Vercel**.
- **Sanity** as the headless CMS/backend (embedded Studio at `/studio`) so Corrine can add/edit jobs herself.
- **GSAP 3.12+** for all animation (free, all plugins available): `ScrollTrigger`, `SplitText`, `Flip`. Use `@gsap/react` `useGSAP` with scoped selectors and cleanup.
- **Lenis** for smooth inertia scroll (subtle), respecting `prefers-reduced-motion`.
- `next/font` for fonts, `next/image` for images. Strict TypeScript, ESLint, Prettier.

---

## 2. Brand / design system

Pull these exact tokens from the prototype.

**Colour (white & clean — the photography carries the colour):**
- `--bg #ffffff`, `--bg-2 #f4f3ef`
- `--ink #15140f`, `--ink-2 #56544c`, `--muted #9d9b91`
- `--line rgba(21,20,15,.13)`, `--line-soft rgba(21,20,15,.07)`
- `--live #2f9e63` (availability dot only)

**Type:**
- **Anton** — oversized poster display (hero title only). UPPERCASE.
- **Schibsted Grotesk** (400/500/600/700) — UI, body, headings, nav.
- **Instrument Serif** (italic) — small expressive accents (e.g. the `&`, an italic letter dropped into a heading). Use sparingly.

**Feel:** editorial, calm, lots of whitespace, near-monochrome UI, one restrained green dot. Radius 8–10px. Tinted shadows (hue-matched to ink), never flat black. Section padding ~`clamp(56px,9vh,124px)`, page gutter `clamp(20px,5vw,84px)`. No "AI gradient", no emoji in UI.

---

## 3. Page structure

Single page, anchored nav. Sections in order:

1. **Header** (fixed): name mark left (`Corrine Kaenzig`), nav right (`About · Work · Services · Contact`) + live "Available 2025" pill (pulsing green dot). Solidifies (blur bg + border) on scroll.
2. **Hero**: oversized `STYLIST & ART DIRECTOR` in Anton (the `&` in italic serif), with an **angled, stacked deck of project images** woven into the type — front card cycles through selected projects (crossfade ~3s), two more projects fanned behind it for depth. Footer row: "Available for new projects" (left) + "Contact" (right).
   - **Desktop:** deck absolutely positioned, overlapping/centred over the type.
   - **Mobile:** stack cleanly — type → deck (centred) → footer, hero sized to content (no dead space). This responsive switch is important; the overlap must not leave gaps on narrow screens.
3. **About**: Corrine's portrait (left) + bio (right). Bio is CMS-editable.
4. **Work** (the dashboard): a filter (`All · Art Director · Stylist`, with live counts) and a **uniform grid** of project cards (image, brand, title/role, year). Clicking a card opens the **project overlay** (see §5). Filtering animates with GSAP **Flip**.
5. **Services**: numbered list — Art Direction, Fashion Styling, Costume Design, Set Dressing, Consulting (CMS-editable).
6. **Clients**: a **non-scrolling responsive grid** of brand logos (see §6). No "Trusted by" heading.
7. **Contact**: oversized headline, large email link, details (phone, location, availability).
8. **Footer**: copyright, role, back-to-top.
9. **Floating "Contact me" button** (fixed, bottom-centre, persistent): opens a Gmail compose window prefilled to Corrine — `https://mail.google.com/mail/?view=cm&fs=1&to=<email>&su=Project%20enquiry`, `target="_blank"`. Email comes from CMS site settings.

---

## 4. Animation (GSAP) — premium, restrained

- **Slow, staged load:** a brief intro (≈1–1.4s) — e.g. a thin progress line or the name fading up over a clean white screen — that resolves into the hero. Then a staged hero reveal: mega-title lines wipe up from a mask (SplitText `lines` + `mask:"lines"`), deck fades/scales in, footer fades. Nothing pops in all at once.
- **Animated text:** use SplitText for the hero title and section headings (line or word reveals on load / scroll). Reveal headings as they enter the viewport.
- **Scroll reveals:** `ScrollTrigger.batch` for work cards, services rows, about, clients, contact — fade + 30–40px rise, gentle stagger, reverse on scroll-up.
- **Hero deck:** crossfade cycling of the front card; optional very subtle float. Two back cards fanned (rotate/offset) for depth.
- **Filter:** GSAP **Flip** — capture state, toggle hidden cards, `Flip.from` with scale/opacity for entering/leaving items.
- **Modal:** backdrop fade + card fade/scale/translate in; gallery items stagger.
- **Smooth scroll:** Lenis, wired into ScrollTrigger.
- **Accessibility:** wrap all motion in `gsap.matchMedia()` with a `prefers-reduced-motion` branch — reduced-motion users get content in final state, no intro, no scroll hijack. Honour focus states everywhere.

---

## 5. Project overlay (popup) — must support video

Opens over the page (dark-dimmed backdrop, white card, scroll-locked, ESC + click-outside + close button, prev/next + arrow keys). Contents:

- **Brand logo plate** at the top (the official SVG logo — see §6).
- **Title** + meta pills (role · year · discipline).
- **"What was done"** — the summary paragraph.
- **Responsibilities** — the bullets list.
- **Media:**
  - If the project has a **`videoUrl`** (YouTube/Vimeo) or uploaded video file, render a **responsive 16:9 embedded player** at the top of the media area. *This is required — Corrine will supply video links from the portfolio PDF for the projects that have them ("click to play" commercials).*
  - Plus an image **gallery** (the project's stills).
- Prev/next navigation between projects.

---

## 6. Logos — source official assets, do **not** trace

- Each client logo must be the brand's **official logo file**, sourced legitimately from that brand's brand/press-asset kit (Corrine, as a contractor to these brands, can obtain these). Optimise with SVGO and store as SVG — either in Sanity (`client.logo` as an SVG image/file) or `/public/logos/<slug>.svg`.
- **Do not recreate, trace, or approximate trademarked logos.** Until an official file is supplied for a given brand, render a clean **typographic wordmark fallback** (brand name set in Schibsted Grotesk) in the same plate, so the grid and overlay never break.
- Logos appear in: the Clients grid and the project-overlay brand plate. Greyscale → full-colour on hover in the grid.
- Brands to support: John Lewis, Apple, Samsung, Barclays, Next, Fred Perry, Paul Smith, Benefit, L'Oréal, Burberry, Matthew Williamson, ITV, Channel 4, Stand Up To Cancer, Raasa, Joyful, Fantasy Football, The Matt Lucas Prank Show.

---

## 7. Backend / CMS (Sanity)

Embedded Studio at `/studio`. Corrine must be able to **add, edit, reorder and delete jobs**, and the **filter must keep working** automatically as jobs change.

**`project` schema:**
- `brand` (string), `slug`
- `logo` (image/SVG, optional → wordmark fallback)
- `title` (string), `role` (string)
- `discipline` (string, list: `Art Director` | `Stylist`) — drives the filter
- `year` (string)
- `summary` (text) — "what was done"
- `bullets` (array of strings) — responsibilities
- `images` (array of images, hot-spot enabled; first = card/hero image)
- `videoUrl` (url, optional) and/or `videoFile` (file, optional)
- `featuredInHero` (boolean) + `orderRank` (for ordering; use `@sanity/orderable-document-list`)

**`siteSettings` (singleton):**
- `availability` (string, e.g. "Available 2025")
- `contactEmail` (string) — used by the floating Gmail button and contact section
- `phone`, `location`
- `aboutPhoto` (image), `aboutHeading`, `aboutBody` (portable text)
- `services` (array of {title, description})
- `clients` (array of {name, logo image}) — for the Clients grid
- `heroProjects` (array of references to `project`) — which projects cycle in the hero deck

Frontend fetches via GROQ (server components / ISR). Filter is **client-side** over the fetched set, grouped by `discipline`, with `All`. Counts derive from the data.

---

## 8. Seed content (the 18 projects)

Seed Sanity with these. **Years marked `*` are placeholders — confirm with Corrine.** Images come from the supplied PDF stills; `videoUrl` to be added by Corrine where the PDF marks "click to play".

```json
[
 {"brand":"Barclays","title":"This Is Me","role":"Art Director","discipline":"Art Director","year":"2023","summary":"A global, employee-led series of short films telling real stories across markets — from Harlem to Tokyo. Held the visual direction end to end, keeping a cohesive, on-brand look across very different people, places and lighting.","bullets":["Oversaw visual direction across all markets","Kept films cohesive and on-brand","On-set styling and creative decisions","Managed assistants on set","Timeline and budget management"]},
 {"brand":"Apple × John Lewis","title":"Apple Watch","role":"Art Director","discipline":"Art Director","year":"2024*","summary":"Paid social and video campaign built around the Apple Watch — directing the visual language from quiet morning routines through to outdoor movement, making the styling and creative calls live on set.","bullets":["Directed the campaign's visual language","Set styling and creative decisions on set","Sourced props and clothing","Managed the set and assistants","Budget and timeline management"]},
 {"brand":"Samsung × John Lewis","title":"Whatever Your Personality","role":"Art Director","discipline":"Art Director","year":"2023*","summary":"A multi-format campaign showing technology slotting naturally into real home life, across social, web and OOH. Directed the look and made the styling and set decisions in the moment.","bullets":["Directed the look across social, web and OOH","Live styling and set decisions","Sourced props and clothing","Client consultation for on-brand outcome","Budget management"]},
 {"brand":"Apple × John Lewis","title":"Off to Uni","role":"Art Director","discipline":"Art Director","year":"2023*","summary":"A back-to-university campaign spanning social, web and OOH. Kept the visual direction consistent and on-brand across every format.","bullets":["Held visual direction across all formats","On-set creative decisions","Sourced props and clothing","Timeline management"]},
 {"brand":"John Lewis","title":"Matthew Williamson — Live Launch","role":"Art Director","discipline":"Art Director","year":"2024*","summary":"A live product launch with designer Matthew Williamson. Oversaw the visual direction and on-set styling, advising on how the collection should be portrayed and keeping the broadcast on-brand.","bullets":["Visual direction for a live broadcast","Advised on how to portray the collection","On-set styling and creative decisions","Client consultation"]},
 {"brand":"Benefit","title":"Tinted Lip Campaign","role":"Art Director","discipline":"Art Director","year":"2024*","summary":"A beauty campaign for Benefit's tinted lip range, with John Lewis. Directed the visual outcome with the client and made the styling and prop calls for a bright, cohesive result.","bullets":["Directed the visual outcome with the client","Managed assistants on set","Styling and prop decisions","Kept every element on-brand"]},
 {"brand":"Burberry & L'Oréal","title":"Beauty Launches","role":"Art Director","discipline":"Art Director","year":"2024*","summary":"Beauty launch content for Burberry and L'Oréal, with John Lewis. Oversaw the visual direction and styling, cohesive and on-brand from concept to capture.","bullets":["Oversaw visual direction","Styling and creative decisions","Sourced props and clothing","Concept-to-capture cohesion"]},
 {"brand":"John Lewis","title":"ASMR Baking Series","role":"Art Director","discipline":"Art Director","year":"2024*","summary":"A festive ASMR baking series — a tactile, sound-led world of cakes, tables and textures. Art-directed each scene to feel rich, warm and on-brand.","bullets":["Art-directed a tactile, sound-led world","Set dressing and scene composition","Food and prop styling","Sourced props and clothing"]},
 {"brand":"John Lewis Live","title":"Summer with Gok Wan","role":"Art Director / Set Design","discipline":"Art Director","year":"2023*","summary":"A live summer showcase with Gok Wan for the ANYDAY range. Designed and oversaw the set build, directed the visual look, and made styling decisions on set.","bullets":["Designed and oversaw the set build","Directed the visual look","On-set styling and creative decisions","Timeline and budget management"]},
 {"brand":"John Lewis Live","title":"Kat Farmer & Louise Roe","role":"Art Director","discipline":"Art Director","year":"2022","summary":"Seasonal live fashion edits with stylists Kat Farmer and Louise Roe. Directed the visual look, sourced props and clothing, kept each segment cohesive and on-brand.","bullets":["Directed the visual look for seasonal edits","Sourced props and clothing","Kept segments cohesive and on-brand","On-set creative decisions"]},
 {"brand":"John Lewis Live","title":"A/W with Erica Davies","role":"Art Director","discipline":"Art Director","year":"2023*","summary":"Autumn/winter live fashion content with Erica Davies, plus an 'Off to Uni' edit with Kat Farmer. Oversaw visual direction and styling, advising on how the season's pieces should read on camera.","bullets":["Oversaw visual direction and styling","Advised on how pieces read on camera","Sourced props and clothing","Set management"]},
 {"brand":"Raasa","title":"Brand Campaign","role":"Art Director","discipline":"Art Director","year":"2025*","summary":"Food art direction for Raasa — composing warm, appetising tablescapes that hold together across formats. Directed the visual outcome, sourced props, dressed every scene on brand.","bullets":["Composed warm, appetising tablescapes","Food styling and set dressing","Sourced props","Directed the visual outcome"]},
 {"brand":"Joyful","title":"Brand Campaign","role":"Art Director","discipline":"Art Director","year":"2025*","summary":"Brand campaign art direction for Joyful, including seasonal moments. Directed a bright, characterful visual language and made the styling and set calls.","bullets":["Directed a bright, characterful look","Set styling and seasonal moments","Sourced props and clothing","On-brand cohesion across the campaign"]},
 {"brand":"Next","title":"Fred Perry × Paul Smith","role":"Stylist","discipline":"Stylist","year":"2022*","summary":"Menswear e-commerce styling across two heritage brands, Fred Perry and Paul Smith. Dressed full look ranges for studio capture with tight turnarounds and a consistent commercial finish.","bullets":["Styled full look ranges for two heritage brands","Studio e-commerce capture","Tight-turnaround consistency","On-set styling decisions"]},
 {"brand":"ITV","title":"Lorraine & Riddiculous","role":"Stylist","discipline":"Stylist","year":"2024*","summary":"Weekly presenter and guest styling for daytime broadcast across The Lorraine Show and Riddiculous. Built brand relationships to lend and gift clothing, sourced and collated weekly fashion features, advised talent — all to budget.","bullets":["Liaised with presenters and producers","Built brand relationships to lend / gift clothing","Sourced and collated weekly fashion features","Advised talent and instructed assistants","Budget management"]},
 {"brand":"Stand Up To Cancer","title":"Alan Carr & Maya Jama","role":"Celebrity Stylist","discipline":"Stylist","year":"2024*","summary":"Celebrity styling for a live charity broadcast, dressing hosts including Alan Carr and Maya Jama. Sourced costume and made styling calls on set, managing assistants and budget across a high-pressure live show.","bullets":["Celebrity styling for live broadcast","Costume sourcing","Styling and creative decisions on set","Managed assistants and budget"]},
 {"brand":"The Matt Lucas Prank Show","title":"The Jokes On You","role":"Costume Designer","discipline":"Stylist","year":"2023*","summary":"Character costume design, making and continuity for a hidden-camera prank format — disguises convincing enough to fool the public, kept consistent across multiple shoot days and locations.","bullets":["Designed and made character costumes","Costume making and fittings","Continuity across shoot days","On-set styling decisions"]},
 {"brand":"Fantasy Football","title":"Matt Lucas & Elis James","role":"Costume Design","discipline":"Stylist","year":"2023*","summary":"Costume design for an entertainment format hosted by Matt Lucas and Elis James. Liaised with talent and producers, made styling and creative decisions on set, managed sourcing and budget.","bullets":["Costume design for the format","Liaised with talent and producers","Styling and creative decisions on set","Sourcing and budget management"]}
]
```

Notes: `discipline` is two buckets only (filter = `All / Art Director / Stylist`); costume jobs sit under **Stylist** but keep their true `role` label on the card. Contact email: `ckaenzig23@gmail.com`. Phone: `+44 7427 161 162`. Location: United Kingdom, working worldwide.

---

## 9. Quality bar

- **Performance:** `next/image` with proper sizes, lazy-load below the fold, preload hero, optimise/serve modern formats; Lighthouse 90+ across the board.
- **SEO:** per-page metadata, Open Graph image, sensible titles/descriptions, semantic landmarks (`header`/`main`/`section`/`footer`).
- **Accessibility:** skip link, visible focus rings, keyboard-operable modal and filter, meaningful `alt` text, reduced-motion path, colour contrast.
- **Responsive:** mobile-first; verify the hero specifically at 360–430px (stacked, no dead space) and ≥1280px (woven).
- Clean component structure, typed Sanity queries, no dead code, no hardcoded content that belongs in the CMS.

---

## 10. Deliverables

1. Next.js app (App Router) wired to Sanity, deployable to Vercel.
2. Sanity Studio at `/studio` with the schemas above, seeded with the 18 projects and site settings.
3. GSAP animation layer per §4 (intro load, text reveals, scroll reveals, hero deck, Flip filter, modal), reduced-motion safe.
4. Project overlay with **video support** (`videoUrl`/`videoFile`) per §5.
5. Clients grid + overlay plates using **official SVG logos** with wordmark fallback per §6.
6. README: env vars (`NEXT_PUBLIC_SANITY_PROJECT_ID`, dataset, etc.), local dev, how Corrine adds a job + a video, and where to drop official logo SVGs.

Use the attached `corrine-kaenzig.html` as the look-and-feel reference; match its layout and motion, then refine spacing, typographic rhythm and easing for a more polished final result.

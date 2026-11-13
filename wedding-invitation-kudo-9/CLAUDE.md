# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3009 (demo) — /<slug>?to=Nama&k=<sig> for a real invitation (copy a guest link from admin → Tamu)
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"kudo-9" template** ("Teratai Senja": a 3D gatefold card, lotus/dahlia/wisteria in CSS 3D, and parallax on every scene). It is a sibling of kudo-6 with different flowers, palette, and photo layouts. Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-9`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name** (`?to=`) is shown only with a valid `?k=` — an HMAC the admin adds to each guest link (`src/shared/guest-token.ts`, keyed by `PREVIEW_SECRET`, prefix `guest:`). Typed/edited names or links without `k` fall back to `content.defaultGuest`. The demo `/` still accepts any `?to=`.

Shell order is `GateCover` → `Hero` → `Verse` → `Couple` → `Story` → `Events` → `Gallery` → `Gifts` → `Rsvp` → `Closing`.
- `GateCover` is fixed and locks scroll. A GSAP timeline runs (seal → both leaves swing open on `rotationY` → inner card zooms), then `onOpen` fires.
- `Hero` receives `isOpen` so its intro plays only after the card opens.

## Photo layouts (what makes this differ from kudo-6)

- Hero: triptych — `coverPhoto` in a `.capsule` (centre) with a thin ring floating in front (`translateZ`), two round photos from `photosExcept(photos, [coverPhoto])` on the sides, tilted with `rotateY`.
- Couple: round "moon" portraits, alternating photo/text columns.
- Story: zig-zag, one photo per chapter (`photoAt(pool, i)`) in `.petal-frame` / `.petal-frame-alt`.
- Gallery: bento grid; `lib/gallery.ts → tileFor()` maps each moment's `shape` to a span + frame (tested).
- Closing: round photo above a lotus pond; the big lotus has `opensOnScroll` (the section is the `data-bloom-track`).

## 3D & motion

- **No WebGL.** The 3D comes from CSS 3D (`perspective`, `preserve-3d`, `translateZ`) plus SVG, which keeps phones fast. `.preserve-3d` must be on every wrapper between the perspective container and the 3D object.
- **`Flower`** (`components/three/Flower.tsx`, `kind="lotus" | "dahlia"`): each petal ring is an SVG layer at `translateZ(i × --spread)` (see `.flower` / `.flower-ring` in `globals.css`). `pad` adds a lotus leaf behind. Geometry lives in `lib/flora.ts`, which is pure, deterministic, and tested.
- **`WisteriaCurtain` / `WisteriaStrand`** (`components/three/Wisteria.tsx`): a branch with hanging strands; each strand has its own `data-depth` and a `data-spin` sway pivoting at its top (`origin-top`).
- **`hooks/useScrollScene.ts` is the only scroll-motion system.** It covers reveals (`data-reveal`, `data-reveal-group/item`) and parallax (`data-depth`, `data-drift`, `data-spin`, `data-turn`, `data-parallax` + `<Photo parallax>`, `data-bloom-open`). Mobile uses half the amplitude, and reduced motion disables it all.
  - Never put a `data-*` motion attribute (or a GSAP intro attribute like `data-intro-wing`) on an element that also has a Tailwind `translate-*`, an inline `transform`, or a CSS `transition`. GSAP overwrites the transform; use an inner or outer wrapper instead.
  - End points near the bottom of the page use `clamp()` so they always finish.
- `useTilt` tilts objects toward the cursor (fine pointer only). `useScrollRefresh` calls `ScrollTrigger.refresh()` when `<main>` changes height.
- No looping or blinking animations (user preference). Everything is driven by scroll, the cursor, or a tap, and plays once.

## Visual system

- Tokens:
  - `mist`: the dominant colour; `haze`: surfaces.
  - `lilac` / `lavender`: flowers and ornaments.
  - `plum`: the wax seal, gatefold, primary button; `plum-deep`: small text accents (AA contrast on mist).
  - `sage` / `sage-deep`: leaves, vines, lotus pads.
  - `apricot`: lotus hearts and small warm accents.
  - `ink`: text.
- Fonts:
  - `font-display` (Bodoni Moda) for headings.
  - `font-sans` (Jost) for body text.
  - `font-script` (Pinyon Script) **only for names and signatures**.
  - `font-arabic` (Amiri) for verses.
- Classes: `.mist-paper`, `.dusk-paper` (lilac → apricot dusk gradient), `.veil-card`, `.capsule`, `.petal-frame(-alt)`, `.label`, `.btn-plum`, `.btn-ghost`, `.field`.

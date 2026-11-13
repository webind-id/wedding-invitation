# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3008 (demo) — /<slug>?to=Nama&k=<sig> for a real invitation (copy a guest link from admin → Tamu)
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"kudo-8" template** ("Tapak Puncak": a cinematic film about a hike across six Central/East Java mountains — Prau, Sindoro, Sumbing, Merbabu, Lawu, Slamet) for the multi-template platform. Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-8`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name** (`?to=`) is shown only with a valid `?k=` — an HMAC the admin adds to each guest link (`src/shared/guest-token.ts`, keyed by `PREVIEW_SECRET`, prefix `guest:`). Typed/edited names or links without `k` fall back to `content.defaultGuest`. The demo `/` still accepts any `?to=`.
- `next.config.mjs` rewrites `/images/*.jpg` → `.webp` (old invitations may still store `.jpg` sample paths).

Shell order is `TrailCover` → `Hero` → `Verse` → `Couple` → `Story` → `Events` → `Gallery` → `Gifts` → `Rsvp` → `Closing`.
- `TrailCover` is fixed and locks scroll. Load: letterbox bars open from black. Tap: bars close to black, then `onOpen` fires.
- `Hero` receives `isOpen`; it starts with the bars closed and opens them, so the cut from the cover is seamless.

## Scenes (real photos)

- **`lib/scenes.ts` is the single source of photos**: `SCENES[id]` → `src`, `alt`, `mountain`, `focus` (object-position for portrait crops), `credit`, and optional `wide` (landscape version for ≥768px when `src` is portrait).
- Photos live in `public/images/mountains/*.webp` (1920px, q72). Wikimedia Commons photos are **CC BY-SA 4.0 — the photographer credit is mandatory**; `photoCredits()` feeds the end credits in `Closing`. Any new photo must be added there with its credit.
- `prau.webp` / `merbabu.webp` (portrait) were supplied by the template owner and have `credit: null` — confirm their licence before production.
- `components/film/`:
  - `SceneBackdrop`: photo + film grade (`.grade-tint` soft-light teal/amber, dark top/bottom gradient, `.vignette`) + optional Ken Burns (`data-zoom`).
  - `StickyScene`: backdrop sticks full-screen while the chapter scrolls over it (`-mt-[100svh]`). It is the `data-zoom-track`.
  - `Frame`: `Letterbox` (bars, `data-letterbox`), `Slate` (scene number · mountain · mdpl · coordinates), `TitleCard` (chapter heading).
- `Story` cross-fades one backdrop per chapter (`trailScenes()`: last chapter is always the summit sunrise) and updates the altimeter HUD from scroll progress (`lib/trail.ts`).

## Motion

- **`hooks/useScrollScene.ts` is the only scroll-motion system** (reveals, `data-depth`, `data-zoom`, …). Mobile uses half the amplitude; reduced motion disables it all.
- Never put a `data-*` motion attribute on an element that also has a Tailwind `translate-*`, an inline `transform`, or a CSS `transition` (incl. Tailwind `transition`). Use a wrapper.
- No looping or blinking animations (user preference). The film grain (`.film-grain`) is a static fixed overlay without blend mode.
- No `backdrop-filter` on the faces of the 3D flip cards in `Gifts` (breaks `backface-visibility`).

## Visual system

- Tokens: `film` (black, dominant), `film-soft` (panels), `seluloid` (text), `amber` (dawn accent), `kabut`, `abu`.
- Fonts: `font-display` (Cormorant Garamond) for everything readable — `.credit` = light, uppercase, wide tracking (titles, names); italic for subtitles. `font-mono` (JetBrains Mono) for labels, coordinates, timecode. `font-arabic` (Amiri) for verses.
- Classes: `.label`, `.credit`, `.on-photo` (text-shadow for text over photos), `.glass`, `.sprockets`, `.btn-film`, `.btn-film-solid`, `.btn-ghost`, `.field`.
- Chapter kickers are English film cues ("Opening · The Journey Begins", "The Trail", "The Destination", "Final Chapter"); body copy stays in Indonesian.

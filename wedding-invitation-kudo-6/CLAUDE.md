# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3006 (demo) — /<slug>?untuk=<guest-code> for a real invitation (copy a guest link from admin → Tamu)
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"kudo-6" template** ("Immersive Romance": a 3D envelope, sculptural flowers, and parallax on every scene) for the multi-template platform. Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-6`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.

Shell order is `EnvelopeCover` → `Hero` → `Verse` → `Couple` → `Story` → `Events` → `Gallery` → `Gifts` → `Rsvp` → `Closing`.
- `EnvelopeCover` is fixed and locks scroll. A GSAP timeline runs, then `onOpen` fires.
- `Hero` receives `isOpen` so its intro plays only after the envelope opens.

## 3D & motion

- **No WebGL.** The 3D comes from CSS 3D (`perspective`, `preserve-3d`, `translateZ`) plus SVG, which keeps phones fast. `.preserve-3d` must be on every wrapper between the perspective container and the 3D object.
- **`Bloom`** (`components/three/Bloom.tsx`): each petal ring is an SVG layer at `translateZ(i × --spread)` (see `.bloom` / `.bloom-ring` in `globals.css`). Geometry lives in `lib/bloom.ts`, which is pure, deterministic, and tested. `opensOnScroll` scrubs `--spread` (the bloom opening).
- **`EnvelopeCover`** layers, back to front: back → card → pocket (V-shaped opening) → flap (front face + `envelope-liner` back face) → wax seal. GSAP owns the flap's and card's transforms; set them with `gsap.set`, never with inline CSS.
- **`hooks/useScrollScene.ts` is the only scroll-motion system.** It covers reveals (`data-reveal`, `data-reveal-group/item`) and parallax (`data-depth`, `data-drift`, `data-spin`, `data-turn`, `data-parallax` + `<Photo parallax>`, `data-bloom-open`, `data-draw` for the ribbon). Mobile uses half the amplitude, and reduced motion disables it all.
  - Never put a `data-*` motion attribute on an element that also has a Tailwind `translate-*` or an inline `transform`, or on one with a CSS `transition`. GSAP overwrites the transform; use an inner or outer wrapper instead.
  - End points near the bottom of the page use `clamp()` so they always finish.
- `useTilt` tilts objects toward the cursor (fine pointer only). `useScrollRefresh` calls `ScrollTrigger.refresh()` when `<main>` changes height.
- No looping or blinking animations (user preference). Everything is driven by scroll, the cursor, or a tap, and plays once.

## Visual system

- Tokens:
  - `ivory`: the dominant colour.
  - `pearl`: surfaces.
  - `champagne` / `champagne-deep`: matte metallic accents. No shiny gold.
  - `blush`: flowers.
  - `rose`: the wax seal.
  - `mauve`: small text accents (AA contrast on ivory).
  - `ink`: text.
- Fonts:
  - `font-display` (Cormorant Garamond) for headings.
  - `font-sans` (Manrope) for body text.
  - `font-script` (Allura) **only for names and signatures**.
  - `font-arabic` (Amiri) for verses.
- Classes: `.pearl-paper` (static pearl sheen + fibres), `.pearl-card`, `.arch`, `.label`, `.btn-pearl`, `.btn-ghost`, `.field`.

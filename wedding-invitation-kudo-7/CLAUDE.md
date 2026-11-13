# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3007 (demo) — /<slug>?untuk=<guest-code> for a real invitation (copy a guest link from admin → Tamu)
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"kudo-7" template** ("Keraton Sogan": a Javanese joglo house whose gebyok doors open in 3D, flanked by 3D wayang gunungan) for the multi-template platform. Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-7`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.

Shell order is `JogloCover` → `Hero` → `Verse` → `Couple` → `Story` → `Events` → `Gallery` → `Gifts` → `Rsvp` → `Closing`.
- `JogloCover` is fixed and locks scroll. A GSAP timeline runs, ends on a full gading flash (same colour as the Hero background), then `onOpen` fires.
- `Hero` receives `isOpen` so its intro plays only after the doors open.

## 3D & motion

- **No WebGL.** The 3D comes from CSS 3D (`perspective`, `preserve-3d`, `translateZ`) plus SVG, which keeps phones fast. `.preserve-3d` must be on every wrapper between the perspective container and the 3D object.
- **Never put `filter` (incl. Tailwind `drop-shadow-*`) on a `preserve-3d` element or its 3D ancestors** — it flattens the children and the gunungan loses its thickness. Use a separate blurred shadow element instead.
- **`Gunungan`** (`components/three/Gunungan.tsx`): front face + 5 edge layers (`.gunungan-layer`, `translateZ(--i × -0.9px)`) + back face. Geometry (outline, `halfWidthAt`, `treeOfLife`) lives in `lib/gunungan.ts`, which is pure, deterministic, and tested. `GununganFrame` reuses the outline as an `objectBoundingBox` clip path for photos.
- **`JogloCover`**: `JogloRoof` + saka + kusen with two `GebyokDoor` leaves (hinged at the outer edges) + two gunungan in front. GSAP owns the transforms of the doors, gunungan, house, glow, and flash; set them with `gsap.set`, never with inline CSS.
- **`hooks/useScrollScene.ts` is the only scroll-motion system.** It covers reveals (`data-reveal`, `data-reveal-group/item`) and parallax (`data-depth`, `data-drift`, `data-spin`, `data-turn`, `data-twirl` + optional `data-twirl-track` ancestor, `data-parallax` + `<Photo parallax>`). Mobile uses half the amplitude, and reduced motion disables it all.
  - `data-twirl="deg"` rotates Y from −deg/2 to deg/2 over the track. If the object should end facing front, use a multiple of 720 (ending at 360°).
  - Never put a `data-*` motion attribute on an element that also has a Tailwind `translate-*` or an inline `transform`, or on one with a CSS `transition`. GSAP overwrites the transform; use an inner or outer wrapper instead.
- `useTilt` tilts objects toward the cursor (fine pointer only). `useScrollRefresh` calls `ScrollTrigger.refresh()` when `<main>` changes height.
- No looping or blinking animations (user preference). Everything is driven by scroll, the cursor, or a tap, and plays once.

## Visual system

- Tokens:
  - `gading`: the dominant colour. `kertas`: surfaces.
  - `prada` / `prada-light`: matte gold accents. `prada-deep`: small text accents (AA contrast on gading).
  - `sogan` / `sogan-deep`: batik brown, wood, buttons. `malam`: night scenes (cover, events, closing).
  - `bata`, `nila`, `daun`: only inside the gunungan's sunggingan and the melati garland.
  - `ink`: text.
- Fonts: `font-display` (Marcellus) for labels, numbers, buttons; `font-serif` (EB Garamond) for body, headings, and names (italic); `font-arabic` (Amiri) for verses.
- Classes: `.gading-paper` (kawung), `.malam-sky` (truntum + blencong glow), `.parang-band`, `.panel` / `.panel-dark` (double prada frame), `.gapura` (stepped clip-path), `.label`, `.btn-prada` (chamfered), `.btn-ghost`, `.btn-ghost-dark`, `.field`.
- Section labels are Javanese (Pambuka, Sang Penganten, Lelakon, Adicara, …); titles and body stay in Indonesian so every guest can read them.

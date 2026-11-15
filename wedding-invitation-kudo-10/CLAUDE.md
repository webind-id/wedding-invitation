# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3010 (demo) — /<slug>?untuk=<guest-code> for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"wedding-invitation-10" template** with **Rustic Bohemian** theme (terracotta, olive, cream, handmade paper textures, dried palm & pampas botanicals, wax seal, Libre Baskerville + Alex Brush script typography, tailored for outdoor & garden weddings). Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-10`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.

Shell order is `RusticCover` → `Hero` → `Verse` → `Couple` → `Story` → `Events` → `Gallery` → `Gifts` → `Rsvp` → `Closing` + `FloatingNav` + `MusicButton`.
- `RusticCover` is a 3D Boho Arch Gatefold card with `useTilt` cursor physics, 3D rotating doors (`rotationY: ±158deg`), physical wax seal at `translateZ(8px)`, and 3D layered background flora. An animated GSAP timeline runs on opening, then `onOpen` fires.
- `Hero` receives `isOpen` so its intro plays only after the card opens.

## Visual system

- Tokens:
  - `cream`: `#FAF6F0` (paper background); `cream-200`: `#F4EEE5` (card surface).
  - `terracotta`: `#C86D51` (signature rust/terracotta), `terracotta-700`: `#98442B`.
  - `olive`: `#6B7A5C` (botanical garden sage), `olive-700`: `#414E36`.
  - `sand`: `#E5DDD0` (deckle border & warm sand).
  - `earth-ink`: `#2D251E` for body text and high-contrast readability.
- Fonts:
  - `font-serif` (Libre Baskerville) for classic editorial titles and card headings.
  - `font-script` (Alex Brush) for romantic handwritten accents and ampersands.
  - `font-sans` (Plus Jakarta Sans) for body, details, dates, and form inputs.
  - `font-arabic` (Amiri) for Quranic verses.
- Classes: `.rustic-card`, `.boho-arch-frame`, `.btn-rustic-terracotta`, `.btn-rustic-olive`, `.btn-rustic-ghost`, `.rustic-field`, `.wax-seal`.

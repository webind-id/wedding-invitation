# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3011 (demo) — /<slug>?untuk=<guest-code> for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"wedding-invitation-11" template** with the **Lampion Malam (3D Sky Lantern)** theme: a starry indigo night sky full of floating paper lanterns built from pure CSS 3D, warm amber/gold glow, Cormorant Garamond + Pinyon Script typography. Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-11`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.

Shell order is `LanternCover` → `Hero` → `Verse` → `Couple` → `Story` → `Events` → `Gallery` → `Gifts` → `Rsvp` → `Closing` + `FloatingNav` + `MusicButton`.
- `LanternCover`: lanterns rising across the sky, a large monogram `Lantern3D` tilted by `useTilt`. Opening timeline: lantern grows → warm flare fills the screen → lantern flies up → cover fades, then `onOpen` fires.
- `Hero` receives `isOpen` so its intro plays only after the cover opens.
- `Closing` has a "Terbangkan Lampion Harapan" button: every tap releases a lantern that flies up over the page (capped at 12 in flight, removed on `animationend`).

## Lanterns

- `src/lib/lanterns.ts` (pure, tested in `tests/lanterns.test.ts`):
  - `lanternGeometry()` — six-sided frustum: face width `2·r·tan(π/n)`, inward tilt `atan(Δr/h)`, trapezoid `clip-path`, so face edges meet.
  - `skyLanterns(count, seed)` — deterministic placement (seeded PRNG, no hydration mismatch). Nearer lanterns are larger and faster.
  - `LANTERN_PALETTE` — `amber`, `rose`, `crimson`.
- `components/lantern/Lantern3D` — CSS 3D lantern (spinning prism, flickering flame, breathing halo). `flat` renders a cheap 2D version.
- `components/lantern/LanternSky` — `mode="rise"` (endless upward flight, cover/hero) or `mode="drift"` (bobbing + scroll parallax via `data-depth`). Only lanterns with `depth ≥ near3D` are 3D; odd ones are hidden on mobile. The container is `z-0` so section content always paints above it.
- All lantern/star animations are disabled under `prefers-reduced-motion`.

## Visual system

- Tokens:
  - `night`: `#0B1026` (sky), `night-950` `#05081A`, `night-800` `#121A3A` (card surface).
  - `ember`: `#F5A524` (lantern amber, primary accent); `vermilion`: `#D9482B` (red lantern).
  - `gold`: `#E7C27A` (borders, badges), `gold-light` `#F4DDAA`.
  - `moon`: `#FDF3DC` (body text), `moon-muted` `#C9C3D9`, `moon-subtle` `#9A95B8`.
- Fonts: `font-serif` (Cormorant Garamond), `font-script` (Pinyon Script — use serif italic for `&`, Pinyon's ampersand reads poorly), `font-sans` (Jost), `font-arabic` (Amiri).
- Classes: `.night-sky`, `.night-sky-deep`, `.starfield`, `.moon-disc`, `.glass-night`, `.lantern-frame`, `.badge-gold`, `.badge-ember`, `.btn-ember`, `.btn-night`, `.night-field`, `.text-glow`.

# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3002 (demo) — /<slug>?to=Nama for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

The **"kudo-2" template** ("Noir Premiere": the invitation as a film premiere) of a multi-template platform. Data is managed in **`../admin`**; this app only renders it from the shared Supabase project (schema in `../admin/supabase/schema.sql`). Runtime plumbing is identical to `../wedding-invitation-kudo`:

- `/` = demo from `sampleContent`; `/[slug]` = `loadInvitation()` in `src/lib/invitation.ts` (template code must equal `TEMPLATE_CODE` = `kudo-2`; drafts need a valid `?preview=` token).
- `/api/ucapan` = guestbook scoped by slug (published invitations only).
- **`src/shared/` is a copy from `../admin/src/shared/`** — never edit here; run `npm run shared:sync` in admin.
- Components read content via `useInvitation()` (`InvitationContext.tsx`): `content`, `pair`, `coupleLabel`, `monogram`, `timeZoneLabel`, `slug`, and **`photos`** — the de-duplicated pool from `photoPool()` (`src/lib/photos.ts`). Photo-heavy sections pick images with `photoAt(photos, i)`, so they still render when the gallery is small or empty.

## Visual system

- **Full-width responsive layout** (`max-w-6xl` containers), not a phone column. Sections in `InvitationShell` order: TicketCover → PosterHero → Prologue → Cast → Countdown → Showtimes → Scenes → Reel → Gift → Reviews → EndCredits. Nav ids (TopBar): `pemeran`, `jadwal`, `adegan`, `cuplikan`, `tanda-kasih`, `ulasan`.
- Tokens: `void`, `onyx`, `graphite`, `smoke`, `ivory`, `gold`, `gold-deep`, `ember`; fonts `font-display` (Bodoni Moda), `font-sans` (Jost), `font-arabic` (Noto Naskh Arabic).
- Shared classes in `globals.css`: `.film-grain` (put it on full-width elements, not inside `max-w-*`, or its edge shows), `.credit`, `.hairline`, `.gold-frame`, `.sprockets`, `.ticket-cut`, `.btn-gold`, `.btn-line`, `.input-noir`.
- Use `Photo` for every image, `Reveal` (`rise` | `iris` | `fade`) for scroll reveals, `Title` for section headings (reel number + credit label). Looping marquees (`animate-reel`, `animate-credits`) duplicate their list and translate −50%; keep item spacing as padding so both halves are equal height.

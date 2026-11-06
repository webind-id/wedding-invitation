# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3005 (demo) — /<slug>?to=Nama for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

The **"kudo-5" template** ("Old Money": classic engraved stationery, aristocratic, vintage) of a multi-template platform. Data is managed in **`../admin`**; this app renders it from the shared Supabase project (schema in `../admin/supabase/schema.sql`). Runtime plumbing matches the other templates:

- `/` = demo from `sampleContent`; `/[slug]` = `loadInvitation()` in `src/lib/invitation.ts` (template code must equal `TEMPLATE_CODE` = `kudo-5`; drafts need a valid `?preview=` token). `/api/ucapan` = guestbook scoped by slug.
- **`src/shared/` is a copy from `../admin/src/shared/`** — never edit here; run `npm run shared:sync` in admin.
- Components read content via `useInvitation()`; `photos` is the de-duplicated pool from `photoPool()`, picked with `photoAt(photos, i)`. The `.ics` download is generated on click (`downloadIcs`) — never render it into HTML.
- `src/lib/words.ts` writes dates/times in Indonesian words (`terbilang`, `dateInWords`, `timeInWords`), builds the Monday-first month grid (`monthGrid`, computed in the event's time zone), and the R.S.V.P. deadline. Fully unit-tested — keep it that way.

Shell order: `VellumCover` (fixed; vellum lifts for `LIFT_MS`, then `onOpen`) → `FormalCard` → `Couple` → `Calendar` → `Programme` → `Album` → `Gifts` → `ReplyCard` → `Valediction`.

## Visual system

- Tokens: `antique`, `parchment`, `burgundy`, `wine`, `bottle`, `umber`, `sepia`, `ink`; fonts `font-fell` (IM Fell English), `font-fell-sc` (small caps), `font-serif` (EB Garamond), `font-arabic` (Amiri).
- Classes in `globals.css`: `.paper` (static fibre + speckle texture via `::before`), `.film` (sepia photo filter), `.smallcaps`, `.btn-burgundy`, `.btn-plain`, `.ruled` (dotted-line inputs).
- Ornaments in `components/ui/Ornaments.tsx` (all original SVG): `CornerFlourish`/`FlourishCorners`, `Crest` (laurel leaves placed along a cubic Bézier stem), `Fleuron`, `EngravedCard` (double-rule printed card). Frames in `components/ui/Frames.tsx`: `AlbumPhoto` (photo corners + fixed tilt), `Cameo` (oval portrait), `SectionTitle`.
- `Photo` applies the film treatment by default and falls back to a sepia monogram panel.
- No looping/blinking animations (user feedback): reveals run once; tilts are static.

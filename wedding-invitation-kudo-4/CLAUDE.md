# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3004 (demo) — /<slug>?to=Nama for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

The **"kudo-4" template** ("Luxury Editorial": the invitation as one issue of a high-end wedding magazine) of a multi-template platform. Data is managed in **`../admin`**; this app renders it from the shared Supabase project (schema in `../admin/supabase/schema.sql`). Runtime plumbing matches the other templates:

- `/` = demo from `sampleContent`; `/[slug]` = `loadInvitation()` in `src/lib/invitation.ts` (template code must equal `TEMPLATE_CODE` = `kudo-4`; drafts need a valid `?preview=` token). `/api/ucapan` = guestbook scoped by slug.
- **`src/shared/` is a copy from `../admin/src/shared/`** — never edit here; run `npm run shared:sync` in admin.
- Components read content via `useInvitation()`; `photos` is the de-duplicated pool from `photoPool()`, picked with `photoAt(photos, i)`. The `.ics` download is generated on click (`downloadIcs`) — never render it into HTML (DTSTAMP causes hydration mismatches).

### Magazine structure

- `src/lib/issue.ts` defines `RUBRICS` (id, label, fictional page number) used by the contents page, section openers, and the running header. Each section root carries `id` + `data-rubric`; `RunningHeader` observes `[data-rubric]` to show the current rubric and folio.
- Shell order: `MagazineCover` (fixed overlay, exits upward) → `Contents` → `CoupleFeature` → `Agenda` → `FeatureStory` → `Portfolio` → `Registry` → `Letters` → `Colophon`.
- Figure numbers run across the issue: 01 contents, 02–03 couple, 04–05 story, 06+ portfolio (`FIRST_FIGURE` constants).

## Visual system

- Tokens: `ivory`, `bone`, `champagne`, `ink`, `stone`, `rule`, `gold`; fonts `font-serif` (Newsreader, opsz), `font-sans` (Hanken Grotesk), `font-arabic`. Easing `ease-editorial` / `EASE_EDITORIAL`.
- Classes in `globals.css`: `.rubric`, `.article` (+ `.drop-cap`), `.rule`, `.btn-ink`, `.btn-outline`, `.link-underline`, `.field`.
- Use `Opener` for section headers (rubric + folio + title + deck), `Figure` for photos (clip-path reveal + numbered caption), `Reveal` for text. Asymmetric layouts use the 12-column grid with `col-start` offsets and vertical `mt-*` shifts — avoid uniform card grids.
- No looping/blinking animations (user feedback): reveals run once.

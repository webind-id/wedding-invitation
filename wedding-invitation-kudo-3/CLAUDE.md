# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3003 (demo) — /<slug>?untuk=<guest-code> for a real invitation (copy a guest link from admin → Tamu)
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

The **"kudo-3" template** ("Chiaroscuro": cinematic, moody, photo-led) of a multi-template platform. Data is managed in **`../admin`**; this app renders it from the shared Supabase project (schema in `../admin/supabase/schema.sql`). Runtime plumbing matches the other templates:

- `/` = demo from `sampleContent`; `/[slug]` = `loadInvitation()` in `src/lib/invitation.ts` (template code must equal `TEMPLATE_CODE` = `kudo-3`; drafts need a valid `?preview=` token). `/api/ucapan` = guestbook scoped by slug.
- **`src/shared/` is a copy from `../admin/src/shared/`** — never edit here; run `npm run shared:sync` in admin.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.
- Components read content via `useInvitation()`; `photos` is the de-duplicated pool from `photoPool()`, picked with `photoAt(photos, i)`.

### The stage (core mechanic)

- `Stage` is a single `position: fixed` photo layer behind everything. It renders every pool photo stacked and crossfades opacity (`duration-slower` = 2.4s) to the active one, which gets `animate-ken-burns`. Atmosphere layers (dark wash, umber multiply, light leak, vignette, bottom gradient, grain) sit on top — tune darkness there.
- Every section is wrapped in `<Scene chapter photo anchor?>` (`components/ui/Scene.tsx`), which emits `data-stage` + `data-chapter`. `useSceneTracker` observes them with a thin band at the vertical centre and reports `{ stage, chapter }`; `InvitationShell` feeds `stage` to `Stage` and `chapter` to `Chrome`. `photo={null}` darkens the stage (used by gallery and guestbook, which have solid backgrounds).
- Chapters (ids, labels, Roman numerals) live in `src/lib/chapters.ts`; only the first scene of a chapter sets `anchor` (the `id` for menu links).
- Opening flow: `TitleSequence` (letterbox bars + timed lines) → on start, its exit closes the bars → `onExitComplete` sets `isRevealed` → black overlay fades out and the scene tracker activates.

## Visual system

- Tokens: `ink`, `charcoal`, `soot`, `umber`, `bronze`, `cream`, `haze`; fonts `font-serif` (Instrument Serif), `font-sans` (Manrope), `font-arabic` (Scheherazade New). Durations `duration-slow` (1.8s) / `duration-slower` (2.4s); ease `EASE_SLOW`.
- Classes in `globals.css`: `.kicker`, `.subtitle` (text shadow for legibility over photos — don't put it on outline/transparent text), `.glass`, `.grain`, `.btn-cream`, `.btn-ghost`, `.field`.
- Use `Reveal` (`blur` | `fade` | `rise`), `ChapterHeading`, `Photo`. Keep motion slow; everything must degrade under `prefers-reduced-motion`.

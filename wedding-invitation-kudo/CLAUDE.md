# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3000 (demo) — /<slug>?untuk=<guest-code> for a real invitation (copy a guest link from admin → Tamu)
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

The **"kudo" template** (botanical letterpress design) of a multi-template platform. Invitation data is managed in the sibling **`../admin`** app; this app only renders it. Both use the same Supabase project (schema lives in `../admin/supabase/schema.sql`).

- **Routes**: `/` renders a demo from `sampleContent` (guestbook disabled). `/[slug]` loads the invitation via `loadInvitation()` (`src/lib/invitation.ts`): only rows whose template code equals `TEMPLATE_CODE` and whose status is `published` — or drafts with a valid `?preview=` token signed with `PREVIEW_SECRET`. Content is validated against the shared zod contract; invalid content → 404.
- **`src/shared/` is a copy from `../admin/src/shared/`** — don't edit it here; change it in admin and run `npm run shared:sync` there.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.
- **Content flows through context**: `InvitationShell` wraps everything in `InvitationProvider`; components call `useInvitation()` for `content`, `pair` (couple in headline order), `coupleLabel`, `monogram`, `timeZoneLabel`, and `slug` (null in demo). Don't import content statically.
- **Guestbook**: `/api/ucapan?slug=` (GET) and POST `{ slug, … }` resolve the published invitation id server-side; drafts don't accept RSVPs. Validation shared via `src/lib/guestbook.ts`; honeypot + per-IP rate limit.
- **Shell**: cover → open state, scroll lock, `inert` on content while the cover shows, music starts on the open click. Desktop (lg+) = fixed `DesktopPoster` + 480px column; window scroll everywhere.

## Styling

- Tailwind tokens: `linen`, `parchment`, `forest`, `moss`, `sage`, `clay`, `blush`, `bark`; fonts `font-display` (Fraunces), `font-sans` (Plus Jakarta Sans), `font-arabic` (Amiri).
- Shared classes in `globals.css`: `.grain`, `.eyebrow`, `.ticket`, `.btn-*`, `.field`; arch shape `rounded-arch`.
- Use `FadeIn`, `Picture` (monogram fallback; media may be absolute Supabase URLs or `/images/…`), `Heading`, `cn()`. Animate only transform/opacity.

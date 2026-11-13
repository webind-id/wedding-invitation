# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3001
npm run build
npm test               # vitest — tests/ covers src/lib/** and src/shared/**
npm run typecheck
npm run shared:sync    # copy src/shared/* into every sibling template (…/src/shared/)
npm run shared:sync -- --check
```

## Architecture

Admin for a multi-template wedding-invitation platform. Each template is a **separate Next.js app** in a sibling folder (e.g. `../wedding-invitation-kudo`); all apps share **one Supabase project** (`supabase/schema.sql` here is the single source of truth for the schema).

- **Data model**: `templates` 1─< `invitations` (slug, template_id, `content` jsonb, status draft|published, message_template) 1─< `guestbook` / `invitees`. `guestbook_summary` is a per-invitation view. Media lives in the public storage bucket `invitation-media/<invitationId>/…`.
- **`src/shared/` is copied into templates** — never edit a template's copy. `contract.ts` is the zod schema for `invitations.content` (every template renders this shape), `preview-token.ts` signs draft-preview links (`PREVIEW_SECRET`), `sample.ts` is the starting content for new invitations and the template demo. Changing the contract means updating every template that renders the changed fields, then `npm run shared:sync`.
- **No API routes.** Pages are server components that read via `src/lib/repo/*` (service-role client, `server-only`). Mutations are server actions in `src/app/(panel)/**/actions.ts` and `undangan/[id]/_actions/*`. Every action starts with `await requireAdmin()`, validates with zod, and returns `ActionResult` (`src/lib/action.ts`); wrap the body in `attempt()` so unexpected errors become safe messages.
- **Auth**: `src/middleware.ts` checks the signed cookie on Edge. `requireAdmin()` (`src/lib/auth.ts`) additionally checks the account still exists and that the session's `ver` matches the current password-hash fingerprint, so a password change revokes sessions. `loadInvitation()` (`src/lib/load.ts`) is a per-request cache shared by the `[id]` layout and its tabs.
- **Guest links**: built **server-side only** by `lib/guest-link.ts` → `…?to=<name>&k=<sig>` where `sig` = `signGuestName()` from `shared/guest-token.ts` (HMAC with `PREVIEW_SECRET`, prefix `guest:`). Templates show the name only if `k` verifies, else `defaultGuest`. `GuestManager` receives ready-made `invitee.link`s (`LinkedInvitee`) — never build `?to=` links in client code (the secret must not reach the browser).
- **Content editor**: `ContentEditor` holds the whole content object; inputs bind by path (`["events", 0, "name"]`) through `EditorContext` and update immutably via `setIn`. Server zod errors come back keyed `"events.0.name"` and are shown next to the matching input.

## Conventions

- UI copy is Indonesian. Tailwind tokens: `paper`, `card`, `line`, `ink`, `muted`, `clay`, `forest`, `moss`, `danger`. Shared classes in `globals.css`: `.card`, `.btn-*`, `.input`, `.label`, `.hint`, `.error-text`, `.badge`.
- Keep validation limits identical between zod schemas and the SQL CHECKs.
- Never interpolate user text into PostgREST filter strings without `sanitizeSearch()`.

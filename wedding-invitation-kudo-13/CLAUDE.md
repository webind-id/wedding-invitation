# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3013 (demo) — /<slug>?untuk=<guest-code> for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"kudo-13" template**, theme **Gerbang Rembulan**: a Chinese-Indonesian wedding at a klenteng. A red dusk scene with karst mountains, xiangyun clouds, bamboo and plum (mei) trees; a round moon-gate name panel; red lanterns; coin and meander (回纹) patterns; Han characters (囍, 百年好合). It renders as a single 460px column on a dark coin-pattern page. The design source is `undangan-klenteng.html` (a static prototype; reference only, not served). It was built from the kudo-12 skeleton, so the structure mirrors kudo-12.

Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `klentengDemoContent` (`lib/klenteng-defaults.ts`: `sampleContent` with klenteng texts).
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-13`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- `/og` and `/[slug]/og` render the link-preview image (`components/og/OgCard.tsx`, fonts in `public/og/fonts`, including the Han TTF subset).
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`); legacy `?to=<name>&k=<sig>` still works. Logic: `resolveGuestName()` in `src/lib/page-props.ts`.
- **Music**: `musicSource(content, GUZHENG_MUSIC)` — the default song is a guzheng loop (`public/audio/guzheng.mp3`, rendered from the prototype's Web Audio composition). Admin can upload another song or turn music off.
- **This template does not render `content.ceremonies`** (Prosesi adat) by product decision. `Tradisi` (Sangjit, Chio Thau, Penjemputan, Tea Pai) is fixed template text.

Shell order is `KlentengCover` → `Hero` → `Verse` → `Couple` → `SaveTheDate` → `Events` → `Tradisi` → `Gallery` → `Story` → `Gifts` → `Rsvp` → `Closing`, plus `MusicButton` and a one-time `PetalShower` after opening.
- `KlentengCover` is fixed and locks scroll. Its lower part is transparent, so the hero scene shows through. Opening fades it out (`LEAVE_MS`), then `onOpen` fires.
- `Hero` receives `isOpen`; the section gets `played lanterns-show` and everything runs once via CSS transitions in `globals.css` (`.stage`, `.mid-bush`, `.near-tree`, `.fg-bush`, `.name-panel`, `.panel-line`, `.lanterns`).
- `Verse` shows the admin verse if set; otherwise the template's Shijing quote (执子之手，与子偕老 + pinyin). `InvitationShell` passes content through `withKlentengDefaults()`: the untouched stock QS. Ar-Rum : 21 verse and the stock "ridho Allah SWT" intro from `sampleContent` count as empty, so new invitations show the klenteng texts; anything the admin edited is shown as-is.

## Motion rules

- **No looping or blinking animations** (product owner preference). The prototype's swaying lanterns/trees/branches, drifting clouds, breathing 囍 badge, endless petals and spinning music icon were removed or made one-shot.
- **Exception, requested by the product owner: trees sway.** Palms/plum trees/bamboo sway from their base, fronds from the crown, bushes from the bottom, hanging branches from their hook — before and after opening, like the HTML prototype. CSS `.sway-tree` / `.sway-frond` / `.sway-bush` / `.sway-branch` (globals.css), pivot + timing from `lib/sway.ts` (seeded, tested). They run only while the section is on screen (`useSwayZone` adds `is-swaying`) and never under prefers-reduced-motion. Tree SVGs use `overflow="visible"` because branches reach past the viewBox.
- `useScrollScene` (GSAP) handles reveals (`data-reveal`, `data-reveal-group/item`) and photo parallax. `Hero` adds scrubbed parallax for `[data-speed]` (sun, mountains).
- Lanterns drop once when an ancestor gets `lanterns-show`. `.rise-in` uses `animation-fill-mode: backwards`.
- Everything is off under `prefers-reduced-motion`.

## Visual system

- `components/klenteng/Sprite.tsx` renders SVG symbols once (`#kl-temple`, `#kl-mountains`, `#kl-cloud`, `#kl-mei`, `#kl-mei-red`, `#kl-petal`, `#kl-branch`, `#kl-lantern`, `#kl-corner`, `#kl-divider`). Use them through `Glyph` and helpers in `components/klenteng/Ornaments.tsx` (`Divider`, `TopCorners`, `FretEdges`, `Lanterns`, `HangingBranches`).
- `lib/scenery.ts` (pure, seeded, tested) generates plum trees (recursive branches), bamboo groves, blossom bushes and the petal shower; `components/klenteng/Trees.tsx` draws them.
- Scene layering (lesson from kudo-12): ground strip behind the building, building base exactly on the ground line, mountains/bamboo standing on the ground line (see comments in `SaveTheDate` and `Closing`).
- `lib/labels.ts` (tested): `eventTimeLabel` ("s.d. selesai"), `panelNameSize` / `panelNameTracking` (long names shrink inside the moon gate).
- Tokens: `red-950…500`, `gold-600…300`, `cream-200/100`, `ivory`, `ink-700/500`, `jade`, `mei` / `mei-deep`. Fonts: `font-display` (Cinzel), `font-serif` (Cormorant Garamond, body), `font-script` (Pinyon Script, names; serif italic for `&`), `font-sans` (Poppins), `font-han` (Noto Serif SC subset — only the characters listed in `src/app/fonts/LICENSE.md`; add characters by re-downloading the subset), `font-arabic` (Amiri).
- Classes: `.sec`, `.sec-dark`, `.coin-bg`, `.coin-dark`, `.fret`, `.script-title`, `.display-title`, `.lead`, `.small-ui`, `.kicker`, `.btn-gold`, `.btn-red`, `.btn-outline`, `.moon`/`.moon-in`, `.field`/`.field-label`.

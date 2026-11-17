# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3012 (demo) — /<slug>?untuk=<guest-code> for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"kudo-12" template**, theme **Ronce Melati**: a Javanese wedding (pawiwahan). A dusk scene at a joglo pendopo, a gunungan name panel, melati garlands, kawung/parang batik. It renders as a single 460px column on a dark kawung page. The design source is `undangan-jawa.html` (a static prototype; reference only, not served).

Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-12`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- `/og` and `/[slug]/og` render the link-preview image (`components/og/OgCard.tsx`, fonts in `public/og/fonts`).
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.

Shell order is `MelatiCover` → `Hero` → `Verse` → `Couple` → `SaveTheDate` → `Events` → `Prosesi` → `Gallery` → `Story` → `Gifts` → `Rsvp` → `Closing`, plus `MusicButton` and a one-time `MelatiShower` after opening.
- `MelatiCover` is fixed and locks scroll. Its lower part is transparent, so the hero scene shows through. Opening fades it out (`LEAVE_MS`), then `onOpen` fires.
- `Hero` receives `isOpen`; the section gets the `played` class and everything runs once through CSS transitions in `globals.css` (`.stage`, `.mid-bush`, `.near-palm`, `.fg-bush`, `.name-panel`, `.panel-line`).
- `Prosesi` is fixed template text (no contract field).

## Motion rules

- **No looping or blinking animations** (product owner preference). The HTML prototype's swaying palms, garlands, breathing gunungan, endless petals and spinning music icon were all removed or made one-shot.
- **Exception, requested by the product owner: trees sway.** Palms/plum trees/bamboo sway from their base, fronds from the crown, bushes from the bottom, hanging branches from their hook — before and after opening, like the HTML prototype. CSS `.sway-tree` / `.sway-frond` / `.sway-bush` / `.sway-branch` (globals.css), pivot + timing from `lib/sway.ts` (seeded, tested). They run only while the section is on screen (`useSwayZone` adds `is-swaying`) and never under prefers-reduced-motion. Tree SVGs use `overflow="visible"` because branches reach past the viewBox.
- `useScrollScene` (GSAP) handles reveals (`data-reveal`, `data-reveal-group/item`) and photo parallax (`<Photo parallax>`). `Hero` adds its own scrubbed parallax for `[data-speed]` (sun, mountains).
- Ronce garlands drop once when an ancestor gets `ronce-show`.
- `.rise-in` uses `animation-fill-mode: backwards`, so finished elements keep their own transforms (hover lift on buttons).
- Everything is off under `prefers-reduced-motion`.

## Visual system

- `components/jawa/Sprite.tsx` renders the SVG symbols once (`#rm-gunungan`, `#rm-joglo`, `#rm-mountains`, `#rm-melati`, `#rm-melati-cluster`, `#rm-corner`, `#rm-divider`). Use them through `Glyph` and the helpers in `components/jawa/Ornaments.tsx` (`Divider`, `TopCorners`, `ParangEdges`, `Ronce`, `MelatiCorners`).
- `lib/scenery.ts` (pure, seeded, tested) generates the palms, bushes and the melati shower; `components/jawa/Trees.tsx` draws them. Same seed → same SVG on server and client.
- `lib/labels.ts` (tested): `eventTimeLabel` ("s.d. selesai" when `untilFinished`), `coupleHashtag` (`#SekarLanBayu`), `panelNameSize` (long names shrink to fit the gunungan), `usesIslamicGreeting` (salam only when an Arabic verse is set).
- `lib/gallery.ts` (tested): one photo → shown alone, no swipe hint or dots; more than `MAX_DOTS` → a "3 / 20" counter.
- Palette comes from the Rama/Shinta wayang art (`public/images/jawa/`, also the peacocks): espresso `#22160D`, antique gold `#CEAC59`, ivory `#FAF6F0`, blush `#F4B8C8`, deep rose `#D95B82`.
- Tokens: `sogan-950…500` (espresso family), `gold-600…300`, `cream-200/100`, `ivory`, `blush` / `blush-deep` (large accents only) / `blush-ink` (small pink text, AA on ivory), `leaf`, `melati`.
- Wayang art: Rama (left, faces right) and Shinta (right, faces left) slide in once in `Hero` (`.wayang`); a facing peacock pair (`merak-a-1`/`merak-a-2`) is decoration in the bottom corners of Events, in front of the cards (`z-[5]`, `pointer-events-none`), with scroll parallax (`data-depth` outer, `data-drift` inner).
- Fonts: `font-display` (Cinzel), `font-serif` (Cormorant Garamond, default body), `font-script` (Pinyon Script, names only; use serif italic for `&`), `font-sans` (Poppins, labels/forms), `font-jawa` (Noto Sans Javanese), `font-arabic` (Amiri).
- Classes: `.sec`, `.sec-dark`, `.kawung-bg`, `.kawung-dark`, `.parang`, `.script-title`, `.display-title`, `.lead`, `.small-ui`, `.kicker`, `.btn-gold`, `.btn-sogan`, `.btn-outline`, `.arch`/`.arch-in`, `.field`/`.field-label`.

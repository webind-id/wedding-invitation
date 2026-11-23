# CLAUDE.md

## Commands

```bash
npm run dev            # http://localhost:3014 (demo) — /<slug>?untuk=<guest-code> for a real invitation
npm run build
npm test               # vitest, tests/ covers src/lib/** and src/shared/**
npm run typecheck
```

## Architecture

This is the **"kudo-14" template**, theme **Taman Asmara**: a Javanese wedding (pawiwahan) opened by a garden. Plants grow and flowers bloom, Rama & Shinta greet the guest and then part like gate doors, revealing a joglo in front of a mountain, with butterflies flying around. It renders as a single 460px column on a dark maroon kawung page. It was built on the kudo-12 skeleton; the opening scene, palette and art are its own.

Data is managed in **`../admin`**, and this app renders it from the shared Supabase project. The runtime plumbing is identical to the other templates:

- `/` is a demo built from `sampleContent`.
- `/[slug]` calls `loadInvitation()`. `TEMPLATE_CODE` must be `kudo-14`, and drafts need a valid `?preview=` token.
- `/api/ucapan` is the guestbook. `GATEWAY_SECRET` lets the subdomain gateway pass the guest's real IP.
- `/og` and `/[slug]/og` render the link-preview image (`components/og/OgCard.tsx`, fonts in `public/og/fonts`).
- **`src/shared/` is a copy of `../admin/src/shared/`.** Never edit it here; run `npm run shared:sync` in admin instead.
- `.ics` files are built on click (`downloadIcs`) and never rendered into the HTML.
- **Guest name**: `?untuk=<code>` → name looked up in the admin guest list (`inviteeNameByCode()` in `src/lib/invitation.ts`, scoped to this invitation; unknown code → `content.defaultGuest`). Legacy links `?to=<name>&k=<sig>` still work: shown only when `k` verifies (`src/shared/guest-token.ts`, `PREVIEW_SECRET`). Typed/edited names fall back to `defaultGuest`. Logic: `resolveGuestName()` in `src/lib/page-props.ts`. The demo `/` still accepts any `?to=`.

Shell order is `TamanCover` → `Hero` → `Verse` → `Couple` → `SaveTheDate` → `Events` → `Prosesi` → `Gallery` → `Story` → `Gifts` → `Rsvp` → `Closing`, plus `MusicButton`.
- `TamanCover` is fixed, opaque and locks scroll: an ivory kawung page with a double gold arch frame (`.cover-arch`), the gunungan as a crown, the mountain faint at the bottom, flower sprays and leaves in the bottom corners (`.cover-orn`, a fade-up, not growth), and two butterflies. Opening fades it out (`LEAVE_MS`), then `onOpen` fires. The garden is deliberately **not** visible before opening.
- `Prosesi` is fixed template text (no contract field).

## Opening scene (`sections/Hero.tsx`)

The hero background continues the cover seamlessly (`.kawung-bg`, `.hero-dawn` glow, the mountain at the same 0.4 opacity with a `.fade-top` mask, and the gold arch frame `.hero-arch`, which fades when the gate opens), so the moment after the cover fades is never a plain page. Nothing plays until "Buka Undangan". Then two acts, one-shot CSS transitions in `globals.css` plus GSAP for the wayang:
1. **`played`** (on open): the ground rises first (`.tanah`, a gold-rimmed mound with a path from the joglo steps, in front of the tree bases so the trees grow out of it); then trees, bushes and flowers grow from the ground and bloom (`.grow-tree` / `.grow-bloom`), packed toward the centre so they **cover the joglo**, which fades in behind them. Rama & Shinta rise to the centre in front of it, almost touching, and bow (`taman/Wayang.tsx`). "Sugeng Rawuh" (`.greet-text`) shows in the sky. Butterflies arrive.
2. **`parted`** (`PART_MS` = 3.8 s later; immediately under reduced motion): Rama & Shinta turn on their gapit like gate doors (GSAP `rotationY`) while CSS `translate` moves them to the edges (`.parted .wayang`, in `cqw` units: the hero is `container-type: inline-size`, so this stays correct on resize). Plants part sideways (the mid layer leaves the frame), the joglo and the mountain show in full, the greeting fades and the names appear (`.panel-line`).

Layer order, back to front: mountain → far trees → near trees → ground → joglo → mid trees & bushes (`.tree-mid`, `.bush-mid`, in front of the joglo) → bushes → wayang → flowers (incl. `.flower-mid`) → butterflies. `taman/Plant.tsx` gives each plant three nested layers (position + part / grow / sway) so their transforms never collide. Each plant's resting `translate` is the "closed" (inward) position; `.parted` overrides it.

## Motion rules

- One-shot by default (product owner preference): no blinking, no looping decoration.
- **Exceptions, requested by the product owner:**
  - **Plants sway** gently from their base (`.sway-plant`, timing from `lib/sway.ts`).
  - **Butterflies fly and flap their wings** (`taman/Butterfly.tsx`). Wings: one image split at the body axis into two `clip-path` halves, each turned with `rotateY` (`.kupu-wing`, `flap-l`/`flap-r`). Flight: GSAP from waypoint to waypoint (`lib/butterfly.ts`, seeded and tested), turning the head toward the direction of flight. Positions are recomputed from the container size on every leg.
  - Both run only while their section is on screen (`useSwayZone` returns `"is-swaying"`, which the section puts in its own className — it is React state on purpose: a manual `classList.add` is wiped when the className re-renders, e.g. Hero `played` → `parted`; butterflies also pause their GSAP timeline through an IntersectionObserver) and never under prefers-reduced-motion. With reduced motion, butterflies sit still with open wings.
- `useScrollScene` (GSAP) handles reveals (`data-reveal`, `data-reveal-group/item`) and parallax (`<Photo parallax>`, `data-depth`/`data-drift` on the Events flowers).
- `.rise-in` uses `animation-fill-mode: backwards`, so finished elements keep their own transforms (hover lift on buttons).
- Entrance keyframes on images (`.cover-orn`) animate `translate` and have no `to` step: mirrored art uses `transform: scaleX(-1)` and the faint mountain has its own opacity, and animating `transform`/`opacity` to fixed values made them flip and jump at the end of the animation.

## Sections below the hero: "Lakon ing Taman"

The sections are deliberately **not** the kudo-12/13 skeleton: no side border strips, no centred heading + divider, no single centred arch photo, no countdown boxes, no icon cards. Each section is a *babak* (act) of the wayang play that the opening staged in the garden:

| Section | Babak | Signature |
| --- | --- | --- |
| Verse | Pambuka | Verse inside a light gold-lined gate (`.gerbang.is-light`), flower sprays at its feet |
| Couple | Jejer | Zig-zag rows: photo in a gate with a butterfly perched on top; bio on the other side with Shinta (bride) / Rama (groom) faint behind it — chosen from `content.bride`, not display order |
| SaveTheDate | Pangeling | Editorial date plate (`datePlate`, tested) beside a gated photo; countdown in four small light gates |
| Events | Adicara | Night garden; leaf-shaped cards (`.daun-lg`) with a date column, a flower sprig in the corner, `.btn-line` buttons |
| Prosesi | Upacara | Stepping-stone path (`.path-stone`, terracotta like the joglo path) joined by pebbles |
| Gallery | Kenangan | Carousel slides framed as gates |
| Story | Lampahan | Night garden; a winding gold vine drawn on scroll (`data-draw`), a gold leaf per chapter |
| Gifts | Tanda Katresnan | Accounts as leaf-shaped letters with a perforated butterfly stamp (`.perangko`, CSS mask; its shadow sits on a wrapper because `filter` is clipped by `mask`) |
| Rsvp | Pangestu | Leaf-shaped stats, entries marked with a small butterfly |
| Closing | Tancep Kayon | The gunungan planted on top of an ivory gate window (mountain, ground `.tanah.is-static`, joglo, butterflies) — in wayang, planting the kayon ends the play |

Shared pieces: `taman/Babak.tsx` (left-aligned heading: butterfly + babak name, script title, gold vine drawn on scroll) and `taman/Foliage.tsx` (`LeafHem`: leaf clusters hanging across a section's top edge; `NightLeaves`: faint leaf silhouettes, clipped inside dark sections so they never leak onto light ones). Shapes: `.daun` / `.daun-lg` (leaf: two big round corners, two sharp); every `.btn` is leaf-shaped and swaps its corners on hover. `.gerbang` uses percentage radii — a `999px` radius makes the browser scale **all** radii down and flattens the top.

## Visual system

- Classes: `.sec`, `.sec-dark` (night-garden gradient), `.kawung-bg`, `.babak*`, `.daun`/`.daun-lg`, `.gerbang` (`.is-light`), `.leaf-hem`, `.night-leaf`, `.path-stone`, `.perangko`, `.tanah`, `.script-title`, `.lead`, `.small-ui`, `.kicker`, `.btn-gold`, `.btn-marun`, `.btn-outline`, `.btn-line`, `.field`/`.field-label`.
- Art lives in `public/images/taman/` (made from `../assets/kudo-14/*.png`: transparent edges cleaned, cropped, WebP). `bg-gunung.webp` is **flattened onto ivory `#FAF6F0`** (line art with alpha was ~4× larger), so it may only sit on an ivory background (hero, the Closing arch window).
- Palette from the art: maroon `marun-950…500` (`#2B0A14` … `#9A4A5E`: butterfly wings, joglo roof, leaves), antique gold `gold-600…300`, ivory `#FAF6F0`, `cream-200/100` (pink-tinted), `blush` `#F4B8C8` / `blush-deep` `#D95B82` (large accents only) / `blush-ink` `#A8385E` (small pink text, AA on ivory), `melati`.
- Wayang art: Rama (`rama1`, left, faces right) and Shinta (`shinta1`, right, faces left). Tap one → it spins and hops.
- `lib/labels.ts` (tested): `eventTimeLabel` ("s.d. selesai" when `untilFinished`), `coupleHashtag` (`#SekarLanBayu`), `usesIslamicGreeting` (salam only when an Arabic verse is set).
- `lib/gallery.ts` (tested): one photo → shown alone, no swipe hint or dots; more than `MAX_DOTS` → a "3 / 20" counter.
- Fonts: `font-display` (Cinzel), `font-serif` (Cormorant Garamond, default body), `font-script` (Pinyon Script, names only; use serif italic for `&`), `font-sans` (Poppins, labels/forms), `font-jawa` (Noto Sans Javanese), `font-arabic` (Amiri).

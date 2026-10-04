# Landing overhaul — design

**Date:** 2026-10-03
**Status:** approved in conversation, pending spec review
**Branch:** `feature/landing-overhaul` (worktree
`/mnt/media/Sources/GitHub/Personal/.worktrees/jorius-landing-overhaul`, from
`origin/main` 704d9a5). Everything stays local until the owner has tested it.
**Sources:** the designer's review in Figma (owner's editable copy
`k6Ly2myap09mpOaT0rpdry`, captures in `docs/design/2026-10-03-landing-overhaul/figma/`),
the interactive mock approved on 2026-10-03
(`docs/design/2026-10-03-landing-overhaul/mock.html`, also published privately at
https://claude.ai/artifact/R1DtaYdhnGswpmpqsFKaKT), and the owner's answers
recorded in §2.

## 1. Goal

Make the landing page readable and give it one job: a hiring manager or a
client lands, understands who Jose is in one screen, and has three ways to
reach him without scrolling. A senior UI/UX designer reviewed the live page
and marked what cannot be read (red), what is hard to read (yellow), what is
never read because of where it sits ("por posición no se lee"), and what
should become cards. This design applies that review and the owner's
decisions on top of it.

The review was of the dark theme. The same rules apply to the light theme.

## 2. Decisions carried into this design

| Decision | Choice | Why |
|---|---|---|
| Section order | Hero → Work → Record → Now → Contact | owner's brief; Writing & OSS and Why leave the landing |
| Writing | top-bar entry becomes a route link to `/writing` | the section is gone; the page already exists |
| Open source | nothing on the landing; `/projects` is the home for repositories | owner: "the OSS will be present in the /projects one as already it is" |
| Hero | variant A of the mock: the owner's name as the headline | owner picked A over keeping the stacked slogan |
| Hero buttons | WRITE ME →, WHATSAPP, BOOK 20 MIN → in the hero, nowhere else | the WRITE ME button at the end of the hero was marked "not read because of its position"; owner asked for all three up top and none in Contact |
| Hero eyebrow | "FULL-STACK ENGINEER · SECURITY", a boxed WORK FROM ANYWHERE, then "GMT-5 · Colombia" | owner: highlight working from anywhere, not "remote from Colombia"; drop the "replies within 24h · email" line |
| Work and Record | grids of cards in the `/projects` card style | the designer's "Mejor en cards" on Work; owner extended it to Record |
| Record dates | a bold ink row with the company's accent bar, same place on every card | owner: dates must be visible and easy to identify |
| Now | stays a list; "Last updated" sits beside the NOW. title; entries reordered looking, co-founding, writing, building, home | owner kept the list; the designer's "Orden" column gives the order (3, 4, 1, 5, 2) |
| Card typography | body text in Atkinson Hyperlegible Next; titles, labels and chips in Space Mono | matches the blog reader, which was chosen for legibility; owner confirmed |
| Legibility floor | no text under 13px; `dim` raised to pass 4.5:1 on paper in both themes | the red and yellow boxes are all 10–12px `dim` text |
| Vignette | removed, site-wide | every flagged element sat in a corner or at an edge, where `DarkGrain` darkens the paper by up to 55%; owner chose "off" over "soft" |
| Top bar | the designer's centred-brand layout; "press /" hint dropped | owner confirmed; the palette still opens with `/` |
| Hover glitch | pulses on and off while the pointer stays on the element | owner: the hover glitch "shouldn't be permanent" |
| Ambient glitch | unchanged on the big titles | not part of the review |
| Scan lines | unchanged | not part of the review |
| Languages | English and Spanish, as today | every new string gets both |
| Analytics | no new events | the existing outbound-click listener records every link host, including wa.me and cal.com |

## 3. Out of scope

- The `/writing`, `/projects`, `/pgp` and 404 pages beyond removing the
  vignette overlay and the body-font change on the project card (§4.9).
- The Dark Galaxy teaser and its branch.
- The legacy `/about` and `/contact` routes under `LegacyLayout`.
- New content. The Now entries keep their text and the 2026-06-10 date; the
  owner updates content through Pages CMS as before.
- Imagery for the Work and Record cards.
- Mobile menu redesign beyond listing the same links as the desktop bar.

## 4. Design

### 4.1 Page composition and navigation

`DirectionB.tsx` renders, in order: `BTopBar`, `BHero`, `BServices` (Work),
`BExperience` (Record), `BNow`, `BContact`, then `ScanLines` and the
`CommandPalette`. `BOssWriting` and `BWhy` are deleted. `DarkGrain` is deleted
(§4.3).

Section numbering follows the new order: Work `§ 01`, Record `§ 02`, Now
`§ 03`, Contact `§ 04 · Contact`. The jump ids stay `b-services`,
`b-experience`, `b-now`, `b-contact` so the scroll-restore logic in
`DirectionB` and `useScrollToSection` is untouched.

Top-bar nav keys: `now`, `work`, `record`, `contact` scroll to their sections;
`writing` is a `<Link to="/writing">`, like `projects`. `PALETTE_SECTIONS`
drops `b-writing` and `b-why`. The palette gains one command, "show writing"
(target `/writing`, hint `jorius.github.io/writing`), placed before "show
projects".

### 4.2 Theme tokens and the legibility floor

`B_THEMES` in `ThemeContext.tsx`:

| Token | Dark | Light | Contrast on paper |
|---|---|---|---|
| `dim` (was `#7c7a72` / `#6d6a62`) | `#a4a197` | `#5f5c55` | 5.6:1 / 5.6:1 on paper, 4.9:1 / 5.2:1 on `sub` |
| every other token | unchanged | unchanged | `ink` on paper stays 12.6:1 / 16.5:1 |

A new `src/utils/contrast.ts` exports `contrastRatio(hexA, hexB): number`
(WCAG relative luminance). `contrast.test.ts` asserts `ink`/`paper`,
`dim`/`paper` and `dim`/`sub` are at least 4.5 in both modes, so the floor
cannot regress silently. The tokens are imported from `ThemeContext` for the
test; `B_THEMES` becomes an exported constant.

Size floor on the landing: labels and meta lines 13px, card bodies 15px, chips
12px, kickers 16px. The existing 10px and 11px values in the landing
components are raised to 13px; nothing new is added below 12px.

Fonts. `index.html` already loads Space Mono, Atkinson Hyperlegible Next and
IBM Plex Mono. A new `src/styles/fonts.ts` exports the three stacks as
constants (`FONT_MONO`, `FONT_BODY`, `FONT_CODE`) so components stop repeating
family strings. `FONT_BODY` is Atkinson Hyperlegible Next with `system-ui`
fallback and is used for: hero tagline and body paragraph, section kickers,
card bodies (Work, Record, `/projects`), Now entry text and the Sivers note.
Everything else stays Space Mono; the PGP fingerprint stays IBM Plex Mono.

### 4.3 Vignette removed

`src/components/primitives/DarkGrain.tsx` is deleted, together with its
imports in `DirectionB`, `Writing`, `Projects`, `Pgp` and `NotFound`.
`ScanLines` stays and still keys off `ThemeTokens.scan`. Nothing else reads
`scan`.

### 4.4 Top bar (`BTopBar`)

Desktop (≥ 768px): a three-column grid `1fr auto 1fr`.

- Left: `Now · Work · Record · Writing · Contact · Projects` then the
  `● Available · Q4 2026` dot line, 13px, hover glitch (owner, 2026-10-04:
  Projects and the availability moved left).
- Centre: the brand block, a `<Link to="/">` with `JORIUS` (14px, 700,
  letter-spacing 0.08em, hover glitch) over `VOL. X · 2026` (12px, `dim`,
  letter-spacing 0.08em), centred, as in the designer's proposal
  (`figma/02-topbar-proposal-centered-brand.png`).
- Right: `Dark Galaxy` in `ink` preceded by an 8px purple dot (`#9D4EDD`,
  same glow treatment as the green availability dot; no arrow), the language
  button, the theme button. The "press /" hint is removed; the `/` shortcut and the palette
  are unchanged.

Mobile (< 768px): brand block at the left, hamburger at the right; the
slide-down panel lists the five anchors, Projects, Dark Galaxy, then the
availability line and the two buttons, as today. The `Vol. X` line shows in
the brand block on mobile too.

The bar keeps its sticky, hide-on-scroll-down behaviour and the blurred
background.

### 4.5 Hero (`BHero`)

Layout: grid `1fr clamp(280px, 32vw, 480px)`, gap 48px, `align-items:
center` (the text column centres on the portrait), padding
`56px clamp(32px, 6vw, 96px) 48px` so both columns sit in from the edges
(owner, 2026-10-04); on mobile one column, padding `36px 20px 32px`,
portrait centred at max-width 360px. The left column is a vertical stack with
a 22px gap:

1. **Eyebrow** (flex, wrap, gap `8px 10px`, 13px, uppercase, letter-spacing
   0.14em): `hero.eyebrow` in `dim`; `hero.anywhere` in `ink`, 700, inside a
   1px `ink` border with `4px 9px` padding; `hero.tz` in `dim`.
2. **Name**: `<h1>` set from `JORIUS.name` uppercased on one line, never
   wrapped (`white-space: nowrap`), `clamp(44px, 8.6vw, 132px)`, line-height
   0.9, letter-spacing -0.045em, 700, as one `Glitch strong` with ambient
   period 4200; a `TypedCaret` follows (owner, 2026-10-04: single line).
3. **Tagline**: `hero.intro` in `FONT_BODY`, `clamp(17px, 1.6vw, 21px)`,
   line-height 1.5, max-width 56ch.
4. **Buttons** (flex, wrap, gap 10px). Shared style: inline-flex, padding
   `13px 20px`, 13px, letter-spacing 0.06em, 1px `ink` border, no underline,
   label wrapped in `Glitch trigger="hover"`.
   Each label is preceded by a 16px icon in the same slot (owner, 2026-10-03:
   icons instead of the "→" arrows the labels used to carry).
   - `hero.writeMe` ("WRITE ME") → `mailto:${JORIUS.email}`, filled (`ink`
     background, `paper` text), `FaEnvelope`.
   - `hero.whatsapp` → `https://wa.me/<digits>`, outlined, `FaWhatsapp`,
     `aria-label` and `title` carry the number as today's Contact button
     does.
   - `hero.book` ("BOOK 20 MIN") → `https://cal.com/jorius`, outlined,
     `FaCalendarAlt`.
5. **Body**: `hero.body` in `FONT_BODY`, 16px, line-height 1.6, max-width
   62ch.

Right column: `Portrait`, unchanged.

Removed from the hero: the scrambled `PERSONAL RECORD · <month>` line, the
top-right intro paragraph, the bottom grid (body, "Operating from", WRITE ME,
"replies within 24h"). `Scramble` stays in the codebase (the Dark Galaxy
teaser uses it); `currentMonthYear` is removed from `dateLabels.ts` if nothing
else imports it.

### 4.6 Section head (`BSectionHead`)

Props: `id`, `num`, `label`, `kicker`, and a new optional `aside?: ReactNode`.
Layout: padding `72px 32px 24px` (mobile `52px 20px 16px`), top rule, a
vertical grid with a 14px gap:

- `§ <num>` at 13px `dim`, letter-spacing 0.15em, uppercase.
- A row (`flex`, `align-items: flex-end`, gap 32px, wrap) with the `<h2>`
  (`clamp(40px, 7vw, 104px)`, letter-spacing -0.035em, line-height 0.9,
  `Glitch strong` ambient 6000) and, when given, the `aside`.
- The kicker, under the title, in `FONT_BODY`, 16px, line-height 1.5,
  `dim`, max-width 62ch.

The right-aligned kicker column is gone; that is where every section's yellow
box was.

### 4.7 Card primitives (`BCardGrid`, `BCard`)

`BCardGrid` renders a `display: grid` with `gap: 1px`, `background: rule`,
and a 1px `rule` top and bottom border, so the 1px lines between cards come
from the gap and work for any column count. Columns: 3 at ≥ 1024px, 2 at
768–1023px, 1 below (it reads `useIsMobile` and `useIsTablet`). It takes
`children` and renders inside the section's horizontal padding. Empty tracks
in the last row are covered by paper-coloured filler cells (`fillerCount` in
`src/utils/gridFill.ts`), so the rule background never shows as a block.

`BCard` is the cell: `background: paper`, padding 24px (18px on mobile),
`display: flex; flex-direction: column; gap: 12px; min-width: 0`, class
`b-index-card`; paper and the hover tint both come from `index.html` through
the `--paper` and `--sub` variables (an inline background would outrank the
`:hover` rule), wrapped in `Reveal` with the same per-column stagger
`BProjectCard` uses today. It takes `children`, `index`, an optional `style`,
and an optional `href` + `hrefLabel`: when given, a stretched anchor under the
content makes the whole cell a link (the project card uses the live build,
else the repository, via `primaryProjectLink`); link rows inside the card sit
above it with `position: relative; z-index: 1`, and the card's hover drives
the title glitch through `Glitch`'s `hoverActive` (owner, 2026-10-04).

`BProjectCard` is rewritten on top of `BCard` (its `isLastInRow` border logic
goes away) and `Projects.tsx` wraps its list in `BCardGrid`. Its summary
paragraph switches to `FONT_BODY` at 15px; everything else on `/projects` is
visually unchanged.

### 4.8 Work (`BServices`)

Three cards, one per `work.json` service, in a `BCardGrid`:

- Top row (flex, space-between, 13px `dim`, uppercase, letter-spacing
  0.1em): `#<n>` (plain hash, owner 2026-10-04) and `sections.work.cardKind`
  ("SERVICE").
- Title: `pickLocale(s.title)` at 24px, 700, letter-spacing -0.02em,
  line-height 1.08, `Glitch trigger="hover" strong`.
- Body: `pickLocale(s.body)` in `FONT_BODY`, 15px, line-height 1.55.
- Chips: `StackChip` for each stack entry, font-size raised to 12px inside
  `StackChip` (this also affects `/projects`, intentionally).

### 4.9 Record (`BExperience`)

Six cards, one per `JORIUS.experience` entry, in a `BCardGrid`:

- Top row (flex, baseline, gap 14px): `#1`… at 13px `dim` uppercase, then
  the **dates** right beside it: `${from} → ${to}` (`to` of `Present`
  translated), 15px, 700, letter-spacing 0.02em, `ink`,
  `font-variant-numeric: tabular-nums`. No accent bar and no location
  (owner, 2026-10-03/04); the accent survives as the dot on the logo tile.
- Company row: the 56px white logo tile with the accent dot, as today, next
  to the company name at 20px, 700, `Glitch trigger="hover"`.
- Role: 15px, 700.
- Body: `experience.<key>.body` in `FONT_BODY`, 15px, line-height 1.55.

### 4.10 Now (`BNow`)

`now.json` entries are reordered to looking, co-founding, writing, building,
home (content change, no schema change).

`BSectionHead` receives `aside`: the `now.lastUpdatedLabel` at 13px `dim`
over the date at `clamp(22px, 2.4vw, 32px)`, 700, letter-spacing -0.02em,
tabular numerals, `Glitch trigger="hover" strong`.

Below the head, inside the section padding and under a 1px `rule`: one row
per entry, grid `150px 1fr` (one column on mobile), gap 16px, padding
`16px 0`, bottom border `soft`, `align-items: baseline`. The label is 13px
`ink`, uppercase, letter-spacing 0.12em; the text is `FONT_BODY`, 16px,
line-height 1.5, max-width 70ch. After the list, the Sivers note in
`FONT_BODY`, 15px, `dim`, max-width 62ch, 18px above.

The two-column layout and the right-hand "Last updated" block are gone.

### 4.11 Contact (`BContact`)

Unchanged in structure, with these edits:

- The availability column is removed altogether (owner, 2026-10-03: no
  buttons, and no "Open to roles · quarter" line); the grid becomes two
  columns, email and elsewhere.
- Sizes: `§ 04 · Contact` 13px; PGP line 15px; fingerprint 13px IBM Plex
  Mono; `[ ENCRYPTED ]` 13px; affiliation tag and name 13px; footer line 13px.
- Footer strings: `contact.footer.set` becomes "SET IN SPACE MONO & ATKINSON
  HYPERLEGIBLE · NO COOKIES" / "EN SPACE MONO Y ATKINSON HYPERLEGIBLE · SIN
  COOKIES"; `contact.footer.vol` becomes "VOL. X, NO. 011" / "VOL. X, N.º
  011".

### 4.12 Glitch hover pulses (`Glitch`)

`trigger="hover"` changes from "on while hovered" to a pulse loop: on
`mouseenter` the component turns on for 90–250ms with a fresh seed, off for
180–700ms, and repeats until `mouseleave`, which clears the timers and turns
it off. `ambient`, `always` and `off` are unchanged. When
`prefers-reduced-motion: reduce` matches, neither hover nor ambient glitches
run (today the component ignores the preference).

The durations live in a new pure module `src/utils/glitchTiming.ts`:
`hoverOn(rand)`, `hoverOff(rand)`, `ambientWait(period, glitch, rate, rand)`
and `ambientOn(rand)`, each taking the random number as an argument so
`glitchTiming.test.ts` can assert the ranges. `Glitch.tsx` calls them.

This changes hover behaviour on every page that uses `trigger="hover"`
(Writing, Projects, Pgp, the top bar), which is what the owner asked for.

### 4.13 Content, data and copy

`src/data/jorius.ts` loses `hire_why`, `testimonials` and their interfaces.
`src/content/now.json` is reordered (§4.10). `work.json` is unchanged.

Locale keys under `directionB` (both files, English / Spanish):

| Key | English | Spanish |
|---|---|---|
| `hero.eyebrow` | Full-stack engineer · Security | Ingeniero full-stack · Seguridad |
| `hero.anywhere` | Work from anywhere | Trabajo desde cualquier lugar |
| `hero.tz` | GMT-5 · Colombia | GMT-5 · Colombia |
| `hero.whatsapp` | WHATSAPP | WHATSAPP |
| `hero.book` | BOOK 20 MIN | AGENDA 20 MIN |
| `sections.work.num` / `record.num` / `now.num` | 01 / 02 / 03 | 01 / 02 / 03 |
| `sections.work.cardKind` | Service | Servicio |
| `sections.contact` | § 04 · Contact | § 04 · Contacto |
| `palette.items.showWriting` | show writing | ver escritos |
| `palette.items.writingHint` | jorius.github.io/writing | jorius.github.io/writing |

Added: `read.noPost`, the copy `/writing/<unknown-slug>` shows (it used to
read `oss.writingEmpty`).

Kept: `hero.intro`, `hero.body`, `hero.writeMe`, `topbar.*` except
`pressKey` and `nav.index`, `sections.{work,record,now}.{label,kicker}`,
`now.lastUpdatedLabel`, `experience.*`, `contact.*` except `book` and
`whatsappLabel` (moved to `hero.book` and `hero.whatsapp`), `projectsPage.*`,
`read.*`, `palette.*`, `portrait.*`.

Removed: `hero.meta`, `hero.headline.*`, `hero.operating`,
`hero.operatingValue`, `hero.remote`, `hero.replies`, `topbar.pressKey`,
`topbar.nav.index`, `sections.index`, `sections.writing`, `sections.why`,
`oss.*`, `hireWhy.*`, and the unused `testimonials` block.

### 4.14 Crawler copy (`scripts/llms`)

`load.ts` stops reading `JORIUS.hire_why` and `hireWhy`, and reads
`hero.anywhere` and `hero.tz` instead of `operatingValue` and `remote`
(`BioInput` gets `anywhere` and `tz` in their place). `render.ts` drops the
"why" block from the bio; the one-line summary becomes
`${role}. ${anywhere}, ${tz}. ${intro}` and the bullet becomes
`- Location: ${tz}, ${anywhere.toLowerCase()}`. `load.test.ts` and the
`render.test.ts` fixture follow. The published posts, projects, sitemap and
robots output are unchanged, and the existing guards (no WhatsApp digits, no
Dark Galaxy mention, no root-relative links) keep passing.

### 4.15 Removals and housekeeping

Deleted: `BOssWriting.tsx`, `BWhy.tsx`, `DarkGrain.tsx`,
`hooks/useGitHubRepos.ts`, `utils/languageIcons.tsx`. The `.b-why-step` rules
leave `index.html`. `VITE_GITHUB_USERNAME` leaves `.env.example`, the deploy
workflow and the CLAUDE.md env section, since nothing calls the GitHub API
any more. `CLAUDE.md`'s project-structure paragraph is updated to the new
section list, the card primitives and the removal of the vignette.

The live GitHub "top six repositories" list disappears with the section; the
owner accepted `/projects` as the only place repositories are listed.

## 5. File map

| Action | Files |
|---|---|
| Create | `src/components/direction-b/BCardGrid.tsx`, `BCard.tsx`, `src/styles/fonts.ts`, `src/utils/contrast.ts` + test, `src/utils/glitchTiming.ts` + test |
| Modify | `DirectionB.tsx`, `BTopBar.tsx`, `BHero.tsx`, `BSectionHead.tsx`, `BServices.tsx`, `BExperience.tsx`, `BNow.tsx`, `BContact.tsx`, `BProjectCard.tsx`, `StackChip.tsx`, `paletteSections.ts`, `CommandPalette.tsx`, `primitives/Glitch.tsx`, `contexts/ThemeContext.tsx`, `pages/{Projects,Writing,Pgp,NotFound}.tsx`, `index.html`, `src/content/now.json`, `src/data/jorius.ts`, `src/i18n/locales/{en,es}.json`, `src/utils/dateLabels.ts`, `scripts/llms/{load,render}.ts` + tests, `.env.example`, `.github/workflows/deploy.yml`, `CLAUDE.md` |
| Delete | `BOssWriting.tsx`, `BWhy.tsx`, `primitives/DarkGrain.tsx`, `hooks/useGitHubRepos.ts`, `utils/languageIcons.tsx` |

## 6. Testing and verification

- `npm test`: the two new pure modules (`contrast`, `glitchTiming`), the
  updated `scripts/llms` tests, and the existing suites.
- `npm run lint` and `npm run build` (the CI gate) pass.
- Headless Playwright capture of `/` at 1440px and 400px in both themes,
  compared by eye against `docs/design/2026-10-03-landing-overhaul/mock.html`
  with the mock's defaults (hero A, vignette off).
- A checklist against the review, each item verified on the dev server:

| Review mark | Element | Fix |
|---|---|---|
| red | top bar "Vol. X · 2026" | 12px `dim` at 5.6:1, centred under the brand, no vignette |
| yellow | "Dark Galaxy ↗" purple text | `ink` text with a purple dot |
| yellow | "Available · Q4 2026" | `ink`, 13px |
| yellow | "press /" | removed |
| yellow | hero "PERSONAL RECORD · <month>" | removed |
| position | hero top-right intro | becomes the tagline under the name |
| yellow | Work / Record / Now kickers | under the title, 16px Atkinson |
| cards | Work rows | `BCardGrid` of three cards |
| position | WRITE ME at the end of the hero | three buttons under the tagline |
| yellow | Now left labels | 13px `ink` |
| yellow | Sivers note | 15px `dim` at 5.6:1 under the list |
| order | Now entries 3, 4, 1, 5, 2 | `now.json` reordered |

- The owner tests on `npm run dev`; nothing is pushed until he says so.

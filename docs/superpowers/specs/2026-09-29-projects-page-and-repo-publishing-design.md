# Projects page and repository publishing — design

**Date:** 2026-09-29
**Status:** approved in conversation, pending spec review
**Scope:** one feature branch in this repo, `feature/projects-page`, plus a set of
one-off changes in nine other repositories of the `jorius` GitHub account. The
site branch merges to `main` only after the owner has tested it.

## 1. Goal

Give the site a curated `/projects` page: one card per project the owner wants a
hiring manager to see, in English and Spanish, each linking to its repository
and, when one exists, to a live deployment. Publish the local-only projects the
page depends on (the four pokedex repositories and balatro-advisor), and put the
old repositories the page links to into a state that is safe and honest to show
(no real keys, no dead deploy pipelines, a live GitHub Pages build where a static
build is possible).

The page is a static record. The GitHub API is not consulted; the six-repo
"Open source" list on the landing page keeps doing that job.

## 2. Decisions carried into this design

Recorded from the 2026-09-29 session.

| Decision | Choice | Why |
|---|---|---|
| Shape | a standalone route like `/writing` and `/pgp`, not a landing-page section | the owner asked for a page; the landing page keeps its current sections |
| Content source | hand-written JSON, one file per project, `{ en, es }` per string | full control of wording, ordering and private repos; no API rate limits; matches how `writing/` content works |
| Granularity | one card per **project**, not per repository | pokedex is four repos, ArrowFin is three; a visitor cares about the project |
| Live links | only where a deployment exists or is created in this work | `pokedex-web` needs a live backend and balatro-advisor watches a local save file, so neither gets a Pages deploy |
| New deploys in this work | `pratech-tt-web` and `wolox-tt` on GitHub Pages | both are static CRA apps with a mocked backend; the owner asked for them |
| my-steam-dashboard | repository link only, plus a real README | the owner calls it raw and far from what he wants |
| pyxcommerce-web | left out | one "Initial commit" from 2020 with no README and no email trail; the owner will look into it himself |
| ArrowFin | card written now, shipped as `draft: true` | the three repos are private until the owner flips them; a draft card costs nothing and lands with a one-line change |
| Ciruela portfolio | links to the original repo `cmrivera97/cmrivera97.github.io` and the live site | the owner's private mirror stays private |
| Visibility of published repos | public | the page is a portfolio |
| License for the new repos | MIT, `Copyright (c) 2026 Jose Ríos` | same as `engineer-mentat-academy` |
| History | never rewritten | repo rule: merge only, no rebase, no history rewriting; the one exposed dev password is neutralised by a new commit and by changing it locally |
| Legacy `/portfolio` | redirects to `/projects`; `Portfolio.tsx`, `portfolio.json` and `private-repos.json` are removed | it still renders placeholder projects such as "Project Alpha" and is reachable by URL |
| Imagery | none in this version | thumbnails would need eleven screenshots kept current; the card reads fine as text |
| Top bar | the "Academy ↗" entry is **replaced** by "Projects" (owner, 2026-09-29) | the academy is the first card on the page, so a second entry in the bar is noise; `JORIUS.links.academy` and the `nav.academy` key go with it |
| Analytics | no new events | the existing `outbound-click` listener already records every link click with its host |

## 3. Out of scope

- A Pages deploy or hosted backend for pokedex, a demo mode for `pokedex-web`.
- Deploying `my-steam-dashboard` (needs a hosted CORS proxy) or committing its
  23 uncommitted local changes; they are left exactly as they are.
- Any change to `feature/darkgalaxy-section` or the blog-draft branch. When the
  Dark Galaxy branch resumes, `main` gets merged into it (never rebased); it
  touches `App.tsx`, `CommandPalette.tsx` and both locale files, so conflicts
  are expected and resolved in that merge.
- Removing or rewriting the exposed synack keys from git history. The owner
  deletes the Google key in the Google Cloud console; the Bing key is dead
  since Microsoft retired the Bing Search APIs in 2025.
- Filtering, search, tags or a per-project detail page. Eleven cards fit on
  one screen.
- A content-balancing pass on card copy beyond the owner's review.

## 4. Design

### 4.1 Publishing the five new repositories

Local checkouts under `/mnt/media/Sources/GitHub/Personal/` (pokedex) and
`/mnt/media/Sources/GameProjects/` (balatro). None has a remote today.

| Repo | GitHub name | Description (from the README) | Topics |
|---|---|---|---|
| pokedex-web | `jorius/pokedex-web` | React 19 + Vite frontend for the pokedex ecosystem with a live backend switcher, nine game themes and a pokeball economy | `pokedex`, `react`, `vite`, `typescript`, `rtk-query`, `tailwind` |
| pokedex-api-express-ts | `jorius/pokedex-api-express-ts` | Pokedex REST API, Express 5 + TypeScript, clean architecture, PostgreSQL (Drizzle), two-tier PokeAPI caching; schema and infra owner | `pokedex`, `express`, `typescript`, `drizzle`, `postgresql`, `redis` |
| pokedex-api-express-js | `jorius/pokedex-api-express-js` | Pokedex REST API, Express 5 + JavaScript, contract-identical mirror of the TypeScript service | `pokedex`, `express`, `javascript`, `drizzle`, `postgresql` |
| pokedex-api-dotnet | `jorius/pokedex-api-dotnet` | Pokedex REST API, ASP.NET Core (.NET 10), EF Core database-first, contract-identical with the Node services | `pokedex`, `dotnet`, `aspnet-core`, `ef-core`, `postgresql` |
| balatro-advisor | `jorius/balatro-advisor` | Watches Balatro's autosave and recommends what to play or discard, scored with the vendored Balatrolator engine | `balatro`, `nodejs`, `game-tools` |

Per repository, in this order, each step its own commit in the repo's existing
commit style (capitalised verb subjects in the pokedex repos, conventional
`type: subject` in balatro, no co-author trailers):

1. **LICENSE** (MIT, `Copyright (c) 2026 Jose Ríos`) and a `license` field in
   `package.json` where one exists. balatro keeps `vendor/balatrolator/LICENSE.txt`
   untouched and its `"private": true` (it is not an npm package).
2. **pokedex-api-dotnet only:** `src/PokedexApi.Api/appsettings.Development.json`
   gets `Password=CHANGE_ME` in the connection string. The old value stays in
   history, so the owner changes that local Postgres password if it is used
   anywhere else. Said once, here.
3. **README cross-links:** the four pokedex READMEs link siblings as
   `../pokedex-api-express-ts`, which resolves on disk but 404s on GitHub.
   Replace those with `https://github.com/jorius/<repo>` links.
4. Create the public repo with `gh repo create jorius/<name> --public
   --description ... --source . --remote origin` over the `github-jorius` SSH
   alias, push `main`, set topics. Only `main` is pushed (balatro's merged
   `feat/advisor` branch stays local).

Secrets scan before the first push: the histories were grepped on 2026-09-29
for key-like assignments and `.env` files; the only hit was the dev password
above. `pokedex-web/.env` is git-ignored and never tracked.

### 4.2 Old repositories: hygiene and Pages deploys

All four already live on GitHub; local clones sit under
`/mnt/media/Sources/GitHub/Personal/`. Pushes to their default branches are
authorised by the owner for exactly the changes below.

**synack-web-search-engine** (`master`, link only)
- `.env.example`: the three values become `your-search-engine-id`,
  `your-google-api-key`, `your-bing-api-key`.
- `README.md` lines that show the real key values as "should look like"
  examples get generic placeholders of the same shape.
- `.github/workflows/master_synack-web-search-engine.yml` (Azure deploy, app
  gone, secrets gone) is deleted so a push does not produce a failed run.
- The "Currently deployed" line in the README notes that the Azure deployment
  was retired.

**pratech-tt-web** (`master`, Pages deploy at `https://jorius.github.io/pratech-tt-web/`)
- `master` is the untouched CRA scaffold. The application (JSON-driven dynamic
  form, mocked login, EN/ES, Material UI, `HashRouter`) lives on
  `feature/1/check-validations-for-each-input`, which already contains
  `master` and `playground`. Merge that branch into `master` with a merge
  commit. The eleven Dependabot branches are left alone.
- Add `.github/workflows/deploy-pages.yml`: on push to `master` and manual
  dispatch; `actions/setup-node` with **Node 12** (the lockfile pins
  `node-sass` 4.13.1 through `node-sass-chokidar`; its prebuilt Linux binary
  exists for Node 12 (ABI 72) and not for Node 14, verified 2026-09-29);
  `npm ci`; build with
  `CI=false` (CRA 3 fails on lint warnings when `CI=true`) and
  `PUBLIC_URL=/pratech-tt-web/`; upload `build/`; `actions/deploy-pages`. The
  build script is the repo's production one (`build:prd`, which sets
  `REACT_APP_ENV=production`; the branch has a single `globals.json` and
  switches on that variable in `config/index.js`). The service mocker is on
  in `globals.json`, so login works with `admin@pratech.com` / `123`.
- Enable Pages with `build_type=workflow` through the API, set the repo
  homepage to the Pages URL.
- `HashRouter` means deep links need no 404 fallback.

**wolox-tt** (`master`, Pages deploy at `https://jorius.github.io/wolox-tt/`)
- `master` already holds the app (`HashRouter`, env picked by `REACT_APP_ENV`).
  The mock API host it points at (`apiary-mock.com`) answers 404 and the
  service mocker is off, so `src/config/settings/env-production.json` gets
  `"serviceMocker": { "isEnabled": true }`. Login then works with
  `admin@wolox.com.ar` / `123456`, as the README states.
- Replace `.github/workflows/master_wlx-tt.yml` (Azure, app gone) with the
  same Pages workflow as pratech but on Node 14 (`node-sass` 4.14.1 has a
  Node 14 binary and no Node 16 one), script `build-prod`,
  `PUBLIC_URL=/wolox-tt/`.
- README: the "Currently deployed in" Azure link becomes the Pages URL.
- Enable Pages, set the homepage.

**Build verification before any push:** each of the two apps is built once in
a `node:14` Docker container from a copy of the checkout on ext4 (the
scratchpad), with the exact commands the workflow will run. If `node-sass`
fails to install even there, the fallback is to swap it for `sass` in that
repo, which becomes its own commit; the workflow then moves to Node 20.

**my-steam-dashboard** (`main`, link only)
- A real `README.md` written on a branch created from a separate worktree off
  `main`, so the 23 uncommitted files in the working tree are not touched. It
  covers: what it is (a Nothing-design Steam library dashboard: library grid
  and list with stats, favourites, achievement tracker with guides, settings
  with export; the family page is reachable but hidden because it needs a
  Steam client session token), the API-key and Steam-ID setup screen, the
  required CORS proxy (`proxy/local.mjs` for dev; Cloudflare Worker, Netlify
  Function and Vercel Edge variants), scripts, env vars, status (early,
  unfinished) and stack. Merged into `main` with a merge commit, pushed. The
  existing `docs/add-readme` branch holds only the Vite template README and is
  superseded.

### 4.3 The `/projects` route

`src/pages/Projects.tsx`, registered in `App.tsx` beside `/pgp`, outside
`LegacyLayout`. Built on the same skeleton as `Pgp.tsx`:

- `BTopBar`, `DarkGrain`, `ScanLines`, `CommandPalette` with `PALETTE_SECTIONS`.
- An `<article>` wider than `/pgp` (max width 1180px, same paddings) with, in
  order: the `← back` link (`directionB.read.back`), a meta line
  `§ PROJECTS · <n>` where `n` is the number of cards actually rendered (10 in
  production while the ArrowFin card is a draft, 11 in dev), the `h1`, a
  two-sentence intro, then the card grid.
- Deep links work through the existing `404.html` fallback like every other
  route.

`/portfolio` becomes `<Route path="/portfolio" element={<Navigate to="/projects" replace />} />`.
`src/pages/Portfolio.tsx`, `src/data/portfolio.json` and the unused
`src/data/private-repos.json` are deleted. `Header.tsx` (the legacy layout used
by `/about` and `/contact`) points its portfolio item at `/projects`.
`CLAUDE.md`'s note naming `Portfolio.tsx` as the canonical renderer is updated.

### 4.4 Content model

`src/content/projects/<id>.json`, one file per project, loaded by
`loadProjects()` in `src/utils/content.ts` through
`import.meta.glob('../content/projects/*.json', { eager: true })`, the same
mechanism as posts.

```ts
export type ProjectKind = 'personal' | 'assessment' | 'client' | 'tool' | 'package';
export type ProjectStatus = 'wip' | 'archived';
export type ProjectLinkKind = 'repo' | 'live' | 'npm' | 'docs';

export interface ProjectLink {
  kind: ProjectLinkKind;
  url: string;
  label?: Localized;   // overrides the default label for the kind, e.g. "Frontend", "API (TS)"
}

export interface ProjectEntry {
  id: string;          // file name, unique
  order: number;       // explicit, ascending; spaced by 10 so a card can be inserted
  year: string;        // display text: "2026", "2017–2023"
  kind: ProjectKind;
  status?: ProjectStatus;
  draft: boolean;
  title: Localized;
  summary: Localized;  // one or two sentences
  details: Localized[];// zero to four short lines
  stack: string[];     // StackChip names; unknown names fall back to a monogram
  links: ProjectLink[];
}
```

`loadProjects()` normalises `draft` and `details` (missing → `false` / `[]`),
drops entries whose `title` or `summary` is not a localized pair, drops drafts
when `import.meta.env.PROD`, and sorts by `order`. The published/draft rule
lives in a pure `selectPublished(entries, isProd)` so it can be unit-tested
without touching `import.meta.env`.

### 4.5 The card

`src/components/direction-b/BProjectCard.tsx` replaces the dormant
`ProjectCard.tsx` (never imported on `main`; deleted together with its
`directionB.projects.*` locale keys). It keeps the visual language of the
direction-b index card: the `b-index-card` class (hover rules already in
`index.html`), rule borders between cells, `Reveal` entrance, `Glitch` on the
title, `StackChip` for the stack.

Card anatomy, top to bottom:

1. Meta row: `№ 01` on the left; on the right the kind label
   (`directionB.projectsPage.kind.<kind>`) and, when `status` is set, a small
   status badge (`WIP` / `ARCHIVED`).
2. Title, `Glitch trigger="hover" strong`, 22px mobile / 26px desktop.
3. Year line, dim, 12px.
4. Summary, 13px, line-height 1.55.
5. Details, an unordered list without bullets, 12px, dim, each line prefixed
   with `—`.
6. Stack chips.
7. Links row: one `<a target="_blank" rel="noopener noreferrer">` per link,
   text = the link's `label` or the default for its kind
   (`directionB.projectsPage.link.<kind>`: "repository", "live", "npm",
   "docs"), each followed by `↗`. The card itself is not a link, because a
   card can carry several.

Grid: CSS grid, three columns from the desktop breakpoint the site already
uses (`useIsMobile` false), one column on mobile. Borders follow the
`ProjectCard` rule: right border except on the last cell of a row, bottom
border always. No thumbnail box.

### 4.6 Navigation and palette

- `BTopBar`: a `projectsLink` (`<Link to="/projects">`, ink colour, `Glitch`
  on hover, no arrow because it is internal) **replaces** the `academyLink`
  in the same slot, after the section links and before Dark Galaxy, on
  desktop and in the mobile panel. The academy stays reachable from its card.
  `JORIUS.links.academy` (type and value) and the locale key
  `directionB.topbar.nav.academy` are removed; the new key
  `directionB.topbar.nav.projects` = "Projects" / "Proyectos".
- `CommandPalette`: a command item `directionB.palette.items.showProjects`
  ("show projects" / "ver proyectos"), target `/projects`, internal, hint
  `jorius.github.io/projects`.
- New locale block `directionB.projectsPage`: `meta`, `title`, `intro`,
  `kind.{personal,assessment,client,tool,package}`,
  `status.{wip,archived}`, `link.{repo,live,npm,docs}`, `empty`. Both locale
  files change together, as the repo rule requires.

### 4.7 Card inventory

Order and facts. Copy (title where it differs from the repo name, summary,
details) is written during implementation in both languages and reviewed by
the owner before merge.

| # | id | kind | year | status | draft | links |
|---|---|---|---|---|---|---|
| 1 | engineer-mentat-academy | personal | 2026 | | no | repo `github.com/jorius/engineer-mentat-academy`, live `jorius.github.io/engineer-mentat-academy/` |
| 2 | arrowfin-trader-daily-snapshot | assessment | 2026 | | **yes** | repo ×3 (`arrowfin-mt-daily-snap-svc` "API", `arrowfin-mt-daily-snap-fe` "Frontend", `arrowfin-llm-usage-docs` "Submission docs"), live `arrowfin-mt-daily-snap.netlify.app` |
| 3 | carolina-rivera-portfolio | client | 2026 | | no | repo `github.com/cmrivera97/cmrivera97.github.io`, live `cmrivera97.github.io` |
| 4 | pokedex-ecosystem | personal | 2026 | | no | repo ×4 ("Frontend", "API · Express TS", "API · Express JS", "API · .NET") |
| 5 | balatro-advisor | tool | 2026 | | no | repo |
| 6 | my-steam-dashboard | personal | 2026 | wip | no | repo |
| 7 | ticket-dashboard-challenge | assessment | 2026 | | no | repo. Copy says it is the challenge the owner wrote for candidates |
| 8 | pratech-tt-web | assessment | 2020 | archived | no | repo, live `jorius.github.io/pratech-tt-web/` |
| 9 | wolox-tt | assessment | 2020 | archived | no | repo, live `jorius.github.io/wolox-tt/` |
| 10 | synack-web-search-engine | assessment | 2020 | archived | no | repo |
| 11 | waveless | package | 2017–2023 | | no | repo, npm `npmjs.com/package/waveless` |

Stacks come from each README (for example pokedex: React 19, TypeScript,
Express, .NET, Postgres, Redis, Drizzle; ArrowFin: Next.js, NestJS, Prisma,
Postgres, WebSockets; waveless: Node). Names not in `StackChip`'s `TECH`
table render with the built-in monogram fallback; the table is not extended
in this work unless a chip looks wrong in the headless check.

### 4.8 Testing

Unit (vitest, no DOM, as the repo does today):

- `content.test.ts`: `selectPublished` keeps non-drafts, drops drafts only when
  `isProd`, sorts by `order`; the real content set has unique `id`s and
  `order`s, every entry has `en` and `es` for `title`, `summary` and each
  `details` line and link `label`, every `kind`/`status`/link `kind` is in
  its union, every link `url` is `https://`.
- A pure `projectLinkLabel(link, lang, t)` helper test for the default/override
  rule.

Headless browser (Playwright, the install at the geromanager-qa workspace,
never the headed MCP): `/projects` renders the published card count in EN and
ES, the top-bar link is present on `/` and `/projects`, `/portfolio` lands on
`/projects`, no console errors.

Build gate: `npm run lint` (husky) and `npm run build` (`tsc -b`) must pass;
CI runs `npm test` before deploy.

For the two Pages deploys: the container build above, then the live URL
answers 200 and the login screen renders with the mocker's credentials.

### 4.9 Delivery order

1. Repositories first (4.1, then 4.2), because the cards need the final URLs.
   Each repo's changes are pushed as soon as that repo is verified.
2. The site branch (4.3–4.7) on `feature/projects-page` from the worktree at
   `/mnt/media/Sources/GitHub/Personal/.worktrees/jorius-projects-page`.
   Commits use the hook's verb list, 72-char subjects, no trailers. The spec
   and later the plan are committed on the same branch.
3. Owner tests the branch locally (`npm run dev` on a port other than 5173,
   which he uses himself). Merge to `main` with a merge commit only on his
   go; the Pages deploy follows automatically.
4. Follow-ups, not in this work: flip the ArrowFin card to `draft: false`
   when the repos go public; merge `main` into `feature/darkgalaxy-section`;
   revisit a Steam dashboard deploy when it is closer to what the owner wants.

## 5. Things stated once

- The synack Google key is real (Google identified its project on
  2026-09-29; the Custom Search API is disabled there). It stays in git
  history; the owner deletes it in the console.
- The pokedex .NET repo's history keeps the old local Postgres password.
- `ntfsfix` was used on the MEDIA drive today; it clears the dirty flag but
  does not repair. The owner runs `chkdsk /f` from Windows at some point.

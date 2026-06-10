# Content dynamism, OPSEC cleanup & Pages-CMS writing system — design

**Date:** 2026-06-10
**Branch (planned):** `feature/content-dynamism-and-writing-cms`
**Status:** Approved design, ready for implementation plan

## Goal

A single-branch pass over the Direction-B homepage that (1) replaces hard-coded
dates with live values, (2) tightens copy and OPSEC, (3) inverts the PGP
fingerprint animation, (4) adds GitHub + language icons to the OSS list, and
(5) introduces a Git-based CMS (pagescms.org) for the NOW, WORK and WRITING
content, including a new dedicated Writing page with a categorized tree and a
"paper" reading pane.

RECORD stays in code (`jorius.ts`) — it is stable structured career data and
would be fragile to edit through a CMS form.

## Scope / non-goals

- **In scope:** the 10 changes below, on one feature branch with focused commits.
- **Not migrating** existing articles — there are zero writing posts today, so
  the WRITING CMS ships as "ready to author" plumbing + config, not a migration.
- **Section heads** (num / label / kicker) stay in i18n — they are chrome, not
  editable content.
- **No server code.** Pages CMS is a hosted Git CMS; Jose connects the repo at
  app.pagescms.org via GitHub OAuth and it commits content files back to the
  repo. We only ship the `.pages.yml` config + the content files + the app
  plumbing that reads them.

---

## 1. Live dates — `src/utils/dateLabels.ts` (new)

Follows the existing `src/utils/` convention.

- `currentMonthYear(lang: 'en' | 'es'): string` → `"JUNE 2026"` / `"JUNIO 2026"`
  via `Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' })`, uppercased.
- `currentQuarter(): string` → `"Q2 2026"` using `Math.floor(month / 3) + 1`.
- `currentYear(): number`.

Quarter/year semantics: **current** quarter & year, recomputed from the clock —
never stale, never hand-maintained.

Wiring:

| Where | Before | After |
|---|---|---|
| `BHero` meta | `PERSONAL RECORD · NO. 010 · APR 2026` | `PERSONAL RECORD · {currentMonthYear()}` |
| `BTopBar` availability | `{available} · Q3 2026` (hard-coded) | `{available} · {currentQuarter()}` |
| `BContact` status | i18n `"Open to roles · Q3 2026"` | i18n → `"Open to roles"` / `"Abierto a roles"`, component appends ` · {currentQuarter()}` |
| `BContact` footer copyright | `© 2026 …` | `© {currentYear()} …` |
| `BTopBar` volume / footer vol | `Vol. X · 2026` | year → `{currentYear()}`; `Vol. X` / `NO. 010` stay as editorial flavor |

i18n: `hero.meta` becomes the prefix `"PERSONAL RECORD · "` (both locales);
component appends the computed month/year.

## 2. EXHIBIT_0N — `Portrait.tsx`

`directionB.portrait.exhibit` becomes the prefix `"EXHIBIT_"`. The component
renders `` `${prefix}${String(activeIdx + 1).padStart(2, '0')}` `` so the label
tracks the active cat (`EXHIBIT_01` … `EXHIBIT_04`) as the carousel rotates — a
quiet *detalle de fina coquetería*.

## 3. Medellín → Colombia (OPSEC)

- `src/data/jorius.ts`: every `loc: 'Medellín, Colombia'` → `'Colombia'`;
  `locale: 'Medellín → remote'` → `'Colombia → remote'`.
- i18n `directionB.hero.operatingValue` (both locales) → `'Colombia · GMT-5'`.

No other city references remain (verified by grep).

## 4. Hero body rewrite — `directionB.hero.body` (both locales)

Reposition from solo / legacy / 6–12-month framing to large-scale,
full-ecosystem capability.

**EN:**
> "I design and ship large-scale systems end to end — frontend, backend, AWS,
> infrastructure, CI/CD. I plug into big teams and established ecosystems, or
> architect new ones from scratch: the kind of platform that has to hold up at
> Twitch-, Spotify-, or Amazon-scale from day one."

**ES:**
> "Diseño y entrego sistemas a gran escala de punta a punta — frontend, backend,
> AWS, infraestructura, CI/CD. Me integro a equipos grandes y ecosistemas ya
> establecidos, o los diseño desde cero: plataformas que deben sostenerse a
> escala Twitch, Spotify o Amazon desde el primer día."

## 5. Fingerprint inversion — `BContact` `PgpBlock`

Flip the current behavior:

- **Default (not hovered):** the fingerprint is **continuously scrambled** — the
  `requestAnimationFrame` hex-scramble loop runs while *not* hovered. Label reads
  `[ ENCRYPTED ]`; `Glitch` trigger `always`.
- **On hover (decrypt):** the loop stops, the **real** fingerprint is shown, the
  label flips to `[ DECRYPTED ]`, `Glitch` calms.

Same `scrambleFp` helper and hex alphabet; the `hovered` branch in the effect and
the `displayedFp`/label/`Glitch` ternaries are inverted. The scan-line overlay
stays tied to a "reading/active" state (shown on hover).

## 6. OSS GitHub + language icons — `BOssWriting`

Per-repo, in the OSS column:

- `FaGithub` (already in `react-icons`) as the mark on / beside the repo link.
- A **language icon** for `r.language` via `react-icons/si` (Simple Icons — no
  new dependency), through a small `language → { Icon, color }` map
  (e.g. TypeScript, JavaScript, Python, Go, Rust, Shell…), with a graceful text
  fallback (current `· {language}`) for unmapped languages.

Map lives in a focused module (e.g. `src/utils/languageIcons.tsx` or alongside
`techConfig`), keeping `BOssWriting` readable.

---

## 7. Pages CMS — content model & plumbing

### Content lives in `src/content/`, paired `en`/`es` per item

`pickLocale(field, lang)` helper (new, e.g. `src/utils/content.ts`):
`(field: { en: string; es: string }, lang) => field[lang] ?? field.en`.

**`src/content/now.json`**
```jsonc
{
  "lastUpdated": "2026-04-11",
  "siversNote": { "en": "…", "es": "…" },
  "entries": [
    { "key": "writing", "en": "…", "es": "…" }
    // building, looking, home, co-founding …
  ]
}
```

**`src/content/work.json`**
```jsonc
{
  "services": [
    { "id": "01", "stack": ["TypeScript", "React", "…"],
      "title": { "en": "…", "es": "…" },
      "body":  { "en": "…", "es": "…" } }
    // 02, 03
  ]
}
```

**Writing categories — `src/content/writing/categories/<id>.json`** (predefined
select list, CMS-editable, ordered):
```jsonc
{ "id": "scifi", "order": 1, "label": { "en": "Short Sci-Fi Stories", "es": "Relatos cortos de ciencia ficción" } }
// "tech" → Technical Write-Ups, "cybersec" → Cybersec, …
```

**Writing articles — `src/content/writing/posts/<slug>.json`**
```jsonc
{
  "slug": "the-origin",
  "category": "scifi",          // reference → categories collection id
  "date": "2026-06-01",
  "len": "8 min",
  "tag": "fiction",
  "draft": false,
  "title": { "en": "The Origin", "es": "El origen" },
  "body":  { "en": "# markdown…", "es": "# markdown…" }
}
```

### App reads content via `import.meta.glob`

- `now.json` / `work.json`: direct `import` (static).
- categories + posts: `import.meta.glob('../content/writing/**/*.json', { eager: true })`
  → static-build friendly for GitHub Pages. A `loadWriting()` helper returns
  `{ categories: Category[], posts: Post[] }` sorted by category `order` then post
  `date` desc, filtering `draft` in production.

### Components repointed

- `BNow` → reads `now.json` (entries, lastUpdated, siversNote) via `pickLocale`.
  Section head stays i18n.
- `BServices` → reads `work.json` services (title/body via `pickLocale`, stack as
  is). Replaces `directionB.services.*` + `JORIUS.services`.
- `BOssWriting` writing list → reads the posts (sorted), each row links to
  `/writing/:slug`. (OSS column unchanged except the icons from §6.)
- RECORD (`BExperience` / `jorius.ts`) — untouched.

### `.pages.yml` (repo root)

Defines three editable areas so pagescms.org renders forms:
- `now` — a single `file` entry: object with `lastUpdated` (date), `siversNote`
  (object: en/es text), `entries` (list of objects: key, en, es).
- `work` — a single `file` entry: `services` list (id, stack list, title en/es,
  body en/es).
- `writing-categories` — a `collection` over `src/content/writing/categories/`
  (id, order number, label en/es).
- `writing-posts` — a `collection` over `src/content/writing/posts/` with a
  `category` **reference** field → `writing-categories`, date, len, tag, draft
  boolean, title en/es, and `body` en/es as **rich-text** (markdown).

Jose connects the repo at app.pagescms.org (GitHub OAuth). Commits land on a
branch and deploy via the existing Pages workflow.

---

## 8. New Writing page — `src/pages/Writing.tsx`

Routes (in `App.tsx`): `/writing` and `/writing/:slug`. The existing
`/read/:slug` route redirects to `/writing/:slug` so any existing links/palette
entries keep working. (`Read.tsx` is replaced/retired by the new page.)

### Layout — two panes (Direction-B aesthetic)

- **Left — category tree:** categories ordered by `order`, each expanding to its
  posts (title for the active locale). Active post highlighted; its branch
  expanded. Built from `loadWriting()`. Uses existing primitives (`Glitch` on
  hover) for continuity.
- **Right — "paper" reader:** a box sitting on the section background with a
  **1px rule + hard/sharp offset shadow** (e.g. `box-shadow: 8px 8px 0 <ink>`),
  matching the brutalist-editorial hard-edged look. Reading column ~64ch,
  ~17px body, line-height ~1.7. Title in **Space Mono** for continuity; body in a
  softer reading face (Urbanist/Inter). Body markdown rendered with
  **`react-markdown` + `remark-gfm`** (new deps), styled to the palette.
- `/writing` with no slug → defaults to the first post of the first category.
  `/writing/:slug` → loads that post and expands its branch.
- **Mobile:** the tree collapses to an accordion/dropdown above the reader.

### New dependency

`react-markdown` + `remark-gfm` — the only new runtime deps. Article bodies are
markdown (Pages CMS rich-text), rendered in the reader pane.

---

## Files touched (summary)

**New**
- `src/utils/dateLabels.ts`
- `src/utils/content.ts` (`pickLocale`, `loadWriting`)
- `src/utils/languageIcons.tsx`
- `src/pages/Writing.tsx`
- `src/content/now.json`, `src/content/work.json`
- `src/content/writing/categories/*.json`, `src/content/writing/posts/*.json` (seed examples)
- `.pages.yml`

**Modified**
- `src/components/direction-b/BHero.tsx` (meta date)
- `src/components/direction-b/BTopBar.tsx` (quarter, year)
- `src/components/direction-b/BContact.tsx` (status quarter, footer year, fingerprint inversion)
- `src/components/direction-b/Portrait.tsx` (EXHIBIT_0N)
- `src/components/direction-b/BNow.tsx` (read now.json)
- `src/components/direction-b/BServices.tsx` (read work.json)
- `src/components/direction-b/BOssWriting.tsx` (icons + writing list → content + /writing links)
- `src/data/jorius.ts` (Colombia; possibly drop `services`/`writing` once migrated)
- `src/i18n/locales/{en,es}.json` (hero.meta prefix, hero.body, operatingValue, contact.status, exhibit prefix; remove migrated now/work/services keys)
- `src/App.tsx` (routes: `/writing`, `/writing/:slug`, `/read/:slug` redirect)
- `package.json` (react-markdown, remark-gfm)

**Retired**
- `src/pages/Read.tsx` (superseded by `Writing.tsx`)

## Risks / notes

- **Bilingual markdown bodies** are paired rich-text fields in the CMS — verify
  Pages CMS renders two `rich-text` fields per post acceptably; fall back to two
  per-language collections only if that proves awkward in the editor.
- **`import.meta.glob`** must stay eager + static so the GitHub Pages build
  bundles all content (no runtime fetch).
- **Reference fields** in Pages CMS: if `reference` proves unreliable, fall back
  to a fixed `select` whose options mirror the category ids.
- **Build is the gate** (`tsc -b` + `vite build`); lint runs on pre-commit. No
  `Co-Authored-By` lines (project rule). Commit subjects start with a capitalized
  verb.

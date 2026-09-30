# Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a curated `/projects` route to jorius.github.io, fed by one JSON file per project, with a top-bar link, a palette command, and a redirect from the legacy `/portfolio` page.

**Architecture:** Content JSON under `src/content/projects/` is loaded at build time by `loadProjects()` in `src/utils/content.ts` (same `import.meta.glob` mechanism as blog posts). A new `Projects` page, built on the `/pgp` page skeleton, renders one `BProjectCard` per entry in a rule-bordered grid. Pure helpers are unit-tested with vitest (no DOM); rendering is checked headlessly against a production preview build.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, react-router-dom 7, i18next, vitest 4 (no DOM environment), Playwright (headless, from the geromanager workspace install).

**Spec:** `docs/superpowers/specs/2026-09-29-projects-page-and-repo-publishing-design.md` (sections 4.3–4.9). Read it first.

## Global Constraints

- Work in the worktree `/mnt/media/Sources/GitHub/Personal/.worktrees/jorius-projects-page`, branch `feature/projects-page` (already created off `main` a1871b0; `node_modules` installed). Never touch the main checkout at `/mnt/media/Sources/GitHub/Personal/jorius.github.io`, which sits on the Dark Galaxy branch.
- Commit subjects start with a capitalised verb from the hook's list (`Add`, `Fix`, `Update`, `Remove`, `Replace`, `Extend`, `Document`, …), max 72 chars; body says why. **No `Co-Authored-By` trailer in this repo** (project rule). `commit.gpgsign=true`; on `gpg failed to sign` STOP and ask the owner to prime the agent with `! echo test | gpg --clearsign -u 365602820FC1B86C > /dev/null`.
- Husky runs `npm run lint` on every commit and rejects subjects that do not start with an allowed verb. Never bypass hooks.
- Never rebase. Never push this branch; the owner tests locally first and decides when it merges.
- Import ordering convention in every TS file: grouped comments in this order: `// packages`, `// contexts`, `// data`, `// hooks`, `// utils`, `// components`, each group alphabetised.
- Every user-facing string goes through `useTranslation()` with keys in **both** `src/i18n/locales/en.json` and `es.json`. The two files round-trip through `JSON.stringify(…, null, 2) + '\n'` unchanged, so a node script may edit them.
- Theme tokens come from `useBTheme().t`: `paper`, `sub`, `ink`, `dim`, `mute`, `soft`, `rule`, `rgbR`, `rgbB`, `scan`.
- The owner runs his own dev server on port 5173; use 5180 for dev and 4180 for preview, and stop them when done.
- Headless browser only: `NODE_PATH=/mnt/media/Sources/JerichoDigital/geromanager/node_modules node <script>.cjs`; that Playwright (1.59.1) expects `chromium_headless_shell-1217`, which is not cached, so every launch passes `executablePath: '/home/jorius/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'` (verified working on 2026-09-29). Never install browsers, never the headed Playwright MCP.
- Final URLs for links come from the repository plan's "Done when" report; the values below are the expected ones.

## Review Focus

1. A stack name with no `TECH` entry renders as a bland two-letter monogram — Task 2's content test asserts every stack name used by the cards has a `TECH` entry, and Task 3 adds the missing ones.
2. A JSON file missing `details`, `links`, `stack` or `draft` must not crash the page — Task 1 exports `normaliseProject` and tests those omissions.
3. A visitor with `es-CO` as browser language must see Spanish labels — Task 1 tests `projectLinkLabel` with `'es-CO'`.
4. In production the ArrowFin draft must disappear and the meta count must say 10, not 11 — Task 7 checks the preview build (PROD) shows 10 cards and the dev build 11.
5. `/portfolio` opened as a deep link on GitHub Pages goes through the `404.html` fallback first — Task 7 checks the redirect against the preview server, which serves the SPA fallback the same way.

---

### Task 1: Content types, loader and pure helpers

**Files:**
- Modify: `src/utils/content.ts` (append types, `normaliseProject`, `selectPublished`, `loadProjects`)
- Create: `src/utils/projects.ts`
- Create: `src/utils/projects.test.ts`
- Create: `src/utils/content.test.ts` (pure parts only; the real-content assertions come in Task 2)

**Interfaces:**
- Produces (from `content.ts`): `ProjectKind`, `ProjectStatus`, `ProjectLinkKind`, `ProjectLink { kind, url, label? }`, `ProjectEntry { id, order, year, kind, status?, draft, title, summary, details, stack, links }`, `normaliseProject(raw: Partial<ProjectEntry>): ProjectEntry`, `selectPublished(entries: ProjectEntry[], isProd: boolean): ProjectEntry[]`, `loadProjects(): ProjectEntry[]`.
- Produces (from `projects.ts`): `type Translate = (key: string) => string`, `projectLinkLabel(link: ProjectLink, lang: string, t: Translate): string`.

- [ ] **Step 1: Write the failing tests**

`src/utils/content.test.ts`:
```ts
// packages
import { describe, expect, it } from 'vitest';

// utils
import { normaliseProject, selectPublished } from './content';
import type { ProjectEntry } from './content';

export const entry = (over: Partial<ProjectEntry> = {}): ProjectEntry => ({
  id: 'x',
  order: 10,
  year: '2026',
  kind: 'personal',
  draft: false,
  title: { en: 'X', es: 'X' },
  summary: { en: 'S', es: 'S' },
  details: [],
  stack: [],
  links: [],
  ...over,
});

describe('selectPublished', () => {
  it('sorts by order and keeps drafts outside production', () => {
    const out = selectPublished([entry({ id: 'b', order: 20 }), entry({ id: 'a', order: 10, draft: true })], false);
    expect(out.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('drops drafts in production', () => {
    const out = selectPublished([entry({ id: 'b', order: 20 }), entry({ id: 'a', order: 10, draft: true })], true);
    expect(out.map((p) => p.id)).toEqual(['b']);
  });

  it('does not mutate its input', () => {
    const input = [entry({ id: 'b', order: 20 }), entry({ id: 'a', order: 10 })];
    selectPublished(input, false);
    expect(input[0].id).toBe('b');
  });
});

describe('normaliseProject', () => {
  it('fills the optional arrays and the draft flag', () => {
    const p = normaliseProject({ id: 'y', order: 5, year: '2020', kind: 'tool', title: { en: 'Y', es: 'Y' }, summary: { en: 's', es: 's' } });
    expect(p.details).toEqual([]);
    expect(p.links).toEqual([]);
    expect(p.stack).toEqual([]);
    expect(p.draft).toBe(false);
  });

  it('keeps provided values', () => {
    const p = normaliseProject(entry({ draft: true, stack: ['Node'] }));
    expect(p.draft).toBe(true);
    expect(p.stack).toEqual(['Node']);
  });
});
```

`src/utils/projects.test.ts`:
```ts
// packages
import { describe, expect, it } from 'vitest';

// utils
import { projectLinkLabel } from './projects';

const t = (key: string): string => `<${key}>`;

describe('projectLinkLabel', () => {
  it('uses the generic label for the kind when the link has none', () => {
    expect(projectLinkLabel({ kind: 'repo', url: 'https://x' }, 'en', t)).toBe('<directionB.projectsPage.link.repo>');
    expect(projectLinkLabel({ kind: 'npm', url: 'https://x' }, 'es', t)).toBe('<directionB.projectsPage.link.npm>');
  });

  it('prefers the link label in the visitor language, including regional codes', () => {
    const link = { kind: 'repo' as const, url: 'https://x', label: { en: 'Frontend', es: 'Interfaz' } };
    expect(projectLinkLabel(link, 'en', t)).toBe('Frontend');
    expect(projectLinkLabel(link, 'es-CO', t)).toBe('Interfaz');
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `cd /mnt/media/Sources/GitHub/Personal/.worktrees/jorius-projects-page && npx vitest run src/utils/content.test.ts src/utils/projects.test.ts`
Expected: FAIL — `content.ts` has no export `normaliseProject`/`selectPublished`, `./projects` does not exist.

- [ ] **Step 3: Append the types and loader to `src/utils/content.ts`**

Add after the `WritingPost` interface (before the `import.meta.glob` lines):

```ts
// ---- /projects --------------------------------------------------------------

export type ProjectKind = 'personal' | 'assessment' | 'client' | 'tool' | 'package';
export type ProjectStatus = 'wip' | 'archived';
export type ProjectLinkKind = 'repo' | 'live' | 'npm' | 'docs';

export interface ProjectLink {
  kind: ProjectLinkKind;
  url: string;
  // Overrides the generic label for the kind ("Frontend", "API · .NET").
  label?: Localized;
}

// One card on /projects. `order` is explicit and spaced by 10 so a card can be
// slotted in without renumbering; `year` is display text ("2017–2023").
export interface ProjectEntry {
  id: string;
  order: number;
  year: string;
  kind: ProjectKind;
  status?: ProjectStatus;
  draft: boolean;
  title: Localized;
  summary: Localized;
  details: Localized[];
  stack: string[];
  links: ProjectLink[];
}

// A hand-written JSON file may omit the optional arrays or the draft flag;
// give every entry the full shape so the card never branches on undefined.
export const normaliseProject = (raw: Partial<ProjectEntry>): ProjectEntry => ({
  ...(raw as ProjectEntry),
  details: Array.isArray(raw.details) ? raw.details : [],
  links: Array.isArray(raw.links) ? raw.links : [],
  stack: Array.isArray(raw.stack) ? raw.stack : [],
  draft: raw.draft ?? false,
});

// Drafts stay visible in dev so a card can be previewed before it ships;
// production builds drop them. Always ordered by the explicit `order`.
export const selectPublished = (entries: ProjectEntry[], isProd: boolean): ProjectEntry[] =>
  entries
    .filter((p) => (isProd ? !p.draft : true))
    .slice()
    .sort((a, b) => a.order - b.order);
```

Then, after the existing `const revisionModules = …` line, add:

```ts
const projectModules = import.meta.glob('../content/projects/*.json', { eager: true });
```

And at the end of the file:

```ts
// Every project card, published set only in production. Entries without a
// localized title or summary have nothing to render and are dropped.
export const loadProjects = (): ProjectEntry[] =>
  selectPublished(
    Object.values(projectModules)
      .map((m) => normaliseProject((m as { default: Partial<ProjectEntry> }).default))
      .filter((p) => isLocalized(p.title) && isLocalized(p.summary)),
    import.meta.env.PROD,
  );
```

- [ ] **Step 4: Create `src/utils/projects.ts`**

```ts
// Pure helpers for the /projects cards, apart from content.ts so they stay
// trivially unit-testable.

// utils
import { pickLocale } from './content';
import type { ProjectLink } from './content';

export type Translate = (key: string) => string;

// A link shows its own label when the content gives one ("Frontend",
// "API · .NET"); otherwise the generic label for its kind.
export const projectLinkLabel = (link: ProjectLink, lang: string, t: Translate): string =>
  link.label ? pickLocale(link.label, lang) : t(`directionB.projectsPage.link.${link.kind}`);
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/utils/content.test.ts src/utils/projects.test.ts`
Expected: PASS, 7 tests. (`import.meta.glob` on an empty folder returns `{}`, which is fine.) Also run `npx tsc -b` — expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/utils/content.ts src/utils/projects.ts src/utils/content.test.ts src/utils/projects.test.ts
git commit -q -m "Add the projects content model and loader" -m "The /projects page needs typed, ordered, draft-aware entries loaded the same way blog posts are. Pure helpers are split out so they test without a DOM."
```

---

### Task 2: The eleven project files and the content validation test

**Files:**
- Create: `src/content/projects/*.json` (11 files, below)
- Modify: `src/utils/content.test.ts` (append the real-content suite)

**Interfaces:**
- Consumes: `loadProjects`, `ProjectEntry` from Task 1; `TECH` from `src/components/direction-b/StackChip.tsx`.

- [ ] **Step 1: Append the real-content tests to `src/utils/content.test.ts`**

Add these imports at the top (keep the grouped order): to `// utils` add `import { loadProjects } from './content';` (merge into the existing import line: `import { loadProjects, normaliseProject, selectPublished } from './content';`) and a new group before it:

```ts
// components
import { TECH } from '../components/direction-b/StackChip';
```

Then append:

```ts
const KINDS = ['personal', 'assessment', 'client', 'tool', 'package'];
const STATUSES = ['wip', 'archived'];
const LINK_KINDS = ['repo', 'live', 'npm', 'docs'];

const hasBoth = (v: unknown): boolean =>
  typeof v === 'object' && v !== null
  && typeof (v as { en?: unknown }).en === 'string' && (v as { en: string }).en.trim() !== ''
  && typeof (v as { es?: unknown }).es === 'string' && (v as { es: string }).es.trim() !== '';

describe('projects content', () => {
  // vitest runs outside PROD, so drafts are included and validated too.
  const projects = loadProjects();

  it('has the eleven cards', () => {
    expect(projects).toHaveLength(11);
  });

  it('has unique ids and orders', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.order)).size).toBe(projects.length);
  });

  it('comes back sorted by order', () => {
    const orders = projects.map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('carries English and Spanish for every string', () => {
    for (const p of projects) {
      expect(hasBoth(p.title), `${p.id} title`).toBe(true);
      expect(hasBoth(p.summary), `${p.id} summary`).toBe(true);
      for (const d of p.details) expect(hasBoth(d), `${p.id} detail`).toBe(true);
      for (const l of p.links) if (l.label) expect(hasBoth(l.label), `${p.id} link ${l.url}`).toBe(true);
      expect(p.year.trim(), `${p.id} year`).not.toBe('');
    }
  });

  it('uses only known kinds, statuses and link kinds', () => {
    for (const p of projects) {
      expect(KINDS, `${p.id} kind`).toContain(p.kind);
      if (p.status !== undefined) expect(STATUSES, `${p.id} status`).toContain(p.status);
      for (const l of p.links) expect(LINK_KINDS, `${p.id} link kind`).toContain(l.kind);
    }
  });

  it('links only to https URLs and has at least one link and one chip per card', () => {
    for (const p of projects) {
      expect(p.links.length, `${p.id} links`).toBeGreaterThan(0);
      expect(p.stack.length, `${p.id} stack`).toBeGreaterThan(0);
      for (const l of p.links) expect(l.url, `${p.id} ${l.url}`).toMatch(/^https:\/\//);
    }
  });

  it('only uses stack names that have a chip definition', () => {
    for (const p of projects) {
      for (const s of p.stack) expect(Object.keys(TECH), `${p.id} chip ${s}`).toContain(s);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/utils/content.test.ts`
Expected: FAIL on "has the eleven cards" (0 found).

- [ ] **Step 3: Write the eleven content files**

Create `src/content/projects/` and these files verbatim.

`engineer-mentat-academy.json`:
```json
{
  "id": "engineer-mentat-academy",
  "order": 10,
  "year": "2026",
  "kind": "personal",
  "draft": false,
  "title": { "en": "Engineer Mentat Academy", "es": "Engineer Mentat Academy" },
  "summary": {
    "en": "Interactive interview trainer: 385 junior-to-senior questions in English and Spanish, with in-browser code and SQL scratchpads, drills, timed mocks and saved progress.",
    "es": "Entrenador interactivo de entrevistas: 385 preguntas de nivel junior a senior en inglés y español, con editores de código y SQL en el navegador, ejercicios, simulacros cronometrados y progreso guardado."
  },
  "details": [
    { "en": "Single-page app on GitHub Pages, no backend; progress lives in the browser", "es": "Aplicación de una sola página en GitHub Pages, sin backend; el progreso vive en el navegador" },
    { "en": "Built for my own senior interview prep, then kept and published", "es": "Construida para preparar mi propia entrevista senior, luego conservada y publicada" }
  ],
  "stack": ["TypeScript", "React", "Vite", "CodeMirror"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/engineer-mentat-academy" },
    { "kind": "live", "url": "https://jorius.github.io/engineer-mentat-academy/" }
  ]
}
```

`arrowfin-trader-daily-snapshot.json`:
```json
{
  "id": "arrowfin-trader-daily-snapshot",
  "order": 20,
  "year": "2026",
  "kind": "assessment",
  "draft": true,
  "title": { "en": "ArrowFin · Trader Daily Snapshot", "es": "ArrowFin · Trader Daily Snapshot" },
  "summary": {
    "en": "Timed technical assessment for a Senior Full Stack / Team Lead role: a NestJS + Prisma service that computes a trader's daily snapshot and streams fills over a tenant-scoped WebSocket, plus a Next.js widget that renders it live.",
    "es": "Prueba técnica cronometrada para un puesto Senior Full Stack / Team Lead: un servicio NestJS + Prisma que calcula el resumen diario de un trader y emite operaciones por un WebSocket aislado por tenant, más un widget Next.js que lo muestra en vivo."
  },
  "details": [
    { "en": "Opaque API keys, app-layer tenant isolation, Swagger and a Postman collection", "es": "Claves API opacas, aislamiento por tenant en la capa de aplicación, Swagger y una colección de Postman" },
    { "en": "API on Railway, widget on Netlify; the submission repo documents every prompt used", "es": "API en Railway, widget en Netlify; el repositorio de entrega documenta cada prompt utilizado" }
  ],
  "stack": ["TypeScript", "Next.js", "NestJS", "Prisma", "Postgres", "WebSockets"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/arrowfin-mt-daily-snap-svc", "label": { "en": "API", "es": "API" } },
    { "kind": "repo", "url": "https://github.com/jorius/arrowfin-mt-daily-snap-fe", "label": { "en": "Frontend", "es": "Frontend" } },
    { "kind": "docs", "url": "https://github.com/jorius/arrowfin-llm-usage-docs", "label": { "en": "Submission docs", "es": "Documentos de entrega" } },
    { "kind": "live", "url": "https://arrowfin-mt-daily-snap.netlify.app" }
  ]
}
```

`carolina-rivera-portfolio.json`:
```json
{
  "id": "carolina-rivera-portfolio",
  "order": 30,
  "year": "2026",
  "kind": "client",
  "draft": false,
  "title": { "en": "Carolina M. Rivera — Portfolio", "es": "Carolina M. Rivera — Portafolio" },
  "summary": {
    "en": "Portfolio site for a graphic designer and visual artist, built from a Claude Design handoff as an Astro static site with vanilla TypeScript islands, in English and Spanish, deployed on GitHub Pages.",
    "es": "Sitio de portafolio para una diseñadora gráfica y artista visual, construido a partir de un handoff de Claude Design como sitio estático en Astro con islas de TypeScript, en inglés y español, publicado en GitHub Pages."
  },
  "details": [
    { "en": "JSON content collections validated with zod", "es": "Colecciones de contenido en JSON validadas con zod" },
    { "en": "Light and dark themes, language toggle, no framework runtime in the browser", "es": "Temas claro y oscuro, cambio de idioma, sin runtime de framework en el navegador" }
  ],
  "stack": ["Astro", "TypeScript"],
  "links": [
    { "kind": "repo", "url": "https://github.com/cmrivera97/cmrivera97.github.io" },
    { "kind": "live", "url": "https://cmrivera97.github.io/" }
  ]
}
```

`pokedex-ecosystem.json`:
```json
{
  "id": "pokedex-ecosystem",
  "order": 40,
  "year": "2026",
  "kind": "personal",
  "draft": false,
  "title": { "en": "Pokedex ecosystem", "es": "Ecosistema Pokedex" },
  "summary": {
    "en": "One React frontend and three contract-identical backends (Express + TypeScript, Express + JavaScript, ASP.NET Core) sharing one Postgres database and one JWT key, so the UI can switch backend mid-session without logging out.",
    "es": "Un frontend en React y tres backends con contrato idéntico (Express + TypeScript, Express + JavaScript, ASP.NET Core) que comparten una base Postgres y una clave JWT, así que la interfaz puede cambiar de backend a mitad de sesión sin cerrarla."
  },
  "details": [
    { "en": "Byte-identical responses verified with live parity gates", "es": "Respuestas idénticas byte a byte, verificadas con pruebas de paridad en vivo" },
    { "en": "Pokeball economy: wallet, ball shop, catches you can lose and a slot machine to fund them", "es": "Economía de pokébolas: billetera, tienda, capturas que puedes fallar y una tragamonedas para financiarlas" },
    { "en": "Nine game themes, en/es, virtualised infinite scroll", "es": "Nueve temas de los juegos, es/en, scroll infinito virtualizado" }
  ],
  "stack": ["TypeScript", "React", "Node", "Express", ".NET", "Postgres", "Redis"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/pokedex-web", "label": { "en": "Frontend", "es": "Frontend" } },
    { "kind": "repo", "url": "https://github.com/jorius/pokedex-api-express-ts", "label": { "en": "API · Express TS", "es": "API · Express TS" } },
    { "kind": "repo", "url": "https://github.com/jorius/pokedex-api-express-js", "label": { "en": "API · Express JS", "es": "API · Express JS" } },
    { "kind": "repo", "url": "https://github.com/jorius/pokedex-api-dotnet", "label": { "en": "API · .NET", "es": "API · .NET" } }
  ]
}
```

`balatro-advisor.json`:
```json
{
  "id": "balatro-advisor",
  "order": 50,
  "year": "2026",
  "kind": "tool",
  "draft": false,
  "title": { "en": "Balatro Advisor", "es": "Balatro Advisor" },
  "summary": {
    "en": "Watches Balatro's autosave and scores every possible play with the game's own hand rules, jokers, enhancements, editions and seals, then serves a live recommendation page on localhost.",
    "es": "Observa el autoguardado de Balatro y puntúa cada jugada posible con las reglas del juego, comodines, mejoras, ediciones y sellos, y sirve una página local con la recomendación en vivo."
  },
  "details": [
    { "en": "Monte Carlo lookahead estimates the chance of clearing the blind", "es": "Una proyección Monte Carlo estima la probabilidad de superar la ciega" },
    { "en": "After each real hand it compares its prediction with the chips the game added", "es": "Tras cada mano real compara su predicción con las fichas que sumó el juego" },
    { "en": "Scoring engine: the vendored Balatrolator (MIT)", "es": "Motor de puntuación: Balatrolator, incluido en el repositorio (MIT)" }
  ],
  "stack": ["Node", "JavaScript"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/balatro-advisor" }
  ]
}
```

`my-steam-dashboard.json`:
```json
{
  "id": "my-steam-dashboard",
  "order": 60,
  "year": "2026",
  "kind": "personal",
  "status": "wip",
  "draft": false,
  "title": { "en": "My Steam Dashboard", "es": "My Steam Dashboard" },
  "summary": {
    "en": "Client-side dashboard for a Steam library: grid and list views with stats, favourites, an achievement tracker with guides, all kept in the browser and fed through a tiny CORS proxy you deploy yourself.",
    "es": "Panel del lado del cliente para una biblioteca de Steam: vistas en cuadrícula y lista con estadísticas, favoritos, un rastreador de logros con guías, todo guardado en el navegador y servido a través de un pequeño proxy CORS que despliegas tú mismo."
  },
  "details": [
    { "en": "Nothing-style design system, en/es, JSON export and import", "es": "Sistema de diseño estilo Nothing, es/en, exportación e importación en JSON" },
    { "en": "Early and unfinished: expect rough edges", "es": "Temprano e inconcluso: hay aristas" }
  ],
  "stack": ["TypeScript", "React", "Vite", "Zustand"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/my-steam-dashboard" }
  ]
}
```

`ticket-dashboard-challenge.json`:
```json
{
  "id": "ticket-dashboard-challenge",
  "order": 70,
  "year": "2026",
  "kind": "assessment",
  "draft": false,
  "title": { "en": "Ticket Dashboard Challenge", "es": "Ticket Dashboard Challenge" },
  "summary": {
    "en": "A take-home challenge I wrote for candidates: a React + TypeScript support-ticket dashboard with a mocked data layer, where the candidate implements the data hook, pagination, sorting and filtering.",
    "es": "Una prueba para candidatos que escribí yo: un panel de tickets de soporte en React + TypeScript con datos simulados, donde el candidato implementa el hook de datos, la paginación, el orden y los filtros."
  },
  "details": [
    { "en": "Deliberately does not compile on a fresh checkout", "es": "No compila a propósito en un checkout limpio" }
  ],
  "stack": ["TypeScript", "React", "Vite"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/ticket-dashboard-challenge" }
  ]
}
```

`pratech-tt-web.json`:
```json
{
  "id": "pratech-tt-web",
  "order": 80,
  "year": "2020",
  "kind": "assessment",
  "status": "archived",
  "draft": false,
  "title": { "en": "Pratech technical test", "es": "Prueba técnica Pratech" },
  "summary": {
    "en": "Technical test from 2020: a React app that builds a form dynamically from a JSON schema, with validations per field, a mocked login and English/Spanish text.",
    "es": "Prueba técnica de 2020: una app React que construye un formulario dinámicamente a partir de un esquema JSON, con validaciones por campo, login simulado y textos en inglés y español."
  },
  "details": [
    { "en": "Create React App, Material UI, Redux", "es": "Create React App, Material UI, Redux" },
    { "en": "Republished on GitHub Pages in 2026 from the original branch, unchanged", "es": "Republicada en GitHub Pages en 2026 desde la rama original, sin cambios" }
  ],
  "stack": ["JavaScript", "React", "Redux"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/pratech-tt-web" },
    { "kind": "live", "url": "https://jorius.github.io/pratech-tt-web/" }
  ]
}
```

`wolox-tt.json`:
```json
{
  "id": "wolox-tt",
  "order": 90,
  "year": "2020",
  "kind": "assessment",
  "status": "archived",
  "draft": false,
  "title": { "en": "Wolox technical test", "es": "Prueba técnica Wolox" },
  "summary": {
    "en": "Front-end technical test from 2020: login, password recovery and a tech-collection view against an interview API, with a service mocker so it runs without the backend.",
    "es": "Prueba técnica de front-end de 2020: login, recuperación de contraseña y una vista de colección contra la API de la entrevista, con un simulador de servicios para funcionar sin backend."
  },
  "details": [
    { "en": "React, Redux, Material UI, lazy routes with error boundaries", "es": "React, Redux, Material UI, rutas diferidas con límites de error" },
    { "en": "The Pages build runs on the mocker: admin@wolox.com.ar / 123456", "es": "La versión en Pages usa el simulador: admin@wolox.com.ar / 123456" }
  ],
  "stack": ["JavaScript", "React", "Redux"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/wolox-tt" },
    { "kind": "live", "url": "https://jorius.github.io/wolox-tt/" }
  ]
}
```

`synack-web-search-engine.json`:
```json
{
  "id": "synack-web-search-engine",
  "order": 100,
  "year": "2020",
  "kind": "assessment",
  "status": "archived",
  "draft": false,
  "title": { "en": "Synack web search engine", "es": "Synack web search engine" },
  "summary": {
    "en": "Technical test from 2020: a React app that queries Google Custom Search and Bing and renders the results with its own layout. The Azure deployment is retired and the APIs need your own keys.",
    "es": "Prueba técnica de 2020: una app React que consulta Google Custom Search y Bing y muestra los resultados con un diseño propio. El despliegue en Azure está retirado y las APIs requieren tus propias claves."
  },
  "details": [
    { "en": "React, Redux, Material UI; the README walks through both API setups", "es": "React, Redux, Material UI; el README explica la configuración de ambas APIs" }
  ],
  "stack": ["JavaScript", "React", "Redux"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/synack-web-search-engine" }
  ]
}
```

`waveless.json`:
```json
{
  "id": "waveless",
  "order": 110,
  "year": "2017–2023",
  "kind": "package",
  "draft": false,
  "title": { "en": "waveless", "es": "waveless" },
  "summary": {
    "en": "A tiny npm package that turns Node's plain console output into colour-coded, timestamped log levels, with an option to print any value as an inspected object.",
    "es": "Un pequeño paquete npm que convierte la salida de consola de Node en niveles de log con color y marca de tiempo, con opción de imprimir cualquier valor como objeto inspeccionado."
  },
  "details": [
    { "en": "Published as waveless 2.1.6 on npm", "es": "Publicado como waveless 2.1.6 en npm" }
  ],
  "stack": ["Node", "JavaScript"],
  "links": [
    { "kind": "repo", "url": "https://github.com/jorius/waveless" },
    { "kind": "npm", "url": "https://www.npmjs.com/package/waveless" }
  ]
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/utils/content.test.ts`
Expected: every test passes **except** "only uses stack names that have a chip definition", which fails listing `React`, `Vite`, `CodeMirror`, `NestJS`, `Prisma`, `WebSockets`, `Astro`, `Express`, `.NET`, `JavaScript`, `Zustand`, `Redux`. That is Task 3's job; leave it red for now.

- [ ] **Step 5: Commit the content and the test**

```bash
git add src/content/projects src/utils/content.test.ts
git commit -q -m "Add the eleven project cards as content" -m "Hand-written, one JSON file per project in both languages, following the writing content layout. The chip-definition test stays red until the stack chips are extended."
```

---

### Task 3: Stack chips and locale keys

**Files:**
- Modify: `src/components/direction-b/StackChip.tsx` (extend `TECH` and `LIGHT_GLYPH_COLORS`)
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json` (script below)

**Interfaces:**
- Produces locale keys: `directionB.topbar.nav.projects`, `directionB.palette.items.showProjects`, `directionB.palette.items.projectsHint`, `directionB.projectsPage.{meta,title,intro,empty}`, `directionB.projectsPage.kind.{personal,assessment,client,tool,package}`, `directionB.projectsPage.status.{wip,archived}`, `directionB.projectsPage.link.{repo,live,npm,docs}`. Removes `directionB.projects.*` and `directionB.topbar.nav.academy` (Task 6 removes the component that read it in the same branch; between Task 3 and Task 6 the top bar shows the raw key, which is expected).

- [ ] **Step 1: Extend the chip table**

In `src/components/direction-b/StackChip.tsx`, inside `TECH`, after the line `  Terraform: { color: '#7B42BC', glyph: 'tf' },` add:

```ts
  // Web
  React: { color: '#61DAFB', glyph: 'Re' },
  Vite: { color: '#646CFF', glyph: 'Vi' },
  JavaScript: { color: '#F7DF1E', glyph: 'JS' },
  Express: { color: '#3C3C3C', glyph: 'Ex' },
  '.NET': { color: '#512BD4', glyph: '.N' },
  NestJS: { color: '#E0234E', glyph: 'Ne' },
  Prisma: { color: '#2D3748', glyph: 'Pr' },
  WebSockets: { color: '#0A7EA4', glyph: 'WS' },
  Astro: { color: '#FF5D01', glyph: 'As' },
  Redux: { color: '#764ABC', glyph: 'Rx' },
  Zustand: { color: '#5B4636', glyph: 'Zu' },
  CodeMirror: { color: '#D30707', glyph: 'CM' },
```

`LIGHT_GLYPH_COLORS` already contains `#F7DF1E` and `#61DAFB`, so no change there.

Run: `npx vitest run src/utils/content.test.ts` → Expected: all PASS now.

- [ ] **Step 2: Edit both locale files with one script**

Run from the worktree root:

```bash
node - <<'EOF'
const fs = require('fs');
const copy = {
  en: {
    nav: 'Projects',
    show: 'show projects',
    page: {
      meta: '§ PROJECTS',
      title: 'Projects',
      intro: 'Side projects, tools and technical assessments, each with its source and, where one exists, a live build. The landing page lists what GitHub says is popular; this page lists what I would actually show you.',
      empty: 'Nothing published yet.',
      kind: { personal: 'PERSONAL', assessment: 'ASSESSMENT', client: 'CLIENT', tool: 'TOOL', package: 'PACKAGE' },
      status: { wip: 'WIP', archived: 'ARCHIVED' },
      link: { repo: 'repository', live: 'live', npm: 'npm', docs: 'docs' },
    },
  },
  es: {
    nav: 'Proyectos',
    show: 'ver proyectos',
    page: {
      meta: '§ PROYECTOS',
      title: 'Proyectos',
      intro: 'Proyectos personales, herramientas y pruebas técnicas, cada uno con su código fuente y, cuando existe, una versión en línea. La portada muestra lo que GitHub considera popular; esta página muestra lo que yo enseñaría.',
      empty: 'Nada publicado todavía.',
      kind: { personal: 'PERSONAL', assessment: 'PRUEBA TÉCNICA', client: 'CLIENTE', tool: 'HERRAMIENTA', package: 'PAQUETE' },
      status: { wip: 'EN CURSO', archived: 'ARCHIVADO' },
      link: { repo: 'repositorio', live: 'en línea', npm: 'npm', docs: 'docs' },
    },
  },
};
for (const lang of ['en', 'es']) {
  const p = `src/i18n/locales/${lang}.json`;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const b = d.directionB;
  if (!b.projects) throw new Error(`${lang}: directionB.projects already gone`);
  delete b.projects;
  if (!b.topbar.nav.academy) throw new Error(`${lang}: topbar.nav.academy already gone`);
  delete b.topbar.nav.academy;
  b.topbar.nav.projects = copy[lang].nav;
  b.palette.items.showProjects = copy[lang].show;
  b.palette.items.projectsHint = 'jorius.github.io/projects';
  b.projectsPage = copy[lang].page;
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
  console.log(lang, 'ok');
}
EOF
git diff --stat src/i18n
```
Expected: `en ok`, `es ok`; the diff touches only the two locale files, roughly +30/−10 lines each.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc -b && npm run lint`
Expected: tsc silent. Lint: `ProjectCard.tsx` still references `directionB.projects.*` keys through `tr()`; that is a runtime key, not a type error, so lint passes. (ProjectCard is deleted in Task 4.)

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/StackChip.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -q -m "Add the projects page copy and the stack chips it needs" -m "Both locales gain the nav entry, the palette command and the page strings; the dormant directionB.projects keys go with the card they served, and the Academy nav label goes because the bar entry is being replaced by Projects."
```

---

### Task 4: The project card

**Files:**
- Create: `src/components/direction-b/BProjectCard.tsx`
- Delete: `src/components/direction-b/ProjectCard.tsx`

**Interfaces:**
- Consumes: `ProjectEntry`, `pickLocale` from `content.ts`; `projectLinkLabel` from `projects.ts`; `StackChip`, `Glitch`, `Reveal`, `useBTheme`.
- Produces: `BProjectCard({ p: ProjectEntry; i: number; columnsPerRow: number })`.

- [ ] **Step 1: Delete the dormant card**

```bash
git rm -q src/components/direction-b/ProjectCard.tsx && git grep -n "ProjectCard\|IndexProject" -- src || echo NO_REFERENCES
```
Expected: `NO_REFERENCES`.

- [ ] **Step 2: Create `src/components/direction-b/BProjectCard.tsx`**

```tsx
// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// utils
import { pickLocale } from '../../utils/content';
import type { ProjectEntry } from '../../utils/content';
import { projectLinkLabel } from '../../utils/projects';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { StackChip } from './StackChip';

interface BProjectCardProps {
  p: ProjectEntry;
  i: number;
  columnsPerRow: number;
}

// The hover rules for .b-index-card live in index.html and read these vars.
interface CardCSS extends CSSProperties {
  '--sub'?: string;
  '--ink'?: string;
  '--dim'?: string;
  '--rule'?: string;
  '--rgbB'?: string;
}

export const BProjectCard = ({ p, i, columnsPerRow }: BProjectCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const lang = i18n.language;
  const isLastInRow = i % columnsPerRow === columnsPerRow - 1;
  const isMobileCard = columnsPerRow === 1;
  const cardStyle: CardCSS = {
    padding: isMobileCard ? 16 : 24,
    borderRight: !isLastInRow ? `1px solid ${t.rule}` : 'none',
    borderBottom: `1px solid ${t.rule}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 0,
    '--sub': t.sub,
    '--ink': t.ink,
    '--dim': t.dim,
    '--rule': t.rule,
    '--rgbB': t.rgbB,
  };
  const metaStyle: CSSProperties = { fontSize: 11, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };

  return (
    <Reveal delay={(i % columnsPerRow) * 70} className="b-index-card" style={cardStyle}>
      <div style={{ ...metaStyle, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>№ {String(i + 1).padStart(2, '0')}</span>
        <span>
          {tr(`directionB.projectsPage.kind.${p.kind}`)}
          {p.status ? ` · ${tr(`directionB.projectsPage.status.${p.status}`)}` : null}
        </span>
      </div>

      <div style={{ fontSize: isMobileCard ? 22 : 26, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
        <Glitch trigger="hover" strong>{pickLocale(p.title, lang)}</Glitch>
      </div>

      <div style={{ fontSize: 12, color: t.dim }}>{p.year}</div>

      <p style={{ margin: 0, fontSize: 13, color: t.ink, lineHeight: 1.55 }}>{pickLocale(p.summary, lang)}</p>

      {p.details.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12, color: t.dim, lineHeight: 1.5 }}>
          {p.details.map((d) => (
            <li key={d.en}>— {pickLocale(d, lang)}</li>
          ))}
        </ul>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {p.stack.map((s) => <StackChip key={s} name={s} />)}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 'auto', paddingTop: 6 }}>
        {p.links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...metaStyle, color: t.ink, textDecoration: 'none' }}
          >
            {projectLinkLabel(l, lang, tr)} ↗
          </a>
        ))}
      </div>
    </Reveal>
  );
};
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc -b && npm run lint`
Expected: both silent (an unused component is fine for tsc; it is wired in Task 5). If tsc rejects passing i18next's `tr` where `Translate` is expected (its overloaded `TFunction` type sometimes does not narrow to `(key: string) => string`), wrap it at the call site: `projectLinkLabel(l, lang, (key) => tr(key))`. Do not widen the `Translate` type.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/direction-b
git commit -q -m "Replace the dormant index card with the project card" -m "ProjectCard was never mounted and modelled a thumbnail the page does not have. The new card carries kind, status, year, details, chips and several links."
```

---

### Task 5: The page, the routes and the legacy portfolio removal

**Files:**
- Create: `src/pages/Projects.tsx`
- Modify: `src/App.tsx`
- Delete: `src/pages/Portfolio.tsx`, `src/data/portfolio.json`, `src/data/private-repos.json`
- Modify: `src/components/common/Header.tsx` (lines 26 and 67)
- Modify: `CLAUDE.md` (lines 33, 47, 48)

**Interfaces:**
- Consumes: `loadProjects`, `BProjectCard`, `BTopBar`, `CommandPalette`, `PALETTE_SECTIONS`, primitives.
- Produces: route `/projects`; `/portfolio` → `/projects` redirect.

- [ ] **Step 1: Create `src/pages/Projects.tsx`**

```tsx
// packages
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../hooks/useMediaQuery';

// utils
import { loadProjects } from '../utils/content';

// components
import { BProjectCard } from '../components/direction-b/BProjectCard';
import { BTopBar } from '../components/direction-b/BTopBar';
import { CommandPalette } from '../components/CommandPalette';
import { PALETTE_SECTIONS } from '../components/direction-b/paletteSections';
import { DarkGrain } from '../components/primitives/DarkGrain';
import { Glitch } from '../components/primitives/Glitch';
import { Reveal } from '../components/primitives/Reveal';
import { ScanLines } from '../components/primitives/ScanLines';

const Projects = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  const projects = useMemo(() => loadProjects(), []);
  const columnsPerRow = isMobile ? 1 : 3;

  return (
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <BTopBar />

      <article style={{ maxWidth: 1180, margin: '0 auto', padding: isMobile ? '40px 20px 64px 20px' : '64px 32px 96px 32px' }}>
        <Reveal>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 28,
            }}
          >
            {tr('directionB.read.back')}
          </Link>
        </Reveal>

        <Reveal delay={80}>
          <div
            data-testid="projects-meta"
            style={{
              fontSize: 11,
              color: t.dim,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            {tr('directionB.projectsPage.meta')} · {projects.length}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(26px, 6vw, 76px)',
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              color: t.ink,
            }}
          >
            <Glitch strong period={5200}>{tr('directionB.projectsPage.title')}</Glitch>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p style={{ margin: '20px 0 0 0', maxWidth: 720, fontSize: 14, color: t.dim, lineHeight: 1.6 }}>
            {tr('directionB.projectsPage.intro')}
          </p>
        </Reveal>

        {projects.length === 0 ? (
          <Reveal delay={320}>
            <div style={{ marginTop: 40, fontSize: 13, color: t.dim }}>{tr('directionB.projectsPage.empty')}</div>
          </Reveal>
        ) : (
          <div
            style={{
              marginTop: 40,
              display: 'grid',
              gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))`,
              borderTop: `1px solid ${t.rule}`,
            }}
          >
            {projects.map((p, i) => (
              <BProjectCard key={p.id} p={p} i={i} columnsPerRow={columnsPerRow} />
            ))}
          </div>
        )}
      </article>

      <CommandPalette sections={PALETTE_SECTIONS} />
      <ScanLines />
      <DarkGrain />
    </div>
  );
};

export default Projects;
```

- [ ] **Step 2: Wire the routes in `src/App.tsx`**

Replace the import line `import Portfolio from './pages/Portfolio';` with `import Projects from './pages/Projects';` (keep the `// pages` group alphabetical: it goes between `Pgp` and `Writing`).

After the line `        <Route path="/pgp" element={<Pgp />} />` add:
```tsx
        <Route path="/projects" element={<Projects />} />
        {/* The legacy portfolio page showed placeholder projects; its URL now lands on the curated list. */}
        <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
```
Remove the line `          <Route path="/portfolio" element={<Portfolio />} />` from the `LegacyLayout` block.

- [ ] **Step 3: Delete the legacy page and its data**

```bash
git rm -q src/pages/Portfolio.tsx src/data/portfolio.json src/data/private-repos.json
git grep -n "portfolio.json\|private-repos\|pages/Portfolio" -- src || echo NO_REFERENCES
```
Expected: `NO_REFERENCES`.

- [ ] **Step 4: Point the legacy header at the new route**

In `src/components/common/Header.tsx`:
- line 26: `  { labelKey: 'nav.portfolio', route: '/portfolio' },` → `  { labelKey: 'nav.portfolio', route: '/projects' },`
- line 67: `    const isPortfolioRoute = item.route === '/portfolio' && location.pathname === '/portfolio';` → `    const isPortfolioRoute = item.route === '/projects' && location.pathname === '/projects';`

- [ ] **Step 5: Update `CLAUDE.md`**

- Line 33: replace `Main pages (\`Home\`, \`About\`, \`Portfolio\`, \`Contact\`) share a \`Header\`/\`Footer\` layout;` with `Legacy pages (\`About\`, \`Contact\`) share the old \`Header\`/\`Footer\` layout; \`/projects\` and \`/pgp\` are standalone routes on the direction-b chrome;`.
- Line 47: replace the whole line with:
  ``- `src/pages/` — Route-level components. `Projects.tsx` renders the curated cards from `src/content/projects/*.json` (one file per project, `{ en, es }` strings, `draft` hides a card in production); `/portfolio` redirects there. See `docs/superpowers/specs/2026-09-29-projects-page-and-repo-publishing-design.md`.``
- Line 48: replace the whole line with:
  ``- `src/data/` — `jorius.ts` (identity, links, experience) and the PGP key. Editorial content lives under `src/content/` (writing, now, work, projects).``

- [ ] **Step 6: Type-check, lint, test**

Run: `npx tsc -b && npm run lint && npx vitest run`
Expected: tsc silent, lint clean, all tests pass (35 baseline + the new ones).

- [ ] **Step 7: Commit**

```bash
git add -A src/pages src/data src/App.tsx src/components/common/Header.tsx CLAUDE.md
git commit -q -m "Add the projects page and retire the placeholder portfolio" -m "The legacy /portfolio page rendered invented projects and was reachable by URL. /projects renders the curated cards; the old URL redirects so nothing external breaks."
```

---

### Task 6: Top bar link (replacing Academy) and palette command

**Files:**
- Modify: `src/components/direction-b/BTopBar.tsx`
- Modify: `src/data/jorius.ts` (drop `links.academy`)
- Modify: `src/components/CommandPalette.tsx`

- [ ] **Step 1: Replace the Academy link with the Projects link in `BTopBar.tsx`**

Delete the whole `const academyLink = ( … );` block (from the line `  const academyLink = (` through its closing `  );`, which sits right before `  const darkGalaxyLink = (`). In its place insert:

```tsx
  const projectsLink = (
    <Link
      to="/projects"
      onClick={() => setMenuRequested(false)}
      style={{
        color: th.ink,
        textDecoration: 'none',
        letterSpacing: '0.04em',
        padding: isMobile ? '12px 0' : 0,
        fontSize: isMobile ? 14 : 12,
        borderBottom: isMobile ? `1px solid ${th.sub}` : 'none',
      }}
    >
      <Glitch trigger="hover">{t('directionB.topbar.nav.projects')}</Glitch>
    </Link>
  );
```

Then in both places where the nav is rendered (desktop `<nav style={{ display: 'flex', gap: 22 }}>` and the mobile `<nav style={{ display: 'flex', flexDirection: 'column' }}>`), change
```tsx
            {navLinks}
            {academyLink}
            {darkGalaxyLink}
```
to
```tsx
            {navLinks}
            {projectsLink}
            {darkGalaxyLink}
```
The `JORIUS` data import at the top of the file (`import { JORIUS } from '../../data/jorius';` under `// data`) was only used by the academy link; remove that import line and the now-empty `// data` comment above it. The literal brand text `JORIUS` inside the logo `<Glitch>` is unrelated and stays.

Verify: `grep -c "{projectsLink}" src/components/direction-b/BTopBar.tsx` → `2`; `grep -c "academy\|JORIUS\." src/components/direction-b/BTopBar.tsx` → `0`.

- [ ] **Step 1b: Drop the academy URL from `src/data/jorius.ts`**

Remove the line `    academy: string;` from the `links` type (lines ~46–51) and the line `    academy: 'https://jorius.github.io/engineer-mentat-academy/',` from the `links` value (lines ~71–76). The URL lives in `src/content/projects/engineer-mentat-academy.json` now. Verify: `git grep -n "links.academy\|academy:" -- src` → no output.

- [ ] **Step 2: Add the palette command in `CommandPalette.tsx`**

After the line
```ts
    all.push({ kind: 'cmd', label: tr('directionB.palette.items.showPgp'), target: '/pgp', hint: JORIUS.pgp.algo, internal: true });
```
add
```ts
    all.push({ kind: 'cmd', label: tr('directionB.palette.items.showProjects'), target: '/projects', hint: tr('directionB.palette.items.projectsHint'), internal: true });
```

- [ ] **Step 3: Type-check, lint, test**

Run: `npx tsc -b && npm run lint && npx vitest run` → all clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/BTopBar.tsx src/data/jorius.ts src/components/CommandPalette.tsx
git commit -q -m "Replace the Academy top-bar entry with Projects" -m "The academy is the first card on the new page, so its own bar entry became noise. Internal link, so no arrow; Dark Galaxy keeps its slot."
```

---

### Task 7: Build gate and headless verification

**Files:**
- Create (scratch, not committed): `$SCRATCH/smoke-projects.cjs` where `$SCRATCH` = `/tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad`

- [ ] **Step 1: Production build and preview**

```bash
cd /mnt/media/Sources/GitHub/Personal/.worktrees/jorius-projects-page
npm run build 2>&1 | tail -4
(npm run preview -- --port 4180 --strictPort > /tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/preview.log 2>&1 &) ; sleep 3; curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4180/projects
```
Expected: build succeeds; `200`.

- [ ] **Step 2: Write and run the smoke script against the preview (PROD: 10 cards)**

```bash
cat > /tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/smoke-projects.cjs <<'EOF'
const { chromium } = require('playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4180';
const shots = process.env.SHOTS || '/tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad';
(async () => {
  // The geromanager Playwright (1.59.1) expects chromium_headless_shell-1217; only 1243 is cached, so point at it explicitly. Still headless.
  const browser = await chromium.launch({ headless: true, executablePath: '/home/jorius/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(base + '/projects', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('i18nextLng', 'en'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const en = {
    title: await page.locator('h1').innerText(),
    meta: await page.locator('[data-testid="projects-meta"]').innerText(),
    cards: await page.locator('.b-index-card').count(),
    links: await page.locator('.b-index-card a[target="_blank"]').count(),
    nav: await page.locator('a[href="/projects"]').count(),
  };
  await page.screenshot({ path: `${shots}/projects-en.png`, fullPage: true });

  await page.evaluate(() => localStorage.setItem('i18nextLng', 'es'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const es = {
    title: await page.locator('h1').innerText(),
    meta: await page.locator('[data-testid="projects-meta"]').innerText(),
    cards: await page.locator('.b-index-card').count(),
  };
  await page.screenshot({ path: `${shots}/projects-es.png`, fullPage: true });

  await page.goto(base + '/portfolio', { waitUntil: 'networkidle' });
  const redirected = new URL(page.url()).pathname;

  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const homeNav = await page.locator('a[href="/projects"]').count();
  const academyInBar = await page.locator('a[href^="https://jorius.github.io/engineer-mentat-academy"]').count();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/projects', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${shots}/projects-mobile.png`, fullPage: true });
  const mobileCards = await page.locator('.b-index-card').count();

  console.log(JSON.stringify({ en, es, redirected, homeNav, academyInBar, mobileCards, errors }, null, 2));
  await browser.close();
})();
EOF
NODE_PATH=/mnt/media/Sources/JerichoDigital/geromanager/node_modules node /tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/smoke-projects.cjs
```
Expected JSON: `en.title` "Projects", `en.meta` "§ PROJECTS · 10", `en.cards` 10, `en.links` ≥ 17, `en.nav` ≥ 1; `es.title` "Proyectos", `es.meta` "§ PROYECTOS · 10", `es.cards` 10; `redirected` "/projects"; `homeNav` ≥ 1; `academyInBar` 0 (the academy is reached from its card now, not from the bar); `mobileCards` 10; `errors` `[]`. Then look at the three PNGs with the Read tool and confirm: three columns on desktop, one on mobile, chips readable, links row at the bottom of each card, no overflow.

- [ ] **Step 3: Dev build shows the draft too (11 cards)**

```bash
pkill -f "vite preview" ; (npm run dev -- --port 5180 --strictPort > /tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/dev.log 2>&1 &) ; sleep 4
BASE_URL=http://127.0.0.1:5180 SHOTS=/tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/dev NODE_PATH=/mnt/media/Sources/JerichoDigital/geromanager/node_modules sh -c 'mkdir -p "$SHOTS" && node /tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/smoke-projects.cjs' | grep -E '"cards"|"meta"'
pkill -f "vite --port 5180"
```
Expected: `cards: 11` and `· 11` in both languages. Confirm no Vite process is left: `pgrep -fa vite || echo NONE`.

- [ ] **Step 4: Full gate once more, then report**

Run: `npm run lint && npx vitest run && npm run build` → all green. `git status --short` → clean. `git log --oneline main..HEAD` → the spec, the two plans and six implementation commits.

Report to the owner: branch name, worktree path, the command to test it himself (`cd /mnt/media/Sources/GitHub/Personal/.worktrees/jorius-projects-page && npm run dev -- --port 5180`), the three screenshots, and that nothing has been pushed. Do not merge or push.

---

## Done when

- `feature/projects-page` builds, lints and tests green; the preview shows 10 cards in both languages, the dev server 11.
- `/portfolio` lands on `/projects`; the top bar and palette reach the page.
- The owner has the worktree path and port to test with; merge and push wait for his go.

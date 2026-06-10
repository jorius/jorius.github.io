# Content Dynamism & Writing CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hard-coded dates/copy with live values, tighten OPSEC and positioning, invert the PGP fingerprint animation, add GitHub + language icons to OSS, and introduce a Git-based CMS (pagescms.org) for NOW/WORK/WRITING plus a new categorized Writing page with a paper reading pane.

**Architecture:** All work on branch `feature/content-dynamism-and-writing-cms`. CMS-managed content moves out of i18n JSON / `jorius.ts` into paired-locale JSON files under `src/content/`, read at build time via static `import` and `import.meta.glob`. A `.pages.yml` at repo root exposes those files to pagescms.org (hosted Git CMS, GitHub OAuth, commits back — no server code). RECORD stays in `jorius.ts`.

**Tech Stack:** React 19 + TypeScript 5.9 + Vite 7, i18next, react-router-dom 7, react-icons, Tailwind 3. New deps: `react-markdown`, `remark-gfm`.

**Verification note:** This repo has **no test runner**. The gates are `npm run build` (`tsc -b` then `vite build` — any TS error fails) and `npm run lint` (ESLint, also pre-commit). Each task verifies with build + lint, plus a `npm run dev` visual check where behavior is visual. Do **not** add a test framework — it is out of scope. Never add `Co-Authored-By` lines (project rule). Commit subjects start with a capitalized verb.

---

## Task 1: Live-date utilities

**Files:**
- Create: `src/utils/dateLabels.ts`

- [ ] **Step 1: Create the util**

```ts
// src/utils/dateLabels.ts

// Live editorial date labels. Computed from the visitor's clock so the site
// never carries a stale hard-coded month/quarter/year.

const normalizeLang = (lang: string): 'en' | 'es' => (lang.startsWith('es') ? 'es' : 'en');

// "JUNE 2026" / "JUNIO 2026"
export const currentMonthYear = (lang: string): string => {
  const now = new Date();
  const month = new Intl.DateTimeFormat(normalizeLang(lang), { month: 'long' }).format(now);
  return `${month} ${now.getFullYear()}`.toUpperCase();
};

// "Q2 2026"
export const currentQuarter = (): string => {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q} ${now.getFullYear()}`;
};

// 2026
export const currentYear = (): number => new Date().getFullYear();
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS (no errors). The util is unused so far — that's fine.

- [ ] **Step 3: Commit**

```bash
git add src/utils/dateLabels.ts
git commit -m "Add live date-label utilities"
```

---

## Task 2: Wire hero meta to live month/year

**Files:**
- Modify: `src/components/direction-b/BHero.tsx`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Change the i18n `hero.meta` to a prefix (both locales)**

In `en.json`, set `directionB.hero.meta` to:
```
"PERSONAL RECORD · "
```
In `es.json`, set `directionB.hero.meta` to:
```
"REGISTRO PERSONAL · "
```

- [ ] **Step 2: Append the live month/year in BHero**

In `src/components/direction-b/BHero.tsx`, add the import in the `// utils` group (create the group after `// hooks`):

```ts
// utils
import { currentMonthYear } from '../../utils/dateLabels';
```

Then change the meta `<Scramble>` line. Current:
```tsx
          <Scramble text={tr('directionB.hero.meta')} />
```
New:
```tsx
          <Scramble text={`${tr('directionB.hero.meta')}${currentMonthYear(tr('directionB.hero.meta', { lng: undefined }) && i18n.language)}`} />
```

That is awkward — instead read the language directly. At the top of the component where `const { t: tr } = useTranslation();` is, change to also grab `i18n`:
```tsx
  const { t: tr, i18n } = useTranslation();
```
And the meta line becomes:
```tsx
          <Scramble text={`${tr('directionB.hero.meta')}${currentMonthYear(i18n.language)}`} />
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev`, open the hero — meta reads `PERSONAL RECORD · JUNE 2026` (EN) / `REGISTRO PERSONAL · JUNIO 2026` (ES via the language toggle). No `NO. 010`.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/BHero.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Show live month and year in hero meta"
```

---

## Task 3: Wire top-bar availability quarter + footer/volume year

**Files:**
- Modify: `src/components/direction-b/BTopBar.tsx`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Import the date util in BTopBar**

In `src/components/direction-b/BTopBar.tsx`, add after the `// hooks` import group:
```ts
// utils
import { currentQuarter, currentYear } from '../../utils/dateLabels';
```

- [ ] **Step 2: Replace the hard-coded `Q3 2026` availability**

Current:
```tsx
        {' '}{t('directionB.topbar.available')} · Q3 2026
```
New:
```tsx
        {' '}{t('directionB.topbar.available')} · {currentQuarter()}
```

- [ ] **Step 3: Make the volume year live**

The `topbar.volume` i18n value is `"Vol. X · 2026"`. Change both locales' `directionB.topbar.volume` to `"Vol. X · "` and append the year in the component.

Current usage:
```tsx
          {!isMobile ? <span>{t('directionB.topbar.volume')}</span> : null}
```
New:
```tsx
          {!isMobile ? <span>{t('directionB.topbar.volume')}{currentYear()}</span> : null}
```

- [ ] **Step 4: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev` — top bar shows `Available · Q2 2026` and `Vol. X · 2026`.

- [ ] **Step 5: Commit**

```bash
git add src/components/direction-b/BTopBar.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Show live quarter and year in top bar"
```

---

## Task 4: Wire contact status quarter + footer year

**Files:**
- Modify: `src/components/direction-b/BContact.tsx`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Change i18n `contact.status` to drop the hard-coded quarter**

In `en.json`, set `directionB.contact.status` to `"Open to roles ·"`.
In `es.json`, set `directionB.contact.status` to `"Abierto a roles ·"`.

In `en.json`, set `directionB.contact.footer.copyright` to `"JOSE RÍOS · PERSONAL RECORD"` (drop the leading `© 2026 `).
In `es.json`, set `directionB.contact.footer.copyright` to `"JOSE RÍOS · REGISTRO PERSONAL"`.

- [ ] **Step 2: Import the date util in BContact**

In `src/components/direction-b/BContact.tsx`, add after the `// hooks` group:
```ts
// utils
import { currentQuarter, currentYear } from '../../utils/dateLabels';
```

- [ ] **Step 3: Append the live quarter to the status**

Current:
```tsx
          <div style={{ fontSize: 18, color: t.ink, marginTop: 6 }}>{tr('directionB.contact.status')}</div>
```
New:
```tsx
          <div style={{ fontSize: 18, color: t.ink, marginTop: 6 }}>{tr('directionB.contact.status')} {currentQuarter()}</div>
```

- [ ] **Step 4: Prepend the live year to the footer copyright**

Current:
```tsx
        <span>{tr('directionB.contact.footer.copyright')}</span>
```
New:
```tsx
        <span>© {currentYear()} {tr('directionB.contact.footer.copyright')}</span>
```

- [ ] **Step 5: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev`, scroll to contact — status reads `Open to roles · Q2 2026`; footer reads `© 2026 JOSE RÍOS · PERSONAL RECORD`.

- [ ] **Step 6: Commit**

```bash
git add src/components/direction-b/BContact.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Show live quarter and year in contact section"
```

---

## Task 5: Sequential EXHIBIT_0N on the cat portrait

**Files:**
- Modify: `src/components/direction-b/Portrait.tsx`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Turn the exhibit string into a prefix (both locales)**

In `en.json`, set `directionB.portrait.exhibit` to `"EXHIBIT_"`.
In `es.json`, set `directionB.portrait.exhibit` to `"EXHIBICIÓN_"`.

- [ ] **Step 2: Render the active index in Portrait**

In `src/components/direction-b/Portrait.tsx`, find:
```tsx
        <span>{tr('directionB.portrait.exhibit')}</span>
```
Replace with:
```tsx
        <span>{tr('directionB.portrait.exhibit')}{String(activeIdx + 1).padStart(2, '0')}</span>
```

`activeIdx` is already in scope (`const activeCat = CATS[activeIdx];`).

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev` — as the portrait rotates the label cycles `EXHIBIT_01` → `EXHIBIT_02` → `EXHIBIT_03` → `EXHIBIT_04` matching the active cat; the ‹ › nav changes it too.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/Portrait.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Number cat exhibit label sequentially"
```

---

## Task 6: Remove Medellín references (OPSEC → Colombia)

**Files:**
- Modify: `src/data/jorius.ts`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Replace all city references in jorius.ts**

In `src/data/jorius.ts`:
- Change `locale: 'Medellín → remote',` to `locale: 'Colombia → remote',`.
- Change every `loc: 'Medellín, Colombia',` (there are 5) to `loc: 'Colombia',`. Leave `loc: 'Remote',` (Globant) untouched.

- [ ] **Step 2: Replace the operating value in i18n (both locales)**

Set `directionB.hero.operatingValue` to `"Colombia · GMT-5"` in **both** `en.json` and `es.json`.

- [ ] **Step 3: Verify no Medellín references remain**

Run: `grep -rni "medell" src/`
Expected: no matches.
Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/jorius.ts src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Remove city references in favor of Colombia"
```

---

## Task 7: Rewrite the hero body copy

**Files:**
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Replace `directionB.hero.body` (EN)**

Set `en.json` `directionB.hero.body` to:
```
"I design and ship large-scale systems end to end — frontend, backend, AWS, infrastructure, CI/CD. I plug into big teams and established ecosystems, or architect new ones from scratch: the kind of platform that has to hold up at Twitch-, Spotify-, or Amazon-scale from day one."
```

- [ ] **Step 2: Replace `directionB.hero.body` (ES)**

Set `es.json` `directionB.hero.body` to:
```
"Diseño y entrego sistemas a gran escala de punta a punta — frontend, backend, AWS, infraestructura, CI/CD. Me integro a equipos grandes y ecosistemas ya establecidos, o los diseño desde cero: plataformas que deben sostenerse a escala Twitch, Spotify o Amazon desde el primer día."
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev` — hero body reflects the new copy in both languages.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Rewrite hero body to emphasize large-scale systems"
```

---

## Task 8: Invert the PGP fingerprint animation

**Files:**
- Modify: `src/components/direction-b/BContact.tsx` (the `PgpBlock` component)

Goal: default state = continuously scrambled `[ ENCRYPTED ]`; hover = decrypt to the real fingerprint, label `[ DECRYPTED ]`.

- [ ] **Step 1: Run the scramble loop while NOT hovered**

In `PgpBlock`, current effect:
```tsx
  useEffect(() => {
    if (hovered) {
      const loop = (): void => {
        setScrambled(scrambleFp(JORIUS.pgp.fingerprint));
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [hovered]);
```
Change the condition `if (hovered) {` to `if (!hovered) {`.

- [ ] **Step 2: Flip the displayed fingerprint**

Current:
```tsx
  const displayedFp = hovered && scrambled !== null ? scrambled : JORIUS.pgp.fingerprint;
```
New (show scramble unless hovered):
```tsx
  const displayedFp = !hovered && scrambled !== null ? scrambled : JORIUS.pgp.fingerprint;
```

- [ ] **Step 3: Reset scramble on hover-enter instead of hover-leave**

Current handlers on the wrapper `div`:
```tsx
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setScrambled(null); }}
```
New:
```tsx
      onMouseEnter={() => { setHovered(true); setScrambled(null); }}
      onMouseLeave={() => setHovered(false)}
```

- [ ] **Step 4: Flip the Glitch trigger and the label text**

Current Glitch:
```tsx
        <Glitch trigger={hovered ? 'always' : 'off'} strong>
```
New (glitchy while encrypted, calm when decrypted):
```tsx
        <Glitch trigger={hovered ? 'off' : 'always'} strong>
```

Current label block text `[ ENCRYPTED ]` and its visibility (`opacity: hovered ? 1 : 0`). Change so the label is always visible and its text reflects state. Replace:
```tsx
      <div
        aria-hidden
        style={{
          fontSize: 10,
          color: t.dim,
          letterSpacing: '0.14em',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 150ms, transform 150ms',
          marginTop: 4,
          userSelect: 'none',
        }}
      >
        [ ENCRYPTED ]
      </div>
```
With:
```tsx
      <div
        aria-hidden
        style={{
          fontSize: 10,
          color: t.dim,
          letterSpacing: '0.14em',
          opacity: 1,
          transition: 'opacity 150ms',
          marginTop: 4,
          userSelect: 'none',
        }}
      >
        {hovered ? '[ DECRYPTED ]' : '[ ENCRYPTED ]'}
      </div>
```

- [ ] **Step 5: Keep the scan-line overlay on the active (hover) state**

The scan-line overlay currently uses `opacity: hovered ? 0.1 : 0` — leave as is (it now reads as the "decrypting beam" on hover). No change.

- [ ] **Step 6: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev`, scroll to contact PGP line — by default the fingerprint hex is constantly scrambling and the label reads `[ ENCRYPTED ]`; on hover the real fingerprint resolves and the label reads `[ DECRYPTED ]`.

- [ ] **Step 7: Commit**

```bash
git add src/components/direction-b/BContact.tsx
git commit -m "Invert fingerprint to decrypt on hover"
```

---

## Task 9: Language-icon helper + GitHub/language icons in OSS

**Files:**
- Create: `src/utils/languageIcons.tsx`
- Modify: `src/components/direction-b/BOssWriting.tsx`

- [ ] **Step 1: Create the language-icon map**

```tsx
// src/utils/languageIcons.tsx

// packages
import type { IconType } from 'react-icons';
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiRust,
  SiCplusplus,
  SiC,
  SiPhp,
  SiRuby,
  SiHtml5,
  SiCss3,
  SiKotlin,
  SiSwift,
  SiGnubash,
} from 'react-icons/si';

interface LangIcon {
  Icon: IconType;
  color: string;
}

// Maps a GitHub `language` string to a brand icon + color. Unmapped languages
// fall back to plain text in the consumer, so this only needs the common ones.
const LANGUAGE_ICONS: Record<string, LangIcon> = {
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  Python: { Icon: SiPython, color: '#3776AB' },
  Go: { Icon: SiGo, color: '#00ADD8' },
  Rust: { Icon: SiRust, color: '#DEA584' },
  'C++': { Icon: SiCplusplus, color: '#00599C' },
  C: { Icon: SiC, color: '#A8B9CC' },
  PHP: { Icon: SiPhp, color: '#777BB4' },
  Ruby: { Icon: SiRuby, color: '#CC342D' },
  HTML: { Icon: SiHtml5, color: '#E34F26' },
  CSS: { Icon: SiCss3, color: '#1572B6' },
  Kotlin: { Icon: SiKotlin, color: '#7F52FF' },
  Swift: { Icon: SiSwift, color: '#F05138' },
  Shell: { Icon: SiGnubash, color: '#4EAA25' },
};

export const getLanguageIcon = (language: string | null): LangIcon | null =>
  language ? (LANGUAGE_ICONS[language] ?? null) : null;
```

- [ ] **Step 2: Verify the icon names resolve**

Run: `npm run build`
Expected: PASS. If any `Si*` import errors (icon renamed in this `react-icons` version), remove that one entry + its import (the consumer falls back to text). Re-run until PASS.

- [ ] **Step 3: Add the imports to BOssWriting**

In `src/components/direction-b/BOssWriting.tsx`, add to the `// packages` group:
```ts
import { FaGithub } from 'react-icons/fa';
```
Add a `// utils` group after the `// components` imports (or wherever utils fits the existing ordering — place after hooks/components per convention):
```ts
// utils
import { getLanguageIcon } from '../../utils/languageIcons';
```

- [ ] **Step 4: Render the GitHub mark on the repo link and the language icon**

In the OSS `topOss.map(...)` block, the repo header is currently:
```tsx
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.ink, textDecoration: 'none', fontSize: 15 }}
                >
                  <Glitch trigger="hover">{r.full_name}</Glitch>
                </a>
                <span style={{ fontSize: 12, color: t.dim }}>
                  ★ {r.stargazers_count.toLocaleString()}
                  {r.language ? ` · ${r.language}` : ''}
                </span>
              </div>
```
Replace with (GitHub mark before the name; language icon before the language text, text fallback preserved):
```tsx
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.ink, textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <FaGithub aria-hidden style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <Glitch trigger="hover">{r.full_name}</Glitch>
                </a>
                <span style={{ fontSize: 12, color: t.dim, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  ★ {r.stargazers_count.toLocaleString()}
                  {r.language ? (() => {
                    const li = getLanguageIcon(r.language);
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        ·
                        {li ? <li.Icon aria-hidden style={{ width: 12, height: 12, color: li.color }} /> : null}
                        {r.language}
                      </span>
                    );
                  })() : null}
                </span>
              </div>
```

- [ ] **Step 5: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev`, scroll to WRITING & OSS — each repo shows the GitHub octocat before its name and (for mapped languages) a colored language icon before the language name.

- [ ] **Step 6: Commit**

```bash
git add src/utils/languageIcons.tsx src/components/direction-b/BOssWriting.tsx
git commit -m "Add GitHub and language icons to OSS list"
```

---

## Task 10: Content helper + NOW content file + BNow wiring

**Files:**
- Create: `src/utils/content.ts`
- Create: `src/content/now.json`
- Modify: `src/components/direction-b/BNow.tsx`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Confirm JSON imports are enabled**

Run: `grep -rn "resolveJsonModule" tsconfig*.json`
Expected: `"resolveJsonModule": true` present in the app tsconfig. If absent, add it under `compilerOptions` in `tsconfig.app.json` and include that change in this task's commit.

- [ ] **Step 2: Create the content helper**

```ts
// src/utils/content.ts

// Shared types + locale picker for CMS-managed content (pagescms.org writes
// these JSON files; the app reads them at build time). Each editable string is
// stored as a paired { en, es } object so translations stay side-by-side.

export type Lang = 'en' | 'es';

export interface Localized {
  en: string;
  es: string;
}

export const pickLocale = (field: Localized, lang: string): string => {
  const key: Lang = lang.startsWith('es') ? 'es' : 'en';
  return field[key] ?? field.en;
};

export interface NowContent {
  lastUpdated: string;
  siversNote: Localized;
  entries: Array<{ key: string } & Localized>;
}

export interface WorkService {
  id: string;
  stack: string[];
  title: Localized;
  body: Localized;
}

export interface WorkContent {
  services: WorkService[];
}

export interface WritingCategory {
  id: string;
  order: number;
  label: Localized;
}

export interface WritingPost {
  slug: string;
  category: string;
  date: string;
  len: string;
  tag: string;
  draft: boolean;
  title: Localized;
  body: Localized;
}

const categoryModules = import.meta.glob('../content/writing/categories/*.json', { eager: true });
const postModules = import.meta.glob('../content/writing/posts/*.json', { eager: true });

export const loadCategories = (): WritingCategory[] =>
  Object.values(categoryModules)
    .map((m) => (m as { default: WritingCategory }).default)
    .sort((a, b) => a.order - b.order);

export const loadPosts = (): WritingPost[] =>
  Object.values(postModules)
    .map((m) => (m as { default: WritingPost }).default)
    .filter((p) => (import.meta.env.PROD ? !p.draft : true))
    .sort((a, b) => b.date.localeCompare(a.date));
```

- [ ] **Step 3: Create `src/content/now.json`** (migrate current i18n values, paired)

```json
{
  "lastUpdated": "2026-04-11",
  "siversNote": {
    "en": "This page is inspired by Derek Sivers's \"now page.\" If your website only has three things, this should be one of them.",
    "es": "Esta página está inspirada en la \"now page\" de Derek Sivers. Si tu sitio web solo tiene tres cosas, esta debería ser una de ellas."
  },
  "entries": [
    { "key": "writing", "en": "a sci-fi novel of my own — first draft, slow and steady", "es": "una novela de ciencia ficción propia — primer borrador, lento pero seguro" },
    { "key": "building", "en": "a 2D game set in the same sci-fi universe", "es": "un juego 2D ambientado en el mismo universo de ciencia ficción" },
    { "key": "looking", "en": "open to my next role — full-stack or security-focused, remote", "es": "abierto a mi próximo rol — full-stack o enfocado en seguridad, remoto" },
    { "key": "home", "en": "raising a family and 4 demanding cats", "es": "criando una familia y 4 gatos exigentes" },
    { "key": "co-founding", "en": "a small studio with a friend — custom software + SaaS", "es": "un pequeño estudio con un amigo — software a medida + SaaS" }
  ]
}
```

> Verify the ES strings against the current `es.json` `directionB.now.entries` values and copy those exact translations if they differ; the above mirrors the EN list.

- [ ] **Step 4: Rewire BNow to read the content file**

Replace `src/components/direction-b/BNow.tsx` with:

```tsx
// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// utils
import { pickLocale } from '../../utils/content';

// data
import nowContent from '../../content/now.json';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BNow = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const lang = i18n.language;
  return (
    <>
      <BSectionHead
        id="b-now"
        num={tr('directionB.sections.now.num')}
        label={tr('directionB.sections.now.label')}
        kicker={tr('directionB.sections.now.kicker')}
      />
      <div
        style={{
          padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 24 : 32,
          borderTop: `1px solid ${t.soft}`,
          paddingTop: 28,
        }}
      >
        <div>
          {nowContent.entries.map((n, i) => (
            <Reveal
              key={n.key}
              delay={i * 60}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '80px 1fr' : '160px 1fr',
                padding: '18px 0',
                borderBottom: `1px solid ${t.soft}`,
                gap: isMobile ? 12 : 0,
              }}
            >
              <div style={{ color: t.dim, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{n.key}</div>
              <div style={{ color: t.ink, fontSize: 15, lineHeight: 1.5 }}>{pickLocale(n, lang)}</div>
            </Reveal>
          ))}
        </div>
        <div style={{ alignSelf: isMobile ? 'start' : 'end', paddingBottom: isMobile ? 0 : 18 }}>
          <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tr('directionB.now.lastUpdatedLabel')}</div>
          <div style={{ fontSize: isMobile ? 24 : 40, color: t.ink, letterSpacing: '-0.02em', marginTop: 6 }}>
            <Glitch trigger="hover" strong>{nowContent.lastUpdated}</Glitch>
          </div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 10, maxWidth: isMobile ? '100%' : 380 }}>
            {pickLocale(nowContent.siversNote, lang)}
          </div>
        </div>
      </div>
    </>
  );
};
```

> Note: `pickLocale(n, lang)` works because each entry is `{ key, en, es }` — a superset of `Localized`.

- [ ] **Step 5: Remove the now-migrated i18n keys**

In both `en.json` and `es.json`, delete `directionB.now.entries`, `directionB.now.siversNote`, and `directionB.now.lastUpdatedDate`. **Keep** `directionB.now.lastUpdatedLabel` (still used as a label).

- [ ] **Step 6: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev` — NOW section renders identically from `now.json`; language toggle still switches entry text.

- [ ] **Step 7: Commit**

```bash
git add src/utils/content.ts src/content/now.json src/components/direction-b/BNow.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Move NOW content to CMS-managed JSON"
```

---

## Task 11: WORK content file + BServices wiring

**Files:**
- Create: `src/content/work.json`
- Modify: `src/components/direction-b/BServices.tsx`
- Modify: `src/data/jorius.ts`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

- [ ] **Step 1: Capture current WORK copy**

Run: `node -e "const e=require('./src/i18n/locales/en.json').directionB.services; console.log(JSON.stringify(e,null,1))"`
Run: `node -e "const e=require('./src/i18n/locales/es.json').directionB.services; console.log(JSON.stringify(e,null,1))"`
Use the printed `title`/`body` strings for each id (`01`,`02`,`03`) as the paired values in the next step.

- [ ] **Step 2: Create `src/content/work.json`**

Fill `title`/`body` from Step 1 output (EN + ES); `stack` arrays come from `JORIUS.services` in `src/data/jorius.ts`:

```json
{
  "services": [
    {
      "id": "01",
      "stack": ["TypeScript", "React", "Next.js", "Node", "AWS", "Postgres"],
      "title": { "en": "<EN title 01>", "es": "<ES title 01>" },
      "body": { "en": "<EN body 01>", "es": "<ES body 01>" }
    },
    {
      "id": "02",
      "stack": ["OWASP", "OAuth/OIDC", "Threat-modeling", "Burp", "Semgrep"],
      "title": { "en": "<EN title 02>", "es": "<ES title 02>" },
      "body": { "en": "<EN body 02>", "es": "<ES body 02>" }
    },
    {
      "id": "03",
      "stack": ["RFCs", "Review", "Hiring", "Mentoring", "Roadmaps"],
      "title": { "en": "<EN title 03>", "es": "<ES title 03>" },
      "body": { "en": "<EN body 03>", "es": "<ES body 03>" }
    }
  ]
}
```

Replace each `<...>` placeholder with the exact strings from Step 1. Do not leave placeholders.

- [ ] **Step 3: Rewire BServices**

Replace `src/components/direction-b/BServices.tsx` with:

```tsx
// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// utils
import { pickLocale } from '../../utils/content';

// data
import workContent from '../../content/work.json';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';
import { StackChip } from './StackChip';

export const BServices = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const lang = i18n.language;
  return (
    <>
      <BSectionHead
        id="b-services"
        num={tr('directionB.sections.work.num')}
        label={tr('directionB.sections.work.label')}
        kicker={tr('directionB.sections.work.kicker')}
      />
      <div style={{ padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px' }}>
        {workContent.services.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 80}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '90px 1fr 1.4fr 1fr',
              gap: isMobile ? 12 : 32,
              padding: isMobile ? '24px 0' : '32px 0',
              borderBottom: `1px solid ${t.rule}`,
              alignItems: 'start',
            }}
          >
            <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.15em' }}>{s.id}</div>
            <h3 style={{ margin: 0, fontSize: 'clamp(22px, 7vw, 40px)', color: t.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>
              <Glitch trigger="hover" strong>{pickLocale(s.title, lang)}</Glitch>
            </h3>
            <p style={{ color: t.ink, fontSize: 15, lineHeight: 1.55, margin: 0 }}>{pickLocale(s.body, lang)}</p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                justifyContent: isMobile ? 'flex-start' : 'flex-end',
              }}
            >
              {s.stack.map((tag) => <StackChip key={tag} name={tag} />)}
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
};
```

- [ ] **Step 4: Remove migrated data + i18n keys**

- In `src/data/jorius.ts`: confirm nothing else uses `services` — run `grep -rn "JORIUS.services\|\.services" src/`. Only `BServices` (now rewired) should reference it. Remove the `services: [...]` array from the `JORIUS` object and remove `services: ServiceEntry[];` from the `JoriusData` interface and the `ServiceEntry` interface if now unused (`grep -rn "ServiceEntry" src/`).
- In both `en.json` and `es.json`: delete `directionB.services` (the `01`/`02`/`03` title/body block). **Keep** `directionB.sections.work` (section head).

- [ ] **Step 5: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev` — WORK section renders from `work.json` identically; language toggle still switches title/body.

- [ ] **Step 6: Commit**

```bash
git add src/content/work.json src/components/direction-b/BServices.tsx src/data/jorius.ts src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Move WORK content to CMS-managed JSON"
```

---

## Task 12: Seed WRITING categories + posts; repoint homepage list

**Files:**
- Create: `src/content/writing/categories/scifi.json`, `tech.json`, `cybersec.json`
- Create: `src/content/writing/posts/the-origin.json`, `big-o-complexity.json`, `flipper-zero-review.json`
- Modify: `src/components/direction-b/BOssWriting.tsx`
- Modify: `src/data/jorius.ts`

- [ ] **Step 1: Create the three categories**

`src/content/writing/categories/scifi.json`:
```json
{ "id": "scifi", "order": 1, "label": { "en": "Short Sci-Fi Stories", "es": "Relatos cortos de ciencia ficción" } }
```
`src/content/writing/categories/tech.json`:
```json
{ "id": "tech", "order": 2, "label": { "en": "Technical Write-Ups", "es": "Apuntes técnicos" } }
```
`src/content/writing/categories/cybersec.json`:
```json
{ "id": "cybersec", "order": 3, "label": { "en": "Cybersec", "es": "Ciberseguridad" } }
```

- [ ] **Step 2: Create three seed posts**

`src/content/writing/posts/the-origin.json`:
```json
{
  "slug": "the-origin",
  "category": "scifi",
  "date": "2026-06-01",
  "len": "8 min",
  "tag": "fiction",
  "draft": false,
  "title": { "en": "The Origin", "es": "El origen" },
  "body": {
    "en": "# The Origin\n\nThe first draft of a short story set in my sci-fi universe.\n\nReplace this placeholder body in Pages CMS.",
    "es": "# El origen\n\nEl primer borrador de un relato corto ambientado en mi universo de ciencia ficción.\n\nReemplaza este cuerpo de ejemplo en Pages CMS."
  }
}
```
`src/content/writing/posts/big-o-complexity.json`:
```json
{
  "slug": "big-o-complexity",
  "category": "tech",
  "date": "2026-05-15",
  "len": "12 min",
  "tag": "algorithms",
  "draft": false,
  "title": { "en": "How to determine the O(n) complexity of any algorithm easily", "es": "Cómo determinar la complejidad O(n) de cualquier algoritmo fácilmente" },
  "body": {
    "en": "# Big-O, the easy way\n\nA practical walk-through for reasoning about algorithmic complexity.\n\nReplace this placeholder body in Pages CMS.",
    "es": "# Big-O, de forma sencilla\n\nUna guía práctica para razonar sobre la complejidad algorítmica.\n\nReemplaza este cuerpo de ejemplo en Pages CMS."
  }
}
```
`src/content/writing/posts/flipper-zero-review.json`:
```json
{
  "slug": "flipper-zero-review",
  "category": "cybersec",
  "date": "2026-04-20",
  "len": "10 min",
  "tag": "hardware",
  "draft": false,
  "title": { "en": "Flipper Zero Review", "es": "Reseña del Flipper Zero" },
  "body": {
    "en": "# Flipper Zero Review\n\nHands-on notes on the multi-tool for pentesters and tinkerers.\n\nReplace this placeholder body in Pages CMS.",
    "es": "# Reseña del Flipper Zero\n\nNotas prácticas sobre la multiherramienta para pentesters y curiosos.\n\nReemplaza este cuerpo de ejemplo en Pages CMS."
  }
}
```

- [ ] **Step 3: Repoint the homepage WRITING list to content + `/writing/:slug`**

In `src/components/direction-b/BOssWriting.tsx`:

Add a `// utils` import for the loader and locale picker (alongside the `getLanguageIcon` util import added in Task 9):
```ts
// utils
import { getLanguageIcon } from '../../utils/languageIcons';
import { loadPosts, pickLocale } from '../../utils/content';
```

Remove the `import { JORIUS } from '../../data/jorius';` line **only if** no other reference to `JORIUS` remains in the file — check first: the error/empty states use `JORIUS.links.github` and `JORIUS.handle`. **Keep the import** (still used). Just stop using `JORIUS.writing`.

Replace:
```tsx
  const hasWriting = JORIUS.writing.length > 0;
```
with:
```tsx
  const posts = loadPosts();
  const hasWriting = posts.length > 0;
```

Replace the writing list render block:
```tsx
          {JORIUS.writing.map((w, i) => (
            <Reveal key={w.slug} delay={i * 40}>
              <Link
                to={`/read/${w.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '110px 1fr 72px',
                  padding: '18px 0',
                  borderBottom: `1px solid ${t.soft}`,
                  color: t.ink,
                  textDecoration: 'none',
                  gap: isMobile ? 6 : 12,
                  alignItems: 'baseline',
                  transition: 'background 180ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = t.sub;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ color: t.dim, fontSize: 12 }}>{w.date}</span>
                <span style={{ fontSize: 17, letterSpacing: '-0.01em' }}>
                  <Glitch trigger="hover">{w.title}</Glitch>
                </span>
                <span style={{ color: t.dim, fontSize: 12, textAlign: isMobile ? 'left' : 'right' }}>{w.len}</span>
              </Link>
            </Reveal>
          ))}
```
with (uses `posts`, `pickLocale`, links to `/writing/:slug`):
```tsx
          {posts.map((w, i) => (
            <Reveal key={w.slug} delay={i * 40}>
              <Link
                to={`/writing/${w.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '110px 1fr 72px',
                  padding: '18px 0',
                  borderBottom: `1px solid ${t.soft}`,
                  color: t.ink,
                  textDecoration: 'none',
                  gap: isMobile ? 6 : 12,
                  alignItems: 'baseline',
                  transition: 'background 180ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = t.sub;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ color: t.dim, fontSize: 12 }}>{w.date}</span>
                <span style={{ fontSize: 17, letterSpacing: '-0.01em' }}>
                  <Glitch trigger="hover">{pickLocale(w.title, i18n.language)}</Glitch>
                </span>
                <span style={{ color: t.dim, fontSize: 12, textAlign: isMobile ? 'left' : 'right' }}>{w.len}</span>
              </Link>
            </Reveal>
          ))}
```

Add `i18n` to the translation hook in this component: change `const { t: tr } = useTranslation();` to `const { t: tr, i18n } = useTranslation();`.

- [ ] **Step 4: Remove `writing` from jorius.ts**

Run: `grep -rn "JORIUS.writing\|WritingEntry" src/`
`Read.tsx` will still reference `JORIUS.writing` — it is retired in Task 13, so do this step's removal **after** confirming, or leave `writing` until Task 13. To keep each task building green, **defer** removing `writing`/`WritingEntry` from `jorius.ts` to Task 13 (after `Read.tsx` is deleted). For now leave `JORIUS.writing: []` in place.

- [ ] **Step 5: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev` — homepage WRITING list now shows the three seed posts (newest first), each linking to `/writing/<slug>` (route arrives in Task 13; link will 404 until then — acceptable mid-plan).

- [ ] **Step 6: Commit**

```bash
git add src/content/writing src/components/direction-b/BOssWriting.tsx
git commit -m "Seed writing content and point homepage list to writing page"
```

---

## Task 13: New Writing page (tree + paper reader), routes, retire Read

**Files:**
- Create: `src/pages/Writing.tsx`
- Modify: `src/App.tsx`
- Modify: `src/data/jorius.ts`
- Delete: `src/pages/Read.tsx`
- Modify: `package.json` (add deps)

- [ ] **Step 1: Install markdown deps**

Run: `npm install react-markdown remark-gfm`
Expected: both added to `dependencies`; `package-lock.json` updated.

- [ ] **Step 2: Create the Writing page**

```tsx
// src/pages/Writing.tsx

// packages
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../hooks/useMediaQuery';

// utils
import { loadCategories, loadPosts, pickLocale } from '../utils/content';

// components
import { BTopBar } from '../components/direction-b/BTopBar';
import { DarkGrain } from '../components/primitives/DarkGrain';
import { Glitch } from '../components/primitives/Glitch';
import { ScanLines } from '../components/primitives/ScanLines';

const Writing = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const lang = i18n.language;

  const categories = useMemo(() => loadCategories(), []);
  const posts = useMemo(() => loadPosts(), []);

  // Active post: the slug from the URL, else the first post (newest first).
  const active = useMemo(
    () => posts.find((p) => p.slug === slug) ?? posts[0] ?? null,
    [posts, slug],
  );

  // Keep the URL canonical: if no slug (or unknown slug) and we have posts,
  // redirect to the active post so links are shareable.
  useEffect(() => {
    if (active && active.slug !== slug) {
      navigate(`/writing/${active.slug}`, { replace: true });
    }
  }, [active, slug, navigate]);

  const postsByCategory = (catId: string): typeof posts => posts.filter((p) => p.category === catId);

  const treeWidth = isMobile ? '100%' : 'clamp(220px, 26vw, 320px)';

  return (
    <div style={{ background: t.paper, color: t.ink, minHeight: '100vh', position: 'relative' }}>
      <ScanLines />
      <DarkGrain />
      <BTopBar />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : `${treeWidth} 1fr`,
          gap: isMobile ? 24 : 40,
          padding: isMobile ? '24px 20px 60px 20px' : '40px 32px 80px 32px',
          alignItems: 'start',
        }}
      >
        {/* LEFT — category tree */}
        <nav
          style={{
            position: isMobile ? 'static' : 'sticky',
            top: isMobile ? undefined : 80,
            borderRight: isMobile ? 'none' : `1px solid ${t.rule}`,
            paddingRight: isMobile ? 0 : 20,
          }}
        >
          <Link
            to="/"
            style={{ fontSize: 11, color: t.dim, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            <Glitch trigger="hover">{tr('directionB.read.back')}</Glitch>
          </Link>
          <div style={{ marginTop: 20 }}>
            {categories.map((cat) => {
              const catPosts = postsByCategory(cat.id);
              if (catPosts.length === 0) return null;
              return (
                <div key={cat.id} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: t.dim,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    {pickLocale(cat.label, lang)}
                  </div>
                  {catPosts.map((p) => {
                    const isActive = active?.slug === p.slug;
                    return (
                      <Link
                        key={p.slug}
                        to={`/writing/${p.slug}`}
                        style={{
                          display: 'block',
                          padding: '7px 0 7px 12px',
                          borderLeft: `2px solid ${isActive ? t.ink : t.soft}`,
                          color: isActive ? t.ink : t.dim,
                          textDecoration: 'none',
                          fontSize: 14,
                          lineHeight: 1.4,
                          transition: 'color 150ms, border-color 150ms',
                        }}
                      >
                        <Glitch trigger="hover">{pickLocale(p.title, lang)}</Glitch>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </nav>

        {/* RIGHT — paper reader */}
        <article
          style={{
            background: t.paper,
            border: `1px solid ${t.rule}`,
            boxShadow: `8px 8px 0 ${t.ink}`,
            padding: isMobile ? '28px 22px' : '56px clamp(32px, 6vw, 88px)',
            maxWidth: 760,
            width: '100%',
          }}
        >
          {active ? (
            <>
              <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {active.date} · {active.len} · {active.tag}
              </div>
              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: isMobile ? 28 : 'clamp(32px, 5vw, 52px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  margin: '14px 0 28px 0',
                  color: t.ink,
                }}
              >
                {pickLocale(active.title, lang)}
              </h1>
              <div
                className="b-reader"
                style={{ fontSize: 17, lineHeight: 1.75, color: t.ink, maxWidth: '64ch' }}
              >
                <Markdown remarkPlugins={[remarkGfm]}>{pickLocale(active.body, lang)}</Markdown>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: t.dim }}>{tr('directionB.oss.writingEmpty')}</div>
          )}
        </article>
      </div>
    </div>
  );
};

export default Writing;
```

- [ ] **Step 3: Add reader typography styles**

In `src/index.css`, append a small block so markdown elements inherit the editorial look:
```css
/* Writing reader — readable long-form inside the paper box */
.b-reader h2 { font-family: 'Space Mono', monospace; font-size: 1.4em; margin: 1.6em 0 0.6em; letter-spacing: -0.01em; }
.b-reader h3 { font-family: 'Space Mono', monospace; font-size: 1.15em; margin: 1.4em 0 0.5em; }
.b-reader p { margin: 0 0 1.1em; }
.b-reader ul, .b-reader ol { margin: 0 0 1.1em 1.2em; }
.b-reader li { margin: 0.3em 0; }
.b-reader a { color: inherit; text-underline-offset: 3px; }
.b-reader code { font-family: 'Space Mono', monospace; font-size: 0.9em; padding: 0.1em 0.35em; background: rgba(0,0,0,0.06); }
.b-reader pre { overflow-x: auto; padding: 14px 16px; background: rgba(0,0,0,0.06); margin: 0 0 1.2em; }
.b-reader pre code { padding: 0; background: none; }
.b-reader blockquote { margin: 0 0 1.2em; padding-left: 16px; border-left: 2px solid currentColor; opacity: 0.85; }
```

- [ ] **Step 4: Update routes + retire Read**

In `src/App.tsx`:
- Change the import `import Read from './pages/Read';` to `import Writing from './pages/Writing';`.
- Add a redirect import for the legacy route. Change the top import to also pull `Navigate`:
  `import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';`
- Replace the route line `<Route path="/read/:slug" element={<Read />} />` with:
```tsx
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<Writing />} />
        <Route path="/read/:slug" element={<Navigate to="/writing" replace />} />
```

- [ ] **Step 5: Delete Read.tsx and clean jorius.ts**

Run: `rm src/pages/Read.tsx`
Run: `grep -rn "JORIUS.writing\|WritingEntry\|from './pages/Read'\|pages/Read" src/`
Expected: no remaining references. If clean, remove `writing: []` from the `JORIUS` object and `writing: WritingEntry[];` from the `JoriusData` interface and the `WritingEntry` interface in `src/data/jorius.ts`.

- [ ] **Step 6: Verify**

Run: `npm run build && npm run lint`
Expected: PASS.
Run: `npm run dev`:
  - Visit `/writing` → redirects to the newest post; left tree shows the three categories with their posts; active post highlighted.
  - Click a tree item → reader swaps, URL updates to `/writing/<slug>`.
  - Homepage WRITING row → lands on that post.
  - `/read/the-origin` → redirects to `/writing`.
  - Reader box has the hard `8px 8px 0` shadow; markdown renders with readable spacing.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Writing.tsx src/index.css src/App.tsx src/data/jorius.ts package.json package-lock.json
git rm src/pages/Read.tsx
git commit -m "Add categorized writing page with paper reader"
```

---

## Task 14: Pages CMS configuration

**Files:**
- Create: `.pages.yml` (repo root)

- [ ] **Step 1: Write `.pages.yml`**

```yaml
media:
  input: public/images
  output: /images

content:
  - name: now
    label: Now
    type: file
    path: src/content/now.json
    fields:
      - { name: lastUpdated, label: Last updated, type: date }
      - name: siversNote
        label: Sivers note
        type: object
        fields:
          - { name: en, label: English, type: text }
          - { name: es, label: Spanish, type: text }
      - name: entries
        label: Entries
        type: list
        fields:
          - { name: key, label: Key, type: string }
          - { name: en, label: English, type: string }
          - { name: es, label: Spanish, type: string }

  - name: work
    label: Work
    type: file
    path: src/content/work.json
    fields:
      - name: services
        label: Services
        type: list
        fields:
          - { name: id, label: ID, type: string }
          - { name: stack, label: Stack, type: string, list: true }
          - name: title
            label: Title
            type: object
            fields:
              - { name: en, label: English, type: string }
              - { name: es, label: Spanish, type: string }
          - name: body
            label: Body
            type: object
            fields:
              - { name: en, label: English, type: text }
              - { name: es, label: Spanish, type: text }

  - name: writing-categories
    label: Writing — Categories
    type: collection
    path: src/content/writing/categories
    filename: '{fields.id}.json'
    fields:
      - { name: id, label: ID, type: string }
      - { name: order, label: Order, type: number }
      - name: label
        label: Label
        type: object
        fields:
          - { name: en, label: English, type: string }
          - { name: es, label: Spanish, type: string }

  - name: writing-posts
    label: Writing — Posts
    type: collection
    path: src/content/writing/posts
    filename: '{fields.slug}.json'
    fields:
      - { name: slug, label: Slug, type: string }
      - name: category
        label: Category
        type: reference
        options:
          collection: writing-categories
          value: id
          label: label.en
      - { name: date, label: Date, type: date }
      - { name: len, label: Length, type: string }
      - { name: tag, label: Tag, type: string }
      - { name: draft, label: Draft, type: boolean, default: false }
      - name: title
        label: Title
        type: object
        fields:
          - { name: en, label: English, type: string }
          - { name: es, label: Spanish, type: string }
      - name: body
        label: Body
        type: object
        fields:
          - { name: en, label: English, type: rich-text }
          - { name: es, label: Spanish, type: rich-text }
```

> The exact field-type spelling (`rich-text`, `reference`, list `list: true`) should be checked against current Pages CMS docs at the time of connection; adjust if the editor rejects the schema. The app does not depend on `.pages.yml` — it only governs the CMS editor UI.

- [ ] **Step 2: Verify the app build is unaffected**

Run: `npm run build && npm run lint`
Expected: PASS (`.pages.yml` is not part of the app bundle).

- [ ] **Step 3: Commit**

```bash
git add .pages.yml
git commit -m "Add Pages CMS configuration"
```

- [ ] **Step 4: (Manual, outside this plan) Connect the repo**

Jose connects the repository at app.pagescms.org via GitHub OAuth. No code step — note this in the PR description.

---

## Task 15: Final full-site verification

- [ ] **Step 1: Clean build from scratch**

Run: `rm -rf dist && npm run build`
Expected: PASS, `dist/` produced.

- [ ] **Step 2: Production smoke test**

Run: `npm run preview` and open the served URL.
Check: hero meta month/year; top-bar quarter; portrait EXHIBIT cycling; no "Medellín" anywhere; new hero body; fingerprint encrypted-by-default/decrypt-on-hover; OSS GitHub + language icons; NOW/WORK render from JSON; `/writing` tree + paper reader; `/read/:slug` redirect; EN/ES toggle across all of the above.

- [ ] **Step 3: Lint clean**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 4: Push the branch and open a PR (only when asked)**

Per repo flow, feature branch → PR targets `main`. Do this only on the user's go-ahead.

---

## Self-Review Notes (author)

- **Spec coverage:** Tasks map to spec §1 (T1–T4), §2 (T5), §3 (T6), §4 (T7), §5 (T8), §6 (T9), §7 (T10/T11/T12/T14), §8 (T13). RECORD intentionally untouched. ✓
- **Type consistency:** `Localized`, `pickLocale`, `loadCategories`/`loadPosts`, `WritingPost`/`WritingCategory`, `NowContent`/`WorkService` defined in `content.ts` (T10) and reused in T11/T12/T13. `getLanguageIcon` defined T9, used T9. ✓
- **Ordering hazard:** `JORIUS.writing` removal deferred to T13 (after `Read.tsx` deletion) so every intermediate task builds green. Homepage `/writing/:slug` links exist from T12 but the route lands in T13 — flagged in T12 Step 5. ✓
- **Placeholders:** The only `<...>` placeholders are in T11 Step 2, with an explicit instruction to fill them from the Step 1 grep output before committing. Seed-post bodies are intentional starter content, replaced via CMS. ✓

# Recruiter Cleanup & PGP Hover Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Jericho Digital branding, assign cat co-worker roles, translate the NOW section, hide the INDEX section, fix a duplicate back-link on the PGP page, and add an animated hover effect to the PGP easter egg entry point.

**Architecture:** Six independent single-file (or two-file) changes applied sequentially; each committed on its own. No new files, no new dependencies. Verification is `npm run lint` + `npm run build` after every task.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 3, i18next, React Router DOM 7, Space Mono (monospace design), custom `Glitch`/`Scramble`/`Reveal` animation primitives.

---

## Task 1: Create feature branch

**Files:**
- No file changes — git only

- [ ] **Step 1: Create and switch to the new branch from main**

```bash
git checkout main
git checkout -b feature/recruiter-cleanup
```

Expected: you are now on `feature/recruiter-cleanup` with a clean working tree.

- [ ] **Step 2: Verify**

```bash
git status
```

Expected output contains `On branch feature/recruiter-cleanup` and `nothing to commit`.

---

## Task 2: Remove Jericho Digital affiliation

**Files:**
- Modify: `src/data/jorius.ts` (affiliations array only)

**Context:** `JORIUS.affiliations` is an array rendered in `BContact.tsx` under an "Affiliations" sub-block that is already guarded by `JORIUS.affiliations.length > 0`. Emptying the array makes the block disappear with zero component changes.

- [ ] **Step 1: Empty the affiliations array**

In `src/data/jorius.ts`, find:
```ts
  affiliations: [
    { name: 'Jericho Digital', email: 'jriosc@jericho-digital.com', tag: 'jericho' },
  ],
```
Replace with:
```ts
  affiliations: [],
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors. The `AffiliationEntry` interface and `affiliations` field remain on the type — the empty array is valid.

- [ ] **Step 3: Commit**

```bash
git add src/data/jorius.ts
git commit -m "Remove Jericho Digital affiliation from contact section"
```

---

## Task 3: Cat co-workers — roles and rename Taquito → Toji

**Files:**
- Modify: `src/components/direction-b/Portrait.tsx`

**Context:** `Portrait.tsx` defines a local `CatPhoto` interface and `CATS` array. The top framing label currently renders `{activeCat.name.toUpperCase()}{tr('directionB.portrait.type')}` (e.g. `GASOLINA / 35mm`). We add a `role` field and extend the label to `GASOLINA · LEAD QA / 35mm`.

- [ ] **Step 1: Add `role` to the `CatPhoto` interface**

In `src/components/direction-b/Portrait.tsx`, find:
```ts
interface CatPhoto {
  name: string;
  src: string;
}
```
Replace with:
```ts
interface CatPhoto {
  name: string;
  src: string;
  role: string;
}
```

- [ ] **Step 2: Update the CATS array**

Find:
```ts
const CATS: CatPhoto[] = [
  { name: 'Gasolina', src: '/images/cats/gasolina.jpg' },
  { name: 'Pancho', src: '/images/cats/pancho.jpg' },
  { name: 'Taquito', src: '/images/cats/taquito.jpeg' },
  { name: 'Cohete', src: '/images/cats/cohete.jpeg' },
];
```
Replace with:
```ts
const CATS: CatPhoto[] = [
  { name: 'Gasolina', src: '/images/cats/gasolina.jpg', role: 'Lead QA' },
  { name: 'Pancho', src: '/images/cats/pancho.jpg', role: 'CEO' },
  { name: 'Toji', src: '/images/cats/taquito.jpeg', role: 'CFO' },
  { name: 'Cohete', src: '/images/cats/cohete.jpeg', role: 'Right-hand man' },
];
```

Note: the image file at `/images/cats/taquito.jpeg` is kept as-is. Only the display name changes.

- [ ] **Step 3: Update the top framing label to include the role**

Find:
```tsx
        <span>
          {activeCat.name.toUpperCase()}
          {tr('directionB.portrait.type')}
        </span>
```
Replace with:
```tsx
        <span>
          {activeCat.name.toUpperCase()} · {activeCat.role.toUpperCase()}
          {tr('directionB.portrait.type')}
        </span>
```

- [ ] **Step 4: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/direction-b/Portrait.tsx
git commit -m "Add cat roles and rename Taquito to Toji in portrait"
```

---

## Task 4: NOW section — translate entries into both languages

**Files:**
- Modify: `src/i18n/locales/en.json`
- Modify: `src/i18n/locales/es.json`
- Modify: `src/components/direction-b/BNow.tsx`

**Context:** `BNow.tsx` currently maps over `JORIUS.now` (hardcoded English). We move the entries into both locale files and switch `BNow` to read from `tr()` with `returnObjects: true`.

- [ ] **Step 1: Add entries to the English locale**

In `src/i18n/locales/en.json`, inside the `"directionB"` → `"now"` object, add an `"entries"` array. The current `"now"` object looks like:
```json
"now": {
  "lastUpdatedLabel": "Last updated",
  "lastUpdatedDate": "2026-04-11",
  "siversNote": "This page is inspired by Derek Sivers's \"now page.\" If your website only has three things, this should be one of them."
},
```
Replace with:
```json
"now": {
  "lastUpdatedLabel": "Last updated",
  "lastUpdatedDate": "2026-04-11",
  "siversNote": "This page is inspired by Derek Sivers's \"now page.\" If your website only has three things, this should be one of them.",
  "entries": [
    { "k": "writing", "v": "a sci-fi novel of my own — first draft, slow and steady" },
    { "k": "building", "v": "a 2D game set in the same sci-fi universe" },
    { "k": "looking", "v": "open to my next role — full-stack or security-focused, remote" },
    { "k": "home", "v": "raising a family and 4 demanding cats" },
    { "k": "co-founding", "v": "a small studio with a friend — custom software + SaaS" }
  ]
},
```

- [ ] **Step 2: Add entries to the Spanish locale**

In `src/i18n/locales/es.json`, inside `"directionB"` → `"now"`, add the same `"entries"` key. Current `"now"` object:
```json
"now": {
  "lastUpdatedLabel": "Última actualización",
  "lastUpdatedDate": "2026-04-11",
  "siversNote": "Esta página está inspirada en la \"now page\" de Derek Sivers. Si tu sitio web solo tiene tres cosas, esta debería ser una de ellas."
},
```
Replace with:
```json
"now": {
  "lastUpdatedLabel": "Última actualización",
  "lastUpdatedDate": "2026-04-11",
  "siversNote": "Esta página está inspirada en la \"now page\" de Derek Sivers. Si tu sitio web solo tiene tres cosas, esta debería ser una de ellas.",
  "entries": [
    { "k": "escribiendo", "v": "una novela de ciencia ficción propia — primer borrador, poco a poco" },
    { "k": "construyendo", "v": "un juego 2D ambientado en el mismo universo de ciencia ficción" },
    { "k": "buscando", "v": "abierto a mi próximo rol — full-stack o seguridad, remoto" },
    { "k": "hogar", "v": "criando una familia y 4 gatos exigentes" },
    { "k": "co-fundando", "v": "un pequeño estudio con un amigo — software a medida + SaaS" }
  ]
},
```

- [ ] **Step 3: Update BNow.tsx to source entries from i18n**

Open `src/components/direction-b/BNow.tsx`. The current file starts with:

```tsx
// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';
```

Remove the `JORIUS` import:
```tsx
// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';
```

Inside `BNow`, add the entries declaration immediately after the existing hook calls and before the `return`:
```tsx
  const entries = tr('directionB.now.entries', { returnObjects: true }) as Array<{ k: string; v: string }>;
```

Then replace `JORIUS.now.map(...)` with `entries.map(...)`. The map call currently looks like:
```tsx
        {JORIUS.now.map((n, i) => (
```
Change it to:
```tsx
        {entries.map((n, i) => (
```

- [ ] **Step 4: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales/en.json src/i18n/locales/es.json src/components/direction-b/BNow.tsx
git commit -m "Translate NOW section entries into English and Spanish"
```

---

## Task 5: Hide INDEX section

**Files:**
- Modify: `src/components/direction-b/DirectionB.tsx`

**Context:** `DirectionB.tsx` renders `<BProjects />` and exposes an `index` entry in `PALETTE_SECTIONS`. Both need to be disabled.

- [ ] **Step 1: Comment out `<BProjects />` in the render tree**

In `src/components/direction-b/DirectionB.tsx`, find:
```tsx
      <BProjects />
```
Replace with:
```tsx
      {/* <BProjects /> */}
```

- [ ] **Step 2: Remove the index entry from PALETTE_SECTIONS**

Find:
```ts
  { id: 'b-projects', label: 'index', hint: 'projects' },
```
Delete that line entirely.

- [ ] **Step 3: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors. ESLint may warn about the unused `BProjects` import — if it does, also comment out that import line:
```tsx
// import { BProjects } from './BProjects';
```

Then run lint + build again until clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/DirectionB.tsx
git commit -m "Hide INDEX section from homepage and command palette"
```

---

## Task 6: Remove duplicate "back to record" on PGP page

**Files:**
- Modify: `src/pages/Pgp.tsx`

**Context:** `Pgp.tsx` has two identical `<Link>` blocks using `tr('directionB.read.back')`. The top one (lines 51–66, inside the first `<Reveal>`) is the keeper. The bottom one (lines 181–194, after the key-usage instructions) must be removed.

- [ ] **Step 1: Remove the bottom back-link block**

In `src/pages/Pgp.tsx`, find and delete this entire block:
```tsx
        <Reveal delay={560} style={{ marginTop: 56, borderTop: `1px solid ${t.rule}`, paddingTop: 24 }}>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {tr('directionB.read.back')}
          </Link>
        </Reveal>
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Pgp.tsx
git commit -m "Remove duplicate back-link at bottom of PGP page"
```

---

## Task 7: PGP easter egg hover enhancement

**Files:**
- Modify: `src/components/direction-b/BContact.tsx`

**Context:** The PGP link in `BContact` is a plain `<Link>` with no hover behavior. We extract it into a `PgpBlock` sub-component (defined in the same file) that owns hover state and delivers four layered effects: crosshair cursor, Glitch on the key ID, live hex-scramble on the fingerprint, scan-line overlay, and a `[ ENCRYPTED ]` label reveal.

- [ ] **Step 1: Add React hooks to the import**

In `src/components/direction-b/BContact.tsx`, the packages block currently is:
```tsx
// packages
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
```
Replace with:
```tsx
// packages
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
```

- [ ] **Step 2: Add helper constants and the PgpBlock component above BContact**

Insert this block immediately before the `export const BContact` line. It goes after the `displayUrl` helper and `WHATSAPP_HREF` constant that are already in the file:

```tsx
const HEX_CHARS = '0123456789ABCDEF';

const scrambleFp = (fp: string): string =>
  fp
    .split('')
    .map((ch) => (ch === ' ' ? ' ' : HEX_CHARS[Math.floor(Math.random() * 16)]))
    .join('');

const PgpBlock = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const [fp, setFp] = useState(JORIUS.pgp.fingerprint);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (hovered) {
      const loop = (): void => {
        setFp(scrambleFp(JORIUS.pgp.fingerprint));
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setFp(JORIUS.pgp.fingerprint);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [hovered]);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to="/pgp"
        title={tr('directionB.palette.items.showPgp')}
        style={{
          display: 'block',
          fontSize: 11,
          color: t.dim,
          marginTop: 6,
          fontFamily: 'inherit',
          letterSpacing: '0.04em',
          textDecoration: 'none',
          cursor: hovered ? 'crosshair' : 'pointer',
        }}
      >
        <Glitch trigger={hovered ? 'always' : 'off'} strong>
          {tr('directionB.contact.pgp')} {JORIUS.pgp.algo} · {JORIUS.pgp.keyId}
        </Glitch>
        <div style={{ fontSize: 10, color: t.dim, opacity: 0.75, marginTop: 2, wordBreak: 'break-all' }}>
          {fp}
        </div>
      </Link>

      {/* scan line overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px 3px, rgba(0,0,0,0.06) 3px 4px)',
          opacity: hovered ? 0.1 : 0,
          transition: 'opacity 200ms',
        }}
      />

      {/* encrypted label */}
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
    </div>
  );
};
```

- [ ] **Step 3: Replace the inline PGP Link with `<PgpBlock />`**

In `BContact`'s JSX, find and delete this entire block:
```tsx
          <Link
            to="/pgp"
            title={tr('directionB.palette.items.showPgp')}
            style={{
              display: 'block',
              fontSize: 11,
              color: t.dim,
              marginTop: 6,
              fontFamily: 'inherit',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            {tr('directionB.contact.pgp')} {JORIUS.pgp.algo} · {JORIUS.pgp.keyId}
            <div style={{ fontSize: 10, color: t.dim, opacity: 0.75, marginTop: 2, wordBreak: 'break-all' }}>
              {JORIUS.pgp.fingerprint}
            </div>
          </Link>
```
Replace it with:
```tsx
          <PgpBlock />
```

- [ ] **Step 4: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 5: Manual smoke test**

```bash
npm run dev
```

Open `http://localhost:5173`, scroll to the Contact section, hover over the PGP line. Verify:
- Cursor changes to crosshair
- Key ID glitches (RGB-split)
- Fingerprint hex chars scramble continuously
- `[ ENCRYPTED ]` label fades in below the fingerprint
- All effects reverse cleanly on mouse-out

- [ ] **Step 6: Commit**

```bash
git add src/components/direction-b/BContact.tsx
git commit -m "Add cipher hover effect to PGP easter egg entry point"
```

---

## Task 8: Open pull request

**Files:**
- No file changes — git + GitHub only

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feature/recruiter-cleanup
```

- [ ] **Step 2: Open the PR against main**

```bash
gh pr create \
  --base main \
  --title "Recruiter cleanup and PGP hover enhancement" \
  --body "$(cat <<'EOF'
## Summary

- Removes Jericho Digital affiliation from the contact section
- Assigns proper roles to cat co-workers (CEO/CFO/Lead QA/right-hand man) and renames Taquito → Toji
- Moves NOW section entries into i18n locale files so they display in both English and Spanish
- Hides the INDEX (projects) section until there are real showcases to display
- Removes the duplicate \"back to record\" link at the bottom of the PGP page
- Adds a layered hover effect to the PGP easter egg: crosshair cursor, RGB-split glitch on the key ID, live hex-scramble on the fingerprint, scan-line overlay, and a [ ENCRYPTED ] label reveal

## Test plan

- [ ] Contact section: Affiliations block no longer appears
- [ ] Hero portrait: cats show correct roles and names (Toji instead of Taquito)
- [ ] Switch language to Spanish — NOW section entries appear in Spanish
- [ ] INDEX section is absent from the page and the command palette
- [ ] PGP page: only one back-link (at top)
- [ ] Contact section → PGP hover: all five effects activate and reverse cleanly
EOF
)"
```

---

## Self-review notes

- All six spec requirements map to tasks 2–7.
- No placeholders or TBDs in any step.
- `PgpBlock` uses `useBTheme()` and `useTranslation()` directly — it does not receive `t` or `tr` as props, so there is no prop type to define.
- `Glitch` with `trigger={hovered ? 'always' : 'off'}` is valid per the `GlitchTrigger` type in `Glitch.tsx`.
- The `useRef<number | null>(null)` type matches the return type of `requestAnimationFrame` (number) in the browser.
- `returnObjects: true` in i18next is the standard API for retrieving arrays/objects; casting the result to `Array<{ k: string; v: string }>` is safe given we fully control the locale files.

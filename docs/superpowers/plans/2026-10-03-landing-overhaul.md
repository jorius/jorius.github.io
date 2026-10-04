# Landing Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the landing page of jorius.github.io as Hero → Work → Record → Now → Contact with the designer's legibility fixes, card grids for Work and Record, the three contact buttons in the hero, a centred-brand top bar, and a hover glitch that pulses instead of holding.

**Architecture:** The landing stays a composition of `direction-b` components under one `BThemeProvider`; this plan adds two card primitives (`BCardGrid`, `BCard`) that the Work, Record and `/projects` cards share, two pure utility modules with tests (`contrast`, `glitchTiming`), and a `fonts.ts` constant file, then rewrites each section component against the spec. Removals (Writing & OSS, Why, the vignette, the GitHub hook) come last so every commit renders.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, react-i18next, react-icons, vitest. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-03-landing-overhaul-design.md`

## Global Constraints

- Work in the worktree `/mnt/media/Sources/GitHub/Personal/.worktrees/jorius-landing-overhaul` on `feature/landing-overhaul`. Never push. Never rebase.
- Commit subjects start with a capitalised infinitive verb (`Add`, `Replace`, `Remove`, …), 72 characters max; the body says why. No `Co-Authored-By` lines in this repo.
- Husky runs `npm run lint` on every commit; a commit that fails lint is rejected, fix and retry.
- Imports stay grouped with comment headers (`// packages`, `// contexts`, `// data`, `// hooks`, `// utils`, `// components`), one blank line between groups.
- Every user-facing string goes through `useTranslation()` and exists in both `src/i18n/locales/en.json` and `es.json`.
- Theme colours come from `useBTheme().t`; never hard-code a paper or ink hex in a component.
- Legibility floor on the landing: no text under 13px except `StackChip` at 12px and the top-bar volume line at 12px; `dim` is `#a4a197` dark / `#5f5c55` light.
- `npm run build` (`tsc -b && vite build`) must pass at every commit; `tsc` also type-checks `scripts/llms`.

## Review Focus

1. A viewer with `prefers-reduced-motion: reduce` must see no glitch at all, ambient or hover, and no stuck channel copies. Test pinned in Task 2.
2. The mouse leaving an element mid-pulse must clear every timer; otherwise the element glitches forever or after unmount. Test pinned in Task 2 (timing module) and checked manually in Task 2's step 8.
3. A `BCardGrid` with a count that does not fill the last row (Record has six, Work three, Now none) must not leave stretched or empty cells, and the 1px rule lines must not double at the edges. Checked visually in Task 4 and Task 8.
4. The Spanish locale must have every key the English one has; a missing key renders the raw key path. Test pinned in Task 13 (locale parity test).
5. The crawler files must keep excluding the WhatsApp digits and any Dark Galaxy mention after the bio changes. Existing tests in `scripts/llms/load.test.ts` keep covering this; Task 12 re-runs them.

---

### Task 1: Legibility tokens, font constants and the contrast guard

**Files:**
- Create: `src/styles/fonts.ts`
- Create: `src/utils/contrast.ts`
- Create: `src/utils/contrast.test.ts`
- Modify: `src/contexts/ThemeContext.tsx` (export `B_THEMES`, new `dim` values)

**Interfaces:**
- Produces: `FONT_MONO`, `FONT_BODY`, `FONT_CODE: string` from `src/styles/fonts.ts`; `contrastRatio(a: string, b: string): number` and `relativeLuminance(hex: string): number` from `src/utils/contrast.ts`; `B_THEMES: Record<ThemeMode, ThemeTokens>` exported from `ThemeContext`.

- [ ] **Step 1: Write the failing contrast test**

Create `src/utils/contrast.test.ts`:

```ts
// packages
import { describe, expect, it } from 'vitest';

// contexts
import { B_THEMES } from '../contexts/ThemeContext';

// utils
import { contrastRatio, relativeLuminance } from './contrast';

describe('contrastRatio', () => {
  it('returns 21 for black on white and 1 for a colour on itself', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#292929', '#292929')).toBe(1);
  });

  it('rejects anything that is not a six-digit hex colour', () => {
    expect(() => relativeLuminance('#fff')).toThrow();
    expect(() => relativeLuminance('red')).toThrow();
  });
});

// The designer's review: every illegible element was dim text. This pins the
// floor so a palette tweak cannot quietly undo it.
describe('theme tokens pass the legibility floor', () => {
  for (const mode of ['dark', 'light'] as const) {
    const t = B_THEMES[mode];
    it(`${mode}: ink and dim read on paper and on the card hover surface`, () => {
      expect(contrastRatio(t.ink, t.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.dim, t.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.dim, t.sub)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.ink, t.sub)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- src/utils/contrast.test.ts`
Expected: FAIL, `Cannot find module './contrast'` (and `B_THEMES` is not exported).

- [ ] **Step 3: Create the contrast utility**

Create `src/utils/contrast.ts`:

```ts
// WCAG 2.x relative luminance and contrast ratio, used by the theme tests to
// hold the legibility floor the 2026-10 design review asked for.

const channel = (v: number): number => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hex: string): number => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Not a six-digit hex colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};

export const contrastRatio = (a: string, b: string): number => {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};
```

- [ ] **Step 4: Export the palette and raise `dim`**

In `src/contexts/ThemeContext.tsx` change `const B_THEMES` to `export const B_THEMES` and set the two `dim` values:

```ts
export const B_THEMES: Record<ThemeMode, ThemeTokens> = {
  dark: {
    paper: '#292929',
    sub: '#333333',
    ink: '#f2efe7',
    // 5.6:1 on paper, 4.9:1 on sub. The old #7c7a72 sat at 3.4:1 and was the
    // grey behind every red and yellow box in the 2026-10 design review.
    dim: '#a4a197',
    mute: '#3a3a3a',
    soft: '#1c1c1c',
    rule: '#e6e2d6',
    rgbR: '#ff2f2f',
    rgbB: '#2fb6ff',
    scan: true,
  },
  light: {
    paper: '#efece4',
    sub: '#e8e4d6',
    ink: '#0d0d0d',
    // 5.6:1 on paper, 5.2:1 on sub (was #6d6a62, 4.6:1).
    dim: '#5f5c55',
    mute: '#c8c8c8',
    soft: '#c8c8c8',
    rule: '#0d0d0d',
    rgbR: '#d01818',
    rgbB: '#1068c4',
    scan: false,
  },
};
```

- [ ] **Step 5: Create the font constants**

Create `src/styles/fonts.ts`:

```ts
// The three faces index.html loads from Google Fonts. Components import these
// instead of repeating family strings, so a font change is one edit.

// Headlines, labels, chips, the top bar: the site's voice.
export const FONT_MONO = "'Space Mono', ui-monospace, Menlo, Consolas, monospace";

// Running text in cards, kickers and the hero: the blog reader's face, picked
// for its 0/O and 1/l/I separation.
export const FONT_BODY = "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif";

// Fingerprints and code.
export const FONT_CODE = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
```

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: all green, including the four new contrast cases; `themeTokens.test.ts` still passes.

- [ ] **Step 7: Commit**

```bash
git add src/styles/fonts.ts src/utils/contrast.ts src/utils/contrast.test.ts src/contexts/ThemeContext.tsx
git commit -m "Raise the dim grey to a 4.5:1 floor and guard it with a contrast test

Every element the design review marked red or yellow was dim text at 3.4:1
in a darkened corner. The new values pass on paper and on the card hover
surface in both themes, and the test keeps a future palette tweak from
undoing it. fonts.ts gives the cards one place to take the reader face from."
```

---

### Task 2: Glitch hover pulses and reduced motion

**Files:**
- Create: `src/utils/glitchTiming.ts`
- Create: `src/utils/glitchTiming.test.ts`
- Modify: `src/hooks/useMediaQuery.ts` (add `usePrefersReducedMotion`)
- Modify: `src/components/primitives/Glitch.tsx`

**Interfaces:**
- Produces: `hoverOn(rand)`, `hoverOff(rand)`, `ambientOn(rand)`, `ambientWait(period, glitch, rate, rand)` all `(…): number`; `usePrefersReducedMotion(): boolean`.
- `Glitch` keeps its props (`trigger`, `period`, `strong`, `as`, `style`, `className`); only `trigger="hover"` behaviour changes.

- [ ] **Step 1: Write the failing timing test**

Create `src/utils/glitchTiming.test.ts`:

```ts
// packages
import { describe, expect, it } from 'vitest';

// utils
import { ambientOn, ambientWait, hoverOff, hoverOn } from './glitchTiming';

describe('hover pulses', () => {
  it('turn on for 90–250ms and off for 180–700ms', () => {
    expect(hoverOn(0)).toBe(90);
    expect(hoverOn(1)).toBe(250);
    expect(hoverOff(0)).toBe(180);
    expect(hoverOff(1)).toBe(700);
    expect(hoverOn(0.5)).toBeCloseTo(170);
  });
});

describe('ambient schedule', () => {
  it('keeps the live site timing: on 420–940ms, wait scaled by jitter, intensity and rate', () => {
    expect(ambientOn(0)).toBe(420);
    expect(ambientOn(1)).toBe(940);
    expect(ambientWait(5200, 1, 1, 0)).toBeCloseTo(5200 * 0.35);
    expect(ambientWait(5200, 1, 1, 1)).toBeCloseTo(5200 * 1.05);
    expect(ambientWait(5200, 2, 1, 0)).toBeCloseTo((5200 * 0.35) / 2);
    expect(ambientWait(5200, 1, 2, 0)).toBeCloseTo(5200 * 0.35 * 2);
  });

  it('never divides by an intensity below 0.2', () => {
    expect(ambientWait(1000, 0.05, 1, 0)).toBeCloseTo((1000 * 0.35) / 0.2);
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- src/utils/glitchTiming.test.ts`
Expected: FAIL, `Cannot find module './glitchTiming'`.

- [ ] **Step 3: Create the timing module**

Create `src/utils/glitchTiming.ts`:

```ts
// Durations for the Glitch primitive, apart from the component so the ranges
// are unit-testable. Every function takes the random number as an argument.

type Range = [min: number, max: number];

export const HOVER_ON_MS: Range = [90, 250];
export const HOVER_OFF_MS: Range = [180, 700];
export const AMBIENT_ON_MS: Range = [420, 940];

const within = ([min, max]: Range, rand: number): number => min + (max - min) * rand;

// A hover is a run of short pulses: on, off, on… until the pointer leaves.
export const hoverOn = (rand: number): number => within(HOVER_ON_MS, rand);
export const hoverOff = (rand: number): number => within(HOVER_OFF_MS, rand);

// Ambient: how long a pulse holds.
export const ambientOn = (rand: number): number => within(AMBIENT_ON_MS, rand);

// Ambient: how long to wait before the next pulse. Jitter of 0.35–1.05 on
// the period, shortened by intensity (floored at 0.2) and stretched by rate.
export const ambientWait = (period: number, glitch: number, rate: number, rand: number): number =>
  ((period * (0.35 + rand * 0.7)) / Math.max(0.2, glitch)) * rate;
```

- [ ] **Step 4: Run the test to see it pass**

Run: `npm test -- src/utils/glitchTiming.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Add the reduced-motion hook**

Append to `src/hooks/useMediaQuery.ts`:

```ts
// The OS "reduce motion" switch. Glitches, pulses and the portrait swap stop
// when it is on.
export const usePrefersReducedMotion = (): boolean => useMediaQuery('(prefers-reduced-motion: reduce)');
```

- [ ] **Step 6: Rewrite the Glitch scheduling**

Replace the body of `src/components/primitives/Glitch.tsx` from the `useBTheme()` line down to the `hoverProps` constant (keep the render, the slice maths and the layer JSX exactly as they are) with:

```tsx
// packages
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

// utils
import { ambientOn, ambientWait, hoverOff, hoverOn } from '../../utils/glitchTiming';

export type GlitchTrigger = 'ambient' | 'hover' | 'always' | 'off';

interface GlitchProps {
  children: ReactNode;
  as?: ElementType;
  style?: CSSProperties;
  trigger?: GlitchTrigger;
  period?: number;
  strong?: boolean;
  className?: string;
}

// Three stacked layers: the main ink layer plus red/blue channel-split
// copies that jitter on a randomized timer. trigger="hover" runs short
// on/off pulses while the pointer stays; "ambient" runs on a randomized
// schedule scaled by glitch intensity; "always" stays on; "off" stays off.
// With the OS reduce-motion switch on, nothing pulses.
export const Glitch = ({
  children,
  as: As = 'span',
  style,
  trigger = 'ambient',
  period = 5200,
  strong = false,
  className,
}: GlitchProps): React.ReactElement => {
  const { t, glitch, glitchRate, glitchChaos, theme } = useBTheme();
  const reduced = usePrefersReducedMotion();
  // 'screen' lightens the channel-split copies over the dark paper; on the
  // light paper that washes them out, so 'multiply' (which darkens) is what
  // makes the red/blue split actually visible in the light theme.
  const blendMode: CSSProperties['mixBlendMode'] = theme === 'dark' ? 'screen' : 'multiply';
  const [pulseOn, setPulseOn] = useState(false);
  const [hoverOn_, setHoverOn] = useState(false);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (trigger !== 'ambient' || glitch <= 0 || reduced) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (): void => {
      if (!alive) return;
      timer = setTimeout(() => {
        if (!alive) return;
        setPulseOn(true);
        setRev((r) => r + 1);
        timer = setTimeout(() => {
          if (alive) setPulseOn(false);
          schedule();
        }, ambientOn(Math.random()));
      }, ambientWait(period, glitch, glitchRate, Math.random()));
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
      setPulseOn(false);
    };
  }, [trigger, period, glitch, glitchRate, reduced]);

  // Hover: a chain of timeouts that re-arms itself until the pointer leaves.
  // The refs let mouseleave (or unmount) stop the chain whatever phase it is in.
  const hoverAlive = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopHover = useCallback((): void => {
    hoverAlive.current = false;
    if (hoverTimer.current !== null) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHoverOn(false);
  }, []);
  const pulseHover = useCallback((): void => {
    if (!hoverAlive.current) return;
    setRev((r) => r + 1);
    setHoverOn(true);
    hoverTimer.current = setTimeout(() => {
      setHoverOn(false);
      hoverTimer.current = setTimeout(pulseHover, hoverOff(Math.random()));
    }, hoverOn(Math.random()));
  }, []);
  const startHover = useCallback((): void => {
    if (reduced || hoverAlive.current) return;
    hoverAlive.current = true;
    pulseHover();
  }, [reduced, pulseHover]);
  useEffect(() => stopHover, [stopHover]);

  // Derive on directly from trigger + state. Avoids needing a setState-in-
  // effect to sync external trigger changes.
  let on = false;
  if (trigger === 'always') on = true;
  else if (trigger === 'off') on = false;
  else if (trigger === 'hover') on = hoverOn_;
  else on = pulseOn;

  // Chaos above 1: while a glitch is on, re-seed the slices every few frames
  // so the displacement jumps around instead of holding one shape.
  useEffect(() => {
    if (!on || glitchChaos <= 1) return undefined;
    const id = window.setInterval(() => setRev((r) => r + 1), 70);
    return () => window.clearInterval(id);
  }, [on, glitchChaos]);

  const hoverProps = trigger === 'hover' ? { onMouseEnter: startHover, onMouseLeave: stopHover } : {};
```

Everything after `hoverProps` (the `mag`, `seed`, `jx`, `jy`, `skew`, `clipA/B/C`, `wrapStyle`, `layer`, `Component` and the returned JSX) stays byte-for-byte as it is on `main`.

- [ ] **Step 7: Type-check, lint, test**

Run: `npm run build && npm run lint && npm test`
Expected: all pass. (`hoverOn_` carries the underscore because `hoverOn` is the imported timing function.)

- [ ] **Step 8: Manual check on the dev server**

Open http://localhost:5174/ and hover a top-bar link: it should flicker on and off while the pointer stays, and stop cleanly on leave. Toggle "Reduce motion" in the OS (or in DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion`) and reload: no glitch on hover or on the big titles.

- [ ] **Step 9: Commit**

```bash
git add src/utils/glitchTiming.ts src/utils/glitchTiming.test.ts src/hooks/useMediaQuery.ts src/components/primitives/Glitch.tsx
git commit -m "Make the hover glitch pulse instead of holding one frame

The review asked for the hover effect to come and go while the pointer
stays rather than freeze one displaced copy. The durations live in a pure
module with tests, and the component now respects the OS reduce-motion
switch for both the hover and the ambient schedules."
```

---

### Task 3: Remove the vignette overlay

**Files:**
- Delete: `src/components/primitives/DarkGrain.tsx`
- Modify: `src/components/direction-b/DirectionB.tsx`, `src/pages/Writing.tsx`, `src/pages/Projects.tsx`, `src/pages/Pgp.tsx`, `src/pages/NotFound.tsx`

- [ ] **Step 1: Delete the component and its five imports**

```bash
git rm src/components/primitives/DarkGrain.tsx
```

In each of the five files remove the line `import { DarkGrain } from '…/primitives/DarkGrain';` and the `<DarkGrain />` element. Nothing else in those files changes.

- [ ] **Step 2: Build and lint**

Run: `npm run build && npm run lint`
Expected: pass; `tsc` would fail on a leftover import, so a green build proves all five are gone.

- [ ] **Step 3: Check on the dev server**

Reload http://localhost:5174/ in the dark theme: the corners of the page are the same grey as the centre; the scan lines are still there.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/primitives src/components/direction-b/DirectionB.tsx src/pages
git commit -m "Remove the vignette overlay from every page

Every element the designer marked unreadable sat in a corner or at an edge,
where this radial overlay darkened the paper by up to 55% on top of the dim
grey. The owner chose removing it over softening it. Scan lines stay."
```

---

### Task 4: Card primitives, and `/projects` on top of them

**Files:**
- Create: `src/components/direction-b/BCardGrid.tsx`
- Create: `src/components/direction-b/BCard.tsx`
- Modify: `src/components/direction-b/BProjectCard.tsx`
- Modify: `src/pages/Projects.tsx`
- Modify: `src/components/direction-b/StackChip.tsx` (font-size 11 → 12)

**Interfaces:**
- Produces: `BCardGrid({ children, style? })`, `useCardColumns(): 1 | 2 | 3`, `BCard({ index: number, children, style? })`.
- `BProjectCard` props become `{ p: ProjectEntry; i: number }` (no `columnsPerRow`).

- [ ] **Step 1: Create `BCardGrid`**

```tsx
// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery';

// 3 columns on desktop, 2 on tablet, 1 on mobile. Cards read this to stagger
// their reveal per column.
export const useCardColumns = (): 1 | 2 | 3 => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  if (isMobile) return 1;
  if (isTablet) return 2;
  return 3;
};

interface BCardGridProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// The 1px rules between cards come from the grid gap over a rule-coloured
// background, so any column count and any card count draws clean lines with
// no per-card border arithmetic.
export const BCardGrid = ({ children, style }: BCardGridProps): React.ReactElement => {
  const { t } = useBTheme();
  const columns = useCardColumns();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 1,
        background: t.rule,
        borderTop: `1px solid ${t.rule}`,
        borderBottom: `1px solid ${t.rule}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 2: Create `BCard`**

```tsx
// packages
import type { CSSProperties, ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Reveal } from '../primitives/Reveal';
import { useCardColumns } from './BCardGrid';

// The hover rule for .b-index-card in index.html reads --sub.
interface CardCSS extends CSSProperties {
  '--sub'?: string;
}

interface BCardProps {
  index: number;
  children: ReactNode;
  style?: CSSProperties;
}

// One cell of a BCardGrid: paper background (the grid shows through the gaps
// as rules), column flex with a 12px gap, and the shared hover tint.
export const BCard = ({ index, children, style }: BCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const isMobile = useIsMobile();
  const columns = useCardColumns();
  const cardStyle: CardCSS = {
    background: t.paper,
    padding: isMobile ? 18 : 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 0,
    '--sub': t.sub,
    ...style,
  };
  return (
    <Reveal delay={(index % columns) * 70} className="b-index-card" style={cardStyle}>
      {children}
    </Reveal>
  );
};
```

- [ ] **Step 3: Rewrite `BProjectCard` on the primitives**

Replace `src/components/direction-b/BProjectCard.tsx` with:

```tsx
// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBook, FaExternalLinkAlt, FaGithub, FaNpm } from 'react-icons/fa';
import type { IconType } from 'react-icons';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// utils
import { pickLocale } from '../../utils/content';
import type { ProjectEntry, ProjectLinkKind } from '../../utils/content';
import { projectLinkLabel } from '../../utils/projects';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { BCard } from './BCard';
import { StackChip } from './StackChip';

interface BProjectCardProps {
  p: ProjectEntry;
  i: number;
}

// One glyph per link kind so a visitor can tell "the source" from "the thing
// running" before reading the label.
const LINK_ICONS: Record<ProjectLinkKind, IconType> = {
  repo: FaGithub,
  live: FaExternalLinkAlt,
  npm: FaNpm,
  docs: FaBook,
};

export const BProjectCard = ({ p, i }: BProjectCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const lang = i18n.language;
  const metaStyle: CSSProperties = { fontSize: 13, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };

  return (
    <BCard index={i}>
      <div style={{ ...metaStyle, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>№ {String(i + 1).padStart(2, '0')}</span>
        <span>
          {tr(`directionB.projectsPage.kind.${p.kind}`)}
          {p.status ? ` · ${tr(`directionB.projectsPage.status.${p.status}`)}` : null}
        </span>
      </div>

      <div style={{ fontSize: 24, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.08, fontWeight: 700 }}>
        <Glitch trigger="hover" strong>{pickLocale(p.title, lang)}</Glitch>
      </div>

      <div style={{ fontSize: 13, color: t.dim }}>{p.year}</div>

      <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, color: t.ink, lineHeight: 1.55 }}>{pickLocale(p.summary, lang)}</p>

      {p.details.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: FONT_BODY, fontSize: 14, color: t.dim, lineHeight: 1.5 }}>
          {p.details.map((d) => (
            <li key={d.en}>— {pickLocale(d, lang)}</li>
          ))}
        </ul>
      ) : null}

      {p.note ? (
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 14, color: t.rgbB, lineHeight: 1.5 }}>{pickLocale(p.note, lang)}</p>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {p.stack.map((s) => <StackChip key={s} name={s} />)}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 'auto', paddingTop: 6 }}>
        {p.links.map((l) => {
          const Icon = LINK_ICONS[l.kind];
          return (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...metaStyle, color: t.ink, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Icon aria-hidden size={12} />
              {projectLinkLabel(l, lang, tr)}
            </a>
          );
        })}
      </div>
    </BCard>
  );
};
```

(Title weight goes to 700 and the meta line to 13px; the old 11px meta and 26px regular title are the only visual changes besides the font.)

- [ ] **Step 4: Use the grid in `Projects.tsx`**

In `src/pages/Projects.tsx`: remove the `columnsPerRow` constant; add `import { BCardGrid } from '../components/direction-b/BCardGrid';` to the components group; replace the `<div style={{ marginTop: 40, display: 'grid', … }}>…</div>` block with:

```tsx
          <BCardGrid style={{ marginTop: 40 }}>
            {projects.map((p, i) => (
              <BProjectCard key={p.id} p={p} i={i} />
            ))}
          </BCardGrid>
```

- [ ] **Step 5: Raise the chip size**

In `src/components/direction-b/StackChip.tsx` change `fontSize: 11,` to `fontSize: 12,` on the outer `<span>`.

- [ ] **Step 6: Build, lint, test**

Run: `npm run build && npm run lint && npm test`
Expected: pass. (`tsc` catches any leftover `columnsPerRow` prop.)

- [ ] **Step 7: Check `/projects` on the dev server**

Open http://localhost:5174/projects at desktop, tablet (≈ 900px) and phone widths: three, two and one columns; every card separated by one 1px line; no doubled line at the outer edges; the last row (14 cards → 2 on the last desktop row) shows no empty cell with a border.

- [ ] **Step 8: Commit**

```bash
git add src/components/direction-b/BCardGrid.tsx src/components/direction-b/BCard.tsx src/components/direction-b/BProjectCard.tsx src/components/direction-b/StackChip.tsx src/pages/Projects.tsx
git commit -m "Extract the project card grid and cell into shared primitives

Work and Record become card grids next, so the cell and the grid lines move
out of BProjectCard. The lines are the grid gap over a rule background,
which removes the last-in-row border arithmetic. The project summary takes
the reader face and the chips 12px, matching what the landing cards get."
```

---

### Task 5: Section head with the kicker under the title

**Files:**
- Modify: `src/components/direction-b/BSectionHead.tsx`

**Interfaces:**
- Produces: `BSectionHead({ id, num, label, kicker, aside? })` where `aside?: ReactNode` renders beside the `<h2>`.

- [ ] **Step 1: Replace the component**

```tsx
// packages
import type { ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';

interface BSectionHeadProps {
  id: string;
  num: string;
  label: string;
  kicker: string;
  // Rendered beside the title, bottom-aligned (Now uses it for "Last updated").
  aside?: ReactNode;
}

// Number, title, kicker, stacked. The kicker used to sit in a right-hand
// column at 13px, which the design review marked unreadable in every section.
export const BSectionHead = ({ id, num, label, kicker, aside }: BSectionHeadProps): React.ReactElement => {
  const { t } = useBTheme();
  const isMobile = useIsMobile();
  return (
    <div
      data-jump={id}
      style={{
        padding: isMobile ? '52px 20px 16px 20px' : '72px 32px 24px 32px',
        borderTop: `1px solid ${t.rule}`,
        display: 'grid',
        gap: 14,
      }}
    >
      <div style={{ fontSize: 13, color: t.dim, letterSpacing: '0.15em', textTransform: 'uppercase' }}>§ {num}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(40px, 7vw, 104px)', letterSpacing: '-0.035em', lineHeight: 0.9, color: t.ink }}>
          <Glitch strong period={6000}>{label}</Glitch>
        </h2>
        {aside}
      </div>
      <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.5, color: t.dim, maxWidth: '62ch' }}>{kicker}</p>
    </div>
  );
};
```

- [ ] **Step 2: Build and check**

Run: `npm run build && npm run lint`. On http://localhost:5174/ every section title now has its kicker underneath at 16px in the new grey; nothing sits at the right edge.

- [ ] **Step 3: Commit**

```bash
git add src/components/direction-b/BSectionHead.tsx
git commit -m "Move section kickers under their titles

The right-aligned kicker column was marked unreadable on Work, Record and
Now. Under the title at 16px in the reader face it is the first thing read
after the heading, and the head gains an aside slot for Now's date."
```

---

### Task 6: Hero, variant A

**Files:**
- Modify: `src/components/direction-b/BHero.tsx`
- Modify: `src/i18n/locales/en.json`, `src/i18n/locales/es.json` (`directionB.hero`)

**Interfaces:**
- Consumes: `FONT_BODY` (Task 1), `Portrait`, `Glitch`, `TypedCaret`, `JORIUS`.
- New locale keys: `hero.eyebrow`, `hero.anywhere`, `hero.tz`, `hero.whatsapp`, `hero.book`.

- [ ] **Step 1: Add the locale keys**

In `en.json`, inside `directionB.hero`, add (keep `intro`, `body`, `writeMe`; the other keys are removed in Task 13):

```json
"eyebrow": "Full-stack engineer · Security",
"anywhere": "Work from anywhere",
"tz": "GMT-5 · Colombia",
"whatsapp": "WHATSAPP",
"book": "BOOK 20 MIN →",
```

In `es.json`:

```json
"eyebrow": "Ingeniero full-stack · Seguridad",
"anywhere": "Trabajo desde cualquier lugar",
"tz": "GMT-5 · Colombia",
"whatsapp": "WHATSAPP",
"book": "AGENDA 20 MIN →",
```

- [ ] **Step 2: Replace `BHero.tsx`**

```tsx
// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { TypedCaret } from '../primitives/TypedCaret';
import { Portrait } from './Portrait';

const WHATSAPP_HREF = `https://wa.me/${JORIUS.whatsapp.replace(/[^0-9]/g, '')}`;
const BOOKING_HREF = 'https://cal.com/jorius';

// "Jose Ríos" → ["JOSE", "RÍOS"]: one headline line per word.
const NAME_LINES = JORIUS.name.toUpperCase().split(' ');

export const BHero = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();

  const button: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '13px 20px',
    fontSize: 13,
    letterSpacing: '0.06em',
    textDecoration: 'none',
    border: `1px solid ${t.ink}`,
    whiteSpace: 'nowrap',
  };
  const filled: CSSProperties = { ...button, background: t.ink, color: t.paper };
  const outlined: CSSProperties = { ...button, background: 'transparent', color: t.ink };

  return (
    <section
      style={{
        borderBottom: `1px solid ${t.rule}`,
        padding: isMobile ? '36px 20px 32px 20px' : '56px 32px 48px 32px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr clamp(280px, 32vw, 480px)',
        gap: isMobile ? 28 : 40,
        alignItems: 'end',
      }}
    >
      <div style={{ minWidth: 0, display: 'grid', gap: 22 }}>
        <p
          style={{
            margin: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px 10px',
            fontSize: 13,
            color: t.dim,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          <span>{tr('directionB.hero.eyebrow')}</span>
          <span style={{ color: t.ink, border: `1px solid ${t.ink}`, padding: '4px 9px', fontWeight: 700 }}>{tr('directionB.hero.anywhere')}</span>
          <span>{tr('directionB.hero.tz')}</span>
        </p>

        <h1 style={{ margin: 0, fontSize: 'clamp(56px, 11vw, 168px)', lineHeight: 0.86, letterSpacing: '-0.045em', fontWeight: 700, color: t.ink }}>
          {NAME_LINES.map((line, i) => (
            <span key={line} style={{ display: 'block' }}>
              <Glitch strong period={i === 0 ? 4200 : 5000}>{line}</Glitch>
              {i === NAME_LINES.length - 1 ? <TypedCaret /> : null}
            </span>
          ))}
        </h1>

        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.5, maxWidth: '56ch', color: t.ink }}>
          {tr('directionB.hero.intro')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a href={`mailto:${JORIUS.email}`} style={filled}>
            <Glitch trigger="hover">{tr('directionB.hero.writeMe')}</Glitch>
          </a>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tr('directionB.hero.whatsapp')} ${JORIUS.whatsapp}`}
            title={`${tr('directionB.hero.whatsapp')} ${JORIUS.whatsapp}`}
            style={outlined}
          >
            <FaWhatsapp aria-hidden style={{ width: 16, height: 16 }} />
            <Glitch trigger="hover">{tr('directionB.hero.whatsapp')}</Glitch>
          </a>
          <a href={BOOKING_HREF} target="_blank" rel="noopener noreferrer" style={outlined}>
            <Glitch trigger="hover">{tr('directionB.hero.book')}</Glitch>
          </a>
        </div>

        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.6, maxWidth: '62ch', color: t.ink }}>
          {tr('directionB.hero.body')}
        </p>
      </div>

      <div style={isMobile ? { display: 'flex', justifyContent: 'center' } : { justifySelf: 'end', width: '100%' }}>
        <div style={isMobile ? { width: '100%', maxWidth: 360 } : { width: '100%' }}>
          <Portrait />
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 3: Build, lint, check both languages**

Run: `npm run build && npm run lint`. On http://localhost:5174/ the hero shows the eyebrow with the boxed WORK FROM ANYWHERE, JOSE / RÍOS glitching, the tagline, three buttons, the body, and the cats on the right; switch to ES with the top-bar button and confirm ESCRÍBEME →, WHATSAPP, AGENDA 20 MIN →. At 400px wide the portrait sits under the text, centred.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/BHero.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Rebuild the hero around the name and the three contact buttons

The review marked the top-right intro and the WRITE ME button at the end of
the hero as never read because of where they sat, and the meta line as
unreadable. The owner chose the wireframe's shape: name as the headline,
tagline and buttons under it, WORK FROM ANYWHERE highlighted instead of
remote-from-Colombia, and no replies line."
```

---

### Task 7: Work as cards

**Files:**
- Modify: `src/components/direction-b/BServices.tsx`
- Modify: `en.json`, `es.json` (`directionB.sections.work`)

- [ ] **Step 1: Locale**

In both files set `directionB.sections.work.num` to `"01"` and add `"cardKind"`: `"Service"` (en) / `"Servicio"` (es).

- [ ] **Step 2: Replace `BServices.tsx`**

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

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { BCard } from './BCard';
import { BCardGrid } from './BCardGrid';
import { BSectionHead } from './BSectionHead';
import { StackChip } from './StackChip';

export const BServices = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const lang = i18n.language;
  const meta: React.CSSProperties = { fontSize: 13, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };
  return (
    <>
      <BSectionHead
        id="b-services"
        num={tr('directionB.sections.work.num')}
        label={tr('directionB.sections.work.label')}
        kicker={tr('directionB.sections.work.kicker')}
      />
      <div style={{ padding: isMobile ? '0 20px 40px 20px' : '0 32px 40px 32px' }}>
        <BCardGrid style={{ marginTop: 16 }}>
          {workContent.services.map((s, i) => (
            <BCard key={s.id} index={i}>
              <div style={{ ...meta, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span>№ {s.id}</span>
                <span>{tr('directionB.sections.work.cardKind')}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 24, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.08, fontWeight: 700 }}>
                <Glitch trigger="hover" strong>{pickLocale(s.title, lang)}</Glitch>
              </h3>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.55, color: t.ink }}>{pickLocale(s.body, lang)}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {s.stack.map((tag) => <StackChip key={tag} name={tag} />)}
              </div>
            </BCard>
          ))}
        </BCardGrid>
      </div>
    </>
  );
};
```

- [ ] **Step 3: Build, lint, check**

Run: `npm run build && npm run lint`. On the dev server, Work shows three cards in a row (one column at 400px), bodies in the reader face, chips at 12px.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/BServices.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Turn the Work services into a card grid

\"Mejor en cards\" was the review's note on the three service rows. They
now use the shared card cell, with the body in the reader face."
```

---

### Task 8: Record as cards with a visible date row

**Files:**
- Modify: `src/components/direction-b/BExperience.tsx`
- Modify: `en.json`, `es.json` (`directionB.sections.record.num` → `"02"`)

- [ ] **Step 1: Locale**

Set `directionB.sections.record.num` to `"02"` in both files.

- [ ] **Step 2: Replace `BExperience.tsx`**

```tsx
// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { BCard } from './BCard';
import { BCardGrid } from './BCardGrid';
import { BSectionHead } from './BSectionHead';

// The date row reads the company accent through this variable.
interface AccentCSS extends CSSProperties {
  '--acc'?: string;
}

export const BExperience = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  const meta: CSSProperties = { fontSize: 13, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };
  return (
    <>
      <BSectionHead
        id="b-experience"
        num={tr('directionB.sections.record.num')}
        label={tr('directionB.sections.record.label')}
        kicker={tr('directionB.sections.record.kicker')}
      />
      <div style={{ padding: isMobile ? '0 20px 40px 20px' : '0 32px 40px 32px' }}>
        <BCardGrid style={{ marginTop: 16 }}>
          {JORIUS.experience.map((e, i) => {
            const accent: AccentCSS = { '--acc': e.accent };
            return (
              <BCard key={e.key} index={i} style={accent}>
                <div style={{ ...meta, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span>№ {String(i + 1).padStart(2, '0')}</span>
                  <span>{e.loc === 'Remote' ? tr('directionB.experience.remote') : e.loc}</span>
                </div>
                {/* The owner asked for dates that are easy to find: same spot on every card, ink, bold, accent bar. */}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    color: t.ink,
                    fontVariantNumeric: 'tabular-nums',
                    padding: '4px 0 4px 12px',
                    borderLeft: '3px solid var(--acc)',
                  }}
                >
                  {e.from} → {e.to === 'Present' ? tr('directionB.experience.present') : e.to}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      flexShrink: 0,
                      border: `1px solid ${t.rule}`,
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <img src={e.logo} alt={`${e.co} logo`} style={{ maxWidth: '76%', maxHeight: '76%', objectFit: 'contain', display: 'block' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: e.accent,
                        boxShadow: `0 0 6px ${e.accent}`,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 20, color: t.ink, letterSpacing: '-0.01em', fontWeight: 700, minWidth: 0 }}>
                    <Glitch trigger="hover">{e.co}</Glitch>
                  </div>
                </div>
                <div style={{ fontSize: 15, color: t.ink, fontWeight: 700, letterSpacing: '-0.005em' }}>{tr(`directionB.experience.${e.key}.role`)}</div>
                <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.55, color: t.ink }}>{tr(`directionB.experience.${e.key}.body`)}</p>
              </BCard>
            );
          })}
        </BCardGrid>
      </div>
    </>
  );
};
```

(The white logo tile is the one place a literal white is correct: the company logos are drawn for a white background in both themes, as the current code already does.)

- [ ] **Step 3: Build, lint, check**

Run: `npm run build && npm run lint`. Record shows six cards (3 + 3 on desktop, 2 + 2 + 2 on tablet), each opening with the date row and its accent bar; the hover tint covers the whole cell.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/BExperience.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Turn the Record entries into cards led by their dates

The owner asked for dates that are visible and easy to identify; each card
now opens with the range in bold ink behind the company's accent bar, in
the same place on every card."
```

---

### Task 9: Now as a readable list with the date beside the title

**Files:**
- Modify: `src/components/direction-b/BNow.tsx`
- Modify: `src/content/now.json` (entry order)
- Modify: `en.json`, `es.json` (`directionB.sections.now.num` → `"03"`)

- [ ] **Step 1: Reorder `now.json` entries**

Reorder the `entries` array to the keys `looking`, `co-founding`, `writing`, `building`, `home`. Move the objects whole; change no text. `lastUpdated` and `siversNote` stay.

- [ ] **Step 2: Locale**

Set `directionB.sections.now.num` to `"03"` in both files.

- [ ] **Step 3: Replace `BNow.tsx`**

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

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BNow = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const lang = i18n.language;

  const lastUpdated = (
    <div style={{ display: 'grid', gap: 4, paddingBottom: '0.3em' }}>
      <span style={{ fontSize: 13, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tr('directionB.now.lastUpdatedLabel')}</span>
      <span style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', color: t.ink, fontVariantNumeric: 'tabular-nums' }}>
        <Glitch trigger="hover" strong>{nowContent.lastUpdated}</Glitch>
      </span>
    </div>
  );

  return (
    <>
      <BSectionHead
        id="b-now"
        num={tr('directionB.sections.now.num')}
        label={tr('directionB.sections.now.label')}
        kicker={tr('directionB.sections.now.kicker')}
        aside={lastUpdated}
      />
      <div style={{ padding: isMobile ? '12px 20px 40px 20px' : '12px 32px 40px 32px', borderTop: `1px solid ${t.rule}` }}>
        {nowContent.entries.map((n, i) => (
          <Reveal
            key={n.key}
            delay={i * 60}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '150px 1fr',
              gap: isMobile ? 6 : 16,
              padding: '16px 0',
              borderBottom: `1px solid ${t.soft}`,
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontSize: 13, color: t.ink, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{pickLocale(n.label, lang)}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.5, color: t.ink, maxWidth: '70ch' }}>{pickLocale(n, lang)}</div>
          </Reveal>
        ))}
        <p style={{ margin: '18px 0 0 0', fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.5, color: t.dim, maxWidth: '62ch' }}>
          {pickLocale(nowContent.siversNote, lang)}
        </p>
      </div>
    </>
  );
};
```

- [ ] **Step 4: Build, lint, test, check**

Run: `npm run build && npm run lint && npm test` (the llms load test reads `now.json` and must still pass). On the dev server: "Last updated · 2026-06-10" sits to the right of NOW., the five rows read looking, co-founding, writing, building, home, labels in ink, the Sivers note under the list.

- [ ] **Step 5: Commit**

```bash
git add src/components/direction-b/BNow.tsx src/content/now.json src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Reorder the Now entries and put the date beside the title

The review's Orden column puts the job search first and the studio second;
the dim label column and the Sivers note were marked unreadable. The owner
kept the list and asked for Last updated next to the heading."
```

---

### Task 10: Contact without the duplicate buttons

**Files:**
- Modify: `src/components/direction-b/BContact.tsx`
- Modify: `en.json`, `es.json` (`directionB.sections.contact`, `directionB.contact.footer`)

- [ ] **Step 1: Locale**

In both files set `directionB.sections.contact` to `"§ 04 · Contact"` / `"§ 04 · Contacto"`, `directionB.contact.footer.set` to `"SET IN SPACE MONO & ATKINSON HYPERLEGIBLE · NO COOKIES"` / `"EN SPACE MONO Y ATKINSON HYPERLEGIBLE · SIN COOKIES"`, and `directionB.contact.footer.vol` to `"VOL. X, NO. 011"` / `"VOL. X, N.º 011"`.

- [ ] **Step 2: Edit `BContact.tsx`**

1. Remove the imports `import { FaWhatsapp } from 'react-icons/fa';` and the `WHATSAPP_HREF` constant.
2. In the availability column delete the whole `<div style={{ display: 'flex', gap: 10, … }}>…</div>` that holds the WhatsApp and BOOK links; keep the label and the status line.
3. Sizes: the `§ 07 · Contact` label `fontSize: 11` → `13`; in `PgpBlock` the key line `fontSize: 15` stays, the fingerprint line `fontSize: 13` stays but gets `fontFamily: FONT_CODE` (import from `../../styles/fonts`), the `[ ENCRYPTED ]` line `fontSize: 12` → `13`; the three column labels `fontSize: 11` → `13`; the affiliations label `fontSize: 10` → `13`, the affiliation tag `fontSize: 9` → `13` and its name `fontSize: 11` → `13`; the footer row `fontSize: 11` → `13`.

- [ ] **Step 3: Build, lint, check**

Run: `npm run build && npm run lint`. On the dev server the availability column shows only "Open to roles · Q4 2026"; the footer reads the new "set in" line and VOL. X, NO. 011; the PGP fingerprint is in IBM Plex Mono.

- [ ] **Step 4: Commit**

```bash
git add src/components/direction-b/BContact.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Drop the duplicate buttons from Contact and raise its small type

The three contact buttons now live in the hero; the owner asked not to
repeat WhatsApp and the booking link at the bottom. Labels move to the
13px floor and the fingerprint takes the code face."
```

---

### Task 11: Centred-brand top bar and the palette

**Files:**
- Modify: `src/components/direction-b/BTopBar.tsx`
- Modify: `src/components/direction-b/paletteSections.ts`
- Modify: `src/components/CommandPalette.tsx` (one item)
- Modify: `en.json`, `es.json` (`directionB.palette.items`)

- [ ] **Step 1: Locale**

Add to `directionB.palette.items` in both files: `"showWriting": "show writing"` / `"ver escritos"` and `"writingHint": "jorius.github.io/writing"` (same in both).

- [ ] **Step 2: Palette sections and the new command**

`src/components/direction-b/paletteSections.ts`:

```ts
export const PALETTE_SECTIONS: CommandPaletteSection[] = [
  { id: 'b-services', label: 'work', hint: 'services' },
  { id: 'b-experience', label: 'record', hint: 'experience' },
  { id: 'b-now', label: 'now', hint: "what I'm up to" },
  { id: 'b-contact', label: 'contact', hint: 'email' },
];
```

In `src/components/CommandPalette.tsx`, before the `showProjects` push, add:

```ts
    all.push({ kind: 'cmd', label: tr('directionB.palette.items.showWriting'), target: '/writing', hint: tr('directionB.palette.items.writingHint'), internal: true });
```

- [ ] **Step 3: Rewrite the top bar**

Replace `src/components/direction-b/BTopBar.tsx` with:

```tsx
// packages
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useScrollToSection } from '../../hooks/useNavigation';

// utils
import { track } from '../../utils/analytics';
import { currentQuarter, currentYear } from '../../utils/dateLabels';

// components
import { Glitch } from '../primitives/Glitch';

// Anchors on the landing, in bar order; "writing" is a route and sits between
// record and contact.
const ANCHORS = ['now', 'work', 'record', 'contact'] as const;
const ANCHOR_TARGETS: Record<(typeof ANCHORS)[number], string> = {
  now: 'b-now',
  work: 'b-services',
  record: 'b-experience',
  contact: 'b-contact',
};
const DARK_GALAXY_PURPLE = '#9D4EDD';

export const BTopBar = (): React.ReactElement => {
  const { t, i18n } = useTranslation();
  const { t: th, theme, toggleTheme } = useBTheme();
  const scrollToSection = useScrollToSection();
  const scrollDir = useScrollDirection();
  const visible = scrollDir === 'up';
  const isMobile = useIsMobile();
  const [menuRequested, setMenuRequested] = useState(false);
  // Derive the visible-open state from isMobile so we never need an effect
  // to "close on resize past breakpoint" — the menu is implicitly closed
  // any time we're not in the mobile breakpoint.
  const menuOpen = isMobile && menuRequested;

  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const otherLang = lang === 'es' ? 'en' : 'es';
  const switchLang = (): void => {
    track('language-switch', { to: otherLang });
    i18n.changeLanguage(otherLang);
  };
  const switchTheme = (): void => {
    track('theme-toggle', { to: theme === 'dark' ? 'light' : 'dark' });
    toggleTheme();
  };

  const linkStyle: React.CSSProperties = {
    color: th.ink,
    textDecoration: 'none',
    letterSpacing: '0.04em',
    padding: isMobile ? '12px 0' : 0,
    fontSize: isMobile ? 14 : 13,
    borderBottom: isMobile ? `1px solid ${th.sub}` : 'none',
  };

  const anchor = (key: (typeof ANCHORS)[number]): React.ReactElement => (
    <a
      key={key}
      href={`#${ANCHOR_TARGETS[key]}`}
      onClick={(e) => {
        e.preventDefault();
        setMenuRequested(false);
        scrollToSection(ANCHOR_TARGETS[key]);
      }}
      style={linkStyle}
    >
      <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}</Glitch>
    </a>
  );
  const route = (key: 'writing' | 'projects' | 'darkgalaxy', to: string, dot?: string): React.ReactElement => (
    <Link key={key} to={to} onClick={() => setMenuRequested(false)} style={linkStyle}>
      {dot ? <Dot color={dot} /> : null}
      <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}{key === 'darkgalaxy' ? ' ↗' : ''}</Glitch>
    </Link>
  );

  const leftLinks = [anchor('now'), anchor('work'), anchor('record'), route('writing', '/writing'), anchor('contact')];
  const rightLinks = [route('projects', '/projects'), route('darkgalaxy', '/darkgalaxy', DARK_GALAXY_PURPLE)];

  const brand = (
    <Link
      to="/"
      aria-label="Home"
      style={{ textDecoration: 'none', color: th.ink, display: 'grid', justifyItems: isMobile ? 'start' : 'center', gap: 2, lineHeight: 1.1 }}
    >
      <Glitch trigger="hover" style={{ fontWeight: 700, letterSpacing: '0.08em', fontSize: 14 }}>JORIUS</Glitch>
      <span style={{ fontSize: 12, color: th.dim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {t('directionB.topbar.volume')}{currentYear()}
      </span>
    </Link>
  );

  const utilities = (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 13, color: th.ink }}>
        <Dot color="#4ADE80" />
        {t('directionB.topbar.available')} · {currentQuarter()}
      </span>
      <button
        type="button"
        onClick={switchLang}
        aria-label={t('directionB.topbar.languageToggle.label')}
        title={t('directionB.topbar.languageToggle.label')}
        style={buttonStyle(th.rule, th.ink)}
      >
        {otherLang}
      </button>
      <button type="button" onClick={switchTheme} aria-label="toggle theme" style={buttonStyle(th.rule, th.ink)}>
        {theme === 'dark' ? t('directionB.topbar.themeToggle.toLight') : t('directionB.topbar.themeToggle.toDark')}
      </button>
    </>
  );

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: theme === 'dark' ? 'rgba(41,41,41,0.88)' : 'rgba(239,236,228,0.88)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${th.rule}`,
        color: th.ink,
        fontSize: 13,
        willChange: 'transform',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 260ms ease',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto 1fr',
          alignItems: 'center',
          padding: isMobile ? '10px 20px' : '10px 32px',
          gap: 16,
        }}
      >
        {isMobile ? brand : <nav style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>{leftLinks}</nav>}

        {!isMobile ? brand : null}

        {!isMobile ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            {rightLinks}
            {utilities}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMenuRequested((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{ ...buttonStyle(th.rule, th.ink), width: 36, height: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {menuOpen ? <FaTimes aria-hidden style={{ width: 14, height: 14 }} /> : <FaBars aria-hidden style={{ width: 14, height: 14 }} />}
          </button>
        )}
      </div>

      {/* Mobile slide-down panel */}
      {isMobile && menuOpen ? (
        <div
          style={{
            borderTop: `1px solid ${th.rule}`,
            background: theme === 'dark' ? 'rgba(41,41,41,0.97)' : 'rgba(239,236,228,0.97)',
            padding: '8px 20px 20px 20px',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {leftLinks}
            {rightLinks}
          </nav>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid ${th.sub}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            {utilities}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Dot = ({ color }: { color: string }): React.ReactElement => (
  <span
    aria-hidden
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 8px ${color}`,
      marginRight: 8,
      verticalAlign: 'middle',
      position: 'relative',
      top: -1,
    }}
  />
);

const buttonStyle = (rule: string, ink: string): React.CSSProperties => ({
  background: 'transparent',
  border: `1px solid ${rule}`,
  color: ink,
  padding: '3px 9px',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});
```

- [ ] **Step 4: Build, lint, check**

Run: `npm run build && npm run lint`. Desktop: left nav Now · Work · Record · Writing · Contact, JORIUS over VOL. X · 2026 in the centre, Projects, Dark Galaxy ↗ with a purple dot, ● Available · Q4 2026, ES, ☀ LIGHT on the right; no "press /". `Writing` goes to `/writing`; `Record` from `/writing` returns to the landing and scrolls to Record. Press `/`: the palette lists jump › work / record / now / contact, then the commands including "show writing". At 400px: brand at the left, hamburger at the right, the panel lists all seven links and the utilities.

- [ ] **Step 5: Commit**

```bash
git add src/components/direction-b/BTopBar.tsx src/components/direction-b/paletteSections.ts src/components/CommandPalette.tsx src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "Centre the brand in the top bar and send Writing to its page

The designer's proposal puts JORIUS and the volume line between the two
link groups, out of the corner the review marked red. Dark Galaxy keeps a
purple mark as a dot instead of purple text, the press-slash hint goes,
and Writing becomes a route now that its landing section is gone."
```

---

### Task 12: Crawler copy without the Why block

**Files:**
- Modify: `scripts/llms/load.ts`, `scripts/llms/render.ts`, `scripts/llms/load.test.ts`, `scripts/llms/render.test.ts`
- Modify: `src/data/jorius.ts` (remove `hire_why`, `testimonials`, their interfaces)

**Interfaces:**
- `BioInput` loses `operating`, `remote`, `why`; gains `anywhere: string`, `tz: string`.

- [ ] **Step 1: Update the fixture and the load test first (they fail until the code follows)**

In `scripts/llms/render.test.ts`'s `site()` fixture replace `operating: 'Colombia · GMT-5', remote: 'remote across the Americas',` with `anywhere: 'Work from anywhere', tz: 'GMT-5 · Colombia',` and delete the `why: [...]` line. Search the file for `why` and `Based in` and update any assertion that mentions them (expected text becomes `Location: GMT-5 · Colombia, work from anywhere`).

In `scripts/llms/load.test.ts` delete `expect(input.bio.why).toHaveLength(JORIUS.hire_why.length);` and add `expect(input.bio.anywhere.length).toBeGreaterThan(0);`.

Run: `npm test -- scripts/llms`
Expected: FAIL on the type/shape mismatch.

- [ ] **Step 2: Update `render.ts`**

In `BioInput` replace `operating: string; remote: string;` with `anywhere: string; tz: string;` and delete `why: Array<{ h: string; b: string }>;`. Change the summary sentence (line ~222) to:

```ts
    `${bio.role}. ${bio.anywhere}, ${bio.tz}. ${bio.intro} ` +
```

Change the bullet (line ~250) to:

```ts
        `- Location: ${bio.tz}, ${bio.anywhere.toLowerCase()}`,
```

Delete the `section(…, bio.why.map((w) => \`- **${w.h}** ${w.b}\`))` block (line ~270) and the heading that introduces it.

- [ ] **Step 3: Update `load.ts`**

In the `LocaleFile` interface change `hero: { intro: string; body: string; operatingValue: string; remote: string };` to `hero: { intro: string; body: string; anywhere: string; tz: string };` and delete the `hireWhy` line. Delete `const why = …`. In the returned `bio` replace `operating: d.hero.operatingValue, remote: d.hero.remote,` with `anywhere: d.hero.anywhere, tz: d.hero.tz,` and delete `why,`.

- [ ] **Step 4: Trim `jorius.ts`**

Delete the `TestimonialEntry` and `HireWhyEntry` interfaces, the `testimonials` and `hire_why` fields in `JoriusData`, and the `testimonials: [],` and `hire_why: [ … ]` entries in `JORIUS`. (The top-level `testimonials` block in the locale files belongs to the legacy pages and stays.)

- [ ] **Step 5: Tests and build**

Run: `npm test && npm run build`
Expected: pass; `BWhy.tsx` still compiles because it is deleted in Task 13 (if `tsc` complains about `hire_why` in `BWhy.tsx`, do Task 13's deletions of `BWhy.tsx` and `BOssWriting.tsx` now and fold them into this commit).

- [ ] **Step 6: Commit**

```bash
git add scripts/llms src/data/jorius.ts
git commit -m "Drop the Why reasons from the crawler copy and describe the new hero

llms.txt mirrors what the site shows; the four reasons leave with the
section and the bio line follows the hero's work-from-anywhere wording."
```

---

### Task 13: New landing composition and the removals

**Files:**
- Modify: `src/components/direction-b/DirectionB.tsx`
- Delete: `src/components/direction-b/BOssWriting.tsx`, `src/components/direction-b/BWhy.tsx`, `src/hooks/useGitHubRepos.ts`, `src/utils/languageIcons.tsx`
- Modify: `src/utils/dateLabels.ts` (remove `currentMonthYear` and `normalizeLang`)
- Modify: `index.html` (remove the `.b-why-step` rules)
- Modify: `en.json`, `es.json` (remove dead keys)
- Modify: `.env.example`, `.github/workflows/deploy.yml`, `CLAUDE.md`
- Create: `src/i18n/locales.test.ts`

- [ ] **Step 1: Write the locale parity test**

Create `src/i18n/locales.test.ts`:

```ts
// packages
import { describe, expect, it } from 'vitest';

// i18n
import en from './locales/en.json';
import es from './locales/es.json';

type Tree = { [key: string]: Tree | string };

const paths = (node: Tree, prefix = ''): string[] =>
  Object.entries(node).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : paths(v as Tree, `${prefix}${k}.`),
  );

// A key present in one language and missing in the other renders as its raw
// path, so the two files must describe the same tree.
describe('locale files', () => {
  it('have the same keys in English and Spanish', () => {
    const enKeys = paths(en as Tree).sort();
    const esKeys = paths(es as Tree).sort();
    expect(esKeys).toEqual(enKeys);
  });

  it('no longer carry the keys of the removed landing sections', () => {
    const enKeys = paths(en as Tree);
    for (const dead of ['directionB.oss.', 'directionB.hireWhy.', 'directionB.sections.why.', 'directionB.sections.writing.', 'directionB.sections.index.', 'directionB.hero.headline.', 'directionB.topbar.pressKey']) {
      expect(enKeys.some((k) => k.startsWith(dead)), dead).toBe(false);
    }
  });
});
```

Run: `npm test -- src/i18n`
Expected: the second case FAILS (the dead keys are still there); the first may pass or fail depending on today's drift. Both must pass by step 5.

- [ ] **Step 2: Compose the landing**

`src/components/direction-b/DirectionB.tsx`: remove the `BOssWriting` and `BWhy` imports and elements, and order the sections `BTopBar`, `BHero`, `BServices`, `BExperience`, `BNow`, `BContact`, then `ScanLines` and `CommandPalette`. The `fontFamily` on the wrapper stays Space Mono.

- [ ] **Step 3: Delete the dead modules**

```bash
git rm src/components/direction-b/BOssWriting.tsx src/components/direction-b/BWhy.tsx src/hooks/useGitHubRepos.ts src/utils/languageIcons.tsx
```

In `src/utils/dateLabels.ts` delete `normalizeLang` and `currentMonthYear`; keep `currentQuarter` and `currentYear`. In `index.html` delete the `/* WHY step hover effect */` comment and the five `.b-why-step` rules; keep the two `.b-index-card` rules.

- [ ] **Step 4: Remove the dead locale keys**

In both locale files, under `directionB`, delete: `hero.meta`, `hero.headline` (whole object), `hero.operating`, `hero.operatingValue`, `hero.remote`, `hero.replies`; `topbar.pressKey`, `topbar.nav.index`; `sections.index`, `sections.writing`, `sections.why`; the whole `oss` object; the whole `hireWhy` object; `contact.book`, `contact.whatsappLabel`. Keep everything else, including the top-level `testimonials`.

- [ ] **Step 5: Env var and docs**

`.env.example`: delete the `VITE_GITHUB_USERNAME=jorius` line (leave the file empty, it stays as the template). `.github/workflows/deploy.yml`: delete the two lines `env:` / `VITE_GITHUB_USERNAME: jorius` under the Build step. `CLAUDE.md`: in **Project structure** replace the `src/components/sections/` bullet's section list with "Homepage sections (`BHero`, `BServices` = Work, `BExperience` = Record, `BNow`, `BContact`) composed in `src/components/direction-b/DirectionB.tsx`; Work, Record and `/projects` share `BCardGrid`/`BCard`", drop the sentence about `useGitHubRepos`, replace the **Env vars** section's `VITE_GITHUB_USERNAME` bullet with "None today. `.env.example` is kept as the template", and in **Styling** replace "the homepage and the Dark Galaxy section have a light/dark toggle" with "…toggle; the vignette overlay was removed in the 2026-10 overhaul, scan lines remain".

- [ ] **Step 6: Everything green**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, including both locale cases.

- [ ] **Step 7: Walk the landing**

On http://localhost:5174/ in both themes and both languages: Hero → WORK. → RECORD. → NOW. → TELL ME ABOUT IT., no Writing & OSS, no Why; every top-bar link and palette entry lands; nothing in a corner is grey-on-grey.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Compose the landing as Hero, Work, Record, Now, Contact

Writing & OSS and Why leave the page with their components, the GitHub
hook, the language icons and their copy; Writing lives at /writing and
repositories on /projects. The locale parity test keeps English and
Spanish in step from here on."
```

---

### Task 14: Verification captures and the review checklist

**Files:**
- None in the repo. Captures go to the session scratchpad.

- [ ] **Step 1: Capture the landing**

With the dev server on 5174, run from the scratchpad (same shape as the mock's capture script, system Chrome headless):

```js
const { chromium } = require('/mnt/media/Sources/JerichoDigital/geromanager-qa/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome' });
  const errors = [];
  const run = async (name, w, h, theme) => {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    page.on('console', (m) => { if (m.type() === 'error') errors.push(name + ': ' + m.text()); });
    page.on('pageerror', (e) => errors.push(name + ': ' + e.message));
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    await page.evaluate((t) => localStorage.setItem('b-theme', t), theme);
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth + 'x' + document.documentElement.clientWidth);
    await page.screenshot({ path: `_${name}.png`, fullPage: true });
    console.log(name, sw);
    await page.close();
  };
  await run('desktop-dark', 1440, 900, 'dark');
  await run('phone-dark', 400, 800, 'dark');
  await run('desktop-light', 1440, 900, 'light');
  await browser.close();
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
})();
```

(Check the storage key `src/utils/storage.ts` uses for the theme before running; replace `b-theme` with it.)

Expected: `errors: none`, scroll width equals client width at both sizes.

- [ ] **Step 2: Compare against the mock**

Open the captures next to `docs/design/2026-10-03-landing-overhaul/mock.html` (hero A, vignette off) and go through the spec's §6 checklist row by row. Fix any mismatch in the owning task's files, commit it with its own message, and recapture.

- [ ] **Step 3: Hand over**

Report to the owner: the dev server URL, the commit list, and the §6 checklist with each row ticked. No push.

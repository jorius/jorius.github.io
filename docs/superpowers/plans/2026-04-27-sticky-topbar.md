# Sticky Top Bar with Smart Hide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `BTopBar` stay fixed at the top of the viewport, sliding out of view when the user scrolls down and reappearing when they scroll up.

**Architecture:** The bar already has `position: sticky; top: 0` defined but is broken by `overflow: hidden` on every parent container. Fixing that to `overflow: clip` restores sticky. A new `useScrollDirection` hook tracks scroll direction and `BTopBar` uses it to toggle a CSS transform that slides the bar in and out.

**Tech Stack:** React 19, TypeScript 5.9, inline styles (no Tailwind in direction-b components), passive scroll event listener.

---

## Task 1: Create feature branch

**Files:** git only

- [ ] **Step 1: Create and switch to branch from main**

```bash
git checkout main
git checkout -b feature/sticky-topbar
```

- [ ] **Step 2: Verify**

```bash
git status
```

Expected: `On branch feature/sticky-topbar`, nothing to commit.

---

## Task 2: Fix parent overflow on all three pages

**Files:**
- Modify: `src/components/direction-b/DirectionB.tsx`
- Modify: `src/pages/Read.tsx`
- Modify: `src/pages/Pgp.tsx`

**Why:** `overflow: hidden` on a container creates a new scroll context, which breaks `position: sticky` inside it. `overflow: clip` produces the same visual clipping (prevents horizontal bleed from glitch animations) without creating a scroll container.

- [ ] **Step 1: Fix DirectionB.tsx**

In `src/components/direction-b/DirectionB.tsx`, find the root wrapper `<div>` style — it looks like:

```tsx
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
```

Change `overflow: 'hidden'` to `overflow: 'clip'`:

```tsx
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        width: '100%',
        position: 'relative',
        overflow: 'clip',
      }}
    >
```

- [ ] **Step 2: Fix Read.tsx**

In `src/pages/Read.tsx`, find the root wrapper `<div>` style:

```tsx
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
```

Change `overflow: 'hidden'` to `overflow: 'clip'`:

```tsx
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'clip',
      }}
    >
```

- [ ] **Step 3: Fix Pgp.tsx**

In `src/pages/Pgp.tsx`, find the root wrapper `<div>` style:

```tsx
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
```

Change `overflow: 'hidden'` to `overflow: 'clip'`:

```tsx
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'clip',
      }}
    >
```

- [ ] **Step 4: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/direction-b/DirectionB.tsx src/pages/Read.tsx src/pages/Pgp.tsx
git commit -m "Fix overflow to unblock sticky positioning on all pages"
```

---

## Task 3: Add useScrollDirection hook

**Files:**
- Create: `src/hooks/useScrollDirection.ts`

**Why:** A small passive scroll listener that computes direction from raw `scrollY` deltas, with a threshold to suppress jitter and a near-top override so the bar always reappears when the user is close to the top.

- [ ] **Step 1: Create the file**

Create `src/hooks/useScrollDirection.ts` with this exact content:

```ts
// packages
import { useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

const THRESHOLD = 6;
const NEAR_TOP = 60;

export const useScrollDirection = (): ScrollDirection => {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const prevY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const delta = useRef(0);

  useEffect(() => {
    const onScroll = (): void => {
      const y = window.scrollY;
      if (y < NEAR_TOP) {
        setDirection('up');
        prevY.current = y;
        delta.current = 0;
        return;
      }
      const diff = y - prevY.current;
      delta.current += diff;
      prevY.current = y;
      if (Math.abs(delta.current) >= THRESHOLD) {
        setDirection(delta.current > 0 ? 'down' : 'up');
        delta.current = 0;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
};
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useScrollDirection.ts
git commit -m "Add useScrollDirection hook for smart-hide top bar"
```

---

## Task 4: Update BTopBar to use the hook

**Files:**
- Modify: `src/components/direction-b/BTopBar.tsx`

**Why:** `BTopBar` already has `position: sticky; top: 0; z-index: 40`. We add the hook call and a CSS transform + transition so the bar slides out when `direction === 'down'` and slides back in when `direction === 'up'`.

- [ ] **Step 1: Add the hook import**

In `src/components/direction-b/BTopBar.tsx`, the imports currently look like:

```tsx
// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// components
import { Glitch } from '../primitives/Glitch';
```

Add the hook import in a new `// hooks` group between contexts and components:

```tsx
// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useScrollDirection } from '../../hooks/useScrollDirection';

// components
import { Glitch } from '../primitives/Glitch';
```

- [ ] **Step 2: Call the hook and derive `visible`**

Inside the `BTopBar` function body, the current hook calls are:

```tsx
  const { t, i18n } = useTranslation();
  const { t: th, theme, toggleTheme } = useBTheme();
```

Add after them:

```tsx
  const scrollDir = useScrollDirection();
  const visible = scrollDir === 'up';
```

- [ ] **Step 3: Add transform and transition to the wrapper div**

The wrapper `<div>`'s style currently ends with:

```tsx
        padding: '14px 32px',
        fontSize: 12,
        color: th.ink,
```

Add `transform` and `transition` as the last two properties:

```tsx
        padding: '14px 32px',
        fontSize: 12,
        color: th.ink,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 260ms ease',
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

Open `http://localhost:5173` and verify:
- Bar is visible on page load
- Scrolling down > 6px causes bar to slide up and disappear
- Scrolling back up causes bar to slide back in
- Bar stays visible when within 60px of the top
- Same behaviour on `/pgp` and `/read/any-slug`

Note: You cannot run a browser, so skip this step and report DONE. Build + lint are the verification gates.

- [ ] **Step 6: Commit**

```bash
git add src/components/direction-b/BTopBar.tsx
git commit -m "Add smart-hide scroll behaviour to top bar"
```

---

## Task 5: Open pull request

**Files:** git only

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feature/sticky-topbar
```

- [ ] **Step 2: Open PR against main**

```bash
gh pr create \
  --base main \
  --title "Add sticky top bar with smart-hide scroll behaviour" \
  --body "$(cat <<'EOF'
## Summary

- Fixes `overflow: hidden` → `overflow: clip` on the three page wrappers that were silently preventing `position: sticky` from working
- Adds a `useScrollDirection` hook (passive scroll listener, 6px jitter threshold, near-top override)
- `BTopBar` slides out of view when scrolling down and reappears when scrolling up, with a 260ms ease transition

## Test plan

- [ ] Top bar stays fixed at the top as you scroll the homepage
- [ ] Scrolling down hides the bar; scrolling up brings it back
- [ ] Bar always visible within 60px of the page top
- [ ] Same behaviour on /pgp and /read/:slug
- [ ] No horizontal overflow visible (clip still prevents bleed)
EOF
)"
```

---

## Self-review

**Spec coverage:**
- ✅ Fix overflow: hidden → clip on DirectionB, Read, Pgp — Task 2
- ✅ useScrollDirection hook with THRESHOLD=6, NEAR_TOP=60, passive listener — Task 3
- ✅ BTopBar consumes hook, adds transform + transition — Task 4
- ✅ All three pages covered, no per-page changes needed — Task 2 handles all

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:** `useScrollDirection` returns `ScrollDirection` (`'up' | 'down'`), exported and used correctly in Task 4 (`const scrollDir = useScrollDirection()`). `visible` is `boolean`, used directly in template literals for `transform`.

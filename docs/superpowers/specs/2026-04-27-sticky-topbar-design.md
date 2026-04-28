# Sticky Top Bar with Smart Hide

**Date:** 2026-04-27  
**Branch:** feature/sticky-topbar (to be created from main)  
**Target:** main

---

## Overview

`BTopBar` already has `position: sticky; top: 0; z-index: 40` in its styles but is silently broken on all three pages that use it because the parent container has `overflow: hidden`, which turns the container into a scroll container and prevents sticky from working against the viewport.

This spec covers two changes:

1. Fix the root cause: change `overflow: hidden` → `overflow: clip` on the three parent containers.
2. Add smart-hide behaviour: the bar slides out of view when scrolling down and slides back in when scrolling up.

---

## 1. Fix parent overflow

**Files:**
- `src/components/direction-b/DirectionB.tsx`
- `src/pages/Read.tsx`
- `src/pages/Pgp.tsx`

Each has a top-level wrapper `<div>` with `overflow: 'hidden'`. Change it to `overflow: 'clip'`.

`overflow: clip` clips content the same way `hidden` does visually (preventing horizontal bleed from glitch animations), but unlike `hidden` it does **not** create a new scroll container — so `position: sticky` inside it works relative to the viewport, as intended.

---

## 2. `useScrollDirection` hook

**File:** `src/hooks/useScrollDirection.ts`

### Interface

```ts
type ScrollDirection = 'up' | 'down';
export const useScrollDirection = (): ScrollDirection
```

### Behaviour

- Attaches a **passive** `scroll` event listener to `window` on mount; removes it on unmount.
- Compares `window.scrollY` to the previous value on each event.
- Returns `'up'` when the user scrolls upward (or has not yet scrolled).
- Returns `'down'` when the user scrolls downward.
- **Threshold:** only changes direction state after a net movement of **6 px** to suppress micro-jitter (e.g. momentum scrolling overshoot).
- **Near-top override:** always returns `'up'` when `window.scrollY < 60`, regardless of direction — so the bar reappears automatically when the user is near the top.
- **Initial value:** `'up'` (bar visible on page load).

### Implementation sketch

```ts
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

---

## 3. `BTopBar` update

**File:** `src/components/direction-b/BTopBar.tsx`

Add `useScrollDirection` import alongside `useBTheme` and `useTranslation`.

Inside `BTopBar`, call:

```ts
const scrollDir = useScrollDirection();
const visible = scrollDir === 'up';
```

Add to the wrapper `<div>`'s style:

```ts
transform: visible ? 'translateY(0)' : 'translateY(-100%)',
transition: 'transform 260ms ease',
```

The bar already has `position: sticky; top: 0` — no other layout changes needed.

---

## Behaviour matrix

| Condition | Bar state |
|---|---|
| Page load | Visible |
| `scrollY < 60px` | Always visible |
| Scrolling down ≥ 6px net | Slides out (up, off-screen) |
| Scrolling up ≥ 6px net | Slides back in |
| Mobile (no change needed) | Same behaviour |

---

## Files changed (summary)

| File | Change |
|---|---|
| `src/components/direction-b/DirectionB.tsx` | `overflow: 'hidden'` → `overflow: 'clip'` |
| `src/pages/Read.tsx` | `overflow: 'hidden'` → `overflow: 'clip'` |
| `src/pages/Pgp.tsx` | `overflow: 'hidden'` → `overflow: 'clip'` |
| `src/hooks/useScrollDirection.ts` | New hook |
| `src/components/direction-b/BTopBar.tsx` | Consume hook, add transform + transition |

No new dependencies. No routing changes. No i18n changes.

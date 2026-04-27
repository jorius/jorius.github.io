# Recruiter Cleanup & PGP Easter Egg Enhancement

**Date:** 2026-04-27  
**Branch:** feature/recruiter-cleanup (to be created)  
**Target:** main

---

## Overview

Six independent changes to prepare the site for recruiter-facing use and polish the PGP easter egg entry point.

---

## 1. Remove Jericho Digital references

**File:** `src/data/jorius.ts`

Set `affiliations: []`.

The `BContact` component already guards rendering with `JORIUS.affiliations.length > 0`, so the "Affiliations" sub-block disappears automatically. No component edits required.

---

## 2. Cat co-workers — roles + rename Taquito → Toji

**File:** `src/components/direction-b/Portrait.tsx`

Update the `CATS` array:

| Name     | Role           | src (unchanged)              |
|----------|----------------|------------------------------|
| Gasolina | Lead QA        | `/images/cats/gasolina.jpg`  |
| Pancho   | CEO            | `/images/cats/pancho.jpg`    |
| Toji     | CFO            | `/images/cats/taquito.jpeg`  |
| Cohete   | Right-hand man | `/images/cats/cohete.jpeg`   |

Add a `role` field to the `CatPhoto` interface. Update the top framing label to display:

```
{activeCat.name.toUpperCase()} · {activeCat.role.toUpperCase()} / 35mm
```

The image file for "Toji" stays at `/images/cats/taquito.jpeg` — only the display name and role change. No file rename needed.

---

## 3. NOW section — i18n for both languages

**Problem:** `JORIUS.now` entries are hardcoded English strings in `jorius.ts`. The section renders them via `{n.k}` / `{n.v}` with no translation.

**Solution:** Move the entries into both locale files under `directionB.now.entries` as an array of `{ k, v }` objects. Update `BNow.tsx` to source entries from `tr('directionB.now.entries', { returnObjects: true })` instead of `JORIUS.now`.

**en.json additions** (`directionB.now.entries`):
```json
[
  { "k": "writing", "v": "a sci-fi novel of my own — first draft, slow and steady" },
  { "k": "building", "v": "a 2D game set in the same sci-fi universe" },
  { "k": "looking", "v": "open to my next role — full-stack or security-focused, remote" },
  { "k": "home", "v": "raising a family and 4 demanding cats" },
  { "k": "co-founding", "v": "a small studio with a friend — custom software + SaaS" }
]
```

**es.json additions** (`directionB.now.entries`):
```json
[
  { "k": "escribiendo", "v": "una novela de ciencia ficción propia — primer borrador, poco a poco" },
  { "k": "construyendo", "v": "un juego 2D ambientado en el mismo universo de ciencia ficción" },
  { "k": "buscando", "v": "abierto a mi próximo rol — full-stack o seguridad, remoto" },
  { "k": "hogar", "v": "criando una familia y 4 gatos exigentes" },
  { "k": "co-fundando", "v": "un pequeño estudio con un amigo — software a medida + SaaS" }
]
```

`BNow.tsx` change: replace `JORIUS.now.map(...)` with a typed cast of the i18n return value. Remove the `JORIUS` import from BNow if it's no longer used there.

---

## 4. Hide INDEX section

**File:** `src/components/direction-b/DirectionB.tsx`

- Comment out `<BProjects />` in the render tree.
- Remove the `{ id: 'b-projects', label: 'index', hint: 'projects' }` entry from `PALETTE_SECTIONS`.

Convention matches how sections are disabled in `Home.tsx` — commented out, not deleted.

---

## 5. Remove duplicate "back to record" on PGP page

**File:** `src/pages/Pgp.tsx`

Remove the second `<Reveal>` + `<Link>` block at lines 181–194 (the one at the bottom of the article). Keep the one at lines 52–66 (top of the article).

---

## 6. PGP easter egg hover enhancement

**File:** `src/components/direction-b/BContact.tsx`

Extract the PGP link block (currently lines 82–100) into a `PgpBlock` sub-component defined in the same file. This keeps hover state local without touching any sibling state.

### Hover state

`useState<boolean>(false)` — toggled by `onMouseEnter` / `onMouseLeave` on the outer container.

### Effects on hover

| Layer | Effect |
|---|---|
| Container cursor | `cursor: crosshair` |
| Key ID + algo line | `<Glitch trigger="hover" strong>` wrapping `{JORIUS.pgp.algo} · {JORIUS.pgp.keyId}` |
| Fingerprint | Continuous hex-scramble loop (RAF) while hovered: cycles `0–9 A–F` randomly over each non-space char, preserving spaces and grouping. Resolves back to real value when hover ends. |
| Scan line overlay | `position: absolute`, `inset: 0`, `pointerEvents: none`, `repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,0.06) 3px 4px)`, opacity `0 → 0.10` via `transition: opacity 200ms`. |
| `[ ENCRYPTED ]` label | Small label below fingerprint, `opacity: 0 → 1` + `transform: translateY(4px) → translateY(0)` via `transition: 150ms`. Uses `t.dim` color, `fontSize: 10`, `letterSpacing: 0.14em`. |

### Fingerprint scramble detail

```
chars eligible: 0-9, A-F (hex alphabet, uppercase)
spaces: always preserved as-is
loop: requestAnimationFrame, ~60fps while hovered
on unhover: cancel RAF, restore original fingerprint string
```

No new primitive needed — implemented inline in `PgpBlock`.

### Accessibility

The `Link`'s existing `title` attribute already describes the action. The scramble and overlay are `aria-hidden`. No focus-state changes — keyboard navigation is unaffected.

---

## Files changed (summary)

| File | Change |
|---|---|
| `src/data/jorius.ts` | `affiliations: []` |
| `src/components/direction-b/Portrait.tsx` | Add `role` to `CatPhoto`, rename Taquito → Toji, update framing label |
| `src/i18n/locales/en.json` | Add `directionB.now.entries` array |
| `src/i18n/locales/es.json` | Add `directionB.now.entries` array |
| `src/components/direction-b/BNow.tsx` | Source entries from i18n instead of `JORIUS.now` |
| `src/components/direction-b/DirectionB.tsx` | Comment out `<BProjects />`, remove palette entry |
| `src/pages/Pgp.tsx` | Remove second back-link block |
| `src/components/direction-b/BContact.tsx` | Extract `PgpBlock`, add hover effects |

No new files. No routing changes. No new dependencies.

# Umami analytics for jorius.github.io — design

**Date:** 2026-09-24
**Status:** approved in conversation, pending spec review
**Scope:** one feature branch, `feature/umami-analytics`, merged to `main` and live on deploy

## 1. Goal

Answer four questions about the site without collecting anything personal:
where visits come from (country), how many there are per week, two weeks and
month, which pages get read, and what visitors do beyond reading (switch
language, toggle theme, leave through an outbound link).

The numbers are consumed in a dashboard the owner opens when curious. No
reports, no public stats page, no alerting.

## 2. Decisions carried into this design

Recorded from the 2026-09-05 brainstorm and the 2026-09-24 session.

| Decision | Choice | Why |
|---|---|---|
| Privacy model | cookieless, no consent banner, no IP logging | the footer already promises "NO COOKIES"; a banner would be a regression |
| Collector | **Umami Cloud, Hobby plan** ($0, 100K events/month, 1 website, 6-month retention, custom events included) | free tier exists, paid tier and self-hosted are the same product, so a later move to Jericho Digital infrastructure changes one URL |
| Website | `jorius.github.io`, website id `f182739a-828d-4a63-81ab-07e8fd73945f`, script host `https://cloud.umami.is/script.js` | created by the owner on 2026-09-24 |
| Configuration | static tag in `index.html`, **no env vars** | nothing is secret, and `data-domains` already keeps local builds silent; env vars bought nothing |
| Events, first release | `language-switch`, `theme-toggle`, `outbound-click` | each answers a real question; "post opened" was dropped because the page view of `/writing/<slug>` already records it |
| Do Not Track | respected (`data-do-not-track="true"`) | matches the site's privacy line; costs a few visits from browsers that still send the header; a one-attribute flip if the owner changes his mind |
| Dark Galaxy "Start" event | out of scope | lives on the untouched `feature/darkgalaxy-section` branch; that branch calls the helper when it lands |

## 3. Out of scope

- Any change to the blog-draft or Dark Galaxy branches.
- Reading-depth events, email reports, public stats, Umami API use.
- Proxying the tracker to defeat ad blockers (needs a server; later phase).
- Self-hosting Umami. If it happens, only the `src` host in the tag changes.

## 4. Design

### 4.1 Tracker tag

Added to `index.html`, in `<body>`, **after** the app's module script:

```html
<script type="module" src="/src/main.tsx"></script>
<!--
  Umami analytics (cloud.umami.is, cookieless).
  Placed after the app entry on purpose: deferred and module scripts run in
  document order, so this runs after main.tsx has restored the real path from
  the 404 fallback. In the head it would record every deep link as "/".
  data-domains keeps the dev server and local previews silent.
-->
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="f182739a-828d-4a63-81ab-07e8fd73945f"
  data-domains="jorius.github.io"
  data-exclude-search="true"
  data-exclude-hash="true"
  data-do-not-track="true"
></script>
```

Why the order holds in both modes:

- **Dev:** the module script sits in the body before the tag. Module scripts and
  `defer` scripts share one in-order execution list.
- **Production:** Vite removes the source module tag and injects the built
  entry into `<head>` (verified on the live page: the entry is the last
  element of the head). The Umami tag stays in the body, so it still runs
  second. Vite leaves external script URLs untouched.

`main.tsx` keeps its path-restore block as the first statement; that ordering
becomes a documented requirement (comment in `main.tsx`).

Attribute rationale:

| Attribute | Value | Effect |
|---|---|---|
| `data-domains` | `jorius.github.io` | the script sends nothing from any other host (localhost, previews, forks) |
| `data-exclude-search` | `true` | query strings never leave the browser |
| `data-exclude-hash` | `true` | section anchors never leave the browser |
| `data-do-not-track` | `true` | visitors sending DNT are not counted |

Page views need no code: Umami's auto-track hooks `pushState`/`replaceState`,
so every React Router navigation is a page view under its real path.

### 4.2 Helper module

`src/utils/analytics.ts` (plus `src/types/umami.d.ts` for the global). Public
surface:

```ts
export type EventData = Record<string, string | number | boolean>;

/** Forward to Umami when it is loaded; otherwise do nothing. Never throws. */
export function track(name: string, data?: EventData): void;

/**
 * Classify a link for outbound tracking.
 * - http(s) link to another origin  -> { host: url.host }
 * - mailto: link                    -> { host: 'mailto' }
 * - same origin, relative, hash-only, tel:, javascript:, unparsable -> null
 */
export function outboundTarget(href: string, currentOrigin: string): { host: string } | null;

/**
 * One capture-phase listener on the document for `click` and middle-button
 * `auxclick`. Finds the closest `a[href]` and sends `outbound-click` when
 * outboundTarget() is non-null. Returns an uninstall function.
 */
export function installOutboundTracking(doc: Document): () => void;
```

`src/types/umami.d.ts`:

```ts
interface UmamiTracker {
  track(name: string, data?: Record<string, unknown>): void;
}
interface Window {
  umami?: UmamiTracker;
}
```

(A `Window` augmentation rather than `declare var`, which the linter's
`no-var` rule would reject.)

Rules: `track` reads `window.umami` at call time (the script loads
asynchronously), wraps the call in `try/catch`, and never blocks the UI.
Event names stay under Umami's 50-character limit; data values are short
strings.

### 4.3 Events

| Event | Data | Where it fires |
|---|---|---|
| `language-switch` | `{ to: 'en' \| 'es' }` | `BTopBar.switchLang` and `LanguageSelector.changeLanguage`, the only two language changers |
| `theme-toggle` | `{ to: 'light' \| 'dark' }` (the resulting mode) | the theme button in `BTopBar`, the only toggle; the handler computes the next mode from the current `theme` and then calls `toggleTheme` |
| `outbound-click` | `{ host }` | the delegated listener, installed once from `main.tsx`; covers header, contact, portfolio, and links inside rendered posts without touching those components |

### 4.4 Own visits

Umami's documented method: run once per browser on the live site

```js
localStorage.setItem('umami.disabled', 1);
```

Documented in `CLAUDE.md`. Nothing in the code automates it (the dev server is
already silent through `data-domains`).

### 4.5 Failure modes

- Script blocked (ad blocker) or unreachable: the page behaves exactly as
  today; `track` is a no-op; events are dropped silently.
- Tracker throws inside `track`: swallowed.
- Link without `href`, or a click whose target is not inside an anchor:
  ignored.

## 5. Testing

Unit tests, vitest, node environment (no DOM library is added):

- `outboundTarget`: other-origin http and https -> host; same origin absolute
  -> null; relative path -> null; hash-only -> null; `mailto:` -> `mailto`;
  `tel:` and `javascript:` -> null; unparsable -> null; host keeps its port.
- `track`: no global -> no throw; global present -> called with name and data;
  global throws -> swallowed.
- `installOutboundTracking`: with a fake document, a click on an outbound
  anchor sends `outbound-click` with the host, a click on an internal anchor
  sends nothing, a right-button `auxclick` sends nothing, and the uninstall
  function removes both listeners.

Local gates: `npm run lint`, `npm test`, `npm run build` all pass.

Headless browser check on `vite preview` of the production build, with the
request to `cloud.umami.is/script.js` intercepted and answered by a stub that
records `document.currentScript.dataset` and `location.pathname` at execution
time and defines `window.umami.track` as a recorder:

1. Opening `/?/writing/home-lab` (the 404-fallback encoding) records pathname
   `/writing/home-lab`, proving the ordering.
2. The dataset carries the five attributes with the expected values.
3. Clicking the language button, the theme button and an outbound link
   records the three events with the expected data.

Playwright runs headless only (never a headed window on the owner's desktop).

## 6. Rollout

1. Work in the git worktree at the session scratchpad on branch
   `feature/umami-analytics`, created from `main` at `5286434`. The main
   checkout (on `feature/darkgalaxy-section`) is not touched.
2. Commits follow the repo rules: capitalised infinitive verb subject, body
   says why, no `Co-Authored-By` trailer; hooks run lint and the subject
   check.
3. The owner tests on a local preview (port 5180; 5173 is his own dev server).
4. Only after his go: push, PR to `main`, merge (never rebase), Pages deploy.
5. Live verification: the tag is in the page source of https://jorius.github.io
   and a visit shows in Umami's realtime view. Then the owner sets the
   own-visit flag in his browsers.

## 7. Documentation changes

- `CLAUDE.md`: new "Analytics" section: Umami Cloud, tag location and why it is
  after the entry script, the `data-domains` guard, the three events and the
  helper, own-visit exclusion, how to move the collector later (change `src`).
- This spec.

## 8. Known limits

- Ad blockers commonly block the `cloud.umami.is` host, so counts run low by
  the share of visitors using one. No fix in this phase.
- Free plan retention is six months; data export exists if history matters.
- DNT respect lowers counts slightly.

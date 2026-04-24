# Technical Fixes — Design Spec

| | |
|---|---|
| **Date** | 2026-04-24 |
| **Author** | Jose Ríos (with Claude Code) |
| **Status** | Approved — ready for implementation |
| **Predecessor** | PR #1 (Vite + React 19 + TS portfolio scaffold port from GitLab) |

## 1. Background

The portfolio site was just ported from a GitLab repo into this GitHub Pages repo as a Vite/React 19/TS scaffold (PR #1). A comprehensive audit surfaced a set of correctness, security, accessibility, responsive-design, and SEO gaps that block a respectable launch. This spec defines what we will fix in this pass and how we will sequence it. It explicitly defers visual/design improvements and real content authoring to a separate "design overhaul" pass that the user is running in parallel via Claude Design.

## 2. Goals

After this work lands, the site should:

- Not leak any secret to clients (no embedded PATs/keys).
- Render correctly on mobile (375px+) and desktop, without dark-mode toggles or theme switching.
- Have zero broken asset references and zero placeholder/lorem strings shipped to visitors on critical paths.
- Cover all referenced i18n keys in both `en` and `es` locales.
- Have basic SEO and discoverability (per-route titles, OG/Twitter meta, favicon, `robots.txt`, `sitemap.xml`).
- Have a graceful 404 page and lazy-loaded routes.
- Have the contact form cleanly disabled (no broken submit) until a backend is wired in a future pass.

## 3. Non-Goals

Explicitly out of scope for this spec:

- Visual redesign, typography overhaul, color-palette work, layout reflow beyond what mobile responsiveness requires.
- Authoring real content for portfolio entries, testimonials, blog posts, or extended bio copy.
- Standing up an email-sending backend (Resend / Cloudflare Worker / Vercel Function). Deferred — see §8.
- Dark / light theme switching. The site renders in the existing light design only.
- Three.js / 3D scene work — the deps are removed in PR A.
- Bumping or auditing dependencies beyond what's needed for the changes above. `npm audit fix` is deferred.
- Adding explicit return-type annotations on every component (Jericho rule, but currently lint-clean and not in the audit critical path).
- Changing the deploy target away from GitHub Pages.

## 4. Constraints

- **Deploy target:** GitHub Pages (user site, root path), via `actions/deploy-pages`. No server runtime.
- **Stack:** React 19, TypeScript 5.9 strict, Vite 7, Tailwind 3, i18next, React Router 7. npm only. Node pinned to 24.15.0 in `.nvmrc`.
- **Branching:** simple `main` + `feature/*` flow, PRs into `main`. No `develop`/`sandbox`/`release/`.
- **Commits:** Jericho format — capitalized infinitive verb start, no `Co-Authored-By: Claude`, enforced by Husky `commit-msg` hook.
- **Lint gate:** Husky `pre-commit` runs `npm run lint`; commits blocked on failure.
- **CI gate:** `.github/workflows/deploy.yml` runs `npm ci && npm run build` (which includes `tsc -b` strict) and deploys `dist/` to Pages on push to `main`.

## 5. Approach

Three sequential feature branches, each merged before the next begins. Each PR is independently shippable: stopping after PR A still meaningfully improves the site over the current state.

| PR | Branch | Theme |
|---|---|---|
| A | `fix/security-and-dead-code-removal` | Remove the wrong stuff |
| B | `feature/responsive-and-i18n-coverage` | Make pages work everywhere |
| C | `feature/seo-polish-and-form-disable` | Add missing functionality |

## 6. PR A — `fix/security-and-dead-code-removal`

### A.1 Remove the GitHub PAT from the client bundle

**Problem:** `src/hooks/useGitHubRepos.ts:50` adds an `Authorization: Bearer ${VITE_GITHUB_TOKEN}` header. Vite bundles every `VITE_*` env var into the client JS, so the token is readable from DevTools by every visitor.

**Change:**
- Remove the `Authorization` header from the request.
- Remove `VITE_GITHUB_TOKEN` from `.env.example`.
- Update CLAUDE.md to drop references to the token and note the unauthenticated-API decision.
- Add a one-line code comment near the fetch explaining "no `Authorization` — runs unauthenticated to keep the static deploy secret-free."

**Trade-off accepted:** Unauthenticated GitHub API rate limit is 60 req/hr per visitor IP. For a portfolio, this is fine.

**User responsibility:** Rotate the leaked PAT outside this PR.

### A.2 Remove Three.js dependencies

**Problem:** `three`, `@react-three/fiber`, `@react-three/drei` are installed but no source file imports them. They inflate `node_modules` and risk being pulled into the bundle if someone later writes `import * from 'three'`.

**Change:**
- `npm uninstall three @react-three/fiber @react-three/drei`.
- Confirm no source imports remain (`grep -rn "three\|@react-three" src/` should return zero matches).
- Verify `npm run build` still succeeds and `dist/` shrinks.

### A.3 Remove dark-mode infrastructure and Redux

**Problem:** `ThemeToggle` is the only Redux consumer. Section components hardcode `bg-white` with zero `dark:` variants, so the toggle does nothing visible on Home. User decided to drop dark mode entirely.

**Change:**
- Delete `src/store/`, `src/components/common/ThemeToggle.tsx`.
- Remove `<Provider store={...}>` from `src/main.tsx`.
- Remove `ThemeToggle` import + usage from `src/components/common/Header.tsx`.
- Remove `darkMode: 'class'` from `tailwind.config.js`. Audit other Tailwind config tokens that exist only to support dark mode — remove if unused after the deletion.
- Remove `dark` class from `<html>` in `index.html` if present.
- `npm uninstall @reduxjs/toolkit react-redux @types/react-redux`.
- Update CLAUDE.md to drop the "State — Redux Toolkit manages theme" section.

### A.4 Remove broken asset references

**Problem:** `src/data/{testimonials,blog-posts,private-repos}.json` reference `/avatar*.jpg`, `/images/blog*.jpg` that do not exist; `ServicesSection.tsx:34` and `TestimonialsSection.tsx:13` reference `/bg-pattern.jpg` that does not exist. Visitors see 404s in DevTools network tab. Sections that depend on this data are already commented out of Home, so visible impact is minimal — this is a hygiene fix.

**Change:**
- Empty the arrays in `testimonials.json`, `blog-posts.json`, `private-repos.json` (leave the JSON shape intact: `{ "testimonials": [] }` etc.).
- Remove the `background-image: url('/bg-pattern.jpg')` style entirely from `ServicesSection.tsx:34` and `TestimonialsSection.tsx:13`. The section then inherits its parent / Tailwind class background (no replacement asset).

### A.5 Link, label, and noise fixes

- Remove the placeholder Upwork link/button in `Header.tsx:103` (don't render until a real URL is known).
- Replace the placeholder WhatsApp number `1234567890` in `Contact.tsx:132` with the real number `573013930289`.
- Delete `console.log('Form submitted:', formData)` in `Contact.tsx:18`.
- Remove the three resolved `// TODO:` comments referenced in the audit.

### A.6 Acceptance for PR A
- `npm run build` passes.
- `npm run lint` passes.
- `grep -rn "@reduxjs\|react-redux\|@react-three\|^import.*three\|VITE_GITHUB_TOKEN" src/ package.json` returns zero matches.
- DevTools network tab shows no 404s on Home page load.
- Contact page WhatsApp link points to the real number.

## 7. PR B — `feature/responsive-and-i18n-coverage`

### B.1 Home responsive overhaul

**Problem:** Zero `sm:`/`md:`/`lg:`/`xl:` prefixes anywhere in `src/components/sections/`. Fixed `px-16 py-24` paddings, fixed pixel widths (`w-[413px]`, `w-[784px]`, `max-w-[1298px]`), and `grid-cols-3` without responsive overrides break the layout on mobile.

**Change:** Mobile-first rewrite of every section in `src/components/sections/*.tsx` plus `src/components/common/Header.tsx`. Standard pattern:

| Pattern found | Pattern after |
|---|---|
| `px-16` | `px-4 md:px-8 lg:px-16` |
| `py-24` | `py-12 md:py-16 lg:py-24` |
| `w-[413px]` | `w-full max-w-[413px]` |
| `max-w-[1298px]` | unchanged (already a max), confirm `mx-auto` parent |
| `grid-cols-3` | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Absolute-positioned `-translate-x-16` arrows | Hide at `<md` (use swipe / horizontal-scroll on mobile); reposition only if a specific cleaner UX emerges during implementation |

**Method:** one commit per section file for review clarity. Audit edge cases (e.g. `ServicesSection`'s side-arrow nav) per section.

**Acceptance:** Manually load the dev server in DevTools at 375px, 768px, 1024px, 1440px widths. No horizontal scroll, no clipped content, no off-screen interactive elements at any breakpoint.

### B.2 Hamburger nav for mobile

**Change:** Add `useState` for open/closed in `Header.tsx`. Desktop links wrapped in `hidden md:flex`. Mobile-only hamburger button (`md:hidden`) toggles a slide-down panel containing the same nav links + LanguageSelector. No new dependencies.

### B.3 Fill missing i18n keys (Contact + About)

**Problem:** Several keys are referenced by components but defined in *neither* locale, so they render as raw key strings on the page.

**Change:** Add to *both* `src/i18n/locales/en.json` and `src/i18n/locales/es.json` the keys identified in the audit, including but not limited to:

- `contact.form.{from, subject, category, body, send}` and `contact.form.placeholder.*`
- `contact.form.category.options.{general, project, job, other}`
- `contact.whatsapp.{prompt, button}` and `contact.quickInfo.{title, email, whatsapp, timezone, availability}`
- `about.title`, `about.personal.{title, description}`, `about.professional.{title, description}`, `about.skills.title`, `about.interests.title`

**Approach for ES values:** I draft Spanish translations directly. User can refine wording later.

### B.4 Translate hardcoded English in Contact / About

**Change:** Wrap remaining hardcoded English strings (`Contact.tsx:84-88` select options, `Contact.tsx:142,144-147` Quick Info block, `About.tsx:54,63` Skills/Interests headers, etc.) in `t(...)` calls referencing the keys added in B.3.

### B.5 Acceptance for PR B
- `npm run build` passes.
- Manual DevTools-resize check at 375/768/1024/1440 — no horizontal scroll on any page.
- Hamburger menu functional on mobile widths; desktop nav unchanged.
- `grep -rn "t('contact\|t('about" src/ ` keys all resolve in both locales (no untranslated key strings in rendered output).

## 8. PR C — `feature/seo-polish-and-form-disable`

### C.1 Disable contact form (pending backend decision)

**Problem:** Contact form has no submit handler. Wiring it requires either a serverless backend (Resend + CF Worker / Vercel Function / Netlify Function) or a third-party form service (Formspree, EmailJS, Web3Forms). The user has paused this decision.

**Change:**
- Comment out `<ContactFormSection />` import and usage in `src/pages/Home.tsx` (mirrors the existing `BlogSection` / `TestimonialsSection` pattern).
- On `src/pages/Contact.tsx`, hide the form block. Replace with a "Get in touch" panel that surfaces email + WhatsApp + LinkedIn links prominently. Reuse the existing `Quick Info` block styling as the visual base. LinkedIn URL: pull from existing footer/social config; if absent there, omit until known.
- Leave the `ContactFormSection.tsx` and form JSX in `Contact.tsx` commented out (preserved for future re-enable), with a TODO comment pointing to this spec.

### C.2 Per-route document title

**Change:** Add `src/hooks/useDocumentTitle.ts` (~15 lines, no helmet dep). Each page calls `useDocumentTitle(t('page.someKey'))` in a `useEffect`. New i18n keys: `meta.title.{home, about, portfolio, contact, notFound}` in both locales.

### C.3 OG / Twitter meta tags

**Change:** Add static `<meta property="og:*">` and `<meta name="twitter:*">` tags to `index.html`. Default values describe Jose. Per-route OG isn't worth a helmet lib at this scale.

Tags to add (defaults for now, refinable later):
- `og:type=website`, `og:title`, `og:description`, `og:url=https://jorius.github.io/`.
- `twitter:card=summary`, `twitter:title`, `twitter:description`.
- **`og:image` and `twitter:image` are intentionally omitted** in this pass — most social platforms expect a 1200×630 PNG, not an SVG, and we don't have a designed image yet. Cards will degrade to title/description only. Add during the design overhaul.

### C.4 Cute cat favicon

**Change:** Replace `public/vite.svg` reference in `index.html` with a custom SVG cat-face favicon shipped in `public/cat.svg` (or similar). Style: minimal, friendly, visually distinct at 16×16. Drawn inline (no external asset dependency). Designable to be swapped during the design overhaul.

### C.5 robots.txt + sitemap.xml

**Change:** Add `public/robots.txt` allowing all and pointing to the sitemap. Add `public/sitemap.xml` with entries for `/`, `/about`, `/portfolio`, `/contact` (excluding `/palette` since it's a dev/internal route).

### C.6 NotFound page

**Change:** Add `src/pages/NotFound.tsx`. Wired at route `*` in `src/App.tsx`. Reuses Header/Footer layout. Localized title + body via i18n.

### C.7 Lazy-load non-Home routes

**Change:** `React.lazy` for About, Contact, Portfolio, Palette, NotFound in `App.tsx`. Home stays eager (it's the landing route). Wrap `<Routes>` in `<Suspense fallback={<Spinner />}>` — Spinner is a small new component, centered, branded with portfolio color.

### C.8 aria-label on icon-only buttons

**Change:**
- `LanguageSelector.tsx` trigger button: `aria-label={t('a11y.languageSelector')}` with new i18n key.
- `LanguageSelector.tsx` per-language buttons: `aria-label={lang.name}`.
- Audit other icon-only buttons surfaced during PR B (hamburger, ServicesSection nav arrows) — same treatment.

### C.9 Single source of truth for phone number

**Change:** Add `VITE_CONTACT_PHONE=573013930289` to `.env.example` and `.env`. Read once via a tiny helper or directly in components that need it: `Header`, `Footer`, `Contact`. Remove the hardcoded `573013930289`/`+573013930289`/`1234567890` literals.

### C.10 Acceptance for PR C
- `npm run build` passes.
- View-source on each route shows the correct `<title>` after navigation.
- `view-source:/robots.txt` and `/sitemap.xml` resolve when served from the dev server.
- Manually navigate to `/nonexistent-route` — NotFound page renders, not a blank page.
- DevTools network tab on first load shows the Home bundle but defers other route bundles until navigation.
- Browser tab shows the cat favicon.
- `<button>` elements with no text content all have `aria-label` (audit via DevTools accessibility tree).

## 9. Risks and Open Questions

- **Email backend deferred.** Contact form is non-functional in this pass by explicit decision. The spec leaves the form code commented-out for easy re-enable. Decision points to revisit: which platform (CF Worker / Vercel / Netlify), Resend domain verification (currently no custom domain → forced `onboarding@resend.dev` from-address).
- **Real content deferred.** Placeholder JSON entries are emptied (PR A.4) so we don't ship lorem ipsum. The relevant sections (Testimonials, Blog) are already disabled on Home; Portfolio still renders with the existing portfolio.json which contains semi-real entries that the design overhaul pass will revisit.
- **`/palette` route remains.** It's an internal Tailwind-color reference page. Excluded from sitemap, not lazy-loaded changes nothing functionally. Considered out of scope to remove.
- **`react-router-dom` v7 nuances.** No known issues but kept in mind for the lazy-route change.
- **Spanish translations drafted by Claude.** Likely good but not native-perfect. User can wordsmith later.

## 10. Implementation order summary

1. PR A merged → main
2. PR B merged → main
3. PR C merged → main
4. (Future / out of this spec) Email backend decision + form re-enable.
5. (In parallel, separate workstream) Design overhaul via Claude Design.

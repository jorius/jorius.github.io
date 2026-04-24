# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Jose's personal website — deployed to **GitHub Pages** at https://jorius.github.io/ from the `main` branch via a GitHub Actions workflow (`.github/workflows/deploy.yml`). Vite production build → `dist/` → `actions/deploy-pages`.

Package manager: **npm only**. Node version pinned in `.nvmrc` (24.15.0) — CI uses it via `actions/setup-node` `node-version-file`.

## Commands

- `npm run dev` — Vite dev server with HMR (default port 5173). Type errors are **not** blocking here.
- `npm run build` — `tsc -b` (strict type check across project references) then `vite build`. **This is what CI runs** — any TS error fails the build.
- `npm run lint` — ESLint 9 flat config (`eslint.config.js`). Also runs automatically on every commit via Husky pre-commit hook.
- `npm run preview` — Serve the `dist/` build locally on port 4173 for a production-mode smoke test.

## Git / commit conventions (Jericho standards)

Husky enforces these automatically — don't bypass hooks:

- **`.husky/commit-msg`** rejects any commit whose subject doesn't start with a capitalized infinitive verb (`Add`, `Fix`, `Update`, `Remove`, `Refactor`, `Configure`, etc. — full list in the hook).
- **`.husky/pre-commit`** runs `npm run lint` and blocks the commit if ESLint fails.
- Commit body should explain **why**, not **what** (the diff covers the what). 72-char subject max.
- **Never add `Co-Authored-By: Claude`** lines to commits in this repo — explicit project rule.

Branching: simple flow — feature branches off `main`, PRs target `main`, merge to deploy. No `develop`/`sandbox`/`release/` branches here.

## Architecture

React **19** + TypeScript 5.9 + Vite 7 SPA.

**Routing** — React Router DOM 7 with nested routes in `src/App.tsx`. Main pages (`Home`, `About`, `Portfolio`, `Contact`) share a `Header`/`Footer` layout; `/palette` is an isolated route without layout.

**State** — Redux Toolkit. Theme (dark/light) lives in `src/store/slices/themeSlice.ts`. Always use the typed hooks from `src/store/hooks.ts` (`useAppDispatch`, `useAppSelector`) — never the raw `react-redux` hooks.

**Styling** — Tailwind CSS 3 with **class-based dark mode** (`darkMode: 'class'`). Dark class is toggled on `<html>` by the theme reducer. Custom palette (neon/cyberpunk + portfolio tokens), fonts (Space Mono, Urbanist, Inter, Montserrat, Vast Shadow), and animations (glow, scan, flicker, marquee) are all defined in `tailwind.config.js`.

**i18n** — i18next + `i18next-browser-languagedetector`. Locale JSON in `src/i18n/locales/{en,es}.json`. User-facing text always goes through `useTranslation()` — when adding copy, add keys to **both** locale files.

**3D** — Three.js via `@react-three/fiber` + `@react-three/drei`. Heavy — lazy-load where it materially matters.

**Vite config quirk** (`vite.config.ts`) — a custom plugin forces a full page reload when `tailwind.config.js` changes (Tailwind v3 doesn't HMR config changes on its own). Don't remove this unless you migrate to Tailwind v4.

## Project structure

- `src/components/sections/` — Homepage sections (Hero, Services, WorkExperience, WhyHireMe, ContactForm, SkillsBanner, Testimonials, Blog). Composed in `src/pages/Home.tsx`. **Some are currently commented out in Home.tsx** — that's intentional (disabled, not deleted). If you touch them, keep that convention or wire them back on purposefully.
- `src/components/common/` — Shared UI (Header, Footer, Button, Badge, ThemeToggle, LanguageSelector, SectionTitle).
- `src/pages/` — Route-level components. `Portfolio.tsx` is the canonical portfolio renderer (uses `portfolio.json`'s `personalProjects`/`clientProjects` shape).
- `src/data/*.json` — Content extracted from components (experiences, portfolio, services, blog posts, testimonials, private-repos config). Prefer editing JSON over hard-coding copy in components.
- `src/store/` — RTK store config + slices.
- `src/hooks/` — Cross-component hooks (e.g. `useGitHubRepos` for the GitHub API integration).
- `src/utils/` — `scrollUtils` (smooth scroll to sections from other routes, reads `location.state.scrollTo`), `validationUtils` (email validation), `techConfig` (tech-stack chip mapping).
- `src/i18n/` — i18next setup + locale JSON.

## Import ordering

The GitLab source imposed a grouped-import convention that's still present throughout the codebase. **Keep it when editing:**

```ts
// packages
import { useEffect } from 'react';

// components
import Button from '../components/common/Button';

// utils
import { scrollToSection } from '../utils/scrollUtils';
```

One blank line between groups, no blank lines within a group.

## Env vars

`.env` is gitignored. Variables are Vite-prefixed (`VITE_*`), exposed to the client bundle. See `.env.example`:

- `VITE_GITHUB_TOKEN` — used by `useGitHubRepos` to call the GitHub API (authenticated requests to avoid rate limiting / read private repo metadata).
- `VITE_GITHUB_USERNAME` — target username for the GitHub API calls. Also injected by CI for the production build.

**Do not commit real tokens.** The CI build sets `VITE_GITHUB_USERNAME` from the workflow env; if you ever need a token in the deployed build, add it as a GitHub Actions secret and reference it in `deploy.yml`'s `env:` block — **never paste it into `.env.example`**.

## Deployment notes

- Pages source is configured as **"GitHub Actions"** (not a branch). Changing this via the UI will break deploys.
- The site serves from the repo root (`<username>.github.io` is a user site), so Vite `base` stays `/`. If you ever move to a project site, update `vite.config.ts` `base` to `/<repo-name>/`.
- Every push to `main` triggers a build + deploy. The workflow uses `concurrency: pages` with `cancel-in-progress: false` so rapid pushes queue instead of cancelling each other.

## Known issues / tech debt

- Referenced asset `/bg-pattern.jpg` is not in `public/` — Vite warns at build time but the reference is left in place to resolve at runtime (currently 404s). Add the asset or remove the reference before relying on that background.
- 8 npm audit vulnerabilities (3 moderate, 5 high) from transitive deps in the current lock file. Not blocking CI; address with `npm audit fix` when touching the lockfile intentionally.

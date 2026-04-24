# PR A — Security & Dead-Code Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip the wrong things from the portfolio — client-bundled GitHub PAT, unused Three.js dependencies, the entire Redux/dark-mode infrastructure (only ThemeToggle consumed it), broken-asset references that 404, placeholder Upwork link, wrong WhatsApp number on the Contact page, and a stray `console.log` left in form code.

**Architecture:** Pure removal/cleanup. No new behavior introduced. The one functional change: `useGitHubRepos` switches from authenticated `/user/repos` to unauthenticated `/users/{username}/repos`, which means only public repos are returned (acceptable — the audit-deferred private-repos curated list lives in `private-repos.json`, which is also being emptied in Task 4). Verification per task is via `npm run build`, `npm run lint`, targeted `grep` for absence of removed identifiers, and a manual smoke check that `npm run dev` boots and the homepage renders.

**Tech Stack:** Vite 7, React 19, TypeScript 5.9 strict, Tailwind 3, npm, Husky `pre-commit` (lint) + `commit-msg` (Jericho verb-pattern) hooks.

**Source spec:** `docs/superpowers/specs/2026-04-24-technical-fixes-design.md` §6.

**Note on testing approach:** The project has no test framework installed (no Vitest / RTL / Jest; `package.json` has only `dev`/`build`/`lint`/`preview` scripts). Setting up a test framework is out of scope for this PR. Verification per task uses build/lint/grep/manual-smoke proxies. Do **not** introduce a test framework here; that decision is its own future PR.

---

## Setup

### Step 0.1: Sync local main with origin

- [ ] Run:

```bash
git switch main && git fetch --prune origin && git pull --ff-only
```

Expected: working tree clean, `Already up to date` or a fast-forward, no merge commit.

### Step 0.2: Create the feature branch

- [ ] Run:

```bash
git switch -c fix/security-and-dead-code-removal
```

Expected: `Switched to a new branch 'fix/security-and-dead-code-removal'`.

### Step 0.3: Install deps and confirm baseline is clean

- [ ] Run:

```bash
npm ci && npm run lint && npm run build
```

Expected:
- `npm ci` finishes with `added N packages` and exit 0.
- `npm run lint` produces no error output (silent or just the script preamble).
- `npm run build` ends with `✓ built in N s`.

Do not proceed if any of these fail — fix the baseline first.

---

## Task 1: Remove Three.js dependencies

**Files:**
- Modify: `package.json` (dependencies block)
- Modify: `package-lock.json` (auto)

The deps `three`, `@react-three/fiber`, `@react-three/drei` are installed but not imported anywhere in `src/`. Remove them so they don't lurk in `node_modules` or risk being pulled into the bundle.

### Step 1.1: Confirm zero source usage

- [ ] Run:

```bash
grep -rEn "from\s+['\"](three|@react-three)" src/ || echo "(no matches — safe to remove)"
```

Expected: `(no matches — safe to remove)`. If any match appears, **stop and surface it** — the spec assumed unused; a real consumer means the deletion plan is wrong.

### Step 1.2: Uninstall the three packages

- [ ] Run:

```bash
npm uninstall three @react-three/fiber @react-three/drei
```

Expected: `removed N packages, and audited M packages` with no errors. `package.json` and `package-lock.json` updated.

### Step 1.3: Verify build still passes

- [ ] Run:

```bash
npm run build
```

Expected: `✓ built in N s`. Bundle size in the output should be smaller than the prior build.

### Step 1.4: Commit

- [ ] Run:

```bash
git add package.json package-lock.json
git commit -m "Remove unused Three.js dependencies

The three, @react-three/fiber, and @react-three/drei packages were
installed in the GitLab source repo but no source file imports them in
this codebase. Removing them shrinks the install footprint and
eliminates the risk of accidental bundle inclusion."
```

Expected: pre-commit lint hook passes, commit-msg hook accepts the `Remove` verb, commit recorded.

---

## Task 2: Remove dark-mode infrastructure and Redux

**Files:**
- Delete: `src/components/common/ThemeToggle.tsx`
- Delete: `src/store/slices/themeSlice.ts`
- Delete: `src/store/hooks.ts`
- Delete: `src/store/index.ts`
- Delete: `src/store/` (the directory itself once empty)
- Modify: `src/main.tsx` (remove `Provider` wrap and `store` import)
- Modify: `src/components/common/Header.tsx` (remove `ThemeToggle` import + usage)
- Modify: `tailwind.config.js` (remove `darkMode: 'class'` line)
- Modify: `package.json` (uninstall Redux deps)

`ThemeToggle` was the only Redux consumer (`grep` confirmed earlier). Removing it lets the entire Redux infrastructure go.

### Step 2.1: Delete the Redux store directory and ThemeToggle component

- [ ] Run:

```bash
rm -r src/store src/components/common/ThemeToggle.tsx
```

Expected: files removed.

### Step 2.2: Remove Provider + store wiring from main.tsx

- [ ] Replace the entire contents of `src/main.tsx` with:

```tsx
// packages
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// components
import App from "./App.tsx";

// i18n
import "./i18n";

// styles
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

(Removes the `Provider` import, the `store` import, and the `<Provider>` wrap. Keeps StrictMode, i18n, styles.)

### Step 2.3: Remove ThemeToggle from Header.tsx

- [ ] Open `src/components/common/Header.tsx`. Find the `import ThemeToggle from "./ThemeToggle";` line (or similar) and delete it. Find every `<ThemeToggle />` JSX usage and delete those lines. Save.

- [ ] Verify with:

```bash
grep -n "ThemeToggle" src/components/common/Header.tsx || echo "(clean)"
```

Expected: `(clean)`.

### Step 2.4: Remove darkMode setting from Tailwind config

- [ ] In `tailwind.config.js`, delete this line (currently line 52):

```js
  darkMode: 'class',
```

Save. Confirm:

```bash
grep -n "darkMode" tailwind.config.js || echo "(clean)"
```

Expected: `(clean)`.

> Note: leave the dark/light color tokens in the `COLORS` constant alone — they may still be referenced by light-mode classes throughout the codebase, and pruning them is a wider refactor that belongs in the design overhaul, not here.

### Step 2.5: Uninstall Redux dependencies

- [ ] Run:

```bash
npm uninstall @reduxjs/toolkit react-redux @types/react-redux
```

Expected: `removed N packages` with no errors.

### Step 2.6: Confirm no Redux references remain in source

- [ ] Run:

```bash
grep -rEn "useAppDispatch|useAppSelector|@reduxjs/toolkit|from ['\"]react-redux['\"]|from ['\"]\\./store['\"]|from ['\"]\\.\\./store" src/ || echo "(no matches — clean)"
```

Expected: `(no matches — clean)`. If any matches, address them before proceeding.

### Step 2.7: Lint, build, smoke

- [ ] Run:

```bash
npm run lint && npm run build
```

Expected: both succeed.

- [ ] Manual smoke (optional but recommended):

```bash
npm run dev
```

Open http://localhost:5173/ in a browser. Confirm the homepage renders without console errors. Stop the dev server.

### Step 2.8: Commit

- [ ] Run:

```bash
git add -A
git commit -m "Remove dark-mode toggle and the entire Redux layer

ThemeToggle was the only consumer of the Redux store, and the homepage
sections never had dark: variants in the first place — the toggle did
nothing visible. Per the technical-fixes spec the site stays in the
existing light design, so the entire infrastructure (themeSlice, store,
hooks, Provider, ThemeToggle, darkMode: class in Tailwind, plus the
@reduxjs/toolkit, react-redux, and @types/react-redux deps) goes."
```

Expected: hooks pass, commit recorded.

---

## Task 3: Strip the GitHub PAT from the client bundle

**Files:**
- Modify: `src/hooks/useGitHubRepos.ts`
- Modify: `.env.example`

`VITE_GITHUB_TOKEN` is bundled into the client JS by Vite (any `VITE_*` var ships to the browser). The hook currently calls the **authenticated** `/user/repos` endpoint, which won't work without auth. Switch to the **public** `/users/{username}/repos` endpoint and drop the Authorization header.

### Step 3.1: Replace `useGitHubRepos.ts`

- [ ] Replace the entire contents of `src/hooks/useGitHubRepos.ts` with:

```ts
// packages
import { useState, useEffect } from 'react';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  private: boolean;
  lastCommitSha: string | null;
}

interface UseGitHubReposResult {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

// No Authorization header anywhere in this file: the hook ships to a
// static GitHub Pages site, so any token would leak to every visitor.
// Trade-off: GitHub limits unauthenticated requests to 60/hr per visitor IP,
// and only public repositories are returned.
const fetchLastCommitSha = async (fullName: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${fullName}/commits?per_page=1`,
      { headers: { Accept: 'application/vnd.github.v3+json' } },
    );
    if (!response.ok) return null;
    const [commit] = await response.json();
    return commit?.sha ?? null;
  } catch {
    return null;
  }
};

const useGitHubRepos = (): UseGitHubReposResult => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const username = import.meta.env.VITE_GITHUB_USERNAME;
        if (!username) {
          throw new Error('VITE_GITHUB_USERNAME is not configured');
        }

        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          { headers: { Accept: 'application/vnd.github.v3+json' } },
        );

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const data: Omit<GitHubRepo, 'lastCommitSha'>[] = await response.json();

        const commitShas = await Promise.all(
          data.map((repo) => fetchLastCommitSha(repo.full_name)),
        );

        setRepos(data.map((repo, i) => ({ ...repo, lastCommitSha: commitShas[i] })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
};

export default useGitHubRepos;
```

> Note: if the original file's exported return statement was different (e.g. wrapped or named differently), adapt the final `return { repos, loading, error };` and `export default` to match the existing call sites. Confirm with `grep -rn "useGitHubRepos" src/` first.

### Step 3.2: Remove the token from `.env.example`

- [ ] Replace the entire contents of `.env.example` with:

```
VITE_GITHUB_USERNAME=jorius
```

(`VITE_GITHUB_TOKEN` line removed.)

### Step 3.3: Confirm no other references to `VITE_GITHUB_TOKEN` remain

- [ ] Run:

```bash
grep -rn "VITE_GITHUB_TOKEN" src/ .env.example 2>/dev/null || echo "(clean)"
```

Expected: `(clean)`.

> The user's local `.env` file may still contain `VITE_GITHUB_TOKEN=...`; that's fine and gitignored. The user is responsible for rotating the leaked token outside this PR.

### Step 3.4: Lint and build

- [ ] Run:

```bash
npm run lint && npm run build
```

Expected: both succeed.

### Step 3.5: Manual smoke check the GitHub feature

- [ ] Run `npm run dev`. Open http://localhost:5173/portfolio in a browser. Confirm public repos load (or, if rate-limited, a clean error message renders — not a 401 from a stale token). Stop the dev server.

### Step 3.6: Commit

- [ ] Run:

```bash
git add src/hooks/useGitHubRepos.ts .env.example
git commit -m "Remove GitHub PAT from the client bundle

VITE_* env vars are bundled into client JS by Vite, so VITE_GITHUB_TOKEN
was readable by any visitor via DevTools. Drop the Authorization header,
switch from the authenticated /user/repos endpoint to the public
/users/{username}/repos endpoint, and remove the token from .env.example.

Trade-off accepted: only public repositories are returned and the GitHub
API rate-limits unauthenticated calls to 60/hr per visitor IP — fine for
a portfolio site. The leaked token must be rotated by the repo owner
outside this PR."
```

Expected: hooks pass, commit recorded.

---

## Task 4: Remove broken asset references

**Files:**
- Modify: `src/data/testimonials.json`
- Modify: `src/data/blog-posts.json`
- Modify: `src/data/private-repos.json`
- Modify: `src/components/sections/ServicesSection.tsx` (line 34)
- Modify: `src/components/sections/TestimonialsSection.tsx` (line 13)

The avatar/blog images don't exist on disk and the placeholder content is fake (lorem testimonials, "Jayesh Patil" blog posts, `example-private-repo`). Empty the arrays so 404s stop and the now-empty sections (already commented out of Home in the prior PR for Blog/Testimonials, plus the unused private-repos curated list) render nothing instead of broken images. The `bg-pattern.jpg` reference in two section components also goes.

### Step 4.1: Empty `testimonials.json`

- [ ] Replace the entire contents of `src/data/testimonials.json` with:

```json
[]
```

### Step 4.2: Empty `blog-posts.json`

- [ ] Replace the entire contents of `src/data/blog-posts.json` with:

```json
[]
```

### Step 4.3: Empty `private-repos.json`

- [ ] Replace the entire contents of `src/data/private-repos.json` with:

```json
[]
```

### Step 4.4: Remove the bg-pattern div from `ServicesSection.tsx`

- [ ] In `src/components/sections/ServicesSection.tsx`, find these two lines (around line 33-34):

```tsx
      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('/bg-pattern.jpg')] bg-cover bg-center" />
```

Delete both lines. Save.

### Step 4.5: Remove the bg-pattern div from `TestimonialsSection.tsx`

- [ ] In `src/components/sections/TestimonialsSection.tsx`, find these two lines (around line 12-13):

```tsx
      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('/bg-pattern.jpg')] bg-cover bg-center" />
```

Delete both lines. Save.

### Step 4.6: Confirm no remaining references

- [ ] Run:

```bash
grep -rn "bg-pattern\.jpg\|/avatar[0-9]\.jpg\|/images/blog[0-9]\.jpg\|example-private-repo" src/ public/ 2>/dev/null || echo "(clean)"
```

Expected: `(clean)`.

### Step 4.7: Lint and build

- [ ] Run:

```bash
npm run lint && npm run build
```

Expected: both succeed. The Vite build's earlier "didn't resolve at build time" warning for `/bg-pattern.jpg` should be gone.

### Step 4.8: Commit

- [ ] Run:

```bash
git add src/data/ src/components/sections/ServicesSection.tsx src/components/sections/TestimonialsSection.tsx
git commit -m "Remove broken asset references and placeholder data

The /avatar*.jpg, /images/blog*.jpg, and /bg-pattern.jpg files were
referenced but never present in public/, so the site shipped 404s on
every page load. Lorem-ipsum testimonials, fictional blog posts
attributed to Jayesh Patil, and the example-private-repo stub are also
gone — the relevant sections (Testimonials, Blog) are already disabled
on the Home page, and the curated private-repos list will be repopulated
with real content during the design overhaul pass."
```

Expected: hooks pass, commit recorded.

---

## Task 5: Link, label, and console.log fixes

**Files:**
- Modify: `src/components/common/Header.tsx` (Upwork anchor block ~lines 102-109)
- Modify: `src/pages/Contact.tsx` (lines 18, 128-129, 130-138)

### Step 5.1: Remove the placeholder Upwork anchor in Header.tsx

- [ ] In `src/components/common/Header.tsx`, find this anchor block (around lines 102-109):

```tsx
          <a
            href="https://www.upwork.com/freelancers/~yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColorClass} ${hoverClass} p-2 rounded transition-all`}
          >
            <SiUpwork className="w-5 h-5" />
          </a>
```

Delete the entire anchor block (the `<a>...</a>` and its contents). Then in the imports at the top of the file, remove `SiUpwork` from the `react-icons/si` import (or the entire line if it was the only one). Save.

- [ ] Verify the import is gone:

```bash
grep -n "SiUpwork\|upwork" src/components/common/Header.tsx || echo "(clean)"
```

Expected: `(clean)`.

### Step 5.2: Fix the WhatsApp link on Contact.tsx and remove the TODO

- [ ] In `src/pages/Contact.tsx`, find lines around 130-132:

```tsx
              {/* TODO: Replace placeholder phone number with real WhatsApp number */}
              <a
                href="https://wa.me/1234567890"
```

Replace with:

```tsx
              <a
                href="https://wa.me/573013930289"
```

(Removes the TODO comment line, swaps the placeholder number for the real one. The phone-number-via-env-var consolidation comes in PR C.9.)

### Step 5.3: Remove the console.log from the Contact form submit handler

- [ ] In `src/pages/Contact.tsx`, find this block (around lines 16-20):

```tsx
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement a feature to send emails
  };
```

Replace with:

```tsx
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is intentionally a no-op for now.
    // The form is being disabled in PR C pending a backend decision
    // (Resend + serverless function vs. third-party form service).
  };
```

(Removes the `console.log` and the bare `TODO`; replaces with a comment that points forward to PR C so a future reader knows the no-op is intentional.)

### Step 5.4: Confirm no remaining console/debug noise in this file

- [ ] Run:

```bash
grep -n "console\.\|debugger\|alert(" src/pages/Contact.tsx || echo "(clean)"
```

Expected: `(clean)`.

### Step 5.5: Lint and build

- [ ] Run:

```bash
npm run lint && npm run build
```

Expected: both succeed.

### Step 5.6: Commit

- [ ] Run:

```bash
git add src/components/common/Header.tsx src/pages/Contact.tsx
git commit -m "Fix placeholder Upwork link, wrong WhatsApp number, and stray console.log

Remove the Header's Upwork anchor that pointed to the
~yourprofile template stub; correct the Contact page WhatsApp link
from the placeholder 1234567890 to Jose's real number 573013930289
(matching the one already in Header); strip the console.log left in
the Contact form submit handler and replace the bare TODO with a
forward-pointing comment to PR C, where the form is being disabled
pending the email-backend decision."
```

Expected: hooks pass, commit recorded.

---

## Task 6: Update CLAUDE.md to reflect the removals

**Files:**
- Modify: `CLAUDE.md`

The repo's CLAUDE.md (written immediately after the rewrite landed) still describes Redux, dark mode, and Three.js as part of the architecture. Bring it in line with reality.

### Step 6.1: Edit the CLAUDE.md "Architecture" section

- [ ] In `CLAUDE.md`, find the **State** subsection (under "## Architecture"):

```md
**State** — Redux Toolkit. Theme (dark/light) lives in `src/store/slices/themeSlice.ts`. Always use the typed hooks from `src/store/hooks.ts` (`useAppDispatch`, `useAppSelector`) — never the raw `react-redux` hooks.
```

Replace with:

```md
**State** — No global state library. Per-component `useState` and i18next for locale. (A previous Redux + dark-mode toggle was removed in `fix/security-and-dead-code-removal` because the site is light-mode only.)
```

### Step 6.2: Update the Styling subsection's dark mode mention

- [ ] In `CLAUDE.md`, find the **Styling** subsection:

```md
**Styling** — Tailwind CSS 3 with **class-based dark mode** (`darkMode: 'class'`). Dark class is toggled on `<html>` by the theme reducer. Custom palette (neon/cyberpunk + portfolio tokens), fonts (Space Mono, Urbanist, Inter, Montserrat, Vast Shadow), and animations (glow, scan, flicker, marquee) are all defined in `tailwind.config.js`.
```

Replace with:

```md
**Styling** — Tailwind CSS 3, light theme only. Custom palette (neon/cyberpunk + portfolio tokens — some legacy dark-theme tokens remain in `tailwind.config.js`'s `COLORS` constant pending the design overhaul), fonts (Space Mono, Urbanist, Inter, Montserrat, Vast Shadow), and animations (glow, scan, flicker, marquee) all defined in `tailwind.config.js`.
```

### Step 6.3: Remove the 3D / Three.js subsection

- [ ] In `CLAUDE.md`, find this subsection:

```md
**3D** — Three.js via `@react-three/fiber` + `@react-three/drei`. Heavy — lazy-load where it materially matters.
```

Delete it entirely (including the leading blank line, leave one blank line between neighbors).

### Step 6.4: Update the Env vars section

- [ ] In `CLAUDE.md`, find the bullet about `VITE_GITHUB_TOKEN`:

```md
- `VITE_GITHUB_TOKEN` — used by `useGitHubRepos` to call the GitHub API (authenticated requests to avoid rate limiting / read private repo metadata).
```

Delete that bullet entirely. Update the `VITE_GITHUB_USERNAME` bullet from:

```md
- `VITE_GITHUB_USERNAME` — target username for the GitHub API calls. Also injected by CI for the production build.
```

to:

```md
- `VITE_GITHUB_USERNAME` — target username for the GitHub API calls (called unauthenticated via `/users/{username}/repos`; rate-limited to 60/hr per visitor IP). Also injected by CI for the production build.
```

Then update the warning paragraph below the bullets — find:

```md
**Do not commit real tokens.** The CI build sets `VITE_GITHUB_USERNAME` from the workflow env; if you ever need a token in the deployed build, add it as a GitHub Actions secret and reference it in `deploy.yml`'s `env:` block — **never paste it into `.env.example`**.
```

Replace with:

```md
**No client-side tokens.** Anything prefixed `VITE_` is bundled into the browser JS by Vite, so it cannot hold a secret. The portfolio is intentionally token-free; if a token-bearing GitHub call ever becomes necessary, route it through a serverless backend rather than re-introducing a client-side env var.
```

### Step 6.5: Lint and build

- [ ] Run:

```bash
npm run lint && npm run build
```

Expected: both succeed.

### Step 6.6: Commit

- [ ] Run:

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md to match the post-cleanup architecture

Drop the Redux/dark-mode and Three.js descriptions, reword the
GitHub-API env var section to reflect the new unauthenticated call
path, and rewrite the secrets warning to make the no-VITE-secrets
rule explicit so a future contributor doesn't accidentally re-add a
client-side token."
```

Expected: hooks pass, commit recorded.

---

## Wrap-up

### Step W.1: Final full build + lint check

- [ ] Run:

```bash
npm run lint && npm run build
```

Expected: both succeed. Note the `dist/` size — should be smaller than the pre-PR baseline (no Three.js, no Redux deps in the bundle).

### Step W.2: Final smoke test

- [ ] Run `npm run dev`. In the browser:
  - Open http://localhost:5173/ — homepage renders without console errors.
  - Open DevTools Network tab, reload — no 404s for `/avatar*.jpg`, `/images/blog*.jpg`, or `/bg-pattern.jpg`.
  - Open DevTools Sources tab, search for `ghp_` and `VITE_GITHUB_TOKEN` — no matches in any chunk.
  - Click through to /portfolio — public repos load (or graceful error if rate-limited).
  - Click through to /contact — WhatsApp link points to `wa.me/573013930289` (right-click → inspect).
  - Header shows no Upwork icon.

Stop the dev server.

### Step W.3: Push the branch

- [ ] Run:

```bash
git push -u origin fix/security-and-dead-code-removal
```

Expected: `* [new branch] fix/security-and-dead-code-removal -> fix/security-and-dead-code-removal`.

### Step W.4: Open the PR

- [ ] Run:

```bash
gh pr create --base main --head fix/security-and-dead-code-removal --title "Strip secrets, dead code, and broken asset references" --body "$(cat <<'EOF'
## Summary

PR A from the technical-fixes spec (`docs/superpowers/specs/2026-04-24-technical-fixes-design.md` §6).

- Drop the GitHub PAT from the client bundle. Switch `useGitHubRepos` to the public `/users/{username}/repos` endpoint with no Authorization header. Trade-off: only public repos returned, 60 req/hr per visitor IP.
- Remove unused Three.js deps (`three`, `@react-three/fiber`, `@react-three/drei`).
- Rip out the entire Redux layer + dark-mode toggle (ThemeToggle was the only consumer; Home sections never had `dark:` variants).
- Empty placeholder JSON arrays (testimonials, blog-posts, private-repos) so the site stops shipping lorem ipsum and 404 image references.
- Drop the `bg-pattern.jpg` background-image div from Services and Testimonials sections.
- Remove the placeholder Upwork link from Header.
- Fix the wrong WhatsApp number on the Contact page (was 1234567890, now 573013930289 matching Header).
- Remove `console.log` from the Contact form submit handler; replace the bare TODO with a forward-pointing comment to PR C.
- Update CLAUDE.md to reflect all of the above.

## Out of scope (intentionally)

- Email backend / contact form wiring (deferred — see PR C).
- Real content for portfolio/testimonials/blog (deferred — design overhaul).
- Mobile responsiveness, i18n key gaps (PR B).
- SEO / favicon / 404 page (PR C).
- Test framework setup (its own future PR).

## Test plan

- [x] `npm run lint` clean.
- [x] `npm run build` succeeds.
- [x] Dev server boots; homepage renders without console errors.
- [x] DevTools Network: no 404s on first paint.
- [x] DevTools Sources: no `ghp_` or `VITE_GITHUB_TOKEN` strings in any chunk.
- [x] /portfolio renders with the unauthenticated repo list.
- [x] /contact WhatsApp link points to the real number.
- [x] Header no longer renders an Upwork icon.
- [ ] After merge: `Deploy to GitHub Pages` workflow runs green and https://jorius.github.io/ still serves the site without regressions.

## Owner action item

Rotate the leaked GitHub PAT (`ghp_…`) outside this PR.
EOF
)"
```

Expected: PR URL printed. Capture it for the owner.

### Step W.5: Wait for review/merge before starting PR B

- [ ] User reviews and merges PR A. After merge, the next plan (`docs/superpowers/plans/2026-04-25-pr-b-responsive-and-i18n.md`, to be written separately) covers PR B.

---

## Self-review checklist (run before handing the plan over)

- [ ] **Spec coverage:** every numbered item in spec §6 (A.1–A.5) maps to a Task here. ✓
- [ ] **Placeholder scan:** no "TBD", no "implement later", no "similar to Task N", no vague "add error handling" — every code change is shown verbatim. ✓
- [ ] **Type consistency:** `useGitHubRepos` keeps the same exported shape (`{ repos, loading, error }`, `GitHubRepo` interface). ✓
- [ ] **Verification approach is consistent across tasks** (build + lint + targeted grep, plus a manual smoke at the end). ✓
- [ ] **Each commit message** starts with a Jericho-approved verb (`Remove`, `Update`, `Fix`) and contains no `Co-Authored-By: Claude` line. ✓

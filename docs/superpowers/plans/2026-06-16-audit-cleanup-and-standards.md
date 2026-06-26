# Audit Cleanup & Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all dead/commented code, lock package versions to exact installs, enforce strict TypeScript types on every component, unify the three divergent scroll-navigation implementations into one hook, and fix all identified KISS violations.

**Architecture:** Eight self-contained tasks that progress from pure deletion (safest, no regressions) to structural refactors (navigation hook, typing pass) to cosmetic fixes. Each task builds on the previous and ends with a passing build + commit. The navigation overhaul replaces `scrollUtils.ts` and the four copy-pasted handler blocks in `Header.tsx` with a single `useScrollToSection` hook — the same `[data-jump]` mechanism already used correctly by `BTopBar.tsx`.

**Tech Stack:** React 19, TypeScript 5.9 (strict), Vite 7, React Router 7, i18next, Tailwind CSS 3, `npm run build` as the CI gate.

---

## Feature Status (locked in for this branch)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | **Production** | DirectionB — fully complete |
| `/writing/:slug` | **Production** | Reader, category tree, lightbox — fully complete |
| `/pgp` | **Production** | PGP key display — fully complete |
| `*` (404) | **Production** | Glitch 404 — fully complete |
| `/portfolio` | **Legacy / functional** | Works (GitHub API + cards). Old design. Scheduled for redesign. |
| `/about` | **Legacy / WIP stub** | Placeholder content, empty cats array. Old design. Scheduled for redesign. |
| `/contact` | **Legacy / WIP** | Dead form (no backend). Old design. Non-functional intentionally. |
| `/palette` | **Dev-only** | Color reference, not in any user nav. |

---

## File Map

**Delete:**
- `src/components/common/Badge.tsx` — never imported
- `src/components/common/SectionTitle.tsx` — never imported
- `src/utils/validationUtils.ts` — `validateEmail` never called
- `src/utils/scrollUtils.ts` — uses `getElementById`; broken for direction-b; replaced by hook
- `src/data/blog-posts.json` — superseded by `src/content/writing/posts/*.json` glob
- `src/data/experiences.json` — superseded by `JORIUS.experience` in `jorius.ts`
- `src/data/services.json` — superseded by `src/content/work.json`
- `src/data/testimonials.json` — never imported; `JORIUS.testimonials` is empty
- `src/components/direction-b/BProjects.tsx` — fully commented out in DirectionB, user-confirmed for removal

**Create:**
- `src/hooks/useNavigation.ts` — unified "scroll-if-home, navigate-with-state-if-away" hook

**Modify:**
- `package.json` — remove all `^` / `~` version ranges; pin to exact installed versions
- `src/data/jorius.ts` — remove `oss` field (empty, never read) and `OssEntry` interface
- `src/components/direction-b/DirectionB.tsx` — remove commented `import` + `<BProjects />` JSX
- `src/pages/About.tsx` — remove `catImages` dead array and its render block; add explicit return type
- `src/pages/Contact.tsx` — strip no-op `useState`/`handleSubmit`/`handleChange`; disable form inputs; add return type
- `src/pages/Portfolio.tsx` — add explicit return type (TechChip and StackChip confirmed different — keep both)
- `src/pages/Palette.tsx` — extract `ColorCard` to module scope; add explicit return types
- `src/components/common/Button.tsx` — convert `React.FC` to plain function; add `type="button"` to `<button>`; add return type
- `src/components/common/LanguageSelector.tsx` — add explicit return type
- `src/components/common/Header.tsx` — replace 4× copy-pasted handlers with single `handleNavClick`; use `useScrollToSection` hook; fix section IDs to direction-b `[data-jump]` targets
- `src/components/common/Footer.tsx` — replace `scrollToSection` import with `useScrollToSection` hook; add return type
- `src/components/direction-b/BTopBar.tsx` — replace inline scroll call with `useScrollToSection` hook
- `src/components/direction-b/BOssWriting.tsx` — wrap `loadPosts()` in `useMemo`
- `src/components/primitives/Reveal.tsx` — replace `extraProps` object with direct prop spreading
- `src/hooks/useInView.ts` — remove `options` from `useEffect` dependency array; hold via `useRef`

---

## Task 1: Delete all dead files

**Files:**
- Delete: `src/components/common/Badge.tsx`
- Delete: `src/components/common/SectionTitle.tsx`
- Delete: `src/utils/validationUtils.ts`
- Delete: `src/data/blog-posts.json`
- Delete: `src/data/experiences.json`
- Delete: `src/data/services.json`
- Delete: `src/data/testimonials.json`
- Delete: `src/components/direction-b/BProjects.tsx`

- [ ] **Step 1: Delete the files**

```bash
rm src/components/common/Badge.tsx
rm src/components/common/SectionTitle.tsx
rm src/utils/validationUtils.ts
rm src/data/blog-posts.json
rm src/data/experiences.json
rm src/data/services.json
rm src/data/testimonials.json
rm src/components/direction-b/BProjects.tsx
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: exit 0, no TypeScript errors. If any errors appear they will be `Cannot find module` errors — search for the removed file name across `src/` to find any hidden import.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Remove unused components, utils, and orphaned data files"
```

---

## Task 2: Remove commented-out and dead inline code

**Files:**
- Modify: `src/components/direction-b/DirectionB.tsx`
- Modify: `src/pages/About.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/data/jorius.ts`

- [ ] **Step 1: Clean `DirectionB.tsx` — remove BProjects import comment and JSX comment**

Open `src/components/direction-b/DirectionB.tsx`. Remove line 18 and line 64:

```tsx
// packages
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// components
import { CommandPalette } from '../CommandPalette';
import { PALETTE_SECTIONS } from './paletteSections';
import { DarkGrain } from '../primitives/DarkGrain';
import { ScanLines } from '../primitives/ScanLines';
import { BContact } from './BContact';
import { BExperience } from './BExperience';
import { BHero } from './BHero';
import { BNow } from './BNow';
import { BOssWriting } from './BOssWriting';
import { BServices } from './BServices';
import { BTopBar } from './BTopBar';
import { BWhy } from './BWhy';

export const DirectionB = (): React.ReactElement => {
  const { t } = useBTheme();
  const location = useLocation();

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    window.history.replaceState({}, '');
    let attempts = 0;
    const tryScroll = (): void => {
      const el = document.querySelector(`[data-jump="${target}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts < 12) {
        attempts += 1;
        window.setTimeout(tryScroll, 80);
      }
    };
    window.setTimeout(tryScroll, 60);
  }, [location]);

  return (
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        width: '100%',
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <BTopBar />
      <BHero />
      <BNow />
      <BServices />
      <BExperience />
      <BOssWriting />
      <BWhy />
      <BContact />
      <ScanLines />
      <DarkGrain />
      <CommandPalette sections={PALETTE_SECTIONS} />
    </div>
  );
};
```

- [ ] **Step 2: Clean `About.tsx` — remove catImages array and the cat images grid**

Replace the entire file with:

```tsx
// packages
import { useTranslation } from 'react-i18next';

const About = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dark-bg text-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-12 neon-text">
          {t('about.title')}
        </h1>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Personal Section */}
          <div className="cyber-card">
            <h2 className="text-3xl font-bold mb-6 text-neon-pink">
              {t('about.personal.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {t('about.personal.description')}
            </p>
          </div>

          {/* Professional Section */}
          <div className="cyber-card">
            <h2 className="text-3xl font-bold mb-6 text-neon-cyan">
              {t('about.professional.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t('about.professional.description')}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border-l-4 border-neon-purple pl-4">
                <h3 className="text-xl font-bold text-neon-purple mb-2">Skills</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• Full-Stack Development</li>
                  <li>• Cybersecurity</li>
                  <li>• Cloud Architecture</li>
                  <li>• DevOps &amp; CI/CD</li>
                </ul>
              </div>
              <div className="border-l-4 border-neon-blue pl-4">
                <h3 className="text-xl font-bold text-neon-blue mb-2">Interests</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• Open Source</li>
                  <li>• Security Research</li>
                  <li>• System Design</li>
                  <li>• AI &amp; Machine Learning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
```

- [ ] **Step 3: Clean `Contact.tsx` — strip dead form state, disable form**

Replace the entire file with the version below. All `useState`/`handleSubmit`/`handleChange` machinery is removed. Form inputs carry `disabled` so the UI communicates non-functionality without misleading the user.

```tsx
// packages
import { AiOutlineSend } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Contact = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dark-bg text-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-16 neon-text">
          {t('contact.title')}
        </h1>

        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12">
          {/* Contact Form — backend pending */}
          <div className="cyber-card opacity-60">
            <form className="space-y-6">
              <div>
                <label htmlFor="from" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.from')}
                </label>
                <input
                  type="email"
                  id="from"
                  name="from"
                  disabled
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono outline-none cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  disabled
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono outline-none cursor-not-allowed"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.category')}
                </label>
                <select
                  id="category"
                  name="category"
                  disabled
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono outline-none cursor-not-allowed"
                >
                  <option value="">Select a category</option>
                  <option value="general">General Inquiry</option>
                  <option value="project">Project Collaboration</option>
                  <option value="job">Job Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.body')}
                </label>
                <textarea
                  id="body"
                  name="body"
                  disabled
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono outline-none resize-none cursor-not-allowed"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled
                className="w-full px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold uppercase tracking-wider border-2 border-neon-pink flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
              >
                <AiOutlineSend className="w-5 h-5" />
                {t('contact.form.send')}
              </button>
            </form>
          </div>

          {/* WhatsApp Section */}
          <div className="flex flex-col justify-center">
            <div className="cyber-card text-center">
              <div className="mb-6">
                <FaWhatsapp className="w-24 h-24 mx-auto text-neon-green" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">
                {t('contact.whatsapp')}
              </h2>
              <p className="text-gray-400 mb-6">
                Prefer to chat directly? Reach me on WhatsApp for quick responses!
              </p>
              <a
                href="https://wa.me/573013930289"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-dark-bg font-bold uppercase tracking-wider border-2 border-neon-green hover:scale-105 transition-transform duration-300"
              >
                Open WhatsApp
              </a>
            </div>

            <div className="cyber-card mt-6">
              <h3 className="text-xl font-bold mb-4 text-neon-pink">Quick Info</h3>
              <div className="space-y-3 text-gray-400 font-mono text-sm">
                <p>📧 Email response: 24-48 hours</p>
                <p>💬 WhatsApp: Usually instant</p>
                <p>🌍 Timezone: UTC-5</p>
                <p>⏰ Available: Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
```

- [ ] **Step 4: Clean `jorius.ts` — remove `oss` field and `OssEntry` interface**

In `src/data/jorius.ts`:
1. Delete the `OssEntry` interface (lines 21–26):
```ts
export interface OssEntry {
  repo: string;
  stars: number;
  lang: string;
  desc: string;
}
```
2. Remove `oss: OssEntry[];` from the `JoriusData` interface.
3. Remove the `oss: [...]` block from the `JORIUS` constant (lines 145–149 in the original):
```ts
  oss: [
    // Legacy fallback list — BOssWriting now hydrates from the GitHub API via
    // useGitHubRepos. Kept here as a safety net if the API is rate-limited or
    // offline; harmless empty array means the section just shows a loader/error.
  ],
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Remove commented-out code, dead form state, and unused JORIUS.oss field"
```

---

## Task 3: Lock all package versions to exact installs

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace every `^` / `~` with exact installed versions**

`npm ls --depth=0` reports the following installed versions. Replace `package.json`'s `dependencies` and `devDependencies` blocks with these exact pins:

```json
{
  "dependencies": {
    "i18next": "25.8.0",
    "i18next-browser-languagedetector": "8.2.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-i18next": "16.5.4",
    "react-icons": "5.5.0",
    "react-markdown": "10.1.0",
    "react-router-dom": "7.13.0",
    "remark-gfm": "4.0.1"
  },
  "devDependencies": {
    "@eslint/js": "9.39.2",
    "@types/node": "24.10.9",
    "@types/react": "19.2.10",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "5.1.2",
    "autoprefixer": "10.4.23",
    "eslint": "9.39.2",
    "eslint-plugin-react-hooks": "7.0.1",
    "eslint-plugin-react-refresh": "0.4.26",
    "globals": "16.5.0",
    "husky": "9.1.7",
    "postcss": "8.5.6",
    "tailwindcss": "3.4.19",
    "typescript": "5.9.3",
    "typescript-eslint": "8.54.0",
    "vite": "7.3.1"
  }
}
```

- [ ] **Step 2: Verify install still resolves cleanly**

```bash
npm install
```
Expected: no changes, `package-lock.json` should show no diff on the resolved versions (they're already installed).

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "Lock all npm dependencies to exact installed versions"
```

---

## Task 4: Strong typing pass — explicit return types and remove React.FC

**Files:**
- Modify: `src/pages/About.tsx` (already done in Task 2 — return type added)
- Modify: `src/pages/Contact.tsx` (already done in Task 2 — return type added)
- Modify: `src/pages/Portfolio.tsx`
- Modify: `src/pages/Palette.tsx`
- Modify: `src/components/common/Button.tsx`
- Modify: `src/components/common/LanguageSelector.tsx`
- Modify: `src/components/common/Header.tsx`
- Modify: `src/components/common/Footer.tsx`

**Context:** `tsconfig.app.json` already has `"strict": true`. The `@types/react` package provides the global `React` namespace, so `React.ReactElement` is available as a return type annotation without a named import — consistent with the existing direction-b codebase.

- [ ] **Step 1: `Portfolio.tsx` — add return type to all component functions**

Three sub-components inside the file need return types. The page component also needs one.

Change:
```tsx
const TechChip = ({ name }: { name: string }) => {
```
To:
```tsx
const TechChip = ({ name }: { name: string }): React.ReactElement => {
```

Change:
```tsx
const RepoCard = ({ repo }: { repo: GitHubRepo }) => {
```
To:
```tsx
const RepoCard = ({ repo }: { repo: GitHubRepo }): React.ReactElement => {
```

Change:
```tsx
const PrivateConfigCard = ({ repo }: { repo: PrivateRepoConfig }) => (
```
To:
```tsx
const PrivateConfigCard = ({ repo }: { repo: PrivateRepoConfig }): React.ReactElement => (
```

Change:
```tsx
const ClientCard = ({ project }: { project: ClientProject }) => (
```
To:
```tsx
const ClientCard = ({ project }: { project: ClientProject }): React.ReactElement => (
```

Change:
```tsx
const Portfolio = () => {
```
To:
```tsx
const Portfolio = (): React.ReactElement => {
```

- [ ] **Step 2: `Palette.tsx` — move `ColorCard` to module scope and add return types**

Replace the entire `Palette.tsx` content with:

```tsx
interface ColorEntry {
  name: string;
  code: string;
  hex: string;
}

const DARK_THEME_COLORS: ColorEntry[] = [
  { name: 'Midnight Blue', code: 'MB', hex: '#001427' },
  { name: 'Deep Navy', code: 'DN', hex: '#1A1F3A' },
  { name: 'Slate Blue', code: 'SB', hex: '#2D3561' },
  { name: 'Electric Cyan', code: 'EC', hex: '#7BDFF2' },
  { name: 'Purple Haze', code: 'PH', hex: '#6A66A3' },
  { name: 'Lavender Mist', code: 'LM', hex: '#C3ACCE' },
  { name: 'Warm Sand', code: 'WS', hex: '#EAD2AC' },
  { name: 'Hot Pink', code: 'HP', hex: '#FF006E' },
  { name: 'Neon Magenta', code: 'NM', hex: '#FF1B8D' },
  { name: 'Bright Blue', code: 'BB', hex: '#3A86FF' },
  { name: 'Electric Green', code: 'EG', hex: '#06FFA5' },
  { name: 'Cyber Yellow', code: 'CY', hex: '#FFBE0B' },
  { name: 'Cyan Glow', code: 'CG', hex: '#00F5FF' },
];

const LIGHT_THEME_COLORS: ColorEntry[] = [
  { name: 'Light Gray', code: 'LG', hex: '#EBE9E9' },
  { name: 'Pure White', code: 'PW', hex: '#FFFFFF' },
  { name: 'Silver Gray', code: 'SG', hex: '#BBBBBF' },
  { name: 'Almost Black', code: 'AB', hex: '#020100' },
  { name: 'Ocean Blue', code: 'OB', hex: '#0E79B2' },
  { name: 'Deep Purple', code: 'DP', hex: '#592E83' },
];

const LIGHT_HEX = new Set(['#FFFFFF', '#EBE9E9', '#BBBBBF']);

const ColorCard = ({ name, code, hex }: ColorEntry): React.ReactElement => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <div
      className="h-32 flex items-center justify-center relative"
      style={{ backgroundColor: hex }}
    >
      <div className={`absolute inset-0 flex items-center justify-center ${LIGHT_HEX.has(hex) ? 'text-gray-800' : 'text-white'} font-mono text-sm opacity-0 hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm`}>
        {hex}
      </div>
    </div>
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-900">{name}</h3>
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-bold text-gray-700">{code}</span>
      </div>
      <p className="text-xs font-mono text-gray-600">{hex}</p>
    </div>
  </div>
);

const Palette = (): React.ReactElement => (
  <div className="min-h-screen bg-gray-50">
    <div className="w-full px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 text-gray-900 font-mono">jorius.me</h1>
          <p className="text-xl text-gray-600">Color Palette Reference</p>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Dark Theme</h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {DARK_THEME_COLORS.map((color) => (
              <ColorCard key={color.hex} {...color} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Light Theme</h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {LIGHT_THEME_COLORS.map((color) => (
              <ColorCard key={color.hex} {...color} />
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default Palette;
```

- [ ] **Step 3: `Button.tsx` — remove `React.FC`, add `type="button"`, add return type**

Replace the entire file:

```tsx
// packages
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-principal text-white border-2 border-principal hover:bg-opacity-90',
  secondary: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-portfolio-dark-900',
  outline: 'bg-transparent text-portfolio-dark-900 border-2 border-portfolio-dark-900 hover:bg-portfolio-dark-900 hover:text-white',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-5 py-2 text-sm tracking-[-0.21px]',
  md: 'px-10 py-5 text-xl tracking-[-0.3px]',
  lg: 'px-14 py-6 text-2xl tracking-[-0.36px]',
};

const BASE = 'inline-flex items-center justify-center gap-2 font-space-mono font-bold rounded-none transition-all duration-300 hover:scale-105 active:scale-95';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  icon,
}: ButtonProps): React.ReactElement => {
  const classes = `${BASE} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
      {icon}
    </button>
  );
};

export default Button;
```

- [ ] **Step 4: `LanguageSelector.tsx` — add return type**

Change:
```tsx
const LanguageSelector = () => {
```
To:
```tsx
const LanguageSelector = (): React.ReactElement => {
```

- [ ] **Step 5: `Header.tsx` — add return type** (full overhaul is Task 5; add only the return type annotation here to keep this task scoped to typing)

Change:
```tsx
const Header = () => {
```
To:
```tsx
const Header = (): React.ReactElement => {
```

- [ ] **Step 6: `Footer.tsx` — add return type**

Change:
```tsx
const Footer = () => {
```
To:
```tsx
const Footer = (): React.ReactElement => {
```

- [ ] **Step 7: Verify build and lint**

```bash
npm run build && npm run lint
```
Expected: exit 0 on both.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add explicit return types to all components, remove React.FC pattern"
```

---

## Task 5: Unified navigation hook — overhaul scroll duplication (#15) and Header DRY (#16)

**Files:**
- Create: `src/hooks/useNavigation.ts`
- Modify: `src/components/direction-b/BTopBar.tsx`
- Modify: `src/components/common/Header.tsx`
- Modify: `src/components/common/Footer.tsx`
- Delete: `src/utils/scrollUtils.ts`

**Background:**
- `scrollUtils.ts` uses `getElementById` — broken for direction-b, which uses `[data-jump]` attributes.
- `BTopBar.tsx` already uses the correct `[data-jump]` approach but inlines it.
- `Header.tsx` copies the same "navigate-or-scroll" pattern verbatim four times AND passes broken legacy section IDs (`'home'`, `'services'`, `'about'`, `'contact'`) instead of direction-b IDs (`'b-now'`, `'b-services'`, `'b-contact'`).
- Section ID mapping for the legacy Header: Home → `b-now`, Services → `b-services`, About → `/about` route (no direction-b section), Contact → `b-contact`.

- [ ] **Step 1: Create `src/hooks/useNavigation.ts`**

```ts
// packages
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useScrollToSection = (): ((sectionId: string) => void) => {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback((sectionId: string): void => {
    if (location.pathname === '/') {
      const el = document.querySelector<HTMLElement>(`[data-jump="${sectionId}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  }, [location.pathname, navigate]);
};
```

- [ ] **Step 2: Refactor `BTopBar.tsx` to use the hook**

Replace the inline scroll logic in the `navLinks` `onClick` handler. The current inline handler is:

```tsx
onClick={(e) => {
  e.preventDefault();
  setMenuRequested(false);
  const targetId = NAV_TARGETS[key];
  if (location.pathname === '/') {
    document
      .querySelector(`[data-jump="${targetId}"]`)
      ?.scrollIntoView({ behavior: 'smooth' });
  } else {
    navigate('/', { state: { scrollTo: targetId } });
  }
}}
```

After the change:
1. Add the hook import and remove direct `useNavigate`/`useLocation` calls that are only used for the scroll (keep them if used elsewhere — check: `location` is used in `navLinks` `onClick` for pathname check; `navigate` is used in `navLinks`'s off-page path).
2. Add at the top of the component body:

```tsx
const scrollToSection = useScrollToSection();
```

3. Replace the `onClick` handler:

```tsx
onClick={(e) => {
  e.preventDefault();
  setMenuRequested(false);
  scrollToSection(NAV_TARGETS[key]);
}}
```

4. Add to the `// hooks` import group:

```tsx
import { useScrollToSection } from '../../hooks/useNavigation';
```

5. Remove `useNavigate` and `useLocation` from the react-router-dom import if they are no longer used for anything else in the file. Check: `location` is used in the handler (now removed) and `navigate` was used in the old handler (now removed). Both can be removed from the react-router-dom import.

The final react-router-dom import line becomes:

```tsx
import { Link } from 'react-router-dom';
```

- [ ] **Step 3: Refactor `Header.tsx` — DRY nav handlers, fix section IDs, use hook**

Replace the entire `Header.tsx`:

```tsx
// packages
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// components
import LanguageSelector from './LanguageSelector';

// hooks
import { useScrollToSection } from '../../hooks/useNavigation';

interface NavItem {
  labelKey: string;
  sectionId?: string;
  route?: string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', sectionId: 'b-now' },
  { labelKey: 'nav.services', sectionId: 'b-services' },
  { labelKey: 'nav.about', route: '/about' },
  { labelKey: 'nav.contact', sectionId: 'b-contact' },
  { labelKey: 'nav.portfolio', route: '/portfolio' },
];

const Header = (): React.ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = useScrollToSection();
  const [isInServicesSection, setIsInServicesSection] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = (): void => {
      const servicesSection = document.querySelector('section[data-section="services"]');
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        setIsInServicesSection(rect.top <= 60 && rect.bottom >= 60);
      }

      const sectionIds = ['home', 'services', 'about', 'contact'];
      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 61) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBgClass = isInServicesSection
    ? 'backdrop-blur-[7.5px] bg-white border border-solid border-portfolio-dark-900'
    : 'backdrop-blur-[7.5px] bg-[#171717] border border-solid border-white';

  const textColorClass = isInServicesSection ? 'text-portfolio-dark-900' : 'text-white';
  const hoverClass = isInServicesSection ? 'hover:bg-portfolio-dark-900/10' : 'hover:bg-white/10';

  const getNavLinkClass = (item: NavItem): string => {
    const isPortfolioRoute = item.route === '/portfolio' && location.pathname === '/portfolio';
    const isSectionActive = item.sectionId !== undefined && activeSection === item.sectionId && location.pathname === '/';
    if (isPortfolioRoute || isSectionActive) {
      return 'px-8 py-3 rounded-none font-space-mono text-lg text-white tracking-[-0.3px] bg-[#505050] hover:bg-[#505050]/90 transition-all cursor-pointer';
    }
    return `px-8 py-3 rounded-none font-space-mono text-lg ${textColorClass} tracking-[-0.3px] ${hoverClass} transition-all cursor-pointer`;
  };

  const handleNavClick = (e: React.MouseEvent, item: NavItem): void => {
    e.preventDefault();
    if (item.route) {
      navigate(item.route);
      window.scrollTo(0, 0);
    } else if (item.sectionId) {
      scrollToSection(item.sectionId);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`${navBgClass} rounded-none px-16 py-2 flex items-center justify-between w-full h-[60px] transition-colors duration-300`}
      >
        {/* Social Icons - Left */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/jose-rios-4ab123163/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColorClass} ${hoverClass} p-2 rounded transition-all`}
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/jorius"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColorClass} ${hoverClass} p-2 rounded transition-all`}
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/573013930289"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColorClass} ${hoverClass} p-2 rounded transition-all`}
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>
        </div>

        <div className="flex items-center justify-center flex-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.labelKey}
              href={item.route ?? `#${item.sectionId}`}
              onClick={(e) => handleNavClick(e, item)}
              className={getNavLinkClass(item)}
            >
              {t(item.labelKey)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
};

export default Header;
```

- [ ] **Step 4: Refactor `Footer.tsx` — replace `scrollToSection` with hook**

Replace the Footer's nav `onClick` handlers. The Footer uses `scrollToSection` from the old util.

1. Remove the `scrollUtils` import:
```tsx
// Remove this line:
import { scrollToSection } from "../../utils/scrollUtils";
```

2. Add the hook import in the `// utils` group (or create a `// hooks` group):
```tsx
// hooks
import { useScrollToSection } from '../../hooks/useNavigation';
```

3. Add inside the `Footer` function body (before the return):
```tsx
const scrollToSection = useScrollToSection();
```

4. The footer nav links currently call `scrollToSection("home")`, `scrollToSection("about")` etc. Update the targets to direction-b IDs. Full footer nav `<nav>` replacement:

```tsx
<nav className="flex flex-col gap-5 font-space-mono text-base text-white tracking-[-0.24px]">
  <a
    href="#b-now"
    onClick={(e) => { e.preventDefault(); scrollToSection('b-now'); }}
    className="hover:text-principal transition-colors cursor-pointer"
  >
    {t('nav.home', 'Home')}
  </a>
  <a
    href="/about"
    onClick={(e) => { e.preventDefault(); navigate('/about'); }}
    className="hover:text-principal transition-colors cursor-pointer"
  >
    {t('nav.about', 'About')}
  </a>
  <a
    href="#b-services"
    onClick={(e) => { e.preventDefault(); scrollToSection('b-services'); }}
    className="hover:text-principal transition-colors cursor-pointer"
  >
    {t('nav.services', 'Services')}
  </a>
  <a
    href="#b-contact"
    onClick={(e) => { e.preventDefault(); scrollToSection('b-contact'); }}
    className="hover:text-principal transition-colors cursor-pointer"
  >
    {t('nav.contact', 'Contact')}
  </a>
</nav>
```

5. Add `useNavigate` import and call at the top of the footer:
```tsx
import { useNavigate } from 'react-router-dom';
// ...
const navigate = useNavigate();
```

- [ ] **Step 5: Delete `scrollUtils.ts`**

```bash
rm src/utils/scrollUtils.ts
```

- [ ] **Step 6: Verify build and lint**

```bash
npm run build && npm run lint
```
Expected: exit 0. If any residual `scrollToSection` import fails, search with `grep -rn "scrollUtils" src/`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add useScrollToSection hook, DRY Header nav handlers, fix section ID mapping"
```

---

## Task 6: Fix `useInView` options dependency bug

**Files:**
- Modify: `src/hooks/useInView.ts`

**Problem:** `options: IntersectionObserverInit = {}` is an object in the `useEffect` dependency array. A new `{}` literal is created each render, making the effect re-run every render until `seen` flips to true. This is a latent bug (current callers don't pass inline options, so it bites callers who do).

- [ ] **Step 1: Replace `useInView.ts`**

```ts
// packages
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export const useInView = <T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {},
): [RefObject<T | null>, boolean] => {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, ...optionsRef.current },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [seen]);

  return [ref, seen];
};
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useInView.ts
git commit -m "Fix useInView options reference causing unnecessary effect re-runs"
```

---

## Task 7: Memoize `loadPosts` in `BOssWriting.tsx`

**Files:**
- Modify: `src/components/direction-b/BOssWriting.tsx`

- [ ] **Step 1: Wrap `loadPosts()` in `useMemo`**

Line 43 currently reads:
```tsx
const posts = loadPosts();
```

Change it to:
```tsx
const posts = useMemo(() => loadPosts(), []);
```

`useMemo` is already imported at the top of the file (`import { useMemo } from 'react';`). No new import needed.

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/direction-b/BOssWriting.tsx
git commit -m "Memoize loadPosts call in BOssWriting to avoid re-sorting on every render"
```

---

## Task 8: Simplify `Reveal.tsx` extraProps pattern

**Files:**
- Modify: `src/components/primitives/Reveal.tsx`

**Problem:** The `extraProps` object is manually built, then spread — 8 lines of guarded assignments when direct inline props work because `Component` is typed as `ElementType` (accepts any props).

- [ ] **Step 1: Replace `Reveal.tsx`**

```tsx
// packages
import type { CSSProperties, ElementType, ReactNode } from 'react';

// hooks
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  as?: ElementType;
  className?: string;
  href?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

export const Reveal = ({
  children,
  delay = 0,
  style,
  as: As = 'div',
  className,
  href,
  onMouseEnter,
  onMouseLeave,
}: RevealProps): React.ReactElement => {
  const [ref, seen] = useInView<HTMLElement>();

  const Component = As as ElementType;

  return (
    <Component
      ref={ref}
      href={href}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 600ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 600ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
```

- [ ] **Step 2: Verify build and lint**

```bash
npm run build && npm run lint
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/Reveal.tsx
git commit -m "Simplify Reveal extraProps object into direct prop spreading"
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|-------------|------|
| Remove commented/unused code | Tasks 1, 2 |
| Lock package versions | Task 3 |
| Strong type everything | Task 4 |
| Scroll duplication overhaul (#15) | Task 5 |
| Header nav DRY (#16) | Task 5 |
| Skip hardcoded personal data (#17) | ✓ Skipped by design |
| Keep TechChip/StackChip separate (#18) | ✓ Confirmed: different mechanisms, kept separate |
| Skip unit tests (#2) | ✓ Skipped by design |
| KISS: loadPosts memoization | Task 7 |
| KISS: Contact form no-op | Task 2 |
| KISS: ColorCard nested component | Task 4 |
| KISS: Button missing `type` | Task 4 |
| KISS: useInView options dep array | Task 6 |
| KISS: Reveal extraProps pattern | Task 8 |

**Placeholder scan:** No TBD, TODO, or placeholder steps found.

**Type consistency:** `useScrollToSection` hook signature is `(sectionId: string) => void` and is consumed identically in BTopBar, Header, and Footer. `NavItem` interface is only defined in Header (local to that file — not reused elsewhere, which is correct).

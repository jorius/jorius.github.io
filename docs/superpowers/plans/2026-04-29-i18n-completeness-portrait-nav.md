# i18n Completeness + Portrait Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire WORK/RECORD/WHY section copy into i18n, fix Spanish semantic issues across hero/contact, and add manual prev/next navigation to the Portrait carousel.

**Architecture:** Add translation keys to both locale files first, then update components to call `tr()`, then strip the now-redundant text fields from `jorius.ts` interfaces. Portrait navigation extracts timer management into a ref-based cancel pattern so manual navigation can reset the auto-rotation.

**Tech Stack:** React 19, TypeScript 5.9, i18next, Vite 7

---

## Files touched

| File | Change |
|---|---|
| `src/i18n/locales/en.json` | Add `directionB.services`, `.experience`, `.hireWhy`, `.contact.status` |
| `src/i18n/locales/es.json` | Same keys in Spanish + fix hero headline + fix contact headline |
| `src/components/direction-b/BServices.tsx` | Replace `s.title` / `s.body` with `tr()` |
| `src/components/direction-b/BExperience.tsx` | Replace `e.role` / `e.body` / `e.to` / `e.loc` with `tr()` |
| `src/components/direction-b/BWhy.tsx` | Replace `w.h` / `w.b` with `tr()` |
| `src/components/direction-b/BContact.tsx` | Replace `JORIUS.status` with `tr()` |
| `src/data/jorius.ts` | Remove `title`/`body` from `ServiceEntry`, `role`/`body` from `ExperienceEntry`, `h`/`b`/`n` from `HireWhyEntry` |
| `src/components/direction-b/Portrait.tsx` | Refactor timer into ref-based cancel + add `‹`/`›` nav controls |

---

## Task 1: Add new keys to en.json

**Files:**
- Modify: `src/i18n/locales/en.json`

- [ ] **Step 1: Add `directionB.services` block**

Inside `"directionB"`, after the existing `"read"` block, add:

```json
"services": {
  "01": {
    "title": "Full-stack delivery",
    "body": "Shipping production web apps end-to-end. TypeScript, React, Next.js, Node/NestJS, AWS Lambda, well-typed API boundaries, boring infra that wakes nobody up at 3am."
  },
  "02": {
    "title": "AppSec & pentesting",
    "body": "Application security reviews, manual penetration testing, and threat modeling for auth flows, session handling, and data-access layers. I read code, attack the app, write a report, then sit with your team until the fixes land."
  },
  "03": {
    "title": "Technical leadership",
    "body": "Fractional staff engineer for teams of 3–15. Architecture reviews, hiring loops, mentoring, unblocking the hard thing nobody wants to touch. Cross-timezone delivery between LATAM and U.S. teams."
  }
},
```

- [ ] **Step 2: Add `directionB.experience` block**

After the `"services"` block:

```json
"experience": {
  "present": "Present",
  "remote": "Remote",
  "perficient_current": {
    "role": "Senior Technical Consultant",
    "body": "Leading technical delivery of insurance and caregiver workflows for a U.S. health services client. Architected and implemented solutions across the JS/TS stack and coordinated across time zones with distributed American engineering teams."
  },
  "celerik_recent": {
    "role": "Senior Software Developer & Technical Lead",
    "body": "Led two JS/TS teams (8 mid-level + junior engineers). Owned full-stack architecture: NestJS / Node REST APIs, React frontends from Figma, relational + non-relational data modeling. Built and maintained Azure DevOps CI/CD pipelines across multiple concurrent client projects. Mentored engineers and standardized delivery practices across teams."
  },
  "perficient": {
    "role": "Full-Stack Software Analyst",
    "body": "Built serverless Node.js microservices on AWS Lambda for RTS ProTransport, a major U.S. trucking and logistics platform. Developed and helped architect ReactJS web applications for the same client. Provided architecture guidance for React Native mobile projects."
  },
  "globant": {
    "role": "Web UI Developer (Ssr)",
    "body": "Developed and maintained ReactJS applications for OpenBank's loans and mortgages team. Integrated frontends with the bank's core lending systems. Contributed to front-end architecture decisions across the product."
  },
  "celerik_2019": {
    "role": "Front-End Lead Developer",
    "body": "Led development of GAIA, a geospatial cluster-mapping platform visualizing deforestation, mining, and other environmental data layers. Designed and managed the PostgreSQL + PostGIS data architecture backing the mapping engine. Owned front-end architecture across multiple concurrent client engagements."
  },
  "comtic": {
    "role": "Full-Stack Developer",
    "body": "Designed, modeled, and administered relational databases in MySQL and PostgreSQL. Administered Linux servers on DigitalOcean and Heroku. Developed and maintained web applications in PHP with CodeIgniter and Laravel."
  }
},
```

- [ ] **Step 3: Add `directionB.hireWhy` block**

After the `"experience"` block:

```json
"hireWhy": {
  "01": {
    "h": "I ship.",
    "b": "Ten years across six engagements. Every quarter has had something live in production — fintech, geospatial, logistics, lending."
  },
  "02": {
    "h": "I write it down.",
    "b": "Architecture notes, ADRs, READMEs your next hire can actually read. The CV literally says \"documentation that outlives the project\" — it earned its place."
  },
  "03": {
    "h": "Greenfield or legacy, I show up the same.",
    "b": "Equally happy architecting from scratch and diving into a tangled codebase to unblock the team. Both happen on every engagement."
  },
  "04": {
    "h": "I work across time zones.",
    "b": "Years of distributed delivery between LATAM and U.S. teams. Async-first by habit, sync when it actually moves the work."
  }
},
```

- [ ] **Step 4: Add `status` to `directionB.contact`**

Inside `"directionB" > "contact"`, add after `"whatsappLabel"`:

```json
"status": "Open to roles · Q3 2026",
```

- [ ] **Step 5: Verify JSON is valid**

```bash
node -e "require('./src/i18n/locales/en.json'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add src/i18n/locales/en.json
git commit -m "Add directionB content keys to en.json"
```

---

## Task 2: Add new keys to es.json + fix existing strings

**Files:**
- Modify: `src/i18n/locales/es.json`

- [ ] **Step 1: Fix hero headline (swap FULL-STACK/INGENIERO order, feminise ENTREGADA)**

Find and update inside `"directionB" > "hero" > "headline"`:

```json
"fullstack": "INGENIERO",
"engineer": "FULL-STACK,",
"engineerKicker": "(full-stack, remoto)",
"security": "SEGURIDAD,",
"shipped": "ENTREGADA."
```

- [ ] **Step 2: Fix contact headline punctuation**

Find and update inside `"directionB" > "contact"`:

```json
"headline1": "CUÉNTAME,",
"headline2": "DE QUÉ SE TRATA?",
```

- [ ] **Step 3: Add `directionB.services` block**

After the existing `"read"` block inside `"directionB"`:

```json
"services": {
  "01": {
    "title": "Desarrollo full-stack",
    "body": "Entrega de software en producción de principio a fin. TypeScript, React, Next.js, Node/NestJS, AWS Lambda, interfaces API bien estructuradas, infraestructura sólida que no despierta a nadie a las 3am."
  },
  "02": {
    "title": "AppSec y pentesting",
    "body": "Revisiones de seguridad en aplicaciones, pentesting manual y modelado de amenazas para flujos de autenticación, manejo de sesiones y capas de acceso a datos. Leo el código, ataco la app, escribo el informe y me siento con tu equipo hasta que los arreglos lleguen a producción."
  },
  "03": {
    "title": "Liderazgo técnico",
    "body": "Líder técnico a tiempo parcial para equipos de entre 3 y 15 personas. Revisiones de arquitectura, procesos de contratación, mentoría y soporte en los problemas que nadie quiere afrontar. Experiencia en entrega distribuida entre equipos de LATAM y EE.UU."
  }
},
```

- [ ] **Step 4: Add `directionB.experience` block**

```json
"experience": {
  "present": "Presente",
  "remote": "Remoto",
  "perficient_current": {
    "role": "Consultor Técnico Senior",
    "body": "Liderando la entrega técnica de flujos de seguros y cuidado personal para un cliente de servicios de salud en EE.UU. Arquitecté e implementé soluciones en la pila JS/TS y coordiné con equipos de ingeniería distribuidos en distintas zonas horarias."
  },
  "celerik_recent": {
    "role": "Desarrollador Senior & Líder Técnico",
    "body": "Lideré dos equipos de JS/TS (8 ingenieros de nivel intermedio y junior). Arquitectura full-stack: APIs REST con NestJS/Node, frontends en React desde Figma, modelado de datos relacionales y no relacionales. Construí y mantuve pipelines de CI/CD en Azure DevOps para múltiples proyectos simultáneos. Mentoricé ingenieros y estandaricé prácticas de entrega."
  },
  "perficient": {
    "role": "Analista de Software Full-Stack",
    "body": "Construí microservicios Node.js serverless en AWS Lambda para RTS ProTransport, una plataforma de logística y transporte de carga en EE.UU. Desarrollé y ayudé a arquitectar aplicaciones web ReactJS para el mismo cliente. Brindé orientación de arquitectura para proyectos móviles en React Native."
  },
  "globant": {
    "role": "Desarrollador UI Web (Ssr)",
    "body": "Desarrollé y mantuve aplicaciones ReactJS para el equipo de préstamos e hipotecas de OpenBank. Integré los frontends con los sistemas centrales de préstamos del banco. Contribuí a las decisiones de arquitectura frontend en todo el producto."
  },
  "celerik_2019": {
    "role": "Desarrollador Front-End Líder",
    "body": "Lideré el desarrollo de GAIA, una plataforma de mapeo geoespacial que visualiza capas de datos sobre deforestación, minería y otros impactos ambientales. Diseñé y gestioné la arquitectura de datos en PostgreSQL + PostGIS que respalda el motor de mapas. Lideré la arquitectura frontend en múltiples proyectos de clientes simultáneos."
  },
  "comtic": {
    "role": "Desarrollador Full-Stack",
    "body": "Diseñé, modelé y administré bases de datos relacionales en MySQL y PostgreSQL. Administré servidores Linux en DigitalOcean y Heroku. Desarrollé y mantuve aplicaciones web en PHP con CodeIgniter y Laravel."
  }
},
```

- [ ] **Step 5: Add `directionB.hireWhy` block**

```json
"hireWhy": {
  "01": {
    "h": "Lo entrego.",
    "b": "Diez años en seis proyectos. Cada trimestre algo estuvo vivo en producción: fintech, geoespacial, logística, créditos."
  },
  "02": {
    "h": "Lo dejo documentado.",
    "b": "Notas de arquitectura, ADRs, READMEs que tu próxima contratación puede leer. El CV literalmente dice 'documentación que sobrevive al proyecto' — se ganó ese lugar."
  },
  "03": {
    "h": "Proyecto nuevo o legacy, aparezco igual.",
    "b": "Igual de cómodo arquitectando desde cero que entrando a un codebase enredado para desbloquear al equipo. Las dos situaciones ocurren en cada proyecto."
  },
  "04": {
    "h": "Trabajo entre zonas horarias.",
    "b": "Años de entrega distribuida entre equipos de LATAM y EE.UU. Async por costumbre, sync cuando realmente mueve el trabajo."
  }
},
```

- [ ] **Step 6: Add `status` to `directionB.contact`**

Inside `"directionB" > "contact"`, add after `"whatsappLabel"`:

```json
"status": "Abierto a roles · Q3 2026",
```

- [ ] **Step 7: Verify JSON is valid**

```bash
node -e "require('./src/i18n/locales/es.json'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 8: Commit**

```bash
git add src/i18n/locales/es.json
git commit -m "Add directionB Spanish translations and fix hero/contact semantics"
```

---

## Task 3: Update BServices to use tr()

**Files:**
- Modify: `src/components/direction-b/BServices.tsx`

- [ ] **Step 1: Replace s.title and s.body with tr() calls**

Replace the `<h3>` and `<p>` contents:

```tsx
<h3 style={{ margin: 0, fontSize: 'clamp(22px, 7vw, 40px)', color: t.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>
  <Glitch trigger="hover" strong>{tr(`directionB.services.${s.id}.title`)}</Glitch>
</h3>
<p style={{ color: t.ink, fontSize: 15, lineHeight: 1.55, margin: 0 }}>{tr(`directionB.services.${s.id}.body`)}</p>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/direction-b/BServices.tsx
git commit -m "Wire BServices title and body through i18n"
```

---

## Task 4: Update BExperience to use tr()

**Files:**
- Modify: `src/components/direction-b/BExperience.tsx`

- [ ] **Step 1: Replace e.role, e.body, e.to, e.loc with tr() calls**

Replace the date line, location line, role column, and body column:

```tsx
{/* date line — translate "Present" */}
<div style={{ fontSize: 11, color: t.dim, marginTop: 4 }}>
  {e.from} → {e.to === 'Present' ? tr('directionB.experience.present') : e.to}
</div>

{/* location line — translate "Remote" */}
<div style={{ fontSize: 10, color: t.dim, marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
  {e.loc === 'Remote' ? tr('directionB.experience.remote') : e.loc}
</div>

{/* role column */}
<div style={{ fontSize: 14, color: t.ink, fontWeight: 500, letterSpacing: '-0.005em' }}>
  {tr(`directionB.experience.${e.key}.role`)}
</div>

{/* body column */}
<div style={{ fontSize: 14, color: t.ink, lineHeight: 1.55 }}>
  {tr(`directionB.experience.${e.key}.body`)}
</div>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/direction-b/BExperience.tsx
git commit -m "Wire BExperience role, body, dates and location through i18n"
```

---

## Task 5: Update BWhy to use tr()

**Files:**
- Modify: `src/components/direction-b/BWhy.tsx`

- [ ] **Step 1: Replace w.h and w.b with tr() calls**

```tsx
<div style={{ fontSize: isMobile ? 18 : 22, color: t.ink, margin: '10px 0 10px 0', letterSpacing: '-0.01em' }}>
  <Glitch trigger="hover">{tr(`directionB.hireWhy.${w.n}.h`)}</Glitch>
</div>
<div style={{ fontSize: 13, color: t.dim, lineHeight: 1.55 }}>{tr(`directionB.hireWhy.${w.n}.b`)}</div>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/direction-b/BWhy.tsx
git commit -m "Wire BWhy headlines and bodies through i18n"
```

---

## Task 6: Update BContact status

**Files:**
- Modify: `src/components/direction-b/BContact.tsx`

- [ ] **Step 1: Replace JORIUS.status with tr()**

Find the availability column in `BContact`:

```tsx
<div style={{ fontSize: 18, color: t.ink, marginTop: 6 }}>{tr('directionB.contact.status')}</div>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/direction-b/BContact.tsx
git commit -m "Wire BContact availability status through i18n"
```

---

## Task 7: Strip text fields from jorius.ts

**Files:**
- Modify: `src/data/jorius.ts`

- [ ] **Step 1: Update the three interfaces**

Replace the three interface definitions:

```ts
export interface ServiceEntry {
  id: string;
  stack: string[];
}

export interface ExperienceEntry {
  key: string;
  co: string;
  mark: string;
  accent: string;
  logo: string;
  loc: string;
  from: string;
  to: string;
}

export interface HireWhyEntry {
  n: string;
}
```

- [ ] **Step 2: Remove text fields from the JORIUS services array**

Replace the `services` array in the `JORIUS` object:

```ts
services: [
  {
    id: '01',
    stack: ['TypeScript', 'React', 'Next.js', 'Node', 'AWS', 'Postgres'],
  },
  {
    id: '02',
    stack: ['OWASP', 'OAuth/OIDC', 'Threat-modeling', 'Burp', 'Semgrep'],
  },
  {
    id: '03',
    stack: ['RFCs', 'Review', 'Hiring', 'Mentoring', 'Roadmaps'],
  },
],
```

- [ ] **Step 3: Remove text fields from the JORIUS experience array**

Replace the `experience` array:

```ts
experience: [
  {
    key: 'perficient_current',
    co: 'Perficient',
    mark: 'P',
    accent: '#CE1E20',
    logo: '/images/perficient_logo.png',
    loc: 'Medellín, Colombia',
    from: 'Dec 2025',
    to: 'Present',
  },
  {
    key: 'celerik_recent',
    co: 'Celerik',
    mark: 'C',
    accent: '#0F132A',
    logo: '/images/celerik_logo.png',
    loc: 'Medellín, Colombia',
    from: 'Nov 2024',
    to: 'Dec 2025',
  },
  {
    key: 'perficient',
    co: 'Perficient Latin America',
    mark: 'P',
    accent: '#CE1E20',
    logo: '/images/perficient_logo.png',
    loc: 'Medellín, Colombia',
    from: 'Oct 2021',
    to: 'Nov 2024',
  },
  {
    key: 'globant',
    co: 'Globant',
    mark: 'G',
    accent: '#A4CC3A',
    logo: '/images/globant_logo.png',
    loc: 'Remote',
    from: 'Nov 2020',
    to: 'Oct 2021',
  },
  {
    key: 'celerik_2019',
    co: 'Celerik',
    mark: 'C',
    accent: '#0F132A',
    logo: '/images/celerik_logo.png',
    loc: 'Medellín, Colombia',
    from: 'Jan 2019',
    to: 'Nov 2020',
  },
  {
    key: 'comtic',
    co: 'COMTIC S.A.S',
    mark: 'C',
    accent: '#6B7280',
    logo: '/images/comtic_logo.jpeg',
    loc: 'Medellín, Colombia',
    from: '2015',
    to: '2017',
  },
],
```

- [ ] **Step 4: Remove text fields from the JORIUS hire_why array**

Replace the `hire_why` array:

```ts
hire_why: [
  { n: '01' },
  { n: '02' },
  { n: '03' },
  { n: '04' },
],
```

- [ ] **Step 5: Remove `status` from `JoriusData` interface and JORIUS object**

In the `JoriusData` interface, remove the `status` line:
```ts
// DELETE this line:
status: string;
```

In the `JORIUS` object, remove:
```ts
// DELETE this line:
status: 'Open to roles · Q3 2026',
```

- [ ] **Step 6: Build check — this is the critical type-safety gate**

```bash
npm run build
```

Expected: exits 0. Any remaining `s.title`, `s.body`, `e.role`, `e.body`, `w.h`, `w.b`, or `JORIUS.status` references will surface as TypeScript errors here.

- [ ] **Step 7: Commit**

```bash
git add src/data/jorius.ts
git commit -m "Strip translated text fields from jorius.ts interfaces"
```

---

## Task 8: Portrait navigation

**Files:**
- Modify: `src/components/direction-b/Portrait.tsx`

- [ ] **Step 1: Replace the full Portrait.tsx with the new implementation**

The key changes:
- Add `stopAutoRef` to hold a cancel function for the active auto-rotation.
- Extract rotation scheduling into `startAuto()` (a `useCallback` with stable deps) so `navigate()` can restart it after manual interaction.
- Add `navigate(dir: 1 | -1)` — cancels auto, triggers glitch, advances index, resumes auto.
- Add `‹` / `›` button controls positioned at mid-height on left/right edges.

```tsx
// packages
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

interface CatPhoto {
  name: string;
  src: string;
  role: string;
}

const CATS: CatPhoto[] = [
  { name: 'Gasolina', src: '/images/cats/gasolina.jpg', role: 'Lead QA' },
  { name: 'Pancho', src: '/images/cats/pancho.jpg', role: 'CEO' },
  { name: 'Toji', src: '/images/cats/toji.jpg', role: 'CFO' },
  { name: 'Cohete', src: '/images/cats/cohete.jpg', role: 'Right-hand man' },
];

const ROTATION_BASE_MS = 5400;
const ROTATION_JITTER_MS = 1100;
const GLITCH_LEAD_MS = 180;
const GLITCH_DURATION_MS = 320;

export const Portrait = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [glitching, setGlitching] = useState(false);

  // Holds a cancel function for the currently scheduled auto-rotation chain.
  // Calling it stops all pending timers in that chain.
  const stopAutoRef = useRef<() => void>(() => {});

  const startAuto = useCallback((): void => {
    let alive = true;
    let outerTimer: ReturnType<typeof setTimeout>;
    let glitchOnTimer: ReturnType<typeof setTimeout>;
    let glitchOffTimer: ReturnType<typeof setTimeout>;

    const tick = (): void => {
      if (!alive) return;
      setGlitching(true);
      glitchOnTimer = setTimeout(() => {
        if (!alive) return;
        setActiveIdx((i) => (i + 1) % CATS.length);
        glitchOffTimer = setTimeout(() => {
          if (!alive) return;
          setGlitching(false);
          outerTimer = setTimeout(tick, ROTATION_BASE_MS + Math.random() * ROTATION_JITTER_MS);
        }, GLITCH_DURATION_MS - GLITCH_LEAD_MS);
      }, GLITCH_LEAD_MS);
    };

    outerTimer = setTimeout(tick, ROTATION_BASE_MS + Math.random() * ROTATION_JITTER_MS);

    stopAutoRef.current = (): void => {
      alive = false;
      clearTimeout(outerTimer);
      clearTimeout(glitchOnTimer);
      clearTimeout(glitchOffTimer);
    };
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(startAuto, 4200);
    return (): void => {
      clearTimeout(initialTimer);
      stopAutoRef.current();
    };
  }, [startAuto]);

  const navigate = (dir: 1 | -1): void => {
    if (glitching) return;
    stopAutoRef.current();
    setGlitching(true);
    let t2: ReturnType<typeof setTimeout>;
    const t1 = setTimeout(() => {
      setActiveIdx((i) => (i + dir + CATS.length) % CATS.length);
      t2 = setTimeout(() => {
        setGlitching(false);
        startAuto();
      }, GLITCH_DURATION_MS - GLITCH_LEAD_MS);
    }, GLITCH_LEAD_MS);
    // Allow a second nav tap to cancel the in-flight transition cleanly
    stopAutoRef.current = (): void => { clearTimeout(t1); clearTimeout(t2); };
  };

  const activeCat = CATS[activeIdx];
  const shiftA = glitching ? 'translate(-6px, 2px)' : 'none';
  const shiftB = glitching ? 'translate(6px, -2px)' : 'none';

  const navBtnStyle = (opacity: number): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: '8px 6px',
    cursor: glitching ? 'default' : 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
    letterSpacing: '0.12em',
    color: '#f2efe7',
    opacity: glitching ? 0 : opacity,
    transition: 'opacity 150ms',
    zIndex: 10,
    userSelect: 'none',
  });

  return (
    <div
      className="b-hero-portrait"
      style={{
        width: '100%',
        maxWidth: 480,
        aspectRatio: '3 / 4',
        border: `1px solid ${t.rule}`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: t.sub,
      }}
    >
      {/* All four cats render stacked; opacity drives the visible cycle */}
      {CATS.map((cat, i) => (
        <img
          key={cat.name}
          src={cat.src}
          alt={cat.name}
          loading={i === 0 ? 'eager' : 'lazy'}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: i === activeIdx ? 1 : 0,
            transition: 'opacity 240ms ease',
            filter: 'grayscale(0.1) contrast(1.05)',
          }}
        />
      ))}

      {/* Top gradient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0, right: 0, top: 0,
          height: 32,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)',
          pointerEvents: 'none',
        }}
      />
      {/* Bottom gradient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          height: 36,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* RGB-split glitch layer A */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, currentColor 0 6px, transparent 6px 12px)',
          color: t.rgbR, mixBlendMode: 'screen',
          opacity: glitching ? 0.35 : 0,
          transform: shiftA, transition: 'transform 60ms linear',
          pointerEvents: 'none',
        }}
      />
      {/* RGB-split glitch layer B */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, currentColor 0 6px, transparent 6px 12px)',
          color: t.rgbB, mixBlendMode: 'screen',
          opacity: glitching ? 0.35 : 0,
          transform: shiftB, transition: 'transform 60ms linear',
          pointerEvents: 'none',
        }}
      />

      {/* Top framing label */}
      <div
        style={{
          position: 'absolute', left: 10, top: 10, right: 10,
          fontSize: 10, color: '#f2efe7', letterSpacing: '0.12em',
          textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)', pointerEvents: 'none',
        }}
      >
        <span>{tr('directionB.portrait.exhibit')}</span>
        <span>
          {activeCat.name.toUpperCase()} · {activeCat.role.toUpperCase()}
          {tr('directionB.portrait.type')}
        </span>
      </div>

      {/* Bottom framing label */}
      <div
        style={{
          position: 'absolute', left: 10, bottom: 10, right: 10,
          fontSize: 11, color: '#f2efe7',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)', pointerEvents: 'none',
        }}
      >
        <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tr('directionB.portrait.caption')}</span>
        <span style={{ fontSize: 10, opacity: 0.85 }}>{tr('directionB.portrait.subcaption')}</span>
      </div>

      {/* Scan bar */}
      <div
        aria-hidden
        style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: '#f2efe7', opacity: 0.18,
          top: glitching ? '70%' : '30%',
          transition: 'top 400ms linear', pointerEvents: 'none',
        }}
      />

      {/* Prev nav control */}
      <button
        aria-label="Previous photo"
        onClick={() => navigate(-1)}
        style={{ ...navBtnStyle(0.55), left: 8 }}
        onMouseEnter={(e) => { if (!glitching) e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { if (!glitching) e.currentTarget.style.opacity = '0.55'; }}
      >
        ‹
      </button>

      {/* Next nav control */}
      <button
        aria-label="Next photo"
        onClick={() => navigate(1)}
        style={{ ...navBtnStyle(0.55), right: 8 }}
        onMouseEnter={(e) => { if (!glitching) e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { if (!glitching) e.currentTarget.style.opacity = '0.55'; }}
      >
        ›
      </button>
    </div>
  );
};
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/direction-b/Portrait.tsx
git commit -m "Add manual prev/next navigation to Portrait carousel"
```

---

## Task 9: Final verification

- [ ] **Step 1: Start dev server and verify EN**

```bash
npm run dev
```

Open http://localhost:5173 and check:
- Hero reads: FULL-STACK / ENGINEER. / (full-stack, remote) / SECURITY, / SHIPPED.
- WORK section shows English service titles and bodies
- RECORD section shows English roles and bodies; current role shows "Present"
- WHY section shows English headlines and bodies
- Contact availability shows "Open to roles · Q3 2026"
- Contact headline reads: TELL ME / ABOUT IT.

- [ ] **Step 2: Switch to Spanish and verify**

Click the language toggle (ES) and check:
- Hero reads: INGENIERO / FULL-STACK, / (full-stack, remoto) / SEGURIDAD, / ENTREGADA.
- WORK section shows Spanish service titles and bodies
- RECORD section shows Spanish roles and bodies; current role shows "Presente"; Globant shows "Remoto"
- WHY section shows Spanish headlines and bodies
- Contact availability shows "Abierto a roles · Q3 2026"
- Contact headline reads: CUÉNTAME, / DE QUÉ SE TRATA?

- [ ] **Step 3: Verify Portrait navigation**

- Click `‹` and `›` — photo changes with glitch animation
- Auto-rotation resumes after ~5s of inactivity
- Controls are subtle (dim) at rest, brighter on hover
- Controls disappear during a glitch transition

- [ ] **Step 4: Final commit if everything looks correct**

```bash
git add .
git commit -m "Verify i18n completeness and portrait navigation"
```

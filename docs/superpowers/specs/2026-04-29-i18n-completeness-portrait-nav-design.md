# i18n Completeness + Portrait Navigation — Design Spec
**Date:** 2026-04-29

## 1. Problem

Three `directionB` sections (WORK/`BServices`, RECORD/`BExperience`, WHY/`BWhy`) pull human-readable copy directly from `JORIUS` in `jorius.ts`, which is English-only. Switching to Spanish leaves those sections untranslated. Additionally, several Spanish strings have punctuation or semantic issues, and the Portrait component has no manual navigation.

---

## 2. JORIUS Interface Changes

Remove text fields from three interfaces. Keep all structural fields (IDs, logos, accent colors, stacks, dates, locations).

```ts
// ServiceEntry — REMOVE: title, body
// ExperienceEntry — REMOVE: role, body
// HireWhyEntry — REMOVE: h, b
```

`from`, `to`, `loc` stay in JORIUS as data fields. Two English words that need translation are handled in components:
- `e.to === 'Present'` → `tr('directionB.experience.present')`
- `e.loc === 'Remote'` → `tr('directionB.experience.remote')`

`JORIUS.status` (`"Open to roles · Q3 2026"`) moves to i18n — it is rendered text, not data.

---

## 3. Locale File Changes

### 3a. Hero headline — es.json only (reorder for Spanish grammar)

| key | current es | new es |
|---|---|---|
| `headline.fullstack` | FULL-STACK | INGENIERO |
| `headline.engineer` | INGENIERO. | FULL-STACK, |
| `headline.engineerKicker` | (full-stack, remoto) | (unchanged) |
| `headline.security` | SEGURIDAD, | (unchanged) |
| `headline.shipped` | ENTREGADO. | ENTREGADA. |

Reading: "INGENIERO / FULL-STACK, / SEGURIDAD, / ENTREGADA." — "entregada" is feminine, agreeing with "seguridad".

### 3b. Contact headline — es.json only

| key | current | new |
|---|---|---|
| `contact.headline1` | CUÉNTAME | CUÉNTAME, |
| `contact.headline2` | DE QUÉ SE TRATA. | DE QUÉ SE TRATA? |

### 3c. Contact status — both locales

```json
"directionB.contact.status": "Open to roles · Q3 2026"   // en.json
"directionB.contact.status": "Abierto a roles · Q3 2026" // es.json
```

### 3d. Services — both locales (`directionB.services.{01,02,03}.{title,body}`)

**01 — Full-stack delivery / Desarrollo full-stack**
- EN body: *(as in jorius.ts)*
- ES body: "Entrega de software en producción de principio a fin. TypeScript, React, Next.js, Node/NestJS, AWS Lambda, interfaces API bien estructuradas, infraestructura sólida que no despierta a nadie a las 3am."

**02 — AppSec & pentesting / AppSec y pentesting**
- EN body: *(as in jorius.ts)*
- ES body: "Revisiones de seguridad en aplicaciones, pentesting manual y modelado de amenazas para flujos de autenticación, manejo de sesiones y capas de acceso a datos. Leo el código, ataco la app, escribo el informe y me siento con tu equipo hasta que los arreglos lleguen a producción."

**03 — Technical leadership / Liderazgo técnico**
- EN body: *(as in jorius.ts)*
- ES body: "Líder técnico a tiempo parcial para equipos de entre 3 y 15 personas. Revisiones de arquitectura, procesos de contratación, mentoría y soporte en los problemas que nadie quiere afrontar. Experiencia en entrega distribuida entre equipos de LATAM y EE.UU."

### 3e. Experience — both locales (`directionB.experience.{key}.{role,body}`)

| key | EN role | ES role |
|---|---|---|
| `perficient_current` | Senior Technical Consultant | Consultor Técnico Senior |
| `celerik_recent` | Senior Software Developer & Technical Lead | Desarrollador Senior & Líder Técnico |
| `perficient` | Full-Stack Software Analyst | Analista de Software Full-Stack |
| `globant` | Web UI Developer (Ssr) | Desarrollador UI Web (Ssr) |
| `celerik_2019` | Front-End Lead Developer | Desarrollador Front-End Líder |
| `comtic` | Full-Stack Developer | Desarrollador Full-Stack |

Bodies: EN = existing jorius.ts text verbatim. ES translations:

**perficient_current ES body:** "Liderando la entrega técnica de flujos de seguros y cuidado personal para un cliente de servicios de salud en EE.UU. Arquitecté e implementé soluciones en la pila JS/TS y coordiné con equipos de ingeniería distribuidos en distintas zonas horarias."

**celerik_recent ES body:** "Lideré dos equipos de JS/TS (8 ingenieros de nivel intermedio y junior). Arquitectura full-stack: APIs REST con NestJS/Node, frontends en React desde Figma, modelado de datos relacionales y no relacionales. Construí y mantuve pipelines de CI/CD en Azure DevOps para múltiples proyectos simultáneos. Mentoricé ingenieros y estandaricé prácticas de entrega."

**perficient ES body:** "Construí microservicios Node.js serverless en AWS Lambda para RTS ProTransport, una plataforma de logística y transporte de carga en EE.UU. Desarrollé y ayudé a arquitectar aplicaciones web ReactJS para el mismo cliente. Brindé orientación de arquitectura para proyectos móviles en React Native."

**globant ES body:** "Desarrollé y mantuve aplicaciones ReactJS para el equipo de préstamos e hipotecas de OpenBank. Integré los frontends con los sistemas centrales de préstamos del banco. Contribuí a las decisiones de arquitectura frontend en todo el producto."

**celerik_2019 ES body:** "Lideré el desarrollo de GAIA, una plataforma de mapeo geoespacial que visualiza capas de datos sobre deforestación, minería y otros impactos ambientales. Diseñé y gestioné la arquitectura de datos en PostgreSQL + PostGIS que respalda el motor de mapas. Lideré la arquitectura frontend en múltiples proyectos de clientes simultáneos."

**comtic ES body:** "Diseñé, modelé y administré bases de datos relacionales en MySQL y PostgreSQL. Administré servidores Linux en DigitalOcean y Heroku. Desarrollé y mantuve aplicaciones web en PHP con CodeIgniter y Laravel."

Special keys:
```json
"directionB.experience.present": "Present"   // en.json
"directionB.experience.present": "Presente"  // es.json
"directionB.experience.remote":  "Remote"    // en.json
"directionB.experience.remote":  "Remoto"    // es.json
```

### 3f. Why/Hire — both locales (`directionB.hireWhy.{01,02,03,04}.{h,b}`)

| n | EN h | ES h |
|---|---|---|
| 01 | I ship. | Lo entrego. |
| 02 | I write it down. | Lo dejo documentado. |
| 03 | Greenfield or legacy, I show up the same. | Proyecto nuevo o legacy, aparezco igual. |
| 04 | I work across time zones. | Trabajo entre zonas horarias. |

Bodies: EN = existing jorius.ts text verbatim. ES translations:

**01 ES body:** "Diez años en seis proyectos. Cada trimestre algo estuvo vivo en producción: fintech, geoespacial, logística, créditos."

**02 ES body:** "Notas de arquitectura, ADRs, READMEs que tu próxima contratación puede leer. El CV literalmente dice 'documentación que sobrevive al proyecto' — se ganó ese lugar."

**03 ES body:** "Igual de cómodo arquitectando desde cero que entrando a un codebase enredado para desbloquear al equipo. Las dos situaciones ocurren en cada proyecto."

**04 ES body:** "Años de entrega distribuida entre equipos de LATAM y EE.UU. Async por costumbre, sync cuando realmente mueve el trabajo."

---

## 4. Component Changes

### BServices.tsx
```tsx
// s.title → tr('directionB.services.' + s.id + '.title')
// s.body  → tr('directionB.services.' + s.id + '.body')
```

### BExperience.tsx
```tsx
// e.role → tr('directionB.experience.' + e.key + '.role')
// e.body → tr('directionB.experience.' + e.key + '.body')
// e.to   → e.to === 'Present' ? tr('directionB.experience.present') : e.to
// e.loc  → e.loc === 'Remote'  ? tr('directionB.experience.remote')  : e.loc
```

### BWhy.tsx
```tsx
// w.h → tr('directionB.hireWhy.' + w.n + '.h')
// w.b → tr('directionB.hireWhy.' + w.n + '.b')
```

### BContact.tsx
```tsx
// JORIUS.status → tr('directionB.contact.status')
```

---

## 5. Portrait Navigation

### Current behaviour
`Portrait.tsx` auto-cycles through 4 cat photos every ~5.4s with an RGB-split glitch transition. All four `<img>` elements are pre-rendered stacked; opacity drives visibility.

### New behaviour
Add manual prev (`‹`) and next (`›`) controls. Clicking either:
1. Triggers the same glitch animation used for auto-rotation.
2. Advances/retreats `activeIdx`.
3. Resets the auto-rotation timer (cancels the current scheduled tick and starts a fresh one from zero).

### Visual design
Controls appear at mid-height on the left and right edges of the portrait frame — same position layer as the scan bar, above the image, below nothing. Style mirrors the existing overlay labels:
- Font: inherited Space Mono, `10px`, `letterSpacing: '0.12em'`
- Color: `#f2efe7` at `opacity: 0.55` resting → `opacity: 1` on hover
- Characters: `‹` (prev) and `›` (next)
- Padding: `8px` from edge
- `cursor: pointer`, no background, no border
- `pointerEvents: auto` (unlike `aria-hidden` overlays)
- Not shown during a glitch (`glitching === true`) to avoid conflict

### Implementation note
The auto-rotation `useEffect` currently captures a plain closure. To allow reset from outside the effect, extract the tick scheduling into a ref-based approach: store the `setTimeout` handle in a `useRef` and expose a `resetTimer()` helper that the nav handlers can call.

---

## 6. Files Touched

| File | Change |
|---|---|
| `src/data/jorius.ts` | Remove text fields from 3 interfaces + JORIUS object |
| `src/i18n/locales/en.json` | Add services, experience, hireWhy, status keys |
| `src/i18n/locales/es.json` | Same keys in Spanish + fix hero + fix contact headline |
| `src/components/direction-b/BServices.tsx` | Use tr() for title/body |
| `src/components/direction-b/BExperience.tsx` | Use tr() for role/body/present/remote |
| `src/components/direction-b/BWhy.tsx` | Use tr() for h/b |
| `src/components/direction-b/BContact.tsx` | Use tr() for status |
| `src/components/direction-b/Portrait.tsx` | Add nav controls + timer reset |

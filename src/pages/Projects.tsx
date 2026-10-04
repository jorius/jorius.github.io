// packages
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../hooks/useMediaQuery';

// utils
import { loadProjects } from '../utils/content';

// components
import { BCardGrid } from '../components/direction-b/BCardGrid';
import { BProjectCard } from '../components/direction-b/BProjectCard';
import { BTopBar } from '../components/direction-b/BTopBar';
import { CommandPalette } from '../components/CommandPalette';
import { PALETTE_SECTIONS } from '../components/direction-b/paletteSections';
import { Glitch } from '../components/primitives/Glitch';
import { Reveal } from '../components/primitives/Reveal';
import { ScanLines } from '../components/primitives/ScanLines';

const Projects = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  const projects = useMemo(() => loadProjects(), []);

  return (
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <BTopBar />

      <article style={{ maxWidth: 1180, margin: '0 auto', padding: isMobile ? '40px 20px 64px 20px' : '64px 32px 96px 32px' }}>

        <Reveal>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(26px, 6vw, 76px)',
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              color: t.ink,
            }}
          >
            <Glitch strong period={5200}>{tr('directionB.projectsPage.title')}</Glitch>
          </h1>
        </Reveal>

        <Reveal delay={80}>
          <p style={{ margin: '20px 0 0 0', maxWidth: 720, fontSize: 14, color: t.dim, lineHeight: 1.6 }}>
            {tr('directionB.projectsPage.intro')}
          </p>
        </Reveal>

        {projects.length === 0 ? (
          <Reveal delay={320}>
            <div style={{ marginTop: 40, fontSize: 13, color: t.dim }}>{tr('directionB.projectsPage.empty')}</div>
          </Reveal>
        ) : (
          <BCardGrid style={{ marginTop: 40 }}>
            {projects.map((p, i) => (
              <BProjectCard key={p.id} p={p} i={i} />
            ))}
          </BCardGrid>
        )}
      </article>

      <CommandPalette sections={PALETTE_SECTIONS} />
      <ScanLines />
    </div>
  );
};

export default Projects;

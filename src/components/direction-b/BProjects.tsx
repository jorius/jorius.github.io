// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import portfolio from '../../data/portfolio.json';

// hooks
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery';

// components
import { BSectionHead } from './BSectionHead';
import { ProjectCard } from './ProjectCard';
import type { IndexProject } from './ProjectCard';

interface PortfolioJsonProject {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  demo: string | null;
}

const flattenPortfolio = (): IndexProject[] => {
  const personal: IndexProject[] = (portfolio.personalProjects as PortfolioJsonProject[]).map((p) => ({
    id: `personal-${p.id}`,
    title: p.title,
    description: p.description,
    tech: p.tech,
    github: p.github,
    demo: p.demo,
    category: 'Personal',
  }));
  const client: IndexProject[] = (portfolio.clientProjects as PortfolioJsonProject[]).map((p) => ({
    id: `client-${p.id}`,
    title: p.title,
    description: p.description,
    tech: p.tech,
    github: p.github,
    demo: p.demo,
    category: 'Client',
  }));
  return [...personal, ...client];
};

export const BProjects = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const projects = flattenPortfolio();

  // Mobile: 1 column. Tablet: 2 columns. Desktop: 3 columns.
  let columnsPerRow = 3;
  if (isMobile) columnsPerRow = 1;
  else if (isTablet) columnsPerRow = 2;

  return (
    <>
      <BSectionHead
        id="b-projects"
        num={tr('directionB.sections.index.num')}
        label={tr('directionB.sections.index.label')}
        kicker={tr('directionB.sections.index.kicker')}
      />
      <div
        style={{
          padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
          gap: 0,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        {projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} t={t} columnsPerRow={columnsPerRow} />
        ))}
      </div>
    </>
  );
};

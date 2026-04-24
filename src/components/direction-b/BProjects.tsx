// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import portfolio from '../../data/portfolio.json';

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
  const projects = flattenPortfolio();
  return (
    <>
      <BSectionHead
        id="b-projects"
        num="04"
        label="INDEX."
        kicker="A shortlist of personal and client projects. Case studies available on request."
      />
      <div
        style={{
          padding: '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        {projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} t={t} />
        ))}
      </div>
    </>
  );
};

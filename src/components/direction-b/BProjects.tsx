// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// components
import { BSectionHead } from './BSectionHead';
import { ProjectCard } from './ProjectCard';

export const BProjects = (): React.ReactElement => {
  const { t } = useBTheme();
  return (
    <>
      <BSectionHead
        id="b-projects"
        num="04"
        label="INDEX."
        kicker="A shortlist of client and personal projects. Case-studies available on request."
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
        {JORIUS.projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} t={t} />
        ))}
      </div>
    </>
  );
};

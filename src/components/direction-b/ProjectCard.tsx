// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import type { ThemeTokens } from '../../contexts/ThemeContext';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { StackChip } from './StackChip';

export interface IndexProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  demo: string | null;
  category: 'Personal' | 'Client';
}

interface ProjectCardProps {
  p: IndexProject;
  i: number;
  t: ThemeTokens;
  columnsPerRow: number;
}

interface ProjectCardCSS extends CSSProperties {
  '--sub'?: string;
  '--ink'?: string;
  '--dim'?: string;
  '--rule'?: string;
  '--rgbB'?: string;
}

export const ProjectCard = ({ p, i, t, columnsPerRow }: ProjectCardProps): React.ReactElement => {
  const { t: tr } = useTranslation();
  const isLastInRow = i % columnsPerRow === columnsPerRow - 1;
  const isMobileCard = columnsPerRow === 1;
  const cardStyle: ProjectCardCSS = {
    padding: isMobileCard ? 16 : 24,
    borderRight: !isLastInRow ? `1px solid ${t.rule}` : 'none',
    borderBottom: `1px solid ${t.rule}`,
    cursor: p.github || p.demo ? 'pointer' : 'default',
    position: 'relative',
    '--sub': t.sub,
    '--ink': t.ink,
    '--dim': t.dim,
    '--rule': t.rule,
    '--rgbB': t.rgbB,
  };
  const externalUrl = p.demo ?? p.github;
  const categoryKey = p.category === 'Personal' ? 'personal' : 'client';
  return (
    <Reveal delay={(i % columnsPerRow) * 70} className="b-index-card" style={cardStyle}>
      <div
        className="b-index-meta"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: t.dim,
          letterSpacing: '0.1em',
          alignItems: 'center',
        }}
      >
        <span>№ {String(i + 1).padStart(2, '0')}</span>
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="b-index-cta"
            style={{ color: t.ink, fontSize: 10, textDecoration: 'none' }}
          >
            {tr('directionB.projects.openCase')}
          </a>
        ) : (
          <span className="b-index-cta" style={{ color: t.dim, fontSize: 10 }}>{tr('directionB.projects.private')}</span>
        )}
        <span>{tr(`directionB.projects.category.${categoryKey}`)}</span>
      </div>
      <div
        className="b-index-thumb"
        style={{
          aspectRatio: '4 / 3',
          marginTop: 14,
          marginBottom: 18,
          border: `1px solid ${t.rule}`,
          backgroundImage: `repeating-linear-gradient(135deg, ${t.scan ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} 0 8px, transparent 8px 16px)`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span style={{ fontSize: 11, color: t.dim, position: 'relative', zIndex: 1 }}>
          [ {tr(`directionB.projects.category.${categoryKey}`).toLowerCase()} {tr('directionB.projects.tagSuffix')} ]
        </span>
        <span
          aria-hidden
          className="b-index-sheen"
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(120deg, transparent 40%, ${t.rgbB}33 50%, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      </div>
      <div style={{ fontSize: isMobileCard ? 22 : 28, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1 }}>
        <Glitch trigger="hover" strong>{p.title}</Glitch>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0 12px 0' }}>
        {p.tech.map((s) => <StackChip key={s} name={s} />)}
      </div>
      <div style={{ fontSize: 13, color: t.ink, lineHeight: 1.55 }}>{p.description}</div>
    </Reveal>
  );
};

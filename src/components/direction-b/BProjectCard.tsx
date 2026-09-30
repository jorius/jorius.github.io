// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBook, FaExternalLinkAlt, FaGithub, FaNpm } from 'react-icons/fa';
import type { IconType } from 'react-icons';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// utils
import { pickLocale } from '../../utils/content';
import type { ProjectEntry, ProjectLinkKind } from '../../utils/content';
import { projectLinkLabel } from '../../utils/projects';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { StackChip } from './StackChip';

interface BProjectCardProps {
  p: ProjectEntry;
  i: number;
  columnsPerRow: number;
}

// The hover rule for .b-index-card in index.html reads --sub.
interface CardCSS extends CSSProperties {
  '--sub'?: string;
}

// One glyph per link kind so a visitor can tell "the source" from "the thing
// running" before reading the label; the trailing arrow stays on every link.
const LINK_ICONS: Record<ProjectLinkKind, IconType> = {
  repo: FaGithub,
  live: FaExternalLinkAlt,
  npm: FaNpm,
  docs: FaBook,
};

export const BProjectCard = ({ p, i, columnsPerRow }: BProjectCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const lang = i18n.language;
  const isLastInRow = i % columnsPerRow === columnsPerRow - 1;
  const isMobileCard = columnsPerRow === 1;
  const cardStyle: CardCSS = {
    padding: isMobileCard ? 16 : 24,
    borderRight: !isLastInRow ? `1px solid ${t.rule}` : 'none',
    borderBottom: `1px solid ${t.rule}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 0,
    '--sub': t.sub,
  };
  const metaStyle: CSSProperties = { fontSize: 11, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };

  return (
    <Reveal delay={(i % columnsPerRow) * 70} className="b-index-card" style={cardStyle}>
      <div style={{ ...metaStyle, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>№ {String(i + 1).padStart(2, '0')}</span>
        <span>
          {tr(`directionB.projectsPage.kind.${p.kind}`)}
          {p.status ? ` · ${tr(`directionB.projectsPage.status.${p.status}`)}` : null}
        </span>
      </div>

      <div style={{ fontSize: isMobileCard ? 22 : 26, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
        <Glitch trigger="hover" strong>{pickLocale(p.title, lang)}</Glitch>
      </div>

      <div style={{ fontSize: 12, color: t.dim }}>{p.year}</div>

      <p style={{ margin: 0, fontSize: 13, color: t.ink, lineHeight: 1.55 }}>{pickLocale(p.summary, lang)}</p>

      {p.details.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12, color: t.dim, lineHeight: 1.5 }}>
          {p.details.map((d) => (
            <li key={d.en}>— {pickLocale(d, lang)}</li>
          ))}
        </ul>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {p.stack.map((s) => <StackChip key={s} name={s} />)}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 'auto', paddingTop: 6 }}>
        {p.links.map((l) => {
          const Icon = LINK_ICONS[l.kind];
          return (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...metaStyle, color: t.ink, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Icon aria-hidden size={12} />
              {projectLinkLabel(l, lang, tr)} ↗
            </a>
          );
        })}
      </div>
    </Reveal>
  );
};

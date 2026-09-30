// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// utils
import { pickLocale } from '../../utils/content';
import type { ProjectEntry } from '../../utils/content';
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

// The hover rules for .b-index-card live in index.html and read these vars.
interface CardCSS extends CSSProperties {
  '--sub'?: string;
  '--ink'?: string;
  '--dim'?: string;
  '--rule'?: string;
  '--rgbB'?: string;
}

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
    '--ink': t.ink,
    '--dim': t.dim,
    '--rule': t.rule,
    '--rgbB': t.rgbB,
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
        {p.links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...metaStyle, color: t.ink, textDecoration: 'none' }}
          >
            {projectLinkLabel(l, lang, tr)} ↗
          </a>
        ))}
      </div>
    </Reveal>
  );
};

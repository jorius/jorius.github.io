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

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { BCard } from './BCard';
import { StackChip } from './StackChip';

interface BProjectCardProps {
  p: ProjectEntry;
  i: number;
}

// One glyph per link kind so a visitor can tell "the source" from "the thing
// running" before reading the label.
const LINK_ICONS: Record<ProjectLinkKind, IconType> = {
  repo: FaGithub,
  live: FaExternalLinkAlt,
  npm: FaNpm,
  docs: FaBook,
};

export const BProjectCard = ({ p, i }: BProjectCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const lang = i18n.language;
  const metaStyle: CSSProperties = { fontSize: 13, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };

  return (
    <BCard index={i}>
      <div style={{ ...metaStyle, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>№ {String(i + 1).padStart(2, '0')}</span>
        <span>
          {tr(`directionB.projectsPage.kind.${p.kind}`)}
          {p.status ? ` · ${tr(`directionB.projectsPage.status.${p.status}`)}` : null}
        </span>
      </div>

      <div style={{ fontSize: 24, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.08, fontWeight: 700 }}>
        <Glitch trigger="hover" strong>{pickLocale(p.title, lang)}</Glitch>
      </div>

      <div style={{ fontSize: 13, color: t.dim }}>{p.year}</div>

      <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, color: t.ink, lineHeight: 1.55 }}>{pickLocale(p.summary, lang)}</p>

      {p.details.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: FONT_BODY, fontSize: 14, color: t.dim, lineHeight: 1.5 }}>
          {p.details.map((d) => (
            <li key={d.en}>— {pickLocale(d, lang)}</li>
          ))}
        </ul>
      ) : null}

      {p.note ? (
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 14, color: t.rgbB, lineHeight: 1.5 }}>{pickLocale(p.note, lang)}</p>
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
              {projectLinkLabel(l, lang, tr)}
            </a>
          );
        })}
      </div>
    </BCard>
  );
};

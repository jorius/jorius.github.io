// packages
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useCardColumns } from '../../hooks/useCardColumns';
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Reveal } from '../primitives/Reveal';

// The .b-index-card rules in index.html paint --paper and, on hover, --sub.
// Both come in as variables: an inline background would outrank the hover rule.
interface CardCSS extends CSSProperties {
  '--paper'?: string;
  '--sub'?: string;
}

interface BCardProps {
  index: number;
  children: ReactNode;
  style?: CSSProperties;
  // When given, the whole cell is a link: a stretched anchor sits under the
  // content and above plain text; link rows inside raise themselves above it.
  href?: string;
  hrefLabel?: string;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

// One cell of a BCardGrid. The cell itself is always opaque paper (the grid
// behind it is rule-coloured to draw the 1px lines, so a transparent cell
// would show as a bright block); only the content fades and slides in.
export const BCard = ({ index, children, style, href, hrefLabel, onMouseEnter, onMouseLeave }: BCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const isMobile = useIsMobile();
  const columns = useCardColumns();
  const cellStyle: CardCSS = {
    '--paper': t.paper,
    padding: isMobile ? 18 : 24,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    position: 'relative',
    '--sub': t.sub,
    ...style,
  };
  return (
    <div className="b-index-card" style={cellStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={hrefLabel} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      ) : null}
      <Reveal delay={(index % columns) * 70} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        {children}
      </Reveal>
    </div>
  );
};

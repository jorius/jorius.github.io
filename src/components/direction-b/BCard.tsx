// packages
import type { CSSProperties, ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useCardColumns } from '../../hooks/useCardColumns';
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Reveal } from '../primitives/Reveal';

// The hover rule for .b-index-card in index.html reads --sub.
interface CardCSS extends CSSProperties {
  '--sub'?: string;
}

interface BCardProps {
  index: number;
  children: ReactNode;
  style?: CSSProperties;
}

// One cell of a BCardGrid. The cell itself is always opaque paper (the grid
// behind it is rule-coloured to draw the 1px lines, so a transparent cell
// would show as a bright block); only the content fades and slides in.
export const BCard = ({ index, children, style }: BCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const isMobile = useIsMobile();
  const columns = useCardColumns();
  const cellStyle: CardCSS = {
    background: t.paper,
    padding: isMobile ? 18 : 24,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    '--sub': t.sub,
    ...style,
  };
  return (
    <div className="b-index-card" style={cellStyle}>
      <Reveal delay={(index % columns) * 70} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        {children}
      </Reveal>
    </div>
  );
};

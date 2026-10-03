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

// One cell of a BCardGrid: paper background (the grid shows through the gaps
// as rules), column flex with a 12px gap, and the shared hover tint.
export const BCard = ({ index, children, style }: BCardProps): React.ReactElement => {
  const { t } = useBTheme();
  const isMobile = useIsMobile();
  const columns = useCardColumns();
  const cardStyle: CardCSS = {
    background: t.paper,
    padding: isMobile ? 18 : 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 0,
    '--sub': t.sub,
    ...style,
  };
  return (
    <Reveal delay={(index % columns) * 70} className="b-index-card" style={cardStyle}>
      {children}
    </Reveal>
  );
};

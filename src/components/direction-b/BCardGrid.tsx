// packages
import { Children } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useCardColumns } from '../../hooks/useCardColumns';

// utils
import { fillerCount } from '../../utils/gridFill';

interface BCardGridProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// The 1px rules between cards come from the grid gap over a rule-coloured
// background, so any column count and any card count draws clean lines with
// no per-card border arithmetic.
export const BCardGrid = ({ children, style }: BCardGridProps): React.ReactElement => {
  const { t } = useBTheme();
  const columns = useCardColumns();
  // Empty tracks in the last row get paper-coloured fillers, or the rule
  // background behind the grid shows as a block there.
  const fillers = fillerCount(Children.count(children), columns);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 1,
        background: t.rule,
        borderTop: `1px solid ${t.rule}`,
        borderBottom: `1px solid ${t.rule}`,
        ...style,
      }}
    >
      {children}
      {Array.from({ length: fillers }, (_, i) => (
        <div key={`filler-${i}`} aria-hidden style={{ background: t.paper }} />
      ))}
    </div>
  );
};

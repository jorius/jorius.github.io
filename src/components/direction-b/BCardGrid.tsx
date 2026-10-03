// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useCardColumns } from '../../hooks/useCardColumns';

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
    </div>
  );
};

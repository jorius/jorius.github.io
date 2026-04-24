// contexts
import { useBTheme } from '../../contexts/ThemeContext';

export const ScanLines = (): React.ReactElement | null => {
  const { t } = useBTheme();
  if (!t.scan) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// packages
import { useEffect, useState } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

export const DarkGrain = (): React.ReactElement | null => {
  const { t } = useBTheme();
  const [flick, setFlick] = useState(1);

  useEffect(() => {
    if (!t.scan) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const loop = (): void => {
      if (!alive) return;
      setFlick(0.97 + Math.random() * 0.06);
      timer = setTimeout(loop, 60 + Math.random() * 140);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [t.scan]);

  if (!t.scan) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 49,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        opacity: flick,
      }}
    />
  );
};

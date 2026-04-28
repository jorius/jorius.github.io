// packages
import { useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

const THRESHOLD = 6;
const NEAR_TOP = 60;

export const useScrollDirection = (): ScrollDirection => {
  const [direction, setDirection] = useState<ScrollDirection>(() =>
    typeof window !== 'undefined' && window.scrollY > NEAR_TOP ? 'down' : 'up'
  );
  const prevY = useRef(0);
  const delta = useRef(0);

  useEffect(() => {
    prevY.current = window.scrollY;
    const onScroll = (): void => {
      const y = window.scrollY;
      if (y < NEAR_TOP) {
        setDirection('up');
        prevY.current = y;
        delta.current = 0;
        return;
      }
      const diff = y - prevY.current;
      delta.current += diff;
      prevY.current = y;
      if (Math.abs(delta.current) >= THRESHOLD) {
        setDirection(delta.current > 0 ? 'down' : 'up');
        delta.current = 0;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
};

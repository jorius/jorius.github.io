// packages
import { useEffect, useState } from 'react';

// Subscribes to a CSS media query and returns whether it currently matches.
// Re-renders only when the match flips (matchMedia change events fire on
// breakpoint cross, not on every resize), so it's safe to call from any
// component without worrying about re-render storms.
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent): void => setMatches(e.matches);
    // The lazy initializer above already set the initial match; the listener
    // covers all subsequent flips. No need to setState() again here.
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Standard breakpoints for the brutalist editorial design.
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)');
export const useIsTablet = (): boolean => useMediaQuery('(max-width: 1023px)');

// hooks
import { useIsMobile, useIsTablet } from './useMediaQuery';

// Column count of a BCardGrid: 3 on desktop, 2 on tablet, 1 on mobile. Cards
// read it to stagger their reveal per column. Lives apart from the grid so
// the grid file exports components only (fast refresh).
export const useCardColumns = (): 1 | 2 | 3 => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  if (isMobile) return 1;
  if (isTablet) return 2;
  return 3;
};

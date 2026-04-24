// packages
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Mounts once at the router level. Whenever the pathname changes (and the
// new URL has no hash anchor target), force the page back to the top — by
// default React Router preserves the previous scroll position, which feels
// broken when you click a link from the bottom of one page and land at the
// bottom of the next.
export const ScrollToTop = (): null => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

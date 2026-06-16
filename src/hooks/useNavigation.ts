// packages
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useScrollToSection = (): ((sectionId: string) => void) => {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback((sectionId: string): void => {
    if (location.pathname === '/') {
      const el = document.querySelector<HTMLElement>(`[data-jump="${sectionId}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  }, [location.pathname, navigate]);
};

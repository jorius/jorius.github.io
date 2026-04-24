// packages
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export const useInView = <T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {},
): [RefObject<T | null>, boolean] => {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, ...options },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [seen, options]);

  return [ref, seen];
};

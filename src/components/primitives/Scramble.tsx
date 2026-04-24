// packages
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

// hooks
import { useInView } from '../../hooks/useInView';

interface ScrambleProps {
  text: string;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#01ΞΔΣ░▒▓';

// Scrambles text briefly when scrolled into view, then resolves to the
// final string character-by-character.
export const Scramble = ({ text, delay = 0, duration = 900, style }: ScrambleProps): React.ReactElement => {
  const [out, setOut] = useState(text);
  const [ref, seen] = useInView<HTMLSpanElement>();

  useEffect(() => {
    if (!seen) return;
    let start = 0;
    let raf = 0;
    const run = (ts: number): void => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start - delay) / duration);
      if (p < 0) {
        raf = requestAnimationFrame(run);
        return;
      }
      const cutoff = Math.floor(p * text.length);
      let s = '';
      for (let i = 0; i < text.length; i += 1) {
        s += i < cutoff
          ? text[i]
          : (text[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]);
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(run);
      else setOut(text);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [seen, text, delay, duration]);

  return <span ref={ref} style={style}>{out}</span>;
};

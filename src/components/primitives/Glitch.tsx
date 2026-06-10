// packages
import { useEffect, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

export type GlitchTrigger = 'ambient' | 'hover' | 'always' | 'off';

interface GlitchProps {
  children: ReactNode;
  as?: ElementType;
  style?: CSSProperties;
  trigger?: GlitchTrigger;
  period?: number;
  strong?: boolean;
  className?: string;
}

// Three stacked layers: the main ink layer plus red/blue channel-split
// copies that jitter on a randomized timer. trigger="hover" only fires on
// mouse enter; "ambient" runs on a randomized schedule scaled by glitch
// intensity; "always" stays on; "off" stays off.
export const Glitch = ({
  children,
  as: As = 'span',
  style,
  trigger = 'ambient',
  period = 5200,
  strong = false,
  className,
}: GlitchProps): React.ReactElement => {
  const { t, glitch, theme } = useBTheme();
  // 'screen' lightens the channel-split copies over the dark paper; on the
  // light paper that washes them out, so 'multiply' (which darkens) is what
  // makes the red/blue split actually visible in the light theme.
  const blendMode: CSSProperties['mixBlendMode'] = theme === 'dark' ? 'screen' : 'multiply';
  const [pulseOn, setPulseOn] = useState(false);
  const [hoverOn, setHoverOn] = useState(false);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (trigger !== 'ambient' || glitch <= 0) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (): void => {
      if (!alive) return;
      const wait = (period * (0.35 + Math.random() * 0.7)) / Math.max(0.2, glitch);
      timer = setTimeout(() => {
        if (!alive) return;
        setPulseOn(true);
        setRev((r) => r + 1);
        timer = setTimeout(() => {
          if (alive) setPulseOn(false);
          schedule();
        }, 420 + Math.random() * 520);
      }, wait);
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
      setPulseOn(false);
    };
  }, [trigger, period, glitch]);

  // Derive on directly from trigger + state. Avoids needing a setState-in-
  // effect to sync external trigger changes.
  let on = false;
  if (trigger === 'always') on = true;
  else if (trigger === 'off') on = false;
  else if (trigger === 'hover') on = hoverOn;
  else on = pulseOn;

  const hoverProps =
    trigger === 'hover'
      ? {
          onMouseEnter: () => {
            setHoverOn(true);
            setRev((r) => r + 1);
          },
          onMouseLeave: () => setHoverOn(false),
        }
      : {};

  const mag = (strong ? 2.6 : 1.4) * (0.5 + glitch * 1.4);
  const seed = rev;
  const jx = on ? Number((Math.sin(seed * 9.1) * 16 * mag).toFixed(2)) : 0;
  const jy = on ? Number((Math.cos(seed * 7.3) * 5 * mag).toFixed(2)) : 0;
  const skew = on ? Number((Math.sin(seed * 2.3) * 2.2).toFixed(2)) : 0;
  const clipA = on
    ? `polygon(0 ${4 + ((seed * 13) % 30)}%, 100% ${4 + ((seed * 13) % 30)}%, 100% ${30 + ((seed * 17) % 30)}%, 0 ${30 + ((seed * 17) % 30)}%)`
    : 'none';
  const clipB = on
    ? `polygon(0 ${48 + ((seed * 11) % 22)}%, 100% ${48 + ((seed * 11) % 22)}%, 100% ${74 + ((seed * 19) % 22)}%, 0 ${74 + ((seed * 19) % 22)}%)`
    : 'none';
  const clipC = on
    ? `polygon(0 ${80 + ((seed * 7) % 14)}%, 100% ${80 + ((seed * 7) % 14)}%, 100% 100%, 0 100%)`
    : 'none';

  const wrapStyle: CSSProperties = { position: 'relative', display: 'inline-block', ...style };
  const layer: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    whiteSpace: 'inherit',
  };

  const Component = As as ElementType;

  return (
    <Component className={className} {...hoverProps} style={wrapStyle}>
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'inline-block',
          transform: on ? `skewX(${skew}deg)` : 'none',
          transition: 'transform 40ms linear',
        }}
      >
        {children}
      </span>
      {on ? (
        <>
          <span
            aria-hidden
            style={{
              ...layer,
              color: t.rgbR,
              transform: `translate(${-jx}px, ${jy}px)`,
              mixBlendMode: blendMode,
              clipPath: clipA,
            }}
          >
            {children}
          </span>
          <span
            aria-hidden
            style={{
              ...layer,
              color: t.rgbB,
              transform: `translate(${jx}px, ${-jy}px)`,
              mixBlendMode: blendMode,
              clipPath: clipB,
            }}
          >
            {children}
          </span>
          <span
            aria-hidden
            style={{
              ...layer,
              color: t.rgbR,
              transform: `translate(${jx * 0.6}px, ${-jy * 0.5}px)`,
              mixBlendMode: blendMode,
              clipPath: clipC,
              opacity: 0.85,
            }}
          >
            {children}
          </span>
          <span
            aria-hidden
            style={{
              ...layer,
              color: t.ink,
              transform: `translate(${jx / 2}px, 0)`,
              clipPath: clipB,
              opacity: 0.75,
            }}
          >
            {children}
          </span>
        </>
      ) : null}
    </Component>
  );
};

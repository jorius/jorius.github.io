// packages
import { useEffect, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

// utils
import { ambientOn, ambientWait, hoverOff, hoverOn } from '../../utils/glitchTiming';

export type GlitchTrigger = 'ambient' | 'hover' | 'always' | 'off';

interface GlitchProps {
  children: ReactNode;
  as?: ElementType;
  style?: CSSProperties;
  trigger?: GlitchTrigger;
  period?: number;
  strong?: boolean;
  className?: string;
  // With trigger="hover": drive the pulses from a parent's hover instead of
  // this element's own (a card whose overlay link covers the title).
  hoverActive?: boolean;
}

// Three stacked layers: the main ink layer plus red/blue channel-split
// copies that jitter on a randomized timer. trigger="hover" runs short
// on/off pulses while the pointer stays; "ambient" runs on a randomized
// schedule scaled by glitch intensity; "always" stays on; "off" stays off.
// With the OS reduce-motion switch on, nothing pulses.
export const Glitch = ({
  children,
  as: As = 'span',
  style,
  trigger = 'ambient',
  period = 5200,
  strong = false,
  className,
  hoverActive,
}: GlitchProps): React.ReactElement => {
  const { t, glitch, glitchRate, glitchChaos, theme } = useBTheme();
  const reduced = usePrefersReducedMotion();
  // 'screen' lightens the channel-split copies over the dark paper; on the
  // light paper that washes them out, so 'multiply' (which darkens) is what
  // makes the red/blue split actually visible in the light theme.
  const blendMode: CSSProperties['mixBlendMode'] = theme === 'dark' ? 'screen' : 'multiply';
  const [pulseOn, setPulseOn] = useState(false);
  const [hoverOn_, setHoverOn] = useState(false);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (trigger !== 'ambient' || glitch <= 0 || reduced) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (): void => {
      if (!alive) return;
      timer = setTimeout(() => {
        if (!alive) return;
        setPulseOn(true);
        setRev((r) => r + 1);
        timer = setTimeout(() => {
          if (alive) setPulseOn(false);
          schedule();
        }, ambientOn(Math.random()));
      }, ambientWait(period, glitch, glitchRate, Math.random()));
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
      setPulseOn(false);
    };
  }, [trigger, period, glitch, glitchRate, reduced]);

  // Hover: while the pointer is over the element, run on/off pulses. The
  // effect owns the timer chain, so leaving or unmounting clears it in one
  // place, and the random durations stay out of render.
  const [hovered, setHovered] = useState(false);
  const hoverState = hoverActive ?? hovered;
  useEffect(() => {
    if (!hoverState || reduced || trigger !== 'hover') return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const pulse = (): void => {
      if (!alive) return;
      setRev((r) => r + 1);
      setHoverOn(true);
      timer = setTimeout(() => {
        if (!alive) return;
        setHoverOn(false);
        timer = setTimeout(pulse, hoverOff(Math.random()));
      }, hoverOn(Math.random()));
    };
    pulse();
    return () => {
      alive = false;
      clearTimeout(timer);
      setHoverOn(false);
    };
  }, [hoverState, reduced, trigger]);

  // Derive on directly from trigger + state. Avoids needing a setState-in-
  // effect to sync external trigger changes.
  let on = false;
  if (trigger === 'always') on = true;
  else if (trigger === 'off') on = false;
  else if (trigger === 'hover') on = hoverOn_;
  else on = pulseOn;

  // Chaos above 1: while a glitch is on, re-seed the slices every few frames
  // so the displacement jumps around instead of holding one shape.
  useEffect(() => {
    if (!on || glitchChaos <= 1) return undefined;
    const id = window.setInterval(() => setRev((r) => r + 1), 70);
    return () => window.clearInterval(id);
  }, [on, glitchChaos]);

  const hoverProps = trigger === 'hover' ? { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) } : {};

  const mag = (strong ? 2.6 : 1.4) * (0.5 + glitch * 1.4) * glitchChaos;
  const seed = rev;
  const jx = on ? Number((Math.sin(seed * 9.1) * 16 * mag).toFixed(2)) : 0;
  const jy = on ? Number((Math.cos(seed * 7.3) * 5 * mag).toFixed(2)) : 0;
  const skew = on ? Number((Math.sin(seed * 2.3) * 2.2 * glitchChaos).toFixed(2)) : 0;
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

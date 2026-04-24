// packages
import { useEffect, useState } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

export const Portrait = (): React.ReactElement => {
  const { t } = useBTheme();
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const loop = (): void => {
      if (!alive) return;
      const wait = 3400 + Math.random() * 4200;
      timer = setTimeout(() => {
        if (!alive) return;
        setGlitching(true);
        setTimeout(() => {
          if (alive) setGlitching(false);
        }, 220 + Math.random() * 260);
        loop();
      }, wait);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const shiftA = glitching ? 'translate(-6px, 2px)' : 'none';
  const shiftB = glitching ? 'translate(6px, -2px)' : 'none';

  return (
    <div
      className="b-hero-portrait"
      style={{
        width: '100%',
        maxWidth: 480,
        aspectRatio: '3 / 4',
        border: `1px solid ${t.rule}`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: t.sub,
      }}
    >
      {/* Placeholder portrait — swap backgroundImage with a real photo URL */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(135deg, ${t.scan ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} 0 6px, transparent 6px 12px), repeating-linear-gradient(0deg, ${t.scan ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'} 0 2px, transparent 2px 4px)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, currentColor 0 6px, transparent 6px 12px)',
          color: t.rgbR,
          mixBlendMode: 'screen',
          opacity: glitching ? 0.35 : 0,
          transform: shiftA,
          transition: 'transform 60ms linear',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, currentColor 0 6px, transparent 6px 12px)',
          color: t.rgbB,
          mixBlendMode: 'screen',
          opacity: glitching ? 0.35 : 0,
          transform: shiftB,
          transition: 'transform 60ms linear',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
          right: 10,
          fontSize: 10,
          color: t.dim,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>EXHIBIT_01</span>
        <span>CATS / 35mm</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          right: 10,
          fontSize: 11,
          color: t.ink,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>my co-workers</span>
        <span style={{ fontSize: 10, color: t.dim }}>[ 2 cats, no bugs ]</span>
      </div>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: t.ink,
          opacity: 0.12,
          top: glitching ? '70%' : '30%',
          transition: 'top 400ms linear',
        }}
      />
    </div>
  );
};

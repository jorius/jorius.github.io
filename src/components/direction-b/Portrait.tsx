// packages
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

interface CatPhoto {
  name: string;
  src: string;
}

const CATS: CatPhoto[] = [
  { name: 'GAS', src: '/images/cats/gas.jpg' },
  { name: 'PANCHO', src: '/images/cats/pancho.jpg' },
  { name: 'ROCKET', src: '/images/cats/rocket.jpeg' },
  { name: 'TACO', src: '/images/cats/taco.jpeg' },
];

export const Portrait = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
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
      {/* 2x2 contact-sheet grid of the four resident cats */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 1,
          background: t.rule,
        }}
      >
        {CATS.map((cat) => (
          <div key={cat.name} style={{ position: 'relative', overflow: 'hidden', background: t.sub }}>
            <img
              src={cat.src}
              alt={cat.name.toLowerCase()}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'grayscale(0.15) contrast(1.05)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                fontSize: 8,
                color: '#f2efe7',
                background: 'rgba(0,0,0,0.55)',
                padding: '2px 4px',
                letterSpacing: '0.12em',
                fontFamily: 'Space Mono, monospace',
              }}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* Top + bottom darkened strips so the framing labels stay readable on any photo */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 32,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 36,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* RGB-split glitch layers (now drawn over the photos) */}
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
          pointerEvents: 'none',
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
          pointerEvents: 'none',
        }}
      />

      {/* Top framing label */}
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
          right: 10,
          fontSize: 10,
          color: '#f2efe7',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'space-between',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
        }}
      >
        <span>{tr('directionB.portrait.exhibit')}</span>
        <span>{tr('directionB.portrait.type')}</span>
      </div>

      {/* Bottom framing label */}
      <div
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          right: 10,
          fontSize: 11,
          color: '#f2efe7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
        }}
      >
        <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tr('directionB.portrait.caption')}</span>
        <span style={{ fontSize: 10, opacity: 0.85 }}>{tr('directionB.portrait.subcaption')}</span>
      </div>

      {/* Roving scan bar that crosses the whole grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: '#f2efe7',
          opacity: 0.18,
          top: glitching ? '70%' : '30%',
          transition: 'top 400ms linear',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// packages
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

interface CatPhoto {
  name: string;
  src: string;
  role: string;
}

const CATS: CatPhoto[] = [
  { name: 'Gasolina', src: '/images/cats/gasolina.jpg', role: 'Lead QA' },
  { name: 'Pancho', src: '/images/cats/pancho.jpg', role: 'CEO' },
  { name: 'Toji', src: '/images/cats/toji.jpg', role: 'CFO' },
  { name: 'Cohete', src: '/images/cats/cohete.jpg', role: 'Right-hand man' },
];

const ROTATION_BASE_MS = 5400;
const ROTATION_JITTER_MS = 1100;
const GLITCH_LEAD_MS = 180;
const GLITCH_DURATION_MS = 320;

export const Portrait = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [glitching, setGlitching] = useState(false);

  // Rotate the visible cat every ~5.5s (with a small random offset so it
  // doesn't feel mechanical). Each rotation fires a brief RGB-split glitch
  // halfway through to mask the crossfade and reinforce the design's
  // glitch language.
  useEffect(() => {
    let alive = true;
    let outerTimer: ReturnType<typeof setTimeout>;
    let glitchOnTimer: ReturnType<typeof setTimeout>;
    let glitchOffTimer: ReturnType<typeof setTimeout>;

    const tick = (): void => {
      if (!alive) return;
      setGlitching(true);
      glitchOnTimer = setTimeout(() => {
        if (!alive) return;
        setActiveIdx((i) => (i + 1) % CATS.length);
        glitchOffTimer = setTimeout(() => {
          if (alive) setGlitching(false);
        }, GLITCH_DURATION_MS - GLITCH_LEAD_MS);
      }, GLITCH_LEAD_MS);
      outerTimer = setTimeout(tick, ROTATION_BASE_MS + Math.random() * ROTATION_JITTER_MS);
    };

    outerTimer = setTimeout(tick, 4200);
    return () => {
      alive = false;
      clearTimeout(outerTimer);
      clearTimeout(glitchOnTimer);
      clearTimeout(glitchOffTimer);
    };
  }, []);

  const activeCat = CATS[activeIdx];
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
      {/* All four cats render stacked so the browser preloads them once;
          opacity flips drive the visible cycle (smooth crossfade) while the
          glitch overlays mask the transition. */}
      {CATS.map((cat, i) => (
        <img
          key={cat.name}
          src={cat.src}
          alt={cat.name}
          loading={i === 0 ? 'eager' : 'lazy'}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: i === activeIdx ? 1 : 0,
            transition: 'opacity 240ms ease',
            filter: 'grayscale(0.1) contrast(1.05)',
          }}
        />
      ))}

      {/* Top + bottom darkened gradients so the framing labels stay readable
          on top of any cat photo */}
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

      {/* RGB-split glitch layers (rendered on top of the photo during a swap) */}
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

      {/* Top framing label — shows the active cat's name as the editorial
          frame ID ("GASOLINA / 35mm") so the rotation always identifies who
          you're looking at. */}
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
        <span>
          {activeCat.name.toUpperCase()} · {activeCat.role.toUpperCase()}
          {tr('directionB.portrait.type')}
        </span>
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

      {/* Roving scan bar — same pulse as before but now the position swap
          coincides with the cat rotation */}
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

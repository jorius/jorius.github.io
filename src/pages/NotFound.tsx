// packages
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../hooks/useMediaQuery';

// components
import { BTopBar } from '../components/direction-b/BTopBar';
import { CommandPalette } from '../components/CommandPalette';
import { PALETTE_SECTIONS } from '../components/direction-b/paletteSections';
import { DarkGrain } from '../components/primitives/DarkGrain';
import { ScanLines } from '../components/primitives/ScanLines';

// Seconds per glitch cycle — all keyframe durations reference this constant.
const PERIOD = 2.4;

const NotFound = (): React.ReactElement => {
  const { t: th, theme } = useBTheme();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // screen blend mode lightens on dark paper; multiply darkens on light paper —
  // same logic used by the Glitch component.
  const blend: React.CSSProperties['mixBlendMode'] =
    theme === 'dark' ? 'screen' : 'multiply';

  const numSize = isMobile
    ? 'clamp(100px, 38vw, 160px)'
    : 'clamp(160px, 30vw, 400px)';

  const ghostLayer: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    fontSize: numSize,
    fontWeight: 700,
    letterSpacing: '-0.04em',
    display: 'block',
    pointerEvents: 'none',
    mixBlendMode: blend,
  };

  return (
    <div
      style={{
        background: th.paper,
        color: th.ink,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: "'Space Mono', ui-monospace, Menlo, monospace",
      }}
    >
      {/* CSS keyframes injected once per render. nf- prefix avoids collisions. */}
      <style>{`
        @keyframes nf-skew {
          0%,69%,100% { transform: skewX(0deg); }
          70%          { transform: skewX(-1.8deg); }
          73%          { transform: skewX(1.2deg); }
          77%          { transform: skewX(-0.4deg); }
          80%          { transform: skewX(0deg); }
        }
        @keyframes nf-r {
          0%,69%,100% { transform:translate(0,0); clip-path:none; opacity:0; }
          70% { transform:translate(-11px,3px); clip-path:polygon(0 10%,100% 10%,100% 36%,0 36%); opacity:1; }
          73% { transform:translate(8px,-2px);  clip-path:polygon(0 56%,100% 56%,100% 76%,0 76%); opacity:1; }
          76% { transform:translate(-6px,1px);  clip-path:polygon(0 0,100% 0,100% 18%,0 18%);     opacity:1; }
          79% { transform:translate(4px,0);     clip-path:polygon(0 82%,100% 82%,100% 100%,0 100%); opacity:1; }
          82% { transform:translate(0,0); clip-path:none; opacity:0; }
        }
        @keyframes nf-b {
          0%,69%,100% { transform:translate(0,0); clip-path:none; opacity:0; }
          70% { transform:translate(11px,-3px); clip-path:polygon(0 36%,100% 36%,100% 56%,0 56%); opacity:1; }
          73% { transform:translate(-8px,2px);  clip-path:polygon(0 76%,100% 76%,100% 94%,0 94%); opacity:1; }
          76% { transform:translate(6px,-1px);  clip-path:polygon(0 18%,100% 18%,100% 40%,0 40%); opacity:1; }
          79% { transform:translate(-4px,0);    clip-path:polygon(0 0,100% 0,100% 8%,0 8%);       opacity:1; }
          82% { transform:translate(0,0); clip-path:none; opacity:0; }
        }
        @keyframes nf-sb {
          0%,69%,100% { opacity:0; top:-200%; }
          70% { opacity:0.8; top:22%; }
          72% { top:68%; }
          75% { top:45%; opacity:0.5; }
          78% { opacity:0; }
        }
      `}</style>

      <ScanLines />
      <DarkGrain />
      <BTopBar />

      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: isMobile ? '32px 24px 48px' : '0 32px 64px',
        }}
      >
        {/* Small uppercase label */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: th.dim,
            marginBottom: isMobile ? 16 : 20,
          }}
        >
          {t('notFound.errorLabel')}
        </p>

        {/* Glitching "404" — three stacked layers */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            lineHeight: 0.85,
            marginBottom: isMobile ? 24 : 36,
            userSelect: 'none',
          }}
        >
          {/* Red channel ghost */}
          <span
            aria-hidden
            style={{
              ...ghostLayer,
              color: th.rgbR,
              animation: `nf-r ${PERIOD}s steps(1) infinite`,
            }}
          >
            404
          </span>

          {/* Main ink layer */}
          <span
            style={{
              fontSize: numSize,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: th.ink,
              position: 'relative',
              zIndex: 2,
              display: 'block',
              animation: `nf-skew ${PERIOD}s steps(1) infinite`,
            }}
          >
            404
          </span>

          {/* Blue channel ghost */}
          <span
            aria-hidden
            style={{
              ...ghostLayer,
              color: th.rgbB,
              animation: `nf-b ${PERIOD}s steps(1) infinite`,
            }}
          >
            404
          </span>

          {/* Scan bar artifacts */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '-5%',
              width: '110%',
              height: 2,
              background: th.rgbR,
              mixBlendMode: blend,
              pointerEvents: 'none',
              animation: `nf-sb ${PERIOD}s linear infinite`,
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '-5%',
              width: '110%',
              height: 2,
              background: th.rgbB,
              mixBlendMode: blend,
              pointerEvents: 'none',
              animation: `nf-sb ${PERIOD}s linear 0.08s infinite`,
            }}
          />
        </div>

        {/* "NOT FOUND." title */}
        <p
          style={{
            fontSize: isMobile ? 22 : 'clamp(22px, 3vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            marginBottom: 14,
          }}
        >
          {t('notFound.title')}
        </p>

        {/* Body copy */}
        <p
          style={{
            fontSize: 13,
            color: th.dim,
            lineHeight: 1.75,
            maxWidth: '44ch',
            margin: '0 auto 32px',
          }}
        >
          {t('notFound.body')}
        </p>

        {/* Home link */}
        <Link
          to="/"
          style={{
            display: 'inline-block',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: th.ink,
            textDecoration: 'none',
            border: `1px solid ${th.rule}`,
            padding: isMobile ? '10px 18px' : '10px 22px',
          }}
        >
          {t('notFound.home')}
        </Link>
      </section>

      <CommandPalette sections={PALETTE_SECTIONS} />
    </div>
  );
};

export default NotFound;

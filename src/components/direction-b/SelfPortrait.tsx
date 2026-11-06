// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

const SRC = '/images/jose.jpg';
const LABEL_INK = '#f2efe7';
const LABEL_SHADOW = '0 1px 2px rgba(0,0,0,0.6)';

// Jose's own frame, set over the corner of the cats' rotating Portrait: a print with a paper
// border and a shadow, the same gradients and framing labels, a single still photo (EXHIBIT_00).
export const SelfPortrait = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();

  return (
    <figure
      className="b-hero-self"
      style={{
        margin: 0,
        width: '100%',
        aspectRatio: '3 / 4',
        border: `4px solid ${t.paper}`,
        outline: `1px solid ${t.rule}`,
        boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: t.sub,
      }}
    >
      <img
        src={SRC}
        alt={JORIUS.name}
        loading="eager"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(0.1) contrast(1.05)' }}
      />

      {/* Darkened top and bottom so the framing labels read on the white shirt and wall */}
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 32, background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 36, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)', pointerEvents: 'none' }} />

      <div
        style={{
          position: 'absolute', left: 8, top: 8, right: 8, fontSize: 9, color: LABEL_INK, letterSpacing: '0.12em',
          textTransform: 'uppercase', textShadow: LABEL_SHADOW, pointerEvents: 'none',
        }}
      >
        <span>{tr('directionB.portrait.exhibit')}00</span>
      </div>

      <figcaption
        style={{
          position: 'absolute', left: 8, bottom: 8, right: 8, fontSize: 10, color: LABEL_INK, display: 'flex',
          justifyContent: 'space-between', alignItems: 'baseline', textShadow: LABEL_SHADOW, pointerEvents: 'none',
        }}
      >
        <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tr('directionB.self.caption')}</span>
        <span style={{ fontSize: 9, opacity: 0.85 }}>{tr('directionB.self.subcaption')}</span>
      </figcaption>
    </figure>
  );
};

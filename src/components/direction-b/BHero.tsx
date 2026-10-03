// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { TypedCaret } from '../primitives/TypedCaret';
import { Portrait } from './Portrait';

const WHATSAPP_HREF = `https://wa.me/${JORIUS.whatsapp.replace(/[^0-9]/g, '')}`;
const BOOKING_HREF = 'https://cal.com/jorius';

// "Jose Ríos" → ["JOSE", "RÍOS"]: one headline line per word.
const NAME_LINES = JORIUS.name.toUpperCase().split(' ');

export const BHero = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();

  const button: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '13px 20px',
    fontSize: 13,
    letterSpacing: '0.06em',
    textDecoration: 'none',
    border: `1px solid ${t.ink}`,
    whiteSpace: 'nowrap',
  };
  const filled: CSSProperties = { ...button, background: t.ink, color: t.paper };
  const outlined: CSSProperties = { ...button, background: 'transparent', color: t.ink };

  return (
    <section
      style={{
        borderBottom: `1px solid ${t.rule}`,
        padding: isMobile ? '36px 20px 32px 20px' : '56px 32px 48px 32px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr clamp(280px, 32vw, 480px)',
        gap: isMobile ? 28 : 40,
        alignItems: 'end',
      }}
    >
      <div style={{ minWidth: 0, display: 'grid', gap: 22 }}>
        <p
          style={{
            margin: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px 10px',
            fontSize: 13,
            color: t.dim,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          <span>{tr('directionB.hero.eyebrow')}</span>
          <span style={{ color: t.ink, border: `1px solid ${t.ink}`, padding: '4px 9px', fontWeight: 700 }}>{tr('directionB.hero.anywhere')}</span>
          <span>{tr('directionB.hero.tz')}</span>
        </p>

        <h1 style={{ margin: 0, fontSize: 'clamp(56px, 11vw, 168px)', lineHeight: 0.86, letterSpacing: '-0.045em', fontWeight: 700, color: t.ink }}>
          {NAME_LINES.map((line, i) => (
            <span key={line} style={{ display: 'block' }}>
              <Glitch strong period={i === 0 ? 4200 : 5000}>{line}</Glitch>
              {i === NAME_LINES.length - 1 ? <TypedCaret /> : null}
            </span>
          ))}
        </h1>

        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.5, maxWidth: '56ch', color: t.ink }}>
          {tr('directionB.hero.intro')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a href={`mailto:${JORIUS.email}`} style={filled}>
            <FaEnvelope aria-hidden style={{ width: 16, height: 16 }} />
            <Glitch trigger="hover">{tr('directionB.hero.writeMe')}</Glitch>
          </a>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tr('directionB.hero.whatsapp')} ${JORIUS.whatsapp}`}
            title={`${tr('directionB.hero.whatsapp')} ${JORIUS.whatsapp}`}
            style={outlined}
          >
            <FaWhatsapp aria-hidden style={{ width: 16, height: 16 }} />
            <Glitch trigger="hover">{tr('directionB.hero.whatsapp')}</Glitch>
          </a>
          <a href={BOOKING_HREF} target="_blank" rel="noopener noreferrer" style={outlined}>
            <FaCalendarAlt aria-hidden style={{ width: 16, height: 16 }} />
            <Glitch trigger="hover">{tr('directionB.hero.book')}</Glitch>
          </a>
        </div>

        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.6, maxWidth: '62ch', color: t.ink }}>
          {tr('directionB.hero.body')}
        </p>
      </div>

      <div style={isMobile ? { display: 'flex', justifyContent: 'center' } : { justifySelf: 'end', width: '100%' }}>
        <div style={isMobile ? { width: '100%', maxWidth: 360 } : { width: '100%' }}>
          <Portrait />
        </div>
      </div>
    </section>
  );
};

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

// "JOSE RÍOS", one line, never wrapped: the size scales with the viewport.
const NAME = JORIUS.name.toUpperCase();

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

  // A square as tall as the whole headline line, butted against the last
  // letter with no gap or border, so name and photo read as one bar. Until
  // JORIUS.portrait points at a file it shows a hatched placeholder.
  const nameSquare: CSSProperties = {
    display: 'block',
    width: '0.9em',
    alignSelf: 'stretch',
    background: t.sub,
    backgroundImage: `repeating-linear-gradient(135deg, ${t.ink}14 0 0.06em, transparent 0.06em 0.12em)`,
    objectFit: 'cover',
    flexShrink: 0,
  };
  const outlined: CSSProperties = { ...button, background: 'transparent', color: t.ink };

  return (
    <section
      style={{
        borderBottom: `1px solid ${t.rule}`,
        // Wider side padding than the sections below so the text block and the
        // portrait both sit in from the edges; the text centres on the portrait.
        padding: isMobile ? '36px 20px 32px 20px' : '56px clamp(32px, 6vw, 96px) 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr clamp(280px, 32vw, 480px)',
        gap: isMobile ? 28 : 48,
        alignItems: 'center',
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

        <h1 style={{ margin: 0, display: 'flex', alignItems: 'stretch', fontSize: 'clamp(44px, 8.6vw, 132px)', lineHeight: 0.9, letterSpacing: '-0.045em', fontWeight: 700, color: t.ink, whiteSpace: 'nowrap' }}>
          <Glitch strong period={4200}>{NAME}</Glitch>
          {JORIUS.portrait ? (
            <img src={JORIUS.portrait} alt={JORIUS.name} style={{ ...nameSquare, backgroundImage: 'none' }} />
          ) : (
            <span aria-hidden style={nameSquare} />
          )}
          <span style={{ alignSelf: 'center' }}><TypedCaret /></span>
        </h1>

        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.5, maxWidth: '56ch', color: t.ink }}>
          {tr('directionB.hero.intro')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {/* Owner's order (2026-10-04): WhatsApp first and filled, then booking, then email. */}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tr('directionB.hero.whatsapp')} ${JORIUS.whatsapp}`}
            title={`${tr('directionB.hero.whatsapp')} ${JORIUS.whatsapp}`}
            style={filled}
          >
            <FaWhatsapp aria-hidden style={{ width: 16, height: 16 }} />
            <Glitch trigger="hover">{tr('directionB.hero.whatsapp')}</Glitch>
          </a>
          <a href={BOOKING_HREF} target="_blank" rel="noopener noreferrer" style={outlined}>
            <FaCalendarAlt aria-hidden style={{ width: 16, height: 16 }} />
            <Glitch trigger="hover">{tr('directionB.hero.book')}</Glitch>
          </a>
          <a href={`mailto:${JORIUS.email}`} style={outlined}>
            <FaEnvelope aria-hidden style={{ width: 16, height: 16 }} />
            <Glitch trigger="hover">{tr('directionB.hero.writeMe')}</Glitch>
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

// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile, useIsTablet, useMediaQuery } from '../../hooks/useMediaQuery';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { TypedCaret } from '../primitives/TypedCaret';
import { Portrait } from './Portrait';
import { SelfPortrait } from './SelfPortrait';

const WHATSAPP_HREF = `https://wa.me/${JORIUS.whatsapp.replace(/[^0-9]/g, '')}`;
const BOOKING_HREF = 'https://cal.com/jorius';

// "JOSE RÍOS", one line, never wrapped: the size scales with the viewport.
const NAME = JORIUS.name.toUpperCase();

// The portrait column's width: the cats' Portrait fills it, and Jose's frame is sized from it.
const DESKTOP_COLUMN = 'clamp(260px, 29vw, 440px)';
const MOBILE_COLUMN = 'min(330px, 100vw - 40px)';

// Jose's frame overlaps the cats' lower-left corner and reaches out past their outer edge, as far
// as the text column allows at each width (measured clear of the hero text at 360-1920px). The frame
// is `width` x 4/3 tall and hangs below the cats by the translateY share of that height; `overhang`
// is that drop as a multiple of the portrait column's width, added to the hero's bottom padding so
// the frame stays inside the hero without changing the columns' vertical centring.
interface Pin { width: number; x: number; y: number }
const PINS: Record<'mobile' | 'tablet' | 'desktop' | 'laptop' | 'wide', Pin> = {
  mobile: { width: 52, x: -12, y: 30 },
  tablet: { width: 56, x: -10, y: 28 },
  desktop: { width: 60, x: -18, y: 30 },
  laptop: { width: 66, x: -40, y: 40 },
  wide: { width: 66, x: -70, y: 40 },
};

const pinnedFrame = (bp: { isMobile: boolean; isTablet: boolean; isLaptop: boolean; isWide: boolean }): { frame: CSSProperties; overhang: number } => {
  const key = bp.isMobile ? 'mobile' : bp.isTablet ? 'tablet' : bp.isWide ? 'wide' : bp.isLaptop ? 'laptop' : 'desktop';
  const { width, x, y } = PINS[key];
  return { frame: { width: `${width}%`, transform: `translate(${x}%, ${y}%)` }, overhang: ((width / 100) * 4) / 3 * (y / 100) };
};

export const BHero = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLaptop = useMediaQuery('(min-width: 1280px)');
  const isWide = useMediaQuery('(min-width: 1440px)');
  const pin = pinnedFrame({ isMobile, isTablet, isLaptop, isWide });

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
        // Wider side padding than the sections below so the text block and the
        // portrait both sit in from the edges; the text centres on the portrait.
        padding: isMobile
          ? `36px 20px calc(32px + ${pin.overhang.toFixed(3)} * ${MOBILE_COLUMN}) 20px`
          : `56px clamp(32px, 6vw, 96px) calc(48px + ${pin.overhang.toFixed(3)} * ${DESKTOP_COLUMN})`,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `1fr ${DESKTOP_COLUMN}`,
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

        <h1 style={{ margin: 0, fontSize: 'clamp(44px, 8.6vw, 162px)', lineHeight: 0.9, letterSpacing: '-0.045em', fontWeight: 700, color: t.ink, whiteSpace: 'nowrap' }}>
          <Glitch strong period={4200}>{NAME}</Glitch>
          <TypedCaret />
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
        {/* The cats' rotation keeps the column; Jose's own frame is pinned over its lower-left corner. */}
        <div style={{ position: 'relative', width: '100%', maxWidth: isMobile ? 330 : undefined }}>
          <Portrait />
          <div style={{ position: 'absolute', left: 0, bottom: 0, zIndex: 2, ...pin.frame }}>
            <SelfPortrait />
          </div>
        </div>
      </div>
    </section>
  );
};

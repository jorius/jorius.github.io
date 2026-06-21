// packages
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useScrollToSection } from '../../hooks/useNavigation';

// utils
import { currentQuarter, currentYear } from '../../utils/dateLabels';

// components
import { Glitch } from '../primitives/Glitch';

const NAV_KEYS = ['now', 'work', 'record', 'writing', 'contact'] as const;
const NAV_TARGETS: Record<(typeof NAV_KEYS)[number], string> = {
  now: 'b-now',
  work: 'b-services',
  record: 'b-experience',
  writing: 'b-writing',
  contact: 'b-contact',
};

export const BTopBar = (): React.ReactElement => {
  const { t, i18n } = useTranslation();
  const { t: th, theme, toggleTheme } = useBTheme();
  const scrollToSection = useScrollToSection();
  const scrollDir = useScrollDirection();
  const visible = scrollDir === 'up';
  const isMobile = useIsMobile();
  const [menuRequested, setMenuRequested] = useState(false);
  // Derive the visible-open state from isMobile so we never need an effect
  // to "close on resize past breakpoint" — the menu is implicitly closed
  // any time we're not in the mobile breakpoint.
  const menuOpen = isMobile && menuRequested;

  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const otherLang = lang === 'es' ? 'en' : 'es';
  const switchLang = (): void => {
    i18n.changeLanguage(otherLang);
  };

  const navLinks = NAV_KEYS.map((key) => (
    <a
      key={key}
      href={`#${NAV_TARGETS[key]}`}
      onClick={(e) => {
        e.preventDefault();
        setMenuRequested(false);
        scrollToSection(NAV_TARGETS[key]);
      }}
      style={{
        color: th.ink,
        textDecoration: 'none',
        letterSpacing: '0.04em',
        padding: isMobile ? '12px 0' : 0,
        fontSize: isMobile ? 14 : 12,
        borderBottom: isMobile ? `1px solid ${th.sub}` : 'none',
      }}
    >
      <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}</Glitch>
    </a>
  ));

  const utilities = (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: th.dim }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#4ADE80',
            boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)',
            display: 'inline-block',
          }}
        />
        {' '}{t('directionB.topbar.available')} · {currentQuarter()}
      </span>
      <button
        type="button"
        onClick={switchLang}
        aria-label={t('directionB.topbar.languageToggle.label')}
        title={t('directionB.topbar.languageToggle.label')}
        style={{
          background: 'transparent',
          border: `1px solid ${th.rule}`,
          color: th.ink,
          padding: '3px 9px',
          fontSize: 11,
          cursor: 'pointer',
          fontFamily: 'inherit',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {otherLang}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="toggle theme"
        style={{
          background: 'transparent',
          border: `1px solid ${th.rule}`,
          color: th.ink,
          padding: '3px 9px',
          fontSize: 11,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {theme === 'dark' ? t('directionB.topbar.themeToggle.toLight') : t('directionB.topbar.themeToggle.toDark')}
      </button>
      {!isMobile ? (
        <span style={{ color: th.dim, fontSize: 12 }}>
          {t('directionB.topbar.pressKey')}{' '}
          <kbd style={{ border: `1px solid ${th.rule}`, padding: '0 6px', color: th.ink }}>/</kbd>
        </span>
      ) : null}
    </>
  );

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: theme === 'dark' ? 'rgba(11,11,11,0.85)' : 'rgba(239,236,228,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${th.rule}`,
        color: th.ink,
        fontSize: 12,
        willChange: 'transform',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 260ms ease',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto 1fr',
          alignItems: 'center',
          padding: isMobile ? '14px 20px' : '14px 32px',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 20, color: th.dim, alignItems: 'baseline' }}>
          <Link to="/" style={{ textDecoration: 'none', color: th.ink }} aria-label="Home">
            <Glitch trigger="hover" style={{ color: th.ink, fontWeight: 700, letterSpacing: '0.04em' }}>
              JORIUS
            </Glitch>
          </Link>
          {!isMobile ? <span>{t('directionB.topbar.volume')}{currentYear()}</span> : null}
        </div>

        {!isMobile ? (
          <nav style={{ display: 'flex', gap: 22 }}>
            {navLinks}
          </nav>
        ) : null}

        {!isMobile ? (
          <div
            style={{
              textAlign: 'right',
              color: th.dim,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 14,
              alignItems: 'center',
            }}
          >
            {utilities}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMenuRequested((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'transparent',
              border: `1px solid ${th.rule}`,
              color: th.ink,
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'inherit',
            }}
          >
            {menuOpen ? <FaTimes aria-hidden style={{ width: 14, height: 14 }} /> : <FaBars aria-hidden style={{ width: 14, height: 14 }} />}
          </button>
        )}
      </div>

      {/* Mobile slide-down panel */}
      {isMobile && menuOpen ? (
        <div
          style={{
            borderTop: `1px solid ${th.rule}`,
            background: theme === 'dark' ? 'rgba(11,11,11,0.97)' : 'rgba(239,236,228,0.97)',
            padding: '8px 20px 20px 20px',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {navLinks}
          </nav>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid ${th.sub}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            {utilities}
          </div>
        </div>
      ) : null}
    </div>
  );
};

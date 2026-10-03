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
import { track } from '../../utils/analytics';
import { currentQuarter, currentYear } from '../../utils/dateLabels';

// components
import { Glitch } from '../primitives/Glitch';

// Anchors on the landing; "writing" is a route and sits between record and
// contact in the bar.
type AnchorKey = 'now' | 'work' | 'record' | 'contact';
const ANCHOR_TARGETS: Record<AnchorKey, string> = {
  now: 'b-now',
  work: 'b-services',
  record: 'b-experience',
  contact: 'b-contact',
};
const DARK_GALAXY_PURPLE = '#9D4EDD';
const AVAILABLE_GREEN = '#4ADE80';

const Dot = ({ color }: { color: string }): React.ReactElement => (
  <span
    aria-hidden
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 8px ${color}`,
      marginRight: 8,
      verticalAlign: 'middle',
      position: 'relative',
      top: -1,
    }}
  />
);

const buttonStyle = (rule: string, ink: string): React.CSSProperties => ({
  background: 'transparent',
  border: `1px solid ${rule}`,
  color: ink,
  padding: '3px 9px',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

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
    track('language-switch', { to: otherLang });
    i18n.changeLanguage(otherLang);
  };
  const switchTheme = (): void => {
    track('theme-toggle', { to: theme === 'dark' ? 'light' : 'dark' });
    toggleTheme();
  };

  const linkStyle: React.CSSProperties = {
    color: th.ink,
    textDecoration: 'none',
    letterSpacing: '0.04em',
    padding: isMobile ? '12px 0' : 0,
    fontSize: isMobile ? 14 : 13,
    borderBottom: isMobile ? `1px solid ${th.sub}` : 'none',
  };

  const anchor = (key: AnchorKey): React.ReactElement => (
    <a
      key={key}
      href={`#${ANCHOR_TARGETS[key]}`}
      onClick={(e) => {
        e.preventDefault();
        setMenuRequested(false);
        scrollToSection(ANCHOR_TARGETS[key]);
      }}
      style={linkStyle}
    >
      <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}</Glitch>
    </a>
  );
  const route = (key: 'writing' | 'projects' | 'darkgalaxy', to: string, dot?: string): React.ReactElement => (
    <Link key={key} to={to} onClick={() => setMenuRequested(false)} style={linkStyle}>
      {dot ? <Dot color={dot} /> : null}
      <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}{key === 'darkgalaxy' ? ' ↗' : ''}</Glitch>
    </Link>
  );

  const leftLinks = [anchor('now'), anchor('work'), anchor('record'), route('writing', '/writing'), anchor('contact')];
  const rightLinks = [route('projects', '/projects'), route('darkgalaxy', '/darkgalaxy', DARK_GALAXY_PURPLE)];

  // The designer's proposal: the brand and its volume line sit between the
  // two link groups, out of the corner the review marked unreadable.
  const brand = (
    <Link
      to="/"
      aria-label="Home"
      style={{ textDecoration: 'none', color: th.ink, display: 'grid', justifyItems: isMobile ? 'start' : 'center', gap: 2, lineHeight: 1.1 }}
    >
      <Glitch trigger="hover" style={{ fontWeight: 700, letterSpacing: '0.08em', fontSize: 14 }}>JORIUS</Glitch>
      <span style={{ fontSize: 12, color: th.dim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {t('directionB.topbar.volume')}{currentYear()}
      </span>
    </Link>
  );

  const utilities = (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 13, color: th.ink }}>
        <Dot color={AVAILABLE_GREEN} />
        {t('directionB.topbar.available')} · {currentQuarter()}
      </span>
      <button
        type="button"
        onClick={switchLang}
        aria-label={t('directionB.topbar.languageToggle.label')}
        title={t('directionB.topbar.languageToggle.label')}
        style={buttonStyle(th.rule, th.ink)}
      >
        {otherLang}
      </button>
      <button type="button" onClick={switchTheme} aria-label="toggle theme" style={buttonStyle(th.rule, th.ink)}>
        {theme === 'dark' ? t('directionB.topbar.themeToggle.toLight') : t('directionB.topbar.themeToggle.toDark')}
      </button>
    </>
  );

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: theme === 'dark' ? 'rgba(41,41,41,0.88)' : 'rgba(239,236,228,0.88)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${th.rule}`,
        color: th.ink,
        fontSize: 13,
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
          padding: isMobile ? '10px 20px' : '10px 32px',
          gap: 16,
        }}
      >
        {isMobile ? brand : <nav style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>{leftLinks}</nav>}

        {!isMobile ? brand : null}

        {!isMobile ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            {rightLinks}
            {utilities}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMenuRequested((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{ ...buttonStyle(th.rule, th.ink), width: 36, height: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
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
            background: theme === 'dark' ? 'rgba(41,41,41,0.97)' : 'rgba(239,236,228,0.97)',
            padding: '8px 20px 20px 20px',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {leftLinks}
            {rightLinks}
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

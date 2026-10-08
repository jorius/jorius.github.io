// packages
import { useState } from 'react';
import type { CSSProperties } from 'react';
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
import { currentQuarter } from '../../utils/dateLabels';

// components
import { Glitch } from '../primitives/Glitch';
import { KnightMark } from './KnightMark';

// Anchors on the landing, in page order; the two inner pages follow them.
type AnchorKey = 'work' | 'record' | 'now' | 'contact';
const ANCHOR_TARGETS: Record<AnchorKey, string> = {
  work: 'b-services',
  record: 'b-experience',
  now: 'b-now',
  contact: 'b-contact',
};
const DARK_GALAXY_PURPLE = '#9D4EDD';
// The game is its own Pages site next to this one; the ring takes its score gold.
const NONE_SHALL_PASS_URL = 'https://jorius.github.io/none-shall-pass/';
const NONE_SHALL_PASS_GOLD = '#d9b44a';
const AVAILABLE_GREEN = '#4ADE80';

// The .b-dot keyframes in index.html read the two ring colours from here.
interface DotCSS extends CSSProperties {
  '--dot-a'?: string;
  '--dot-b'?: string;
}

// A status dot that sits on the text's centre line and pulses a soft ring.
const Dot = ({ color }: { color: string }): React.ReactElement => {
  const style: DotCSS = {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    marginRight: 8,
    flexShrink: 0,
    '--dot-a': `${color}99`,
    '--dot-b': `${color}00`,
  };
  return <span aria-hidden className="b-dot" style={style} />;
};

const buttonStyle = (rule: string, ink: string): CSSProperties => ({
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

  const linkStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
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
      <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}</Glitch>
    </Link>
  );

  // A link that leaves the SPA (the outbound tracker in main.tsx counts the click).
  const external = (key: 'noneShallPass', href: string, mark: React.ReactNode): React.ReactElement => (
    <a key={key} href={href} onClick={() => setMenuRequested(false)} style={linkStyle}>
      {mark}
      <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}</Glitch>
    </a>
  );

  // Left: the landing in page order, then the two inner pages. Right: the game,
  // Dark Galaxy, a rule, the two toggles (owner, 2026-10-04). No brand block.
  const leftLinks = [anchor('work'), anchor('record'), anchor('now'), anchor('contact'), route('projects', '/projects'), route('writing', '/writing')];
  const noneShallPass = external('noneShallPass', NONE_SHALL_PASS_URL, <KnightMark ring={NONE_SHALL_PASS_GOLD} />);
  const darkGalaxy = route('darkgalaxy', '/darkgalaxy', DARK_GALAXY_PURPLE);

  const availability = (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: isMobile ? 14 : 13, color: th.ink }}>
      <Dot color={AVAILABLE_GREEN} />
      {t('directionB.topbar.available')} · {currentQuarter()}
    </span>
  );

  const toggles = (
    <>
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
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          padding: isMobile ? '10px 20px' : '12px 32px',
          gap: 16,
        }}
      >
        {isMobile ? availability : (
          <nav style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center' }}>
            {leftLinks}
            {availability}
          </nav>
        )}

        {!isMobile ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {noneShallPass}
            {darkGalaxy}
            <span aria-hidden style={{ width: 1, height: 18, background: th.rule, opacity: 0.45, margin: '0 8px' }} />
            {toggles}
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
            {noneShallPass}
            {darkGalaxy}
          </nav>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid ${th.sub}`,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
            }}
          >
            {toggles}
          </div>
        </div>
      ) : null}
    </div>
  );
};

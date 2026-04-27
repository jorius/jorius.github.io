// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useScrollDirection } from '../../hooks/useScrollDirection';

// components
import { Glitch } from '../primitives/Glitch';

const NAV_KEYS = ['now', 'work', 'record', 'index', 'writing', 'contact'] as const;
const NAV_TARGETS: Record<(typeof NAV_KEYS)[number], string> = {
  now: 'b-now',
  work: 'b-services',
  record: 'b-experience',
  index: 'b-projects',
  writing: 'b-writing',
  contact: 'b-contact',
};

export const BTopBar = (): React.ReactElement => {
  const { t, i18n } = useTranslation();
  const { t: th, theme, toggleTheme } = useBTheme();
  const scrollDir = useScrollDirection();
  const visible = scrollDir === 'up';
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const otherLang = lang === 'es' ? 'en' : 'es';
  const switchLang = (): void => {
    i18n.changeLanguage(otherLang);
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: theme === 'dark' ? 'rgba(11,11,11,0.85)' : 'rgba(239,236,228,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${th.rule}`,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '14px 32px',
        fontSize: 12,
        color: th.ink,
        willChange: 'transform',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 260ms ease',
      }}
    >
      <div style={{ display: 'flex', gap: 20, color: th.dim, alignItems: 'baseline' }}>
        <Glitch trigger="hover" style={{ color: th.ink, fontWeight: 700, letterSpacing: '0.04em' }}>
          JORIUS
        </Glitch>
        <span>{t('directionB.topbar.volume')}</span>
      </div>
      <nav style={{ display: 'flex', gap: 22 }}>
        {NAV_KEYS.map((key) => (
          <a
            key={key}
            href={`#${NAV_TARGETS[key]}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector(`[data-jump="${NAV_TARGETS[key]}"]`)
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ color: th.ink, textDecoration: 'none', letterSpacing: '0.04em' }}
          >
            <Glitch trigger="hover">{t(`directionB.topbar.nav.${key}`)}</Glitch>
          </a>
        ))}
      </nav>
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
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
          {' '}{t('directionB.topbar.available')} · Q3 2026
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
        <span style={{ color: th.dim }}>
          {t('directionB.topbar.pressKey')}{' '}
          <kbd style={{ border: `1px solid ${th.rule}`, padding: '0 6px', color: th.ink }}>/</kbd>
        </span>
      </div>
    </div>
  );
};

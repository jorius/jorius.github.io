// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// components
import { Glitch } from '../primitives/Glitch';

const NAV_LINKS: ReadonlyArray<readonly [string, string]> = [
  ['Now', 'b-now'],
  ['Work', 'b-services'],
  ['Record', 'b-experience'],
  ['Index', 'b-projects'],
  ['Writing', 'b-writing'],
  ['Contact', 'b-contact'],
];

export const BTopBar = (): React.ReactElement => {
  const { t, theme, toggleTheme } = useBTheme();
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: theme === 'dark' ? 'rgba(11,11,11,0.85)' : 'rgba(239,236,228,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${t.rule}`,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '14px 32px',
        fontSize: 12,
        color: t.ink,
      }}
    >
      <div style={{ display: 'flex', gap: 20, color: t.dim, alignItems: 'baseline' }}>
        <Glitch trigger="hover" style={{ color: t.ink, fontWeight: 700, letterSpacing: '0.04em' }}>
          JORIUS
        </Glitch>
        <span>Vol. X · 2026</span>
      </div>
      <nav style={{ display: 'flex', gap: 22 }}>
        {NAV_LINKS.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector(`[data-jump="${id}"]`)
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ color: t.ink, textDecoration: 'none', letterSpacing: '0.04em' }}
          >
            <Glitch trigger="hover">{label}</Glitch>
          </a>
        ))}
      </nav>
      <div
        style={{
          textAlign: 'right',
          color: t.dim,
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
          {' '}Available · Q3 2026
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="toggle theme"
          style={{
            background: 'transparent',
            border: `1px solid ${t.rule}`,
            color: t.ink,
            padding: '3px 9px',
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {theme === 'dark' ? '☀ LIGHT' : '☾ DARK'}
        </button>
        <span style={{ color: t.dim }}>
          press{' '}
          <kbd style={{ border: `1px solid ${t.rule}`, padding: '0 6px', color: t.ink }}>/</kbd>
        </span>
      </div>
    </div>
  );
};

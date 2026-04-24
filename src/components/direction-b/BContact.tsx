// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// components
import { Glitch } from '../primitives/Glitch';
import { TypedCaret } from '../primitives/TypedCaret';

export const BContact = (): React.ReactElement => {
  const { t } = useBTheme();
  return (
    <section
      data-jump="b-contact"
      style={{ borderTop: `1px solid ${t.rule}`, padding: '80px 32px 40px 32px' }}
    >
      <div
        style={{
          fontSize: 11,
          color: t.dim,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        § 07 · Contact
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: 'clamp(72px, 14vw, 220px)',
          letterSpacing: '-0.05em',
          lineHeight: 0.85,
          color: t.ink,
        }}
      >
        <Glitch strong period={2800}>TELL ME</Glitch>
        <br />
        <Glitch strong period={3200}>ABOUT IT.</Glitch>
        <TypedCaret />
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 32,
          marginTop: 56,
          paddingTop: 28,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Email</div>
          <a
            href={`mailto:${JORIUS.email}`}
            style={{ fontSize: 20, color: t.ink, textDecoration: 'none', display: 'block', marginTop: 6 }}
          >
            <Glitch trigger="hover">{JORIUS.email}</Glitch>
          </a>
          <div style={{ fontSize: 12, color: t.dim, marginTop: 4 }}>PGP {JORIUS.pgp}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Elsewhere</div>
          <div style={{ fontSize: 15, color: t.ink, marginTop: 6, lineHeight: 1.6 }}>
            github.com/jorius
            <br />
            linkedin.com/in/jorius
            <br />
            keybase.io/jorius
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Current availability</div>
          <div style={{ fontSize: 18, color: t.ink, marginTop: 6 }}>{JORIUS.status}</div>
          <a
            href="https://cal.com/jorius"
            style={{
              display: 'inline-block',
              marginTop: 16,
              background: t.ink,
              color: t.paper,
              padding: '12px 18px',
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            <Glitch trigger="hover">BOOK 20 MIN →</Glitch>
          </a>
        </div>
      </div>
      <div
        style={{
          marginTop: 60,
          paddingTop: 14,
          borderTop: `1px solid ${t.rule}`,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: t.dim,
        }}
      >
        <span>© 2026 JORIUS · PERSONAL RECORD</span>
        <span>SET IN SPACE MONO · NO COOKIES</span>
        <span>VOL. X, NO. 010</span>
      </div>
    </section>
  );
};

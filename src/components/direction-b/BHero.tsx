// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// components
import { Glitch } from '../primitives/Glitch';
import { Scramble } from '../primitives/Scramble';
import { TypedCaret } from '../primitives/TypedCaret';
import { Portrait } from './Portrait';

export const BHero = (): React.ReactElement => {
  const { t } = useBTheme();

  return (
    <section style={{ borderBottom: `1px solid ${t.rule}`, padding: '64px 32px 48px 32px', position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
        <div style={{ fontSize: 12, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <Scramble text="PERSONAL RECORD · NO. 010 · APR 2026" />
        </div>
        <div style={{ fontSize: 13, color: t.ink, maxWidth: 480, justifySelf: 'end', textAlign: 'right' }}>
          Ten years of production software. Full-stack by habit, security-minded by training, consultant by current invoice.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'end' }}>
        <div style={{ fontSize: 'clamp(64px, 11vw, 172px)', lineHeight: 0.86, letterSpacing: '-0.045em', fontWeight: 700, color: t.ink }}>
          <Glitch as="div" strong period={3800}>FULL-STACK</Glitch>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
            <Glitch strong period={4400}>ENGINEER.</Glitch>
            <span style={{ fontSize: 16, color: t.dim, letterSpacing: 0, fontWeight: 400, alignSelf: 'end', marginBottom: '0.6em' }}>
              (full-stack, remote)
            </span>
          </div>
          <Glitch as="div" strong period={5000}>SECURITY,</Glitch>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <Glitch strong period={3400}>SHIPPED.</Glitch>
            <TypedCaret />
          </div>
        </div>
        <Portrait />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32, marginTop: 56, paddingTop: 28, borderTop: `1px solid ${t.rule}` }}>
        <div style={{ color: t.ink, fontSize: 14, lineHeight: 1.6, maxWidth: 640 }}>
          I work alone and in small teams, usually 6–12 month engagements. Strongest when the
          problem is &quot;we have an old system and nobody wants to touch it,&quot; or &quot;we&apos;re
          shipping something new and the first six months have to not be a mess.&quot;
        </div>
        <div>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Operating from</div>
          <div style={{ fontSize: 15, color: t.ink, marginTop: 6 }}>Bogotá · GMT-5</div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 2 }}>remote across the Americas</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <a
            href={`mailto:${JORIUS.email}`}
            style={{
              display: 'inline-block',
              background: t.ink,
              color: t.paper,
              padding: '14px 22px',
              fontSize: 13,
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            <Glitch trigger="hover" strong>WRITE ME →</Glitch>
          </a>
          <div style={{ fontSize: 11, color: t.dim, marginTop: 8 }}>replies within 24h</div>
        </div>
      </div>
    </section>
  );
};

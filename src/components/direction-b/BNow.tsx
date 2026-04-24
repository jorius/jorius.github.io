// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BNow = (): React.ReactElement => {
  const { t } = useBTheme();
  return (
    <>
      <BSectionHead
        id="b-now"
        num="01"
        label="NOW."
        kicker="Updated by hand, roughly every two weeks. The rest of the site is a static record; this part moves."
      />
      <div
        style={{
          padding: '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          borderTop: `1px solid ${t.soft}`,
          paddingTop: 28,
        }}
      >
        <div>
          {JORIUS.now.map((n, i) => (
            <Reveal
              key={n.k}
              delay={i * 60}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                padding: '18px 0',
                borderBottom: `1px solid ${t.soft}`,
              }}
            >
              <div style={{ color: t.dim, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{n.k}</div>
              <div style={{ color: t.ink, fontSize: 15, lineHeight: 1.5 }}>{n.v}</div>
            </Reveal>
          ))}
        </div>
        <div style={{ alignSelf: 'end', paddingBottom: 18 }}>
          <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Last updated</div>
          <div style={{ fontSize: 40, color: t.ink, letterSpacing: '-0.02em', marginTop: 6 }}>
            <Glitch trigger="hover" strong>2026-04-11</Glitch>
          </div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 10, maxWidth: 380 }}>
            This page is inspired by Derek Sivers&apos;s &quot;now page.&quot; If your website only
            has three things, this should be one of them.
          </div>
        </div>
      </div>
    </>
  );
};

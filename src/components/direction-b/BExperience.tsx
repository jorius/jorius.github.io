// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BExperience = (): React.ReactElement => {
  const { t } = useBTheme();
  return (
    <>
      <BSectionHead
        id="b-experience"
        num="03"
        label="RECORD."
        kicker="Ten years, four companies, a lot of branches rebased into tidy commits."
      />
      <div style={{ padding: '0 32px 60px 32px' }}>
        {JORIUS.experience.map((e, i) => (
          <Reveal
            key={`${e.co}-${e.from}`}
            delay={i * 60}
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1.2fr 2fr',
              gap: 24,
              padding: '28px 0',
              borderBottom: `1px solid ${t.rule}`,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  border: `1px solid ${t.rule}`,
                  backgroundColor: t.sub,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: e.accent,
                  position: 'relative',
                }}
              >
                {e.mark}
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: e.accent,
                    boxShadow: `0 0 6px ${e.accent}`,
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 18, color: t.ink, letterSpacing: '-0.01em', fontWeight: 500 }}>
                  <Glitch trigger="hover">{e.co}</Glitch>
                </div>
                <div style={{ fontSize: 11, color: t.dim, marginTop: 4 }}>{e.from} → {e.to}</div>
                <div style={{ fontSize: 10, color: t.dim, marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {e.loc}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: t.ink, fontWeight: 500, letterSpacing: '-0.005em' }}>{e.role}</div>
            <div style={{ fontSize: 14, color: t.ink, lineHeight: 1.55 }}>{e.body}</div>
          </Reveal>
        ))}
      </div>
    </>
  );
};

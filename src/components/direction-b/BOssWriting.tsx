// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BOssWriting = (): React.ReactElement => {
  const { t } = useBTheme();
  const max = Math.max(...JORIUS.oss.map((o) => o.stars));
  return (
    <>
      <BSectionHead
        id="b-writing"
        num="05"
        label="WRITING & OSS."
        kicker="Long-form notes and maintained repositories. The things I'd point a hiring manager at, if asked."
      />
      <div
        style={{
          padding: '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 48,
          borderTop: `1px solid ${t.rule}`,
          paddingTop: 32,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            — Writing
          </div>
          {JORIUS.writing.map((w, i) => (
            <Reveal
              key={w.title}
              delay={i * 40}
              as="a"
              href="#"
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 72px',
                padding: '18px 0',
                borderBottom: `1px solid ${t.soft}`,
                color: t.ink,
                textDecoration: 'none',
                gap: 12,
                alignItems: 'baseline',
                transition: 'background 180ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = t.sub;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ color: t.dim, fontSize: 12 }}>{w.date}</span>
              <span style={{ fontSize: 17, letterSpacing: '-0.01em' }}>
                <Glitch trigger="hover">{w.title}</Glitch>
              </span>
              <span style={{ color: t.dim, fontSize: 12, textAlign: 'right' }}>{w.len}</span>
            </Reveal>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            — Open source
          </div>
          {JORIUS.oss.map((o, i) => (
            <Reveal
              key={o.repo}
              delay={i * 50}
              style={{ padding: '16px 0', borderBottom: `1px solid ${t.soft}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <a
                  href={`https://github.com/${o.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.ink, textDecoration: 'none', fontSize: 15 }}
                >
                  <Glitch trigger="hover">{o.repo}</Glitch>
                </a>
                <span style={{ fontSize: 12, color: t.dim }}>★ {o.stars.toLocaleString()} · {o.lang}</span>
              </div>
              <div style={{ fontSize: 13, color: t.dim, marginTop: 4 }}>{o.desc}</div>
              <div style={{ height: 3, background: t.soft, marginTop: 10, position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${(o.stars / max) * 100}%`,
                    background: t.ink,
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
};

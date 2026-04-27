// packages
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// data
import { JORIUS } from '../data/jorius';

// components
import { BTopBar } from '../components/direction-b/BTopBar';
import { DarkGrain } from '../components/primitives/DarkGrain';
import { Glitch } from '../components/primitives/Glitch';
import { Reveal } from '../components/primitives/Reveal';
import { ScanLines } from '../components/primitives/ScanLines';

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue interdum ligula a dignissim. Sed lobortis orci elementum egestas lobortis. Praesent vehicula, justo et sagittis dapibus, lectus risus condimentum nibh, vel commodo dui mauris a magna. Ut sodales lectus a est laoreet, et ullamcorper purus rutrum. Quisque a velit non orci pharetra rutrum.',
  'In hac habitasse platea dictumst. Nullam tincidunt, justo eu sagittis ullamcorper, augue arcu sodales mi, in ultrices urna lectus a turpis. Donec ac vestibulum nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam erat volutpat. Curabitur tristique nibh eu ipsum euismod, vitae malesuada lectus pulvinar.',
  'Maecenas a sapien dictum, dictum ipsum nec, eleifend mauris. Etiam aliquam tortor sit amet est volutpat, eu mattis tortor mattis. Nulla facilisi. Nullam at velit eu nibh consectetur dignissim. Phasellus tincidunt finibus erat, in pulvinar arcu sodales sed. Suspendisse vehicula libero a leo aliquet, vitae dictum elit varius.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer dignissim, lacus ut faucibus dignissim, augue ipsum convallis erat, vitae rutrum ligula nibh sit amet ipsum. Aenean ut volutpat enim. Nullam non nibh sed risus rhoncus efficitur sit amet a felis.',
  'Vestibulum gravida vehicula sapien, eget commodo arcu vehicula at. Donec at lectus a libero efficitur dictum. Curabitur fermentum, justo nec ornare commodo, est nibh fringilla nibh, sit amet pulvinar sem urna eget tellus. Quisque eu massa quis sapien volutpat sodales sed sed augue.',
];

const Read = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const entry = JORIUS.writing.find((w) => w.slug === slug);

  return (
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <BTopBar />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '64px 32px 96px 32px' }}>
        <Reveal>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 28,
            }}
          >
            {tr('directionB.read.back')}
          </Link>
        </Reveal>

        {entry ? (
          <>
            <Reveal delay={80}>
              <div
                style={{
                  fontSize: 11,
                  color: t.dim,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                {tr('directionB.read.readingMeta')} · {entry.date} · {entry.tag}
              </div>
            </Reveal>
            <Reveal delay={160}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(40px, 6vw, 76px)',
                  letterSpacing: '-0.035em',
                  lineHeight: 0.95,
                  color: t.ink,
                }}
              >
                <Glitch strong period={5200}>{entry.title}</Glitch>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <div
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  color: t.dim,
                  letterSpacing: '0.06em',
                }}
              >
                {entry.len} {tr('directionB.read.lenSuffix')}
              </div>
            </Reveal>
            <Reveal delay={320} style={{ marginTop: 48, borderTop: `1px solid ${t.rule}`, paddingTop: 32 }}>
              <p style={{ fontSize: 12, color: t.dim, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>
                {tr('directionB.read.placeholder')}
              </p>
              {LOREM.map((para, i) => (
                <p
                  key={`lorem-${i}`}
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: t.ink,
                    margin: '0 0 24px 0',
                  }}
                >
                  {para}
                </p>
              ))}
            </Reveal>
          </>
        ) : (
          <Reveal delay={80}>
            <h1 style={{ margin: 0, fontSize: 'clamp(40px, 6vw, 76px)', letterSpacing: '-0.035em', lineHeight: 0.95, color: t.ink }}>
              <Glitch strong>{tr('directionB.read.notFound')}</Glitch>
            </h1>
            <p style={{ marginTop: 24, fontSize: 14, color: t.dim, lineHeight: 1.6 }}>
              {tr('directionB.read.notFoundBody1')}{' '}
              <code style={{ background: t.sub, padding: '2px 6px', color: t.ink }}>{slug}</code>.
              {' '}{tr('directionB.read.notFoundBody2')}
            </p>
          </Reveal>
        )}

        <Reveal delay={400} style={{ marginTop: 56, borderTop: `1px solid ${t.rule}`, paddingTop: 24 }}>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {tr('directionB.read.back')}
          </Link>
        </Reveal>
      </article>

      <ScanLines />
      <DarkGrain />
    </div>
  );
};

export default Read;

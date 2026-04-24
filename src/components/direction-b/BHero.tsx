// packages
import { useTranslation } from 'react-i18next';

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
  const { t: tr } = useTranslation();

  return (
    <section style={{ borderBottom: `1px solid ${t.rule}`, padding: '64px 32px 48px 32px', position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
        <div style={{ fontSize: 12, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <Scramble text={tr('directionB.hero.meta')} />
        </div>
        <div style={{ fontSize: 13, color: t.ink, maxWidth: 480, justifySelf: 'end', textAlign: 'right' }}>
          {tr('directionB.hero.intro')}
        </div>
      </div>

      <div className="b-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr clamp(280px, 32vw, 480px)', gap: 40, alignItems: 'end' }}>
        <div style={{ fontSize: 'clamp(64px, 11vw, 172px)', lineHeight: 0.86, letterSpacing: '-0.045em', fontWeight: 700, color: t.ink }}>
          <Glitch as="div" strong period={3800}>{tr('directionB.hero.headline.fullstack')}</Glitch>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
            <Glitch strong period={4400}>{tr('directionB.hero.headline.engineer')}</Glitch>
            <span style={{ fontSize: 16, color: t.dim, letterSpacing: 0, fontWeight: 400, alignSelf: 'end', marginBottom: '0.6em' }}>
              {tr('directionB.hero.headline.engineerKicker')}
            </span>
          </div>
          <Glitch as="div" strong period={5000}>{tr('directionB.hero.headline.security')}</Glitch>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <Glitch strong period={3400}>{tr('directionB.hero.headline.shipped')}</Glitch>
            <TypedCaret />
          </div>
        </div>
        <Portrait />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32, marginTop: 56, paddingTop: 28, borderTop: `1px solid ${t.rule}` }}>
        <div style={{ color: t.ink, fontSize: 14, lineHeight: 1.6, maxWidth: 640 }}>
          {tr('directionB.hero.body')}
        </div>
        <div>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tr('directionB.hero.operating')}</div>
          <div style={{ fontSize: 15, color: t.ink, marginTop: 6 }}>{tr('directionB.hero.operatingValue')}</div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 2 }}>{tr('directionB.hero.remote')}</div>
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
            <Glitch trigger="hover" strong>{tr('directionB.hero.writeMe')}</Glitch>
          </a>
          <div style={{ fontSize: 11, color: t.dim, marginTop: 8 }}>{tr('directionB.hero.replies')}</div>
        </div>
      </div>
    </section>
  );
};

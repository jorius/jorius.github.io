// packages
import { useTranslation } from 'react-i18next';

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
  const { t: tr } = useTranslation();
  return (
    <>
      <BSectionHead
        id="b-now"
        num={tr('directionB.sections.now.num')}
        label={tr('directionB.sections.now.label')}
        kicker={tr('directionB.sections.now.kicker')}
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
          <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tr('directionB.now.lastUpdatedLabel')}</div>
          <div style={{ fontSize: 40, color: t.ink, letterSpacing: '-0.02em', marginTop: 6 }}>
            <Glitch trigger="hover" strong>{tr('directionB.now.lastUpdatedDate')}</Glitch>
          </div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 10, maxWidth: 380 }}>
            {tr('directionB.now.siversNote')}
          </div>
        </div>
      </div>
    </>
  );
};

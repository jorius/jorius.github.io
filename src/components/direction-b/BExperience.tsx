// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BExperience = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  return (
    <>
      <BSectionHead
        id="b-experience"
        num={tr('directionB.sections.record.num')}
        label={tr('directionB.sections.record.label')}
        kicker={tr('directionB.sections.record.kicker')}
      />
      <div style={{ padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px' }}>
        {JORIUS.experience.map((e, i) => (
          <Reveal
            key={e.key}
            delay={i * 60}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '220px 1.2fr 2fr',
              gap: isMobile ? 12 : 24,
              padding: isMobile ? '22px 0' : '28px 0',
              borderBottom: `1px solid ${t.rule}`,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  border: `1px solid ${t.rule}`,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={e.logo}
                  alt={`${e.co} logo`}
                  style={{ maxWidth: '76%', maxHeight: '76%', objectFit: 'contain', display: 'block' }}
                />
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

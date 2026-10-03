// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { BCard } from './BCard';
import { BCardGrid } from './BCardGrid';
import { BSectionHead } from './BSectionHead';

// The date row reads the company accent through this variable.
interface AccentCSS extends CSSProperties {
  '--acc'?: string;
}

export const BExperience = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  const meta: CSSProperties = { fontSize: 13, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };
  return (
    <>
      <BSectionHead
        id="b-experience"
        num={tr('directionB.sections.record.num')}
        label={tr('directionB.sections.record.label')}
        kicker={tr('directionB.sections.record.kicker')}
      />
      <div style={{ padding: isMobile ? '0 20px 40px 20px' : '0 32px 40px 32px' }}>
        <BCardGrid style={{ marginTop: 16 }}>
          {JORIUS.experience.map((e, i) => {
            const accent: AccentCSS = { '--acc': e.accent };
            return (
              <BCard key={e.key} index={i} style={accent}>
                <div style={{ ...meta, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span>№ {String(i + 1).padStart(2, '0')}</span>
                  <span>{e.loc === 'Remote' ? tr('directionB.experience.remote') : e.loc}</span>
                </div>
                {/* The owner asked for dates that are easy to find: same spot on every card, ink, bold, accent bar. */}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    color: t.ink,
                    fontVariantNumeric: 'tabular-nums',
                    padding: '4px 0 4px 12px',
                    borderLeft: '3px solid var(--acc)',
                  }}
                >
                  {e.from} → {e.to === 'Present' ? tr('directionB.experience.present') : e.to}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
                    }}
                  >
                    <img src={e.logo} alt={`${e.co} logo`} style={{ maxWidth: '76%', maxHeight: '76%', objectFit: 'contain', display: 'block' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: e.accent,
                        boxShadow: `0 0 6px ${e.accent}`,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 20, color: t.ink, letterSpacing: '-0.01em', fontWeight: 700, minWidth: 0 }}>
                    <Glitch trigger="hover">{e.co}</Glitch>
                  </div>
                </div>
                <div style={{ fontSize: 15, color: t.ink, fontWeight: 700, letterSpacing: '-0.005em' }}>{tr(`directionB.experience.${e.key}.role`)}</div>
                <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.55, color: t.ink }}>{tr(`directionB.experience.${e.key}.body`)}</p>
              </BCard>
            );
          })}
        </BCardGrid>
      </div>
    </>
  );
};

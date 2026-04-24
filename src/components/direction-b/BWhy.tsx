// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

interface WhyStepCSS extends CSSProperties {
  '--sub'?: string;
  '--rgbB'?: string;
}

export const BWhy = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  return (
    <>
      <BSectionHead
        id="b-why"
        num={tr('directionB.sections.why.num')}
        label={tr('directionB.sections.why.label')}
        kicker={tr('directionB.sections.why.kicker')}
      />
      <div
        style={{
          padding: '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        {JORIUS.hire_why.map((w, i) => {
          const stepStyle: WhyStepCSS = {
            padding: 24,
            borderRight: i < 3 ? `1px solid ${t.rule}` : 'none',
            borderBottom: `1px solid ${t.rule}`,
            '--sub': t.sub,
            '--rgbB': t.rgbB,
          };
          return (
            <Reveal key={w.n} delay={i * 60} className="b-why-step" style={stepStyle}>
              <div className="b-why-num" style={{ fontSize: 48, color: t.ink, letterSpacing: '-0.03em' }}>
                <Glitch trigger="hover" strong>{w.n}</Glitch>
              </div>
              <div style={{ fontSize: 22, color: t.ink, margin: '10px 0 10px 0', letterSpacing: '-0.01em' }}>
                <Glitch trigger="hover">{w.h}</Glitch>
              </div>
              <div style={{ fontSize: 13, color: t.dim, lineHeight: 1.55 }}>{w.b}</div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
};

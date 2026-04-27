// packages
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery';

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
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Mobile: 1 col, tablet: 2 cols, desktop: 4 cols.
  let columnsPerRow = 4;
  if (isMobile) columnsPerRow = 1;
  else if (isTablet) columnsPerRow = 2;

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
          padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
          gap: 0,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        {JORIUS.hire_why.map((w, i) => {
          const isLastInRow = i % columnsPerRow === columnsPerRow - 1;
          const stepStyle: WhyStepCSS = {
            padding: isMobile ? 16 : 24,
            borderRight: !isLastInRow ? `1px solid ${t.rule}` : 'none',
            borderBottom: `1px solid ${t.rule}`,
            '--sub': t.sub,
            '--rgbB': t.rgbB,
          };
          return (
            <Reveal key={w.n} delay={i * 60} className="b-why-step" style={stepStyle}>
              <div className="b-why-num" style={{ fontSize: 'clamp(32px, 10vw, 48px)', color: t.ink, letterSpacing: '-0.03em' }}>
                <Glitch trigger="hover" strong>{w.n}</Glitch>
              </div>
              <div style={{ fontSize: isMobile ? 18 : 22, color: t.ink, margin: '10px 0 10px 0', letterSpacing: '-0.01em' }}>
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

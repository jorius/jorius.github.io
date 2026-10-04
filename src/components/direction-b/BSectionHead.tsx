// packages
import type { ReactNode } from 'react';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';

interface BSectionHeadProps {
  id: string;
  num: string;
  label: string;
  kicker: string;
  // Rendered beside the title, bottom-aligned (Now uses it for "Last updated").
  aside?: ReactNode;
}

// Number, title, kicker, stacked. The kicker used to sit in a right-hand
// column at 13px, which the design review marked unreadable in every section.
export const BSectionHead = ({ id, num, label, kicker, aside }: BSectionHeadProps): React.ReactElement => {
  const { t } = useBTheme();
  const isMobile = useIsMobile();
  return (
    <div
      data-jump={id}
      style={{
        padding: isMobile ? '52px 20px 16px 20px' : '72px 32px 24px 32px',
        borderTop: `1px solid ${t.rule}`,
        display: 'grid',
        gap: 14,
      }}
    >
      <div style={{ fontSize: 13, color: t.dim, letterSpacing: '0.15em', textTransform: 'uppercase' }}>§ {num}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(40px, 7vw, 104px)', letterSpacing: '-0.035em', lineHeight: 0.9, color: t.ink }}>
          <Glitch strong period={6000}>{label}</Glitch>
        </h2>
        {aside}
      </div>
      <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.5, color: t.dim, maxWidth: '62ch' }}>{kicker}</p>
    </div>
  );
};

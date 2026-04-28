// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Glitch } from '../primitives/Glitch';

interface BSectionHeadProps {
  id: string;
  num: string;
  label: string;
  kicker: string;
}

export const BSectionHead = ({ id, num, label, kicker }: BSectionHeadProps): React.ReactElement => {
  const { t } = useBTheme();
  const isMobile = useIsMobile();
  return (
    <div
      data-jump={id}
      style={{
        padding: isMobile ? '60px 20px 16px 20px' : '80px 32px 24px 32px',
        borderTop: `1px solid ${t.rule}`,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '120px 1fr 1fr',
        gap: isMobile ? 14 : 32,
        alignItems: isMobile ? 'start' : 'end',
      }}
    >
      <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.15em', textTransform: 'uppercase' }}>§ {num}</div>
      <h2 style={{ margin: 0, fontSize: 'clamp(40px, 7vw, 104px)', letterSpacing: '-0.035em', lineHeight: 0.9, color: t.ink }}>
        <Glitch strong period={6000}>{label}</Glitch>
      </h2>
      <div
        style={{
          fontSize: 13,
          color: t.dim,
          maxWidth: 360,
          justifySelf: isMobile ? 'start' : 'end',
          textAlign: isMobile ? 'left' : 'right',
        }}
      >
        {kicker}
      </div>
    </div>
  );
};

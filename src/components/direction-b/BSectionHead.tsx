// contexts
import { useBTheme } from '../../contexts/ThemeContext';

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
  return (
    <div
      data-jump={id}
      style={{
        padding: '80px 32px 24px 32px',
        borderTop: `1px solid ${t.rule}`,
        display: 'grid',
        gridTemplateColumns: '120px 1fr 1fr',
        gap: 32,
        alignItems: 'end',
      }}
    >
      <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.15em', textTransform: 'uppercase' }}>§ {num}</div>
      <h2 style={{ margin: 0, fontSize: 'clamp(48px, 7vw, 104px)', letterSpacing: '-0.035em', lineHeight: 0.9, color: t.ink }}>
        <Glitch strong period={6000}>{label}</Glitch>
      </h2>
      <div style={{ fontSize: 13, color: t.dim, maxWidth: 360, justifySelf: 'end', textAlign: 'right' }}>
        {kicker}
      </div>
    </div>
  );
};

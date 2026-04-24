/* eslint-disable react-refresh/only-export-components */
// contexts
import { useBTheme } from '../../contexts/ThemeContext';

interface TechSpec {
  color: string;
  glyph: string;
}

export const TECH: Record<string, TechSpec> = {
  Go: { color: '#00ADD8', glyph: 'Go' },
  Postgres: { color: '#336791', glyph: 'pg' },
  Redis: { color: '#DC382D', glyph: 'R' },
  Swift: { color: '#F05138', glyph: 'sw' },
  Node: { color: '#5FA04E', glyph: 'N' },
  Stripe: { color: '#635BFF', glyph: '$' },
  TypeScript: { color: '#3178C6', glyph: 'TS' },
  Rust: { color: '#CE412B', glyph: 'Rs' },
  WASM: { color: '#654FF0', glyph: 'wa' },
  Python: { color: '#FFD43B', glyph: 'Py' },
  FastAPI: { color: '#009688', glyph: 'fa' },
  Kafka: { color: '#231F20', glyph: 'K' },
  'Next.js': { color: '#000000', glyph: 'N' },
  Terraform: { color: '#7B42BC', glyph: 'tf' },
  // Security
  OWASP: { color: '#0071BC', glyph: 'Ow' },
  'OAuth/OIDC': { color: '#EB5424', glyph: 'O2' },
  'Threat-modeling': { color: '#5D2E8C', glyph: 'tm' },
  Burp: { color: '#FF6633', glyph: 'B' },
  Semgrep: { color: '#6366F1', glyph: 'sg' },
  // Leadership
  RFCs: { color: '#2F855A', glyph: 'rf' },
  Review: { color: '#D97706', glyph: 'rv' },
  Hiring: { color: '#9F1239', glyph: 'hr' },
  Mentoring: { color: '#0E7490', glyph: 'm' },
  Roadmaps: { color: '#7C3AED', glyph: 'rm' },
};

const LIGHT_GLYPH_COLORS = new Set(['#FFD43B', '#F7DF1E', '#61DAFB', '#9BCB3A']);

interface StackChipProps {
  name: string;
}

export const StackChip = ({ name }: StackChipProps): React.ReactElement => {
  const { t } = useBTheme();
  const tech = TECH[name] ?? { color: t.ink, glyph: name.slice(0, 2) };
  const lightGlyph = LIGHT_GLYPH_COLORS.has(tech.color);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px 3px 3px',
        border: `1px solid ${t.rule}`,
        fontSize: 11,
        color: t.ink,
        letterSpacing: '0.02em',
        backgroundColor: t.sub,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          background: tech.color,
          color: lightGlyph ? '#0d0d0d' : '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 0,
          flexShrink: 0,
        }}
      >
        {tech.glyph}
      </span>
      {name}
    </span>
  );
};

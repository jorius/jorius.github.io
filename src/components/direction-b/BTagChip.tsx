// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// utils
import { pickLocale } from '../../utils/content';
import type { WritingTag } from '../../utils/content';

// Derive a 1–2 char monogram from a tag label when the CMS doesn't supply a glyph.
const deriveGlyph = (label: string): string => {
  const clean = label.replace(/[^\p{L}\p{N}]/gu, '');
  return clean.slice(0, 2) || '#';
};

// Pick legible glyph ink (black/white) from the square's background luminance, so
// CMS-chosen colors stay readable in both themes. Falls back to white on a bad hex.
const glyphInk = (hex: string): string => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#fff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? '#0d0d0d' : '#fff';
};

interface BTagChipProps {
  tag: WritingTag;
  lang: string;
  active?: boolean;
  onClick?: () => void;
}

// Tag chip in the StackChip visual language (colored monogram square + label).
// Renders a <button> when given an onClick (filter toggle), else a static <span>.
export const BTagChip = ({ tag, lang, active = false, onClick }: BTagChipProps): React.ReactElement => {
  const { t } = useBTheme();
  const label = pickLocale(tag.label, lang);
  const squareColor = tag.color ?? t.rgbB;
  const glyph = tag.glyph?.trim() || deriveGlyph(label);
  const interactive = typeof onClick === 'function';

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '3px 9px 3px 3px',
    border: `1px solid ${active ? t.ink : t.rule}`,
    background: active ? `${t.ink}14` : t.sub,
    fontSize: 11,
    fontFamily: 'inherit',
    color: t.ink,
    letterSpacing: '0.02em',
    lineHeight: 1,
    cursor: interactive ? 'pointer' : 'default',
    transition: 'border-color 150ms, background 150ms',
  };

  const square = (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        background: squareColor,
        color: glyphInk(squareColor),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 0,
        flexShrink: 0,
      }}
    >
      {glyph}
    </span>
  );

  if (!interactive) {
    return (
      <span style={style}>
        {square}
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={style}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = t.ink; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = t.rule; }}
    >
      {square}
      {label}
    </button>
  );
};

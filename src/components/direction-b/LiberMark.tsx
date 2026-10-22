// packages
import type { CSSProperties } from 'react';

// The .b-dot keyframes in index.html read the two ring colours from here.
interface RingCSS extends CSSProperties {
  '--dot-a'?: string;
  '--dot-b'?: string;
}

// The Liber Linteum app icon (jorius/liber-linteum, apps/desktop/src-tauri/icons/app-icon.svg) at
// 16×16: the three pages, the ribbon and the L on ink, in flat fills (the faint page lines and the
// gradients don't survive this size, and the bar renders twice, so no gradient ids). It sits on the
// text's centre line like the status dots and pulses the same soft ring, in the colour given.
export const LiberMark = ({ ring }: { ring: string }): React.ReactElement => {
  const style: RingCSS = {
    display: 'inline-flex',
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
    flexShrink: 0,
    '--dot-a': `${ring}99`,
    '--dot-b': `${ring}00`,
  };
  return (
    <span aria-hidden className="b-dot" style={style}>
      <svg width={16} height={16} viewBox="0 0 100 100" style={{ display: 'block', borderRadius: 4 }}>
        <rect width="100" height="100" rx="22" fill="#221f27" />
        <g transform="translate(50 50) scale(1.14) translate(-50 -49)">
          <rect x="33" y="30" width="44" height="48" rx="5" fill="#c58f32" />
          <rect x="28" y="25" width="44" height="48" rx="5" fill="#ba5627" />
          <rect x="23" y="20" width="44" height="48" rx="5" fill="#eee3d1" />
          <path d="M55 20v19l5-4 5 4V20z" fill="#ba5627" />
          <path d="M36 29v29h17" fill="none" stroke="#c25a28" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </span>
  );
};

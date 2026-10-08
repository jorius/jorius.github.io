// packages
import type { CSSProperties } from 'react';

// The .b-dot keyframes in index.html read the two ring colours from here.
interface RingCSS extends CSSProperties {
  '--dot-a'?: string;
  '--dot-b'?: string;
}

// The None Shall Pass favicon (jorius/none-shall-pass, public/favicon.svg), inlined rect for rect so
// the bar shows the same 16×16 helmet the game's browser tab does. It sits on the text's centre
// line like the status dots and pulses the same soft ring, in the colour given (the game's gold).
export const KnightMark = ({ ring }: { ring: string }): React.ReactElement => {
  const style: RingCSS = {
    display: 'inline-flex',
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
    flexShrink: 0,
    '--dot-a': `${ring}99`,
    '--dot-b': `${ring}00`,
  };
  return (
    <span aria-hidden className="b-dot" style={style}>
      <svg width={16} height={16} viewBox="0 0 16 16" shapeRendering="crispEdges" style={{ display: 'block', borderRadius: 3 }}>
        <rect width="16" height="16" fill="#1c1c1c" />
        <rect x="4" y="2" width="8" height="12" fill="#5d6680" />
        <rect x="3" y="4" width="10" height="9" fill="#5d6680" />
        <rect x="4" y="2" width="3" height="11" fill="#8f9bb3" />
        <rect x="3" y="7" width="7" height="2" fill="#ff2f2f" />
        <rect x="11" y="4" width="2" height="9" fill="#3a4152" />
        <rect x="9" y="0" width="3" height="3" fill="#ff2f2f" />
      </svg>
    </span>
  );
};

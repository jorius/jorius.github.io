// packages
import type { CSSProperties } from 'react';

// The .b-dot keyframes in index.html read the two ring colours from here.
interface RingCSS extends CSSProperties {
  '--dot-a'?: string;
  '--dot-b'?: string;
}

// The Engineer Mentat Academy favicon (jorius/engineer-mentat-academy, public/favicon.svg) at 16×16:
// the orange M on zinc, path for path. It sits on the text's centre line like the status dots and
// pulses the same soft ring, in the colour given (the academy's orange).
export const AcademyMark = ({ ring }: { ring: string }): React.ReactElement => {
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
      <svg width={16} height={16} viewBox="0 0 32 32" style={{ display: 'block', borderRadius: 3 }}>
        <rect width="32" height="32" rx="6" fill="#18181b" />
        <path d="M8 22V10l8 7 8-7v12" fill="none" stroke="#f97316" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

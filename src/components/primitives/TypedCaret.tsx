// packages
import { useEffect, useState } from 'react';

interface TypedCaretProps {
  blink?: boolean;
}

export const TypedCaret = ({ blink = true }: TypedCaretProps): React.ReactElement => {
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (!blink) return;
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, [blink]);

  return <span style={{ opacity: on ? 1 : 0, transition: 'opacity 60ms' }}>▊</span>;
};

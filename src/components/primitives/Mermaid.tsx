// packages
import { useEffect, useId, useState } from 'react';

interface MermaidProps {
  code: string;
  dark: boolean;
}

// A ```mermaid block from a post, drawn as SVG. Mermaid is large, so it loads
// only when a post has a diagram; until then (or if it fails) the source shows.
export const Mermaid = ({ code, dark }: MermaidProps): React.ReactElement => {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'neutral' });
        const out = await mermaid.render(id, code);
        if (alive) setSvg(out.svg);
      })
      .catch(() => {
        if (alive) setSvg(null);
      });
    return () => {
      alive = false;
    };
  }, [code, dark, id]);

  if (!svg) {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }
  // Mermaid sanitizes its own output under securityLevel 'strict'.
  return <div className="b-mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
};

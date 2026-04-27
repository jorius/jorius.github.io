// packages
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../hooks/useMediaQuery';

// data
import { JORIUS } from '../data/jorius';
import { PGP_PUBLIC_KEY } from '../data/pgp-public-key';

// components
import { BTopBar } from '../components/direction-b/BTopBar';
import { DarkGrain } from '../components/primitives/DarkGrain';
import { Glitch } from '../components/primitives/Glitch';
import { Reveal } from '../components/primitives/Reveal';
import { ScanLines } from '../components/primitives/ScanLines';

const Pgp = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState<'block' | 'fingerprint' | null>(null);

  const copy = async (which: 'block' | 'fingerprint'): Promise<void> => {
    if (!navigator.clipboard) return;
    const text = which === 'block' ? PGP_PUBLIC_KEY : JORIUS.pgp.fingerprint;
    await navigator.clipboard.writeText(text);
    setCopied(which);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <BTopBar />

      <article style={{ maxWidth: 920, margin: '0 auto', padding: isMobile ? '40px 20px 64px 20px' : '64px 32px 96px 32px' }}>
        <Reveal>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 28,
            }}
          >
            {tr('directionB.read.back')}
          </Link>
        </Reveal>

        <Reveal delay={80}>
          <div
            style={{
              fontSize: 11,
              color: t.dim,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            § PUBLIC KEY · {JORIUS.pgp.algo}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(40px, 6vw, 76px)',
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              color: t.ink,
            }}
          >
            <Glitch strong period={5200}>{JORIUS.pgp.keyId}</Glitch>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: t.dim,
              letterSpacing: '0.06em',
              fontFamily: 'inherit',
              wordBreak: 'break-all',
            }}
          >
            FINGERPRINT&nbsp;&nbsp;{JORIUS.pgp.fingerprint}
          </div>
        </Reveal>

        <Reveal delay={320} style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => copy('fingerprint')}
            style={{
              background: 'transparent',
              color: t.ink,
              border: `1px solid ${t.rule}`,
              padding: '8px 14px',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {copied === 'fingerprint' ? '✓ COPIED' : 'COPY FINGERPRINT'}
          </button>
          <button
            type="button"
            onClick={() => copy('block')}
            style={{
              background: t.ink,
              color: t.paper,
              border: 0,
              padding: '8px 14px',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {copied === 'block' ? '✓ COPIED' : 'COPY KEY BLOCK'}
          </button>
        </Reveal>

        <Reveal delay={400} style={{ marginTop: 48, borderTop: `1px solid ${t.rule}`, paddingTop: 32 }}>
          <pre
            style={{
              margin: 0,
              padding: 24,
              background: t.sub,
              color: t.ink,
              border: `1px solid ${t.rule}`,
              fontSize: 12,
              lineHeight: 1.5,
              fontFamily: 'Space Mono, ui-monospace, Menlo, monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              overflowX: 'auto',
            }}
          >
            {PGP_PUBLIC_KEY}
          </pre>
        </Reveal>

        <Reveal delay={480} style={{ marginTop: 32, fontSize: 13, color: t.dim, lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            Import:{' '}
            <code style={{ background: t.sub, padding: '2px 6px', color: t.ink }}>
              gpg --import &lt;file&gt;
            </code>
            {' '}or paste the block into your client.
          </p>
          <p style={{ marginTop: 12 }}>
            Verify the fingerprint above out-of-band before trusting this key for encrypted mail.
          </p>
        </Reveal>

        <Reveal delay={560} style={{ marginTop: 56, borderTop: `1px solid ${t.rule}`, paddingTop: 24 }}>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {tr('directionB.read.back')}
          </Link>
        </Reveal>
      </article>

      <ScanLines />
      <DarkGrain />
    </div>
  );
};

export default Pgp;

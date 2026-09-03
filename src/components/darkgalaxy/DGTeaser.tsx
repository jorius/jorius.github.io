// packages
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// utils
import { currentYear } from '../../utils/dateLabels';

// components
import { Glitch } from '../primitives/Glitch';
import { Scramble } from '../primitives/Scramble';
import { TITLE_AT_MS } from './introLogic';
import { HOLD_AT_MS, SCRAMBLE_MS, teaserPhaseAt } from './teaserLogic';
import type { TeaserPhase } from './teaserLogic';
import { DG_DISPLAY_FONT } from './theme';

const TITLE = 'DARK GALAXY';

// The section's title card, held: paper, a short black beat, the title
// scrambling into place, then the ambient glitch keeps it alive. Nothing
// renders underneath it, so the page never scrolls.
export const DGTeaser = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const [reduced] = useState<boolean>(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [phase, setPhase] = useState<TeaserPhase>(() => teaserPhaseAt(0, reduced));

  useEffect(() => {
    if (reduced) return undefined;
    const timers = [
      window.setTimeout(() => setPhase(teaserPhaseAt(TITLE_AT_MS, false)), TITLE_AT_MS),
      window.setTimeout(() => setPhase(teaserPhaseAt(HOLD_AT_MS, false)), HOLD_AT_MS),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduced]);

  const corner = {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    letterSpacing: '0.1em',
    color: t.dim,
  } as const;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: t.paper,
        color: t.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Mono', ui-monospace, Menlo, monospace",
      }}
    >
      {phase !== 'black' ? (
        <>
          <div style={{ textAlign: 'center', padding: 24 }}>
            {/* The glitch only runs on the resolved title: its channel-split
                copies re-render the children, which would restart a Scramble. */}
            <Glitch
              as="h1"
              trigger={phase === 'hold' && !reduced ? 'ambient' : 'off'}
              strong
              style={{
                fontFamily: DG_DISPLAY_FONT,
                fontSize: 'clamp(32px, 9vw, 96px)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                lineHeight: 1,
                margin: 0,
              }}
            >
              {phase === 'scramble' ? <Scramble text={TITLE} duration={SCRAMBLE_MS} /> : TITLE}
            </Glitch>
            <div style={{ marginTop: 18, fontSize: 14, color: t.dim, letterSpacing: '0.06em' }}>
              {tr('darkgalaxy.footer')}
            </div>
            <div
              style={{
                marginTop: 32,
                fontFamily: DG_DISPLAY_FONT,
                fontSize: 12,
                color: t.rgbB,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              {tr('darkgalaxy.teaser.comingSoon')}
            </div>
          </div>
          <Link to="/" style={{ ...corner, left: 24, textDecoration: 'none' }}>
            {tr('darkgalaxy.back')}
          </Link>
          <span style={{ ...corner, right: 24, fontFamily: DG_DISPLAY_FONT }}>Dark Galaxy © {currentYear()}</span>
        </>
      ) : null}
    </div>
  );
};

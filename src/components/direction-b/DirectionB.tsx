// packages
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// components
import { CommandPalette } from '../CommandPalette';
import { PALETTE_SECTIONS } from './paletteSections';
import { DarkGrain } from '../primitives/DarkGrain';
import { ScanLines } from '../primitives/ScanLines';
import { BContact } from './BContact';
import { BExperience } from './BExperience';
import { BHero } from './BHero';
import { BNow } from './BNow';
import { BOssWriting } from './BOssWriting';
// import { BProjects } from './BProjects';
import { BServices } from './BServices';
import { BTopBar } from './BTopBar';
import { BWhy } from './BWhy';

export const DirectionB = (): React.ReactElement => {
  const { t } = useBTheme();
  const location = useLocation();

  // When we arrive from another route with a requested section (set by the top
  // bar / command palette while off the landing page), scroll to it once the
  // sections have mounted. Retries briefly to absorb layout/async content.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    // Clear the state so a refresh or back-navigation doesn't re-scroll.
    window.history.replaceState({}, '');
    let attempts = 0;
    const tryScroll = (): void => {
      const el = document.querySelector(`[data-jump="${target}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts < 12) {
        attempts += 1;
        window.setTimeout(tryScroll, 80);
      }
    };
    window.setTimeout(tryScroll, 60);
  }, [location]);

  return (
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        width: '100%',
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <BTopBar />
      <BHero />
      <BNow />
      <BServices />
      <BExperience />
      {/* <BProjects /> */}
      <BOssWriting />
      <BWhy />
      <BContact />
      <ScanLines />
      <DarkGrain />
      <CommandPalette sections={PALETTE_SECTIONS} />
    </div>
  );
};

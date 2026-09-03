// Pure timing for the teaser card, kept out of the component so it can be
// tested without a DOM. Unlike the section's intro, the card never ends: it
// scrambles the title in, then holds it with the ambient glitch running.

// components
import { TITLE_AT_MS } from './introLogic';

export const SCRAMBLE_MS = 900;
export const HOLD_AT_MS = TITLE_AT_MS + SCRAMBLE_MS;

export type TeaserPhase = 'black' | 'scramble' | 'hold';

// Reduced motion skips the beats and shows the resolved card at once.
export const teaserPhaseAt = (ms: number, reducedMotion: boolean): TeaserPhase => {
  if (reducedMotion || ms >= HOLD_AT_MS) return 'hold';
  return ms >= TITLE_AT_MS ? 'scramble' : 'black';
};

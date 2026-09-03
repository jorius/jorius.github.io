// Pure decisions for the intro overlay, kept out of the component so they can
// be tested without a DOM.

// The title card: a short black hold, the scrambled legend, then the landing.
export const TITLE_AT_MS = 350;
export const INTRO_TOTAL_MS = 2600;

export type Beat = 'black' | 'title' | 'done';

export const BEATS: ReadonlyArray<{ at: number; beat: Beat }> = [
  { at: 0, beat: 'black' },
  { at: TITLE_AT_MS, beat: 'title' },
  { at: INTRO_TOTAL_MS, beat: 'done' },
];

// The card plays on every entry into the section, but not again while the
// visitor moves between its pages: `playedThisVisit` is owned by the shell,
// which unmounts when they leave.
export const shouldPlayIntro = (playedThisVisit: boolean, reducedMotion: boolean): boolean =>
  !playedThisVisit && !reducedMotion;

export const beatAt = (ms: number): Beat => {
  let current: Beat = 'black';
  for (const b of BEATS) {
    if (ms >= b.at) current = b.beat;
  }
  return current;
};

// Ease-out cubic, clamped.
export const ease = (p: number): number => {
  const c = Math.min(1, Math.max(0, p));
  return 1 - (1 - c) ** 3;
};

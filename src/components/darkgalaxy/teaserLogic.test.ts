import { describe, expect, it } from 'vitest';

import { TITLE_AT_MS } from './introLogic';
import { HOLD_AT_MS, SCRAMBLE_MS, teaserPhaseAt } from './teaserLogic';

describe('teaserPhaseAt', () => {
  it('holds black before the title beat', () => {
    expect(teaserPhaseAt(0, false)).toBe('black');
    expect(teaserPhaseAt(TITLE_AT_MS - 1, false)).toBe('black');
  });

  it('scrambles the title in from the title beat', () => {
    expect(teaserPhaseAt(TITLE_AT_MS, false)).toBe('scramble');
    expect(teaserPhaseAt(HOLD_AT_MS - 1, false)).toBe('scramble');
  });

  it('holds the resolved title once the scramble has run', () => {
    expect(HOLD_AT_MS).toBe(TITLE_AT_MS + SCRAMBLE_MS);
    expect(teaserPhaseAt(HOLD_AT_MS, false)).toBe('hold');
    expect(teaserPhaseAt(60_000, false)).toBe('hold');
  });

  it('jumps straight to the hold under reduced motion', () => {
    expect(teaserPhaseAt(0, true)).toBe('hold');
  });
});

// packages
import { describe, expect, it } from 'vitest';

// contexts
import { B_THEMES } from '../contexts/ThemeContext';

// utils
import { contrastRatio, relativeLuminance } from './contrast';

describe('contrastRatio', () => {
  it('returns 21 for black on white and 1 for a colour on itself', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#292929', '#292929')).toBe(1);
  });

  it('rejects anything that is not a six-digit hex colour', () => {
    expect(() => relativeLuminance('#fff')).toThrow();
    expect(() => relativeLuminance('red')).toThrow();
  });
});

// The designer's review: every illegible element was dim text. This pins the
// floor so a palette tweak cannot quietly undo it.
describe('theme tokens pass the legibility floor', () => {
  for (const mode of ['dark', 'light'] as const) {
    const t = B_THEMES[mode];
    it(`${mode}: ink and dim read on paper and on the card hover surface`, () => {
      expect(contrastRatio(t.ink, t.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.dim, t.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.dim, t.sub)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.ink, t.sub)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

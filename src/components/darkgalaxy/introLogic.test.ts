// packages
import { describe, expect, it } from 'vitest';

// components
import { INTRO_TOTAL_MS, TITLE_AT_MS, beatAt, ease, shouldPlayIntro } from './introLogic';

describe('shouldPlayIntro', () => {
  it('plays on every entry into the section', () => {
    expect(shouldPlayIntro(false, false)).toBe(true);
  });

  it('does not replay while moving around inside the section', () => {
    expect(shouldPlayIntro(true, false)).toBe(false);
  });

  it('does not play under prefers-reduced-motion', () => {
    expect(shouldPlayIntro(false, true)).toBe(false);
  });
});

describe('beatAt', () => {
  it('holds black, shows the title, then ends', () => {
    expect(beatAt(0)).toBe('black');
    expect(beatAt(TITLE_AT_MS - 1)).toBe('black');
    expect(beatAt(TITLE_AT_MS)).toBe('title');
    expect(beatAt(INTRO_TOTAL_MS - 1)).toBe('title');
    expect(beatAt(INTRO_TOTAL_MS)).toBe('done');
  });
});

describe('ease', () => {
  it('clamps and eases out', () => {
    expect(ease(-1)).toBe(0);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(2)).toBe(1);
    expect(ease(0.5)).toBeGreaterThan(0.5);
  });
});

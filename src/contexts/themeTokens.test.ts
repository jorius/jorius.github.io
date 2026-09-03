// packages
import { describe, expect, it } from 'vitest';

// contexts
import { pickOverride, resolveTheme, resolveTokens } from './themeTokens';
import type { ThemeTokens } from './ThemeContext';

const base: ThemeTokens = {
  paper: '#292929', sub: '#333333', ink: '#f2efe7', dim: '#7c7a72', mute: '#3a3a3a',
  soft: '#1c1c1c', rule: '#e6e2d6', rgbR: '#ff2f2f', rgbB: '#2fb6ff', scan: true,
};

describe('resolveTheme', () => {
  it('uses the stored preference when nothing is locked', () => {
    expect(resolveTheme(undefined, 'light')).toBe('light');
  });

  it('ignores the stored preference when locked', () => {
    expect(resolveTheme('dark', 'light')).toBe('dark');
  });
});

describe('resolveTokens', () => {
  it('returns the base tokens untouched without an override', () => {
    expect(resolveTokens(base, undefined, true)).toEqual(base);
  });

  it('merges overrides over the base', () => {
    expect(resolveTokens(base, { paper: '#000000', rgbB: '#9D4EDD' }, true)).toMatchObject({
      paper: '#000000', rgbB: '#9D4EDD', ink: '#f2efe7',
    });
  });

  it('turns scan off when scan is not allowed, even if the override asks for it', () => {
    expect(resolveTokens(base, { scan: true }, false).scan).toBe(false);
  });

  it('keeps scan on when allowed and the base has it', () => {
    expect(resolveTokens(base, undefined, true).scan).toBe(true);
  });
});

describe('pickOverride', () => {
  it('returns an empty override when nothing is given', () => {
    expect(pickOverride('dark')).toEqual({});
  });

  it('applies the flat set to both modes and the per-mode set on top', () => {
    const flat = { rgbB: '#111111', ink: '#222222' };
    const byMode = { light: { rgbB: '#333333' } };
    expect(pickOverride('dark', flat, byMode)).toEqual({ rgbB: '#111111', ink: '#222222' });
    expect(pickOverride('light', flat, byMode)).toEqual({ rgbB: '#333333', ink: '#222222' });
  });
});

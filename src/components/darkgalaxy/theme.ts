// contexts
import type { ThemeTokens } from '../../contexts/ThemeContext';
import type { TokensByMode } from '../../contexts/themeTokens';

// Notion "Design" page palette. Black is sacred: the void is pure #000.
export const DG = {
  void: '#000000',
  bone: '#EAEAEA',
  ash: '#6A6A72',
  violet: '#9D4EDD',
  deep: '#5A189A',
  red: '#E63946',
  cyan: '#4CC9F0',
  amber: '#F4A261',
} as const;

// Dark: the void. `dim` is lighter than ash because ash on black is under 4:1
// for small text. The glitch channels become red and violet so every
// existing primitive comes out in DG colours.
export const DG_TOKENS_DARK: Partial<ThemeTokens> = {
  paper: DG.void,
  sub: '#0a0a0c',
  ink: DG.bone,
  dim: '#9a9aa2',
  mute: '#16161a',
  soft: '#0d0d10',
  rule: '#3a3a42',
  rgbR: DG.red,
  rgbB: DG.violet,
  scan: true,
};

// Light: bone paper, near-black ink, the deep violet as accent (the bright
// violet is under 3:1 on light paper). No scan lines on light.
export const DG_TOKENS_LIGHT: Partial<ThemeTokens> = {
  paper: '#F1EFE8',
  sub: '#E7E4DB',
  ink: '#0b0b0e',
  dim: '#5b5b66',
  mute: '#cfcbc1',
  soft: '#dedad0',
  rule: '#2a2a30',
  rgbR: '#c0182b',
  rgbB: DG.deep,
  scan: false,
};

export const DG_TOKENS_BY_MODE: TokensByMode = { dark: DG_TOKENS_DARK, light: DG_TOKENS_LIGHT };

// Rarer but wilder than the homepage: three times the wait, twice the throw.
export const DG_GLITCH = { rate: 3, chaos: 2.2 } as const;

export const DG_DISPLAY_FONT = "'Silkscreen', 'Space Mono', monospace";
export const DG_BODY_FONT = "'Atkinson Hyperlegible Next', system-ui, -apple-system, sans-serif";

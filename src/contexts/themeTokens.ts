// contexts
import type { ThemeMode, ThemeTokens } from './ThemeContext';

export type TokensByMode = Partial<Record<ThemeMode, Partial<ThemeTokens>>>;

// A locked section wins over the stored preference.
export const resolveTheme = (lock: ThemeMode | undefined, stored: ThemeMode): ThemeMode => lock ?? stored;

// Section overrides: a flat set applies to both modes, a per-mode set applies
// to the active one on top of it, so a section can ship its own light and
// dark palettes.
export const pickOverride = (
  mode: ThemeMode,
  tokens?: Partial<ThemeTokens>,
  byMode?: TokensByMode,
): Partial<ThemeTokens> => ({ ...tokens, ...byMode?.[mode] });

// Base palette, then per-section overrides, then the scan-line gate: scan
// lines only ever run on the dark palette with scanLines enabled, whatever
// the override says.
export const resolveTokens = (
  base: ThemeTokens,
  override: Partial<ThemeTokens> | undefined,
  scanAllowed: boolean,
): ThemeTokens => {
  const merged: ThemeTokens = { ...base, ...override };
  return { ...merged, scan: merged.scan && scanAllowed };
};

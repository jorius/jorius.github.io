/* eslint-disable react-refresh/only-export-components */
// packages
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

// contexts
import { pickOverride, resolveTheme, resolveTokens } from './themeTokens';
import type { TokensByMode } from './themeTokens';

// utils
import { storage } from '../utils/storage';

export type ThemeMode = 'dark' | 'light';

export interface ThemeTokens {
  paper: string;
  sub: string;
  ink: string;
  dim: string;
  mute: string;
  soft: string;
  rule: string;
  rgbR: string;
  rgbB: string;
  scan: boolean;
}

export interface BThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  t: ThemeTokens;
  glitch: number;
  // Multiplier on the ambient glitch period (2 = half as often).
  glitchRate: number;
  // Multiplier on glitch displacement; above 1 the slices also re-seed while on.
  glitchChaos: number;
  scanLines: boolean;
}

const B_THEMES: Record<ThemeMode, ThemeTokens> = {
  dark: {
    paper: '#292929',
    sub: '#333333',
    ink: '#f2efe7',
    dim: '#7c7a72',
    mute: '#3a3a3a',
    soft: '#1c1c1c',
    rule: '#e6e2d6',
    rgbR: '#ff2f2f',
    rgbB: '#2fb6ff',
    scan: true,
  },
  light: {
    paper: '#efece4',
    sub: '#e8e4d6',
    ink: '#0d0d0d',
    dim: '#6d6a62',
    mute: '#c8c8c8',
    soft: '#c8c8c8',
    rule: '#0d0d0d',
    rgbR: '#d01818',
    rgbB: '#1068c4',
    scan: false,
  },
};

const BThemeContext = createContext<BThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  t: B_THEMES.dark,
  glitch: 1,
  glitchRate: 1,
  glitchChaos: 1,
  scanLines: true,
});

interface BThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
  glitch?: number;
  scanLines?: boolean;
  // Pin the theme: the stored preference is ignored and toggling is a no-op.
  // Used by dark-only sections such as /darkgalaxy.
  lock?: ThemeMode;
  // Token overrides merged over the base palette of the active mode, so a
  // section can recolour every primitive without forking them.
  tokens?: Partial<ThemeTokens>;
  // Per-mode overrides applied on top of `tokens` for the active mode.
  tokensByMode?: TokensByMode;
  glitchRate?: number;
  glitchChaos?: number;
}

export const BThemeProvider = ({
  children,
  initialTheme = 'dark',
  glitch = 1,
  scanLines = true,
  lock,
  tokens,
  tokensByMode,
  glitchRate = 1,
  glitchChaos = 1,
}: BThemeProviderProps): ReactElement => {
  const [theme, setThemeState] = useState<ThemeMode>(
    () => resolveTheme(lock, storage.getTheme() ?? initialTheme),
  );

  const setTheme = useCallback((mode: ThemeMode) => {
    if (lock) return;
    storage.setTheme(mode);
    setThemeState(mode);
  }, [lock]);

  const value = useMemo<BThemeContextValue>(() => {
    const active = resolveTheme(lock, theme);
    const t = resolveTokens(B_THEMES[active], pickOverride(active, tokens, tokensByMode), active === 'dark' && scanLines);
    return {
      theme: active,
      setTheme,
      toggleTheme: () => setTheme(active === 'dark' ? 'light' : 'dark'),
      t,
      glitch,
      glitchRate,
      glitchChaos,
      scanLines,
    };
  }, [theme, lock, tokens, tokensByMode, glitch, glitchRate, glitchChaos, scanLines, setTheme]);

  return <BThemeContext.Provider value={value}>{children}</BThemeContext.Provider>;
};

export const useBTheme = (): BThemeContextValue => useContext(BThemeContext);

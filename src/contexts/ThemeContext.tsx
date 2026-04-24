/* eslint-disable react-refresh/only-export-components */
// packages
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

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
  scanLines: true,
});

interface BThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
  glitch?: number;
  scanLines?: boolean;
}

export const BThemeProvider = ({
  children,
  initialTheme = 'dark',
  glitch = 1,
  scanLines = true,
}: BThemeProviderProps): ReactElement => {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  const value = useMemo<BThemeContextValue>(() => {
    const base = B_THEMES[theme];
    const t: ThemeTokens = { ...base, scan: theme === 'dark' && scanLines };
    return {
      theme,
      setTheme,
      toggleTheme: () => setTheme((m) => (m === 'dark' ? 'light' : 'dark')),
      t,
      glitch,
      scanLines,
    };
  }, [theme, glitch, scanLines]);

  return <BThemeContext.Provider value={value}>{children}</BThemeContext.Provider>;
};

export const useBTheme = (): BThemeContextValue => useContext(BThemeContext);

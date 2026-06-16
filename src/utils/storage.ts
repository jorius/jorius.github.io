import type { ThemeMode } from '../contexts/ThemeContext';

const THEME_KEY = 'theme';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // private browsing or storage quota exceeded — silently ignore
  }
}

export const storage = {
  getTheme(): ThemeMode {
    const val = safeGet(THEME_KEY);
    return val === 'light' || val === 'dark' ? val : 'dark';
  },
  setTheme(theme: ThemeMode): void {
    safeSet(THEME_KEY, theme);
  },
};

import type { ThemeMode } from '../contexts/ThemeContext';

export const STORAGE_KEYS = {
  theme: 'b-theme',
  lang: 'b-lang',
} as const;

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
    const val = safeGet(STORAGE_KEYS.theme);
    return val === 'light' || val === 'dark' ? val : 'dark';
  },
  setTheme(theme: ThemeMode): void {
    safeSet(STORAGE_KEYS.theme, theme);
  },
  getLanguage(): string | null {
    return safeGet(STORAGE_KEYS.lang);
  },
  setLanguage(lang: string): void {
    safeSet(STORAGE_KEYS.lang, lang);
  },
};

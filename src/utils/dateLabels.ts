// src/utils/dateLabels.ts

// Live editorial date labels. Computed from the visitor's clock so the site
// never carries a stale hard-coded month/quarter/year.

const normalizeLang = (lang: string): 'en' | 'es' => (lang.startsWith('es') ? 'es' : 'en');

// "JUNE 2026" / "JUNIO 2026"
export const currentMonthYear = (lang: string): string => {
  const now = new Date();
  const month = new Intl.DateTimeFormat(normalizeLang(lang), { month: 'long' }).format(now);
  return `${month} ${now.getFullYear()}`.toUpperCase();
};

// "Q2 2026"
export const currentQuarter = (): string => {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q} ${now.getFullYear()}`;
};

// 2026
export const currentYear = (): number => new Date().getFullYear();

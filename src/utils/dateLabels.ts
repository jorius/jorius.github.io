// src/utils/dateLabels.ts

// Live editorial date labels. Computed from the visitor's clock so the site
// never carries a stale hard-coded month/quarter/year.

// "Q2 2026"
export const currentQuarter = (): string => {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q} ${now.getFullYear()}`;
};

// 2026
export const currentYear = (): number => new Date().getFullYear();

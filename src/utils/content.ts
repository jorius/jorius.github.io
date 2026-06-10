// Shared types + locale picker for CMS-managed content (pagescms.org writes
// these JSON files; the app reads them at build time). Each editable string is
// stored as a paired { en, es } object so translations stay side-by-side.

export type Lang = 'en' | 'es';

export interface Localized {
  en: string;
  es: string;
}

export const pickLocale = (field: Localized, lang: string): string => {
  const key: Lang = lang.startsWith('es') ? 'es' : 'en';
  return field[key] ?? field.en;
};

export interface NowContent {
  lastUpdated: string;
  siversNote: Localized;
  entries: Array<{ key: string; label: Localized } & Localized>;
}

export interface WorkService {
  id: string;
  stack: string[];
  title: Localized;
  body: Localized;
}

export interface WorkContent {
  services: WorkService[];
}

export interface WritingCategory {
  id: string;
  order: number;
  label: Localized;
}

export interface WritingPost {
  slug: string;
  category: string;
  date: string;
  len: string;
  tag: string;
  draft: boolean;
  title: Localized;
  body: Localized;
}

const categoryModules = import.meta.glob('../content/writing/categories/*.json', { eager: true });
const postModules = import.meta.glob('../content/writing/posts/*.json', { eager: true });

export const loadCategories = (): WritingCategory[] =>
  Object.values(categoryModules)
    .map((m) => (m as { default: WritingCategory }).default)
    .sort((a, b) => a.order - b.order);

export const loadPosts = (): WritingPost[] =>
  Object.values(postModules)
    .map((m) => (m as { default: WritingPost }).default)
    .filter((p) => (import.meta.env.PROD ? !p.draft : true))
    .sort((a, b) => b.date.localeCompare(a.date));

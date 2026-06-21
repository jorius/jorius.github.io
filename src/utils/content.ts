// Shared types + locale picker for CMS-managed content (pagescms.org writes
// these JSON files; the app reads them at build time). Each editable string is
// stored as a paired { en, es } object so translations stay side-by-side.

export type Lang = 'en' | 'es';

export interface Localized {
  en: string;
  es: string;
}

export const pickLocale = (field: Localized | undefined, lang: string): string => {
  if (!field) return '';
  const key: Lang = lang.startsWith('es') ? 'es' : 'en';
  return field[key] ?? field.en ?? '';
};

// A paired { en, es } field is only usable if it actually carries copy. Pages
// CMS can persist a half-finished entry (missing title/body) which would
// otherwise crash the reader at render time.
const isLocalized = (field: unknown): field is Localized =>
  typeof field === 'object' && field !== null && typeof (field as Localized).en === 'string';

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

export interface WritingTag {
  id: string;
  order: number;
  label: Localized;
  // Optional chip styling, editable in Pages CMS. `color` is a hex value for the
  // glyph square; `glyph` is a 1–2 char monogram. Both fall back gracefully when
  // a CMS entry omits them (see BTagChip).
  color?: string;
  glyph?: string;
}

export interface WritingPost {
  slug: string;
  category: string;
  date: string;
  len: string;
  tags: string[];
  draft: boolean;
  title: Localized;
  body: Localized;
}

const categoryModules = import.meta.glob('../content/writing/categories/*.json', { eager: true });
const tagModules = import.meta.glob('../content/writing/tags/*.json', { eager: true });
const postModules = import.meta.glob('../content/writing/posts/*.json', { eager: true });

export const loadCategories = (): WritingCategory[] =>
  Object.values(categoryModules)
    .map((m) => (m as { default: WritingCategory }).default)
    .sort((a, b) => a.order - b.order);

export const loadTags = (): WritingTag[] =>
  Object.values(tagModules)
    .map((m) => (m as { default: WritingTag }).default)
    .sort((a, b) => a.order - b.order);

export const loadPosts = (): WritingPost[] =>
  Object.values(postModules)
    .map((m) => {
      const raw = (m as { default: WritingPost }).default;
      return {
        ...raw,
        // Pages CMS may omit or null the tags field when no tags are selected;
        // normalize here so every post always carries a valid string[].
        tags: Array.isArray(raw.tags) ? raw.tags : [],
        draft: raw.draft ?? false,
      };
    })
    // Drop incomplete CMS entries: a post without localized title/body has
    // nothing to render and would throw in pickLocale.
    .filter((p) => isLocalized(p.title) && isLocalized(p.body))
    .filter((p) => (import.meta.env.PROD ? !p.draft : true))
    .sort((a, b) => b.date.localeCompare(a.date));

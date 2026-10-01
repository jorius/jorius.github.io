// Reads the site's content from disk for the llms renderer. This runs in Node
// (the Vite build and the dev server), so it cannot share src/utils/content.ts,
// which relies on import.meta.glob; the normalisation it repeats is the same
// on purpose: give arrays a default and drop half-written CMS entries.

// packages
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// data
import { JORIUS } from '../../src/data/jorius';

// llms
import type {
  LabeledId,
  Labels,
  Localized,
  NowInput,
  PostInput,
  ProjectInput,
  SiteInput,
  WorkInput,
} from './render';

// The slice of src/i18n/locales/*.json the renderer needs.
interface LocaleFile {
  directionB: {
    hero: { intro: string; body: string; operatingValue: string; remote: string };
    experience: Record<string, { role: string; body: string } | string>;
    hireWhy: Record<string, { h: string; b: string }>;
    projectsPage: {
      title: string;
      intro: string;
      kind: Record<string, string>;
      status: Record<string, string>;
      link: Record<string, string>;
    };
  };
}

const readJson = <T>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;

const readDir = <T>(dir: string): T[] =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => readJson<T>(join(dir, f)));

const isLocalized = (v: unknown): v is Localized =>
  typeof v === 'object' && v !== null && typeof (v as Localized).en === 'string';

const labelsFrom = (locale: LocaleFile): Labels => {
  const p = locale.directionB.projectsPage;
  return { projectsTitle: p.title, projectsIntro: p.intro, kind: p.kind, status: p.status, link: p.link };
};

export const loadSite = (root: string): SiteInput => {
  const content = join(root, 'src', 'content');
  const en = readJson<LocaleFile>(join(root, 'src', 'i18n', 'locales', 'en.json'));
  const es = readJson<LocaleFile>(join(root, 'src', 'i18n', 'locales', 'es.json'));
  const d = en.directionB;

  const experience = JORIUS.experience.map((x) => {
    const copy = d.experience[x.key];
    const text = typeof copy === 'object' ? copy : { role: '', body: '' };
    return { co: x.co, loc: x.loc, from: x.from, to: x.to, role: text.role, body: text.body };
  });

  const why = JORIUS.hire_why.map((w) => d.hireWhy[w.n]).filter((w) => w !== undefined);

  const posts = readDir<Partial<PostInput>>(join(content, 'writing', 'posts'))
    .filter((p) => typeof p.slug === 'string' && isLocalized(p.title) && isLocalized(p.body))
    .map((p) => ({
      ...(p as PostInput),
      tags: Array.isArray(p.tags) ? p.tags : [],
      draft: p.draft ?? false,
    }));

  const projects = readDir<Partial<ProjectInput>>(join(content, 'projects'))
    .filter((p) => typeof p.id === 'string' && isLocalized(p.title) && isLocalized(p.summary))
    .map((p) => ({
      ...(p as ProjectInput),
      details: Array.isArray(p.details) ? p.details : [],
      links: Array.isArray(p.links) ? p.links : [],
      stack: Array.isArray(p.stack) ? p.stack : [],
      draft: p.draft ?? false,
    }));

  return {
    bio: {
      name: JORIUS.name,
      handle: JORIUS.handle,
      role: JORIUS.role,
      years: JORIUS.years,
      email: JORIUS.email,
      pgp: JORIUS.pgp,
      links: JORIUS.links,
      intro: d.hero.intro,
      body: d.hero.body,
      operating: d.hero.operatingValue,
      remote: d.hero.remote,
      experience,
      why,
    },
    now: readJson<NowInput>(join(content, 'now.json')),
    work: readJson<WorkInput>(join(content, 'work.json')),
    posts,
    projects,
    categories: readDir<LabeledId>(join(content, 'writing', 'categories')),
    tags: readDir<LabeledId>(join(content, 'writing', 'tags')),
    labels: { en: labelsFrom(en), es: labelsFrom(es) },
  };
};

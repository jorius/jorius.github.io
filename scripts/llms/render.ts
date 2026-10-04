// Pure renderer for the crawler-facing files: llms.txt, a markdown copy of
// every page, llms-full.txt, sitemap.xml and robots.txt. It takes content that
// is already loaded and returns a map of output path -> body, so the build and
// the dev server share one code path and the whole thing is unit-testable
// without touching disk.
//
// The site is a client-rendered SPA: a crawler that does not run JavaScript
// sees an empty <body>. These files are what such a crawler reads instead.

export const SITE_URL = 'https://jorius.github.io';

export type Lang = 'en' | 'es';

export interface Localized {
  en: string;
  es: string;
}

// Mirrors the shapes in src/utils/content.ts, reduced to the fields rendered
// here. Kept local so this module never imports Vite-only code (import.meta.glob).
export interface PostInput {
  slug: string;
  category: string;
  date: string;
  len: string;
  tags: string[];
  draft: boolean;
  title: Localized;
  body: Localized;
}

export interface ProjectLinkInput {
  kind: string;
  url: string;
  label?: Localized;
}

export interface ProjectInput {
  id: string;
  order: number;
  year: string;
  kind: string;
  status?: string;
  draft: boolean;
  title: Localized;
  summary: Localized;
  note?: Localized;
  details: Localized[];
  stack: string[];
  links: ProjectLinkInput[];
}

export interface NowInput {
  lastUpdated: string;
  siversNote: Localized;
  entries: Array<{ key: string; label: Localized } & Localized>;
}

export interface WorkInput {
  services: Array<{ id: string; stack: string[]; title: Localized; body: Localized }>;
}

export interface LabeledId {
  id: string;
  label: Localized;
}

export interface ExperienceInput {
  co: string;
  loc: string;
  from: string;
  to: string;
  role: string;
  body: string;
}

export interface BioInput {
  name: string;
  handle: string;
  role: string;
  years: number;
  email: string;
  pgp: { fingerprint: string; keyId: string; algo: string };
  links: { github: string; linkedin: string; stackoverflow: string };
  intro: string;
  body: string;
  anywhere: string;
  tz: string;
  experience: ExperienceInput[];
}

// Display labels taken from the locale files, per language.
export interface Labels {
  projectsTitle: string;
  projectsIntro: string;
  kind: Record<string, string>;
  status: Record<string, string>;
  link: Record<string, string>;
}

export interface SiteInput {
  bio: BioInput;
  now: NowInput;
  work: WorkInput;
  posts: PostInput[];
  projects: ProjectInput[];
  categories: LabeledId[];
  tags: LabeledId[];
  labels: Record<Lang, Labels>;
}

// ---- helpers ----------------------------------------------------------------

const pick = (field: Localized | undefined, lang: Lang): string => field?.[lang] ?? field?.en ?? '';

const other = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');

const versionLabel = (lang: Lang): string => (lang === 'es' ? 'Spanish version' : 'English version');

const labelOf = (list: LabeledId[], id: string, lang: Lang): string =>
  pick(list.find((x) => x.id === id)?.label, lang) || id;

const published = <T extends { draft: boolean }>(xs: T[]): T[] => xs.filter((x) => !x.draft);

const postsNewestFirst = (input: SiteInput): PostInput[] =>
  published(input.posts)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

const projectsInOrder = (input: SiteInput): ProjectInput[] =>
  published(input.projects)
    .slice()
    .sort((a, b) => a.order - b.order);

const postUrl = (slug: string): string => `${SITE_URL}/writing/${slug}`;

const postMdPath = (slug: string, lang: Lang): string =>
  lang === 'es' ? `writing/${slug}.es.md` : `writing/${slug}.md`;

const projectsMdPath = (lang: Lang): string => (lang === 'es' ? 'projects.es.md' : 'projects.md');

// Root-relative URLs only resolve inside the app; a markdown copy read out of
// context needs them absolute. Already-absolute and protocol-relative (//host)
// URLs are left alone.
export const absolutize = (markdown: string, base = SITE_URL): string =>
  markdown
    .replace(/\]\(\/(?!\/)/g, `](${base}/`)
    .replace(/src="\/(?!\/)/g, `src="${base}/`)
    .replace(/^(\[[^\]]+\]:\s*)\/(?!\/)/gm, `$1${base}/`);

const section = (heading: string, lines: string[]): string => [`## ${heading}`, '', ...lines].join('\n');

// ---- pages ------------------------------------------------------------------

const renderPost = (post: PostInput, input: SiteInput, lang: Lang): string => {
  const tags = post.tags.map((t) => labelOf(input.tags, t, lang));
  return [
    `# ${pick(post.title, lang)}`,
    '',
    `- Author: ${input.bio.name} (${input.bio.handle})`,
    `- Published: ${post.date}`,
    `- Category: ${labelOf(input.categories, post.category, lang)}`,
    ...(tags.length ? [`- Tags: ${tags.join(', ')}`] : []),
    `- Reading time: ${post.len}`,
    `- Canonical: ${postUrl(post.slug)}`,
    `- ${versionLabel(other(lang))}: ${SITE_URL}/${postMdPath(post.slug, other(lang))}`,
    '',
    '---',
    '',
    absolutize(pick(post.body, lang).trim()),
    '',
  ].join('\n');
};

const linkLabel = (link: ProjectLinkInput, lang: Lang, labels: Labels): string =>
  link.label ? pick(link.label, lang) : (labels.link[link.kind] ?? link.kind);

const renderProject = (p: ProjectInput, lang: Lang, labels: Labels): string =>
  [
    `## ${pick(p.title, lang)}`,
    '',
    pick(p.summary, lang),
    ...(p.note ? ['', `*${pick(p.note, lang)}*`] : []),
    '',
    `- Year: ${p.year}`,
    `- Kind: ${labels.kind[p.kind] ?? p.kind}`,
    ...(p.status ? [`- Status: ${labels.status[p.status] ?? p.status}`] : []),
    ...(p.stack.length ? [`- Stack: ${p.stack.join(', ')}`] : []),
    ...(p.links.length
      ? [`- Links: ${p.links.map((l) => `[${linkLabel(l, lang, labels)}](${l.url})`).join(', ')}`]
      : []),
    ...(p.details.length ? ['- Details:', ...p.details.map((d) => `  - ${pick(d, lang)}`)] : []),
  ].join('\n');

const renderProjects = (input: SiteInput, lang: Lang): string => {
  const labels = input.labels[lang];
  const head = [
    `# ${labels.projectsTitle}`,
    '',
    labels.projectsIntro,
    '',
    `- Canonical: ${SITE_URL}/projects`,
    `- ${versionLabel(other(lang))}: ${SITE_URL}/${projectsMdPath(other(lang))}`,
  ].join('\n');
  const body = projectsInOrder(input).map((p) => renderProject(p, lang, labels));
  return [head, ...body].join('\n\n') + '\n';
};

// The URL a crawler should follow for a project: the live build when there is
// one, otherwise its repository, otherwise the projects page itself.
const projectUrl = (p: ProjectInput): string =>
  (p.links.find((l) => l.kind === 'live') ?? p.links.find((l) => l.kind === 'repo') ?? p.links[0])?.url ??
  `${SITE_URL}/projects`;

const renderIndex = (input: SiteInput): string => {
  const { bio, now, work, labels } = input;
  const posts = postsNewestFirst(input);
  const projects = projectsInOrder(input);

  const summary =
    `${bio.role}. ${bio.anywhere}, ${bio.tz}. ${bio.intro} ` +
    `This file is the machine-readable index of ${SITE_URL}: every page listed below has a ` +
    'plain markdown copy, so nothing here needs JavaScript.';

  const postMeta = (p: PostInput): string =>
    [
      p.date,
      labelOf(input.categories, p.category, 'en'),
      ...p.tags.map((t) => labelOf(input.tags, t, 'en')),
      p.len,
    ].join(' · ');

  const projectMeta = (p: ProjectInput): string =>
    [
      p.year,
      labels.en.kind[p.kind] ?? p.kind,
      ...(p.status ? [labels.en.status[p.status] ?? p.status] : []),
      p.summary.en,
    ].join(' · ');

  return (
    [
      `# ${bio.name} (${bio.handle})`,
      `> ${summary}`,
      bio.body,
      section('About', [
        `- Name: ${bio.name}, online as ${bio.handle}`,
        `- Role: ${bio.role}`,
        `- Location: ${bio.tz}, ${bio.anywhere.toLowerCase()}`,
        `- Experience: ${bio.years}+ years`,
        `- Email: ${bio.email}`,
        `- PGP: ${bio.pgp.fingerprint} (${bio.pgp.algo}, ${bio.pgp.keyId}), public key at ${SITE_URL}/pgp`,
        `- GitHub: ${bio.links.github}`,
        `- LinkedIn: ${bio.links.linkedin}`,
        `- Stack Overflow: ${bio.links.stackoverflow}`,
        `- Site: ${SITE_URL} (English and Spanish)`,
      ]),
      section('Now', [`Last updated ${now.lastUpdated}.`, '', ...now.entries.map((e) => `- ${e.label.en}: ${e.en}`)]),
      section(
        'Work',
        work.services.map((s) => `- **${s.title.en}** (${s.stack.join(', ')}): ${s.body.en}`),
      ),
      section(
        'Experience',
        bio.experience.map((x) => `- **${x.co}** · ${x.role} · ${x.from} – ${x.to} · ${x.loc}: ${x.body}`),
      ),
      section(
        'Writing',
        posts.map((p) => `- [${p.title.en}](${SITE_URL}/${postMdPath(p.slug, 'en')}): ${postMeta(p)}`),
      ),
      section('Projects', [
        `- [Projects page](${SITE_URL}/${projectsMdPath('en')}): all ${projects.length} projects with details, stack and links`,
        ...projects.map((p) => `- [${p.title.en}](${projectUrl(p)}): ${projectMeta(p)}`),
      ]),
      section('Optional', [
        `- [llms-full.txt](${SITE_URL}/llms-full.txt): this index plus the full text of every post and the projects page, in one file`,
        `- [Sitemap](${SITE_URL}/sitemap.xml): every public URL of the site`,
        `- [Projects page in Spanish](${SITE_URL}/${projectsMdPath('es')})`,
        ...posts.map((p) => `- [${p.title.es} (Spanish)](${SITE_URL}/${postMdPath(p.slug, 'es')})`),
      ]),
    ].join('\n\n') + '\n'
  );
};

const sitemapUrl = (loc: string, lastmod?: string): string =>
  `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;

// Public app routes plus one entry per published post. /palette is a design
// tool and /darkgalaxy is deliberately left out for now.
const renderSitemap = (input: SiteInput): string => {
  const posts = postsNewestFirst(input);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapUrl(`${SITE_URL}/`, input.now.lastUpdated),
    sitemapUrl(`${SITE_URL}/writing`, posts[0]?.date),
    ...posts.map((p) => sitemapUrl(postUrl(p.slug), p.date)),
    sitemapUrl(`${SITE_URL}/projects`),
    sitemapUrl(`${SITE_URL}/pgp`),
    sitemapUrl(`${SITE_URL}/about`),
    sitemapUrl(`${SITE_URL}/contact`),
    '</urlset>',
    '',
  ].join('\n');
};

// Crawlers whose stated purpose is collecting pages for model training. The
// list is honor-system and needs the occasional refresh; search engines and
// user-triggered fetchers are not here on purpose.
const TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'FacebookBot',
  'Bytespider',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Diffbot',
  'ImagesiftBot',
  'omgili',
  'omgilibot',
  'webzio-extended',
  'Timpibot',
  'Ai2Bot',
  'PanguBot',
];

export const renderRobots = (): string =>
  [
    `# ${SITE_URL}`,
    `# Machine-readable overview of this site: ${SITE_URL}/llms.txt`,
    `# Full text of every page in one file:   ${SITE_URL}/llms-full.txt`,
    '',
    '# Search engines and on-demand fetchers (Googlebot, Bingbot, ChatGPT-User,',
    '# OAI-SearchBot, Claude-User, Claude-SearchBot, PerplexityBot, ...): welcome.',
    'User-agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=no',
    'Allow: /',
    '',
    '# Crawlers that collect pages for model training: not this site.',
    ...TRAINING_CRAWLERS.map((agent) => `User-agent: ${agent}`),
    'Disallow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

// ---- entry point ------------------------------------------------------------

export const renderSite = (input: SiteInput): Record<string, string> => {
  const files: Record<string, string> = {};
  const posts = postsNewestFirst(input);

  for (const post of posts) {
    files[postMdPath(post.slug, 'en')] = renderPost(post, input, 'en');
    files[postMdPath(post.slug, 'es')] = renderPost(post, input, 'es');
  }
  files[projectsMdPath('en')] = renderProjects(input, 'en');
  files[projectsMdPath('es')] = renderProjects(input, 'es');
  files['llms.txt'] = renderIndex(input);
  files['llms-full.txt'] = [
    files['llms.txt'],
    ...posts.map((p) => files[postMdPath(p.slug, 'en')]),
    files[projectsMdPath('en')],
  ].join('\n---\n\n');
  files['sitemap.xml'] = renderSitemap(input);
  files['robots.txt'] = renderRobots();
  return files;
};

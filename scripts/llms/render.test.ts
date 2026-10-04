// packages
import { describe, expect, it } from 'vitest';

// llms
import { SITE_URL, absolutize, renderSite } from './render';
import type { Localized, SiteInput } from './render';

const L = (en: string, es = `${en} (es)`): Localized => ({ en, es });

// A small site: one published post and one draft, one published project and
// one draft, so every test can check that drafts never leak.
export const site = (over: Partial<SiteInput> = {}): SiteInput => ({
  bio: {
    name: 'Jose Ríos',
    handle: 'jorius',
    role: 'Senior full-stack engineer / technical lead',
    years: 10,
    email: 'me@example.com',
    pgp: { fingerprint: 'AAAA BBBB CCCC', keyId: '0xAAAABBBB', algo: 'ed25519' },
    links: {
      github: 'https://github.com/jorius',
      linkedin: 'https://linkedin.example/jose',
      stackoverflow: 'https://so.example/jorius',
    },
    intro: 'More than 10 years of production software.',
    body: 'I design and ship systems end to end.',
    anywhere: 'Work from anywhere',
    tz: 'GMT-5 · Colombia',
    experience: [
      { co: 'Acme', loc: 'Colombia', from: 'Jan 2020', to: 'Present', role: 'Lead', body: 'Led things.' },
    ],
  },
  now: {
    lastUpdated: '2026-06-10',
    siversNote: L('Inspired by the now page.'),
    entries: [
      { key: 'looking', label: L('looking', 'buscando'), en: 'Open to remote roles.', es: 'Abierto a roles remotos.' },
    ],
  },
  work: {
    services: [
      { id: '01', stack: ['TypeScript', 'React'], title: L('Full-Stack Development'), body: L('Shipping apps end to end.') },
    ],
  },
  categories: [{ id: 'tech', label: L('Technical Write-Ups', 'Apuntes técnicos') }],
  tags: [{ id: 'homelab', label: L('Homelab') }],
  posts: [
    {
      slug: 'home-lab',
      category: 'tech',
      date: '2026-10-01',
      len: '12 min',
      tags: ['homelab'],
      draft: false,
      title: L('Home Lab'),
      body: L(
        '## The cast\n\n![topology](/images/writing/topo.png)\n\nSee [the Jellyfin post](/writing/jellyfin).',
        '## El elenco\n\n![topología](/images/writing/topo.png)',
      ),
    },
    {
      slug: 'secret-draft',
      category: 'tech',
      date: '2026-09-01',
      len: '1 min',
      tags: [],
      draft: true,
      title: L('Secret Draft'),
      body: L('hidden text'),
    },
  ],
  projects: [
    {
      id: 'academy',
      order: 10,
      year: '2026',
      kind: 'personal',
      draft: false,
      title: L('Academy'),
      summary: L('Interview trainer.'),
      details: [L('No backend')],
      stack: ['React'],
      links: [
        { kind: 'repo', url: 'https://github.com/jorius/academy' },
        { kind: 'live', url: 'https://jorius.github.io/academy/' },
      ],
    },
    {
      id: 'later',
      order: 20,
      year: '2020',
      kind: 'tool',
      status: 'archived',
      draft: false,
      title: L('Later Tool'),
      summary: L('An old tool.'),
      note: L('Built for fun.'),
      details: [],
      stack: [],
      links: [{ kind: 'repo', url: 'https://github.com/jorius/later', label: L('Frontend') }],
    },
    {
      id: 'wip-draft',
      order: 5,
      year: '2026',
      kind: 'tool',
      status: 'wip',
      draft: true,
      title: L('Hidden WIP'),
      summary: L('Not yet.'),
      details: [],
      stack: [],
      links: [],
    },
  ],
  labels: {
    en: {
      projectsTitle: 'Projects',
      projectsIntro: 'Side projects and assessments.',
      kind: { personal: 'PERSONAL', tool: 'TOOL' },
      status: { wip: 'WIP', archived: 'ARCHIVED' },
      link: { repo: 'repository', live: 'live', npm: 'npm', docs: 'docs' },
    },
    es: {
      projectsTitle: 'Proyectos',
      projectsIntro: 'Proyectos personales y pruebas técnicas.',
      kind: { personal: 'PERSONAL', tool: 'HERRAMIENTA' },
      status: { wip: 'EN CURSO', archived: 'ARCHIVADO' },
      link: { repo: 'repositorio', live: 'en línea', npm: 'npm', docs: 'docs' },
    },
  },
  ...over,
});

describe('absolutize', () => {
  it('rewrites root-relative markdown links and images to the site URL', () => {
    expect(absolutize('![a](/images/x.png) [b](/writing/y) [c](https://e.com/) [d](//cdn.e.com/z)')).toBe(
      `![a](${SITE_URL}/images/x.png) [b](${SITE_URL}/writing/y) [c](https://e.com/) [d](//cdn.e.com/z)`,
    );
  });

  it('rewrites root-relative src attributes and reference definitions', () => {
    expect(absolutize('<img src="/images/a.png">\n[ref]: /pgp')).toBe(
      `<img src="${SITE_URL}/images/a.png">\n[ref]: ${SITE_URL}/pgp`,
    );
  });
});

describe('renderSite', () => {
  const files = renderSite(site());

  it('emits exactly the expected set of files', () => {
    expect(Object.keys(files).sort()).toEqual([
      'llms-full.txt',
      'llms.txt',
      'projects.es.md',
      'projects.md',
      'robots.txt',
      'sitemap.xml',
      'writing/home-lab.es.md',
      'writing/home-lab.md',
    ]);
  });

  it('never leaks drafts into any file', () => {
    for (const body of Object.values(files)) {
      expect(body).not.toContain('Secret Draft');
      expect(body).not.toContain('hidden text');
      expect(body).not.toContain('Hidden WIP');
    }
  });

  it('never mentions Dark Galaxy', () => {
    for (const body of Object.values(files)) {
      expect(body).not.toMatch(/dark ?galaxy/i);
    }
  });

  describe('post copies', () => {
    it('heads the English copy with title, metadata and canonical URL', () => {
      const md = files['writing/home-lab.md'];
      expect(md.startsWith('# Home Lab\n')).toBe(true);
      expect(md).toContain('- Author: Jose Ríos (jorius)');
      expect(md).toContain('- Published: 2026-10-01');
      expect(md).toContain('- Category: Technical Write-Ups');
      expect(md).toContain('- Tags: Homelab');
      expect(md).toContain('- Reading time: 12 min');
      expect(md).toContain(`- Canonical: ${SITE_URL}/writing/home-lab`);
      expect(md).toContain(`- Spanish version: ${SITE_URL}/writing/home-lab.es.md`);
    });

    it('carries the body with links and images made absolute', () => {
      const md = files['writing/home-lab.md'];
      expect(md).toContain('## The cast');
      expect(md).toContain(`![topology](${SITE_URL}/images/writing/topo.png)`);
      expect(md).toContain(`[the Jellyfin post](${SITE_URL}/writing/jellyfin)`);
    });

    it('uses the Spanish title, labels and body in the .es.md copy', () => {
      const md = files['writing/home-lab.es.md'];
      expect(md.startsWith('# Home Lab (es)\n')).toBe(true);
      expect(md).toContain('- Category: Apuntes técnicos');
      expect(md).toContain('## El elenco');
      expect(md).toContain(`- English version: ${SITE_URL}/writing/home-lab.md`);
      expect(md).not.toContain('## The cast');
    });
  });

  describe('projects page', () => {
    it('lists published projects in order with summary, details, stack and labelled links', () => {
      const md = files['projects.md'];
      expect(md.startsWith('# Projects\n')).toBe(true);
      expect(md).toContain('Side projects and assessments.');
      expect(md).toContain(`- Canonical: ${SITE_URL}/projects`);
      expect(md.indexOf('## Academy')).toBeLessThan(md.indexOf('## Later Tool'));
      expect(md).toContain('Interview trainer.');
      expect(md).toContain('- Year: 2026');
      expect(md).toContain('- Kind: PERSONAL');
      expect(md).toContain('- Stack: React');
      expect(md).toContain('- Links: [repository](https://github.com/jorius/academy), [live](https://jorius.github.io/academy/)');
      expect(md).toContain('  - No backend');
    });

    it('shows status, note and custom link labels when a project has them', () => {
      const md = files['projects.md'];
      expect(md).toContain('- Status: ARCHIVED');
      expect(md).toContain('*Built for fun.*');
      expect(md).toContain('[Frontend](https://github.com/jorius/later)');
    });

    it('translates labels and copy in the Spanish page', () => {
      const md = files['projects.es.md'];
      expect(md).toContain('Proyectos personales y pruebas técnicas.');
      expect(md).toContain('- Kind: HERRAMIENTA');
      expect(md).toContain('- Status: ARCHIVADO');
      expect(md).toContain('[repositorio](https://github.com/jorius/academy)');
      expect(md).toContain('Interview trainer. (es)');
    });
  });

  describe('llms.txt', () => {
    const index = files['llms.txt'];

    it('opens with the name as H1 and a one-paragraph blockquote summary', () => {
      const [h1, , quote] = index.split('\n');
      expect(h1).toBe('# Jose Ríos (jorius)');
      expect(quote.startsWith('> ')).toBe(true);
      expect(quote).toContain('Senior full-stack engineer / technical lead');
      expect(quote).toContain(SITE_URL);
    });

    it('carries contact and profile details', () => {
      expect(index).toContain('me@example.com');
      expect(index).toContain('AAAA BBBB CCCC');
      expect(index).toContain('https://github.com/jorius');
      expect(index).toContain('https://linkedin.example/jose');
      expect(index).toContain('Location: GMT-5 · Colombia, work from anywhere');
    });

    it('carries now, work and experience sections', () => {
      expect(index).toContain('## Now');
      expect(index).toContain('Open to remote roles.');
      expect(index).toContain('**Full-Stack Development**');
      expect(index).toContain('Shipping apps end to end.');
      expect(index).toContain('**Acme**');
      expect(index).toContain('Led things.');
    });

    it('links each published post to its markdown copy with its metadata', () => {
      expect(index).toContain('## Writing');
      expect(index).toContain(`- [Home Lab](${SITE_URL}/writing/home-lab.md): 2026-10-01 · Technical Write-Ups · Homelab · 12 min`);
    });

    it('links the projects page and each project to its live URL or repository', () => {
      expect(index).toContain('## Projects');
      expect(index).toContain(`- [Projects page](${SITE_URL}/projects.md)`);
      expect(index).toContain('- [Academy](https://jorius.github.io/academy/): 2026 · PERSONAL · Interview trainer.');
      expect(index).toContain('- [Later Tool](https://github.com/jorius/later): 2020 · TOOL · ARCHIVED · An old tool.');
    });

    it('ends with an Optional section pointing at the full bundle, sitemap and Spanish copies', () => {
      const optional = index.slice(index.indexOf('## Optional'));
      expect(optional).toContain(`${SITE_URL}/llms-full.txt`);
      expect(optional).toContain(`${SITE_URL}/sitemap.xml`);
      expect(optional).toContain(`${SITE_URL}/projects.es.md`);
      expect(optional).toContain(`${SITE_URL}/writing/home-lab.es.md`);
    });
  });

  describe('llms-full.txt', () => {
    it('bundles the index, every published post and the projects page', () => {
      const full = files['llms-full.txt'];
      expect(full.startsWith(files['llms.txt'])).toBe(true);
      expect(full).toContain('# Home Lab\n');
      expect(full).toContain('## The cast');
      expect(full).toContain('# Projects\n');
      expect(full).toContain('## Academy');
    });
  });

  describe('sitemap.xml', () => {
    const xml = files['sitemap.xml'];
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    it('lists the public app routes and every published post', () => {
      expect(locs).toEqual([
        `${SITE_URL}/`,
        `${SITE_URL}/writing`,
        `${SITE_URL}/writing/home-lab`,
        `${SITE_URL}/projects`,
        `${SITE_URL}/pgp`,
        `${SITE_URL}/about`,
        `${SITE_URL}/contact`,
      ]);
    });

    it('dates the home page by the now entry and each post by its date', () => {
      expect(xml).toContain(`<loc>${SITE_URL}/</loc><lastmod>2026-06-10</lastmod>`);
      expect(xml).toContain(`<loc>${SITE_URL}/writing/home-lab</loc><lastmod>2026-10-01</lastmod>`);
      expect(xml).toContain(`<loc>${SITE_URL}/writing</loc><lastmod>2026-10-01</lastmod>`);
    });

    it('is a well-formed urlset', () => {
      expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')).toBe(true);
      expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
    });
  });

  describe('robots.txt', () => {
    const robots = files['robots.txt'];
    // Group the file the way a crawler does: a run of User-agent lines
    // followed by its directives.
    const groups: Array<{ agents: string[]; directives: string[] }> = [];
    for (const raw of robots.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const [key, ...rest] = line.split(':');
      const value = rest.join(':').trim();
      if (key.toLowerCase() === 'user-agent') {
        const last = groups[groups.length - 1];
        if (last && last.directives.length === 0) last.agents.push(value);
        else groups.push({ agents: [value], directives: [] });
      } else if (groups.length > 0 && key.toLowerCase() !== 'sitemap') {
        groups[groups.length - 1].directives.push(line);
      }
    }
    const groupFor = (agent: string) => groups.find((g) => g.agents.includes(agent));

    it('lets everyone else in and signals search yes, AI input yes, AI training no', () => {
      expect(groupFor('*')?.directives).toEqual(['Content-Signal: search=yes, ai-input=yes, ai-train=no', 'Allow: /']);
    });

    it('disallows known training crawlers', () => {
      for (const agent of ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'Applebot-Extended', 'meta-externalagent', 'Bytespider']) {
        expect(groupFor(agent)?.directives, agent).toEqual(['Disallow: /']);
      }
    });

    it('leaves search engines and on-demand fetchers on the open default group', () => {
      for (const agent of ['Googlebot', 'Bingbot', 'ChatGPT-User', 'OAI-SearchBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot']) {
        expect(groupFor(agent), agent).toBeUndefined();
      }
    });

    it('advertises the sitemap and points at llms.txt', () => {
      expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
      expect(robots).toContain(`${SITE_URL}/llms.txt`);
    });
  });
});

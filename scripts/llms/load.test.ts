// packages
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// llms
import { loadSite } from './load';
import { renderSite } from './render';

// data
import { JORIUS } from '../../src/data/jorius';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

// Integration check against the real content on disk: whatever the CMS has
// written must load, render, and keep the two things we promised out.
describe('loadSite against the real content', () => {
  const input = loadSite(root);
  const files = renderSite(input);

  it('reads the bio and the locale copy that goes with it', () => {
    expect(input.bio.name).toBe(JORIUS.name);
    expect(input.bio.email).toBe(JORIUS.email);
    expect(input.bio.intro.length).toBeGreaterThan(20);
    expect(input.bio.experience).toHaveLength(JORIUS.experience.length);
    expect(input.bio.experience[0].role.length).toBeGreaterThan(0);
    expect(input.bio.anywhere.length).toBeGreaterThan(0);
    expect(input.bio.tz.length).toBeGreaterThan(0);
    expect(input.labels.es.kind.assessment).toBe('PRUEBA TÉCNICA');
  });

  it('produces an English and a Spanish copy for every published post on disk', () => {
    const dir = resolve(root, 'src/content/writing/posts');
    const slugs = readdirSync(dir)
      .map((f) => JSON.parse(readFileSync(resolve(dir, f), 'utf8')) as { slug: string; draft?: boolean })
      .filter((p) => !p.draft)
      .map((p) => p.slug);
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(files).toHaveProperty(`writing/${slug}.md`);
      expect(files).toHaveProperty(`writing/${slug}.es.md`);
    }
  });

  it('keeps the WhatsApp number out of every file', () => {
    const digits = JORIUS.whatsapp.replace(/\D/g, '');
    for (const [path, body] of Object.entries(files)) {
      expect(body.replace(/\D/g, ''), path).not.toContain(digits);
    }
  });

  it('never mentions Dark Galaxy anywhere', () => {
    for (const [path, body] of Object.entries(files)) {
      expect(body, path).not.toMatch(/dark ?galaxy/i);
    }
  });

  it('leaves no root-relative link in any markdown copy', () => {
    for (const [path, body] of Object.entries(files)) {
      if (path.endsWith('.md')) expect(body, path).not.toMatch(/\]\(\/(?!\/)/);
    }
  });
});

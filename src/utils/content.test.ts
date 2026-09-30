// packages
import { describe, expect, it } from 'vitest';

// utils
import { loadProjects, normaliseProject, selectPublished } from './content';
import type { ProjectEntry } from './content';

// components
import { TECH } from '../components/direction-b/StackChip';

export const entry = (over: Partial<ProjectEntry> = {}): ProjectEntry => ({
  id: 'x',
  order: 10,
  year: '2026',
  kind: 'personal',
  draft: false,
  title: { en: 'X', es: 'X' },
  summary: { en: 'S', es: 'S' },
  details: [],
  stack: [],
  links: [],
  ...over,
});

describe('selectPublished', () => {
  it('sorts by order and keeps drafts outside production', () => {
    const out = selectPublished([entry({ id: 'b', order: 20 }), entry({ id: 'a', order: 10, draft: true })], false);
    expect(out.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('drops drafts in production', () => {
    const out = selectPublished([entry({ id: 'b', order: 20 }), entry({ id: 'a', order: 10, draft: true })], true);
    expect(out.map((p) => p.id)).toEqual(['b']);
  });

  it('does not mutate its input', () => {
    const input = [entry({ id: 'b', order: 20 }), entry({ id: 'a', order: 10 })];
    selectPublished(input, false);
    expect(input[0].id).toBe('b');
  });
});

describe('normaliseProject', () => {
  it('fills the optional arrays and the draft flag', () => {
    const p = normaliseProject({ id: 'y', order: 5, year: '2020', kind: 'tool', title: { en: 'Y', es: 'Y' }, summary: { en: 's', es: 's' } });
    expect(p.details).toEqual([]);
    expect(p.links).toEqual([]);
    expect(p.stack).toEqual([]);
    expect(p.draft).toBe(false);
  });

  it('keeps provided values', () => {
    const p = normaliseProject(entry({ draft: true, stack: ['Node'] }));
    expect(p.draft).toBe(true);
    expect(p.stack).toEqual(['Node']);
  });
});

const KINDS = ['personal', 'assessment', 'client', 'tool', 'package'];
const STATUSES = ['wip', 'archived'];
const LINK_KINDS = ['repo', 'live', 'npm', 'docs'];

const hasBoth = (v: unknown): boolean =>
  typeof v === 'object' && v !== null
  && typeof (v as { en?: unknown }).en === 'string' && (v as { en: string }).en.trim() !== ''
  && typeof (v as { es?: unknown }).es === 'string' && (v as { es: string }).es.trim() !== '';

describe('projects content', () => {
  // vitest runs outside PROD, so drafts are included and validated too.
  const projects = loadProjects();

  it('has the eleven cards', () => {
    expect(projects).toHaveLength(11);
  });

  it('has unique ids and orders', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.order)).size).toBe(projects.length);
  });

  it('comes back sorted by order', () => {
    const orders = projects.map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('carries English and Spanish for every string', () => {
    for (const p of projects) {
      expect(hasBoth(p.title), `${p.id} title`).toBe(true);
      expect(hasBoth(p.summary), `${p.id} summary`).toBe(true);
      for (const d of p.details) expect(hasBoth(d), `${p.id} detail`).toBe(true);
      if (p.note !== undefined) expect(hasBoth(p.note), `${p.id} note`).toBe(true);
      for (const l of p.links) if (l.label) expect(hasBoth(l.label), `${p.id} link ${l.url}`).toBe(true);
      expect(p.year.trim(), `${p.id} year`).not.toBe('');
    }
  });

  it('uses only known kinds, statuses and link kinds', () => {
    for (const p of projects) {
      expect(KINDS, `${p.id} kind`).toContain(p.kind);
      if (p.status !== undefined) expect(STATUSES, `${p.id} status`).toContain(p.status);
      for (const l of p.links) expect(LINK_KINDS, `${p.id} link kind`).toContain(l.kind);
    }
  });

  it('links only to https URLs and has at least one link and one chip per card', () => {
    for (const p of projects) {
      expect(p.links.length, `${p.id} links`).toBeGreaterThan(0);
      expect(p.stack.length, `${p.id} stack`).toBeGreaterThan(0);
      for (const l of p.links) expect(l.url, `${p.id} ${l.url}`).toMatch(/^https:\/\//);
    }
  });

  it('only uses stack names that have a chip definition', () => {
    for (const p of projects) {
      for (const s of p.stack) expect(Object.keys(TECH), `${p.id} chip ${s}`).toContain(s);
    }
  });
});

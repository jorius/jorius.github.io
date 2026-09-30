// packages
import { describe, expect, it } from 'vitest';

// utils
import { normaliseProject, selectPublished } from './content';
import type { ProjectEntry } from './content';

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

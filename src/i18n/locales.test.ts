// packages
import { describe, expect, it } from 'vitest';

// i18n
import en from './locales/en.json';
import es from './locales/es.json';

// The locale JSON is nested objects of strings (one legacy array aside); the
// walker treats anything that is not a string as a branch.
type Tree = { [key: string]: unknown };

const paths = (node: Tree, prefix = ''): string[] =>
  Object.entries(node).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : paths(v as Tree, `${prefix}${k}.`),
  );

// A key present in one language and missing in the other renders as its raw
// path, so the two files must describe the same tree.
describe('locale files', () => {
  it('have the same keys in English and Spanish', () => {
    const enKeys = paths(en as unknown as Tree).sort();
    const esKeys = paths(es as unknown as Tree).sort();
    expect(esKeys).toEqual(enKeys);
  });

  it('no longer carry the keys of the removed landing sections', () => {
    const enKeys = paths(en as unknown as Tree);
    for (const dead of ['directionB.oss.', 'directionB.hireWhy.', 'directionB.sections.why.', 'directionB.sections.writing.', 'directionB.sections.index.', 'directionB.hero.headline.', 'directionB.topbar.pressKey']) {
      expect(enKeys.some((k) => k.startsWith(dead)), dead).toBe(false);
    }
  });
});

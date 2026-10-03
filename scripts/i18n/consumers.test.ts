// packages
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = join(root, 'src');
const en: unknown = JSON.parse(readFileSync(join(src, 'i18n', 'locales', 'en.json'), 'utf8'));

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name: string) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [p] : [];
  });

const resolveKey = (tree: unknown, key: string): boolean =>
  key
    .split('.')
    .reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), tree) !==
  undefined;

// Every static `t('directionB.…')` literal in the components must resolve in
// the English file; a key that was deleted but is still read renders as its
// raw path. Dynamic keys (template literals) are not covered here.
describe('locale consumers', () => {
  it('read only keys that exist', () => {
    const misses: string[] = [];
    for (const file of walk(src)) {
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(/\b(?:t|tr)\(\s*'(directionB\.[^']+)'/g)) {
        if (!resolveKey(en, m[1])) misses.push(`${file.replace(root, '.')}: ${m[1]}`);
      }
    }
    expect(misses).toEqual([]);
  });
});

// packages
import { describe, expect, it } from 'vitest';

// utils
import { extractHeadings } from './headings';

describe('extractHeadings', () => {
  it('lists h2 and h3 with source lines, skipping h1 and fenced code', () => {
    const md = ['# Title', '', '## Why not just open a port?', 'text', '```bash', '## not a heading', '```', '### Step 1: the `Pi`'].join('\n');
    expect(extractHeadings(md)).toEqual([
      { line: 3, depth: 2, text: 'Why not just open a port?', id: 'why-not-just-open-a-port' },
      { line: 8, depth: 3, text: 'Step 1: the Pi', id: 'step-1-the-pi' },
    ]);
  });

  it('strips links and accents, and dedupes ids', () => {
    const md = ['## Qué son [Interledger](https://interledger.org/)', '## Gotchas', '## Gotchas'].join('\n');
    expect(extractHeadings(md).map((h) => h.id)).toEqual(['que-son-interledger', 'gotchas', 'gotchas-2']);
  });

  it('uses image alt text, so a heading made of images still gets a name', () => {
    expect(extractHeadings('## ![](/icon.svg#inline) ![Paynela](/wordmark.svg#inline)')[0]).toMatchObject({ text: 'Paynela', id: 'paynela' });
  });
});

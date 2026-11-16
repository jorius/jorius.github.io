export interface PostHeading {
  // 1-based source line, matched against react-markdown's node position so the
  // rendered heading gets the same id without re-deriving it from React children.
  line: number;
  depth: 2 | 3;
  text: string;
  id: string;
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Inline markdown a heading can carry: `code`, *em*/**strong**, [link](url), ![image](src) (its alt).
const plain = (md: string): string =>
  md
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .trim();

// The post's `##` and `###` headings, in order, for the reader's index.
// Lines inside fenced code blocks are skipped (a `## ` there is a comment).
export const extractHeadings = (md: string): PostHeading[] => {
  const seen = new Map<string, number>();
  const out: PostHeading[] = [];
  let inFence = false;
  md.split('\n').forEach((raw, i) => {
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(raw);
    if (!m) return;
    const text = plain(m[2]);
    const base = slugify(text) || 'section';
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    out.push({ line: i + 1, depth: m[1].length as 2 | 3, text, id: n ? `${base}-${n + 1}` : base });
  });
  return out;
};

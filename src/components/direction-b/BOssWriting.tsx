// packages
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import useGitHubRepos from '../../hooks/useGitHubRepos';
import type { GitHubRepo } from '../../hooks/useGitHubRepos';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

const OSS_LIMIT = 6;

const selectTopOss = (repos: GitHubRepo[]): GitHubRepo[] =>
  repos
    .filter((r) => !r.private && !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, OSS_LIMIT);

export const BOssWriting = (): React.ReactElement => {
  const { t } = useBTheme();
  const { repos, loading, error } = useGitHubRepos();
  const topOss = useMemo(() => selectTopOss(repos), [repos]);
  const max = topOss.length > 0 ? Math.max(...topOss.map((r) => r.stargazers_count), 1) : 1;

  return (
    <>
      <BSectionHead
        id="b-writing"
        num="05"
        label="WRITING & OSS."
        kicker="Long-form notes and live public repositories. The things I'd point a hiring manager at, if asked."
      />
      <div
        style={{
          padding: '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 48,
          borderTop: `1px solid ${t.rule}`,
          paddingTop: 32,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            — Writing
          </div>
          {JORIUS.writing.map((w, i) => (
            <Reveal key={w.slug} delay={i * 40}>
              <Link
                to={`/read/${w.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr 72px',
                  padding: '18px 0',
                  borderBottom: `1px solid ${t.soft}`,
                  color: t.ink,
                  textDecoration: 'none',
                  gap: 12,
                  alignItems: 'baseline',
                  transition: 'background 180ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = t.sub;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ color: t.dim, fontSize: 12 }}>{w.date}</span>
                <span style={{ fontSize: 17, letterSpacing: '-0.01em' }}>
                  <Glitch trigger="hover">{w.title}</Glitch>
                </span>
                <span style={{ color: t.dim, fontSize: 12, textAlign: 'right' }}>{w.len}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: t.dim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            — Open source
          </div>

          {loading ? (
            <div style={{ fontSize: 12, color: t.dim, padding: '16px 0' }}>loading public repos…</div>
          ) : null}

          {!loading && error ? (
            <div style={{ fontSize: 12, color: t.dim, padding: '16px 0', lineHeight: 1.5 }}>
              GitHub API unavailable: {error}.
              <br />
              Visit{' '}
              <a
                href={JORIUS.links.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: t.ink }}
              >
                github.com/{JORIUS.handle}
              </a>{' '}directly.
            </div>
          ) : null}

          {!loading && !error && topOss.length === 0 ? (
            <div style={{ fontSize: 12, color: t.dim, padding: '16px 0' }}>
              No public, non-forked, non-archived repositories found yet.
            </div>
          ) : null}

          {topOss.map((r, i) => (
            <Reveal
              key={r.id}
              delay={i * 50}
              style={{ padding: '16px 0', borderBottom: `1px solid ${t.soft}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.ink, textDecoration: 'none', fontSize: 15 }}
                >
                  <Glitch trigger="hover">{r.full_name}</Glitch>
                </a>
                <span style={{ fontSize: 12, color: t.dim }}>
                  ★ {r.stargazers_count.toLocaleString()}
                  {r.language ? ` · ${r.language}` : ''}
                </span>
              </div>
              {r.description ? (
                <div style={{ fontSize: 13, color: t.dim, marginTop: 4 }}>{r.description}</div>
              ) : null}
              <div style={{ height: 3, background: t.soft, marginTop: 10, position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${(r.stargazers_count / max) * 100}%`,
                    background: t.ink,
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
};

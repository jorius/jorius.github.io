// packages
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import useGitHubRepos from '../../hooks/useGitHubRepos';
import type { GitHubRepo } from '../../hooks/useGitHubRepos';
import { useIsMobile } from '../../hooks/useMediaQuery';

// utils
import { getLanguageIcon } from '../../utils/languageIcons';
import { loadPosts, pickLocale } from '../../utils/content';

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
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const { repos, loading, error } = useGitHubRepos();
  const topOss = useMemo(() => selectTopOss(repos), [repos]);
  const max = topOss.length > 0 ? Math.max(...topOss.map((r) => r.stargazers_count), 1) : 1;
  const posts = useMemo(() => loadPosts(), []);
  const hasWriting = posts.length > 0;

  return (
    <>
      <BSectionHead
        id="b-writing"
        num={tr('directionB.sections.writing.num')}
        label={tr('directionB.sections.writing.label')}
        kicker={tr('directionB.sections.writing.kicker')}
      />
      <div
        style={{
          padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
          gap: isMobile ? 32 : 48,
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
            {tr('directionB.oss.writingHeader')}
          </div>

          {!hasWriting ? (
            <div style={{ fontSize: 13, color: t.dim, padding: '24px 0', lineHeight: 1.5 }}>
              {tr('directionB.oss.writingEmpty')}
            </div>
          ) : null}

          {posts.map((w, i) => (
            <Reveal key={w.slug} delay={i * 40}>
              <Link
                to={`/writing/${w.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '110px 1fr 72px',
                  padding: '18px 0',
                  borderBottom: `1px solid ${t.soft}`,
                  color: t.ink,
                  textDecoration: 'none',
                  gap: isMobile ? 6 : 12,
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
                  <Glitch trigger="hover">{pickLocale(w.title, i18n.language)}</Glitch>
                </span>
                <span style={{ color: t.dim, fontSize: 12, textAlign: isMobile ? 'left' : 'right' }}>{w.len}</span>
              </Link>
            </Reveal>
          ))}

          {hasWriting ? (
            <Link
              to="/writing"
              style={{
                display: 'block',
                marginTop: 16,
                fontSize: 12,
                color: t.dim,
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = t.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = t.dim; }}
            >
              <Glitch trigger="hover">{tr('directionB.oss.viewAllPosts')}</Glitch>
            </Link>
          ) : null}
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
            {tr('directionB.oss.ossHeader')}
          </div>

          {loading ? (
            <div style={{ fontSize: 12, color: t.dim, padding: '16px 0' }}>{tr('directionB.oss.loading')}</div>
          ) : null}

          {!loading && error ? (
            <div style={{ fontSize: 12, color: t.dim, padding: '16px 0', lineHeight: 1.5 }}>
              {tr('directionB.oss.errorPrefix')}: {error}.
              <br />
              {tr('directionB.oss.visitDirectly')}{' '}
              <a
                href={JORIUS.links.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: t.ink }}
              >
                github.com/{JORIUS.handle}
              </a>{' '}{tr('directionB.oss.directly')}
            </div>
          ) : null}

          {!loading && !error && topOss.length === 0 ? (
            <div style={{ fontSize: 12, color: t.dim, padding: '16px 0' }}>
              {tr('directionB.oss.empty')}
            </div>
          ) : null}

          {topOss.map((r, i) => (
            <Reveal
              key={r.id}
              delay={i * 50}
              style={{ padding: '16px 0', borderBottom: `1px solid ${t.soft}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.ink, textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <FaGithub aria-hidden style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <Glitch trigger="hover">{r.full_name}</Glitch>
                </a>
                <span style={{ fontSize: 12, color: t.dim, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  ★ {r.stargazers_count.toLocaleString()}
                  {r.language ? (() => {
                    const li = getLanguageIcon(r.language);
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        ·
                        {li ? <li.Icon aria-hidden style={{ width: 12, height: 12, color: li.color }} /> : null}
                        {r.language}
                      </span>
                    );
                  })() : null}
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

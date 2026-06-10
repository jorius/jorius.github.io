// src/pages/Writing.tsx

// packages
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../hooks/useMediaQuery';

// utils
import { loadCategories, loadPosts, pickLocale } from '../utils/content';

// components
import { BTopBar } from '../components/direction-b/BTopBar';
import { DarkGrain } from '../components/primitives/DarkGrain';
import { Glitch } from '../components/primitives/Glitch';
import { ScanLines } from '../components/primitives/ScanLines';

const Writing = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const lang = i18n.language;

  const categories = useMemo(() => loadCategories(), []);
  const posts = useMemo(() => loadPosts(), []);

  // Active post: the slug from the URL, else the first post (newest first).
  const active = useMemo(
    () => posts.find((p) => p.slug === slug) ?? posts[0] ?? null,
    [posts, slug],
  );

  // Keep the URL canonical: if no slug (or unknown slug) and we have posts,
  // redirect to the active post so links are shareable.
  useEffect(() => {
    if (active && active.slug !== slug) {
      navigate(`/writing/${active.slug}`, { replace: true });
    }
  }, [active, slug, navigate]);

  const postsByCategory = (catId: string): typeof posts => posts.filter((p) => p.category === catId);

  const treeWidth = isMobile ? '100%' : 'clamp(220px, 26vw, 320px)';

  return (
    <div style={{ background: t.paper, color: t.ink, minHeight: '100vh', position: 'relative' }}>
      <ScanLines />
      <DarkGrain />
      <BTopBar />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : `${treeWidth} 1fr`,
          gap: isMobile ? 24 : 40,
          padding: isMobile ? '24px 20px 60px 20px' : '40px 32px 80px 32px',
          alignItems: 'start',
        }}
      >
        {/* LEFT — category tree */}
        <nav
          style={{
            position: isMobile ? 'static' : 'sticky',
            top: isMobile ? undefined : 80,
            borderRight: isMobile ? 'none' : `1px solid ${t.rule}`,
            paddingRight: isMobile ? 0 : 20,
          }}
        >
          <Link
            to="/"
            style={{ fontSize: 11, color: t.dim, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            <Glitch trigger="hover">{tr('directionB.read.back')}</Glitch>
          </Link>
          <div style={{ marginTop: 20 }}>
            {categories.map((cat) => {
              const catPosts = postsByCategory(cat.id);
              if (catPosts.length === 0) return null;
              return (
                <div key={cat.id} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: t.dim,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    {pickLocale(cat.label, lang)}
                  </div>
                  {catPosts.map((p) => {
                    const isActive = active?.slug === p.slug;
                    return (
                      <Link
                        key={p.slug}
                        to={`/writing/${p.slug}`}
                        style={{
                          display: 'block',
                          padding: '7px 0 7px 12px',
                          borderLeft: `2px solid ${isActive ? t.ink : t.soft}`,
                          color: isActive ? t.ink : t.dim,
                          textDecoration: 'none',
                          fontSize: 14,
                          lineHeight: 1.4,
                          transition: 'color 150ms, border-color 150ms',
                        }}
                      >
                        <Glitch trigger="hover">{pickLocale(p.title, lang)}</Glitch>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </nav>

        {/* RIGHT — paper reader */}
        <article
          style={{
            background: t.paper,
            border: `1px solid ${t.rule}`,
            boxShadow: `8px 8px 0 ${t.ink}`,
            padding: isMobile ? '28px 22px' : '56px clamp(32px, 6vw, 88px)',
            maxWidth: 760,
            width: '100%',
          }}
        >
          {active ? (
            <>
              <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {active.date} · {active.len} · {active.tag}
              </div>
              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: isMobile ? 28 : 'clamp(32px, 5vw, 52px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  margin: '14px 0 28px 0',
                  color: t.ink,
                }}
              >
                {pickLocale(active.title, lang)}
              </h1>
              <div
                className="b-reader"
                style={{ fontSize: 17, lineHeight: 1.75, color: t.ink, maxWidth: '64ch' }}
              >
                <Markdown remarkPlugins={[remarkGfm]}>{pickLocale(active.body, lang)}</Markdown>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: t.dim }}>{tr('directionB.oss.writingEmpty')}</div>
          )}
        </article>
      </div>
    </div>
  );
};

export default Writing;

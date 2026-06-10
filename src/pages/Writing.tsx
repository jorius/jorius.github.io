// src/pages/Writing.tsx

// packages
import { useEffect, useMemo, useState } from 'react';
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

  // Collapsed category ids. Empty = all expanded by default; the user can fold
  // any parent branch closed.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleCategory = (catId: string): void =>
    setCollapsed((c) => ({ ...c, [catId]: !c[catId] }));

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
            style={{ fontSize: 11, color: t.ink, opacity: 0.6, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            <Glitch trigger="hover">{tr('directionB.read.back')}</Glitch>
          </Link>
          <div style={{ marginTop: 20 }}>
            {categories.map((cat) => {
              const catPosts = postsByCategory(cat.id);
              if (catPosts.length === 0) return null;
              const isCollapsed = collapsed[cat.id] ?? false;
              return (
                <div key={cat.id} style={{ marginBottom: 20 }}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    aria-expanded={!isCollapsed}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      marginBottom: 8,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      fontSize: 11,
                      color: t.ink,
                      opacity: 0.62,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        fontSize: 9,
                        display: 'inline-block',
                        transform: isCollapsed ? 'rotate(-90deg)' : 'none',
                        transition: 'transform 150ms',
                      }}
                    >
                      ▾
                    </span>
                    {pickLocale(cat.label, lang)}
                  </button>
                  {!isCollapsed
                    ? catPosts.map((p) => {
                        const isActive = active?.slug === p.slug;
                        return (
                          <Link
                            key={p.slug}
                            to={`/writing/${p.slug}`}
                            style={{
                              display: 'block',
                              padding: '7px 0 7px 12px',
                              borderLeft: `2px solid ${isActive ? t.ink : t.soft}`,
                              color: t.ink,
                              opacity: isActive ? 1 : 0.72,
                              textDecoration: 'none',
                              fontSize: 14,
                              lineHeight: 1.4,
                              transition: 'opacity 150ms, border-color 150ms',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = isActive ? '1' : '0.72'; }}
                          >
                            <Glitch trigger="hover">{pickLocale(p.title, lang)}</Glitch>
                          </Link>
                        );
                      })
                    : null}
                </div>
              );
            })}
          </div>
        </nav>

        {/* RIGHT — paper reader */}
        <article
          style={{
            background: t.sub,
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

// src/pages/Writing.tsx

// packages
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../hooks/useMediaQuery';

// utils
import { loadCategories, loadPosts, loadTags, pickLocale } from '../utils/content';

// components
import { BTopBar } from '../components/direction-b/BTopBar';
import { CommandPalette } from '../components/CommandPalette';
import { PALETTE_SECTIONS } from '../components/direction-b/paletteSections';
import { DarkGrain } from '../components/primitives/DarkGrain';
import { Glitch } from '../components/primitives/Glitch';
import { ScanLines } from '../components/primitives/ScanLines';

const Writing = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const { slug } = useParams<{ slug: string }>();
  const lang = i18n.language;

  const categories = useMemo(() => loadCategories(), []);
  const posts = useMemo(() => loadPosts(), []);
  const tags = useMemo(() => loadTags(), []);

  // Active post: only when there is a slug in the URL. No slug = blog home.
  const active = useMemo(
    () => (slug ? posts.find((p) => p.slug === slug) ?? null : null),
    [posts, slug],
  );

  const postsByCategory = (catId: string): typeof posts => posts.filter((p) => p.category === catId);

  // Collapsed category ids. Empty = all expanded by default; the user can fold
  // any parent branch closed.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleCategory = (catId: string): void =>
    setCollapsed((c) => ({ ...c, [catId]: !c[catId] }));

  // Reader width: session-only preference, desktop only (mobile is already full width).
  const [fullWidth, setFullWidth] = useState(false);

  const [showAllTags, setShowAllTags] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Lightbox for post images; null = closed.
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  useEffect(() => {
    if (!showAllTags) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setShowAllTags(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [showAllTags]);

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
            display: 'flex',
            flexDirection: 'column',
            height: isMobile ? 'auto' : 'calc(100vh - 80px)',
          }}
        >
          {/* scrollable tree area */}
          <div style={{ flex: 1, overflowY: isMobile ? 'visible' : 'auto', paddingRight: isMobile ? 0 : 20 }}>
            <Link
              to="/"
              style={{ fontSize: 11, color: t.ink, opacity: 0.6, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              <Glitch trigger="hover">{tr('directionB.read.back')}</Glitch>
            </Link>

            {activeTag ? (
              /* ── FILTERED VIEW ── */
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 11,
                    color: t.rgbB,
                    opacity: 0.85,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'none',
                    border: 'none',
                    padding: '0 0 16px 0',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                >
                  {tr('directionB.read.tagsAllPosts')}
                </button>
                <div
                  style={{
                    fontSize: 10,
                    color: t.dim,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: 14,
                  }}
                >
                  {tr('directionB.read.tagsFilterLabel')}{' '}
                  {(() => {
                    const tg = tags.find((x) => x.id === activeTag);
                    return tg ? pickLocale(tg.label, lang).toUpperCase() : activeTag.toUpperCase();
                  })()}
                </div>
                {posts
                  .filter((p) => p.tags.includes(activeTag))
                  .map((p) => {
                    const isActive = active?.slug === p.slug;
                    return (
                      <Link
                        key={p.slug}
                        to={`/writing/${p.slug}`}
                        style={{
                          display: 'block',
                          padding: '10px 0',
                          borderBottom: `1px solid ${t.soft}`,
                          color: t.ink,
                          opacity: isActive ? 1 : 0.78,
                          textDecoration: 'none',
                          fontSize: 13,
                          fontWeight: isActive ? 700 : 400,
                          lineHeight: 1.4,
                          transition: 'opacity 150ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = isActive ? '1' : '0.78'; }}
                      >
                        <Glitch trigger="hover">{pickLocale(p.title, lang)}</Glitch>
                        <span style={{ display: 'block', fontSize: 11, color: t.dim, marginTop: 2 }}>
                          {p.date} · {p.len}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            ) : (
              /* ── CATEGORY TREE (existing) ── */
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
            )}
          </div>

          {/* tags footer — always visible */}
          {tags.length > 0 ? (
            <div
              style={{
                borderTop: `1px solid ${t.rule}`,
                paddingTop: 16,
                paddingBottom: isMobile ? 0 : 16,
                paddingRight: isMobile ? 0 : 20,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: t.dim,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {tr('directionB.read.tagsLabel')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.slice(0, 5).map((tg) => (
                  <button
                    key={tg.id}
                    type="button"
                    onClick={() => setActiveTag((prev) => (prev === tg.id ? null : tg.id))}
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: activeTag === tg.id ? t.ink : t.dim,
                      border: `1px solid ${activeTag === tg.id ? t.ink : t.rule}`,
                      background: activeTag === tg.id ? `${t.ink}18` : 'transparent',
                      padding: '4px 9px',
                      cursor: 'pointer',
                      lineHeight: 1,
                      transition: 'color 150ms, border-color 150ms, background 150ms',
                    }}
                    onMouseEnter={(e) => { if (activeTag !== tg.id) { e.currentTarget.style.color = t.ink; e.currentTarget.style.borderColor = t.ink; } }}
                    onMouseLeave={(e) => { if (activeTag !== tg.id) { e.currentTarget.style.color = t.dim; e.currentTarget.style.borderColor = t.rule; } }}
                  >
                    {pickLocale(tg.label, lang)}
                  </button>
                ))}
                {tags.length > 5 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllTags(true)}
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: t.rgbB,
                      border: `1px solid ${t.rgbB}55`,
                      background: 'transparent',
                      padding: '4px 9px',
                      cursor: 'pointer',
                      lineHeight: 1,
                      transition: 'border-color 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.rgbB; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${t.rgbB}55`; }}
                  >
                    {tr('directionB.read.tagsShowMore')}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </nav>

        {/* RIGHT — paper reader */}
        <article
          style={{
            background: t.sub,
            border: `1px solid ${t.rule}`,
            boxShadow: `8px 8px 0 ${t.ink}`,
            padding: isMobile ? '28px 22px' : '64px clamp(32px, 6vw, 96px)',
            maxWidth: fullWidth ? 'none' : 940,
            width: '100%',
            margin: isMobile ? '0' : '0 auto',
          }}
        >
          {!slug ? (
            /* ── BLOG HOME ── */
            <>
              <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
                {tr('directionB.read.blogHomeMeta')}
              </div>
              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: isMobile ? 28 : 'clamp(32px, 5vw, 52px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  margin: '14px 0 20px 0',
                  color: t.ink,
                }}
              >
                {tr('directionB.read.blogHomeTitle')}
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.75, color: t.ink, opacity: 0.8, maxWidth: '62ch', marginBottom: 12 }}>
                {tr('directionB.read.blogHomeIntro')}
              </p>
              <p style={{ fontSize: 12, color: t.dim, marginBottom: 48 }}>
                {tr('directionB.read.blogHomeCms')}{' '}
                <a
                  href="https://pagescms.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.dim, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  Pages CMS
                </a>
              </p>
              <div
                style={{
                  fontSize: 10,
                  color: t.dim,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${t.rule}`,
                }}
              >
                {tr('directionB.read.blogHomeRecent')}
              </div>
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/writing/${p.slug}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '100px 1fr 64px',
                    padding: '16px 0',
                    borderBottom: `1px solid ${t.soft}`,
                    gap: isMobile ? 6 : 12,
                    alignItems: 'baseline',
                    textDecoration: 'none',
                    color: t.ink,
                    transition: 'background 180ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.sub; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ color: t.dim, fontSize: 12 }}>{p.date}</span>
                  <span>
                    <span style={{ fontSize: 16, letterSpacing: '-0.01em' }}>
                      {pickLocale(p.title, lang)}
                    </span>
                    {p.tags.length > 0 ? (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
                        {p.tags.map((tid) => {
                          const tg = tags.find((x) => x.id === tid);
                          return (
                            <span
                              key={tid}
                              style={{
                                fontSize: 9,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: t.dim,
                                border: `1px solid ${t.soft}`,
                                padding: '2px 6px',
                                lineHeight: 1,
                              }}
                            >
                              {tg ? pickLocale(tg.label, lang) : tid}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                  </span>
                  <span style={{ color: t.dim, fontSize: 12, textAlign: isMobile ? 'left' : 'right' }}>{p.len}</span>
                </Link>
              ))}
            </>
          ) : active ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  <span>{active.date} · {active.len}</span>
                  {active.tags.map((tid) => {
                    const tg = tags.find((x) => x.id === tid);
                    const isActiveChip = activeTag === tid;
                    return (
                      <button
                        key={tid}
                        type="button"
                        onClick={() => setActiveTag((prev) => (prev === tid ? null : tid))}
                        style={{
                          fontFamily: 'inherit',
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: isActiveChip ? t.ink : t.dim,
                          border: `1px solid ${isActiveChip ? t.ink : t.rule}`,
                          background: isActiveChip ? `${t.ink}18` : 'transparent',
                          padding: '3px 8px',
                          cursor: 'pointer',
                          lineHeight: 1,
                          transition: 'color 150ms, border-color 150ms, background 150ms',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActiveChip) {
                            e.currentTarget.style.color = t.ink;
                            e.currentTarget.style.borderColor = t.ink;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActiveChip) {
                            e.currentTarget.style.color = t.dim;
                            e.currentTarget.style.borderColor = t.rule;
                          }
                        }}
                      >
                        {tg ? pickLocale(tg.label, lang) : tid}
                      </button>
                    );
                  })}
                </div>
                {!isMobile ? (
                  <button
                    type="button"
                    onClick={() => setFullWidth((v) => !v)}
                    aria-pressed={fullWidth}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${t.rule}`,
                      color: t.ink,
                      padding: '3px 9px',
                      fontSize: 11,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fullWidth ? tr('directionB.read.normalWidth') : tr('directionB.read.fullWidth')}
                  </button>
                ) : null}
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
                style={
                  {
                    fontSize: 18,
                    lineHeight: 1.75,
                    color: t.ink,
                    maxWidth: fullWidth ? 'none' : '72ch',
                    '--b-link': t.rgbB,
                  } as React.CSSProperties
                }
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="b-table-wrap">
                        <table>{children}</table>
                      </div>
                    ),
                    img: ({ src, alt }) => (
                      <button
                        type="button"
                        className="b-img-zoom"
                        aria-label={alt || tr('directionB.read.imageZoom')}
                        onClick={() => {
                          if (typeof src === 'string') setLightbox({ src, alt: alt ?? '' });
                        }}
                      >
                        <img src={typeof src === 'string' ? src : undefined} alt={alt} />
                      </button>
                    ),
                  }}
                >
                  {pickLocale(active.body, lang)}
                </Markdown>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: t.dim }}>{tr('directionB.oss.writingEmpty')}</div>
          )}
        </article>
      </div>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(10, 10, 10, 0.88)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? 16 : 40,
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            style={{
              maxWidth: '100%',
              maxHeight: '85vh',
              border: '1px solid #f2efe7',
              boxShadow: '8px 8px 0 #000',
            }}
          />
          {lightbox.alt ? (
            <div
              style={{
                marginTop: 16,
                fontSize: 12,
                color: '#f2efe7',
                opacity: 0.75,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {lightbox.alt}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={tr('directionB.read.lightboxClose')}
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              background: 'transparent',
              border: '1px solid #f2efe7',
              color: '#f2efe7',
              fontSize: 14,
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>
      ) : null}

      {showAllTags ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAllTags(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(10, 10, 10, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? 16 : 40,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: t.sub,
              border: `1px solid ${t.rule}`,
              boxShadow: `8px 8px 0 ${t.ink}`,
              padding: '28px 32px',
              maxWidth: 480,
              width: '90%',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setShowAllTags(false)}
              aria-label={tr('directionB.read.lightboxClose')}
              style={{
                position: 'absolute',
                top: 14,
                right: 16,
                background: 'transparent',
                border: 'none',
                color: t.dim,
                fontSize: 16,
                padding: '4px 6px',
                cursor: 'pointer',
                lineHeight: 1,
                fontFamily: 'inherit',
                transition: 'color 150ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = t.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = t.dim; }}
            >
              ✕
            </button>
            <div
              style={{
                fontSize: 10,
                color: t.dim,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {tr('directionB.read.tagsAllTags')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map((tg) => (
                <button
                  key={tg.id}
                  type="button"
                  onClick={() => { setActiveTag(tg.id); setShowAllTags(false); }}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: t.dim,
                    border: `1px solid ${t.rule}`,
                    background: 'transparent',
                    padding: '4px 9px',
                    cursor: 'pointer',
                    lineHeight: 1,
                    transition: 'color 150ms, border-color 150ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = t.ink; e.currentTarget.style.borderColor = t.ink; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t.dim; e.currentTarget.style.borderColor = t.rule; }}
                >
                  {pickLocale(tg.label, lang)}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <CommandPalette sections={PALETTE_SECTIONS} />
    </div>
  );
};

export default Writing;

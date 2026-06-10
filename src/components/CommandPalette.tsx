// packages
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

// contexts
import { useBTheme } from '../contexts/ThemeContext';

// data
import { JORIUS } from '../data/jorius';

export interface CommandPaletteSection {
  id: string;
  label: string;
  hint?: string;
}

interface CommandPaletteProps {
  sections: CommandPaletteSection[];
}

interface PaletteItem {
  kind: 'section' | 'cmd';
  label: string;
  target: string;
  hint: string;
  ext?: boolean;
  internal?: boolean;
}

export const CommandPalette = ({ sections }: CommandPaletteProps): React.ReactElement | null => {
  const { theme, t } = useBTheme();
  const { t: tr } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const closePalette = (): void => {
    setOpen(false);
    setQ('');
    setIdx(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName ?? '';
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setOpen((v) => {
          if (v) {
            setQ('');
            setIdx(0);
          }
          return !v;
        });
      } else if (e.key === 'Escape') {
        closePalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const jumpPrefix = tr('directionB.palette.items.jumpPrefix');

  const items: PaletteItem[] = useMemo(() => {
    const all: PaletteItem[] = [];
    sections.forEach((s) => all.push({
      kind: 'section',
      label: `${jumpPrefix} ${s.label}`,
      target: s.id,
      hint: s.hint ?? '',
    }));
    all.push({ kind: 'cmd', label: tr('directionB.palette.items.emailJorius'), target: `mailto:${JORIUS.email}`, hint: JORIUS.email, ext: true });
    all.push({ kind: 'cmd', label: tr('directionB.palette.items.openGithub'), target: JORIUS.links.github, hint: tr('directionB.palette.items.githubHint'), ext: true });
    all.push({ kind: 'cmd', label: tr('directionB.palette.items.copyPgp'), target: 'copy:pgp', hint: JORIUS.pgp.keyId });
    all.push({ kind: 'cmd', label: tr('directionB.palette.items.showPgp'), target: '/pgp', hint: JORIUS.pgp.algo, internal: true });
    const f = q.trim().toLowerCase();
    return f ? all.filter((i) => i.label.toLowerCase().includes(f) || i.hint.toLowerCase().includes(f)) : all;
  }, [q, sections, jumpPrefix, tr]);

  const choose = (it: PaletteItem | undefined): void => {
    if (!it) return;
    if (it.kind === 'section') {
      if (location.pathname === '/') {
        const el = document.querySelector(`[data-jump="${it.target}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Off the landing page: go home, then DirectionB scrolls to the section.
        navigate('/', { state: { scrollTo: it.target } });
      }
    } else if (it.target === 'copy:pgp') {
      if (navigator.clipboard) navigator.clipboard.writeText(JORIUS.pgp.fingerprint);
    } else if (it.internal) {
      navigate(it.target);
    } else if (it.ext) {
      window.open(it.target, '_blank', 'noopener');
    }
    closePalette();
  };

  if (!open) return null;
  const dark = theme === 'dark';
  const bg = t.paper;
  const fg = t.ink;
  const dim = t.dim;
  const line = t.sub;
  const hi = t.ink;
  const hiFg = t.paper;

  return (
    <div
      onClick={closePalette}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '14vh',
        fontFamily: 'Space Mono, monospace',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: '92vw',
          background: bg,
          color: fg,
          border: `1px solid ${line}`,
          boxShadow: dark ? '0 30px 80px rgba(0,0,0,.6)' : '0 30px 80px rgba(0,0,0,.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${line}`, padding: '10px 14px', gap: 10 }}>
          <span style={{ color: dim, fontSize: 13 }}>&gt;</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setIdx((i) => Math.min(i + 1, items.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                choose(items[idx]);
              }
            }}
            placeholder={tr('directionB.palette.placeholder')}
            style={{
              flex: 1,
              background: 'transparent',
              color: fg,
              border: 0,
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 14,
              padding: '4px 0',
            }}
          />
          <span style={{ color: dim, fontSize: 11, border: `1px solid ${line}`, padding: '2px 6px' }}>{tr('directionB.palette.esc')}</span>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <div style={{ padding: 16, color: dim, fontSize: 13 }}>{tr('directionB.palette.noMatches')}</div>
          ) : null}
          {items.map((it, i) => (
            <div
              key={`${it.kind}-${it.label}`}
              onMouseEnter={() => setIdx(i)}
              onClick={() => choose(it)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 14,
                padding: '10px 14px',
                cursor: 'pointer',
                background: i === idx ? hi : 'transparent',
                color: i === idx ? hiFg : fg,
                fontSize: 13,
              }}
            >
              <span>{it.label}</span>
              <span style={{ color: i === idx ? hiFg : dim, opacity: 0.8 }}>{it.hint}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${line}`, padding: '8px 14px', display: 'flex', justifyContent: 'space-between', color: dim, fontSize: 11 }}>
          <span>{tr('directionB.palette.footerLeft')}</span>
          <span>{tr('directionB.palette.footerRight', { count: items.length })}</span>
        </div>
      </div>
    </div>
  );
};

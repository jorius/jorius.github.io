// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// utils
import { pickLocale } from '../../utils/content';

// data
import nowContent from '../../content/now.json';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BNow = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const lang = i18n.language;
  return (
    <>
      <BSectionHead
        id="b-now"
        num={tr('directionB.sections.now.num')}
        label={tr('directionB.sections.now.label')}
        kicker={tr('directionB.sections.now.kicker')}
      />
      <div
        style={{
          padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 24 : 32,
          borderTop: `1px solid ${t.soft}`,
          paddingTop: 28,
        }}
      >
        <div>
          {nowContent.entries.map((n, i) => (
            <Reveal
              key={n.key}
              delay={i * 60}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '80px 1fr' : '160px 1fr',
                padding: '18px 0',
                borderBottom: `1px solid ${t.soft}`,
                gap: isMobile ? 12 : 0,
              }}
            >
              <div style={{ color: t.dim, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{n.key}</div>
              <div style={{ color: t.ink, fontSize: 15, lineHeight: 1.5 }}>{pickLocale(n, lang)}</div>
            </Reveal>
          ))}
        </div>
        <div style={{ alignSelf: isMobile ? 'start' : 'end', paddingBottom: isMobile ? 0 : 18 }}>
          <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tr('directionB.now.lastUpdatedLabel')}</div>
          <div style={{ fontSize: isMobile ? 24 : 40, color: t.ink, letterSpacing: '-0.02em', marginTop: 6 }}>
            <Glitch trigger="hover" strong>{nowContent.lastUpdated}</Glitch>
          </div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 10, maxWidth: isMobile ? '100%' : 380 }}>
            {pickLocale(nowContent.siversNote, lang)}
          </div>
        </div>
      </div>
    </>
  );
};

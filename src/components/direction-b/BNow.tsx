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

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';

export const BNow = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const lang = i18n.language;

  const lastUpdated = (
    <div style={{ display: 'grid', gap: 4, paddingBottom: '0.3em' }}>
      <span style={{ fontSize: 13, color: t.dim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tr('directionB.now.lastUpdatedLabel')}</span>
      <span style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', color: t.ink, fontVariantNumeric: 'tabular-nums' }}>
        <Glitch trigger="hover" strong>{nowContent.lastUpdated}</Glitch>
      </span>
    </div>
  );

  return (
    <>
      <BSectionHead
        id="b-now"
        num={tr('directionB.sections.now.num')}
        label={tr('directionB.sections.now.label')}
        kicker={tr('directionB.sections.now.kicker')}
        aside={lastUpdated}
      />
      <div style={{ padding: isMobile ? '12px 20px 40px 20px' : '12px 32px 40px 32px', borderTop: `1px solid ${t.rule}` }}>
        {nowContent.entries.map((n, i) => (
          <Reveal
            key={n.key}
            delay={i * 60}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '150px 1fr',
              gap: isMobile ? 6 : 16,
              padding: '16px 0',
              borderBottom: `1px solid ${t.soft}`,
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontSize: 13, color: t.ink, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{pickLocale(n.label, lang)}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.5, color: t.ink, maxWidth: '70ch' }}>{pickLocale(n, lang)}</div>
          </Reveal>
        ))}
        <p style={{ margin: '18px 0 0 0', fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.5, color: t.dim, maxWidth: '62ch' }}>
          {pickLocale(nowContent.siversNote, lang)}
        </p>
      </div>
    </>
  );
};

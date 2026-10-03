// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// utils
import { pickLocale } from '../../utils/content';

// data
import workContent from '../../content/work.json';

// styles
import { FONT_BODY } from '../../styles/fonts';

// components
import { Glitch } from '../primitives/Glitch';
import { BCard } from './BCard';
import { BCardGrid } from './BCardGrid';
import { BSectionHead } from './BSectionHead';
import { StackChip } from './StackChip';

export const BServices = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const lang = i18n.language;
  const meta: React.CSSProperties = { fontSize: 13, color: t.dim, letterSpacing: '0.1em', textTransform: 'uppercase' };
  return (
    <>
      <BSectionHead
        id="b-services"
        num={tr('directionB.sections.work.num')}
        label={tr('directionB.sections.work.label')}
        kicker={tr('directionB.sections.work.kicker')}
      />
      <div style={{ padding: isMobile ? '0 20px 40px 20px' : '0 32px 40px 32px' }}>
        <BCardGrid style={{ marginTop: 16 }}>
          {workContent.services.map((s, i) => (
            <BCard key={s.id} index={i}>
              <div style={{ ...meta, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span>№ {s.id}</span>
                <span>{tr('directionB.sections.work.cardKind')}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 24, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.08, fontWeight: 700 }}>
                <Glitch trigger="hover" strong>{pickLocale(s.title, lang)}</Glitch>
              </h3>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.55, color: t.ink }}>{pickLocale(s.body, lang)}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {s.stack.map((tag) => <StackChip key={tag} name={tag} />)}
              </div>
            </BCard>
          ))}
        </BCardGrid>
      </div>
    </>
  );
};

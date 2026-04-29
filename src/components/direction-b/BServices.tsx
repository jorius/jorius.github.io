// packages
import { useTranslation } from 'react-i18next';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Glitch } from '../primitives/Glitch';
import { Reveal } from '../primitives/Reveal';
import { BSectionHead } from './BSectionHead';
import { StackChip } from './StackChip';

export const BServices = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  return (
    <>
      <BSectionHead
        id="b-services"
        num={tr('directionB.sections.work.num')}
        label={tr('directionB.sections.work.label')}
        kicker={tr('directionB.sections.work.kicker')}
      />
      <div style={{ padding: isMobile ? '0 20px 40px 20px' : '0 32px 60px 32px' }}>
        {JORIUS.services.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 80}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '90px 1fr 1.4fr 1fr',
              gap: isMobile ? 12 : 32,
              padding: isMobile ? '24px 0' : '32px 0',
              borderBottom: `1px solid ${t.rule}`,
              alignItems: 'start',
            }}
          >
            <div style={{ fontSize: 11, color: t.dim, letterSpacing: '0.15em' }}>{s.id}</div>
            <h3 style={{ margin: 0, fontSize: 'clamp(22px, 7vw, 40px)', color: t.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>
              <Glitch trigger="hover" strong>{tr(`directionB.services.${s.id}.title`)}</Glitch>
            </h3>
            <p style={{ color: t.ink, fontSize: 15, lineHeight: 1.55, margin: 0 }}>{tr(`directionB.services.${s.id}.body`)}</p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                justifyContent: isMobile ? 'flex-start' : 'flex-end',
              }}
            >
              {s.stack.map((tag) => <StackChip key={tag} name={tag} />)}
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
};

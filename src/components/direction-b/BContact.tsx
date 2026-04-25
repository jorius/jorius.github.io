// packages
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

// hooks
import { useIsMobile } from '../../hooks/useMediaQuery';

// components
import { Glitch } from '../primitives/Glitch';
import { TypedCaret } from '../primitives/TypedCaret';

// Strip the protocol and trailing slash for cleaner display.
const displayUrl = (url: string): string =>
  url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const WHATSAPP_HREF = `https://wa.me/${JORIUS.whatsapp.replace(/[^0-9]/g, '')}`;

export const BContact = (): React.ReactElement => {
  const { t } = useBTheme();
  const { t: tr } = useTranslation();
  const isMobile = useIsMobile();
  return (
    <section
      data-jump="b-contact"
      style={{
        borderTop: `1px solid ${t.rule}`,
        padding: isMobile ? '60px 20px 32px 20px' : '80px 32px 40px 32px',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: t.dim,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        {tr('directionB.sections.contact')}
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: 'clamp(56px, 14vw, 220px)',
          letterSpacing: '-0.05em',
          lineHeight: 0.85,
          color: t.ink,
        }}
      >
        <Glitch strong period={2800}>{tr('directionB.contact.headline1')}</Glitch>
        <br />
        <Glitch strong period={3200}>{tr('directionB.contact.headline2')}</Glitch>
        <TypedCaret />
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
          gap: isMobile ? 32 : 32,
          marginTop: isMobile ? 40 : 56,
          paddingTop: 28,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        {/* EMAIL column */}
        <div>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{tr('directionB.contact.email')}</div>
          <a
            href={`mailto:${JORIUS.email}`}
            style={{ fontSize: isMobile ? 17 : 20, color: t.ink, textDecoration: 'none', display: 'block', marginTop: 6, wordBreak: 'break-all' }}
          >
            <Glitch trigger="hover">{JORIUS.email}</Glitch>
          </a>
          <Link
            to="/pgp"
            title={tr('directionB.palette.items.showPgp')}
            style={{
              display: 'block',
              fontSize: 11,
              color: t.dim,
              marginTop: 6,
              fontFamily: 'inherit',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            {tr('directionB.contact.pgp')} {JORIUS.pgp.algo} · {JORIUS.pgp.keyId}
            <div style={{ fontSize: 10, color: t.dim, opacity: 0.75, marginTop: 2, wordBreak: 'break-all' }}>
              {JORIUS.pgp.fingerprint}
            </div>
          </Link>

          {JORIUS.affiliations.length > 0 ? (
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${t.sub}` }}>
              <div style={{ fontSize: 10, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 6 }}>
                {tr('directionB.contact.affiliations')}
              </div>
              {JORIUS.affiliations.map((a) => (
                <div key={a.email} style={{ marginTop: 4 }}>
                  <a
                    href={`mailto:${a.email}`}
                    style={{ fontSize: 13, color: t.ink, textDecoration: 'none', wordBreak: 'break-all' }}
                  >
                    <Glitch trigger="hover">{a.email}</Glitch>
                  </a>
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 9,
                      color: t.dim,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      border: `1px solid ${t.sub}`,
                      padding: '1px 6px',
                    }}
                  >
                    [ {a.tag} ]
                  </span>
                  <div style={{ fontSize: 11, color: t.dim, marginTop: 2 }}>{a.name}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* ELSEWHERE column */}
        <div>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{tr('directionB.contact.elsewhere')}</div>
          <div style={{ fontSize: 15, color: t.ink, marginTop: 6, lineHeight: 1.7 }}>
            <a
              href={JORIUS.links.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: t.ink, textDecoration: 'none', display: 'block' }}
            >
              <Glitch trigger="hover">{displayUrl(JORIUS.links.github)}</Glitch>
            </a>
            <a
              href={JORIUS.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: t.ink, textDecoration: 'none', display: 'block' }}
            >
              <Glitch trigger="hover">{displayUrl(JORIUS.links.linkedin)}</Glitch>
            </a>
            <a
              href={JORIUS.links.stackoverflow}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: t.ink, textDecoration: 'none', display: 'block' }}
            >
              <Glitch trigger="hover">{displayUrl(JORIUS.links.stackoverflow)}</Glitch>
            </a>
          </div>
        </div>

        {/* AVAILABILITY column */}
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{tr('directionB.contact.availability')}</div>
          <div style={{ fontSize: 18, color: t.ink, marginTop: 6 }}>{JORIUS.status}</div>

          <div style={{ display: 'flex', gap: 10, justifyContent: isMobile ? 'flex-start' : 'flex-end', marginTop: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tr('directionB.contact.whatsappLabel')} ${JORIUS.whatsapp}`}
              title={`${tr('directionB.contact.whatsappLabel')} ${JORIUS.whatsapp}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                color: t.ink,
                border: `1px solid ${t.rule}`,
                width: 44,
                textDecoration: 'none',
              }}
            >
              <FaWhatsapp aria-hidden style={{ width: 18, height: 18 }} />
            </a>
            <a
              href="https://cal.com/jorius"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: t.ink,
                color: t.paper,
                padding: '12px 18px',
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              <Glitch trigger="hover">{tr('directionB.contact.book')}</Glitch>
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: isMobile ? 36 : 60,
          paddingTop: 14,
          borderTop: `1px solid ${t.rule}`,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          fontSize: 11,
          color: t.dim,
          flexWrap: 'wrap',
          gap: isMobile ? 6 : 12,
        }}
      >
        <span>{tr('directionB.contact.footer.copyright')}</span>
        <span>{tr('directionB.contact.footer.set')}</span>
        <span>{tr('directionB.contact.footer.vol')}</span>
      </div>
    </section>
  );
};

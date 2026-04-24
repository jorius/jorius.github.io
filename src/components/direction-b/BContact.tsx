// packages
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';

// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// data
import { JORIUS } from '../../data/jorius';

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
  return (
    <section
      data-jump="b-contact"
      style={{ borderTop: `1px solid ${t.rule}`, padding: '80px 32px 40px 32px' }}
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
          fontSize: 'clamp(72px, 14vw, 220px)',
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
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 32,
          marginTop: 56,
          paddingTop: 28,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        {/* EMAIL column */}
        <div>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{tr('directionB.contact.email')}</div>
          <a
            href={`mailto:${JORIUS.email}`}
            style={{ fontSize: 20, color: t.ink, textDecoration: 'none', display: 'block', marginTop: 6 }}
          >
            <Glitch trigger="hover">{JORIUS.email}</Glitch>
          </a>
          <div style={{ fontSize: 11, color: t.dim, marginTop: 6, fontFamily: 'inherit', letterSpacing: '0.04em' }}>
            {tr('directionB.contact.pgp')} {JORIUS.pgp.algo} · {JORIUS.pgp.keyId}
            <div style={{ fontSize: 10, color: t.dim, opacity: 0.75, marginTop: 2 }}>
              {JORIUS.pgp.fingerprint}
            </div>
          </div>

          {JORIUS.affiliations.length > 0 ? (
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${t.sub}` }}>
              <div style={{ fontSize: 10, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 6 }}>
                {tr('directionB.contact.affiliations')}
              </div>
              {JORIUS.affiliations.map((a) => (
                <div key={a.email} style={{ marginTop: 4 }}>
                  <a
                    href={`mailto:${a.email}`}
                    style={{ fontSize: 13, color: t.ink, textDecoration: 'none' }}
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
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: t.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{tr('directionB.contact.availability')}</div>
          <div style={{ fontSize: 18, color: t.ink, marginTop: 6 }}>{JORIUS.status}</div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
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
          marginTop: 60,
          paddingTop: 14,
          borderTop: `1px solid ${t.rule}`,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: t.dim,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span>{tr('directionB.contact.footer.copyright')}</span>
        <span>{tr('directionB.contact.footer.set')}</span>
        <span>{tr('directionB.contact.footer.vol')}</span>
      </div>
    </section>
  );
};

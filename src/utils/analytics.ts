// Thin bridge to the Umami tracker loaded by the script tag in index.html.
// Page views need no code: Umami hooks pushState/replaceState on its own.
// Everything here must be safe to call when the tracker is blocked or absent.

export type EventData = Record<string, string | number | boolean>;

const OUTBOUND_EVENT = 'outbound-click';
const MIDDLE_BUTTON = 1;

/** Forward an event to Umami when it is loaded; otherwise do nothing. Never throws. */
export const track = (name: string, data?: EventData): void => {
  if (typeof window === 'undefined') return;
  const umami = window.umami;
  if (!umami) return;
  try {
    umami.track(name, data);
  } catch {
    // Analytics must never break the page.
  }
};

/**
 * Classify a link for outbound tracking.
 * - http(s) link to another origin -> its host
 * - mailto: link -> the pseudo-host "mailto"
 * - anything else (same origin, relative, hash, tel:, javascript:, unparsable) -> null
 */
export const outboundTarget = (href: string, currentOrigin: string): { host: string } | null => {
  let url: URL;
  try {
    url = new URL(href, currentOrigin);
  } catch {
    return null;
  }
  if (url.protocol === 'mailto:') return { host: 'mailto' };
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.origin === currentOrigin) return null;
  return { host: url.host };
};

/**
 * One capture-phase listener on the document for clicks and middle-button
 * auxclicks. Sends `outbound-click` with the destination host whenever the
 * click lands inside a link to another origin. Returns an uninstall function.
 */
export const installOutboundTracking = (doc: Document): (() => void) => {
  const onClick = (event: MouseEvent): void => {
    if (event.type === 'auxclick' && event.button !== MIDDLE_BUTTON) return;
    const target = event.target as { closest?: (selector: string) => Element | null } | null;
    const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null | undefined;
    if (!anchor) return;
    const outbound = outboundTarget(anchor.href, doc.location.origin);
    if (outbound) track(OUTBOUND_EVENT, outbound);
  };
  doc.addEventListener('click', onClick, true);
  doc.addEventListener('auxclick', onClick, true);
  return () => {
    doc.removeEventListener('click', onClick, true);
    doc.removeEventListener('auxclick', onClick, true);
  };
};

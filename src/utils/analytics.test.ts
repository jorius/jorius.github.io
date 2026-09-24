// packages
import { afterEach, describe, expect, it, vi } from 'vitest';

// utils
import { installOutboundTracking, outboundTarget, track } from './analytics';

const ORIGIN = 'https://jorius.github.io';

type Listener = (event: MouseEvent) => void;

/** A document stand-in with just what the outbound listener touches. */
function fakeDocument(origin: string) {
  const listeners = new Map<string, Listener>();
  const doc = {
    location: { origin },
    addEventListener: (type: string, listener: Listener) => {
      listeners.set(type, listener);
    },
    removeEventListener: (type: string, listener: Listener) => {
      if (listeners.get(type) === listener) listeners.delete(type);
    },
  } as unknown as Document;
  const fire = (type: string, event: object): void => {
    listeners.get(type)?.(event as MouseEvent);
  };
  return { doc, fire, listeners };
}

/** A mouse event whose target sits inside the given link (or no link at all). */
function clickInside(href: string | null, button = 0): object {
  return {
    type: button === 0 ? 'click' : 'auxclick',
    button,
    target: { closest: () => (href === null ? null : { href }) },
  };
}

describe('outboundTarget', () => {
  it('returns the host of a link to another origin', () => {
    expect(outboundTarget('https://github.com/jorius', ORIGIN)).toEqual({ host: 'github.com' });
  });

  it('keeps the port of the other host', () => {
    expect(outboundTarget('http://localhost:8087/', ORIGIN)).toEqual({ host: 'localhost:8087' });
  });

  it('returns null for an absolute link on the same origin', () => {
    expect(outboundTarget('https://jorius.github.io/writing', ORIGIN)).toBeNull();
  });

  it('returns null for a relative path', () => {
    expect(outboundTarget('/writing', ORIGIN)).toBeNull();
  });

  it('returns null for a hash-only link', () => {
    expect(outboundTarget('#work', ORIGIN)).toBeNull();
  });

  it('reports mailto links under the host "mailto"', () => {
    expect(outboundTarget('mailto:jose@example.com', ORIGIN)).toEqual({ host: 'mailto' });
  });

  it('returns null for tel links', () => {
    expect(outboundTarget('tel:+573001234567', ORIGIN)).toBeNull();
  });

  it('returns null for javascript links', () => {
    expect(outboundTarget('javascript:void(0)', ORIGIN)).toBeNull();
  });

  it('returns null for an unparsable href', () => {
    expect(outboundTarget('http://', ORIGIN)).toBeNull();
  });
});

describe('track', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does nothing when Umami is not loaded', () => {
    vi.stubGlobal('window', {});
    expect(() => track('theme-toggle', { to: 'light' })).not.toThrow();
  });

  it('forwards the event name and data to Umami', () => {
    const umamiTrack = vi.fn();
    vi.stubGlobal('window', { umami: { track: umamiTrack } });
    track('language-switch', { to: 'es' });
    expect(umamiTrack).toHaveBeenCalledWith('language-switch', { to: 'es' });
  });

  it('swallows an error thrown by Umami', () => {
    vi.stubGlobal('window', {
      umami: {
        track: () => {
          throw new Error('tracker exploded');
        },
      },
    });
    expect(() => track('outbound-click', { host: 'github.com' })).not.toThrow();
  });
});

describe('installOutboundTracking', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function withUmami() {
    const umamiTrack = vi.fn();
    vi.stubGlobal('window', { umami: { track: umamiTrack } });
    return umamiTrack;
  }

  it('sends outbound-click with the host when an external link is clicked', () => {
    const umamiTrack = withUmami();
    const { doc, fire } = fakeDocument(ORIGIN);
    installOutboundTracking(doc);
    fire('click', clickInside('https://www.linkedin.com/in/jorius'));
    expect(umamiTrack).toHaveBeenCalledWith('outbound-click', { host: 'www.linkedin.com' });
  });

  it('sends nothing for an internal link', () => {
    const umamiTrack = withUmami();
    const { doc, fire } = fakeDocument(ORIGIN);
    installOutboundTracking(doc);
    fire('click', clickInside('https://jorius.github.io/writing'));
    expect(umamiTrack).not.toHaveBeenCalled();
  });

  it('sends nothing when the click is not inside a link', () => {
    const umamiTrack = withUmami();
    const { doc, fire } = fakeDocument(ORIGIN);
    installOutboundTracking(doc);
    fire('click', clickInside(null));
    expect(umamiTrack).not.toHaveBeenCalled();
  });

  it('counts a middle-button auxclick as an outbound click', () => {
    const umamiTrack = withUmami();
    const { doc, fire } = fakeDocument(ORIGIN);
    installOutboundTracking(doc);
    fire('auxclick', clickInside('https://github.com/jorius', 1));
    expect(umamiTrack).toHaveBeenCalledWith('outbound-click', { host: 'github.com' });
  });

  it('ignores a right-button auxclick', () => {
    const umamiTrack = withUmami();
    const { doc, fire } = fakeDocument(ORIGIN);
    installOutboundTracking(doc);
    fire('auxclick', clickInside('https://github.com/jorius', 2));
    expect(umamiTrack).not.toHaveBeenCalled();
  });

  it('removes both listeners when uninstalled', () => {
    withUmami();
    const { doc, listeners } = fakeDocument(ORIGIN);
    const uninstall = installOutboundTracking(doc);
    expect(listeners.size).toBe(2);
    uninstall();
    expect(listeners.size).toBe(0);
  });
});

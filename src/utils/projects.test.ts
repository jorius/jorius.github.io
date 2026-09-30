// packages
import { describe, expect, it } from 'vitest';

// utils
import { projectLinkLabel } from './projects';

const t = (key: string): string => `<${key}>`;

describe('projectLinkLabel', () => {
  it('uses the generic label for the kind when the link has none', () => {
    expect(projectLinkLabel({ kind: 'repo', url: 'https://x' }, 'en', t)).toBe('<directionB.projectsPage.link.repo>');
    expect(projectLinkLabel({ kind: 'npm', url: 'https://x' }, 'es', t)).toBe('<directionB.projectsPage.link.npm>');
  });

  it('prefers the link label in the visitor language, including regional codes', () => {
    const link = { kind: 'repo' as const, url: 'https://x', label: { en: 'Frontend', es: 'Interfaz' } };
    expect(projectLinkLabel(link, 'en', t)).toBe('Frontend');
    expect(projectLinkLabel(link, 'es-CO', t)).toBe('Interfaz');
  });
});

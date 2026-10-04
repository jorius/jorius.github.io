// Pure helpers for the /projects cards, apart from content.ts so they stay
// trivially unit-testable.

// utils
import { pickLocale } from './content';
import type { ProjectLink } from './content';

export type Translate = (key: string) => string;

// A link shows its own label when the content gives one ("Frontend",
// "API · .NET"); otherwise the generic label for its kind.
// The card as a whole opens the live build when there is one, else the
// repository; a card with neither is not a link.
export const primaryProjectLink = (links: ProjectLink[]): ProjectLink | undefined =>
  links.find((l) => l.kind === 'live') ?? links.find((l) => l.kind === 'repo');

export const projectLinkLabel = (link: ProjectLink, lang: string, t: Translate): string =>
  link.label ? pickLocale(link.label, lang) : t(`directionB.projectsPage.link.${link.kind}`);

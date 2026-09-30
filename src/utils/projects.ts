// Pure helpers for the /projects cards, apart from content.ts so they stay
// trivially unit-testable.

// utils
import { pickLocale } from './content';
import type { ProjectLink } from './content';

export type Translate = (key: string) => string;

// A link shows its own label when the content gives one ("Frontend",
// "API · .NET"); otherwise the generic label for its kind.
export const projectLinkLabel = (link: ProjectLink, lang: string, t: Translate): string =>
  link.label ? pickLocale(link.label, lang) : t(`directionB.projectsPage.link.${link.kind}`);

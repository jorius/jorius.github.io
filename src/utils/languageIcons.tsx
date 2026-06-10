// src/utils/languageIcons.tsx

// packages
import type { IconType } from 'react-icons';
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiRust,
  SiCplusplus,
  SiC,
  SiPhp,
  SiRuby,
  SiHtml5,
  SiCss3,
  SiKotlin,
  SiSwift,
  SiGnubash,
} from 'react-icons/si';

interface LangIcon {
  Icon: IconType;
  color: string;
}

// Maps a GitHub `language` string to a brand icon + color. Unmapped languages
// fall back to plain text in the consumer, so this only needs the common ones.
const LANGUAGE_ICONS: Record<string, LangIcon> = {
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  Python: { Icon: SiPython, color: '#3776AB' },
  Go: { Icon: SiGo, color: '#00ADD8' },
  Rust: { Icon: SiRust, color: '#DEA584' },
  'C++': { Icon: SiCplusplus, color: '#00599C' },
  C: { Icon: SiC, color: '#A8B9CC' },
  PHP: { Icon: SiPhp, color: '#777BB4' },
  Ruby: { Icon: SiRuby, color: '#CC342D' },
  HTML: { Icon: SiHtml5, color: '#E34F26' },
  CSS: { Icon: SiCss3, color: '#1572B6' },
  Kotlin: { Icon: SiKotlin, color: '#7F52FF' },
  Swift: { Icon: SiSwift, color: '#F05138' },
  Shell: { Icon: SiGnubash, color: '#4EAA25' },
};

export const getLanguageIcon = (language: string | null): LangIcon | null =>
  language ? (LANGUAGE_ICONS[language] ?? null) : null;

// Shared command-palette section list. Lives apart from DirectionB so the
// Writing page (and any other route that mounts the palette) can reuse the same
// jump targets without importing the whole landing page.

// components
import type { CommandPaletteSection } from '../CommandPalette';

export const PALETTE_SECTIONS: CommandPaletteSection[] = [
  { id: 'b-now', label: 'now', hint: "what I'm up to" },
  { id: 'b-services', label: 'work', hint: 'services' },
  { id: 'b-experience', label: 'record', hint: 'experience' },
  { id: 'b-writing', label: 'writing', hint: '& oss' },
  { id: 'b-why', label: 'why', hint: 'hire me' },
  { id: 'b-contact', label: 'contact', hint: 'email' },
];

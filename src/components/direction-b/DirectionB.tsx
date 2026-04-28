// contexts
import { useBTheme } from '../../contexts/ThemeContext';

// components
import { CommandPalette } from '../CommandPalette';
import type { CommandPaletteSection } from '../CommandPalette';
import { DarkGrain } from '../primitives/DarkGrain';
import { ScanLines } from '../primitives/ScanLines';
import { BContact } from './BContact';
import { BExperience } from './BExperience';
import { BHero } from './BHero';
import { BNow } from './BNow';
import { BOssWriting } from './BOssWriting';
import { BProjects } from './BProjects';
import { BServices } from './BServices';
import { BTopBar } from './BTopBar';
import { BWhy } from './BWhy';

const PALETTE_SECTIONS: CommandPaletteSection[] = [
  { id: 'b-now', label: 'now', hint: "what I'm up to" },
  { id: 'b-services', label: 'work', hint: 'services' },
  { id: 'b-experience', label: 'record', hint: 'experience' },
  { id: 'b-projects', label: 'index', hint: 'projects' },
  { id: 'b-writing', label: 'writing', hint: '& oss' },
  { id: 'b-why', label: 'why', hint: 'hire me' },
  { id: 'b-contact', label: 'contact', hint: 'email' },
];

export const DirectionB = (): React.ReactElement => {
  const { t } = useBTheme();
  return (
    <div
      style={{
        background: t.paper,
        color: t.ink,
        fontFamily: 'Space Mono, monospace',
        width: '100%',
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <BTopBar />
      <BHero />
      <BNow />
      <BServices />
      <BExperience />
      <BProjects />
      <BOssWriting />
      <BWhy />
      <BContact />
      <ScanLines />
      <DarkGrain />
      <CommandPalette sections={PALETTE_SECTIONS} />
    </div>
  );
};

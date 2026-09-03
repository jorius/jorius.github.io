// packages
import { useEffect } from 'react';

// contexts
import { BThemeProvider } from '../contexts/ThemeContext';

// components
import { DGTeaser } from '../components/darkgalaxy/DGTeaser';
import { DG_GLITCH, DG_TOKENS_BY_MODE } from '../components/darkgalaxy/theme';

// The section is not published yet: /darkgalaxy shows its title card held
// with a "coming soon" legend, in the section's own palette and glitch.
const DarkGalaxyTeaser = (): React.ReactElement => {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Dark Galaxy';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <BThemeProvider tokensByMode={DG_TOKENS_BY_MODE} glitchRate={DG_GLITCH.rate} glitchChaos={DG_GLITCH.chaos}>
      <DGTeaser />
    </BThemeProvider>
  );
};

export default DarkGalaxyTeaser;

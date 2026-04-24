// packages
import { FiSun, FiMoon } from 'react-icons/fi';
import { useEffect } from 'react';

// store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme } from '../../store/slices/themeSlice';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 bg-light-surface dark:bg-dark-bg/50 hover:bg-light-border dark:hover:bg-dark-border transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5 text-neon-yellow group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <FiMoon className="w-5 h-5 text-light-secondary group-hover:-rotate-180 transition-transform duration-500" />
      )}
    </button>
  );
};

export default ThemeToggle;

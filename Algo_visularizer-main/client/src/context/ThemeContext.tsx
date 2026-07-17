import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'midnight' | 'cyberpunk' | 'forest' | 'deepsea';
type BgPattern = 'mesh' | 'grid' | 'dots' | 'solid';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  bgPattern: BgPattern;
  setBgPattern: (pattern: BgPattern) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'midnight';
  });

  const [bgPattern, setBgPatternState] = useState<BgPattern>(() => {
    const saved = localStorage.getItem('bgPattern');
    return (saved as BgPattern) || 'mesh';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setBgPattern = (newPattern: BgPattern) => {
    setBgPatternState(newPattern);
    localStorage.setItem('bgPattern', newPattern);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-bg', bgPattern);
  }, [bgPattern]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, bgPattern, setBgPattern }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

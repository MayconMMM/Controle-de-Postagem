import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { themes, type Theme } from '../themes';

const THEME_STORAGE_KEY = 'youtubePostManagerTheme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (name: string) => void;
  availableThemes: Record<string, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return storedTheme && themes[storedTheme] ? storedTheme : Object.keys(themes)[0];
    } catch {
      return Object.keys(themes)[0];
    }
  });

  const theme = useMemo(() => themes[themeName], [themeName]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      document.body.style.backgroundColor = theme.colors['--color-background'];
      document.body.style.color = theme.colors['--color-text'];
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme.name);
      } catch (error) {
        console.error("Failed to save theme to localStorage", error);
      }
    }
  }, [theme]);

  const setTheme = (name: string) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  const value = {
    theme,
    setTheme,
    availableThemes: themes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

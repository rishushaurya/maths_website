'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themeTokens, type ColorTheme, type AppearanceMode } from './theme-config';
export type { ColorTheme, AppearanceMode };

interface ThemeContextType {
  appearance: AppearanceMode;
  colorTheme: ColorTheme;
  toggleAppearance: () => void;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  appearance: 'dark',
  colorTheme: 'default',
  toggleAppearance: () => {},
  setColorTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ 
  children,
  initialAppearance = 'dark',
  initialColorTheme = 'default'
}: { 
  children: React.ReactNode;
  initialAppearance?: AppearanceMode;
  initialColorTheme?: ColorTheme;
}) {
  const [appearance, setAppearance] = useState<AppearanceMode>(initialAppearance);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(initialColorTheme);

  // Sync with prop changes (e.g., when Admin changes settings and Next re-fetches)
  useEffect(() => {
    setAppearance(initialAppearance);
    setColorTheme(initialColorTheme);
  }, [initialAppearance, initialColorTheme]);

  // Apply theme CSS variables whenever theme changes  
  useEffect(() => {
    const tokens = themeTokens[colorTheme]?.[appearance] ?? themeTokens.default.dark;
    const root = document.documentElement;
    
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Also update the class for tailwind dark mode compatibility
    if (appearance === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [appearance, colorTheme]);

  const toggleAppearance = useCallback(() => {
    setAppearance(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ appearance, colorTheme, toggleAppearance, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

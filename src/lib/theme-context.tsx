'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themeTokens, type ColorTheme, type AppearanceMode } from './theme-config';
export type { ColorTheme, AppearanceMode };

interface ThemeContextType {
  appearance: AppearanceMode;
  colorTheme: ColorTheme;
  toggleAppearance: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  resetToDefault: () => void;
  adminDefaultTheme: ColorTheme;
  adminDefaultAppearance: AppearanceMode;
}

const ThemeContext = createContext<ThemeContextType>({
  appearance: 'light',
  colorTheme: 'default',
  toggleAppearance: () => {},
  setColorTheme: () => {},
  resetToDefault: () => {},
  adminDefaultTheme: 'default',
  adminDefaultAppearance: 'light',
});

export const useTheme = () => useContext(ThemeContext);

const STORAGE_KEY_THEME = 'user-color-theme';
const STORAGE_KEY_APPEARANCE = 'user-appearance';

export function ThemeProvider({ 
  children,
  initialAppearance = 'light',
  initialColorTheme = 'default'
}: { 
  children: React.ReactNode;
  initialAppearance?: AppearanceMode;
  initialColorTheme?: ColorTheme;
}) {
  // Admin defaults (from server settings)
  const adminDefaultTheme = initialColorTheme;
  const adminDefaultAppearance = initialAppearance;

  const [appearance, setAppearance] = useState<AppearanceMode>(initialAppearance);
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(initialColorTheme);
  const [hydrated, setHydrated] = useState(false);

  // On mount: load user's local preference from localStorage (per-user, per-browser)
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as ColorTheme | null;
      const savedAppearance = localStorage.getItem(STORAGE_KEY_APPEARANCE) as AppearanceMode | null;
      if (savedTheme && themeTokens[savedTheme]) setColorThemeState(savedTheme);
      if (savedAppearance && (savedAppearance === 'dark' || savedAppearance === 'light')) setAppearance(savedAppearance);
    } catch {
      // localStorage unavailable (SSR, private browsing, etc.)
    }
    setHydrated(true);
  }, []);

  // Sync admin defaults if they change (e.g. after admin updates settings and page re-renders)
  useEffect(() => {
    if (!hydrated) return;
    // Only sync if user hasn't set a local preference
    try {
      const hasSavedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      const hasSavedAppearance = localStorage.getItem(STORAGE_KEY_APPEARANCE);
      if (!hasSavedTheme) setColorThemeState(initialColorTheme);
      if (!hasSavedAppearance) setAppearance(initialAppearance);
    } catch {
      setColorThemeState(initialColorTheme);
      setAppearance(initialAppearance);
    }
  }, [initialColorTheme, initialAppearance, hydrated]);

  // Apply theme CSS variables whenever theme changes  
  useEffect(() => {
    const tokens = themeTokens[colorTheme]?.[appearance] ?? themeTokens.default.dark;
    const root = document.documentElement;
    
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (appearance === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [appearance, colorTheme]);

  // Save to localStorage when user changes theme (per-user, never affects others)
  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    try { localStorage.setItem(STORAGE_KEY_THEME, theme); } catch {}
  }, []);

  const toggleAppearance = useCallback(() => {
    setAppearance(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY_APPEARANCE, next); } catch {}
      return next;
    });
  }, []);

  // Reset clears user's LOCAL preference — reverts to admin default
  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_THEME);
      localStorage.removeItem(STORAGE_KEY_APPEARANCE);
    } catch {}
    setColorThemeState(adminDefaultTheme);
    setAppearance(adminDefaultAppearance);
  }, [adminDefaultTheme, adminDefaultAppearance]);

  return (
    <ThemeContext.Provider value={{ 
      appearance, 
      colorTheme, 
      toggleAppearance, 
      setColorTheme, 
      resetToDefault,
      adminDefaultTheme,
      adminDefaultAppearance,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

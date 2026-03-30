'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface ThemeSwitchProps {
  className?: string;
}

export function ThemeSwitch({ className = '' }: ThemeSwitchProps) {
  const { appearance, toggleAppearance } = useTheme();

  return (
    <button
      onClick={toggleAppearance}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-primary)] hover:opacity-80 transition-opacity overflow-hidden ${className}`}
      aria-label={`Switch to ${appearance === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          appearance === 'light'
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-50 translate-y-5 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          appearance === 'dark'
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-50 translate-y-5 opacity-0'
        }`}
      />
    </button>
  );
}

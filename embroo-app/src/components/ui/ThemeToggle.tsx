'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);

    // Also respect system preference on first load if no stored preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('embroo-theme')) {
        useThemeStore.getState().setTheme(e.matches ? 'light' : 'dark');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="relative w-[52px] h-[28px] rounded-full transition-colors duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gold group"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1A1A2E, #252542)'
          : 'linear-gradient(135deg, #87CEEB, #F0E68C)',
        border: theme === 'dark'
          ? '1px solid rgba(212,168,83,0.2)'
          : '1px solid rgba(27,42,74,0.15)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Track icons */}
      <span className="absolute left-[5px] top-1/2 -translate-y-1/2 text-[12px] transition-opacity duration-300"
        style={{ opacity: theme === 'dark' ? 0.6 : 0 }}>
        🌙
      </span>
      <span className="absolute right-[5px] top-1/2 -translate-y-1/2 text-[12px] transition-opacity duration-300"
        style={{ opacity: theme === 'light' ? 0.6 : 0 }}>
        ☀️
      </span>

      {/* Thumb */}
      <span
        className="absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          left: theme === 'dark' ? '3px' : '27px',
          background: theme === 'dark' ? '#D4A853' : '#FFF',
          boxShadow: theme === 'dark'
            ? '0 0 8px rgba(212,168,83,0.4)'
            : '0 2px 6px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );
}

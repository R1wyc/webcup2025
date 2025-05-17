'use client';

import { useEffect } from 'react';

// This component injects a script that runs before React hydration to set the theme
export default function ThemeScript() {
  useEffect(() => {
    // Check for theme preference in localStorage or system preferences
    const initializeTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (storedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // If no stored preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // Run theme initialization immediately
    initializeTheme();
    
    // Setup event listener for OS theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const hasStoredPreference = localStorage.getItem('theme') !== null;
      if (!hasStoredPreference) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    // Add and cleanup listener
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return null;
} 
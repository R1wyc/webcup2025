'use client';

import { useEffect } from 'react';

// This component injects a script that runs before React hydration to set the theme
export default function ThemeScript() {
  useEffect(() => {
    // Check for theme preference in localStorage or system preferences
    const initializeTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      console.log('ThemeScript: Initializing theme, stored theme =', storedTheme);
      
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        console.log('ThemeScript: Applied dark theme from localStorage');
      } else if (storedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        console.log('ThemeScript: Applied light theme from localStorage');
      } else {
        // If no stored preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('ThemeScript: No stored theme, system prefers dark =', prefersDark);
        
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          console.log('ThemeScript: Applied dark theme from system preference');
        } else {
          document.documentElement.classList.remove('dark');
          console.log('ThemeScript: Applied light theme from system preference');
        }
        
        // Store the system preference
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      }
      
      // Force a check to ensure the class is correctly applied
      console.log('ThemeScript: Dark class is applied =', document.documentElement.classList.contains('dark'));
    };

    // Run theme initialization immediately
    initializeTheme();
    
    // Setup event listener for OS theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const hasStoredPreference = localStorage.getItem('theme') !== null;
      console.log('ThemeScript: Media query changed, prefers dark =', e.matches, 'has stored preference =', hasStoredPreference);
      
      if (!hasStoredPreference) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          console.log('ThemeScript: Applied dark theme from system change');
        } else {
          document.documentElement.classList.remove('dark');
          console.log('ThemeScript: Applied light theme from system change');
        }
      }
    };
    
    // Add and cleanup listener
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return null;
} 
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start with a null theme to avoid flash
  const [theme, setTheme] = useState<ThemeType | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use stored theme or system preference
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    
    console.log('ThemeContext: Initial theme =', initialTheme, 
                'Stored theme =', storedTheme, 
                'System prefers dark =', prefersDark);
    
    // Update state
    setTheme(initialTheme);
    
    // Make sure the class is applied correctly
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Always store the theme to avoid checking system preference again
    if (!storedTheme) {
      localStorage.setItem('theme', initialTheme);
    }
    
    // Mark component as mounted
    setMounted(true);
    
    console.log('ThemeContext: Initialized, dark class applied =', 
                document.documentElement.classList.contains('dark'));
  }, []);

  // Update HTML class and localStorage when theme changes
  useEffect(() => {
    if (!mounted || theme === null) return;
    
    console.log('ThemeContext: Theme changed to', theme);
    
    // Apply theme to HTML element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store preference in localStorage
    localStorage.setItem('theme', theme);
    
    // Verify the change was applied
    console.log('ThemeContext: After change, dark class applied =', 
                document.documentElement.classList.contains('dark'));
    
  }, [theme, mounted]);

  // Function to toggle between light and dark
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('ThemeContext: Toggling theme from', prevTheme, 'to', newTheme);
      return newTheme;
    });
  };

  // Provide a default theme for SSR before hydration
  const contextValue = {
    theme: theme || 'light',
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 
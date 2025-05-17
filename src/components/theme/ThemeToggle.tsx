'use client';

import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  className?: string;
  fixed?: boolean;
}

export default function ThemeToggle({ className = '', fixed = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state once component is on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    toggleTheme();
    
    // Add animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    console.log('Toggle button clicked, theme is now:', theme);
  };

  // Determine position classes based on fixed prop
  const positionClasses = fixed 
    ? 'fixed bottom-4 right-4 z-50' 
    : '';

  // Don't render anything on the server side
  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      className={`
        ${positionClasses}
        ${className}
        w-10 h-10 rounded-full 
        flex items-center justify-center
        bg-white dark:bg-gray-800
        text-gray-800 dark:text-yellow-300
        shadow-md hover:shadow-lg
        ${isAnimating ? 'scale-110' : 'scale-100'}
        transition-all duration-300 ease-in-out
        hover:scale-105
      `}
      aria-label="Basculer le thème"
      title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
    >
      {theme === 'light' ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  );
}

function SunIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
      />
    </svg>
  );
} 
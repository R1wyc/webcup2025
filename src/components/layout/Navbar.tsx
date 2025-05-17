"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Bars3Icon, XMarkIcon, TrophyIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '@/components/theme/ThemeToggle';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Helper to get user initials for avatar fallback
  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                TheEnd<span className="text-gray-800 dark:text-gray-200">.page</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                Accueil
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                Explorer
              </Link>
              <Link
                href="/hall-of-fame"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                <TrophyIcon className="h-4 w-4 mr-1 text-yellow-500" />
                Hall of Fame
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  Mes pages
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle fixed={false} />
            
            {user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="flex items-center">
                    {user.avatar ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                      {user.name}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-500 dark:text-gray-400" />
                  </div>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                    <Link 
                      href="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <Link 
                      href="/create" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Créer une page
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  as={Link}
                  href="/login"
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  href="/signup"
                >
                  Inscription
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pt-2 pb-3">
            <Link
              href="/"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/explore"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explorer
            </Link>
            <Link
              href="/hall-of-fame"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <TrophyIcon className="h-4 w-4 mr-1 text-yellow-500" />
                Hall of Fame
              </div>
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mes pages
              </Link>
            )}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
            {user ? (
              <div className="space-y-4 px-4">
                <div className="flex items-center">
                  {user.avatar ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/account"
                    className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Déconnexion
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    as={Link}
                    href="/create"
                    onClick={() => setMobileMenuOpen(false)}
                    fullWidth
                  >
                    Créer une page
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Button
                  variant="outline"
                  size="sm"
                  as={Link}
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  fullWidth
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  fullWidth
                >
                  Inscription
                </Button>
              </div>
            )}
            <div className="mt-3 px-4 flex justify-center">
              <ThemeToggle fixed={false} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 
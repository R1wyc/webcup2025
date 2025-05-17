"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                TheEnd<span className="text-gray-800">.page</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Accueil
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Explorer
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Mes pages
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {user.displayName || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Déconnexion
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  href="/create"
                >
                  Créer une page
                </Button>
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
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
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
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/explore"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explorer
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mes pages
              </Link>
            )}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            {user ? (
              <div className="space-y-2 px-4">
                <div className="text-base font-medium text-gray-800">
                  {user.displayName || user.email}
                </div>
                <div className="flex flex-col space-y-2">
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
          </div>
        </div>
      )}
    </nav>
  );
} 
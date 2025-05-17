'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublicEndPages, clearDemoPages } from '@/services/endpageService';
import { EndPage } from '@/types';
import { TONE_STYLES } from '@/constants/toneStyles';
import { Button } from '@/components/ui/Button';
import { CalendarIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ExplorePage() {
  const [endPages, setEndPages] = useState<EndPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDev] = useState(process.env.NODE_ENV === 'development');
  
  const fetchEndPages = async () => {
    try {
      setLoading(true);
      const pages = await getPublicEndPages(50);
      setEndPages(pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching public pages:', err);
      setError('Une erreur est survenue lors du chargement des pages');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEndPages();
  }, []);
  
  const handleClearDemoPages = () => {
    clearDemoPages();
    fetchEndPages();
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Explorer les adieux
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Découvrez comment les autres ont dit au revoir à leurs projets, jobs, relations ou autres chapitres de leur vie.
          </p>
          
          {isDev && (
            <div className="mt-4">
              <Button 
                variant="secondary"
                onClick={handleClearDemoPages}
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-300"
              >
                Réinitialiser les pages de démo
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </div>
        ) : endPages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucune page à explorer</h2>
            <p className="text-gray-600 mb-6">
              Il n'y a pas encore de pages publiques. Soyez le premier à en créer une!
            </p>
            <Button
              as={Link}
              href="/create"
              variant="primary"
            >
              Créer une page
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {endPages.map((page) => {
              const toneStyle = TONE_STYLES.find((tone) => tone.id === page.tone) || TONE_STYLES[0];
              
              return (
                <Link 
                  href={`/${page.slug}`} 
                  key={page.id}
                  className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg overflow-hidden"
                >
                  <div className="h-full flex flex-col overflow-hidden rounded-lg shadow-lg">
                    <div 
                      className="flex-shrink-0 h-32 flex items-center justify-center"
                      style={{ 
                        backgroundColor: page.backgroundColor || toneStyle.backgroundColor,
                        color: page.textColor || toneStyle.textColor,
                      }}
                    >
                      <span className="text-5xl">{toneStyle.emoji}</span>
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                          {page.title}
                        </h3>
                        <p className="text-gray-500 line-clamp-3">
                          {page.content}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(page.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Voir
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 
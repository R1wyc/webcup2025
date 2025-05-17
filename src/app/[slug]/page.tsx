'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EndPageView } from '@/components/display/EndPageView';
import { getEndPageBySlug } from '@/services/endpageService';
import { EndPage } from '@/types';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PublicEndPage() {
  const { slug } = useParams();
  const [endPage, setEndPage] = useState<EndPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEndPage = async () => {
      try {
        if (!slug || Array.isArray(slug)) {
          setError('Adresse invalide');
          setLoading(false);
          return;
        }
        
        const fetchedPage = await getEndPageBySlug(slug);
        
        if (!fetchedPage) {
          setError('Cette page n\'existe pas');
        } else {
          setEndPage(fetchedPage);
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Une erreur est survenue lors du chargement de la page');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEndPage();
  }, [slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (error || !endPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Page introuvable'}</p>
          <Button as={Link} href="/" variant="primary">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }
  
  return <EndPageView endPage={endPage} />;
} 
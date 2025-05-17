'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EndPageView } from '@/components/display/EndPageView';
import { getEndPageBySlug } from '@/services/endpageService';
import { EndPage } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PreviewPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [endPage, setEndPage] = useState<EndPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  
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
  
  const isOwner = user && user.uid === endPage.userId;
  
  return (
    <>
      {isOwner && showControls && (
        <div className="fixed top-0 inset-x-0 bg-white shadow-md p-4 z-50">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Mode prévisualisation</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControls(false)}
              >
                Masquer
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                as={Link}
                href={`/edit/${endPage.id}`}
              >
                Modifier
              </Button>
              <Button
                variant="primary"
                size="sm"
                as={Link}
                href={`/${endPage.slug}`}
              >
                Voir page publique
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`${isOwner && showControls ? 'pt-16' : ''}`}>
        <EndPageView
          endPage={endPage}
          onShare={() => {
            // Créer un lien vers la page publique plutôt que la prévisualisation
            const publicUrl = `${window.location.origin}/${endPage.slug}`;
            navigator.clipboard.writeText(publicUrl);
            alert('Lien de partage copié dans le presse-papier');
          }}
        />
      </div>
    </>
  );
} 
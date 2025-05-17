'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserEndPages, deleteEndPage } from '@/services/endpageService';
import { EndPage } from '@/types';
import { TONE_STYLES } from '@/constants/toneStyles';
import { Button } from '@/components/ui/Button';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  ShareIcon,
  PlusIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();
  const [endPages, setEndPages] = useState<EndPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchUserPages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const pages = await getUserEndPages(user.uid);
      setEndPages(pages);
    } catch (err) {
      console.error('Error fetching user pages:', err);
      setError('Une erreur est survenue lors du chargement de vos pages');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUserPages();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const handleDeletePage = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteEndPage(id);
      setEndPages(endPages.filter((page) => page.id !== id));
    } catch (err) {
      console.error('Error deleting page:', err);
      setError('Une erreur est survenue lors de la suppression de la page');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  
  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Lien copié dans le presse-papier');
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (!user) {
    return (
      <div className="min-h-screen py-12 flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à votre tableau de bord.
          </p>
          <div className="flex space-x-4 justify-center">
            <Button
              as={Link}
              href="/login"
              variant="primary"
            >
              Se connecter
            </Button>
            <Button
              as={Link}
              href="/signup"
              variant="outline"
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mes pages d'adieu
            </h1>
            <p className="mt-2 text-gray-600">
              Gérez vos créations et suivez leur impact.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              as={Link}
              href="/create"
              variant="primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Créer une nouvelle page
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
            <button 
              className="ml-2 underline"
              onClick={() => {
                setError(null);
                fetchUserPages();
              }}
            >
              Réessayer
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : endPages.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Vous n'avez pas encore créé de page d'adieu
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez par créer votre première page pour dire au revoir à votre façon.
            </p>
            <Button
              as={Link}
              href="/create"
              variant="primary"
            >
              Créer ma première page
            </Button>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visibilité
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {endPages.map((page) => {
                    const toneStyle = TONE_STYLES.find((tone) => tone.id === page.tone) || TONE_STYLES[0];
                    
                    return (
                      <tr key={page.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-xl"
                                 style={{ backgroundColor: toneStyle.backgroundColor, color: toneStyle.textColor }}>
                              {toneStyle.emoji}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{page.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {page.content.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(page.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            page.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {page.isPublic ? (
                              <>
                                <LockOpenIcon className="h-3 w-3 mr-1" />
                                Publique
                              </>
                            ) : (
                              <>
                                <LockClosedIcon className="h-3 w-3 mr-1" />
                                Privée
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              as={Link}
                              href={`/${page.slug}`}
                              size="sm"
                              variant="outline"
                              aria-label="Voir"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              as={Link}
                              href={`/edit/${page.id}`}
                              size="sm"
                              variant="outline"
                              aria-label="Modifier"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyLink(page.slug)}
                              aria-label="Partager"
                            >
                              <ShareIcon className="h-4 w-4" />
                            </Button>
                            {deleteId === page.id ? (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeletePage(page.id)}
                                  isLoading={isDeleting}
                                  disabled={isDeleting}
                                >
                                  Confirmer
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeleteId(null)}
                                  disabled={isDeleting}
                                >
                                  Annuler
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteId(page.id)}
                                aria-label="Supprimer"
                              >
                                <TrashIcon className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
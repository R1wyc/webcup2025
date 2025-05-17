'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserEndPages, getUserDrafts, deleteEndPage, deleteDraft, publishDraft } from '@/services/endpageService';
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
  LockOpenIcon,
  DocumentTextIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

type ViewMode = 'all' | 'published' | 'drafts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [publishedPages, setPublishedPages] = useState<EndPage[]>([]);
  const [draftPages, setDraftPages] = useState<EndPage[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [publishingDraftId, setPublishingDraftId] = useState<string | null>(null);
  
  const fetchUserContent = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching content for user:', user.uid);
      
      const [pages, drafts] = await Promise.all([
        getUserEndPages(user.uid),
        getUserDrafts(user.uid)
      ]);
      
      console.log(`Fetched ${pages.length} published pages and ${drafts.length} drafts`);
      
      // Make sure we always have arrays, even if the service returns null or undefined
      setPublishedPages(Array.isArray(pages) ? pages : []);
      setDraftPages(Array.isArray(drafts) ? drafts : []);
    } catch (err) {
      console.error('Error fetching user content:', err);
      setError('Une erreur est survenue lors du chargement de vos pages');
      
      // Set empty arrays on error to avoid undefined state
      setPublishedPages([]);
      setDraftPages([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUserContent();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const handleDeletePage = async (id: string, isDraft: boolean = false) => {
    try {
      setIsDeleting(true);
      
      if (isDraft) {
        await deleteDraft(id);
        setDraftPages(prevDrafts => prevDrafts.filter(page => page.id !== id));
      } else {
        await deleteEndPage(id);
        setPublishedPages(prevPages => prevPages.filter(page => page.id !== id));
      }
    } catch (err) {
      console.error('Error deleting content:', err);
      setError('Une erreur est survenue lors de la suppression');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  
  const handlePublishDraft = async (draftId: string) => {
    try {
      setPublishingDraftId(draftId);
      const publishedPage = await publishDraft(draftId);
      
      // Mettre à jour les listes
      setDraftPages(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
      setPublishedPages(prevPages => [publishedPage, ...prevPages]);
    } catch (err) {
      console.error('Error publishing draft:', err);
      setError('Une erreur est survenue lors de la publication du brouillon');
    } finally {
      setPublishingDraftId(null);
    }
  };
  
  const handleContinueDraft = (draftId: string) => {
    // Stocker l'ID du brouillon en cours pour le reprendre dans la page create
    localStorage.setItem('current_draft_id', draftId);
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
  
  // Calculer les pages à afficher selon le filtre
  const getDisplayedPages = () => {
    switch (viewMode) {
      case 'published':
        return publishedPages;
      case 'drafts':
        return draftPages;
      case 'all':
      default:
        return [...draftPages, ...publishedPages];
    }
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
  
  const displayedPages = getDisplayedPages();
  
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
                fetchUserContent();
              }}
            >
              Réessayer
            </button>
          </div>
        )}
        
        <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewMode === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('all')}
            >
              Tous ({draftPages.length + publishedPages.length})
            </Button>
            <Button
              variant={viewMode === 'published' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('published')}
            >
              <DocumentCheckIcon className="h-4 w-4 mr-1" />
              Publiés ({publishedPages.length})
            </Button>
            <Button
              variant={viewMode === 'drafts' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('drafts')}
            >
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              Brouillons ({draftPages.length})
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : displayedPages.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              {viewMode === 'drafts' 
                ? "Vous n'avez pas de brouillons" 
                : viewMode === 'published' 
                  ? "Vous n'avez pas encore publié de page" 
                  : "Vous n'avez pas encore créé de page d'adieu"}
            </h2>
            <p className="text-gray-600 mb-6">
              {viewMode === 'drafts' 
                ? "Commencez à rédiger pour créer des brouillons automatiquement."
                : "Commencez par créer votre première page pour dire au revoir à votre façon."}
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
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedPages.map((page) => {
                    const toneStyle = TONE_STYLES.find((tone) => tone.id === page.tone) || TONE_STYLES[0];
                    const isDraft = page.isDraft === true;
                    
                    return (
                      <tr key={page.id} className={isDraft ? 'bg-amber-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-xl"
                                 style={{ backgroundColor: toneStyle.backgroundColor, color: toneStyle.textColor }}>
                              {toneStyle.emoji}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {page.title || "(Sans titre)"}
                                {isDraft && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                    Brouillon
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {page.content ? `${page.content.substring(0, 60)}...` : "(Aucun contenu)"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(page.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isDraft ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <DocumentTextIcon className="h-3 w-3 mr-1" />
                              Brouillon
                            </span>
                          ) : (
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
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {isDraft ? (
                              <>
                                <Button
                                  as={Link}
                                  href="/create"
                                  size="sm"
                                  variant="outline"
                                  aria-label="Continuer"
                                  onClick={() => handleContinueDraft(page.id)}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  aria-label="Publier"
                                  isLoading={publishingDraftId === page.id}
                                  disabled={publishingDraftId !== null}
                                  onClick={() => handlePublishDraft(page.id)}
                                >
                                  <DocumentCheckIcon className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
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
                                  aria-label="Partager"
                                  onClick={() => handleCopyLink(page.slug)}
                                >
                                  <ShareIcon className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              aria-label="Supprimer"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              isLoading={isDeleting && deleteId === page.id}
                              disabled={isDeleting}
                              onClick={() => {
                                if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
                                  setDeleteId(page.id);
                                  handleDeletePage(page.id, isDraft);
                                }
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
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
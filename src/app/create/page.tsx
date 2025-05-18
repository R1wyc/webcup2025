'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { ToneSelector } from '@/components/editor/ToneSelector';
import { MediaUploader } from '@/components/editor/MediaUploader';
import { createEndPage, saveDraft, publishDraft } from '@/services/endpageService';
import { ToneStyle, MediaItem } from '@/types';
import { useForm } from 'react-hook-form';

interface CreateFormData {
  title: string;
  content: string;
  isPublic: boolean;
}

// ID du brouillon stocké en localStorage
const DRAFT_STORAGE_KEY = 'current_draft_id';

export default function CreatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tone, setTone] = useState<ToneStyle>('dramatic');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftTimer, setDraftTimer] = useState<NodeJS.Timeout | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CreateFormData>({
    defaultValues: {
      title: '',
      content: '',
      isPublic: false
    }
  });

  // Observer les changements dans le formulaire pour la sauvegarde automatique
  const formValues = watch();
  const { title, content, isPublic } = formValues;
  
  // Effet pour charger un brouillon existant au chargement
  useEffect(() => {
    if (!user) return;
    
    // Vérifier s'il y a un ID de brouillon en cours dans localStorage
    const storedDraftId = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (storedDraftId) {
      setDraftId(storedDraftId);
      // On pourrait charger le contenu du brouillon ici
      // Mais pour simplifier, on continue avec un formulaire vide
    } else {
      // Créer un nouveau brouillon vide
      createNewDraft();
    }
    
    // Nettoyer le timer à la destruction du composant
    return () => {
      if (draftTimer) clearTimeout(draftTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  // Effet pour la sauvegarde automatique du brouillon toutes les 30 secondes
  useEffect(() => {
    if (!user || !draftId) return;
    
    // Nettoyer le timer existant
    if (draftTimer) clearTimeout(draftTimer);
    
    // Créer un nouveau timer pour sauvegarder le brouillon
    const timer = setTimeout(() => {
      autoSaveDraft();
    }, 30000); // 30 secondes
    
    setDraftTimer(timer);
    
    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, draftId, title, content, isPublic, tone, media]);
  
  // Fonction pour créer un nouveau brouillon vide
  const createNewDraft = async () => {
    if (!user) return;
    
    try {
      const newDraft = await saveDraft(
        user.email,
        '',
        '',
        tone,
        [],
        false
      );
      
      setDraftId(newDraft.id);
      localStorage.setItem(DRAFT_STORAGE_KEY, newDraft.id);
    } catch (err) {
      console.error('Error creating draft:', err);
    }
  };
  
  // Fonction pour sauvegarder automatiquement le brouillon
  const autoSaveDraft = async () => {
    if (!user || !draftId) return;
    
    try {
      await saveDraft(
        user.email,
        title,
        content,
        tone,
        media,
        isPublic,
        draftId
      );
      
      setDraftSaved(true);
      // Masquer le message après 3 secondes
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (err) {
      console.error('Error auto-saving draft:', err);
    }
  };
  
  // Fonction pour sauvegarder manuellement le brouillon
  const saveCurrentDraft = async () => {
    if (!user || !draftId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await saveDraft(
        user.email,
        title,
        content,
        tone,
        media,
        isPublic,
        draftId
      );
      
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (err: any) {
      console.error('Error saving draft:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde du brouillon.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour publier la page (créer une page définitive)
  const onSubmit = async (data: CreateFormData) => {
    if (!user) {
      setError('Vous devez être connecté pour créer une page');
      return;
    }
    
    if (!draftId) {
      setError('Aucun brouillon trouvé. Veuillez rafraîchir la page.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!data.title.trim()) {
        throw new Error('Le titre est requis');
      }
      
      if (!data.content.trim()) {
        throw new Error('Le contenu est requis');
      }
      
      if (!tone) {
        throw new Error('Veuillez sélectionner un ton');
      }
      
      // Sauvegarder les dernières modifications dans le brouillon
      await saveDraft(
        user.email,
        data.title.trim(),
        data.content.trim(),
        tone,
        media,
        data.isPublic,
        draftId
      );
      
      // Publier le brouillon (le convertir en page définitive)
      const publishedPage = await publishDraft(draftId);
      
      // Effacer l'ID du brouillon en cours
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setDraftId(null);
      
      // Rediriger vers la page de prévisualisation
      router.push(`/preview/${publishedPage.slug}`);
    } catch (err: any) {
      console.error('Create page error:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de votre page.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen py-12 sm:py-16 lg:py-24 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour créer une page d'adieu.
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
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer une page d'adieu</h1>
          <p className="mt-2 text-gray-600">
            Exprimez-vous librement et créez une page mémorable pour marquer cette fin.
          </p>
          {draftSaved && (
            <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md text-sm animate-fadeIn">
              Brouillon sauvegardé automatiquement
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("CreatePage form submission");
            handleSubmit(onSubmit)(e);
            return false;
          }} 
          className="space-y-8"
          noValidate
        >
          <div>
            <Input
              label="Titre de la page"
              type="text"
              fullWidth
              placeholder="Ex: Adieu mon job toxique!"
              {...register('title', {
                required: 'Le titre est requis',
                maxLength: {
                  value: 100,
                  message: 'Le titre ne peut pas dépasser 100 caractères',
                },
              })}
              error={errors.title?.message}
            />
          </div>
          
          <ToneSelector
            selectedTone={tone}
            onToneChange={setTone}
          />
          
          <div>
            <TextArea
              label="Votre message d'adieu"
              fullWidth
              placeholder="C'est ici que vous pouvez exprimer votre adieu. Soyez expressif, drôle, touchant ou honnête - l'important est que ce message vous ressemble."
              rows={8}
              {...register('content', {
                required: 'Le contenu est requis',
                minLength: {
                  value: 10,
                  message: 'Le contenu doit contenir au moins 10 caractères',
                },
              })}
              error={errors.content?.message}
            />
          </div>
          
          <div className="mb-8">
            <MediaUploader
              media={media}
              onChange={setMedia}
              userId={user.email}
            />
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <input
                id="isPublic"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                {...register('isPublic')}
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                Rendre cette page publique (visible dans l'explorateur)
              </label>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.back();
                }}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saveCurrentDraft();
                }}
                isLoading={isLoading}
              >
                Sauvegarder brouillon
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Publier
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 
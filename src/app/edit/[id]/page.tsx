"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { ToneSelector } from '@/components/editor/ToneSelector';
import { MediaUploader } from '@/components/editor/MediaUploader';
import { getEndPageById, updateEndPage } from '@/services/endpageService';
import { EndPage, MediaItem, ToneStyle } from '@/types';

interface EditFormData {
  title: string;
  content: string;
  isPublic: boolean;
}

export default function EditPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [endPage, setEndPage] = useState<EndPage | null>(null);
  const [tone, setTone] = useState<ToneStyle>('dramatic');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditFormData>({
    defaultValues: {
      title: '',
      content: '',
      isPublic: false
    }
  });

  // Charger la page à modifier
  useEffect(() => {
    const fetchEndPage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('ID de page manquant');
        }
        
        const fetchedPage = await getEndPageById(id);
        if (!fetchedPage) {
          throw new Error('Page non trouvée');
        }
        
        setEndPage(fetchedPage);
        setTone(fetchedPage.tone);
        setMedia(fetchedPage.media || []);
        
        // Initialiser le formulaire avec les valeurs existantes
        reset({
          title: fetchedPage.title,
          content: fetchedPage.content,
          isPublic: fetchedPage.isPublic
        });
      } catch (err: any) {
        console.error('Erreur de chargement de la page:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement de la page');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEndPage();
  }, [id, reset]);

  // Gestion du formulaire
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Empêcher explicitement toute soumission de formulaire non intentionnelle
    e.preventDefault();
    e.stopPropagation();
    console.log("EditPage form submission intercepted");
    
    // Utiliser handleSubmit de react-hook-form pour la validation
    handleSubmit(onSubmit)(e);
    
    // Retourner false explicitement pour empêcher toute soumission
    return false;
  };

  const onSubmit = async (data: EditFormData) => {
    if (!user) {
      setError('Vous devez être connecté pour modifier une page');
      return;
    }
    
    if (!endPage) {
      setError('Impossible de modifier une page qui n\'existe pas');
      return;
    }
    
    console.log("Formulaire soumis intentionnellement, sauvegarde en cours...");
    setIsSaving(true);
    setError(null);
    
    try {
      // Vérifier que tous les champs obligatoires sont présents
      if (!data.title.trim()) {
        throw new Error('Le titre est requis');
      }
      
      if (!data.content.trim()) {
        throw new Error('Le contenu est requis');
      }
      
      if (!tone) {
        throw new Error('Veuillez sélectionner un ton');
      }
      
      // Mettre à jour la page
      await updateEndPage({
        id: endPage.id,
        title: data.title.trim(),
        content: data.content.trim(),
        tone,
        media,
        isPublic: data.isPublic
      });
      
      // Rediriger vers la prévisualisation uniquement après une sauvegarde réussie
      console.log("Sauvegarde réussie, redirection vers la prévisualisation");
      router.push(`/preview/${endPage.slug}`);
    } catch (err: any) {
      console.error('Erreur de modification:', err);
      setError(err.message || 'Une erreur est survenue lors de la modification de votre page');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen py-12 sm:py-16 lg:py-24 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour modifier une page d'adieu.
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          <span className="text-indigo-500 text-lg">Chargement...</span>
        </div>
      </div>
    );
  }
  
  if (error && !endPage) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            as={Link}
            href="/dashboard"
            variant="primary"
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier votre page d'adieu</h1>
          <p className="mt-2 text-gray-600">
            Modifiez votre message et les réglages de votre page.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <MediaUploader
          media={media}
          onChange={setMedia}
          userId={user.email}
        />
        
        <form 
          onSubmit={onFormSubmit} 
          className="space-y-8 mt-8" 
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
                type="submit"
                variant="primary"
                isLoading={isSaving}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 
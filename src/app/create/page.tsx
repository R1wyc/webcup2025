'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { ToneSelector } from '@/components/editor/ToneSelector';
import { MediaUploader } from '@/components/editor/MediaUploader';
import { createEndPage } from '@/services/endpageService';
import { ToneStyle, MediaItem } from '@/types';
import { useForm } from 'react-hook-form';

interface CreateFormData {
  title: string;
  content: string;
  isPublic: boolean;
}

export default function CreatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tone, setTone] = useState<ToneStyle>('dramatic');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    defaultValues: {
      title: '',
      content: '',
      isPublic: false
    }
  });
  
  const onSubmit = async (data: CreateFormData) => {
    if (!user) {
      setError('Vous devez être connecté pour créer une page');
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
      
      const newEndPage = await createEndPage(
        user.uid,
        data.title.trim(),
        data.content.trim(),
        tone,
        media,
        data.isPublic
      );
      
      if (newEndPage?.slug) {
        router.push(`/preview/${newEndPage.slug}`);
      } else {
        throw new Error('Erreur lors de la création de la page');
      }
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
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
          
          <MediaUploader
            media={media}
            onChange={setMedia}
            userId={user.uid}
          />
          
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
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Créer ma page
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 
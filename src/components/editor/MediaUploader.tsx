'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MediaItem } from '@/types';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

interface MediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  userId: string;
}

// Dimensions maximales pour les images 
const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 1200;

export function MediaUploader({ media, onChange, userId }: MediaUploaderProps) {
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'gif' | 'youtube' | 'music'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optimisation: Utilisation de useCallback pour les gestionnaires d'événements
  const handleAddMedia = useCallback(() => {
    if (!mediaUrl) {
      setError('Veuillez fournir une URL valide');
      return;
    }

    const newMedia: MediaItem = {
      type: mediaType,
      url: mediaUrl,
      title: mediaTitle || undefined,
    };

    onChange([...media, newMedia]);
    resetForm();
  }, [mediaUrl, mediaType, mediaTitle, media, onChange]);

  const resetForm = useCallback(() => {
    setIsAddingMedia(false);
    setMediaType('image');
    setMediaUrl('');
    setMediaTitle('');
    setError(null);
  }, []);

  const handleRemoveMedia = useCallback((index: number) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    onChange(updatedMedia);
  }, [media, onChange]);

  // Optimisation du redimensionnement des images
  const resizeImage = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // Vérifier si le fichier est une image
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          // Ne redimensionner que si l'image est grande
          if (img.width <= MAX_IMAGE_WIDTH && img.height <= MAX_IMAGE_HEIGHT) {
            resolve(file);
            return;
          }
          
          // Calculer les proportions
          const scale = Math.min(MAX_IMAGE_WIDTH / img.width, MAX_IMAGE_HEIGHT / img.height);
          const width = img.width * scale;
          const height = img.height * scale;
          
          // Créer un canvas pour le redimensionnement
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          
          // Dessiner l'image redimensionnée
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir le canvas en blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            file.type,
            0.85 // Niveau de qualité
          );
        };
        
        img.onerror = () => {
          resolve(file);
        };
      };
      
      reader.onerror = () => {
        resolve(file);
      };
    });
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      // Optimiser l'image avant l'upload
      const optimizedFile = await resizeImage(file);
      
      // Simuler une URL de fichier téléchargé
      const fakeUploadedUrl = URL.createObjectURL(optimizedFile);
      
      const newMedia: MediaItem = {
        type: file.type.includes('image') ? 'image' : 'music',
        url: fakeUploadedUrl,
        title: file.name,
      };
      
      onChange([...media, newMedia]);
      setIsAddingMedia(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Une erreur est survenue lors du téléchargement');
    } finally {
      setIsUploading(false);
    }
  }, [media, onChange, resizeImage]);

  // Optimisation: utiliser useMemo pour renderMediaItem
  const renderMediaItems = useMemo(() => {
    return media.map((item, index) => (
      <div key={index} className="relative group">
        {(() => {
          switch (item.type) {
            case 'image':
            case 'gif':
              return (
                <div className="relative rounded-lg overflow-hidden h-32 w-full bg-gray-100">
                  <Image
                    src={item.url}
                    alt={item.title || 'Image'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs truncate">
                    {item.title || 'Image'}
                  </span>
                </div>
              );
            case 'youtube':
              return (
                <div className="relative rounded-lg overflow-hidden h-32 w-full bg-gray-100 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs truncate">
                    {item.title || 'Vidéo YouTube'}
                  </span>
                </div>
              );
            case 'music':
              return (
                <div className="relative rounded-lg overflow-hidden h-32 w-full bg-gray-800 flex items-center justify-center">
                  <div className="text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.952 5.672c-.904-1.138-1.987-1.336-4.047-1.354l-8.01-.112c-2.328 0-3.02.815-3.02 2.375v12.14c0 1.677.674 2.289 2.37 2.289h10.291c2.092 0 2.486-.747 2.486-2.551v-10.071c0-.579-.112-1.546-.563-2.167l.493-.269zm-16.952 13.328v-12.722l17-.001v12.723h-17z" />
                      <circle cx="12" cy="14" r="3" />
                      <path d="M13 7h-2v5.414l2 2v-7.414z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs truncate">
                    {item.title || 'Musique'}
                  </span>
                </div>
              );
            default:
              return null;
          }
        })()}
        <button
          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleRemoveMedia(index)}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    ));
  }, [media, handleRemoveMedia]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Médias</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingMedia(!isAddingMedia)}
        >
          {isAddingMedia ? 'Annuler' : 'Ajouter un média'}
        </Button>
      </div>

      {isAddingMedia && (
        <div className="p-4 border border-gray-200 rounded-lg space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mediaType === 'image' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMediaType('image')}
            >
              Image
            </Button>
            <Button
              variant={mediaType === 'gif' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMediaType('gif')}
            >
              GIF
            </Button>
            <Button
              variant={mediaType === 'youtube' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMediaType('youtube')}
            >
              YouTube
            </Button>
            <Button
              variant={mediaType === 'music' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMediaType('music')}
            >
              Musique
            </Button>
          </div>

          {(mediaType === 'image' || mediaType === 'gif') && (
            <div className="space-y-2">
              <input
                type="file"
                accept={mediaType === 'image' ? 'image/*' : 'image/gif'}
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
              >
                Importer un fichier
              </Button>
              <p className="text-sm text-gray-500">ou</p>
            </div>
          )}

          <Input
            label={mediaType === 'youtube' ? 'URL YouTube' : mediaType === 'music' ? 'URL de la musique' : 'URL de l\'image'}
            type="text"
            fullWidth
            placeholder={
              mediaType === 'youtube'
                ? 'https://www.youtube.com/watch?v=...'
                : mediaType === 'music'
                ? 'URL du fichier audio'
                : 'URL de l\'image'
            }
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            error={error || undefined}
          />

          <Input
            label="Titre (optionnel)"
            type="text"
            fullWidth
            placeholder="Titre du média"
            value={mediaTitle}
            onChange={(e) => setMediaTitle(e.target.value)}
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddMedia}
              isLoading={isUploading}
            >
              Ajouter
            </Button>
          </div>
        </div>
      )}

      {media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {renderMediaItems}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <PlusIcon className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Aucun média ajouté. Cliquez sur "Ajouter un média" pour commencer.
          </p>
        </div>
      )}
    </div>
  );
} 
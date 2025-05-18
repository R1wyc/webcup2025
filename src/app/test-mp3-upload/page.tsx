'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadAudio, deleteAudio } from '@/services/storageService';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TestMP3Upload() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pour déboguer l'état de l'utilisateur
  useEffect(() => {
    console.log("Auth state:", { user, authLoading });
  }, [user, authLoading]);

  // Ne jamais rediriger pendant le chargement
  useEffect(() => {
    // Ne pas rediriger tant que l'état d'authentification est en cours de chargement
    if (!authLoading && !user) {
      console.log("No user found after loading complete, redirecting to login");
      // router.push('/login');
      // Nous ne redirigeons pas automatiquement pour corriger le bug
    }
  }, [user, authLoading, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Empêcher tout comportement par défaut
    
    console.log("File upload triggered", { userState: user });
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier si l'utilisateur est connecté avant l'upload
    if (!user && !authLoading) {
      console.log("User not authenticated, cannot upload");
      setError('Vous devez être connecté pour téléverser un fichier');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadMessage('Téléversement en cours...');

      // Vérifier si c'est un fichier MP3
      if (!file.type.includes('audio/')) {
        setError('Veuillez sélectionner un fichier audio valide');
        setIsUploading(false);
        setUploadMessage(null);
        return;
      }

      // Utiliser l'ID utilisateur si disponible, sinon utiliser l'ID de test
      const userId = user ? user.email : 'test-user-123';
      console.log("Uploading file with userId:", userId);
      
      const url = await uploadAudio(file, userId);

      setAudioUrl(url);
      setUploadMessage('Fichier téléversé avec succès!');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Une erreur est survenue lors du téléchargement');
      setUploadMessage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAudio = async () => {
    if (!audioUrl) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadMessage('Suppression en cours...');

      await deleteAudio(audioUrl);
      
      setAudioUrl(null);
      setUploadMessage('Fichier supprimé avec succès!');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Une erreur est survenue lors de la suppression');
    } finally {
      setIsUploading(false);
    }
  };

  // Afficher un indicateur de chargement pendant l'initialisation de l'authentification
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-lg">Chargement de l'authentification...</span>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher un message mais ne pas rediriger
  if (!user && !authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Connexion requise</h2>
          <p className="mb-6">Vous devez être connecté pour téléverser des fichiers audio.</p>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test d'upload MP3</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <input
            type="file"
            accept="audio/mp3,audio/mpeg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            disabled={isUploading}
            type="button"
          >
            Sélectionner un fichier MP3
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {uploadMessage && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded-md mb-4">
            {uploadMessage}
          </div>
        )}

        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Aperçu audio:</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <audio 
                controls 
                src={audioUrl}
                className="w-full"
              >
                Votre navigateur ne supporte pas l'élément audio.
              </audio>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2 break-words">
                  <strong>URL:</strong> {audioUrl}
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAudio}
                  isLoading={isUploading}
                  disabled={isUploading}
                  size="sm"
                  type="button"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Cliquez sur "Sélectionner un fichier MP3" et choisissez un fichier audio</li>
          <li>Le fichier sera téléversé sur Firebase Storage</li>
          <li>Une fois téléversé, vous pourrez écouter l'audio et voir l'URL générée</li>
          <li>Vous pouvez supprimer le fichier en cliquant sur "Supprimer"</li>
        </ol>
      </div>
    </div>
  );
} 
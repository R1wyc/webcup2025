import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour téléverser un fichier audio
export const uploadAudio = async (file: File, userId: string): Promise<string> => {
  // Simuler un délai pour le développement local sans Firebase
  if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_API_KEY) {
    console.log('Development mode: simulating upload with object URL');
    await new Promise(resolve => setTimeout(resolve, 1500));
    return URL.createObjectURL(file);
  }
  
  try {
    // Créer une référence unique pour le fichier
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const musicRef = ref(storage, `music/${userId}/${fileName}`);
    
    console.log(`Uploading file ${fileName} to Firebase Storage for user ${userId}`);
    
    // Téléverser le fichier
    const snapshot = await uploadBytes(musicRef, file);
    
    // Obtenir l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File uploaded successfully:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    throw new Error('Failed to upload audio file');
  }
};

// Fonction pour récupérer l'URL d'un fichier audio déjà téléversé
export const getAudioUrl = async (path: string): Promise<string> => {
  try {
    const audioRef = ref(storage, path);
    const url = await getDownloadURL(audioRef);
    return url;
  } catch (error) {
    console.error('Error getting audio URL:', error);
    throw new Error('Failed to get audio URL');
  }
};

// Fonction pour supprimer un fichier audio
export const deleteAudio = async (url: string): Promise<void> => {
  // Si nous sommes en mode développement sans Firebase ou si l'URL est un objectURL
  if ((process.env.NODE_ENV === 'development' && !process.env.FIREBASE_API_KEY) || 
      url.startsWith('blob:')) {
    console.log('Development mode: simulating delete for URL:', url);
    return;
  }
  
  try {
    // Extraction du chemin de l'URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/o/')[1];
    if (!path) {
      throw new Error('Invalid Firebase Storage URL format');
    }
    
    // Décodage du chemin
    const decodedPath = decodeURIComponent(path.split('?')[0]);
    const fileRef = ref(storage, decodedPath);
    
    console.log('Deleting file at path:', decodedPath);
    
    // Suppression du fichier
    await deleteObject(fileRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting audio file:', error);
    throw new Error('Failed to delete audio file');
  }
}; 
import { db, storage } from '@/lib/firebase';
import { EndPage, MediaItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Collection reference - simulée avec notre mock
const endpagesCollection = db.collection('endpages');

// Helper to create a unique slug
export const generateSlug = (): string => {
  const randomChars = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now().toString(36);
  return `${randomChars}-${timestamp}`;
};

// Store de démonstration persistant avec localStorage
let demoEndPages: Record<string, EndPage> = {};

// Charger les pages existantes depuis localStorage
const loadDemoPages = (): void => {
  try {
    const storedPages = localStorage.getItem('demo_end_pages');
    if (storedPages) {
      const parsedPages = JSON.parse(storedPages) as Record<string, EndPage>;
      
      // Clean up duplicate IDs by creating a map of unique IDs
      const idMap = new Map<string, boolean>();
      const uniquePages: Record<string, EndPage> = {};
      
      // First pass: identify duplicate IDs
      Object.values(parsedPages).forEach((page: EndPage) => {
        if (idMap.has(page.id)) {
          // If ID already exists, regenerate a new unique ID for this page
          page.id = `${page.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        }
        idMap.set(page.id, true);
        uniquePages[page.slug] = page;
      });
      
      demoEndPages = uniquePages;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des pages de démonstration:", error);
    demoEndPages = {};
  }
};

// Sauvegarder les pages dans localStorage
const saveDemoPages = (): void => {
  try {
    localStorage.setItem('demo_end_pages', JSON.stringify(demoEndPages));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des pages de démonstration:", error);
  }
};

// Initialiser les pages au chargement
if (typeof window !== 'undefined') {
  loadDemoPages();
}

// Function to clear all demo pages (useful for development/debugging)
export const clearDemoPages = (): void => {
  try {
    localStorage.removeItem('demo_end_pages');
    demoEndPages = {};
    console.log('All demo pages cleared from localStorage.');
  } catch (error) {
    console.error("Error clearing demo pages:", error);
  }
};

// Create a new end page
export const createEndPage = async (
  userId: string,
  title: string,
  content: string,
  tone: EndPage['tone'],
  media: MediaItem[],
  isPublic: boolean,
  backgroundColor?: string,
  textColor?: string,
  fontFamily?: string
): Promise<EndPage> => {
  const id = uuidv4();
  const slug = generateSlug();
  const createdAt = Date.now();

  // Créer un objet de base sans les propriétés optionnelles
  const baseEndPage: Omit<EndPage, 'backgroundColor' | 'textColor' | 'fontFamily'> = {
    id,
    title,
    content,
    tone,
    media,
    isPublic,
    createdAt,
    userId,
    slug,
  };

  // Créer l'objet final en n'ajoutant les propriétés optionnelles que si elles sont définies
  const newEndPage: EndPage = {
    ...baseEndPage,
    ...(backgroundColor !== undefined && { backgroundColor }),
    ...(textColor !== undefined && { textColor }),
    ...(fontFamily !== undefined && { fontFamily })
  } as EndPage;

  // Sauvegarder dans notre propre store de démonstration ET dans notre mock Firestore
  demoEndPages[slug] = newEndPage;
  // Sauvegarder dans localStorage pour maintenir les données
  saveDemoPages();
  
  // Sauvegarder également dans Firestore simulé
  await endpagesCollection.doc(id).set(newEndPage);
  
  console.log(`Page créée avec succès. ID: ${id}, Slug: ${slug}`);
  return newEndPage;
};

// Get an end page by ID
export const getEndPageById = async (id: string): Promise<EndPage | null> => {
  // Charger les données depuis localStorage pour assurer la cohérence
  if (typeof window !== 'undefined') {
    loadDemoPages();
  }
  
  // Chercher dans notre store de démonstration
  for (const slug in demoEndPages) {
    if (demoEndPages[slug].id === id) {
      return demoEndPages[slug];
    }
  }
  
  // Sinon, essayer le mock Firestore
  const docSnapshot = await endpagesCollection.doc(id).get();
  if (!docSnapshot.exists()) {
    return null;
  }
  
  // Si trouvé dans Firestore, ajouter aussi à notre store local
  const endPage = docSnapshot.data() as EndPage;
  if (endPage && endPage.slug) {
    demoEndPages[endPage.slug] = endPage;
    saveDemoPages();
  }
  
  return endPage;
};

// Get an end page by slug
export const getEndPageBySlug = async (slug: string): Promise<EndPage | null> => {
  // Charger les données depuis localStorage pour assurer la cohérence
  if (typeof window !== 'undefined') {
    loadDemoPages();
  }
  
  // Chercher dans notre store de démonstration
  if (demoEndPages[slug]) {
    return demoEndPages[slug];
  }
  
  // Simuler un résultat de base si rien n'est trouvé
  // En développement, nous renvoyons toujours une page pour faciliter les tests
  const uniqueId = `demo-${slug}-${Date.now()}`;
  const demoPage = {
    id: uniqueId,
    title: 'Page de démonstration',
    content: 'Ceci est une page de démonstration créée automatiquement pour faciliter le développement.',
    tone: 'dramatic' as const,
    media: [],
    isPublic: true,
    createdAt: Date.now(),
    userId: 'demo-user-123',
    slug
  };
  
  // Sauvegarder cette page de démo dans notre store
  demoEndPages[slug] = demoPage;
  saveDemoPages();
  
  return demoPage;
};

// Get all public end pages
export const getPublicEndPages = async (limitCount: number = 20): Promise<EndPage[]> => {
  // Charger les données depuis localStorage pour assurer la cohérence
  if (typeof window !== 'undefined') {
    loadDemoPages();
  }
  
  // Renvoyer des exemples de pages publiques pour le développement
  const timestamp = Date.now();
  const demoPages: EndPage[] = [
    {
      id: `demo-1-${timestamp}-1`,
      title: 'Adieu à mon ancien emploi',
      content: 'Après 5 ans de bons et loyaux services, il est temps de tourner la page.',
      tone: 'professional',
      media: [],
      isPublic: true,
      createdAt: timestamp - 1000000,
      userId: 'demo-user-1',
      slug: 'adieu-emploi'
    },
    {
      id: `demo-2-${timestamp}-2`,
      title: 'Fin d\'une amitié toxique',
      content: 'Il est parfois nécessaire de se séparer des personnes qui nous font du mal.',
      tone: 'touching',
      media: [],
      isPublic: true,
      createdAt: timestamp - 2000000,
      userId: 'demo-user-2',
      slug: 'amitie-toxique'
    },
    {
      id: `demo-3-${timestamp}-3`,
      title: 'Au revoir à mon serveur Discord',
      content: 'Ce serveur a été un lieu de rencontres et d\'échanges fantastiques pendant des années.',
      tone: 'funny',
      media: [],
      isPublic: true,
      createdAt: timestamp - 3000000,
      userId: 'demo-user-3',
      slug: 'discord-bye'
    }
  ];
  
  // S'assurer que les pages de démo sont dans notre store
  demoPages.forEach(page => {
    if (!demoEndPages[page.slug]) {
      demoEndPages[page.slug] = page;
    }
  });
  saveDemoPages();
  
  // Ajouter les pages de notre store de démonstration
  const publicDemoPages = Object.values(demoEndPages).filter(page => page.isPublic);
  
  return [...publicDemoPages].slice(0, limitCount);
};

// Get end pages by user ID
export const getUserEndPages = async (userId: string): Promise<EndPage[]> => {
  // Charger les données depuis localStorage pour assurer la cohérence
  if (typeof window !== 'undefined') {
    loadDemoPages();
  }
  
  // En développement, générer quelques pages pour l'utilisateur de démonstration
  const timestamp = Date.now();
  const userPages: EndPage[] = [
    {
      id: `user-demo-1-${timestamp}-1`,
      title: 'Ma lettre de démission',
      content: 'Il est temps pour moi de voguer vers de nouveaux horizons professionnels.',
      tone: 'professional',
      media: [],
      isPublic: false,
      createdAt: timestamp - 500000,
      userId,
      slug: 'lettre-demission'
    },
    {
      id: `user-demo-2-${timestamp}-2`,
      title: 'Adieu à mon appartement',
      content: 'Tant de souvenirs dans ces murs qui m\'ont vu grandir.',
      tone: 'touching',
      media: [],
      isPublic: true,
      createdAt: timestamp - 1500000,
      userId,
      slug: 'adieu-appartement'
    }
  ];
  
  // S'assurer que les pages d'exemple de l'utilisateur sont dans notre store
  userPages.forEach(page => {
    if (!demoEndPages[page.slug]) {
      demoEndPages[page.slug] = page;
    }
  });
  saveDemoPages();
  
  // Ajouter les pages de notre store de démonstration qui appartiennent à cet utilisateur
  const userDemoPages = Object.values(demoEndPages).filter(page => page.userId === userId);
  
  return userDemoPages;
};

// Update an end page
export const updateEndPage = async (
  endPage: Partial<EndPage> & { id: string }
): Promise<void> => {
  // Charger les données depuis localStorage pour assurer la cohérence
  if (typeof window !== 'undefined') {
    loadDemoPages();
  }
  
  // Filtrer les propriétés undefined
  const updateData = Object.entries(endPage).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  // Trouver la page par ID (nous avons besoin du slug pour notre store)
  let slugToUpdate: string | null = null;
  for (const slug in demoEndPages) {
    if (demoEndPages[slug].id === endPage.id) {
      slugToUpdate = slug;
      break;
    }
  }
  
  // Mettre à jour dans notre store de démonstration
  if (slugToUpdate) {
    demoEndPages[slugToUpdate] = { ...demoEndPages[slugToUpdate], ...updateData };
    saveDemoPages();
    
    console.log(`Page mise à jour avec succès. ID: ${endPage.id}, Slug: ${slugToUpdate}`);
  } else {
    console.error(`Page non trouvée pour mise à jour. ID: ${endPage.id}`);
  }
  
  // Mettre à jour dans notre mock Firestore
  await endpagesCollection.doc(endPage.id).update(updateData);
};

// Delete an end page
export const deleteEndPage = async (id: string): Promise<void> => {
  // Charger les données depuis localStorage pour assurer la cohérence
  if (typeof window !== 'undefined') {
    loadDemoPages();
  }
  
  // Trouver la page par ID pour obtenir le slug
  let slugToDelete: string | null = null;
  for (const slug in demoEndPages) {
    if (demoEndPages[slug].id === id) {
      slugToDelete = slug;
      break;
    }
  }
  
  // Supprimer de notre store de démonstration
  if (slugToDelete) {
    delete demoEndPages[slugToDelete];
    saveDemoPages();
    
    console.log(`Page supprimée avec succès. ID: ${id}, Slug: ${slugToDelete}`);
  } else {
    console.error(`Page non trouvée pour suppression. ID: ${id}`);
  }
  
  // Supprimer de notre mock Firestore
  await endpagesCollection.doc(id).delete();
};

// Fonctions de gestion des médias simulées pour le développement
export const uploadMedia = async (
  file: File,
  userId: string,
  type: MediaItem['type']
): Promise<string> => {
  // Simuler une URL pour le développement
  return URL.createObjectURL(file);
};

export const deleteMedia = async (url: string): Promise<void> => {
  // Rien à faire en développement
  console.log('Suppression simulée de', url);
}; 
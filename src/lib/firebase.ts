// Firebase configuration - VERSION DE DÉVELOPPEMENT SIMULÉE
import { getApps } from 'firebase/app';

// Mock Firebase services pour le développement
const createMockAuth = () => {
  const mockUser = {
    uid: 'demo-user-123',
    email: 'demo@example.com',
    displayName: 'Utilisateur Démo',
    photoURL: null,
    getIdToken: () => Promise.resolve('mock-token')
  };
  
  // Simuler l'instance auth de Firebase
  return {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Initialement pas d'utilisateur connecté
      setTimeout(() => callback(null), 100);
      // Retourner une fonction de désabonnement
      return () => {};
    },
    signInWithEmailAndPassword: (email, password) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simuler un succès de connexion
          const mockAuth = createMockAuth();
          mockAuth.currentUser = mockUser;
          resolve({ user: mockUser });
        }, 1000);
      });
    },
    createUserWithEmailAndPassword: (email, password) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simuler un succès d'inscription
          const mockAuth = createMockAuth();
          mockAuth.currentUser = { ...mockUser, email };
          resolve({ user: { ...mockUser, email } });
        }, 1000);
      });
    },
    signOut: () => Promise.resolve(),
    setPersistence: () => Promise.resolve()
  };
};

const createMockFirestore = () => {
  // Base de données en mémoire pour le développement
  const db = {
    endpages: {}
  };

  return {
    collection: (collectionName) => ({
      doc: (id) => ({
        set: (data) => {
          if (!db[collectionName]) db[collectionName] = {};
          db[collectionName][id] = data;
          return Promise.resolve();
        },
        get: () => Promise.resolve({
          exists: () => db[collectionName] && db[collectionName][id] ? true : false,
          data: () => db[collectionName] && db[collectionName][id] ? db[collectionName][id] : null
        }),
        update: (data) => {
          if (!db[collectionName]) db[collectionName] = {};
          if (!db[collectionName][id]) db[collectionName][id] = {};
          db[collectionName][id] = { ...db[collectionName][id], ...data };
          return Promise.resolve();
        },
        delete: () => {
          if (db[collectionName] && db[collectionName][id]) {
            delete db[collectionName][id];
          }
          return Promise.resolve();
        }
      }),
      where: () => ({
        get: () => Promise.resolve({
          empty: false,
          docs: Object.keys(db[collectionName] || {}).map(key => ({
            id: key,
            data: () => db[collectionName][key]
          }))
        })
      }),
      orderBy: () => ({
        limit: () => ({
          get: () => Promise.resolve({
            empty: false,
            docs: Object.keys(db[collectionName] || {}).map(key => ({
              id: key,
              data: () => db[collectionName][key]
            }))
          })
        }),
        get: () => Promise.resolve({
          empty: false,
          docs: Object.keys(db[collectionName] || {}).map(key => ({
            id: key,
            data: () => db[collectionName][key]
          }))
        })
      })
    }),
    enableIndexedDbPersistence: () => Promise.resolve()
  };
};

const createMockStorage = () => {
  return {
    ref: () => ({
      put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('https://example.com/mock-image.jpg') } }),
      delete: () => Promise.resolve(),
      getDownloadURL: () => Promise.resolve('https://example.com/mock-image.jpg')
    })
  };
};

// Utiliser des mocks pour le développement
const auth = createMockAuth();
const db = createMockFirestore();
const storage = createMockStorage();

console.info('📢 Utilisation de Firebase simulé pour le développement');

export { auth, db, storage }; 
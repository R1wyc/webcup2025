"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/firebase';

// Interfaces pour les types de Firebase (simplifiées pour l'implémentation simulée)
interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    // Utiliser le onAuthStateChanged simulé
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        };
        
        // Also save to localStorage for persistence
        localStorage.setItem('theend_user', JSON.stringify(userData));
        
        setUser(userData);
      } else {
        // Attempt to recover user from localStorage as fallback
        const storedUser = localStorage.getItem('theend_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            
            // Validate that we have a proper user object with required fields
            if (parsedUser && typeof parsedUser === 'object' && parsedUser.uid) {
              console.log('Recovered user from localStorage:', parsedUser.uid);
              setUser(parsedUser);
            } else {
              console.error('Invalid user data in localStorage');
              setUser(null);
              localStorage.removeItem('theend_user');
            }
          } catch (e) {
            console.error('Error parsing user from localStorage:', e);
            setUser(null);
            localStorage.removeItem('theend_user');
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(undefined);
      
      // Utiliser la fonction simulée de connexion
      const result = await auth.signInWithEmailAndPassword(email, password);
      
      if (result.user) {
        // Mettre à jour l'utilisateur dans le state
        const appUser: User = {
          uid: result.user.uid,
          email: result.user.email || email,
          displayName: result.user.displayName || 'Utilisateur Demo',
        };
        
        setUser(appUser);
        
        // Sauvegarder dans localStorage pour la persistance
        localStorage.setItem('theend_user', JSON.stringify(appUser));
      }
    } catch (err: any) {
      setError(new Error(err.message || 'Erreur lors de la connexion'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(undefined);
      
      // Utiliser la fonction simulée d'inscription
      const result = await auth.createUserWithEmailAndPassword(email, password);
      
      if (result.user) {
        // Dans notre mock, nous n'avons pas besoin d'appeler updateProfile
        // car nous ne communiquons pas réellement avec Firebase
        
        // Mettre à jour l'utilisateur dans le state
        const appUser: User = {
          uid: result.user.uid,
          email: result.user.email || email,
          displayName: displayName,
        };
        
        setUser(appUser);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('theend_user', JSON.stringify(appUser));
      }
    } catch (err: any) {
      setError(new Error(err.message || 'Erreur lors de l\'inscription'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(undefined);
      
      // Appeler la fonction simulée de déconnexion
      await auth.signOut();
      
      // Mettre à jour le state et supprimer du localStorage
      setUser(null);
      localStorage.removeItem('theend_user');
    } catch (err: any) {
      setError(new Error(err.message || 'Erreur lors de la déconnexion'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (displayName: string, photoURL?: string) => {
    try {
      setLoading(true);
      setError(undefined);
      
      // Dans notre implementation simulée, nous mettons simplement à jour le state
      if (user) {
        const updatedUser = {
          ...user,
          displayName,
          photoURL,
        };
        
        setUser(updatedUser);
        
        // Mettre à jour dans localStorage
        localStorage.setItem('theend_user', JSON.stringify(updatedUser));
      } else {
        throw new Error('Aucun utilisateur connecté');
      }
    } catch (err: any) {
      setError(new Error(err.message || 'Erreur lors de la mise à jour du profil'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
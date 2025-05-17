"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';

// Hook pour gérer la persistance d'authentification
export function useAuthPersistence() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setLoading(true);
        try {
          if (firebaseUser) {
            // Convertir l'utilisateur Firebase en notre modèle User
            const appUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || undefined,
              photoURL: firebaseUser.photoURL || undefined,
            };
            setUser(appUser);
            
            // Stocker également dans localStorage pour un fallback supplémentaire
            localStorage.setItem('theend_user', JSON.stringify(appUser));
          } else {
            setUser(null);
            localStorage.removeItem('theend_user');
          }
          setError(null);
        } catch (err) {
          // Tenter de récupérer depuis localStorage si disponible
          const localUser = localStorage.getItem('theend_user');
          if (localUser) {
            try {
              const parsedUser = JSON.parse(localUser);
              setUser(parsedUser);
            } catch (parseErr) {
              console.error('Erreur de parsing de l\'utilisateur local:', parseErr);
              localStorage.removeItem('theend_user');
              setUser(null);
            }
          } else {
            setUser(null);
          }
          
          if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error('Une erreur inconnue est survenue avec l\'authentification'));
          }
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth state error:', error);
        setError(error);
        setLoading(false);
      }
    );

    // Nettoyer le listener au démontage
    return () => unsubscribe();
  }, []);

  return { user, loading, error };
} 
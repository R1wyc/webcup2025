'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signUp(data.email, data.password, data.name);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Cette adresse email est déjà utilisée.');
      } else {
        setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inscription</h1>
          <p className="mt-2 text-gray-600">
            Créez un compte pour commencer à créer vos pages d'adieu
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Nom"
              type="text"
              fullWidth
              placeholder="Votre nom"
              {...register('name', {
                required: 'Le nom est requis',
                minLength: {
                  value: 2,
                  message: 'Le nom doit contenir au moins 2 caractères',
                },
              })}
              error={errors.name?.message}
            />
          </div>
          
          <div>
            <Input
              label="Email"
              type="email"
              fullWidth
              placeholder="votre@email.com"
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide',
                },
              })}
              error={errors.email?.message}
            />
          </div>
          
          <div>
            <Input
              label="Mot de passe"
              type="password"
              fullWidth
              placeholder="••••••••"
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              error={errors.password?.message}
            />
          </div>
          
          <div>
            <Input
              label="Confirmer le mot de passe"
              type="password"
              fullWidth
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Veuillez confirmer votre mot de passe',
                validate: (value) => 
                  value === password || 'Les mots de passe ne correspondent pas',
              })}
              error={errors.confirmPassword?.message}
            />
          </div>
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              S'inscrire
            </Button>
          </div>
          
          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Déjà inscrit?{' '}
              <Link href="/login" className="text-purple-600 hover:text-purple-800 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 
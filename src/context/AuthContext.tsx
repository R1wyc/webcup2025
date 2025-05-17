"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  password: string;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('theend_user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('theend_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get stored users or create a default user for demo purposes
    let storedUser = localStorage.getItem('theend_user');
    
    if (!storedUser) {
      // For demo: create a default user if none exists
      const defaultUser: User = {
        name: 'User Demo',
        email: 'user@example.com',
        password: 'password123',
        avatar: null
      };
      localStorage.setItem('theend_user', JSON.stringify(defaultUser));
      storedUser = JSON.stringify(defaultUser);
    }
    
    const parsedUser: User = JSON.parse(storedUser);
    
    // Check credentials
    if (parsedUser.email === email && parsedUser.password === password) {
      setUser(parsedUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if a user with this email already exists
    const existingUser = localStorage.getItem('theend_user');
    if (existingUser) {
      const parsedUser: User = JSON.parse(existingUser);
      if (parsedUser.email === email) {
        setIsLoading(false);
        throw new Error('Email already in use');
      }
    }
    
    // Create new user
    const newUser: User = {
      name,
      email,
      password,
      avatar: null
    };
    
    // Store user in localStorage
    localStorage.setItem('theend_user', JSON.stringify(newUser));
    
    // Set as current user
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
  };

  // Update user information
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('theend_user', JSON.stringify(updatedUser));
  };

  // Update password
  const updatePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user || user.password !== currentPassword) {
      return false;
    }
    
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    localStorage.setItem('theend_user', JSON.stringify(updatedUser));
    return true;
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
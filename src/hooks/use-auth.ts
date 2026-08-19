import { useEffect, useState, useCallback } from 'react';
import type { User as FirebaseUser } from '@react-native-firebase/auth';
import {
  getCurrentUser,
  signInWithGoogleOAuth,
  signOut as authSignOut,
  deleteCurrentUser,
  subscribeToAuthState,
  type GoogleSignInResult,
} from '@/services/auth';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<GoogleSignInResult> => {
    setIsSigningIn(true);
    try {
      const result = await signInWithGoogleOAuth();
      return result;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authSignOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await deleteCurrentUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isSigningIn,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    deleteAccount,
  };
}


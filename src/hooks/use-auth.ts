import { useEffect, useState, useCallback } from 'react';
import type { User as FirebaseUser } from '@react-native-firebase/auth';
import {
  getCurrentUser,
  signInWithGoogleOAuth,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  sendPasswordReset as authSendPasswordReset,
  signOut as authSignOut,
  deleteCurrentUser,
  subscribeToAuthState,
  type GoogleSignInResult,
  type EmailAuthResult,
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

  const signInWithEmail = useCallback(
    async (email: string, pass: string): Promise<EmailAuthResult> => {
      setIsSigningIn(true);
      try {
        const result = await signInWithEmailPassword(email, pass);
        return result;
      } finally {
        setIsSigningIn(false);
      }
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (email: string, pass: string, displayName?: string): Promise<EmailAuthResult> => {
      setIsSigningIn(true);
      try {
        const result = await signUpWithEmailPassword(email, pass, displayName);
        return result;
      } finally {
        setIsSigningIn(false);
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      return await authSendPasswordReset(email);
    },
    []
  );

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
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInWithGoogle,
    signOut,
    deleteAccount,
  };
}


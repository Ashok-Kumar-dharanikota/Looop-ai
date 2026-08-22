import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { useUserStore, useAppStore } from '@/store';

export function useAuthFlow() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    user: fbUser,
    isLoading: isFbLoading,
    isAuthenticated: isFbAuth,
    signInWithGoogle,
    isSigningIn,
  } = useAuth();
  const { user: storeUser, isAuthenticated: isStoreAuth, isGuest } = useUserStore();
  const { hasCompletedOnboarding } = useAppStore();

  // Guest input state
  const [guestName, setGuestName] = useState('');
  const [isGuestInputFocused, setIsGuestInputFocused] = useState(false);
  const [guestInputError, setGuestInputError] = useState(false);

  // Active user check
  const isUserActive =
    !isFbLoading && ((isFbAuth && !!fbUser) || (isStoreAuth && (!!storeUser || isGuest)));

  const navigateNext = useCallback(() => {
    if (useAppStore.getState().hasCompletedOnboarding) {
      router.replace('/(tabs)' as any);
    } else {
      router.replace('/onboarding' as any);
    }
  }, [router]);

  const handleGuestContinue = useCallback(() => {
    const trimmedName = guestName.trim();
    if (!trimmedName) {
      setGuestInputError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'Name Required',
        t('auth.toast.guestError', 'Please enter your name to continue as a guest.'),
        [{ text: 'OK' }]
      );
      return;
    }
    setGuestInputError(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useUserStore.getState().setGuest(trimmedName);
    navigateNext();
  }, [guestName, navigateNext, t]);

  const handleGoogleSignIn = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        useUserStore.getState().setUser({
          uid: result.firebaseUser.uid,
          email: result.firebaseUser.email || result.googleUser?.email || null,
          displayName: result.firebaseUser.displayName || result.googleUser?.name || null,
          photoURL: result.firebaseUser.photoURL || result.googleUser?.photo || null,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigateNext();
      } else if (!result.cancelled && result.error) {
        Alert.alert('Sign-In Notice', result.error);
      }
    } catch (err: any) {
      Alert.alert(
        'Sign-In Error',
        err?.message ||
          t('auth.toast.googleError', 'Unable to connect Google account. Please try again.')
      );
    }
  }, [signInWithGoogle, navigateNext, t]);

  const onGuestNameChange = useCallback(
    (text: string) => {
      setGuestName(text);
      if (guestInputError && text.trim().length > 0) {
        setGuestInputError(false);
      }
    },
    [guestInputError]
  );

  return {
    isUserActive,
    hasCompletedOnboarding,
    isSigningIn,
    guestName,
    setGuestName,
    onGuestNameChange,
    isGuestInputFocused,
    setIsGuestInputFocused,
    guestInputError,
    setGuestInputError,
    handleGuestContinue,
    handleGoogleSignIn,
  };
}

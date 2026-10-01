import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserStore, useAppStore } from '@/store';
import { useAuth } from '@/hooks/use-auth';
import { AuthScreen } from '@/features/auth';

export default function IndexScreen() {
  const { user: storeUser, isAuthenticated: isStoreAuth, isGuest } = useUserStore();
  const { hasCompletedOnboarding } = useAppStore();
  const { user: fbUser, isLoading: isFbLoading, isAuthenticated: isFbAuth } = useAuth();

  // Instant check for guest or persistent store user from MMKV
  const isGuestActive = isGuest || (isStoreAuth && !!storeUser && storeUser.isGuest);
  const isUserActive = isStoreAuth && !!storeUser && !storeUser.isGuest;

  if (isGuestActive || isUserActive) {
    return (
      <Redirect
        href={hasCompletedOnboarding ? ('/(tabs)' as any) : ('/onboarding' as any)}
      />
    );
  }

  // If still checking Firebase for existing session on cold start, keep blank splash screen
  if (isFbLoading && isFbAuth && !!fbUser) {
    return <View style={styles.fallbackContainer} />;
  }

  return <AuthScreen />;
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
});


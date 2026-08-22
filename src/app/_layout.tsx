import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import '@/i18n';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from '@expo-google-fonts/outfit';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { queryClient } from '@/lib/query-client';
import { initializeDatabase } from '@/db';
import { subscribeToAuthState } from '@/services/auth';
import { useUserStore, useAppStore } from '@/store';
import { vexo } from 'vexo-analytics';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { expoDb } from '@/db/client';
import { AppLockOverlay } from '@/components/security/AppLockOverlay';
import {
  initializeNotifications,
  scheduleDailySpendingReminder,
} from '@/services/notifications';
import { getAppCheckInstance } from '@/services/firebase-ai';
import {
  initializePurchases,
  logInRevenueCat,
  logOutRevenueCat,
} from '@/services/purchases';
import { registerBackgroundStoryWorker } from '@/services/background-story-task';

if (!__DEV__) {
  vexo('75f22314-8a13-43fa-8e81-2937383847c1');
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  useDrizzleStudio(expoDb);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  useEffect(() => {
    // 0. Initialize Firebase App Check, RevenueCat & Background Story Worker
    getAppCheckInstance();
    initializePurchases();
    registerBackgroundStoryWorker();

    // 1. Initialize Smart Notifications handler and Android channels (no permission prompts on startup)
    initializeNotifications().then(() => {
      const { notificationsEnabled, dailyReminderTime, hasCompletedOnboarding } =
        useAppStore.getState();
      if (hasCompletedOnboarding && notificationsEnabled) {
        scheduleDailySpendingReminder(dailyReminderTime, false);
      }
    });

    // 2. Sync Firebase Auth state with global Zustand store & RevenueCat
    let wasPreviouslyAuthenticated = false;
    const unsubscribeAuth = subscribeToAuthState((firebaseUser) => {
      if (firebaseUser) {
        wasPreviouslyAuthenticated = true;
        useUserStore.getState().setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        logInRevenueCat(firebaseUser.uid);
      } else {
        if (wasPreviouslyAuthenticated) {
          useUserStore.getState().clearUser();
          logOutRevenueCat();
        }
      }
    });

    // 3. Notification Tap & Deep Linking Handler
    const handleNotificationData = (data: any) => {
      if (!data) return;
      const targetScreen = data.screen || data.url;
      const { isAuthenticated, isGuest } = useUserStore.getState();
      const { hasCompletedOnboarding } = useAppStore.getState();

      if ((isAuthenticated || isGuest) && hasCompletedOnboarding) {
        if (targetScreen === 'record-expense' || targetScreen === '/record-expense') {
          router.push('/record-expense' as any);
        } else if (targetScreen === 'goals' || targetScreen === '/(tabs)/goals') {
          router.push('/(tabs)/goals' as any);
        } else if (targetScreen === 'paywall' || targetScreen === '/paywall') {
          router.push('/paywall' as any);
        }
      }
    };

    // Listen for notification taps when app is running (foreground or background)
    const notificationSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationData(response.notification.request.content.data);
      }
    );

    // Check if app was opened directly from a notification tap when closed (cold-start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationData(response.notification.request.content.data);
      }
    });

    async function prepare() {
      try {
        await initializeDatabase();
        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }
      } catch (e) {
        console.warn('Initialization/Update error:', e);
      }
    }
    prepare();

    return () => {
      unsubscribeAuth();
      notificationSubscription.remove();
    };
  }, [router]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider statusBarTranslucent>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="paywall" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="record-expense"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="terms-of-use" />
            <Stack.Screen name="privacy-policy" />
          </Stack>

          {/* Global Security Shield Overlay (Active when app is locked) */}
          <AppLockOverlay />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

import { useEffect, useRef, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useAppStore } from '@/store/use-app-store';
import { useUserStore } from '@/store/use-user-store';
import { authenticateWithBiometrics } from '@/services/biometrics';

export function useAppLock() {
  const {
    biometricsEnabled,
    lockTimeoutSeconds,
    isAppLocked,
    setIsAppLocked,
  } = useAppStore();

  const isPremium = useUserStore((state) => state.isPremium);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const backgroundedTimestamp = useRef<number | null>(null);
  const isAuthenticatingRef = useRef(false);

  // Authenticate and unlock
  const triggerUnlock = useCallback(async () => {
    if (isAuthenticatingRef.current) return;
    isAuthenticatingRef.current = true;

    try {
      const res = await authenticateWithBiometrics('Unlock Looop to view your finances');
      if (res.success) {
        setIsAppLocked(false);
      }
    } finally {
      isAuthenticatingRef.current = false;
    }
  }, [setIsAppLocked]);

  // Initial mount check
  useEffect(() => {
    // Only lock if user is Premium and biometrics is enabled
    if (isPremium && biometricsEnabled) {
      setIsAppLocked(true);
      triggerUnlock();
    }
  }, []);

  // Listen to AppState lifecycle changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // 1. App went to background
      if (
        appState.current === 'active' &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        backgroundedTimestamp.current = Date.now();
      }

      // 2. App returned to foreground / active
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (isPremium && biometricsEnabled) {
          const now = Date.now();
          const lastBackgrounded = backgroundedTimestamp.current || 0;
          const elapsedSeconds = (now - lastBackgrounded) / 1000;

          if (elapsedSeconds >= lockTimeoutSeconds) {
            setIsAppLocked(true);
            triggerUnlock();
          }
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isPremium, biometricsEnabled, lockTimeoutSeconds, setIsAppLocked, triggerUnlock]);

  return {
    isAppLocked: isPremium && biometricsEnabled ? isAppLocked : false,
    triggerUnlock,
  };
}

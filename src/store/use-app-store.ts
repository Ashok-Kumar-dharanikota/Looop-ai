import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

import * as Localization from 'expo-localization';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';
export type ThemeMode = 'system' | 'light' | 'dark';
export type BiometricType = 'face' | 'fingerprint' | 'biometric' | 'none';

interface AppState {
  currency: CurrencyCode;
  currencySymbol: string;
  themeMode: ThemeMode;
  hasCompletedOnboarding: boolean;

  // Biometrics & Security Settings
  biometricsEnabled: boolean;
  biometricType: BiometricType;
  lockTimeoutSeconds: number; // 0 = Immediately, 60 = 1 min, 300 = 5 min
  isAppLocked: boolean; // Runtime state
  appBackgroundedAt: number | null;

  // Smart Notifications Settings
  notificationsEnabled: boolean;
  dailyReminderTime: string; // 'HH:mm' e.g. '20:30'
  budgetAlertsEnabled: boolean;
  goalMilestonesEnabled: boolean;

  // Actions
  setCurrency: (currency: CurrencyCode) => void;
  setThemeMode: (theme: ThemeMode) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;

  setBiometricsEnabled: (enabled: boolean) => void;
  setBiometricType: (type: BiometricType) => void;
  setLockTimeoutSeconds: (seconds: number) => void;
  setIsAppLocked: (locked: boolean) => void;
  setAppBackgroundedAt: (timestamp: number | null) => void;

  setNotificationsEnabled: (enabled: boolean) => void;
  setDailyReminderTime: (time: string) => void;
  setBudgetAlertsEnabled: (enabled: boolean) => void;
  setGoalMilestonesEnabled: (enabled: boolean) => void;
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'AU$',
  JPY: '¥',
};

export function getDefaultLocaleCurrency(): { code: CurrencyCode; symbol: string } {
  try {
    const locales = Localization.getLocales();
    const detectedCode = locales?.[0]?.currencyCode?.toUpperCase() as CurrencyCode;
    if (detectedCode && CURRENCY_SYMBOLS[detectedCode]) {
      return {
        code: detectedCode,
        symbol: locales?.[0]?.currencySymbol || CURRENCY_SYMBOLS[detectedCode],
      };
    }
    return { code: 'INR', symbol: '₹' };
  } catch {
    return { code: 'INR', symbol: '₹' };
  }
}

const defaultCurrency = getDefaultLocaleCurrency();

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currency: defaultCurrency.code,
      currencySymbol: defaultCurrency.symbol,
      themeMode: 'system',
      hasCompletedOnboarding: false,

      // Biometrics defaults
      biometricsEnabled: false,
      biometricType: 'biometric',
      lockTimeoutSeconds: 0,
      isAppLocked: false,
      appBackgroundedAt: null,

      // Smart Notifications defaults
      notificationsEnabled: true,
      dailyReminderTime: '20:30',
      budgetAlertsEnabled: true,
      goalMilestonesEnabled: true,

      setCurrency: (currency) =>
        set({
          currency,
          currencySymbol: CURRENCY_SYMBOLS[currency] || '$',
        }),

      setThemeMode: (themeMode) => set({ themeMode }),
      setHasCompletedOnboarding: (hasCompletedOnboarding) =>
        set({ hasCompletedOnboarding }),

      setBiometricsEnabled: (biometricsEnabled) => set({ biometricsEnabled }),
      setBiometricType: (biometricType) => set({ biometricType }),
      setLockTimeoutSeconds: (lockTimeoutSeconds) => set({ lockTimeoutSeconds }),
      setIsAppLocked: (isAppLocked) => set({ isAppLocked }),
      setAppBackgroundedAt: (appBackgroundedAt) => set({ appBackgroundedAt }),

      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setDailyReminderTime: (dailyReminderTime) => set({ dailyReminderTime }),
      setBudgetAlertsEnabled: (budgetAlertsEnabled) => set({ budgetAlertsEnabled }),
      setGoalMilestonesEnabled: (goalMilestonesEnabled) => set({ goalMilestonesEnabled }),
    }),
    {
      name: 'looop-app-settings-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        currency: state.currency,
        currencySymbol: state.currencySymbol,
        themeMode: state.themeMode,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        biometricsEnabled: state.biometricsEnabled,
        biometricType: state.biometricType,
        lockTimeoutSeconds: state.lockTimeoutSeconds,
        notificationsEnabled: state.notificationsEnabled,
        dailyReminderTime: state.dailyReminderTime,
        budgetAlertsEnabled: state.budgetAlertsEnabled,
        goalMilestonesEnabled: state.goalMilestonesEnabled,
      }),
    }
  )
);

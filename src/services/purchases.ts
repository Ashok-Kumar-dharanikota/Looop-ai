import Purchases, {
  LOG_LEVEL,
  type PurchasesPackage,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesError,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useUserStore } from '@/store/use-user-store';

/**
 * RevenueCat API Keys & Entitlement Configuration
 * - Development & Preview: Uses RevenueCat Test Store key
 * - Production: Uses Google Play / Apple App Store key
 */
export const REVENUECAT_TEST_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ||
  'test_PQqcemFHZczwGcsVHrQLSXtLzML';

export const REVENUECAT_PROD_GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_PROD_GOOGLE_API_KEY ||
  'goog_dzjPDHMumJlxTZoezkqkvhTssOL';

/**
 * Returns true only when running a standalone production build.
 * Local development (__DEV__), Expo dev builds, and preview builds return false.
 */
export function isProductionEnvironment(): boolean {
  if (__DEV__) return false;

  const appVariant =
    process.env.EXPO_PUBLIC_APP_VARIANT ||
    Constants.expoConfig?.extra?.appVariant ||
    process.env.APP_VARIANT;

  if (appVariant === 'production' || Updates.channel === 'production') {
    const pkg =
      Constants.expoConfig?.android?.package ||
      Constants.expoConfig?.ios?.bundleIdentifier ||
      '';
    if (!pkg.includes('.dev') && !pkg.includes('.preview')) {
      return true;
    }
  }

  return false;
}

/**
 * Returns the appropriate RevenueCat API key:
 * - Test key for development and preview builds
 * - Production key for production builds
 */
export function getRevenueCatApiKey(): string {
  const isProd = isProductionEnvironment();

  if (isProd) {
    const envKey = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY;
    if (envKey && !envKey.startsWith('test_')) {
      return envKey;
    }
    return (
      Constants.expoConfig?.extra?.revenueCatApiKey ||
      REVENUECAT_PROD_GOOGLE_API_KEY
    );
  }

  // Development and Preview builds use the Test key
  const envKey = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY;
  if (envKey && envKey.startsWith('test_')) {
    return envKey;
  }
  return (
    process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ||
    Constants.expoConfig?.extra?.revenueCatApiKey ||
    REVENUECAT_TEST_API_KEY
  );
}

export const REVENUECAT_GOOGLE_API_KEY = getRevenueCatApiKey();

export const PRO_ENTITLEMENT_ID = 'Looop AI Pro';
export const FALLBACK_ENTITLEMENT_ID = 'pro';

// Custom RevenueCat Deep Link URL Scheme
export const REVENUECAT_CUSTOM_SCHEME = 'rc-9566e62f81';

// Target Package Identifiers
export const PACKAGE_IDENTIFIERS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export interface PurchaseResult {
  success: boolean;
  isPro: boolean;
  userCancelled?: boolean;
  error?: string;
  customerInfo?: CustomerInfo;
}

export { PAYWALL_RESULT };

let isInitialized = false;

/**
 * Checks whether the given CustomerInfo contains active "Looop AI Pro" entitlement.
 */
export function checkProEntitlement(customerInfo: CustomerInfo | null): boolean {
  if (!customerInfo) return false;

  const entitlements = customerInfo.entitlements?.active;
  if (!entitlements) return false;

  const isPro =
    Boolean(entitlements[PRO_ENTITLEMENT_ID]?.isActive) ||
    Boolean(entitlements[FALLBACK_ENTITLEMENT_ID]?.isActive) ||
    Boolean(Object.values(entitlements).some((e) => e.isActive));

  return isPro;
}

/**
 * Initializes the RevenueCat SDK on app startup.
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  if (isInitialized) return;

  const isProd = isProductionEnvironment();
  const apiKey = getRevenueCatApiKey();

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.INFO);
    }

    if (Platform.OS === 'android') {
      Purchases.configure({
        apiKey,
        appUserID: userId || undefined,
      });
    } else if (Platform.OS === 'ios') {
      const iosKey = isProd
        ? (process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || apiKey)
        : apiKey;
      Purchases.configure({
        apiKey: iosKey,
        appUserID: userId || undefined,
      });
    }

    // Set up CustomerInfo update listener to keep Zustand in sync
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      const isPro = checkProEntitlement(customerInfo);
      useUserStore.getState().setIsPremium(isPro);
    });

    // Check initial entitlement status
    const initialInfo = await Purchases.getCustomerInfo();
    const isPro = checkProEntitlement(initialInfo);
    useUserStore.getState().setIsPremium(isPro);

    isInitialized = true;
    console.log(
      `✅ [RevenueCat] Initialized (${isProd ? 'Production Play Store' : 'RevenueCat Test Store'}). Pro status:`,
      isPro
    );
  } catch (error) {
    console.warn('⚠️ [RevenueCat] Initialization warning:', error);
  }
}

/**
 * Fetches current subscription offerings from RevenueCat.
 */
export async function fetchOfferings(): Promise<PurchasesOffering | null> {
  if (Platform.OS === 'web') return null;

  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      return offerings.current;
    }
    // Fallback: If current offering has 0 packages, check any offering in offerings.all
    if (offerings.all && Object.keys(offerings.all).length > 0) {
      const firstOffering = Object.values(offerings.all)[0];
      if (firstOffering && firstOffering.availablePackages.length > 0) {
        return firstOffering;
      }
    }
    return offerings.current;
  } catch (error) {
    console.warn('⚠️ [RevenueCat] Error fetching offerings:', error);
    return null;
  }
}

/**
 * Executes a purchase for the selected RevenueCat package (Weekly, Monthly, or Yearly).
 */
export async function purchasePackage(packageToBuy: PurchasesPackage): Promise<PurchaseResult> {
  if (Platform.OS === 'web') {
    return { success: false, isPro: false, error: 'In-app purchases are not supported on web.' };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
    const isPro = checkProEntitlement(customerInfo);

    useUserStore.getState().setIsPremium(isPro);

    return {
      success: true,
      isPro,
      customerInfo,
    };
  } catch (error: any) {
    const purchasesError = error as PurchasesError;

    if (purchasesError?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return {
        success: false,
        isPro: false,
        userCancelled: true,
      };
    }

    console.warn('⚠️ [RevenueCat] Purchase failed:', error);
    return {
      success: false,
      isPro: false,
      userCancelled: false,
      error: purchasesError?.message || 'Payment could not be completed. Please try again.',
    };
  }
}

/**
 * Restores previous purchases for the current user.
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  if (Platform.OS === 'web') {
    return { success: false, isPro: false, error: 'In-app purchases are not supported on web.' };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPro = checkProEntitlement(customerInfo);

    useUserStore.getState().setIsPremium(isPro);

    return {
      success: true,
      isPro,
      customerInfo,
    };
  } catch (error: any) {
    console.warn('⚠️ [RevenueCat] Restore purchases error:', error);
    return {
      success: false,
      isPro: false,
      error: error?.message || 'Failed to restore purchases.',
    };
  }
}

/**
 * Handles incoming deep link URLs (e.g. rc-9566e62f81://... web purchase redemptions or paywall links).
 */
export async function handleRevenueCatUrl(url: string): Promise<boolean> {
  if (Platform.OS === 'web' || !url) return false;

  try {
    const redemption = await Purchases.parseAsWebPurchaseRedemption(url);
    if (redemption) {
      const result = await Purchases.redeemWebPurchase(redemption);
      console.log('✅ [RevenueCat] Web purchase redemption result:', result);
      const customerInfo = await Purchases.getCustomerInfo();
      const isPro = checkProEntitlement(customerInfo);
      useUserStore.getState().setIsPremium(isPro);
      return true;
    }
  } catch (error) {
    console.warn('⚠️ [RevenueCat] Error handling deep link URL:', error);
  }
  return false;
}

/**
 * Logs in a user to RevenueCat upon Firebase authentication.
 */
export async function logInRevenueCat(userId: string): Promise<CustomerInfo | null> {
  if (Platform.OS === 'web') return null;

  try {
    const isConfigured = await Purchases.isConfigured();
    if (!isConfigured) return null;

    const currentUserId = await Purchases.getAppUserID();
    if (currentUserId === userId) {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPro = checkProEntitlement(customerInfo);
      useUserStore.getState().setIsPremium(isPro);
      return customerInfo;
    }

    const { customerInfo } = await Purchases.logIn(userId);
    const isPro = checkProEntitlement(customerInfo);
    useUserStore.getState().setIsPremium(isPro);
    return customerInfo;
  } catch (error) {
    console.warn('⚠️ [RevenueCat] LogIn error:', error);
    return null;
  }
}

/**
 * Logs out user from RevenueCat on sign out.
 */
export async function logOutRevenueCat(): Promise<CustomerInfo | null> {
  if (Platform.OS === 'web') return null;

  try {
    const isConfigured = await Purchases.isConfigured();
    if (!isConfigured) return null;

    const isAnonymous = await Purchases.isAnonymous();
    const currentUserId = await Purchases.getAppUserID();

    if (isAnonymous || !currentUserId || currentUserId.startsWith('$RCAnonymousID')) {
      return null;
    }

    const customerInfo = await Purchases.logOut();
    const isPro = checkProEntitlement(customerInfo);
    useUserStore.getState().setIsPremium(isPro);
    return customerInfo;
  } catch (error: any) {
    if (
      error?.message?.includes('anonymous') ||
      error?.code === PURCHASES_ERROR_CODE.LOG_OUT_ANONYMOUS_USER_ERROR
    ) {
      return null;
    }
    console.warn('⚠️ [RevenueCat] LogOut error:', error);
    return null;
  }
}

/**
 * Presents the RevenueCat Native Paywall.
 */
export async function presentNativePaywall(
  requiredEntitlement = PRO_ENTITLEMENT_ID
): Promise<PAYWALL_RESULT> {
  if (Platform.OS === 'web') return PAYWALL_RESULT.NOT_PRESENTED;

  try {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: requiredEntitlement,
    });
    return result;
  } catch (error) {
    console.warn('⚠️ [RevenueCatUI] Present paywall error:', error);
    return PAYWALL_RESULT.ERROR;
  }
}

/**
 * Presents the RevenueCat Customer Center for managing subscriptions.
 */
export async function presentCustomerCenterModal(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await RevenueCatUI.presentCustomerCenter();
  } catch (error) {
    console.warn('⚠️ [RevenueCatUI] Present Customer Center error:', error);
  }
}

/**
 * Sets user ID on login.
 */
export async function identifyPurchasesUser(userId: string): Promise<void> {
  await logInRevenueCat(userId);
}

/**
 * Resets user on logout.
 */
export async function resetPurchasesUser(): Promise<void> {
  await logOutRevenueCat();
}

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
import { useUserStore } from '@/store/use-user-store';

/**
 * RevenueCat API Keys & Entitlement Configuration
 */
export const REVENUECAT_GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY ||
  'test_PQqcemFHZczwGcsVHrQLSXtLzML';

export const PRO_ENTITLEMENT_ID = 'Looop AI Pro';
export const FALLBACK_ENTITLEMENT_ID = 'pro';

// Target Package Identifiers
export const PACKAGE_IDENTIFIERS = {
  LIFETIME: 'lifetime',
  YEARLY: 'yearly',
  MONTHLY: 'monthly',
} as const;

let isInitialized = false;

/**
 * Checks whether the given CustomerInfo contains active "Looop AI Pro" entitlement.
 */
export function checkProEntitlement(customerInfo: CustomerInfo | null): boolean {
  if (!customerInfo) return false;

  const entitlements = customerInfo.entitlements.active;
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
  if (isInitialized) return;

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.INFO);
    }

    if (Platform.OS === 'android') {
      Purchases.configure({
        apiKey: REVENUECAT_GOOGLE_API_KEY,
        appUserID: userId || undefined,
      });
    } else if (Platform.OS === 'ios') {
      // iOS configuration placeholder
      const iosKey = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || REVENUECAT_GOOGLE_API_KEY;
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
    console.log('✅ [RevenueCat] Initialized successfully. Pro status:', isPro);
  } catch (error) {
    console.warn('⚠️ [RevenueCat] Initialization warning:', error);
  }
}

/**
 * Fetches current subscription offerings from RevenueCat.
 */
export async function fetchOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      return offerings.current;
    }
    return null;
  } catch (error) {
    console.warn('⚠️ [RevenueCat] Error fetching offerings:', error);
    return null;
  }
}

export type PurchaseResult =
  | {
      success: true;
      isPro: boolean;
      customerInfo: CustomerInfo;
    }
  | {
      success: false;
      userCancelled: boolean;
      error?: string;
    };

/**
 * Executes a purchase for the selected RevenueCat package (Lifetime, Yearly, or Monthly).
 */
export async function purchasePackage(packageToBuy: PurchasesPackage): Promise<PurchaseResult> {
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

    if (purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return {
        success: false,
        userCancelled: true,
      };
    }

    console.warn('⚠️ [RevenueCat] Purchase failed:', error);
    return {
      success: false,
      userCancelled: false,
      error: purchasesError.message || 'Payment could not be completed. Please try again.',
    };
  }
}

/**
 * Restores previous purchases for the current user.
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  isPro: boolean;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPro = checkProEntitlement(customerInfo);

    useUserStore.getState().setIsPremium(isPro);

    return {
      success: true,
      isPro,
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
 * Logs in a user to RevenueCat upon Firebase authentication.
 */
export async function logInRevenueCat(userId: string): Promise<CustomerInfo | null> {
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
  try {
    const isConfigured = await Purchases.isConfigured();
    if (!isConfigured) return null;

    const isAnonymous = await Purchases.isAnonymous();
    const currentUserId = await Purchases.getAppUserID();

    if (isAnonymous || !currentUserId || currentUserId.startsWith('$RCAnonymousID')) {
      // User is already anonymous, calling Purchases.logOut() is invalid in RevenueCat
      return null;
    }

    const customerInfo = await Purchases.logOut();
    const isPro = checkProEntitlement(customerInfo);
    useUserStore.getState().setIsPremium(isPro);
    return customerInfo;
  } catch (error: any) {
    // Gracefully handle anonymous logout errors without alarming warnings
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
  try {
    await RevenueCatUI.presentCustomerCenter();
  } catch (error) {
    console.warn('⚠️ [RevenueCatUI] Present Customer Center error:', error);
  }
}

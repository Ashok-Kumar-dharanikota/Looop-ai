import { Platform } from 'react-native';
import { useUserStore } from '@/store/use-user-store';

/**
 * Temporarily disabled RevenueCat implementation.
 * All functions return safe fallbacks and grant full access.
 */
export const PRO_ENTITLEMENT_ID = 'Looop AI Pro';
export const FALLBACK_ENTITLEMENT_ID = 'pro';

export const PACKAGE_IDENTIFIERS = {
  LIFETIME: 'lifetime',
  YEARLY: 'yearly',
  MONTHLY: 'monthly',
} as const;

export interface PurchaseResult {
  success: boolean;
  isPro: boolean;
  error?: string;
}

export enum PAYWALL_RESULT {
  NOT_PRESENTED = 'NOT_PRESENTED',
  ERROR = 'ERROR',
  CANCELLED = 'CANCELLED',
  PURCHASED = 'PURCHASED',
  RESTORED = 'RESTORED',
}

/**
 * Checks whether user has active entitlement (defaults to true while RevenueCat is hidden).
 */
export function checkProEntitlement(customerInfo: any): boolean {
  return true;
}

/**
 * Initializes purchases (no-op while RevenueCat is temporarily hidden).
 */
export async function initializePurchases(userId?: string): Promise<void> {
  // Set pro to true so all app capabilities are unlocked
  useUserStore.getState().setIsPremium(true);
}

/**
 * Fetches current offerings (returns null while RevenueCat is hidden).
 */
export async function fetchOfferings(): Promise<any | null> {
  return null;
}

/**
 * Purchase package stub.
 */
export async function purchasePackage(packageToBuy: any): Promise<PurchaseResult> {
  useUserStore.getState().setIsPremium(true);
  return { success: true, isPro: true };
}

/**
 * Restore purchases stub.
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  useUserStore.getState().setIsPremium(true);
  return { success: true, isPro: true };
}

/**
 * Presents native paywall (no-op while RevenueCat is hidden).
 */
export async function presentNativePaywall(
  requiredEntitlement = PRO_ENTITLEMENT_ID
): Promise<PAYWALL_RESULT> {
  return PAYWALL_RESULT.NOT_PRESENTED;
}

/**
 * Presents customer center (no-op while RevenueCat is hidden).
 */
export async function presentCustomerCenterModal(): Promise<void> {
  // no-op
}

/**
 * Sets user ID on login.
 */
export async function identifyPurchasesUser(userId: string): Promise<void> {
  // no-op
}

export async function logInRevenueCat(userId: string): Promise<void> {
  // no-op
}

export async function logOutRevenueCat(): Promise<void> {
  // no-op
}

/**
 * Resets user on logout.
 */
export async function resetPurchasesUser(): Promise<void> {
  // no-op
}

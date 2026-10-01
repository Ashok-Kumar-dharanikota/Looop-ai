import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Crown,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
  X,
  Fingerprint,
  Mic,
  BookOpen,
  Target,
} from 'lucide-react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import {
  fetchOfferings,
  purchasePackage,
  restorePurchases,
  PACKAGE_IDENTIFIERS,
} from '@/services/purchases';
import { useUserStore } from '@/store/use-user-store';

type PlanTier = 'weekly' | 'monthly' | 'yearly';

export default function PaywallScreen() {
  const router = useRouter();
  const isPremium = useUserStore((state) => state.isPremium);

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('yearly');
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [packages, setPackages] = useState<{
    weekly?: PurchasesPackage;
    monthly?: PurchasesPackage;
    yearly?: PurchasesPackage;
  }>({});
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // If already premium, redirect to dashboard
  useEffect(() => {
    if (isPremium) {
      router.replace('/(tabs)' as any);
    }
  }, [isPremium, router]);

  // Load RevenueCat offerings
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const currentOffering = await fetchOfferings();
        if (currentOffering && isMounted) {
          const pkgs = currentOffering.availablePackages;
          const found: {
            weekly?: PurchasesPackage;
            monthly?: PurchasesPackage;
            yearly?: PurchasesPackage;
          } = {};

          for (const pkg of pkgs) {
            const id = pkg.identifier.toLowerCase();
            const pkgType = pkg.packageType;

            if (pkgType === 'ANNUAL' || id === PACKAGE_IDENTIFIERS.YEARLY || id.includes('year') || id.includes('annual')) {
              found.yearly = pkg;
            } else if (pkgType === 'MONTHLY' || id === PACKAGE_IDENTIFIERS.MONTHLY || id.includes('month')) {
              found.monthly = pkg;
            } else if (pkgType === 'WEEKLY' || id === PACKAGE_IDENTIFIERS.WEEKLY || id.includes('week')) {
              found.weekly = pkg;
            }
          }
          // If packages exist but didn't match the specific identifiers (e.g. custom product IDs in RevenueCat Test Store)
          if (!found.yearly && !found.monthly && !found.weekly && pkgs.length > 0) {
            found.yearly = pkgs[0];
            if (pkgs[1]) found.monthly = pkgs[1];
            if (pkgs[2]) found.weekly = pkgs[2];
          }

          setPackages(found);
        }
      } catch (err) {
        console.warn('Failed to load offerings:', err);
      } finally {
        if (isMounted) setIsLoadingOfferings(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = () => {
    Haptics.selectionAsync();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const packageToBuy = packages[selectedPlan];
    if (!packageToBuy) {
      if (__DEV__) {
        Alert.alert(
          'Dev / Preview Test Mode',
          'RevenueCat package not found for this tier. Would you like to activate Pro for testing?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Activate Pro',
              onPress: () => {
                useUserStore.getState().setIsPremium(true);
                Alert.alert('Pro Activated (Dev)', 'Looop Pro features are now unlocked for testing.');
                router.replace('/(tabs)' as any);
              },
            },
          ]
        );
        return;
      }
      Alert.alert(
        'Product Initializing',
        'Your subscription products are currently syncing. Please try again in a few moments.'
      );
      return;
    }

    setIsPurchasing(true);
    try {
      const result = await purchasePackage(packageToBuy);
      if (result.success && result.isPro) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Welcome to Looop Pro! 🎉', 'Your membership is now active.');
        router.replace('/(tabs)' as any);
      } else if (result.userCancelled) {
        // User backed out of Google Play billing sheet
      } else if (result.error) {
        Alert.alert('Purchase Failed', result.error);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Unable to complete purchase.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.success && result.isPro) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Purchases Restored', '🎉 Your Looop Pro subscription is active.');
        router.replace('/(tabs)' as any);
      } else {
        Alert.alert('No Subscription Found', 'No active Pro subscription found for this Google Play account.');
      }
    } catch (err: any) {
      Alert.alert('Restore Failed', err?.message || 'Unable to restore purchases.');
    } finally {
      setIsRestoring(false);
    }
  };

  const yearlyPriceText = packages.yearly?.product.priceString || '$39.99';
  const monthlyPriceText = packages.monthly?.product.priceString || '$7.99';
  const weeklyPriceText = packages.weekly?.product.priceString || '$2.99';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.proBadge}>
          <Crown size={14} color="#7C3AED" />
          <Text style={styles.proBadgeText}>LOOOP PRO</Text>
        </View>

        <TouchableOpacity onPress={handleDismiss} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Animated.View entering={FadeInUp.duration(300)} style={styles.titleSection}>
          <Text style={styles.mainTitle}>Master Your Money Flow</Text>
          <Text style={styles.subTitle}>
            Local-first privacy, instant voice logging, biometric app lock, and AI weekly behavioral stories.
          </Text>
        </Animated.View>

        {/* Feature Highlights */}
        <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.featuresCard}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Fingerprint size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>Biometric App Lock</Text>
              <Text style={styles.featureItemSub}>Fingerprint & Face ID lock for absolute financial privacy.</Text>
            </View>
          </View>

          <View style={styles.featureDivider} />

          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Mic size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>Instant Voice Logging</Text>
              <Text style={styles.featureItemSub}>Speak naturally in 1 second—smart AI auto-extracts amount and category.</Text>
            </View>
          </View>

          <View style={styles.featureDivider} />

          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <BookOpen size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>Weekly Editorial AI Digest</Text>
              <Text style={styles.featureItemSub}>Personalized essays diagnosing unconscious micro-leaks & habit challenges.</Text>
            </View>
          </View>

          <View style={styles.featureDivider} />

          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Target size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>Milestone Vaults & Live Pacing</Text>
              <Text style={styles.featureItemSub}>Interactive area charts and daily safe-to-spend tracking.</Text>
            </View>
          </View>
        </Animated.View>

        {/* Plans Selector */}
        <Animated.View entering={FadeInUp.delay(200).duration(300)} style={styles.plansSection}>
          {/* Yearly Plan (Featured) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedPlan('yearly');
            }}
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
          >
            <View style={styles.savingsTag}>
              <Sparkles size={10} color="#FFFFFF" />
              <Text style={styles.savingsTagText}>SAVE 70% • BEST VALUE</Text>
            </View>

            <View style={styles.planRow}>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'yearly' && styles.radioCircleSelected,
                ]}
              >
                {selectedPlan === 'yearly' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>Annual Membership</Text>
                <Text style={styles.planBillingSub}>7 days free trial, then {yearlyPriceText}/yr</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPriceText}>{yearlyPriceText}</Text>
                <Text style={styles.planPeriodText}>/year</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedPlan('monthly');
            }}
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
          >
            <View style={styles.planRow}>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'monthly' && styles.radioCircleSelected,
                ]}
              >
                {selectedPlan === 'monthly' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>Monthly Membership</Text>
                <Text style={styles.planBillingSub}>Flexible monthly billing</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPriceText}>{monthlyPriceText}</Text>
                <Text style={styles.planPeriodText}>/month</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Weekly Plan */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedPlan('weekly');
            }}
            style={[styles.planCard, selectedPlan === 'weekly' && styles.planCardSelected]}
          >
            <View style={styles.planRow}>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'weekly' && styles.radioCircleSelected,
                ]}
              >
                {selectedPlan === 'weekly' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>Weekly Membership</Text>
                <Text style={styles.planBillingSub}>Pay as you go • Cancel anytime</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPriceText}>{weeklyPriceText}</Text>
                <Text style={styles.planPeriodText}>/week</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Primary CTA */}
        <Animated.View entering={FadeInUp.delay(300).duration(300)} style={styles.ctaSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubscribe}
            disabled={isPurchasing}
            style={[styles.primaryBtn, isPurchasing && { opacity: 0.8 }]}
          >
            {isPurchasing ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <ArrowRight size={18} color="#FFFFFF" />
            )}
            <Text style={styles.primaryBtnText}>
              {isPurchasing
                ? 'Connecting to Google Play...'
                : selectedPlan === 'yearly'
                  ? 'Start 7-Day Free Trial'
                  : selectedPlan === 'monthly'
                    ? `Subscribe for ${monthlyPriceText}/mo`
                    : `Subscribe for ${weeklyPriceText}/wk`}
            </Text>
          </TouchableOpacity>

          {/* Restore Purchases */}
          <TouchableOpacity
            onPress={handleRestore}
            disabled={isRestoring}
            style={styles.restoreBtn}
            activeOpacity={0.7}
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color="#7C3AED" style={{ marginRight: 6 }} />
            ) : (
              <RotateCcw size={14} color="#7C3AED" style={{ marginRight: 6 }} />
            )}
            <Text style={styles.restoreBtnText}>
              {isRestoring ? 'Restoring Purchases...' : 'Restore Purchases'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDismiss} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip for now</Text>
          </TouchableOpacity>

          <Text style={styles.guaranteeText}>
            Recurring billing. Cancel anytime in Google Play Store &gt; Subscriptions.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 8,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    gap: 16,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 310,
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  featureItemSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  featureDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  plansSection: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  savingsTag: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savingsTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  planName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  planBillingSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  planPriceText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  planPeriodText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  ctaSection: {
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  primaryBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  restoreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  skipBtn: {
    paddingVertical: 4,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
  },
});



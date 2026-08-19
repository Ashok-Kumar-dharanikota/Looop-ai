import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  X,
  Sparkles,
  Check,
  Crown,
  Shield,
  Mic,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Infinity as InfinityIcon,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { PurchasesPackage } from 'react-native-purchases';

import { useUserStore, useAppStore } from '@/store';
import {
  fetchOfferings,
  purchasePackage,
  restorePurchases,
  PACKAGE_IDENTIFIERS,
} from '@/services/purchases';

type PlanTier = 'lifetime' | 'yearly' | 'monthly';

export default function PaywallScreen() {
  const router = useRouter();
  const setIsPremium = useUserStore((state) => state.setIsPremium);
  const currencySymbol = useAppStore((state) => state.currencySymbol) || '₹';

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('yearly');
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // RevenueCat dynamic packages
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [lifetimePackage, setLifetimePackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOfferings() {
      setIsLoadingPackages(true);
      try {
        const currentOffering = await fetchOfferings();
        if (isMounted && currentOffering) {
          const available = currentOffering.availablePackages;

          const yearly =
            available.find(
              (p) =>
                p.identifier === PACKAGE_IDENTIFIERS.YEARLY ||
                p.packageType === 'ANNUAL' ||
                p.product.identifier.toLowerCase().includes('annual') ||
                p.product.identifier.toLowerCase().includes('yearly')
            ) || currentOffering.annual;

          const monthly =
            available.find(
              (p) =>
                p.identifier === PACKAGE_IDENTIFIERS.MONTHLY ||
                p.packageType === 'MONTHLY' ||
                p.product.identifier.toLowerCase().includes('month')
            ) || currentOffering.monthly;

          const lifetime =
            available.find(
              (p) =>
                p.identifier === PACKAGE_IDENTIFIERS.LIFETIME ||
                p.packageType === 'LIFETIME' ||
                p.product.identifier.toLowerCase().includes('lifetime')
            ) || currentOffering.lifetime;

          if (yearly) setYearlyPackage(yearly);
          if (monthly) setMonthlyPackage(monthly);
          if (lifetime) setLifetimePackage(lifetime);
        }
      } catch (err) {
        console.warn('Failed to load offerings:', err);
      } finally {
        if (isMounted) setIsLoadingPackages(false);
      }
    }

    loadOfferings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = () => {
    Haptics.selectionAsync();
    router.replace('/(tabs)' as any);
  };

  const handleSubscribe = async () => {
    setIsPurchasing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // 1. Select the matching RevenueCat package
      let targetPackage: PurchasesPackage | null = null;
      if (selectedPlan === 'yearly') targetPackage = yearlyPackage;
      else if (selectedPlan === 'monthly') targetPackage = monthlyPackage;
      else if (selectedPlan === 'lifetime') targetPackage = lifetimePackage;

      if (targetPackage) {
        // Real Google Play Purchase flow via RevenueCat
        const result = await purchasePackage(targetPackage);
        if (result.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setIsPremium(true);
          router.replace('/(tabs)' as any);
        } else if (!result.userCancelled && result.error) {
          Alert.alert('Purchase Failed', result.error);
        }
      } else {
        // Fallback for development/testing mode
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsPremium(true);
        router.replace('/(tabs)' as any);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'An unexpected error occurred.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const res = await restorePurchases();
      if (res.success && res.isPro) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Purchases Restored', '🎉 Your Looop Pro subscription is active!', [
          { text: 'Continue', onPress: () => router.replace('/(tabs)' as any) },
        ]);
      } else {
        Alert.alert(
          'No Active Subscription',
          'We could not find any active Looop Pro subscription linked to this Google Play account.'
        );
      }
    } catch (err: any) {
      Alert.alert('Restore Failed', err?.message || 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  // Price formatting
  const yearlyPriceText = yearlyPackage?.product.priceString || `${currencySymbol}1,999`;
  const monthlyPriceText = monthlyPackage?.product.priceString || `${currencySymbol}299`;
  const lifetimePriceText = lifetimePackage?.product.priceString || `${currencySymbol}4,999`;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.proBadge}>
          <Crown size={14} color="#7C3AED" />
          <Text style={styles.proBadgeText}>LOOOP PRO</Text>
        </View>

        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeBtn}
          activeOpacity={0.7}
        >
          <X size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Title & Subtitle */}
        <Animated.View entering={FadeInUp.duration(300)} style={styles.titleSection}>
          <Text style={styles.mainTitle}>Unlock Your Full Wealth Potential</Text>
          <Text style={styles.subTitle}>
            Automate your savings, diagnose spending habits, and fund your milestones effortlessly.
          </Text>
        </Animated.View>

        {/* 3 Core Pro Features */}
        <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.featuresCard}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Shield size={16} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>Biometric Fingerprint Lock</Text>
              <Text style={styles.featureItemSub}>Keep your numbers completely confidential</Text>
            </View>
          </View>

          <View style={styles.featureDivider} />

          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Mic size={16} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>Unlimited 1-Sec Voice Logging</Text>
              <Text style={styles.featureItemSub}>Natural speech parsing and instant categorization</Text>
            </View>
          </View>

          <View style={styles.featureDivider} />

          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <BookOpen size={16} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>Weekly Financial Insights</Text>
              <Text style={styles.featureItemSub}>Personalized diagnoses & savings habit challenges</Text>
            </View>
          </View>
        </Animated.View>

        {/* Subscription Plan Tiers */}
        <Animated.View entering={FadeInUp.delay(200).duration(300)} style={styles.plansSection}>
          {/* Yearly Plan (Recommended) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedPlan('yearly');
            }}
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.planCardSelected,
            ]}
          >
            <View style={styles.savingsTag}>
              <Sparkles size={10} color="#FFFFFF" />
              <Text style={styles.savingsTagText}>SAVE 50% • POPULAR</Text>
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
                <Text style={styles.planName}>Yearly Pro</Text>
                <Text style={styles.planBillingSub}>7 days free trial, then {yearlyPriceText}/year</Text>
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
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
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
                <Text style={styles.planName}>Monthly Pro</Text>
                <Text style={styles.planBillingSub}>Flexible monthly billing, cancel anytime</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPriceText}>{monthlyPriceText}</Text>
                <Text style={styles.planPeriodText}>/month</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Lifetime Access */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedPlan('lifetime');
            }}
            style={[
              styles.planCard,
              selectedPlan === 'lifetime' && styles.planCardSelected,
            ]}
          >
            <View style={[styles.savingsTag, { backgroundColor: '#059669' }]}>
              <InfinityIcon size={10} color="#FFFFFF" />
              <Text style={styles.savingsTagText}>ONE-TIME PAYMENT</Text>
            </View>

            <View style={styles.planRow}>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'lifetime' && styles.radioCircleSelected,
                ]}
              >
                {selectedPlan === 'lifetime' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>Lifetime Access</Text>
                <Text style={styles.planBillingSub}>Pay once, own Looop Pro forever</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPriceText}>{lifetimePriceText}</Text>
                <Text style={styles.planPeriodText}>forever</Text>
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
                ? 'Processing with Google Play...'
                : selectedPlan === 'yearly'
                ? 'Start 7-Day Free Trial'
                : selectedPlan === 'lifetime'
                ? `Get Lifetime for ${lifetimePriceText}`
                : `Subscribe for ${monthlyPriceText}/month`}
            </Text>
          </TouchableOpacity>

          {/* Restore Purchases Button */}
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
            No commitment. Cancel anytime in Google Play Store subscriptions.
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
    maxWidth: 300,
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
    backgroundColor: '#FDFCFF',
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

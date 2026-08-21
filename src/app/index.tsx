import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import {
  ArrowRight,
  Sparkles,
  Mic,
  Utensils,
  TrendingUp,
  Target,
  BookOpen,
  CheckCircle2,
  Zap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/hooks/use-auth';
import { useUserStore, useAppStore } from '@/store';

export default function AuthScreen() {
  const router = useRouter();
  const {
    user: fbUser,
    isLoading: isFbLoading,
    isAuthenticated: isFbAuth,
    signInWithGoogle,
    isSigningIn,
  } = useAuth();
  const { user: storeUser, isAuthenticated: isStoreAuth, isGuest } = useUserStore();
  const { hasCompletedOnboarding } = useAppStore();

  // Active feature slide in showcase card
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Declarative redirect for active/authenticated users
  const isUserActive =
    !isFbLoading && ((isFbAuth && !!fbUser) || (isStoreAuth && (!!storeUser || isGuest)));

  const navigateNext = useCallback(() => {
    if (useAppStore.getState().hasCompletedOnboarding) {
      router.replace('/(tabs)' as any);
    } else {
      router.replace('/onboarding' as any);
    }
  }, [router]);

  // Animated scale for buttons
  const googleScale = useSharedValue(1);
  const guestScale = useSharedValue(1);

  const googleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: googleScale.value }],
  }));

  const guestAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: guestScale.value }],
  }));

  if (isUserActive) {
    return (
      <Redirect href={hasCompletedOnboarding ? ('/(tabs)' as any) : ('/onboarding' as any)} />
    );
  }

  const handleGuestContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useUserStore.getState().setGuest('Guest Explorer');
    navigateNext();
  };

  const handleGoogleSignIn = async () => {
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
      Alert.alert('Sign-In Error', err?.message || 'Unable to connect Google account. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Brand Header */}
        <Animated.View entering={FadeInDown.duration(280)} style={styles.headerContainer}>
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>Looop</Text>
            <View style={styles.sparkleBadge}>
              <Sparkles size={14} color="#7C3AED" />
            </View>
          </View>

          <Text style={styles.mainHeading}>
            Mindful spending.{'\n'}Effortless clarity.
          </Text>

          <Text style={styles.subHeading}>
            A personal finance companion that transforms your daily cashflow into lasting wealth and mindful habits.
          </Text>
        </Animated.View>

        {/* Pure Native Feature Showcase Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.showcaseSection}>
          <View style={styles.showcaseCard}>
            {/* Feature 0: Voice Logging */}
            {activeFeatureIndex === 0 && (
              <Animated.View
                key="feature_voice"
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(180)}
                style={styles.slideWrapper}
              >
                <View style={styles.slideHeaderPill}>
                  <Mic size={12} color="#7C3AED" />
                  <Text style={styles.slideHeaderPillText}>VOICE EXPENSE LOGGING</Text>
                </View>

                <View style={styles.voicePromptCard}>
                  <View style={styles.voicePulseRing}>
                    <Mic size={14} color="#FFFFFF" />
                  </View>
                  <Text style={styles.voicePromptText}>
                    &quot;Paid ₹450 for lunch at Theobroma&quot;
                  </Text>
                </View>

                <View style={styles.receiptMiniPreview}>
                  <View style={styles.receiptMiniLeft}>
                    <View style={[styles.receiptIconBadge, { backgroundColor: '#FEE2E2' }]}>
                      <Utensils size={15} color="#EF4444" />
                    </View>
                    <View>
                      <Text style={styles.receiptStoreName}>Theobroma Cafe</Text>
                      <Text style={styles.receiptSubtext}>Food &amp; Dining • Just now</Text>
                    </View>
                  </View>
                  <View style={styles.receiptAmountBox}>
                    <Text style={styles.receiptAmountHero}>₹450</Text>
                    <Text style={styles.receiptVerifiedBadge}>AUTO-PARSED</Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Feature 1: Safe Daily Spend */}
            {activeFeatureIndex === 1 && (
              <Animated.View
                key="feature_budget"
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(180)}
                style={styles.slideWrapper}
              >
                <View style={[styles.slideHeaderPill, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                  <TrendingUp size={12} color="#059669" />
                  <Text style={[styles.slideHeaderPillText, { color: '#059669' }]}>DAILY SAFE SPEND</Text>
                </View>

                <View style={styles.budgetHeroCard}>
                  <View style={styles.budgetTopRow}>
                    <Text style={styles.budgetLabel}>SAFE TO SPEND TODAY</Text>
                    <View style={styles.budgetStatusPill}>
                      <Text style={styles.budgetStatusText}>ON TRACK</Text>
                    </View>
                  </View>
                  <Text style={styles.budgetHeroVal}>
                    ₹1,450 <Text style={styles.budgetHeroPeriod}>/ day</Text>
                  </Text>
                  <View style={styles.budgetProgressTrack}>
                    <View style={[styles.budgetProgressFill, { width: '64%' }]} />
                  </View>
                  <Text style={styles.budgetRemainingText}>₹28,400 remaining of ₹45,000 monthly budget</Text>
                </View>
              </Animated.View>
            )}

            {/* Feature 2: Milestone Vaults */}
            {activeFeatureIndex === 2 && (
              <Animated.View
                key="feature_vaults"
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(180)}
                style={styles.slideWrapper}
              >
                <View style={[styles.slideHeaderPill, { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF' }]}>
                  <Target size={12} color="#7C3AED" />
                  <Text style={[styles.slideHeaderPillText, { color: '#7C3AED' }]}>SAVINGS VAULTS</Text>
                </View>

                <View style={styles.vaultCardInner}>
                  <View style={styles.vaultTopRow}>
                    <View style={[styles.receiptIconBadge, { backgroundColor: '#EDE9FE' }]}>
                      <Sparkles size={15} color="#7C3AED" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.receiptStoreName}>Emergency Fund</Text>
                      <Text style={styles.receiptSubtext}>Target: ₹2,50,000 by Dec 2026</Text>
                    </View>
                    <Text style={styles.vaultPercentText}>72%</Text>
                  </View>

                  <View style={styles.budgetProgressTrack}>
                    <View style={[styles.budgetProgressFill, { width: '72%', backgroundColor: '#7C3AED' }]} />
                  </View>

                  <View style={styles.vaultTaskRow}>
                    <CheckCircle2 size={14} color="#059669" />
                    <Text style={styles.vaultTaskText}>₹5,000 automated weekly deposit saved</Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Feature 3: Behavioral Financial Stories */}
            {activeFeatureIndex === 3 && (
              <Animated.View
                key="feature_stories"
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(180)}
                style={styles.slideWrapper}
              >
                <View style={[styles.slideHeaderPill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                  <BookOpen size={12} color="#D97706" />
                  <Text style={[styles.slideHeaderPillText, { color: '#D97706' }]}>FINANCIAL STORIES</Text>
                </View>

                <View style={styles.storyCardInner}>
                  <View style={styles.storyMetaRow}>
                    <Text style={styles.storyMetaTag}>BEHAVIORAL ESSAY</Text>
                    <Text style={styles.storyMetaRead}>2 MIN READ</Text>
                  </View>
                  <Text style={styles.storyTitle}>The 4 PM Coffee &amp; Snack Leak</Text>
                  <Text style={styles.storyBody} numberOfLines={2}>
                    How small afternoon habit expenses compound into ₹8,400 monthly leaks.
                  </Text>
                  <View style={styles.storyHabitBadge}>
                    <Zap size={11} color="#D97706" />
                    <Text style={styles.storyHabitText}>Habit challenge: 3-day brew streak</Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Interactive Feature Select Tabs with Accessible Touch Targets */}
          <View style={styles.featureTabsRow}>
            {[
              { label: 'Voice Log', icon: Mic },
              { label: 'Safe Spend', icon: TrendingUp },
              { label: 'Vaults', icon: Target },
              { label: 'Stories', icon: BookOpen },
            ].map((tab, idx) => {
              const isTabActive = activeFeatureIndex === idx;
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.label}
                  activeOpacity={0.75}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveFeatureIndex(idx);
                  }}
                  style={[
                    styles.featureTabChip,
                    isTabActive && styles.featureTabChipActive,
                  ]}
                  accessibilityRole="tab"
                  accessibilityLabel={`Preview ${tab.label} feature`}
                  accessibilityState={{ selected: isTabActive }}
                >
                  <IconComponent
                    size={12}
                    color={isTabActive ? '#7C3AED' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.featureTabChipText,
                      isTabActive && styles.featureTabChipTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Bottom Actions Section */}
        <Animated.View entering={FadeInUp.delay(200).duration(300)} style={styles.bottomSection}>
          {/* Primary Action: Google Sign-In */}
          <Animated.View style={googleAnimatedStyle}>
            <Pressable
              onPressIn={() => !isSigningIn && (googleScale.value = withSpring(0.97))}
              onPressOut={() => !isSigningIn && (googleScale.value = withSpring(1))}
              onPress={handleGoogleSignIn}
              disabled={isSigningIn}
              style={[
                styles.primaryButton,
                isSigningIn && styles.primaryButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
            >
              {isSigningIn ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
              ) : (
                <View style={styles.googleGContainer}>
                  <Text style={styles.googleG}>G</Text>
                </View>
              )}
              <Text style={styles.primaryButtonText}>
                {isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary Action: Explore as Guest */}
          <Animated.View style={guestAnimatedStyle}>
            <Pressable
              onPressIn={() => (guestScale.value = withSpring(0.97))}
              onPressOut={() => (guestScale.value = withSpring(1))}
              onPress={handleGuestContinue}
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Explore as Guest"
            >
              <Text style={styles.secondaryButtonText}>Explore as Guest</Text>
              <ArrowRight size={16} color="#0F172A" style={{ marginLeft: 6 }} />
            </Pressable>
          </Animated.View>

          {/* Legal Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/terms-of-use' as any)}
                accessibilityRole="link"
                accessibilityLabel="Terms of Use"
              >
                Terms of Use
              </Text>{' '}
              and{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/privacy-policy' as any)}
                accessibilityRole="link"
                accessibilityLabel="Privacy Policy"
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
  },
  headerContainer: {
    marginTop: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoText: {
    fontSize: 34,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  sparkleBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mainHeading: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -0.8,
    color: '#0F172A',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    color: '#475569',
    maxWidth: 320,
  },
  showcaseSection: {
    marginVertical: 18,
    width: '100%',
  },
  showcaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    minHeight: 172,
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  slideWrapper: {
    width: '100%',
  },
  slideHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 12,
  },
  slideHeaderPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.6,
  },
  voicePromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  voicePulseRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#9333EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  voicePromptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  receiptMiniPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptMiniLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  receiptIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptStoreName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  receiptSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  receiptAmountBox: {
    alignItems: 'flex-end',
  },
  receiptAmountHero: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptVerifiedBadge: {
    fontSize: 8,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  budgetHeroCard: {
    backgroundColor: '#FAFAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  budgetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  budgetStatusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  budgetStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  budgetHeroVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 4,
  },
  budgetHeroPeriod: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  budgetProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginVertical: 6,
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  budgetRemainingText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  vaultCardInner: {
    backgroundColor: '#FAFAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vaultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vaultPercentText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7C3AED',
  },
  vaultTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  vaultTaskText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  storyCardInner: {
    backgroundColor: '#FAFAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  storyMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  storyMetaTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.6,
  },
  storyMetaRead: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  storyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  storyBody: {
    fontSize: 11,
    lineHeight: 16,
    color: '#475569',
    marginBottom: 6,
  },
  storyHabitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  storyHabitText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  featureTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    justifyContent: 'center',
    width: '100%',
  },
  featureTabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureTabChipActive: {
    backgroundColor: '#FAF5FF',
    borderColor: '#9333EA',
  },
  featureTabChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  featureTabChipTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  bottomSection: {
    width: '100%',
    paddingTop: 8,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.75,
  },
  googleGContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleG: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginHorizontal: 14,
  },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 4,
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#64748B',
    textAlign: 'center',
  },
  legalLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: '#0F172A',
  },
});

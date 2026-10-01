import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRouter, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { ThemeColors } from '@/constants/theme';
import { AmbientGlow } from './AmbientGlow';
import { EmailAuthCard } from './EmailAuthCard';
import { GuestLoginCard } from './GuestLoginCard';
import { LegalFooter } from './LegalFooter';
import { useAuthFlow } from '../hooks/useAuthFlow';

export function AuthenticationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    isUserActive,
    hasCompletedOnboarding,
    isSigningIn,
    guestName,
    onGuestNameChange,
    isGuestInputFocused,
    setIsGuestInputFocused,
    guestInputError,
    handleGuestContinue,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    handleAuthSuccess,
  } = useAuthFlow();

  if (isUserActive) {
    return (
      <Redirect
        href={hasCompletedOnboarding ? ('/(tabs)' as any) : ('/onboarding' as any)}
      />
    );
  }

  const handleBack = () => {
    Haptics.selectionAsync();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <AmbientGlow />

      <KeyboardAwareScrollView
        style={styles.keyboardContainer}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={48}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Top Navigation Row */}
        <Animated.View entering={FadeInDown.duration(280)} style={styles.topNavRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={18} color={ThemeColors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>Looop</Text>
            <View style={styles.sparkleBadge}>
              <Sparkles size={12} color={ThemeColors.primary} />
            </View>
          </View>

          {/* Spacer to balance back button */}
          <View style={styles.backBtnPlaceholder} />
        </Animated.View>

        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(80).duration(280)} style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            {t('auth.authScreenTitle', 'Get Started')}
          </Text>
          <Text style={styles.subTitle}>
            {t('auth.authScreenSub', 'Sign in with your email to sync data, or explore as a guest.')}
          </Text>
        </Animated.View>

        {/* Authentication Options Container */}
        <Animated.View entering={FadeInUp.delay(160).duration(300)} style={styles.authContainer}>
          {/* Primary Action: Email & Password Sign In / Sign Up */}
          <EmailAuthCard
            signInWithEmail={signInWithEmail}
            signUpWithEmail={signUpWithEmail}
            resetPassword={resetPassword}
            onSuccess={handleAuthSuccess}
            isSigningIn={isSigningIn}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              {t('auth.guestDivider', 'OR EXPLORE AS GUEST')}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary Action: Guest Input & Gradient Action Button */}
          <GuestLoginCard
            guestName={guestName}
            onChangeGuestName={onGuestNameChange}
            onSubmit={handleGuestContinue}
            isFocused={isGuestInputFocused}
            onFocus={() => setIsGuestInputFocused(true)}
            onBlur={() => setIsGuestInputFocused(false)}
            hasError={guestInputError}
          />

          {/* Legal Footer */}
          <LegalFooter />
        </Animated.View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.canvas,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ThemeColors.card,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: 38,
    height: 38,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.5,
  },
  sparkleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ThemeColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginVertical: 12,
  },
  mainTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 26,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 19,
  },
  authContainer: {
    width: '100%',
    paddingBottom: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: ThemeColors.border,
  },
  dividerText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: ThemeColors.textMuted,
    letterSpacing: 1,
  },
});

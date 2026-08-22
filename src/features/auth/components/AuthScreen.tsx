import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AmbientGlow } from './AmbientGlow';
import { BrandHeader } from './BrandHeader';
import { GoogleSignInButton } from './GoogleSignInButton';
import { GuestLoginCard } from './GuestLoginCard';
import { LegalFooter } from './LegalFooter';
import { VoiceShowcaseCard } from './showcase/VoiceShowcaseCard';
import { useAuthFlow } from '../hooks/useAuthFlow';

export function AuthScreen() {
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
    handleGoogleSignIn,
  } = useAuthFlow();

  if (isUserActive) {
    return (
      <Redirect
        href={hasCompletedOnboarding ? ('/(tabs)' as any) : ('/onboarding' as any)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Soft Warm Ambient Radial Glow */}
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
        {/* Top Brand Header */}
        <BrandHeader />

        {/* Voice Logging Motion Design Stage (Frameless) */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          style={styles.showcaseSection}
        >
          <VoiceShowcaseCard isParentActive={true} />
        </Animated.View>

        {/* Bottom Actions Section */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(300)}
          style={styles.bottomSection}
        >
          {/* Primary Action: Google Sign-In */}
          <GoogleSignInButton
            onPress={handleGoogleSignIn}
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
    backgroundColor: '#FAF9F6',
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
  showcaseSection: {
    marginVertical: 10,
    width: '100%',
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 1,
  },
});

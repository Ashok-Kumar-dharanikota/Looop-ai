import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRouter, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { ThemeColors } from '@/constants/theme';
import { AmbientGlow } from './AmbientGlow';
import { BrandHeader } from './BrandHeader';
import { LegalFooter } from './LegalFooter';
import { VoiceShowcaseCard } from './showcase/VoiceShowcaseCard';
import { useAuthFlow } from '../hooks/useAuthFlow';

export function AuthScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isUserActive, hasCompletedOnboarding } = useAuthFlow();

  if (isUserActive) {
    return (
      <Redirect
        href={hasCompletedOnboarding ? ('/(tabs)' as any) : ('/onboarding' as any)}
      />
    );
  }

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/auth' as any);
  };

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
          {/* Primary Action: Continue Button to Dedicated Auth Screen */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleContinue}
            style={styles.continueBtnContainer}
            accessibilityRole="button"
            accessibilityLabel="Continue to sign in or get started"
          >
            <LinearGradient
              colors={[ThemeColors.primary, ThemeColors.primaryHover]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnText}>
                {t('common.continue', 'Continue')}
              </Text>
              <ArrowRight size={19} color={ThemeColors.textInverse} strokeWidth={2.4} />
            </LinearGradient>
          </TouchableOpacity>

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
  showcaseSection: {
    marginVertical: 10,
    width: '100%',
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 10,
    gap: 16,
  },
  continueBtnContainer: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  continueBtn: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  continueBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: ThemeColors.textInverse,
    letterSpacing: 0.2,
  },
});

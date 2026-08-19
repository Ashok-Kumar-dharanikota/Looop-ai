import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppStore, getDefaultLocaleCurrency } from '@/store';
import { useUserSettings } from '@/hooks/use-database';
import { generateAndSaveAIReport } from '@/services/ai-reports';
import { StoryAct1Rohan } from '@/components/onboarding/StoryAct1Rohan';
import {
  StoryAct2Questionnaire,
  UserAssessmentData,
} from '@/components/onboarding/StoryAct2Questionnaire';
import { StoryAct3Diagnosis } from '@/components/onboarding/StoryAct3Diagnosis';
import { StoryAct4FirstHabit } from '@/components/onboarding/StoryAct4FirstHabit';
import { StoryAct5Notifications } from '@/components/onboarding/StoryAct5Notifications';

type OnboardingAct =
  | 'act1_rohan'
  | 'act2_assessment'
  | 'act3_diagnosis'
  | 'act4_habit'
  | 'act5_notifications';

export default function OnboardingScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = Colors[isDark ? 'dark' : 'light'];

  const { currencySymbol, currency, setCurrency, setHasCompletedOnboarding } = useAppStore();
  const { saveSettings } = useUserSettings();

  const [currentAct, setCurrentAct] = useState<OnboardingAct>('act1_rohan');
  const [assessmentData, setAssessmentData] = useState<UserAssessmentData>({
    leakCategory: 'food_delivery',
    leakCategoryName: 'Late-Night Food Delivery & Orders',
    leakEstimatedCost: 4200,
    frustration: 'zero_savings',
    primaryGoal: 'emergency_buffer',
    monthlyIncome: '75000',
    monthlySavingsTarget: '20000',
    mustPayments: [],
    totalMustPayments: 0,
  });

  const handleFinishStory = () => {
    setCurrentAct('act2_assessment');
  };

  const handleCompleteAssessment = (data: UserAssessmentData) => {
    setAssessmentData(data);
    setCurrentAct('act3_diagnosis');
  };

  const handleProceedToHabit = () => {
    setCurrentAct('act4_habit');
  };

  const handleProceedToNotifications = () => {
    setCurrentAct('act5_notifications');
  };

  const handleFinishAllOnboarding = async () => {
    try {
      const defaultLocale = getDefaultLocaleCurrency();

      // 1. Persist to App Store
      setHasCompletedOnboarding(true);

      // 2. Persist chosen values directly to SQLite user_settings
      const settingsPayload: Record<string, string> = {
        currency: currencySymbol || defaultLocale.symbol,
        currencyCode: currency || defaultLocale.code,
        monthlyIncome: assessmentData.monthlyIncome.replace(/[^0-9.]/g, '') || '75000',
        monthlySavingsTarget: assessmentData.monthlySavingsTarget.replace(/[^0-9.]/g, '') || '20000',
        primaryLeakCategory: assessmentData.leakCategory,
        primaryGoal: assessmentData.primaryGoal,
        mustPayments: JSON.stringify(assessmentData.mustPayments || []),
        totalMustPayments: String(assessmentData.totalMustPayments || 0),
      };

      await saveSettings(settingsPayload);

      // 3. Generate initial welcome AI story & starter challenges in background
      generateAndSaveAIReport({
        periodType: 'weekly',
        isInitialOnboarding: true,
        onboardingData: assessmentData,
      }).catch((reportErr) => {
        console.warn('Initial onboarding report generation notice:', reportErr);
      });

      router.push('/paywall');
    } catch (err) {
      console.warn('Failed to complete onboarding:', err);
      router.push('/paywall');
    }
  };


  const handleSkipToAssessment = () => {
    if (currentAct === 'act1_rohan') {
      setCurrentAct('act2_assessment');
    } else {
      handleFinishAllOnboarding();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FAF9F6' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.actBadge}>
          <Text style={styles.actBadgeText}>
            {currentAct === 'act1_rohan'
              ? 'STORY • ROHAN’S JOURNEY'
              : currentAct === 'act2_assessment'
              ? 'CALIBRATION • 6 QUESTIONS'
              : currentAct === 'act3_diagnosis'
              ? 'AI FINANCIAL DIAGNOSIS'
              : currentAct === 'act4_habit'
              ? 'FIRST HABIT CHALLENGE'
              : 'SMART CHECK-IN ALERTS'}
          </Text>
        </View>

        {currentAct === 'act1_rohan' && (
          <TouchableOpacity onPress={handleSkipToAssessment} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip Story</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Act Switcher */}
      <View style={styles.stage}>
        {currentAct === 'act1_rohan' && (
          <Animated.View
            key="act1"
            entering={FadeInRight.duration(280)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.actWrapper}
          >
            <StoryAct1Rohan
              currencySymbol={currencySymbol}
              onFinishStory={handleFinishStory}
            />
          </Animated.View>
        )}

        {currentAct === 'act2_assessment' && (
          <Animated.View
            key="act2"
            entering={FadeInRight.duration(280)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.actWrapper}
          >
            <StoryAct2Questionnaire
              currencySymbol={currencySymbol}
              onCompleteAssessment={handleCompleteAssessment}
            />
          </Animated.View>
        )}

        {currentAct === 'act3_diagnosis' && (
          <Animated.View
            key="act3"
            entering={FadeInRight.duration(280)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.actWrapper}
          >
            <StoryAct3Diagnosis
              currencySymbol={currencySymbol}
              data={assessmentData}
              onProceedToHabit={handleProceedToHabit}
            />
          </Animated.View>
        )}

        {currentAct === 'act4_habit' && (
          <Animated.View
            key="act4"
            entering={FadeInRight.duration(280)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.actWrapper}
          >
            <StoryAct4FirstHabit
              currencySymbol={currencySymbol}
              data={assessmentData}
              onProceedToNotifications={handleProceedToNotifications}
            />
          </Animated.View>
        )}

        {currentAct === 'act5_notifications' && (
          <Animated.View
            key="act5"
            entering={FadeInRight.duration(280)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.actWrapper}
          >
            <StoryAct5Notifications
              onFinishOnboarding={handleFinishAllOnboarding}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    height: 48,
  },
  actBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  stage: {
    flex: 1,
  },
  actWrapper: {
    flex: 1,
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import { useAppStore, getDefaultLocaleCurrency } from '@/store';
import { useUserSettings } from '@/hooks/use-database';
import { generateAndSaveAIReport } from '@/services/ai-reports';
import {
  StoryAct2Questionnaire,
  UserOnboardingAnswers,
} from '@/components/onboarding/StoryAct2Questionnaire';
import { StoryAct3Diagnosis } from '@/components/onboarding/StoryAct3Diagnosis';

type OnboardingStage = 'questionnaire' | 'diagnosis';

export default function OnboardingScreen() {
  const router = useRouter();
  const { currencySymbol, currency, setHasCompletedOnboarding } = useAppStore();
  const { saveSettings } = useUserSettings();

  const [currentStage, setCurrentStage] = useState<OnboardingStage>('questionnaire');
  const [answers, setAnswers] = useState<UserOnboardingAnswers>({
    role: 'Working Professional',
    monthlyIncome: '75000',
    monthlySavingsTarget: '15000',
    mustPayments: [],
    totalMustPayments: 18000,
    primaryGoal: 'Save More Money',
    timeline: 'Within 6 Months',
    frustration: "I don't know where my money goes",
    buyingReflex: 'Think for a Day',
    regretFrequency: 'Sometimes',
    overspendingCategory: 'Food & Dining',
    trackingFrequency: 'Occasionally',
    currentManagementTool: 'Mental Tracking',
    balanceCheckFrequency: 'Weekly',
    importantCategories: ['Food & Dining', 'Shopping', 'Bills'],
    insightFrequency: 'Weekly',
    coachingTone: 'Friendly Coach',
  });

  const handleCompleteQuestionnaire = (completedAnswers: UserOnboardingAnswers) => {
    setAnswers(completedAnswers);
    setCurrentStage('diagnosis');
  };

  const handleFinishOnboarding = async () => {
    try {
      const defaultLocale = getDefaultLocaleCurrency();

      // 1. Mark onboarding completed in global app store
      setHasCompletedOnboarding(true);

      // 2. Save calibrated parameters directly into SQLite user_settings
      const settingsPayload: Record<string, string> = {
        currency: currencySymbol || defaultLocale.symbol,
        currencyCode: currency || defaultLocale.code,
        monthlyIncome: answers.monthlyIncome.replace(/[^0-9.]/g, '') || '75000',
        monthlySavingsTarget: answers.monthlySavingsTarget.replace(/[^0-9.]/g, '') || '15000',
        mustPayments: JSON.stringify(answers.mustPayments || []),
        totalMustPayments: String(answers.totalMustPayments || 0),
        role: answers.role,
        primaryGoal: answers.primaryGoal,
        timeline: answers.timeline,
        primaryLeakCategory: answers.overspendingCategory,
        frustration: answers.frustration,
        coachingTone: answers.coachingTone,
        insightFrequency: answers.insightFrequency,
        importantCategories: JSON.stringify(answers.importantCategories),
      };

      await saveSettings(settingsPayload);

      // 3. Initiate first weekly financial report in background
      generateAndSaveAIReport({
        periodType: 'weekly',
        isInitialOnboarding: true,
        onboardingData: {
          leakCategory: answers.overspendingCategory.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          leakCategoryName: answers.overspendingCategory,
          leakEstimatedCost: 4000,
          frustration: answers.frustration,
          primaryGoal: answers.primaryGoal,
          monthlyIncome: answers.monthlyIncome || '75000',
          monthlySavingsTarget: answers.monthlySavingsTarget || '15000',
          mustPayments: answers.mustPayments,
          totalMustPayments: answers.totalMustPayments || 0,
        },
      }).catch((reportErr) => {
        console.warn('Initial onboarding report generation notice:', reportErr);
      });

      router.replace('/(tabs)' as any);
    } catch (err) {
      console.warn('Failed to complete onboarding:', err);
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {currentStage === 'questionnaire' && (
          <Animated.View
            key="stage_questionnaire"
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stageWrapper}
          >
            <StoryAct2Questionnaire
              currencySymbol={currencySymbol}
              onCompleteAssessment={handleCompleteQuestionnaire}
            />
          </Animated.View>
        )}

        {currentStage === 'diagnosis' && (
          <Animated.View
            key="stage_diagnosis"
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stageWrapper}
          >
            <StoryAct3Diagnosis
              currencySymbol={currencySymbol}
              answers={answers}
              onProceedToNext={handleFinishOnboarding}
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
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
  },
  stageWrapper: {
    flex: 1,
  },
});

import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAppStore, getDefaultLocaleCurrency } from '@/store';
import { useUserSettings } from '@/hooks/use-database';
import { generateAndSaveAIReport } from '@/services/ai-reports';
import { db } from '@/db/client';
import * as schema from '@/db/schema';
import { getCurrencyDefaults } from '@/utils/currency-calibration';
import {
  UserOnboardingAnswers,
  FirstHabitResult,
  OnboardingStage,
} from '../types';

export function useOnboardingFlow() {
  const router = useRouter();
  const { currencySymbol, currency, setHasCompletedOnboarding } = useAppStore();
  const { saveSettings } = useUserSettings();

  const currencyConfig = useMemo(() => getCurrencyDefaults(currency), [currency]);

  const [currentStage, setCurrentStage] = useState<OnboardingStage>('questionnaire');
  const [answers, setAnswers] = useState<UserOnboardingAnswers>({
    role: 'Working Professional',
    monthlyIncome: String(currencyConfig.defaultIncome),
    monthlySavingsTarget: String(currencyConfig.defaultSavings),
    mustPayments: currencyConfig.defaultMustPayments,
    totalMustPayments: currencyConfig.defaultMustPayments.reduce((acc, m) => acc + m.amount, 0),
    primaryGoal: 'Build Emergency Cushion',
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

  const [habitResult, setHabitResult] = useState<FirstHabitResult>({
    isCompleted: false,
    savingsAmount: currencyConfig.defaultHabitSavings,
    taskTitle: 'Cook dinner at home',
    taskCategory: 'Food & Dining',
  });

  const handleCompleteQuestionnaire = (completedAnswers: UserOnboardingAnswers) => {
    setAnswers(completedAnswers);
    setCurrentStage('diagnosis');
  };

  const handleProceedToFirstHabit = () => {
    setCurrentStage('first_habit');
  };

  const handleProceedToNotifications = (result: FirstHabitResult) => {
    setHabitResult(result);
    setCurrentStage('notifications');
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
        monthlyIncome: answers.monthlyIncome.replace(/[^0-9.]/g, '') || String(currencyConfig.defaultIncome),
        monthlySavingsTarget: answers.monthlySavingsTarget.replace(/[^0-9.]/g, '') || String(currencyConfig.defaultSavings),
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

      // 3. Auto-seed the user's primary Milestone Vault in SQLite if not already seeded
      try {
        const existingVaults = await db.select().from(schema.milestoneVaults).limit(1);
        if (existingVaults.length === 0) {
          const now = new Date();
          const targetDateObj = new Date(now.setMonth(now.getMonth() + 6));
          const targetDateStr = targetDateObj.toISOString().split('T')[0];

          let icon = 'ShieldCheck';
          let category: schema.GoalCategory = 'Emergency';
          let target = currencyConfig.defaultTargetVault;
          let color = '#7C3AED';

          if (answers.primaryGoal.includes('Travel') || answers.primaryGoal.includes('Vacation')) {
            icon = 'Plane';
            category = 'Travel';
            target = Math.round(currencyConfig.defaultTargetVault * 1.3);
            color = '#0284C7';
          } else if (answers.primaryGoal.includes('Vehicle') || answers.primaryGoal.includes('Car')) {
            icon = 'Car';
            category = 'Vault';
            target = Math.round(currencyConfig.defaultTargetVault * 2);
            color = '#FF6B00';
          } else if (answers.primaryGoal.includes('Debt')) {
            icon = 'Zap';
            category = 'Vault';
            target = Math.round(currencyConfig.defaultTargetVault * 0.8);
            color = '#EF4444';
          } else if (answers.primaryGoal.includes('Invest')) {
            icon = 'TrendingUp';
            category = 'Lifestyle';
            target = Math.round(currencyConfig.defaultTargetVault * 1.5);
            color = '#059669';
          }

          await db.insert(schema.milestoneVaults).values({
            id: `vault_${Date.now()}`,
            title: answers.primaryGoal || 'Emergency Safety Cushion',
            category: category,
            targetAmount: target,
            currentAmount: habitResult.isCompleted ? habitResult.savingsAmount : 0,
            targetDate: targetDateStr,
            color: color,
            iconName: icon,
            monthlyContribution: parseFloat(answers.monthlySavingsTarget) || currencyConfig.defaultSavings,
            isLocked: false,
            orderIndex: 0,
          });
        }
      } catch (vaultErr) {
        console.warn('Initial milestone vault auto-seed notice:', vaultErr);
      }

      // 4. Auto-seed first active weekly habit goal in SQLite
      try {
        const existingGoals = await db.select().from(schema.weeklyGoals).limit(1);
        if (existingGoals.length === 0) {
          await db.insert(schema.weeklyGoals).values({
            id: `goal_${Date.now()}`,
            title: habitResult.taskTitle || `Log ${answers.overspendingCategory || 'daily'} spends in 3 seconds`,
            category: 'Lifestyle',
            savingsAmount: habitResult.savingsAmount || currencyConfig.defaultHabitSavings,
            completed: habitResult.isCompleted,
            actionText: '✓ Complete',
            completedText: `Saved ${currencySymbol || '₹'}${habitResult.savingsAmount}!`,
            impactTag: 'Mindful Habits',
            iconName: 'Sparkles',
            completedAt: habitResult.isCompleted ? new Date().toISOString() : null,
          });
        }
      } catch (goalErr) {
        console.warn('Initial weekly goal auto-seed notice:', goalErr);
      }

      // 5. Initiate first weekly financial report in background
      generateAndSaveAIReport({
        periodType: 'weekly',
        isInitialOnboarding: true,
        onboardingData: {
          leakCategory: answers.overspendingCategory.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          leakCategoryName: answers.overspendingCategory,
          leakEstimatedCost: Math.round(currencyConfig.defaultIncome * 0.05),
          frustration: answers.frustration,
          primaryGoal: answers.primaryGoal,
          monthlyIncome: answers.monthlyIncome || String(currencyConfig.defaultIncome),
          monthlySavingsTarget: answers.monthlySavingsTarget || String(currencyConfig.defaultSavings),
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

  return {
    currentStage,
    answers,
    habitResult,
    currencySymbol,
    currency,
    handleCompleteQuestionnaire,
    handleProceedToFirstHabit,
    handleProceedToNotifications,
    handleFinishOnboarding,
  };
}

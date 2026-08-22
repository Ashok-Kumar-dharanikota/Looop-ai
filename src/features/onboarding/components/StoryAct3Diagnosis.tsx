import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Target,
  Coins,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { formatAmount } from '@/utils/currency-calibration';
import { UserOnboardingAnswers } from '../types';
import { AmbientGlow } from '@/features/auth/components/AmbientGlow';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StoryAct3DiagnosisProps {
  currencySymbol: string;
  answers: UserOnboardingAnswers;
  onProceedToNext: () => void;
}

export const StoryAct3Diagnosis: React.FC<StoryAct3DiagnosisProps> = ({
  currencySymbol,
  answers,
  onProceedToNext,
}) => {
  const { t } = useTranslation();
  const { currency } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(true);
  const [calculationStep, setCalculationStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(14);

  const progressVal = useSharedValue(0.14);

  const incomeNum =
    parseFloat((answers.monthlyIncome || '75000').replace(/[^0-9.]/g, '')) || 75000;
  const savingsNum =
    parseFloat((answers.monthlySavingsTarget || '15000').replace(/[^0-9.]/g, '')) || 15000;
  const obligationsNum = answers.totalMustPayments || 0;

  // Discretionary pool & daily safe spend calculation
  const discretionaryPool = Math.max(0, incomeNum - savingsNum - obligationsNum);
  const dailySafeSpend = Math.max(100, Math.round(discretionaryPool / 30));
  const annualSavings = savingsNum * 12;

  useEffect(() => {
    progressVal.value = withTiming(1, { duration: 2500 });

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 100;
        }
        return prev + 14;
      });
    }, 280);

    const t1 = setTimeout(() => {
      setCalculationStep(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 650);

    const t2 = setTimeout(() => {
      setCalculationStep(2);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 1300);

    const t3 = setTimeout(() => {
      setCalculationStep(3);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 1950);

    const t4 = setTimeout(() => {
      setIsGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [progressVal]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressVal.value * 100}%`,
  }));

  // Cal AI-style Calculation Loader
  if (isGenerating) {
    return (
      <View style={styles.loaderContainer}>
        <AmbientGlow />
        <Animated.View entering={FadeIn.duration(300)} style={styles.loaderCenterBox}>
          <View style={styles.sparkleHeroRing}>
            <Sparkles size={28} color="#FF6B00" />
          </View>

          <Text style={styles.percentText}>{progressPercent}%</Text>
          <Text style={styles.loaderHeadline}>
            {t('onboarding.diagnosis.loaderHeadline', 'Synthesizing your financial blueprint...')}
          </Text>

          {/* Progress Track */}
          <View style={styles.calcProgressBg}>
            <Animated.View style={[styles.calcProgressFill, progressAnimatedStyle]} />
          </View>

          {/* Animated Checklist Steps */}
          <View style={styles.checklistContainer}>
            <View style={styles.checklistItem}>
              <CheckCircle2
                size={18}
                color={calculationStep >= 0 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 0 && styles.checklistTextActive,
                ]}
              >
                {t(
                  'onboarding.diagnosis.ringFencing',
                  'Ring-fencing {{currency}}{{amount}} fixed obligations',
                  {
                    currency: currencySymbol,
                    amount: formatAmount(obligationsNum, currency),
                  }
                )}
              </Text>
            </View>

            <View style={styles.checklistItem}>
              <CheckCircle2
                size={18}
                color={calculationStep >= 1 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 1 && styles.checklistTextActive,
                ]}
              >
                {t(
                  'onboarding.diagnosis.pacingSafeSpend',
                  'Pacing {{currency}}{{amount}}/day safe spend for {{goal}}',
                  {
                    currency: currencySymbol,
                    amount: formatAmount(dailySafeSpend, currency),
                    goal: answers.primaryGoal || 'your milestone',
                  }
                )}
              </Text>
            </View>

            <View style={styles.checklistItem}>
              <CheckCircle2
                size={18}
                color={calculationStep >= 2 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 2 && styles.checklistTextActive,
                ]}
              >
                {t(
                  'onboarding.diagnosis.diagnosingTriggers',
                  'Diagnosing {{category}} spending triggers',
                  { category: answers.overspendingCategory || 'lifestyle' }
                )}
              </Text>
            </View>

            <View style={styles.checklistItem}>
              <CheckCircle2
                size={18}
                color={calculationStep >= 3 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 3 && styles.checklistTextActive,
                ]}
              >
                {t(
                  'onboarding.diagnosis.coachingCalibrated',
                  'Personalized {{tone}} plan calibrated!',
                  { tone: answers.coachingTone || 'AI Coaching' }
                )}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  // Personalized Strategy Blueprint Screen
  return (
    <View style={styles.container}>
      <AmbientGlow />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blueprint Header */}
        <Animated.View entering={FadeInDown.duration(280)} style={styles.headerBox}>
          <View style={styles.blueprintBadge}>
            <Sparkles size={13} color="#FF6B00" />
            <Text style={styles.blueprintBadgeText}>
              {t('onboarding.diagnosis.blueprintBadge', 'AI FINANCIAL BLUEPRINT')}
            </Text>
          </View>

          <Text style={styles.mainTitle}>
            {t('onboarding.diagnosis.mainTitle', 'The {{role}} Wealth Plan', {
              role: answers.role || 'Mindful',
            })}
          </Text>
          <Text style={styles.subTitle}>
            {t(
              'onboarding.diagnosis.subTitle',
              'Calibrated to allocate your {{currency}}{{income}} income and reach {{goal}} ({{timeline}}).',
              {
                currency: currencySymbol,
                income: formatAmount(incomeNum, currency),
                goal: answers.primaryGoal || 'financial freedom',
                timeline: answers.timeline || 'Within 6 Months',
              }
            )}
          </Text>
        </Animated.View>

        {/* Hero Projected Savings Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.heroMetricCard}>
          <View style={styles.heroMetricHeader}>
            <Text style={styles.heroMetricTag}>
              {t('onboarding.diagnosis.heroTag', 'PROJECTED ANNUAL WEALTH CREATED')}
            </Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={12} color="#059669" />
              <Text style={styles.trendBadgeText}>
                {t('onboarding.diagnosis.onTrack', 'ON TRACK')}
              </Text>
            </View>
          </View>

          <Text style={styles.heroMetricValue}>
            {currencySymbol}
            {formatAmount(annualSavings, currency)}{' '}
            <Text style={styles.heroMetricPeriod}>/ year</Text>
          </Text>

          <Text style={styles.heroMetricDescription}>
            {t(
              'onboarding.diagnosis.heroDescription',
              'After funding {{currency}}{{obligations}} fixed obligations (Rent, EMIs), leaving you with {{safeSpend}}/day guaranteed safe discretionary spend.',
              {
                currency: currencySymbol,
                obligations: formatAmount(obligationsNum, currency),
                safeSpend: `${currencySymbol}${formatAmount(dailySafeSpend, currency)}`,
              }
            )}
          </Text>
        </Animated.View>

        {/* 4-Point Blueprint Bento Grid */}
        <Animated.View entering={FadeInDown.delay(180).duration(300)} style={styles.bentoGrid}>
          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Coins size={16} color="#059669" />
            </View>
            <Text style={styles.bentoLabel}>
              {t('onboarding.diagnosis.dailySafeSpendLabel', 'DAILY SAFE SPEND')}
            </Text>
            <Text style={styles.bentoVal}>
              {currencySymbol}
              {formatAmount(dailySafeSpend, currency)}{' '}
              <Text style={{ fontSize: 11, fontWeight: '500' }}>/ day</Text>
            </Text>
            <Text style={styles.bentoSub}>
              {t('onboarding.diagnosis.dailySafeSpendSub', 'Guaranteed goal safety')}
            </Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconCircle, { backgroundColor: '#FFF7ED' }]}>
              <Target size={16} color="#FF6B00" />
            </View>
            <Text style={styles.bentoLabel}>
              {t('onboarding.diagnosis.primaryMilestoneLabel', 'PRIMARY MILESTONE')}
            </Text>
            <Text style={styles.bentoVal} numberOfLines={1}>
              {answers.primaryGoal || 'Build Emergency Cushion'}
            </Text>
            <Text style={styles.bentoSub}>{answers.timeline || 'Within 6 Months'}</Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Zap size={16} color="#D97706" />
            </View>
            <Text style={styles.bentoLabel}>
              {t('onboarding.diagnosis.leakFocusLabel', 'LEAK FOCUS')}
            </Text>
            <Text style={styles.bentoVal} numberOfLines={1}>
              {answers.overspendingCategory || 'Food & Dining'}
            </Text>
            <Text style={styles.bentoSub}>
              {t('onboarding.diagnosis.leakFocusSub', 'Targeted habit coaching')}
            </Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <ShieldCheck size={16} color="#7C3AED" />
            </View>
            <Text style={styles.bentoLabel}>
              {t('onboarding.diagnosis.coachingToneLabel', 'AI COACHING')}
            </Text>
            <Text style={styles.bentoVal} numberOfLines={1}>
              {answers.coachingTone || 'Friendly Coach'}
            </Text>
            <Text style={styles.bentoSub}>
              {t('onboarding.diagnosis.coachingToneSub', 'Weekly reflection story')}
            </Text>
          </View>
        </Animated.View>

        {/* First Habit Preview Card */}
        <Animated.View entering={FadeInDown.delay(260).duration(300)} style={styles.habitCard}>
          <View style={styles.habitHeaderRow}>
            <View style={styles.habitBadge}>
              <Zap size={12} color="#FF6B00" />
              <Text style={styles.habitBadgeText}>
                {t('onboarding.diagnosis.habitPreviewBadge', 'YOUR FIRST MICRO-HABIT TRIAL')}
              </Text>
            </View>
            <Text style={styles.habitDays}>
              {t('onboarding.diagnosis.habitDays', 'DAY 1 CHALLENGE')}
            </Text>
          </View>

          <Text style={styles.habitTitle}>
            {t(
              'onboarding.diagnosis.habitPreviewTitle',
              'The 10-Second {{category}} Log',
              { category: answers.overspendingCategory || 'Spend' }
            )}
          </Text>
          <Text style={styles.habitDescription}>
            {t(
              'onboarding.diagnosis.habitPreviewDesc',
              'Test how Looop automatically deposits saved cash directly into your active Milestone Vault.'
            )}
          </Text>
        </Animated.View>

        {/* Bottom Primary CTA */}
        <Animated.View entering={FadeInUp.delay(320).duration(300)} style={styles.bottomSection}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onProceedToNext();
            }}
            style={styles.primaryButtonPressable}
            accessibilityRole="button"
            accessibilityLabel="Experience First Habit Trial"
          >
            <LinearGradient
              colors={['#FF7A00', '#FF4D00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>
                {t('onboarding.buttons.experienceHabit', 'Experience First Habit Trial')}
              </Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.4} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loaderCenterBox: {
    width: '100%',
    alignItems: 'center',
  },
  sparkleHeroRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FFEDD5',
  },
  percentText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 48,
    color: '#0F172A',
    letterSpacing: -1.2,
  },
  loaderHeadline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 26,
  },
  calcProgressBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 28,
  },
  calcProgressFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 4,
  },
  checklistContainer: {
    width: '100%',
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checklistText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
  },
  checklistTextActive: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#0F172A',
  },
  headerBox: {
    marginBottom: 16,
  },
  blueprintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  blueprintBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    color: '#FF6B00',
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
  },
  heroMetricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 8,
  },
  heroMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroMetricTag: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#059669',
    letterSpacing: 0.5,
  },
  heroMetricValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 32,
    color: '#059669',
    letterSpacing: -0.8,
  },
  heroMetricPeriod: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#64748B',
    fontWeight: 'normal',
  },
  heroMetricDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  bentoCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bentoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bentoLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9.5,
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  bentoVal: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14.5,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  bentoSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#64748B',
  },
  habitCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#FFEDD5',
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  habitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  habitBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#EA580C',
    letterSpacing: 0.7,
  },
  habitDays: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#EA580C',
  },
  habitTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#0F172A',
  },
  habitDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    color: '#9A3412',
    lineHeight: 18,
  },
  bottomSection: {
    paddingTop: 4,
  },
  primaryButtonPressable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15.5,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

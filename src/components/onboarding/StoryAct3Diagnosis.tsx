import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Target,
  Coins,
  Wallet,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { UserOnboardingAnswers } from './StoryAct2Questionnaire';

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
  const [isGenerating, setIsGenerating] = useState(true);
  const [calculationStep, setCalculationStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  const progressVal = useSharedValue(0.12);

  const incomeNum = parseFloat((answers.monthlyIncome || '75000').replace(/[^0-9.]/g, '')) || 75000;
  const savingsNum = parseFloat((answers.monthlySavingsTarget || '15000').replace(/[^0-9.]/g, '')) || 15000;
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
    }, 300);

    const t1 = setTimeout(() => {
      setCalculationStep(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 700);

    const t2 = setTimeout(() => {
      setCalculationStep(2);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 1400);

    const t3 = setTimeout(() => {
      setCalculationStep(3);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 2100);

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
        <Animated.View entering={FadeIn.duration(300)} style={styles.loaderCenterBox}>
          <View style={styles.sparkleHeroRing}>
            <Sparkles size={28} color="#7C3AED" />
          </View>

          <Text style={styles.percentText}>{progressPercent}%</Text>
          <Text style={styles.loaderHeadline}>Building your financial blueprint...</Text>

          {/* Progress Track */}
          <View style={styles.calcProgressBg}>
            <Animated.View style={[styles.calcProgressFill, progressAnimatedStyle]} />
          </View>

          {/* Animated Checklist Steps */}
          <View style={styles.checklistContainer}>
            <View style={styles.checklistItem}>
              <CheckCircle2
                size={16}
                color={calculationStep >= 0 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 0 && styles.checklistTextActive,
                ]}
              >
                Balancing {currencySymbol}{incomeNum.toLocaleString('en-IN')} income against fixed spends
              </Text>
            </View>

            <View style={styles.checklistItem}>
              <CheckCircle2
                size={16}
                color={calculationStep >= 1 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 1 && styles.checklistTextActive,
                ]}
              >
                Pacing {currencySymbol}{dailySafeSpend.toLocaleString('en-IN')}/day safe limit for {answers.primaryGoal || 'your goal'}
              </Text>
            </View>

            <View style={styles.checklistItem}>
              <CheckCircle2
                size={16}
                color={calculationStep >= 2 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 2 && styles.checklistTextActive,
                ]}
              >
                Analyzing {answers.overspendingCategory || 'lifestyle'} spending triggers
              </Text>
            </View>

            <View style={styles.checklistItem}>
              <CheckCircle2
                size={16}
                color={calculationStep >= 3 ? '#059669' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.checklistText,
                  calculationStep >= 3 && styles.checklistTextActive,
                ]}
              >
                Personalized {answers.coachingTone || 'coaching'} plan ready!
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  // Personalized Strategy Blueprint Screen
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Blueprint Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={styles.headerBox}>
        <View style={styles.blueprintBadge}>
          <Sparkles size={12} color="#7C3AED" />
          <Text style={styles.blueprintBadgeText}>PERSONALIZED BLUEPRINT</Text>
        </View>

        <Text style={styles.mainTitle}>
          The {answers.role || 'Mindful'} Wealth Plan
        </Text>
        <Text style={styles.subTitle}>
          Tailored to allocate your {currencySymbol}{incomeNum.toLocaleString('en-IN')} income and reach {answers.primaryGoal || 'financial independence'} {answers.timeline ? `(${answers.timeline})` : ''}.
        </Text>
      </Animated.View>

      {/* Hero Projected Savings Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.heroMetricCard}>
        <View style={styles.heroMetricHeader}>
          <Text style={styles.heroMetricTag}>PROJECTED ANNUAL WEALTH SAVINGS</Text>
          <View style={styles.trendBadge}>
            <TrendingUp size={12} color="#059669" />
            <Text style={styles.trendBadgeText}>ON TRACK</Text>
          </View>
        </View>

        <Text style={styles.heroMetricValue}>
          {currencySymbol}{annualSavings.toLocaleString('en-IN')}{' '}
          <Text style={styles.heroMetricPeriod}>/ year</Text>
        </Text>

        <Text style={styles.heroMetricDescription}>
          After funding {currencySymbol}{obligationsNum.toLocaleString('en-IN')} fixed obligations (Rent, EMIs), leaving {currencySymbol}{dailySafeSpend.toLocaleString('en-IN')}/day safe discretionary spend.
        </Text>
      </Animated.View>

      {/* 4-Point Blueprint Bento Grid */}
      <Animated.View entering={FadeInDown.delay(180).duration(300)} style={styles.bentoGrid}>
        <View style={styles.bentoCard}>
          <View style={[styles.bentoIconCircle, { backgroundColor: '#ECFDF5' }]}>
            <Coins size={16} color="#059669" />
          </View>
          <Text style={styles.bentoLabel}>DAILY SAFE SPEND</Text>
          <Text style={styles.bentoVal}>
            {currencySymbol}{dailySafeSpend.toLocaleString('en-IN')}{' '}
            <Text style={{ fontSize: 11, fontWeight: '500' }}>/ day</Text>
          </Text>
          <Text style={styles.bentoSub}>Guaranteed goal safety</Text>
        </View>

        <View style={styles.bentoCard}>
          <View style={[styles.bentoIconCircle, { backgroundColor: '#F3E8FF' }]}>
            <Target size={16} color="#7C3AED" />
          </View>
          <Text style={styles.bentoLabel}>PRIMARY GOAL</Text>
          <Text style={styles.bentoVal} numberOfLines={1}>
            {answers.primaryGoal || 'Save More Money'}
          </Text>
          <Text style={styles.bentoSub}>{answers.timeline || 'Within 6 Months'}</Text>
        </View>

        <View style={styles.bentoCard}>
          <View style={[styles.bentoIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Zap size={16} color="#D97706" />
          </View>
          <Text style={styles.bentoLabel}>PRIMARY LEAK FOCUS</Text>
          <Text style={styles.bentoVal} numberOfLines={1}>
            {answers.overspendingCategory || 'Food & Dining'}
          </Text>
          <Text style={styles.bentoSub}>Mindful habit challenge</Text>
        </View>

        <View style={styles.bentoCard}>
          <View style={[styles.bentoIconCircle, { backgroundColor: '#E0F2FE' }]}>
            <ShieldCheck size={16} color="#0284C7" />
          </View>
          <Text style={styles.bentoLabel}>COACHING TONE</Text>
          <Text style={styles.bentoVal} numberOfLines={1}>
            {answers.coachingTone || 'Friendly Coach'}
          </Text>
          <Text style={styles.bentoSub}>Delivered {answers.insightFrequency || 'Weekly'}</Text>
        </View>
      </Animated.View>

      {/* First Habit Challenge Card */}
      <Animated.View entering={FadeInDown.delay(260).duration(300)} style={styles.habitCard}>
        <View style={styles.habitHeaderRow}>
          <View style={styles.habitBadge}>
            <Zap size={12} color="#D97706" />
            <Text style={styles.habitBadgeText}>FIRST 3-DAY HABIT CHALLENGE</Text>
          </View>
          <Text style={styles.habitDays}>DAY 1 OF 3</Text>
        </View>

        <Text style={styles.habitTitle}>
          The 10-Second {answers.overspendingCategory || 'Spend'} Log
        </Text>
        <Text style={styles.habitDescription}>
          Log every purchase in {answers.overspendingCategory || 'daily spends'} immediately via voice or keypad to eliminate unconscious habit loops.
        </Text>

        <View style={styles.habitCheckRow}>
          <CheckCircle2 size={16} color="#059669" />
          <Text style={styles.habitCheckText}>Automatically enrolled in your plan</Text>
        </View>
      </Animated.View>

      {/* Bottom Primary CTA */}
      <Animated.View entering={FadeInUp.delay(320).duration(300)} style={styles.bottomSection}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onProceedToNext();
          }}
          style={styles.primaryButton}
          accessibilityRole="button"
          accessibilityLabel="Start My Financial Plan"
        >
          <Text style={styles.primaryButtonText}>Start My Financial Plan</Text>
          <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
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
    paddingBottom: 32,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  percentText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
  },
  loaderHeadline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6,
    marginBottom: 24,
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
    backgroundColor: '#7C3AED',
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
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  checklistTextActive: {
    color: '#0F172A',
    fontWeight: '600',
  },
  headerBox: {
    marginBottom: 16,
  },
  blueprintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  blueprintBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.6,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.6,
    color: '#0F172A',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#475569',
  },
  heroMetricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroMetricTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  trendBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  heroMetricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginVertical: 4,
  },
  heroMetricPeriod: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  heroMetricDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    marginTop: 2,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  bentoCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  bentoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bentoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bentoVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  bentoSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  habitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  habitBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  habitDays: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  habitCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  habitCheckText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  bottomSection: {
    paddingTop: 4,
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
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

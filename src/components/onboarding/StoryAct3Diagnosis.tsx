import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldAlert,
  HeartPulse,
  Coins,
  CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { UserAssessmentData } from './StoryAct2Questionnaire';

interface StoryAct3DiagnosisProps {
  currencySymbol: string;
  data: UserAssessmentData;
  onProceedToHabit: () => void;
}

export const StoryAct3Diagnosis: React.FC<StoryAct3DiagnosisProps> = ({
  currencySymbol,
  data,
  onProceedToHabit,
}) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [progressStage, setProgressStage] = useState(0);

  const progressVal = useSharedValue(0);

  useEffect(() => {
    progressVal.value = withTiming(1, { duration: 2400 });

    const timer1 = setTimeout(() => {
      setProgressStage(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 800);

    const timer2 = setTimeout(() => {
      setProgressStage(2);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 1600);

    const timer3 = setTimeout(() => {
      setIsGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const annualLeak = data.leakEstimatedCost * 12;

  // Customized Hook Titles based on user leak
  const getArticleContent = () => {
    switch (data.leakCategory) {
      case 'food_delivery':
        return {
          title: `The Midnight Delivery Paradox: Why ${currencySymbol}${annualLeak.toLocaleString('en-IN')} Leaks in 11:30 PM Fatigue Spends`,
          subtitle: `Why impulse food orders feel innocent after a long workday, but rob both your morning vitality and your dream milestone savings.`,
          leakExplanation: `Our spending is driven by emotional fatigue, not balance sheets. After 9 hours of screen time, willpower drops to zero, making late food orders feel like the only reward.`,
          habitSolution: `Instead of an impossible strict diet, Looop will assign 2-day micro challenges like "Cook dinner at home on Thu & Fri" to reclaim ${currencySymbol}${data.leakEstimatedCost.toLocaleString('en-IN')}/month.`,
        };
      case 'cabs_commute':
        return {
          title: `The Peak Surge Trap: Why ${currencySymbol}${annualLeak.toLocaleString('en-IN')} Slipped Into Rush-Hour Rides`,
          subtitle: `How convenience friction quietly drains your wealth pool, and why switching just 2 morning rides reclaims freedom.`,
          leakExplanation: `Peak surge pricing preys on morning rush anxiety. Tapping "Book Cab" becomes an unconscious habit loop that costs ${currencySymbol}${data.leakEstimatedCost.toLocaleString('en-IN')} each month.`,
          habitSolution: `Looop assigns micro-commute tasks like "Take the express metro on Tuesday morning" to turn wasted surge fees into your milestone vault.`,
        };
      case 'coffee_cafes':
        return {
          title: `The Daily Cafe Routine Mirage: How ${currencySymbol}${annualLeak.toLocaleString('en-IN')} Compounds Out of Sight`,
          subtitle: `Daily artisanal brews provide quick comfort, but compound into delaying your biggest financial milestones.`,
          leakExplanation: `Small friction-free card swipes under ${currencySymbol}300 bypass our brain's financial alarm system. Over a year, it creates a massive ${currencySymbol}${annualLeak.toLocaleString('en-IN')} hole.`,
          habitSolution: `Looop challenges you to "Brew artisanal pour-over at home this weekend" to preserve quality of life while automatically saving.`,
        };
      case 'subscriptions':
        return {
          title: `The Digital Ghost Drain: Why Unused Subscriptions Take ${currencySymbol}${annualLeak.toLocaleString('en-IN')} From Your Future`,
          subtitle: `Auto-renewing digital services quietly pull funds every month without you ever opening the apps.`,
          leakExplanation: `Companies engineer auto-renewals because out-of-sight means out-of-mind. You pay for 6 services while actively using only 2.`,
          habitSolution: `Looop runs an automatic recurring audit and gives you a 1-tap cancellation micro-task to instantly save ${currencySymbol}${data.leakEstimatedCost.toLocaleString('en-IN')}/month.`,
        };
      default:
        return {
          title: `The Impulse Gratification Loop: Reclaiming ${currencySymbol}${annualLeak.toLocaleString('en-IN')} With Tiny Friction Rules`,
          subtitle: `Why spontaneous checkout swipes feel thrilling in the moment, but leave your bank balance empty by the 24th.`,
          leakExplanation: `Instant checkout algorithms remove all payment friction, tricking our dopamine receptors into treating wants as emergencies.`,
          habitSolution: `Looop applies a 48-Hour Cooling Task to let emotional spikes settle before purchasing.`,
        };
    }
  };

  const article = getArticleContent();

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.aiGlowCircle}>
          <Sparkles size={32} color="#7C3AED" />
        </View>

        <Text style={styles.loadingTitle}>Analyzing Your Financial Psychology</Text>
        <Text style={styles.loadingSubtitle}>
          Synthesizing behavioral patterns, friction leaks, and personalized AI diagnosis...
        </Text>

        {/* Dynamic Progress Steps */}
        <View style={styles.progressStepsList}>
          <View style={styles.progressStepItem}>
            <CheckCircle2
              size={18}
              color={progressStage >= 0 ? '#059669' : '#CBD5E1'}
            />
            <Text
              style={[
                styles.progressStepText,
                progressStage >= 0 && styles.progressStepTextActive,
              ]}
            >
              Auditing friction leak: {data.leakCategoryName}
            </Text>
          </View>

          <View style={styles.progressStepItem}>
            <CheckCircle2
              size={18}
              color={progressStage >= 1 ? '#059669' : '#CBD5E1'}
            />
            <Text
              style={[
                styles.progressStepText,
                progressStage >= 1 && styles.progressStepTextActive,
              ]}
            >
              {data.totalMustPayments > 0
                ? `Factoring ${currencySymbol}${data.totalMustPayments.toLocaleString('en-IN')}/mo fixed commitments & ${currencySymbol}${annualLeak.toLocaleString('en-IN')}/yr leak`
                : `Calculating annual leak compounding (${currencySymbol}${annualLeak.toLocaleString('en-IN')}/yr)`}
            </Text>
          </View>

          <View style={styles.progressStepItem}>
            <CheckCircle2
              size={18}
              color={progressStage >= 2 ? '#059669' : '#CBD5E1'}
            />
            <Text
              style={[
                styles.progressStepText,
                progressStage >= 2 && styles.progressStepTextActive,
              ]}
            >
              Drafting Edition #01 AI Financial Diagnosis Essay
            </Text>
          </View>
        </View>

        <ActivityIndicator size="small" color="#7C3AED" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.duration(350)} style={styles.articleCard}>
          {/* Header Metadata */}
          <View style={styles.articleHeaderRow}>
            <View style={styles.articleTagBadge}>
              <BookOpen size={13} color="#7C3AED" />
              <Text style={styles.articleTagText}>YOUR PERSONALIZED AI DIAGNOSIS</Text>
            </View>
            <Text style={styles.articleReadTime}>3 min read</Text>
          </View>

          {/* Hook Headline */}
          <Text style={styles.articleTitle}>{article.title}</Text>
          <Text style={styles.articleSubtitle}>{article.subtitle}</Text>

          {/* Key Metric Callout */}
          <View style={styles.leakCalloutBox}>
            <View style={styles.leakCalloutIconBox}>
              <ShieldAlert size={22} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.leakCalloutLabel}>UNCONSCIOUS ANNUAL LEAK</Text>
              <Text style={styles.leakCalloutAmount}>
                -{currencySymbol}{annualLeak.toLocaleString('en-IN')}/year
              </Text>
              <Text style={styles.leakCalloutSub}>
                Reclaiming this through tiny AI tasks will fully fund your primary milestone goal.
              </Text>
            </View>
          </View>

          {/* Section 1: The Behavioral Diagnosis */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Why This Happens (Psychology)</Text>
            <Text style={styles.sectionParagraph}>{article.leakExplanation}</Text>
          </View>

          {/* Section 2: The Looop Habit Protocol */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>The Tiny Habit Protocol</Text>
            <Text style={styles.sectionParagraph}>{article.habitSolution}</Text>
          </View>

          {/* 3 Value Pillars */}
          <View style={styles.pillarRow}>
            <View style={styles.pillarCard}>
              <TrendingUp size={16} color="#059669" />
              <Text style={styles.pillarVal}>+{currencySymbol}{data.leakEstimatedCost.toLocaleString('en-IN')}</Text>
              <Text style={styles.pillarLabel}>Monthly Pool</Text>
            </View>

            <View style={styles.pillarCard}>
              <Brain size={16} color="#7C3AED" />
              <Text style={styles.pillarVal}>0 Guilt</Text>
              <Text style={styles.pillarLabel}>Tiny Habits</Text>
            </View>

            <View style={styles.pillarCard}>
              <Coins size={16} color="#0284C7" />
              <Text style={styles.pillarVal}>Auto-Vault</Text>
              <Text style={styles.pillarLabel}>Fund Dreams</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onProceedToHabit();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>Try My First Tiny AI Task</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FAF9F6',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FAF9F6',
  },
  aiGlowCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  loadingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: 24,
  },
  progressStepsList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
  },
  progressStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    flex: 1,
  },
  progressStepTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  scrollContent: {
    paddingVertical: 12,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  articleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  articleTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  articleTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  articleReadTime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  articleSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
  },
  leakCalloutBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 14,
    gap: 12,
  },
  leakCalloutIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leakCalloutLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.6,
  },
  leakCalloutAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#991B1B',
    marginTop: 2,
    marginBottom: 2,
  },
  leakCalloutSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#7F1D1D',
    lineHeight: 15,
  },
  sectionBlock: {
    gap: 6,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionParagraph: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 19,
  },
  pillarRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  pillarCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  pillarVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  pillarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  footer: {
    paddingVertical: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    height: 54,
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

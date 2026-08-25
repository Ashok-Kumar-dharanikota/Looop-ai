import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  BackHandler,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { getCurrencyDefaults, formatAmount } from '@/utils/currency-calibration';
import { AmbientGlow } from '@/features/auth/components/AmbientGlow';
import {
  MustPaymentItem,
  UserOnboardingAnswers,
  QuestionOption,
  OnboardingStep,
} from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DEFAULT_MUST_PAYMENTS: MustPaymentItem[] = [
  {
    id: 'rent_housing',
    name: 'House Rent & Maintenance',
    category: 'Housing',
    amount: 18000,
    iconName: 'Home',
  },
  {
    id: 'loan_emi',
    name: 'Home / Car / Personal EMI',
    category: 'Debt & Loans',
    amount: 15000,
    iconName: 'Building',
  },
  {
    id: 'family_support',
    name: 'Sending Money to Family / Parents',
    category: 'Family Care',
    amount: 10000,
    iconName: 'Heart',
  },
  {
    id: 'insurance_premiums',
    name: 'Health & Life Insurance',
    category: 'Protection',
    amount: 5000,
    iconName: 'ShieldCheck',
  },
  {
    id: 'education_tuition',
    name: 'School / Tuition Fees',
    category: 'Education',
    amount: 8000,
    iconName: 'GraduationCap',
  },
];

export const CHAPTER_META = [
  {
    index: 0,
    tagKey: 'onboarding.chapters.chapter1Tag',
    fallbackTag: 'CHAPTER 1 OF 3',
    titleKey: 'onboarding.chapters.chapter1Title',
    fallbackTitle: 'Cashflow Baseline',
    descKey: 'onboarding.chapters.chapter1Desc',
    fallbackDesc: 'Income & Fixed Commitments',
  },
  {
    index: 1,
    tagKey: 'onboarding.chapters.chapter2Tag',
    fallbackTag: 'CHAPTER 2 OF 3',
    titleKey: 'onboarding.chapters.chapter2Title',
    fallbackTitle: 'Spending Psychology',
    descKey: 'onboarding.chapters.chapter2Desc',
    fallbackDesc: 'Behavioral Triggers & Leaks',
  },
  {
    index: 2,
    tagKey: 'onboarding.chapters.chapter3Tag',
    fallbackTag: 'CHAPTER 3 OF 3',
    titleKey: 'onboarding.chapters.chapter3Title',
    fallbackTitle: 'Goals & Coaching',
    descKey: 'onboarding.chapters.chapter3Desc',
    fallbackDesc: 'Milestones & AI Persona',
  },
];

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // CHAPTER 1: Cashflow Baseline
  {
    id: 'role',
    chapterIndex: 0,
    type: 'choice',
    fieldKey: 'role',
    title: 'What best describes your work?',
    subtitle: 'Helps us calibrate your income frequency and spending rhythm',
    options: [
      { label: 'Working Professional', emoji: '💼', desc: 'Predictable monthly salaried cashflow' },
      { label: 'Freelancer / Creator', emoji: '💻', desc: 'Dynamic, variable client income' },
      { label: 'Business Owner', emoji: '🏢', desc: 'Scaling operations & personal reserves' },
      { label: 'Student / Early Career', emoji: '🎓', desc: 'Building mindful financial habits early' },
      { label: 'Homemaker', emoji: '🏡', desc: 'Managing household budgets & family goals' },
    ],
  },
  {
    id: 'earnings',
    chapterIndex: 0,
    type: 'earnings',
    title: 'Monthly Income & Savings Target',
    subtitle: 'We calculate your safe daily discretionary spend buffer',
  },
  {
    id: 'must_payments',
    chapterIndex: 0,
    type: 'must_payments',
    title: 'Fixed Monthly Obligations',
    subtitle: 'Rent, EMIs, and family support ring-fenced before daily spending',
  },

  // CHAPTER 2: Spending Leaks & Psychology
  {
    id: 'overspendingCategory',
    chapterIndex: 1,
    type: 'choice',
    fieldKey: 'overspendingCategory',
    title: 'Where does money seem to leak most?',
    subtitle: 'Our weekly behavioral diagnosis will focus habits here',
    options: [
      { label: 'Food & Dining', emoji: '🍔', desc: 'Midnight food deliveries, dining out & cafes' },
      { label: 'Shopping & Apparel', emoji: '🛍️', desc: 'Impulsive flash sales, gadgets & wardrobe' },
      { label: 'Cabs & Commute', emoji: '🚕', desc: 'Peak hour surge rides & daily cab rides' },
      { label: 'Entertainment & Outings', emoji: '🍿', desc: 'Movies, weekend parties & events' },
      { label: 'Unused Subscriptions', emoji: '📺', desc: 'Forgotten streaming apps & gym memberships' },
      { label: 'Travel & Getaways', emoji: '✈️', desc: 'Spontaneous weekend flights & stays' },
    ],
  },
  {
    id: 'buyingReflex',
    chapterIndex: 1,
    type: 'choice',
    fieldKey: 'buyingReflex',
    title: 'Before an impulse buy, what do you do?',
    subtitle: 'Understanding your purchase deliberation reflex',
    options: [
      { label: 'Buy Immediately', emoji: '⚡', desc: 'Instant gratification in the moment' },
      { label: 'Think for a Day', emoji: '⏳', desc: '24-hour cooling off period' },
      { label: 'Compare 3+ Options', emoji: '⚖️', desc: 'Value seeker hunting for best deals' },
      { label: 'Budget First', emoji: '📊', desc: 'Methodical allocator who checks balance' },
    ],
  },
  {
    id: 'frustration',
    chapterIndex: 1,
    type: 'choice',
    fieldKey: 'frustration',
    title: 'What frustrates you most about money?',
    subtitle: 'Looop is engineered to permanently solve this friction',
    options: [
      { label: "I don't know where my money goes", emoji: '🔍', desc: 'Frictionless micro-leaks draining salary' },
      { label: 'I forget to track expenses', emoji: '📝', desc: 'Manual spreadsheet tracking is exhausting' },
      { label: 'I struggle to save consistently', emoji: '📉', desc: 'Savings fluctuate wildly every single month' },
      { label: 'I make impulse purchases', emoji: '🛍️', desc: 'Spur-of-the-moment checkout clicks & regret' },
      { label: 'I feel anxiety checking bank balance', emoji: '🙈', desc: 'Uncertainty creates constant background stress' },
    ],
  },

  // CHAPTER 3: Goals & Coaching
  {
    id: 'primaryGoal',
    chapterIndex: 2,
    type: 'choice',
    fieldKey: 'primaryGoal',
    title: "What's your primary milestone goal?",
    subtitle: 'Every habit challenge and safe spend limit will protect this',
    options: [
      { label: 'Build Emergency Cushion', emoji: '🛡️', desc: '3–6 months of bulletproof living security' },
      { label: 'Save More Money', emoji: '💰', desc: 'Grow personal wealth and discretionary peace' },
      { label: 'Dream Vacation Fund', emoji: '✈️', desc: 'Guilt-free international travel & exploration' },
      { label: 'Vehicle / Bike Milestone', emoji: '🚗', desc: 'Down payment for dream car or bike' },
      { label: 'Become Debt-Free', emoji: '🔓', desc: 'Accelerate loan & credit card closures' },
      { label: 'Invest & Compound', emoji: '📈', desc: 'Long-term equity & asset building' },
    ],
  },
  {
    id: 'timeline',
    chapterIndex: 2,
    type: 'choice',
    fieldKey: 'timeline',
    title: 'When do you want to reach this goal?',
    subtitle: 'We pace your daily safe spend to guarantee this target date',
    options: [
      { label: 'Within 3 Months', emoji: '⚡', desc: 'High-focus fast track sprint' },
      { label: 'Within 6 Months', emoji: '🎯', desc: 'Balanced sustainable pace (Recommended)' },
      { label: 'Within 1 Year', emoji: '📅', desc: 'Steady compounding habit horizon' },
      { label: 'Within 3 Years', emoji: '🏔️', desc: 'Major long-term life milestone' },
    ],
  },
  {
    id: 'coachingTone',
    chapterIndex: 2,
    type: 'choice',
    fieldKey: 'coachingTone',
    title: 'Choose your AI coaching style',
    subtitle: 'How Looop communicates insights and weekly habit reviews',
    options: [
      { label: 'Friendly Coach', emoji: '🌱', desc: 'Supportive, encouraging, warm & constructive' },
      { label: 'Data Analyst', emoji: '📊', desc: 'Precise numbers, objective trends & pure logic' },
      { label: 'Strict Budget Mentor', emoji: '🎯', desc: 'Direct, disciplined accountability & tough love' },
      { label: 'Minimal Insights', emoji: '⚡', desc: 'Clean metrics with zero extra commentary' },
    ],
  },
];

interface StoryAct2QuestionnaireProps {
  currencySymbol: string;
  onCompleteAssessment: (answers: UserOnboardingAnswers) => void;
  onBackToPrevious?: () => void;
}

export const StoryAct2Questionnaire: React.FC<StoryAct2QuestionnaireProps> = ({
  currencySymbol,
  onCompleteAssessment,
  onBackToPrevious,
}) => {
  const { t } = useTranslation();
  const { currency } = useAppStore();
  const currencyConfig = useMemo(() => getCurrencyDefaults(currency), [currency]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Form State
  const [role, setRole] = useState('Working Professional');
  const [monthlyIncome, setMonthlyIncome] = useState(String(currencyConfig.defaultIncome));
  const [monthlySavingsTarget, setMonthlySavingsTarget] = useState(String(currencyConfig.defaultSavings));
  const [mustPayments, setMustPayments] = useState<MustPaymentItem[]>(currencyConfig.defaultMustPayments);
  const [primaryGoal, setPrimaryGoal] = useState('Build Emergency Cushion');
  const [timeline, setTimeline] = useState('Within 6 Months');
  const [frustration, setFrustration] = useState("I don't know where my money goes");
  const [buyingReflex, setBuyingReflex] = useState('Think for a Day');
  const [regretFrequency, setRegretFrequency] = useState('Sometimes');
  const [overspendingCategory, setOverspendingCategory] = useState('Food & Dining');
  const [trackingFrequency, setTrackingFrequency] = useState('Occasionally');
  const [currentManagementTool, setCurrentManagementTool] = useState('Mental Tracking');
  const [balanceCheckFrequency, setBalanceCheckFrequency] = useState('Weekly');
  const [importantCategories, setImportantCategories] = useState<string[]>([
    'Food & Dining',
    'Shopping',
    'Bills',
  ]);
  const [insightFrequency, setInsightFrequency] = useState('Weekly');
  const [coachingTone, setCoachingTone] = useState('Friendly Coach');

  // Custom Must-Payment input state
  const [newObligationName, setNewObligationName] = useState('');
  const [newObligationAmount, setNewObligationAmount] = useState('');
  const [isAddingObligation, setIsAddingObligation] = useState(false);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const currentChapter = CHAPTER_META[currentStep.chapterIndex];

  // Calculated values
  const incomeNum = useMemo(() => {
    return parseFloat(monthlyIncome.replace(/[^0-9.]/g, '')) || currencyConfig.defaultIncome;
  }, [monthlyIncome, currencyConfig.defaultIncome]);

  const savingsNum = useMemo(() => {
    return parseFloat(monthlySavingsTarget.replace(/[^0-9.]/g, '')) || currencyConfig.defaultSavings;
  }, [monthlySavingsTarget, currencyConfig.defaultSavings]);

  const totalMustPayments = useMemo(() => {
    return mustPayments.reduce((acc, item) => acc + item.amount, 0);
  }, [mustPayments]);

  const safeDiscretionaryPool = useMemo(() => {
    return Math.max(0, incomeNum - savingsNum - totalMustPayments);
  }, [incomeNum, savingsNum, totalMustPayments]);

  const safeDailySpend = useMemo(() => {
    return Math.max(100, Math.round(safeDiscretionaryPool / 30));
  }, [safeDiscretionaryPool]);

  // Handle Option Selection
  const handleSelectOption = (fieldKey: keyof UserOnboardingAnswers | undefined, value: string) => {
    Haptics.selectionAsync();
    switch (fieldKey) {
      case 'role':
        setRole(value);
        break;
      case 'overspendingCategory':
        setOverspendingCategory(value);
        break;
      case 'buyingReflex':
        setBuyingReflex(value);
        break;
      case 'frustration':
        setFrustration(value);
        break;
      case 'primaryGoal':
        setPrimaryGoal(value);
        break;
      case 'timeline':
        setTimeline(value);
        break;
      case 'coachingTone':
        setCoachingTone(value);
        break;
    }
  };

  const getSelectedValue = (fieldKey?: keyof UserOnboardingAnswers) => {
    switch (fieldKey) {
      case 'role':
        return role;
      case 'overspendingCategory':
        return overspendingCategory;
      case 'buyingReflex':
        return buyingReflex;
      case 'frustration':
        return frustration;
      case 'primaryGoal':
        return primaryGoal;
      case 'timeline':
        return timeline;
      case 'coachingTone':
        return coachingTone;
      default:
        return '';
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onCompleteAssessment({
        role,
        monthlyIncome,
        monthlySavingsTarget,
        mustPayments,
        totalMustPayments,
        primaryGoal,
        timeline,
        frustration,
        buyingReflex,
        regretFrequency,
        overspendingCategory,
        trackingFrequency,
        currentManagementTool,
        balanceCheckFrequency,
        importantCategories,
        insightFrequency,
        coachingTone,
      });
    }
  };

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      Haptics.selectionAsync();
      setCurrentStepIndex((prev) => prev - 1);
    } else if (onBackToPrevious) {
      onBackToPrevious();
    }
  }, [currentStepIndex, onBackToPrevious]);

  useEffect(() => {
    const onBackPress = () => {
      if (currentStepIndex > 0) {
        handlePrev();
        return true;
      }
      // Keep on step 0 rather than popping to index and causing redirect loop
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [currentStepIndex, handlePrev]);

  const handleUpdateObligationAmount = (id: string, newAmtStr: string) => {
    const cleanNum = parseFloat(newAmtStr.replace(/[^0-9.]/g, '')) || 0;
    setMustPayments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: cleanNum } : item))
    );
  };

  const handleToggleObligation = (id: string) => {
    Haptics.selectionAsync();
    setMustPayments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: item.amount > 0 ? 0 : 5000 } : item
      )
    );
  };

  const handleAddCustomObligation = () => {
    if (!newObligationName.trim()) return;
    const cleanAmt = parseFloat(newObligationAmount.replace(/[^0-9.]/g, '')) || 5000;
    const newItem: MustPaymentItem = {
      id: `custom_${Date.now()}`,
      name: newObligationName.trim(),
      category: 'Custom',
      amount: cleanAmt,
      iconName: 'Receipt',
      isCustom: true,
    };
    setMustPayments((prev) => [...prev, newItem]);
    setNewObligationName('');
    setNewObligationAmount('');
    setIsAddingObligation(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteObligation = (id: string) => {
    Haptics.selectionAsync();
    setMustPayments((prev) => prev.filter((item) => item.id !== id));
  };

  const progressPercent = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <View style={styles.container}>
      {/* Warm Ambient Glow Backdrop matching AuthScreen */}
      <AmbientGlow />

      {/* Top Navigation & Progress Header */}
      <View style={styles.topHeader}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrev}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={18} color="#0F172A" strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.chapterBadge}>
            <View style={styles.chapterDot} />
            <Text style={styles.chapterBadgeText}>
              {t(currentChapter.tagKey, currentChapter.fallbackTag)}
            </Text>
          </View>

          <Text style={styles.stepCounterText}>
            {currentStepIndex + 1} / {ONBOARDING_STEPS.length}
          </Text>
        </View>

        {/* Segmented Progress Track */}
        <View style={styles.progressTrackBg}>
          <View style={[styles.progressTrackFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Main Form Scroll View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          key={currentStep.id}
          entering={FadeInRight.duration(240)}
          exiting={FadeOutLeft.duration(180)}
          style={styles.stepContent}
        >
          {/* Section Chapter Title & Subtitle */}
          <View style={styles.headingBox}>
            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>
          </View>

          {/* STEP TYPE 1: CHOICE SELECTION TILES */}
          {currentStep.type === 'choice' && currentStep.options && (
            <View style={styles.optionsList}>
              {currentStep.options.map((opt) => {
                const isSelected = getSelectedValue(currentStep.fieldKey) === opt.label;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    onPress={() => handleSelectOption(currentStep.fieldKey, opt.label)}
                    activeOpacity={0.82}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  >
                    <View style={[styles.emojiOrb, isSelected && styles.emojiOrbSelected]}>
                      <Text style={styles.emojiText}>{opt.emoji}</Text>
                    </View>

                    <View style={styles.optionTextCol}>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {opt.label}
                      </Text>
                      {opt.desc && (
                        <Text
                          style={[styles.optionDesc, isSelected && styles.optionDescSelected]}
                          numberOfLines={2}
                        >
                          {opt.desc}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}
                    >
                      {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* STEP TYPE 2: EARNINGS & SAVINGS CALIBRATION */}
          {currentStep.type === 'earnings' && (
            <View style={styles.earningsWrapper}>
              {/* Monthly Income Card */}
              <View style={styles.inputCard}>
                <Text style={styles.inputCardLabel}>
                  {t('onboarding.quiz.monthlyIncomeLabel', 'MONTHLY TAKE-HOME INCOME')}
                </Text>
                <View style={styles.amountInputRow}>
                  <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                  <TextInput
                    value={monthlyIncome}
                    onChangeText={setMonthlyIncome}
                    keyboardType="numeric"
                    style={styles.heroAmountInput}
                    selectionColor="#FF6B00"
                    placeholder="75000"
                    placeholderTextColor="#CBD5E1"
                  />
                </View>

                {/* Quick Presets */}
                <View style={styles.presetsRow}>
                  {currencyConfig.incomePresets.map((valNum) => {
                    const val = String(valNum);
                    const isSelected = monthlyIncome === val;
                    return (
                      <TouchableOpacity
                        key={val}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setMonthlyIncome(val);
                        }}
                        style={[
                          styles.presetChip,
                          isSelected && styles.presetChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.presetChipText,
                            isSelected && styles.presetChipTextActive,
                          ]}
                        >
                          {currencySymbol}
                          {formatAmount(valNum, currency)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Monthly Savings Target Card */}
              <View style={styles.inputCard}>
                <View style={styles.savingsHeaderRow}>
                  <Text style={styles.inputCardLabel}>
                    {t('onboarding.quiz.monthlySavingsLabel', 'MONTHLY WEALTH SAVINGS TARGET')}
                  </Text>
                  <Text style={styles.savingsRatioBadge}>
                    {Math.round((savingsNum / Math.max(incomeNum, 1)) * 100)}%{' '}
                    {t('onboarding.quiz.percentOfIncome', 'of income')}
                  </Text>
                </View>

                <View style={styles.amountInputRow}>
                  <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                  <TextInput
                    value={monthlySavingsTarget}
                    onChangeText={setMonthlySavingsTarget}
                    keyboardType="numeric"
                    style={styles.heroAmountInput}
                    selectionColor="#FF6B00"
                    placeholder={String(currencyConfig.defaultSavings)}
                    placeholderTextColor="#CBD5E1"
                  />
                </View>

                {/* Quick Percentage Presets */}
                <View style={styles.presetsRow}>
                  {currencyConfig.savingsPresets.map((pct) => {
                    const calculated = String(Math.round((incomeNum * pct) / 100));
                    const isSelected = monthlySavingsTarget === calculated;
                    return (
                      <TouchableOpacity
                        key={pct}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setMonthlySavingsTarget(calculated);
                        }}
                        style={[styles.presetChip, isSelected && styles.presetChipActive]}
                      >
                        <Text
                          style={[
                            styles.presetChipText,
                            isSelected && styles.presetChipTextActive,
                          ]}
                        >
                          {pct}% ({currencySymbol}
                          {formatAmount(parseInt(calculated, 10), currency)})
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Live Safe Spend Peek */}
              <View style={styles.liveSummaryBox}>
                <View style={styles.liveSummaryLeft}>
                  <Sparkles size={16} color="#FF6B00" />
                  <Text style={styles.liveSummaryTitle}>
                    {t('onboarding.quiz.safePoolTitle', 'Estimated Safe Discretionary Pool')}
                  </Text>
                </View>
                <Text style={styles.liveSummaryAmount}>
                  {currencySymbol}
                  {formatAmount(Math.max(0, incomeNum - savingsNum), currency)} / mo
                </Text>
              </View>
            </View>
          )}

          {/* STEP TYPE 3: NON-NEGOTIABLE MUST PAYMENTS */}
          {currentStep.type === 'must_payments' && (
            <View style={styles.mustPaymentsWrapper}>
              <View style={styles.mustHeaderBox}>
                <Text style={styles.mustHeaderSub}>
                  {t('onboarding.quiz.totalFixedSpends', 'Total Fixed Spends:')}{' '}
                  <Text style={styles.mustHeaderBold}>
                    {currencySymbol}
                    {formatAmount(totalMustPayments, currency)}
                  </Text>
                </Text>
                <View style={styles.dailySafePill}>
                  <Zap size={12} color="#059669" />
                  <Text style={styles.dailySafePillText}>
                    {t('onboarding.quiz.safeDailyPill', '{{currency}}{{amount}}/day safe spend', {
                      currency: currencySymbol,
                      amount: formatAmount(safeDailySpend, currency),
                    })}
                  </Text>
                </View>
              </View>

              {/* Obligations List */}
              <View style={styles.obligationsList}>
                {mustPayments.map((item) => {
                  const isActive = item.amount > 0;
                  return (
                    <View
                      key={item.id}
                      style={[styles.obligationRow, !isActive && styles.obligationRowInactive]}
                    >
                      <TouchableOpacity
                        onPress={() => handleToggleObligation(item.id)}
                        style={styles.obligationCheckTouch}
                      >
                        <View
                          style={[
                            styles.miniCheckCircle,
                            isActive && styles.miniCheckCircleActive,
                          ]}
                        >
                          {isActive && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.obligationName,
                              !isActive && styles.obligationNameInactive,
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.obligationCategory}>{item.category}</Text>
                        </View>
                      </TouchableOpacity>

                      {isActive && (
                        <View style={styles.obligationInputBox}>
                          <Text style={styles.obligationCurrency}>{currencySymbol}</Text>
                          <TextInput
                            value={item.amount ? String(item.amount) : ''}
                            onChangeText={(text) => handleUpdateObligationAmount(item.id, text)}
                            keyboardType="numeric"
                            style={styles.obligationTextInput}
                            selectionColor="#FF6B00"
                            placeholder="0"
                          />
                        </View>
                      )}

                      {item.isCustom && (
                        <TouchableOpacity
                          onPress={() => handleDeleteObligation(item.id)}
                          style={styles.deleteBtn}
                        >
                          <Trash2 size={15} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Add Custom Obligation Trigger */}
              {isAddingObligation ? (
                <View style={styles.addCustomBox}>
                  <Text style={styles.addCustomTitle}>
                    {t('onboarding.quiz.customObligationTitle', 'Add Custom Fixed Obligation')}
                  </Text>
                  <TextInput
                    value={newObligationName}
                    onChangeText={setNewObligationName}
                    placeholder={t(
                      'onboarding.quiz.customObligationPlaceholder',
                      'e.g. Cook / Maid Salary, Wifi bill'
                    )}
                    placeholderTextColor="#94A3B8"
                    style={styles.customNameInput}
                  />
                  <View style={styles.customAmountRow}>
                    <Text style={styles.obligationCurrency}>{currencySymbol}</Text>
                    <TextInput
                      value={newObligationAmount}
                      onChangeText={setNewObligationAmount}
                      placeholder={t('onboarding.quiz.amountPlaceholder', 'Amount (e.g. 4000)')}
                      keyboardType="numeric"
                      style={styles.customAmountInput}
                    />
                  </View>
                  <View style={styles.customActionRow}>
                    <TouchableOpacity
                      onPress={() => setIsAddingObligation(false)}
                      style={styles.customCancelBtn}
                    >
                      <Text style={styles.customCancelText}>
                        {t('onboarding.buttons.cancel', 'Cancel')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleAddCustomObligation}
                      style={styles.customSaveBtn}
                    >
                      <Text style={styles.customSaveText}>
                        {t('onboarding.buttons.addObligation', 'Add Obligation')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsAddingObligation(true)}
                  style={styles.addTriggerBtn}
                >
                  <Plus size={16} color="#FF6B00" />
                  <Text style={styles.addTriggerText}>
                    {t('onboarding.buttons.addAnotherObligation', 'Add Another Obligation')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.88}
          style={styles.continueButtonPressable}
        >
          <LinearGradient
            colors={['#FF7A00', '#FF4D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueButtonText}>
              {currentStepIndex === ONBOARDING_STEPS.length - 1
                ? t('onboarding.buttons.generateBlueprint', 'Generate AI Blueprint')
                : t('onboarding.buttons.continue', 'Continue')}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.4} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    justifyContent: 'space-between',
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chapterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  chapterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B00',
  },
  chapterBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    color: '#FF6B00',
    letterSpacing: 0.6,
  },
  stepCounterText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#94A3B8',
  },
  progressTrackBg: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  stepContent: {
    gap: 16,
  },
  headingBox: {
    gap: 6,
    marginBottom: 4,
  },
  stepTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 23,
    color: '#0F172A',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.3,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFFBF7',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  emojiOrb: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emojiOrbSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  emojiText: {
    fontSize: 21,
  },
  optionTextCol: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14.5,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  optionLabelSelected: {
    color: '#EA580C',
  },
  optionDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  optionDescSelected: {
    color: '#9A3412',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  earningsWrapper: {
    gap: 14,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputCardLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  savingsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savingsRatioBadge: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  currencyPrefix: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 26,
    color: '#0F172A',
    marginRight: 6,
  },
  heroAmountInput: {
    flex: 1,
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: '#0F172A',
    padding: 0,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FF6B00',
  },
  presetChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#64748B',
  },
  presetChipTextActive: {
    color: '#FF6B00',
  },
  liveSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  liveSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveSummaryTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#9A3412',
  },
  liveSummaryAmount: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: '#EA580C',
  },
  mustPaymentsWrapper: {
    gap: 12,
  },
  mustHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mustHeaderSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  mustHeaderBold: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
  dailySafePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dailySafePillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#059669',
  },
  obligationsList: {
    gap: 8,
  },
  obligationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  obligationRowInactive: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  obligationCheckTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCheckCircleActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  obligationName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: '#0F172A',
  },
  obligationNameInactive: {
    color: '#94A3B8',
  },
  obligationCategory: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#94A3B8',
  },
  obligationInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: 90,
  },
  obligationCurrency: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  obligationTextInput: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
    padding: 0,
  },
  deleteBtn: {
    padding: 6,
  },
  addTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FFD8A8',
  },
  addTriggerText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: '#EA580C',
  },
  addCustomBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#FFD8A8',
    gap: 10,
  },
  addCustomTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: '#0F172A',
  },
  customNameInput: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customAmountInput: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
    marginLeft: 6,
    padding: 0,
  },
  customActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  customCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  customCancelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#64748B',
  },
  customSaveBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  customSaveText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  bottomActionBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FAF9F6',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  continueButtonPressable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  continueGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15.5,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

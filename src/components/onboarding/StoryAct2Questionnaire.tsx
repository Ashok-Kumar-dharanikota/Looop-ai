import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Building,
  Heart,
  Home,
  ShieldCheck,
  GraduationCap,
  Receipt,
  Sparkles,
  Wallet,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface MustPaymentItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  iconName?: string;
  isCustom?: boolean;
}

export interface UserAssessmentData {
  leakCategory: string;
  leakCategoryName: string;
  leakEstimatedCost: number;
  frustration: string;
  primaryGoal: string;
  monthlyIncome: string;
  monthlySavingsTarget: string;
  mustPayments: MustPaymentItem[];
  totalMustPayments: number;
}

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

export interface UserOnboardingAnswers {
  role: string;
  monthlyIncome: string;
  monthlySavingsTarget: string;
  mustPayments: MustPaymentItem[];
  totalMustPayments: number;
  primaryGoal: string;
  timeline: string;
  frustration: string;
  buyingReflex: string;
  regretFrequency: string;
  overspendingCategory: string;
  trackingFrequency: string;
  currentManagementTool: string;
  balanceCheckFrequency: string;
  importantCategories: string[];
  insightFrequency: string;
  coachingTone: string;
}

export interface QuestionOption {
  label: string;
  emoji: string;
  desc?: string;
}

type StepType = 'choice' | 'earnings' | 'must_payments';

export interface OnboardingStep {
  id: string;
  type: StepType;
  title: string;
  subtitle: string;
  isMultiSelect?: boolean;
  fieldKey?: keyof UserOnboardingAnswers;
  options?: QuestionOption[];
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'role',
    type: 'choice',
    fieldKey: 'role',
    title: 'What best describes you?',
    subtitle: 'Help us calibrate your cashflow profile',
    isMultiSelect: false,
    options: [
      { label: 'Student', emoji: '🎓', desc: 'Building early financial habits' },
      { label: 'Working Professional', emoji: '💼', desc: 'Managing regular monthly salary' },
      { label: 'Freelancer', emoji: '💻', desc: 'Navigating variable cash flow' },
      { label: 'Business Owner', emoji: '🏢', desc: 'Scaling business & personal funds' },
      { label: 'Homemaker', emoji: '🏡', desc: 'Optimizing household budgeting' },
    ],
  },
  {
    id: 'earnings',
    type: 'earnings',
    title: 'Monthly Income & Savings Target',
    subtitle: 'Calculate your real daily safe spend buffer',
  },
  {
    id: 'must_payments',
    type: 'must_payments',
    title: 'Non-Negotiable Monthly Spends',
    subtitle: 'Fixed obligations (Rent, EMIs, etc.) paid before daily spending',
  },
  {
    id: 'primaryGoal',
    type: 'choice',
    fieldKey: 'primaryGoal',
    title: "What's your biggest financial goal right now?",
    subtitle: 'Every decision we make will protect this priority',
    isMultiSelect: false,
    options: [
      { label: 'Save More Money', emoji: '💰', desc: 'Grow personal wealth cushion' },
      { label: 'Build Emergency Fund', emoji: '🛡️', desc: 'Create 3-6 months of security' },
      { label: 'Buy a Vehicle', emoji: '🚗', desc: 'Fund dream car or bike' },
      { label: 'Buy a Home', emoji: '🏠', desc: 'Down payment milestone' },
      { label: 'Travel More', emoji: '✈️', desc: 'Explore the world guilt-free' },
      { label: 'Invest More', emoji: '📈', desc: 'Compound long-term wealth' },
      { label: 'Become Debt-Free', emoji: '🔓', desc: 'Clear loans and EMIs fast' },
    ],
  },
  {
    id: 'timeline',
    type: 'choice',
    fieldKey: 'timeline',
    title: 'When do you want to achieve this goal?',
    subtitle: 'We will pace your daily safe spend accordingly',
    isMultiSelect: false,
    options: [
      { label: 'Within 3 Months', emoji: '⚡', desc: 'Fast-track sprint' },
      { label: 'Within 6 Months', emoji: '🎯', desc: 'Balanced target pace' },
      { label: 'Within 1 Year', emoji: '📅', desc: 'Sustainable habit horizon' },
      { label: 'Within 3 Years', emoji: '🏔️', desc: 'Long-term major milestone' },
      { label: 'No Specific Timeline', emoji: '🌱', desc: 'Continuous mindful growth' },
    ],
  },
  {
    id: 'frustration',
    type: 'choice',
    fieldKey: 'frustration',
    title: 'What frustrates you most about money?',
    subtitle: 'Looop is designed to eliminate this exact friction',
    isMultiSelect: false,
    options: [
      { label: "I don't know where my money goes", emoji: '🔍', desc: 'Invisible spending leaks' },
      { label: 'I spend too much', emoji: '💸', desc: 'Difficulty staying within budget' },
      { label: 'I forget to track expenses', emoji: '📝', desc: 'Manual tracking is exhausting' },
      { label: 'I struggle to save consistently', emoji: '📉', desc: 'Savings fluctuate every month' },
      { label: 'I overspend on food delivery', emoji: '🍔', desc: 'Convenience apps draining wealth' },
      { label: 'I make impulse purchases', emoji: '🛍️', desc: 'Spur-of-the-moment checkout clicks' },
    ],
  },
  {
    id: 'buyingReflex',
    type: 'choice',
    fieldKey: 'buyingReflex',
    title: 'Before buying something expensive, what do you usually do?',
    subtitle: 'Understanding your purchase deliberation style',
    isMultiSelect: false,
    options: [
      { label: 'Buy Immediately', emoji: '⚡', desc: 'Action-oriented spender' },
      { label: 'Think for a Day', emoji: '⏳', desc: '24-hour cooling-off reflex' },
      { label: 'Compare Multiple Options', emoji: '⚖️', desc: 'Value & deal seeker' },
      { label: 'Plan and Budget First', emoji: '📊', desc: 'Methodical allocator' },
    ],
  },
  {
    id: 'regretFrequency',
    type: 'choice',
    fieldKey: 'regretFrequency',
    title: 'How often do you regret purchases?',
    subtitle: 'We will help you eliminate post-purchase remorse',
    isMultiSelect: false,
    options: [
      { label: 'Often', emoji: '🤦‍♂️', desc: 'Frequent emotional spend regret' },
      { label: 'Sometimes', emoji: '🤔', desc: 'Occasional late-night order regret' },
      { label: 'Rarely', emoji: '✨', desc: 'Most purchases feel intentional' },
      { label: 'Never', emoji: '🎯', desc: 'Highly disciplined spender' },
    ],
  },
  {
    id: 'overspendingCategory',
    type: 'choice',
    fieldKey: 'overspendingCategory',
    title: 'Which category causes most of your overspending?',
    subtitle: 'Our weekly behavioral diagnosis will focus here',
    isMultiSelect: false,
    options: [
      { label: 'Food & Dining', emoji: '🍔', desc: 'Dining out & food delivery' },
      { label: 'Shopping', emoji: '🛍️', desc: 'Apparel, tech gadgets & sales' },
      { label: 'Travel', emoji: '✈️', desc: 'Weekend trips & bookings' },
      { label: 'Entertainment', emoji: '🍿', desc: 'Movies, events & outings' },
      { label: 'Subscriptions', emoji: '📺', desc: 'Forgotten recurring services' },
      { label: 'Transport', emoji: '🚕', desc: 'Peak hour cabs & auto rides' },
      { label: 'Other', emoji: '🏷️', desc: 'Miscellaneous lifestyle spends' },
    ],
  },
  {
    id: 'trackingFrequency',
    type: 'choice',
    fieldKey: 'trackingFrequency',
    title: 'How often do you currently track your expenses?',
    subtitle: 'Looop makes logging effortless via voice or keypad',
    isMultiSelect: false,
    options: [
      { label: 'Never', emoji: '❌', desc: 'Starting fresh today' },
      { label: 'Occasionally', emoji: '🌤️', desc: 'When money feels tight' },
      { label: 'Weekly', emoji: '📅', desc: 'End of week review' },
      { label: 'Daily', emoji: '⚡', desc: 'In the moment logging' },
    ],
  },
  {
    id: 'currentManagementTool',
    type: 'choice',
    fieldKey: 'currentManagementTool',
    title: 'How do you currently manage your money?',
    subtitle: 'We will upgrade your financial clarity',
    isMultiSelect: false,
    options: [
      { label: "I Don't Track It", emoji: '🤷‍♂️', desc: 'Zero tracking system currently' },
      { label: 'Notes App', emoji: '📱', desc: 'Quick messy text notes' },
      { label: 'Spreadsheet', emoji: '📑', desc: 'Tedious manual Excel/Sheets' },
      { label: 'Another Expense App', emoji: '📲', desc: 'Clunky or ad-heavy tools' },
      { label: 'Mental Tracking', emoji: '🧠', desc: 'Rough estimates in head' },
    ],
  },
  {
    id: 'balanceCheckFrequency',
    type: 'choice',
    fieldKey: 'balanceCheckFrequency',
    title: 'How often do you check your bank balance?',
    subtitle: 'Healthy balance visibility removes money anxiety',
    isMultiSelect: false,
    options: [
      { label: 'Daily', emoji: '👀', desc: 'Constant vigilance' },
      { label: 'Weekly', emoji: '🗓️', desc: 'Regular check-ins' },
      { label: 'Monthly', emoji: '📅', desc: 'Salary credit day' },
      { label: 'Only When Needed', emoji: '🙈', desc: 'Avoid looking until necessary' },
    ],
  },
  {
    id: 'importantCategories',
    type: 'choice',
    fieldKey: 'importantCategories',
    title: 'Select the categories that matter most to you',
    subtitle: 'Select all categories you want tailored tracking for',
    isMultiSelect: true,
    options: [
      { label: 'Food & Dining', emoji: '🍔' },
      { label: 'Transport', emoji: '🚕' },
      { label: 'Shopping', emoji: '🛍️' },
      { label: 'Bills', emoji: '💡' },
      { label: 'Entertainment', emoji: '🍿' },
      { label: 'Travel', emoji: '✈️' },
      { label: 'Health', emoji: '💊' },
      { label: 'Education', emoji: '📚' },
      { label: 'Family', emoji: '👨‍👩‍👧' },
      { label: 'Investments', emoji: '📈' },
    ],
  },
  {
    id: 'insightFrequency',
    type: 'choice',
    fieldKey: 'insightFrequency',
    title: 'How often would you like Looop to generate insights?',
    subtitle: 'Tailored behavioral reviews delivered to your phone',
    isMultiSelect: false,
    options: [
      { label: 'Daily', emoji: '☀️', desc: 'Morning safe spend glance' },
      { label: 'Weekly', emoji: '📖', desc: 'Sunday evening behavioral essay' },
      { label: 'Monthly', emoji: '📊', desc: 'End of month wealth summary' },
      { label: 'Only When I Ask', emoji: '🤫', desc: 'On-demand reports only' },
    ],
  },
  {
    id: 'coachingTone',
    type: 'choice',
    fieldKey: 'coachingTone',
    title: 'How would you like Looop to communicate with you?',
    subtitle: 'Choose your financial coaching tone',
    isMultiSelect: false,
    options: [
      { label: 'Friendly Coach', emoji: '🌱', desc: 'Encouraging, supportive & warm' },
      { label: 'Professional Analyst', emoji: '📊', desc: 'Data-driven, precise & objective' },
      { label: 'Strict Budget Mentor', emoji: '🎯', desc: 'Direct, disciplined & accountable' },
      { label: 'Minimal Insights', emoji: '⚡', desc: 'Clean numbers, zero extra commentary' },
    ],
  },
];

interface StoryAct2QuestionnaireProps {
  currencySymbol: string;
  onCompleteAssessment: (answers: UserOnboardingAnswers) => void;
  onBackToPrevious?: () => void;
}

const getObligationIcon = (iconName?: string) => {
  const props = { size: 18, color: '#7C3AED' };
  switch (iconName) {
    case 'Building':
      return <Building {...props} color="#6366F1" />;
    case 'Heart':
      return <Heart {...props} color="#EC4899" />;
    case 'Home':
      return <Home {...props} color="#D97706" />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} color="#059669" />;
    case 'GraduationCap':
      return <GraduationCap {...props} color="#7C3AED" />;
    default:
      return <Receipt {...props} color="#64748B" />;
  }
};

export const StoryAct2Questionnaire: React.FC<StoryAct2QuestionnaireProps> = ({
  currencySymbol,
  onCompleteAssessment,
  onBackToPrevious,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for Income & Savings
  const [monthlyIncome, setMonthlyIncome] = useState('75000');
  const [monthlySavings, setMonthlySavings] = useState('15000');

  // State for Must Payments
  const [selectedObligations, setSelectedObligations] = useState<Record<string, boolean>>({
    rent_housing: true,
    loan_emi: false,
    family_support: false,
    insurance_premiums: false,
    education_tuition: false,
  });
  const [obligationAmounts, setObligationAmounts] = useState<Record<string, string>>({
    rent_housing: '18000',
    loan_emi: '15000',
    family_support: '10000',
    insurance_premiums: '5000',
    education_tuition: '8000',
  });
  const [customObligations, setCustomObligations] = useState<MustPaymentItem[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAmt, setCustomAmt] = useState('');

  // General answers
  const [answers, setAnswers] = useState<UserOnboardingAnswers>({
    role: '',
    monthlyIncome: '75000',
    monthlySavingsTarget: '15000',
    mustPayments: [],
    totalMustPayments: 18000,
    primaryGoal: '',
    timeline: '',
    frustration: '',
    buyingReflex: '',
    regretFrequency: '',
    overspendingCategory: '',
    trackingFrequency: '',
    currentManagementTool: '',
    balanceCheckFrequency: '',
    importantCategories: ['Food & Dining', 'Shopping', 'Bills'],
    insightFrequency: 'Weekly',
    coachingTone: 'Friendly Coach',
  });

  const [selectedMulti, setSelectedMulti] = useState<string[]>([
    'Food & Dining',
    'Shopping',
    'Bills',
  ]);

  const currentStep = ONBOARDING_STEPS[currentIndex];
  const progressRatio = (currentIndex + 1) / ONBOARDING_STEPS.length;
  const progressWidth = useSharedValue(progressRatio);

  useEffect(() => {
    progressWidth.value = withTiming(progressRatio, { duration: 240 });
  }, [currentIndex, progressRatio, progressWidth]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  // Calculate active must payments total
  const totalMustPayments = useMemo(() => {
    let sum = 0;
    DEFAULT_MUST_PAYMENTS.forEach((item) => {
      if (selectedObligations[item.id]) {
        const raw = obligationAmounts[item.id] || String(item.amount);
        sum += parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
      }
    });
    customObligations.forEach((item) => {
      if (selectedObligations[item.id]) {
        const raw = obligationAmounts[item.id] || String(item.amount);
        sum += parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
      }
    });
    return sum;
  }, [selectedObligations, obligationAmounts, customObligations]);

  const handleNextStep = (updatedAnswers: UserOnboardingAnswers) => {
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onCompleteAssessment(updatedAnswers);
    }
  };

  const handleSelectChoiceOption = (optionLabel: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentStep.isMultiSelect) {
      setSelectedMulti((prev) =>
        prev.includes(optionLabel)
          ? prev.filter((item) => item !== optionLabel)
          : [...prev, optionLabel]
      );
      return;
    }

    if (currentStep.fieldKey) {
      const updated = { ...answers, [currentStep.fieldKey]: optionLabel };
      setAnswers(updated);
      setTimeout(() => handleNextStep(updated), 180);
    }
  };

  const handleEarningsContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updated = {
      ...answers,
      monthlyIncome: monthlyIncome || '75000',
      monthlySavingsTarget: monthlySavings || '15000',
    };
    setAnswers(updated);
    handleNextStep(updated);
  };

  const handleMustPaymentsContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const activeList: MustPaymentItem[] = [];
    DEFAULT_MUST_PAYMENTS.forEach((item) => {
      if (selectedObligations[item.id]) {
        const raw = obligationAmounts[item.id] || String(item.amount);
        activeList.push({
          ...item,
          amount: parseFloat(raw.replace(/[^0-9.]/g, '')) || item.amount,
        });
      }
    });
    customObligations.forEach((item) => {
      if (selectedObligations[item.id]) {
        const raw = obligationAmounts[item.id] || String(item.amount);
        activeList.push({
          ...item,
          amount: parseFloat(raw.replace(/[^0-9.]/g, '')) || item.amount,
        });
      }
    });

    const updated = {
      ...answers,
      mustPayments: activeList,
      totalMustPayments,
    };
    setAnswers(updated);
    handleNextStep(updated);
  };

  const handleMultiChoiceContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updated = {
      ...answers,
      importantCategories: selectedMulti.length > 0 ? selectedMulti : ['Food & Dining', 'Bills'],
    };
    setAnswers(updated);
    handleNextStep(updated);
  };

  const handleAddCustomObligation = () => {
    if (!customName.trim()) return;
    const parsedAmt = parseFloat(customAmt.replace(/[^0-9.]/g, '')) || 0;
    const newId = `custom_${Date.now()}`;
    const newItem: MustPaymentItem = {
      id: newId,
      name: customName.trim(),
      category: 'Custom Obligation',
      amount: parsedAmt,
      iconName: 'Receipt',
      isCustom: true,
    };

    setCustomObligations((prev) => [...prev, newItem]);
    setSelectedObligations((prev) => ({ ...prev, [newId]: true }));
    setObligationAmounts((prev) => ({ ...prev, [newId]: String(parsedAmt) }));
    setCustomName('');
    setCustomAmt('');
    setIsAddingCustom(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteCustomObligation = (id: string) => {
    setCustomObligations((prev) => prev.filter((i) => i.id !== id));
    setSelectedObligations((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleBack = () => {
    Haptics.selectionAsync();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (onBackToPrevious) {
      onBackToPrevious();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header & Cal AI Segmented Progress Bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to previous question"
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        {/* Top Progress Track */}
        <View style={styles.progressTrackBg}>
          <Animated.View style={[styles.progressTrackFill, progressAnimatedStyle]} />
        </View>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{ONBOARDING_STEPS.length}
          </Text>
        </View>
      </View>

      {/* Main Step Surface */}
      <Animated.View
        key={currentStep.id}
        entering={FadeInRight.duration(240)}
        exiting={FadeOutLeft.duration(180)}
        style={styles.stepSurface}
      >
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>

        {/* STEP TYPE 1: Standard Choice List */}
        {currentStep.type === 'choice' && currentStep.options && (
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {currentStep.options.map((option) => {
              const isSelected = currentStep.isMultiSelect
                ? selectedMulti.includes(option.label)
                : currentStep.fieldKey && answers[currentStep.fieldKey] === option.label;

              return (
                <TouchableOpacity
                  key={option.label}
                  activeOpacity={0.8}
                  onPress={() => handleSelectChoiceOption(option.label)}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  accessibilityRole={currentStep.isMultiSelect ? 'checkbox' : 'radio'}
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={option.label}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.emojiContainer}>
                      <Text style={styles.emojiText}>{option.emoji}</Text>
                    </View>
                    <View style={styles.optionTextBox}>
                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {option.desc && (
                        <Text style={styles.optionDesc}>{option.desc}</Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.indicatorCircle,
                      isSelected && styles.indicatorCircleSelected,
                    ]}
                  >
                    {isSelected && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* STEP TYPE 2: Monthly Earnings & Savings Input */}
        {currentStep.type === 'earnings' && (
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Monthly Income Card */}
            <View style={styles.inputSectionCard}>
              <View style={styles.inputCardHeader}>
                <Wallet size={16} color="#7C3AED" />
                <Text style={styles.inputCardTitle}>Monthly Take-Home Earnings</Text>
              </View>

              <View style={styles.currencyInputRow}>
                <Text style={styles.currencySymbolPrefix}>{currencySymbol}</Text>
                <TextInput
                  style={styles.mainNumberInput}
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                  keyboardType="numeric"
                  placeholder="75000"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Quick Preset Chips */}
              <View style={styles.presetChipsRow}>
                {['30000', '50000', '75000', '120000', '200000'].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setMonthlyIncome(val);
                    }}
                    style={[
                      styles.presetChip,
                      monthlyIncome === val && styles.presetChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        monthlyIncome === val && styles.presetChipTextActive,
                      ]}
                    >
                      {currencySymbol}{parseInt(val, 10) >= 100000 ? `${parseInt(val, 10) / 100000}L` : `${parseInt(val, 10) / 1000}k`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Monthly Savings Target Card */}
            <View style={styles.inputSectionCard}>
              <View style={styles.inputCardHeader}>
                <Sparkles size={16} color="#059669" />
                <Text style={styles.inputCardTitle}>Monthly Savings Goal Target</Text>
              </View>

              <View style={styles.currencyInputRow}>
                <Text style={styles.currencySymbolPrefix}>{currencySymbol}</Text>
                <TextInput
                  style={styles.mainNumberInput}
                  value={monthlySavings}
                  onChangeText={setMonthlySavings}
                  keyboardType="numeric"
                  placeholder="15000"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Percentage Presets */}
              <View style={styles.presetChipsRow}>
                {[15, 20, 25, 30, 40].map((pct) => {
                  const incNum = parseFloat(monthlyIncome.replace(/[^0-9.]/g, '')) || 75000;
                  const calculated = Math.round((incNum * pct) / 100);
                  const isCurrent = monthlySavings === String(calculated);

                  return (
                    <TouchableOpacity
                      key={pct}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setMonthlySavings(String(calculated));
                      }}
                      style={[
                        styles.presetChip,
                        isCurrent && styles.presetChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          isCurrent && styles.presetChipTextActive,
                        ]}
                      >
                        {pct}% ({currencySymbol}{calculated >= 100000 ? `${(calculated / 100000).toFixed(1)}L` : `${Math.round(calculated / 1000)}k`})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}

        {/* STEP TYPE 3: Non-Negotiable Must-Payments */}
        {currentStep.type === 'must_payments' && (
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Total Obligations Summary Header */}
            <View style={styles.obligationsSummaryBox}>
              <View>
                <Text style={styles.obligationsSummaryLabel}>TOTAL FIXED OBLIGATIONS</Text>
                <Text style={styles.obligationsSummaryVal}>
                  {currencySymbol}{totalMustPayments.toLocaleString('en-IN')}{' '}
                  <Text style={styles.obligationsSummaryPeriod}>/ month</Text>
                </Text>
              </View>
              <View style={styles.obligationsCountBadge}>
                <Text style={styles.obligationsCountText}>
                  {Object.values(selectedObligations).filter(Boolean).length} Active
                </Text>
              </View>
            </View>

            {/* List of Predefined Must Payments */}
            {DEFAULT_MUST_PAYMENTS.map((item) => {
              const isChecked = Boolean(selectedObligations[item.id]);
              const currentAmtStr = obligationAmounts[item.id] || String(item.amount);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.obligationCard,
                    isChecked && styles.obligationCardActive,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedObligations((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }));
                    }}
                    style={styles.obligationCheckbox}
                  >
                    <View
                      style={[
                        styles.indicatorCircle,
                        isChecked && styles.indicatorCircleSelected,
                      ]}
                    >
                      {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.obligationIconBadge}>
                    {getObligationIcon(item.iconName)}
                  </View>

                  <View style={styles.obligationInfoBox}>
                    <Text style={styles.obligationName}>{item.name}</Text>
                    <Text style={styles.obligationCategory}>{item.category}</Text>
                  </View>

                  <View style={styles.obligationAmountWrap}>
                    <Text style={styles.obligationCurrencySign}>{currencySymbol}</Text>
                    <TextInput
                      style={styles.obligationAmountInput}
                      value={currentAmtStr}
                      onChangeText={(val) =>
                        setObligationAmounts((prev) => ({ ...prev, [item.id]: val }))
                      }
                      keyboardType="numeric"
                      editable={isChecked}
                    />
                  </View>
                </View>
              );
            })}

            {/* Custom Obligations Added by User */}
            {customObligations.map((item) => {
              const isChecked = Boolean(selectedObligations[item.id]);
              const currentAmtStr = obligationAmounts[item.id] || String(item.amount);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.obligationCard,
                    isChecked && styles.obligationCardActive,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedObligations((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }));
                    }}
                    style={styles.obligationCheckbox}
                  >
                    <View
                      style={[
                        styles.indicatorCircle,
                        isChecked && styles.indicatorCircleSelected,
                      ]}
                    >
                      {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.obligationIconBadge}>
                    {getObligationIcon(item.iconName)}
                  </View>

                  <View style={styles.obligationInfoBox}>
                    <Text style={styles.obligationName}>{item.name}</Text>
                    <Text style={styles.obligationCategory}>Custom Fixed Spend</Text>
                  </View>

                  <View style={styles.obligationAmountWrap}>
                    <Text style={styles.obligationCurrencySign}>{currencySymbol}</Text>
                    <TextInput
                      style={styles.obligationAmountInput}
                      value={currentAmtStr}
                      onChangeText={(val) =>
                        setObligationAmounts((prev) => ({ ...prev, [item.id]: val }))
                      }
                      keyboardType="numeric"
                      editable={isChecked}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteCustomObligation(item.id)}
                    style={styles.deleteCustomBtn}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Add Custom Obligation Form */}
            {isAddingCustom ? (
              <View style={styles.addCustomBox}>
                <Text style={styles.addCustomTitle}>New Custom Fixed Spend</Text>
                <TextInput
                  style={styles.customNameInput}
                  placeholder="e.g. Gym Trainer, Internet Bill, Car Lease"
                  placeholderTextColor="#94A3B8"
                  value={customName}
                  onChangeText={setCustomName}
                />
                <View style={styles.customAmountRow}>
                  <Text style={styles.currencySymbolPrefix}>{currencySymbol}</Text>
                  <TextInput
                    style={styles.customAmtInput}
                    placeholder="3000"
                    placeholderTextColor="#94A3B8"
                    value={customAmt}
                    onChangeText={setCustomAmt}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.customActionsRow}>
                  <TouchableOpacity
                    onPress={() => setIsAddingCustom(false)}
                    style={styles.cancelCustomBtn}
                  >
                    <Text style={styles.cancelCustomText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddCustomObligation}
                    style={styles.saveCustomBtn}
                  >
                    <Text style={styles.saveCustomText}>Add Obligation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setIsAddingCustom(true);
                }}
                style={styles.addCustomTriggerBtn}
              >
                <Plus size={16} color="#7C3AED" />
                <Text style={styles.addCustomTriggerText}>Add Custom Obligation</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {/* BOTTOM ACTION BAR */}
        {currentStep.type === 'earnings' && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleEarningsContinue}
              style={styles.primaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Continue to Fixed Obligations"
            >
              <Text style={styles.primaryActionText}>Continue</Text>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}

        {currentStep.type === 'must_payments' && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleMustPaymentsContinue}
              style={styles.primaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Continue to Goals"
            >
              <Text style={styles.primaryActionText}>
                Continue ({currencySymbol}{totalMustPayments.toLocaleString('en-IN')})
              </Text>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}

        {currentStep.type === 'choice' && currentStep.isMultiSelect && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleMultiChoiceContinue}
              style={styles.primaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.primaryActionText}>
                Continue ({selectedMulti.length} Selected)
              </Text>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#FAF9F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrackBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  counterBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
  },
  stepSurface: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: -0.6,
    color: '#0F172A',
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#64748B',
    marginBottom: 16,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
    shadowOpacity: 0.08,
    shadowColor: '#7C3AED',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  optionTextBox: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionLabelSelected: {
    color: '#7C3AED',
  },
  optionDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  indicatorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  indicatorCircleSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  inputSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  inputCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  inputCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  currencyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },
  currencySymbolPrefix: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7C3AED',
    marginRight: 8,
  },
  mainNumberInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#7C3AED',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  presetChipTextActive: {
    color: '#7C3AED',
  },
  obligationsSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  obligationsSummaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  obligationsSummaryVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  obligationsSummaryPeriod: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  obligationsCountBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  obligationsCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
  },
  obligationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 10,
  },
  obligationCardActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  obligationCheckbox: {
    padding: 2,
  },
  obligationIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  obligationInfoBox: {
    flex: 1,
  },
  obligationName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  obligationCategory: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  obligationAmountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    height: 36,
  },
  obligationCurrencySign: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
    marginRight: 4,
  },
  obligationAmountInput: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 55,
    textAlign: 'right',
  },
  deleteCustomBtn: {
    padding: 6,
  },
  addCustomTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  addCustomTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  addCustomBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7C3AED',
    padding: 14,
    gap: 10,
  },
  addCustomTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  customNameInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  customAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 40,
  },
  customAmtInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  customActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelCustomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelCustomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  saveCustomBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveCustomText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerContainer: {
    paddingVertical: 10,
    backgroundColor: '#FAF9F6',
  },
  primaryActionButton: {
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
  primaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

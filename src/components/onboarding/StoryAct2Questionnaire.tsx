import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import {
  ArrowRight,
  Check,
  Utensils,
  Car,
  Coffee,
  Tv,
  ShoppingBag,
  TrendingDown,
  FileSpreadsheet,
  Brain,
  Shield,
  Plane,
  Laptop,
  Coins,
  Sparkles,
  Building,
  Heart,
  Home,
  ShieldCheck,
  GraduationCap,
  Plus,
  Trash2,
  Wallet,
  DollarSign,
  Receipt,
  Scale,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

interface StoryAct2QuestionnaireProps {
  currencySymbol: string;
  onCompleteAssessment: (data: UserAssessmentData) => void;
}

export const DEFAULT_MUST_PAYMENTS: MustPaymentItem[] = [
  {
    id: 'loan_emi',
    name: 'Home / Personal Loan EMI',
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
    id: 'rent_housing',
    name: 'House Rent & Maintenance',
    category: 'Housing',
    amount: 18000,
    iconName: 'Home',
  },
  {
    id: 'vehicle_emi',
    name: 'Vehicle / Bike Loan EMI',
    category: 'Transport',
    amount: 8000,
    iconName: 'Car',
  },
  {
    id: 'insurance',
    name: 'Life & Health Insurance Policies',
    category: 'Insurance',
    amount: 3000,
    iconName: 'ShieldCheck',
  },
  {
    id: 'education_fees',
    name: 'Education Loan / Child School Fees',
    category: 'Education',
    amount: 6000,
    iconName: 'GraduationCap',
  },
];

const LEAK_OPTIONS = [
  {
    id: 'food_delivery',
    label: 'Late-Night Food Delivery & Orders',
    sub: 'Swiggy, Zomato, UberEats, midnight takeout',
    icon: Utensils,
    color: '#EF4444',
    bg: '#FEE2E2',
    estMonthly: 4200,
  },
  {
    id: 'cabs_commute',
    label: 'Daily Cabs & Surge Pricing',
    sub: 'Uber, Ola, peak commute rides',
    icon: Car,
    color: '#0284C7',
    bg: '#E0F2FE',
    estMonthly: 3600,
  },
  {
    id: 'coffee_cafes',
    label: 'Artisanal Coffee & Daily Cafe Snacks',
    sub: 'Starbucks, specialty brews & pastries',
    icon: Coffee,
    color: '#D97706',
    bg: '#FEF3C7',
    estMonthly: 2800,
  },
  {
    id: 'subscriptions',
    label: 'Forgotten App & Streaming Subs',
    sub: 'Unused OTT platforms, gym, memberships',
    icon: Tv,
    color: '#7C3AED',
    bg: '#F3E8FF',
    estMonthly: 1400,
  },
  {
    id: 'impulse_shopping',
    label: 'Spontaneous Online Shopping',
    sub: 'Amazon lightning deals & flash sales',
    icon: ShoppingBag,
    color: '#EC4899',
    bg: '#FCE7F3',
    estMonthly: 5000,
  },
];

const FRUSTRATION_OPTIONS = [
  {
    id: 'zero_savings',
    label: 'Earning well, but bank balance hits zero by month-end',
    icon: TrendingDown,
  },
  {
    id: 'exhausting_budgeting',
    label: 'Traditional budgeting spreadsheets feel exhausting & rigid',
    icon: FileSpreadsheet,
  },
  {
    id: 'forgetting_tracking',
    label: 'Forgetting to manually log small daily UPI and cash payments',
    icon: Brain,
  },
  {
    id: 'no_milestone_plan',
    label: 'No clear roadmap to turn small daily savings into big dreams',
    icon: Coins,
  },
];

const GOAL_OPTIONS = [
  {
    id: 'emergency_buffer',
    label: 'Build a 3 to 6 Month Emergency Cushion',
    sub: 'Peace of mind for unexpected life events',
    icon: Shield,
    defaultAmount: 150000,
  },
  {
    id: 'dream_travel',
    label: 'Fund an Annual Dream Trip or Solo Getaway',
    sub: 'Travel without touching emergency savings',
    icon: Plane,
    defaultAmount: 85000,
  },
  {
    id: 'tech_gadgets',
    label: 'Upgrade Tech, Gadgets & Workspace Gear',
    sub: 'MacBook, camera, or smart home setup',
    icon: Laptop,
    defaultAmount: 90000,
  },
];

const INCOME_PRESETS = [30000, 50000, 75000, 100000, 150000, 250000];
const SAVINGS_PERCENTS = [15, 25, 35, 50];

const getMustPaymentIcon = (iconName?: string) => {
  const props = { size: 20, color: '#7C3AED' };
  switch (iconName) {
    case 'Building':
      return <Building {...props} />;
    case 'Heart':
      return <Heart {...props} color="#EC4899" />;
    case 'Home':
      return <Home {...props} color="#D97706" />;
    case 'Car':
      return <Car {...props} color="#0284C7" />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} color="#059669" />;
    case 'GraduationCap':
      return <GraduationCap {...props} color="#6366F1" />;
    default:
      return <Receipt {...props} />;
  }
};

export const StoryAct2Questionnaire: React.FC<StoryAct2QuestionnaireProps> = ({
  currencySymbol,
  onCompleteAssessment,
}) => {
  // 6 Steps: 0: Leak, 1: Frustration, 2: Goal, 3: Income, 4: Must-Payments, 5: Savings Target
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedLeak, setSelectedLeak] = useState<string>('food_delivery');
  const [selectedFrustration, setSelectedFrustration] = useState<string>('zero_savings');
  const [selectedGoal, setSelectedGoal] = useState<string>('emergency_buffer');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('75000');
  const [monthlySavingsTarget, setMonthlySavingsTarget] = useState<string>('20000');

  // Must Payments state
  const [selectedMustPayments, setSelectedMustPayments] = useState<Record<string, boolean>>({
    family_support: true,
  });
  const [mustPaymentAmounts, setMustPaymentAmounts] = useState<Record<string, string>>({
    loan_emi: '15000',
    family_support: '10000',
    rent_housing: '18000',
    vehicle_emi: '8000',
    insurance: '3000',
    education_fees: '6000',
  });
  const [customMustPayments, setCustomMustPayments] = useState<MustPaymentItem[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('');
  const [customAmountInput, setCustomAmountInput] = useState('');

  const chosenLeakObj = LEAK_OPTIONS.find((l) => l.id === selectedLeak) || LEAK_OPTIONS[0];

  // Calculate total must payments
  const totalMustPayments = useMemo(() => {
    let sum = 0;
    DEFAULT_MUST_PAYMENTS.forEach((item) => {
      if (selectedMustPayments[item.id]) {
        const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
        const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0;
        sum += parsed;
      }
    });
    customMustPayments.forEach((item) => {
      if (selectedMustPayments[item.id]) {
        const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
        const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0;
        sum += parsed;
      }
    });
    return sum;
  }, [selectedMustPayments, mustPaymentAmounts, customMustPayments]);

  const incomeNum = useMemo(() => {
    return parseFloat(monthlyIncome.replace(/[^0-9.]/g, '')) || 0;
  }, [monthlyIncome]);

  const discretionaryIncome = useMemo(() => {
    return Math.max(incomeNum - totalMustPayments, 0);
  }, [incomeNum, totalMustPayments]);

  const toggleMustPayment = (id: string, defaultAmount: number) => {
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMustPayments((prev) => {
      const nextState = !prev[id];
      if (nextState && !mustPaymentAmounts[id]) {
        setMustPaymentAmounts((amtPrev) => ({
          ...amtPrev,
          [id]: String(defaultAmount),
        }));
      }
      return { ...prev, [id]: nextState };
    });
  };

  const updateMustPaymentAmount = (id: string, text: string) => {
    setMustPaymentAmounts((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const handleAddCustomPayment = () => {
    if (!customNameInput.trim()) return;
    const amountVal = parseFloat(customAmountInput.replace(/[^0-9.]/g, '')) || 5000;
    const newId = `custom_${Date.now()}`;
    const newItem: MustPaymentItem = {
      id: newId,
      name: customNameInput.trim(),
      category: 'Custom Obligation',
      amount: amountVal,
      iconName: 'Receipt',
      isCustom: true,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setCustomMustPayments((prev) => [...prev, newItem]);
    setSelectedMustPayments((prev) => ({ ...prev, [newId]: true }));
    setMustPaymentAmounts((prev) => ({ ...prev, [newId]: String(amountVal) }));
    setCustomNameInput('');
    setCustomAmountInput('');
    setShowAddCustom(false);
  };

  const handleDeleteCustomPayment = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCustomMustPayments((prev) => prev.filter((p) => p.id !== id));
    setSelectedMustPayments((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < 5) {
      // Auto-recalibrate savings target when moving from step 4 to step 5
      if (currentStep === 4) {
        const pool = discretionaryIncome > 0 ? discretionaryIncome : incomeNum;
        if (pool > 0) {
          const suggested = Math.round(pool * 0.25);
          setMonthlySavingsTarget(String(suggested));
        }
      }
      setCurrentStep(currentStep + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Gather active must payments list
      const activeMustPayments: MustPaymentItem[] = [];
      DEFAULT_MUST_PAYMENTS.forEach((item) => {
        if (selectedMustPayments[item.id]) {
          const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
          const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || item.amount;
          activeMustPayments.push({
            ...item,
            amount: parsed,
          });
        }
      });
      customMustPayments.forEach((item) => {
        if (selectedMustPayments[item.id]) {
          const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
          const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || item.amount;
          activeMustPayments.push({
            ...item,
            amount: parsed,
          });
        }
      });

      onCompleteAssessment({
        leakCategory: chosenLeakObj.id,
        leakCategoryName: chosenLeakObj.label,
        leakEstimatedCost: chosenLeakObj.estMonthly,
        frustration: selectedFrustration,
        primaryGoal: selectedGoal,
        monthlyIncome,
        monthlySavingsTarget,
        mustPayments: activeMustPayments,
        totalMustPayments,
      });
    }
  };

  const handleIncomePreset = (amt: number) => {
    Haptics.selectionAsync();
    setMonthlyIncome(amt.toString());
  };

  const handlePercentPreset = (percent: number) => {
    Haptics.selectionAsync();
    const base = discretionaryIncome > 0 ? discretionaryIncome : incomeNum;
    if (base > 0) {
      setMonthlySavingsTarget(Math.round((base * percent) / 100).toString());
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Progress Dots (6 Steps) */}
      <View style={styles.questionProgressRow}>
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <View
            key={step}
            style={[
              styles.stepPill,
              step <= currentStep && styles.stepPillActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* QUESTION 1: THE PRIMARY LEAK */}
        {currentStep === 0 && (
          <Animated.View
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stepContent}
          >
            <View style={styles.badgeRow}>
              <Sparkles size={12} color="#7C3AED" />
              <Text style={styles.badgeText}>CALIBRATE YOUR PSYCHOLOGY</Text>
            </View>
            <Text style={styles.questionTitle}>
              Where does your money leak the most without you realizing?
            </Text>
            <Text style={styles.questionSubtitle}>
              Looop's AI Biographer will design personalized habit micro-challenges around your specific leak pattern.
            </Text>

            <View style={styles.optionsList}>
              {LEAK_OPTIONS.map((leak) => {
                const IconComponent = leak.icon;
                const isSelected = selectedLeak === leak.id;
                return (
                  <TouchableOpacity
                    key={leak.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedLeak(leak.id);
                    }}
                    style={[
                      styles.leakCard,
                      isSelected && styles.leakCardSelected,
                    ]}
                  >
                    <View style={[styles.leakIconBox, { backgroundColor: leak.bg }]}>
                      <IconComponent size={20} color={leak.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.leakLabel}>{leak.label}</Text>
                      <Text style={styles.leakSub}>{leak.sub}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* QUESTION 2: THE BIGGEST FRUSTRATION */}
        {currentStep === 1 && (
          <Animated.View
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stepContent}
          >
            <View style={styles.badgeRow}>
              <Sparkles size={12} color="#7C3AED" />
              <Text style={styles.badgeText}>DIAGNOSIS PROFILE</Text>
            </View>
            <Text style={styles.questionTitle}>
              What feels the most frustrating about managing money?
            </Text>
            <Text style={styles.questionSubtitle}>
              Looop eliminates friction by replacing strict restriction with rewarding daily micro-habits.
            </Text>

            <View style={styles.optionsList}>
              {FRUSTRATION_OPTIONS.map((f) => {
                const IconComponent = f.icon;
                const isSelected = selectedFrustration === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedFrustration(f.id);
                    }}
                    style={[
                      styles.frustrationCard,
                      isSelected && styles.frustrationCardSelected,
                    ]}
                  >
                    <View style={styles.frustrationIconBox}>
                      <IconComponent size={18} color="#7C3AED" />
                    </View>
                    <Text style={styles.frustrationText}>{f.label}</Text>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* QUESTION 3: PRIMARY MILESTONE GOAL */}
        {currentStep === 2 && (
          <Animated.View
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stepContent}
          >
            <View style={styles.badgeRow}>
              <Sparkles size={12} color="#7C3AED" />
              <Text style={styles.badgeText}>YOUR FIRST MILESTONE VAULT</Text>
            </View>
            <Text style={styles.questionTitle}>
              What is your primary milestone dream this year?
            </Text>
            <Text style={styles.questionSubtitle}>
              Every tiny AI task you complete will automatically deposit saved money into this vault.
            </Text>

            <View style={styles.optionsList}>
              {GOAL_OPTIONS.map((g) => {
                const IconComponent = g.icon;
                const isSelected = selectedGoal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedGoal(g.id);
                    }}
                    style={[
                      styles.goalCard,
                      isSelected && styles.goalCardSelected,
                    ]}
                  >
                    <View style={styles.goalIconBox}>
                      <IconComponent size={22} color="#7C3AED" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.goalLabel}>{g.label}</Text>
                      <Text style={styles.goalSub}>{g.sub}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* QUESTION 4: MONTHLY TAKE-HOME INCOME */}
        {currentStep === 3 && (
          <Animated.View
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stepContent}
          >
            <View style={styles.badgeRow}>
              <Wallet size={12} color="#7C3AED" />
              <Text style={styles.badgeText}>STEP 1 OF 3 • INFLOW CALIBRATION</Text>
            </View>
            <Text style={styles.questionTitle}>
              What is your approximate monthly take-home income?
            </Text>
            <Text style={styles.questionSubtitle}>
              Your net salary, freelance earnings, or monthly inflow after taxes. Currency auto-detected as{' '}
              <Text style={{ fontWeight: '800' }}>{currencySymbol}</Text>.
            </Text>

            {/* Income Card */}
            <View style={styles.inputCard}>
              <Text style={styles.inputCardLabel}>APPROX. MONTHLY TAKE-HOME INCOME</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencySymbolText}>{currencySymbol}</Text>
                <TextInput
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                  keyboardType="numeric"
                  placeholder="75,000"
                  placeholderTextColor="#94A3B8"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.presetChipsRow}>
                {INCOME_PRESETS.map((p) => {
                  const isSel = parseFloat(monthlyIncome) === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => handleIncomePreset(p)}
                      style={[styles.presetChip, isSel && styles.presetChipSelected]}
                    >
                      <Text style={[styles.presetChipText, isSel && styles.presetChipTextSelected]}>
                        {currencySymbol}{p >= 100000 ? `${p / 100000}L` : `${p / 1000}k`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.privacyNoteBox}>
              <ShieldCheck size={16} color="#059669" />
              <Text style={styles.privacyNoteText}>
                Stored strictly on your device in local SQLite encryption. Never sold or shared.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* QUESTION 5: NON-NEGOTIABLE MUST-PAYMENTS (EMIs, LOANS, FAMILY CARE, RENT) */}
        {currentStep === 4 && (
          <Animated.View
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stepContent}
          >
            <View style={styles.badgeRow}>
              <Receipt size={12} color="#7C3AED" />
              <Text style={styles.badgeText}>STEP 2 OF 3 • FIXED COMMITMENTS</Text>
            </View>
            <Text style={styles.questionTitle}>
              What are your non-negotiable must-payments each month?
            </Text>
            <Text style={styles.questionSubtitle}>
              Select or add fixed obligations like EMIs, sending money to parents/family, loans, and rent that you must pay regardless of anything.
            </Text>

            {/* Live Cash Flow Summary Pill */}
            <View style={styles.cashFlowTallyCard}>
              <View style={styles.tallyCol}>
                <Text style={styles.tallyLabel}>MONTHLY INCOME</Text>
                <Text style={styles.tallyValue}>
                  {currencySymbol}{incomeNum.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.tallyDivider} />
              <View style={styles.tallyCol}>
                <Text style={[styles.tallyLabel, { color: '#EF4444' }]}>MUST PAYMENTS</Text>
                <Text style={[styles.tallyValue, { color: '#DC2626' }]}>
                  -{currencySymbol}{totalMustPayments.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.tallyDivider} />
              <View style={styles.tallyCol}>
                <Text style={[styles.tallyLabel, { color: '#059669' }]}>DISCRETIONARY</Text>
                <Text style={[styles.tallyValue, { color: '#059669' }]}>
                  {currencySymbol}{discretionaryIncome.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Predefined Must-Payments List */}
            <View style={styles.mustPaymentList}>
              {DEFAULT_MUST_PAYMENTS.map((item) => {
                const isSelected = Boolean(selectedMustPayments[item.id]);
                const currAmtStr = mustPaymentAmounts[item.id] || String(item.amount);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.mustPaymentCard,
                      isSelected && styles.mustPaymentCardSelected,
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleMustPayment(item.id, item.amount)}
                      style={styles.mustPaymentCardHeader}
                    >
                      <View style={styles.mustPaymentIconBox}>
                        {getMustPaymentIcon(item.iconName)}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.mustPaymentName}>{item.name}</Text>
                        <Text style={styles.mustPaymentCategory}>{item.category}</Text>
                      </View>
                      <View
                        style={[
                          styles.checkboxCircle,
                          isSelected && styles.checkboxCircleSelected,
                        ]}
                      >
                        {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </TouchableOpacity>

                    {/* Amount Input (Visible when selected) */}
                    {isSelected && (
                      <View style={styles.mustPaymentAmountRow}>
                        <Text style={styles.mustPaymentAmountLabel}>Monthly Amount:</Text>
                        <View style={styles.mustPaymentInputWrap}>
                          <Text style={styles.mustPaymentCurrencyPrefix}>{currencySymbol}</Text>
                          <TextInput
                            value={currAmtStr}
                            onChangeText={(txt) => updateMustPaymentAmount(item.id, txt)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#94A3B8"
                            style={styles.mustPaymentAmountInput}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Custom Must Payments */}
              {customMustPayments.map((item) => {
                const isSelected = Boolean(selectedMustPayments[item.id]);
                const currAmtStr = mustPaymentAmounts[item.id] || String(item.amount);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.mustPaymentCard,
                      isSelected && styles.mustPaymentCardSelected,
                    ]}
                  >
                    <View style={styles.mustPaymentCardHeader}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleMustPayment(item.id, item.amount)}
                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 }}
                      >
                        <View style={styles.mustPaymentIconBox}>
                          <Receipt size={20} color="#7C3AED" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.mustPaymentName}>{item.name}</Text>
                          <Text style={styles.mustPaymentCategory}>Custom Obligation</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteCustomPayment(item.id)}
                        style={styles.deleteCustomBtn}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => toggleMustPayment(item.id, item.amount)}
                        style={[
                          styles.checkboxCircle,
                          isSelected && styles.checkboxCircleSelected,
                        ]}
                      >
                        {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </TouchableOpacity>
                    </View>

                    {isSelected && (
                      <View style={styles.mustPaymentAmountRow}>
                        <Text style={styles.mustPaymentAmountLabel}>Monthly Amount:</Text>
                        <View style={styles.mustPaymentInputWrap}>
                          <Text style={styles.mustPaymentCurrencyPrefix}>{currencySymbol}</Text>
                          <TextInput
                            value={currAmtStr}
                            onChangeText={(txt) => updateMustPaymentAmount(item.id, txt)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#94A3B8"
                            style={styles.mustPaymentAmountInput}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Add Custom Must-Payment Button / Inline Form */}
            {showAddCustom ? (
              <View style={styles.addCustomCard}>
                <Text style={styles.addCustomTitle}>Add Custom Fixed Obligation</Text>
                <TextInput
                  value={customNameInput}
                  onChangeText={setCustomNameInput}
                  placeholder="Purpose (e.g. Chit Fund, Tuition, Pet Care)"
                  placeholderTextColor="#94A3B8"
                  style={styles.customNameInput}
                />
                <View style={styles.mustPaymentInputWrap}>
                  <Text style={styles.mustPaymentCurrencyPrefix}>{currencySymbol}</Text>
                  <TextInput
                    value={customAmountInput}
                    onChangeText={setCustomAmountInput}
                    keyboardType="numeric"
                    placeholder="Monthly Amount (e.g. 5000)"
                    placeholderTextColor="#94A3B8"
                    style={styles.mustPaymentAmountInput}
                  />
                </View>

                <View style={styles.customActionsRow}>
                  <TouchableOpacity
                    onPress={() => setShowAddCustom(false)}
                    style={styles.cancelCustomBtn}
                  >
                    <Text style={styles.cancelCustomText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddCustomPayment}
                    style={styles.saveCustomBtn}
                  >
                    <Text style={styles.saveCustomText}>Add Obligation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  Haptics.selectionAsync();
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setShowAddCustom(true);
                }}
                style={styles.addCustomTriggerBtn}
              >
                <Plus size={16} color="#7C3AED" />
                <Text style={styles.addCustomTriggerText}>Add Another Must-Payment</Text>
              </TouchableOpacity>
            )}

            {totalMustPayments === 0 && (
              <View style={styles.noMustPaymentsHint}>
                <Text style={styles.noMustPaymentsHintText}>
                  No fixed commitments? You can tap <Text style={{ fontWeight: '700' }}>Continue</Text> to proceed with your full income.
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* QUESTION 6: SAVINGS TARGET CALIBRATION */}
        {currentStep === 5 && (
          <Animated.View
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stepContent}
          >
            <View style={styles.badgeRow}>
              <Scale size={12} color="#7C3AED" />
              <Text style={styles.badgeText}>STEP 3 OF 3 • SAVINGS TARGET</Text>
            </View>
            <Text style={styles.questionTitle}>
              What is your target monthly savings goal?
            </Text>
            <Text style={styles.questionSubtitle}>
              Calibrated against your true discretionary pool after fixed commitments. Looop will build your weekly micro-challenges around this.
            </Text>

            {/* Financial Balance Summary Breakdown */}
            <View style={styles.summaryBreakdownCard}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Inflow (Income)</Text>
                <Text style={styles.breakdownVal}>
                  +{currencySymbol}{incomeNum.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: '#EF4444' }]}>
                  Fixed Obligations (EMIs/Family/Rent)
                </Text>
                <Text style={[styles.breakdownVal, { color: '#DC2626' }]}>
                  -{currencySymbol}{totalMustPayments.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownTotalLabel}>True Discretionary Pool</Text>
                <Text style={styles.breakdownTotalVal}>
                  {currencySymbol}{discretionaryIncome.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Target Input Card */}
            <View style={styles.inputCard}>
              <Text style={styles.inputCardLabel}>MONTHLY SAVINGS TARGET</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencySymbolText}>{currencySymbol}</Text>
                <TextInput
                  value={monthlySavingsTarget}
                  onChangeText={setMonthlySavingsTarget}
                  keyboardType="numeric"
                  placeholder="20,000"
                  placeholderTextColor="#94A3B8"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.presetChipsRow}>
                {SAVINGS_PERCENTS.map((pct) => (
                  <TouchableOpacity
                    key={pct}
                    onPress={() => handlePercentPreset(pct)}
                    style={styles.percentChip}
                  >
                    <Text style={styles.percentChipText}>
                      {pct}% of Pool ({currencySymbol}
                      {Math.round(((discretionaryIncome > 0 ? discretionaryIncome : incomeNum) * pct) / 100).toLocaleString('en-IN')})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Target Insight Box */}
            <View style={styles.previewTargetBox}>
              <Sparkles size={18} color="#7C3AED" />
              <Text style={styles.previewTargetText}>
                Looop will unlock{' '}
                <Text style={{ fontWeight: '800' }}>
                  {currencySymbol}
                  {monthlySavingsTarget ? Number(monthlySavingsTarget.replace(/[^0-9.]/g, '') || 0).toLocaleString('en-IN') : '0'}
                </Text>{' '}
                monthly by replacing mindless convenience leaks with daily AI micro-habits!
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Navigation CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {currentStep === 5 ? 'Generate My AI Diagnosis' : 'Continue'}
          </Text>
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
  questionProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  stepPill: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  stepPillActive: {
    backgroundColor: '#7C3AED',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  stepContent: {
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  questionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
  },
  optionsList: {
    gap: 10,
    marginTop: 8,
  },
  leakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
  },
  leakCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FDFCFF',
  },
  leakIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leakLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  leakSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  frustrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
  },
  frustrationCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FDFCFF',
  },
  frustrationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frustrationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
  },
  goalCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FDFCFF',
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  goalSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 10,
  },
  inputCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 52,
  },
  currencySymbolText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7C3AED',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  presetChipSelected: {
    backgroundColor: '#7C3AED',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  presetChipTextSelected: {
    color: '#FFFFFF',
  },
  percentChip: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  percentChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  privacyNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#065F46',
    lineHeight: 16,
    fontWeight: '500',
  },
  cashFlowTallyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 4,
    marginBottom: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tallyCol: {
    flex: 1,
    alignItems: 'center',
  },
  tallyLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tallyValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tallyDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#F1F5F9',
  },
  mustPaymentList: {
    gap: 10,
    marginTop: 6,
  },
  mustPaymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 10,
  },
  mustPaymentCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FDFCFF',
  },
  mustPaymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mustPaymentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mustPaymentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  mustPaymentCategory: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  mustPaymentAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  mustPaymentAmountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  mustPaymentInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    minWidth: 120,
  },
  mustPaymentCurrencyPrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
    marginRight: 4,
  },
  mustPaymentAmountInput: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    padding: 0,
  },
  deleteCustomBtn: {
    padding: 6,
    marginRight: 4,
  },
  addCustomTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addCustomTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  addCustomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    padding: 16,
    gap: 10,
    marginTop: 6,
  },
  addCustomTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  customNameInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  customActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelCustomBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelCustomText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  saveCustomBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveCustomText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noMustPaymentsHint: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  noMustPaymentsHintText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  summaryBreakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 2,
  },
  breakdownTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  breakdownTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  previewTargetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginTop: 4,
  },
  previewTargetText: {
    flex: 1,
    fontSize: 12,
    color: '#5B21B6',
    lineHeight: 17,
  },
  footer: {
    paddingVertical: 16,
  },
  nextBtn: {
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
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

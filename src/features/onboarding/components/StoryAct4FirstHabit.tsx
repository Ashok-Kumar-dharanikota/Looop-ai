import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Zap,
  Check,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Coins,
  Edit3,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { getCurrencyDefaults, formatAmount } from '@/utils/currency-calibration';
import { UserOnboardingAnswers, FirstHabitResult } from '../types';
import { AmbientGlow } from '@/features/auth/components/AmbientGlow';

interface StoryAct4FirstHabitProps {
  currencySymbol: string;
  answers: UserOnboardingAnswers;
  onProceedToNotifications: (result: FirstHabitResult) => void;
}

export const StoryAct4FirstHabit: React.FC<StoryAct4FirstHabitProps> = ({
  currencySymbol,
  answers,
  onProceedToNotifications,
}) => {
  const { t } = useTranslation();
  const { currency } = useAppStore();
  const currencyConfig = useMemo(() => getCurrencyDefaults(currency), [currency]);

  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const scaleVal = useSharedValue(1);

  // Dynamic Day / Timing Phrase based on current device day
  const getDynamicTimingPhrase = () => {
    const day = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    switch (day) {
      case 5: // Friday
        return 'tonight or this Saturday';
      case 6: // Saturday
        return 'this Sunday';
      case 0: // Sunday
        return 'this Monday evening';
      case 1: // Monday
        return 'this Tuesday evening';
      case 2: // Tuesday
        return 'this Wednesday evening';
      case 3: // Wednesday
        return 'this Thursday evening';
      case 4: // Thursday
        return 'this Friday evening';
      default:
        return 'this weekend';
    }
  };

  const getFirstTaskInfo = () => {
    const leak = (answers.overspendingCategory || '').toLowerCase();
    const timing = getDynamicTimingPhrase();
    const baseSavings = currencyConfig.defaultHabitSavings;

    if (leak.includes('food') || leak.includes('dining')) {
      return {
        title: `Cook dinner at home ${timing}`,
        defaultSavings: baseSavings,
        category: 'Food & Dining',
        iconText: '🍳',
        tip: 'Pre-planning one home meal eliminates late-night willpower fatigue.',
      };
    }
    if (leak.includes('cab') || leak.includes('commute') || leak.includes('transport')) {
      return {
        title: 'Switch 2 upcoming cab rides to the Metro / Carpool',
        defaultSavings: Math.round(baseSavings * 0.75),
        category: 'Commute',
        iconText: '🚆',
        tip: 'Beats peak surge pricing while adding 1,500 morning steps.',
      };
    }
    if (leak.includes('subscription')) {
      return {
        title: 'Audit & cancel 1 unused recurring subscription',
        defaultSavings: Math.round(baseSavings * 0.9),
        category: 'Subscriptions',
        iconText: '📺',
        tip: '1 tap cancellation permanently reclaims monthly income.',
      };
    }
    if (leak.includes('entertainment') || leak.includes('outing')) {
      return {
        title: `Brew artisan coffee or host a movie night at home ${timing}`,
        defaultSavings: Math.round(baseSavings * 1.1),
        category: 'Entertainment',
        iconText: '🍿',
        tip: 'Enjoy weekend relaxation without the restaurant surge bill.',
      };
    }
    return {
      title: 'Apply the 48-Hour Wishlist delay before checkout',
      defaultSavings: Math.round(baseSavings * 1.5),
      category: 'Shopping',
      iconText: '🛍️',
      tip: '90% of impulsive shopping urges fade completely within 48 hours.',
    };
  };

  const task = useMemo(() => getFirstTaskInfo(), [answers.overspendingCategory, currencyConfig]);
  const [savingsInput, setSavingsInput] = useState<string>(String(task.defaultSavings));
  const [isEditingSavings, setIsEditingSavings] = useState<boolean>(false);

  const currentSavingsNum = useMemo(() => {
    return parseFloat(savingsInput.replace(/[^0-9.]/g, '')) || task.defaultSavings;
  }, [savingsInput, task.defaultSavings]);

  const handleToggleTask = () => {
    if (!isTaskCompleted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scaleVal.value = withSequence(withSpring(1.04), withSpring(1));
      setIsTaskCompleted(true);
    } else {
      Haptics.selectionAsync();
      setIsTaskCompleted(false);
    }
  };

  const animatedVaultStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));

  const goalName = answers.primaryGoal || 'Emergency Safety Cushion';
  const vaultTarget = currencyConfig.defaultTargetVault;
  const vaultCurrent = isTaskCompleted ? currentSavingsNum : 0;
  const vaultPercent = Math.round((vaultCurrent / vaultTarget) * 100);

  const handleProceed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onProceedToNotifications({
      isCompleted: isTaskCompleted,
      savingsAmount: currentSavingsNum,
      taskTitle: task.title,
      taskCategory: task.category,
    });
  };

  return (
    <View style={styles.container}>
      <AmbientGlow />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(300)} style={styles.content}>
          {/* Header Badge */}
          <View style={styles.headerBadge}>
            <Zap size={13} color="#FF6B00" />
            <Text style={styles.headerBadgeText}>
              {t('onboarding.habit.badge', 'YOUR FIRST AI HABIT CHALLENGE')}
            </Text>
          </View>

          <Text style={styles.title}>
            {t('onboarding.habit.title', 'Your Personalized Habit Challenge')}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'onboarding.habit.subtitle',
              'Adjust your estimated savings below, and tap to test how Looop deposits saved money directly into your goal.'
            )}
          </Text>

          {/* Interactive Task Card */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleToggleTask}
            style={[
              styles.taskCard,
              isTaskCompleted && styles.taskCardCompleted,
            ]}
          >
            <View
              style={[
                styles.checkboxCircle,
                isTaskCompleted && styles.checkboxCircleCompleted,
              ]}
            >
              {isTaskCompleted && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </View>

            <View style={styles.taskIconBox}>
              <Text style={styles.taskIconText}>{task.iconText}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.taskMetaRow}>
                <Text style={styles.taskCategory}>{task.category}</Text>
                <Text
                  style={[
                    styles.taskSavingsBadge,
                    isTaskCompleted && styles.taskSavingsBadgeCompleted,
                  ]}
                >
                  {isTaskCompleted ? '✓ Saved ' : 'Estimate: '}
                  {currencySymbol}
                  {formatAmount(currentSavingsNum, currency)}
                </Text>
              </View>
              <Text
                style={[
                  styles.taskTitle,
                  isTaskCompleted && styles.taskTitleCompleted,
                ]}
              >
                {task.title}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Editable Savings Amount Section */}
          <View style={styles.estimationCard}>
            <View style={styles.estimationHeader}>
              <Text style={styles.estimationTitle}>
                {t('onboarding.habit.customizeSavingsTitle', 'CUSTOMIZE ESTIMATED SAVINGS')}
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditingSavings((prev) => !prev)}
                style={styles.editToggleBtn}
              >
                <Edit3 size={13} color="#FF6B00" />
                <Text style={styles.editToggleText}>
                  {isEditingSavings
                    ? t('onboarding.buttons.done', 'Done')
                    : t('onboarding.buttons.adjustAmount', 'Adjust Amount')}
                </Text>
              </TouchableOpacity>
            </View>

            {isEditingSavings ? (
              <View style={styles.customAmountEditRow}>
                <Text style={styles.amountInputPrefix}>{currencySymbol}</Text>
                <TextInput
                  value={savingsInput}
                  onChangeText={setSavingsInput}
                  keyboardType="numeric"
                  placeholder={String(task.defaultSavings)}
                  selectionColor="#FF6B00"
                  style={styles.customAmountInput}
                  autoFocus
                />
              </View>
            ) : (
              <View style={styles.presetsRow}>
                {currencyConfig.habitPresets.map((presetVal) => {
                  const isSelected = currentSavingsNum === presetVal;
                  return (
                    <TouchableOpacity
                      key={presetVal}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSavingsInput(String(presetVal));
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
                        {formatAmount(presetVal, currency)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Behavioral Rule Callout */}
          <View style={styles.tipBox}>
            <Sparkles size={14} color="#FF6B00" />
            <Text style={styles.tipText}>
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', color: '#9A3412' }}>
                {t('onboarding.habit.ruleTitle', 'AI Behavioral Rule: ')}
              </Text>
              {task.tip}
            </Text>
          </View>

          {/* Live Milestone Vault Card */}
          <Animated.View style={[styles.vaultCard, animatedVaultStyle]}>
            <View style={styles.vaultHeaderRow}>
              <View style={styles.vaultIconBox}>
                <ShieldCheck size={20} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vaultCardLabel}>
                  {t('onboarding.habit.vaultBadge', 'ACTIVE MILESTONE VAULT')}
                </Text>
                <Text style={styles.vaultName}>{goalName}</Text>
              </View>
              <Text style={styles.vaultPercentText}>{vaultPercent}%</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.vaultProgressTrack}>
              <View
                style={[
                  styles.vaultProgressFill,
                  { width: isTaskCompleted ? `${Math.max(vaultPercent, 8)}%` : '0%' },
                ]}
              />
            </View>

            <View style={styles.vaultFooterRow}>
              <Text style={styles.vaultSavedAmount}>
                {currencySymbol}
                {formatAmount(vaultCurrent, currency)}{' '}
                {t('onboarding.habit.vaultSaved', 'saved')}
              </Text>
              <Text style={styles.vaultTargetAmount}>
                {t('onboarding.habit.vaultGoal', 'Goal: ')}
                {currencySymbol}
                {formatAmount(vaultTarget, currency)}
              </Text>
            </View>

            {isTaskCompleted ? (
              <Animated.View entering={FadeInUp.duration(200)} style={styles.celebrationRow}>
                <Coins size={14} color="#059669" />
                <Text style={styles.celebrationText}>
                  {t(
                    'onboarding.habit.depositedNotice',
                    '+{{currency}}{{amount}} deposited into your vault!',
                    {
                      currency: currencySymbol,
                      amount: formatAmount(currentSavingsNum, currency),
                    }
                  )}
                </Text>
              </Animated.View>
            ) : (
              <Text style={styles.uncompletedHintText}>
                {t(
                  'onboarding.habit.uncompletedHint',
                  'Tap the task checkbox above to mark it done, or proceed to leave it active for later.'
                )}
              </Text>
            )}
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Final Action CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeBtnPressable}
          onPress={handleProceed}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#FF7A00', '#FF4D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.completeBtnGradient}
          >
            <Text style={styles.completeBtnText}>
              {t('onboarding.buttons.nextReminder', 'Next: Lock Daily Check-in')}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  content: {
    gap: 14,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  headerBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    color: '#FF6B00',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 23,
    color: '#0F172A',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  taskCardCompleted: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  checkboxCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleCompleted: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  taskIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIconText: {
    fontSize: 21,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskCategory: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#FF6B00',
  },
  taskSavingsBadge: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#0F172A',
  },
  taskSavingsBadgeCompleted: {
    color: '#059669',
  },
  taskTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },
  taskTitleCompleted: {
    color: '#047857',
  },
  estimationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  estimationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estimationTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  editToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editToggleText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#FF6B00',
  },
  customAmountEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#FF6B00',
    paddingBottom: 4,
  },
  amountInputPrefix: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: '#0F172A',
    marginRight: 6,
  },
  customAmountInput: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: '#0F172A',
    flex: 1,
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
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#9A3412',
    lineHeight: 17,
  },
  vaultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vaultIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultCardLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#059669',
    letterSpacing: 0.6,
  },
  vaultName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14.5,
    color: '#0F172A',
  },
  vaultPercentText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#059669',
  },
  vaultProgressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  vaultProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  vaultFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vaultSavedAmount: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#059669',
  },
  vaultTargetAmount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  celebrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  celebrationText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#047857',
  },
  uncompletedHintText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FAF9F6',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  completeBtnPressable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  completeBtnGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15.5,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import {
  Zap,
  Check,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Coins,
  PartyPopper,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { UserAssessmentData } from './StoryAct2Questionnaire';

interface StoryAct4FirstHabitProps {
  currencySymbol: string;
  data: UserAssessmentData;
  onProceedToNotifications: () => void;
}

export const StoryAct4FirstHabit: React.FC<StoryAct4FirstHabitProps> = ({
  currencySymbol,
  data,
  onProceedToNotifications,
}) => {
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const scaleVal = useSharedValue(1);

  const getFirstTaskInfo = () => {
    switch (data.leakCategory) {
      case 'food_delivery':
        return {
          title: 'Cook dinner at home this Thursday night',
          savings: 800,
          category: 'Food & Dining',
          iconText: '🍳',
          tip: 'Pre-planning one home meal eliminates late-night willpower fatigue.',
        };
      case 'cabs_commute':
        return {
          title: 'Switch 2 morning cab rides to the Metro',
          savings: 600,
          category: 'Commute',
          iconText: '🚆',
          tip: 'Beats peak surge traffic while adding 1,500 morning steps.',
        };
      case 'coffee_cafes':
        return {
          title: 'Brew artisan pour-over coffee at home this weekend',
          savings: 450,
          category: 'Lifestyle',
          iconText: '☕',
          tip: 'Enjoy the morning brewing ritual without the ₹250 daily swipe.',
        };
      case 'subscriptions':
        return {
          title: 'Audit & cancel 1 unused recurring subscription',
          savings: 700,
          category: 'Subscriptions',
          iconText: '📺',
          tip: '1 tap cancellation permanently reclaims monthly income.',
        };
      default:
        return {
          title: 'Apply the 48-Hour Wishlist delay before checkout',
          savings: 1200,
          category: 'Shopping',
          iconText: '🛍️',
          tip: '90% of impulsive shopping urges fade completely within 48 hours.',
        };
    }
  };

  const task = getFirstTaskInfo();

  const handleToggleTask = () => {
    if (!isTaskCompleted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scaleVal.value = withSequence(withSpring(1.06), withSpring(1));
      setIsTaskCompleted(true);
    } else {
      Haptics.selectionAsync();
      setIsTaskCompleted(false);
    }
  };

  const animatedVaultStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));

  const goalName =
    data.primaryGoal === 'emergency_buffer'
      ? 'Emergency Safety Cushion'
      : data.primaryGoal === 'dream_travel'
      ? 'Dream Vacation Fund'
      : 'Tech & Gear Upgrade';

  const vaultTarget = 25000;
  const vaultCurrent = isTaskCompleted ? task.savings : 0;
  const vaultPercent = Math.round((vaultCurrent / vaultTarget) * 100);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.duration(300)} style={styles.content}>
          {/* Header */}
          <View style={styles.headerBadge}>
            <Zap size={13} color="#7C3AED" />
            <Text style={styles.headerBadgeText}>YOUR FIRST AI HABIT CHALLENGE</Text>
          </View>

          <Text style={styles.title}>Try Ticking Your First Savings Micro-Task</Text>
          <Text style={styles.subtitle}>
            Tap the task below to experience how Looop turns tiny daily decisions into funded dreams.
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
                  {isTaskCompleted ? '✓ Saved ' : 'Target: '}
                  {currencySymbol}{task.savings}
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

          {/* Tip Callout */}
          <View style={styles.tipBox}>
            <Sparkles size={14} color="#7C3AED" />
            <Text style={styles.tipText}>
              <Text style={{ fontWeight: '700' }}>AI Habit Rule: </Text>
              {task.tip}
            </Text>
          </View>

          {/* Live Milestone Vault Impact */}
          <Animated.View style={[styles.vaultCard, animatedVaultStyle]}>
            <View style={styles.vaultHeaderRow}>
              <View style={styles.vaultIconBox}>
                <ShieldCheck size={20} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vaultCardLabel}>ACTIVE MILESTONE VAULT</Text>
                <Text style={styles.vaultName}>{goalName}</Text>
              </View>
              <Text style={styles.vaultPercentText}>{vaultPercent}%</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.vaultProgressTrack}>
              <View
                style={[
                  styles.vaultProgressFill,
                  { width: isTaskCompleted ? `${Math.max(vaultPercent, 6)}%` : '0%' },
                ]}
              />
            </View>

            <View style={styles.vaultFooterRow}>
              <Text style={styles.vaultSavedAmount}>
                {currencySymbol}{vaultCurrent.toLocaleString('en-IN')} saved
              </Text>
              <Text style={styles.vaultTargetAmount}>
                Goal: {currencySymbol}{vaultTarget.toLocaleString('en-IN')}
              </Text>
            </View>

            {isTaskCompleted && (
              <Animated.View entering={FadeInUp.duration(200)} style={styles.celebrationRow}>
                <Coins size={14} color="#059669" />
                <Text style={styles.celebrationText}>
                  +{currencySymbol}{task.savings} automatically deposited into your vault!
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Final Action CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onProceedToNotifications();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.completeBtnText}>Next: Set Daily Check-in</Text>
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
  scrollContent: {
    paddingVertical: 12,
  },
  content: {
    gap: 14,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIconText: {
    fontSize: 20,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  taskSavingsBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  taskSavingsBadgeCompleted: {
    color: '#059669',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
  },
  taskTitleCompleted: {
    color: '#047857',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#5B21B6',
    lineHeight: 17,
  },
  vaultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vaultIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.6,
  },
  vaultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  vaultPercentText: {
    fontSize: 15,
    fontWeight: '800',
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
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  vaultTargetAmount: {
    fontSize: 12,
    fontWeight: '500',
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
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  footer: {
    paddingVertical: 16,
  },
  completeBtn: {
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
  completeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

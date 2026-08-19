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
  Bell,
  Clock,
  Sparkles,
  Check,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  requestNotificationPermissions,
  scheduleDailySpendingReminder,
} from '@/services/notifications';
import { useAppStore } from '@/store/use-app-store';

interface StoryAct5NotificationsProps {
  onFinishOnboarding: () => void;
}

const REMINDER_OPTIONS = [
  { label: '8:00 PM', value: '20:00' },
  { label: '8:30 PM', value: '20:30' },
  { label: '9:00 PM', value: '21:00' },
  { label: '9:30 PM', value: '21:30' },
  { label: '10:00 PM', value: '22:00' },
];

export const StoryAct5Notifications: React.FC<StoryAct5NotificationsProps> = ({
  onFinishOnboarding,
}) => {
  const {
    dailyReminderTime,
    setDailyReminderTime,
    setNotificationsEnabled,
  } = useAppStore();

  const [selectedTime, setSelectedTime] = useState<string>(
    dailyReminderTime || '20:30'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const scaleVal = useSharedValue(1);

  const handleSelectTime = (time: string) => {
    Haptics.selectionAsync();
    setSelectedTime(time);
    setDailyReminderTime(time);
    scaleVal.value = withSequence(withSpring(1.03), withSpring(1));
  };

  const animatedPreviewStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));

  const handleEnableNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);

    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        await scheduleDailySpendingReminder(selectedTime, true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setNotificationsEnabled(false);
      }
    } catch (e) {
      console.warn('Error enabling notifications during onboarding:', e);
      setNotificationsEnabled(false);
    } finally {
      setIsProcessing(false);
      onFinishOnboarding();
    }
  };

  const handleSkipNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(false);
    onFinishOnboarding();
  };

  const selectedLabel =
    REMINDER_OPTIONS.find((opt) => opt.value === selectedTime)?.label || '8:30 PM';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.duration(300)} style={styles.content}>
          {/* Top Badge */}
          <View style={styles.headerBadge}>
            <Bell size={13} color="#7C3AED" />
            <Text style={styles.headerBadgeText}>SMART CHECK-IN ALERTS</Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Build the 3-Second Daily Habit</Text>
          <Text style={styles.subtitle}>
            Financial freedom isn't about painful budgeting — it's about 3 seconds
            of effortless awareness before bedtime.
          </Text>

          {/* Realistic Notification Preview Mockup */}
          <Animated.View style={[styles.notificationMockCard, animatedPreviewStyle]}>
            <View style={styles.mockHeader}>
              <View style={styles.mockAppBadge}>
                <View style={styles.mockAppIcon}>
                  <Sparkles size={11} color="#FFFFFF" />
                </View>
                <Text style={styles.mockAppName}>Looop AI</Text>
              </View>
              <Text style={styles.mockTimeBadge}>Everyday • {selectedLabel}</Text>
            </View>

            <View style={styles.mockBody}>
              <Text style={styles.mockTitle}>⏰ Daily Expense Check-in</Text>
              <Text style={styles.mockMessage}>
                Did you spend on coffee, lunch, or shopping today? Tap to record
                with voice or text in 3 seconds.
              </Text>
            </View>

            <View style={styles.mockFooter}>
              <View style={styles.mockTag}>
                <Clock size={11} color="#7C3AED" />
                <Text style={styles.mockTagText}>Scheduled for {selectedLabel}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Preferred Time Selector */}
          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>CHOOSE YOUR EVENING WIND-DOWN TIME</Text>
            <View style={styles.timeChipsRow}>
              {REMINDER_OPTIONS.map((opt) => {
                const isSelected = selectedTime === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    activeOpacity={0.75}
                    onPress={() => handleSelectTime(opt.value)}
                    style={[
                      styles.timeChip,
                      isSelected && styles.timeChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        isSelected && styles.timeChipTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Value Proof Card */}
          <View style={styles.valueCard}>
            <View style={styles.valueIconBox}>
              <TrendingUp size={18} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTitle}>3.4x Higher Success Rate</Text>
              <Text style={styles.valueText}>
                Members who enable evening check-ins consistently stop silent
                leaks and save up to ₹18,000+ more per year.
              </Text>
            </View>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <ShieldCheck size={14} color="#64748B" />
            <Text style={styles.privacyNoteText}>
              Zero spam. All reminders run 100% on-device. Adjust or pause anytime
              in Profile Settings.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.enableBtn}
          onPress={handleEnableNotifications}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          <Bell size={18} color="#FFFFFF" />
          <Text style={styles.enableBtnText}>
            {isProcessing ? 'Setting Up...' : 'Enable Daily Reminders'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkipNotifications}
          disabled={isProcessing}
          activeOpacity={0.7}
        >
          <Text style={styles.skipBtnText}>Maybe Later</Text>
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
    gap: 16,
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
    lineHeight: 19,
  },
  notificationMockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    gap: 10,
  },
  mockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mockAppBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mockAppIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockAppName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  mockTimeBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  mockBody: {
    gap: 4,
  },
  mockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  mockMessage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 17,
  },
  mockFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  mockTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mockTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  timeSection: {
    gap: 8,
  },
  timeSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginLeft: 2,
  },
  timeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  timeChipSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  timeChipTextSelected: {
    color: '#FFFFFF',
  },
  valueCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  valueIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  valueText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
    lineHeight: 17,
    marginTop: 2,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16,
  },
  footer: {
    paddingVertical: 14,
    gap: 8,
  },
  enableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    height: 52,
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  enableBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});

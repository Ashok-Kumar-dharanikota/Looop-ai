import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Animated, {
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { AmbientGlow } from '@/features/auth/components/AmbientGlow';

interface StoryAct5NotificationsProps {
  onFinishOnboarding: () => void;
}

const EVENING_TIMES = [
  { id: '20:00', label: '8:00 PM', desc: 'Post-dinner wind-down', hour: 20, minute: 0 },
  { id: '20:30', label: '8:30 PM', desc: 'Recommended check-in window', hour: 20, minute: 30, recommended: true },
  { id: '21:00', label: '9:00 PM', desc: 'Evening reflection time', hour: 21, minute: 0 },
  { id: '21:30', label: '9:30 PM', desc: 'Pre-bed routine', hour: 21, minute: 30 },
  { id: '22:00', label: '10:00 PM', desc: 'Late evening wrap-up', hour: 22, minute: 0 },
];

export const StoryAct5Notifications: React.FC<StoryAct5NotificationsProps> = ({
  onFinishOnboarding,
}) => {
  const { t } = useTranslation();
  const { currencySymbol } = useAppStore();
  const [selectedTimeId, setSelectedTimeId] = useState('20:30');
  const [isScheduling, setIsScheduling] = useState(false);

  const selectedTime = EVENING_TIMES.find((tItem) => tItem.id === selectedTimeId) || EVENING_TIMES[1];

  const requestNotificationPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch {
      return false;
    }
  };

  const scheduleDailyReminder = async (hour: number, minute: number) => {
    if (Platform.OS === 'web') return;

    try {
      // Cancel existing reminder notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule daily recurring notification at selected hour/minute
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌙 Evening Spend Check-in',
          body: 'Take 3 seconds to log today’s expenses with voice and keep your Milestone Vault on track.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hour,
          minute: minute,
        },
      });
    } catch (scheduleErr) {
      console.warn('Failed to schedule daily evening notification:', scheduleErr);
    }
  };

  const handleEnableNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsScheduling(true);

    const granted = await requestNotificationPermissions();

    if (granted) {
      await scheduleDailyReminder(selectedTime.hour, selectedTime.minute);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert(
        'Notification Reminder',
        'You can enable notifications anytime in Settings to receive your daily 8:30 PM reminder.',
        [{ text: 'OK' }]
      );
    }

    setIsScheduling(false);
    onFinishOnboarding();
  };

  const handleSkip = () => {
    Haptics.selectionAsync();
    onFinishOnboarding();
  };

  return (
    <View style={styles.container}>
      <AmbientGlow />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.duration(300)} style={styles.content}>
          {/* Header Badge */}
          <View style={styles.headerBadge}>
            <Bell size={13} color="#FF6B00" />
            <Text style={styles.headerBadgeText}>
              {t('onboarding.notifications.badge', 'SMART HABIT ANCHOR')}
            </Text>
          </View>

          <Text style={styles.title}>
            {t('onboarding.notifications.title', 'Build the 3-Second Daily Check-in')}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'onboarding.notifications.subtitle',
              'Financial clarity isn’t about painful accounting—it’s 3 seconds of effortless awareness before bed.'
            )}
          </Text>

          {/* Interactive Notification Preview Card */}
          <View style={styles.mockNotificationCard}>
            <View style={styles.mockHeaderRow}>
              <View style={styles.mockAppIcon}>
                <Sparkles size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.mockAppName}>LOOOP AI</Text>
              <Text style={styles.mockTime}>{selectedTime.label}</Text>
            </View>
            <Text style={styles.mockTitle}>
              {t('onboarding.notifications.mockTitle', '⏰ Evening Expense Check-in')}
            </Text>
            <Text style={styles.mockBody}>
              {t(
                'onboarding.notifications.mockMessage',
                'Did you spend on lunch, coffee, or cabs today? Tap to record with voice in 3 seconds.'
              )}
            </Text>
            <View style={styles.mockBadgeRow}>
              <CheckCircle2 size={12} color="#059669" />
              <Text style={styles.mockBadgeText}>
                {t('onboarding.notifications.scheduledFor', 'Scheduled for {{time}}', {
                  time: selectedTime.label,
                })}
              </Text>
            </View>
          </View>

          {/* Time Picker Chips */}
          <View style={styles.timeSection}>
            <Text style={styles.sectionLabel}>
              {t('onboarding.notifications.timeSectionTitle', 'CHOOSE YOUR EVENING WIND-DOWN TIME')}
            </Text>
            <View style={styles.timeGrid}>
              {EVENING_TIMES.map((timeItem) => {
                const isSelected = timeItem.id === selectedTimeId;
                return (
                  <TouchableOpacity
                    key={timeItem.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedTimeId(timeItem.id);
                    }}
                    activeOpacity={0.82}
                    style={[
                      styles.timeChip,
                      isSelected && styles.timeChipSelected,
                    ]}
                  >
                    <View style={styles.timeChipHeader}>
                      <Clock
                        size={13}
                        color={isSelected ? '#FF6B00' : '#64748B'}
                      />
                      <Text
                        style={[
                          styles.timeChipLabel,
                          isSelected && styles.timeChipLabelSelected,
                        ]}
                      >
                        {timeItem.label}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.timeChipDesc,
                        isSelected && styles.timeChipDescSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {timeItem.desc}
                    </Text>
                    {timeItem.recommended && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Behavioral Proof / Value Add Box */}
          <View style={styles.valueCard}>
            <View style={styles.valueIconBox}>
              <TrendingUp size={18} color="#059669" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.valueTitle}>
                {t('onboarding.notifications.valueTitle', '3.4x Higher Long-Term Success')}
              </Text>
              <Text style={styles.valueText}>
                {t(
                  'onboarding.notifications.valueText',
                  'Members who maintain an evening check-in consistently stop micro-leaks and save up to {{currency}}18,000+ more per year.',
                  { currency: currencySymbol }
                )}
              </Text>
            </View>
          </View>

          {/* Privacy Guarantee */}
          <View style={styles.privacyRow}>
            <ShieldCheck size={14} color="#64748B" />
            <Text style={styles.privacyText}>
              {t(
                'onboarding.notifications.privacyNote',
                'Zero spam. All reminders run 100% on-device. Adjust or pause anytime in Profile Settings.'
              )}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtnPressable}
          onPress={handleEnableNotifications}
          disabled={isScheduling}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#FF7A00', '#FF4D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryBtnGradient}
          >
            <Bell size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>
              {isScheduling
                ? t('onboarding.buttons.settingUp', 'Setting Up...')
                : t('onboarding.buttons.enableReminders', 'Enable Daily Reminders')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipBtnText}>
            {t('onboarding.buttons.maybeLater', 'Maybe Later')}
          </Text>
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
    gap: 16,
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
  mockNotificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  mockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mockAppIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockAppName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  mockTime: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 'auto',
  },
  mockTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
  mockBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  mockBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  mockBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    color: '#059669',
  },
  timeSection: {
    gap: 10,
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  timeGrid: {
    gap: 8,
  },
  timeChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 3,
  },
  timeChipSelected: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFFBF7',
  },
  timeChipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeChipLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
  timeChipLabelSelected: {
    color: '#EA580C',
  },
  timeChipDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    color: '#64748B',
  },
  timeChipDescSelected: {
    color: '#9A3412',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 8.5,
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  valueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    gap: 12,
  },
  valueIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: '#065F46',
  },
  valueText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    color: '#047857',
    lineHeight: 16,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  privacyText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FAF9F6',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  primaryBtnPressable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15.5,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  skipBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  skipBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13.5,
    color: '#64748B',
  },
});

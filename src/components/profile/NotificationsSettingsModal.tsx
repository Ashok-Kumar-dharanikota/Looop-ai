import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import {
  X,
  Bell,
  Clock,
  AlertTriangle,
  Trophy,
  Send,
  Check,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/use-app-store';
import {
  requestNotificationPermissions,
  scheduleDailySpendingReminder,
  cancelDailySpendingReminder,
  sendImmediateTestNotification,
} from '@/services/notifications';

interface NotificationsSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const REMINDER_TIMES = [
  { label: '8:00 PM', value: '20:00' },
  { label: '8:30 PM', value: '20:30' },
  { label: '9:00 PM', value: '21:00' },
  { label: '9:30 PM', value: '21:30' },
  { label: '10:00 PM', value: '22:00' },
];

export const NotificationsSettingsModal: React.FC<NotificationsSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const {
    notificationsEnabled,
    dailyReminderTime,
    budgetAlertsEnabled,
    goalMilestonesEnabled,
    setNotificationsEnabled,
    setDailyReminderTime,
    setBudgetAlertsEnabled,
    setGoalMilestonesEnabled,
  } = useAppStore();

  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleToggleMasterNotifications = async (enabled: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        await scheduleDailySpendingReminder(dailyReminderTime);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert(
          'Notifications Permission Needed',
          'Please allow notifications in your device settings to receive daily spending reminders and budget alerts.'
        );
      }
    } else {
      setNotificationsEnabled(false);
      await cancelDailySpendingReminder();
    }
  };

  const handleSelectReminderTime = async (time: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDailyReminderTime(time);
    if (notificationsEnabled) {
      await scheduleDailySpendingReminder(time);
    }
  };

  const handleSendTestNotification = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSendingTest(true);
    const sent = await sendImmediateTestNotification();
    setIsSendingTest(false);

    if (sent) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Notification Sent!',
        'Check your notification tray or banner above to preview the alert.'
      );
    } else {
      Alert.alert(
        'Permission Required',
        'Please grant notification permission in settings to test notifications.'
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Bell size={20} color="#0284C7" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Notifications & Alerts</Text>
              <Text style={styles.headerSubtitle}>
                Reminders, budget warnings & goals
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Master Notifications Toggle */}
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Bell size={22} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Enable Notifications</Text>
                <Text style={styles.toggleSub}>
                  Allow daily spending check-ins & milestone alerts
                </Text>
              </View>

              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleMasterNotifications}
                trackColor={{ false: '#E2E8F0', true: '#7DD3FC' }}
                thumbColor={notificationsEnabled ? '#0284C7' : '#F8FAFC'}
              />
            </View>
          </View>

          {notificationsEnabled && (
            <>
              {/* Daily Reminder Time Section */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>DAILY CHECK-IN REMINDER</Text>
                <View style={styles.card}>
                  <View style={styles.timeInfoRow}>
                    <Clock size={18} color="#0284C7" />
                    <Text style={styles.timeInfoText}>
                      Remind me to log my expenses every evening at:
                    </Text>
                  </View>

                  <View style={styles.timeChipsGrid}>
                    {REMINDER_TIMES.map((rt) => {
                      const isSelected = dailyReminderTime === rt.value;
                      return (
                        <TouchableOpacity
                          key={rt.value}
                          activeOpacity={0.75}
                          onPress={() => handleSelectReminderTime(rt.value)}
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
                            {rt.label}
                          </Text>
                          {isSelected && (
                            <Check size={12} color="#FFFFFF" strokeWidth={3} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Alert Types Section */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>SMART ALERTS</Text>
                <View style={styles.card}>
                  {/* Budget Warning Alert */}
                  <View style={styles.subToggleRow}>
                    <View style={[styles.subIconCircle, { backgroundColor: '#FEE2E2' }]}>
                      <AlertTriangle size={18} color="#EF4444" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.subToggleTitle}>Budget Threshold Warnings</Text>
                      <Text style={styles.subToggleDesc}>
                        Alert when approaching 80% or 100% of category budget
                      </Text>
                    </View>
                    <Switch
                      value={budgetAlertsEnabled}
                      onValueChange={(val) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setBudgetAlertsEnabled(val);
                      }}
                      trackColor={{ false: '#E2E8F0', true: '#FCA5A5' }}
                      thumbColor={budgetAlertsEnabled ? '#EF4444' : '#F8FAFC'}
                    />
                  </View>

                  <View style={styles.divider} />

                  {/* Goal Milestone Celebrations */}
                  <View style={styles.subToggleRow}>
                    <View style={[styles.subIconCircle, { backgroundColor: '#FEF3C7' }]}>
                      <Trophy size={18} color="#D97706" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.subToggleTitle}>Milestone Celebrations</Text>
                      <Text style={styles.subToggleDesc}>
                        Instant celebratory alerts when reaching vault goals
                      </Text>
                    </View>
                    <Switch
                      value={goalMilestonesEnabled}
                      onValueChange={(val) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setGoalMilestonesEnabled(val);
                      }}
                      trackColor={{ false: '#E2E8F0', true: '#FCD34D' }}
                      thumbColor={goalMilestonesEnabled ? '#D97706' : '#F8FAFC'}
                    />
                  </View>
                </View>
              </View>

              {/* Test Notification Trigger */}
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSendingTest}
                onPress={handleSendTestNotification}
                style={styles.testNotificationBtn}
              >
                <Send size={16} color="#0284C7" />
                <Text style={styles.testNotificationBtnText}>
                  Send Instant Test Notification
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Privacy Footnote */}
          <View style={styles.privacyNoteBox}>
            <Sparkles size={16} color="#0284C7" />
            <Text style={styles.privacyNoteText}>
              All notification triggers run locally on your device for absolute privacy and zero background battery drain.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toggleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  sectionBox: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  timeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  timeInfoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  timeChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  timeChipSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  timeChipTextSelected: {
    color: '#FFFFFF',
  },
  subToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  subIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subToggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  subToggleDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    height: 50,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  testNotificationBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
  },
  privacyNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#0369A1',
    lineHeight: 18,
  },
});

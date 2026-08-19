import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const DAILY_REMINDER_IDENTIFIER = 'looop_daily_spending_reminder';

/**
 * Configure foreground notification behavior and Android notification channels.
 */
export async function initializeNotifications(): Promise<void> {
  try {
    // 1. Set foreground notification presentation options
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // 2. Set up Android Notification Channels
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Daily Spending Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#9333EA',
        enableLights: true,
        enableVibrate: true,
      });

      await Notifications.setNotificationChannelAsync('budget-alerts', {
        name: 'Budget & Milestone Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500],
        lightColor: '#EF4444',
        enableLights: true,
        enableVibrate: true,
      });
    }
  } catch (error) {
    console.warn('Failed to initialize notifications:', error);
  }
}

/**
 * Checks if notification permissions are already granted without prompting the user.
 */
export async function getNotificationPermissionStatus(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Requests notification permissions from the OS.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedules or reschedules the recurring daily spending reminder.
 * @param timeStr Time in "HH:mm" format (e.g. "20:30")
 * @param requestPermissionIfNeeded When false, only schedules if permission is already granted; does not prompt the user.
 */
export async function scheduleDailySpendingReminder(
  timeStr: string,
  requestPermissionIfNeeded: boolean = false
): Promise<boolean> {
  try {
    let hasPermission = false;
    if (requestPermissionIfNeeded) {
      hasPermission = await requestNotificationPermissions();
    } else {
      hasPermission = await getNotificationPermissionStatus();
    }

    if (!hasPermission) {
      return false;
    }

    // Parse hour and minute
    const [hourStr, minStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10) || 20;
    const minute = parseInt(minStr, 10) || 30;

    // Cancel any previous reminder
    await cancelDailySpendingReminder();

    // Schedule daily recurring reminder
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_IDENTIFIER,
      content: {
        title: '⏰ Daily Expense Check-in',
        body: 'Did you spend on coffee, lunch, or groceries today? Tap to record with voice or text in 3 seconds.',
        sound: 'default',
        priority: 'high',
        data: { screen: 'record-expense' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: Platform.OS === 'android' ? 'reminders' : undefined,
      },
    });

    return true;
  } catch (error) {
    console.warn('Error scheduling daily spending reminder:', error);
    return false;
  }
}

/**
 * Cancels the daily recurring spending reminder.
 */
export async function cancelDailySpendingReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      DAILY_REMINDER_IDENTIFIER
    );
  } catch (error) {
    console.warn('Error cancelling daily reminder:', error);
  }
}

/**
 * Sends an immediate test notification to verify delivery and sound.
 */
export async function sendImmediateTestNotification(): Promise<boolean> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Looop Smart Alert Active!',
        body: 'Tap here to record a quick expense with voice or text.',
        sound: 'default',
        priority: 'high',
        data: { screen: 'record-expense', url: '/record-expense' },
      },
      trigger: null, // deliver immediately
    });

    return true;
  } catch (error) {
    console.warn('Error sending test notification:', error);
    return false;
  }
}

/**
 * Sends an instant budget threshold warning notification.
 */
export async function sendBudgetWarningNotification(
  category: string,
  spent: number,
  limit: number,
  currencySymbol: string
): Promise<void> {
  try {
    const percent = Math.round((spent / limit) * 100);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚠️ Budget Warning: ${category}`,
        body: `You have spent ${currencySymbol}${spent.toLocaleString('en-IN')} (${percent}%) of your ${currencySymbol}${limit.toLocaleString('en-IN')} limit.`,
        sound: 'default',
        priority: 'high',
        data: { screen: 'goals', url: '/(tabs)/goals' },
      },
      trigger: null,
    });
  } catch (error) {
    console.warn('Error sending budget warning notification:', error);
  }
}

/**
 * Sends a celebratory milestone goal achievement notification.
 */
export async function sendMilestoneCelebrationNotification(
  goalTitle: string,
  amountSaved: number,
  currencySymbol: string
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🎉 Milestone Reached: ${goalTitle}!`,
        body: `Congratulations! You just locked in ${currencySymbol}${amountSaved.toLocaleString('en-IN')} towards your vault.`,
        sound: 'default',
        priority: 'high',
        data: { screen: 'goals', url: '/(tabs)/goals' },
      },
      trigger: null,
    });
  } catch (error) {
    console.warn('Error sending milestone celebration notification:', error);
  }
}


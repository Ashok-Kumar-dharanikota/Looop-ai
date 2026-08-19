import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import { generateAndSaveAIReport } from '@/services/ai-reports';
import { checkAutoGenerationNeeded, getStoryScheduleInfo } from '@/utils/story-scheduler';
import { db } from '@/db/client';
import { reports } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getNotificationPermissionStatus } from '@/services/notifications';

export const BACKGROUND_STORY_TASK_NAME = 'LOOOP_AI_STORY_GENERATION_TASK';

/**
 * Background Task Definition for Automated Weekly & Monthly AI Story Generation.
 * Executes in the background periodically even when the app is minimized.
 */
TaskManager.defineTask(BACKGROUND_STORY_TASK_NAME, async () => {
  try {
    // 1. Query existing reports from local SQLite
    const existingReports = await db
      .select({ periodType: reports.periodType, createdAt: reports.createdAt })
      .from(reports)
      .orderBy(desc(reports.createdAt));

    // 2. Check if a weekly story or monthly edition is due
    const { shouldGenerateWeekly, shouldGenerateMonthly } =
      checkAutoGenerationNeeded(existingReports);

    if (shouldGenerateMonthly) {
      const result = await generateAndSaveAIReport({ periodType: 'monthly' });
      await notifyUserNewStory('monthly', result.report.hookTitle);
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    if (shouldGenerateWeekly) {
      const result = await generateAndSaveAIReport({ periodType: 'weekly' });
      await notifyUserNewStory('weekly', result.report.hookTitle);
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.warn('[Background Story Task Error]:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/**
 * Dispatches a rich push notification when a background story is published.
 */
async function notifyUserNewStory(periodType: 'weekly' | 'monthly', hookTitle: string) {
  try {
    const hasPermission = await getNotificationPermissionStatus();
    if (!hasPermission) return;

    const isMonthly = periodType === 'monthly';
    const title = isMonthly
      ? '🏆 Your Monthly Financial Story is Ready!'
      : '📖 New Weekly Financial Essay Published';
    const body = `${hookTitle} • Tap to view your behavioral analysis and savings challenges.`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          screen: 'goals',
          periodType,
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // deliver immediately
    });
  } catch (err) {
    console.warn('Failed to send story background notification:', err);
  }
}

/**
 * Registers the background story generation task with the OS scheduler.
 */
export async function registerBackgroundStoryWorker(): Promise<void> {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status !== BackgroundTask.BackgroundTaskStatus.Available) {
      console.warn('[Background Task] Background execution is restricted or unavailable.');
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STORY_TASK_NAME);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_STORY_TASK_NAME, {
        minimumInterval: 60 * 4, // Check every 4 hours in the background
      });
    }
  } catch (err) {
    console.warn('Failed to register background story task:', err);
  }
}

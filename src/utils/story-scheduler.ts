/**
 * Utility functions for AI Spending Story scheduling, countdowns, and automated cycle checks.
 * - Weekly Stories: Generated every 7 days (every Sunday evening / Monday cycle).
 * - Monthly Stories: Generated at the end of every calendar month for a 30-day retrospective.
 */

export interface StoryScheduleInfo {
  // Weekly Story Schedule
  nextWeeklyDate: Date;
  weeklyDaysRemaining: number;
  weeklyHoursRemaining: number;
  weeklyFormattedDate: string;
  weeklyCycleProgress: number; // 0 - 100%
  weeklyCycleDay: number; // 1 to 7

  // Monthly Story Schedule
  nextMonthlyDate: Date;
  monthlyDaysRemaining: number;
  monthlyFormattedDate: string;
  monthlyMonthName: string;
  monthlyCycleProgress: number; // 0 - 100%
  monthlyCycleDay: number;
  monthlyTotalDays: number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Calculates current countdowns and progression for Weekly and Monthly AI Stories.
 */
export function getStoryScheduleInfo(referenceDate = new Date()): StoryScheduleInfo {
  const now = new Date(referenceDate);

  // 1. Weekly Schedule: Target next Sunday at 8:00 PM
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, ...
  const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;

  const nextWeekly = new Date(now);
  nextWeekly.setDate(now.getDate() + daysUntilSunday);
  nextWeekly.setHours(20, 0, 0, 0);

  // If today is Sunday and past 8:00 PM, target next Sunday
  if (currentDayOfWeek === 0 && now.getHours() >= 20) {
    nextWeekly.setDate(nextWeekly.getDate() + 7);
  }

  const msUntilWeekly = nextWeekly.getTime() - now.getTime();
  const weeklyDaysRemaining = Math.max(Math.ceil(msUntilWeekly / (1000 * 60 * 60 * 24)), 0);
  const weeklyHoursRemaining = Math.max(Math.ceil(msUntilWeekly / (1000 * 60 * 60)), 0);

  const weeklyCycleDay = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
  const weeklyCycleProgress = Math.min(Math.round((weeklyCycleDay / 7) * 100), 100);

  const weeklyMonth = MONTH_NAMES[nextWeekly.getMonth()];
  const weeklyDayName = DAY_NAMES[nextWeekly.getDay()];
  const weeklyFormattedDate = `${weeklyDayName}, ${weeklyMonth} ${nextWeekly.getDate()} at 8:00 PM`;

  // 2. Monthly Schedule: Target last day of current calendar month at 11:59 PM
  const year = now.getFullYear();
  const month = now.getMonth();
  const nextMonthFirstDay = new Date(year, month + 1, 1);
  const lastDayOfMonth = new Date(nextMonthFirstDay.getTime() - 1); // e.g. Aug 31, 23:59:59

  const msUntilMonthly = lastDayOfMonth.getTime() - now.getTime();
  const monthlyDaysRemaining = Math.max(Math.ceil(msUntilMonthly / (1000 * 60 * 60 * 24)), 0);

  const monthlyCycleDay = now.getDate();
  const monthlyTotalDays = lastDayOfMonth.getDate();
  const monthlyCycleProgress = Math.min(
    Math.round((monthlyCycleDay / monthlyTotalDays) * 100),
    100
  );

  const monthShort = MONTH_NAMES[month];
  const monthlyFormattedDate = `${monthShort} ${monthlyTotalDays} (End of Month)`;
  const monthlyMonthName = FULL_MONTH_NAMES[month];

  return {
    nextWeeklyDate: nextWeekly,
    weeklyDaysRemaining,
    weeklyHoursRemaining,
    weeklyFormattedDate,
    weeklyCycleProgress,
    weeklyCycleDay,
    nextMonthlyDate: lastDayOfMonth,
    monthlyDaysRemaining,
    monthlyFormattedDate,
    monthlyMonthName,
    monthlyCycleProgress,
    monthlyCycleDay,
    monthlyTotalDays,
  };
}

/**
 * Determines whether a new weekly or monthly story should be auto-generated.
 */
export function checkAutoGenerationNeeded(
  reports: Array<{ periodType: string; createdAt: string }> = []
): { shouldGenerateWeekly: boolean; shouldGenerateMonthly: boolean } {
  const now = new Date();

  // Find latest weekly report
  const weeklyReports = reports
    .filter((r) => r.periodType === 'weekly')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const latestWeekly = weeklyReports[0];
  let shouldGenerateWeekly = false;

  if (!latestWeekly) {
    shouldGenerateWeekly = reports.length === 0; // If user has zero reports, allow initial generation
  } else {
    const lastWeeklyDate = new Date(latestWeekly.createdAt);
    const diffDays = (now.getTime() - lastWeeklyDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays >= 7) {
      shouldGenerateWeekly = true;
    }
  }

  // Find latest monthly report
  const monthlyReports = reports
    .filter((r) => r.periodType === 'monthly')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const latestMonthly = monthlyReports[0];
  let shouldGenerateMonthly = false;

  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (!latestMonthly) {
    // If it's the last 3 days of the month and no monthly report exists
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (now.getDate() >= lastDayOfMonth - 2 && reports.length > 0) {
      shouldGenerateMonthly = true;
    }
  } else {
    const lastMonthlyDate = new Date(latestMonthly.createdAt);
    const lastReportYearMonth = `${lastMonthlyDate.getFullYear()}-${String(
      lastMonthlyDate.getMonth() + 1
    ).padStart(2, '0')}`;

    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (currentYearMonth !== lastReportYearMonth && now.getDate() >= lastDayOfMonth - 2) {
      shouldGenerateMonthly = true;
    }
  }

  return { shouldGenerateWeekly, shouldGenerateMonthly };
}

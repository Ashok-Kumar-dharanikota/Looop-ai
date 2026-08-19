import { db, expoDb } from './client';
import { userSettings } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Initializes the database.
 * No dummy transactions, goals, vaults, reports, or fake user settings are seeded.
 * User settings (currency, income, savings target) are set exclusively by the user during onboarding.
 */
export async function seedDatabaseIfEmpty() {
  // Clean initialization - settings are populated when user completes onboarding
}

/**
 * Automatically cleans up legacy dummy/sample records from older versions of the app.
 */
export async function wipeLegacyDummyData() {
  try {
    const dummyTxIds = ['tx_1', 'tx_2', 'tx_3', 'tx_4', 'tx_5', 'tx_6', 'tx_sample_1', 'tx_sample_2', 'tx_sample_3', 'tx_sample_4', 'tx_sample_5', 'tx_sample_6'];
    const dummyGoalIds = ['g_1', 'g_2', 'g_3', 'g_4', 'g_sample_1', 'g_sample_2', 'g_sample_3'];
    const dummyVaultIds = ['v_1', 'v_2', 'v_3', 'v_4', 'v_sample_1', 'v_sample_2'];
    const dummyReportIds = ['rep_weekly_w33', 'rep_monthly_aug2026', 'rep_sample_1'];
    const dummyInsightIds = ['i_1', 'i_2'];

    const txPlaceholders = dummyTxIds.map(() => '?').join(',');
    await expoDb.runAsync(`DELETE FROM transactions WHERE id IN (${txPlaceholders});`, dummyTxIds);

    const goalPlaceholders = dummyGoalIds.map(() => '?').join(',');
    await expoDb.runAsync(`DELETE FROM weekly_goals WHERE id IN (${goalPlaceholders});`, dummyGoalIds);

    const vaultPlaceholders = dummyVaultIds.map(() => '?').join(',');
    await expoDb.runAsync(`DELETE FROM milestone_vaults WHERE id IN (${vaultPlaceholders});`, dummyVaultIds);

    const reportPlaceholders = dummyReportIds.map(() => '?').join(',');
    await expoDb.runAsync(`DELETE FROM reports WHERE id IN (${reportPlaceholders});`, dummyReportIds);

    const insightPlaceholders = dummyInsightIds.map(() => '?').join(',');
    await expoDb.runAsync(`DELETE FROM insights WHERE id IN (${insightPlaceholders});`, dummyInsightIds);

    await expoDb.runAsync(`DELETE FROM user_settings WHERE key = 'userName' AND value = 'Alex';`);
    await expoDb.runAsync(`DELETE FROM user_settings WHERE (key = 'monthlyIncome' AND value = '75000') OR (key = 'monthlySavingsTarget' AND value = '25000');`);
  } catch (err) {
    console.warn('Legacy dummy data wipe notice:', err);
  }
}

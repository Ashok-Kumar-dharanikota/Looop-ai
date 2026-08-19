import { expoDb } from './client';

/**
 * Permanently deletes all user financial records, AI reports, goals, vaults, and settings from SQLite.
 * Used during account deletion and hard reset to ensure zero data leakage.
 */
export async function clearAllUserData(): Promise<void> {
  try {
    await expoDb.execAsync(`
      DELETE FROM transactions;
      DELETE FROM weekly_goals;
      DELETE FROM milestone_vaults;
      DELETE FROM reports;
      DELETE FROM insights;
      DELETE FROM user_settings;
    `);
  } catch (error) {
    console.error('Error clearing local SQLite user data:', error);
    throw error;
  }
}

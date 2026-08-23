import { expoDb } from './client';
import { seedDatabaseIfEmpty, wipeLegacyDummyData } from './seed';

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS reports (
	id TEXT PRIMARY KEY NOT NULL,
	period_type TEXT DEFAULT 'weekly' NOT NULL,
	period_label TEXT NOT NULL,
	hook_title TEXT NOT NULL,
	sub_description TEXT NOT NULL,
	read_time TEXT DEFAULT '3 min read' NOT NULL,
	full_article TEXT NOT NULL,
	impact_health TEXT NOT NULL,
	impact_family TEXT NOT NULL,
	impact_finance TEXT NOT NULL,
	estimated_savings REAL DEFAULT 0 NOT NULL,
	tasks_json TEXT,
	is_read INTEGER DEFAULT 0 NOT NULL,
	created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS insights (
	id TEXT PRIMARY KEY NOT NULL,
	tag TEXT NOT NULL,
	title TEXT NOT NULL,
	summary TEXT NOT NULL,
	impact TEXT NOT NULL,
	details TEXT NOT NULL,
	is_read INTEGER DEFAULT 0 NOT NULL,
	template_goal_json TEXT,
	created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS milestone_vaults (
	id TEXT PRIMARY KEY NOT NULL,
	title TEXT NOT NULL,
	category TEXT DEFAULT 'Emergency' NOT NULL,
	target_amount REAL NOT NULL,
	current_amount REAL DEFAULT 0 NOT NULL,
	target_date TEXT NOT NULL,
	color TEXT DEFAULT '#8B5CF6' NOT NULL,
	icon_name TEXT DEFAULT 'ShieldCheck' NOT NULL,
	monthly_contribution REAL DEFAULT 0 NOT NULL,
	is_locked INTEGER DEFAULT 0 NOT NULL,
	order_index INTEGER DEFAULT 0 NOT NULL,
	created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
	id TEXT PRIMARY KEY NOT NULL,
	amount REAL NOT NULL,
	category TEXT NOT NULL,
	date TEXT NOT NULL,
	timestamp TEXT NOT NULL,
	description TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_settings (
	key TEXT PRIMARY KEY NOT NULL,
	value TEXT NOT NULL,
	updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_goals (
	id TEXT PRIMARY KEY NOT NULL,
	report_id TEXT,
	title TEXT NOT NULL,
	category TEXT DEFAULT 'Lifestyle' NOT NULL,
	savings_amount REAL NOT NULL,
	completed INTEGER DEFAULT 0 NOT NULL,
	action_text TEXT DEFAULT '✓ Complete' NOT NULL,
	completed_text TEXT DEFAULT 'Saved!' NOT NULL,
	impact_tag TEXT DEFAULT 'Finance & Health',
	icon_name TEXT DEFAULT 'Sparkles' NOT NULL,
	week_identifier TEXT,
	completed_at TEXT,
	created_at TEXT NOT NULL
);
`;

let isInitialized = false;

export async function initializeDatabase(): Promise<boolean> {
  if (isInitialized) return true;

  try {
    // Execute Schema creation
    await expoDb.execAsync(SCHEMA_SQL);

    // Safe column migrations & table rebuilds for existing SQLite tables
    try {
      const txTableInfo = await expoDb.getAllAsync<{ name: string; notnull: number }>(
        `PRAGMA table_info(transactions);`
      );
      const colNames = txTableInfo.map((c) => c.name);

      // If transactions table has legacy 'title' column with NOT NULL or missing new columns
      if (colNames.includes('title')) {
        await expoDb.execAsync(`
          PRAGMA foreign_keys=off;

          CREATE TABLE IF NOT EXISTS transactions_new (
            id TEXT PRIMARY KEY NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            description TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          INSERT OR REPLACE INTO transactions_new (id, amount, category, date, timestamp, description, created_at, updated_at)
          SELECT 
            id, 
            amount, 
            category, 
            date, 
            timestamp, 
            COALESCE(description, title, category), 
            created_at, 
            COALESCE(created_at, date, datetime('now'))
          FROM transactions;

          DROP TABLE transactions;
          ALTER TABLE transactions_new RENAME TO transactions;

          PRAGMA foreign_keys=on;
        `);
      } else {
        try {
          await expoDb.execAsync(`ALTER TABLE transactions ADD COLUMN description TEXT;`);
        } catch (_) {}
        try {
          await expoDb.execAsync(`ALTER TABLE transactions ADD COLUMN updated_at TEXT;`);
        } catch (_) {}
      }
    } catch (migErr) {
      console.warn('Transactions table migration note:', migErr);
    }

    try {
      await expoDb.execAsync(`ALTER TABLE weekly_goals ADD COLUMN report_id TEXT;`);
    } catch (_) {}
    try {
      await expoDb.execAsync(`ALTER TABLE weekly_goals ADD COLUMN impact_tag TEXT DEFAULT 'Finance & Health';`);
    } catch (_) {}
    try {
      await expoDb.execAsync(`ALTER TABLE milestone_vaults ADD COLUMN order_index INTEGER DEFAULT 0;`);
    } catch (_) {}

    // Wipe any legacy dummy seed data on initialization
    await wipeLegacyDummyData();

    // Ensure default settings exist
    await seedDatabaseIfEmpty();

    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
    return false;
  }
}

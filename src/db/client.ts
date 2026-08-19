import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const DB_NAME = 'looop.db';

// Open SQLite database synchronously
export const expoDb = openDatabaseSync(DB_NAME, {
  enableChangeListener: true,
});

// Create typed Drizzle ORM instance
export const db = drizzle(expoDb, { schema });

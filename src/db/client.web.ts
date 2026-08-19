import * as schema from './schema';

export const DB_NAME = 'looop.db';

// Safe mock instance for web promotion landing pages
export const expoDb = {
  execAsync: async () => {},
  runAsync: async () => ({ lastInsertRowId: 1, changes: 1 }),
  getFirstAsync: async () => null,
  getAllAsync: async () => [],
};

// Safe Drizzle mock for web environment
export const db: any = {
  select: () => ({
    from: () => ({
      orderBy: () => Promise.resolve([]),
      limit: () => Promise.resolve([]),
      where: () => Promise.resolve([]),
    }),
  }),
  insert: () => ({
    values: () => Promise.resolve(),
  }),
  update: () => ({
    set: () => ({
      where: () => Promise.resolve(),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve(),
  }),
};

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * Transactions Table
 */
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  timestamp: text('timestamp').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type GoalCategory =
  | 'Food'
  | 'Transport'
  | 'Subscriptions'
  | 'Shopping'
  | 'Vault'
  | 'Lifestyle'
  | 'Emergency'
  | 'Travel'
  | 'Tech';

/**
 * AI Reports & Medium-Style Expense Stories Table
 */
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  periodType: text('period_type', { enum: ['weekly', 'monthly'] }).notNull().default('weekly'),
  periodLabel: text('period_label').notNull(), // e.g. "Week of Aug 10 – 16"
  hookTitle: text('hook_title').notNull(),
  subDescription: text('sub_description').notNull(),
  readTime: text('read_time').notNull().default('3 min read'),
  fullArticle: text('full_article').notNull(),
  impactHealth: text('impact_health').notNull(),
  impactFamily: text('impact_family').notNull(),
  impactFinance: text('impact_finance').notNull(),
  estimatedSavings: real('estimated_savings').notNull().default(0),
  tasksJson: text('tasks_json'), // Array of initial AI tasks
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

/**
 * Weekly Savings Goals & Habit Challenges Table
 */
export const weeklyGoals = sqliteTable('weekly_goals', {
  id: text('id').primaryKey(),
  reportId: text('report_id'), // Optional link to parent AI report
  title: text('title').notNull(),
  category: text('category').notNull().default('Lifestyle'),
  savingsAmount: real('savings_amount').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  actionText: text('action_text').notNull().default('✓ Complete'),
  completedText: text('completed_text').notNull().default('Saved!'),
  impactTag: text('impact_tag').default('Finance & Health'),
  iconName: text('icon_name').notNull().default('Sparkles'),
  weekIdentifier: text('week_identifier'), // e.g. 2026-W33
  completedAt: text('completed_at'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type WeeklyGoal = typeof weeklyGoals.$inferSelect;
export type NewWeeklyGoal = typeof weeklyGoals.$inferInsert;

/**
 * Milestone Savings Vaults Table
 */
export const milestoneVaults = sqliteTable('milestone_vaults', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull().default('Emergency'),
  targetAmount: real('target_amount').notNull(),
  currentAmount: real('current_amount').notNull().default(0),
  targetDate: text('target_date').notNull(),
  color: text('color').notNull().default('#8B5CF6'),
  iconName: text('icon_name').notNull().default('ShieldCheck'),
  monthlyContribution: real('monthly_contribution').notNull().default(0),
  isLocked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type MilestoneVault = typeof milestoneVaults.$inferSelect;
export type NewMilestoneVault = typeof milestoneVaults.$inferInsert;

/**
 * AI Insights Table
 */
export const insights = sqliteTable('insights', {
  id: text('id').primaryKey(),
  tag: text('tag').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  impact: text('impact').notNull(),
  details: text('details').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  templateGoalJson: text('template_goal_json'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type Insight = typeof insights.$inferSelect;
export type NewInsight = typeof insights.$inferInsert;

/**
 * User Settings Table
 */
export const userSettings = sqliteTable('user_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type UserSetting = typeof userSettings.$inferSelect;
export type NewUserSetting = typeof userSettings.$inferInsert;


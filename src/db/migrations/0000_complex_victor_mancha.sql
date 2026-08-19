CREATE TABLE `insights` (
	`id` text PRIMARY KEY NOT NULL,
	`tag` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`impact` text NOT NULL,
	`details` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`template_goal_json` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `milestone_vaults` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'Emergency' NOT NULL,
	`target_amount` real NOT NULL,
	`current_amount` real DEFAULT 0 NOT NULL,
	`target_date` text NOT NULL,
	`color` text DEFAULT '#10B981' NOT NULL,
	`icon_name` text DEFAULT 'ShieldCheck' NOT NULL,
	`monthly_contribution` real DEFAULT 0 NOT NULL,
	`is_locked` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`amount` real NOT NULL,
	`type` text DEFAULT 'expense' NOT NULL,
	`category` text NOT NULL,
	`icon` text DEFAULT 'Wallet' NOT NULL,
	`timestamp` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weekly_goals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'Lifestyle' NOT NULL,
	`savings_amount` real NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`action_text` text DEFAULT '✓ Complete' NOT NULL,
	`completed_text` text DEFAULT 'Saved!' NOT NULL,
	`icon_name` text DEFAULT 'Sparkles' NOT NULL,
	`week_identifier` text,
	`completed_at` text,
	`created_at` text NOT NULL
);

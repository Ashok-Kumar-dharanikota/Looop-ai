import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { db } from '../db/client';
import {
  transactions,
  weeklyGoals,
  milestoneVaults,
  reports,
  insights,
  userSettings,
  type Transaction,
  type NewTransaction,
  type WeeklyGoal,
  type NewWeeklyGoal,
  type MilestoneVault,
  type NewMilestoneVault,
  type Report,
  type UserSetting,
} from '../db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { queryKeys } from '../lib/query-client';

// ==========================================
// TRANSACTIONS
// ==========================================

export function useTransactionsQuery() {
  return useQuery({
    queryKey: queryKeys.transactions.lists(),
    queryFn: async (): Promise<Transaction[]> => {
      return db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.date), desc(transactions.timestamp));
    },
  });
}

/**
 * Fetch only the most recent transactions with a limit to avoid pulling unwanted historical data
 */
export function useRecentTransactionsQuery(limit: number = 20) {
  return useQuery({
    queryKey: queryKeys.transactions.list({ limit }),
    queryFn: async (): Promise<Transaction[]> => {
      return db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.date), desc(transactions.timestamp))
        .limit(limit);
    },
  });
}

/**
 * Fetch only today's expenses sum directly from SQLite
 */
export function useTodayExpensesQuery(todayDate: string) {
  return useQuery({
    queryKey: queryKeys.transactions.list({ date: todayDate, type: 'todayTotal' }),
    queryFn: async (): Promise<number> => {
      const rows = await db
        .select({ amount: transactions.amount })
        .from(transactions)
        .where(eq(transactions.date, todayDate));
      return rows.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    },
  });
}

export function useAddTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTx: NewTransaction) => {
      await db.insert(transactions).values(newTx);
      return newTx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await db.delete(transactions).where(eq(transactions.id, id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

// ==========================================
// AI REPORTS
// ==========================================

export function useAIReportsQuery() {
  return useQuery({
    queryKey: queryKeys.reports.lists(),
    queryFn: async (): Promise<Report[]> => {
      return db
        .select()
        .from(reports)
        .orderBy(desc(reports.createdAt));
    },
  });
}

export function useMarkReportReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await db
        .update(reports)
        .set({ isRead: true })
        .where(eq(reports.id, id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
    },
  });
}

export function useGenerateAIReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options?: import('@/services/ai-reports').GenerateReportOptions) => {
      const { generateAndSaveAIReport } = await import('@/services/ai-reports');
      return await generateAndSaveAIReport(options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.weeklyGoals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestoneVaults.all });
    },
  });
}


// ==========================================
// MILESTONE VAULTS
// ==========================================

export function useMilestoneVaultsQuery() {
  return useQuery({
    queryKey: queryKeys.milestoneVaults.lists(),
    queryFn: async (): Promise<MilestoneVault[]> => {
      return db
        .select()
        .from(milestoneVaults)
        .orderBy(asc(milestoneVaults.targetAmount));
    },
  });
}

export function useDepositToVaultMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const existing = await db
        .select()
        .from(milestoneVaults)
        .where(eq(milestoneVaults.id, id));

      if (existing.length > 0) {
        const newAmount = (existing[0].currentAmount || 0) + amount;
        await db
          .update(milestoneVaults)
          .set({ currentAmount: newAmount })
          .where(eq(milestoneVaults.id, id));
      }
      return { id, amount };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestoneVaults.all });
    },
  });
}

export function useAddVaultMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newVault: NewMilestoneVault) => {
      await db.insert(milestoneVaults).values(newVault);
      return newVault;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestoneVaults.all });
    },
  });
}

export function useDeleteVaultMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await db.delete(milestoneVaults).where(eq(milestoneVaults.id, id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestoneVaults.all });
    },
  });
}

// ==========================================
// WEEKLY GOALS & HABITS
// ==========================================

export function useWeeklyGoalsQuery() {
  return useQuery({
    queryKey: queryKeys.weeklyGoals.lists(),
    queryFn: async (): Promise<WeeklyGoal[]> => {
      return db
        .select()
        .from(weeklyGoals)
        .orderBy(desc(weeklyGoals.createdAt));
    },
  });
}

/**
 * Fetch real savings data needed for the Area Chart and Home balance,
 * querying only the required columns and completed/pending goals without unwanted data.
 */
export function useSavingsChartDataQuery() {
  return useQuery({
    queryKey: [...queryKeys.weeklyGoals.lists(), 'savingsChartData'],
    queryFn: async () => {
      const completedGoals = await db
        .select({
          id: weeklyGoals.id,
          savingsAmount: weeklyGoals.savingsAmount,
          completedAt: weeklyGoals.completedAt,
          createdAt: weeklyGoals.createdAt,
        })
        .from(weeklyGoals)
        .where(eq(weeklyGoals.completed, true));

      const pendingGoals = await db
        .select({
          id: weeklyGoals.id,
          savingsAmount: weeklyGoals.savingsAmount,
        })
        .from(weeklyGoals)
        .where(eq(weeklyGoals.completed, false));

      const vaultRows = await db
        .select({
          id: milestoneVaults.id,
          currentAmount: milestoneVaults.currentAmount,
        })
        .from(milestoneVaults);

      const vaultSum = vaultRows.reduce(
        (sum, v) => sum + (v.currentAmount || 0),
        0
      );
      const taskSavingsSum = completedGoals.reduce(
        (sum, g) => sum + (g.savingsAmount || 0),
        0
      );
      const totalSavedTillNow = vaultSum > 0 ? vaultSum : taskSavingsSum;
      const pendingGoalSavings = pendingGoals.reduce(
        (sum, g) => sum + (g.savingsAmount || 0),
        0
      );

      return {
        completedGoals,
        completedTasksCount: completedGoals.length,
        totalSavedTillNow,
        pendingGoalSavings,
      };
    },
  });
}

export function useToggleGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      args: string | { id: string; customAmount?: number; markCompleted?: boolean }
    ) => {
      const id = typeof args === 'string' ? args : args.id;
      const customAmount = typeof args === 'object' ? args.customAmount : undefined;
      const explicitCompleted = typeof args === 'object' ? args.markCompleted : undefined;

      const existing = await db
        .select()
        .from(weeklyGoals)
        .where(eq(weeklyGoals.id, id));

      if (existing.length === 0) return null;
      const target = existing[0];
      const nextCompleted =
        explicitCompleted !== undefined ? explicitCompleted : !target.completed;
      const savings =
        customAmount !== undefined ? customAmount : target.savingsAmount || 0;

      // 1. Update goal completion and custom savingsAmount in SQLite
      await db
        .update(weeklyGoals)
        .set({
          completed: nextCompleted,
          savingsAmount: savings,
          completedAt: nextCompleted ? new Date().toISOString() : null,
        })
        .where(eq(weeklyGoals.id, id));

      // 2. Query vaults to apply automatic deposit/withdrawal
      const vaultsList = await db
        .select()
        .from(milestoneVaults)
        .orderBy(asc(milestoneVaults.targetAmount));

      let affectedVault: MilestoneVault | null = null;
      let didUnlockNext = false;
      let nextUnlockedTitle: string | null = null;

      if (vaultsList.length > 0) {
        const activeIdx = vaultsList.findIndex((v) => v.currentAmount < v.targetAmount);
        const activeVault = activeIdx !== -1 ? vaultsList[activeIdx] : vaultsList[0];

        if (activeVault) {
          affectedVault = activeVault;
          const currentAmt = activeVault.currentAmount || 0;
          // If marking complete: add savings. If un-completing: subtract the amount recorded on the goal.
          const newAmt = nextCompleted
            ? currentAmt + savings
            : Math.max(currentAmt - (target.savingsAmount || savings), 0);

          await db
            .update(milestoneVaults)
            .set({ currentAmount: newAmt })
            .where(eq(milestoneVaults.id, activeVault.id));

          if (
            nextCompleted &&
            newAmt >= activeVault.targetAmount &&
            activeIdx !== -1 &&
            activeIdx + 1 < vaultsList.length
          ) {
            didUnlockNext = true;
            const nextVault = vaultsList[activeIdx + 1];
            nextUnlockedTitle = nextVault.title;
            await db
              .update(milestoneVaults)
              .set({ isLocked: false })
              .where(eq(milestoneVaults.id, nextVault.id));
          }
        }
      }

      return {
        goal: target,
        completed: nextCompleted,
        savingsAmount: savings,
        vault: affectedVault,
        didUnlockNext,
        nextUnlockedTitle,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weeklyGoals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestoneVaults.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
    },
  });
}

export function useAddGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGoal: NewWeeklyGoal) => {
      await db.insert(weeklyGoals).values(newGoal);
      return newGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weeklyGoals.all });
    },
  });
}

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await db.delete(weeklyGoals).where(eq(weeklyGoals.id, id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weeklyGoals.all });
    },
  });
}

// ==========================================
// USER SETTINGS
// ==========================================

export function useUserSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.userSettings.all,
    queryFn: async (): Promise<Record<string, string>> => {
      const rows = await db.select().from(userSettings);
      const settingsMap: Record<string, string> = {};
      for (const row of rows) {
        settingsMap[row.key] = row.value;
      }
      return settingsMap;
    },
  });
}

export function useSaveUserSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const now = new Date().toISOString();
      for (const [key, value] of Object.entries(settings)) {
        const existing = await db
          .select()
          .from(userSettings)
          .where(eq(userSettings.key, key))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(userSettings)
            .set({ value, updatedAt: now })
            .where(eq(userSettings.key, key));
        } else {
          await db.insert(userSettings).values({
            key,
            value,
            updatedAt: now,
          });
        }
      }
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userSettings.all });
    },
  });
}

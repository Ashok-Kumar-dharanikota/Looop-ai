import { useMemo } from 'react';
import {
  useTransactionsQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useAIReportsQuery,
  useMarkReportReadMutation,
  useGenerateAIReportMutation,
  useMilestoneVaultsQuery,
  useDepositToVaultMutation,
  useAddVaultMutation,
  useDeleteVaultMutation,
  useWeeklyGoalsQuery,
  useToggleGoalMutation,
  useAddGoalMutation,
  useDeleteGoalMutation,
  useUserSettingsQuery,
  useSaveUserSettingsMutation,
} from './use-queries';
import {
  type Transaction,
  type NewTransaction,
  type WeeklyGoal,
  type NewWeeklyGoal,
  type MilestoneVault,
  type NewMilestoneVault,
  type Report,
  type NewReport,
} from '../db/schema';
import { initializeDatabase } from '../db/init';
import { useState, useEffect } from 'react';

// Re-export query hooks for direct usage
export * from './use-queries';

/**
 * Hook to ensure database initialization on app startup
 */
export function useDatabaseInit() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    initializeDatabase()
      .then((success) => {
        if (isMounted) setIsReady(success);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { isReady, error };
}

/**
 * Hook for managing Transactions with TanStack Query caching
 */
export function useTransactions() {
  const { data = [], isLoading, isFetching, refetch } = useTransactionsQuery();
  const addMutation = useAddTransactionMutation();
  const deleteMutation = useDeleteTransactionMutation();

  return {
    transactions: data,
    loading: isLoading,
    isFetching,
    refresh: () => refetch(),
    addTransaction: (newTx: NewTransaction) => addMutation.mutateAsync(newTx),
    deleteTransaction: (id: string) => deleteMutation.mutateAsync(id),
  };
}

/**
 * Hook for managing AI Reports with TanStack Query caching
 */
export function useAIReports() {
  const { data = [], isLoading, isFetching, refetch } = useAIReportsQuery();
  const markReadMutation = useMarkReportReadMutation();
  const generateMutation = useGenerateAIReportMutation();

  const latestWeeklyReport = useMemo(
    () => data.find((r) => r.periodType === 'weekly') || data[0] || null,
    [data]
  );

  const latestMonthlyReport = useMemo(
    () => data.find((r) => r.periodType === 'monthly') || null,
    [data]
  );

  return {
    reports: data,
    latestWeeklyReport,
    latestMonthlyReport,
    loading: isLoading,
    isFetching,
    isGenerating: generateMutation.isPending,
    refresh: () => refetch(),
    markReportAsRead: (id: string) => markReadMutation.mutateAsync(id),
    generateReport: (options?: import('@/services/ai-reports').GenerateReportOptions) =>
      generateMutation.mutateAsync(options),
  };
}


/**
 * Hook for managing Milestone Vaults with TanStack Query caching & roadmap logic
 */
export function useMilestoneVaults() {
  const { data = [], isLoading, isFetching, refetch } = useMilestoneVaultsQuery();
  const depositMutation = useDepositToVaultMutation();
  const addMutation = useAddVaultMutation();
  const deleteMutation = useDeleteVaultMutation();

  const sortedVaults = useMemo(() => {
    return [...data].sort((a, b) => a.targetAmount - b.targetAmount);
  }, [data]);

  const activeVaultIndex = useMemo(() => {
    const idx = sortedVaults.findIndex((v) => v.currentAmount < v.targetAmount);
    return idx !== -1 ? idx : sortedVaults.length - 1;
  }, [sortedVaults]);

  const activeVault = useMemo(() => {
    if (sortedVaults.length === 0) return null;
    return sortedVaults[activeVaultIndex] || sortedVaults[0];
  }, [sortedVaults, activeVaultIndex]);

  return {
    vaults: sortedVaults,
    activeVault,
    activeVaultIndex,
    loading: isLoading,
    isFetching,
    refresh: () => refetch(),
    depositToVault: (id: string, amount: number) =>
      depositMutation.mutateAsync({ id, amount }),
    addVault: (newVault: NewMilestoneVault) => addMutation.mutateAsync(newVault),
    deleteVault: (id: string) => deleteMutation.mutateAsync(id),
  };
}

/**
 * Hook for managing Weekly Goals & Habits with TanStack Query auto-invalidation
 */
export function useWeeklyGoals() {
  const { data = [], isLoading, isFetching, refetch } = useWeeklyGoalsQuery();
  const toggleMutation = useToggleGoalMutation();
  const addMutation = useAddGoalMutation();
  const deleteMutation = useDeleteGoalMutation();

  return {
    goals: data,
    loading: isLoading,
    isFetching,
    refresh: () => refetch(),
    toggleGoal: (
      args: string | { id: string; customAmount?: number; markCompleted?: boolean }
    ) => toggleMutation.mutateAsync(args),
    addGoal: (newGoal: NewWeeklyGoal) => addMutation.mutateAsync(newGoal),
    deleteGoal: (id: string) => deleteMutation.mutateAsync(id),
  };
}

/**
 * Hook for managing User Settings in SQLite with TanStack Query
 */
export function useUserSettings() {
  const { data: settings = {}, isLoading, isFetching, refetch } = useUserSettingsQuery();
  const saveMutation = useSaveUserSettingsMutation();

  const monthlyIncome = settings.monthlyIncome ? Number(settings.monthlyIncome) : null;
  const monthlySavingsTarget = settings.monthlySavingsTarget ? Number(settings.monthlySavingsTarget) : null;

  const mustPayments = useMemo(() => {
    if (!settings.mustPayments) return [];
    try {
      return JSON.parse(settings.mustPayments);
    } catch {
      return [];
    }
  }, [settings.mustPayments]);

  const totalMustPayments = useMemo(() => {
    if (settings.totalMustPayments) {
      return Number(settings.totalMustPayments) || 0;
    }
    if (mustPayments.length > 0) {
      return mustPayments.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    }
    return 0;
  }, [settings.totalMustPayments, mustPayments]);

  const discretionaryIncome = useMemo(() => {
    if (monthlyIncome !== null) {
      return Math.max(monthlyIncome - totalMustPayments, 0);
    }
    return null;
  }, [monthlyIncome, totalMustPayments]);

  return {
    settings,
    currency: settings.currency || '₹',
    monthlyIncome,
    monthlySavingsTarget,
    mustPayments,
    totalMustPayments,
    discretionaryIncome,
    loading: isLoading,
    isFetching,
    refresh: () => refetch(),
    saveSettings: (newSettings: Record<string, string>) =>
      saveMutation.mutateAsync(newSettings),
  };
}

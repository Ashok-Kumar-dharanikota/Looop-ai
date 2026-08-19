import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack QueryClient with caching and revalidation defaults for React Native
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data window
      gcTime: 1000 * 60 * 60 * 24, // 24 hours in memory/cache
      retry: 1,
      refetchOnWindowFocus: false, // Prevents aggressive refetch on mobile app active state
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Centralized Query Keys Factory
 */
export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.transactions.lists(), filters] as const,
    detail: (id: string) =>
      [...queryKeys.transactions.all, 'detail', id] as const,
  },
  reports: {
    all: ['reports'] as const,
    lists: () => [...queryKeys.reports.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.reports.all, 'detail', id] as const,
  },
  weeklyGoals: {
    all: ['weeklyGoals'] as const,
    lists: () => [...queryKeys.weeklyGoals.all, 'list'] as const,
  },
  milestoneVaults: {
    all: ['milestoneVaults'] as const,
    lists: () => [...queryKeys.milestoneVaults.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.milestoneVaults.all, 'detail', id] as const,
  },
  insights: {
    all: ['insights'] as const,
    lists: () => [...queryKeys.insights.all, 'list'] as const,
  },
  userSettings: {
    all: ['userSettings'] as const,
  },
} as const;

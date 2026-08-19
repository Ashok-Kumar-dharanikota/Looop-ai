import { create } from 'zustand';

interface UIState {
  searchQuery: string;
  selectedCategoryFilter: string | null;
  selectedPeriodFilter: 'all' | 'weekly' | 'monthly';
  isAddExpenseModalOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategoryFilter: (category: string | null) => void;
  setSelectedPeriodFilter: (period: 'all' | 'weekly' | 'monthly') => void;
  setIsAddExpenseModalOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: '',
  selectedCategoryFilter: null,
  selectedPeriodFilter: 'all',
  isAddExpenseModalOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategoryFilter: (selectedCategoryFilter) =>
    set({ selectedCategoryFilter }),
  setSelectedPeriodFilter: (selectedPeriodFilter) =>
    set({ selectedPeriodFilter }),
  setIsAddExpenseModalOpen: (isAddExpenseModalOpen) =>
    set({ isAddExpenseModalOpen }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategoryFilter: null,
      selectedPeriodFilter: 'all',
    }),
}));

import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import {
  ArrowDownLeft,
  Car,
  Coffee,
  CreditCard,
  Film,
  HeartPulse,
  LayoutGrid,
  Plane,
  Receipt,
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react-native';
import { DailySummary, DailyTransactionItem } from './DailySummary';
import { useTransactions } from '@/hooks/use-database';
import { useAppStore } from '@/store';
import { ThemeColors, AppFonts } from '@/constants/theme';

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Food', icon: Utensils },
  { name: 'Transport', icon: Car },
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Bills', icon: CreditCard },
  { name: 'Groceries', icon: Coffee },
  { name: 'Entertainment', icon: Film },
  { name: 'Health', icon: HeartPulse },
  { name: 'Travel', icon: Plane },
];

const formatGroupDate = (dateString: string) => {
  try {
    const d = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[d.getMonth()] || 'AUG';
    const day = String(d.getDate()).padStart(2, '0');
    return { month, day };
  } catch {
    return { month: 'AUG', day: '01' };
  }
};

interface GroupItem {
  id: string;
  dateStr: string;
  date: { month: string; day: string };
  defaultExpanded: boolean;
  transactions: DailyTransactionItem[];
}

export const TransactionsTab: React.FC = () => {
  const { currencySymbol = '₹' } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Query live SQLite database via TanStack Query + Drizzle ORM
  const { transactions: dbTransactions } = useTransactions();

  // Group transactions by date
  const allGroups = useMemo<GroupItem[]>(() => {
    const txSource = dbTransactions || [];
    const groupsMap = new Map<string, DailyTransactionItem[]>();

    txSource.forEach((tx) => {
      const dateKey = tx.date || (tx.createdAt ? tx.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, []);
      }
      groupsMap.get(dateKey)!.push({
        id: tx.id,
        title: tx.description || tx.category,
        time: tx.timestamp,
        category: tx.category,
        amount: tx.amount,
      });
    });

    return Array.from(groupsMap.entries()).map(([dateKey, txList], index) => {
      const dateObj = formatGroupDate(dateKey);
      return {
        id: `group-${dateKey}`,
        dateStr: dateKey,
        date: dateObj,
        defaultExpanded: index === 0,
        transactions: txList,
      };
    });
  }, [dbTransactions]);

  // Filter groups based on search query and category
  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allGroups
      .map((group) => {
        const matchingTxs = group.transactions.filter((t) => {
          const matchesSearch =
            !query ||
            (t.title ? t.title.toLowerCase().includes(query) : false) ||
            t.category.toLowerCase().includes(query);
          const matchesCat =
            selectedCat === 'All' ||
            t.category.toLowerCase().includes(selectedCat.toLowerCase());
          return matchesSearch && matchesCat;
        });

        if (matchingTxs.length === 0) return null;
        return {
          ...group,
          transactions: matchingTxs,
        };
      })
      .filter((g): g is GroupItem => g !== null);
  }, [allGroups, search, selectedCat]);

  // Overall metric totals
  const { totalMonthlySpend, totalTxCount } = useMemo(() => {
    let spend = 0;
    let count = 0;
    (dbTransactions || []).forEach((t) => {
      spend += Math.abs(t.amount);
      count++;
    });
    return { totalMonthlySpend: spend, totalTxCount: count };
  }, [dbTransactions]);

  const handleCategoryPress = useCallback((catName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCat(catName);
  }, []);

  const handleClearFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSearch('');
    setSelectedCat('All');
  }, []);

  // Render header with stats, search box, and category pills
  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerSection}>
        {/* Title and Top Stats */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Transactions</Text>
            <Text style={styles.subtitle}>
              {totalTxCount} {totalTxCount === 1 ? 'record' : 'records'} • {currencySymbol}{totalMonthlySpend.toLocaleString('en-IN')} total
            </Text>
          </View>
          <View style={styles.statsBadge}>
            <Sparkles size={13} color={ThemeColors.primary} />
            <Text style={styles.statsBadgeText}>Live Sync</Text>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Search size={17} color={ThemeColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search merchants, notes, or tags..."
            placeholderTextColor={ThemeColors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.searchClearBtn}
            >
              <X size={14} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.name;
            const Icon = cat.icon;
            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => handleCategoryPress(cat.name)}
                activeOpacity={0.75}
                style={[
                  styles.pill,
                  isSelected ? styles.pillSelected : styles.pillUnselected,
                ]}
              >
                <Icon
                  size={15}
                  color={isSelected ? ThemeColors.primary : ThemeColors.textSecondary}
                  strokeWidth={isSelected ? 2.4 : 2}
                />
                <Text
                  style={[
                    styles.pillText,
                    isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }, [totalTxCount, totalMonthlySpend, currencySymbol, search, selectedCat, handleCategoryPress]);

  // Render FlashList item
  const renderItem = useCallback(({ item }: { item: GroupItem }) => {
    return (
      <DailySummary
        key={item.id}
        date={item.date}
        transactions={item.transactions}
        defaultExpanded={item.defaultExpanded}
      />
    );
  }, []);

  // Render empty state
  const renderEmpty = useCallback(() => {
    const isFiltered = search.trim().length > 0 || selectedCat !== 'All';
    return (
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconCircle}>
          <Receipt size={28} color={ThemeColors.textMuted} />
        </View>
        <Text style={styles.emptyStateTitle}>
          {isFiltered ? 'No matching transactions' : 'No transactions recorded yet'}
        </Text>
        <Text style={styles.emptyStateSub}>
          {isFiltered
            ? 'Try searching with different keywords or switch category filter.'
            : 'Speak or type your expenses in the Logger tab to see them here.'}
        </Text>
        {isFiltered && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleClearFilters}
            style={styles.clearFiltersBtn}
          >
            <Text style={styles.clearFiltersBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [search, selectedCat, handleClearFilters]);

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredGroups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.canvas,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 28,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  statsBadgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.primary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: AppFonts.jakarta.medium,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    padding: 0,
  },
  searchClearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ThemeColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    minHeight: 36,
  },
  pillSelected: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.2,
    borderColor: '#FFEDD5',
  },
  pillUnselected: {
    backgroundColor: ThemeColors.card,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  pillText: {
    fontSize: 13,
  },
  pillTextSelected: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.primary,
  },
  pillTextUnselected: {
    fontFamily: AppFonts.jakarta.medium,
    color: ThemeColors.textSecondary,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ThemeColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  emptyStateTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 16,
    color: ThemeColors.textPrimary,
    textAlign: 'center',
  },
  emptyStateSub: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  clearFiltersBtn: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: ThemeColors.textPrimary,
  },
  clearFiltersBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    color: '#FFFFFF',
    fontSize: 13,
  },
});

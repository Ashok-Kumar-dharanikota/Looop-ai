import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  Search,
  Utensils,
  Car,
  Coffee,
  ShoppingBag,
  CreditCard,
  ArrowDownLeft,
  Filter,
} from 'lucide-react-native';
import { DailySummary } from './DailySummary';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Income'];

const TRANSACTIONS = [
  { id: '1', title: 'Dinner at Italian Bistro', time: 'Today, 8:30 PM', category: 'Food & Dining', amount: -650, type: 'expense', icon: Utensils },
  { id: '2', title: 'Uber ride to office', time: 'Today, 5:15 PM', category: 'Transport', amount: -240, type: 'expense', icon: Car },
  { id: '3', title: 'Blue Tokai Coffee', time: 'Today, 10:00 AM', category: 'Food & Dining', amount: -350, type: 'expense', icon: Coffee },
  { id: '4', title: 'Monthly Salary Credit', time: 'Yesterday', category: 'Income', amount: 85000, type: 'income', icon: ArrowDownLeft },
  { id: '5', title: 'Nike Store Shopping', time: 'Yesterday', category: 'Shopping', amount: -3980, type: 'expense', icon: ShoppingBag },
  { id: '6', title: 'Electricity & Wifi Bill', time: 'Jun 5', category: 'Bills', amount: -2450, type: 'expense', icon: CreditCard },
];

export const TransactionsTab: React.FC = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Vibrant new theme colors
  const textPrimary = isDark ? '#FFFFFF' : '#0F0F14';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const iconBtnBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F4F4F7';
  const accentColor = isDark ? '#8B5CF6' : '#6D28D9'; // Vibrant purple

  const filtered = TRANSACTIONS.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || t.category.includes(selectedCat);
    return matchesSearch && matchesCat;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: textPrimary }]}>Transactions</Text>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: iconBtnBg }]}>
            <Filter size={16} color={textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={[styles.searchBox, { backgroundColor: iconBtnBg }]}>
          <Search size={18} color={textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            placeholder="Search transactions..."
            placeholderTextColor={textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category Pills */}
        <View style={styles.pillsRow}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCat(cat)}
                style={[
                  styles.pill,
                  isSelected
                    ? { backgroundColor: accentColor }
                    : { backgroundColor: iconBtnBg },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected
                      ? { color: '#FFFFFF' }
                      : { color: textSecondary },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Transaction List Replaced by DailySummary */}
      <DailySummary transactions={filtered} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  headerSection: {
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  filterBtn: {
    padding: 10,
    borderRadius: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

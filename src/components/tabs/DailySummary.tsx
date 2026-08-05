import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { ChevronRight, ChevronDown } from 'lucide-react-native';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#FF6B6B',
  'Transport': '#4ECDC4',
  'Shopping': '#FFE66D',
  'Bills': '#8B5CF6',
  'Income': '#22C55E',
};

const getCatColor = (cat: string) => CATEGORY_COLORS[cat] || '#A78BFA';

interface Transaction {
  id: string;
  title: string;
  time: string;
  category: string;
  amount: number;
  type: string;
  icon: any;
}

interface DailySummaryProps {
  transactions: Transaction[];
}

export const DailySummary: React.FC<DailySummaryProps> = ({ transactions }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [expanded, setExpanded] = useState(false);

  const textPrimary = isDark ? '#FFFFFF' : '#0F0F14';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#EAEAEA';
  const cardBg = isDark ? '#1C1C24' : '#FFFFFF'; // slightly lighter than page bg for contrast
  const dateBg = '#1E1E24'; 
  const trackBg = isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6';
  const iconBtnBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F4F4F7';

  // Calculate totals and chart data
  const { totalExpense, categoryData } = React.useMemo(() => {
    let total = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const amt = Math.abs(t.amount);
        total += amt;
        catMap[t.category] = (catMap[t.category] || 0) + amt;
      }
    });

    const chart = Object.entries(catMap).map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: getCatColor(name),
    }));

    return { totalExpense: total, categoryData: chart };
  }, [transactions]);

  // Find max category for message
  const maxCat = categoryData.length > 0 
    ? categoryData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current).name 
    : '';

  return (
    <View style={[styles.container, { borderColor, backgroundColor: cardBg }]}>
      <TouchableOpacity 
        style={styles.header}
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={[styles.dateSquare, { backgroundColor: dateBg }]}>
          <Text style={styles.monthText}>AUG</Text>
          <Text style={styles.dayText}>04</Text>
        </View>

        <View style={styles.summaryContent}>
          <Text style={[styles.summaryTitle, { color: textPrimary }]}>₹{totalExpense.toLocaleString()} Spent Today</Text>
          <Text style={[styles.summaryMessage, { color: textSecondary }]} numberOfLines={2}>
            {maxCat ? `You've spent the most on ${maxCat} today.` : 'No expenses recorded today.'}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          {expanded ? (
            <ChevronDown size={20} color={textSecondary} />
          ) : (
            <ChevronRight size={20} color={textSecondary} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.dropdownContent, { borderTopColor: borderColor }]}>
          <Text style={[styles.chartTitle, { color: textPrimary }]}>Spending by Category</Text>
          
          {/* Vertical Bar Chart */}
          {categoryData.length > 0 ? (
            <View style={styles.chartContainer}>
              {categoryData.map((data, index) => (
                <View key={index} style={styles.chartCol}>
                  <Text style={[styles.chartAmount, { color: textSecondary }]}>₹{data.amount}</Text>
                  <View style={[styles.barTrack, { backgroundColor: trackBg }]}>
                    <View 
                      style={[
                        styles.barFill, 
                        { height: `${data.percentage}%`, backgroundColor: data.color }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.chartLabel, { color: textSecondary }]} numberOfLines={1}>
                    {data.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: textSecondary, marginBottom: 20 }}>No category data to display.</Text>
          )}

          {/* Transaction List */}
          <View style={styles.listContainer}>
            <Text style={[styles.listTitle, { color: textPrimary }]}>All Transactions</Text>
            {transactions.map((item) => {
              const IconComp = item.icon;
              const isIncome = item.type === 'income';
              const formattedAmount = isIncome ? `+₹${item.amount.toLocaleString()}` : `-₹${Math.abs(item.amount).toLocaleString()}`;
              return (
                <View key={item.id} style={styles.txCard}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: isIncome ? 'rgba(34, 197, 94, 0.15)' : iconBtnBg },
                    ]}
                  >
                    <IconComp size={18} color={isIncome ? '#22C55E' : textPrimary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.txTitle, { color: textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.txSub, { color: textSecondary }]}>
                      {item.time} • {item.category}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.txAmount,
                      { color: isIncome ? '#22C55E' : textPrimary },
                    ]}
                  >
                    {formattedAmount}
                  </Text>
                </View>
              );
            })}
            {transactions.length === 0 && (
              <Text style={{ color: textSecondary, textAlign: 'center', marginTop: 10 }}>No transactions found.</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 0,
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dateSquare: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  monthText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  summaryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  iconContainer: {
    paddingLeft: 12,
  },
  dropdownContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  chartCol: {
    alignItems: 'center',
    width: 50,
  },
  chartAmount: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  barTrack: {
    width: 14,
    height: 110,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 10,
    gap: 12,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  txSub: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
});

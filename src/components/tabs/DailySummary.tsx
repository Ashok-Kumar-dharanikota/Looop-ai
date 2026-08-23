import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import {
  ChevronDown,
  Utensils,
  Car,
  ShoppingBag,
  CreditCard,
  Film,
  Coffee,
  Plane,
  HeartPulse,
  Wallet,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store';
import { ThemeColors, AppFonts } from '@/constants/theme';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#EF4444',
  'Food': '#EF4444',
  'Transport': '#0284C7',
  'Shopping': '#F59E0B',
  'Bills': '#7C3AED',
  'Bills & Utilities': '#7C3AED',
  'Entertainment': '#EC4899',
  'Health & Care': '#14B8A6',
  'Health': '#14B8A6',
  'Groceries & Cafe': '#10B981',
  'Groceries': '#10B981',
  'Travel & Trips': '#4F46E5',
  'Travel': '#4F46E5',
};

const getCatColor = (cat: string) => CATEGORY_COLORS[cat] || ThemeColors.primary;

export const getCategoryIconComp = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return Utensils;
  if (cat.includes('transport') || cat.includes('commute') || cat.includes('cab') || cat.includes('car')) return Car;
  if (cat.includes('shopping')) return ShoppingBag;
  if (cat.includes('bill') || cat.includes('utilit')) return CreditCard;
  if (cat.includes('entertain') || cat.includes('movie')) return Film;
  if (cat.includes('grocer') || cat.includes('cafe') || cat.includes('coffee')) return Coffee;
  if (cat.includes('travel') || cat.includes('trip')) return Plane;
  if (cat.includes('health') || cat.includes('care') || cat.includes('med')) return HeartPulse;
  return Wallet;
};

export interface DailyTransactionItem {
  id: string;
  title: string;
  time: string;
  category: string;
  amount: number;
}

export interface DailySummaryProps {
  id?: string;
  date?: {
    month: string;
    day: string;
  };
  transactions: DailyTransactionItem[];
  defaultExpanded?: boolean;
}

export const DailySummary: React.FC<DailySummaryProps> = React.memo(({
  date = { month: 'AUG', day: '04' },
  transactions,
  defaultExpanded = false,
}) => {
  const { currencySymbol = '₹' } = useAppStore();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  const toggleExpanded = () => {
    const nextState = !expanded;
    setExpanded(nextState);
    rotation.value = withTiming(nextState ? 180 : 0, { duration: 250 });
  };

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Calculate totals and chart data
  const { totalExpense, categoryData } = React.useMemo(() => {
    let expenseSum = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach((t) => {
      const amt = Math.abs(t.amount);
      expenseSum += amt;
      catMap[t.category] = (catMap[t.category] || 0) + amt;
    });

    const chart = Object.entries(catMap).map(([name, amount]) => ({
      name,
      amount,
      percentage: expenseSum > 0 ? Math.round((amount / expenseSum) * 100) : 0,
      color: getCatColor(name),
    }));

    return { totalExpense: expenseSum, categoryData: chart };
  }, [transactions]);

  // Find category with highest spend
  const maxCat =
    categoryData.length > 0
      ? categoryData.reduce((prev, current) => (prev.amount > current.amount ? prev : current)).name
      : '';

  const summaryHeading = `${currencySymbol}${totalExpense.toLocaleString('en-IN')}`;

  const summarySubtitle = maxCat
    ? `${transactions.length} ${transactions.length === 1 ? 'entry' : 'entries'} • Highest on ${maxCat}`
    : transactions.length > 0
    ? `${transactions.length} ${transactions.length === 1 ? 'entry' : 'entries'}`
    : 'No transactions';

  const headingColor = totalExpense > 0 ? ThemeColors.rose : ThemeColors.textPrimary;

  return (
    <Animated.View layout={LinearTransition.duration(250)} style={styles.container}>
      {/* Card Header (Tap to toggle) */}
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.75}
        onPress={toggleExpanded}
      >
        <View style={styles.dateTimeline}>
          <Text style={styles.monthText}>{date.month}</Text>
          <Text style={styles.dayText}>{date.day}</Text>
        </View>

        <View style={styles.summaryContent}>
          <Text style={[styles.summaryTitle, { color: headingColor }]} numberOfLines={1}>
            {summaryHeading}
          </Text>
          <Text style={styles.summaryMessage} numberOfLines={1}>
            {summarySubtitle}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Animated.View style={[styles.chevronBadge, animatedChevronStyle]}>
            <ChevronDown size={16} color={ThemeColors.textSecondary} strokeWidth={2.5} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Expandable Section */}
      {expanded && (
        <Animated.View
          entering={FadeInDown.duration(280).springify()}
          exiting={FadeOutUp.duration(180)}
          layout={LinearTransition.duration(250)}
          style={styles.dropdownContent}
        >
          {/* Segmented Category Proportion Bar */}
          {categoryData.length > 0 && (
            <View style={styles.chartSection}>
              <View style={styles.segmentBarWrapper}>
                {categoryData.map((cat, idx) => (
                  <View
                    key={cat.name}
                    style={[
                      styles.segmentBarPart,
                      {
                        backgroundColor: cat.color,
                        flex: cat.percentage || 1,
                        marginRight: idx < categoryData.length - 1 ? 2 : 0,
                      },
                    ]}
                  />
                ))}
              </View>

              {/* Category Chips List */}
              <View style={styles.categoryPillsRow}>
                {categoryData.map((cat) => (
                  <View key={cat.name} style={styles.catMiniChip}>
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.catMiniChipName} numberOfLines={1}>
                      {cat.name}
                    </Text>
                    <Text style={styles.catMiniChipAmt}>
                      {currencySymbol}{cat.amount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Transaction List */}
          <View style={styles.listContainer}>
            {transactions.map((item, idx) => {
              const IconComp = getCategoryIconComp(item.category);
              const formattedAmount = `-${currencySymbol}${Math.abs(item.amount).toLocaleString('en-IN')}`;
              const itemColor = getCatColor(item.category);
              const itemBgColor = `${itemColor}15`;

              const cleanTime = item.time.includes(',') ? item.time.split(', ').pop() : item.time;

              return (
                <View key={item.id}>
                  {idx > 0 && <View style={styles.txDivider} />}
                  <View style={styles.txCard}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: itemBgColor },
                      ]}
                    >
                      <IconComp size={18} color={itemColor} strokeWidth={2.2} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.txTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.txSub} numberOfLines={1}>
                        {cleanTime} • {item.category}
                      </Text>
                    </View>

                    <Text style={styles.txAmount}>
                      {formattedAmount}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.card,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: ThemeColors.card,
    minHeight: 44,
  },
  dateTimeline: {
    backgroundColor: ThemeColors.surface,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  monthText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10.5,
    color: ThemeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dayText: {
    fontFamily: AppFonts.outfit.extraBold,
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginTop: 1,
  },
  summaryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 17,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
    fontVariant: ['tabular-nums'],
  },
  summaryMessage: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12.5,
    color: ThemeColors.textSecondary,
  },
  iconContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  chevronBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ThemeColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  dropdownContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surface,
  },
  chartSection: {
    marginBottom: 12,
  },
  segmentBarWrapper: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: ThemeColors.border,
    gap: 2,
  },
  segmentBarPart: {
    height: '100%',
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  catMiniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: 5,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  catMiniChipName: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  catMiniChipAmt: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 11,
    color: ThemeColors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  listContainer: {
    marginTop: 2,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txTitle: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 14.5,
    color: ThemeColors.textPrimary,
  },
  txSub: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  txAmount: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  txDivider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: 2,
  },
});

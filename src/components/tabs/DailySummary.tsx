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
import { ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#FF5252',
  'Transport': '#00B8D9',
  'Shopping': '#FFAB00',
  'Bills': '#7C3AED',
  'Income': '#10B981',
  'Entertainment': '#EC4899',
  'Health': '#3B82F6',
};

const getCatColor = (cat: string) => CATEGORY_COLORS[cat] || '#8B5CF6';

export interface Transaction {
  id: string;
  title: string;
  time: string;
  category: string;
  amount: number;
  type: string;
  icon: any;
}

export interface DailySummaryProps {
  id?: string;
  date?: {
    month: string;
    day: string;
  };
  transactions: Transaction[];
  defaultExpanded?: boolean;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedBar = ({ percentage, color }: { percentage: number, color: string }) => {
  const height = useSharedValue(0);

  React.useEffect(() => {
    height.value = withTiming(Math.max(percentage, 8), { duration: 600 });
  }, [percentage]);

  const style = useAnimatedStyle(() => {
    return {
      height: `${height.value}%`,
      width: '100%',
      borderRadius: 4,
    };
  });

  return (
    <AnimatedGradient
      colors={['#000000', '#00000080']}
      style={style}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
  );
};

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
  const { totalExpense, totalIncome, categoryData } = React.useMemo(() => {
    let expenseSum = 0;
    let incomeSum = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        const amt = Math.abs(t.amount);
        expenseSum += amt;
        catMap[t.category] = (catMap[t.category] || 0) + amt;
      } else {
        incomeSum += Math.abs(t.amount);
      }
    });

    const chart = Object.entries(catMap).map(([name, amount]) => ({
      name,
      amount,
      percentage: expenseSum > 0 ? Math.round((amount / expenseSum) * 100) : 0,
      color: getCatColor(name),
    }));

    return { totalExpense: expenseSum, totalIncome: incomeSum, categoryData: chart };
  }, [transactions]);

  // Find category with highest spend
  const maxCat =
    categoryData.length > 0
      ? categoryData.reduce((prev, current) => (prev.amount > current.amount ? prev : current)).name
      : '';

  const summaryHeading =
    totalExpense > 0
      ? `${currencySymbol}${totalExpense.toLocaleString('en-IN')}`
      : totalIncome > 0
      ? `+${currencySymbol}${totalIncome.toLocaleString('en-IN')}`
      : `${currencySymbol}0`;

  const summarySubtitle = maxCat
    ? `${transactions.length} ${transactions.length === 1 ? 'entry' : 'entries'} • Highest on ${maxCat}`
    : totalIncome > 0
    ? `${transactions.length} credit ${transactions.length === 1 ? 'entry' : 'entries'}`
    : 'No transactions';

  const headingColor = totalExpense > 0 ? '#EF4444' : totalIncome > 0 ? '#10B981' : '#0F172A';

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
            <ChevronDown size={16} color="#64748B" strokeWidth={2.5} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {expanded && (
        <Animated.View
          entering={FadeInDown.duration(280).springify()}
          exiting={FadeOutUp.duration(180)}
          layout={LinearTransition.duration(250)}
          style={styles.dropdownContent}
        >
          {/* Multi-Segment Proportion Bar */}
          {categoryData.length > 0 && (
            <View style={styles.chartSection}>
              <View style={styles.segmentBarWrapper}>
                {categoryData.map((cat, idx) => (
                  <View
                    key={cat.name}
                    style={[
                      styles.segmentBarPart,
                      {
                        flex: Math.max(cat.percentage, 5),
                        backgroundColor: cat.color,
                        borderTopLeftRadius: idx === 0 ? 5 : 0,
                        borderBottomLeftRadius: idx === 0 ? 5 : 0,
                        borderTopRightRadius: idx === categoryData.length - 1 ? 5 : 0,
                        borderBottomRightRadius: idx === categoryData.length - 1 ? 5 : 0,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.categoryPillsRow}>
                {categoryData.slice(0, 3).map((cat) => (
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
              const IconComp = item.icon;
              const isIncome = item.type === 'income';
              const formattedAmount = isIncome
                ? `+${currencySymbol}${item.amount.toLocaleString('en-IN')}`
                : `-${currencySymbol}${Math.abs(item.amount).toLocaleString('en-IN')}`;

              const itemColor = isIncome ? '#10B981' : getCatColor(item.category);
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

                    <Text
                      style={[
                        styles.txAmount,
                        { color: isIncome ? '#10B981' : '#0F172A' },
                      ]}
                    >
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  dateTimeline: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  monthText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  summaryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
    fontVariant: ['tabular-nums'],
  },
  summaryMessage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
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
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dropdownContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    backgroundColor: '#FAFAFC',
  },
  chartSection: {
    marginBottom: 12,
  },
  segmentBarWrapper: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 5,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  catMiniChipName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  catMiniChipAmt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  txSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  txDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 2,
  },
});

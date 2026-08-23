import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Activity,
  Bell,
  Bus,
  Car,
  Coffee,
  CreditCard,
  HeartPulse,
  PieChart as PieIcon,
  Plane,
  PlaySquare,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import {
  useMilestoneVaults,
  useTransactions,
  useUserSettings,
  useWeeklyGoals,
} from '@/hooks/use-database';
import { RollingCounter } from '@/shared/ui/organisms/rolling-counter';
import { useAppStore, useUserStore } from '@/store';
import { ThemeColors, AppFonts, Radii, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getCategoryIcon = (iconName: string, size = 18, color = '#FFFFFF') => {
  const props = { size, color, strokeWidth: 2.2 };
  switch (iconName) {
    case 'Car':
      return <Car {...props} />;
    case 'Bus':
      return <Bus {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'Utensils':
      return <Utensils {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'PlaySquare':
      return <PlaySquare {...props} />;
    case 'Plane':
      return <Plane {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'CreditCard':
      return <CreditCard {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    default:
      return <Wallet {...props} />;
  }
};

export default function HomeScreen() {
  // View Mode Toggle: 'savings' (7-Day Area Chart) vs 'budget' (Budget & Category Breakdown)
  const [heroMode, setHeroMode] = useState<'savings' | 'budget'>('savings');

  // User Profile
  const { user: storeUser } = useUserStore();
  const { user: fbUser } = useAuth();
  const currentUser = fbUser || storeUser;
  const photoURL = currentUser?.photoURL || null;
  const displayName = currentUser?.displayName || 'there';
  const firstName = displayName.split(' ')[0] || 'there';
  const avatarInitial = (displayName ? displayName.charAt(0) : 'U').toUpperCase();

  // Query live SQLite database via TanStack Query
  const { transactions: dbTransactions } = useTransactions();
  const { vaults } = useMilestoneVaults();
  const { goals: weeklyGoalsList } = useWeeklyGoals();
  const { settings, monthlyIncome, monthlySavingsTarget } = useUserSettings();
  const { currencySymbol = '₹' } = useAppStore();

  // Calendar dates
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const todayDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysLeftInMonth = Math.max(daysInMonth - now.getDate() + 1, 1);

  // 1. Real Monthly Budget from SQLite user_settings
  const monthlyBudget = useMemo(() => {
    if (settings?.monthlyBudget && Number(settings.monthlyBudget) > 0) {
      return Number(settings.monthlyBudget);
    }
    if (monthlyIncome && monthlySavingsTarget && monthlyIncome > monthlySavingsTarget) {
      return monthlyIncome - monthlySavingsTarget;
    }
    if (monthlyIncome && monthlyIncome > 0) {
      return monthlyIncome;
    }
    return 50000;
  }, [settings, monthlyIncome, monthlySavingsTarget]);

  // 2. Real Current Month Spending from SQLite
  const currentMonthSpent = useMemo(() => {
    if (!dbTransactions || dbTransactions.length === 0) return 0;
    return dbTransactions
      .filter(
        (tx) =>
          (tx.date ? tx.date.startsWith(currentMonthPrefix) : tx.createdAt?.startsWith(currentMonthPrefix))
      )
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }, [dbTransactions, currentMonthPrefix]);

  // 3. Real Budget Progress & Safe Daily Limit
  const remainingBudget = Math.max(monthlyBudget - currentMonthSpent, 0);
  const budgetSpentRatio = monthlyBudget > 0 ? Math.min(currentMonthSpent / monthlyBudget, 1) : 0;
  const budgetSpentPercent = monthlyBudget > 0 ? Math.round((currentMonthSpent / monthlyBudget) * 100) : 0;
  const dailySafeSpend = Math.round(remainingBudget / daysLeftInMonth);

  // 4. Real Today's Expenses
  const totalExpensesToday = useMemo(() => {
    if (!dbTransactions || dbTransactions.length === 0) return 0;
    return dbTransactions
      .filter(
        (tx) =>
          (tx.date === todayDateStr || tx.createdAt?.startsWith(todayDateStr))
      )
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }, [dbTransactions, todayDateStr]);

  // 5. Real Total Lifetime Savings Accrued (Vaults + Completed Habit Tasks)
  const completedTasksCount = useMemo(() => {
    return weeklyGoalsList.filter((g) => g.completed).length;
  }, [weeklyGoalsList]);

  const totalSavedTillNow = useMemo(() => {
    const vaultSum = vaults.reduce((sum, v) => sum + (v.currentAmount || 0), 0);
    const taskSavingsSum = weeklyGoalsList
      .filter((g) => g.completed)
      .reduce((sum, g) => sum + (g.savingsAmount || 0), 0);
    return vaultSum > 0 ? vaultSum : taskSavingsSum;
  }, [vaults, weeklyGoalsList]);

  const todayGoalSavings = useMemo(() => {
    return weeklyGoalsList
      .filter(
        (g) =>
          g.completed &&
          (g.completedAt ? g.completedAt.startsWith(todayDateStr) : true)
      )
      .reduce((sum, g) => sum + (g.savingsAmount || 0), 0);
  }, [weeklyGoalsList, todayDateStr]);

  // 6. Real Cumulative Savings Growth Area Chart Data (Last 7 Days)
  const savingsAreaChartData = useMemo(() => {
    // Map completed goal savings by completion date (YYYY-MM-DD)
    const dailyGoalSavingsMap: Record<string, number> = {};

    weeklyGoalsList.forEach((goal) => {
      if (goal.completed) {
        const amt = goal.savingsAmount || 0;
        const dStr =
          goal.completedAt?.split('T')[0] ||
          goal.createdAt?.split('T')[0] ||
          todayDateStr;
        dailyGoalSavingsMap[dStr] = (dailyGoalSavingsMap[dStr] || 0) + amt;
      }
    });

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const days: { dateKey: string; label: string; isToday: boolean; dailySaved: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;
      const isToday = i === 0;
      const dailySaved = dailyGoalSavingsMap[dateKey] || 0;

      days.push({
        dateKey,
        label: isToday ? 'Today' : `${monthNames[d.getMonth()]} ${d.getDate()}`,
        isToday,
        dailySaved,
      });
    }

    // Work backwards from current totalSavedTillNow
    const points = new Array(7);
    let runningTotal = totalSavedTillNow;

    for (let i = 6; i >= 0; i--) {
      const day = days[i];
      points[i] = {
        value: Math.max(Math.round(runningTotal), 0),
        label: day.label,
        labelTextStyle: day.isToday
          ? { color: '#059669', fontWeight: '700' as const, fontSize: 10 }
          : { color: '#94A3B8', fontWeight: '600' as const, fontSize: 10 },
        showDataPoint: true,
        dataPointColor: day.isToday ? '#059669' : '#94A3B8',
        dataPointRadius: day.isToday ? 5 : 3,
        customDataPoint: day.isToday
          ? () => (
            <View style={styles.dataPointOuterGreen}>
              <View style={styles.dataPointInnerGreen} />
            </View>
          )
          : undefined,
      };

      runningTotal -= day.dailySaved;
    }

    return points;
  }, [weeklyGoalsList, totalSavedTillNow, todayDateStr]);

  // 7. Real Category Spend Breakdown from SQLite
  const categoryBreakdown = useMemo(() => {
    if (!dbTransactions || dbTransactions.length === 0) {
      return [];
    }

    const currentMonthExpenses = dbTransactions.filter(
      (tx) =>
        (tx.date ? tx.date.startsWith(currentMonthPrefix) : tx.createdAt?.startsWith(currentMonthPrefix))
    );

    if (currentMonthExpenses.length === 0) {
      return [];
    }

    const catColorMap: Record<string, { color: string; bg: string; icon: string }> = {
      'Food & Dining': { color: '#EF4444', bg: '#FEE2E2', icon: 'Utensils' },
      'Food': { color: '#EF4444', bg: '#FEE2E2', icon: 'Utensils' },
      'Dining': { color: '#EF4444', bg: '#FEE2E2', icon: 'Utensils' },
      'Groceries': { color: '#10B981', bg: '#D1FAE5', icon: 'ShoppingBag' },
      'Shopping': { color: '#F59E0B', bg: '#FEF3C7', icon: 'ShoppingBag' },
      'Transport': { color: '#0284C7', bg: '#E0F2FE', icon: 'Bus' },
      'Commute': { color: '#0284C7', bg: '#E0F2FE', icon: 'Car' },
      'Subscriptions': { color: '#8B5CF6', bg: '#F3E8FF', icon: 'PlaySquare' },
      'Bills': { color: '#6366F1', bg: '#EEF2FF', icon: 'CreditCard' },
      'Lifestyle': { color: '#EC4899', bg: '#FCE7F3', icon: 'Coffee' },
      'Health': { color: '#14B8A6', bg: '#CCFBF1', icon: 'HeartPulse' },
      'Travel': { color: '#3B82F6', bg: '#DBEAFE', icon: 'Plane' },
      'General': { color: '#64748B', bg: '#F1F5F9', icon: 'Wallet' },
    };

    const aggMap: Record<string, { amount: number; color: string; bg: string; icon: string }> = {};

    currentMonthExpenses.forEach((tx) => {
      const catName = tx.category || 'General';
      const amt = Math.abs(tx.amount);
      const styling = catColorMap[catName] || {
        color: '#7C3AED',
        bg: '#F3E8FF',
        icon: 'Wallet',
      };

      if (!aggMap[catName]) {
        aggMap[catName] = {
          amount: 0,
          color: styling.color,
          bg: styling.bg,
          icon: styling.icon,
        };
      }
      aggMap[catName].amount += amt;
    });

    const totalSpend = currentMonthExpenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return Object.entries(aggMap)
      .map(([name, val]) => ({
        name,
        amount: Math.round(val.amount),
        percentage: totalSpend > 0 ? Math.round((val.amount / totalSpend) * 100) : 0,
        color: val.color,
        bg: val.bg,
        icon: val.icon,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [dbTransactions, currentMonthPrefix]);

  // 8. Real Transactions Feed
  const expenseItems = useMemo(() => {
    if (dbTransactions && dbTransactions.length > 0) {
      return dbTransactions
        .map((tx) => ({
          id: tx.id,
          description: tx.description || tx.category || 'Expense',
          category: tx.category || 'General',
          icon: tx.category || 'Wallet',
          timestamp: tx.timestamp || 'Today',
          amount: Math.abs(tx.amount),
        }));
    }
    return [];
  }, [dbTransactions]);

  const budgetPieData = useMemo(() => {
    if (currentMonthSpent === 0 && remainingBudget === 0) {
      return [
        { value: 1, color: '#F1F5F9' },
      ];
    }
    return [
      {
        value: Math.max(currentMonthSpent, 0.01),
        color: '#7C3AED',
        focused: true,
      },
      {
        value: Math.max(remainingBudget, 0.01),
        color: '#EDE9FE',
      },
    ];
  }, [currentMonthSpent, remainingBudget]);

  // Theme Constants (Harmonized with Auth & Onboarding)
  const bg = ThemeColors.canvas;
  const cardBg = ThemeColors.card;
  const cardBorder = ThemeColors.border;
  const textPrimary = ThemeColors.textPrimary;
  const textSecondary = ThemeColors.textSecondary;
  const iconBtnBg = ThemeColors.card;
  const badgeBg = ThemeColors.primarySoft;
  const dividerColor = ThemeColors.borderSubtle;

  const getGreeting = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    return `${timeOfDay}, ${firstName} 👋`;
  };

  const getPersonalizedMessage = () => {
    if (heroMode === 'savings') {
      if (totalSavedTillNow > 0) {
        return `You've accumulated ${currencySymbol}${totalSavedTillNow.toLocaleString('en-IN')} in total milestone savings!`;
      }
      return `Complete your first AI challenge to start funding your savings vaults!`;
    }
    if (currentMonthSpent > 0) {
      return `${currencySymbol}${remainingBudget.toLocaleString('en-IN')} remaining this month • Safe: ${currencySymbol}${dailySafeSpend}/day`;
    }
    return `Monthly budget: ${currencySymbol}${monthlyBudget.toLocaleString('en-IN')} • Ready to track expenses`;
  };

  const handleToggleMode = (mode: 'savings' | 'budget') => {
    Haptics.selectionAsync();
    setHeroMode(mode);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarRow}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatarImage} />
            ) : (
              <ExpoLinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>{avatarInitial}</Text>
              </ExpoLinearGradient>
            )}
            <View style={styles.headerTextContainer}>
              <Text style={[styles.greeting, { color: textPrimary }]}>{getGreeting()}</Text>
              <Text style={[styles.personalizedMsg, { color: textSecondary }]} numberOfLines={2}>
                {getPersonalizedMessage()}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: iconBtnBg }]}>
            <Bell size={20} color={textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Hero Card with Mode Toggle */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          {/* Card Header with Mode Toggle */}
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardBadge,
                heroMode === 'savings' ? styles.cardBadgeSavings : styles.cardBadgeBudget,
              ]}
            >
              {heroMode === 'savings' ? (
                <>
                  <TrendingUp size={14} color="#059669" />
                  <Text style={[styles.badgeText, { color: '#059669' }]}>Savings Growth Area</Text>
                </>
              ) : (
                <>
                  <PieIcon size={14} color="#7C3AED" />
                  <Text style={[styles.badgeText, { color: '#7C3AED' }]}>Monthly Budget & Categories</Text>
                </>
              )}
            </View>

            {/* Toggle Switcher */}
            <View style={styles.togglePillContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleToggleMode('savings')}
                style={[
                  styles.togglePillBtn,
                  heroMode === 'savings' && styles.togglePillBtnActive,
                ]}
              >
                <Activity size={13} color={heroMode === 'savings' ? '#059669' : '#94A3B8'} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleToggleMode('budget')}
                style={[
                  styles.togglePillBtn,
                  heroMode === 'budget' && styles.togglePillBtnActive,
                ]}
              >
                <PieIcon size={13} color={heroMode === 'budget' ? '#7C3AED' : '#94A3B8'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ------------------------------------------------------------- */}
          {/* VIEW A: REAL SAVINGS GROWTH & CUMULATIVE AREA CHART           */}
          {/* ------------------------------------------------------------- */}
          {heroMode === 'savings' ? (
            <View>
              <View style={styles.amountContainer}>
                <Text style={[styles.amountLabel, { color: textSecondary }]}>
                  Total Amount Saved
                </Text>
                <View style={styles.amountRow}>
                  <Text style={[styles.currency, { color: '#059669' }]}>{currencySymbol}</Text>
                  <RollingCounter
                    value={totalSavedTillNow}
                    height={38}
                    width={19}
                    fontSize={32}
                    color={textPrimary}
                    digitStyle={{ fontWeight: '800' }}
                  />
                </View>
              </View>

              {/* Chart Header */}
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartHeaderTitle}>SAVINGS GROWTH TRAJECTORY</Text>
                <Text style={[styles.chartHeaderSpend, { color: '#059669' }]}>
                  {todayGoalSavings > 0
                    ? `+${currencySymbol}${todayGoalSavings.toLocaleString('en-IN')} added today`
                    : `${completedTasksCount} challenges saved`}
                </Text>
              </View>

              {/* Gifted Charts Area Chart */}
              <View style={styles.giftedChartWrapper}>
                <LineChart
                  areaChart
                  curved
                  data={savingsAreaChartData}
                  height={110}
                  width={SCREEN_WIDTH - 110}
                  spacing={(SCREEN_WIDTH - 150) / 6}
                  initialSpacing={14}
                  endSpacing={14}
                  color="#059669"
                  thickness={3}
                  startFillColor="rgba(5, 150, 105, 0.32)"
                  endFillColor="rgba(5, 150, 105, 0.01)"
                  startOpacity={0.8}
                  endOpacity={0.05}
                  noOfSections={3}
                  rulesType="solid"
                  rulesColor="rgba(15, 23, 42, 0.05)"
                  yAxisColor="transparent"
                  xAxisColor="rgba(15, 23, 42, 0.08)"
                  yAxisTextStyle={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}
                  xAxisLabelTextStyle={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}
                  formatYLabel={(val) => {
                    const num = Number(val);
                    if (num >= 1000) return `${currencySymbol}${Math.round(num / 1000)}k`;
                    return `${currencySymbol}${num}`;
                  }}
                  isAnimated
                  animationDuration={500}
                  pointerConfig={{
                    pointerStripHeight: 90,
                    pointerStripColor: 'rgba(5, 150, 105, 0.35)',
                    pointerStripWidth: 1.5,
                    pointerColor: '#059669',
                    radius: 5,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 50,
                    activatePointersInstantlyOnTouch: true,
                    autoAdjustPointerLabelPosition: true,
                    shiftPointerLabelX: -40,
                    shiftPointerLabelY: -15,
                    pointerVanishDelay: 2500,
                    pointerComponent: () => (
                      <View style={styles.pointerOuterCircle}>
                        <View style={styles.pointerInnerCircle} />
                      </View>
                    ),
                    pointerLabelComponent: (items: any) => {
                      const item = Array.isArray(items) ? items[0] : items;
                      if (!item) return null;
                      return (
                        <View style={styles.tooltipCard}>
                          <Text style={styles.tooltipDateLabel}>{item.label || 'Savings'}</Text>
                          <Text style={styles.tooltipAmount}>
                            {currencySymbol}
                            {item.value !== undefined
                              ? Number(item.value).toLocaleString('en-IN')
                              : '0'}
                          </Text>
                        </View>
                      );
                    },
                  }}
                />
              </View>

              {/* Card Footer for Savings Area View */}
              <View style={[styles.cardFooter, { borderTopColor: dividerColor }]}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: '#059669' }]} />
                  <Text style={[styles.statusText, { color: textSecondary }]}>
                    Today's Spend: {currencySymbol}{totalExpensesToday.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.growthBadge}>
                  <ShieldCheck size={12} color="#059669" />
                  <Text style={styles.growthBadgeText}>
                    {completedTasksCount} Challenges Saved
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            /* ------------------------------------------------------------- */
            /* VIEW B: DONUT MONTHLY BUDGET & REAL CATEGORY BREAKDOWN        */
            /* ------------------------------------------------------------- */
            <View>
              <View style={styles.budgetCircleWrapper}>
                {/* Left: Donut Ring */}
                <View style={styles.circleContainer}>
                  <PieChart
                    donut
                    radius={48}
                    innerRadius={35}
                    data={budgetPieData}
                    centerLabelComponent={() => (
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.circlePercentText}>{budgetSpentPercent}%</Text>
                        <Text style={styles.circlePercentSub}>SPENT</Text>
                      </View>
                    )}
                    isAnimated
                    animationDuration={500}
                  />
                </View>

                {/* Right: Supporting Metrics */}
                <View style={styles.budgetMetricsCol}>
                  <View style={styles.budgetMetricItem}>
                    <Text style={styles.budgetMetricLabel}>CURRENT MONTH SPENT</Text>
                    <Text style={styles.budgetMetricValue}>
                      {currencySymbol}{currentMonthSpent.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.budgetMetricItem}>
                    <Text style={styles.budgetMetricLabel}>REMAINING BUDGET</Text>
                    <Text
                      style={[
                        styles.budgetMetricValue,
                        { color: remainingBudget > 0 ? '#059669' : '#EF4444' },
                      ]}
                    >
                      {currencySymbol}{remainingBudget.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.budgetOfTotal}>
                      of {currencySymbol}{monthlyBudget.toLocaleString('en-IN')} cap
                    </Text>
                  </View>

                  <View style={styles.safePacePill}>
                    <ShieldCheck size={12} color="#7C3AED" style={{ marginRight: 4 }} />
                    <Text style={styles.safePaceText}>
                      Safe: {currencySymbol}{dailySafeSpend}/day ({daysLeftInMonth}d left)
                    </Text>
                  </View>
                </View>
              </View>

              {/* Redesigned Clean Category Breakdown Section */}
              <View style={styles.catBreakdownContainer}>
                <View style={styles.catBarHeader}>
                  <Text style={styles.catBarHeaderTitle}>CATEGORY BREAKDOWN</Text>
                  <Text style={styles.catBarHeaderSub}>
                    {categoryBreakdown.length > 0
                      ? `${categoryBreakdown.length} active categories`
                      : 'This Month'}
                  </Text>
                </View>

                {categoryBreakdown.length > 0 ? (
                  <>
                    {/* Multi-Segment Proportion Bar */}
                    <View style={styles.segmentedBarTrack}>
                      {categoryBreakdown.map((cat, idx) => (
                        <View
                          key={cat.name}
                          style={[
                            styles.segmentedBarSlice,
                            {
                              backgroundColor: cat.color,
                              flex: Math.max(cat.percentage, 2),
                              borderTopLeftRadius: idx === 0 ? 4 : 0,
                              borderBottomLeftRadius: idx === 0 ? 4 : 0,
                              borderTopRightRadius:
                                idx === categoryBreakdown.length - 1 ? 4 : 0,
                              borderBottomRightRadius:
                                idx === categoryBreakdown.length - 1 ? 4 : 0,
                            },
                          ]}
                        />
                      ))}
                    </View>

                    {/* Category List */}
                    <View style={styles.catListGrid}>
                      {categoryBreakdown.slice(0, 4).map((cat) => (
                        <View key={cat.name} style={styles.catRowItem}>
                          <View style={[styles.catIconCircle, { backgroundColor: cat.bg }]}>
                            {getCategoryIcon(cat.icon, 13, cat.color)}
                          </View>
                          <View style={styles.catRowDetails}>
                            <View style={styles.catRowHeader}>
                              <Text style={styles.catRowName} numberOfLines={1}>
                                {cat.name}
                              </Text>
                              <Text style={styles.catRowAmount}>
                                {currencySymbol}{cat.amount.toLocaleString('en-IN')}
                              </Text>
                            </View>
                            <View style={styles.catProgressTrack}>
                              <View
                                style={[
                                  styles.catProgressFill,
                                  {
                                    width: `${Math.max(cat.percentage, 3)}%`,
                                    backgroundColor: cat.color,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                          <View style={[styles.catPercentBadge, { backgroundColor: cat.bg }]}>
                            <Text style={[styles.catPercentBadgeText, { color: cat.color }]}>
                              {cat.percentage}%
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                ) : (
                  <View style={styles.catEmptyBox}>
                    <PieIcon size={20} color="#94A3B8" />
                    <Text style={styles.catEmptyTitle}>No expenses logged this month</Text>
                    <Text style={styles.catEmptySub}>
                      Record an expense to see your live category breakdown
                    </Text>
                  </View>
                )}
              </View>

              {/* Card Footer for Budget View */}
              <View style={[styles.cardFooter, { borderTopColor: dividerColor }]}>
                <View style={styles.statusIndicator}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: budgetSpentPercent < 80 ? '#10B981' : '#EF4444' },
                    ]}
                  />
                  <Text style={[styles.statusText, { color: textSecondary }]}>
                    {budgetSpentPercent < 80
                      ? 'Within safe spending pace'
                      : 'Approaching monthly limit'}
                  </Text>
                </View>
                <View style={styles.progressMiniTrack}>
                  <View
                    style={[
                      styles.progressBarMini,
                      {
                        width: `${Math.min(budgetSpentPercent, 100)}%`,
                        backgroundColor: budgetSpentPercent < 80 ? '#7C3AED' : '#EF4444',
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Expenses List Timeline Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Recent Activity</Text>
            <View style={[styles.countBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.countText, { color: textPrimary }]}>{expenseItems.length}</Text>
            </View>
          </View>
          <View style={styles.totalBadge}>
            <Text style={[styles.totalLabel, { color: textSecondary }]}>Today: </Text>
            <Text style={[styles.currencySmall, { color: textPrimary }]}>{currencySymbol}</Text>
            <RollingCounter
              value={totalExpensesToday}
              height={24}
              width={11}
              fontSize={18}
              color={textPrimary}
              digitStyle={{ fontWeight: '700' }}
            />
          </View>
        </View>

        <View style={styles.listCard}>
          {expenseItems.length === 0 ? (
            <View style={styles.emptyListContainer}>
              <View style={styles.emptyIconCircle}>
                <Wallet size={28} color="#94A3B8" strokeWidth={1.8} />
              </View>
              <Text style={[styles.emptyListTitle, { color: textPrimary }]}>No transactions yet</Text>
              <Text style={[styles.emptyListSub, { color: textSecondary }]}>
                Tap the + button below to log an expense or income
              </Text>
            </View>
          ) : (
            <>
              {/* Native Fading Gradient Overlays */}
              <ExpoLinearGradient
                colors={[bg, 'rgba(255,255,255,0)']}
                style={styles.topBlur}
                pointerEvents="none"
              />

              <FlashList
                data={expenseItems}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
                renderItem={({ item, index }) => (
                  <View style={styles.timelineRow}>
                    {/* Timeline Indicator */}
                    <View style={styles.timelineIndicator}>
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: dividerColor },
                          index === 0 && { top: 20 },
                          index === expenseItems.length - 1 && { bottom: 0 },
                        ]}
                      />
                      <ExpoLinearGradient
                        colors={['#1F2937', '#0F172A']}
                        style={[styles.iconContainer, { borderColor: dividerColor }]}
                      >
                        {getCategoryIcon(item.icon, 18, '#FFFFFF')}
                      </ExpoLinearGradient>
                    </View>

                    {/* Content */}
                    <View style={styles.timelineContentWrapper}>
                      <View style={styles.timeHeader}>
                        <Text style={[styles.expenseTime, { color: textSecondary }]}>{item.timestamp}</Text>
                      </View>

                      <View style={[styles.timelineContentBox, { backgroundColor: cardBg, borderColor: dividerColor }]}>
                        <Text style={[styles.expenseText, { color: textPrimary, fontWeight: '400', lineHeight: 22 }]}>
                          I spent <Text style={{ fontWeight: '700' }}>{currencySymbol}{item.amount}</Text> on {item.description.toLowerCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />

              <ExpoLinearGradient
                colors={['rgba(255,255,255,0)', bg]}
                style={styles.bottomBlur}
                pointerEvents="none"
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.canvas,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  avatarRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 8,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 17,
    color: '#FFFFFF',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 20,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.4,
  },
  personalizedMsg: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12.5,
    color: ThemeColors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.card,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cardBadgeSavings: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  cardBadgeBudget: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  badgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  togglePillContainer: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.surface,
    borderRadius: 10,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  togglePillBtn: {
    width: 28,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePillBtnActive: {
    backgroundColor: ThemeColors.card,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  amountContainer: {
    marginBottom: 6,
  },
  amountLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: ThemeColors.textMuted,
    marginBottom: 2,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontFamily: AppFonts.outfit.extraBold,
    fontSize: 28,
    marginRight: 4,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  chartHeaderTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 9.5,
    color: ThemeColors.textMuted,
    letterSpacing: 0.6,
  },
  chartHeaderSpend: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10.5,
    color: ThemeColors.emerald,
  },
  giftedChartWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  dataPointOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataPointInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
  },
  dataPointOuterGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(5, 150, 105, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataPointInnerGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  pointerOuterCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(5, 150, 105, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerInnerCircle: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#059669',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tooltipCard: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tooltipDateLabel: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  tooltipAmount: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 12,
    color: '#34D399',
    fontVariant: ['tabular-nums'],
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 11.5,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  growthBadgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: '#059669',
  },
  budgetCircleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  circleContainer: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circlePercentText: {
    fontFamily: AppFonts.outfit.extraBold,
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  circlePercentSub: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 9,
    color: ThemeColors.primary,
    letterSpacing: 0.6,
  },
  budgetMetricsCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  budgetMetricItem: {
    marginBottom: 2,
  },
  budgetMetricLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 9,
    color: ThemeColors.textMuted,
    letterSpacing: 0.6,
  },
  budgetMetricValue: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  budgetOfTotal: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 10.5,
    color: ThemeColors.textSecondary,
  },
  safePacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  safePaceText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10.5,
    color: ThemeColors.primary,
  },
  catBreakdownContainer: {
    backgroundColor: ThemeColors.surface,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  catBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  catBarHeaderTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 9.5,
    color: ThemeColors.textMuted,
    letterSpacing: 0.6,
  },
  catBarHeaderSub: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  segmentedBarTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.border,
    overflow: 'hidden',
    marginBottom: 12,
    gap: 2,
  },
  segmentedBarSlice: {
    height: '100%',
  },
  catListGrid: {
    gap: 8,
  },
  catRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRowDetails: {
    flex: 1,
    gap: 3,
  },
  catRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catRowName: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 12.5,
    color: ThemeColors.textPrimary,
    maxWidth: 140,
  },
  catRowAmount: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 12.5,
    color: ThemeColors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  catProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: ThemeColors.borderSubtle,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  catPercentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catPercentBadgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
  },
  catEmptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  catEmptyTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 4,
  },
  catEmptySub: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 11,
    color: ThemeColors.textMuted,
    textAlign: 'center',
    maxWidth: 220,
  },
  progressMiniTrack: {
    width: 70,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  progressBarMini: {
    height: '100%',
    borderRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 18,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  countText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.primary,
  },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 12.5,
    color: ThemeColors.textSecondary,
  },
  currencySmall: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  listCard: {
    flex: 1,
    position: 'relative',
  },
  topBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    zIndex: 10,
  },
  bottomBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    zIndex: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineIndicator: {
    width: 44,
    alignItems: 'center',
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    top: 0,
    bottom: -12,
    left: 21,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
    zIndex: 1,
  },
  timelineContentWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  timeHeader: {
    marginBottom: 4,
  },
  expenseTime: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  timelineContentBox: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.card,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  expenseText: {
    fontFamily: AppFonts.jakarta.medium,
    fontSize: 13.5,
    color: ThemeColors.textPrimary,
    lineHeight: 20,
  },
  emptyListContainer: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ThemeColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  emptyListTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 15,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.2,
  },
  emptyListSub: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 18,
  },
});


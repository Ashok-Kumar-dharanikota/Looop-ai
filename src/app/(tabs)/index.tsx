import { FlashList } from '@shopify/flash-list';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Bus,
  Car,
  Coffee,
  CreditCard,
  HeartPulse,
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
import { useMemo } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFonts, ThemeColors } from '@/constants/theme';
import { AmbientGlow } from '@/features/auth/components/AmbientGlow';
import { useAuth } from '@/hooks/use-auth';
import {
  useRecentTransactions,
  useSavingsChartData,
  useTodayExpenses,
} from '@/hooks/use-database';
import { NativeCard } from '@/shared/ui/molecules/native-card';
import { RollingCounter } from '@/shared/ui/organisms/rolling-counter';
import { useAppStore, useUserStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 110;
const CHART_INITIAL_SPACING = 14;
const CHART_END_SPACING = 14;
const CHART_SPACING = (CHART_WIDTH - CHART_INITIAL_SPACING - CHART_END_SPACING) / 6;

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
  // User Profile
  const { user: storeUser } = useUserStore();
  const { user: fbUser } = useAuth();
  const currentUser = fbUser || storeUser;
  const photoURL = currentUser?.photoURL || null;
  const displayName = currentUser?.displayName || 'there';
  const firstName = displayName.split(' ')[0] || 'there';
  const avatarInitial = (displayName ? displayName.charAt(0) : 'U').toUpperCase();

  // Calendar dates
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const todayDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Query live SQLite database: only fetch what's needed without unwanted full-table overhead
  const { transactions: dbTransactions } = useRecentTransactions(20);
  const { totalToday: totalExpensesToday } = useTodayExpenses(todayDateStr);
  const {
    completedGoals,
    completedTasksCount,
    totalSavedTillNow,
    pendingGoalSavings,
  } = useSavingsChartData();
  const { currencySymbol = '₹' } = useAppStore();

  const todayGoalSavings = useMemo(() => {
    return completedGoals
      .filter((g) => {
        const dStr = g.completedAt?.split('T')[0] || g.createdAt?.split('T')[0] || '';
        return dStr === todayDateStr;
      })
      .reduce((sum, g) => sum + (g.savingsAmount || 0), 0);
  }, [completedGoals, todayDateStr]);

  // 6. Cumulative Savings Growth Area Chart Data: Last 7 Days (Last 6 Days + Today as Last Column)
  const savingsAreaChartData = useMemo(() => {
    // Map completed goal savings by completion date (YYYY-MM-DD)
    const dailyGoalSavingsMap: Record<string, number> = {};

    completedGoals.forEach((goal) => {
      const amt = goal.savingsAmount || 0;
      const dStr =
        goal.completedAt?.split('T')[0] ||
        goal.createdAt?.split('T')[0] ||
        todayDateStr;
      dailyGoalSavingsMap[dStr] = (dailyGoalSavingsMap[dStr] || 0) + amt;
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
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // 7 days window: Last 6 days (indices 0 to 5) + Today as the last column (index 6)
    const days: {
      dateKey: string;
      label: string;
      fullDateLabel: string;
      isToday: boolean;
      dailySaved: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;
      const isToday = i === 0;
      const dailySaved = dailyGoalSavingsMap[dateKey] || 0;
      const dayName = dayNames[d.getDay()];

      days.push({
        dateKey,
        label: isToday ? 'Today' : `${monthNames[d.getMonth()]} ${d.getDate()}`,
        fullDateLabel: isToday
          ? 'Today'
          : `${dayName}, ${monthNames[d.getMonth()]} ${d.getDate()}`,
        isToday,
        dailySaved,
      });
    }

    // Work backwards from current totalSavedTillNow (Today = index 6)
    const points = new Array(7);
    let runningTotal = totalSavedTillNow;

    for (let i = 6; i >= 0; i--) {
      const day = days[i];
      points[i] = {
        value: Math.max(Math.round(runningTotal), 0),
        label: day.label,
        labelTextStyle: day.isToday
          ? { color: '#059669', fontWeight: '800' as const, fontSize: 10 }
          : { color: '#94A3B8', fontWeight: '600' as const, fontSize: 9.5 },
        showDataPoint: true,
        dataPointColor: day.isToday ? '#059669' : '#10B981',
        dataPointRadius: day.isToday ? 5 : 3,
        customDataPoint: day.isToday
          ? () => (
            <View style={styles.dataPointOuterGreen}>
              <View style={styles.dataPointInnerGreen} />
            </View>
          )
          : undefined,
        tooltipDate: day.fullDateLabel,
        isToday: day.isToday,
      };

      runningTotal -= day.dailySaved;
    }

    return points;
  }, [completedGoals, totalSavedTillNow, todayDateStr]);

  // 4. Real Transactions Feed
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
    if (totalSavedTillNow > 0) {
      return `You've accumulated ${currencySymbol}${totalSavedTillNow.toLocaleString('en-IN')} in total milestone savings!`;
    }
    return `Complete your first AI challenge to start funding your savings vaults!`;
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <AmbientGlow />
          <View style={styles.avatarRow}>
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

        {/* Hero Card: Savings Growth Area */}
        <NativeCard
          backgroundColor={cardBg}
          borderColor={cardBorder}
          borderWidth={1}
          borderRadius={32}
          padding={18}
          elevation={2}
          style={styles.heroCardHost}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={[styles.cardBadge, styles.cardBadgeSavings]}>
              <TrendingUp size={14} color="#059669" />
              <Text style={[styles.badgeText, { color: '#059669' }]}>Savings Growth Area</Text>
            </View>
          </View>

          {/* Amount Saved Display */}
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
            <Text style={styles.chartHeaderTitle}>SAVINGS GROWTH (LAST 7 DAYS)</Text>
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
              width={CHART_WIDTH}
              spacing={CHART_SPACING}
              initialSpacing={CHART_INITIAL_SPACING}
              endSpacing={CHART_END_SPACING}
              disableScroll
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
              xAxisLabelTextStyle={{ color: '#94A3B8', fontSize: 9.5, fontWeight: '600' }}
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
                      <Text style={styles.tooltipDateLabel}>
                        {item.tooltipDate || item.label || 'Savings'}
                      </Text>
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
        </NativeCard>

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
    position: 'relative',
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
  heroCardHost: {
    width: '100%',
    marginBottom: 16,
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
  badgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    letterSpacing: 0.2,
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


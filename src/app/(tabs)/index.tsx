import { RollingCounter } from '@/shared/ui/organisms/rolling-counter';
import { FlashList } from '@shopify/flash-list';
import { Canvas, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Car,
  Coffee,
  Info,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Utensils,
  Wallet
} from 'lucide-react-native';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EXPENSES_DATA = [
  { id: '1', description: 'Uber ride to office', icon: 'Car', timestamp: '09:00 AM', amount: 250 },
  { id: '2', description: 'Coffee at Starbucks', icon: 'Coffee', timestamp: '09:30 AM', amount: 350 },
  { id: '3', description: 'Lunch with colleagues', icon: 'Utensils', timestamp: '01:15 PM', amount: 450 },
  { id: '4', description: 'Grocery shopping', icon: 'ShoppingBag', timestamp: '06:45 PM', amount: 1200 },
  { id: '5', description: 'Netflix subscription', icon: 'Sparkles', timestamp: '08:00 PM', amount: 649 },
];

const getExpenseIcon = (iconName: string) => {
  const props = { size: 20, color: '#FFFFFF' };
  switch (iconName) {
    case 'Car': return <Car {...props} />;
    case 'Coffee': return <Coffee {...props} />;
    case 'Utensils': return <Utensils {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    default: return <Wallet {...props} />;
  }
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 140;

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = false;

  // Dynamic Theme Palette
  const bg = '#FFFFFF';
  const cardBg = isDark ? '#13131A' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#EAEAEA';
  const textPrimary = isDark ? '#FFFFFF' : '#0F0F14';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const iconBtnBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F4F4F7';
  const barColor = isDark ? '#FFFFFF' : '#0F0F14';
  const tooltipBg = isDark ? '#FFFFFF' : '#0F0F14';
  const tooltipText = isDark ? '#0F0F14' : '#FFFFFF';
  const chartLineColor = isDark ? '#C084FC' : '#0F0F14';
  const gradientStart = isDark ? 'rgba(192, 132, 252, 0.35)' : 'rgba(15, 15, 20, 0.22)';
  const gradientEnd = isDark ? 'rgba(192, 132, 252, 0.0)' : 'rgba(15, 15, 20, 0.0)';
  const badgeBg = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F4F4F7';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#D1D5DB';
  const progressBarTrack = isDark ? 'rgba(255, 255, 255, 0.12)' : '#EBEBEF';

  // Build Curved Line Path using Skia 2.x PathBuilder API
  const lineBuilder = Skia.PathBuilder.Make();
  lineBuilder.moveTo(0, CHART_HEIGHT * 0.85);
  lineBuilder.cubicTo(20, CHART_HEIGHT * 0.82, 35, CHART_HEIGHT * 0.72, 50, CHART_HEIGHT * 0.65);
  lineBuilder.cubicTo(65, CHART_HEIGHT * 0.58, 80, CHART_HEIGHT * 0.62, 95, CHART_HEIGHT * 0.5);
  lineBuilder.cubicTo(110, CHART_HEIGHT * 0.38, 125, CHART_HEIGHT * 0.48, 140, CHART_HEIGHT * 0.42);
  lineBuilder.cubicTo(155, CHART_HEIGHT * 0.36, 170, CHART_HEIGHT * 0.52, 185, CHART_HEIGHT * 0.48);
  lineBuilder.cubicTo(200, CHART_HEIGHT * 0.44, 215, CHART_HEIGHT * 0.3, 230, CHART_HEIGHT * 0.22);
  lineBuilder.cubicTo(245, CHART_HEIGHT * 0.15, 260, CHART_HEIGHT * 0.28, CHART_WIDTH, CHART_HEIGHT * 0.18);
  const linePath = lineBuilder.build();

  // Build Area Fill Path
  const areaBuilder = Skia.PathBuilder.Make();
  areaBuilder.moveTo(0, CHART_HEIGHT * 0.85);
  areaBuilder.cubicTo(20, CHART_HEIGHT * 0.82, 35, CHART_HEIGHT * 0.72, 50, CHART_HEIGHT * 0.65);
  areaBuilder.cubicTo(65, CHART_HEIGHT * 0.58, 80, CHART_HEIGHT * 0.62, 95, CHART_HEIGHT * 0.5);
  areaBuilder.cubicTo(110, CHART_HEIGHT * 0.38, 125, CHART_HEIGHT * 0.48, 140, CHART_HEIGHT * 0.42);
  areaBuilder.cubicTo(155, CHART_HEIGHT * 0.36, 170, CHART_HEIGHT * 0.52, 185, CHART_HEIGHT * 0.48);
  areaBuilder.cubicTo(200, CHART_HEIGHT * 0.44, 215, CHART_HEIGHT * 0.3, 230, CHART_HEIGHT * 0.22);
  areaBuilder.cubicTo(245, CHART_HEIGHT * 0.15, 260, CHART_HEIGHT * 0.28, CHART_WIDTH, CHART_HEIGHT * 0.18);
  areaBuilder.lineTo(CHART_WIDTH, CHART_HEIGHT);
  areaBuilder.lineTo(0, CHART_HEIGHT);
  areaBuilder.close();
  const areaPath = areaBuilder.build();

  const peakPoint = { x: CHART_WIDTH - 28, y: CHART_HEIGHT * 0.2 };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar style="dark" />
      <View style={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greetingText, { color: textSecondary }]}>Good Morning, 👋</Text>
            <Text style={[styles.nameText, { color: textPrimary }]}>Alex</Text>
          </View>
          <TouchableOpacity style={[styles.bellBtn, { backgroundColor: iconBtnBg }]}>
            <Bell size={20} color={textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Hero Savings Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroSubtext, { color: textSecondary }]}>Saved till today</Text>

          <View style={styles.amountRow}>
            <Text style={[styles.amountText, { color: textPrimary }]}>₹</Text>
            <RollingCounter
              value={32450}
              height={42}
              width={24}
              fontSize={36}
              color={textPrimary}
              digitStyle={{ fontWeight: '800', letterSpacing: -0.8 }}
            />
            <TouchableOpacity style={styles.infoBtn} activeOpacity={0.6}>
              <Info size={18} color={textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.trendBadge, { backgroundColor: badgeBg }]}>
            <TrendingUp size={14} color={textPrimary} />
            <Text style={[styles.trendText, { color: textPrimary }]}>18% vs last 7 days</Text>
          </View>
        </View>

        {/* Skia Area Chart & Tooltip */}
        <View style={styles.chartContainer}>
          <View style={styles.canvasWrapper}>
            {/* Tooltip Badge over Peak */}
            <View
              style={[
                styles.tooltipPill,
                {
                  left: peakPoint.x - 30,
                  top: peakPoint.y - 32,
                  backgroundColor: tooltipBg,
                },
              ]}
            >
              <Text style={[styles.tooltipText, { color: tooltipText }]}>₹32,450</Text>
            </View>

            {/* Vertical Guide Line */}
            <View
              style={[
                styles.dashedLine,
                {
                  left: peakPoint.x,
                  top: peakPoint.y + 4,
                  height: CHART_HEIGHT - peakPoint.y,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                },
              ]}
            />

            {/* Skia Canvas */}
            <Canvas style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
              <Path path={areaPath}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, CHART_HEIGHT)}
                  colors={[gradientStart, gradientEnd]}
                />
              </Path>
              <Path
                path={linePath}
                color={chartLineColor}
                style="stroke"
                strokeWidth={2.2}
                strokeCap="round"
              />
            </Canvas>

            {/* Glowing Peak Point Dot */}
            <View
              style={[
                styles.peakDotOuter,
                {
                  left: peakPoint.x - 6,
                  top: peakPoint.y - 6,
                  backgroundColor: textPrimary,
                },
              ]}
            >
              <View style={[styles.peakDotInner, { backgroundColor: bg }]} />
            </View>
          </View>

          {/* Y-Axis Labels */}
          <View style={styles.yAxisContainer}>
            <Text style={[styles.axisText, { color: textSecondary }]}>40K</Text>
            <Text style={[styles.axisText, { color: textSecondary }]}>30K</Text>
            <Text style={[styles.axisText, { color: textSecondary }]}>20K</Text>
            <Text style={[styles.axisText, { color: textSecondary }]}>10K</Text>
            <Text style={[styles.axisText, { color: textSecondary }]}>0</Text>
          </View>
        </View>

        {/* X-Axis Date Labels */}
        <View style={styles.xAxisRow}>
          <Text style={[styles.axisText, { color: textSecondary }]}>May 10</Text>
          <Text style={[styles.axisText, { color: textSecondary }]}>May 17</Text>
          <Text style={[styles.axisText, { color: textSecondary }]}>May 24</Text>
          <Text style={[styles.axisText, { color: textSecondary }]}>May 31</Text>
          <Text style={[styles.axisText, { color: textSecondary }]}>Jun 7</Text>
          <Text style={[styles.axisTextBold, { color: textPrimary }]}>Today</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>How much i spent Today?</Text>
        </View>

        <View style={[styles.listCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <FlashList
            data={EXPENSES_DATA}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={styles.timelineRow}>
                {/* Timeline Indicator */}
                <View style={styles.timelineIndicator}>
                  <View style={[styles.timelineDot, { borderColor: textPrimary }]} />
                  {index !== EXPENSES_DATA.length - 1 && (
                    <View style={[styles.timelineLine, { borderColor: dividerColor }]} />
                  )}
                </View>

                {/* Content */}
                <View style={[styles.timelineContentBox, { justifyContent: 'space-between' }]}>
                  <View style={styles.expenseItem}>
                    <View style={styles.iconContainer}>
                      {getExpenseIcon(item.icon)}
                    </View>
                    <View>
                      <Text style={[styles.expenseText, { color: textPrimary }]}>{item.description}</Text>
                      <Text style={[styles.expenseTime, { color: textSecondary }]}>{item.timestamp}</Text>
                    </View>
                  </View>
                  <Text style={[styles.itemAmount, { color: textPrimary }]}>₹{item.amount}</Text>
                </View>
              </View>
            )}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    // paddingBottom: 32,
  },
  titleContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  listCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseText: {
    fontSize: 15,
    fontWeight: '500',
  },
  expenseTime: {
    fontSize: 13,
    marginTop: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    paddingBottom: 24,
  },
  timelineIndicator: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: 'transparent',
    marginTop: 14,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 26,
    bottom: -14,
    left: '50%',
    marginLeft: -1,
    width: 2,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontFamily: 'serif',
  },
  brandSparkle: {
    marginLeft: 4,
    marginTop: -10,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    marginBottom: 12,
  },
  heroSubtext: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  infoBtn: {
    padding: 4,
  },
  trendBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  canvasWrapper: {
    flex: 1,
    position: 'relative',
  },
  tooltipPill: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dashedLine: {
    position: 'absolute',
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    zIndex: 5,
  },
  peakDotOuter: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  peakDotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  yAxisContainer: {
    width: 32,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 6,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingRight: 36,
  },
  axisText: {
    fontSize: 11,
    fontWeight: '500',
  },
  axisTextBold: {
    fontSize: 11,
    fontWeight: '800',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardSubtext: {
    fontSize: 11,
    marginTop: 2,
  },
  cardIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDivider: {
    height: 1,
    marginVertical: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
    height: 160,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barAmount: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
  },
  barTrack: {
    height: 90,
    width: 28,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  categoryMeta: {
    alignItems: 'center',
    gap: 4,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12,
  },
  timelineCard: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginTop: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  timelineSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalSpentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  totalSpentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timelineList: {
    marginTop: 6,
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  timelineLeftColumn: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
  },
  timelineTrackContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  timelineContentBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 10,
  },
  itemIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemTag: {
    fontSize: 11,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
});

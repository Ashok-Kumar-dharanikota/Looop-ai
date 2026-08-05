import React from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { Canvas, Path, Skia, LinearGradient, vec, Circle } from '@shopify/react-native-skia';
import { TrendingUp, Sparkles, ShieldCheck } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 160;

interface SavingsAreaChartProps {
  compact?: boolean;
}

export const SavingsAreaChart: React.FC<SavingsAreaChartProps> = ({ compact = false }) => {
  const isDark = useColorScheme() === 'dark';
  const fgColor = isDark ? '#FFFFFF' : '#000000';
  const bgColor = isDark ? '#000000' : '#FFFFFF';
  const fgMuted = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const fgLight = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';

  const chartWidth = compact ? CARD_WIDTH - 32 : CARD_WIDTH - 40;
  const chartHeight = compact ? 100 : CHART_HEIGHT;

  // Build curved line path using PathBuilder (Skia 2.x API)
  const lineBuilder = Skia.PathBuilder.Make();
  lineBuilder.moveTo(0, chartHeight * 0.75);
  lineBuilder.cubicTo(
    chartWidth * 0.25,
    chartHeight * 0.85,
    chartWidth * 0.35,
    chartHeight * 0.35,
    chartWidth * 0.6,
    chartHeight * 0.45
  );
  lineBuilder.cubicTo(
    chartWidth * 0.8,
    chartHeight * 0.55,
    chartWidth * 0.88,
    chartHeight * 0.15,
    chartWidth,
    chartHeight * 0.2
  );
  const linePath = lineBuilder.build();

  // Build area fill path
  const areaBuilder = Skia.PathBuilder.Make();
  areaBuilder.moveTo(0, chartHeight * 0.75);
  areaBuilder.cubicTo(
    chartWidth * 0.25,
    chartHeight * 0.85,
    chartWidth * 0.35,
    chartHeight * 0.35,
    chartWidth * 0.6,
    chartHeight * 0.45
  );
  areaBuilder.cubicTo(
    chartWidth * 0.8,
    chartHeight * 0.55,
    chartWidth * 0.88,
    chartHeight * 0.15,
    chartWidth,
    chartHeight * 0.2
  );
  areaBuilder.lineTo(chartWidth, chartHeight);
  areaBuilder.lineTo(0, chartHeight);
  areaBuilder.close();
  const areaPath = areaBuilder.build();

  const activePoint = { x: chartWidth, y: chartHeight * 0.2 };

  return (
    <View style={[styles.cardContainer, { borderColor: fgLight }, compact && styles.compactCard]}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.badgeRow}>
            <Sparkles size={14} color={fgColor} />
            <Text style={[styles.badgeText, { color: fgColor }]}>AI SAVINGS ENGINE</Text>
          </View>
          <Text style={[styles.amountText, { color: fgColor }, compact && styles.compactAmount]}>$2,840.50</Text>
          <Text style={[styles.subtext, { color: fgMuted }]}>Saved automatically this month</Text>
        </View>

        <View style={[styles.growthBadge, { borderColor: fgLight }]}>
          <TrendingUp size={14} color={fgColor} />
          <Text style={[styles.growthText, { color: fgColor }]}>+34.2%</Text>
        </View>
      </View>

      {/* Skia Area Chart */}
      <View style={styles.chartWrapper}>
        <Canvas style={{ width: chartWidth, height: chartHeight }}>
          {/* Area Fill with Linear Gradient */}
          <Path path={areaPath}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, chartHeight)}
              colors={[isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0)']}
            />
          </Path>

          {/* Stroke Line */}
          <Path
            path={linePath}
            color={fgColor}
            style="stroke"
            strokeWidth={3}
            strokeCap="round"
          />

          {/* Peak Pulsing Dot */}
          <Circle cx={activePoint.x - 4} cy={activePoint.y} r={7} color={fgColor} />
          <Circle cx={activePoint.x - 4} cy={activePoint.y} r={3.5} color={bgColor} />
        </Canvas>
      </View>

      {!compact && (
        <View style={[styles.footerRow, { borderTopColor: fgLight }]}>
          <View style={styles.statItem}>
            <ShieldCheck size={16} color={fgColor} />
            <Text style={[styles.statLabel, { color: fgMuted }]}>Automated Vaults Active</Text>
          </View>
          <Text style={[styles.statValue, { color: fgColor }]}>3 Rule Sets</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    elevation: 0,
  },
  compactCard: {
    padding: 14,
    borderRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C084FC',
    letterSpacing: 0.8,
  },
  amountText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  compactAmount: {
    fontSize: 22,
  },
  subtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22C55E',
  },
  chartWrapper: {
    marginVertical: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    color: '#C084FC',
    fontWeight: '700',
  },
});

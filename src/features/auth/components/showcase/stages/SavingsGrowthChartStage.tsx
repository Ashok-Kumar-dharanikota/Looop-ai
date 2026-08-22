import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Line,
} from 'react-native-svg';
import { TrendingUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SavingsGrowthChartStageProps {
  isActive: boolean;
  currencySymbol: string;
}

export function SavingsGrowthChartStage({
  isActive,
  currencySymbol = '₹',
}: SavingsGrowthChartStageProps) {
  const { t } = useTranslation();
  const chartProgress = useSharedValue(0);
  const [displayAmount, setDisplayAmount] = useState(`${currencySymbol}0`);

  // SVG Chart Geometry
  const width = 300;
  const height = 75;

  // Bezier curve path
  const linePathD = `M 0 68 C 60 65, 80 52, 120 46 C 160 40, 200 32, 240 20 C 270 12, 290 8, 300 8`;
  const areaPathD = `${linePathD} L 300 ${height} L 0 ${height} Z`;
  const pathLength = 360;

  useEffect(() => {
    if (!isActive) {
      chartProgress.value = 0;
      setDisplayAmount(`${currencySymbol}0`);
      return;
    }

    chartProgress.value = 0;
    setDisplayAmount(`${currencySymbol}0`);

    let counterInterval: ReturnType<typeof setInterval> | null = null;

    const timer = setTimeout(() => {
      chartProgress.value = withTiming(1, {
        duration: 1600,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

      // Roll up amount counter
      let current = 0;
      const target = 84500;
      const step = 2816;
      counterInterval = setInterval(() => {
        current += step;
        if (current >= target) {
          setDisplayAmount(`${currencySymbol}84,500`);
          if (counterInterval) clearInterval(counterInterval);
        } else {
          setDisplayAmount(`${currencySymbol}${current.toLocaleString('en-IN')}`);
        }
      }, 50);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (counterInterval) clearInterval(counterInterval);
    };
  }, [isActive, currencySymbol]);

  const animatedLineProps = useAnimatedProps(() => {
    const strokeDashoffset = pathLength * (1 - chartProgress.value);
    return {
      strokeDashoffset,
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(chartProgress.value, [0, 0.8, 1], [0, 0.5, 1]) }],
    opacity: interpolate(chartProgress.value, [0, 0.7, 1], [0, 0.4, 1]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(380)}
      exiting={FadeOut.duration(260)}
      style={styles.chartStage}
    >
      <View style={styles.chartCardContainer}>
        <View style={styles.chartHeaderRow}>
          <View>
            <View style={styles.chartBadgePill}>
              <TrendingUp size={11} color="#EA580C" />
              <Text style={styles.chartBadgeText}>
                {t('showcase.chart.tag', '6-MONTH COMPOUNDED SAVINGS')}
              </Text>
            </View>
            <Text style={styles.chartAmountHero}>{displayAmount}</Text>
          </View>

          <View style={styles.chartGrowthTag}>
            <Text style={styles.chartGrowthTagText}>+{currencySymbol}84.5k</Text>
            <Text style={styles.chartGrowthTagSub}>
              {t('showcase.chart.savedSub', 'SAVED')}
            </Text>
          </View>
        </View>

        {/* SVG Smooth Area Chart Canvas */}
        <View style={styles.svgCanvasWrapper}>
          <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            <Defs>
              <SvgLinearGradient id="orangeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FF6B00" stopOpacity="0.32" />
                <Stop offset="80%" stopColor="#FF6B00" stopOpacity="0.04" />
                <Stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>

            {/* Grid Guideline */}
            <Line
              x1="0"
              y1={height * 0.5}
              x2={width}
              y2={height * 0.5}
              stroke="#F1F5F9"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Area Fill */}
            <Path d={areaPathD} fill="url(#orangeAreaGrad)" />

            {/* Curved Stroke Line */}
            <AnimatedPath
              d={linePathD}
              stroke="#FF6B00"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${pathLength} ${pathLength}`}
              animatedProps={animatedLineProps}
            />
          </Svg>

          {/* Milestone Pinpoint at Month 6 */}
          <Animated.View style={[styles.chartEndpointWrapper, animatedDotStyle]}>
            <View style={styles.chartEndpointHalo} />
            <View style={styles.chartEndpointCore} />
          </Animated.View>
        </View>

        {/* Timeline X-Axis Labels */}
        <View style={styles.timelineRow}>
          <Text style={styles.timelineLabelActive}>
            {t('showcase.chart.day1', `Day 1 (${currencySymbol}0)`, {
              currency: currencySymbol,
            })}
          </Text>
          <Text style={styles.timelineLabel}>{t('showcase.chart.mo1', 'Mo 1')}</Text>
          <Text style={styles.timelineLabel}>{t('showcase.chart.mo3', 'Mo 3')}</Text>
          <Text style={styles.timelineLabelHero}>
            {t('showcase.chart.mo6', `Month 6 (+${currencySymbol}84.5k)`, {
              currency: currencySymbol,
            })}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chartStage: {
    width: '100%',
  },
  chartCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  chartBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 8.5,
    color: '#EA580C',
    letterSpacing: 0.6,
  },
  chartAmountHero: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 20,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  chartGrowthTag: {
    alignItems: 'flex-end',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  chartGrowthTagText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12.5,
    color: '#EA580C',
  },
  chartGrowthTagSub: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 7.5,
    color: '#EA580C',
    letterSpacing: 0.6,
  },
  svgCanvasWrapper: {
    width: '100%',
    height: 75,
    position: 'relative',
    marginVertical: 4,
  },
  chartEndpointWrapper: {
    position: 'absolute',
    right: 0,
    top: 4,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartEndpointHalo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 107, 0, 0.3)',
  },
  chartEndpointCore: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF6B00',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timelineLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#94A3B8',
  },
  timelineLabelActive: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: '#64748B',
  },
  timelineLabelHero: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#EA580C',
  },
});

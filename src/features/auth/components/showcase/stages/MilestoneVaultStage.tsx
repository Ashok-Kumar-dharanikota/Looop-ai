import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Target, Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MilestoneVaultStageProps {
  isActive: boolean;
  currencySymbol: string;
}

export function MilestoneVaultStage({
  isActive,
  currencySymbol = '₹',
}: MilestoneVaultStageProps) {
  const { t } = useTranslation();
  const progress = useSharedValue(64);
  const [displayPercent, setDisplayPercent] = useState(64);
  const [displayAmount, setDisplayAmount] = useState(`${currencySymbol}1,60,000`);
  const [isBoosted, setIsBoosted] = useState(false);

  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    if (!isActive) {
      progress.value = 64;
      setDisplayPercent(64);
      setDisplayAmount(`${currencySymbol}1,60,000`);
      setIsBoosted(false);
      return;
    }

    progress.value = 64;
    setDisplayPercent(64);
    setDisplayAmount(`${currencySymbol}1,60,000`);
    setIsBoosted(false);

    let interval: ReturnType<typeof setInterval> | null = null;

    const boostTimer = setTimeout(() => {
      progress.value = withSpring(78, { damping: 14, stiffness: 90 });
      setIsBoosted(true);

      let current = 64;
      interval = setInterval(() => {
        current += 1;
        if (current >= 78) {
          setDisplayPercent(78);
          setDisplayAmount(`${currencySymbol}1,95,000`);
          if (interval) clearInterval(interval);
        } else {
          setDisplayPercent(current);
          setDisplayAmount(`${currencySymbol}${(current * 2500).toLocaleString()}`);
        }
      }, 55);
    }, 400);

    return () => {
      clearTimeout(boostTimer);
      if (interval) clearInterval(interval);
    };
  }, [isActive, currencySymbol]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value / 100);
    return {
      strokeDashoffset,
    };
  });

  return (
    <Animated.View
      entering={FadeInDown.duration(380)}
      exiting={FadeOut.duration(260)}
      style={styles.milestoneStage}
    >
      <View style={styles.milestoneCard}>
        <View style={styles.milestoneMainRow}>
          {/* Animated Circular Progress Ring */}
          <View style={styles.circularProgressContainer}>
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#FFF7ED"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#FF6B00"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                animatedProps={animatedCircleProps}
                strokeLinecap="round"
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
              />
            </Svg>

            <View style={styles.circularCenterContent}>
              <Text style={styles.circularPercentNumber}>{displayPercent}%</Text>
              <Text style={styles.circularPercentSub}>
                {t('showcase.milestone.savedLabel', 'SAVED')}
              </Text>
            </View>
          </View>

          {/* Milestone Vault Info */}
          <View style={styles.milestoneInfoColumn}>
            <View style={styles.vaultBadgePill}>
              <Target size={11} color="#EA580C" />
              <Text style={styles.vaultBadgePillText}>
                {t('showcase.milestone.tag', 'MILESTONE VAULT')}
              </Text>
            </View>

            <Text style={styles.milestoneGoalName} numberOfLines={1}>
              {t('showcase.milestone.goalTitle', 'Emergency Reserve Fund')}
            </Text>

            <Text style={styles.milestoneAmountHero}>{displayAmount}</Text>
            <Text style={styles.milestoneGoalSubtitle}>
              {t(
                'showcase.milestone.targetSub',
                `Target: ${currencySymbol}2,50,000 • ${100 - displayPercent}% to go`,
                {
                  currency: currencySymbol,
                  remaining: 100 - displayPercent,
                }
              )}
            </Text>
          </View>
        </View>

        {/* Task Boost Confirmation Footer */}
        <View style={styles.milestoneFooterRow}>
          <Sparkles size={12} color="#EA580C" />
          <Text style={styles.milestoneFooterText}>
            {isBoosted
              ? t(
                  'showcase.milestone.boostSuccess',
                  `+${currencySymbol}1,850 boosted from completed habit tasks!`,
                  {
                    currency: currencySymbol,
                  }
                )
              : t('showcase.milestone.depositing', 'Depositing task savings...')}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  milestoneStage: {
    width: '100%',
  },
  milestoneCard: {
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
  milestoneMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  circularProgressContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularPercentNumber: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 17,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  circularPercentSub: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 7.5,
    color: '#EA580C',
    letterSpacing: 0.6,
    marginTop: -1,
  },
  milestoneInfoColumn: {
    flex: 1,
  },
  vaultBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  vaultBadgePillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 8.5,
    color: '#EA580C',
    letterSpacing: 0.6,
  },
  milestoneGoalName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14.5,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  milestoneAmountHero: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 17,
    color: '#0F172A',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  milestoneGoalSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  milestoneFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  milestoneFooterText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#EA580C',
  },
});

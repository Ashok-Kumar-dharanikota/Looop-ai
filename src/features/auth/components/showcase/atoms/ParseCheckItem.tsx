import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { ParseItemProps } from '../../../types';

export function ParseCheckItem({ label, value, isResolved }: ParseItemProps) {
  const checkScale = useSharedValue(isResolved ? 1 : 0.85);
  const checkProgress = useSharedValue(isResolved ? 1 : 0);

  useEffect(() => {
    if (isResolved) {
      checkScale.value = withSequence(
        withSpring(1.2, { damping: 11, stiffness: 220 }),
        withSpring(1.0, { damping: 15, stiffness: 180 })
      );
      checkProgress.value = withTiming(1, {
        duration: 320,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
    } else {
      checkScale.value = 0.85;
      checkProgress.value = 0;
    }
  }, [isResolved]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    backgroundColor: interpolateColor(checkProgress.value, [0, 1], ['#F1F5F9', '#FF6B00']),
    borderColor: interpolateColor(checkProgress.value, [0, 1], ['#E2E8F0', '#FF6B00']),
  }));

  const animatedValueStyle = useAnimatedStyle(() => ({
    color: interpolateColor(checkProgress.value, [0, 1], ['#94A3B8', '#0F172A']),
  }));

  return (
    <View style={styles.parseItemRow}>
      <View style={styles.parseLeftLabel}>
        <Animated.View style={[styles.parseCheckCircle, animatedCircleStyle]}>
          {isResolved ? (
            <Check size={11} color="#FFFFFF" strokeWidth={3} />
          ) : (
            <View style={styles.parseCheckDot} />
          )}
        </Animated.View>
        <Text style={styles.parseLabelText}>{label}</Text>
      </View>
      <Animated.Text
        style={[
          styles.parseValueText,
          isResolved ? styles.parseValueTextBold : styles.parseValueTextNormal,
          animatedValueStyle,
        ]}
      >
        {value}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  parseItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  parseLeftLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parseCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  parseCheckDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
  },
  parseLabelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#64748B',
  },
  parseValueText: {
    fontSize: 12.5,
  },
  parseValueTextNormal: {
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  parseValueTextBold: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#0F172A',
  },
});

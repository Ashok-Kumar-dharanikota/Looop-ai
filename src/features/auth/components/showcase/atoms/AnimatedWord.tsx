import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';

interface AnimatedWordProps {
  text: string;
  isBlack: boolean;
  delay?: number;
}

export function AnimatedWord({ text, isBlack, delay = 0 }: AnimatedWordProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isBlack) {
      progress.value = withDelay(
        delay,
        withTiming(1, { duration: 380, easing: Easing.bezier(0.16, 1, 0.3, 1) })
      );
    } else {
      progress.value = 0;
    }
  }, [isBlack, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#CBD5E1', '#0F172A']),
    opacity: interpolate(progress.value, [0, 1], [0.65, 1]),
  }));

  return <Animated.Text style={[styles.streamWord, animatedStyle]}>{text}</Animated.Text>;
}

const styles = StyleSheet.create({
  streamWord: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
});

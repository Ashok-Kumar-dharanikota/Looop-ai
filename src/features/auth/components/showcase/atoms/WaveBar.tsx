import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface WaveBarProps {
  delay: number;
  maxHeight?: number;
}

export function WaveBar({ delay, maxHeight = 26 }: WaveBarProps) {
  const height = useSharedValue(6);

  useEffect(() => {
    height.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(maxHeight, {
            duration: 450,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        ),
        withTiming(6, {
          duration: 450,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ),
      -1,
      true
    );
  }, [delay, maxHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return <Animated.View style={[styles.waveBar, animatedStyle]} />;
}

const styles = StyleSheet.create({
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#FF6B00',
  },
});

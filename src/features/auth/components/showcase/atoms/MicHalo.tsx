import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function MicHalo() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.6, {
        duration: 1400,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, {
        duration: 1400,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
      -1,
      false
    );
  }, []);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.micHalo, haloStyle]} />;
}

const styles = StyleSheet.create({
  micHalo: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF6B00',
  },
});

import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';
import { Canvas, Oval, BlurMask, Group, mix, Rect, LinearGradient as SkiaLinearGradient, vec } from '@shopify/react-native-skia';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedMeshGradientProps {
  height?: number;
  intensity?: 'subtle' | 'vibrant';
}

export const AnimatedMeshGradient: React.FC<AnimatedMeshGradientProps> = ({
  height = 360,
  intensity = 'vibrant',
}) => {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);

  useEffect(() => {
    progress1.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    progress2.value = withRepeat(
      withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    progress3.value = withRepeat(
      withTiming(1, { duration: 13000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true
    );
  }, []);

  const transformBlob1 = useDerivedValue(() => [
    { translateX: mix(progress1.value, -40, 100) },
    { translateY: mix(progress1.value, -30, 60) },
    { scale: mix(progress1.value, 1, 1.25) },
    { rotate: mix(progress1.value, 0, Math.PI / 6) },
  ]);

  const transformBlob2 = useDerivedValue(() => [
    { translateX: mix(progress2.value, 120, -50) },
    { translateY: mix(progress2.value, -40, 70) },
    { scale: mix(progress2.value, 1.3, 0.9) },
    { rotate: mix(progress2.value, 0, -Math.PI / 4) },
  ]);

  const transformBlob3 = useDerivedValue(() => [
    { translateX: mix(progress3.value, 30, -80) },
    { translateY: mix(progress3.value, 80, -20) },
    { scale: mix(progress3.value, 0.85, 1.3) },
    { rotate: mix(progress3.value, 0, Math.PI / 8) },
  ]);

  const transformBlob4 = useDerivedValue(() => [
    { translateX: mix(progress1.value, -60, 80) },
    { translateY: mix(progress2.value, 50, -40) },
    { scale: mix(progress3.value, 1.1, 0.8) },
  ]);

  // Color scheme: Dreamy modern pastel mesh with rich violet, indigo, soft emerald & warm gold
  const blob1Color = intensity === 'vibrant' ? '#DDD6FE' : '#EDE9FE'; // Soft Violet
  const blob2Color = intensity === 'vibrant' ? '#C7D2FE' : '#E0E7FF'; // Soft Indigo
  const blob3Color = intensity === 'vibrant' ? '#A7F3D0' : '#D1FAE5'; // Soft Mint/Emerald
  const blob4Color = intensity === 'vibrant' ? '#FDE68A' : '#FEF3C7'; // Warm Amber/Gold

  return (
    <View style={[styles.container, { height }]}>
      <Canvas style={{ width: SCREEN_WIDTH, height }}>
        {/* Base ambient background */}
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={height}>
          <SkiaLinearGradient
            start={vec(0, 0)}
            end={vec(SCREEN_WIDTH, height)}
            colors={['#F5F3FF', '#EEF2FF', '#F0FDF4', '#FAFAFC']}
          />
        </Rect>

        <Group>
          <BlurMask blur={55} style="normal" />

          {/* Violet Blob */}
          <Group transform={transformBlob1}>
            <Oval x={-50} y={-40} width={SCREEN_WIDTH * 0.75} height={220} color={blob1Color} />
          </Group>

          {/* Indigo Blob */}
          <Group transform={transformBlob2}>
            <Oval x={SCREEN_WIDTH * 0.35} y={-60} width={SCREEN_WIDTH * 0.7} height={240} color={blob2Color} />
          </Group>

          {/* Mint/Emerald Blob */}
          <Group transform={transformBlob3}>
            <Oval x={-30} y={80} width={SCREEN_WIDTH * 0.65} height={200} color={blob3Color} />
          </Group>

          {/* Warm Amber Blob */}
          <Group transform={transformBlob4}>
            <Oval x={SCREEN_WIDTH * 0.4} y={100} width={SCREEN_WIDTH * 0.55} height={180} color={blob4Color} />
          </Group>
        </Group>
      </Canvas>

      {/* Bottom smooth fade to content background */}
      <View pointerEvents="none" style={styles.bottomFade} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'transparent',
  },
});

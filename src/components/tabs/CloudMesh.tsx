import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Oval, BlurMask, Group, mix } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

export const CloudMesh = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const transform1 = useDerivedValue(() => [
    { translateX: mix(progress.value, -50, 80) },
    { translateY: mix(progress.value, -20, 40) },
    { scale: mix(progress.value, 1, 1.2) },
    { rotate: mix(progress.value, 0, Math.PI / 8) }
  ]);

  const transform2 = useDerivedValue(() => [
    { translateX: mix(progress.value, 100, -30) },
    { translateY: mix(progress.value, -40, 60) },
    { scale: mix(progress.value, 1.2, 0.9) },
    { rotate: mix(progress.value, 0, -Math.PI / 6) }
  ]);

  const transform3 = useDerivedValue(() => [
    { translateX: mix(progress.value, 40, -60) },
    { translateY: mix(progress.value, 60, -30) },
    { scale: mix(progress.value, 0.9, 1.3) },
    { rotate: mix(progress.value, 0, Math.PI / 12) }
  ]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Group>
          <BlurMask blur={60} style="normal" />
          {/* Base background color */}
          <Oval x={-100} y={-100} width={600} height={500} color="#F8FAFC" />
          
          <Group transform={transform1}>
            <Oval x={0} y={-50} width={300} height={200} color="#E2E8F0" />
          </Group>
          
          <Group transform={transform2}>
            <Oval x={150} y={20} width={250} height={250} color="#CBD5E1" />
          </Group>
          
          <Group transform={transform3}>
            <Oval x={-50} y={100} width={350} height={200} color="#E2E8F0" />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
};

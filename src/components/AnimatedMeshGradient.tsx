import React, { useEffect } from 'react';
import { StyleSheet, View, useColorScheme, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  children?: React.ReactNode;
}

export function AnimatedMeshGradient({ children }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Floating continuous drift for circular ambient light spheres
  const sphere1X = useSharedValue(0);
  const sphere1Y = useSharedValue(0);
  const sphere2X = useSharedValue(0);
  const sphere2Y = useSharedValue(0);
  const sphere3X = useSharedValue(0);
  const sphere3Y = useSharedValue(0);

  useEffect(() => {
    // Sphere 1 (Crimson Rose) subtle drift
    sphere1X.value = withRepeat(
      withSequence(
        withTiming(width * 0.15, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-width * 0.12, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    sphere1Y.value = withRepeat(
      withSequence(
        withTiming(height * 0.09, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-height * 0.07, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Sphere 2 (Electric Magenta) drift
    sphere2X.value = withRepeat(
      withSequence(
        withTiming(-width * 0.14, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(width * 0.1, { duration: 9500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    sphere2Y.value = withRepeat(
      withSequence(
        withTiming(-height * 0.1, { duration: 9500, easing: Easing.inOut(Easing.ease) }),
        withTiming(height * 0.08, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Sphere 3 (Deep Purple Plum) drift
    sphere3X.value = withRepeat(
      withSequence(
        withTiming(width * 0.1, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-width * 0.08, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    sphere3Y.value = withRepeat(
      withSequence(
        withTiming(-height * 0.06, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(height * 0.07, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedSphere1 = useAnimatedStyle(() => ({
    transform: [{ translateX: sphere1X.value }, { translateY: sphere1Y.value }],
  }));

  const animatedSphere2 = useAnimatedStyle(() => ({
    transform: [{ translateX: sphere2X.value }, { translateY: sphere2Y.value }],
  }));

  const animatedSphere3 = useAnimatedStyle(() => ({
    transform: [{ translateX: sphere3X.value }, { translateY: sphere3Y.value }],
  }));

  const bgColor = isDark ? '#141B10' : '#FFFFFF';

  const sphereRadius = width * 0.65; // Circular radius

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Floating Circular Ambient Light Spheres */}
      {isDark ? (
        <>
          {/* Circular Sphere 1: Olive Green (Top Left / Center) */}
          <Animated.View style={[StyleSheet.absoluteFill, animatedSphere1]} pointerEvents="none">
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient
                  id="circularOliveDark"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor="#546B41" stopOpacity="0.6" />
                  <Stop offset="50%" stopColor="#3B4B2E" stopOpacity="0.3" />
                  <Stop offset="100%" stopColor="#141B10" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <Circle
                cx={width * 0.3}
                cy={height * 0.35}
                r={sphereRadius}
                fill="url(#circularOliveDark)"
              />
            </Svg>
          </Animated.View>

          {/* Circular Sphere 2: Sage Green (Center Right) */}
          <Animated.View style={[StyleSheet.absoluteFill, animatedSphere2]} pointerEvents="none">
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient
                  id="circularSageDark"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor="#99AD7A" stopOpacity="0.5" />
                  <Stop offset="50%" stopColor="#546B41" stopOpacity="0.2" />
                  <Stop offset="100%" stopColor="#141B10" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <Circle
                cx={width * 0.7}
                cy={height * 0.5}
                r={sphereRadius * 1.1}
                fill="url(#circularSageDark)"
              />
            </Svg>
          </Animated.View>

          {/* Circular Sphere 3: Sand Beige (Bottom Center) */}
          <Animated.View style={[StyleSheet.absoluteFill, animatedSphere3]} pointerEvents="none">
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient
                  id="circularSandDark"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor="#DCCCAC" stopOpacity="0.35" />
                  <Stop offset="50%" stopColor="#99AD7A" stopOpacity="0.15" />
                  <Stop offset="100%" stopColor="#141B10" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <Circle
                cx={width * 0.4}
                cy={height * 0.72}
                r={sphereRadius * 0.95}
                fill="url(#circularSandDark)"
              />
            </Svg>
          </Animated.View>
        </>
      ) : (
        <>
          {/* Light Mode - Soft Ambient Spheres */}
          {/* Circular Sphere 1: Sage Green (Top Left) */}
          <Animated.View style={[StyleSheet.absoluteFill, animatedSphere1]} pointerEvents="none">
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient
                  id="circularSageLight"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor="#99AD7A" stopOpacity="0.25" />
                  <Stop offset="60%" stopColor="#DCCCAC" stopOpacity="0.08" />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <Circle
                cx={width * 0.25}
                cy={height * 0.3}
                r={sphereRadius * 1.1}
                fill="url(#circularSageLight)"
              />
            </Svg>
          </Animated.View>

          {/* Circular Sphere 2: Warm Sand Beige (Center Right) */}
          <Animated.View style={[StyleSheet.absoluteFill, animatedSphere2]} pointerEvents="none">
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient
                  id="circularSandLight"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor="#DCCCAC" stopOpacity="0.35" />
                  <Stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <Circle
                cx={width * 0.75}
                cy={height * 0.45}
                r={sphereRadius * 1.2}
                fill="url(#circularSandLight)"
              />
            </Svg>
          </Animated.View>

          {/* Circular Sphere 3: Soft Olive (Bottom Center) */}
          <Animated.View style={[StyleSheet.absoluteFill, animatedSphere3]} pointerEvents="none">
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient
                  id="circularOliveLight"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor="#546B41" stopOpacity="0.12" />
                  <Stop offset="60%" stopColor="#99AD7A" stopOpacity="0.04" />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <Circle
                cx={width * 0.4}
                cy={height * 0.75}
                r={sphereRadius}
                fill="url(#circularOliveLight)"
              />
            </Svg>
          </Animated.View>
        </>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

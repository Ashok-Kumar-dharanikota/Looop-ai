import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export const AmbientGlow = memo(function AmbientGlow() {
  return (
    <View style={styles.glowContainer} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 400">
        <Defs>
          <RadialGradient
            id="warmAmbientGlow"
            cx="50%"
            cy="40%"
            r="55%"
            fx="50%"
            fy="40%"
          >
            <Stop offset="0%" stopColor="#FF6B00" stopOpacity="0.14" />
            <Stop offset="45%" stopColor="#FF8A00" stopOpacity="0.06" />
            <Stop offset="80%" stopColor="#FFA040" stopOpacity="0.015" />
            <Stop offset="100%" stopColor="#FFA040" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="400" height="400" fill="url(#warmAmbientGlow)" />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  glowContainer: {
    position: 'absolute',
    top: -50,
    left: '50%',
    marginLeft: -200,
    width: 400,
    height: 400,
    zIndex: 0,
  },
});

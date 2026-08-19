import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Shield, Lock, ScanFace, Fingerprint, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/use-app-store';
import { useAppLock } from '@/hooks/use-app-lock';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const AppLockOverlay: React.FC = () => {
  const { isAppLocked, triggerUnlock } = useAppLock();
  const biometricType = useAppStore((state) => state.biometricType);

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isAppLocked) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.1, { duration: 1200 }),
          withTiming(0.35, { duration: 1200 })
        ),
        -1,
        true
      );
    }
  }, [isAppLocked]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  if (!isAppLocked) {
    return null;
  }

  const BiometricIcon = Fingerprint;
  const biometricName = 'Fingerprint Lock';

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={styles.overlayContainer}
    >
      <LinearGradient
        colors={['#0F172A', '#1E1B4B', '#0F172A']}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Header Badge */}
      <View style={styles.topBadge}>
        <Sparkles size={13} color="#C084FC" />
        <Text style={styles.topBadgeText}>LOOOP SECURITY SHIELD</Text>
      </View>

      {/* Central Glowing Shield Visualizer */}
      <View style={styles.centerBox}>
        <Animated.View style={[styles.pulseRingOuter, animatedPulseStyle]} />
        <Animated.View style={[styles.pulseRingInner, animatedPulseStyle]} />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={triggerUnlock}
          style={styles.iconCircle}
        >
          <Fingerprint size={46} color="#FFFFFF" strokeWidth={1.8} />
        </TouchableOpacity>

        <Text style={styles.lockedTitle}>Looop is Locked</Text>
        <Text style={styles.lockedSubtitle}>
          Your financial data is protected with Fingerprint Lock
        </Text>
      </View>

      {/* Bottom Unlock Action Button */}
      <View style={styles.bottomActionBox}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={triggerUnlock}
          style={styles.unlockPrimaryBtn}
        >
          <Fingerprint size={20} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.unlockPrimaryBtnText}>Scan Fingerprint to Unlock</Text>
        </TouchableOpacity>
        <Text style={styles.fallbackHint}>
          Touch your device fingerprint sensor or use PIN fallback
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 999999,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 64,
    paddingHorizontal: 24,
    backgroundColor: '#0F172A',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.25)',
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C084FC',
    letterSpacing: 0.8,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pulseRingOuter: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#9333EA',
  },
  pulseRingInner: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#C084FC',
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#9333EA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  bottomActionBox: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  unlockPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 56,
    borderRadius: 18,
    backgroundColor: '#9333EA',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  unlockPrimaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fallbackHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
});

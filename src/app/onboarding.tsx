import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  useSharedValue,
  runOnJS,
  SharedTransition,
} from 'react-native-reanimated';

export const bentoTransitionStyle = SharedTransition.duration(450);
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react-native';

import { Colors } from '@/constants/theme';
import { SavingsAreaChart } from '@/components/onboarding/SavingsAreaChart';
import { VoiceExpenseLogger } from '@/components/onboarding/VoiceExpenseLogger';
import { EditorialBentoCard } from '@/components/onboarding/EditorialBentoCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const STEPS = [
  {
    title: 'Automated Micro-Savings',
    subtitle: 'Watch your wealth grow effortlessly with AI area tracking & smart rules.',
  },
  {
    title: 'Voice & Text Expense Logging',
    subtitle: 'Log purchases in seconds using natural speech or fast auto-tagged text.',
  },
  {
    title: 'Editorial Financial Literacy',
    subtitle: 'Bite-sized wealth insights and actionable rules curated by financial experts.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const theme = Colors[isDark ? 'dark' : 'light'];

  const [activeStep, setActiveStep] = useState<number>(0);
  const stepProgress = useSharedValue<number>(0);
  const dragX = useSharedValue<number>(0);

  const goToStep = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= STEPS.length) return;
    setActiveStep(nextIndex);
    stepProgress.value = withSpring(nextIndex, {
      damping: 18,
      stiffness: 120,
    });
  };

  const handleNextStep = () => {
    if (activeStep < STEPS.length - 1) {
      goToStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      goToStep(activeStep - 1);
    }
  };

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      goToStep(activeStep + 1);
    } else {
      router.push('/paywall');
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      goToStep(activeStep - 1);
    }
  };

  // Real-Time Swipe Gesture Handler
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      dragX.value = event.translationX;
    })
    .onEnd((event) => {
      const translation = event.translationX;
      const velocity = event.velocityX;

      if (translation < -40 || velocity < -300) {
        runOnJS(handleNextStep)();
      } else if (translation > 40 || velocity > 300) {
        runOnJS(handlePrevStep)();
      }

      dragX.value = withSpring(0, { damping: 16, stiffness: 140 });
    });

  // Animated Styles for Card 1 (Savings Chart)
  const card1AnimatedStyle = useAnimatedStyle(() => {
    const p = stepProgress.value - dragX.value / (SCREEN_WIDTH * 0.85);
    const translateX = interpolate(
      p,
      [0, 1, 2],
      [0, -SCREEN_WIDTH * 0.72, -SCREEN_WIDTH * 0.85]
    );
    const translateY = interpolate(p, [0, 1, 2], [0, -30, -60]);
    const scale = interpolate(p, [0, 1, 2], [1, 0.88, 0.85]);
    const opacity = interpolate(p, [0, 1, 2], [1, 0.75, 1]);
    const rotate = interpolate(p, [0, 1, 2], [0, -6, -12]);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
      opacity,
      zIndex: activeStep === 0 ? 30 : activeStep === 1 ? 20 : 10,
    };
  });

  // Animated Styles for Card 2 (Voice Logger)
  const card2AnimatedStyle = useAnimatedStyle(() => {
    const p = stepProgress.value - dragX.value / (SCREEN_WIDTH * 0.85);
    const translateX = interpolate(
      p,
      [0, 1, 2],
      [SCREEN_WIDTH * 0.72, 0, -SCREEN_WIDTH * 0.72]
    );
    const translateY = interpolate(p, [0, 1, 2], [20, 0, -30]);
    const scale = interpolate(p, [0, 1, 2], [0.88, 1, 0.85]);
    const opacity = interpolate(p, [0, 1, 2], [0.75, 1, 1]);
    const rotate = interpolate(p, [0, 1, 2], [6, 0, -6]);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
      opacity,
      zIndex: activeStep === 1 ? 30 : 20,
    };
  });

  // Animated Styles for Card 3 (Editorial Bento Card)
  const card3AnimatedStyle = useAnimatedStyle(() => {
    const p = stepProgress.value - dragX.value / (SCREEN_WIDTH * 0.85);
    const translateX = interpolate(
      p,
      [0, 1, 2],
      [SCREEN_WIDTH * 0.9, SCREEN_WIDTH * 0.72, 0]
    );
    const translateY = interpolate(p, [0, 1, 2], [40, 20, 0]);
    const scale = interpolate(p, [0, 1, 2], [0.78, 0.88, 1]);
    const opacity = interpolate(p, [0, 1, 2], [0.5, 0.75, 1]);
    const rotate = interpolate(p, [0, 1, 2], [10, 6, 0]);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
      opacity,
      zIndex: activeStep === 2 ? 30 : 10,
    };
  });

  return (
    <GestureHandlerRootView style={[styles.rootContainer, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            {activeStep > 0 ? (
              <TouchableOpacity onPress={handlePrev} style={styles.navIconBtn}>
                <ArrowLeft size={20} color={isDark ? '#FFF' : '#000'} />
              </TouchableOpacity>
            ) : (
              <View style={styles.navIconPlaceholder} />
            )}

            <TouchableOpacity onPress={() => router.push('/paywall')}>
              <Text style={[styles.skipText, { color: theme.textSecondary }]}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Card Canvas Stage */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.stageContainer}>
              {/* Card 1 */}
              <Animated.View
                sharedTransitionTag="onboarding-card-1"
                sharedTransitionStyle={bentoTransitionStyle}
                style={[styles.cardWrapper, card1AnimatedStyle]}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => activeStep !== 0 && goToStep(0)}
                >
                  <SavingsAreaChart />
                </TouchableOpacity>
              </Animated.View>

              {/* Card 2 */}
              <Animated.View
                sharedTransitionTag="onboarding-card-2"
                sharedTransitionStyle={bentoTransitionStyle}
                style={[styles.cardWrapper, card2AnimatedStyle]}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => activeStep !== 1 && goToStep(1)}
                >
                  <VoiceExpenseLogger isActive={activeStep === 1} />
                </TouchableOpacity>
              </Animated.View>

              {/* Card 3 */}
              <Animated.View
                sharedTransitionTag="onboarding-card-3"
                sharedTransitionStyle={bentoTransitionStyle}
                style={[styles.cardWrapper, card3AnimatedStyle]}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => activeStep !== 2 && goToStep(2)}
                >
                  <EditorialBentoCard />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </GestureDetector>

          {/* Dynamic Bottom Info & Navigation */}
          <View style={styles.bottomControls}>
            <View style={styles.textMetaBox}>
              <View style={styles.featureBadge}>
                <Sparkles size={12} color={theme.textSecondary} />
                <Text style={[styles.featureBadgeText, { color: theme.textSecondary }]}>STEP {activeStep + 1} OF 3</Text>
              </View>
              <Text style={[styles.titleText, { color: theme.text }]}>
                {STEPS[activeStep].title}
              </Text>
              <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
                {STEPS[activeStep].subtitle}
              </Text>
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.primaryNextBtn,
                  { backgroundColor: theme.text },
                ]}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.primaryNextBtnText,
                    { color: theme.background },
                  ]}
                >
                  {activeStep === STEPS.length - 1 ? 'Unlock Savio' : 'Next Step'}
                </Text>
                <ArrowRight
                  size={20}
                  color={theme.background}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    height: 48,
  },
  navIconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  navIconPlaceholder: {
    width: 36,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  activeStepDot: {
    width: 28,
    backgroundColor: '#C084FC',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  cardWrapper: {
    position: 'absolute',
    width: SCREEN_WIDTH - 48,
  },
  bottomControls: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  textMetaBox: {
    marginBottom: 20,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  featureBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryNextBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryNextBtnText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

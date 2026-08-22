import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SendHorizontal } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface ClickIndicationStageProps {
  currencySymbol: string;
}

export function ClickIndicationStage({ currencySymbol }: ClickIndicationStageProps) {
  const { t } = useTranslation();
  const clickOpacity = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      clickOpacity.value = withSequence(
        withTiming(0.45, { duration: 160, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 240, easing: Easing.inOut(Easing.quad) })
      );
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const animatedClickStyle = useAnimatedStyle(() => ({
    opacity: clickOpacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      exiting={FadeOut.duration(220)}
      style={styles.transcriptionStage}
    >
      <View style={styles.transcriptionBubble}>
        <View style={styles.bubbleTopHeader}>
          <View style={styles.streamDot} />
          <Text style={styles.transcribingTitle}>
            {t('showcase.voice.capturedTitle', 'CAPTURED COMMAND')}
          </Text>
        </View>

        <Text style={styles.streamSentence}>
          <Text style={styles.textBlack}>
            {t(
              'showcase.voice.capturedCommand',
              `"Paid ${currencySymbol}450 for lunch at Theobroma"`,
              {
                currency: currencySymbol,
              }
            )}
          </Text>
        </Text>
      </View>

      <View style={styles.clickActionRow}>
        <Animated.View style={[styles.clickActionBtnWrapper, animatedClickStyle]}>
          <LinearGradient
            colors={['#FF7A00', '#FF4D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.clickActionBtn}
          >
            <SendHorizontal size={14} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.clickActionBtnText}>
              {t('showcase.voice.processBtn', 'Process Expense')}
            </Text>
          </LinearGradient>
        </Animated.View>
        <Text style={styles.tapPromptText}>
          {t('showcase.voice.tapConfirmed', '⚡ Tap confirmed')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  transcriptionStage: {
    width: '100%',
  },
  transcriptionBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 8,
  },
  bubbleTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  streamDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B00',
  },
  transcribingTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    color: '#EA580C',
    letterSpacing: 0.8,
  },
  streamSentence: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  textBlack: {
    color: '#0F172A',
  },
  clickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  clickActionBtnWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  clickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  clickActionBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    color: '#FFFFFF',
  },
  tapPromptText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#64748B',
  },
});

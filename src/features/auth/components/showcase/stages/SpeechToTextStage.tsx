import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { AnimatedWord } from '../atoms/AnimatedWord';

interface SpeechToTextStageProps {
  wordStep: number;
  currencySymbol: string;
}

export function SpeechToTextStage({ wordStep, currencySymbol }: SpeechToTextStageProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(240)}
      style={styles.transcriptionStage}
    >
      <View style={styles.transcriptionBubble}>
        <View style={styles.bubbleTopHeader}>
          <View style={styles.streamDot} />
          <Text style={styles.transcribingTitle}>
            {t('showcase.voice.streamTitle', 'LIVE VOICE STREAM')}
          </Text>
        </View>

        <Text style={styles.streamSentence}>
          <AnimatedWord
            text={t('showcase.voice.streamPaid', 'Paid ')}
            isBlack={wordStep >= 1}
          />
          <AnimatedWord
            text={t('showcase.voice.streamAmount', `${currencySymbol}450 `, {
              currency: currencySymbol,
            })}
            isBlack={wordStep >= 2}
          />
          <AnimatedWord
            text={t('showcase.voice.streamFor', 'for lunch ')}
            isBlack={wordStep >= 3}
          />
          <AnimatedWord
            text={t('showcase.voice.streamAt', 'at Theobroma')}
            isBlack={wordStep >= 4}
          />
          <Text style={styles.typingCaret}>|</Text>
        </Text>
      </View>

      <View style={styles.captionSubRow}>
        <Sparkles size={11} color="#EA580C" />
        <Text style={styles.captionSubText}>
          {t('showcase.voice.lockingIn', 'Real-time speech transcription locking in...')}
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
  typingCaret: {
    color: '#FF6B00',
    fontWeight: '300',
    fontSize: 15,
  },
  captionSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 4,
  },
  captionSubText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#EA580C',
  },
});

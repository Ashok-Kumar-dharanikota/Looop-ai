import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { WaveBar } from '../atoms/WaveBar';
import { MicHalo } from '../atoms/MicHalo';

export function VoiceRecognitionStage() {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(240)}
      style={styles.centerStageContent}
    >
      <View style={styles.voiceRecognitionHero}>
        <View style={styles.micHaloWrapper}>
          <MicHalo />
          <LinearGradient
            colors={['#FF7A00', '#FF4D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.micGradientOrb}
          >
            <Mic size={22} color="#FFFFFF" strokeWidth={2.4} />
          </LinearGradient>
        </View>

        <View style={styles.equalizerRow}>
          <WaveBar delay={0} maxHeight={16} />
          <WaveBar delay={140} maxHeight={28} />
          <WaveBar delay={70} maxHeight={36} />
          <WaveBar delay={210} maxHeight={30} />
          <WaveBar delay={100} maxHeight={20} />
          <WaveBar delay={160} maxHeight={12} />
        </View>
      </View>

      <View style={styles.listeningCaptionRow}>
        <View style={styles.recordingPulseDot} />
        <Text style={styles.listeningCaptionText}>
          {t('showcase.voice.listening', 'Listening...')}{' '}
          <Text style={styles.listeningHint}>
            {t('showcase.voice.listeningHint', 'Say merchant, amount, or item')}
          </Text>
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  centerStageContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceRecognitionHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 14,
  },
  micHaloWrapper: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  micGradientOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 38,
    paddingHorizontal: 8,
  },
  listeningCaptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  recordingPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF6B00',
  },
  listeningCaptionText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#0F172A',
  },
  listeningHint: {
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
});

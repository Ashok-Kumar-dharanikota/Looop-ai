import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Sparkles,
  X,
  Mic,
  MicOff,
  AlertCircle,
  RotateCcw,
  Check,
} from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { ThemeColors, AppFonts } from '@/constants/theme';

interface VoiceRecordingOverlayProps {
  insets: EdgeInsets;
  isListening: boolean;
  hasCapturedVoice: boolean;
  errorMessage: string | null;
  words: string[];
  normalizedVolume: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAbort: () => void;
  onConfirm: () => void;
}

export const VoiceRecordingOverlay: React.FC<VoiceRecordingOverlayProps> = React.memo(({
  insets,
  isListening,
  hasCapturedVoice,
  errorMessage,
  words,
  normalizedVolume,
  onStartRecording,
  onStopRecording,
  onAbort,
  onConfirm,
}) => {
  // Waveform animations for mic
  const waveScale1 = useSharedValue(1);
  const waveScale2 = useSharedValue(1);
  const barHeight1 = useSharedValue(12);
  const barHeight2 = useSharedValue(24);
  const barHeight3 = useSharedValue(18);
  const barHeight4 = useSharedValue(32);
  const barHeight5 = useSharedValue(14);

  // Reactively drive waveform bars using real audio input volume
  useEffect(() => {
    if (isListening) {
      waveScale1.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      waveScale2.value = withRepeat(
        withSequence(
          withTiming(1.65, { duration: 750, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      const dynamicScale = Math.max(0.2, normalizedVolume);
      barHeight1.value = withTiming(Math.max(10, dynamicScale * 38), { duration: 80 });
      barHeight2.value = withTiming(Math.max(14, dynamicScale * 52), { duration: 80 });
      barHeight3.value = withTiming(Math.max(12, dynamicScale * 44), { duration: 80 });
      barHeight4.value = withTiming(Math.max(16, dynamicScale * 56), { duration: 80 });
      barHeight5.value = withTiming(Math.max(8, dynamicScale * 34), { duration: 80 });
    } else {
      waveScale1.value = withTiming(1);
      waveScale2.value = withTiming(1);
      barHeight1.value = withTiming(10);
      barHeight2.value = withTiming(14);
      barHeight3.value = withTiming(12);
      barHeight4.value = withTiming(16);
      barHeight5.value = withTiming(8);
    }
  }, [isListening, normalizedVolume]);

  const animatedWave1 = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale1.value }],
    opacity: isListening ? 0.45 : 0,
  }));

  const animatedWave2 = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale2.value }],
    opacity: isListening ? 0.25 : 0,
  }));

  const animatedBar1 = useAnimatedStyle(() => ({ height: barHeight1.value }));
  const animatedBar2 = useAnimatedStyle(() => ({ height: barHeight2.value }));
  const animatedBar3 = useAnimatedStyle(() => ({ height: barHeight3.value }));
  const animatedBar4 = useAnimatedStyle(() => ({ height: barHeight4.value }));
  const animatedBar5 = useAnimatedStyle(() => ({ height: barHeight5.value }));

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      exiting={FadeOut.duration(200)}
      style={[styles.audioModeContainer, { paddingTop: Math.max(insets.top, 20) }]}
    >
      {/* Header */}
      <View style={styles.audioModeHeader}>
        <View style={styles.audioBadgePill}>
          <Sparkles size={13} color={ThemeColors.primary} />
          <Text style={styles.audioBadgeText}>VOICE EXPENSE INPUT</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAbort}
          style={styles.audioCloseBtn}
        >
          <X size={20} color={ThemeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Voice Waveform & Real-Time Pulse Animation */}
      <View style={styles.audioCenterVisualizer}>
        <Animated.View style={[styles.audioPulseRingOuter, animatedWave2]} />
        <Animated.View style={[styles.audioPulseRingInner, animatedWave1]} />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={isListening ? onStopRecording : onStartRecording}
          style={[
            styles.audioMicCircle,
            !isListening && hasCapturedVoice && styles.audioMicCircleFinished,
          ]}
        >
          {isListening ? (
            <Mic size={34} color="#FFFFFF" strokeWidth={2.4} />
          ) : (
            <MicOff size={30} color="#FFFFFF" strokeWidth={2.2} />
          )}
        </TouchableOpacity>

        {/* Live Audio Reactive Dancing Waveform Bars */}
        <View style={styles.waveformBarsRow}>
          <Animated.View style={[styles.waveBar, animatedBar1]} />
          <Animated.View style={[styles.waveBar, animatedBar2]} />
          <Animated.View style={[styles.waveBar, animatedBar3]} />
          <Animated.View style={[styles.waveBar, animatedBar4]} />
          <Animated.View style={[styles.waveBar, animatedBar5]} />
        </View>

        <Text style={styles.audioListeningStatus}>
          {isListening
            ? 'Listening to your expense...'
            : hasCapturedVoice
            ? 'Speech Captured • Ready to Confirm'
            : 'Tap to start speaking...'}
        </Text>

        {errorMessage && (
          <View style={styles.speechErrorBox}>
            <AlertCircle size={14} color="#EF4444" />
            <Text style={styles.speechErrorText}>{errorMessage}</Text>
          </View>
        )}
      </View>

      {/* Word-by-Word Real-Time Streamed Transcript Card */}
      <View style={styles.audioTranscriptCard}>
        <View style={styles.transcriptCardHeader}>
          <Text style={styles.transcriptCardLabel}>LIVE TRANSCRIPT</Text>
          {isListening && (
            <View style={styles.liveRecordingDotRow}>
              <View style={styles.liveRecordingDot} />
              <Text style={styles.liveRecordingText}>REC</Text>
            </View>
          )}
        </View>

        <ScrollView style={{ maxHeight: 110 }} showsVerticalScrollIndicator={false}>
          <View style={styles.wordsWrapContainer}>
            {words.length > 0 ? (
              words.map((word, wIdx) => {
                const isLast = wIdx === words.length - 1;
                return (
                  <Animated.Text
                    key={`${wIdx}_${word}`}
                    entering={FadeIn.duration(150)}
                    style={[
                      styles.transcriptWord,
                      styles.transcriptWordSpoken,
                      isLast && isListening && styles.transcriptWordCurrent,
                    ]}
                  >
                    {word}{' '}
                  </Animated.Text>
                );
              })
            ) : (
              <Text style={styles.transcriptPlaceholder}>
                e.g. &quot;Paid ₹450 for lunch with friends&quot; or &quot;300 uber ride&quot;
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <Animated.View entering={FadeInUp.duration(300)} style={styles.audioConfirmActionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onStartRecording}
          style={styles.audioRetryBtn}
        >
          <RotateCcw size={16} color={ThemeColors.textSecondary} />
          <Text style={styles.audioRetryBtnText}>Re-record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onConfirm}
          style={styles.audioConfirmPrimaryBtn}
        >
          <Check size={18} color="#FFFFFF" strokeWidth={3} />
          <Text style={styles.audioConfirmPrimaryBtnText}>Process & Review</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  audioModeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  audioModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  audioBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: ThemeColors.primarySoft,
    borderWidth: 1,
    borderColor: ThemeColors.primaryBorder,
  },
  audioBadgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.primary,
    letterSpacing: 0.8,
  },
  audioCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ThemeColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  audioCenterVisualizer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  audioPulseRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFEDD5',
  },
  audioPulseRingInner: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#FED7AA',
  },
  audioMicCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  audioMicCircleFinished: {
    backgroundColor: ThemeColors.emerald,
    shadowColor: ThemeColors.emerald,
  },
  waveformBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 60,
    marginTop: 20,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: ThemeColors.primary,
  },
  audioListeningStatus: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginTop: 10,
  },
  speechErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 10,
  },
  speechErrorText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 12,
    color: '#EF4444',
  },
  audioTranscriptCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  transcriptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transcriptCardLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.textMuted,
    letterSpacing: 0.8,
  },
  liveRecordingDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveRecordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveRecordingText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: '#EF4444',
  },
  wordsWrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  transcriptWord: {
    fontFamily: AppFonts.jakarta.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  transcriptWordSpoken: {
    color: ThemeColors.textPrimary,
  },
  transcriptWordCurrent: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.primary,
  },
  transcriptPlaceholder: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 14,
    color: ThemeColors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  audioConfirmActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  audioRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  audioRetryBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  audioConfirmPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    backgroundColor: ThemeColors.primary,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  audioConfirmPrimaryBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Mic, Send, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { FadeText } from '@/shared/ui/organisms/fade-text';

interface VoiceExpenseLoggerProps {
  compact?: boolean;
  isActive?: boolean;
}

const PHRASES = [
  { text: 'I Spent $5 on Pizza today', tags: ['#Pizza', '#Food', '$5.00'] },
  { text: "Paid $45.00 for groceries at Trader Joe's", tags: ['#Groceries', '#Food', '$45.00'] },
  { text: 'Spent $12.50 for coffee with friends', tags: ['#Coffee', '#Drinks', '$12.50'] },
];

export const VoiceExpenseLogger: React.FC<VoiceExpenseLoggerProps> = ({
  compact = false,
  isActive = true,
}) => {
  const isDark = useColorScheme() === 'dark';
  const fgColor = isDark ? '#FFFFFF' : '#000000';
  const fgMuted = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const fgLight = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const bgColor = isDark ? '#000000' : '#FFFFFF';

  const [phraseIndex, setPhraseIndex] = useState(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.25, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Cycle live voice transcript phrases when card is active
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 0.45,
  }));

  const currentPhrase = PHRASES[phraseIndex];

  return (
    <View style={[styles.cardContainer, { borderColor: fgLight }, compact && styles.compactCard]}>
      {/* Header Badge */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Sparkles size={14} color={fgColor} />
          <Text style={[styles.badgeText, { color: fgColor }]}>VOICE & TEXT AI LOGGER</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: fgLight }]}>
          <Text style={[styles.statusDot, { color: fgColor }]}>●</Text>
          <Text style={[styles.statusText, { color: fgColor }]}>Hands-Free</Text>
        </View>
      </View>

      {/* Voice Recorder Pulse Centerpiece */}
      {!compact && (
        <View style={styles.micSection}>
          <View style={styles.micRingWrapper}>
            <Animated.View style={[styles.pulseRing, { backgroundColor: fgLight }, animatedRingStyle]} />
            <View style={[styles.micButton, { backgroundColor: fgLight, borderColor: fgColor }, isActive && { backgroundColor: fgColor }]}>
              <Mic size={26} color={isActive ? bgColor : fgColor} />
            </View>
          </View>
          <Text style={[styles.micInstruction, { color: fgMuted }]}>
            Listening... Speak your expense
          </Text>
        </View>
      )}

      {/* FadeText Voice Recording Transcript Box */}
      <View style={[styles.transcriptBox, { borderColor: fgLight, backgroundColor: 'transparent' }, compact && styles.compactTranscriptBox]}>
        <View style={styles.fadeTextContainer}>
          <FadeText
            key={`fade-text-${phraseIndex}-${isActive}`}
            inputs={[currentPhrase.text]}
            wordDelay={200}
            duration={500}
            fontSize={compact ? 13 : 15}
            fontWeight="600"
            color={fgColor}
            textAlign="center"
          />
        </View>
        {!compact && (
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: fgColor }]}>
            <Send size={16} color={bgColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Auto Category Tag Badges */}
      <View style={styles.tagsRow}>
        {currentPhrase.tags.map((tag, idx) => (
          <View key={idx} style={[styles.tagItem, { backgroundColor: fgLight }]}>
            <CheckCircle2 size={12} color={fgColor} />
            <Text style={[styles.tagText, { color: fgColor }]}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    elevation: 0,
  },
  compactCard: {
    padding: 14,
    borderRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    fontSize: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  micSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  micRingWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 74,
    height: 74,
  },
  pulseRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  micButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  micInstruction: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  transcriptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 8,
    borderWidth: 1,
    minHeight: 52,
  },
  compactTranscriptBox: {
    paddingVertical: 8,
    marginVertical: 4,
    minHeight: 42,
  },
  fadeTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    padding: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

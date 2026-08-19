import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import {
  ArrowRight,
  Sparkles,
  Utensils,
  Car,
  Coffee,
  Tv,
  Mic,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Target,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StoryAct1RohanProps {
  currencySymbol: string;
  onFinishStory: () => void;
}

const STORY_SLIDES = [
  {
    id: 1,
    chapterTag: 'THE MYSTERY',
    emoji: '😫',
    title: 'Where did my salary go?',
    subtitle: 'Rohan earns well, but his balance hits zero by the 24th. Why?',
    description: 'No lavish purchases—just friction-free micro-leaks like midnight deliveries, surge cabs, and forgotten subscriptions silently draining his wealth.',
    visual: 'leaks',
  },
  {
    id: 2,
    chapterTag: 'THE STRUGGLE',
    emoji: '🤦‍♂️',
    title: 'Spreadsheets were exhausting.',
    subtitle: 'Manual expense tracking felt like daily homework.',
    description: 'Entering every coffee and cab into 15 dropdowns was impossible to maintain. Like 90% of people, Rohan gave up after just 4 days.',
    visual: 'friction',
  },
  {
    id: 3,
    chapterTag: 'THE BREAKTHROUGH',
    emoji: '💡',
    title: 'Then he tried Looop AI.',
    subtitle: '1-second voice logging + weekly behavioral diagnosis.',
    description: 'Rohan spoke once: "Paid 450 for lunch". Looop logged it instantly, and published a weekly story diagnosing his 11:30 PM food craving loop.',
    visual: 'voice_story',
  },
  {
    id: 4,
    chapterTag: 'THE TRANSFORMATION',
    emoji: '🚀',
    title: 'Tiny habits. Real wealth.',
    subtitle: 'Micro-challenges automatically funded his dream vaults.',
    description: 'Tasks like "Cook dinner on Thursday" saved Rohan ₹2,400/week. Saved money flowed directly into his Emergency Cushion & Dream Trip vaults!',
    visual: 'vault_success',
  },
];

export const StoryAct1Rohan: React.FC<StoryAct1RohanProps> = ({
  currencySymbol,
  onFinishStory,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const current = STORY_SLIDES[slideIndex];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (slideIndex < STORY_SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onFinishStory();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      Haptics.selectionAsync();
      setSlideIndex(slideIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Light Segment Progress */}
      <View style={styles.progressRow}>
        {STORY_SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === slideIndex && styles.progressDotActive,
              i < slideIndex && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Main Slide Card */}
      <Animated.View
        key={current.id}
        entering={FadeInRight.duration(240)}
        exiting={FadeOutLeft.duration(180)}
        layout={LinearTransition}
        style={styles.card}
      >
        {/* Top Tag & Emoji */}
        <View style={styles.cardHeader}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{current.chapterTag}</Text>
          </View>
          <Text style={styles.emojiText}>{current.emoji}</Text>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.titleText}>{current.title}</Text>
        <Text style={styles.subtitleText}>{current.subtitle}</Text>

        {/* Clean Light-Themed Visual Preview */}
        <View style={styles.visualBox}>
          {current.visual === 'leaks' && (
            <View style={styles.leaksWidget}>
              <View style={styles.leakRow}>
                <View style={[styles.leakIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Utensils size={15} color="#EF4444" />
                </View>
                <Text style={styles.leakLabel}>Midnight Deliveries</Text>
                <Text style={styles.leakAmount}>-{currencySymbol}4,800</Text>
              </View>
              <View style={styles.leakRow}>
                <View style={[styles.leakIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Car size={15} color="#0284C7" />
                </View>
                <Text style={styles.leakLabel}>Peak Cab Surges</Text>
                <Text style={styles.leakAmount}>-{currencySymbol}3,200</Text>
              </View>
              <View style={styles.leakRow}>
                <View style={[styles.leakIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Coffee size={15} color="#D97706" />
                </View>
                <Text style={styles.leakLabel}>Impulse Cafe Runs</Text>
                <Text style={styles.leakAmount}>-{currencySymbol}2,400</Text>
              </View>
            </View>
          )}

          {current.visual === 'friction' && (
            <View style={styles.frictionWidget}>
              <View style={styles.badBox}>
                <Text style={styles.badBoxTitle}>❌ Traditional Spreadsheets</Text>
                <Text style={styles.badBoxText}>15 complex categories • Manual receipts • Quits in 4 days</Text>
              </View>
              <View style={styles.goodBox}>
                <Text style={styles.goodBoxTitle}>✨ The Looop Difference</Text>
                <Text style={styles.goodBoxText}>1-sec voice log • Weekly behavior diagnosis • Fun micro-habits</Text>
              </View>
            </View>
          )}

          {current.visual === 'voice_story' && (
            <View style={styles.voiceStoryWidget}>
              <View style={styles.voiceBadge}>
                <Mic size={16} color="#7C3AED" />
                <Text style={styles.voiceBadgeText}>"Paid 450 for lunch"</Text>
                <Text style={styles.voiceAutoPill}>✓ Auto-Logged</Text>
              </View>
              <View style={styles.storySnippet}>
                <BookOpen size={14} color="#059669" />
                <Text style={styles.storySnippetText} numberOfLines={2}>
                  "The 11:30 PM Swiggy Paradox: Why fatigue drives impulse spends & how to fix it."
                </Text>
              </View>
            </View>
          )}

          {current.visual === 'vault_success' && (
            <View style={styles.vaultWidget}>
              <View style={styles.vaultHeader}>
                <ShieldCheck size={18} color="#059669" />
                <Text style={styles.vaultTitle}>Emergency Safety Cushion</Text>
                <Text style={styles.vaultPercent}>100% FUNDED</Text>
              </View>
              <View style={styles.vaultBarBg}>
                <View style={[styles.vaultBarFill, { width: '100%' }]} />
              </View>
              <View style={styles.vaultNextRow}>
                <Target size={14} color="#7C3AED" />
                <Text style={styles.vaultNextText}>
                  Unlocked: <Text style={{ fontWeight: '700' }}>Tokyo Solo Trip ({currencySymbol}65,000)</Text>
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Narrative Description */}
        <Text style={styles.descriptionText}>{current.description}</Text>
      </Animated.View>

      {/* Clean Bottom Navigation */}
      <View style={styles.bottomNav}>
        {slideIndex > 0 ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handlePrev}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {slideIndex === STORY_SLIDES.length - 1 ? 'Start My Diagnosis' : 'Continue'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FAF9F6',
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  progressDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressDotActive: {
    backgroundColor: '#7C3AED',
    width: 36,
  },
  progressDotCompleted: {
    backgroundColor: '#CBD5E1',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tagBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  emojiText: {
    fontSize: 26,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  visualBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
    marginBottom: 16,
    minHeight: 140,
    justifyContent: 'center',
  },
  leaksWidget: {
    gap: 8,
  },
  leakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  leakIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leakLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  leakAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
  frictionWidget: {
    gap: 8,
  },
  badBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 8,
  },
  badBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 2,
  },
  badBoxText: {
    fontSize: 11,
    color: '#991B1B',
  },
  goodBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
    padding: 8,
  },
  goodBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 2,
  },
  goodBoxText: {
    fontSize: 11,
    color: '#5B21B6',
  },
  voiceStoryWidget: {
    gap: 8,
  },
  voiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    gap: 8,
  },
  voiceBadgeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  voiceAutoPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  storySnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
  },
  storySnippetText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  vaultWidget: {
    gap: 8,
  },
  vaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vaultTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  vaultPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vaultBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  vaultBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  vaultNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vaultNextText: {
    fontSize: 11,
    color: '#64748B',
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 19,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

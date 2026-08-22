import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { BookOpen, Clock, Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { TypewriterDescription } from '../atoms/TypewriterDescription';

interface BehavioralStoryStageProps {
  currencySymbol: string;
  isActive: boolean;
  onTypingDone?: () => void;
}

export function BehavioralStoryStage({
  currencySymbol,
  isActive,
  onTypingDone,
}: BehavioralStoryStageProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInDown.duration(380)}
      exiting={FadeOut.duration(260)}
      style={styles.storyStage}
    >
      <View style={styles.storyCard}>
        <View style={styles.storyHeaderMeta}>
          <View style={styles.storyTagBadge}>
            <BookOpen size={11} color="#EA580C" />
            <Text style={styles.storyTagBadgeText}>
              {t('showcase.story.tag', 'HABIT DIAGNOSIS')}
            </Text>
          </View>
          <View style={styles.storyTimeBadge}>
            <Clock size={11} color="#94A3B8" />
            <Text style={styles.storyTimeText}>
              {t('showcase.story.readTime', '2 min insight')}
            </Text>
          </View>
        </View>

        <Text style={styles.storyHeadline}>
          {t('showcase.story.headline', 'The 4 PM Bakery Habit Leak')}
        </Text>

        {/* Live Typewriter Description with dynamic currency & localization */}
        <TypewriterDescription
          currencySymbol={currencySymbol}
          isActive={isActive}
          onComplete={onTypingDone}
        />

        <Animated.View
          entering={FadeIn.delay(1200).duration(300)}
          style={styles.storyImpactRow}
        >
          <View style={styles.storyStatPill}>
            <Zap size={11} color="#EA580C" />
            <Text style={styles.storyStatText}>
              {t('showcase.story.compoundedStat', `Compounded: ${currencySymbol}1.62L / yr`, {
                currency: currencySymbol,
              })}
            </Text>
          </View>
          <Text style={styles.storyCtaHint}>
            {t('showcase.story.ctaHint', 'AI generated 3 control tasks →')}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  storyStage: {
    width: '100%',
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  storyHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storyTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  storyTagBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    color: '#EA580C',
    letterSpacing: 0.6,
  },
  storyTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storyTimeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#94A3B8',
  },
  storyHeadline: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  storyImpactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  storyStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  storyStatText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    color: '#EA580C',
  },
  storyCtaHint: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10.5,
    color: '#94A3B8',
  },
});

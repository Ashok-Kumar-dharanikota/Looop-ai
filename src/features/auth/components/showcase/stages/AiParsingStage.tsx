import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ParseCheckItem } from '../atoms/ParseCheckItem';

interface AiParsingStageProps {
  checksResolved: number;
  currencySymbol: string;
}

export function AiParsingStage({ checksResolved, currencySymbol }: AiParsingStageProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(240)}
      style={styles.parsingStage}
    >
      <View style={styles.parseListContainer}>
        <ParseCheckItem
          label={t('showcase.voice.merchant', 'Merchant')}
          value={t('showcase.voice.merchantValue', 'Theobroma Bakery & Cafe')}
          isResolved={checksResolved >= 1}
        />
        <ParseCheckItem
          label={t('showcase.voice.category', 'Category')}
          value={t('showcase.voice.categoryValue', 'Food & Dining')}
          isResolved={checksResolved >= 2}
        />
        <ParseCheckItem
          label={t('showcase.voice.amount', 'Amount')}
          value={t('showcase.voice.amountValue', `${currencySymbol}450.00`, {
            currency: currencySymbol,
          })}
          isResolved={checksResolved >= 3}
        />
      </View>

      <View style={styles.captionSubRow}>
        <Sparkles size={11} color="#EA580C" />
        <Text style={styles.captionSubText}>
          {checksResolved === 3
            ? t('showcase.voice.verifiedSuccess', 'All parameters verified in 0.4s ✓')
            : t('showcase.voice.extracting', 'AI matching category & auto-extracting...')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  parsingStage: {
    width: '100%',
  },
  parseListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 8,
    gap: 8,
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

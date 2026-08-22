import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Utensils, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface ExpenseRecordedStageProps {
  currencySymbol: string;
}

export function ExpenseRecordedStage({ currencySymbol }: ExpenseRecordedStageProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInDown.duration(380)}
      exiting={FadeOut.duration(260)}
      style={styles.recordedStage}
    >
      <View style={styles.finalReceiptCard}>
        <View style={styles.receiptMainRow}>
          <LinearGradient
            colors={['#FF7A00', '#FF4D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.receiptCategoryOrb}
          >
            <Utensils size={16} color="#FFFFFF" strokeWidth={2.4} />
          </LinearGradient>

          <View style={styles.receiptDetailsCol}>
            <Text style={styles.receiptMerchantName} numberOfLines={1}>
              {t('showcase.voice.merchantValue', 'Theobroma Bakery & Cafe')}
            </Text>
            <Text style={styles.receiptCategorySubtitle}>
              {t('showcase.voice.timeSubtitle', 'Food & Dining • Today, 1:45 PM')}
            </Text>
          </View>

          <View style={styles.receiptAmountCol}>
            <Text style={styles.receiptAmountText}>{currencySymbol}450</Text>
            <View style={styles.recordedBadgePill}>
              <Text style={styles.recordedBadgePillText}>
                {t('showcase.voice.loggedBadge', '✓ LOGGED')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.receiptDeductionRow}>
          <CheckCircle2 size={12} color="#EA580C" />
          <Text style={styles.receiptDeductionText}>
            {t(
              'showcase.voice.deductionNotice',
              `-${currencySymbol}450 auto-deducted • Generating expense story...`,
              {
                currency: currencySymbol,
              }
            )}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  recordedStage: {
    width: '100%',
  },
  finalReceiptCard: {
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
  receiptMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  receiptCategoryOrb: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 10,
  },
  receiptDetailsCol: {
    flex: 1,
    marginRight: 10,
  },
  receiptMerchantName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14.5,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  receiptCategorySubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  receiptAmountCol: {
    alignItems: 'flex-end',
  },
  receiptAmountText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  recordedBadgePill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  recordedBadgePillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 8.5,
    color: '#EA580C',
    letterSpacing: 0.6,
  },
  receiptDeductionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  receiptDeductionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#EA580C',
  },
});

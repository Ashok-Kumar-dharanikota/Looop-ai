import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Trash2, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AMOUNT_PRESETS, AMOUNT_INCREMENTS } from './expense-constants';
import { ThemeColors, AppFonts } from '@/constants/theme';

interface KeypadGridProps {
  amount: string;
  currencySymbol?: string;
  onAmountChange: (amount: string) => void;
  onSubmit: () => void;
}

export const KeypadGrid: React.FC<KeypadGridProps> = React.memo(({
  amount,
  currencySymbol = '₹',
  onAmountChange,
  onSubmit,
}) => {
  const handleKeypadPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (key === 'back') {
      onAmountChange(amount.slice(0, -1));
    } else if (key === '.') {
      if (!amount.includes('.')) {
        onAmountChange(amount ? amount + '.' : '0.');
      }
    } else {
      if (amount.length < 9) {
        onAmountChange(amount + key);
      }
    }
  };

  const handleIncrement = (inc: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentVal = parseFloat(amount) || 0;
    onAmountChange((currentVal + inc).toString());
  };

  const isSubmitDisabled = !amount || parseFloat(amount) <= 0;

  return (
    <View style={styles.container}>
      {/* Big Amount Display */}
      <View style={styles.amountDisplayBox}>
        <Text style={styles.amountCurrencySymbol}>{currencySymbol}</Text>
        <Text style={[styles.amountLargeText, !amount && styles.amountLargePlaceholder]}>
          {amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
        </Text>
        <View style={styles.blinkingCursor} />
      </View>

      {/* Quick Amount Chips (Presets & Increments in single scrollable row) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScrollContent}
        style={styles.chipsScrollView}
      >
        {AMOUNT_PRESETS.map((preset) => (
          <TouchableOpacity
            key={`pre-${preset}`}
            activeOpacity={0.75}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onAmountChange(preset);
            }}
            style={[styles.presetChip, amount === preset && styles.presetChipActive]}
          >
            <Text style={[styles.presetChipText, amount === preset && styles.presetChipTextActive]}>
              {currencySymbol}{preset}
            </Text>
          </TouchableOpacity>
        ))}

        {AMOUNT_INCREMENTS.map((inc) => (
          <TouchableOpacity
            key={`inc-${inc}`}
            activeOpacity={0.75}
            onPress={() => handleIncrement(inc)}
            style={styles.incrementChip}
          >
            <Plus size={11} color={ThemeColors.textSecondary} />
            <Text style={styles.incrementChipText}>{currencySymbol}{inc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Custom Keypad */}
      <View style={styles.keypadContainer}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['.', '0', 'back'],
        ].map((row, rowIdx) => (
          <View key={rowIdx} style={styles.keypadRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                activeOpacity={0.7}
                onPress={() => handleKeypadPress(key)}
                style={styles.keypadKey}
              >
                {key === 'back' ? (
                  <Trash2 size={18} color={ThemeColors.textSecondary} />
                ) : (
                  <Text style={styles.keypadKeyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isSubmitDisabled}
        onPress={onSubmit}
        style={[styles.primaryCardBtn, isSubmitDisabled && styles.primaryCardBtnDisabled]}
      >
        <Text style={styles.primaryCardBtnText}>Continue to Category</Text>
        <ArrowRight size={17} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  amountDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  amountCurrencySymbol: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 28,
    color: ThemeColors.primary,
    marginBottom: 4,
  },
  amountLargeText: {
    fontFamily: AppFonts.outfit.extraBold,
    fontSize: 38,
    color: ThemeColors.textPrimary,
    letterSpacing: -1,
  },
  amountLargePlaceholder: {
    color: ThemeColors.textMuted,
  },
  blinkingCursor: {
    width: 2.5,
    height: 32,
    backgroundColor: ThemeColors.primary,
    marginLeft: 3,
    borderRadius: 1.5,
  },
  chipsScrollView: {
    marginVertical: 8,
  },
  chipsScrollContent: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  presetChipActive: {
    backgroundColor: ThemeColors.primarySoft,
    borderColor: ThemeColors.primary,
  },
  presetChipText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  presetChipTextActive: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.primary,
  },
  incrementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
  },
  incrementChipText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  keypadContainer: {
    gap: 6,
    marginVertical: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 6,
  },
  keypadKey: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadKeyText: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  primaryCardBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: ThemeColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryCardBtnDisabled: {
    backgroundColor: ThemeColors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryCardBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});

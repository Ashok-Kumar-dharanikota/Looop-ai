import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Trash2, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AMOUNT_PRESETS, AMOUNT_INCREMENTS } from './expense-constants';

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
            <Plus size={11} color="#64748B" />
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
                  <Trash2 size={18} color="#64748B" />
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
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  amountLargeText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
  },
  amountLargePlaceholder: {
    color: '#CBD5E1',
  },
  blinkingCursor: {
    width: 2,
    height: 30,
    backgroundColor: '#7C3AED',
    marginLeft: 2,
    borderRadius: 1,
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#7C3AED',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  incrementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  incrementChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
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
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadKeyText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
  },
  primaryCardBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryCardBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryCardBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

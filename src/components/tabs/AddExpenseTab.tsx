import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  TextInput,
} from 'react-native';
import { Utensils, Car, ShoppingBag, CreditCard, Sparkles, Check } from 'lucide-react-native';
import { VoiceExpenseLogger } from '@/components/onboarding/VoiceExpenseLogger';

const CATEGORIES = [
  { id: '1', name: 'Food & Dining', icon: Utensils },
  { id: '2', name: 'Transport', icon: Car },
  { id: '3', name: 'Shopping', icon: ShoppingBag },
  { id: '4', name: 'Bills & Utilities', icon: CreditCard },
];

export const AddExpenseTab: React.FC = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [amount, setAmount] = useState('45.00');
  const [selectedCat, setSelectedCat] = useState('1');

  const textPrimary = isDark ? '#FFFFFF' : '#0F0F14';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? '#13131A' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#EAEAEA';
  const iconBtnBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F4F4F7';

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: textPrimary }]}>Add Expense</Text>
        <View style={styles.pillBadge}>
          <Sparkles size={12} color="#C084FC" />
          <Text style={styles.pillBadgeText}>AI INSTANT LOG</Text>
        </View>
      </View>

      {/* Manual Amount Display */}
      <View
        style={[
          styles.amountCard,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        <Text style={[styles.amountLabel, { color: textSecondary }]}>Enter Amount</Text>
        <View style={styles.amountInputRow}>
          <Text style={[styles.currencySymbol, { color: textPrimary }]}>₹</Text>
          <TextInput
            style={[styles.amountInput, { color: textPrimary }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Category Select Grid */}
      <Text style={[styles.sectionTitle, { color: textSecondary }]}>SELECT CATEGORY</Text>
      <View style={styles.categoriesGrid}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCat === cat.id;
          const IconComp = cat.icon;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCat(cat.id)}
              style={[
                styles.categoryCard,
                { backgroundColor: cardBg, borderColor: isSelected ? '#C084FC' : cardBorder },
              ]}
            >
              <View style={[styles.catIconCircle, { backgroundColor: isSelected ? 'rgba(192, 132, 252, 0.2)' : iconBtnBg }]}>
                <IconComp size={18} color={isSelected ? '#C084FC' : textPrimary} />
              </View>
              <Text style={[styles.catName, { color: isSelected ? '#C084FC' : textPrimary }]}>
                {cat.name}
              </Text>
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Check size={10} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Voice & Text AI Logger */}
      <Text style={[styles.sectionTitle, { color: textSecondary }]}>OR SPEAK / AI TRANSCRIPT</Text>
      <View style={styles.voiceModule}>
        <VoiceExpenseLogger isActive={true} />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}>
        <Text style={styles.saveBtnText}>Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(192, 132, 252, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C084FC',
    letterSpacing: 0.8,
  },
  amountCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '800',
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '800',
    minWidth: 120,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  catIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  checkBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C084FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceModule: {
    marginBottom: 20,
  },
  saveBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#C084FC',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

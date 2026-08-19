import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
  Check,
  Plus,
  Sparkles,
  Receipt,
  ChevronDown,
  Edit3,
  CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Dropdown from '@/shared/ui/organisms/dropdown';
import type { CategoryItem, ParsedExpenseResult } from '@/lib/expense-nlp-parser';
import { PAYMENT_METHODS } from './expense-constants';

interface ReceiptSummaryCardProps {
  amount: string;
  selectedCategory: CategoryItem | null;
  time: string;
  reason: string;
  paymentMethod: string;
  isSaved: boolean;
  parsedNLPResult: ParsedExpenseResult | null;
  currencySymbol?: string;
  onPaymentMethodChange: (method: string) => void;
  onEditPress: () => void;
  onSavePress: () => void;
  onResetPress: () => void;
}

export const ReceiptSummaryCard: React.FC<ReceiptSummaryCardProps> = React.memo(({
  amount,
  selectedCategory,
  time,
  reason,
  paymentMethod,
  isSaved,
  parsedNLPResult,
  currencySymbol = '₹',
  onPaymentMethodChange,
  onEditPress,
  onSavePress,
  onResetPress,
}) => {
  if (isSaved) {
    return (
      <View style={styles.savedCelebrationBox}>
        <View style={styles.savedCheckCircle}>
          <Check size={36} color="#FFFFFF" strokeWidth={3.5} />
        </View>
        <Text style={styles.savedTitle}>Payment Logged!</Text>
        <Text style={styles.savedSubtitle}>
          {currencySymbol}{parseFloat(amount || '0').toLocaleString('en-IN')} successfully recorded to transactions
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onResetPress}
          style={styles.logAnotherBtn}
        >
          <Plus size={16} color="#9333EA" />
          <Text style={styles.logAnotherBtnText}>Log Another Expense</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const IconComp = selectedCategory?.icon;

  return (
    <View style={styles.container}>
      {/* Top Receipt Cutout Header */}
      <View style={styles.receiptTopHeader}>
        <View style={styles.receiptBrandRow}>
          <View
            style={[
              styles.receiptIconBadge,
              { backgroundColor: selectedCategory?.bg || '#F3E8FF' },
            ]}
          >
            {IconComp && (
              <IconComp size={22} color={selectedCategory.color} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.receiptStoreName} numberOfLines={1}>
              {reason || selectedCategory?.name || 'Expense'}
            </Text>
            <Text style={styles.receiptSubtitle} numberOfLines={1}>
              {selectedCategory?.name || 'General'} • {time}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.receiptStatusPill,
            parsedNLPResult?.isAIParsed
              ? { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF' }
              : { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
          ]}
        >
          {parsedNLPResult?.isAIParsed ? (
            <Sparkles size={12} color="#9333EA" />
          ) : (
            <Receipt size={12} color="#059669" />
          )}
          <Text
            style={[
              styles.receiptStatusText,
              parsedNLPResult?.isAIParsed ? { color: '#9333EA' } : { color: '#059669' },
            ]}
          >
            {parsedNLPResult?.isAIParsed ? 'SMART LOG' : 'VERIFIED'}
          </Text>
        </View>
      </View>

      {/* Receipt Amount Big Display */}
      <View style={styles.receiptAmountHero}>
        <Text style={styles.receiptAmountSymbol}>{currencySymbol}</Text>
        <Text style={styles.receiptAmountDigits}>
          {parseFloat(amount || '0').toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Dashed divider with side notches */}
      <View style={styles.receiptDividerRow}>
        <View style={styles.receiptLeftNotch} />
        <View style={styles.receiptDashedLine} />
        <View style={styles.receiptRightNotch} />
      </View>

      {/* Receipt Line Items */}
      <View style={styles.receiptMetaTable}>
        <View style={styles.receiptMetaRow}>
          <Text style={styles.receiptMetaLabel}>CATEGORY</Text>
          <Text style={styles.receiptMetaVal}>{selectedCategory?.name || 'General'}</Text>
        </View>

        <View style={styles.receiptMetaRow}>
          <Text style={styles.receiptMetaLabel}>TIMESTAMP</Text>
          <Text style={styles.receiptMetaVal}>{time}</Text>
        </View>

        <View style={styles.receiptMetaRow}>
          <Text style={styles.receiptMetaLabel}>DESCRIPTION</Text>
          <Text style={styles.receiptMetaVal} numberOfLines={1}>
            {reason || 'None provided'}
          </Text>
        </View>

        {/* Payment Mode with Interactive Dropdown */}
        <View style={[styles.receiptMetaRow, { borderBottomWidth: 0, paddingBottom: 2 }]}>
          <Text style={styles.receiptMetaLabel}>PAYMENT METHOD</Text>
          <View style={styles.dropdownAnchorCol}>
            <Dropdown>
              <Dropdown.Trigger style={styles.dropdownTriggerWrapper}>
                <View style={styles.paymentDropdownTrigger}>
                  <Text style={styles.paymentDropdownText} numberOfLines={1}>
                    {paymentMethod}
                  </Text>
                  <ChevronDown size={13} color="#9333EA" style={{ marginLeft: 6 }} />
                </View>
              </Dropdown.Trigger>

              <Dropdown.Content position="auto" style={styles.paymentDropdownMenu}>
                {PAYMENT_METHODS.map((pm) => {
                  const IconC = pm.icon;
                  const isSelected = paymentMethod === pm.label;
                  return (
                    <Dropdown.Item
                      key={pm.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onPaymentMethodChange(pm.label);
                      }}
                      style={[
                        styles.dropdownOptionItem,
                        isSelected && styles.dropdownOptionItemSelected,
                      ]}
                    >
                      <View style={styles.dropdownOptionLeft}>
                        <IconC size={16} color={isSelected ? '#9333EA' : '#64748B'} />
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            isSelected && styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {pm.label}
                        </Text>
                      </View>
                      {isSelected && <Check size={14} color="#9333EA" strokeWidth={2.5} />}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Content>
            </Dropdown>
          </View>
        </View>
      </View>

      {/* Barcode & Edit / Save Actions */}
      <View style={styles.receiptBarcodeDecoration}>
        <View style={styles.barcodeLinesMock} />
        <Text style={styles.receiptCodeText}>REC-{Date.now().toString().slice(-8)}</Text>
      </View>

      <View style={styles.receiptActionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onEditPress}
          style={styles.editReceiptBtn}
        >
          <Edit3 size={15} color="#475569" />
          <Text style={styles.editReceiptBtnText}>Edit Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSavePress}
          style={styles.saveReceiptFinalBtn}
        >
          <CheckCircle2 size={18} color="#FFFFFF" />
          <Text style={styles.saveReceiptFinalText}>Confirm & Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  savedCelebrationBox: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  savedCheckCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  savedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  savedSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  logAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FAF5FF',
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  logAnotherBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9333EA',
  },
  receiptTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  receiptBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  receiptIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptStoreName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  receiptStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  receiptStatusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  receiptAmountHero: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 10,
  },
  receiptAmountSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9333EA',
    marginRight: 4,
  },
  receiptAmountDigits: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  receiptDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    marginHorizontal: -20,
  },
  receiptLeftNotch: {
    width: 14,
    height: 24,
    backgroundColor: '#FAFAFC',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptDashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  receiptRightNotch: {
    width: 14,
    height: 24,
    backgroundColor: '#FAFAFC',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderLeftWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptMetaTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  receiptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  receiptMetaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  receiptMetaVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    maxWidth: '55%',
    textAlign: 'right',
  },
  dropdownAnchorCol: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dropdownTriggerWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  paymentDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  paymentDropdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9333EA',
    textAlign: 'right',
  },
  paymentDropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    minWidth: 230,
    zIndex: 9999,
  },
  dropdownOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dropdownOptionItemSelected: {
    backgroundColor: '#FAF5FF',
  },
  dropdownOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownOptionTextSelected: {
    color: '#9333EA',
    fontWeight: '700',
  },
  receiptBarcodeDecoration: {
    alignItems: 'center',
    marginVertical: 10,
  },
  barcodeLinesMock: {
    width: '60%',
    height: 18,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    opacity: 0.6,
  },
  receiptCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  receiptActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  editReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  editReceiptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  saveReceiptFinalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveReceiptFinalText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

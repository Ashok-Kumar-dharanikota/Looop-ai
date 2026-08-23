import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
  Check,
  Plus,
  Sparkles,
  Edit3,
  CheckCircle2,
  Zap,
} from 'lucide-react-native';
import type { CategoryItem, ParsedExpenseResult } from '@/lib/expense-nlp-parser';
import { ThemeColors, AppFonts } from '@/constants/theme';

interface ReceiptSummaryCardProps {
  amount: string;
  selectedCategory: CategoryItem | null;
  time: string;
  reason: string;
  isSaved: boolean;
  parsedNLPResult: ParsedExpenseResult | null;
  currencySymbol?: string;
  onEditPress: () => void;
  onSavePress: () => void;
  onResetPress: () => void;
}

export const ReceiptSummaryCard: React.FC<ReceiptSummaryCardProps> = React.memo(({
  amount,
  selectedCategory,
  time,
  reason,
  isSaved,
  parsedNLPResult,
  currencySymbol = '₹',
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
          <Plus size={16} color={ThemeColors.primary} />
          <Text style={styles.logAnotherBtnText}>Log Another Expense</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const IconComp = selectedCategory?.icon;
  const isAIParsed = Boolean(parsedNLPResult?.isAIParsed);

  return (
    <View style={styles.container}>
      {/* Top Receipt Cutout Header */}
      <View style={styles.receiptTopHeader}>
        <View style={styles.receiptBrandRow}>
          <View
            style={[
              styles.receiptIconBadge,
              { backgroundColor: selectedCategory?.bg || ThemeColors.primarySoft },
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

        {/* Dynamic Engine Pill Badge */}
        <View
          style={[
            styles.receiptStatusPill,
            isAIParsed
              ? { backgroundColor: ThemeColors.violetSoft, borderColor: ThemeColors.violetBorder }
              : { backgroundColor: ThemeColors.amberSoft, borderColor: ThemeColors.amberBorder },
          ]}
        >
          {isAIParsed ? (
            <Sparkles size={12} color={ThemeColors.violet} />
          ) : (
            <Zap size={12} color={ThemeColors.amber} />
          )}
          <Text
            style={[
              styles.receiptStatusText,
              isAIParsed ? { color: ThemeColors.violet } : { color: ThemeColors.amber },
            ]}
          >
            {isAIParsed ? 'GEMINI AI' : 'LOCAL PARSER'}
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

        <View style={[styles.receiptMetaRow, { borderBottomWidth: 0, paddingBottom: 2 }]}>
          <Text style={styles.receiptMetaLabel}>DESCRIPTION</Text>
          <Text style={styles.receiptMetaVal} numberOfLines={2}>
            {reason || 'None provided'}
          </Text>
        </View>
      </View>

      {/* AI vs Local Parser Provenance Indicator Banner */}
      <View
        style={[
          styles.engineProvenanceCard,
          isAIParsed ? styles.engineProvenanceCardAi : styles.engineProvenanceCardFallback,
        ]}
      >
        <View
          style={[
            styles.engineIconBox,
            isAIParsed ? { backgroundColor: ThemeColors.violetSoft } : { backgroundColor: ThemeColors.amberSoft },
          ]}
        >
          {isAIParsed ? (
            <Sparkles size={14} color={ThemeColors.violet} />
          ) : (
            <Zap size={14} color={ThemeColors.amber} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.engineTitle,
              isAIParsed ? { color: ThemeColors.violet } : { color: ThemeColors.amber },
            ]}
          >
            {isAIParsed
              ? `Parsed via Firebase AI (${parsedNLPResult?.aiModelUsed || 'Gemini 3.5 Flash-Lite'})`
              : 'Parsed via Local Pattern Parser (Offline Fallback)'}
          </Text>
          <Text style={styles.engineSubtitle}>
            {isAIParsed
              ? 'App Check authenticated • Real-time Gemini extraction'
              : 'Firebase AI offline or unavailable • Rule-based match'}
          </Text>
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
          <Edit3 size={15} color={ThemeColors.textSecondary} />
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
    backgroundColor: ThemeColors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: ThemeColors.emerald,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  savedTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 24,
    color: ThemeColors.textPrimary,
  },
  savedSubtitle: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 14,
    color: ThemeColors.textSecondary,
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
    backgroundColor: ThemeColors.primarySoft,
    borderWidth: 1.5,
    borderColor: ThemeColors.primaryBorder,
  },
  logAnotherBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: ThemeColors.primary,
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
    fontFamily: AppFonts.outfit.bold,
    fontSize: 17,
    color: ThemeColors.textPrimary,
  },
  receiptSubtitle: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12,
    color: ThemeColors.textSecondary,
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
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  receiptAmountHero: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 10,
  },
  receiptAmountSymbol: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 26,
    color: ThemeColors.primary,
    marginRight: 4,
  },
  receiptAmountDigits: {
    fontFamily: AppFonts.outfit.black,
    fontSize: 40,
    color: ThemeColors.textPrimary,
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
    backgroundColor: ThemeColors.canvas,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderRightWidth: 1,
    borderColor: ThemeColors.border,
  },
  receiptDashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  receiptRightNotch: {
    width: 14,
    height: 24,
    backgroundColor: ThemeColors.canvas,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderLeftWidth: 1,
    borderColor: ThemeColors.border,
  },
  receiptMetaTable: {
    backgroundColor: ThemeColors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
  },
  receiptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  receiptMetaLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.textMuted,
    letterSpacing: 0.6,
  },
  receiptMetaVal: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 13,
    color: ThemeColors.textPrimary,
    maxWidth: '65%',
    textAlign: 'right',
  },
  engineProvenanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 4,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  engineProvenanceCardAi: {
    backgroundColor: ThemeColors.violetSoft,
    borderColor: ThemeColors.violetBorder,
  },
  engineProvenanceCardFallback: {
    backgroundColor: ThemeColors.amberSoft,
    borderColor: ThemeColors.amberBorder,
  },
  engineIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
  },
  engineSubtitle: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 10.5,
    color: ThemeColors.textSecondary,
    marginTop: 1,
  },
  receiptBarcodeDecoration: {
    alignItems: 'center',
    marginVertical: 10,
  },
  barcodeLinesMock: {
    width: '60%',
    height: 18,
    backgroundColor: ThemeColors.border,
    borderRadius: 4,
    opacity: 0.6,
  },
  receiptCodeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.textMuted,
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
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  editReceiptBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  saveReceiptFinalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    backgroundColor: ThemeColors.emerald,
    shadowColor: ThemeColors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveReceiptFinalText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

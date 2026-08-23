import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Sparkles, Check, Zap } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { ParsedExpenseResult, CategoryItem } from '@/lib/expense-nlp-parser';
import { ThemeColors, AppFonts } from '@/constants/theme';

interface AIVerificationOverlayProps {
  insets: EdgeInsets;
  verifiedStepCount: number;
  parsedNLPResult: ParsedExpenseResult | null;
  amount: string;
  selectedCategory: CategoryItem | null;
  time: string;
  reason: string;
  currencySymbol?: string;
}

export const AIVerificationOverlay: React.FC<AIVerificationOverlayProps> = React.memo(({
  insets,
  verifiedStepCount,
  parsedNLPResult,
  amount,
  selectedCategory,
  time,
  reason,
  currencySymbol = '₹',
}) => {
  const isAIParsed = Boolean(parsedNLPResult?.isAIParsed);

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      exiting={FadeOut.duration(200)}
      style={[styles.verifyingContainer, { paddingTop: Math.max(insets.top, 24) }]}
    >
      <View style={styles.verifyingHeaderBox}>
        <View
          style={[
            styles.verifyingSparkleBadge,
            !isAIParsed && { backgroundColor: ThemeColors.amberSoft, borderColor: ThemeColors.amberBorder },
          ]}
        >
          {isAIParsed ? (
            <Sparkles size={14} color={ThemeColors.violet} />
          ) : (
            <Zap size={14} color={ThemeColors.amber} />
          )}
          <Text
            style={[
              styles.verifyingSparkleText,
              !isAIParsed && { color: ThemeColors.amber },
            ]}
          >
            {isAIParsed ? 'FIREBASE AI (GEMINI)' : 'LOCAL PATTERN PARSER'}
          </Text>
        </View>
        <Text style={styles.verifyingTitle}>Analyzing Note Details</Text>
        <Text style={styles.verifyingSubtitle}>
          {isAIParsed
            ? `Structured in real-time with ${parsedNLPResult?.aiModelUsed || 'Gemini 3.5 Flash-Lite'}`
            : 'Structured with on-device pattern parser'}
        </Text>
      </View>

      {/* Vertical Dynamic Checklist Card */}
      <View style={styles.verifyingChecklistCard}>
        {/* Step 1: Amount */}
        <View style={styles.pipelineRow}>
          <View style={styles.pipelineIndicatorCol}>
            <View
              style={[
                styles.pipelineCircle,
                verifiedStepCount >= 1 && styles.pipelineCircleDone,
              ]}
            >
              {verifiedStepCount >= 1 ? (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <View style={styles.pipelineDot} />
              )}
            </View>
            <View
              style={[
                styles.pipelineConnector,
                verifiedStepCount >= 2 && styles.pipelineConnectorDone,
              ]}
            />
          </View>
          <View style={styles.pipelineContentCol}>
            <Text
              style={[
                styles.pipelineStepLabel,
                verifiedStepCount >= 1 && styles.pipelineStepLabelDone,
              ]}
            >
              {verifiedStepCount >= 1
                ? `Amount recognised: ${currencySymbol}${parsedNLPResult?.amountFormatted || amount}`
                : 'Recognising amount...'}
            </Text>
            <Text style={styles.pipelineStepSub}>
              {verifiedStepCount >= 1 ? 'Extracted accurately from note' : 'Analyzing monetary value'}
            </Text>
          </View>
        </View>

        {/* Step 2: Category */}
        <View style={styles.pipelineRow}>
          <View style={styles.pipelineIndicatorCol}>
            <View
              style={[
                styles.pipelineCircle,
                verifiedStepCount >= 2 && styles.pipelineCircleDone,
              ]}
            >
              {verifiedStepCount >= 2 ? (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <View style={styles.pipelineDot} />
              )}
            </View>
            <View
              style={[
                styles.pipelineConnector,
                verifiedStepCount >= 3 && styles.pipelineConnectorDone,
              ]}
            />
          </View>
          <View style={styles.pipelineContentCol}>
            <Text
              style={[
                styles.pipelineStepLabel,
                verifiedStepCount >= 2 && styles.pipelineStepLabelDone,
              ]}
            >
              {verifiedStepCount >= 2
                ? `Selected category: ${parsedNLPResult?.categoryName || selectedCategory?.name || 'Food & Dining'}`
                : 'Classifying category...'}
            </Text>
            <Text style={styles.pipelineStepSub}>
              {verifiedStepCount >= 2 ? 'Matched with category budget' : 'Identifying category'}
            </Text>
          </View>
        </View>

        {/* Step 3: Date & Time */}
        <View style={styles.pipelineRow}>
          <View style={styles.pipelineIndicatorCol}>
            <View
              style={[
                styles.pipelineCircle,
                verifiedStepCount >= 3 && styles.pipelineCircleDone,
              ]}
            >
              {verifiedStepCount >= 3 ? (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <View style={styles.pipelineDot} />
              )}
            </View>
            <View
              style={[
                styles.pipelineConnector,
                verifiedStepCount >= 4 && styles.pipelineConnectorDone,
              ]}
            />
          </View>
          <View style={styles.pipelineContentCol}>
            <Text
              style={[
                styles.pipelineStepLabel,
                verifiedStepCount >= 3 && styles.pipelineStepLabelDone,
              ]}
            >
              {verifiedStepCount >= 3
                ? `Identified timestamp: ${parsedNLPResult?.timeLabel || time}`
                : 'Detecting timestamp...'}
            </Text>
            <Text style={styles.pipelineStepSub}>
              {verifiedStepCount >= 3 ? 'Timestamped accurately' : 'Parsing temporal context'}
            </Text>
          </View>
        </View>

        {/* Step 4: Description */}
        <View style={[styles.pipelineRow, { marginBottom: 0 }]}>
          <View style={styles.pipelineIndicatorCol}>
            <View
              style={[
                styles.pipelineCircle,
                verifiedStepCount >= 4 && styles.pipelineCircleDone,
              ]}
            >
              {verifiedStepCount >= 4 ? (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <View style={styles.pipelineDot} />
              )}
            </View>
          </View>
          <View style={styles.pipelineContentCol}>
            <Text
              style={[
                styles.pipelineStepLabel,
                verifiedStepCount >= 4 && styles.pipelineStepLabelDone,
              ]}
            >
              {verifiedStepCount >= 4
                ? `Parsed description: ${parsedNLPResult?.description || reason || 'Expense'}`
                : 'Extracting description...'}
            </Text>
            <Text style={styles.pipelineStepSub}>
              {verifiedStepCount >= 4 ? 'Description captured' : 'Classifying transaction note'}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  verifyingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  verifyingHeaderBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  verifyingSparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: ThemeColors.violetSoft,
    borderWidth: 1,
    borderColor: ThemeColors.violetBorder,
    marginBottom: 12,
  },
  verifyingSparkleText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.violet,
    letterSpacing: 0.8,
  },
  verifyingTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 26,
    color: ThemeColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  verifyingSubtitle: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  verifyingChecklistCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  pipelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pipelineIndicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 14,
  },
  pipelineCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipelineCircleDone: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  pipelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.border,
  },
  pipelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: 4,
  },
  pipelineConnectorDone: {
    backgroundColor: ThemeColors.emerald,
  },
  pipelineContentCol: {
    flex: 1,
    justifyContent: 'center',
  },
  pipelineStepLabel: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  pipelineStepLabelDone: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.textPrimary,
  },
  pipelineStepSub: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginTop: 2,
  },
});

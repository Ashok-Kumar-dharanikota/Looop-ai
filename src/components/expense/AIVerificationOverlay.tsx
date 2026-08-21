import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Sparkles, Check, Zap } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { ParsedExpenseResult, CategoryItem } from '@/lib/expense-nlp-parser';

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
            !isAIParsed && { backgroundColor: '#FEF3C7' },
          ]}
        >
          {isAIParsed ? (
            <Sparkles size={14} color="#9333EA" />
          ) : (
            <Zap size={14} color="#D97706" />
          )}
          <Text
            style={[
              styles.verifyingSparkleText,
              !isAIParsed && { color: '#D97706' },
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
              {verifiedStepCount >= 2 ? 'Matched with category budget' : 'Identifying merchant category'}
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

        {/* Step 4: Note & Merchant */}
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
                ? `Parsed note: ${parsedNLPResult?.merchant || reason || 'Expense'}`
                : 'Extracting note & payment...'}
            </Text>
            <Text style={styles.pipelineStepSub}>
              {verifiedStepCount >= 4 ? 'Merchant and payment method tagged' : 'Classifying transaction description'}
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
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 12,
  },
  verifyingSparkleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9333EA',
    letterSpacing: 0.8,
  },
  verifyingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  verifyingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  verifyingChecklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipelineCircleDone: {
    backgroundColor: '#059669',
  },
  pipelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  pipelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  pipelineConnectorDone: {
    backgroundColor: '#059669',
  },
  pipelineContentCol: {
    flex: 1,
    justifyContent: 'center',
  },
  pipelineStepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  pipelineStepLabelDone: {
    color: '#0F172A',
    fontWeight: '700',
  },
  pipelineStepSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
});

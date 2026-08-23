import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Mic,
  RotateCcw,
  Send,
  Sparkles,
  X,
  Check,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { AnimatedMeshGradient } from '@/components/ui/AnimatedMeshGradient';
import { useAddTransactionMutation } from '@/hooks/use-database';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import {
  parseExpenseText,
  type CategoryItem,
  type ParsedExpenseResult,
} from '@/lib/expense-nlp-parser';
import { parseExpenseWithFirebaseAI } from '@/services/firebase-ai';
import { useAppStore } from '@/store';

import {
  CATEGORIES,
  TIME_PRESETS,
  REASON_SUGGESTIONS,
  CATEGORY_REASON_SUGGESTIONS,
  STEP_QUESTIONS,
  SPEECH_CONTEXTUAL_STRINGS,
  type StepType,
} from '@/components/expense/expense-constants';
import { KeypadGrid } from '@/components/expense/KeypadGrid';
import { VoiceRecordingOverlay } from '@/components/expense/VoiceRecordingOverlay';
import { AIVerificationOverlay } from '@/components/expense/AIVerificationOverlay';
import { ReceiptSummaryCard } from '@/components/expense/ReceiptSummaryCard';
import { ThemeColors, AppFonts } from '@/constants/theme';

// Re-export CATEGORIES for backwards compatibility if imported elsewhere
export { CATEGORIES };

interface ChatExpenseTabProps {
  onClose?: () => void;
  isStandalone?: boolean;
}

export const ChatExpenseTab: React.FC<ChatExpenseTabProps> = ({
  onClose,
  isStandalone = false,
}) => {
  const insets = useSafeAreaInsets();
  const animatedKeyboard = useAnimatedKeyboard();
  const addTxMutation = useAddTransactionMutation();
  const currencySymbol = useAppStore((state) => state.currencySymbol) || '₹';

  // Native Speech-to-Text Custom Hook
  const speech = useSpeechRecognition();

  // Active step & Form state
  const [currentStep, setCurrentStep] = useState<StepType>('amount');
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('Just now');
  const [reason, setReason] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  // Bottom floating text input
  const [floatingInputText, setFloatingInputText] = useState('');
  const [isAIParsingText, setIsAIParsingText] = useState(false);

  // AI Pipeline State
  const [isVerifyingMode, setIsVerifyingMode] = useState(false);
  const [verifiedStepCount, setVerifiedStepCount] = useState(0);
  const [parsedNLPResult, setParsedNLPResult] = useState<ParsedExpenseResult | null>(null);

  // Audio Wave Animation Values
  const waveScale1 = useSharedValue(1);

  // Audio Recording Flow State
  const [isAudioRecordingMode, setIsAudioRecordingMode] = useState(false);

  useEffect(() => {
    if (isAudioRecordingMode && speech.isListening) {
      waveScale1.value = withTiming(1.35, { duration: 500 });
    } else {
      waveScale1.value = withTiming(1);
    }
  }, [isAudioRecordingMode, speech.isListening]);

  const animatedWave1 = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale1.value }],
    opacity: isAudioRecordingMode ? 0.35 : 0,
  }));

  const animatedFloatingDock = useAnimatedStyle(() => ({
    transform: [{ translateY: -animatedKeyboard.height.value }],
  }));

  const activeVoiceWords = useMemo(() => {
    if (speech.words && speech.words.length > 0) {
      return speech.words;
    }
    return [];
  }, [speech.words]);

  const hasCapturedVoice = Boolean(
    (speech.transcript || speech.interimTranscript).trim().length > 0
  );

  // -------------------------------------------------------------
  // Universal AI Step-by-Step Verification Pipeline
  // -------------------------------------------------------------
  const executeAIVerificationPipeline = useCallback(async (textToParse: string) => {
    Keyboard.dismiss();
    setIsAudioRecordingMode(false);
    setIsVerifyingMode(true);
    setVerifiedStepCount(0);

    try {
      // 1. Run Firebase AI (Gemini)
      const parsed = await parseExpenseWithFirebaseAI(textToParse, CATEGORIES);
      setParsedNLPResult(parsed);

      // 2. Populate structured state values
      if (parsed.amount !== null && parsed.amount > 0) {
        setAmount(String(parsed.amount));
      } else {
        setAmount('');
      }

      if (parsed.category) {
        setSelectedCategory(parsed.category);
      } else {
        setSelectedCategory(null);
      }

      setTime(parsed.timeLabel);
      setReason(parsed.description || parsed.reason || parsed.merchant || '');

      // 3. Trigger sequential verification step highlights
      setVerifiedStepCount(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setTimeout(() => {
        setVerifiedStepCount(2);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 400);

      setTimeout(() => {
        setVerifiedStepCount(3);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 800);

      setTimeout(() => {
        setVerifiedStepCount(4);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1200);

      setTimeout(() => {
        setIsVerifyingMode(false);

        // Smart Follow-up Navigation:
        // If any essential field is empty, unknown, or missing, guide the user to that exact step with the AI followup question!
        if (parsed.missingFields && parsed.missingFields.length > 0) {
          if (parsed.missingFields.includes('amount')) {
            setCurrentStep('amount');
          } else if (parsed.missingFields.includes('category')) {
            setCurrentStep('category');
          } else if (parsed.missingFields.includes('description')) {
            setCurrentStep('reason');
          } else {
            setCurrentStep('summary');
          }
        } else {
          setCurrentStep('summary');
        }
      }, 1800);
    } catch (err) {
      console.warn('Error in AI verification pipeline:', err);
      setIsVerifyingMode(false);
      setCurrentStep('summary');
    }
  }, []);

  // -------------------------------------------------------------
  // Speech Handlers
  // -------------------------------------------------------------
  const startAudioRecordingFlow = useCallback(async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsAudioRecordingMode(true);
    speech.reset();

    try {
      const started = await speech.start({
        lang: 'en-US',
        contextualStrings: SPEECH_CONTEXTUAL_STRINGS,
      });
      if (!started && speech.errorMessage) {
        if (speech.errorCode === 'not-allowed') {
          Alert.alert(
            'Microphone Access Required',
            'Please allow microphone & speech recognition permissions in settings to log expenses with your voice.'
          );
        }
      }
    } catch (e) {
      console.warn('Voice recording start error:', e);
    }
  }, [speech]);

  const handleStopRecording = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await speech.stop();
  }, [speech]);

  const handleConfirmAudioExpense = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (speech.isListening) {
      await speech.stop();
    }
    const rawTranscript = (speech.transcript || speech.interimTranscript || '').trim();
    const textToParse = rawTranscript || 'Paid ₹450 for lunch at Subway via UPI';
    await executeAIVerificationPipeline(textToParse);
  }, [speech, executeAIVerificationPipeline]);

  // -------------------------------------------------------------
  // Step Navigation Handlers (Smart Follow-up Routing)
  // -------------------------------------------------------------
  const advanceToNextStep = useCallback(
    (overrides?: {
      amount?: string;
      category?: CategoryItem | null;
      time?: string;
      reason?: string;
      nextStep?: StepType;
    }) => {
      if (overrides?.nextStep) {
        setCurrentStep(overrides.nextStep);
        return;
      }

      const currentAmt = overrides?.amount !== undefined ? overrides.amount : amount;
      const currentCat = overrides?.category !== undefined ? overrides.category : selectedCategory;
      const currentRsn = overrides?.reason !== undefined ? overrides.reason : reason;

      const numericAmt = parseFloat(currentAmt);
      const isAmtMissing = !currentAmt || isNaN(numericAmt) || numericAmt <= 0;
      const isCatMissing = !currentCat;
      const isRsnMissing =
        !currentRsn || currentRsn.trim() === '' || currentRsn.toLowerCase() === 'unknown';

      // If AI parsed this expense or user is filling follow-up fields:
      if (parsedNLPResult) {
        if (isAmtMissing) {
          setCurrentStep('amount');
          return;
        }
        if (isCatMissing) {
          setCurrentStep('category');
          return;
        }
        if (isRsnMissing && parsedNLPResult.missingFields?.includes('merchant')) {
          setCurrentStep('reason');
          return;
        }
        // All needed details are populated -> Show final receipt directly!
        setCurrentStep('summary');
        return;
      }

      // Linear fallback when starting completely blank
      if (isAmtMissing) {
        setCurrentStep('amount');
      } else if (isCatMissing) {
        setCurrentStep('category');
      } else if (currentStep === 'category') {
        setCurrentStep('time');
      } else if (currentStep === 'time') {
        setCurrentStep('reason');
      } else if (currentStep === 'reason') {
        setCurrentStep('summary');
      } else {
        setCurrentStep('summary');
      }
    },
    [amount, selectedCategory, reason, currentStep, parsedNLPResult]
  );

  const handleAmountSubmit = useCallback(() => {
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    advanceToNextStep({ amount, nextStep: 'category' });
  }, [amount, advanceToNextStep]);

  const handleCategorySelect = useCallback(
    (cat: CategoryItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedCategory(cat);
      advanceToNextStep({ category: cat, nextStep: 'time' });
    },
    [advanceToNextStep]
  );

  const handleTimeSelect = useCallback(
    (selectedTime: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTime(selectedTime);
    },
    []
  );

  const handleTimeSubmit = useCallback(
    (selectedTime?: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const finalTime = selectedTime !== undefined ? selectedTime : time;
      if (selectedTime !== undefined) {
        setTime(selectedTime);
      }
      advanceToNextStep({ time: finalTime, nextStep: 'reason' });
    },
    [time, advanceToNextStep]
  );

  const handleReasonSubmit = useCallback(
    (selectedReason?: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const finalRsn = selectedReason !== undefined ? selectedReason : reason;
      if (selectedReason !== undefined) {
        setReason(selectedReason);
      }
      advanceToNextStep({ reason: finalRsn, nextStep: 'summary' });
    },
    [reason, advanceToNextStep]
  );

  const handleSaveToDatabase = useCallback(async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const numericAmount = parseFloat(amount) || 0;
      const today = new Date();
      const todayDateStr = today.toISOString().split('T')[0];

      let formattedDate = todayDateStr;
      if (parsedNLPResult?.dateStr) {
        formattedDate = parsedNLPResult.dateStr;
      } else if (selectedDate) {
        formattedDate = selectedDate;
      } else if (time.toLowerCase().includes('yesterday')) {
        const yest = new Date(Date.now() - 86400000);
        formattedDate = yest.toISOString().split('T')[0];
      }

      const newTxId = 'tx_' + Date.now();
      const nowIso = new Date().toISOString();
      const combinedTimestamp = parsedNLPResult?.timestamp || nowIso;
      const cleanTimeDisplay = parsedNLPResult?.timeStr
        ? `${formattedDate === todayDateStr ? 'Today' : formattedDate}, ${parsedNLPResult.timeStr}`
        : time;

      await addTxMutation.mutateAsync({
        id: newTxId,
        amount: numericAmount,
        category: selectedCategory ? selectedCategory.name : 'General',
        date: formattedDate,
        timestamp: cleanTimeDisplay,
        description: reason.trim() || undefined,
        createdAt: combinedTimestamp,
        updatedAt: nowIso,
      });

      setIsSaved(true);
    } catch (e) {
      console.log('Database insert error:', e);
      setIsSaved(true);
    }
  }, [amount, reason, selectedCategory, time, selectedDate, parsedNLPResult, addTxMutation]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAmount('');
    setSelectedCategory(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setTime('Just now');
    setReason('');
    setFloatingInputText('');
    setIsSaved(false);
    setParsedNLPResult(null);
    speech.reset();
    setCurrentStep('amount');
  }, [speech]);

  const handleBackStep = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep === 'category') setCurrentStep('amount');
    else if (currentStep === 'time') setCurrentStep('category');
    else if (currentStep === 'reason') setCurrentStep('time');
    else if (currentStep === 'summary') setCurrentStep('reason');
  }, [currentStep]);

  // Single-line Text Input Submit
  const handleFloatingInputSubmit = useCallback(async () => {
    const rawText = floatingInputText.trim();
    if (!rawText || isAIParsingText) return;

    Keyboard.dismiss();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFloatingInputText('');
    setIsAIParsingText(true);

    try {
      const isOnlyNumber = /^\s*(?:₹|rs\.?|inr)?\s*\d+(?:,\d+)*(?:\.\d+)?\s*(?:rs|inr|k)?\s*$/i.test(
        rawText
      );
      if (isOnlyNumber) {
        const localParsed = parseExpenseText(rawText, CATEGORIES);
        if (localParsed.amount !== null) {
          setAmount(String(localParsed.amount));
          if (currentStep === 'amount') {
            setCurrentStep('category');
          }
          setIsAIParsingText(false);
          return;
        }
      }
      await executeAIVerificationPipeline(rawText);
    } catch (e) {
      console.warn('Error in floating input processing:', e);
    } finally {
      setIsAIParsingText(false);
    }
  }, [floatingInputText, isAIParsingText, currentStep, executeAIVerificationPipeline]);

  const currentInfo = STEP_QUESTIONS[currentStep];

  // Dynamic AI Followup Question when fields are missing/unknown
  const dynamicTitle = useMemo(() => {
    if (parsedNLPResult?.followupQuestion) {
      const missing = parsedNLPResult.missingFields || [];
      if (
        (currentStep === 'reason' && (missing.includes('merchant') || missing.includes('reason'))) ||
        (currentStep === 'amount' && missing.includes('amount')) ||
        (currentStep === 'category' && missing.includes('category'))
      ) {
        return parsedNLPResult.followupQuestion;
      }
    }
    return currentInfo.title;
  }, [parsedNLPResult, currentStep, currentInfo]);

  const dynamicSubtitle = useMemo(() => {
    if (parsedNLPResult?.followupQuestion && dynamicTitle === parsedNLPResult.followupQuestion) {
      return '✨ Quick Follow-up: Select or type details below to complete your record';
    }
    return currentInfo.subtitle;
  }, [parsedNLPResult, dynamicTitle, currentInfo]);

  const dynamicReasonSuggestions = useMemo(() => {
    if (selectedCategory && CATEGORY_REASON_SUGGESTIONS[selectedCategory.name]) {
      return CATEGORY_REASON_SUGGESTIONS[selectedCategory.name];
    }
    return REASON_SUGGESTIONS;
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      {/* 1. TOP ANIMATED MESH GRADIENT */}
      <AnimatedMeshGradient
        height={isAudioRecordingMode || isVerifyingMode ? 560 : 440}
        intensity="vibrant"
      />

      {/* STATE A: REAL AUDIO RECORDING FULL-SCREEN OVERLAY */}
      {isAudioRecordingMode ? (
        <VoiceRecordingOverlay
          insets={insets}
          isListening={speech.isListening}
          hasCapturedVoice={hasCapturedVoice}
          errorMessage={speech.errorMessage}
          words={activeVoiceWords}
          normalizedVolume={speech.normalizedVolume}
          onStartRecording={startAudioRecordingFlow}
          onStopRecording={handleStopRecording}
          onAbort={() => {
            speech.abort();
            setIsAudioRecordingMode(false);
          }}
          onConfirm={handleConfirmAudioExpense}
        />
      ) : isVerifyingMode ? (
        /* STATE B: STEP-BY-STEP AI ACTION VERIFICATION PIPELINE */
        <AIVerificationOverlay
          insets={insets}
          verifiedStepCount={verifiedStepCount}
          parsedNLPResult={parsedNLPResult}
          amount={amount}
          selectedCategory={selectedCategory}
          time={time}
          reason={reason}
          currencySymbol={currencySymbol}
        />
      ) : (
        /* STATE C: 5-STEP EXPENSE LOGGER CARD FLOW */
        <>
          {/* Header & Step Progress */}
          <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
            <View style={styles.headerTopRow}>
              {currentStep !== 'amount' ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleBackStep}
                  style={styles.headerIconBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <ArrowLeft size={20} color="#0F172A" />
                </TouchableOpacity>
              ) : isStandalone && onClose ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  style={styles.headerIconBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <X size={20} color="#0F172A" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 38 }} />
              )}

              {/* Step Progress Pill */}
              <View style={styles.stepProgressPill}>
                <Sparkles size={13} color={ThemeColors.primary} />
                <Text style={styles.stepProgressText}>
                  STEP {currentInfo.stepNumber} OF 5
                </Text>
              </View>

              {currentStep !== 'amount' && !isSaved ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleReset}
                  style={styles.headerIconBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <RotateCcw size={18} color={ThemeColors.textSecondary} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 38 }} />
              )}
            </View>

            {/* Step Dots Indicator */}
            <View style={styles.stepDotsRow}>
              {(['amount', 'category', 'time', 'reason', 'summary'] as StepType[]).map(
                (step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = currentInfo.stepNumber >= stepNum;
                  const isCurrent = currentInfo.stepNumber === stepNum;
                  return (
                    <View
                      key={step}
                      style={[
                        styles.stepDot,
                        isActive && styles.stepDotActive,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    />
                  );
                }
              )}
            </View>
          </View>

          {/* Main Content Area */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* Question Title */}
            <Animated.View
              key={currentStep}
              entering={FadeInDown.duration(280)}
              style={styles.questionSection}
            >
              <Text style={styles.questionTitle}>{dynamicTitle}</Text>
              <Text style={styles.questionSubtitle}>{dynamicSubtitle}</Text>
            </Animated.View>

            {/* Card Content for Active Step */}
            <Animated.View
              key={`card_${currentStep}`}
              entering={FadeInUp.duration(300)}
              style={styles.cardWrapper}
            >
              <View
                style={[
                  styles.expoCard,
                  currentStep === 'summary' && styles.receiptCard,
                ]}
              >
                {/* STEP 1: KEYPAD AMOUNT INPUT */}
                {currentStep === 'amount' && (
                  <KeypadGrid
                    amount={amount}
                    currencySymbol={currencySymbol}
                    onAmountChange={setAmount}
                    onSubmit={handleAmountSubmit}
                  />
                )}

                {/* STEP 2: CATEGORY SELECTION */}
                {currentStep === 'category' && (
                  <View style={styles.categoryCardInner}>
                    <View style={styles.categoryAmountBadge}>
                      <Text style={styles.categoryAmountLabel}>RECORDING</Text>
                      <Text style={styles.categoryAmountVal}>
                        {currencySymbol}{parseFloat(amount || '0').toLocaleString('en-IN')}
                      </Text>
                    </View>

                    <View style={styles.categoriesGrid}>
                      {CATEGORIES.map((cat) => {
                        const IconComp = cat.icon;
                        const isSelected = selectedCategory?.id === cat.id;
                        return (
                          <TouchableOpacity
                            key={cat.id}
                            activeOpacity={0.75}
                            onPress={() => handleCategorySelect(cat)}
                            style={[
                              styles.categoryTile,
                              isSelected && styles.categoryTileSelected,
                            ]}
                          >
                            <View
                              style={[
                                styles.categoryTileIconBox,
                                { backgroundColor: cat.bg },
                              ]}
                            >
                              <IconComp size={22} color={cat.color} />
                            </View>
                            <Text style={styles.categoryTileName} numberOfLines={1}>
                              {cat.name}
                            </Text>
                            {isSelected && (
                              <View style={styles.categoryTileCheck}>
                                <Check size={11} color="#FFFFFF" strokeWidth={3} />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* STEP 3: TIME & DATE SELECTION */}
                {currentStep === 'time' && (
                  <View style={styles.timeCardInner}>
                    <View style={styles.summaryMiniRow}>
                      <View
                        style={[
                          styles.miniBadge,
                          { backgroundColor: selectedCategory?.bg || ThemeColors.primarySoft },
                        ]}
                      >
                        <Text
                          style={[
                            styles.miniBadgeText,
                            { color: selectedCategory?.color || ThemeColors.primary },
                          ]}
                        >
                          {selectedCategory?.name || 'Category'}
                        </Text>
                      </View>
                      <Text style={styles.miniAmountText}>
                        {currencySymbol}{parseFloat(amount || '0').toLocaleString('en-IN')}
                      </Text>
                    </View>

                    {/* Quick Date Selector */}
                    <Text style={styles.sectionMiniLabel}>DATE</Text>
                    <View style={styles.dateSelectorRow}>
                      {[
                        { label: 'Today', offsetDays: 0 },
                        { label: 'Yesterday', offsetDays: 1 },
                        { label: '2 Days Ago', offsetDays: 2 },
                      ].map((d) => {
                        const targetDate = new Date(Date.now() - d.offsetDays * 86400000);
                        const dateStr = targetDate.toISOString().split('T')[0];
                        const isDateSelected = selectedDate === dateStr;
                        return (
                          <TouchableOpacity
                            key={d.label}
                            activeOpacity={0.75}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setSelectedDate(dateStr);
                              if (d.label === 'Yesterday' && time === 'Just now') {
                                setTime('Yesterday');
                              } else if (d.label === 'Today' && time === 'Yesterday') {
                                setTime('Just now');
                              }
                            }}
                            style={[
                              styles.dateChip,
                              isDateSelected && styles.dateChipSelected,
                            ]}
                          >
                            <Calendar
                              size={13}
                              color={isDateSelected ? ThemeColors.primary : ThemeColors.textSecondary}
                            />
                            <Text
                              style={[
                                styles.dateChipText,
                                isDateSelected && styles.dateChipTextSelected,
                              ]}
                            >
                              {d.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Time Presets */}
                    <Text style={[styles.sectionMiniLabel, { marginTop: 14 }]}>TIME</Text>
                    <View style={styles.timeChipsList}>
                      {TIME_PRESETS.map((tPreset) => {
                        const isSelected = time === tPreset;
                        return (
                          <TouchableOpacity
                            key={tPreset}
                            activeOpacity={0.8}
                            onPress={() => {
                              handleTimeSelect(tPreset);
                              if (tPreset === 'Yesterday') {
                                const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                                setSelectedDate(yest);
                              }
                            }}
                            style={[
                              styles.timeChipItem,
                              isSelected && styles.timeChipItemSelected,
                            ]}
                          >
                            <View style={styles.timeChipLeft}>
                              <Clock
                                size={16}
                                color={isSelected ? ThemeColors.primary : ThemeColors.textSecondary}
                              />
                              <Text
                                style={[
                                  styles.timeChipText,
                                  isSelected && styles.timeChipTextSelected,
                                ]}
                              >
                                {tPreset}
                              </Text>
                            </View>
                            {isSelected && (
                              <View style={styles.timeCheckCircle}>
                                <Check size={12} color="#FFFFFF" strokeWidth={3} />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleTimeSubmit(time)}
                      style={styles.timeContinueBtn}
                    >
                      <Text style={styles.timeContinueBtnText}>Continue to Note</Text>
                      <ArrowRight size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* STEP 4: REASON & NOTES */}
                {currentStep === 'reason' && (
                  <View style={styles.reasonCardInner}>
                    <View style={styles.inputPillBox}>
                      <TextInput
                        style={styles.reasonInput}
                        placeholder="e.g. Starbucks, Grocery run, Uber cab"
                        placeholderTextColor={ThemeColors.textMuted}
                        value={reason}
                        onChangeText={setReason}
                        returnKeyType="done"
                        onSubmitEditing={() => handleReasonSubmit(reason)}
                        autoFocus={false}
                      />
                      {reason.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setReason('')}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={{ padding: 4 }}
                        >
                          <X size={16} color={ThemeColors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={styles.quickTagsTitle}>QUICK SUGGESTIONS</Text>
                    <View style={styles.reasonSuggestionsWrap}>
                      {dynamicReasonSuggestions.map((sug) => {
                        const isSelected = reason === sug;
                        return (
                          <TouchableOpacity
                            key={sug}
                            activeOpacity={0.75}
                            onPress={() => {
                              setReason(sug);
                              handleReasonSubmit(sug);
                            }}
                            style={[
                              styles.reasonSugChip,
                              isSelected && styles.reasonSugChipSelected,
                            ]}
                          >
                            <Text
                              style={[
                                styles.reasonSugText,
                                isSelected && styles.reasonSugTextSelected,
                              ]}
                            >
                              {sug}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={styles.reasonActionsRow}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          handleReasonSubmit(
                            reason || selectedCategory?.name || 'Expense'
                          )
                        }
                        style={styles.skipBtn}
                      >
                        <Text style={styles.skipBtnText}>
                          {reason ? 'Next' : 'Skip & Continue'}
                        </Text>
                      </TouchableOpacity>

                      {reason.length > 0 && (
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => handleReasonSubmit(reason)}
                          style={styles.reasonNextBtn}
                        >
                          <Text style={styles.reasonNextBtnText}>Review</Text>
                          <ArrowRight size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}

                {/* STEP 5: AUTHENTIC PAYMENT RECEIPT CARD */}
                {currentStep === 'summary' && (
                  <ReceiptSummaryCard
                    amount={amount}
                    selectedCategory={selectedCategory}
                    time={time}
                    reason={reason}
                    isSaved={isSaved}
                    parsedNLPResult={parsedNLPResult}
                    currencySymbol={currencySymbol}
                    onEditPress={() => setCurrentStep('amount')}
                    onSavePress={handleSaveToDatabase}
                    onResetPress={handleReset}
                  />
                )}
              </View>
            </Animated.View>

            <View style={{ height: 130 }} />
          </ScrollView>

          {/* 4. FLOATING BOTTOM ACTION BAR */}
          <Animated.View
            style={[
              styles.floatingBottomDock,
              { bottom: Math.max(insets.bottom, 10) + 6 },
              animatedFloatingDock,
            ]}
          >
            {/* Left Speak (Voice Recording) Icon */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={startAudioRecordingFlow}
              style={styles.floatingSpeakBtn}
              accessibilityLabel="Record expense with voice"
            >
              <Animated.View style={[styles.speakPulseRing, animatedWave1]} />
              <Mic size={20} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>

            {/* Floating TextInput covering remaining space */}
            <View style={styles.floatingInputWrapper}>
              <TextInput
                style={styles.floatingTextInput}
                placeholder="Type e.g. 450 lunch subway or ₹300 cab..."
                placeholderTextColor={ThemeColors.textMuted}
                value={floatingInputText}
                onChangeText={setFloatingInputText}
                returnKeyType="send"
                onSubmitEditing={handleFloatingInputSubmit}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!floatingInputText.trim() || isAIParsingText}
                onPress={handleFloatingInputSubmit}
                style={[
                  styles.floatingSendBtn,
                  !floatingInputText.trim() && styles.floatingSendBtnDisabled,
                ]}
              >
                {isAIParsingText ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send
                    size={15}
                    color={floatingInputText.trim() ? '#FFFFFF' : ThemeColors.textMuted}
                  />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.canvas,
  },
  headerContainer: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ThemeColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepProgressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: ThemeColors.primarySoft,
    borderWidth: 1,
    borderColor: ThemeColors.primaryBorder,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  stepProgressText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.primary,
    letterSpacing: 0.8,
  },
  stepDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  stepDot: {
    width: 20,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: ThemeColors.border,
  },
  stepDotActive: {
    backgroundColor: ThemeColors.primaryBorder,
  },
  stepDotCurrent: {
    width: 32,
    backgroundColor: ThemeColors.primary,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 18,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  questionTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 28,
    color: ThemeColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  questionSubtitle: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 14,
    color: ThemeColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  cardWrapper: {
    width: '100%',
  },
  expoCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  receiptCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },

  // STEP 2: CATEGORY SELECTION STYLES
  categoryCardInner: {
    alignItems: 'center',
  },
  categoryAmountBadge: {
    alignItems: 'center',
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  categoryAmountLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: ThemeColors.textMuted,
    letterSpacing: 0.8,
  },
  categoryAmountVal: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 19,
    color: ThemeColors.textPrimary,
    marginTop: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryTile: {
    width: '47.5%',
    backgroundColor: ThemeColors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  categoryTileSelected: {
    borderColor: ThemeColors.primary,
    backgroundColor: ThemeColors.primarySoft,
  },
  categoryTileIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTileName: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 13,
    color: ThemeColors.textPrimary,
    flex: 1,
  },
  categoryTileCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // STEP 3: TIME SELECTION STYLES
  timeCardInner: {
    width: '100%',
  },
  summaryMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ThemeColors.surface,
    padding: 10,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
  },
  miniBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniBadgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 12,
  },
  miniAmountText: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  timeChipsList: {
    gap: 8,
  },
  timeChipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
  },
  timeChipItemSelected: {
    backgroundColor: ThemeColors.primarySoft,
    borderColor: ThemeColors.primary,
  },
  timeChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeChipText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  timeChipTextSelected: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.primary,
  },
  timeCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionMiniLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  dateChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  dateChipSelected: {
    backgroundColor: ThemeColors.primarySoft,
    borderColor: ThemeColors.primary,
  },
  dateChipText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  dateChipTextSelected: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.primary,
  },
  timeContinueBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: ThemeColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  timeContinueBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },

  // STEP 4: REASON & NOTES STYLES
  reasonCardInner: {
    width: '100%',
  },
  inputPillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    marginBottom: 16,
  },
  reasonInput: {
    flex: 1,
    fontFamily: AppFonts.inter.medium,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  quickTagsTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  reasonSuggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  reasonSugChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
  },
  reasonSugChipSelected: {
    backgroundColor: ThemeColors.primarySoft,
    borderColor: ThemeColors.primary,
  },
  reasonSugText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  reasonSugTextSelected: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.primary,
  },
  reasonActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  skipBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  reasonNextBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: ThemeColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  reasonNextBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },

  // FLOATING BOTTOM DOCK STYLES
  floatingBottomDock: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: ThemeColors.card,
    borderRadius: 30,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 10,
    zIndex: 50,
  },
  floatingSpeakBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  speakPulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FED7AA',
  },
  floatingInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.surface,
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
  },
  floatingTextInput: {
    flex: 1,
    fontFamily: AppFonts.inter.regular,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  floatingSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  floatingSendBtnDisabled: {
    backgroundColor: ThemeColors.border,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppStore } from '@/store';
import { ShowcaseProps } from '../../types';
import { useShowcaseTimer } from '../../hooks/useShowcaseTimer';
import { ShowcaseStageHeader } from './ShowcaseStageHeader';
import { VoiceRecognitionStage } from './stages/VoiceRecognitionStage';
import { SpeechToTextStage } from './stages/SpeechToTextStage';
import { ClickIndicationStage } from './stages/ClickIndicationStage';
import { AiParsingStage } from './stages/AiParsingStage';
import { ExpenseRecordedStage } from './stages/ExpenseRecordedStage';
import { BehavioralStoryStage } from './stages/BehavioralStoryStage';
import { HabitTasksStage } from './stages/HabitTasksStage';
import { MilestoneVaultStage } from './stages/MilestoneVaultStage';
import { SavingsGrowthChartStage } from './stages/SavingsGrowthChartStage';

export function VoiceShowcaseCard({ isParentActive = true }: ShowcaseProps) {
  const { currencySymbol = '₹' } = useAppStore();
  const {
    stage,
    wordStep,
    checksResolved,
    setIsStoryTypingDone,
    taskCompletedCount,
  } = useShowcaseTimer(isParentActive);

  return (
    <View style={styles.motionStageWrapper}>
      {/* Master 5-Phase Navigation Header */}
      <ShowcaseStageHeader stage={stage} />

      {/* Main Frameless Motion Canvas */}
      <View style={styles.motionCanvas}>
        {/* Phase 1: Voice Recognition & Expense Logging (Stages 0..4) */}
        {stage === 0 && <VoiceRecognitionStage />}
        {stage === 1 && (
          <SpeechToTextStage wordStep={wordStep} currencySymbol={currencySymbol} />
        )}
        {stage === 2 && (
          <ClickIndicationStage currencySymbol={currencySymbol} />
        )}
        {stage === 3 && (
          <AiParsingStage
            checksResolved={checksResolved}
            currencySymbol={currencySymbol}
          />
        )}
        {stage === 4 && <ExpenseRecordedStage currencySymbol={currencySymbol} />}

        {/* Phase 2: Behavioral Expense Story (Stage 5) */}
        {stage === 5 && (
          <BehavioralStoryStage
            currencySymbol={currencySymbol}
            isActive={stage === 5}
            onTypingDone={() => setIsStoryTypingDone(true)}
          />
        )}

        {/* Phase 3: Actionable Habit & Goal Tasks (Stage 6) */}
        {stage === 6 && (
          <HabitTasksStage
            taskCompletedCount={taskCompletedCount}
            currencySymbol={currencySymbol}
          />
        )}

        {/* Phase 4: Milestone Vault with Circular Progress (Stage 7) */}
        {stage === 7 && (
          <MilestoneVaultStage
            isActive={stage === 7}
            currencySymbol={currencySymbol}
          />
        )}

        {/* Phase 5: 6-Month Compounded Savings Area Chart (Stage 8) */}
        {stage === 8 && (
          <SavingsGrowthChartStage
            isActive={stage === 8}
            currencySymbol={currencySymbol}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  motionStageWrapper: {
    width: '100%',
    paddingVertical: 4,
  },
  motionCanvas: {
    width: '100%',
    minHeight: 154,
    justifyContent: 'center',
  },
});

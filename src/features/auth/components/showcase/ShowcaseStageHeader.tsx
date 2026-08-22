import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Mic, BookOpen, Target, TrendingUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ShowcaseStage } from '../../types';

interface ShowcaseStageHeaderProps {
  stage: ShowcaseStage;
}

export const ShowcaseStageHeader = memo(function ShowcaseStageHeader({
  stage,
}: ShowcaseStageHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stageHeaderRow}>
      <View style={styles.stageHeaderBadge}>
        {stage <= 4 && <Mic size={12} color="#EA580C" />}
        {stage === 5 && <BookOpen size={12} color="#EA580C" />}
        {stage === 6 && <Target size={12} color="#EA580C" />}
        {stage === 7 && <Target size={12} color="#EA580C" />}
        {stage === 8 && <TrendingUp size={12} color="#EA580C" />}

        <Text style={styles.stageHeaderBadgeText}>
          {stage === 0 && t('showcase.stage.voiceRecognition', '1. VOICE RECOGNITION')}
          {stage === 1 && t('showcase.stage.speechToText', '1. SPEECH-TO-TEXT')}
          {stage === 2 && t('showcase.stage.recordingCommand', '1. RECORDING COMMAND')}
          {stage === 3 && t('showcase.stage.aiParsing', '1. AI AUTO-PARSING')}
          {stage === 4 && t('showcase.stage.expenseRecorded', '1. EXPENSE RECORDED')}
          {stage === 5 && t('showcase.stage.behavioralStory', '2. BEHAVIORAL STORY')}
          {stage === 6 && t('showcase.stage.habitTasks', '3. HABIT TASKS')}
          {stage === 7 && t('showcase.stage.milestoneVault', '4. MILESTONE VAULT')}
          {stage === 8 && t('showcase.stage.growthChart', '5. 6-MONTH SAVINGS')}
        </Text>
      </View>

      {/* 5-Phase Step Indicator Dots */}
      <View style={styles.masterStepBar}>
        <View
          style={[
            styles.masterStepDot,
            stage <= 4 ? styles.masterStepDotActive : styles.masterStepDotInactive,
          ]}
        />
        <View
          style={[
            styles.masterStepDot,
            stage === 5 ? styles.masterStepDotActive : styles.masterStepDotInactive,
          ]}
        />
        <View
          style={[
            styles.masterStepDot,
            stage === 6 ? styles.masterStepDotActive : styles.masterStepDotInactive,
          ]}
        />
        <View
          style={[
            styles.masterStepDot,
            stage === 7 ? styles.masterStepDotActive : styles.masterStepDotInactive,
          ]}
        />
        <View
          style={[
            styles.masterStepDot,
            stage === 8 ? styles.masterStepDotActive : styles.masterStepDotInactive,
          ]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  stageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stageHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  stageHeaderBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#EA580C',
    letterSpacing: 0.8,
  },
  masterStepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  masterStepDot: {
    height: 4,
    borderRadius: 2,
  },
  masterStepDotActive: {
    width: 14,
    backgroundColor: '#FF6B00',
  },
  masterStepDotInactive: {
    width: 4,
    backgroundColor: '#E2E8F0',
  },
});

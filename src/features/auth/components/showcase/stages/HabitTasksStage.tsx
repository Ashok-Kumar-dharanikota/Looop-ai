import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { Coffee, TrendingUp, Shield, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { TaskItem } from '../atoms/TaskItem';

interface HabitTasksStageProps {
  taskCompletedCount: number;
  currencySymbol: string;
}

export function HabitTasksStage({
  taskCompletedCount,
  currencySymbol,
}: HabitTasksStageProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInDown.duration(380)}
      exiting={FadeOut.duration(260)}
      style={styles.tasksStage}
    >
      <View style={styles.tasksContainer}>
        <TaskItem
          icon={Coffee}
          title={t('showcase.tasks.task1Title', 'Brew office coffee 3x / week')}
          impact={t(
            'showcase.tasks.task1Impact',
            `Save ${currencySymbol}1,350 / week`,
            {
              currency: currencySymbol,
            }
          )}
          isDone={taskCompletedCount >= 1}
        />
        <TaskItem
          icon={TrendingUp}
          title={t(
            'showcase.tasks.task2Title',
            `Auto-sweep ${currencySymbol}500 to Vault`,
            {
              currency: currencySymbol,
            }
          )}
          impact={t('showcase.tasks.task2Impact', 'Emergency Fund goal')}
          isDone={taskCompletedCount >= 2}
        />
        <TaskItem
          icon={Shield}
          title={t(
            'showcase.tasks.task3Title',
            `Cap daily snack spend at ${currencySymbol}300`,
            {
              currency: currencySymbol,
            }
          )}
          impact={t('showcase.tasks.task3Impact', 'Safe Spend budget rule')}
          isDone={false}
        />
      </View>

      <View style={styles.captionSubRow}>
        <CheckCircle2 size={12} color="#EA580C" />
        <Text style={styles.captionSubText}>
          {taskCompletedCount >= 2
            ? t(
                'showcase.tasks.statusSaved',
                `✓ +${currencySymbol}1,850 saved! Boosting Milestone Vault →`,
                {
                  currency: currencySymbol,
                }
              )
            : t('showcase.tasks.statusPending', 'Automating mindful financial habits...')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tasksStage: {
    width: '100%',
  },
  tasksContainer: {
    gap: 6,
    marginBottom: 8,
  },
  captionSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 4,
  },
  captionSubText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#EA580C',
  },
});

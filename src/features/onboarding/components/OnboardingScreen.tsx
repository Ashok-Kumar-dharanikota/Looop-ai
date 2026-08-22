import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import { StoryAct2Questionnaire } from './StoryAct2Questionnaire';
import { StoryAct3Diagnosis } from './StoryAct3Diagnosis';
import { StoryAct4FirstHabit } from './StoryAct4FirstHabit';
import { StoryAct5Notifications } from './StoryAct5Notifications';
import { useOnboardingFlow } from '../hooks/useOnboardingFlow';

export function OnboardingScreen() {
  const {
    currentStage,
    answers,
    currencySymbol,
    handleCompleteQuestionnaire,
    handleProceedToFirstHabit,
    handleProceedToNotifications,
    handleFinishOnboarding,
  } = useOnboardingFlow();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {currentStage === 'questionnaire' && (
          <Animated.View
            key="stage_questionnaire"
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stageWrapper}
          >
            <StoryAct2Questionnaire
              currencySymbol={currencySymbol}
              onCompleteAssessment={handleCompleteQuestionnaire}
            />
          </Animated.View>
        )}

        {currentStage === 'diagnosis' && (
          <Animated.View
            key="stage_diagnosis"
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stageWrapper}
          >
            <StoryAct3Diagnosis
              currencySymbol={currencySymbol}
              answers={answers}
              onProceedToNext={handleProceedToFirstHabit}
            />
          </Animated.View>
        )}

        {currentStage === 'first_habit' && (
          <Animated.View
            key="stage_first_habit"
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stageWrapper}
          >
            <StoryAct4FirstHabit
              currencySymbol={currencySymbol}
              answers={answers}
              onProceedToNotifications={handleProceedToNotifications}
            />
          </Animated.View>
        )}

        {currentStage === 'notifications' && (
          <Animated.View
            key="stage_notifications"
            entering={FadeInRight.duration(260)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}
            style={styles.stageWrapper}
          >
            <StoryAct5Notifications
              onFinishOnboarding={handleFinishOnboarding}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
  },
  stageWrapper: {
    flex: 1,
  },
});

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { TaskItemProps } from '../../../types';

export function TaskItem({
  icon: IconComponent,
  title,
  impact,
  isDone,
}: TaskItemProps) {
  const checkScale = useSharedValue(isDone ? 1 : 0.85);

  useEffect(() => {
    if (isDone) {
      checkScale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 220 }),
        withSpring(1.0, { damping: 14, stiffness: 180 })
      );
    }
  }, [isDone]);

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <View style={[styles.taskItemCard, isDone && styles.taskItemCardDone]}>
      <View style={styles.taskIconOrb}>
        <IconComponent size={14} color="#EA580C" />
      </View>

      <View style={styles.taskTextCol}>
        <Text style={[styles.taskTitleText, isDone && styles.taskTitleTextDone]}>
          {title}
        </Text>
        <Text style={styles.taskImpactText}>{impact}</Text>
      </View>

      <Animated.View
        style={[
          styles.taskCheckBadge,
          isDone ? styles.taskCheckBadgeDone : styles.taskCheckBadgePending,
          animatedCheckStyle,
        ]}
      >
        {isDone ? (
          <Check size={11} color="#FFFFFF" strokeWidth={3} />
        ) : (
          <Text style={styles.taskPendingText}>ACTIVE</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  taskItemCardDone: {
    borderColor: '#FFEDD5',
    backgroundColor: '#FFFCF8',
  },
  taskIconOrb: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  taskTextCol: {
    flex: 1,
    marginRight: 8,
  },
  taskTitleText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12.5,
    color: '#0F172A',
  },
  taskTitleTextDone: {
    color: '#0F172A',
  },
  taskImpactText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  taskCheckBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckBadgeDone: {
    backgroundColor: '#FF6B00',
    width: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  taskCheckBadgePending: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskPendingText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 8.5,
    color: '#64748B',
    letterSpacing: 0.5,
  },
});

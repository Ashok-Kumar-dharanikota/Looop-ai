import React from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddExpenseTab } from '@/components/tabs/AddExpenseTab';

export default function AddExpenseScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? '#09090B' : '#FAFAFC';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AddExpenseTab />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionsTab } from '@/components/tabs/TransactionsTab';

export default function TransactionsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  // Applying the requested vibrant theme changes later, for now just fixing layout
  const bg = isDark ? '#111218' : '#FAFAFC'; 

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TransactionsTab />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: 12,
    paddingBottom: 24,
  },
});

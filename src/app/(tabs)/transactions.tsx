import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TransactionsTab } from '@/components/tabs/TransactionsTab';
import { ThemeColors } from '@/constants/theme';

export default function TransactionsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <TransactionsTab />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.canvas,
  },
  container: {
    flex: 1,
    backgroundColor: ThemeColors.canvas,
  },
});


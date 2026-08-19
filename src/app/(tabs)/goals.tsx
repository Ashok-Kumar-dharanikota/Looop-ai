import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GoalsTab } from '@/components/tabs/GoalsTab';

export default function GoalsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <GoalsTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
});

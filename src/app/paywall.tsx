import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Paywall Screen (Temporarily hidden).
 * Redirects directly to the main dashboard.
 */
export default function PaywallScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)' as any);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

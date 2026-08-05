import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const textColor = isDark ? '#FFF' : '#000';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#0A0A0F' : '#FAF9F5' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.bodyText, { color: isDark ? '#9CA3AF' : '#4B5563' }]}>
          Your privacy is important to us. Savio encrypts your data and never sells your financial information...
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 16 },
  backText: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '700' },
  content: { padding: 20 },
  bodyText: { fontSize: 15, lineHeight: 24 },
});

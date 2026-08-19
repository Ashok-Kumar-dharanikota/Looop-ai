import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <ShieldCheck size={13} color="#7C3AED" />
          <Text style={styles.badgeText}>LOCAL-FIRST ARCHITECTURE</Text>
        </View>

        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>
          Last updated: August 19, 2026 • Effective immediately
        </Text>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Our Commitment to Your Privacy</Text>
            <Text style={styles.paragraph}>
              At Looop, we believe personal finance is deeply intimate. Unlike traditional budgeting apps that monetize your transaction history by selling data to third parties, Looop is engineered with a strict local-first philosophy. Your financial stories, expenses, and habits belong exclusively to you.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Data We Process & How It Stays Local</Text>
            <Text style={styles.paragraph}>
              All financial data—including transactions, category breakdowns, savings vaults, and personalized habit challenges—is stored locally on your device in an encrypted SQLite database.
            </Text>
            <View style={styles.highlightBox}>
              <Lock size={18} color="#7C3AED" />
              <Text style={styles.highlightBoxText}>
                Your raw transaction amounts, bank sync records, and habit notes never leave your device without your explicit, authenticated consent.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Voice Logging & Audio Memos</Text>
            <Text style={styles.paragraph}>
              When you use our conversational Voice Logger, your speech is processed directly with on-device speech-to-text parsers to extract amounts, categories, and payment methods. We do not record, store, or archive your ambient voice audio on remote servers.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. AI Diagnosis & Insights</Text>
            <Text style={styles.paragraph}>
              Looop generates weekly behavioral essays (such as spending leak diagnoses and savings impact projections) using secure Firebase AI with zero-retention private inference. Your data is never used to train public machine learning models.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Third-Party Integrations & Telemetry</Text>
            <Text style={styles.paragraph}>
              We do not integrate third-party advertising trackers or cross-app brokers. Any telemetry collected is strictly limited to aggregate crash diagnostics and is stripped of any identifying financial information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Your Rights & Instant Data Deletion</Text>
            <Text style={styles.paragraph}>
              You retain complete sovereignty over your data. You may export your entire transaction history to CSV at any time from your Profile tab, or erase all local databases with a single tap under App Settings.
            </Text>
          </View>

          <View style={[styles.section, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.sectionTitle}>7. Contact Our Privacy Team</Text>
            <Text style={styles.paragraph}>
              If you have questions regarding this Privacy Policy or our security infrastructure, please contact us at privacy@looop.app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#7C3AED',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    fontWeight: '400',
  },
  highlightBox: {
    marginTop: 10,
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  highlightBoxText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: '#581C87',
  },
});

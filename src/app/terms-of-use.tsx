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
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function TermsOfUseScreen() {
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
        <Text style={styles.headerBarTitle}>Terms of Use</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <FileText size={13} color="#7C3AED" />
          <Text style={styles.badgeText}>USER AGREEMENT</Text>
        </View>

        <Text style={styles.title}>Terms of Use</Text>
        <Text style={styles.subtitle}>
          Last updated: August 19, 2026 • Please read carefully
        </Text>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
            <Text style={styles.paragraph}>
              By downloading, accessing, or using Looop (“the App”, “we”, “our”), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of the Service</Text>
            <Text style={styles.paragraph}>
              Looop is a personal finance companion and behavioral habit assistant designed to help users track expenses, understand spending patterns through AI-generated editorial essays, and organize milestone savings targets.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Not Financial, Investment, or Legal Advice</Text>
            <View style={styles.warningBox}>
              <AlertCircle size={18} color="#7C3AED" />
              <Text style={styles.warningBoxText}>
                Looop is an informational self-help tool. It does not provide certified financial planning, tax advice, investment brokering, or legal counsel. All calculations and savings projections are for illustrative and motivational purposes only.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Subscriptions, Free Trials & Billing</Text>
            <Text style={styles.paragraph}>
              Certain premium features (such as advanced area analytics, unlimited voice logging, biometric lock, and custom AI story generation) are available through Looop Pro. If you enroll in a free trial, your subscription will automatically renew at the specified interval unless cancelled at least 24 hours prior to the trial conclusion through your Google Play or Apple App Store account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. User Account & Local Data Security</Text>
            <Text style={styles.paragraph}>
              You are responsible for safeguarding your device and any biometric authentication (Fingerprint / Passcode) used to lock the application. Looop is not liable for unauthorized access resulting from lost or compromised personal hardware.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Intellectual Property Rights</Text>
            <Text style={styles.paragraph}>
              All visual assets, typography implementations, design tokens, trademarks, logos, algorithms, and editorial formats within Looop are the proprietary intellectual property of Cornerstone Studio and are protected by applicable copyright and trademark laws.
            </Text>
          </View>

          <View style={[styles.section, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.sectionTitle}>7. Contact Us</Text>
            <Text style={styles.paragraph}>
              For legal inquiries, terms clarification, or support requests, please reach out to our team at ashok.d.paul@gmail.com.
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
  warningBox: {
    marginTop: 8,
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  warningBoxText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: '#581C87',
  },
});

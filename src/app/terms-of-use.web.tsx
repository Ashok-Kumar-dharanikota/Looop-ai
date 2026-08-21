import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react-native';
import { WebHeader } from '@/components/web/WebHeader';
import { WebFooter } from '@/components/web/WebFooter';
import { PlayfulColors, PlayfulTypography } from '@/constants/playful-tokens';

export default function TermsOfUseWebScreen() {
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    router.push('/' as any);
  };

  return (
    <div style={pageContainerStyle as any}>
      <WebHeader />

      <main style={mainContentStyle as any}>
        <div style={innerContainerStyle as any}>
          {/* Back button & Breadcrumb */}
          <div style={topNavRowStyle as any}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backBtn}
              activeOpacity={0.8}
            >
              <ArrowLeft size={18} color={PlayfulColors.inkBlack} />
              <span style={styles.backBtnText}>Back to Home</span>
            </TouchableOpacity>
          </div>

          {/* Header Banner */}
          <div style={headerBannerStyle as any}>
            <div style={styles.badge}>
              <FileText size={13} color={PlayfulColors.hotMagenta} />
              <span style={styles.badgeText}>USER AGREEMENT</span>
            </div>
            <h1 style={styles.title}>Terms of Use</h1>
            <p style={styles.subtitle}>
              Last updated: August 19, 2026 • Please review these terms carefully before using Looop.
            </p>
          </div>

          {/* Legal Document Card */}
          <div style={cardStyle as any}>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>1. Agreement to Terms</h2>
              <p style={styles.paragraph}>
                By downloading, accessing, or using Looop (“the App”, “we”, “our”), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use the application.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>2. Description of the Service</h2>
              <p style={styles.paragraph}>
                Looop is a personal finance companion and behavioral habit assistant designed to help users track expenses, understand spending patterns through AI-generated editorial essays, and organize milestone savings targets.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>3. Not Financial, Investment, or Legal Advice</h2>
              <div style={warningBoxStyle as any}>
                <AlertCircle size={20} color={PlayfulColors.hotMagenta} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={styles.warningBoxText}>
                  Looop is an informational self-help tool. It does not provide certified financial planning, tax advice, investment brokering, or legal counsel. All calculations and savings projections are for illustrative and motivational purposes only.
                </p>
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>4. Subscriptions, Free Trials & Billing</h2>
              <p style={styles.paragraph}>
                Certain premium features (such as advanced area analytics, unlimited voice logging, biometric lock, and custom AI story generation) are available through Looop Pro. If you enroll in a free trial, your subscription will automatically renew at the specified interval unless cancelled at least 24 hours prior to the trial conclusion through your Google Play or Apple App Store account.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>5. User Account & Local Data Security</h2>
              <p style={styles.paragraph}>
                You are responsible for safeguarding your device and any biometric authentication (Fingerprint / Passcode) used to lock the application. Looop is not liable for unauthorized access resulting from lost or compromised personal hardware.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>6. Intellectual Property Rights</h2>
              <p style={styles.paragraph}>
                All visual assets, typography implementations, design tokens, trademarks, logos, algorithms, and editorial formats within Looop are the proprietary intellectual property of Cornerstone Studio and are protected by applicable copyright and trademark laws.
              </p>
            </section>

            <section style={{ ...styles.section, borderBottom: 'none', paddingBottom: 0 }}>
              <h2 style={styles.sectionTitle}>7. Contact Us</h2>
              <p style={styles.paragraph}>
                For legal inquiries, terms clarification, or support requests, please reach out to our team at{' '}
                <a href="mailto:ashok.d.paul@gmail.com" style={{ color: PlayfulColors.hotMagenta, fontWeight: '600', textDecoration: 'underline' }}>
                  ashok.d.paul@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <WebFooter />
    </div>
  );
}

const pageContainerStyle = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const mainContentStyle = {
  width: '100%',
  padding: '40px 24px 80px 24px',
};

const innerContainerStyle = {
  maxWidth: '860px',
  margin: '0 auto',
  width: '100%',
};

const topNavRowStyle = {
  marginBottom: '24px',
};

const headerBannerStyle = {
  marginBottom: '32px',
};

const cardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '32px',
  padding: '44px',
  border: `1px solid ${PlayfulColors.warmMist}`,
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
};

const warningBoxStyle = {
  marginTop: '12px',
  backgroundColor: '#FFF5F9',
  borderRadius: '16px',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '12px',
  border: '1px solid #FFE0EC',
};

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: PlayfulColors.warmMist,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: PlayfulColors.inkBlack,
    fontFamily: PlayfulTypography.fontFamily,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE0EC',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: PlayfulColors.hotMagenta,
    fontFamily: PlayfulTypography.fontFamily,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: PlayfulColors.inkBlack,
    fontStyle: 'italic',
    letterSpacing: -0.8,
    fontFamily: PlayfulTypography.fontFamily,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: PlayfulColors.charcoal,
    fontFamily: PlayfulTypography.fontFamily,
    lineHeight: 22,
  },
  section: {
    paddingBottom: 28,
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: PlayfulColors.warmMist,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PlayfulColors.inkBlack,
    fontFamily: PlayfulTypography.fontFamily,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 25,
    color: PlayfulColors.charcoal,
    fontFamily: PlayfulTypography.fontFamily,
  },
  warningBoxText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#9F1239',
    fontFamily: PlayfulTypography.fontFamily,
  },
});

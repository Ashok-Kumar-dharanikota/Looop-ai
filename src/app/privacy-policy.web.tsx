import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react-native';
import { WebHeader } from '@/components/web/WebHeader';
import { WebFooter } from '@/components/web/WebFooter';
import { PlayfulColors, PlayfulTypography } from '@/constants/playful-tokens';

export default function PrivacyPolicyWebScreen() {
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
              <ShieldCheck size={13} color={PlayfulColors.hotMagenta} />
              <span style={styles.badgeText}>LOCAL-FIRST ARCHITECTURE</span>
            </div>
            <h1 style={styles.title}>Privacy Policy</h1>
            <p style={styles.subtitle}>
              Last updated: August 19, 2026 • Your financial data belongs exclusively to you.
            </p>
          </div>

          {/* Legal Document Card */}
          <div style={cardStyle as any}>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>1. Our Commitment to Your Privacy</h2>
              <p style={styles.paragraph}>
                At Looop, we believe personal finance is deeply intimate. Unlike traditional budgeting apps that monetize your transaction history by selling data to third parties, Looop is engineered with a strict local-first philosophy. Your financial stories, expenses, and habits belong exclusively to you.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>2. Data We Process & How It Stays Local</h2>
              <p style={styles.paragraph}>
                All financial data—including transactions, category breakdowns, savings vaults, and personalized habit challenges—is stored locally on your device in an encrypted SQLite database.
              </p>
              <div style={highlightBoxStyle as any}>
                <Lock size={20} color={PlayfulColors.hotMagenta} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={styles.highlightBoxText}>
                  Your raw transaction amounts, bank sync records, and habit notes never leave your device without your explicit, authenticated consent.
                </p>
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>3. Voice Logging & Audio Memos</h2>
              <p style={styles.paragraph}>
                When you use our conversational Voice Logger, your speech is processed directly with on-device speech-to-text parsers to extract amounts, categories, and payment methods. We do not record, store, or archive your ambient voice audio on remote servers.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>4. AI Diagnosis & Insights</h2>
              <p style={styles.paragraph}>
                Looop generates weekly behavioral essays (such as spending leak diagnoses and savings impact projections) using secure Firebase AI with zero-retention private inference. Your data is never used to train public machine learning models.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>5. Third-Party Integrations & Telemetry</h2>
              <p style={styles.paragraph}>
                We do not integrate third-party advertising trackers or cross-app brokers. Any telemetry collected is strictly limited to aggregate crash diagnostics and is stripped of any identifying financial information.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>6. Your Rights & Instant Data Deletion</h2>
              <p style={styles.paragraph}>
                You retain complete sovereignty over your data. You may export your entire transaction history to CSV at any time from your Profile tab, or erase all local databases with a single tap under App Settings.
              </p>
            </section>

            <section style={{ ...styles.section, borderBottom: 'none', paddingBottom: 0 }}>
              <h2 style={styles.sectionTitle}>7. Contact Our Privacy Team</h2>
              <p style={styles.paragraph}>
                If you have questions regarding this Privacy Policy, your data sovereignty, or our security infrastructure, please contact us directly at{' '}
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

const highlightBoxStyle = {
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
  highlightBoxText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#9F1239',
    fontFamily: PlayfulTypography.fontFamily,
  },
});

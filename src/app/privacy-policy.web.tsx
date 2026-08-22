import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react-native';
import { WebHeader } from '@/components/web/WebHeader';
import { WebFooter } from '@/components/web/WebFooter';
import { WebColors, WebShadows, WebTypography } from '@/constants/web-tokens';

export default function PrivacyPolicyWebScreen() {
  const router = useRouter();

  useEffect(() => {
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
            <button
              type="button"
              onClick={handleBack}
              style={backBtnStyle as any}
            >
              <ArrowLeft size={16} color={WebColors.inkSlate} />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Header Banner */}
          <div style={headerBannerStyle as any}>
            <div style={badgeStyle as any}>
              <ShieldCheck size={13} color={WebColors.primaryOrange} />
              <span style={badgeTextStyle as any}>LOCAL-FIRST ARCHITECTURE</span>
            </div>
            <h1 style={titleStyle as any}>Privacy Policy</h1>
            <p style={subtitleStyle as any}>
              Last updated: August 2026 • Your financial data belongs exclusively to you.
            </p>
          </div>

          {/* Legal Document Card */}
          <div style={cardStyle as any}>
            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>1. Our Commitment to Your Privacy</h2>
              <p style={paragraphStyle as any}>
                At Looop, we believe personal finance is deeply intimate. Unlike traditional budgeting apps that monetize your transaction history by selling data to third parties, Looop is engineered with a strict local-first philosophy. Your financial stories, expenses, and habits belong exclusively to you.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>2. Data We Process & How It Stays Local</h2>
              <p style={paragraphStyle as any}>
                All financial data—including transactions, category breakdowns, savings vaults, and personalized habit challenges—is stored locally on your device in an encrypted SQLite database.
              </p>
              <div style={highlightBoxStyle as any}>
                <Lock size={18} color={WebColors.primaryOrange} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={highlightBoxTextStyle as any}>
                  Your raw transaction amounts, bank sync records, and habit notes never leave your device without your explicit, authenticated consent.
                </p>
              </div>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>3. Voice Logging & Audio Memos</h2>
              <p style={paragraphStyle as any}>
                When you use our conversational Voice Logger, your speech is processed directly with on-device speech-to-text parsers to extract amounts, categories, and payment methods. We do not record, store, or archive your ambient voice audio on remote servers.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>4. AI Diagnosis & Insights</h2>
              <p style={paragraphStyle as any}>
                Looop generates weekly behavioral essays (such as spending leak diagnoses and savings impact projections) using secure Firebase AI with zero-retention private inference. Your data is never used to train public machine learning models.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>5. Third-Party Integrations & Telemetry</h2>
              <p style={paragraphStyle as any}>
                We do not integrate third-party advertising trackers or cross-app data brokers. Any telemetry collected is strictly limited to aggregate crash diagnostics and is stripped of any identifying financial information.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>6. Your Rights & Instant Data Deletion</h2>
              <p style={paragraphStyle as any}>
                You retain complete sovereignty over your data. You may export your entire transaction history to CSV at any time from your Profile tab, or erase all local databases with a single tap under App Settings.
              </p>
            </section>

            <section style={{ ...sectionStyle, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 } as any}>
              <h2 style={sectionTitleStyle as any}>7. Contact Our Privacy Team</h2>
              <p style={paragraphStyle as any}>
                If you have questions regarding this Privacy Policy, your data sovereignty, or our security infrastructure, please contact us directly at{' '}
                <a href="mailto:ashok.d.paul@gmail.com" style={{ color: WebColors.primaryOrange, fontWeight: '600', textDecoration: 'underline' }}>
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
  backgroundColor: WebColors.canvas,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const mainContentStyle = {
  width: '100%',
  padding: '40px 24px 80px 24px',
};

const innerContainerStyle = {
  maxWidth: '820px',
  margin: '0 auto',
  width: '100%',
};

const topNavRowStyle = {
  marginBottom: '24px',
};

const backBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: WebColors.cardWhite,
  padding: '8px 16px',
  borderRadius: '999px',
  border: `1.2px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.cardRest,
  color: WebColors.inkSlate,
  fontSize: '13.5px',
  fontWeight: '600',
  fontFamily: WebTypography.bodyFont,
  cursor: 'pointer',
  transition: 'transform 0.15s ease',
};

const headerBannerStyle = {
  marginBottom: '32px',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '5px 12px',
  borderRadius: '999px',
  marginBottom: '12px',
};

const badgeTextStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const titleStyle = {
  fontSize: 'clamp(28px, 4vw, 38px)',
  fontWeight: 800,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.03em',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
};

const subtitleStyle = {
  fontSize: '14.5px',
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  lineHeight: '1.5',
  margin: 0,
};

const cardStyle = {
  backgroundColor: WebColors.cardWhite,
  borderRadius: '24px',
  padding: '36px 32px',
  border: `1.2px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.cardRest,
};

const sectionStyle = {
  paddingBottom: '24px',
  marginBottom: '24px',
  borderBottom: `1px solid ${WebColors.borderHairline}`,
};

const sectionTitleStyle = {
  fontSize: '17px',
  fontWeight: '700',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.2px',
  margin: '0 0 10px 0',
  lineHeight: '1.3',
};

const paragraphStyle = {
  fontSize: '14.5px',
  lineHeight: '1.65',
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};

const highlightBoxStyle = {
  marginTop: '12px',
  backgroundColor: WebColors.creamSoft,
  borderRadius: '14px',
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  border: `1px solid ${WebColors.creamBorder}`,
};

const highlightBoxTextStyle = {
  fontSize: '13.5px',
  lineHeight: '1.55',
  fontWeight: '500',
  color: WebColors.deepOrange,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};

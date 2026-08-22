import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react-native';
import { WebHeader } from '@/components/web/WebHeader';
import { WebFooter } from '@/components/web/WebFooter';
import { WebColors, WebShadows, WebTypography } from '@/constants/web-tokens';

export default function TermsOfUseWebScreen() {
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
              <FileText size={13} color={WebColors.primaryOrange} />
              <span style={badgeTextStyle as any}>USER AGREEMENT</span>
            </div>
            <h1 style={titleStyle as any}>Terms of Use</h1>
            <p style={subtitleStyle as any}>
              Last updated: August 2026 • Please review these terms carefully before using Looop.
            </p>
          </div>

          {/* Legal Document Card */}
          <div style={cardStyle as any}>
            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>1. Agreement to Terms</h2>
              <p style={paragraphStyle as any}>
                By downloading, accessing, or using Looop (“the App”, “we”, “our”), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use the application.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>2. Description of the Service</h2>
              <p style={paragraphStyle as any}>
                Looop is a personal finance companion and behavioral habit assistant designed to help users track expenses, understand spending patterns through AI-generated editorial essays, and organize milestone savings targets.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>3. Not Financial, Investment, or Legal Advice</h2>
              <div style={warningBoxStyle as any}>
                <AlertCircle size={18} color={WebColors.primaryOrange} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={warningBoxTextStyle as any}>
                  Looop is an informational self-help tool. It does not provide certified financial planning, tax advice, investment brokering, or legal counsel. All calculations and savings projections are for illustrative and motivational purposes only.
                </p>
              </div>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>4. Subscriptions, Free Trials & Billing</h2>
              <p style={paragraphStyle as any}>
                Certain premium features (such as advanced area analytics, unlimited voice logging, biometric lock, and custom AI story generation) are available through Looop Pro. If you enroll in a free trial, your subscription will automatically renew at the specified interval unless cancelled at least 24 hours prior to the trial conclusion through your Google Play or Apple App Store account.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>5. User Account & Local Data Security</h2>
              <p style={paragraphStyle as any}>
                You are responsible for safeguarding your device and any biometric authentication (Fingerprint / Passcode) used to lock the application. Looop is not liable for unauthorized access resulting from lost or compromised personal hardware.
              </p>
            </section>

            <section style={sectionStyle as any}>
              <h2 style={sectionTitleStyle as any}>6. Intellectual Property Rights</h2>
              <p style={paragraphStyle as any}>
                All visual assets, typography implementations, design tokens, trademarks, logos, algorithms, and editorial formats within Looop are the proprietary intellectual property of Cornerstone Studio and are protected by applicable copyright and trademark laws.
              </p>
            </section>

            <section style={{ ...sectionStyle, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 } as any}>
              <h2 style={sectionTitleStyle as any}>7. Contact Us</h2>
              <p style={paragraphStyle as any}>
                For legal inquiries, terms clarification, or support requests, please reach out to our team at{' '}
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

const warningBoxStyle = {
  marginTop: '12px',
  backgroundColor: WebColors.creamSoft,
  borderRadius: '14px',
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  border: `1px solid ${WebColors.creamBorder}`,
};

const warningBoxTextStyle = {
  fontSize: '13.5px',
  lineHeight: '1.55',
  fontWeight: '500',
  color: WebColors.deepOrange,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};

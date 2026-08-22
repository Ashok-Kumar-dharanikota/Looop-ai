import React from 'react';
import { useRouter } from 'expo-router';
import { Sparkles, ShieldCheck } from 'lucide-react-native';
import { WebColors, WebTypography } from '@/constants/web-tokens';

export const WebFooter: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    router.push(path as any);
  };

  const handleNavClick = (anchorId: string) => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
  };

  return (
    <footer style={footerWrapperStyle as any}>
      <div style={footerContainerStyle as any}>
        {/* Top Row: Wordmark & Navigation */}
        <div style={footerTopRowStyle as any}>
          {/* Brand Column */}
          <div style={brandColStyle as any}>
            <div style={brandRowStyle as any}>
              <span style={logoTextStyle as any}>Looop</span>
              <div style={sparkleBadgeStyle as any}>
                <Sparkles size={13} color={WebColors.primaryOrange} />
              </div>
            </div>
            <p style={taglineStyle as any}>
              A private, local-first personal finance companion that transforms daily cashflow into lasting wealth and mindful habits.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div style={linksGroupStyle as any}>
            <div style={linkColStyle as any}>
              <span style={linkHeaderStyle as any}>PRODUCT</span>
              <span onClick={() => handleNavClick('features')} style={linkItemStyle as any}>Features</span>
              <span onClick={() => handleNavClick('impact')} style={linkItemStyle as any}>3D Impact</span>
              <span onClick={() => handleNavClick('features')} style={linkItemStyle as any}>Habit Stories</span>
              <span onClick={() => handleNavClick('faq')} style={linkItemStyle as any}>FAQ</span>
            </div>

            <div style={linkColStyle as any}>
              <span style={linkHeaderStyle as any}>LEGAL & SECURITY</span>
              <span
                onClick={() => handleNavigate('/privacy-policy')}
                style={linkItemStyle as any}
              >
                Privacy Policy
              </span>
              <span
                onClick={() => handleNavigate('/terms-of-use')}
                style={linkItemStyle as any}
              >
                Terms of Use
              </span>
              <span
                onClick={() => handleNavigate('/paywall')}
                style={linkItemStyle as any}
              >
                Pro Membership
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={dividerStyle as any} />

        {/* Bottom Row */}
        <div style={footerBottomRowStyle as any}>
          <span style={copyrightTextStyle as any}>
            © {new Date().getFullYear()} Looop. All rights reserved. 100% Encrypted on-device storage.
          </span>
          <div style={securityBadgeRowStyle as any}>
            <ShieldCheck size={14} color={WebColors.emerald} />
            <span style={securityBadgeTextStyle as any}>Zero Bank Scraping • Biometric Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerWrapperStyle = {
  width: '100%',
  backgroundColor: WebColors.canvas,
  borderTop: `1px solid ${WebColors.borderCard}`,
  padding: '64px 0 40px 0',
};

const footerContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
};

const footerTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '40px',
  marginBottom: '48px',
};

const brandColStyle = {
  maxWidth: '380px',
};

const brandRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '14px',
};

const logoTextStyle = {
  fontSize: '24px',
  fontFamily: 'Outfit_700Bold',
  fontWeight: '800',
  color: WebColors.inkSlate,
  letterSpacing: '-0.6px',
};

const sparkleBadgeStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '12px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const taglineStyle = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};

const linksGroupStyle = {
  display: 'flex',
  gap: '64px',
  flexWrap: 'wrap',
};

const linkColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const linkHeaderStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '1px',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  marginBottom: '4px',
};

const linkItemStyle = {
  fontSize: '14px',
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  cursor: 'pointer',
  transition: 'color 0.15s ease',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: WebColors.borderCard,
  width: '100%',
  marginBottom: '28px',
};

const footerBottomRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
};

const copyrightTextStyle = {
  fontSize: '13px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const securityBadgeRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const securityBadgeTextStyle = {
  fontSize: '12.5px',
  fontWeight: '600',
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
};

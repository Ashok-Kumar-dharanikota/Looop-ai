import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PlayfulColors, PlayfulTypography } from '@/constants/playful-tokens';

export const WebFooter: React.FC = () => {
  const router = useRouter();

  return (
    <footer style={footerWrapperStyle as any}>
      <div style={footerContainerStyle as any}>
        {/* Top Row: Wordmark & Navigation */}
        <div style={footerTopRowStyle as any}>
          <div style={brandColStyle as any}>
            <div style={logoRowStyle as any}>
              <div style={logoIconStyle as any}>
                <div style={logoInnerDotStyle as any} />
              </div>
              <span style={logoTextStyle as any}>looop</span>
            </div>
            <p style={taglineStyle as any}>
              The AI Financial Biographer that helps you spend smarter and fund your dreams.
            </p>
          </div>

          <div style={linksGroupStyle as any}>
            <div style={linkColStyle as any}>
              <span style={linkHeaderStyle as any}>PRODUCT</span>
              <a href="#features" style={linkItemStyle as any}>Features</a>
              <a href="#impact" style={linkItemStyle as any}>3D Impact</a>
              <a href="#essays" style={linkItemStyle as any}>Stories</a>
              <a href="#faq" style={linkItemStyle as any}>FAQ</a>
            </div>

            <div style={linkColStyle as any}>
              <span style={linkHeaderStyle as any}>LEGAL</span>
              <span
                onClick={() => router.push('/privacy-policy' as any)}
                style={{ ...linkItemStyle, cursor: 'pointer' } as any}
              >
                Privacy Policy
              </span>
              <span
                onClick={() => router.push('/terms-of-use' as any)}
                style={{ ...linkItemStyle, cursor: 'pointer' } as any}
              >
                Terms of Use
              </span>
              <span
                onClick={() => router.push('/paywall' as any)}
                style={{ ...linkItemStyle, cursor: 'pointer' } as any}
              >
                Pricing & Pro
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={dividerStyle as any} />

        {/* Bottom Row */}
        <div style={footerBottomRowStyle as any}>
          <span style={copyrightTextStyle as any}>
            © {new Date().getFullYear()} Looop Inc. All rights reserved. Encrypted local-first storage.
          </span>
          <div style={socialRowStyle as any}>
            <span style={copyrightTextStyle as any}>Crafted with warm paper aesthetics.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerWrapperStyle = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  borderTop: `1px solid ${PlayfulColors.warmMist}`,
  padding: '64px 0 40px 0',
};

const footerContainerStyle = {
  maxWidth: 1200,
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
  maxWidth: '360px',
};

const logoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '14px',
};

const logoIconStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  backgroundColor: PlayfulColors.inkBlack,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoInnerDotStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '6px',
  border: `2.5px solid ${PlayfulColors.hotMagenta}`,
};

const logoTextStyle = {
  fontSize: '24px',
  fontWeight: 800,
  fontStyle: 'italic',
  color: PlayfulColors.hotMagenta,
  fontFamily: PlayfulTypography.fontFamily,
  letterSpacing: '-0.5px',
};

const taglineStyle = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  margin: 0,
};

const linksGroupStyle = {
  display: 'flex',
  gap: '64px',
};

const linkColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const linkHeaderStyle = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1px',
  color: PlayfulColors.charcoal,
  fontFamily: PlayfulTypography.fontFamily,
  marginBottom: '4px',
};

const linkItemStyle = {
  fontSize: '14px',
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: PlayfulColors.warmMist,
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
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const socialRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

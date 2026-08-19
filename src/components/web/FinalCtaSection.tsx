import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react-native';
import { PlayfulColors, PlayfulTypography, PlayfulShadows, PlayfulRadii } from '@/constants/playful-tokens';

interface FinalCtaSectionProps {
  onJoinWaitlist?: (email: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onJoinWaitlist }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
    if (onJoinWaitlist) onJoinWaitlist(email);
  };

  return (
    <section style={finalSectionStyle as any}>
      <div style={containerStyle as any}>
        {/* App Icon Mark: Dark rounded square container with Hot Magenta pictogram */}
        <div style={appIconContainerStyle as any}>
          <div style={appIconInnerDotStyle as any} />
        </div>

        {/* Display Headline */}
        <h2 style={displayHeadlineStyle as any}>
          Start building wealth<br />
          <span style={{ color: PlayfulColors.hotMagenta }}>
            without changing who you are.
          </span>
        </h2>

        <p style={subheadStyle as any}>
          Join thousands of smart savers who turned everyday habit loops into fully funded dreams.
        </p>

        {/* Composite Email + Pill CTA */}
        <div style={compositeWrapperStyle as any}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} style={formStyle as any}>
              <div style={inputCardPillStyle as any}>
                <input
                  type="email"
                  placeholder="Enter your email to get started..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle as any}
                  required
                />
                <button type="submit" style={buttonStyle as any}>
                  <span>Get Early Access</span>
                  <ArrowRight size={16} color="#FFFFFF" />
                </button>
              </div>
            </form>
          ) : (
            <div style={successPillStyle as any}>
              <CheckCircle2 size={20} color={PlayfulColors.hotMagenta} />
              <span style={successTextStyle as any}>
                Welcome to Looop! You’ll receive early access credentials soon.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const finalSectionStyle = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  padding: '113px 24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
};

const containerStyle = {
  maxWidth: 820,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const appIconContainerStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '20px',
  backgroundColor: PlayfulColors.inkBlack,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '32px',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
};

const appIconInnerDotStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '12px',
  borderWidth: '4px',
  borderColor: PlayfulColors.hotMagenta,
  borderStyle: 'solid',
};

const displayHeadlineStyle = {
  fontSize: Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth < 768 ? '36px' : '56px',
  lineHeight: 1.05,
  fontWeight: 900,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 20px 0',
  letterSpacing: '-0.5px',
};

const subheadStyle = {
  fontSize: '17px',
  lineHeight: 1.6,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  maxWidth: '560px',
  margin: '0 0 36px 0',
};

const compositeWrapperStyle = {
  width: '100%',
  maxWidth: '520px',
};

const formStyle = {
  width: '100%',
};

const inputCardPillStyle = {
  backgroundColor: PlayfulColors.paperWhite,
  borderRadius: '99px',
  padding: '6px',
  paddingLeft: '22px',
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${PlayfulColors.sand}`,
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
};

const inputStyle = {
  flex: 1,
  height: '48px',
  fontSize: '16px',
  color: PlayfulColors.softInk,
  fontFamily: PlayfulTypography.fontFamily,
  outline: 'none',
  border: 'none',
  backgroundColor: 'transparent',
};

const buttonStyle = {
  backgroundColor: PlayfulColors.hotMagenta,
  color: '#FFFFFF',
  padding: '0 26px',
  height: '48px',
  borderRadius: '99px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: PlayfulTypography.fontFamily,
  cursor: 'pointer',
  letterSpacing: '-0.2px',
};

const successPillStyle = {
  backgroundColor: PlayfulColors.paperWhite,
  borderRadius: '99px',
  padding: '16px 28px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  border: `1px solid ${PlayfulColors.warmMist}`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
};

const successTextStyle = {
  color: PlayfulColors.softInk,
  fontSize: '15px',
  fontWeight: 600,
  fontFamily: PlayfulTypography.fontFamily,
};

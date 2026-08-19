import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react-native';
import { PlayfulColors, PlayfulTypography, PlayfulShadows } from '@/constants/playful-tokens';

interface LandingHeroProps {
  onJoinWaitlist?: (email: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onJoinWaitlist }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
    if (onJoinWaitlist) onJoinWaitlist(email);
  };

  return (
    <section style={heroSectionStyle as any} id="waitlist">
      <View style={styles.heroContainer}>
        {/* Editorial Subhead / Kicker Tag */}
        <View style={styles.kickerBadge}>
          <Sparkles size={13} color={PlayfulColors.hotMagenta} />
          <Text style={styles.kickerText}>AI FINANCIAL BIOGRAPHER</Text>
        </View>

        {/* Display Headline - Heavy Italic Editorial Poster Energy */}
        <h1 style={displayHeadlineStyle as any}>
          Track less.<br />
          <span style={{ color: PlayfulColors.inkBlack }}>Understand more.</span>
        </h1>

        {/* Supporting Hero Subtext */}
        <Text style={styles.heroSubtext}>
          Your finances aren't a math problem — they're an emotional story. Looop diagnoses the habit loops behind your spending and turns daily micro-wins into funded dream vaults.
        </Text>

        {/* Unified Email Input + Pill CTA Composite */}
        <View style={styles.compositeWrapper}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} style={compositeFormStyle as any}>
              <View style={styles.inputCardPill}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter your email for early access..."
                  placeholderTextColor={PlayfulColors.stone}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <button
                  type="submit"
                  style={primaryButtonStyle as any}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span style={primaryButtonTextStyle as any}>Claim Early Access</span>
                  <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </button>
              </View>
            </form>
          ) : (
            <View style={styles.successPill}>
              <CheckCircle2 size={20} color={PlayfulColors.hotMagenta} />
              <Text style={styles.successText}>
                You're on the VIP list! Watch your inbox for beta invites.
              </Text>
            </View>
          )}

          <Text style={styles.helperText}>
            Zero spam. Private & local-first on iOS, Android & Web.
          </Text>
        </View>
      </View>
    </section>
  );
};

const heroSectionStyle = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  paddingTop: 80,
  paddingBottom: 60,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const displayHeadlineStyle = {
  fontSize: Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth < 768 ? 44 : 76,
  lineHeight: 1.02,
  letterSpacing: '-0.002em',
  fontWeight: 900,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  textAlign: 'center',
  margin: '0 0 24px 0',
};

const compositeFormStyle = {
  width: '100%',
  maxWidth: 540,
};

const primaryButtonStyle = {
  backgroundColor: PlayfulColors.hotMagenta,
  padding: '0 26px',
  height: '48px',
  borderRadius: '99px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.15s ease',
};

const primaryButtonTextStyle = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: PlayfulTypography.fontFamily,
  letterSpacing: '-0.2px',
};

const styles = StyleSheet.create({
  heroContainer: {
    maxWidth: 1200,
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  kickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 46, 149, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginBottom: 28,
  },
  kickerText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: PlayfulColors.hotMagenta,
    fontFamily: PlayfulTypography.fontFamily,
  },
  heroSubtext: {
    fontSize: 18,
    lineHeight: 28,
    color: PlayfulColors.slate,
    fontFamily: PlayfulTypography.fontFamily,
    maxWidth: 580,
    textAlign: 'center',
    marginBottom: 36,
  },
  compositeWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  inputCardPill: {
    backgroundColor: PlayfulColors.paperWhite,
    borderRadius: 99,
    padding: 6,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PlayfulColors.sand,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)' as any,
  },
  emailInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: PlayfulColors.softInk,
    fontFamily: PlayfulTypography.fontFamily,
    outlineStyle: 'none' as any,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  primaryPillCta: {
    backgroundColor: PlayfulColors.hotMagenta,
    paddingHorizontal: 26,
    height: 48,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  primaryPillCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: PlayfulTypography.fontFamily,
    letterSpacing: -0.2,
  },
  successPill: {
    backgroundColor: PlayfulColors.paperWhite,
    borderRadius: 99,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PlayfulColors.warmMist,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)' as any,
  },
  successText: {
    color: PlayfulColors.softInk,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: PlayfulTypography.fontFamily,
  },
  helperText: {
    marginTop: 14,
    fontSize: 13,
    color: PlayfulColors.stone,
    fontFamily: PlayfulTypography.fontFamily,
  },
});

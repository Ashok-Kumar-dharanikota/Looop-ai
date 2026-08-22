import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Lock } from 'lucide-react-native';
import { WebColors, WebGradients, WebShadows, WebTypography } from '@/constants/web-tokens';

interface FinalCtaSectionProps {
  onJoinWaitlist?: (email: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onJoinWaitlist }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onJoinWaitlist) onJoinWaitlist(email);
    }, 400);
  };

  return (
    <section style={finalSectionStyle as any}>
      <div style={containerStyle as any}>
        {/* App Icon Mark */}
        <div style={appIconContainerStyle as any}>
          <Sparkles size={28} color={WebColors.primaryOrange} />
        </div>

        {/* Display Headline */}
        <h2 style={displayHeadlineStyle as any}>
          Start building wealth<br />
          <span style={{ color: WebColors.primaryOrange }}>
            without changing who you are.
          </span>
        </h2>

        <p style={subheadStyle as any}>
          Join mindful spenders who turned everyday habit loops into fully funded dream milestones. 100% private, local-first on iOS, Android & Web.
        </p>

        {/* Composite Email + Pill CTA */}
        <div style={compositeWrapperStyle as any}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} style={formCardStyle as any}>
              <input
                type="email"
                placeholder="Enter your email to claim VIP access..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle as any}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={buttonStyle as any}
              >
                <span>{isSubmitting ? 'Joining...' : 'Get Early Access'}</span>
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
              </button>
            </form>
          ) : (
            <div style={successPillStyle as any}>
              <CheckCircle2 size={20} color={WebColors.emerald} />
              <span style={successTextStyle as any}>
                Welcome to Looop! You’ll receive early access credentials soon.
              </span>
            </div>
          )}

          {/* Privacy Note */}
          <div style={bottomNoteRowStyle as any}>
            <Lock size={12} color={WebColors.mutedSlate} />
            <span style={bottomNoteTextStyle as any}>Zero spam. Encrypted local-first SQLite architecture.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const finalSectionStyle = {
  width: '100%',
  backgroundColor: WebColors.canvas,
  padding: '96px 24px 110px 24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
};

const containerStyle = {
  maxWidth: '760px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const appIconContainerStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '20px',
  backgroundColor: WebColors.creamSoft,
  border: `1.5px solid ${WebColors.creamBorderStrong}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '28px',
  boxShadow: '0 8px 24px rgba(255, 107, 0, 0.16)',
};

const displayHeadlineStyle = {
  fontSize: 'clamp(32px, 4.8vw, 48px)',
  lineHeight: 1.12,
  fontWeight: 800,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  margin: '0 0 16px 0',
  letterSpacing: '-0.03em',
};

const subheadStyle = {
  fontSize: '16.5px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  maxWidth: '540px',
  margin: '0 0 32px 0',
};

const compositeWrapperStyle = {
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const formCardStyle = {
  width: '100%',
  backgroundColor: WebColors.cardWhite,
  borderRadius: '999px',
  padding: '6px',
  paddingLeft: '20px',
  display: 'flex',
  alignItems: 'center',
  border: `1.2px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.cardRest,
  marginBottom: '12px',
};

const inputStyle = {
  flex: 1,
  height: '46px',
  fontSize: '15px',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.bodyFont,
  outline: 'none',
  border: 'none',
  backgroundColor: 'transparent',
};

const buttonStyle = {
  background: WebGradients.primarySunset,
  color: '#FFFFFF',
  padding: '0 24px',
  height: '46px',
  borderRadius: '999px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  border: 'none',
  fontSize: '15px',
  fontWeight: '700',
  fontFamily: WebTypography.displayFont,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: WebShadows.buttonPrimary,
  letterSpacing: '-0.2px',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

const successPillStyle = {
  backgroundColor: WebColors.emeraldSoft,
  borderRadius: '999px',
  padding: '14px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  border: `1.2px solid ${WebColors.emeraldBorder}`,
  marginBottom: '12px',
};

const successTextStyle = {
  color: WebColors.inkSlate,
  fontSize: '14.5px',
  fontWeight: '700',
  fontFamily: WebTypography.displayFont,
};

const bottomNoteRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const bottomNoteTextStyle = {
  fontSize: '12px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

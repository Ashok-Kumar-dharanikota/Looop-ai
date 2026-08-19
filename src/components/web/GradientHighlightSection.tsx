import React from 'react';
import { PlayfulColors, PlayfulTypography } from '@/constants/playful-tokens';

export const GradientHighlightSection: React.FC = () => {
  return (
    <section style={gradientSectionStyle as any} id="essays">
      <div style={contentContainerStyle as any}>
        <div style={badgeStyle as any}>
          <span style={badgeTextStyle as any}>EDITORIAL HABIT DIAGNOSIS</span>
        </div>

        <h2 style={headlineStyle as any}>
          “Speak one natural sentence.<br />
          <span style={{ color: PlayfulColors.hotMagenta }}>
            Watch your savings loop straight into your next trip.”
          </span>
        </h2>

        <p style={subheadStyle as any}>
          Every week, Looop’s AI Financial Biographer analyzes your lifestyle patterns and writes a Medium-style essay diagnosing your spending psychology with 3 actionable micro-habits.
        </p>
      </div>
    </section>
  );
};

const gradientSectionStyle = {
  width: '100%',
  padding: '120px 24px',
  background: `radial-gradient(ellipse at center, rgba(255, 46, 149, 0.18) 0%, rgba(246, 242, 238, 0.95) 70%, ${PlayfulColors.oatCanvas} 100%)`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
};

const contentContainerStyle = {
  maxWidth: 820,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const badgeStyle = {
  backgroundColor: PlayfulColors.paperWhite,
  padding: '6px 16px',
  borderRadius: '99px',
  marginBottom: '28px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
};

const badgeTextStyle = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1.2px',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const headlineStyle = {
  fontSize: '34px',
  lineHeight: 1.25,
  fontWeight: 800,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 20px 0',
  letterSpacing: '-0.4px',
};

const subheadStyle = {
  fontSize: '17px',
  lineHeight: 1.6,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  maxWidth: '620px',
  margin: 0,
};

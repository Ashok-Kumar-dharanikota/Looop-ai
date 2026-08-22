import React from 'react';
import { ShieldCheck, Sparkles, Smartphone } from 'lucide-react-native';
import { WebColors, WebGradients, WebShadows, WebTypography } from '@/constants/web-tokens';

export const FinalCtaSection: React.FC = () => {
  return (
    <section style={sectionStyle as any} id="download">
      <div style={cardWrapperStyle as any}>
        {/* Top Glow & Badge */}
        <div style={badgeStyle as any}>
          <Sparkles size={13} color={WebColors.primaryOrange} />
          <span style={badgeTextStyle as any}>LAUNCHING ON IOS & ANDROID</span>
        </div>

        {/* Big Headline */}
        <h2 style={headlineStyle as any}>
          Ready to turn daily habits into life-changing milestones?
        </h2>

        <p style={subtextStyle as any}>
          Looop is built for those who want financial clarity without tedious budgeting chores. 100% private, local-first, and powered by intelligent behavioral essays.
        </p>

        {/* Store Badges Row */}
        <div style={storeBadgesRowStyle as any}>
          {/* Apple App Store */}
          <div style={storeBadgeCardStyle as any}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#0F172A">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.71-.93 2.74 1.05.08 2.08-.54 2.67-1.25z" />
            </svg>
            <div style={badgeTextColStyle as any}>
              <span style={badgeSubtextStyle as any}>COMING SOON TO</span>
              <span style={badgeTitleStyle as any}>Apple App Store</span>
            </div>
          </div>

          {/* Google Play Store */}
          <div style={storeBadgeCardStyle as any}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3.609 1.814L13.792 12 3.61 22.186c-.36-.37-.61-.924-.61-1.613V3.427c0-.689.25-1.243.61-1.613z" fill="#00C3FF" />
              <path d="M17.204 8.587l-3.412 3.413 3.412 3.413 3.906-2.22c1.118-.636 1.118-1.75 0-2.386l-3.906-2.22z" fill="#FFD400" />
              <path d="M3.609 1.814l10.183 10.186 3.412-3.413-11.45-6.507c-.773-.44-1.605-.447-2.145-.266z" fill="#00E676" />
              <path d="M13.792 12L3.61 22.186c.54.18 1.372.174 2.144-.266l11.45-6.507-3.412-3.413z" fill="#FF334C" />
            </svg>
            <div style={badgeTextColStyle as any}>
              <span style={badgeSubtextStyle as any}>COMING SOON TO</span>
              <span style={badgeTitleStyle as any}>Google Play Store</span>
            </div>
          </div>
        </div>

        {/* Feature Checkpoints */}
        <div style={featureTagsRowStyle as any}>
          <div style={tagItemStyle as any}>
            <ShieldCheck size={14} color={WebColors.emerald} />
            <span style={tagTextStyle as any}>Encrypted SQLite Database</span>
          </div>
          <span style={{ color: WebColors.borderStrong }}>•</span>
          <div style={tagItemStyle as any}>
            <Smartphone size={14} color={WebColors.primaryOrange} />
            <span style={tagTextStyle as any}>Offline-First Performance</span>
          </div>
          <span style={{ color: WebColors.borderStrong }}>•</span>
          <div style={tagItemStyle as any}>
            <Sparkles size={14} color={WebColors.accentOrange} />
            <span style={tagTextStyle as any}>Zero Ad Trackers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const sectionStyle = {
  width: '100%',
  padding: '60px 24px 100px 24px',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: WebColors.canvas,
};

const cardWrapperStyle = {
  maxWidth: '920px',
  width: '100%',
  backgroundColor: WebColors.cardWhite,
  borderRadius: '32px',
  padding: '56px 40px',
  border: `1.5px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.cardRest,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '6px 14px',
  borderRadius: '999px',
  marginBottom: '20px',
};

const badgeTextStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const headlineStyle = {
  fontSize: 'clamp(28px, 4.2vw, 44px)',
  lineHeight: 1.15,
  fontWeight: 800,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.03em',
  maxWidth: '680px',
  margin: '0 0 16px 0',
};

const subtextStyle = {
  fontSize: '16px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  maxWidth: '560px',
  margin: '0 0 36px 0',
};

const storeBadgesRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  flexWrap: 'wrap',
  marginBottom: '32px',
};

const storeBadgeCardStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '18px',
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  border: `1.2px solid ${WebColors.borderCard}`,
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
  transition: 'transform 0.15s ease',
};

const badgeTextColStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const badgeSubtextStyle = {
  fontSize: '9px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.displayFont,
};

const badgeTitleStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.2px',
};

const featureTagsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '12px',
};

const tagItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const tagTextStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

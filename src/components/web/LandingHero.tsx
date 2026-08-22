import React from 'react';
import { View, Text } from 'react-native';
import {
  Sparkles,
  Lock,
  Mic,
  Car,
  Coffee,
  Utensils,
  TrendingUp,
  ShieldCheck,
  Smartphone,
} from 'lucide-react-native';
import { WebColors, WebGradients, WebShadows, WebTypography } from '@/constants/web-tokens';

export const LandingHero: React.FC = () => {
  return (
    <section style={heroSectionStyle as any} id="overview">
      {/* Background Ambient Radial Sunset Glow */}
      <div style={ambientGlowStyle as any} />

      <div style={heroContainerStyle as any}>
        {/* Left Column: Value Proposition & Store Badges */}
        <div style={leftColStyle as any}>
          {/* Kicker Badge */}
          <div style={kickerBadgeStyle as any}>
            <Sparkles size={13} color={WebColors.primaryOrange} />
            <span style={kickerTextStyle as any}>AI FINANCIAL BIOGRAPHER & PRIVATE VAULT</span>
          </div>

          {/* Display Headline */}
          <h1 style={displayHeadlineStyle as any}>
            Master daily cashflow.<br />
            <span style={{ color: WebColors.primaryOrange }}>Fund life milestones.</span>
          </h1>

          {/* Supporting Copy */}
          <p style={heroSubtextStyle as any}>
            Your finances aren't an intimidating math spreadsheet — they're a behavioral story. Looop diagnoses the habit loops behind your daily spending and turns micro-wins into fully funded dream vaults.
          </p>

          {/* Store Availability Badges */}
          <div style={storeBadgesWrapperStyle as any}>
            <div style={badgesRowStyle as any}>
              {/* Apple App Store Badge */}
              <div style={storeBadgeStyle as any}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0F172A">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.71-.93 2.74 1.05.08 2.08-.54 2.67-1.25z" />
                </svg>
                <div style={badgeTextColStyle as any}>
                  <span style={badgeSubtextStyle as any}>COMING SOON TO</span>
                  <span style={badgeTitleStyle as any}>App Store</span>
                </div>
              </div>

              {/* Google Play Store Badge */}
              <div style={storeBadgeStyle as any}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.36-.37-.61-.924-.61-1.613V3.427c0-.689.25-1.243.61-1.613z" fill="#00C3FF" />
                  <path d="M17.204 8.587l-3.412 3.413 3.412 3.413 3.906-2.22c1.118-.636 1.118-1.75 0-2.386l-3.906-2.22z" fill="#FFD400" />
                  <path d="M3.609 1.814l10.183 10.186 3.412-3.413-11.45-6.507c-.773-.44-1.605-.447-2.145-.266z" fill="#00E676" />
                  <path d="M13.792 12L3.61 22.186c.54.18 1.372.174 2.144-.266l11.45-6.507-3.412-3.413z" fill="#FF334C" />
                </svg>
                <div style={badgeTextColStyle as any}>
                  <span style={badgeSubtextStyle as any}>COMING SOON TO</span>
                  <span style={badgeTitleStyle as any}>Google Play</span>
                </div>
              </div>
            </div>

            {/* Privacy & Trust Badge */}
            <div style={trustRowStyle as any}>
              <div style={trustItemStyle as any}>
                <Lock size={13} color={WebColors.emerald} />
                <span style={trustTextStyle as any}>100% Local-First SQLite</span>
              </div>
              <span style={{ color: WebColors.borderStrong }}>•</span>
              <div style={trustItemStyle as any}>
                <ShieldCheck size={13} color={WebColors.accentOrange} />
                <span style={trustTextStyle as any}>Zero Bank Logins Required</span>
              </div>
              <span style={{ color: WebColors.borderStrong }}>•</span>
              <div style={trustItemStyle as any}>
                <Smartphone size={13} color={WebColors.primaryOrange} />
                <span style={trustTextStyle as any}>Native iOS & Android</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Fidelity Floating Device Mockup */}
        <div style={rightColStyle as any}>
          <div className="animate-float-mockup" style={phoneMockupCardStyle as any}>
            {/* Dynamic Island Header */}
            <div style={phoneHeaderRowStyle as any}>
              <span style={timeTextStyle as any}>9:41</span>
              <div style={dynamicIslandNotchStyle as any} />
              <div style={statusIconsRowStyle as any}>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: WebColors.inkSlate }}>5G</span>
                <div style={batteryIconStyle as any}>
                  <div style={batteryLevelStyle as any} />
                </div>
              </div>
            </div>

            {/* Phone Screen App Header */}
            <div style={appUserRowStyle as any}>
              <div>
                <span style={appGreetingStyle as any}>Good Morning Alex ☀️</span>
                <h3 style={appTitleStyle as any}>Total Savings Growth</h3>
              </div>
              <div style={avatarCircleStyle as any}>
                <span>AK</span>
              </div>
            </div>

            {/* Savings Growth Hero Card */}
            <div style={savingsCardStyle as any}>
              <div style={savingsCardHeaderStyle as any}>
                <div>
                  <div style={growthBadgePillStyle as any}>
                    <TrendingUp size={11} color={WebColors.accentOrange} />
                    <span style={growthBadgeTextStyle as any}>SAVINGS MOMENTUM</span>
                  </div>
                  <div style={amountHeroTextStyle as any}>₹84,500</div>
                </div>
                <div style={percentageTagStyle as any}>
                  <span style={percentageNumberStyle as any}>+18.4%</span>
                  <span style={percentageSubStyle as any}>THIS MONTH</span>
                </div>
              </div>

              {/* Smooth Area Chart Curve */}
              <div style={chartWrapperStyle as any}>
                <svg width="100%" height="70" viewBox="0 0 280 70" fill="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="70" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF6B00" stopOpacity="0.22" />
                      <stop offset="0.6" stopColor="#FF6B00" stopOpacity="0.06" />
                      <stop offset="1" stopColor="#FF6B00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,62 C 40,58 70,44 110,40 C 150,36 190,26 230,14 C 255,8 270,6 280,4 L 280,70 L 0,70 Z"
                    fill="url(#heroAreaGrad)"
                  />
                  <path
                    d="M 0,62 C 40,58 70,44 110,40 C 150,36 190,26 230,14 C 255,8 270,6 280,4"
                    stroke="#FF6B00"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle cx="280" cy="4" r="5" fill="#FF6B00" />
                  <circle cx="280" cy="4" r="9" fill="rgba(255, 107, 0, 0.25)" />
                </svg>
              </div>

              {/* Safe Spend Pacing Badge */}
              <div style={safePaceBoxStyle as any}>
                <div style={safePaceDotStyle as any} />
                <span style={safePaceTextStyle as any}>Safe to spend: <strong>₹1,240/day</strong> (16 days left)</span>
              </div>
            </div>

            {/* Recent Activity Mini List */}
            <div style={activityBoxStyle as any}>
              <div style={activityHeaderStyle as any}>
                <span style={activityTitleStyle as any}>Today's Verified Activity</span>
                <span style={activityTotalStyle as any}>Total: ₹1,050</span>
              </div>

              <div style={txRowStyle as any}>
                <div style={{ ...txIconBox, backgroundColor: WebColors.creamSoft }}>
                  <Utensils size={13} color={WebColors.accentOrange} />
                </div>
                <div style={txInfoStyle as any}>
                  <span style={txNameStyle as any}>Lunch at Subway</span>
                  <span style={txMetaStyle as any}>01:15 PM • 1-Sec Voice Logged</span>
                </div>
                <span style={txAmountStyle as any}>-₹450</span>
              </div>

              <div style={txRowStyle as any}>
                <div style={{ ...txIconBox, backgroundColor: WebColors.azureSoft }}>
                  <Car size={13} color={WebColors.azure} />
                </div>
                <div style={txInfoStyle as any}>
                  <span style={txNameStyle as any}>Uber ride to client office</span>
                  <span style={txMetaStyle as any}>11:20 AM • Transport</span>
                </div>
                <span style={txAmountStyle as any}>-₹250</span>
              </div>

              <div style={txRowStyle as any}>
                <div style={{ ...txIconBox, backgroundColor: WebColors.coralSoft }}>
                  <Coffee size={13} color={WebColors.coral} />
                </div>
                <div style={txInfoStyle as any}>
                  <span style={txNameStyle as any}>Starbucks Cold Brew</span>
                  <span style={txMetaStyle as any}>09:30 AM • Food & Drink</span>
                </div>
                <span style={txAmountStyle as any}>-₹350</span>
              </div>
            </div>

            {/* Floating 1-Sec Voice Logger Pill Tag on Mockup */}
            <div style={floatingStickerStyle as any}>
              <div style={pulsingMicCircleStyle as any}>
                <Mic size={13} color="#FFFFFF" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: WebColors.inkSlate }}>"Paid 450 Subway"</span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: WebColors.accentOrange }}>VERIFIED RECEIPT IN 1s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Styles
const heroSectionStyle = {
  width: '100%',
  backgroundColor: WebColors.canvas,
  paddingTop: '64px',
  paddingBottom: '80px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
};

const ambientGlowStyle = {
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: '1200px',
  height: '520px',
  background: WebGradients.ambientHeroGlow,
  pointerEvents: 'none',
  zIndex: 0,
};

const heroContainerStyle = {
  maxWidth: '1200px',
  width: '100%',
  padding: '0 24px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '48px',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
};

const leftColStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const kickerBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '6px 14px',
  borderRadius: '999px',
  marginBottom: '20px',
};

const kickerTextStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const displayHeadlineStyle = {
  fontSize: 'clamp(36px, 5.2vw, 58px)',
  lineHeight: 1.08,
  letterSpacing: '-0.035em',
  fontWeight: 800,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  margin: '0 0 20px 0',
};

const heroSubtextStyle = {
  fontSize: '17px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  maxWidth: '540px',
  margin: '0 0 32px 0',
};

const storeBadgesWrapperStyle = {
  width: '100%',
  maxWidth: '520px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const badgesRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
};

const storeBadgeStyle = {
  backgroundColor: WebColors.cardWhite,
  borderRadius: '16px',
  padding: '10px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  border: `1.2px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.cardRest,
  cursor: 'default',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

const badgeTextColStyle = {
  display: 'flex',
  flexDirection: 'column',
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

const trustRowStyle = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px',
  paddingLeft: '4px',
  marginTop: '4px',
};

const trustItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const trustTextStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const rightColStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

const phoneMockupCardStyle = {
  width: '100%',
  maxWidth: '380px',
  backgroundColor: WebColors.cardWhite,
  borderRadius: '36px',
  padding: '20px 22px 24px 22px',
  border: `1.5px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.floatingMockup,
  position: 'relative',
};

const phoneHeaderRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  paddingHorizontal: '4px',
};

const timeTextStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
};

const dynamicIslandNotchStyle = {
  width: '76px',
  height: '18px',
  backgroundColor: WebColors.inkSlate,
  borderRadius: '999px',
};

const statusIconsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const batteryIconStyle = {
  width: '20px',
  height: '10px',
  borderRadius: '3px',
  border: `1.2px solid ${WebColors.inkSlate}`,
  padding: '1px',
};

const batteryLevelStyle = {
  width: '80%',
  height: '100%',
  backgroundColor: WebColors.inkSlate,
  borderRadius: '1.5px',
};

const appUserRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '14px',
};

const appGreetingStyle = {
  fontSize: '11.5px',
  fontWeight: '600',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const appTitleStyle = {
  fontSize: '17px',
  fontWeight: '800',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.3px',
  margin: '2px 0 0 0',
};

const avatarCircleStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '17px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: '800',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const savingsCardStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '20px',
  padding: '16px',
  border: `1px solid ${WebColors.borderCard}`,
  marginBottom: '16px',
};

const savingsCardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '6px',
};

const growthBadgePillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '3px 8px',
  borderRadius: '6px',
  marginBottom: '4px',
};

const growthBadgeTextStyle = {
  fontSize: '8.5px',
  fontWeight: '800',
  color: WebColors.accentOrange,
  letterSpacing: '0.6px',
  fontFamily: WebTypography.displayFont,
};

const amountHeroTextStyle = {
  fontSize: '22px',
  fontWeight: '800',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.5px',
};

const percentageTagStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '4px 8px',
  borderRadius: '8px',
};

const percentageNumberStyle = {
  fontSize: '12px',
  fontWeight: '800',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const percentageSubStyle = {
  fontSize: '7.5px',
  fontWeight: '700',
  color: WebColors.accentOrange,
  letterSpacing: '0.5px',
  fontFamily: WebTypography.displayFont,
};

const chartWrapperStyle = {
  width: '100%',
  height: '70px',
  margin: '8px 0 10px 0',
};

const safePaceBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: WebColors.cardWhite,
  borderRadius: '10px',
  padding: '8px 12px',
  border: `1px solid ${WebColors.borderHairline}`,
};

const safePaceDotStyle = {
  width: '7px',
  height: '7px',
  borderRadius: '3.5px',
  backgroundColor: WebColors.emerald,
};

const safePaceTextStyle = {
  fontSize: '11.5px',
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
};

const activityBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const activityHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2px',
};

const activityTitleStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
};

const activityTotalStyle = {
  fontSize: '11px',
  fontWeight: '600',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const txRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '12px',
  border: `1px solid ${WebColors.borderHairline}`,
};

const txIconBox = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const txInfoStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const txNameStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.bodyFont,
};

const txMetaStyle = {
  fontSize: '9.5px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const txAmountStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
};

const floatingStickerStyle = {
  position: 'absolute',
  bottom: '-14px',
  right: '-14px',
  backgroundColor: WebColors.cardWhite,
  borderRadius: '16px',
  padding: '8px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  border: `1.2px solid ${WebColors.creamBorderStrong}`,
  boxShadow: '0 8px 24px rgba(255, 107, 0, 0.18)',
};

const pulsingMicCircleStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '14px',
  background: WebGradients.primarySunset,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(255, 107, 0, 0.3)',
};

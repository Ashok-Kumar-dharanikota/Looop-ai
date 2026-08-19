import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Mic, BookOpen, TrendingUp, ShieldCheck, Sparkles, HeartPulse, ArrowUpRight } from 'lucide-react-native';
import { PlayfulColors, PlayfulTypography, PlayfulShadows, PlayfulRadii } from '@/constants/playful-tokens';

export const TiltedAppTiles: React.FC = () => {
  return (
    <section style={tilesSectionStyle as any} id="features">
      <div style={fanContainerStyle as any}>
        {/* Tile 1: Voice & Conversational Logger (Tilt -6deg) */}
        <div style={{ ...tileCardStyle, transform: 'rotate(-4deg) translateY(12px)' } as any}>
          <div style={cardHeaderRowStyle as any}>
            <div style={iconBadgeStyle as any}>
              <Mic size={18} color={PlayfulColors.hotMagenta} strokeWidth={2.2} />
            </div>
            <span style={pillTagStyle as any}>VOICE LOGGING</span>
          </div>

          <p style={cardHeadlineStyle as any}>
            "Paid ₹450 for lunch Subway just now"
          </p>

          <div style={voiceWaveBoxStyle as any}>
            <div style={{ ...voiceBar, height: 16 }}></div>
            <div style={{ ...voiceBar, height: 32, background: PlayfulColors.hotMagenta }}></div>
            <div style={{ ...voiceBar, height: 22 }}></div>
            <div style={{ ...voiceBar, height: 40, background: PlayfulColors.hotMagenta }}></div>
            <div style={{ ...voiceBar, height: 14 }}></div>
          </div>

          <div style={cardFooterRowStyle as any}>
            <span style={cardSubtextStyle as any}>Instant verified receipt in 2s</span>
            <Sparkles size={14} color={PlayfulColors.stone} />
          </div>
        </div>

        {/* Tile 2: Medium-Style Financial Essay (Tilt -1deg, elevated) */}
        <div style={{ ...tileCardStyle, transform: 'rotate(-1deg) translateY(-14px)', zIndex: 2 } as any}>
          <div style={cardHeaderRowStyle as any}>
            <div style={iconBadgeStyle as any}>
              <BookOpen size={18} color={PlayfulColors.hotMagenta} strokeWidth={2.2} />
            </div>
            <span style={pillTagStyle as any}>HABIT ESSAY</span>
          </div>

          <p style={cardHeadlineStyle as any}>
            The 10:30 PM Swiggy Paradox
          </p>

          <p style={cardBodySnippetStyle as any}>
            Why late-night burnout triggers impulse orders, spikes resting heart rate, and costs ₹3,400/mo in vacation funds.
          </p>

          <div style={cardFooterRowStyle as any}>
            <span style={readTimeBadgeStyle as any}>3 min diagnosis</span>
            <ArrowUpRight size={16} color={PlayfulColors.stone} />
          </div>
        </div>

        {/* Tile 3: 3D Impact Matrix & Growth (Tilt +2deg, elevated) */}
        <div style={{ ...tileCardStyle, transform: 'rotate(2deg) translateY(-10px)', zIndex: 3 } as any}>
          <div style={cardHeaderRowStyle as any}>
            <div style={iconBadgeStyle as any}>
              <HeartPulse size={18} color={PlayfulColors.hotMagenta} strokeWidth={2.2} />
            </div>
            <span style={pillTagStyle as any}>3D IMPACT</span>
          </div>

          <p style={cardHeadlineStyle as any}>
            Health & Vitality Connection
          </p>

          <div style={impactStatBoxStyle as any}>
            <div style={impactStatItemStyle as any}>
              <span style={statNumberStyle as any}>-28%</span>
              <span style={statLabelStyle as any}>Sleep Disruption</span>
            </div>
            <div style={impactStatItemStyle as any}>
              <span style={{ ...statNumberStyle, color: PlayfulColors.hotMagenta } as any}>+₹1,650</span>
              <span style={statLabelStyle as any}>Saved / Wk</span>
            </div>
          </div>

          <div style={cardFooterRowStyle as any}>
            <span style={cardSubtextStyle as any}>Cook at home on Thu & Fri</span>
          </div>
        </div>

        {/* Tile 4: Milestone Savings Vaults (Tilt +5deg) */}
        <div style={{ ...tileCardStyle, transform: 'rotate(5deg) translateY(18px)' } as any}>
          <div style={cardHeaderRowStyle as any}>
            <div style={iconBadgeStyle as any}>
              <ShieldCheck size={18} color={PlayfulColors.hotMagenta} strokeWidth={2.2} />
            </div>
            <span style={pillTagStyle as any}>SAVINGS VAULT</span>
          </div>

          <p style={cardHeadlineStyle as any}>
            Smart Fitness Ring Vault
          </p>

          <div style={vaultProgressBoxStyle as any}>
            <div style={vaultProgressHeaderStyle as any}>
              <span style={vaultAmountStyle as any}>₹4,200</span>
              <span style={vaultTargetStyle as any}>of ₹7,500</span>
            </div>
            <div style={vaultTrackStyle as any}>
              <div style={vaultFillStyle as any} />
            </div>
          </div>

          <div style={cardFooterRowStyle as any}>
            <span style={cardSubtextStyle as any}>56% Funded • Target Sep '26</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const tilesSectionStyle = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  paddingTop: 40,
  paddingBottom: 90,
  overflowX: 'hidden',
};

const fanContainerStyle = {
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: '24px',
  padding: '0 24px',
};

const tileCardStyle = {
  backgroundColor: PlayfulColors.paperWhite,
  borderRadius: `${PlayfulRadii.cards}px`,
  padding: '30px 26px',
  width: '260px',
  minHeight: '280px',
  boxShadow: PlayfulShadows.cardStack,
  border: `1px solid ${PlayfulColors.warmMist}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
  cursor: 'default',
};

const cardHeaderRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
};

const iconBadgeStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 46, 149, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pillTagStyle = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.8px',
  color: PlayfulColors.charcoal,
  fontFamily: PlayfulTypography.fontFamily,
};

const cardHeadlineStyle = {
  fontSize: '18px',
  fontWeight: '700',
  lineHeight: 1.3,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 12px 0',
};

const cardBodySnippetStyle = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 16px 0',
};

const voiceWaveBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  height: '48px',
  backgroundColor: PlayfulColors.oatCanvas,
  borderRadius: '16px',
  padding: '0 16px',
  marginBottom: '16px',
};

const voiceBar = {
  width: '4px',
  borderRadius: '2px',
  backgroundColor: PlayfulColors.stone,
};

const impactStatBoxStyle = {
  display: 'flex',
  gap: '12px',
  backgroundColor: PlayfulColors.oatCanvas,
  borderRadius: '16px',
  padding: '12px 14px',
  marginBottom: '16px',
};

const impactStatItemStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const statNumberStyle = {
  fontSize: '16px',
  fontWeight: '800',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const statLabelStyle = {
  fontSize: '10px',
  fontWeight: '600',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
  textTransform: 'uppercase',
};

const vaultProgressBoxStyle = {
  backgroundColor: PlayfulColors.oatCanvas,
  borderRadius: '16px',
  padding: '12px 14px',
  marginBottom: '16px',
};

const vaultProgressHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: '8px',
};

const vaultAmountStyle = {
  fontSize: '16px',
  fontWeight: '800',
  color: PlayfulColors.hotMagenta,
  fontFamily: PlayfulTypography.fontFamily,
};

const vaultTargetStyle = {
  fontSize: '11px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const vaultTrackStyle = {
  width: '100%',
  height: '6px',
  borderRadius: '3px',
  backgroundColor: PlayfulColors.sand,
  overflow: 'hidden',
};

const vaultFillStyle = {
  width: '56%',
  height: '100%',
  backgroundColor: PlayfulColors.hotMagenta,
  borderRadius: '3px',
};

const cardFooterRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: `1px solid ${PlayfulColors.warmMist}`,
  paddingTop: '12px',
};

const cardSubtextStyle = {
  fontSize: '12px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
  fontWeight: '500',
};

const readTimeBadgeStyle = {
  fontSize: '11px',
  fontWeight: '600',
  color: PlayfulColors.charcoal,
  fontFamily: PlayfulTypography.fontFamily,
};

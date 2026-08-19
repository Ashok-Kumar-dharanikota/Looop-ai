import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartPulse, Users, TrendingUp, Sparkles, Check } from 'lucide-react-native';
import { PlayfulColors, PlayfulTypography, PlayfulShadows, PlayfulRadii } from '@/constants/playful-tokens';

export const ImpactMatrixSection: React.FC = () => {
  return (
    <section style={sectionWrapperStyle as any} id="impact">
      <div style={sectionContainerStyle as any}>
        {/* Section Header */}
        <div style={headerBlockStyle as any}>
          <div style={badgeStyle as any}>
            <Sparkles size={12} color={PlayfulColors.hotMagenta} />
            <span style={badgeTextStyle as any}>THE 3D IMPACT MATRIX</span>
          </div>
          <h2 style={sectionHeadingStyle as any}>
            Money isn’t isolated numbers.<br />
            <span style={{ color: PlayfulColors.charcoal, fontStyle: 'normal' }}>
              It’s your sleep, relationships, and freedom.
            </span>
          </h2>
          <p style={sectionSubtextStyle as any}>
            Most apps show cold bar charts. Looop maps every recurring expense against three pillars of human well-being so you make decisions from clarity, not guilt.
          </p>
        </div>

        {/* 3 Pillar Cards Grid */}
        <div style={cardsGridStyle as any}>
          {/* Pillar 1: Health & Vitality */}
          <div style={pillarCardStyle as any}>
            <div style={cardTopRowStyle as any}>
              <div style={{ ...pillarIconBox, backgroundColor: 'rgba(255, 46, 149, 0.08)' } as any}>
                <HeartPulse size={22} color={PlayfulColors.hotMagenta} strokeWidth={2.2} />
              </div>
              <span style={pillarTagStyle as any}>PILLAR 01</span>
            </div>

            <h3 style={pillarTitleStyle as any}>Health & Vitality</h3>
            <p style={pillarDescriptionStyle as any}>
              Heavy late-night deliveries and rushed sedentary cab rides spike night heart rates by 8–12 bpm and fragment restorative REM sleep.
            </p>

            <div style={takeawayBoxStyle as any}>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={PlayfulColors.hotMagenta} strokeWidth={2.5} />
                <span style={takeawayTextStyle as any}>Ditch late deliveries ➔ Reclaim 28% deep sleep</span>
              </div>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={PlayfulColors.hotMagenta} strokeWidth={2.5} />
                <span style={takeawayTextStyle as any}>Metro commute ➔ 3,000 incidental daily steps</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Family & Shared Memories */}
          <div style={pillarCardStyle as any}>
            <div style={cardTopRowStyle as any}>
              <div style={{ ...pillarIconBox, backgroundColor: 'rgba(17, 17, 17, 0.06)' } as any}>
                <Users size={22} color={PlayfulColors.inkBlack} strokeWidth={2.2} />
              </div>
              <span style={pillarTagStyle as any}>PILLAR 02</span>
            </div>

            <h3 style={pillarTitleStyle as any}>Family & Memories</h3>
            <p style={pillarDescriptionStyle as any}>
              Discretionary micro-leaks like unmonitored OTT subs and daily convenience cabs quietly siphon ₹3,200 to ₹6,800 every single month.
            </p>

            <div style={takeawayBoxStyle as any}>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={PlayfulColors.hotMagenta} strokeWidth={2.5} />
                <span style={takeawayTextStyle as any}>Redirect ₹3,200/mo ➔ 2 full weekend family trips/yr</span>
              </div>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={PlayfulColors.hotMagenta} strokeWidth={2.5} />
                <span style={takeawayTextStyle as any}>More evening presence by avoiding traffic gridlock</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Financial Freedom & Vaults */}
          <div style={pillarCardStyle as any}>
            <div style={cardTopRowStyle as any}>
              <div style={{ ...pillarIconBox, backgroundColor: 'rgba(255, 46, 149, 0.08)' } as any}>
                <TrendingUp size={22} color={PlayfulColors.hotMagenta} strokeWidth={2.2} />
              </div>
              <span style={pillarTagStyle as any}>PILLAR 03</span>
            </div>

            <h3 style={pillarTitleStyle as any}>Milestone Vaults</h3>
            <p style={pillarDescriptionStyle as any}>
              Saved money isn’t left sitting as abstract numbers. It automatically loops directly into your prioritized, locked dream vaults.
            </p>

            <div style={takeawayBoxStyle as any}>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={PlayfulColors.hotMagenta} strokeWidth={2.5} />
                <span style={takeawayTextStyle as any}>Reach your Smart Ring vault 3 weeks early</span>
              </div>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={PlayfulColors.hotMagenta} strokeWidth={2.5} />
                <span style={takeawayTextStyle as any}>Zero guilt purchases paid 100% in full</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const sectionWrapperStyle = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  padding: '113px 0',
};

const sectionContainerStyle = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
};

const headerBlockStyle = {
  maxWidth: '720px',
  marginBottom: '64px',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'rgba(255, 46, 149, 0.08)',
  padding: '6px 14px',
  borderRadius: '99px',
  marginBottom: '18px',
};

const badgeTextStyle = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1px',
  color: PlayfulColors.hotMagenta,
  fontFamily: PlayfulTypography.fontFamily,
};

const sectionHeadingStyle = {
  fontSize: '38px',
  lineHeight: 1.15,
  fontWeight: 800,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 16px 0',
  letterSpacing: '-0.5px',
};

const sectionSubtextStyle = {
  fontSize: '16px',
  lineHeight: 1.6,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  margin: 0,
};

const cardsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
};

const pillarCardStyle = {
  backgroundColor: PlayfulColors.paperWhite,
  borderRadius: `${PlayfulRadii.cards}px`,
  padding: '36px 30px',
  boxShadow: PlayfulShadows.cardStack,
  border: `1px solid ${PlayfulColors.warmMist}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const cardTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const pillarIconBox = {
  width: '48px',
  height: '48px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pillarTagStyle = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const pillarTitleStyle = {
  fontSize: '22px',
  fontWeight: '700',
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 12px 0',
};

const pillarDescriptionStyle = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 24px 0',
};

const takeawayBoxStyle = {
  backgroundColor: PlayfulColors.oatCanvas,
  borderRadius: '20px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const takeawayRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const takeawayTextStyle = {
  fontSize: '13px',
  fontWeight: '500',
  color: PlayfulColors.softInk,
  fontFamily: PlayfulTypography.fontFamily,
};

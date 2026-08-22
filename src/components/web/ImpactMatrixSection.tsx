import React from 'react';
import { HeartPulse, Users, TrendingUp, Sparkles, Check } from 'lucide-react-native';
import { WebColors, WebShadows, WebTypography } from '@/constants/web-tokens';

export const ImpactMatrixSection: React.FC = () => {
  return (
    <section style={sectionWrapperStyle as any} id="impact">
      <div style={sectionContainerStyle as any}>
        {/* Section Header */}
        <div style={headerBlockStyle as any}>
          <div style={badgeStyle as any}>
            <Sparkles size={13} color={WebColors.primaryOrange} />
            <span style={badgeTextStyle as any}>THE 3D IMPACT MATRIX</span>
          </div>

          <h2 style={sectionHeadingStyle as any}>
            Money isn’t isolated numbers.<br />
            <span style={{ color: WebColors.subSlate }}>
              It’s your sleep, relationships, and freedom.
            </span>
          </h2>

          <p style={sectionSubtextStyle as any}>
            Most apps show cold bar charts that induce guilt. Looop maps every recurring expense against three pillars of human well-being so you make decisions from clarity.
          </p>
        </div>

        {/* 3 Pillar Cards Grid */}
        <div style={cardsGridStyle as any}>
          {/* Pillar 1: Health & Vitality */}
          <div style={pillarCardStyle as any}>
            <div>
              <div style={cardTopRowStyle as any}>
                <div style={{ ...pillarIconBox, backgroundColor: WebColors.coralSoft }}>
                  <HeartPulse size={20} color={WebColors.coral} strokeWidth={2.2} />
                </div>
                <span style={pillarTagStyle as any}>PILLAR 01</span>
              </div>

              <h3 style={pillarTitleStyle as any}>Health & Vitality</h3>
              <p style={pillarDescriptionStyle as any}>
                Heavy late-night deliveries and rushed sedentary cab rides spike resting heart rates by 8–12 bpm and fragment restorative REM sleep.
              </p>
            </div>

            <div style={takeawayBoxStyle as any}>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={WebColors.accentOrange} strokeWidth={2.6} />
                <span style={takeawayTextStyle as any}>Ditch late deliveries ➔ Reclaim 28% deep sleep</span>
              </div>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={WebColors.accentOrange} strokeWidth={2.6} />
                <span style={takeawayTextStyle as any}>Metro commute ➔ 3,000 incidental daily steps</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Family & Shared Memories */}
          <div style={pillarCardStyle as any}>
            <div>
              <div style={cardTopRowStyle as any}>
                <div style={{ ...pillarIconBox, backgroundColor: WebColors.azureSoft }}>
                  <Users size={20} color={WebColors.azure} strokeWidth={2.2} />
                </div>
                <span style={pillarTagStyle as any}>PILLAR 02</span>
              </div>

              <h3 style={pillarTitleStyle as any}>Family & Memories</h3>
              <p style={pillarDescriptionStyle as any}>
                Discretionary micro-leaks like unmonitored OTT subs and surge cabs quietly siphon ₹3,200 to ₹6,800 every single month.
              </p>
            </div>

            <div style={takeawayBoxStyle as any}>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={WebColors.accentOrange} strokeWidth={2.6} />
                <span style={takeawayTextStyle as any}>Redirect ₹3,200/mo ➔ 2 full weekend family trips/yr</span>
              </div>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={WebColors.accentOrange} strokeWidth={2.6} />
                <span style={takeawayTextStyle as any}>More evening presence by avoiding traffic gridlock</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Financial Freedom & Vaults */}
          <div style={pillarCardStyle as any}>
            <div>
              <div style={cardTopRowStyle as any}>
                <div style={{ ...pillarIconBox, backgroundColor: WebColors.creamSoft }}>
                  <TrendingUp size={20} color={WebColors.primaryOrange} strokeWidth={2.2} />
                </div>
                <span style={pillarTagStyle as any}>PILLAR 03</span>
              </div>

              <h3 style={pillarTitleStyle as any}>Milestone Vaults</h3>
              <p style={pillarDescriptionStyle as any}>
                Saved money isn’t left sitting as abstract numbers. It automatically loops directly into your prioritized, locked dream targets.
              </p>
            </div>

            <div style={takeawayBoxStyle as any}>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={WebColors.accentOrange} strokeWidth={2.6} />
                <span style={takeawayTextStyle as any}>Reach your Smart Ring vault 3 weeks early</span>
              </div>
              <div style={takeawayRowStyle as any}>
                <Check size={14} color={WebColors.accentOrange} strokeWidth={2.6} />
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
  backgroundColor: WebColors.canvas,
  padding: '96px 0',
  display: 'flex',
  justifyContent: 'center',
};

const sectionContainerStyle = {
  maxWidth: '1200px',
  width: '100%',
  padding: '0 24px',
};

const headerBlockStyle = {
  maxWidth: '720px',
  marginBottom: '56px',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '6px 14px',
  borderRadius: '999px',
  marginBottom: '18px',
};

const badgeTextStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const sectionHeadingStyle = {
  fontSize: 'clamp(32px, 4.5vw, 44px)',
  lineHeight: 1.15,
  fontWeight: 800,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  margin: '0 0 16px 0',
  letterSpacing: '-0.03em',
};

const sectionSubtextStyle = {
  fontSize: '16px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};

const cardsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
};

const pillarCardStyle = {
  backgroundColor: WebColors.cardWhite,
  borderRadius: '24px',
  padding: '32px 28px',
  boxShadow: WebShadows.cardRest,
  border: `1.2px solid ${WebColors.borderCard}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '340px',
};

const cardTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '18px',
};

const pillarIconBox = {
  width: '42px',
  height: '42px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pillarTagStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '1px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.displayFont,
};

const pillarTitleStyle = {
  fontSize: '20px',
  fontWeight: '800',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.2px',
  margin: '0 0 10px 0',
};

const pillarDescriptionStyle = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  margin: '0 0 24px 0',
};

const takeawayBoxStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '16px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  border: `1px solid ${WebColors.borderHairline}`,
};

const takeawayRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const takeawayTextStyle = {
  fontSize: '12.5px',
  fontWeight: '600',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.bodyFont,
};

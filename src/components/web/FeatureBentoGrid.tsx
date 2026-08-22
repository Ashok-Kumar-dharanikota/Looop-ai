import React, { useState } from 'react';
import {
  Mic,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Target,
  ArrowUpRight,
  Check,
  Zap,
} from 'lucide-react-native';
import { WebColors, WebGradients, WebShadows, WebTypography } from '@/constants/web-tokens';

export const FeatureBentoGrid: React.FC = () => {
  const [isMicSimulating, setIsMicSimulating] = useState(false);
  const [habitChecked, setHabitChecked] = useState(false);

  const handleSimulateVoice = () => {
    setIsMicSimulating(true);
    setTimeout(() => {
      setIsMicSimulating(false);
    }, 2800);
  };

  return (
    <section style={bentoSectionStyle as any} id="features">
      <div style={bentoContainerStyle as any}>
        {/* Section Header */}
        <div style={sectionHeaderStyle as any}>
          <div style={kickerBadgeStyle as any}>
            <Sparkles size={13} color={WebColors.primaryOrange} />
            <span style={kickerTextStyle as any}>FEEL THE SANCTUARY IN ACTION</span>
          </div>

          <h2 style={sectionHeadingStyle as any}>
            Every interaction designed for<br />
            <span style={{ color: WebColors.primaryOrange }}>effortless mastery.</span>
          </h2>

          <p style={sectionSubtextStyle as any}>
            From 1-second speech recognition to weekly behavioral habit stories, Looop bridges the gap between your daily choices and funded dream milestones.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div style={gridLayoutStyle as any}>
          {/* ========================================================================= */}
          {/* BENTO CARD 1: 1-SECOND VOICE LOGGER (Interactive Playground)             */}
          {/* ========================================================================= */}
          <div style={largeBentoCardStyle as any}>
            <div style={cardHeaderRowStyle as any}>
              <div style={{ ...iconOrbStyle, backgroundColor: WebColors.creamSoft }}>
                <Mic size={18} color={WebColors.accentOrange} strokeWidth={2.2} />
              </div>
              <span style={cardTagStyle as any}>NATURAL SPEECH-TO-INTENT</span>
            </div>

            <h3 style={cardTitleStyle as any}>
              Speak one natural sentence.<br />
              Verified receipt in 1 second.
            </h3>

            <p style={cardDescStyle as any}>
              Say what you spent in plain English or Hinglish. Looop extracts the amount, merchant, category, and payment method into a structured transaction instantly.
            </p>

            {/* Interactive Voice Mic Demo Stage */}
            <div style={voiceDemoStageStyle as any}>
              <div style={voiceControlRowStyle as any}>
                <button
                  onClick={handleSimulateVoice}
                  style={
                    {
                      ...micTriggerBtnStyle,
                      transform: isMicSimulating ? 'scale(1.05)' : 'scale(1)',
                    } as any
                  }
                  title="Click to test voice logging"
                >
                  <Mic size={20} color="#FFFFFF" strokeWidth={2.4} />
                </button>

                <div style={waveformRowStyle as any}>
                  <div className="wave-anim-1" style={waveBarStyle as any} />
                  <div className="wave-anim-2" style={{ ...waveBarStyle, height: '26px', background: WebColors.primaryOrange } as any} />
                  <div className="wave-anim-3" style={waveBarStyle as any} />
                  <div className="wave-anim-4" style={{ ...waveBarStyle, height: '32px', background: WebColors.primaryOrange } as any} />
                  <div className="wave-anim-5" style={waveBarStyle as any} />
                </div>

                <span style={simStatusTextStyle as any}>
                  {isMicSimulating ? 'Streaming audio...' : 'Click mic to test'}
                </span>
              </div>

              {/* Live Streaming Speech Transcript */}
              <div style={transcriptBoxStyle as any}>
                <span style={transcriptLabelStyle as any}>LIVE TRANSCRIPTION</span>
                <p style={transcriptTextStyle as any}>
                  “Paid <strong style={{ color: WebColors.primaryOrange }}>₹450</strong> for <strong style={{ color: WebColors.primaryOrange }}>lunch</strong> at Subway via <strong style={{ color: WebColors.primaryOrange }}>UPI</strong>”
                </p>
              </div>

              {/* Instant Verified Receipt Card */}
              <div style={receiptCardStyle as any}>
                <div style={receiptHeaderStyle as any}>
                  <CheckCircle2 size={15} color={WebColors.emerald} />
                  <span style={receiptTagStyle as any}>AI VERIFIED RECEIPT</span>
                </div>

                <div style={receiptDataRowStyle as any}>
                  <span style={receiptKeyStyle as any}>Amount</span>
                  <span style={receiptValHeroStyle as any}>₹450.00</span>
                </div>

                <div style={receiptDataRowStyle as any}>
                  <span style={receiptKeyStyle as any}>Category</span>
                  <span style={receiptValStyle as any}>Food & Dining</span>
                </div>

                <div style={receiptDataRowStyle as any}>
                  <span style={receiptKeyStyle as any}>Payment Method</span>
                  <span style={receiptValStyle as any}>UPI (Google Pay)</span>
                </div>

                <div style={receiptFooterRowStyle as any}>
                  <span style={receiptSavedNoteStyle as any}>✓ Confirmed & Logged to SQLite</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BENTO CARD 2: REAL-TIME SAFE SPEND PACING (Living Dashboard)             */}
          {/* ========================================================================= */}
          <div style={mediumBentoCardStyle as any}>
            <div style={cardHeaderRowStyle as any}>
              <div style={{ ...iconOrbStyle, backgroundColor: WebColors.emeraldSoft }}>
                <TrendingUp size={18} color={WebColors.emerald} strokeWidth={2.2} />
              </div>
              <span style={cardTagStyle as any}>DAILY RUN RATE</span>
            </div>

            <h3 style={cardTitleStyle as any}>
              Safe daily pacing.<br />Zero guilt.
            </h3>

            <p style={cardDescStyle as any}>
              Looop automatically locks your fixed rent, EMIs, and savings first, calculating exactly what you can safely spend today without falling behind.
            </p>

            {/* Pacing Dial Widget */}
            <div style={pacingWidgetCardStyle as any}>
              <div style={pacingTopRowStyle as any}>
                <div>
                  <span style={pacingSubLabelStyle as any}>TODAY'S SAFE BUDGET</span>
                  <div style={pacingMainAmountStyle as any}>₹1,240 <span style={{ fontSize: '13px', fontWeight: '500', color: WebColors.mutedSlate }}>/ day</span></div>
                </div>
                <div style={pacingStatusPillStyle as any}>
                  <span style={pacingStatusTextStyle as any}>Safe (64% Left)</span>
                </div>
              </div>

              {/* Progress Track */}
              <div style={pacingTrackStyle as any}>
                <div style={{ ...pacingFillStyle, width: '64%', background: WebGradients.emeraldGrowth } as any} />
              </div>

              <div style={pacingMetaRowStyle as any}>
                <span style={pacingMetaTextStyle as any}>Spent: ₹760</span>
                <span style={pacingMetaTextStyle as any}>₹37,200 cycle buffer (16d)</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BENTO CARD 3: WEEKLY AI HABIT BIOGRAPHER (Editorial Diagnosis)           */}
          {/* ========================================================================= */}
          <div style={mediumBentoCardStyle as any}>
            <div style={cardHeaderRowStyle as any}>
              <div style={{ ...iconOrbStyle, backgroundColor: WebColors.creamSoft }}>
                <BookOpen size={18} color={WebColors.accentOrange} strokeWidth={2.2} />
              </div>
              <span style={cardTagStyle as any}>BEHAVIORAL ESSAYS</span>
            </div>

            <h3 style={cardTitleStyle as any}>
              The 10:30 PM Swiggy Paradox
            </h3>

            <p style={cardDescStyle as any}>
              Why late-night burnout triggers impulsive delivery orders, spikes resting heart rates by 12 bpm, and quietly drains ₹3,400/month in vacation funds.
            </p>

            {/* AI Action Challenge Checklist */}
            <div style={actionChallengeBoxStyle as any}>
              <span style={actionBoxHeaderStyle as any}>ACTIONABLE AI HABIT CHALLENGE:</span>

              <div style={challengeRowStyle as any}>
                <div style={checkedCircleStyle as any}>✓</div>
                <span style={challengeTextStyle as any}>Cook dinner at home on Thu & Fri (Saved +₹800/wk)</span>
              </div>

              <div
                onClick={() => setHabitChecked(!habitChecked)}
                style={{ ...challengeRowStyle, cursor: 'pointer' } as any}
              >
                <div style={habitChecked ? checkedCircleStyle : uncheckedCircleStyle as any}>
                  {habitChecked ? '✓' : ''}
                </div>
                <span style={challengeTextStyle as any}>
                  Switch 2 peak-surge cabs to Metro (+₹400/wk)
                </span>
              </div>

              <div style={storySavingsFooterStyle as any}>
                <span style={storySavingsBadgeStyle as any}>+₹2,400 / wk</span>
                <span style={storySavingsNoteStyle as any}>Auto-routed into Goa Vault</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BENTO CARD 4: MILESTONE SAVINGS VAULTS (Fund What Matters)               */}
          {/* ========================================================================= */}
          <div style={mediumBentoCardStyle as any}>
            <div style={cardHeaderRowStyle as any}>
              <div style={{ ...iconOrbStyle, backgroundColor: WebColors.azureSoft }}>
                <Target size={18} color={WebColors.azure} strokeWidth={2.2} />
              </div>
              <span style={cardTagStyle as any}>MILESTONE VAULTS</span>
            </div>

            <h3 style={cardTitleStyle as any}>
              Turn micro-habits into funded dreams.
            </h3>

            <p style={cardDescStyle as any}>
              Saved money isn't left as abstract numbers. It automatically loops directly into your prioritized, locked dream targets.
            </p>

            {/* Vault Progress Bars */}
            <div style={vaultsContainerStyle as any}>
              {/* Vault 1 */}
              <div style={vaultItemStyle as any}>
                <div style={vaultItemHeaderStyle as any}>
                  <span style={vaultNameStyle as any}>Smart Fitness Ring</span>
                  <span style={vaultPercentStyle as any}>56%</span>
                </div>
                <div style={vaultAmountRowStyle as any}>
                  <span style={vaultCurrentStyle as any}>₹4,200</span>
                  <span style={vaultTargetStyle as any}>of ₹7,500</span>
                </div>
                <div style={vaultTrackBgStyle as any}>
                  <div style={{ ...vaultFillBarStyle, width: '56%', background: WebGradients.primarySunset } as any} />
                </div>
              </div>

              {/* Vault 2 */}
              <div style={vaultItemStyle as any}>
                <div style={vaultItemHeaderStyle as any}>
                  <span style={vaultNameStyle as any}>Family Goa Escape</span>
                  <span style={vaultPercentStyle as any}>54%</span>
                </div>
                <div style={vaultAmountRowStyle as any}>
                  <span style={vaultCurrentStyle as any}>₹12,000</span>
                  <span style={vaultTargetStyle as any}>of ₹22,000</span>
                </div>
                <div style={vaultTrackBgStyle as any}>
                  <div style={{ ...vaultFillBarStyle, width: '54%', background: WebGradients.azureCalm } as any} />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BENTO CARD 5: 100% LOCAL-FIRST PRIVACY SANCTUARY                         */}
          {/* ========================================================================= */}
          <div style={mediumBentoCardStyle as any}>
            <div style={cardHeaderRowStyle as any}>
              <div style={{ ...iconOrbStyle, backgroundColor: WebColors.creamSoft }}>
                <Lock size={18} color={WebColors.primaryOrange} strokeWidth={2.2} />
              </div>
              <span style={cardTagStyle as any}>LOCAL-FIRST SANCTUARY</span>
            </div>

            <h3 style={cardTitleStyle as any}>
              Zero bank logins.<br />Your data stays on your device.
            </h3>

            <p style={cardDescStyle as any}>
              No Plaid scraping, no third-party cloud data selling. All transaction ledgers and biometric keys stay encrypted locally inside on-device SQLite.
            </p>

            {/* Privacy Pillars Checklist */}
            <div style={privacyPillarsBoxStyle as any}>
              <div style={privacyPillarRowStyle as any}>
                <ShieldCheck size={16} color={WebColors.emerald} />
                <span style={privacyPillarTextStyle as any}>Encrypted SQLite On-Device Database</span>
              </div>
              <div style={privacyPillarRowStyle as any}>
                <ShieldCheck size={16} color={WebColors.emerald} />
                <span style={privacyPillarTextStyle as any}>Biometric Face ID / Fingerprint Auth</span>
              </div>
              <div style={privacyPillarRowStyle as any}>
                <ShieldCheck size={16} color={WebColors.emerald} />
                <span style={privacyPillarTextStyle as any}>Zero Ad Tracking & Zero Cloud Telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Styles
const bentoSectionStyle = {
  width: '100%',
  backgroundColor: WebColors.canvas,
  padding: '96px 0',
  display: 'flex',
  justifyContent: 'center',
};

const bentoContainerStyle = {
  maxWidth: '1200px',
  width: '100%',
  padding: '0 24px',
};

const sectionHeaderStyle = {
  maxWidth: '720px',
  marginBottom: '56px',
};

const kickerBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '6px 14px',
  borderRadius: '999px',
  marginBottom: '18px',
};

const kickerTextStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const sectionHeadingStyle = {
  fontSize: 'clamp(32px, 4.5vw, 46px)',
  lineHeight: 1.12,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  margin: '0 0 16px 0',
};

const sectionSubtextStyle = {
  fontSize: '16.5px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};

const gridLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '24px',
};

const largeBentoCardStyle = {
  gridColumn: 'span 2',
  backgroundColor: WebColors.cardWhite,
  borderRadius: '24px',
  padding: '36px 32px',
  border: `1.2px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.cardRest,
  display: 'flex',
  flexDirection: 'column',
};

const mediumBentoCardStyle = {
  backgroundColor: WebColors.cardWhite,
  borderRadius: '24px',
  padding: '32px 28px',
  border: `1.2px solid ${WebColors.borderCard}`,
  boxShadow: WebShadows.cardRest,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const cardHeaderRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
};

const iconOrbStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cardTagStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.displayFont,
};

const cardTitleStyle = {
  fontSize: '22px',
  fontWeight: '800',
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  margin: '0 0 12px 0',
};

const cardDescStyle = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  margin: '0 0 24px 0',
};

const voiceDemoStageStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '20px',
  padding: '20px',
  border: `1px solid ${WebColors.borderCard}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const voiceControlRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
};

const micTriggerBtnStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '22px',
  background: WebGradients.primarySunset,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: WebShadows.buttonPrimary,
  cursor: 'pointer',
  border: 'none',
  transition: 'transform 0.15s ease',
};

const waveformRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  height: '32px',
};

const waveBarStyle = {
  width: '3.5px',
  height: '18px',
  borderRadius: '2px',
  backgroundColor: WebColors.borderStrong,
};

const simStatusTextStyle = {
  fontSize: '12.5px',
  fontWeight: '600',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const transcriptBoxStyle = {
  backgroundColor: WebColors.cardWhite,
  borderRadius: '14px',
  padding: '12px 16px',
  border: `1px solid ${WebColors.borderCard}`,
};

const transcriptLabelStyle = {
  fontSize: '9.5px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.displayFont,
  display: 'block',
  marginBottom: '4px',
};

const transcriptTextStyle = {
  fontSize: '14px',
  lineHeight: 1.5,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};

const receiptCardStyle = {
  backgroundColor: WebColors.cardWhite,
  borderRadius: '16px',
  padding: '14px 18px',
  border: `1px solid ${WebColors.creamBorder}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const receiptHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '2px',
};

const receiptTagStyle = {
  fontSize: '10.5px',
  fontWeight: '800',
  letterSpacing: '0.6px',
  color: WebColors.emerald,
  fontFamily: WebTypography.displayFont,
};

const receiptDataRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const receiptKeyStyle = {
  fontSize: '12.5px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const receiptValStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.bodyFont,
};

const receiptValHeroStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
};

const receiptFooterRowStyle = {
  borderTop: `1px solid ${WebColors.borderHairline}`,
  paddingTop: '8px',
  marginTop: '2px',
};

const receiptSavedNoteStyle = {
  fontSize: '11.5px',
  fontWeight: '600',
  color: WebColors.emerald,
  fontFamily: WebTypography.bodyFont,
};

const pacingWidgetCardStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '18px',
  padding: '18px',
  border: `1px solid ${WebColors.borderCard}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const pacingTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const pacingSubLabelStyle = {
  fontSize: '9.5px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.displayFont,
  display: 'block',
  marginBottom: '2px',
};

const pacingMainAmountStyle = {
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
};

const pacingStatusPillStyle = {
  backgroundColor: WebColors.emeraldSoft,
  border: `1px solid ${WebColors.emeraldBorder}`,
  padding: '4px 10px',
  borderRadius: '999px',
};

const pacingStatusTextStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: WebColors.emerald,
  fontFamily: WebTypography.displayFont,
};

const pacingTrackStyle = {
  width: '100%',
  height: '8px',
  borderRadius: '4px',
  backgroundColor: WebColors.borderCard,
  overflow: 'hidden',
};

const pacingFillStyle = {
  height: '100%',
  borderRadius: '4px',
};

const pacingMetaRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const pacingMetaTextStyle = {
  fontSize: '11.5px',
  fontWeight: '500',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const actionChallengeBoxStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '18px',
  padding: '16px',
  border: `1px solid ${WebColors.borderCard}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const actionBoxHeaderStyle = {
  fontSize: '9.5px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
  marginBottom: '2px',
};

const challengeRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const checkedCircleStyle = {
  width: '18px',
  height: '18px',
  borderRadius: '9px',
  backgroundColor: WebColors.emerald,
  color: '#FFFFFF',
  fontSize: '11px',
  fontWeight: '800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const uncheckedCircleStyle = {
  width: '18px',
  height: '18px',
  borderRadius: '9px',
  border: `1.5px solid ${WebColors.borderStrong}`,
  backgroundColor: WebColors.cardWhite,
  flexShrink: 0,
};

const challengeTextStyle = {
  fontSize: '12.5px',
  fontWeight: '600',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.bodyFont,
};

const storySavingsFooterStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  paddingTop: '8px',
  borderTop: `1px solid ${WebColors.borderHairline}`,
  marginTop: '4px',
};

const storySavingsBadgeStyle = {
  fontSize: '12px',
  fontWeight: '800',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const storySavingsNoteStyle = {
  fontSize: '11.5px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const vaultsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const vaultItemStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '16px',
  padding: '14px',
  border: `1px solid ${WebColors.borderCard}`,
};

const vaultItemHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
};

const vaultNameStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
};

const vaultPercentStyle = {
  fontSize: '11px',
  fontWeight: '800',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const vaultAmountRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: '8px',
};

const vaultCurrentStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
};

const vaultTargetStyle = {
  fontSize: '11.5px',
  color: WebColors.mutedSlate,
  fontFamily: WebTypography.bodyFont,
};

const vaultTrackBgStyle = {
  width: '100%',
  height: '6px',
  borderRadius: '3px',
  backgroundColor: WebColors.borderCard,
  overflow: 'hidden',
};

const vaultFillBarStyle = {
  height: '100%',
  borderRadius: '3px',
};

const privacyPillarsBoxStyle = {
  backgroundColor: WebColors.surfaceSubtle,
  borderRadius: '18px',
  padding: '16px',
  border: `1px solid ${WebColors.borderCard}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const privacyPillarRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const privacyPillarTextStyle = {
  fontSize: '12.5px',
  fontWeight: '600',
  color: WebColors.inkSlate,
  fontFamily: WebTypography.bodyFont,
};

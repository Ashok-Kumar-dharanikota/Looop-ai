import React, { useState } from 'react';
import {
  Mic,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Utensils,
  Car,
  Coffee,
  ShoppingBag,
  HeartPulse,
  Users,
  CheckCircle2,
  Lock,
  Plus,
  Home,
  Receipt,
  Target,
  User,
} from 'lucide-react-native';
import { PlayfulColors, PlayfulTypography, PlayfulShadows } from '@/constants/playful-tokens';

type ScreenTab = 'dashboard' | 'voice' | 'stories' | 'vaults';

export const MobileMockupShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');

  return (
    <section style={showcaseWrapperStyle as any} id="mockups">
      <div style={showcaseContainerStyle as any}>
        {/* Section Header */}
        <div style={headerBlockStyle as any}>
          <div style={tagStyle as any}>
            <Sparkles size={13} color={PlayfulColors.hotMagenta} />
            <span style={tagTextStyle as any}>FEEL THE APP IN ACTION</span>
          </div>
          <h2 style={headlineStyle as any}>
            Experience Looop’s<br />
            <span style={{ color: PlayfulColors.hotMagenta }}>
              frictionless living surface.
            </span>
          </h2>
          <p style={subheadStyle as any}>
            Tap through the interactive mobile screens below to see how voice logging, habit essays, and milestone vaults fit seamlessly into your life.
          </p>

          {/* Interactive Screen Switcher Tabs */}
          <div style={tabsRowStyle as any}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                ...tabBtnStyle,
                backgroundColor: activeTab === 'dashboard' ? PlayfulColors.inkBlack : PlayfulColors.paperWhite,
                color: activeTab === 'dashboard' ? '#FFFFFF' : PlayfulColors.softInk,
                borderColor: activeTab === 'dashboard' ? PlayfulColors.inkBlack : PlayfulColors.sand,
              } as any}
            >
              <TrendingUp size={16} color={activeTab === 'dashboard' ? PlayfulColors.hotMagenta : PlayfulColors.charcoal} />
              <span>Live Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              style={{
                ...tabBtnStyle,
                backgroundColor: activeTab === 'voice' ? PlayfulColors.inkBlack : PlayfulColors.paperWhite,
                color: activeTab === 'voice' ? '#FFFFFF' : PlayfulColors.softInk,
                borderColor: activeTab === 'voice' ? PlayfulColors.inkBlack : PlayfulColors.sand,
              } as any}
            >
              <Mic size={16} color={activeTab === 'voice' ? PlayfulColors.hotMagenta : PlayfulColors.charcoal} />
              <span>2-Sec Voice Logger</span>
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              style={{
                ...tabBtnStyle,
                backgroundColor: activeTab === 'stories' ? PlayfulColors.inkBlack : PlayfulColors.paperWhite,
                color: activeTab === 'stories' ? '#FFFFFF' : PlayfulColors.softInk,
                borderColor: activeTab === 'stories' ? PlayfulColors.inkBlack : PlayfulColors.sand,
              } as any}
            >
              <BookOpen size={16} color={activeTab === 'stories' ? PlayfulColors.hotMagenta : PlayfulColors.charcoal} />
              <span>AI Habit Stories</span>
            </button>

            <button
              onClick={() => setActiveTab('vaults')}
              style={{
                ...tabBtnStyle,
                backgroundColor: activeTab === 'vaults' ? PlayfulColors.inkBlack : PlayfulColors.paperWhite,
                color: activeTab === 'vaults' ? '#FFFFFF' : PlayfulColors.softInk,
                borderColor: activeTab === 'vaults' ? PlayfulColors.inkBlack : PlayfulColors.sand,
              } as any}
            >
              <ShieldCheck size={16} color={activeTab === 'vaults' ? PlayfulColors.hotMagenta : PlayfulColors.charcoal} />
              <span>Milestone Vaults</span>
            </button>
          </div>
        </div>

        {/* Center Stage: Phone Frame with Floating Stickers */}
        <div style={stageWrapperStyle as any}>
          {/* Floating Sticker 1 (Top Right) */}
          <div className="sticker-badge animate-float" style={{ top: '24px', right: '-10px' } as any}>
            <span style={{ fontSize: '18px' }}>✨</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: PlayfulColors.inkBlack }}>+₹3,200/mo</span>
              <span style={{ fontSize: '10px', color: PlayfulColors.stone, fontWeight: 600 }}>SAVED WITHOUT EFFORT</span>
            </div>
          </div>

          {/* Floating Sticker 2 (Left Middle) */}
          <div className="sticker-badge animate-float-reverse" style={{ top: '220px', left: '-30px' } as any}>
            <span style={{ fontSize: '18px' }}>🎙️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: PlayfulColors.inkBlack }}>"Paid 450 Subway"</span>
              <span style={{ fontSize: '10px', color: PlayfulColors.hotMagenta, fontWeight: 700 }}>2-SEC RECEIPT CREATED</span>
            </div>
          </div>

          {/* Floating Sticker 3 (Bottom Right) */}
          <div className="sticker-badge animate-float" style={{ bottom: '40px', right: '-20px' } as any}>
            <Lock size={16} color={PlayfulColors.hotMagenta} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: PlayfulColors.inkBlack }}>Local-First Privacy</span>
              <span style={{ fontSize: '10px', color: PlayfulColors.stone, fontWeight: 500 }}>Encrypted SQLite On-Device</span>
            </div>
          </div>

          {/* Realistic Mobile Device Frame */}
          <div className="phone-mockup-frame">
            {/* Dynamic Island Notch */}
            <div className="dynamic-island">
              <div className="camera-lens" />
            </div>

            {/* Inner Glass Viewport */}
            <div className="phone-screen-glass">
              {/* Screen Top Status Bar */}
              <div style={statusBarRowStyle as any}>
                <span style={timeTextStyle as any}>9:41</span>
                <div style={statusIconsRowStyle as any}>
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>5G</span>
                  <div style={batteryIconStyle as any}>
                    <div style={batteryLevelStyle as any} />
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SCREEN 1: HOME DASHBOARD                                      */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'dashboard' && (
                <div style={screenContentStyle as any}>
                  <div style={appHeaderRowStyle as any}>
                    <div>
                      <span style={appGreetingStyle as any}>Good Morning Alex ☀️</span>
                      <h4 style={appUserTitleStyle as any}>Total Savings Growth</h4>
                    </div>
                    <div style={avatarCircleStyle as any}>
                      <span>AK</span>
                    </div>
                  </div>

                  {/* Savings Hero Card with Area Chart Curve */}
                  <div style={heroAreaCardStyle as any}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={heroAmountLabelStyle as any}>Amount Saved Till Now</span>
                      <span style={growthBadgeStyle as any}>+18.4%</span>
                    </div>
                    <div style={heroAmountNumberStyle as any}>₹18,450</div>

                    {/* SVG Area Chart Line */}
                    <div style={svgChartContainer as any}>
                      <svg width="100%" height="70" viewBox="0 0 260 70" fill="none">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="70" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#ff2e95" stopOpacity="0.25" />
                            <stop offset="1" stopColor="#ff2e95" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,60 C40,55 70,40 100,45 C130,50 170,25 210,18 C235,12 250,8 260,6 L260,70 L0,70 Z"
                          fill="url(#areaGrad)"
                        />
                        <path
                          d="M0,60 C40,55 70,40 100,45 C130,50 170,25 210,18 C235,12 250,8 260,6"
                          stroke="#ff2e95"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx="260" cy="6" r="4" fill="#ff2e95" />
                      </svg>
                    </div>

                    <div style={safePaceBoxStyle as any}>
                      <span style={safePaceTextStyle as any}>Safe: ₹1,240/day (16d left)</span>
                    </div>
                  </div>

                  {/* Activity Timeline List */}
                  <div style={activitySectionStyle as any}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={sectionTitleStyle as any}>Recent Activity</span>
                      <span style={sectionSublinkStyle as any}>Today: ₹2,250</span>
                    </div>

                    <div style={txItemStyle as any}>
                      <div style={{ ...txIconBox, backgroundColor: '#E0F2FE' } as any}>
                        <Car size={14} color="#0284C7" />
                      </div>
                      <div style={txDetailsStyle as any}>
                        <span style={txTitleStyle as any}>Uber ride to office</span>
                        <span style={txTimeStyle as any}>09:00 AM • Transport</span>
                      </div>
                      <span style={txAmountStyle as any}>-₹250</span>
                    </div>

                    <div style={txItemStyle as any}>
                      <div style={{ ...txIconBox, backgroundColor: '#FEE2E2' } as any}>
                        <Coffee size={14} color="#EF4444" />
                      </div>
                      <div style={txDetailsStyle as any}>
                        <span style={txTitleStyle as any}>Starbucks Coffee</span>
                        <span style={txTimeStyle as any}>09:30 AM • Food</span>
                      </div>
                      <span style={txAmountStyle as any}>-₹350</span>
                    </div>

                    <div style={txItemStyle as any}>
                      <div style={{ ...txIconBox, backgroundColor: '#DCFCE7' } as any}>
                        <Utensils size={14} color="#16A34A" />
                      </div>
                      <div style={txDetailsStyle as any}>
                        <span style={txTitleStyle as any}>Lunch at Subway</span>
                        <span style={txTimeStyle as any}>01:15 PM • Dining</span>
                      </div>
                      <span style={txAmountStyle as any}>-₹450</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SCREEN 2: 2-SEC VOICE LOGGER & INSTANT RECEIPT                */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'voice' && (
                <div style={screenContentStyle as any}>
                  <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '20px' }}>
                    <span style={voiceModalTitleStyle as any}>Voice Expense Logger</span>
                    <p style={voiceModalSubStyle as any}>Speak naturally in plain English or Hinglish</p>
                  </div>

                  {/* Pulsing Mic Waveform */}
                  <div style={micCenterBoxStyle as any}>
                    <div style={micCircleGlowStyle as any}>
                      <Mic size={28} color="#FFFFFF" />
                    </div>
                    <div style={waveformBarsRowStyle as any}>
                      <div className="wave-bar-1" style={waveBarStyle as any} />
                      <div className="wave-bar-2" style={{ ...waveBarStyle, background: PlayfulColors.hotMagenta } as any} />
                      <div className="wave-bar-3" style={waveBarStyle as any} />
                      <div className="wave-bar-4" style={{ ...waveBarStyle, background: PlayfulColors.hotMagenta } as any} />
                      <div className="wave-bar-5" style={waveBarStyle as any} />
                    </div>
                  </div>

                  {/* Streaming Words Box */}
                  <div style={speechTranscriptCardStyle as any}>
                    <span style={speechTagStyle as any}>LIVE TRANSCRIPTION</span>
                    <p style={speechWordsStyle as any}>
                      “Paid <strong>₹450</strong> for <strong>lunch</strong> at Subway via <strong>UPI</strong>”
                    </p>
                  </div>

                  {/* Verified Receipt Card */}
                  <div style={receiptCardStyle as any}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <CheckCircle2 size={16} color={PlayfulColors.hotMagenta} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: PlayfulColors.hotMagenta }}>
                        AI VERIFIED RECEIPT
                      </span>
                    </div>

                    <div style={receiptRowStyle as any}>
                      <span style={receiptLabelStyle as any}>Amount</span>
                      <span style={receiptValueStyle as any}>₹450.00</span>
                    </div>
                    <div style={receiptRowStyle as any}>
                      <span style={receiptLabelStyle as any}>Category</span>
                      <span style={receiptValueStyle as any}>Food & Dining</span>
                    </div>
                    <div style={receiptRowStyle as any}>
                      <span style={receiptLabelStyle as any}>Payment</span>
                      <span style={receiptValueStyle as any}>UPI (GPay)</span>
                    </div>

                    <button style={saveReceiptBtnStyle as any}>✓ Confirmed & Logged</button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SCREEN 3: MEDIUM-STYLE ESSAYS & HABIT STORIES                 */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'stories' && (
                <div style={screenContentStyle as any}>
                  <div style={articleHeaderBoxStyle as any}>
                    <span style={articlePillTag as any}>WEEKLY ESSAY • 3 MIN</span>
                    <h3 style={articleTitleStyle as any}>
                      The 10:30 PM Swiggy Paradox
                    </h3>
                    <p style={articleExcerptStyle as any}>
                      Why late-night burnout triggers frictionless food delivery, spikes resting heart rates by 12 bpm, and costs ₹3,400/mo in vacation savings.
                    </p>
                  </div>

                  {/* 3D Impact Matrix Mini Box */}
                  <div style={impactMiniGrid as any}>
                    <div style={impactMiniCard as any}>
                      <HeartPulse size={14} color="#EF4444" />
                      <span style={impactMiniNum as any}>-28%</span>
                      <span style={impactMiniLbl as any}>Sleep Spikes</span>
                    </div>
                    <div style={impactMiniCard as any}>
                      <Users size={14} color="#0284C7" />
                      <span style={impactMiniNum as any}>2 Trips</span>
                      <span style={impactMiniLbl as any}>Goa Funded</span>
                    </div>
                    <div style={impactMiniCard as any}>
                      <TrendingUp size={14} color={PlayfulColors.hotMagenta} />
                      <span style={{ ...impactMiniNum, color: PlayfulColors.hotMagenta } as any}>+₹1,650</span>
                      <span style={impactMiniLbl as any}>Weekly Saved</span>
                    </div>
                  </div>

                  {/* Actionable Micro-Habit Checklist */}
                  <div style={habitChallengeBox as any}>
                    <span style={habitSectionHeader as any}>AI ACTION PLAN:</span>
                    <div style={habitItemStyle as any}>
                      <div style={checkSquareChecked as any}>✓</div>
                      <span style={habitItemTextStyle as any}>Cook dinner at home on Thu & Fri (+₹800)</span>
                    </div>
                    <div style={habitItemStyle as any}>
                      <div style={checkSquareUnchecked as any} />
                      <span style={habitItemTextStyle as any}>Switch 2 cab rides to Metro (+₹400)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SCREEN 4: MILESTONE SAVINGS VAULTS ROADMAP                    */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'vaults' && (
                <div style={screenContentStyle as any}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <span style={appGreetingStyle as any}>Fund What Matters</span>
                      <h4 style={appUserTitleStyle as any}>Milestone Vaults</h4>
                    </div>
                    <div style={addVaultBtnMini as any}>
                      <Plus size={16} color="#FFFFFF" />
                    </div>
                  </div>

                  {/* Vault Card 1: Fitness Ring */}
                  <div style={vaultItemCard as any}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={vaultNameText as any}>Smart Fitness Ring</span>
                      <span style={vaultPercentBadge as any}>56%</span>
                    </div>
                    <div style={vaultNumbersRow as any}>
                      <span style={vaultCurrentAmount as any}>₹4,200</span>
                      <span style={vaultTotalAmount as any}>of ₹7,500</span>
                    </div>
                    <div style={vaultTrackContainer as any}>
                      <div style={{ ...vaultFillBar, width: '56%', background: PlayfulColors.hotMagenta } as any} />
                    </div>
                    <span style={vaultDateNote as any}>Target: Sep 2026 • Auto-depositing from habits</span>
                  </div>

                  {/* Vault Card 2: Goa Trip */}
                  <div style={vaultItemCard as any}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={vaultNameText as any}>Family Goa Escape</span>
                      <span style={vaultPercentBadge as any}>54%</span>
                    </div>
                    <div style={vaultNumbersRow as any}>
                      <span style={vaultCurrentAmount as any}>₹12,000</span>
                      <span style={vaultTotalAmount as any}>of ₹22,000</span>
                    </div>
                    <div style={vaultTrackContainer as any}>
                      <div style={{ ...vaultFillBar, width: '54%', background: '#0284C7' } as any} />
                    </div>
                    <span style={vaultDateNote as any}>Target: Nov 2026 • 2 micro-actions away</span>
                  </div>

                  {/* Vault Card 3: Emergency Buffer */}
                  <div style={vaultItemCard as any}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={vaultNameText as any}>Emergency 3-Mo Buffer</span>
                      <span style={vaultPercentBadge as any}>70%</span>
                    </div>
                    <div style={vaultNumbersRow as any}>
                      <span style={vaultCurrentAmount as any}>₹35,000</span>
                      <span style={vaultTotalAmount as any}>of ₹50,000</span>
                    </div>
                    <div style={vaultTrackContainer as any}>
                      <div style={{ ...vaultFillBar, width: '70%', background: '#10B981' } as any} />
                    </div>
                    <span style={vaultDateNote as any}>Target: Feb 2027 • High Priority</span>
                  </div>
                </div>
              )}

              {/* Bottom Mobile Tab Bar */}
              <div style={bottomAppTabBar as any}>
                <div style={{ ...bottomTabItem, color: activeTab === 'dashboard' ? PlayfulColors.hotMagenta : '#9CA3AF' } as any}>
                  <Home size={18} />
                </div>
                <div style={{ ...bottomTabItem, color: '#9CA3AF' } as any}>
                  <Receipt size={18} />
                </div>
                <div style={centerAddAppBtn as any}>
                  <Plus size={20} color="#FFFFFF" />
                </div>
                <div style={{ ...bottomTabItem, color: activeTab === 'stories' || activeTab === 'vaults' ? PlayfulColors.hotMagenta : '#9CA3AF' } as any}>
                  <Target size={18} />
                </div>
                <div style={{ ...bottomTabItem, color: '#9CA3AF' } as any}>
                  <User size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const showcaseWrapperStyle = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  padding: '100px 0 120px 0',
  display: 'flex',
  justifyContent: 'center',
};

const showcaseContainerStyle = {
  maxWidth: 1200,
  width: '100%',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const headerBlockStyle = {
  textAlign: 'center',
  maxWidth: '740px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '50px',
};

const tagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'rgba(255, 46, 149, 0.08)',
  padding: '6px 16px',
  borderRadius: '99px',
  marginBottom: '20px',
};

const tagTextStyle = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1.2px',
  color: PlayfulColors.hotMagenta,
  fontFamily: PlayfulTypography.fontFamily,
};

const headlineStyle = {
  fontSize: '44px',
  lineHeight: 1.1,
  fontWeight: 900,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 16px 0',
  letterSpacing: '-0.5px',
};

const subheadStyle = {
  fontSize: '17px',
  lineHeight: 1.6,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 32px 0',
};

const tabsRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  justifyContent: 'center',
};

const tabBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 22px',
  borderRadius: '99px',
  border: '1.5px solid',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: PlayfulTypography.fontFamily,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
};

const stageWrapperStyle = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
};

const statusBarRowStyle = {
  padding: '10px 18px 6px 18px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 10,
};

const timeTextStyle = {
  fontSize: '13px',
  fontWeight: 700,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
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
  border: '1px solid #000',
  padding: '1px',
};

const batteryLevelStyle = {
  width: '75%',
  height: '100%',
  backgroundColor: '#000',
  borderRadius: '1.5px',
};

const screenContentStyle = {
  flex: 1,
  padding: '12px 16px 60px 16px',
  display: 'flex',
  flexDirection: 'column',
};

const appHeaderRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
};

const appGreetingStyle = {
  fontSize: '11px',
  color: PlayfulColors.stone,
  fontWeight: 600,
  fontFamily: PlayfulTypography.fontFamily,
};

const appUserTitleStyle = {
  fontSize: '16px',
  fontWeight: 800,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '2px 0 0 0',
};

const avatarCircleStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  backgroundColor: PlayfulColors.inkBlack,
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 800,
};

const heroAreaCardStyle = {
  backgroundColor: '#FAF9F6',
  borderRadius: '24px',
  padding: '16px',
  border: `1px solid ${PlayfulColors.warmMist}`,
  marginBottom: '16px',
};

const heroAmountLabelStyle = {
  fontSize: '11px',
  color: PlayfulColors.stone,
  fontWeight: 600,
  fontFamily: PlayfulTypography.fontFamily,
};

const growthBadgeStyle = {
  fontSize: '11px',
  fontWeight: 800,
  color: '#059669',
  backgroundColor: '#DCFCE7',
  padding: '2px 8px',
  borderRadius: '8px',
};

const heroAmountNumberStyle = {
  fontSize: '28px',
  fontWeight: 900,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '4px 0 8px 0',
};

const svgChartContainer = {
  width: '100%',
  height: '70px',
  margin: '6px 0',
};

const safePaceBoxStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: '8px 12px',
  border: `1px solid ${PlayfulColors.sand}`,
  textAlign: 'center',
};

const safePaceTextStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: PlayfulColors.hotMagenta,
  fontFamily: PlayfulTypography.fontFamily,
};

const activitySectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const sectionTitleStyle = {
  fontSize: '13px',
  fontWeight: 800,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const sectionSublinkStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const txItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  backgroundColor: '#FAF9F6',
  borderRadius: '16px',
};

const txIconBox = {
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const txDetailsStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const txTitleStyle = {
  fontSize: '12px',
  fontWeight: 700,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const txTimeStyle = {
  fontSize: '10px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const txAmountStyle = {
  fontSize: '13px',
  fontWeight: 800,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const voiceModalTitleStyle = {
  fontSize: '15px',
  fontWeight: 800,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const voiceModalSubStyle = {
  fontSize: '11px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '2px 0 0 0',
};

const micCenterBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px',
  margin: '12px 0 20px 0',
};

const micCircleGlowStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '32px',
  backgroundColor: PlayfulColors.hotMagenta,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 10px 28px rgba(255, 46, 149, 0.4)',
};

const waveformBarsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  height: '40px',
};

const waveBarStyle = {
  width: '5px',
  borderRadius: '3px',
  backgroundColor: PlayfulColors.inkBlack,
};

const speechTranscriptCardStyle = {
  backgroundColor: '#FAF9F6',
  borderRadius: '16px',
  padding: '12px 14px',
  marginBottom: '14px',
  border: `1px solid ${PlayfulColors.warmMist}`,
};

const speechTagStyle = {
  fontSize: '9px',
  fontWeight: 800,
  letterSpacing: '0.8px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const speechWordsStyle = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '4px 0 0 0',
};

const receiptCardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '14px',
  border: `1px solid ${PlayfulColors.sand}`,
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
};

const receiptRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '4px 0',
  borderBottom: '1px dashed #E5E7EB',
};

const receiptLabelStyle = {
  fontSize: '11px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const receiptValueStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const saveReceiptBtnStyle = {
  marginTop: '10px',
  width: '100%',
  backgroundColor: PlayfulColors.hotMagenta,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '12px',
  padding: '8px 0',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: PlayfulTypography.fontFamily,
};

const articleHeaderBoxStyle = {
  backgroundColor: '#FAF9F6',
  borderRadius: '20px',
  padding: '14px',
  marginBottom: '12px',
  border: `1px solid ${PlayfulColors.warmMist}`,
};

const articlePillTag = {
  fontSize: '9px',
  fontWeight: 800,
  letterSpacing: '1px',
  color: PlayfulColors.hotMagenta,
  fontFamily: PlayfulTypography.fontFamily,
};

const articleTitleStyle = {
  fontSize: '16px',
  fontWeight: 800,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '6px 0',
};

const articleExcerptStyle = {
  fontSize: '11px',
  lineHeight: 1.5,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  margin: 0,
};

const impactMiniGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '6px',
  marginBottom: '14px',
};

const impactMiniCard = {
  backgroundColor: '#FAF9F6',
  borderRadius: '12px',
  padding: '8px 6px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
};

const impactMiniNum = {
  fontSize: '12px',
  fontWeight: 800,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const impactMiniLbl = {
  fontSize: '8px',
  fontWeight: 600,
  color: PlayfulColors.stone,
  textTransform: 'uppercase',
};

const habitChallengeBox = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '12px',
  border: `1px solid ${PlayfulColors.warmMist}`,
};

const habitSectionHeader = {
  fontSize: '9px',
  fontWeight: 800,
  letterSpacing: '0.8px',
  color: PlayfulColors.stone,
};

const habitItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '8px',
};

const checkSquareChecked = {
  width: '18px',
  height: '18px',
  borderRadius: '6px',
  backgroundColor: PlayfulColors.hotMagenta,
  color: '#FFFFFF',
  fontSize: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
};

const checkSquareUnchecked = {
  width: '18px',
  height: '18px',
  borderRadius: '6px',
  border: `1.5px solid ${PlayfulColors.sand}`,
};

const habitItemTextStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const addVaultBtnMini = {
  width: '28px',
  height: '28px',
  borderRadius: '10px',
  backgroundColor: PlayfulColors.hotMagenta,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const vaultItemCard = {
  backgroundColor: '#FAF9F6',
  borderRadius: '16px',
  padding: '12px 14px',
  marginBottom: '10px',
  border: `1px solid ${PlayfulColors.warmMist}`,
};

const vaultNameText = {
  fontSize: '13px',
  fontWeight: 700,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const vaultPercentBadge = {
  fontSize: '10px',
  fontWeight: 800,
  color: PlayfulColors.hotMagenta,
};

const vaultNumbersRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: '6px',
};

const vaultCurrentAmount = {
  fontSize: '15px',
  fontWeight: 800,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
};

const vaultTotalAmount = {
  fontSize: '11px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const vaultTrackContainer = {
  width: '100%',
  height: '6px',
  borderRadius: '3px',
  backgroundColor: PlayfulColors.sand,
  overflow: 'hidden',
  marginBottom: '6px',
};

const vaultFillBar = {
  height: '100%',
  borderRadius: '3px',
};

const vaultDateNote = {
  fontSize: '9px',
  color: PlayfulColors.stone,
  fontFamily: PlayfulTypography.fontFamily,
};

const bottomAppTabBar = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '52px',
  backgroundColor: '#FFFFFF',
  borderTop: `1px solid ${PlayfulColors.warmMist}`,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '0 8px',
};

const bottomTabItem = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const centerAddAppBtn = {
  width: '36px',
  height: '36px',
  borderRadius: '14px',
  backgroundColor: PlayfulColors.hotMagenta,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '-14px',
  boxShadow: '0 4px 12px rgba(255, 46, 149, 0.4)',
};

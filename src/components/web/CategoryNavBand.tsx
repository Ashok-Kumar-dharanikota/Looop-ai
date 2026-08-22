import React from 'react';
import { WebColors, WebTypography } from '@/constants/web-tokens';

const TICKER_ITEMS = [
  '1-SECOND VOICE LOGGING',
  '•',
  'LOCAL-FIRST ON-DEVICE SQLITE',
  '•',
  'AI HABIT BIOGRAPHER',
  '•',
  'ZERO BANK LOGINS REQUIRED',
  '•',
  'MILESTONE SAVINGS VAULTS',
  '•',
  'HEALTH & SLEEP RECOVERY',
  '•',
  'SAFE DAILY SPEND PACING',
  '•',
  'BIOMETRIC FACE ID SECURITY',
  '•',
  '100% PRIVATE & OFFLINE-READY',
];

export const CategoryNavBand: React.FC = () => {
  return (
    <div style={navBandWrapperStyle as any}>
      <div style={marqueeContainerStyle as any}>
        <div className="animate-ticker" style={tickerContentStyle as any}>
          {TICKER_ITEMS.concat(TICKER_ITEMS).concat(TICKER_ITEMS).map((item, index) => (
            <span
              key={index}
              style={{
                ...tickerItemStyle,
                color: item === '•' ? WebColors.primaryOrange : '#FFFFFF',
              } as any}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const navBandWrapperStyle = {
  width: '100%',
  backgroundColor: WebColors.inkSlate,
  padding: '16px 0',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const marqueeContainerStyle = {
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  display: 'flex',
};

const tickerContentStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '32px',
};

const tickerItemStyle = {
  fontSize: '12.5px',
  fontWeight: '700',
  letterSpacing: '1.2px',
  fontFamily: WebTypography.displayFont,
};

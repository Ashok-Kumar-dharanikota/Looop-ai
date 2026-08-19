import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayfulColors, PlayfulTypography } from '@/constants/playful-tokens';

const TICKER_ITEMS = [
  'HABIT LOOP PSYCHOLOGY',
  '•',
  '3D IMPACT MATRIX',
  '•',
  '2-SECOND VOICE LOGGING',
  '•',
  'MEDIUM-STYLE ESSAYS',
  '•',
  'MILESTONE SAVINGS VAULTS',
  '•',
  'HEALTH & SLEEP RECOVERY',
  '•',
  'LOCAL-FIRST PRIVACY',
  '•',
  'ZERO GUILT BUDGETING',
  '•',
  'REAL-TIME RUN RATE',
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
                color: item === '•' ? PlayfulColors.hotMagenta : '#FFFFFF',
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
  backgroundColor: PlayfulColors.inkBlack,
  padding: '16px 0',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
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
  gap: '28px',
};

const tickerItemStyle = {
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '1.2px',
  fontFamily: PlayfulTypography.fontFamily,
};

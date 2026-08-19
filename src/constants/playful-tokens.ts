/**
 * Playful Design System Tokens
 * Style Reference: Warm oat canvas, single hot-pink (#ff2e95) chromatic voice,
 * heavy Inter italic display typography, 44px card radii, and pill CTA composites.
 */

export const PlayfulColors = {
  // Primary Chromatic Voice
  hotMagenta: '#ff2e95',

  // Ink & Monochrome
  inkBlack: '#000000',
  softInk: '#111111',
  slate: '#0f172a',
  charcoal: '#414040',
  stone: '#848383',
  midnight: '#202126',

  // Warm Surfaces & Canvas
  oatCanvas: '#f6f2ee',
  paperWhite: '#ffffff',
  warmMist: '#e8e5e0',
  sand: '#e2dcd6',
  driftwood: '#c3c1bf',
} as const;

export const PlayfulShadows = {
  // Signature dual-layer diffused card shadow stack
  cardStack: 'rgba(0, 0, 0, 0.22) 0px 32px 80px 0px, rgba(0, 0, 0, 0.08) 0px 2px 8px 0px',
  cardHover: 'rgba(0, 0, 0, 0.28) 0px 40px 96px 0px, rgba(0, 0, 0, 0.1) 0px 4px 12px 0px',
  buttonPill: 'none', // Buttons do not receive drop shadows in Playful system
} as const;

export const PlayfulRadii = {
  tags: 999,
  cards: 44,
  images: 16,
  inputs: 99,
  buttons: 99,
} as const;

export const PlayfulTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: {
    fontSize: 76,
    lineHeight: 1.02,
    letterSpacing: '-0.002em',
    fontWeight: '900',
    fontStyle: 'italic',
  },
  displayMobile: {
    fontSize: 44,
    lineHeight: 1.08,
    letterSpacing: '-0.002em',
    fontWeight: '900',
    fontStyle: 'italic',
  },
  headingSm: {
    fontSize: 30,
    lineHeight: 1.2,
    letterSpacing: '-0.06px',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  subheading: {
    fontSize: 26,
    lineHeight: 1.25,
    letterSpacing: '-0.052px',
    fontWeight: '600',
  },
  bodyLg: {
    fontSize: 18,
    lineHeight: 1.6,
    letterSpacing: '-0.036px',
    fontWeight: '400',
  },
  body: {
    fontSize: 16,
    lineHeight: 1.55,
    letterSpacing: '-0.032px',
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    lineHeight: 1.4,
    letterSpacing: '-0.026px',
    fontWeight: '500',
  },
} as const;

/**
 * Looop Web Design System Tokens
 * Grounded in the Auth & Onboarding Visual System:
 * Warm bone canvas (#FAF9F6), radiant sunset amber (#FF6B00 -> #FF4D00),
 * deep slate ink (#0F172A), crisp paper surfaces (#FFFFFF), and Plus Jakarta Sans / Inter typography.
 */

export const WebColors = {
  // Brand Radiant Sunset Voices
  primaryOrange: '#FF6B00',
  accentOrange: '#EA580C',
  deepOrange: '#C2410C',
  orangeGlow: 'rgba(255, 107, 0, 0.25)',
  orangeSubtleGlow: 'rgba(255, 107, 0, 0.12)',

  // Soft Cream & Amber Tints
  creamSoft: '#FFF7ED',
  creamBorder: '#FFEDD5',
  creamBorderStrong: '#FFD8A8',

  // Canvas & Surfaces
  canvas: '#FAF9F6',
  cardWhite: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',

  // Ink & Typography
  inkSlate: '#0F172A',
  subSlate: '#475569',
  mutedSlate: '#64748B',
  placeholderSlate: '#94A3B8',

  // Borders & Dividers
  borderHairline: '#F1F5F9',
  borderCard: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Status & Secondary Accents
  emerald: '#059669',
  emeraldSoft: '#ECFDF5',
  emeraldBorder: '#A7F3D0',

  azure: '#0284C7',
  azureSoft: '#E0F2FE',
  azureBorder: '#BAE6FD',

  coral: '#EF4444',
  coralSoft: '#FEE2E2',
  coralBorder: '#FECACA',

  violet: '#7C3AED',
  violetSoft: '#F3E8FF',
  violetBorder: '#DDD6FE',
} as const;

export const WebGradients = {
  primarySunset: 'linear-gradient(135deg, #FF7A00 0%, #FF4D00 100%)',
  primarySunsetHover: 'linear-gradient(135deg, #FF8A1A 0%, #FF5A1A 100%)',
  emeraldGrowth: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  azureCalm: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
  ambientHeroGlow: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 107, 0, 0.14) 0%, rgba(255, 122, 0, 0.05) 50%, rgba(250, 249, 246, 0) 100%)',
} as const;

export const WebShadows = {
  cardRest: '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
  cardHover: '0 12px 30px rgba(15, 23, 42, 0.08), 0 4px 10px rgba(15, 23, 42, 0.04)',
  buttonPrimary: '0 4px 14px rgba(255, 107, 0, 0.28)',
  buttonPrimaryHover: '0 6px 20px rgba(255, 107, 0, 0.38)',
  floatingMockup: '0 24px 60px rgba(15, 23, 42, 0.12), 0 8px 24px rgba(15, 23, 42, 0.06)',
} as const;

export const WebTypography = {
  displayFont: "'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const;

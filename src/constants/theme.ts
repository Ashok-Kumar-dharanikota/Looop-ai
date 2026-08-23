import '@/global.css';
import { Platform } from 'react-native';

/**
 * Core Looop Theme Tokens
 * Harmonized with Auth & Onboarding Visual Design Language
 */

export const ThemeColors = {
  // Ambient Canvas & Surfaces
  canvas: '#FAF9F6',
  card: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceActive: '#FFF7ED',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  borderActive: '#FFEDD5',

  // Ink Typography
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Brand Accents
  primary: '#FF6B00',
  primaryHover: '#EA580C',
  primarySoft: '#FFF7ED',
  primaryBorder: '#FFEDD5',

  // Secondary Chromatic Voices
  violet: '#7C3AED',
  violetHover: '#6D28D9',
  violetSoft: '#F3E8FF',
  violetBorder: '#DDD6FE',

  emerald: '#059669',
  emeraldSoft: '#ECFDF5',
  emeraldBorder: '#A7F3D0',

  rose: '#EF4444',
  roseSoft: '#FEE2E2',
  roseBorder: '#FECACA',

  sky: '#0284C7',
  skySoft: '#E0F2FE',
  skyBorder: '#BAE6FD',

  amber: '#D97706',
  amberSoft: '#FEF3C7',
  amberBorder: '#FDE68A',
} as const;

export const Colors = {
  light: {
    background: ThemeColors.canvas,
    backgroundElement: ThemeColors.surface,
    backgroundSelected: ThemeColors.primarySoft,
    card: ThemeColors.card,
    border: ThemeColors.border,
    borderSubtle: ThemeColors.borderSubtle,
    text: ThemeColors.textPrimary,
    textSecondary: ThemeColors.textSecondary,
    textMuted: ThemeColors.textMuted,
    primary: ThemeColors.primary,
    violet: ThemeColors.violet,
    emerald: ThemeColors.emerald,
    rose: ThemeColors.rose,
    sky: ThemeColors.sky,
    amber: ThemeColors.amber,
  },
  dark: {
    background: '#0B0F19',
    backgroundElement: '#131B2E',
    backgroundSelected: '#1E293B',
    card: '#111827',
    border: '#1F2937',
    borderSubtle: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: ThemeColors.primary,
    violet: '#8B5CF6',
    emerald: '#10B981',
    rose: '#F87171',
    sky: '#38BDF8',
    amber: '#FBBF24',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const AppFonts = {
  // Outfit (Display & Numerical Clarity)
  outfit: {
    semiBold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
    extraBold: 'Outfit_800ExtraBold',
    black: 'Outfit_900Black',
  },
  // Plus Jakarta Sans (Headlines, Titles, UI Controls)
  jakarta: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
    extraBold: 'PlusJakartaSans_800ExtraBold',
  },
  // Inter (Body text & Subtext)
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
} as const;

export const Typography = {
  heroDisplay: {
    fontFamily: AppFonts.outfit.extraBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: ThemeColors.textPrimary,
  },
  sectionTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: ThemeColors.textPrimary,
  },
  cardHeadline: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.3,
    color: ThemeColors.textPrimary,
  },
  subHeadline: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: ThemeColors.textPrimary,
  },
  body: {
    fontFamily: AppFonts.jakarta.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
    color: ThemeColors.textPrimary,
  },
  bodySecondary: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 13,
    lineHeight: 18,
    color: ThemeColors.textSecondary,
  },
  microBadge: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
} as const;

export const Radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  glowAmber: {
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  glowViolet: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

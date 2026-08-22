import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { WebColors, WebGradients, WebShadows, WebTypography } from '@/constants/web-tokens';

interface WebHeaderProps {
  onCtaPress?: () => void;
}

export const WebHeader: React.FC<WebHeaderProps> = ({ onCtaPress }) => {
  const router = useRouter();

  const handleNavClick = (anchorId: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
  };

  return (
    <header style={headerWrapperStyle as any}>
      <View style={styles.headerInner}>
        {/* Brand Wordmark with Sunset Sparkle Badge */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/' as any)}
          style={styles.brandRow}
        >
          <Text style={styles.logoText}>Looop</Text>
          <View style={styles.sparkleBadge}>
            <Sparkles size={13} color={WebColors.primaryOrange} />
          </View>
        </TouchableOpacity>

        {/* Desktop Navigation Links */}
        <View style={styles.navLinksRow}>
          <TouchableOpacity
            onPress={() => handleNavClick('features')}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>Features</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavClick('impact')}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>3D Impact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavClick('stories')}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>Habit Stories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavClick('faq')}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>FAQ</Text>
          </TouchableOpacity>
        </View>

        {/* Right Action: Sunset Gradient VIP Early Access Pill */}
        <View style={styles.headerRight}>
          <button
            type="button"
            onClick={onCtaPress || (() => handleNavClick('waitlist'))}
            style={ctaButtonStyle as any}
          >
            <span>Get Early Access</span>
            <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.4} />
          </button>
        </View>
      </View>
    </header>
  );
};

const headerWrapperStyle = {
  width: '100%',
  backgroundColor: 'rgba(250, 249, 246, 0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: `1px solid ${WebColors.borderHairline}`,
  transition: 'background-color 0.2s ease',
};

const ctaButtonStyle = {
  background: WebGradients.primarySunset,
  color: '#FFFFFF',
  padding: '10px 20px',
  borderRadius: '999px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  border: 'none',
  fontSize: '14.5px',
  fontWeight: '700',
  fontFamily: WebTypography.displayFont,
  letterSpacing: '-0.2px',
  boxShadow: WebShadows.buttonPrimary,
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

const styles = StyleSheet.create({
  headerInner: {
    maxWidth: 1200,
    marginHorizontal: 'auto' as any,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    fontWeight: '800',
    color: WebColors.inkSlate,
    letterSpacing: -0.6,
  },
  sparkleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: WebColors.creamSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WebColors.creamBorder,
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    display: Platform.OS === 'web' ? ('flex' as any) : 'none',
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  navText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: WebColors.subSlate,
    fontFamily: 'Inter_600SemiBold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

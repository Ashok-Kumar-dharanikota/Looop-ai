import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { PlayfulColors, PlayfulTypography } from '@/constants/playful-tokens';

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
    <header style={webHeaderStyle as any}>
      <View style={styles.headerInner}>
        {/* Logo Wordmark */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/' as any)}
          style={styles.logoRow}
        >
          <View style={styles.logoIcon}>
            <View style={styles.logoInnerCircle} />
          </View>
          <Text style={styles.logoText}>looop</Text>
        </TouchableOpacity>

        {/* Desktop Nav Links */}
        <View style={styles.navLinksRow}>
          <TouchableOpacity onPress={() => handleNavClick('features')} style={styles.navItem}>
            <Text style={styles.navText}>Features</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavClick('impact')} style={styles.navItem}>
            <Text style={styles.navText}>3D Impact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavClick('essays')} style={styles.navItem}>
            <Text style={styles.navText}>Stories</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavClick('faq')} style={styles.navItem}>
            <Text style={styles.navText}>FAQ</Text>
          </TouchableOpacity>
        </View>

        {/* Right CTA */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onCtaPress || (() => handleNavClick('waitlist'))}
            style={styles.pillCta}
          >
            <Text style={styles.pillCtaText}>Get Early Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    </header>
  );
};

const webHeaderStyle = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: `1px solid ${PlayfulColors.warmMist}`,
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
    paddingVertical: 18,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: PlayfulColors.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: PlayfulColors.hotMagenta,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    color: PlayfulColors.hotMagenta,
    fontFamily: PlayfulTypography.fontFamily,
    letterSpacing: -0.5,
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
    fontSize: 15,
    fontWeight: '500',
    color: PlayfulColors.charcoal,
    fontFamily: PlayfulTypography.fontFamily,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pillCta: {
    backgroundColor: PlayfulColors.hotMagenta,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: PlayfulTypography.fontFamily,
    letterSpacing: -0.2,
  },
});

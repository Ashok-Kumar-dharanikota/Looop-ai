import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { WebHeader } from '@/components/web/WebHeader';
import { WebFooter } from '@/components/web/WebFooter';
import { PlayfulColors, PlayfulTypography } from '@/constants/playful-tokens';
import { Smartphone, ArrowRight } from 'lucide-react-native';

export default function TabsWebLayout() {
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div style={containerStyle as any}>
      <WebHeader />
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Smartphone size={32} color={PlayfulColors.hotMagenta} />
          </View>
          <Text style={styles.title}>Experience Looop on Mobile</Text>
          <Text style={styles.subtitle}>
            Looop is a local-first personal finance companion built with fluid haptics, voice logging, and on-device SQLite designed specifically for iOS and Android.
          </Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => router.replace('/' as any)}
          >
            <Text style={styles.buttonText}>Explore Promotional Showcase</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <WebFooter />
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: PlayfulColors.oatCanvas,
  justifyContent: 'space-between',
};

const styles = StyleSheet.create({
  contentContainer: {
    maxWidth: 720,
    marginHorizontal: 'auto' as any,
    paddingHorizontal: 24,
    paddingVertical: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 48,
    alignItems: 'center',
    textAlign: 'center' as any,
    borderWidth: 1,
    borderColor: PlayfulColors.warmMist,
    boxShadow: '0 20px 40px rgba(0,0,0,0.06)' as any,
    width: '100%',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: PlayfulColors.inkBlack,
    fontFamily: PlayfulTypography.fontFamily,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: PlayfulColors.charcoal,
    fontFamily: PlayfulTypography.fontFamily,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: PlayfulColors.inkBlack,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: PlayfulTypography.fontFamily,
  },
});

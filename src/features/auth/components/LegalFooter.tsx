import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const LegalFooter = memo(function LegalFooter() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        {t('auth.legalPrefix', 'By continuing, you agree to our ')}
        <Text
          style={styles.legalLink}
          onPress={() => router.push('/terms-of-use' as any)}
          accessibilityRole="link"
          accessibilityLabel={t('auth.termsOfUse', 'Terms of Use')}
        >
          {t('auth.termsOfUse', 'Terms of Use')}
        </Text>
        {t('auth.and', ' and ')}
        <Text
          style={styles.legalLink}
          onPress={() => router.push('/privacy-policy' as any)}
          accessibilityRole="link"
          accessibilityLabel={t('auth.privacyPolicy', 'Privacy Policy')}
        >
          {t('auth.privacyPolicy', 'Privacy Policy')}
        </Text>
        .
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  footerContainer: {
    paddingTop: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  legalLink: {
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    textDecorationLine: 'underline',
  },
});

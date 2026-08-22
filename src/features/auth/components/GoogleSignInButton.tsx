import React, { memo } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { GoogleColorIcon } from './GoogleColorIcon';

interface GoogleSignInButtonProps {
  onPress: () => void;
  isSigningIn: boolean;
}

export const GoogleSignInButton = memo(function GoogleSignInButton({
  onPress,
  isSigningIn,
}: GoogleSignInButtonProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        onPressIn={() => !isSigningIn && (scale.value = withSpring(0.98, { damping: 15 }))}
        onPressOut={() => !isSigningIn && (scale.value = withSpring(1, { damping: 15 }))}
        onPress={onPress}
        disabled={isSigningIn}
        style={[
          styles.googleButton,
          isSigningIn && styles.googleButtonDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={t('auth.googleButton', 'Continue with Google')}
        accessibilityHint="Sign in using your Google account with cloud backup"
      >
        {isSigningIn ? (
          <ActivityIndicator
            size="small"
            color="#FF6B00"
            style={styles.spinner}
          />
        ) : (
          <View style={styles.googleIconContainer}>
            <GoogleColorIcon size={20} />
          </View>
        )}
        <Text style={styles.googleButtonText}>
          {isSigningIn
            ? t('auth.signingIn', 'Connecting to Google...')
            : t('auth.googleButton', 'Continue with Google')}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
  },
  googleButtonDisabled: {
    opacity: 0.75,
  },
  googleIconContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 10,
  },
  googleButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
});

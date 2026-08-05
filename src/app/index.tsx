import AnimatedInput from '@/components';
import { useRouter } from 'expo-router';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [guestName, setGuestName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Animated scale for primary button
  const buttonScale = useSharedValue(1);
  const googleScale = useSharedValue(1);

  const primaryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const googleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: googleScale.value }],
  }));

  const handleContinue = () => {
    // Navigate directly to home tabs
    router.replace('/(tabs)' as any);
  };

  return (
    // <AnimatedMeshGradient>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Logo & Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoRow}>
              <Text style={[styles.logoText, { color: '#000000' }]}>
                Savio
              </Text>
              <View style={styles.sparkleBadge}>
                <Sparkles size={14} color="#000000" />
              </View>
            </View>

            <Text style={[styles.mainHeading, { color: '#000000' }]}>
              Track less.{'\n'}Understand more.
            </Text>

            <Text style={[styles.subHeading, { color: 'rgba(0, 0, 0, 0.85)' }]}>
              AI finance companion that helps you spend smarter.
            </Text>
          </View>

          {/* Bottom Auth Section - Pushed completely to bottom */}
          <View style={styles.bottomSection}>
            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Animated Name Input Field */}
              <AnimatedInput
                placeholders={[
                  'Enter your guest name...',
                  'Alex Morgan',
                  'Guest Explorer',
                  'Smart Saver',
                  'Creative Traveler',
                ]}
                value={guestName}
                onChangeText={setGuestName}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={false}
                containerStyle={{
                  width: '100%',
                  marginVertical: 0,
                  marginBottom: 16,
                }}
                inputWrapperStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: isFocused
                    ? '#000000'
                    : 'rgba(0, 0, 0, 0.2)',
                  borderWidth: 1.5,
                  borderRadius: 16,
                  height: 56,
                  paddingHorizontal: 16,
                }}
                inputStyle={{
                  color: '#000000',
                  fontSize: 16,
                  fontWeight: '500',
                }}
                placeholderStyle={{
                  color: 'rgba(0, 0, 0, 0.65)',
                  fontSize: 16,
                  fontWeight: '400',
                }}
              />

              {/* Primary Join as Guest Button */}
              <Animated.View style={[primaryAnimatedStyle, styles.buttonMargin]}>
                <Pressable
                  onPressIn={() => (buttonScale.value = withSpring(0.97))}
                  onPressOut={() => (buttonScale.value = withSpring(1))}
                  onPress={handleContinue}
                  style={[
                    styles.primaryButton,
                    {
                      backgroundColor: '#000000',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: '#FFFFFF' },
                    ]}
                  >
                    Join as Guest
                  </Text>
                  <ArrowRight
                    size={18}
                    color="#FFFFFF"
                    style={{ marginLeft: 8 }}
                  />
                </Pressable>
              </Animated.View>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: 'rgba(0, 0, 0, 0.15)' }]} />
                <Text style={[styles.dividerText, { color: '#000000' }]}>
                  OR
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: 'rgba(0, 0, 0, 0.15)' }]} />
              </View>

              {/* Secondary Google Button */}
              <Animated.View style={googleAnimatedStyle}>
                <Pressable
                  onPressIn={() => (googleScale.value = withSpring(0.97))}
                  onPressOut={() => (googleScale.value = withSpring(1))}
                  onPress={handleContinue}
                  style={[
                    styles.secondaryButton,
                    {
                      backgroundColor: '#FFFFFF',
                      borderColor: 'rgba(0, 0, 0, 0.25)',
                    },
                  ]}
                >
                  <View style={styles.googleGContainer}>
                    <Text style={styles.googleG}>G</Text>
                  </View>
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: '#000000' },
                    ]}
                  >
                    Continue with Google
                  </Text>
                </Pressable>
              </Animated.View>
            </View>

            {/* Legal Footer */}
            <View style={styles.footerContainer}>
              <Text style={[styles.footerText, { color: 'rgba(0, 0, 0, 0.8)' }]}>
                By signing up, you agree to our{' '}
                <Text
                  style={[styles.legalLink, { color: '#000000' }]}
                  onPress={() => router.push('/terms-of-use')}
                >
                  Terms
                </Text>{' '}
                and{' '}
                <Text
                  style={[styles.legalLink, { color: '#000000' }]}
                  onPress={() => router.push('/privacy-policy')}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    // </AnimatedMeshGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
  },
  headerContainer: {
    marginTop: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 34,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: -0.5,
  },
  sparkleBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sparkleIcon: {
    fontSize: 18,
    color: '#000000',
  },
  mainHeading: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    maxWidth: 300,
  },
  bottomSection: {
    marginTop: 'auto',
    width: '100%',
    paddingTop: 24,
  },
  formContainer: {
    width: '100%',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#000000',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonMargin: {
    marginBottom: 16,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  arrowIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginHorizontal: 16,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  googleGContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleG: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  legalLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});


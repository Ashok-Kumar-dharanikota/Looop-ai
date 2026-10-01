import React, { memo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemeColors } from '@/constants/theme';

interface EmailAuthCardProps {
  onSuccess: (user: any) => void;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  isSigningIn: boolean;
}

export const EmailAuthCard = memo(function EmailAuthCard({
  onSuccess,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  isSigningIn,
}: EmailAuthCardProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleModeSwitch = (newMode: 'signin' | 'signup') => {
    Haptics.selectionAsync();
    setMode(newMode);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    try {
      if (mode === 'signin') {
        const result = await signInWithEmail(cleanEmail, password);
        if (result.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSuccess(result.firebaseUser);
        } else if (result.error) {
          setErrorMessage(result.error);
        }
      } else {
        const result = await signUpWithEmail(cleanEmail, password, name.trim());
        if (result.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSuccess(result.firebaseUser);
        } else if (result.error) {
          setErrorMessage(result.error);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      Alert.alert(
        'Email Required',
        'Please enter your email address in the field above to receive a password reset link.'
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsResetting(true);
    try {
      const res = await resetPassword(cleanEmail);
      if (res.success) {
        Alert.alert(
          'Password Reset Email Sent 📬',
          `We've sent a link to ${cleanEmail}. Please check your inbox and spam folder.`
        );
      } else {
        Alert.alert('Reset Failed', res.error || 'Unable to send reset email.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Unable to send reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Mode Switcher Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleModeSwitch('signin')}
          style={[styles.tabBtn, mode === 'signin' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, mode === 'signin' && styles.tabBtnTextActive]}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleModeSwitch('signup')}
          style={[styles.tabBtn, mode === 'signup' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, mode === 'signup' && styles.tabBtnTextActive]}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.formGroup}>
        {/* Name (Only in Sign Up mode) */}
        {mode === 'signup' && (
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'name' && styles.inputWrapperFocused,
              ]}
            >
              <User
                size={18}
                color={focusedField === 'name' ? ThemeColors.primary : ThemeColors.textMuted}
                strokeWidth={2}
                style={styles.fieldIcon}
              />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name (optional)"
                placeholderTextColor={ThemeColors.textMuted}
                autoCapitalize="words"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={styles.textInput}
              />
            </View>
          </Animated.View>
        )}

        {/* Email */}
        <View
          style={[
            styles.inputWrapper,
            focusedField === 'email' && styles.inputWrapperFocused,
          ]}
        >
          <Mail
            size={18}
            color={focusedField === 'email' ? ThemeColors.primary : ThemeColors.textMuted}
            strokeWidth={2}
            style={styles.fieldIcon}
          />
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Email address"
            placeholderTextColor={ThemeColors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            style={styles.textInput}
          />
        </View>

        {/* Password */}
        <View
          style={[
            styles.inputWrapper,
            focusedField === 'password' && styles.inputWrapperFocused,
          ]}
        >
          <Lock
            size={18}
            color={focusedField === 'password' ? ThemeColors.primary : ThemeColors.textMuted}
            strokeWidth={2}
            style={styles.fieldIcon}
          />
          <TextInput
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder={mode === 'signup' ? 'Password (min. 6 characters)' : 'Password'}
            placeholderTextColor={ThemeColors.textMuted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.visibilityToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? (
              <EyeOff size={18} color={ThemeColors.textMuted} />
            ) : (
              <Eye size={18} color={ThemeColors.textMuted} />
            )}
          </TouchableOpacity>
        </View>

        {/* Forgot Password Link (Sign In mode) */}
        {mode === 'signin' && (
          <TouchableOpacity
            onPress={handleForgotPassword}
            disabled={isResetting}
            style={styles.forgotPasswordBtn}
          >
            <Text style={styles.forgotPasswordText}>
              {isResetting ? 'Sending reset link...' : 'Forgot password?'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Error message */}
        {errorMessage && (
          <Animated.View entering={FadeIn.duration(200)}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Animated.View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleSubmit}
          disabled={isSigningIn}
          style={styles.submitBtnContainer}
        >
          <LinearGradient
            colors={[ThemeColors.primary, ThemeColors.primaryHover]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitBtn}
          >
            {isSigningIn ? (
              <ActivityIndicator size="small" color={ThemeColors.textInverse} />
            ) : (
              <>
                <Text style={styles.submitBtnText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
                <ArrowRight size={18} color={ThemeColors.textInverse} strokeWidth={2.2} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: ThemeColors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: 16,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.surface,
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: ThemeColors.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ThemeColors.textSecondary,
  },
  tabBtnTextActive: {
    color: ThemeColors.primary,
    fontWeight: '700',
  },
  formGroup: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
    paddingHorizontal: 12,
    height: 50,
  },
  inputWrapperFocused: {
    borderColor: ThemeColors.primary,
    backgroundColor: ThemeColors.card,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: ThemeColors.textPrimary,
    height: '100%',
  },
  visibilityToggle: {
    padding: 4,
  },
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.primary,
  },
  errorText: {
    fontSize: 12,
    color: ThemeColors.rose,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  submitBtnContainer: {
    marginTop: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitBtn: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: ThemeColors.textInverse,
  },
});

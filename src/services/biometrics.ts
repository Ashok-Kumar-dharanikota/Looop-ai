import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { BiometricType } from '@/store/use-app-store';

export interface BiometricCheckResult {
  hasHardware: boolean;
  isEnrolled: boolean;
  biometricType: BiometricType;
  biometricName: string;
}

/**
 * Checks hardware capabilities and enrollment status for biometric Fingerprint Lock.
 */
export async function checkBiometricsSupport(): Promise<BiometricCheckResult> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: BiometricType = 'fingerprint';
    let biometricName = 'Fingerprint Lock';

    if (hasHardware) {
      biometricType = 'fingerprint';
      biometricName = Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint Lock';
    }

    return {
      hasHardware,
      isEnrolled,
      biometricType,
      biometricName,
    };
  } catch (error) {
    console.warn('Biometric support check error:', error);
    return {
      hasHardware: false,
      isEnrolled: false,
      biometricType: 'fingerprint',
      biometricName: 'Fingerprint Lock',
    };
  }
}

/**
 * Invokes native biometric prompt with fingerprint focus.
 */
export async function authenticateWithBiometrics(
  promptMessage = 'Scan your fingerprint to unlock Looop'
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      fallbackLabel: 'Use Device Passcode',
      disableDeviceFallback: false,
    });

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return { success: true };
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return {
        success: false,
        error: result.error || 'Authentication canceled or failed',
      };
    }
  } catch (error: any) {
    console.warn('Biometric authentication error:', error);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    return {
      success: false,
      error: error?.message || 'Biometric authentication failed',
    };
  }
}

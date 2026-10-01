import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModifierConfig {
  $type: string;
  $scope?: string;
  [key: string]: unknown;
}

export interface NativeCardProps {
  children: ReactNode;
  /**
   * Standard React Native / Universal ViewStyle (e.g. styles.card).
   * BackgroundColor, borderColor, borderWidth, borderRadius, padding, elevation, etc.
   * are extracted and mapped to native platform modifiers and props.
   */
  style?: StyleProp<ViewStyle>;
  /** Optional direct override for background color */
  backgroundColor?: string;
  /** Optional direct override for border color */
  borderColor?: string;
  /** Optional direct override for border width in dp */
  borderWidth?: number;
  /** Optional direct override for corner radius in dp */
  borderRadius?: number;
  /** Optional direct override for inner padding in dp */
  padding?: number;
  /** Optional elevation in dp (Android Jetpack Compose) */
  elevation?: number;
  /** Optional platform-specific modifiers escape hatch */
  modifiers?: ModifierConfig[];
  testID?: string;
}

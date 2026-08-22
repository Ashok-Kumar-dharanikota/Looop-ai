import React, { memo, useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { User, ArrowRight, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface GuestLoginCardProps {
  guestName: string;
  onChangeGuestName: (text: string) => void;
  onSubmit: () => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  hasError: boolean;
}

export const GuestLoginCard = memo(function GuestLoginCard({
  guestName,
  onChangeGuestName,
  onSubmit,
  isFocused,
  onFocus,
  onBlur,
  hasError,
}: GuestLoginCardProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const inputRef = useRef<TextInput>(null);

  // Rotating placeholder hints
  const placeholders = [
    t('auth.guestPlaceholder', 'Enter your name to explore...'),
    'e.g. Alex',
    'e.g. Maya',
    'e.g. Jordan',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (isFocused || guestName.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isFocused, guestName.length, placeholders.length]);

  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleClear = () => {
    onChangeGuestName('');
    inputRef.current?.focus();
  };

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={[
        styles.cardContainer,
        isFocused && styles.cardContainerFocused,
        hasError && styles.cardContainerError,
      ]}
    >
      {/* Left Icon Orb */}
      <View style={[styles.iconOrb, isFocused && styles.iconOrbFocused]}>
        <User
          size={16}
          color={isFocused ? '#FF6B00' : hasError ? '#EF4444' : '#64748B'}
          strokeWidth={2.2}
        />
      </View>

      {/* Main Clean TextInput */}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          value={guestName}
          onChangeText={onChangeGuestName}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholders[placeholderIndex]}
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={32}
          returnKeyType="go"
          onSubmitEditing={onSubmit}
          selectionColor="#FF6B00"
          cursorColor="#FF6B00"
          style={styles.textInput}
          accessibilityLabel="Guest Name Input"
          accessibilityHint="Type your name or nickname to continue as guest"
        />
      </View>

      {/* Clear Button (appears when text is present) */}
      {guestName.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(140)}
          style={styles.clearBtnWrapper}
        >
          <Pressable
            onPress={handleClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear text"
          >
            <X size={13} color="#94A3B8" strokeWidth={2.4} />
          </Pressable>
        </Animated.View>
      )}

      {/* Right Gradient Action Button */}
      <Animated.View style={animatedBtnStyle}>
        <Pressable
          onPressIn={() => (scale.value = withSpring(0.92, { damping: 14 }))}
          onPressOut={() => (scale.value = withSpring(1, { damping: 14 }))}
          onPress={onSubmit}
          accessibilityRole="button"
          accessibilityLabel="Explore as Guest"
          accessibilityHint="Submit name and explore app"
          style={styles.actionButtonPressable}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <LinearGradient
            colors={['#FF7A00', '#FF4D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionButtonGradient}
          >
            <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.4} />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingLeft: 8,
    paddingRight: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContainerFocused: {
    borderColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContainerError: {
    borderColor: '#EF4444',
  },
  iconOrb: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconOrbFocused: {
    backgroundColor: '#FFF7ED',
  },
  inputWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14.5,
    color: '#0F172A',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 40,
  },
  clearBtnWrapper: {
    marginRight: 6,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressable: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});

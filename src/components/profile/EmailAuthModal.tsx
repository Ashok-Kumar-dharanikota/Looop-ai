import React, { memo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, CloudCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ThemeColors } from '@/constants/theme';
import { EmailAuthCard } from '@/features/auth/components/EmailAuthCard';
import { useAuth } from '@/hooks/use-auth';
import { useUserStore } from '@/store/use-user-store';

interface EmailAuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EmailAuthModal = memo(function EmailAuthModal({
  visible,
  onClose,
}: EmailAuthModalProps) {
  const { signInWithEmail, signUpWithEmail, resetPassword, isSigningIn } = useAuth();

  const handleSuccess = (firebaseUser: any) => {
    useUserStore.getState().setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email || null,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
    });
    onClose();
  };

  const handleClose = () => {
    Haptics.selectionAsync();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIconRow}>
                <View style={styles.iconCircle}>
                  <CloudCheck size={20} color={ThemeColors.primary} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Account & Sync</Text>
                  <Text style={styles.headerSub}>
                    Sign in with email to back up your financial data
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Email & Password Card */}
            <View style={styles.formContainer}>
              <EmailAuthCard
                signInWithEmail={signInWithEmail}
                signUpWithEmail={signUpWithEmail}
                resetPassword={resetPassword}
                onSuccess={handleSuccess}
                isSigningIn={isSigningIn}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ThemeColors.canvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
    color: ThemeColors.textSecondary,
    marginTop: 2,
    maxWidth: 240,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThemeColors.card,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginBottom: 8,
  },
});

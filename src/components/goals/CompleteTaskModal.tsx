import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Coins,
  ArrowRight,
  RotateCcw,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeeklyGoal, MilestoneVault } from '@/db/schema';
import { useAppStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CompleteTaskModalProps {
  visible: boolean;
  onClose: () => void;
  task: WeeklyGoal | null;
  activeVault: MilestoneVault | null;
  onConfirmSavings: (taskId: string, amount: number) => Promise<void>;
  onUnmarkTask?: (taskId: string) => Promise<void>;
}

export const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
  visible,
  onClose,
  task,
  activeVault,
  onConfirmSavings,
  onUnmarkTask,
}) => {
  const insets = useSafeAreaInsets();
  const { currencySymbol = '₹' } = useAppStore();
  const [savingsInput, setSavingsInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize input when modal opens with task
  useEffect(() => {
    if (task) {
      const defaultAmt = task.savingsAmount || 500;
      setSavingsInput(String(defaultAmt));
    }
  }, [task, visible]);

  const defaultAmt = task?.savingsAmount || 500;

  // Generate dynamic preset chips centered around the task's estimate
  const presetChips = useMemo(() => {
    const base = defaultAmt > 0 ? defaultAmt : 500;
    const p1 = Math.max(Math.round((base * 0.6) / 50) * 50, 100);
    const p2 = base;
    const p3 = Math.round((base * 1.4) / 50) * 50;
    const p4 = Math.round((base * 2.0) / 100) * 100;
    return Array.from(new Set([p1, p2, p3, p4])).sort((a, b) => a - b);
  }, [defaultAmt]);

  if (!task) return null;

  const isCompleted = Boolean(task.completed);
  const parsedAmount = parseFloat(savingsInput.replace(/[^0-9.]/g, '')) || 0;

  const handleSelectChip = (amt: number) => {
    Haptics.selectionAsync();
    setSavingsInput(String(amt));
  };

  const handleConfirm = async () => {
    if (parsedAmount <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    setIsSubmitting(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onConfirmSavings(task.id, Math.round(parsedAmount));
      onClose();
    } catch (e) {
      console.warn('Error completing task:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnmark = async () => {
    if (!onUnmarkTask) return;
    setIsSubmitting(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onUnmarkTask(task.id);
      onClose();
    } catch (e) {
      console.warn('Error unmarking task:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.badgeContainer}>
              <Sparkles size={14} color="#7C3AED" />
              <Text style={styles.badgeText}>
                {isCompleted ? 'TASK COMPLETED' : 'HABIT CHALLENGE COMPLETE'}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Task Card Summary */}
            <View style={styles.taskPreviewBox}>
              <View style={styles.taskTagRow}>
                <Text style={styles.taskTagText}>{task.impactTag || task.category}</Text>
                <Text style={styles.taskEstText}>
                  Est. {currencySymbol}{task.savingsAmount.toLocaleString('en-IN')}
                </Text>
              </View>
              <Text style={styles.taskTitleText}>{task.title}</Text>
            </View>

            {isCompleted ? (
              /* Already Completed State */
              <View style={styles.alreadyDoneContainer}>
                <View style={styles.doneIconBox}>
                  <CheckCircle2 size={36} color="#059669" />
                </View>
                <Text style={styles.doneTitle}>Challenge Completed!</Text>
                <Text style={styles.doneSub}>
                  You saved {currencySymbol}{task.savingsAmount.toLocaleString('en-IN')} towards your{' '}
                  <Text style={{ fontWeight: '700', color: '#0F172A' }}>
                    {activeVault?.title || 'Milestone Vault'}
                  </Text>
                  .
                </Text>

                {onUnmarkTask && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleUnmark}
                    disabled={isSubmitting}
                    style={styles.unmarkBtn}
                  >
                    <RotateCcw size={15} color="#EF4444" style={{ marginRight: 6 }} />
                    <Text style={styles.unmarkBtnText}>Unmark & Withdraw from Vault</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              /* Input & Confirmation State */
              <>
                <Text style={styles.promptHeading}>
                  How much did you save by following this task?
                </Text>
                <Text style={styles.promptSub}>
                  Enter the actual amount you avoided spending. It will be added to your lifetime savings and deposited into your active vault.
                </Text>

                {/* Amount Input Box */}
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={savingsInput}
                    onChangeText={setSavingsInput}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    maxLength={7}
                    selectTextOnFocus
                  />
                </View>

                {/* Quick Preset Chips */}
                <View style={styles.chipsContainer}>
                  {presetChips.map((chipAmt) => {
                    const isSelected = parsedAmount === chipAmt;
                    return (
                      <TouchableOpacity
                        key={chipAmt}
                        activeOpacity={0.8}
                        onPress={() => handleSelectChip(chipAmt)}
                        style={[
                          styles.chipBtn,
                          isSelected && styles.chipBtnSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipBtnText,
                            isSelected && styles.chipBtnTextSelected,
                          ]}
                        >
                          {currencySymbol}{chipAmt.toLocaleString('en-IN')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Direct Vault Deposit Banner */}
                {activeVault && (
                  <View style={styles.vaultDepositBanner}>
                    <ShieldCheck size={18} color="#7C3AED" />
                    <View style={styles.vaultDepositTextCol}>
                      <Text style={styles.vaultDepositTitle}>
                        Direct Deposit to Milestone Vault
                      </Text>
                      <Text style={styles.vaultDepositSub}>
                        {activeVault.title} ({currencySymbol}
                        {activeVault.currentAmount.toLocaleString('en-IN')} / {currencySymbol}
                        {activeVault.targetAmount.toLocaleString('en-IN')})
                      </Text>
                    </View>
                  </View>
                )}

                {/* Confirm Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleConfirm}
                  disabled={isSubmitting || parsedAmount <= 0}
                  style={[
                    styles.confirmBtn,
                    parsedAmount <= 0 && styles.confirmBtnDisabled,
                  ]}
                >
                  <Coins size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.confirmBtnText}>
                    Confirm & Deposit {currencySymbol}{parsedAmount.toLocaleString('en-IN')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  taskPreviewBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  taskTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  taskTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskEstText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  taskTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  promptHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  promptSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#7C3AED',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '800',
    color: '#7C3AED',
    marginRight: 6,
  },
  amountInput: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 120,
    textAlign: 'left',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 18,
  },
  chipBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipBtnSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  chipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  chipBtnTextSelected: {
    color: '#FFFFFF',
  },
  vaultDepositBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 18,
  },
  vaultDepositTextCol: {
    flex: 1,
  },
  vaultDepositTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  vaultDepositSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 15,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  alreadyDoneContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  doneIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  doneTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  doneSub: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  unmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  unmarkBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
});

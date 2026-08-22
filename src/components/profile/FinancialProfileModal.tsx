import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {
  X,
  Check,
  DollarSign,
  Target,
  Coins,
  Receipt,
  Plus,
  Trash2,
  Building,
  Heart,
  Home,
  Car,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserSettings } from '@/hooks/use-database';
import { useAppStore, CurrencyCode, CURRENCY_SYMBOLS } from '@/store';
import {
  DEFAULT_MUST_PAYMENTS,
  MustPaymentItem,
} from '@/features/onboarding';
import { SUPPORTED_LANGUAGES } from '@/i18n';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
];

const getMustPaymentIcon = (iconName?: string) => {
  const props = { size: 18, color: '#7C3AED' };
  switch (iconName) {
    case 'Building':
      return <Building {...props} />;
    case 'Heart':
      return <Heart {...props} color="#EC4899" />;
    case 'Home':
      return <Home {...props} color="#D97706" />;
    case 'Car':
      return <Car {...props} color="#0284C7" />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} color="#059669" />;
    case 'GraduationCap':
      return <GraduationCap {...props} color="#6366F1" />;
    default:
      return <Receipt {...props} />;
  }
};

interface FinancialProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FinancialProfileModal: React.FC<FinancialProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { settings, mustPayments: savedMustPayments, saveSettings } = useUserSettings();
  const { currency, currencySymbol, setCurrency, language, setLanguage } = useAppStore();

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(currency);
  const [income, setIncome] = useState(settings.monthlyIncome || '');
  const [savingsTarget, setSavingsTarget] = useState(settings.monthlySavingsTarget || '');
  const [isSaving, setIsSaving] = useState(false);

  // Must Payments state in Modal
  const [selectedMustPayments, setSelectedMustPayments] = useState<Record<string, boolean>>({});
  const [mustPaymentAmounts, setMustPaymentAmounts] = useState<Record<string, string>>({});
  const [customMustPayments, setCustomMustPayments] = useState<MustPaymentItem[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('');
  const [customAmountInput, setCustomAmountInput] = useState('');

  useEffect(() => {
    if (visible) {
      setSelectedCurrency(currency);
      setIncome(settings.monthlyIncome || '');
      setSavingsTarget(settings.monthlySavingsTarget || '');

      // Load saved must payments
      const initialSelected: Record<string, boolean> = {};
      const initialAmounts: Record<string, string> = {};
      const loadedCustom: MustPaymentItem[] = [];

      // Populate predefined defaults
      DEFAULT_MUST_PAYMENTS.forEach((p: MustPaymentItem) => {
        initialAmounts[p.id] = String(p.amount);
      });

      if (Array.isArray(savedMustPayments) && savedMustPayments.length > 0) {
        savedMustPayments.forEach((p: MustPaymentItem) => {
          initialSelected[p.id] = true;
          initialAmounts[p.id] = String(p.amount);
          if (p.isCustom) {
            loadedCustom.push(p);
          }
        });
      }

      setSelectedMustPayments(initialSelected);
      setMustPaymentAmounts(initialAmounts);
      setCustomMustPayments(loadedCustom);
    }
  }, [visible, settings, currency, savedMustPayments]);

  const currSymbol =
    CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency)?.symbol || currencySymbol;

  const totalMustPayments = useMemo(() => {
    let sum = 0;
    DEFAULT_MUST_PAYMENTS.forEach((item: MustPaymentItem) => {
      if (selectedMustPayments[item.id]) {
        const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
        const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0;
        sum += parsed;
      }
    });
    customMustPayments.forEach((item: MustPaymentItem) => {
      if (selectedMustPayments[item.id]) {
        const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
        const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0;
        sum += parsed;
      }
    });
    return sum;
  }, [selectedMustPayments, mustPaymentAmounts, customMustPayments]);

  const incomeNum = useMemo(() => {
    return parseFloat(income.replace(/[^0-9.]/g, '')) || 0;
  }, [income]);

  const discretionaryIncome = useMemo(() => {
    return Math.max(incomeNum - totalMustPayments, 0);
  }, [incomeNum, totalMustPayments]);

  const toggleMustPayment = (id: string, defaultAmount: number) => {
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMustPayments((prev) => {
      const nextState = !prev[id];
      if (nextState && !mustPaymentAmounts[id]) {
        setMustPaymentAmounts((amtPrev) => ({
          ...amtPrev,
          [id]: String(defaultAmount),
        }));
      }
      return { ...prev, [id]: nextState };
    });
  };

  const updateMustPaymentAmount = (id: string, text: string) => {
    setMustPaymentAmounts((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const handleAddCustomPayment = () => {
    if (!customNameInput.trim()) return;
    const amountVal = parseFloat(customAmountInput.replace(/[^0-9.]/g, '')) || 5000;
    const newId = `custom_${Date.now()}`;
    const newItem: MustPaymentItem = {
      id: newId,
      name: customNameInput.trim(),
      category: 'Custom Obligation',
      amount: amountVal,
      iconName: 'Receipt',
      isCustom: true,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setCustomMustPayments((prev) => [...prev, newItem]);
    setSelectedMustPayments((prev) => ({ ...prev, [newId]: true }));
    setMustPaymentAmounts((prev) => ({ ...prev, [newId]: String(amountVal) }));
    setCustomNameInput('');
    setCustomAmountInput('');
    setShowAddCustom(false);
  };

  const handleDeleteCustomPayment = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCustomMustPayments((prev) => prev.filter((p) => p.id !== id));
    setSelectedMustPayments((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 1. Update App Store Currency
      setCurrency(selectedCurrency);

      const symbol =
        CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency)?.symbol || '₹';

      // Gather active must payments list
      const activeMustPayments: MustPaymentItem[] = [];
      DEFAULT_MUST_PAYMENTS.forEach((item: MustPaymentItem) => {
        if (selectedMustPayments[item.id]) {
          const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
          const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || item.amount;
          activeMustPayments.push({
            ...item,
            amount: parsed,
          });
        }
      });
      customMustPayments.forEach((item: MustPaymentItem) => {
        if (selectedMustPayments[item.id]) {
          const rawAmt = mustPaymentAmounts[item.id] || String(item.amount);
          const parsed = parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || item.amount;
          activeMustPayments.push({
            ...item,
            amount: parsed,
          });
        }
      });

      // 2. Save directly to SQLite user_settings table
      await saveSettings({
        currency: symbol,
        currencyCode: selectedCurrency,
        monthlyIncome: income.trim(),
        monthlySavingsTarget: savingsTarget.trim(),
        mustPayments: JSON.stringify(activeMustPayments),
        totalMustPayments: String(totalMustPayments),
      });

      onClose();
    } catch (err) {
      console.warn('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Financial Profile & Goals</Text>
              <Text style={styles.headerSubtitle}>
                Calibrate income, must-payments & savings targets
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Currency Selector Section */}
            <Text style={styles.sectionLabel}>DEFAULT CURRENCY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.currencyChipsRow}
            >
              {CURRENCY_OPTIONS.map((c) => {
                const isSelected = selectedCurrency === c.code;
                return (
                  <TouchableOpacity
                    key={c.code}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedCurrency(c.code);
                    }}
                    style={[
                      styles.currencyChip,
                      isSelected && styles.currencyChipSelected,
                    ]}
                  >
                    <Text style={styles.currencyFlag}>{c.flag}</Text>
                    <Text
                      style={[
                        styles.currencyChipText,
                        isSelected && styles.currencyChipTextSelected,
                      ]}
                    >
                      {c.symbol} {c.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* App Language Selector Section */}
            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>APP LANGUAGE</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.currencyChipsRow}
            >
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setLanguage(lang.code);
                    }}
                    style={[
                      styles.currencyChip,
                      isSelected && styles.currencyChipSelected,
                    ]}
                  >
                    <Text style={styles.currencyFlag}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.currencyChipText,
                        isSelected && styles.currencyChipTextSelected,
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Monthly Income Field */}
            <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
              APPROX. MONTHLY TAKE-HOME INCOME
            </Text>
            <View style={styles.inputBox}>
              <Text style={styles.prefixText}>{currSymbol}</Text>
              <TextInput
                value={income}
                onChangeText={setIncome}
                keyboardType="numeric"
                placeholder="e.g. 75000"
                placeholderTextColor="#94A3B8"
                style={styles.textInput}
              />
            </View>

            {/* Fixed Must-Payments Section */}
            <View style={styles.mustPaymentsSectionHeader}>
              <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>
                NON-NEGOTIABLE MUST-PAYMENTS (EMIS, LOANS & FAMILY)
              </Text>
              {totalMustPayments > 0 && (
                <Text style={styles.mustPaymentsTotalBadge}>
                  -{currSymbol}{totalMustPayments.toLocaleString('en-IN')}/mo
                </Text>
              )}
            </View>
            <Text style={styles.sectionHelperSubtext}>
              Fixed obligations that must be paid each month before discretionary spending.
            </Text>

            <View style={styles.mustPaymentList}>
              {DEFAULT_MUST_PAYMENTS.map((item: MustPaymentItem) => {
                const isSelected = Boolean(selectedMustPayments[item.id]);
                const currAmtStr = mustPaymentAmounts[item.id] || String(item.amount);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.mustPaymentCard,
                      isSelected && styles.mustPaymentCardSelected,
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleMustPayment(item.id, item.amount)}
                      style={styles.mustPaymentCardHeader}
                    >
                      <View style={styles.mustPaymentIconBox}>
                        {getMustPaymentIcon(item.iconName)}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.mustPaymentName}>{item.name}</Text>
                        <Text style={styles.mustPaymentCategory}>{item.category}</Text>
                      </View>
                      <View
                        style={[
                          styles.checkboxCircle,
                          isSelected && styles.checkboxCircleSelected,
                        ]}
                      >
                        {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </TouchableOpacity>

                    {isSelected && (
                      <View style={styles.mustPaymentAmountRow}>
                        <Text style={styles.mustPaymentAmountLabel}>Monthly Amount:</Text>
                        <View style={styles.mustPaymentInputWrap}>
                          <Text style={styles.mustPaymentCurrencyPrefix}>{currSymbol}</Text>
                          <TextInput
                            value={currAmtStr}
                            onChangeText={(txt) => updateMustPaymentAmount(item.id, txt)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#94A3B8"
                            style={styles.mustPaymentAmountInput}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Custom Must Payments */}
              {customMustPayments.map((item) => {
                const isSelected = Boolean(selectedMustPayments[item.id]);
                const currAmtStr = mustPaymentAmounts[item.id] || String(item.amount);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.mustPaymentCard,
                      isSelected && styles.mustPaymentCardSelected,
                    ]}
                  >
                    <View style={styles.mustPaymentCardHeader}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleMustPayment(item.id, item.amount)}
                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 }}
                      >
                        <View style={styles.mustPaymentIconBox}>
                          <Receipt size={18} color="#7C3AED" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.mustPaymentName}>{item.name}</Text>
                          <Text style={styles.mustPaymentCategory}>Custom Obligation</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteCustomPayment(item.id)}
                        style={styles.deleteCustomBtn}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => toggleMustPayment(item.id, item.amount)}
                        style={[
                          styles.checkboxCircle,
                          isSelected && styles.checkboxCircleSelected,
                        ]}
                      >
                        {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </TouchableOpacity>
                    </View>

                    {isSelected && (
                      <View style={styles.mustPaymentAmountRow}>
                        <Text style={styles.mustPaymentAmountLabel}>Monthly Amount:</Text>
                        <View style={styles.mustPaymentInputWrap}>
                          <Text style={styles.mustPaymentCurrencyPrefix}>{currSymbol}</Text>
                          <TextInput
                            value={currAmtStr}
                            onChangeText={(txt) => updateMustPaymentAmount(item.id, txt)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#94A3B8"
                            style={styles.mustPaymentAmountInput}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Add Custom Button / Inline form */}
            {showAddCustom ? (
              <View style={styles.addCustomCard}>
                <Text style={styles.addCustomTitle}>Add Custom Fixed Obligation</Text>
                <TextInput
                  value={customNameInput}
                  onChangeText={setCustomNameInput}
                  placeholder="Purpose (e.g. Chit Fund, Tuition)"
                  placeholderTextColor="#94A3B8"
                  style={styles.customNameInput}
                />
                <View style={styles.mustPaymentInputWrap}>
                  <Text style={styles.mustPaymentCurrencyPrefix}>{currSymbol}</Text>
                  <TextInput
                    value={customAmountInput}
                    onChangeText={setCustomAmountInput}
                    keyboardType="numeric"
                    placeholder="Monthly Amount (e.g. 5000)"
                    placeholderTextColor="#94A3B8"
                    style={styles.mustPaymentAmountInput}
                  />
                </View>

                <View style={styles.customActionsRow}>
                  <TouchableOpacity
                    onPress={() => setShowAddCustom(false)}
                    style={styles.cancelCustomBtn}
                  >
                    <Text style={styles.cancelCustomText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddCustomPayment}
                    style={styles.saveCustomBtn}
                  >
                    <Text style={styles.saveCustomText}>Add Obligation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  Haptics.selectionAsync();
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setShowAddCustom(true);
                }}
                style={styles.addCustomTriggerBtn}
              >
                <Plus size={15} color="#7C3AED" />
                <Text style={styles.addCustomTriggerText}>Add Custom Must-Payment</Text>
              </TouchableOpacity>
            )}

            {/* Monthly Savings Target Field */}
            <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
              MONTHLY SAVINGS TARGET
            </Text>
            <View style={styles.inputBox}>
              <Text style={styles.prefixText}>{currSymbol}</Text>
              <TextInput
                value={savingsTarget}
                onChangeText={setSavingsTarget}
                keyboardType="numeric"
                placeholder="e.g. 25000"
                placeholderTextColor="#94A3B8"
                style={styles.textInput}
              />
            </View>

            {/* Summary preview */}
            {income && Number(income) > 0 ? (
              <View style={styles.previewBox}>
                <Target size={18} color="#7C3AED" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewText}>
                    Discretionary Pool:{' '}
                    <Text style={{ fontWeight: '800' }}>
                      {currSymbol}{discretionaryIncome.toLocaleString('en-IN')}/mo
                    </Text>
                  </Text>
                  {savingsTarget && Number(savingsTarget) > 0 ? (
                    <Text style={styles.previewSubtext}>
                      Targeting to save{' '}
                      <Text style={{ fontWeight: '800' }}>
                        {Math.round((Number(savingsTarget) / (discretionaryIncome > 0 ? discretionaryIncome : Number(income))) * 100)}%
                      </Text>{' '}
                      of your discretionary pool ({currSymbol}
                      {Number(savingsTarget).toLocaleString('en-IN')}/month).
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveBtn}
            >
              <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.saveBtnText}>
                {isSaving ? 'Saving...' : 'Update Settings'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  sectionHelperSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 8,
  },
  mustPaymentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  mustPaymentsTotalBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  currencyChipsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  currencyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currencyChipSelected: {
    backgroundColor: '#F3E8FF',
    borderColor: '#7C3AED',
  },
  currencyFlag: {
    fontSize: 16,
  },
  currencyChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  currencyChipTextSelected: {
    color: '#7C3AED',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 50,
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7C3AED',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  mustPaymentList: {
    gap: 8,
    marginTop: 4,
  },
  mustPaymentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 8,
  },
  mustPaymentCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
  },
  mustPaymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mustPaymentIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mustPaymentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  mustPaymentCategory: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  mustPaymentAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  mustPaymentAmountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  mustPaymentInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 34,
    minWidth: 110,
  },
  mustPaymentCurrencyPrefix: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
    marginRight: 4,
  },
  mustPaymentAmountInput: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    padding: 0,
  },
  deleteCustomBtn: {
    padding: 4,
    marginRight: 4,
  },
  addCustomTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderStyle: 'dashed',
    marginTop: 6,
  },
  addCustomTriggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  addCustomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    padding: 12,
    gap: 8,
    marginTop: 6,
  },
  addCustomTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  customNameInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  customActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 2,
  },
  cancelCustomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelCustomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  saveCustomBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveCustomText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  previewText: {
    fontSize: 12,
    color: '#5B21B6',
    lineHeight: 17,
  },
  previewSubtext: {
    fontSize: 11,
    color: '#6D28D9',
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    height: 52,
    marginTop: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  Utensils,
  Wallet,
  PlaySquare,
  Bus,
  Coffee,
  Check,
  Sparkles,
  ArrowRight,
  X,
  Plus,
  Target,
  TrendingUp,
  ShieldCheck,
  Laptop,
  Plane,
  ShoppingBag,
  Zap,
  Calendar,
  Trash2,
  Flame,
  Award,
  ChevronRight,
  CheckCircle2,
  HeartPulse,
  BookOpen,
  Lock,
  Users,
  Clock,
} from 'lucide-react-native';
import Animated, {
  LinearTransition,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  FadeInDown,
  FadeInUp,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedMeshGradient } from '@/components/ui/AnimatedMeshGradient';
import { useWeeklyGoals, useMilestoneVaults, useAIReports } from '@/hooks/use-database';
import { MediumArticleModal } from '@/components/goals/MediumArticleModal';
import { CompleteTaskModal } from '@/components/goals/CompleteTaskModal';
import { Report, WeeklyGoal, MilestoneVault } from '@/db/schema';
import { useAppStore } from '@/store';
import { getStoryScheduleInfo, checkAutoGenerationNeeded } from '@/utils/story-scheduler';
import { ThemeColors, AppFonts } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getCategoryIcon = (iconName: string, size = 18, color = '#0F172A') => {
  const props = { size, color, strokeWidth: 2.2 };
  switch (iconName) {
    case 'Utensils':
      return <Utensils {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'PlaySquare':
      return <PlaySquare {...props} />;
    case 'Bus':
      return <Bus {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'Plane':
      return <Plane {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};

const CATEGORY_META: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  Food: { label: 'Food & Dining', icon: 'Utensils', bg: '#FEE2E2', color: '#EF4444' },
  Transport: { label: 'Commute', icon: 'Bus', bg: '#E0F2FE', color: '#0284C7' },
  Subscriptions: { label: 'Subscriptions', icon: 'PlaySquare', bg: '#F3E8FF', color: '#7C3AED' },
  Shopping: { label: 'Shopping', icon: 'ShoppingBag', bg: '#FEF3C7', color: '#D97706' },
  Vault: { label: 'Savings Vault', icon: 'Wallet', bg: '#DCFCE7', color: '#059669' },
  Lifestyle: { label: 'Lifestyle', icon: 'Coffee', bg: '#F1F5F9', color: '#475569' },
  Emergency: { label: 'Emergency Fund', icon: 'ShieldCheck', bg: '#ECFDF5', color: '#059669' },
  Travel: { label: 'Travel & Trips', icon: 'Plane', bg: '#E0E7FF', color: '#4338CA' },
  Tech: { label: 'Gadgets & Gear', icon: 'Laptop', bg: '#F1F5F9', color: '#475569' },
};

const PRESET_AMOUNTS = [2500, 5000, 10000, 25000, 50000, 100000];

export const GoalsTab: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currencySymbol } = useAppStore();
  const [activeSegment, setActiveSegment] = useState<'stories' | 'vaults' | 'tasks'>('stories');
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');

  // SQLite Database Hooks
  const { reports, markReportAsRead, generateReport, isGenerating } = useAIReports();
  const { goals: tasks, toggleGoal, addGoal, deleteGoal } = useWeeklyGoals();
  const { vaults, activeVault, activeVaultIndex, depositToVault, addVault, deleteVault } =
    useMilestoneVaults();

  const effectiveReports = reports || [];
  const effectiveTasks = tasks || [];
  const effectiveVaults = vaults || [];

  const scheduleInfo = useMemo(() => getStoryScheduleInfo(), []);

  // Selected Medium Article for Reading Modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Task Completion Modal
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState<WeeklyGoal | null>(null);
  const [showCompleteTaskModal, setShowCompleteTaskModal] = useState(false);

  // Modals
  const [showAddVaultModal, setShowAddVaultModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedVaultForDeposit, setSelectedVaultForDeposit] = useState<any | null>(null);
  const [depositAmount, setDepositAmount] = useState('1000');

  // New Milestone Form
  const [newVaultTitle, setNewVaultTitle] = useState('');
  const [newVaultAmount, setNewVaultAmount] = useState('');
  const [newVaultCategory, setNewVaultCategory] = useState<string>('Tech');
  const [newVaultDate, setNewVaultDate] = useState('Dec 2026');

  // Floating Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Weekly Habits Calculations
  const completedTasks = useMemo(() => effectiveTasks.filter((t) => Boolean(t.completed)), [effectiveTasks]);
  const pendingTasks = useMemo(() => effectiveTasks.filter((t) => !t.completed), [effectiveTasks]);

  const totalWeeklySaved = useMemo(
    () => completedTasks.reduce((sum, t) => sum + (t.savingsAmount || 0), 0),
    [completedTasks]
  );
  const totalWeeklyTarget = useMemo(
    () => effectiveTasks.reduce((sum, t) => sum + (t.savingsAmount || 0), 0),
    [effectiveTasks]
  );

  // Vaults Calculations
  const totalVaultSaved = useMemo(
    () => effectiveVaults.reduce((sum, v) => sum + (v.currentAmount || 0), 0),
    [effectiveVaults]
  );
  const totalVaultTarget = useMemo(
    () => effectiveVaults.reduce((sum, v) => sum + (v.targetAmount || 0), 0),
    [effectiveVaults]
  );

  const effectiveActiveVault = useMemo(() => {
    if (activeVault) return activeVault;
    const incomplete = effectiveVaults.find((v) => v.currentAmount < v.targetAmount);
    return incomplete || effectiveVaults[0] || null;
  }, [activeVault, effectiveVaults]);

  // Open Task Completion Modal
  const handleTaskPress = (task: WeeklyGoal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedTaskForCompletion(task);
    setShowCompleteTaskModal(true);
  };

  // Confirm custom savings amount and deposit into milestone vault
  const handleConfirmSavings = async (taskId: string, amount: number) => {
    const result = await toggleGoal({
      id: taskId,
      customAmount: amount,
      markCompleted: true,
    });

    if (result && result.completed && result.vault) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (result.didUnlockNext) {
        showToast(
          `🎉 Milestone 100% Funded! Unlocked "${result.nextUnlockedTitle}"!`
        );
      } else {
        showToast(
          `+₹${amount.toLocaleString('en-IN')} deposited into ${result.vault.title}!`
        );
      }
    }
  };

  // Unmark task and withdraw from vault
  const handleUnmarkTask = async (taskId: string) => {
    const result = await toggleGoal({
      id: taskId,
      markCompleted: false,
    });
    if (result && result.vault) {
      showToast(
        `Task unmarked. ₹${result.savingsAmount.toLocaleString('en-IN')} withdrawn from ${result.vault.title}.`
      );
    }
  };

  // Legacy fallback toggle
  const handleToggleTask = async (id: string) => {
    const target = effectiveTasks.find((t) => t.id === id);
    if (target) {
      handleTaskPress(target);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3600);
  };

  // Open Medium Article Reader
  const handleOpenArticle = (report: Report) => {
    Haptics.selectionAsync();
    setSelectedReport(report);
    markReportAsRead(report.id);
  };

  // Generate On-Demand AI Spending Story (Weekly or Monthly)
  const handleGenerateStory = async (periodType: 'weekly' | 'monthly' = 'weekly') => {
    if (isGenerating) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast(
      periodType === 'monthly'
        ? '✨ AI Financial Biographer is writing your Monthly Retrospective...'
        : '✨ AI Financial Biographer is analyzing your weekly habits...'
    );

    try {
      const result = await generateReport({ periodType });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(
        periodType === 'monthly'
          ? '🎉 Monthly Retrospective Edition published!'
          : '🎉 New Weekly AI Spending Story published!'
      );
      if (result?.report) {
        setSelectedReport(result.report);
      }
    } catch (error: any) {
      console.warn('Story generation notice:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showToast('Failed to generate story. Please try again.');
    }
  };

  // Create Custom Milestone Vault
  const handleCreateCustomVault = async () => {
    const amountNum = parseFloat(newVaultAmount);
    if (!newVaultTitle.trim() || isNaN(amountNum) || amountNum <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const meta = CATEGORY_META[newVaultCategory] || CATEGORY_META.Tech;

    await addVault({
      id: 'v_' + Date.now(),
      title: newVaultTitle.trim(),
      category: newVaultCategory,
      targetAmount: amountNum,
      currentAmount: 0,
      targetDate: newVaultDate || 'Dec 2026',
      color: meta.color,
      iconName: meta.icon,
      monthlyContribution: Math.round(amountNum / 6),
      isLocked: vaults.length > 0,
      orderIndex: vaults.length,
    });

    setNewVaultTitle('');
    setNewVaultAmount('');
    setShowAddVaultModal(false);
    setActiveSegment('vaults');
  };

  // Execute Direct Deposit
  const handleExecuteDeposit = async () => {
    const num = parseFloat(depositAmount);
    if (!selectedVaultForDeposit || isNaN(num) || num <= 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await depositToVault(selectedVaultForDeposit.id, num);
    setShowDepositModal(false);
    setSelectedVaultForDeposit(null);
    showToast(`₹${num.toLocaleString('en-IN')} deposited to ${selectedVaultForDeposit.title}!`);
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    if (filter === 'todo') return pendingTasks;
    if (filter === 'done') return completedTasks;
    return tasks;
  }, [tasks, filter, pendingTasks, completedTasks]);

  return (
    <View style={styles.container}>
      {/* 1. TOP ANIMATED MESH GRADIENT */}
      <AnimatedMeshGradient height={380} intensity="vibrant" />

      {/* Floating Celebration Toast */}
      {toastMessage && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOut.duration(200)}
          style={[styles.toastBanner, { top: Math.max(insets.top + 8, 20) }]}
        >
          <Sparkles size={16} color="#FFFFFF" />
          <Text style={styles.toastBannerText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 16) }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Bar */}
        <View style={styles.topHeaderBar}>
          <View>
            <Text style={styles.screenHeaderTitle}>Goals & Stories</Text>
            <Text style={styles.screenHeaderSubtitle}>Medium-style narratives & milestone vaults</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowAddVaultModal(true)}
            style={styles.newGoalHeaderBtn}
          >
            <Plus size={15} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.newGoalHeaderBtnText}>New Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Conversational AI Coach Card */}
        <View style={styles.coachCard}>
          <View style={styles.coachAvatarRow}>
            <View style={styles.coachAvatarCircle}>
              <Sparkles size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachName}>AI Financial Biographer</Text>
              <Text style={styles.coachDate}>This Week's Focus</Text>
            </View>
          </View>

          <Text style={styles.coachMessage}>
            {effectiveActiveVault
              ? `You're ${currencySymbol}${Math.max(effectiveActiveVault.targetAmount - effectiveActiveVault.currentAmount, 0).toLocaleString(
                  'en-IN'
                )} away from unlocking "${effectiveActiveVault.title}". Ticking AI tasks below automatically funds this milestone!`
              : `Create your first Milestone Goal using "+ New Goal" above to start automating your savings roadmap!`}
          </Text>

          {effectiveActiveVault && (
            <View style={styles.coachProgressRow}>
              <View style={styles.coachProgressBarBg}>
                <View
                  style={[
                    styles.coachProgressBarFill,
                    {
                      width: `${Math.min(
                        Math.round((effectiveActiveVault.currentAmount / effectiveActiveVault.targetAmount) * 100),
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.coachPercentText}>
                {Math.min(Math.round((effectiveActiveVault.currentAmount / effectiveActiveVault.targetAmount) * 100), 100)}%
              </Text>
            </View>
          )}
        </View>

        {/* 3-Way Segment Switcher */}
        <View style={styles.segmentWrapper}>
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveSegment('stories');
              }}
              style={[
                styles.segmentBtn,
                activeSegment === 'stories' && styles.segmentBtnActive,
              ]}
            >
              <BookOpen
                size={14}
                color={activeSegment === 'stories' ? '#7C3AED' : '#64748B'}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  activeSegment === 'stories' && styles.segmentBtnTextActive,
                ]}
              >
                AI Stories ({effectiveReports.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveSegment('vaults');
              }}
              style={[
                styles.segmentBtn,
                activeSegment === 'vaults' && styles.segmentBtnActive,
              ]}
            >
              <Target
                size={14}
                color={activeSegment === 'vaults' ? '#7C3AED' : '#64748B'}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  activeSegment === 'vaults' && styles.segmentBtnTextActive,
                ]}
              >
                Milestones ({effectiveVaults.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveSegment('tasks');
              }}
              style={[
                styles.segmentBtn,
                activeSegment === 'tasks' && styles.segmentBtnActive,
              ]}
            >
              <Zap
                size={14}
                color={activeSegment === 'tasks' ? '#7C3AED' : '#64748B'}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  activeSegment === 'tasks' && styles.segmentBtnTextActive,
                ]}
              >
                AI Tasks ({pendingTasks.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ------------------------------------------------------------- */}
        {/* SEGMENT 1: STORIES & ARTICLES                                 */}
        {/* ------------------------------------------------------------- */}
        {activeSegment === 'stories' && (
          <View style={styles.storiesContainer}>
            {/* Section Header */}
            <View style={styles.sectionTitleRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <BookOpen size={16} color={ThemeColors.primary} />
                <Text style={styles.sectionTitle}>Published Stories & Essays</Text>
              </View>
            </View>

            {effectiveReports.length === 0 ? (
              <View style={styles.tabEmptyContainer}>
                <View style={styles.tabEmptyIconBox}>
                  <BookOpen size={26} color={ThemeColors.primary} />
                </View>
                <Text style={styles.tabEmptyTitle}>AI Biographer is Tracking Your Habits</Text>
                <Text style={styles.tabEmptySub}>
                  Stories are generated automatically in the background on their scheduled release dates. Your first weekly essay will drop on Sunday at 8:00 PM.
                </Text>

                {/* Compact Schedule Pill Inside Empty State */}
                <View style={styles.compactScheduleCard}>
                  <View style={styles.compactScheduleLeft}>
                    <View style={styles.compactScheduleIconBox}>
                      <Clock size={15} color={ThemeColors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.compactScheduleTitleRow}>
                        <Text style={styles.compactScheduleTitle}>
                          Next Drop: {scheduleInfo.weeklyFormattedDate}
                        </Text>
                        <View style={styles.compactScheduleBadge}>
                          <Text style={styles.compactScheduleBadgeText}>
                            {scheduleInfo.weeklyDaysRemaining === 0 ? 'Due Today' : `In ${scheduleInfo.weeklyDaysRemaining}d`}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.compactScheduleSubtext}>
                        Weekly Habit Essay • Auto-delivered at 8:00 PM
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <>
                {/* Published Stories Feed */}
                {effectiveReports.map((report) => (
                  <TouchableOpacity
                    key={report.id}
                    activeOpacity={0.88}
                    onPress={() => handleOpenArticle(report)}
                    style={styles.storyCard}
                  >
                    {/* Header Tag */}
                    <View style={styles.storyCardHeader}>
                      <View style={styles.storyTagBadge}>
                        <Text style={styles.storyTagBadgeText}>
                          {report.periodType === 'weekly' ? 'WEEKLY ESSAY' : 'MONTHLY EDITION'}
                        </Text>
                      </View>
                      <Text style={styles.storyReadTime}>{report.readTime}</Text>
                    </View>

                    {/* Hook Title */}
                    <Text style={styles.storyHookTitle}>{report.hookTitle}</Text>

                    {/* Subtitle */}
                    <Text style={styles.storySubDescription} numberOfLines={2}>
                      {report.subDescription}
                    </Text>

                    {/* 3 Impact Pills */}
                    <View style={styles.storyPillRow}>
                      <View style={styles.storyMiniPill}>
                        <HeartPulse size={12} color="#EF4444" style={{ marginRight: 4 }} />
                        <Text style={styles.storyMiniPillText}>Health</Text>
                      </View>

                      <View style={styles.storyMiniPill}>
                        <Users size={12} color="#0284C7" style={{ marginRight: 4 }} />
                        <Text style={styles.storyMiniPillText}>Family</Text>
                      </View>

                      <View style={styles.storyMiniPill}>
                        <TrendingUp size={12} color="#059669" style={{ marginRight: 4 }} />
                        <Text style={styles.storyMiniPillText}>Milestone</Text>
                      </View>
                    </View>

                    {/* Footer Action */}
                    <View style={styles.storyFooter}>
                      <View>
                        <Text style={styles.storySavingsLabel}>ESTIMATED SAVINGS</Text>
                        <Text style={styles.storySavingsAmount}>
                          +{currencySymbol}{report.estimatedSavings.toLocaleString('en-IN')}
                        </Text>
                      </View>

                      <View style={styles.readArticleBtn}>
                        <Text style={styles.readArticleBtnText}>Read & Action</Text>
                        <ArrowRight size={14} color={ThemeColors.primary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Compact Story Release Schedule Micro-Card at Bottom */}
                <View style={styles.compactScheduleCard}>
                  <View style={styles.compactScheduleLeft}>
                    <View style={styles.compactScheduleIconBox}>
                      <Clock size={15} color={ThemeColors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.compactScheduleTitleRow}>
                        <Text style={styles.compactScheduleTitle}>
                          Next Drop: {scheduleInfo.weeklyFormattedDate} (8:00 PM)
                        </Text>
                        <View style={styles.compactScheduleBadge}>
                          <Text style={styles.compactScheduleBadgeText}>
                            {scheduleInfo.weeklyDaysRemaining === 0 ? 'Today' : `in ${scheduleInfo.weeklyDaysRemaining}d`}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.compactScheduleSubtext}>
                        Weekly Habit Essay • Auto-delivered in background
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SEGMENT 2: MILESTONE VAULTS ROADMAP (SMALL TO BIG PROGRESSION) */}
        {/* ------------------------------------------------------------- */}
        {activeSegment === 'vaults' && (
          <View style={styles.vaultsContainer}>
            <View style={styles.sectionTitleRow}>
              <ShieldCheck size={16} color="#7C3AED" />
              <Text style={styles.sectionTitle}>Milestone Vaults Roadmap</Text>
            </View>

            <Text style={styles.roadmapSubtext}>
              Saved money from AI tasks automatically deposits into your active milestone. Complete
              it to unlock the next one!
            </Text>

            {effectiveVaults.length === 0 ? (
              <View style={styles.tabEmptyContainer}>
                <View style={styles.tabEmptyIconBox}>
                  <Target size={26} color="#7C3AED" />
                </View>
                <Text style={styles.tabEmptyTitle}>No milestone vaults yet</Text>
                <Text style={styles.tabEmptySub}>
                  Set up milestone goals like an Emergency Safety Buffer, Vacation, or New Tech. Habit challenges fund them automatically!
                </Text>
                <TouchableOpacity
                  style={styles.tabEmptyActionBtn}
                  onPress={() => setShowAddVaultModal(true)}
                  activeOpacity={0.8}
                >
                  <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.tabEmptyActionBtnText}>Create First Milestone</Text>
                </TouchableOpacity>
              </View>
            ) : (
              effectiveVaults.map((vault, index) => {
              const isCompleted = vault.currentAmount >= vault.targetAmount;
              const isActive = index === activeVaultIndex && !isCompleted;
              const isLocked = index > activeVaultIndex && !isCompleted;
              const meta = CATEGORY_META[vault.category] || CATEGORY_META.Emergency;
              const percent = Math.min(
                Math.round((vault.currentAmount / vault.targetAmount) * 100),
                100
              );
              const remaining = Math.max(vault.targetAmount - vault.currentAmount, 0);

              return (
                <View key={vault.id} style={styles.roadmapItem}>
                  {/* Left Timeline Node Line */}
                  <View style={styles.timelineNodeCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        isCompleted && styles.timelineDotCompleted,
                        isActive && styles.timelineDotActive,
                        isLocked && styles.timelineDotLocked,
                      ]}
                    >
                      {isCompleted ? (
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      ) : isLocked ? (
                        <Lock size={11} color="#94A3B8" />
                      ) : (
                        <Text style={styles.timelineNumber}>{index + 1}</Text>
                      )}
                    </View>
                    {index < effectiveVaults.length - 1 && <View style={styles.timelineConnectorLine} />}
                  </View>

                  {/* Vault Card */}
                  <View
                    style={[
                      styles.vaultCard,
                      isActive && styles.vaultCardActive,
                      isLocked && styles.vaultCardLocked,
                    ]}
                  >
                    {/* Status Badge Row */}
                    <View style={styles.vaultHeaderRow}>
                      <View style={styles.vaultIconTitleWrap}>
                        <View
                          style={[
                            styles.vaultIconBox,
                            { backgroundColor: isLocked ? '#F1F5F9' : meta.bg },
                          ]}
                        >
                          {getCategoryIcon(
                            vault.iconName,
                            18,
                            isLocked ? '#94A3B8' : meta.color
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.vaultTitle,
                              isLocked && { color: '#64748B' },
                            ]}
                          >
                            {vault.title}
                          </Text>
                          <Text style={styles.vaultTargetDate}>Target: {vault.targetDate}</Text>
                        </View>
                      </View>

                      {/* Stage Pill */}
                      <View
                        style={[
                          styles.stagePill,
                          isCompleted && styles.stagePillCompleted,
                          isActive && styles.stagePillActive,
                          isLocked && styles.stagePillLocked,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stagePillText,
                            isCompleted && styles.stagePillTextCompleted,
                            isActive && styles.stagePillTextActive,
                            isLocked && styles.stagePillTextLocked,
                          ]}
                        >
                          {isCompleted ? '✓ COMPLETED' : isActive ? '● ACTIVE FOCUS' : '🔒 LOCKED'}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Metrics */}
                    {isLocked ? (
                      <View style={styles.lockedNoticeBox}>
                        <Lock size={13} color="#94A3B8" style={{ marginRight: 6 }} />
                        <Text style={styles.lockedNoticeText}>
                          Unlocks once {vaults[index - 1]?.title || 'previous milestone'} is 100%
                          achieved ({currencySymbol}{vault.targetAmount.toLocaleString('en-IN')} target).
                        </Text>
                      </View>
                    ) : (
                      <>
                        <View style={styles.vaultMetricsRow}>
                          <View>
                            <Text style={styles.vaultMetricLabel}>SAVED SO FAR</Text>
                            <Text style={styles.vaultSavedVal}>
                              {currencySymbol}{vault.currentAmount.toLocaleString('en-IN')}
                            </Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.vaultMetricLabel}>TARGET GOAL</Text>
                            <Text style={styles.vaultTargetVal}>
                              {currencySymbol}{vault.targetAmount.toLocaleString('en-IN')}
                            </Text>
                          </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.vaultProgressBarBg}>
                          <View
                            style={[
                              styles.vaultProgressBarFill,
                              {
                                width: `${Math.max(percent, 3)}%`,
                                backgroundColor: isCompleted ? '#059669' : '#7C3AED',
                              },
                            ]}
                          />
                        </View>

                        <View style={styles.vaultProgressMetaRow}>
                          <Text
                            style={[
                              styles.vaultPercentText,
                              { color: isCompleted ? '#059669' : '#7C3AED' },
                            ]}
                          >
                            {percent}% Funded
                          </Text>
                          <Text style={styles.vaultLeftText}>
                            {isCompleted
                              ? 'Goal Achieved!'
                              : `${currencySymbol}${remaining.toLocaleString('en-IN')} remaining`}
                          </Text>
                        </View>

                        {/* Deposit Action */}
                        <View style={styles.vaultFooterRow}>
                          <Text style={styles.vaultAutoPaceText}>
                            +{currencySymbol}{vault.monthlyContribution?.toLocaleString('en-IN')}/mo planned
                          </Text>

                          <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                              setSelectedVaultForDeposit(vault);
                              setShowDepositModal(true);
                            }}
                            style={styles.vaultDepositBtn}
                          >
                            <Plus size={13} color="#FFFFFF" strokeWidth={2.5} />
                            <Text style={styles.vaultDepositBtnText}>Deposit</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              );
            }))}
          </View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SEGMENT 3: ACTIVE AI CHALLENGES & TASKS                        */}
        {/* ------------------------------------------------------------- */}
        {activeSegment === 'tasks' && (
          <View style={styles.habitsSection}>
            {/* Filter Pills */}
            <View style={styles.filterRow}>
              <Text style={styles.sectionTitle}>Active AI Challenges</Text>
              <View style={styles.filterPills}>
                {(['all', 'todo', 'done'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setFilter(f);
                    }}
                    style={[styles.filterPill, filter === f && styles.filterPillActive]}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        filter === f && styles.filterPillTextActive,
                      ]}
                    >
                      {f === 'all' ? 'All' : f === 'todo' ? 'To-Do' : 'Done'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {filteredTasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <Sparkles size={32} color="#7C3AED" />
                <Text style={styles.emptyCardTitle}>No challenges in this filter</Text>
                <Text style={styles.emptyCardSub}>Check the AI Stories tab to read weekly reports</Text>
              </View>
            ) : (
              filteredTasks.map((task) => {
                const isDone = Boolean(task.completed);
                const meta = CATEGORY_META[task.category] || CATEGORY_META.Lifestyle;

                return (
                  <Animated.View
                    key={task.id}
                    layout={LinearTransition.duration(240)}
                    style={styles.taskCardContainer}
                  >
                    <View style={[styles.taskCard, isDone && styles.taskCardDone]}>
                      {/* Left Checkbox */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleTaskPress(task)}
                        style={styles.checkboxTouch}
                      >
                        <View style={[styles.checkCircle, isDone && styles.checkCircleFilled]}>
                          {isDone && <Check size={12} color="#FFFFFF" strokeWidth={3.5} />}
                        </View>
                      </TouchableOpacity>

                      {/* Icon Circle */}
                      <View
                        style={[
                          styles.taskIconCircle,
                          { backgroundColor: isDone ? '#ECFDF5' : meta.bg },
                        ]}
                      >
                        {getCategoryIcon(task.iconName, 17, isDone ? '#059669' : meta.color)}
                      </View>

                      {/* Info */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleTaskPress(task)}
                        style={styles.taskContentCol}
                      >
                        <View style={styles.taskBadgeRow}>
                          <Text style={[styles.taskCategoryLabel, { color: '#7C3AED' }]}>
                            {task.impactTag || meta.label}
                          </Text>
                          <Text style={styles.taskSavingsAmount}>
                            {isDone ? 'Vaulted: ' : 'Target: '}{currencySymbol}
                            {task.savingsAmount.toLocaleString('en-IN')}
                          </Text>
                        </View>
                        <Text
                          style={[styles.taskTitleText, isDone && styles.taskTitleTextDone]}
                          numberOfLines={2}
                        >
                          {task.title}
                        </Text>
                      </TouchableOpacity>

                      {/* Action Pill */}
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => handleTaskPress(task)}
                        style={[
                          styles.taskActionPill,
                          isDone ? styles.taskActionPillDone : styles.taskActionPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.taskActionPillText,
                            isDone ? styles.taskActionPillTextDone : styles.taskActionPillTextActive,
                          ]}
                        >
                          {isDone ? '✓ Saved' : task.actionText || 'Complete'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                );
              })
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ------------------------------------------------------------- */}
      {/* MEDIUM EDITORIAL ARTICLE MODAL                                */}
      {/* ------------------------------------------------------------- */}
      <MediumArticleModal
        visible={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        tasks={tasks}
        activeVault={activeVault}
        onToggleTask={handleToggleTask}
      />

      {/* ------------------------------------------------------------- */}
      {/* CREATE NEW MILESTONE VAULT MODAL                               */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={showAddVaultModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddVaultModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowAddVaultModal(false)}
        >
          <Pressable
            style={[styles.addModalCard, { paddingBottom: Math.max(insets.bottom, 20) }]}
          >
            <View style={styles.addModalHeader}>
              <Text style={styles.addModalTitle}>Create Milestone Goal</Text>
              <TouchableOpacity onPress={() => setShowAddVaultModal(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>MILESTONE TITLE</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="e.g. Wireless Noise-Cancelling Earbuds"
              placeholderTextColor="#94A3B8"
              value={newVaultTitle}
              onChangeText={setNewVaultTitle}
            />

            <Text style={styles.inputLabel}>TARGET AMOUNT ({currencySymbol})</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="e.g. 8000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={newVaultAmount}
              onChangeText={setNewVaultAmount}
            />

            {/* Presets */}
            <View style={styles.presetChipsRow}>
              {PRESET_AMOUNTS.map((pAmt) => (
                <TouchableOpacity
                  key={pAmt}
                  onPress={() => setNewVaultAmount(pAmt.toString())}
                  style={[
                    styles.pAmtChip,
                    newVaultAmount === pAmt.toString() && styles.pAmtChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.pAmtChipText,
                      newVaultAmount === pAmt.toString() && styles.pAmtChipTextActive,
                    ]}
                  >
                    {currencySymbol}{pAmt.toLocaleString('en-IN')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Selector */}
            <Text style={styles.inputLabel}>CATEGORY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catChipsRow}
            >
              {Object.keys(CATEGORY_META).map((catKey) => {
                const meta = CATEGORY_META[catKey];
                const isSelected = newVaultCategory === catKey;
                return (
                  <TouchableOpacity
                    key={catKey}
                    onPress={() => setNewVaultCategory(catKey)}
                    style={[
                      styles.catChip,
                      isSelected && { borderColor: '#7C3AED', backgroundColor: '#F3E8FF' },
                    ]}
                  >
                    {getCategoryIcon(meta.icon, 14, isSelected ? '#7C3AED' : '#64748B')}
                    <Text
                      style={[
                        styles.catChipText,
                        isSelected && { color: '#7C3AED', fontWeight: '700' },
                      ]}
                    >
                      {meta.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreateCustomVault}
              style={styles.modalSubmitBtn}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.modalSubmitBtnText}>Add to Milestone Roadmap</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* QUICK DEPOSIT MODAL                                           */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={showDepositModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDepositModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowDepositModal(false)}
        >
          <Pressable style={styles.depositModalCard}>
            <View style={styles.addModalHeader}>
              <Text style={styles.addModalTitle}>Deposit to Milestone</Text>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedVaultForDeposit && (
              <View style={styles.depositVaultPreview}>
                <Text style={styles.depositVaultName}>{selectedVaultForDeposit.title}</Text>
                <Text style={styles.depositVaultCurrent}>
                  Current: {currencySymbol}{selectedVaultForDeposit.currentAmount?.toLocaleString('en-IN')} / {currencySymbol}
                  {selectedVaultForDeposit.targetAmount?.toLocaleString('en-IN')}
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>ENTER DEPOSIT AMOUNT ({currencySymbol})</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="e.g. 1000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
            />

            <View style={styles.presetChipsRow}>
              {[500, 1000, 2000, 5000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setDepositAmount(amt.toString())}
                  style={[
                    styles.pAmtChip,
                    depositAmount === amt.toString() && styles.pAmtChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.pAmtChipText,
                      depositAmount === amt.toString() && styles.pAmtChipTextActive,
                    ]}
                  >
                    +{currencySymbol}{amt.toLocaleString('en-IN')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleExecuteDeposit}
              style={[styles.modalSubmitBtn, { backgroundColor: '#059669', marginTop: 16 }]}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.modalSubmitBtnText}>Confirm Deposit</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MEDIUM ARTICLE READER MODAL                                   */}
      {/* ------------------------------------------------------------- */}
      <MediumArticleModal
        visible={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        tasks={effectiveTasks}
        activeVault={effectiveActiveVault}
        onTaskPress={handleTaskPress}
      />

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE TASK COMPLETION & SAVINGS MODAL                   */}
      {/* ------------------------------------------------------------- */}
      <CompleteTaskModal
        visible={showCompleteTaskModal}
        onClose={() => {
          setShowCompleteTaskModal(false);
          setSelectedTaskForCompletion(null);
        }}
        task={selectedTaskForCompletion}
        activeVault={effectiveActiveVault}
        onConfirmSavings={handleConfirmSavings}
        onUnmarkTask={handleUnmarkTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  toastBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  toastBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.canvas,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  screenHeaderTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 28,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.6,
  },
  screenHeaderSubtitle: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  newGoalHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  newGoalHeaderBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  coachCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  coachAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  coachAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachName: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 13.5,
    color: ThemeColors.textPrimary,
  },
  coachDate: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  coachMessage: {
    fontFamily: AppFonts.jakarta.medium,
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  coachProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coachProgressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: ThemeColors.borderSubtle,
    overflow: 'hidden',
  },
  coachProgressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: ThemeColors.primary,
  },
  coachPercentText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: ThemeColors.primary,
  },
  segmentWrapper: {
    marginBottom: 18,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1.2,
    borderColor: ThemeColors.borderSubtle,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
  },
  segmentBtnActive: {
    backgroundColor: ThemeColors.card,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  segmentBtnText: {
    fontFamily: AppFonts.jakarta.medium,
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  segmentBtnTextActive: {
    fontFamily: AppFonts.jakarta.bold,
    color: ThemeColors.textPrimary,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 18,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.2,
  },
  storiesContainer: {
    marginBottom: 20,
  },
  storyCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  storyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  storyTagBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  storyTagBadgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: ThemeColors.primary,
    letterSpacing: 0.6,
  },
  storyReadTime: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  storyHookTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 18,
    color: ThemeColors.textPrimary,
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  storySubDescription: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  storyPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  storyMiniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  storyMiniPillText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 10.5,
    color: ThemeColors.textSecondary,
  },
  storyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  storySavingsLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: ThemeColors.textMuted,
    letterSpacing: 0.6,
  },
  storySavingsAmount: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 16,
    color: ThemeColors.emerald,
  },
  readArticleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  readArticleBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 12,
    color: ThemeColors.primary,
  },
  vaultsContainer: {
    marginBottom: 20,
  },
  roadmapSubtext: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12.5,
    color: ThemeColors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  roadmapItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineNodeCol: {
    width: 32,
    alignItems: 'center',
    marginRight: 8,
  },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ThemeColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    zIndex: 1,
  },
  timelineDotActive: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
  },
  timelineDotCompleted: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  timelineDotLocked: {
    backgroundColor: ThemeColors.surface,
    borderColor: ThemeColors.border,
  },
  timelineNumber: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  timelineConnectorLine: {
    position: 'absolute',
    width: 2,
    top: 26,
    bottom: -16,
    backgroundColor: ThemeColors.border,
  },
  vaultCard: {
    flex: 1,
    backgroundColor: ThemeColors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  vaultCardActive: {
    borderColor: '#FED7AA',
    borderWidth: 1.5,
  },
  vaultCardLocked: {
    backgroundColor: ThemeColors.surface,
    opacity: 0.85,
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vaultIconTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  vaultIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 15.5,
    color: ThemeColors.textPrimary,
  },
  vaultTargetDate: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 11,
    color: ThemeColors.textSecondary,
    marginTop: 1,
  },
  stagePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stagePillActive: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  stagePillCompleted: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  stagePillLocked: {
    backgroundColor: ThemeColors.surface,
  },
  stagePillText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
  },
  stagePillTextActive: {
    color: ThemeColors.primary,
  },
  stagePillTextCompleted: {
    color: ThemeColors.emerald,
  },
  stagePillTextLocked: {
    color: ThemeColors.textMuted,
  },
  lockedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.surface,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  lockedNoticeText: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 11,
    color: ThemeColors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  vaultMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vaultMetricLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 9.5,
    color: ThemeColors.textMuted,
    letterSpacing: 0.6,
  },
  vaultSavedVal: {
    fontFamily: AppFonts.outfit.extraBold,
    fontSize: 17,
    color: ThemeColors.textPrimary,
  },
  vaultTargetVal: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  vaultProgressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ThemeColors.borderSubtle,
    overflow: 'hidden',
  },
  vaultProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  vaultProgressMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 12,
  },
  vaultPercentText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
  },
  vaultLeftText: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 10.5,
    color: ThemeColors.textSecondary,
  },
  vaultFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  vaultAutoPaceText: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  vaultDepositBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vaultDepositBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  habitsSection: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  filterPillActive: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
  },
  filterPillText: {
    fontFamily: AppFonts.jakarta.medium,
    fontSize: 11,
    color: ThemeColors.textSecondary,
  },
  filterPillTextActive: {
    fontFamily: AppFonts.jakarta.bold,
    color: '#FFFFFF',
  },
  taskCardContainer: {
    marginBottom: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  taskCardDone: {
    backgroundColor: ThemeColors.surface,
    opacity: 0.85,
  },
  checkboxTouch: {
    marginRight: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleFilled: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  taskIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  taskContentCol: {
    flex: 1,
    marginRight: 8,
  },
  taskBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  taskCategoryLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  taskSavingsAmount: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 11.5,
    color: ThemeColors.textSecondary,
  },
  taskTitleText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 13.5,
    color: ThemeColors.textPrimary,
  },
  taskTitleTextDone: {
    textDecorationLine: 'line-through',
    color: ThemeColors.textMuted,
  },
  taskActionPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  taskActionPillActive: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  taskActionPillDone: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  taskActionPillText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 11,
  },
  taskActionPillTextActive: {
    color: ThemeColors.primary,
  },
  taskActionPillTextDone: {
    color: ThemeColors.emerald,
  },
  emptyCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  emptyCardTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginTop: 10,
  },
  emptyCardSub: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12.5,
    color: ThemeColors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  addModalCard: {
    backgroundColor: ThemeColors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  addModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addModalTitle: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 19,
    color: ThemeColors.textPrimary,
  },
  inputLabel: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: ThemeColors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  textInputField: {
    backgroundColor: ThemeColors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    fontFamily: AppFonts.jakarta.medium,
    color: ThemeColors.textPrimary,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 10,
  },
  pAmtChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  pAmtChipActive: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.2,
    borderColor: '#FFEDD5',
  },
  pAmtChipText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  pAmtChipTextActive: {
    color: ThemeColors.primary,
  },
  catChipsRow: {
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.card,
  },
  catChipText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ThemeColors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  modalSubmitBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  depositModalCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 'auto',
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  depositVaultPreview: {
    backgroundColor: ThemeColors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
  },
  depositVaultName: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  depositVaultCurrent: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  tabEmptyContainer: {
    backgroundColor: ThemeColors.card,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  tabEmptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  tabEmptyTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 16,
    color: ThemeColors.textPrimary,
    textAlign: 'center',
  },
  tabEmptySub: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
  tabEmptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  tabEmptyActionBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  generateAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  generateAiBtnDisabled: {
    opacity: 0.65,
  },
  generateAiBtnText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  compactScheduleCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    marginTop: 6,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  compactScheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compactScheduleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  compactScheduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  compactScheduleTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  compactScheduleBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  compactScheduleBadgeText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: ThemeColors.primary,
    letterSpacing: 0.3,
  },
  compactScheduleSubtext: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 11.5,
    color: ThemeColors.textSecondary,
    lineHeight: 16,
  },
});


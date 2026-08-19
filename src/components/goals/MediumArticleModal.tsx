import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {
  X,
  Sparkles,
  HeartPulse,
  Users,
  TrendingUp,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Report, WeeklyGoal, MilestoneVault } from '@/db/schema';
import { useAppStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MediumArticleModalProps {
  visible: boolean;
  onClose: () => void;
  report: Report | null;
  tasks: WeeklyGoal[];
  activeVault: MilestoneVault | null;
  onToggleTask?: (taskId: string) => Promise<any>;
  onTaskPress?: (task: WeeklyGoal) => void;
}

export const MediumArticleModal: React.FC<MediumArticleModalProps> = ({
  visible,
  onClose,
  report,
  tasks,
  activeVault,
  onToggleTask,
  onTaskPress,
}) => {
  const insets = useSafeAreaInsets();
  const { currencySymbol = '₹' } = useAppStore();

  if (!report) return null;

  // Filter tasks belonging to this report, or fallback to first 3 tasks
  const reportTasks = tasks.filter((t) => {
    if (t.reportId === report.id) return true;
    if (!t.reportId && report.periodType === 'weekly') return true;
    return false;
  });

  const displayTasks = reportTasks.length > 0 ? reportTasks : tasks.slice(0, 3);
  const completedCount = displayTasks.filter((t) => t.completed).length;

  const handleTaskPress = async (task: WeeklyGoal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onTaskPress) {
      onTaskPress(task);
    } else if (onToggleTask) {
      await onToggleTask(task.id);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Top Sticky Nav */}
        <View style={[styles.topNav, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.navMeta}>
            <BookOpen size={15} color="#7C3AED" style={{ marginRight: 6 }} />
            <Text style={styles.navTag}>LOOOP ESSAYS • {report.readTime.toUpperCase()}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Editorial Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Article Header */}
          <View style={styles.headerSection}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {report.periodType === 'weekly' ? 'WEEKLY FINANCIAL BIO' : 'MONTHLY DEEP DIVE'}
              </Text>
            </View>

            <Text style={styles.hookTitle}>{report.hookTitle}</Text>

            <Text style={styles.subDescription}>{report.subDescription}</Text>

            {/* Author & Read Time Row */}
            <View style={styles.authorRow}>
              <View style={styles.authorAvatar}>
                <Sparkles size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.authorName}>AI Financial Biographer</Text>
                <Text style={styles.articleMeta}>
                  {report.periodLabel} • {report.readTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* 3-Pillar Impact Matrix (Health, Family, Wealth) */}
          <View style={styles.impactMatrixSection}>
            <Text style={styles.sectionHeaderLabel}>3-DIMENSIONAL IMPACT ANALYSIS</Text>

            {/* Health Pillar */}
            <View style={styles.impactCard}>
              <View style={[styles.impactIconBox, { backgroundColor: '#FEE2E2' }]}>
                <HeartPulse size={18} color="#EF4444" />
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactCardTitle}>Health & Vitality</Text>
                <Text style={styles.impactCardBody}>{report.impactHealth}</Text>
              </View>
            </View>

            {/* Family Pillar */}
            <View style={styles.impactCard}>
              <View style={[styles.impactIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Users size={18} color="#0284C7" />
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactCardTitle}>Family, Memories & Peace</Text>
                <Text style={styles.impactCardBody}>{report.impactFamily}</Text>
              </View>
            </View>

            {/* Long-term Wealth Pillar */}
            <View style={styles.impactCard}>
              <View style={[styles.impactIconBox, { backgroundColor: '#ECFDF5' }]}>
                <TrendingUp size={18} color="#059669" />
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactCardTitle}>Long-Term Milestone Impact</Text>
                <Text style={styles.impactCardBody}>{report.impactFinance}</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Full Narrative Story (Medium Article Prose) */}
          <View style={styles.articleBodySection}>
            {report.fullArticle.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <Text key={index} style={styles.articleSubheading}>
                    {paragraph.replace('### ', '')}
                  </Text>
                );
              }
              return (
                <Text key={index} style={styles.articleParagraph}>
                  {paragraph}
                </Text>
              );
            })}
          </View>

          {/* Quote Highlight Box */}
          <View style={styles.pullQuoteCard}>
            <Text style={styles.pullQuoteText}>
              “Money is not just a number on a statement—it is frozen time and future options with
              the people you love.”
            </Text>
          </View>

          {/* Embedded AI Actionable Tasks */}
          <View style={styles.tasksSection}>
            <View style={styles.tasksHeaderRow}>
              <View>
                <Text style={styles.sectionHeaderLabel}>ACTIONABLE AI CHALLENGES</Text>
                <Text style={styles.tasksSectionSub}>
                  Tick to save directly into your active milestone:
                </Text>
              </View>
              <View style={styles.tasksCountPill}>
                <Text style={styles.tasksCountPillText}>
                  {completedCount}/{displayTasks.length} Done
                </Text>
              </View>
            </View>

            {/* Target Vault Deposit Badge */}
            {activeVault && (
              <View style={styles.activeVaultBanner}>
                <ShieldCheck size={16} color="#7C3AED" />
                <Text style={styles.activeVaultBannerText}>
                  Active Vault: <Text style={{ fontWeight: '800' }}>{activeVault.title}</Text> ({currencySymbol}
                  {activeVault.currentAmount.toLocaleString('en-IN')} / {currencySymbol}
                  {activeVault.targetAmount.toLocaleString('en-IN')})
                </Text>
              </View>
            )}

            {/* Task Cards */}
            <View style={styles.taskListContainer}>
              {displayTasks.map((task) => {
                const isDone = Boolean(task.completed);
                return (
                  <TouchableOpacity
                    key={task.id}
                    activeOpacity={0.8}
                    onPress={() => handleTaskPress(task)}
                    style={[styles.taskItemCard, isDone && styles.taskItemCardDone]}
                  >
                    <View style={[styles.taskCheckbox, isDone && styles.taskCheckboxDone]}>
                      {isDone && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                    </View>

                    <View style={styles.taskItemInfo}>
                      <View style={styles.taskItemBadgeRow}>
                        <Text style={styles.taskItemImpactTag}>{task.impactTag || task.category}</Text>
                        <Text style={styles.taskItemSavings}>
                          {isDone ? 'Saved ' : 'Potential: '}{currencySymbol}{task.savingsAmount.toLocaleString('en-IN')}
                        </Text>
                      </View>
                      <Text
                        style={[styles.taskItemTitle, isDone && styles.taskItemTitleDone]}
                        numberOfLines={2}
                      >
                        {task.title}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.taskPillAction,
                        isDone ? styles.taskPillActionDone : styles.taskPillActionActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.taskPillActionText,
                          isDone ? styles.taskPillActionTextDone : styles.taskPillActionTextActive,
                        ]}
                      >
                        {isDone ? '✓ Vaulted' : '+ Save'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bottom Estimated Savings Summary Banner */}
          <View style={styles.savingsHeroSummary}>
            <View style={styles.savingsHeroLeft}>
              <Text style={styles.savingsHeroLabel}>TOTAL ESTIMATED SAVINGS</Text>
              <Text style={styles.savingsHeroAmount}>
                {currencySymbol}{report.estimatedSavings.toLocaleString('en-IN')}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={styles.applyAllBtn}
            >
              <Text style={styles.applyAllBtnText}>Return to Goals</Text>
              <ArrowRight size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  navMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.6,
  },
  hookTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 23,
    marginBottom: 18,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  articleMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  impactMatrixSection: {
    marginBottom: 10,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  impactIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  impactContent: {
    flex: 1,
  },
  impactCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  impactCardBody: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
  },
  articleBodySection: {
    marginBottom: 16,
  },
  articleSubheading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 18,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  articleParagraph: {
    fontSize: 15,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 25,
    marginBottom: 14,
  },
  pullQuoteCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  pullQuoteText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 22,
  },
  tasksSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  tasksHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tasksSectionSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  tasksCountPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tasksCountPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  activeVaultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  activeVaultBannerText: {
    fontSize: 12,
    color: '#6B21A8',
    flex: 1,
  },
  taskListContainer: {
    gap: 10,
  },
  taskItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskItemCardDone: {
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskCheckboxDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  taskItemInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskItemBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  taskItemImpactTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.4,
  },
  taskItemSavings: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  taskItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  taskItemTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskPillAction: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  taskPillActionActive: {
    backgroundColor: '#F3E8FF',
  },
  taskPillActionDone: {
    backgroundColor: '#ECFDF5',
  },
  taskPillActionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  taskPillActionTextActive: {
    color: '#7C3AED',
  },
  taskPillActionTextDone: {
    color: '#059669',
  },
  savingsHeroSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  savingsHeroLeft: {
    flex: 1,
  },
  savingsHeroLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  savingsHeroAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  applyAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  applyAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

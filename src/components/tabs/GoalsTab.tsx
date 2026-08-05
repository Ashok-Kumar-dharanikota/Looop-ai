import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  CheckSquare,
  Square,
  Sparkles,
  BookOpen,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Target,
  CheckCircle2,
} from 'lucide-react-native';

interface WeeklyTask {
  id: string;
  title: string;
  savings: string;
  completed: boolean;
}

interface WeeklyReport {
  id: string;
  categoryTag: string;
  readTime: string;
  dateRange: string;
  title: string;
  excerpt: string;
  savingsHighlight: string;
  topCategory: string;
  ruleQuote: string;
}

const INITIAL_TASKS: WeeklyTask[] = [
  {
    id: '1',
    title: 'Cap food delivery orders to max 2 this week',
    savings: 'Est. save ₹800',
    completed: false,
  },
  {
    id: '2',
    title: 'Auto-transfer ₹500 to Vault on Wednesday',
    savings: '+₹500 Vaulted',
    completed: true,
  },
  {
    id: '3',
    title: 'Review & cancel unused streaming subscription',
    savings: 'Est. save ₹499',
    completed: false,
  },
  {
    id: '4',
    title: 'Keep daily transport budget under ₹250',
    savings: 'Est. save ₹350',
    completed: true,
  },
];

const WEEKLY_REPORTS: WeeklyReport[] = [
  {
    id: 'r1',
    categoryTag: 'SAVIO AI ANALYST',
    readTime: '3 MIN READ',
    dateRange: 'JUN 3 - JUN 9',
    title: 'The 72-Hour Rule: How Pausing Micro-Purchases Retained 84% of Your Weekly Wealth',
    excerpt:
      'By cooking dinner twice this week instead of ordering out, you preserved 84% of your dining budget. Your spending velocity dropped 14% compared to last week.',
    savingsHighlight: '₹1,450 Saved',
    topCategory: 'Food & Dining',
    ruleQuote: 'Rule: Always wait 72 hours before completing non-essential online cart checkouts.',
  },
  {
    id: 'r2',
    categoryTag: 'FINANCIAL ESSAY',
    readTime: '4 MIN READ',
    dateRange: 'MAY 27 - JUN 2',
    title: 'Automating Wealth: Why Small Daily Micro-Deposits Outperform Massive Monthly Goals',
    excerpt:
      'Consistency beats intensity. Small automated daily vault transfers of ₹100 create a frictionless habit loop that generated over ₹3,100 this past month.',
    savingsHighlight: '+₹3,100 Vaulted',
    topCategory: 'Micro-Savings',
    ruleQuote: 'Rule: Set up automated daily rounds-ups to make saving feel invisible.',
  },
];

export const GoalsTab: React.FC = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [tasks, setTasks] = useState<WeeklyTask[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const textPrimary = isDark ? '#FFFFFF' : '#0F0F14';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? '#13131A' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#EAEAEA';
  const iconBtnBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F4F4F7';
  const quoteBg = isDark ? 'rgba(192, 132, 252, 0.12)' : 'rgba(192, 132, 252, 0.08)';

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.headerTitleRow}>
        <View>
          <View style={styles.headerBadge}>
            <Sparkles size={12} color="#C084FC" />
            <Text style={styles.headerBadgeText}>AI WEEKLY REPORT & GOALS</Text>
          </View>
          <Text style={[styles.mainTitle, { color: textPrimary }]}>Weekly Goals</Text>
        </View>

        <View style={[styles.progressCounterBadge, { backgroundColor: iconBtnBg }]}>
          <Target size={14} color="#C084FC" />
          <Text style={[styles.progressCounterText, { color: textPrimary }]}>
            {completedCount}/{tasks.length} Done
          </Text>
        </View>
      </View>

      {/* SECTION 1: AI GENERATED TINY WEEKLY GOALS (TO-DO TASKS) */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeading, { color: textPrimary }]}>
          AI Actionable Tasks for This Week
        </Text>
        <Text style={[styles.sectionSub, { color: textSecondary }]}>
          Micro-goals generated from your weekly spending report to help you save more.
        </Text>

        <View style={styles.taskList}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              activeOpacity={0.7}
              onPress={() => toggleTask(task.id)}
              style={[
                styles.tinyTaskCard,
                {
                  backgroundColor: cardBg,
                  borderColor: task.completed ? '#C084FC' : cardBorder,
                },
              ]}
            >
              <View style={styles.checkboxContainer}>
                {task.completed ? (
                  <CheckCircle2 size={20} color="#C084FC" />
                ) : (
                  <Square size={20} color={textSecondary} />
                )}
              </View>

              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    { color: textPrimary },
                    task.completed && styles.completedText,
                  ]}
                >
                  {task.title}
                </Text>
                <Text style={[styles.taskSavings, { color: task.completed ? '#C084FC' : textSecondary }]}>
                  {task.savings}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SECTION 2: MEDIUM-LIKE WEEKLY REPORTS */}
      <View style={styles.sectionContainer}>
        <View style={styles.reportHeaderRow}>
          <View>
            <Text style={[styles.sectionHeading, { color: textPrimary }]}>
              Medium Weekly Reports
            </Text>
            <Text style={[styles.sectionSub, { color: textSecondary }]}>
              Curated AI financial analysis & bite-sized wealth essays.
            </Text>
          </View>
        </View>

        <View style={styles.reportsList}>
          {WEEKLY_REPORTS.map((report) => (
            <View
              key={report.id}
              style={[
                styles.reportCard,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              {/* Meta Tag Line */}
              <View style={styles.metaRow}>
                <Text style={styles.categoryTag}>{report.categoryTag}</Text>
                <Text style={[styles.dotSep, { color: textSecondary }]}>•</Text>
                <Text style={[styles.readTime, { color: textSecondary }]}>{report.readTime}</Text>
                <Text style={[styles.dotSep, { color: textSecondary }]}>•</Text>
                <Text style={[styles.dateRange, { color: textSecondary }]}>{report.dateRange}</Text>
              </View>

              {/* Medium Article Catchy Title */}
              <Text style={[styles.reportTitle, { color: textPrimary }]}>
                {report.title}
              </Text>

              {/* Excerpt */}
              <Text style={[styles.reportExcerpt, { color: textSecondary }]}>
                {report.excerpt}
              </Text>

              {/* Stat Highlight Badges */}
              <View style={styles.statPillsRow}>
                <View style={[styles.statPill, { backgroundColor: 'rgba(34, 197, 94, 0.12)' }]}>
                  <TrendingUp size={12} color="#22C55E" />
                  <Text style={styles.statPillGreen}>{report.savingsHighlight}</Text>
                </View>

                <View style={[styles.statPill, { backgroundColor: iconBtnBg }]}>
                  <Text style={[styles.statPillText, { color: textSecondary }]}>
                    {report.topCategory}
                  </Text>
                </View>
              </View>

              {/* Rule Quote Banner */}
              <View style={[styles.quoteBanner, { backgroundColor: quoteBg }]}>
                <BookOpen size={14} color="#C084FC" />
                <Text style={[styles.quoteText, { color: textPrimary }]}>
                  {report.ruleQuote}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C084FC',
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  progressCounterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  progressCounterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 14,
  },
  taskList: {
    gap: 10,
  },
  tinyTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskSavings: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  reportHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportsList: {
    gap: 16,
  },
  reportCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C084FC',
    letterSpacing: 0.8,
  },
  dotSep: {
    fontSize: 10,
  },
  readTime: {
    fontSize: 10,
    fontWeight: '600',
  },
  dateRange: {
    fontSize: 10,
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 8,
  },
  reportExcerpt: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  statPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statPillGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  quoteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
  },
  quoteText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    fontStyle: 'italic',
  },
});

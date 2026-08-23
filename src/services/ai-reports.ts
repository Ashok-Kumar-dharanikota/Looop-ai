import { getAI, getGenerativeModel, Schema } from '@react-native-firebase/ai';
import { db } from '@/db/client';
import {
  transactions,
  userSettings,
  milestoneVaults,
  reports,
  weeklyGoals,
  type Report,
  type WeeklyGoal,
  type NewReport,
  type NewWeeklyGoal,
} from '@/db/schema';
import { desc, asc } from 'drizzle-orm';
import { getAppCheckInstance, extractJsonFromText } from './firebase-ai';

const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
];

export interface SuggestedChallenge {
  title: string;
  category: string;
  savingsAmount: number;
  impactTag: string;
  iconName: string;
}

export interface GeneratedReportResult {
  periodType: 'weekly' | 'monthly';
  periodLabel: string;
  hookTitle: string;
  subDescription: string;
  readTime: string;
  fullArticle: string;
  impactHealth: string;
  impactFamily: string;
  impactFinance: string;
  estimatedSavings: number;
  tasks: SuggestedChallenge[];
}

export interface GenerateReportOptions {
  periodType?: 'weekly' | 'monthly';
  isInitialOnboarding?: boolean;
  onboardingData?: {
    leakCategory?: string;
    leakCategoryName?: string;
    leakEstimatedCost?: number;
    frustration?: string;
    primaryGoal?: string;
    monthlyIncome?: string;
    monthlySavingsTarget?: string;
    mustPayments?: Array<{ id: string; name: string; amount: number; category: string }>;
    totalMustPayments?: number;
  };
}

/**
 * Creates the Gemini JSON Schema for AI Behavioral Financial Reports.
 */
function createReportResponseSchema(): Schema {
  return Schema.object({
    properties: {
      periodType: Schema.enumString({
        enum: ['weekly', 'monthly'],
        description: 'Type of report period.',
      }),
      periodLabel: Schema.string({
        description: 'Formatted period label (e.g. "Week of Aug 17 – 23, 2026" or "August 2026 Edition").',
      }),
      hookTitle: Schema.string({
        description: 'Provocative Substack/Medium-style editorial headline focusing on spending psychology.',
      }),
      subDescription: Schema.string({
        description: 'Compelling 2-sentence subtitle summarizing the behavioural diagnosis.',
      }),
      readTime: Schema.string({
        description: 'Estimated reading time (e.g. "3 min read").',
      }),
      fullArticle: Schema.string({
        description:
          '4-5 paragraph rich narrative essay with "### Subheadings" analyzing subconscious spending triggers, convenience tax, and long-term trajectory.',
      }),
      impactHealth: Schema.string({
        description: 'Specific health, sleep, nutrition, or mental clarity impact.',
      }),
      impactFamily: Schema.string({
        description: 'Specific impact on relationships, quality time, or peace of mind.',
      }),
      impactFinance: Schema.string({
        description: 'Financial compound impact, milestone acceleration, and opportunity cost.',
      }),
      estimatedSavings: Schema.number({
        description: 'Realistic estimated potential monthly savings from these adjustments.',
      }),
      tasks: Schema.array({
        items: Schema.object({
          properties: {
            title: Schema.string({
              description: 'Actionable micro-challenge (e.g. "Cook 2 dinners at home this week").',
            }),
            category: Schema.string({
              description: 'Category: Food, Transport, Subscriptions, Shopping, or Lifestyle.',
            }),
            savingsAmount: Schema.number({
              description: 'Estimated monetary amount saved by completing this challenge.',
            }),
            impactTag: Schema.string({
              description: 'Short tag (e.g. "Health & Wealth", "Peace of Mind", "Focus").',
            }),
            iconName: Schema.string({
              description: 'Icon name: Utensils, Coffee, Bus, Sparkles, ShieldCheck, or ShoppingBag.',
            }),
          },
          optionalProperties: [],
        }),
        description: 'List of 2 to 3 actionable, high-impact habit challenges.',
      }),
    },
    optionalProperties: [],
  });
}

/**
 * Builds the editorial system prompt for Gemini Flash-Lite.
 */
function buildReportSystemPrompt(): string {
  return `You are an elite behavioral finance biographer and behavioral psychologist (writing in the voice of Morgan Housel, James Clear, and Packy McCormick).
Your role is to write a deeply engaging, non-judgmental, psychologically insightful personal finance essay based on the user's spending data and life goals.

Style & Philosophy:
- Money is frozen time, future optionality, and freedom—not just digits on a spreadsheet.
- Focus on the "friction-free convenience tax": micro-leaks like midnight food deliveries, surge cabs, unused subscriptions, and impulse online retail.
- Provide a 3-Dimensional impact: Health (vitality, sleep), Family (memories, peace of mind), and Finance (milestone funding).
- Write a 4-5 paragraph narrative with "### Subheading" markers between sections.
- Formulate 2 to 3 actionable, specific, gamified micro-challenges that the user can check off to save money this week.
- Output MUST strictly match the provided JSON schema.`;
}

export interface DetectedSpendingPattern {
  name: string;
  category: string;
  count: number;
  averageAmount: number;
  typicalAmount: number;
  totalSpent: number;
}

export function detectSpendingPatterns(
  txList: Array<{ title?: string; description?: string | null; amount: number; category: string }>
): DetectedSpendingPattern[] {
  const expenseTxs = txList;
  if (expenseTxs.length === 0) return [];

  const itemMap: Record<
    string,
    {
      normalizedName: string;
      category: string;
      amounts: number[];
      totalSpent: number;
    }
  > = {};

  expenseTxs.forEach((t) => {
    const rawTitle = ((t.description || t.title || t.category) || '').trim();
    if (!rawTitle) return;

    let normalized = rawTitle;
    const lower = rawTitle.toLowerCase();

    if (lower.includes('biryani') || lower.includes('biriyani')) {
      normalized = 'Biryani';
    } else if (lower.includes('swiggy')) {
      normalized = 'Swiggy Delivery';
    } else if (lower.includes('zomato')) {
      normalized = 'Zomato Delivery';
    } else if (lower.includes('uber') || lower.includes('ola') || lower.includes('cab')) {
      normalized = 'Cab / Ride';
    } else if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('cafe')) {
      normalized = 'Coffee / Cafe';
    } else if (lower.includes('pizza') || lower.includes('dominos') || lower.includes('burger')) {
      normalized = 'Fast Food / Dining';
    } else if (lower.includes('blinkit') || lower.includes('zepto') || lower.includes('instamart')) {
      normalized = 'Quick Grocery / Snacks';
    } else if (lower.includes('amazon') || lower.includes('flipkart') || lower.includes('myntra')) {
      normalized = 'Online Shopping';
    } else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('youtube')) {
      normalized = 'Digital Subscription';
    } else {
      normalized = rawTitle.split('-')[0].split('(')[0].trim();
    }

    if (!itemMap[normalized]) {
      itemMap[normalized] = {
        normalizedName: normalized,
        category: t.category || 'Food & Dining',
        amounts: [],
        totalSpent: 0,
      };
    }
    itemMap[normalized].amounts.push(Math.abs(t.amount));
    itemMap[normalized].totalSpent += Math.abs(t.amount);
  });

  return Object.values(itemMap)
    .map((item) => {
      const count = item.amounts.length;
      const total = item.totalSpent;
      const avg = Math.round(total / count);

      const freqMap: Record<number, number> = {};
      item.amounts.forEach((a) => {
        const rounded = Math.round(a);
        freqMap[rounded] = (freqMap[rounded] || 0) + 1;
      });
      let modeAmount = avg;
      let maxFreq = 0;
      Object.entries(freqMap).forEach(([amtStr, freq]) => {
        if (freq > maxFreq) {
          maxFreq = freq;
          modeAmount = Number(amtStr);
        }
      });

      return {
        name: item.normalizedName,
        category: item.category,
        count,
        averageAmount: avg,
        typicalAmount: modeAmount,
        totalSpent: Math.round(total),
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

/**
 * Generates an intelligent, personalized fallback story if offline or with minimal transactions.
 */
function generateDynamicFallbackReport(
  periodType: 'weekly' | 'monthly',
  userContext: {
    income: number;
    savingsTarget: number;
    leakCategory: string;
    primaryGoal: string;
    currencySymbol: string;
    totalSpent: number;
    topCategory: string;
    detectedPatterns?: DetectedSpendingPattern[];
  }
): GeneratedReportResult {
  const currency = userContext.currencySymbol || '₹';
  const leak = userContext.leakCategory || 'Late-Night Food Delivery & Orders';
  const target = userContext.savingsTarget || 20000;
  const patterns = userContext.detectedPatterns || [];
  const topPattern = patterns[0] || null;

  const isFood =
    (topPattern && topPattern.category.toLowerCase().includes('food')) ||
    leak.toLowerCase().includes('food') ||
    userContext.topCategory.toLowerCase().includes('food');
  const isCab =
    (topPattern && topPattern.category.toLowerCase().includes('transport')) ||
    leak.toLowerCase().includes('cab') ||
    leak.toLowerCase().includes('transport');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const periodLabel =
    periodType === 'weekly' ? `Week of ${dateStr}` : `${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Edition`;

  // Realistic Item and Typical Price calculations
  const foodItemName = topPattern?.name || 'late-night food delivery';
  const foodTypicalPrice = topPattern?.typicalAmount || 380;
  const cabTypicalPrice = topPattern?.typicalAmount || 260;

  if (isFood) {
    return {
      periodType,
      periodLabel,
      hookTitle: `The ${foodItemName} Habit: The Hidden Convenience Tax Draining Future Freedom`,
      subDescription:
        'A behavioral breakdown of fatigue-driven dining decisions and the subtle compound cost of friction-free ordering.',
      readTime: '3 min read',
      impactHealth:
        'Late-night high-sodium meals directly correlate with fragmented REM sleep and next-day energy dips.',
      impactFamily:
        'Cooking simple meals together creates shared ritual and reclaiming 30 mindful minutes in the evening.',
      impactFinance: `Redirecting ${currency}${(foodTypicalPrice * 8).toLocaleString('en-IN')} monthly from impulse delivery accelerates your savings milestones by 3.2 months.`,
      estimatedSavings: foodTypicalPrice * 8,
      fullArticle: `Most financial leaks do not happen in broad daylight. They happen at 11:15 PM when willpower is depleted, your phone screen is bright, and two taps bring ${foodItemName.toLowerCase()} to your door in 20 minutes.\n\n### The Anatomy of Frictionless Spending\nModern digital apps have perfected the removal of friction. When pain points in paying disappear, your brain stops evaluating the value exchange. A ${currency}${foodTypicalPrice} order feels identical to a simple tap. Over 12 months, this convenience tax quietly siphons tens of thousands of units of currency that were meant for your long-term freedom.\n\n### The True Price of Convenience\nThe real cost isn't just the monetary sum on your card. It's the compound consequence: disrupted sleep cycles, sluggish mornings, and the subtle anxiety of watching your monthly savings target drift out of reach.\n\n### Reclaiming the Buffer\nYou do not need Spartan frugality. You need conscious speed bumps. By batch-preparing easy comfort food or setting a delivery curfew, you instantly regain control over both your biology and your bank balance.`,
      tasks: [
        {
          title: `Skip 1 ${foodItemName} order this week and prepare dinner at home`,
          category: 'Food',
          savingsAmount: foodTypicalPrice,
          impactTag: 'Health & Wealth',
          iconName: 'Utensils',
        },
        {
          title: 'Set a 9:30 PM delivery app curfew for 3 consecutive days',
          category: 'Lifestyle',
          savingsAmount: foodTypicalPrice * 2,
          impactTag: 'Deep Sleep & Clarity',
          iconName: 'Coffee',
        },
        {
          title: `Move ${currency}1,000 to your active Milestone Vault`,
          category: 'Vault',
          savingsAmount: 1000,
          impactTag: 'Milestone Momentum',
          iconName: 'ShieldCheck',
        },
      ],
    };
  }

  if (isCab) {
    return {
      periodType,
      periodLabel,
      hookTitle: 'Surge Pricing & Rush Habits: The Hidden Price of Leaving 10 Minutes Late',
      subDescription:
        'How morning decision fatigue leads to automatic cab booking and unnecessary transport friction.',
      readTime: '3 min read',
      impactHealth:
        'Rushing into traffic spikes morning cortisol levels, setting a reactive tone for the entire workday.',
      impactFamily:
        'Predictable morning routines create calmer departures and less frantic evening commutes.',
      impactFinance: `Trimming surge ride costs saves approximately ${currency}${(cabTypicalPrice * 10).toLocaleString('en-IN')} monthly, directly funding your priority vaults.`,
      estimatedSavings: cabTypicalPrice * 10,
      fullArticle: `The most expensive 10 minutes of your day are the ones you spend hitting snooze. Leaving home just slightly behind schedule transforms an inexpensive commute into a premium surge cab ride.\n\n### The Cost of Reactive Commutes\nWhen time is tight, we gladly trade money for relief. But repeated daily, this routine turns emergency convenience into an invisible baseline expense.\n\n### Designing Seamless Mornings\nPlanning your departure just 15 minutes earlier completely eliminates the surge premium while offering a much calmer headspace before your workday starts.`,
      tasks: [
        {
          title: 'Take public transit or carpool instead of 2 cab rides',
          category: 'Transport',
          savingsAmount: cabTypicalPrice * 2,
          impactTag: 'Stress Relief & Savings',
          iconName: 'Bus',
        },
        {
          title: 'Plan tomorrow’s departure time 15 mins earlier',
          category: 'Lifestyle',
          savingsAmount: cabTypicalPrice,
          impactTag: 'Calm Mornings',
          iconName: 'Sparkles',
        },
      ],
    };
  }

  // General / Shopping / Lifestyle diagnosis
  return {
    periodType,
    periodLabel,
    hookTitle: 'The Micro-Leak Audit: How Small Swipes Silently Shift Your Life Timeline',
    subDescription:
      'Understanding how unmonitored everyday swipes aggregate into significant delays for your biggest life goals.',
    readTime: '3 min read',
    impactHealth:
      'Clarity over your cash flow reduces baseline financial background stress and improves mental well-being.',
    impactFamily:
      'Clear budgeting ensures guilt-free, fully funded experiences with family and loved ones.',
    impactFinance: `Plugging baseline subscription and retail leaks unlocks ${currency}3,000+ in monthly compound wealth.`,
    estimatedSavings: 3000,
    fullArticle: `We rarely go broke from giant, dramatic purchases. We fall behind on our dreams through thousand tiny cuts: forgotten subscriptions, spontaneous online shopping taps, and untracked weekend extras.\n\n### The Illusion of Small Numbers\nWhen an expense is under ${currency}500, our cognitive alarm bells remain silent. Yet twenty ${currency}300 transactions quietly swallow ${currency}6,000 every single month.\n\n### Aligning Capital with What Actually Matters\nEvery currency unit you don't spend on fleeting convenience is an employee working toward your future autonomy. Giving every rupee or dollar a clear job changes how you see wealth forever.`,
    tasks: [
      {
        title: 'Audit and cancel 1 unused digital subscription',
        category: 'Subscriptions',
        savingsAmount: 500,
        impactTag: 'Zero-Effort Savings',
        iconName: 'Sparkles',
      },
      {
        title: 'Implement a 24-hour waiting rule before non-essential purchases',
        category: 'Shopping',
        savingsAmount: 1200,
        impactTag: 'Mindful Spending',
        iconName: 'ShoppingBag',
      },
      {
        title: `Auto-deposit ${currency}1,000 to your Milestone Vault`,
        category: 'Vault',
        savingsAmount: 1000,
        impactTag: 'Milestone Progress',
        iconName: 'ShieldCheck',
      },
    ],
  };
}

/**
 * Main AI Spending Story generation engine.
 * Gathers user data, calls Firebase AI (Gemini), falls back gracefully if offline,
 * persists the generated report into SQLite, and links the actionable weekly goals.
 */
export async function generateAndSaveAIReport(
  options: GenerateReportOptions = {}
): Promise<{ report: Report; tasks: WeeklyGoal[] }> {
  const periodType = options.periodType || 'weekly';

  try {
    // 1. Gather context from SQLite
    const txList = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.date), desc(transactions.timestamp))
      .limit(40);

    const settingsList = await db.select().from(userSettings);
    const vaultsList = await db.select().from(milestoneVaults).orderBy(asc(milestoneVaults.targetAmount));

    const settingsMap = new Map<string, string>();
    settingsList.forEach((s) => settingsMap.set(s.key, s.value));

    const income = parseFloat(
      options.onboardingData?.monthlyIncome || settingsMap.get('monthlyIncome') || '75000'
    );
    const savingsTarget = parseFloat(
      options.onboardingData?.monthlySavingsTarget || settingsMap.get('monthlySavingsTarget') || '20000'
    );
    const leakCategory =
      options.onboardingData?.leakCategory ||
      settingsMap.get('primaryLeakCategory') ||
      'Late-Night Food Delivery & Orders';
    const primaryGoal =
      options.onboardingData?.primaryGoal || settingsMap.get('primaryGoal') || 'Emergency Buffer';
    const currencySymbol = settingsMap.get('currency') || '₹';

    // Detect recurring items and typical price points
    const detectedPatterns = detectSpendingPatterns(txList);

    // Summarize transactions
    const totalSpent = txList.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categoryBreakdown: Record<string, number> = {};
    txList.forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Math.abs(t.amount);
    });

    let topCategory = 'Food & Dining';
    let topCategoryAmount = 0;
    Object.entries(categoryBreakdown).forEach(([cat, amt]) => {
      if (amt > topCategoryAmount) {
        topCategoryAmount = amt;
        topCategory = cat;
      }
    });

    const activeVault = vaultsList.find((v) => v.currentAmount < v.targetAmount) || vaultsList[0];

    const rawMustPayments =
      options.onboardingData?.mustPayments ||
      (() => {
        try {
          const raw = settingsMap.get('mustPayments');
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })();

    const totalMustPayments =
      options.onboardingData?.totalMustPayments !== undefined
        ? options.onboardingData.totalMustPayments
        : parseFloat(settingsMap.get('totalMustPayments') || '0');

    const discretionaryIncome = Math.max(income - totalMustPayments, 0);

    const contextPayload = {
      periodType,
      income,
      totalMustPayments,
      discretionaryIncome,
      fixedObligations: rawMustPayments,
      savingsTarget,
      leakCategory,
      primaryGoal,
      currencySymbol,
      totalSpent,
      topCategory,
      detectedSpendingPatterns: detectedPatterns.slice(0, 5),
      activeVaultTitle: activeVault?.title || 'Emergency Fund',
      activeVaultTarget: activeVault?.targetAmount || 50000,
      activeVaultCurrent: activeVault?.currentAmount || 0,
      recentExpenses: txList.slice(0, 12).map((t) => ({
        title: t.description || t.category,
        amount: t.amount,
        category: t.category,
        date: t.date,
      })),
    };

    let generatedResult: GeneratedReportResult | null = null;

    // 2. Attempt AI Generation via Firebase AI (Gemini)
    try {
      const appCheck = getAppCheckInstance();
      const ai = getAI(undefined, {
        appCheck: appCheck || undefined,
      });

      const systemInstruction = buildReportSystemPrompt();
      const responseSchema = createReportResponseSchema();

      const userPrompt = `Write a personalized behavioral finance diagnostic essay for the user.
Context:
${JSON.stringify(contextPayload, null, 2)}

Requirements:
- Hook title must be punchy, thought-provoking, and reference the user's specific spending habits.
- If the user has specific recurring spending patterns (e.g. repeated purchases on items like Biryani at ${currencySymbol}380 or Uber at ${currencySymbol}260), explicitly name that exact item and exact typical price in the task description (e.g. "Skip 1 weekend Biryani order and cook a protein meal at home" with savingsAmount: 380).
- 3D Impact: Health, Family, and Wealth impact.
- 2-3 specific, gamified micro-challenges with realistic savings amounts in ${currencySymbol}.`;

      for (const modelName of CANDIDATE_GEMINI_MODELS) {
        try {
          console.log(`🤖 [Firebase AI Stories] Generating report with ${modelName}...`);
          const model = getGenerativeModel(ai, {
            model: modelName,
            systemInstruction: {
              role: 'system',
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema,
              temperature: 0.2,
              maxOutputTokens: 1000,
            },
          });

          const res = await model.generateContent(userPrompt);
          const text = res.response.text();
          if (text) {
            generatedResult = extractJsonFromText<GeneratedReportResult>(text);
            break;
          }
        } catch (mErr) {
          console.warn(`[Firebase AI Stories] Model ${modelName} failed:`, mErr);
        }
      }
    } catch (aiErr) {
      console.warn('[Firebase AI Stories] Gemini inference unavailable, using dynamic fallback:', aiErr);
    }

    // 3. Fallback if Gemini failed or offline
    if (!generatedResult || !generatedResult.hookTitle) {
      generatedResult = generateDynamicFallbackReport(periodType, {
        income,
        savingsTarget,
        leakCategory,
        primaryGoal,
        currencySymbol,
        totalSpent,
        topCategory,
        detectedPatterns,
      });
    }

    // 4. Persist Report in SQLite
    const reportId = `rep_${periodType}_${Date.now()}`;
    const newReportRecord: NewReport = {
      id: reportId,
      periodType: generatedResult.periodType || periodType,
      periodLabel: generatedResult.periodLabel || `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      hookTitle: generatedResult.hookTitle,
      subDescription: generatedResult.subDescription,
      readTime: generatedResult.readTime || '3 min read',
      fullArticle: generatedResult.fullArticle,
      impactHealth: generatedResult.impactHealth,
      impactFamily: generatedResult.impactFamily,
      impactFinance: generatedResult.impactFinance,
      estimatedSavings: generatedResult.estimatedSavings || 2500,
      tasksJson: JSON.stringify(generatedResult.tasks || []),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    await db.insert(reports).values(newReportRecord);

    // 5. Persist Linked Weekly Goals in SQLite
    const createdTasks: WeeklyGoal[] = [];
    const rawTasks = generatedResult.tasks || [];

    for (let i = 0; i < rawTasks.length; i++) {
      const t = rawTasks[i];
      const taskId = `g_ai_${Date.now()}_${i}`;
      const newTaskRecord: NewWeeklyGoal = {
        id: taskId,
        reportId: reportId,
        title: t.title,
        category: t.category || 'Lifestyle',
        savingsAmount: typeof t.savingsAmount === 'number' ? t.savingsAmount : parseFloat(String(t.savingsAmount)) || 500,
        completed: false,
        actionText: '✓ Complete',
        completedText: 'Saved!',
        impactTag: t.impactTag || 'Finance & Health',
        iconName: t.iconName || 'Sparkles',
        weekIdentifier: `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`,
        createdAt: new Date().toISOString(),
      };

      await db.insert(weeklyGoals).values(newTaskRecord);
      createdTasks.push({
        ...newTaskRecord,
        completedAt: null,
        reportId,
      } as WeeklyGoal);
    }

    const savedReport = {
      ...newReportRecord,
      tasksJson: JSON.stringify(createdTasks),
    } as Report;

    console.log(`✅ [AI Reports] Successfully published AI story: "${savedReport.hookTitle}" with ${createdTasks.length} challenges.`);

    return {
      report: savedReport,
      tasks: createdTasks,
    };
  } catch (error) {
    console.error('Fatal error generating and saving AI report:', error);
    throw error;
  }
}

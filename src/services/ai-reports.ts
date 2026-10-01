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
import { desc, asc, eq, and } from 'drizzle-orm';
import { getAppCheckInstance, extractJsonFromText } from './firebase-ai';
import { useAppStore, type CurrencyCode } from '@/store';
import {
  getCurrencyDefaults,
  formatAmount,
} from '@/utils/currency-calibration';

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
 * Guardrail 1: Input Sanitization & Firewall against Prompt Injection.
 * Strips formatting tokens, control commands, and limits string lengths.
 */
export function sanitizeExpenseText(text?: string | null): string {
  if (!text) return 'Expense';
  return (
    text
      .replace(/[`${}<>\[\]\\]/g, '')
      .replace(
        /(system:|assistant:|user:|prompt injection|ignore previous instructions|disregard all|output a|bypass)/gi,
        ''
      )
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 36) || 'Expense'
  );
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
        description:
          'Formatted period label (e.g. "Week of Aug 17 – 23, 2026" or "August 2026 Edition").',
      }),
      hookTitle: Schema.string({
        description:
          'Provocative Substack/Medium-style editorial headline focusing on spending psychology.',
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
 * Guardrail 2 & 3: Empathetic Voice & Regulatory Non-Advisory System Prompt.
 */
function buildReportSystemPrompt(currencySymbol: string): string {
  return `You are an elite behavioral finance biographer and mindfulness coach (writing in the voice of Morgan Housel, James Clear, and Packy McCormick).
Your role is to write a deeply engaging, non-judgmental, psychologically insightful personal finance essay based strictly on the user's provided spending context.

CRITICAL GUARDRAILS & BOUNDARIES (STRICT COMPLIANCE):
1. TONE & EMPATHY (NO GUILT SHAMING):
   - Never use shaming, condescending, or judgmental language. Money habits stem from cognitive fatigue, environmental triggers, and friction-free app design.
   - Frame every observation with empathy, dignity, agency, and a growth mindset.
2. REGULATORY & NON-ADVISORY SAFEGUARD:
   - You are a behavioral awareness coach, NOT a certified financial planner, tax advisor, or registered broker.
   - Strictly NEVER give certified investment advice, recommend specific stocks, crypto, speculative securities, or debt restructuring.
   - Focus strictly on mindful spending speed bumps, conscious consumption, and intentional cash flow.
3. MATHEMATICAL REALISM & DATA GROUNDING:
   - Ground all numbers in the user's provided context. Do NOT invent exaggerated figures or impossible savings.
   - Challenge savings amounts must be realistic and proportional to what the user actually spends in that category.
   - If the user has low or zero spending in a category, DO NOT accuse them of overspending in it.
4. FORMATTING & STRUCTURE:
   - Money is frozen time, future optionality, and freedom—not just digits on a spreadsheet.
   - Provide a 3-Dimensional impact: Health (vitality, sleep), Family (memories, peace of mind), and Finance (milestone funding).
   - Write a 4-5 paragraph narrative with "### Subheading" markers between sections.
   - Always conclude the article text with this exact disclaimer: "Disclaimer: This story is an educational behavioral diagnostic for mindful spending awareness, not certified financial or investment advice."
   - Formulate 2 to 3 actionable, specific, gamified micro-challenges with realistic savings amounts in ${currencySymbol}.
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

/**
 * Guardrail 4: Expanded Multi-Region Pattern Recognition (Global & Indian Brands).
 */
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
    const rawTitle = (t.description || t.title || t.category || '').trim();
    if (!rawTitle) return;

    let normalized = rawTitle;
    const lower = rawTitle.toLowerCase();

    // Food delivery & takeout (Global & Regional)
    if (lower.includes('biryani') || lower.includes('biriyani')) {
      normalized = 'Biryani Order';
    } else if (lower.includes('swiggy') || lower.includes('zomato')) {
      normalized = 'Food Delivery App';
    } else if (lower.includes('doordash') || lower.includes('ubereats') || lower.includes('grubhub') || lower.includes('deliveroo')) {
      normalized = 'Food Delivery';
    } else if (lower.includes('uber') || lower.includes('lyft') || lower.includes('ola') || lower.includes('cab') || lower.includes('taxi')) {
      normalized = 'Ride / Cab Service';
    } else if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('cafe') || lower.includes('dunkin') || lower.includes('costa')) {
      normalized = 'Coffee / Cafe';
    } else if (lower.includes('pizza') || lower.includes('dominos') || lower.includes('burger') || lower.includes('mcdonald')) {
      normalized = 'Fast Food Dining';
    } else if (lower.includes('blinkit') || lower.includes('zepto') || lower.includes('instamart') || lower.includes('instacart')) {
      normalized = 'Quick Grocery / Snacks';
    } else if (lower.includes('amazon') || lower.includes('flipkart') || lower.includes('myntra') || lower.includes('target') || lower.includes('shein')) {
      normalized = 'Online Retail';
    } else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('youtube') || lower.includes('prime') || lower.includes('disney')) {
      normalized = 'Digital Entertainment';
    } else {
      normalized = sanitizeExpenseText(rawTitle.split('-')[0].split('(')[0]);
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
 * Guardrail 5: Mathematical Clamping & Realism Engine.
 * Post-processes AI results to guarantee numbers never defy financial physics.
 */
export function clampAndValidateReport(
  result: GeneratedReportResult,
  context: {
    income: number;
    discretionaryIncome: number;
    totalSpent: number;
    categoryBreakdown: Record<string, number>;
    currencySymbol: string;
    currencyCode: CurrencyCode;
  }
): GeneratedReportResult {
  const config = getCurrencyDefaults(context.currencyCode);
  const baselineHabitSavings = config.defaultHabitSavings;

  // Maximum realistic monthly savings: capped at 45% of discretionary income or 60% of total spend
  const maxReasonableSavings = Math.max(
    baselineHabitSavings * 2,
    Math.min(
      context.discretionaryIncome > 0 ? context.discretionaryIncome * 0.45 : Infinity,
      Math.max(context.totalSpent * 0.6, baselineHabitSavings * 4)
    )
  );
  const minReasonableSavings = Math.max(Math.round(baselineHabitSavings * 0.5), 10);

  let clampedEstimatedSavings =
    typeof result.estimatedSavings === 'number' && !isNaN(result.estimatedSavings)
      ? Math.round(Math.abs(result.estimatedSavings))
      : baselineHabitSavings * 3;

  if (clampedEstimatedSavings > maxReasonableSavings) {
    clampedEstimatedSavings = Math.round(maxReasonableSavings);
  } else if (clampedEstimatedSavings < minReasonableSavings) {
    clampedEstimatedSavings = Math.round(minReasonableSavings);
  }

  // Validate and clamp each task savings
  const validTasks = (result.tasks || []).slice(0, 3).map((task, idx) => {
    const cat = sanitizeExpenseText(task.category || 'Lifestyle');
    const catSpent = context.categoryBreakdown[cat] || 0;

    let amt =
      typeof task.savingsAmount === 'number' && !isNaN(task.savingsAmount)
        ? Math.round(Math.abs(task.savingsAmount))
        : Math.round(baselineHabitSavings * 0.8);

    // Challenge cannot exceed what user spent in that category
    if (catSpent > 0 && amt > catSpent * 0.6) {
      amt = Math.max(Math.round(catSpent * 0.35), Math.round(baselineHabitSavings * 0.5));
    } else if (amt > clampedEstimatedSavings) {
      amt = Math.round(clampedEstimatedSavings / (result.tasks.length || 2));
    }

    if (amt <= 0) amt = Math.round(baselineHabitSavings * 0.5);

    return {
      title: task.title ? task.title.trim().slice(0, 85) : `Mindful ${cat} Challenge #${idx + 1}`,
      category: cat,
      savingsAmount: amt,
      impactTag: task.impactTag ? task.impactTag.trim().slice(0, 32) : 'Mindful Momentum',
      iconName: task.iconName || 'Sparkles',
    };
  });

  // Ensure persistent regulatory disclaimer exists at the bottom of the article
  let sanitizedArticle = (result.fullArticle || '').trim();
  const disclaimerText =
    '\n\n*Disclaimer: This story is an educational behavioral diagnostic for mindful spending awareness, not certified financial or investment advice.*';

  if (!sanitizedArticle.toLowerCase().includes('disclaimer:')) {
    sanitizedArticle += disclaimerText;
  }

  return {
    ...result,
    estimatedSavings: clampedEstimatedSavings,
    fullArticle: sanitizedArticle,
    tasks:
      validTasks.length > 0
        ? validTasks
        : [
            {
              title: `Set aside ${context.currencySymbol}${formatAmount(baselineHabitSavings, context.currencyCode)} into your priority vault`,
              category: 'Vault',
              savingsAmount: baselineHabitSavings,
              impactTag: 'Milestone Momentum',
              iconName: 'ShieldCheck',
            },
          ],
  };
}

/**
 * Guardrail 6: Cold-Start Data-Sufficiency Report.
 * Produced when transaction history is too fresh (< 3 transactions) to prevent fake takeout stories.
 */
function generateColdStartReport(
  periodType: 'weekly' | 'monthly',
  userContext: {
    currencyCode: CurrencyCode;
    currencySymbol: string;
    primaryGoal: string;
    activeVaultTitle: string;
  }
): GeneratedReportResult {
  const { currencyCode, currencySymbol, primaryGoal, activeVaultTitle } = userContext;
  const config = getCurrencyDefaults(currencyCode);
  const baselineSavings = config.defaultHabitSavings;

  const now = new Date();
  const dateStr = now.toLocaleDateString(config.locale, { month: 'short', day: 'numeric' });
  const periodLabel =
    periodType === 'weekly'
      ? `Week of ${dateStr}`
      : `${now.toLocaleDateString(config.locale, { month: 'long', year: 'numeric' })} Edition`;

  return {
    periodType,
    periodLabel,
    hookTitle: 'The Observer Effect: How Simple Tracking Unlocks 15% Automatic Savings',
    subDescription:
      'A behavioral study on why awareness alone introduces natural financial speed bumps before changing a single habit.',
    readTime: '2 min read',
    impactHealth:
      'Replacing financial avoidance with calm daily logging dramatically lowers background money anxiety.',
    impactFamily:
      'Clarity over monthly cash flow eliminates reactive arguments about unknown leakages.',
    impactFinance: `Establishing your baseline tracking accelerates your progress toward ${activeVaultTitle} by weeks.`,
    estimatedSavings: baselineSavings * 3,
    fullArticle: `In behavioral psychology, the "Observer Effect" proves that simply measuring a behavior changes how you experience it. The moment you write down an expense, your brain begins evaluating the true value exchange.\n\n### The Anatomy of Unconscious Spending\nMost financial leaks do not stem from intentional decisions. They occur in the blind spots: micro-subscriptions, contactless taps on autopilot, and hurried conveniences that slip by unrecorded. When money is digital, pain points in paying evaporate.\n\n### Designing Mindful Speed Bumps\nYou do not need Spartan frugality or radical deprivation. You simply need friction. Taking two seconds to log each transaction brings subconscious spending back into the light of conscious choice.\n\n### Your First Milestone\nAs your baseline data calibrates over the next few days, Looop will identify your exact convenience tax and personalize custom weekly challenges tailored to your lifestyle.\n\n*Disclaimer: This story is an educational behavioral diagnostic for mindful spending awareness, not certified financial or investment advice.*`,
    tasks: [
      {
        title: 'Log every expense for 3 consecutive days',
        category: 'Lifestyle',
        savingsAmount: Math.round(baselineSavings * 0.5),
        impactTag: 'Habit Formation',
        iconName: 'Sparkles',
      },
      {
        title: `Deposit ${currencySymbol}${formatAmount(baselineSavings, currencyCode)} to ${activeVaultTitle}`,
        category: 'Vault',
        savingsAmount: baselineSavings,
        impactTag: 'Milestone Progress',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Pause 24 hours before your next non-essential purchase',
        category: 'Shopping',
        savingsAmount: Math.round(baselineSavings * 1.5),
        impactTag: 'Impulse Brake',
        iconName: 'ShoppingBag',
      },
    ],
  };
}

/**
 * Guardrail 7: Regional & Currency Calibrated Fallback Report.
 */
function generateDynamicFallbackReport(
  periodType: 'weekly' | 'monthly',
  userContext: {
    income: number;
    savingsTarget: number;
    leakCategory: string;
    primaryGoal: string;
    currencySymbol: string;
    currencyCode: CurrencyCode;
    totalSpent: number;
    topCategory: string;
    detectedPatterns?: DetectedSpendingPattern[];
  }
): GeneratedReportResult {
  const currencyCode = userContext.currencyCode || 'INR';
  const config = getCurrencyDefaults(currencyCode);
  const currency = config.symbol;
  const leak = userContext.leakCategory || 'Late-Night Food Delivery & Orders';
  const patterns = userContext.detectedPatterns || [];
  const topPattern = patterns[0] || null;

  const isFood =
    (topPattern && topPattern.category.toLowerCase().includes('food')) ||
    leak.toLowerCase().includes('food') ||
    userContext.topCategory.toLowerCase().includes('food');
  const isCab =
    (topPattern && topPattern.category.toLowerCase().includes('transport')) ||
    leak.toLowerCase().includes('cab') ||
    leak.toLowerCase().includes('transport') ||
    leak.toLowerCase().includes('ride');

  const now = new Date();
  const dateStr = now.toLocaleDateString(config.locale, { month: 'short', day: 'numeric' });
  const periodLabel =
    periodType === 'weekly'
      ? `Week of ${dateStr}`
      : `${now.toLocaleDateString(config.locale, { month: 'long', year: 'numeric' })} Edition`;

  // Calibrated prices based on regional defaults
  const foodItemName = topPattern?.name || 'late-night food delivery';
  const foodTypicalPrice =
    topPattern?.typicalAmount || Math.round(config.defaultHabitSavings * 0.45);
  const cabTypicalPrice =
    topPattern?.typicalAmount || Math.round(config.defaultHabitSavings * 0.35);

  if (isFood) {
    const monthlySavings = foodTypicalPrice * 8;
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
        'Cooking simple meals creates mindful shared rituals and reclaims intentional evening peace.',
      impactFinance: `Redirecting ${currency}${formatAmount(monthlySavings, currencyCode)} monthly from impulse delivery accelerates your savings milestones significantly.`,
      estimatedSavings: monthlySavings,
      fullArticle: `Most financial leaks do not happen in broad daylight. They happen late in the evening when willpower is depleted, your phone screen is bright, and two taps bring ${foodItemName.toLowerCase()} to your door in 20 minutes.\n\n### The Anatomy of Frictionless Spending\nModern digital apps have perfected the removal of friction. When pain points in paying disappear, your brain stops evaluating the value exchange. A ${currency}${formatAmount(foodTypicalPrice, currencyCode)} order feels identical to a simple swipe. Over 12 months, this convenience tax quietly siphons substantial capital meant for your long-term autonomy.\n\n### The True Price of Convenience\nThe real cost isn't just the monetary sum on your card. It's the compound consequence: disrupted sleep cycles, sluggish mornings, and the subtle anxiety of watching your monthly savings target drift out of reach.\n\n### Reclaiming the Buffer\nYou do not need Spartan frugality. You need conscious speed bumps. By batch-preparing easy comfort food or setting an ordering curfew, you instantly regain control over both your biology and your bank balance.\n\n*Disclaimer: This story is an educational behavioral diagnostic for mindful spending awareness, not certified financial or investment advice.*`,
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
          title: `Move ${currency}${formatAmount(config.defaultHabitSavings, currencyCode)} to your active Milestone Vault`,
          category: 'Vault',
          savingsAmount: config.defaultHabitSavings,
          impactTag: 'Milestone Momentum',
          iconName: 'ShieldCheck',
        },
      ],
    };
  }

  if (isCab) {
    const monthlySavings = cabTypicalPrice * 10;
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
      impactFinance: `Trimming surge ride costs saves approximately ${currency}${formatAmount(monthlySavings, currencyCode)} monthly, directly funding your priority vaults.`,
      estimatedSavings: monthlySavings,
      fullArticle: `The most expensive 10 minutes of your day are the ones you spend hitting snooze. Leaving home just slightly behind schedule transforms an inexpensive commute into a premium surge cab ride.\n\n### The Cost of Reactive Commutes\nWhen time is tight, we gladly trade money for relief. But repeated daily, this routine turns emergency convenience into an invisible baseline expense.\n\n### Designing Seamless Mornings\nPlanning your departure just 15 minutes earlier completely eliminates the surge premium while offering a much calmer headspace before your workday starts.\n\n*Disclaimer: This story is an educational behavioral diagnostic for mindful spending awareness, not certified financial or investment advice.*`,
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
  const baselineMonthSavings = config.defaultHabitSavings * 3;
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
    impactFinance: `Plugging baseline subscription and retail leaks unlocks ${currency}${formatAmount(baselineMonthSavings, currencyCode)}+ in monthly compound wealth.`,
    estimatedSavings: baselineMonthSavings,
    fullArticle: `We rarely fall behind on our dreams from giant, dramatic purchases. We fall behind through a thousand tiny cuts: forgotten subscriptions, spontaneous online shopping taps, and untracked weekend extras.\n\n### The Illusion of Small Numbers\nWhen an expense feels minor, our cognitive alarm bells remain silent. Yet multiple untracked transactions quietly swallow substantial capital every single month.\n\n### Aligning Capital with What Actually Matters\nEvery currency unit you don't spend on fleeting convenience is an employee working toward your future autonomy. Giving every unit a clear job changes how you see wealth forever.\n\n*Disclaimer: This story is an educational behavioral diagnostic for mindful spending awareness, not certified financial or investment advice.*`,
    tasks: [
      {
        title: 'Audit and cancel 1 unused digital subscription',
        category: 'Subscriptions',
        savingsAmount: Math.round(config.defaultHabitSavings * 0.6),
        impactTag: 'Zero-Effort Savings',
        iconName: 'Sparkles',
      },
      {
        title: 'Implement a 24-hour waiting rule before non-essential purchases',
        category: 'Shopping',
        savingsAmount: Math.round(config.defaultHabitSavings * 1.4),
        impactTag: 'Mindful Spending',
        iconName: 'ShoppingBag',
      },
      {
        title: `Auto-deposit ${currency}${formatAmount(config.defaultHabitSavings, currencyCode)} to your Milestone Vault`,
        category: 'Vault',
        savingsAmount: config.defaultHabitSavings,
        impactTag: 'Milestone Progress',
        iconName: 'ShieldCheck',
      },
    ],
  };
}

/**
 * Main AI Spending Story generation engine.
 * Fully hardened with input sanitization, math clamping, cold-start detection,
 * non-advisory legal guardrails, and idempotent goal persistence.
 */
export async function generateAndSaveAIReport(
  options: GenerateReportOptions = {}
): Promise<{ report: Report; tasks: WeeklyGoal[] }> {
  const periodType = options.periodType || 'weekly';

  try {
    // 1. Gather context from SQLite & Zustand
    const txList = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.date), desc(transactions.timestamp))
      .limit(40);

    const settingsList = await db.select().from(userSettings);
    const vaultsList = await db.select().from(milestoneVaults).orderBy(asc(milestoneVaults.targetAmount));

    const settingsMap = new Map<string, string>();
    settingsList.forEach((s) => settingsMap.set(s.key, s.value));

    // Dynamic currency detection
    const currencyCode: CurrencyCode =
      (useAppStore.getState().currency as CurrencyCode) ||
      (settingsMap.get('currencyCode') as CurrencyCode) ||
      'INR';
    const currencyConfig = getCurrencyDefaults(currencyCode);
    const currencySymbol = useAppStore.getState().currencySymbol || currencyConfig.symbol;

    const income = parseFloat(
      options.onboardingData?.monthlyIncome ||
        settingsMap.get('monthlyIncome') ||
        String(currencyConfig.defaultIncome)
    );
    const savingsTarget = parseFloat(
      options.onboardingData?.monthlySavingsTarget ||
        settingsMap.get('monthlySavingsTarget') ||
        String(currencyConfig.defaultSavings)
    );
    const leakCategory = sanitizeExpenseText(
      options.onboardingData?.leakCategory ||
        settingsMap.get('primaryLeakCategory') ||
        'Late-Night Food Delivery & Orders'
    );
    const primaryGoal = sanitizeExpenseText(
      options.onboardingData?.primaryGoal || settingsMap.get('primaryGoal') || 'Emergency Buffer'
    );

    // Detect recurring items and typical price points
    const detectedPatterns = detectSpendingPatterns(txList);

    // Summarize transactions
    const totalSpent = txList.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categoryBreakdown: Record<string, number> = {};
    txList.forEach((t) => {
      const cat = sanitizeExpenseText(t.category);
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + Math.abs(t.amount);
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

    let generatedResult: GeneratedReportResult | null = null;

    // Guardrail Check: Cold-Start / Data Sufficiency
    const hasSufficientData = txList.length >= 3 || options.isInitialOnboarding;

    if (!hasSufficientData) {
      console.log('🌱 [AI Reports] Cold-start detected (< 3 transactions). Using baseline calibration report.');
      generatedResult = generateColdStartReport(periodType, {
        currencyCode,
        currencySymbol,
        primaryGoal,
        activeVaultTitle: sanitizeExpenseText(activeVault?.title || 'Emergency Fund'),
      });
    } else {
      // 2. Prepare Sanitized Context Payload for Gemini
      const contextPayload = {
        periodType,
        currencyCode,
        currencySymbol,
        income,
        totalMustPayments,
        discretionaryIncome,
        savingsTarget,
        leakCategory,
        primaryGoal,
        totalSpent,
        topCategory,
        detectedSpendingPatterns: detectedPatterns.slice(0, 5).map((p) => ({
          name: sanitizeExpenseText(p.name),
          category: sanitizeExpenseText(p.category),
          count: p.count,
          typicalAmount: p.typicalAmount,
          totalSpent: p.totalSpent,
        })),
        activeVaultTitle: sanitizeExpenseText(activeVault?.title || 'Emergency Fund'),
        activeVaultTarget: activeVault?.targetAmount || currencyConfig.defaultTargetVault,
        activeVaultCurrent: activeVault?.currentAmount || 0,
        recentExpenses: txList.slice(0, 12).map((t) => ({
          title: sanitizeExpenseText(t.description || t.category),
          amount: Math.abs(t.amount),
          category: sanitizeExpenseText(t.category),
          date: t.date,
        })),
      };

      // 3. Attempt AI Generation via Firebase AI (Gemini)
      try {
        const appCheck = getAppCheckInstance();
        const ai = getAI(undefined, {
          appCheck: appCheck || undefined,
        });

        const systemInstruction = buildReportSystemPrompt(currencySymbol);
        const responseSchema = createReportResponseSchema();

        const userPrompt = `Write a personalized behavioral finance diagnostic essay for the user.
Context:
${JSON.stringify(contextPayload, null, 2)}

Requirements:
- Hook title must be punchy, thought-provoking, and reference the user's specific spending habits.
- If the user has specific recurring spending patterns (e.g. repeated purchases on items like ${contextPayload.detectedSpendingPatterns[0]?.name || 'Coffee'} at ${currencySymbol}${contextPayload.detectedSpendingPatterns[0]?.typicalAmount || 200}), explicitly reference that exact item and typical price in the challenges.
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
                maxOutputTokens: 2048, // Guardrail: Increased from 1000 to prevent JSON truncation
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

      // Fallback if Gemini failed or offline
      if (!generatedResult || !generatedResult.hookTitle) {
        generatedResult = generateDynamicFallbackReport(periodType, {
          income,
          savingsTarget,
          leakCategory,
          primaryGoal,
          currencySymbol,
          currencyCode,
          totalSpent,
          topCategory,
          detectedPatterns,
        });
      }
    }

    // 4. Mathematical Clamping & Realism Guardrail Verification
    const validatedResult = clampAndValidateReport(generatedResult, {
      income,
      discretionaryIncome,
      totalSpent,
      categoryBreakdown,
      currencySymbol,
      currencyCode,
    });

    // 5. Persist Report in SQLite
    const reportId = `rep_${periodType}_${Date.now()}`;
    const newReportRecord: NewReport = {
      id: reportId,
      periodType: validatedResult.periodType || periodType,
      periodLabel:
        validatedResult.periodLabel ||
        `Week of ${new Date().toLocaleDateString(currencyConfig.locale, { month: 'short', day: 'numeric' })}`,
      hookTitle: validatedResult.hookTitle,
      subDescription: validatedResult.subDescription,
      readTime: validatedResult.readTime || '3 min read',
      fullArticle: validatedResult.fullArticle,
      impactHealth: validatedResult.impactHealth,
      impactFamily: validatedResult.impactFamily,
      impactFinance: validatedResult.impactFinance,
      estimatedSavings: validatedResult.estimatedSavings,
      tasksJson: JSON.stringify(validatedResult.tasks || []),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    await db.insert(reports).values(newReportRecord);

    // 6. Idempotent Goal Synchronization: Prevent Challenge Duplication in SQLite
    const currentWeekId = `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`;

    // Remove any previously uncompleted auto-generated goals for the current week to keep goals clean
    try {
      await db
        .delete(weeklyGoals)
        .where(
          and(
            eq(weeklyGoals.weekIdentifier, currentWeekId),
            eq(weeklyGoals.completed, false)
          )
        );
    } catch (cleanErr) {
      console.warn('Notice cleaning up prior weekly goals:', cleanErr);
    }

    // Insert new validated challenges
    const createdTasks: WeeklyGoal[] = [];
    const rawTasks = validatedResult.tasks || [];

    for (let i = 0; i < rawTasks.length; i++) {
      const t = rawTasks[i];
      const taskId = `g_ai_${Date.now()}_${i}`;
      const newTaskRecord: NewWeeklyGoal = {
        id: taskId,
        reportId: reportId,
        title: t.title,
        category: t.category || 'Lifestyle',
        savingsAmount:
          typeof t.savingsAmount === 'number'
            ? t.savingsAmount
            : parseFloat(String(t.savingsAmount)) || currencyConfig.defaultHabitSavings,
        completed: false,
        actionText: '✓ Complete',
        completedText: 'Saved!',
        impactTag: t.impactTag || 'Finance & Health',
        iconName: t.iconName || 'Sparkles',
        weekIdentifier: currentWeekId,
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

    console.log(
      `✅ [AI Reports] Published verified report: "${savedReport.hookTitle}" with ${createdTasks.length} challenges.`
    );

    return {
      report: savedReport,
      tasks: createdTasks,
    };
  } catch (error) {
    console.error('Fatal error generating and saving AI report:', error);
    throw error;
  }
}

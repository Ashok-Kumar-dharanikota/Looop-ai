import { getAI, getGenerativeModel, Schema } from '@react-native-firebase/ai';
import {
  initializeAppCheck,
  ReactNativeFirebaseAppCheckProvider,
  type AppCheck,
} from '@react-native-firebase/app-check';
import {
  parseExpenseText,
  type CategoryItem,
  type ParsedExpenseResult,
} from '@/lib/expense-nlp-parser';

export const PAYMENT_METHODS_LIST = [
  'UPI (GPay / PhonePe)',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Net Banking',
];

export interface AIExpenseResponseJSON {
  amount: number;
  categoryName: string;
  merchant: string;
  reason: string;
  paymentMethod: string;
  dateStr: string;
  timeStr: string;
  timestamp: string;
  missingFields: string[];
  followupQuestion: string;
}

export interface ExpenseAIContextOptions {
  currency?: string;
  recentExpensesSummary?: string;
  userHints?: string;
}

import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export const PREVIEW_APPCHECK_DEBUG_TOKEN = '90C2C9E8-5F63-4A15-88E1-216179365622';
export const DEV_APPCHECK_DEBUG_TOKEN = '1D1EFB38-3D56-4B8D-9BD0-9D55F386C873';

// Token-efficient active Gemini models in order of priority
const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
];

let appCheckInstance: AppCheck | null = null;

/**
 * Initializes and returns the Firebase App Check instance.
 * Automatically uses debug provider in development and preview builds,
 * and native platform integrity (Play Integrity / DeviceCheck) in production.
 */
export function getAppCheckInstance(): AppCheck | null {
  if (appCheckInstance) return appCheckInstance;
  try {
    const appVariant =
      Constants.expoConfig?.extra?.appVariant ||
      process.env.EXPO_PUBLIC_APP_VARIANT ||
      process.env.APP_VARIANT;

    const isPreview =
      appVariant === 'preview' ||
      Updates.channel === 'preview' ||
      Constants.expoConfig?.android?.package?.includes('preview') ||
      Constants.expoConfig?.ios?.bundleIdentifier?.includes('preview');

    const isProduction =
      appVariant === 'production' ||
      Updates.channel === 'production';

    // The debug token for Preview and Dev builds
    const debugToken =
      process.env.EXPO_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN ||
      (isPreview ? PREVIEW_APPCHECK_DEBUG_TOKEN : DEV_APPCHECK_DEBUG_TOKEN);

    // Use 'debug' provider for all non-production builds (preview APKs, EAS development builds, local development)
    const useDebugProvider = __DEV__ || isPreview || !isProduction;

    const rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure({
      android: {
        provider: useDebugProvider ? 'debug' : 'playIntegrity',
        debugToken,
      },
      apple: {
        provider: useDebugProvider ? 'debug' : 'appAttestWithDeviceCheckFallback',
        debugToken,
      },
      web: {
        provider: useDebugProvider ? 'debug' : 'reCaptchaV3',
        debugToken,
      },
    });

    appCheckInstance = initializeAppCheck(undefined, {
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });
    console.log(`🛡️ [Firebase App Check] Initialized with ${useDebugProvider ? `DEBUG provider (${debugToken.slice(0, 8)}...)` : 'Play Integrity'}`);
    return appCheckInstance;
  } catch (err) {
    console.warn('App Check initialization notice:', err);
    return null;
  }
}

/**
 * Safely extracts and parses JSON from Gemini's response text,
 * stripping any markdown code fences (```json ... ```) or whitespace.
 */
export function extractJsonFromText<T = any>(text: string): T {
  const trimmed = text.trim();
  
  // Try direct parse first
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Check for ```json ... ``` or ``` ... ```
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        return JSON.parse(codeBlockMatch[1].trim()) as T;
      } catch {
        // Continue to regex bracket search
      }
    }

    // Try finding the outermost JSON object { ... }
    const objectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]) as T;
    }

    throw new Error(`Unable to extract valid JSON from AI response: ${trimmed.slice(0, 100)}...`);
  }
}

/**
 * Enforced JSON schema for structured Firebase AI Gemini output.
 */
function createExpenseResponseSchema(categoryNames: string[]): Schema {
  return Schema.object({
    properties: {
      amount: Schema.number({
        description: 'Monetary amount spent as a positive number (e.g. 450, 20). If unknown or not mentioned, return 0.',
      }),
      categoryName: Schema.enumString({
        enum: categoryNames,
        description: 'Best matching category from provided list.',
      }),
      merchant: Schema.string({
        description: 'Specific brand, store, vendor, bakery, restaurant, or service name (e.g. "Theobroma", "Subway", "Uber"). If NOT mentioned in text, return "Unknown".',
      }),
      reason: Schema.string({
        description: 'Short note of what was purchased (e.g. "Eating cake", "Lunch", "Coffee").',
      }),
      paymentMethod: Schema.enumString({
        enum: PAYMENT_METHODS_LIST,
        description: 'Payment method used.',
      }),
      dateStr: Schema.string({
        description: 'Transaction date in YYYY-MM-DD format (e.g. "2026-08-19").',
      }),
      timeStr: Schema.string({
        description: 'Clean 12-hour transaction time with AM/PM (e.g. "6:52 PM" or "1:30 PM"). Never include words like "Evening" or parentheses.',
      }),
      timestamp: Schema.string({
        description: 'Combined full ISO-8601 timestamp string (e.g. "2026-08-19T18:52:00.000Z").',
      }),
      missingFields: Schema.array({
        items: Schema.string(),
        description: 'List of fields missing or unknown in input (e.g. ["merchant"] if merchant was not specified, ["amount"] if amount was 0).',
      }),
      followupQuestion: Schema.string({
        description: 'Targeted, polite followup question to ask the user to clarify any missing/unknown fields (e.g. "Which bakery or shop did you buy the cake from?"). Return empty string "" if everything is known.',
      }),
    },
    optionalProperties: [],
  });
}

/**
 * Builds an ultra-concise, token-efficient system instruction for Gemini Flash-Lite.
 */
function buildSystemInstruction(
  categories: CategoryItem[],
  contextOptions?: ExpenseAIContextOptions
): string {
  const now = new Date();
  const currentISO = now.toISOString().split('T')[0];
  const currentTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const currentFullISO = now.toISOString();
  const categoryNames = categories.map((c) => c.name).join(', ');

  let prompt = `You are a financial transaction extraction AI. Extract structured JSON matching the provided schema.
Current Context: Date=${currentISO}, Time=${currentTime}, Full Timestamp=${currentFullISO}, Timezone=Local.
Valid Categories: [${categoryNames}]
Valid PaymentMethods: [${PAYMENT_METHODS_LIST.join(', ')}]

Rules:
1. amount: Positive number. Parse shorthand ('1.5k' -> 1500, '20 rs' -> 20). If amount is omitted, return 0.
2. categoryName: Best match from Valid Categories.
3. merchant: Specific shop, restaurant, app, brand, or vendor name. If user did NOT state where they bought it (e.g. "spent 20 on eating cake" does not specify the shop), return "Unknown".
4. reason: Item or service purchased (e.g. "Eating cake", "Lunch", "Cab ride").
5. paymentMethod: Match UPI/Credit Card/Debit Card/Cash/Net Banking. Default to 'UPI (GPay / PhonePe)'.
6. dateStr: YYYY-MM-DD.
7. timeStr: Clean 12-hour time format with AM/PM (e.g. "${currentTime}"). Do NOT format as "Evening (6:52 PM)".
8. timestamp: Full combined ISO-8601 string (e.g. "${currentFullISO}").
9. missingFields: List any fields that are missing, 0, or unknown (from ['amount', 'merchant', 'category', 'reason']). If merchant is "Unknown", include "merchant". If amount is 0, include "amount".
10. followupQuestion: If missingFields is not empty, write a natural, friendly question to ask the user for the missing detail (e.g. if user ate cake but didn't say where: "Which bakery or shop did you get the cake from?", if amount missing: "How much did you spend?"). If all fields are known, return "".`;

  if (contextOptions?.recentExpensesSummary) {
    prompt += `\nRecentExpenses: ${contextOptions.recentExpensesSummary}`;
  }
  if (contextOptions?.userHints) {
    prompt += `\nUserHints: ${contextOptions.userHints}`;
  }

  return prompt;
}

/**
 * Parses expense text (voice transcript or typed context) using Firebase AI (Gemini) with rich context.
 * Automatically falls back to local client NLP if network is offline or AI service is unavailable.
 */
export async function parseExpenseWithFirebaseAI(
  rawText: string,
  categories: CategoryItem[],
  contextOptions?: ExpenseAIContextOptions
): Promise<ParsedExpenseResult> {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return parseExpenseText(rawText, categories);
  }

  try {
    const categoryNames = categories.map((c) => c.name);
    const appCheck = getAppCheckInstance();
    const ai = getAI(undefined, {
      appCheck: appCheck || undefined,
    });

    const systemPrompt = buildSystemInstruction(categories, contextOptions);
    const responseSchema = createExpenseResponseSchema(categoryNames);

    let responseText: string | null = null;
    let usedModelName: string | null = null;
    let lastError: any = null;

    console.log('\n🚀 [Firebase AI] Submitting expense text to Gemini:\n', JSON.stringify(trimmed));

    // Try token-efficient candidate models (gemini-3.5-flash-lite -> gemini-3.1-flash-lite -> gemini-3.6-flash)
    for (const modelName of CANDIDATE_GEMINI_MODELS) {
      try {
        console.log(`🤖 [Firebase AI] Attempting inference with model: ${modelName}...`);
        const model = getGenerativeModel(ai, {
          model: modelName,
          systemInstruction: {
            role: 'system',
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.0,
            maxOutputTokens: 300,
          },
        });

        const prompt = `Parse this expense note:\n"${trimmed}"`;
        const responseResult = await model.generateContent(prompt);
        const text = responseResult.response.text();

        if (text && text.trim().length > 0) {
          responseText = text;
          usedModelName = modelName;
          break;
        }
      } catch (modelErr) {
        lastError = modelErr;
        console.warn(`[Firebase AI] Model ${modelName} encountered error:`, modelErr);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Empty response from Firebase AI across all candidate models');
    }

    console.log('\n================== 🟢 FIREBASE AI RESPONSE (GEMINI) ==================');
    console.log(`✨ Model: ${usedModelName}`);
    console.log('📦 Raw JSON Response:\n', responseText);

    const parsedJson: AIExpenseResponseJSON = extractJsonFromText<AIExpenseResponseJSON>(responseText);
    console.log('📊 Parsed JSON Object:\n', JSON.stringify(parsedJson, null, 2));
    console.log('======================================================================\n');

    const matchedCategory =
      categories.find(
        (c) => c.name.toLowerCase() === (parsedJson.categoryName || '').toLowerCase()
      ) ||
      categories.find(
        (c) => c.name.toLowerCase().includes((parsedJson.categoryName || '').toLowerCase())
      ) ||
      categories[0];

    const amountVal =
      typeof parsedJson.amount === 'number' && !isNaN(parsedJson.amount) && parsedJson.amount > 0
        ? parsedJson.amount
        : null;

    const amountFormatted = amountVal !== null ? amountVal.toLocaleString('en-IN') : '0';

    // Check missing / unknown fields
    const missingFields: ('amount' | 'category' | 'merchant' | 'reason')[] = [];
    if (amountVal === null || amountVal <= 0) {
      missingFields.push('amount');
    }
    if (!matchedCategory) {
      missingFields.push('category');
    }
    const isUnknownMerchant =
      !parsedJson.merchant ||
      parsedJson.merchant.toLowerCase() === 'unknown' ||
      parsedJson.merchant.trim() === '';
    if (isUnknownMerchant) {
      missingFields.push('merchant');
    }

    let followupQuestion =
      parsedJson.followupQuestion && parsedJson.followupQuestion.trim().length > 0
        ? parsedJson.followupQuestion.trim()
        : null;

    if (!followupQuestion && missingFields.length > 0) {
      if (missingFields.includes('amount')) {
        followupQuestion = 'How much did you spend on this?';
      } else if (missingFields.includes('merchant')) {
        const itemReason = parsedJson.reason || 'this';
        followupQuestion = `Which bakery, shop, or place did you buy ${itemReason.toLowerCase()} from?`;
      }
    }

    // Clean combined timestamp and timeLabel
    const now = new Date();
    const cleanTimeStr =
      parsedJson.timeStr && !parsedJson.timeStr.includes('(')
        ? parsedJson.timeStr
        : now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const finalDateStr = parsedJson.dateStr || now.toISOString().split('T')[0];
    const isToday = finalDateStr === now.toISOString().split('T')[0];
    const timeLabel = `${isToday ? 'Today' : finalDateStr}, ${cleanTimeStr}`;
    const combinedTimestamp = parsedJson.timestamp || now.toISOString();

    const cleanMerchant = isUnknownMerchant ? '' : parsedJson.merchant;
    const cleanReason = parsedJson.reason || cleanMerchant || matchedCategory.name;

    return {
      rawText: trimmed,
      amount: amountVal,
      amountFormatted,
      category: matchedCategory,
      categoryName: matchedCategory ? matchedCategory.name : 'Food & Dining',
      merchant: cleanMerchant,
      reason: cleanReason,
      paymentMethod: parsedJson.paymentMethod || 'UPI (GPay / PhonePe)',
      timeLabel,
      timeStr: cleanTimeStr,
      dateStr: finalDateStr,
      timestamp: combinedTimestamp,
      confidence: 0.99,
      isOnlyNumber: /^\s*(?:₹|rs\.?|inr)?\s*\d+(?:,\d+)*(?:\.\d+)?\s*(?:rs|inr|k)?\s*$/i.test(trimmed),
      isAIParsed: true,
      aiModelUsed: usedModelName || 'Gemini 3.5 Flash-Lite',
      missingFields: missingFields.length > 0 ? missingFields : undefined,
      followupQuestion,
    };
  } catch (error) {
    console.warn('\n================== ⚠️ FIREBASE AI FALLBACK ==================');
    console.warn('Firebase AI parsing failed, falling back to local NLP parser.');
    console.warn('Reason:', error);
    console.warn('=============================================================\n');
    // Instant, seamless local fallback
    return parseExpenseText(trimmed, categories);
  }
}

/**
 * General helper: submits any text context + prompt to Firebase AI (Gemini) and returns structured JSON.
 */
export async function generateAIJsonResponse<T = any>(
  prompt: string,
  context?: Record<string, any>,
  schema?: Schema
): Promise<T> {
  const appCheck = getAppCheckInstance();
  const ai = getAI(undefined, {
    appCheck: appCheck || undefined,
  });

  const contextStr = context ? `\nContext:\n${JSON.stringify(context, null, 2)}\n` : '';

  let lastError: any = null;
  for (const modelName of CANDIDATE_GEMINI_MODELS) {
    try {
      const model = getGenerativeModel(ai, {
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.0,
          maxOutputTokens: 500,
        },
      });

      const fullPrompt = `${contextStr}\n${prompt}`;
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();

      if (text) {
        return extractJsonFromText<T>(text);
      }
    } catch (err) {
      lastError = err;
      console.warn(`Firebase AI json response with model ${modelName} failed:`, err);
    }
  }

  throw lastError || new Error('Firebase AI request failed across all candidate models.');
}

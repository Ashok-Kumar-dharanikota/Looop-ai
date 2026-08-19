export interface CategoryItem {
  id: string;
  name: string;
  icon?: any;
  iconName: string;
  color: string;
  bg: string;
}

export interface ParsedExpenseResult {
  rawText: string;
  amount: number | null;
  amountFormatted: string;
  category: CategoryItem | null;
  categoryName: string;
  merchant: string;
  reason: string;
  paymentMethod: string;
  timeLabel: string;
  timeStr: string; // e.g. "6:52 PM"
  dateStr: string; // YYYY-MM-DD
  timestamp: string; // Combined ISO-8601 string
  confidence: number;
  isOnlyNumber: boolean;
  isAIParsed?: boolean;
  aiModelUsed?: string;
  missingFields?: ('amount' | 'category' | 'merchant' | 'reason')[];
  followupQuestion?: string | null;
}

// Category keyword mappings for high-accuracy local classification
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Food & Dining': [
    'food', 'dining', 'dinner', 'lunch', 'breakfast', 'brunch', 'meal', 'snack', 'restaurant',
    'swiggy', 'zomato', 'subway', 'mcdonalds', 'kfc', 'burger', 'pizza', 'dominos', 'eatclub',
    'biryani', 'dosa', 'thali', 'noodles', 'shawarma', 'tacos', 'pasta', 'sushi', 'curry',
    'bistro', 'dhaba', 'canteen', 'takeout', 'dinein', 'mess'
  ],
  'Transport': [
    'transport', 'commute', 'uber', 'ola', 'rapido', 'cab', 'taxi', 'auto', 'rickshaw',
    'metro', 'bus', 'train', 'fuel', 'petrol', 'diesel', 'cng', 'toll', 'parking', 'fastag',
    'scooter', 'bike', 'fare', 'ticket', 'flight', 'indigo', 'airindia'
  ],
  'Shopping': [
    'shopping', 'shop', 'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'zara', 'h&m',
    'clothes', 'shoes', 'shirt', 'pants', 'dress', 'jeans', 'watch', 'bag', 'mall', 'store',
    'electronics', 'laptop', 'mobile', 'gadget', 'headphones', 'earphones', 'charger', 'apple'
  ],
  'Bills & Utilities': [
    'bill', 'utility', 'utilities', 'electricity', 'water', 'gas', 'cylinder', 'wifi',
    'broadband', 'internet', 'airtel', 'jio', 'vi', 'recharge', 'mobile bill', 'rent',
    'maintenance', 'emi', 'loan', 'insurance', 'tax', 'credit card bill'
  ],
  'Entertainment': [
    'entertainment', 'movie', 'cinema', 'pvr', 'inox', 'theatre', 'netflix', 'prime',
    'hotstar', 'spotify', 'youtube', 'games', 'gaming', 'steam', 'playstation', 'concert',
    'show', 'event', 'party', 'drinks', 'bar', 'club', 'pub', 'beer', 'cocktail', 'outing'
  ],
  'Groceries & Cafe': [
    'grocery', 'groceries', 'supermarket', 'blinkit', 'zepto', 'instamart', 'bigbasket',
    'vegetables', 'fruits', 'milk', 'bread', 'eggs', 'coffee', 'cafe', 'starbucks', 'ccd',
    'third wave', 'blue tokai', 'tea', 'chai', 'bakery', 'snacks', 'provisions', 'kirana'
  ],
  'Travel & Trips': [
    'travel', 'trip', 'hotel', 'stay', 'airbnb', 'booking', 'makemytrip', 'agoda', 'hostel',
    'resort', 'vacation', 'holiday', 'tourism', 'sightseeing', 'luggage', 'visa', 'passport'
  ],
  'Health & Care': [
    'health', 'medical', 'medicine', 'medicines', 'pharmacy', 'chemist', 'apollo', 'pharmeasy',
    '1mg', 'doctor', 'clinic', 'hospital', 'dentist', 'gym', 'fitness', 'cult', 'protein',
    'supplements', 'skincare', 'haircut', 'salon', 'spa'
  ],
};

const PAYMENT_KEYWORDS: Record<string, string> = {
  'google pay': 'UPI (GPay / PhonePe)',
  'phone pe': 'UPI (GPay / PhonePe)',
  'phonepe': 'UPI (GPay / PhonePe)',
  'gpay': 'UPI (GPay / PhonePe)',
  'paytm': 'UPI (GPay / PhonePe)',
  'bhim': 'UPI (GPay / PhonePe)',
  'upi': 'UPI (GPay / PhonePe)',
  'scan': 'UPI (GPay / PhonePe)',
  'credit card': 'Credit Card',
  'debit card': 'Debit Card',
  'net banking': 'Net Banking',
  'netbanking': 'Net Banking',
  'bank transfer': 'Net Banking',
  'credit': 'Credit Card',
  'debit': 'Debit Card',
  'cc': 'Credit Card',
  'dc': 'Debit Card',
  'cash': 'Cash',
  'neft': 'Net Banking',
  'imps': 'Net Banking',
};

const STOP_WORDS = new Set([
  'paid', 'pay', 'spent', 'spend', 'gave', 'given', 'bought', 'buy', 'ordered', 'order',
  'for', 'to', 'at', 'in', 'on', 'via', 'through', 'by', 'using', 'with', 'from',
  'a', 'an', 'the', 'my', 'me', 'i', 'we', 'us',
  'just', 'now', 'today', 'yesterday', 'earlier', 'night', 'morning', 'afternoon', 'evening',
  'rs', 'inr', 'rupees', 'rupee', 'bucks', 'dollar', 'dollars'
]);

/**
 * Extracts numeric amount from natural language strings.
 * Handles formats like: "450", "₹450", "450.50", "rs 450", "450rs", "1.5k", "2k"
 */
function extractAmount(text: string): { amount: number | null; matchedStr: string | null } {
  // Check for "k" notation first (e.g. 1.5k, 2k, 25k)
  const kRegex = /(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*k\b/i;
  const kMatch = text.match(kRegex);
  if (kMatch && kMatch[1]) {
    const val = parseFloat(kMatch[1]) * 1000;
    return { amount: Math.round(val * 100) / 100, matchedStr: kMatch[0] };
  }

  // Currency prefixed or suffixed (e.g., ₹450, Rs. 450, 450 INR, 450/-)
  const currencyRegex = /(?:(?:₹|rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d+)?)|(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:₹|rs\.?|inr|\/-|rupees?|bucks))/i;
  const currencyMatch = text.match(currencyRegex);
  if (currencyMatch) {
    const numStr = (currencyMatch[1] || currencyMatch[2] || '').replace(/,/g, '');
    const val = parseFloat(numStr);
    if (!isNaN(val) && val > 0) {
      return { amount: val, matchedStr: currencyMatch[0] };
    }
  }

  // Standalone numbers (e.g. "paid 450 for lunch" or just "450")
  const numRegex = /\b(\d+(?:,\d+)*(?:\.\d+)?)\b/;
  const numMatch = text.match(numRegex);
  if (numMatch && numMatch[1]) {
    const numStr = numMatch[1].replace(/,/g, '');
    const val = parseFloat(numStr);
    if (!isNaN(val) && val > 0) {
      return { amount: val, matchedStr: numMatch[0] };
    }
  }

  return { amount: null, matchedStr: null };
}

/**
 * Classifies text into the most appropriate category based on keywords.
 */
function classifyCategory(text: string, categories: CategoryItem[]): CategoryItem | null {
  const lower = text.toLowerCase();

  let bestMatchCategory: CategoryItem | null = null;
  let maxScore = 0;

  for (const cat of categories) {
    const keywords = CATEGORY_KEYWORDS[cat.name] || [];
    let score = 0;

    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        score += kw.length > 4 ? 3 : 2; // longer exact words have higher weight
      } else if (lower.includes(kw)) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatchCategory = cat;
    }
  }

  return bestMatchCategory;
}

/**
 * Extracts payment method from text and optionally returns the matched keyword.
 */
function extractPaymentMethod(text: string): { method: string; matchedKeyword: string | null } {
  const lower = text.toLowerCase();

  for (const [kw, method] of Object.entries(PAYMENT_KEYWORDS)) {
    const regex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) {
      return { method, matchedKeyword: kw };
    }
  }

  return { method: 'UPI (GPay / PhonePe)', matchedKeyword: null }; // Default modern payment mode
}

/**
 * Extracts temporal references (today, yesterday, time of day).
 */
/**
 * Extracts temporal references and constructs clean timestamp, dateStr, and timeStr.
 */
function extractTemporalReference(text: string): {
  dateStr: string;
  timeStr: string;
  timeLabel: string;
  timestamp: string;
} {
  const lower = text.toLowerCase();
  const now = new Date();
  let dateObj = new Date(now);

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let isYesterday = false;

  if (lower.includes('yesterday') || lower.includes('kal')) {
    dateObj.setDate(dateObj.getDate() - 1);
    isYesterday = true;
  } else if (lower.includes('morning') || lower.includes('subah')) {
    hours = 9;
    minutes = 0;
  } else if (lower.includes('lunch') || lower.includes('afternoon') || lower.includes('dopahar')) {
    hours = 13;
    minutes = 30;
  } else if (lower.includes('evening') || lower.includes('shaam') || lower.includes('night') || lower.includes('dinner')) {
    hours = 19;
    minutes = 0;
  }

  dateObj.setHours(hours, minutes, 0, 0);

  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  // Clean 12-hour time format (e.g. "6:52 PM")
  const h12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const minStr = String(minutes).padStart(2, '0');
  const timeStr = `${h12}:${minStr} ${ampm}`;

  const dayPrefix = isYesterday ? 'Yesterday' : 'Today';
  const timeLabel = `${dayPrefix}, ${timeStr}`;
  const timestamp = dateObj.toISOString();

  return { dateStr, timeStr, timeLabel, timestamp };
}

/**
 * Extracts clean merchant or reason note by removing matched amount, payment keywords, and stopwords.
 */
function extractMerchantAndReason(
  text: string,
  amountMatchedStr: string | null,
  paymentKeyword: string | null,
  category: CategoryItem | null
): { merchant: string; reason: string } {
  let cleaned = text;

  // Remove the amount portion
  if (amountMatchedStr) {
    cleaned = cleaned.replace(amountMatchedStr, ' ');
  }

  // Remove payment phrases
  if (paymentKeyword) {
    const pRegex = new RegExp(`\\b${paymentKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    cleaned = cleaned.replace(pRegex, ' ');
  }

  // Also remove common payment terms
  for (const pTerm of Object.keys(PAYMENT_KEYWORDS)) {
    const pRegex = new RegExp(`\\b${pTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    cleaned = cleaned.replace(pRegex, ' ');
  }

  // Remove currency signs
  cleaned = cleaned.replace(/[₹$]/g, ' ');

  // Tokenize
  const words = cleaned
    .replace(/[^\w\s&'-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  // Filter out stop words and numbers
  const meaningfulWords = words.filter((w) => {
    const lowerW = w.toLowerCase();
    if (STOP_WORDS.has(lowerW)) return false;
    if (PAYMENT_KEYWORDS[lowerW]) return false;
    if (/^\d+$/.test(w)) return false;
    return true;
  });

  if (meaningfulWords.length === 0) {
    const fallback = category ? category.name : 'Expense';
    return { merchant: fallback, reason: fallback };
  }

  // Capitalize nicely
  const capitalized = meaningfulWords
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    merchant: capitalized,
    reason: capitalized,
  };
}

/**
 * Main parser: Parses natural speech or single-line text into structured expense parameters.
 */
export function parseExpenseText(
  rawText: string,
  categories: CategoryItem[]
): ParsedExpenseResult {
  const trimmed = rawText.trim();
  const now = new Date();
  const defaultDateStr = now.toISOString().split('T')[0];
  const defaultTimeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (!trimmed) {
    return {
      rawText: '',
      amount: null,
      amountFormatted: '0',
      category: null,
      categoryName: 'General',
      merchant: 'Expense',
      reason: 'Expense',
      paymentMethod: 'UPI (GPay / PhonePe)',
      timeLabel: `Today, ${defaultTimeStr}`,
      timeStr: defaultTimeStr,
      dateStr: defaultDateStr,
      timestamp: now.toISOString(),
      confidence: 0,
      isOnlyNumber: false,
      missingFields: ['amount', 'category', 'merchant'],
      followupQuestion: 'How much did you spend, and what was it for?',
    };
  }

  // Check if input is only a number
  const isOnlyNumber = /^\s*(?:₹|rs\.?|inr)?\s*\d+(?:,\d+)*(?:\.\d+)?\s*(?:rs|inr|k)?\s*$/i.test(trimmed);

  // 1. Extract Amount
  const { amount, matchedStr } = extractAmount(trimmed);

  // 2. Classify Category
  const category = classifyCategory(trimmed, categories);

  // 3. Extract Payment Method
  const { method: paymentMethod, matchedKeyword: paymentKeyword } = extractPaymentMethod(trimmed);

  // 4. Extract Temporal info
  const { dateStr, timeStr, timeLabel, timestamp } = extractTemporalReference(trimmed);

  // 5. Extract clean Merchant & Reason
  const { merchant, reason } = extractMerchantAndReason(trimmed, matchedStr, paymentKeyword, category);

  // Identify missing fields & determine targeted followup question
  const missingFields: ('amount' | 'category' | 'merchant' | 'reason')[] = [];
  let followupQuestion: string | null = null;

  if (amount === null || amount <= 0) {
    missingFields.push('amount');
    followupQuestion = 'How much did you spend on this?';
  }
  if (!category) {
    missingFields.push('category');
    if (!followupQuestion) {
      followupQuestion = 'Which category best describes this expense?';
    }
  }
  if (!merchant || merchant === 'Expense' || merchant === 'Unknown') {
    missingFields.push('merchant');
    if (!followupQuestion) {
      if (reason && reason !== 'Expense') {
        followupQuestion = `Where did you buy the ${reason.toLowerCase()} from?`;
      } else {
        followupQuestion = 'Where did you make this purchase?';
      }
    }
  }

  // Compute confidence score
  let confidence = 0.2;
  if (amount !== null && amount > 0) confidence += 0.4;
  if (category !== null) confidence += 0.25;
  if (merchant && merchant !== 'Expense' && merchant !== 'Unknown') confidence += 0.15;

  return {
    rawText: trimmed,
    amount,
    amountFormatted: amount !== null ? amount.toLocaleString('en-IN') : '0',
    category,
    categoryName: category ? category.name : 'Food & Dining',
    merchant,
    reason,
    paymentMethod,
    timeLabel,
    timeStr,
    dateStr,
    timestamp,
    confidence: Math.min(confidence, 1.0),
    isOnlyNumber,
    missingFields: missingFields.length > 0 ? missingFields : undefined,
    followupQuestion: missingFields.length > 0 ? followupQuestion : null,
  };
}

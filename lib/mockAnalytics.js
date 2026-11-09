export const ANALYTICS_STATS = {
  today: {
    revenue: 45200,
    expense: 18700,
    profit: 26500,
    orders: 12,
  },
  week: {
    revenue: 285600,
    expense: 118400,
    profit: 167200,
    orders: 78,
  },
  month: {
    revenue: 1245600,
    expense: 478900,
    profit: 766700,
    orders: 345,
  },
  year: {
    revenue: 14568000,
    expense: 5680000,
    profit: 8888000,
    orders: 4120,
  },
};

export const REVENUE_CHART = [
  { month: 'ሴፕ', revenue: 980000, expense: 420000 },
  { month: 'ኦክቶ', revenue: 1120000, expense: 480000 },
  { month: 'ኖቬም', revenue: 1250000, expense: 510000 },
  { month: 'ዲሴም', revenue: 980000, expense: 420000 },
  { month: 'ጃን',  revenue: 1180000, expense: 490000 },
  { month: 'ፌብ',  revenue: 1245600, expense: 478900 },
];

export const ORDERS_CHART = [
  { month: 'ሴፕ', orders: 245 },
  { month: 'ኦክቶ', orders: 312 },
  { month: 'ኖቬም', orders: 398 },
  { month: 'ዲሴም', orders: 265 },
  { month: 'ጃን',  orders: 287 },
  { month: 'ፌብ',  orders: 345 },
];

export const CATEGORY_CHART = [
  { name: 'ምጣድ',    value: 45, color: '#1d4ed8' },
  { name: 'ቆጣቢ',    value: 28, color: '#3b82f6' },
  { name: 'አክሰሰሪ',  value: 17, color: '#60a5fa' },
  { name: 'ሌላ',     value: 10, color: '#93c5fd' },
];

export const BRANCH_PERFORMANCE = [
  { name: 'ቦሌ',    revenue: 420000, expense: 150000 },
  { name: 'መርካቶ',  revenue: 380000, expense: 180000 },
  { name: 'ፒያሳ',   revenue: 290000, expense: 120000 },
  { name: 'ሱሚት',   revenue: 155600, expense: 28900 },
];

export const TOP_PRODUCTS = [
  { name: 'ግሩም ኤሌክትሪክ ምጣድ',   sold: 145, revenue: 362500 },
  { name: 'ግሩም ማገዶ ቆጣቢ ምጣድ', sold: 98,  revenue: 215600 },
  { name: 'ግሩም አክሰሰሪ',        sold: 67,  revenue: 120600 },
  { name: 'ግሩም ትልቅ ምጣድ',      sold: 34,  revenue: 153000 },
  { name: 'ግሩም ቆጣቢ ምጣድ',     sold: 52,  revenue: 109200 },
];

export const TIME_RANGES = [
  { key: 'today', label: 'ዛሬ' },
  { key: 'week',  label: 'ሳምንት' },
  { key: 'month', label: 'ወር' },
  { key: 'year',  label: 'ዓመት' },
];

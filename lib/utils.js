// ============================================
// Currency formatter
// ============================================
export const formatETB = (amount) =>
  new Intl.NumberFormat('am-ET', { style: 'currency', currency: 'ETB' }).format(amount || 0);

// ============================================
// Date formatter
// ============================================
export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('am-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ============================================
// Classnames helper
// ============================================
export const cn = (...classes) => classes.filter(Boolean).join(' ');

// ============================================
// Role label mapping
// ============================================
export const ROLE_LABELS = {
  admin: 'አስተዳዳሪ',
  owner: 'ባለቤት',
  seller: 'ሻጭ',
  customer: 'ደንበኛ',
};

// ============================================
// Role colors (for avatars, badges)
// ============================================
export const ROLE_COLORS = {
  admin:    { bg: 'bg-purple-100', text: 'text-purple-700', solid: 'bg-purple-600' },
  owner:    { bg: 'bg-indigo-100', text: 'text-indigo-700', solid: 'bg-indigo-600' },
  seller:   { bg: 'bg-blue-100',   text: 'text-blue-700',   solid: 'bg-blue-600' },
  customer: { bg: 'bg-green-100',  text: 'text-green-700',  solid: 'bg-green-600' },
};

// ============================================
// Order status labels
// ============================================
export const ORDER_STATUS = {
  pending:       { label: 'በመጠባበቅ',  color: 'yellow' },
  in_production: { label: 'በምርት ላይ',  color: 'blue' },
  ready:         { label: 'ተዘጋጅቷል', color: 'green' },
  delivered:     { label: 'ተላልፏል',   color: 'gray' },
  cancelled:     { label: 'ተሰርዟል',   color: 'red' },
};

// ============================================
// Get role label
// ============================================
export const getRoleLabel = (role) => ROLE_LABELS[role] || 'ተጠቃሚ';

// ============================================
// Get role color
// ============================================
export const getRoleColor = (role) => ROLE_COLORS[role] || ROLE_COLORS.customer;

// ============================================
// Get initials from name
// ============================================
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

// ============================================
// Get first letter from name
// ============================================
export const getFirstLetter = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

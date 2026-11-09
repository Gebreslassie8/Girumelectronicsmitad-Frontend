// Currency formatter
export const formatETB = (amount) =>
  new Intl.NumberFormat('am-ET', { style: 'currency', currency: 'ETB' }).format(amount || 0);

// Date formatter
export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('am-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Classnames helper
export const cn = (...classes) => classes.filter(Boolean).join(' ');

// Role label mapping
export const ROLE_LABELS = {
  admin: 'አስተዳዳሪ',
  owner: 'ባለቤት',
  seller: 'ሻጭ',
  customer: 'ደንበኛ',
};

// Order status labels
export const ORDER_STATUS = {
  pending: { label: 'በመጠባበቅ', color: 'yellow' },
  in_production: { label: 'በምርት ላይ', color: 'blue' },
  ready: { label: 'ተዘጋጅቷል', color: 'green' },
  delivered: { label: 'ተላልፏል', color: 'gray' },
  cancelled: { label: 'ተሰርዟል', color: 'red' },
};
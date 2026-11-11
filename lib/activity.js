// lib/activity.js
import {
  ShoppingCart, Package, FileText, Wallet, Users,
  Building2, Settings, Shield, LogIn, UserPlus, Trash2,
  Edit, CheckCircle2, XCircle, Truck, CreditCard,
} from 'lucide-react';

export const EVENT_META = {
  order_created:    { icon: ShoppingCart, label: 'ትዕዛዝ ተፈጠረ',       color: 'text-blue-600',    bg: 'bg-blue-50',    group: 'orders' },
  order_shipped:    { icon: Truck,        label: 'ትዕዛዝ ተልኳል',        color: 'text-blue-600',    bg: 'bg-blue-50',    group: 'orders' },
  order_delivered:  { icon: CheckCircle2, label: 'ትዕዛዝ ደርሷል',        color: 'text-emerald-600', bg: 'bg-emerald-50', group: 'orders' },
  order_cancelled:  { icon: XCircle,      label: 'ትዕዛዝ ተሰርዟል',       color: 'text-red-600',     bg: 'bg-red-50',     group: 'orders' },
  payment_received: { icon: Wallet,       label: 'ክፍያ ተቀብሏል',        color: 'text-emerald-600', bg: 'bg-emerald-50', group: 'payments' },
  payment_refunded: { icon: CreditCard,   label: 'ክፍያ ተመላሽ ሆኗል',      color: 'text-amber-600',   bg: 'bg-amber-50',   group: 'payments' },
  inventory_added:  { icon: Package,      label: 'ክምችት ተጨምሯል',       color: 'text-indigo-600',  bg: 'bg-indigo-50',  group: 'inventory' },
  inventory_low:    { icon: Package,      label: 'ክምችት ወርዷል',        color: 'text-amber-600',   bg: 'bg-amber-50',   group: 'inventory' },
  inventory_out:    { icon: Package,      label: 'ክምችት አልቋል',        color: 'text-red-600',     bg: 'bg-red-50',     group: 'inventory' },
  receipt_created:  { icon: FileText,     label: 'ደረሰኝ ተፈጠረ',         color: 'text-purple-600',  bg: 'bg-purple-50',  group: 'receipts' },
  receipt_printed:  { icon: FileText,     label: 'ደረሰኝ ታትሟል',         color: 'text-purple-600',  bg: 'bg-purple-50',  group: 'receipts' },
  user_created:     { icon: UserPlus,     label: 'ተጠቃሚ ተፈጠረ',        color: 'text-cyan-600',    bg: 'bg-cyan-50',    group: 'users' },
  user_updated:     { icon: Edit,         label: 'ተጠቃሚ ተስተካክሏል',      color: 'text-cyan-600',    bg: 'bg-cyan-50',    group: 'users' },
  user_deleted:     { icon: Trash2,       label: 'ተጠቃሚ ተሰርዟል',        color: 'text-red-600',     bg: 'bg-red-50',     group: 'users' },
  branch_created:   { icon: Building2,    label: 'ቅርንጫፍ ተፈጠረ',        color: 'text-indigo-600',  bg: 'bg-indigo-50',  group: 'branches' },
  branch_updated:   { icon: Building2,    label: 'ቅርንጫፍ ተስተካክሏል',     color: 'text-indigo-600',  bg: 'bg-indigo-50',  group: 'branches' },
  login:            { icon: LogIn,        label: 'ገባ',                 color: 'text-slate-600',   bg: 'bg-slate-50',   group: 'auth' },
  logout:           { icon: LogIn,        label: 'ወጣ',                 color: 'text-slate-600',   bg: 'bg-slate-50',   group: 'auth' },
  settings_updated: { icon: Settings,     label: 'ቅንብሮች ተቀይረዋል',     color: 'text-gray-600',    bg: 'bg-gray-50',    group: 'system' },
  system_alert:     { icon: Shield,       label: 'የስርዓት ማስጠንቀቂያ',    color: 'text-red-600',     bg: 'bg-red-50',     group: 'system' },
};

export const SEVERITY_STYLES = {
  success:  { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', label: 'ተሳክቷል' },
  info:     { dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700',       label: 'መረጃ' },
  warning:  { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700',     label: 'ማስጠንቀቂያ' },
  critical: { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700',         label: 'አስቸኳይ' },
};

export const ROLE_GROUPS = {
  admin:    ['orders', 'payments', 'inventory', 'users', 'branches', 'auth', 'system', 'receipts'],
  seller:   ['orders', 'payments', 'inventory', 'receipts', 'auth'],
  customer: ['orders', 'payments', 'receipts', 'auth'],
};

export function formatRelative(iso) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'አሁን';
  if (mins < 60) return `${mins} ደቂቃ በፊት`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ሰዓት በፊት`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ቀን በፊት`;
  if (days < 30) return `${Math.floor(days / 7)} ሳምንት በፊት`;
  return d.toLocaleDateString('am-ET', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatCurrency(amount, currency = 'ETB') {
  if (amount == null) return '';
  return new Intl.NumberFormat('am-ET', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDay(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const same = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (same(d, today)) return 'ዛሬ';
  if (same(d, yesterday)) return 'ትናንት';
  return d.toLocaleDateString('am-ET', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
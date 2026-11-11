'use client';

import { useState, useMemo } from 'react';
import {
  Bell, CheckCheck, Trash2, Search,
  Package, FileText, Wallet, Users, ShoppingCart,
  AlertCircle, CheckCircle2, Info, Clock, Building2, Shield,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROLE_LABELS } from '@/lib/utils';
import Card from '@/components/ui/Card';

// ✅ Role-aware notification seed data
const DEMO_NOTIFICATIONS = {
  admin: [
    { id: 'a1', type: 'user',    title: 'አዲስ ተጠቃሚ ተመዝግቧል',      message: 'ሳራ ተስፋዬ እንደ ሻጭ ተመዝግባለች።', time: '2026-11-12T09:10:00', read: false, priority: 'high' },
    { id: 'a2', type: 'system',  title: 'የስርዓት ዝመና ተጠናቅቋል',     message: 'ስርዓቱ ወደ ስሪት 2.4.0 ተሻሽሏል።', time: '2026-11-12T07:00:00', read: false, priority: 'normal' },
    { id: 'a3', type: 'order',   title: 'ከፍተኛ ትዕዛዝ ተመዝግቧል',     message: 'ትዕዛዝ #ORD-1042 በ 12,500 ብር ተፈጽሟል።', time: '2026-11-11T18:00:00', read: false, priority: 'high' },
    { id: 'a4', type: 'branch',  title: 'አዲስ ቅርንጫፍ ተከፍቷል',        message: 'ቅርንጫፍ "ቦሌ" ተከፍቷል።', time: '2026-11-11T10:00:00', read: true,  priority: 'normal' },
    { id: 'a5', type: 'payment', title: 'ወርሃዊ ገቢ ሪፖርት',            message: 'የህዳር ወር ጠቅላላ ገቢ 145,000 ብር ደርሷል።', time: '2026-11-10T09:00:00', read: true,  priority: 'low' },
    { id: 'a6', type: 'user',    title: 'የሠራተኛ ፈቃድ ጥያቄ',         message: 'ሠራተኛ አሊ ሙሐመድ የፈቃድ ጥያቄ አቅርቧል።', time: '2026-11-09T15:30:00', read: true,  priority: 'normal' },
  ],
  seller: [
    { id: 's1', type: 'order',     title: 'አዲስ ትዕዛዝ ተመዝግቧል',     message: 'ትዕዛዝ #ORD-1051 ከደንበኛ አበበ ተቀብሏል።', time: '2026-11-12T08:30:00', read: false, priority: 'high' },
    { id: 's2', type: 'inventory', title: 'የዕቃ ክምችት አነስተኛ ሆኗል',  message: '"ስኳር 1ኪሎ" ክምችት ከ10 በታች ወርዷል።', time: '2026-11-12T07:15:00', read: false, priority: 'high' },
    { id: 's3', type: 'receipt',   title: 'ደረሰኝ ተሰርቷል',            message: 'ለትዕዛዝ #ORD-1039 ደረሰኝ #RC-887 ተዘጋጅቷል።', time: '2026-11-11T16:45:00', read: true,  priority: 'normal' },
    { id: 's4', type: 'payment',   title: 'ክፍያ ተቀብሏል',            message: 'ከደንበኛ ሳራ 2,500 ብር ተቀብሏል።', time: '2026-11-11T14:20:00', read: true,  priority: 'normal' },
    { id: 's5', type: 'order',     title: 'ትዕዛዝ ተሰርዟል',           message: 'ትዕዛዝ #ORD-1035 በደንበኛ ተሰርዟል።', time: '2026-11-10T11:00:00', read: true,  priority: 'normal' },
  ],
  customer: [
    { id: 'c1', type: 'order',   title: 'ትዕዛዝዎ ተልኳል',       message: 'ትዕዛዝ #ORD-1042 ተልኳል። በቅርቡ ይደርስዎታል።', time: '2026-11-12T10:00:00', read: false, priority: 'high' },
    { id: 'c2', type: 'receipt', title: 'ደረሰኝዎ ዝግጁ ነው',       message: 'የትዕዛዝ #ORD-1042 ደረሰኝ ዝግጁ ሆኗል።', time: '2026-11-12T09:30:00', read: false, priority: 'normal' },
    { id: 'c3', type: 'order',   title: 'ትዕዛዝዎ ተዘጋጅቷል',     message: 'ትዕዛዝ #ORD-1039 ዝግጁ ሆኖ በመጠባበቅ ላይ ነው።', time: '2026-11-11T15:00:00', read: true,  priority: 'normal' },
    { id: 'c4', type: 'payment', title: 'ክፍያዎ ተረጋግጧል',      message: 'የ 2,500 ብር ክፍያዎ ተረጋግጧል።', time: '2026-11-11T14:20:00', read: true,  priority: 'low' },
    { id: 'c5', type: 'system',  title: 'አዲስ ምርት ተጨምሯል',     message: 'አዲስ ምርት "የቡና ፓኬጅ" በሱቁ ላይ ተጨምሯል።', time: '2026-11-10T09:00:00', read: true,  priority: 'low' },
  ],
};

const TYPE_META = {
  order:     { icon: ShoppingCart, color: 'text-blue-600',    bg: 'bg-blue-50' },
  inventory: { icon: Package,      color: 'text-orange-600',  bg: 'bg-orange-50' },
  receipt:   { icon: FileText,     color: 'text-purple-600',  bg: 'bg-purple-50' },
  payment:   { icon: Wallet,       color: 'text-green-600',   bg: 'bg-green-50' },
  user:      { icon: Users,        color: 'text-cyan-600',    bg: 'bg-cyan-50' },
  branch:    { icon: Building2,    color: 'text-indigo-600',  bg: 'bg-indigo-50' },
  system:    { icon: Info,         color: 'text-gray-600',    bg: 'bg-gray-50' },
};

const PRIORITY_META = {
  high:   { icon: AlertCircle,  color: 'text-red-500',  label: 'አስቸኳይ' },
  normal: { icon: Clock,        color: 'text-gray-400', label: 'መደበኛ' },
  low:    { icon: CheckCircle2, color: 'text-gray-300', label: 'ዝቅተኛ' },
};

const ROLE_FILTERS = {
  admin:    ['all', 'unread', 'user', 'system'],
  seller:   ['all', 'unread', 'order', 'inventory'],
  customer: ['all', 'unread', 'order', 'receipt'],
};

const FILTER_LABELS = {
  all: 'ሁሉም',
  unread: 'ያልተነበቡ',
  user: 'ተጠቃሚዎች',
  system: 'ስርዓት',
  order: 'ትዕዛዞች',
  inventory: 'ክምችት',
  receipt: 'ደረሰኞች',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const role = user?.role || 'customer';
  const roleLabel = ROLE_LABELS[role] || 'ተጠቃሚ';

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(
    DEMO_NOTIFICATIONS[role] || DEMO_NOTIFICATIONS.customer
  );

  const filters = ROLE_FILTERS[role] || ROLE_FILTERS.customer;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = false;
      if (filter === 'all') matchesFilter = true;
      else if (filter === 'unread') matchesFilter = !n.read;
      else matchesFilter = n.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const removeOne = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const mins = Math.floor((now - d) / 60000);
    if (mins < 1) return 'አሁን';
    if (mins < 60) return `${mins} ደቂቃ በፊት`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ሰዓት በፊት`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ቀን በፊት`;
    return d.toLocaleDateString('am-ET');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell size={26} className="text-brand" />
            ማሳወቂያዎች
            {unreadCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Shield size={12} className="text-brand" />
            የእርስዎ ሚና: {roleLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:border-brand hover:text-brand transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCheck size={16} />
            ሁሉንም እንደተነበበ ምልክት አድርግ
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:border-red-400 hover:text-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            ሁሉንም አጥፋ
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ማሳወቂያ ይፈልጉ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
            {filters.map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                  filter === key
                    ? 'bg-white text-brand shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {FILTER_LABELS[key] || key}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <Card padding="md" className="text-center py-16">
          <Bell size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">ምንም ማሳወቂያ አልተገኘም</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? 'ሌላ ቃል ይሞክሩ' : 'አዲስ ማሳወቂያ ሲመጣ እዚህ ይታያል'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const meta = TYPE_META[n.type] || TYPE_META.system;
            const Icon = meta.icon;
            const pr = PRIORITY_META[n.priority] || PRIORITY_META.normal;
            const PrIcon = pr.icon;

            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`group relative bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  n.read
                    ? 'border-gray-100 hover:border-gray-200'
                    : 'border-brand/30 bg-brand/[0.02] hover:border-brand/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={meta.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />}
                      {n.priority === 'high' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          <PrIcon size={10} />
                          {pr.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatTime(n.time)}</p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); removeOne(n.id); }}
                    className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                    title="አጥፋ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 pt-2">
        ማሳወቂያዎችዎ በቅርብ ጊዜ ይዘመናሉ · ሚና: {roleLabel}
      </p>
    </div>
  );
}
'use client';

import { useMemo, useState, useEffect } from 'react';
import { Activity, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROLE_LABELS } from '@/lib/utils';
import { EVENT_META, ROLE_GROUPS } from '@/lib/activity';
import ActivityTimeline from '@/components/activity/ActivityTimeline';
import ActivityFilters from '@/components/activity/ActivityFilters';

const now = Date.now();
const iso = (minsAgo) => new Date(now - minsAgo * 60_000).toISOString();

const SEED = {
  admin: [
    { id: 'a1', type: 'order_created',    severity: 'info',     title: 'አዲስ ትዕዛዝ #ORD-1051', description: 'አበበ ከበደ — ምጣድ x 2', amount: 2500, actor: { name: 'ሳራ ተስፋዬ' }, timestamp: iso(4),   link: '/dashboard/orders' },
    { id: 'a2', type: 'payment_received', severity: 'success',  title: 'ክፍያ ተቀብሏል',        description: 'ORD-2026-0012 በሙሉ ተከፍሏል', amount: 1000, actor: { name: 'ካሳሁን ወርቁ' }, timestamp: iso(35), link: '/dashboard/orders' },
    { id: 'a3', type: 'user_created',     severity: 'info',     title: 'አዲስ ሠራተኛ ተመዝግቧል',   description: 'ዳዊት ተስፋዬ — ሻጭ', actor: { name: 'admin' }, timestamp: iso(90), link: '/dashboard/employees' },
    { id: 'a4', type: 'inventory_low',    severity: 'warning',  title: 'ዝቅተኛ ክምችት',          description: 'ማገዶ ቆጣቢ ምጣድ — 5 pcs ቀሪ', timestamp: iso(120), link: '/dashboard/inventory' },
    { id: 'a5', type: 'system_alert',     severity: 'critical', title: 'የስርዓት ዝመና ያስፈልጋል',    description: 'እባክዎ ስርዓቱን ወደ 2.4.1 ያሻሽሉ', timestamp: iso(60 * 6) },
    { id: 'a6', type: 'branch_created',   severity: 'success',  title: 'አዲስ ቅርንጫፍ "ቦሌ"',       description: 'ቅርንጫፍ በተሳካ ሁኔታ ተከፍቷል', actor: { name: 'admin' }, timestamp: iso(60 * 26), link: '/dashboard/branches' },
    { id: 'a7', type: 'login',            severity: 'info',     title: 'መግቢያ',                  description: 'ከ Chrome · Addis Ababa', actor: { name: 'admin' }, timestamp: iso(60 * 30) },
  ],
  seller: [
    { id: 's1', type: 'order_created',    severity: 'info',     title: 'አዲስ ትዕዛዝ #ORD-1051', description: 'አበበ ከበደ — ምጣድ x 2', amount: 2500, actor: { name: 'አበበ ከበደ' }, timestamp: iso(6),   link: '/dashboard/orders' },
    { id: 's2', type: 'order_shipped',    severity: 'success',  title: 'ትዕዛዝ ተልኳል',           description: '#ORD-1048 — በመንገድ ላይ', timestamp: iso(45), link: '/dashboard/orders' },
    { id: 's3', type: 'inventory_low',    severity: 'warning',  title: 'ዝቅተኛ ክምችት',          description: 'ስኳር 1ኪሎ — 8 pcs ቀሪ', timestamp: iso(80), link: '/dashboard/inventory' },
    { id: 's4', type: 'receipt_created',  severity: 'info',     title: 'ደረሰኝ #RCP-0008',        description: 'ለትዕዛዝ #ORD-1042', timestamp: iso(180), link: '/dashboard/receipts' },
    { id: 's5', type: 'payment_received', severity: 'success',  title: 'ክፍያ ተቀብሏል',          description: 'ORD-1042 — 1,800 ብር', amount: 1800, timestamp: iso(240), link: '/dashboard/orders' },
    { id: 's6', type: 'login',            severity: 'info',     title: 'መግቢያ',                  description: 'ከ Android · Addis Ababa', timestamp: iso(60 * 20) },
  ],
  customer: [
    { id: 'c1', type: 'order_shipped',    severity: 'info',     title: 'ትዕዛዝዎ ተልኳል',         description: '#ORD-1042 — በቅርቡ ይደርስዎታል', timestamp: iso(15),  link: '/dashboard/orders' },
    { id: 'c2', type: 'receipt_created',  severity: 'success',  title: 'ደረሰኝዎ ዝግጁ ነው',         description: '#RCP-0008', timestamp: iso(60), link: '/dashboard/receipts' },
    { id: 'c3', type: 'payment_received', severity: 'success',  title: 'ክፍያዎ ተረጋግጧል',        description: '2,500 ብር', amount: 2500, timestamp: iso(240) },
    { id: 'c4', type: 'order_delivered',  severity: 'success',  title: 'ትዕዛዝዎ ደርሷል',          description: '#ORD-1039 — እንደተረከቡ ያረጋግጡ', timestamp: iso(60 * 26), link: '/dashboard/orders' },
    { id: 'c5', type: 'login',            severity: 'info',     title: 'መግቢያ',                  description: 'ከ iPhone · Addis Ababa', timestamp: iso(60 * 48) },
  ],
};

const GROUP_LABELS = {
  orders:    'ትዕዛዞች',
  payments:  'ክፍያዎች',
  inventory: 'ክምችት',
  receipts:  'ደረሰኞች',
  users:     'ተጠቃሚዎች',
  branches:  'ቅርንጫፎች',
  auth:      'መግቢያ',
  system:    'ስርዓት',
};

export default function ActivityPage() {
  const { user } = useAuth();
  const role = user?.role || 'customer';
  const roleLabel = ROLE_LABELS[role] || 'ተጠቃሚ';

  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const [events, setEvents] = useState(SEED[role] || SEED.customer);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setEvents(SEED[role] || SEED.customer);
  }, [role]);

  const allowedGroups = ROLE_GROUPS[role] || ROLE_GROUPS.customer;

  const visibleGroups = useMemo(() => {
    const present = new Set(events.map((e) => EVENT_META[e.type].group));
    return allowedGroups.filter((g) => present.has(g));
  }, [events, allowedGroups]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const grp = EVENT_META[e.type].group;
      if (!allowedGroups.includes(grp)) return false;
      if (group !== 'all' && grp !== group) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.actor?.name || '').toLowerCase().includes(q) ||
        (e.target || '').toLowerCase().includes(q)
      );
    });
  }, [events, allowedGroups, group, search]);

  const hasFilters = search !== '' || group !== 'all';

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity size={26} className="text-brand" />
            እንቅስቃሴ
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Shield size={12} className="text-brand" />
            የእርስዎ ሚና: {roleLabel}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:border-brand hover:text-brand transition disabled:opacity-40"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          አድስ
        </button>
      </div>

      <ActivityFilters
        search={search}
        onSearch={setSearch}
        activeGroup={group}
        onGroup={setGroup}
        groups={visibleGroups}
        labels={GROUP_LABELS}
        onReset={() => {
          setSearch('');
          setGroup('all');
        }}
        hasFilters={hasFilters}
      />

      <p className="text-xs text-gray-400 pl-1">
        {filtered.length} እንቅስቃሴ{filtered.length !== 1 ? 'ዎች' : ''} ታይተዋል
      </p>

      <ActivityTimeline events={filtered} />
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const GROUPS = [
  {
    title: 'የትዕዛዝ ማሳወቂያዎች',
    items: [
      { key: 'newOrder',  label: 'አዲስ ትዕዛዝ',  icon: ShoppingCart, default: true },
      { key: 'cancelled', label: 'የተሰረዘ ትዕዛዝ', icon: AlertTriangle, default: true },
      { key: 'shipped',   label: 'የተላከ ትዕዛዝ',  icon: Package,     default: true },
    ],
  },
  {
    title: 'የስርዓት ማሳወቂያዎች',
    items: [
      { key: 'lowStock',     label: 'ዝቅተኛ ክምችት',   icon: Package, default: true },
      { key: 'dailyDigest',  label: 'ዕለታዊ ማጠቃለያ',  icon: Bell,    default: false },
      { key: 'weeklyReport', label: 'ሳምንታዊ ሪፖርት', icon: Bell,    default: true },
    ],
  },
  {
    title: 'የመልእክት መንገዶች',
    items: [
      { key: 'inApp', label: 'በመተግበሪያ ውስጥ', icon: Bell,          default: true },
      { key: 'email', label: 'በኢሜይል',        icon: Mail,          default: true },
      { key: 'sms',   label: 'በSMS',          icon: MessageSquare, default: false },
    ],
  },
];

export default function NotificationsTab() {
  const initial = {};
  GROUPS.forEach((g) => g.items.forEach((i) => { initial[i.key] = i.default; }));
  const [state, setState] = useState(initial);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">ማሳወቂያዎች</h2>
        <p className="text-sm text-gray-500">የሚፈልጉትን ማሳወቂያዎች ይምረጡ</p>
      </div>

      {GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            {group.title}
          </h3>
          <div className="space-y-2">
            {group.items.map((item) => {
              const Icon = item.icon;
              const enabled = state[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center',
                      enabled ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-400'
                    )}>
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.label}</span>
                  </div>
                  <Toggle
                    checked={enabled}
                    onChange={(v) => setState({ ...state, [item.key]: v })}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors',
        checked ? 'bg-brand' : 'bg-gray-300'
      )}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-5'
        )}
      />
    </button>
  );
}
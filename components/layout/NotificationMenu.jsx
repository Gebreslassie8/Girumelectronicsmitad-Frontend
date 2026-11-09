'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ShoppingCart, AlertTriangle, CheckCircle2, Package, User } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    icon: ShoppingCart,
    title: 'አዲስ ትዕዛዝ',
    desc: 'አበበ ከበደ — ምጣድ x 2',
    time: '2 ደቂቃ በፊት',
    color: 'bg-blue-50 text-blue-600',
    unread: true,
    link: '/dashboard/orders',
  },
  {
    id: 2,
    type: 'stock',
    icon: AlertTriangle,
    title: 'ዝቅተኛ ክምችት',
    desc: 'ማገዶ ቆጣቢ ምጣድ — 5 pcs ቀሪ',
    time: '25 ደቂቃ በፊት',
    color: 'bg-yellow-50 text-yellow-600',
    unread: true,
    link: '/dashboard/products',
  },
  {
    id: 3,
    type: 'payment',
    icon: CheckCircle2,
    title: 'ክፍያ ተቀብሏል',
    desc: 'ORD-2026-0012 — ETB 1,000',
    time: '1 ሰዓት በፊት',
    color: 'bg-green-50 text-green-600',
    unread: false,
    link: '/dashboard/orders',
  },
  {
    id: 4,
    type: 'receipt',
    icon: Package,
    title: 'ደረሰኝ ተፈጥሯል',
    desc: 'RCP-2026-0008 — ሳራ ሀብታሙ',
    time: '2 ሰዓት በፊት',
    color: 'bg-purple-50 text-purple-600',
    unread: false,
    link: '/dashboard/receipts',
  },
  {
    id: 5,
    type: 'user',
    icon: User,
    title: 'አዲስ ሠራተኛ',
    desc: 'ዳዊት ተስፋዬ — ሻጭ',
    time: 'ትናንት',
    color: 'bg-indigo-50 text-indigo-600',
    unread: false,
    link: '/dashboard/employees',
  },
];

export default function NotificationMenu({ onClose }) {
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Bell size={16} /> ማሳወቂያዎች
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {unreadCount} አዲስ ማሳወቂያ
          </p>
        </div>
        <button className="text-xs text-brand font-medium hover:underline">
          ሁሉንም አንብብ
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
        {NOTIFICATIONS.map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => {
                router.push(n.link);
                onClose();
              }}
              className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition text-left ${
                n.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${n.color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  {n.title}
                  {n.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{n.desc}</p>
                <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 text-center">
        <button className="text-sm text-brand font-medium hover:underline">
          ሁሉንም ማሳወቂያዎች ይመልከቱ →
        </button>
      </div>
    </div>
  );
}

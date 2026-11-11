'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';                        // ✅ ADD
import { Bell, ShoppingCart, AlertTriangle, CheckCircle2, Package, User } from 'lucide-react';
import { notificationsStore } from '@/lib/notificationsStore';

const NOTIFICATIONS = [
  // ...your existing array — keep unchanged...
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

  // Seed the global store so the header badge is correct even before visiting the full page
  useEffect(() => {
    notificationsStore.setUnread(unreadCount);
  }, [unreadCount]);

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

        {/* ✅ was dead button → now navigates to the page */}
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          className="text-xs text-brand font-medium hover:underline"
        >
          ሁሉንም አንብብ
        </Link>
      </div>

      {/* List — unchanged */}
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

      {/* ✅ was dead button → now navigates to the page */}
      <div className="p-3 border-t border-gray-100 text-center">
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          className="text-sm text-brand font-medium hover:underline"
        >
          ሁሉንም ማሳወቂያዎች ይመልከቱ →
        </Link>
      </div>
    </div>
  );
}
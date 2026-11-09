'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Settings, Shield, Globe, LogOut, ChevronRight, HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROLE_LABELS } from '@/lib/utils';

export default function ProfileMenu({ onClose }) {
  const ref = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const items = [
    { label: 'የእኔ መገለጫ',  icon: User,     href: '/dashboard/profile' },
    { label: 'ቅንብሮች',     icon: Settings, href: '/dashboard/settings' },
    { label: 'ደህንነት',     icon: Shield,   href: '/dashboard/security' },
    { label: 'ቋንቋ',        icon: Globe,    href: '/dashboard/language' },
    { label: 'እርዳታ',       icon: HelpCircle, href: '/dashboard/help' },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
    >
      {/* User info */}
      <div className="p-4 bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-lg ring-2 ring-white/30">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{user?.fullName || 'ተጠቃሚ'}</p>
            <p className="text-xs text-blue-100 truncate">{user?.phone || ''}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium">
            {ROLE_LABELS[user?.role] || 'ሻጭ'}
          </span>
          {user?.branch && (
            <span className="inline-flex px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium">
              ቅርንጫፍ
            </span>
          )}
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group"
            >
              <Icon size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition font-medium"
        >
          <LogOut size={16} />
          <span className="flex-1 text-left">ውጣ</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">
          ግሩም ምጣድ v1.0.0
        </p>
      </div>
    </div>
  );
}

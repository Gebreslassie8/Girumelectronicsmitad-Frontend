'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  BarChart3, Building2, Users, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

const NAV = [
  { href: '/',            label: 'ዳሽቦርድ',      icon: LayoutDashboard },
  { href: '/inventory',   label: 'መጋዘን',        icon: Package },
  { href: '/products',    label: 'ምርቶች',       icon: ShoppingCart },
  { href: '/orders',      label: 'ትዕዛዞች',      icon: FileText },
  { href: '/receipts',    label: 'ደረሰኞች',      icon: FileText },
  { href: '/analytics',   label: 'ትንተና',        icon: BarChart3 },
  { href: '/branches',    label: 'ቅርንጫፎች',     icon: Building2 },
  { href: '/employees',   label: 'ሠራተኞች',      icon: Users },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-brand">ግሩም ምጣድ</h1>
          <p className="text-xs text-gray-500 mt-1">ስርዓት አስተዳደር</p>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition',
                  active
                    ? 'bg-brand text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 mb-2">
            {user?.fullName || 'ተጠቃሚ'}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
          >
            <LogOut size={16} /> ውጣ
          </button>
        </div>
      </aside>
    </>
  );
}
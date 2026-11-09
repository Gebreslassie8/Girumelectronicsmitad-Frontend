'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  BarChart3, Building2, Users, LogOut, X, User,
  Wallet, TrendingUp, ClipboardList, UserCircle,
  Settings, Bell, History,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

const NAV_GROUPS = [
  {
    titleKey: 'sidebar.main',
    items: [
      { href: '/dashboard',           labelKey: 'dashboard', icon: LayoutDashboard, roles: ['admin', 'seller', 'customer'] },
      { href: '/dashboard/inventory', labelKey: 'inventory', icon: Package,        roles: ['admin', 'seller'] },
      { href: '/dashboard/products',  labelKey: 'products',  icon: ShoppingCart,   roles: ['admin', 'seller', 'customer'] },
      { href: '/dashboard/orders',    labelKey: 'orders',    icon: FileText,       roles: ['admin', 'seller', 'customer'] },
      { href: '/dashboard/receipts',  labelKey: 'receipts',  icon: FileText,       roles: ['admin', 'seller', 'customer'] },
    ],
  },
  {
    titleKey: 'sidebar.finance',
    items: [
      { href: '/dashboard/expenses', labelKey: 'expenses', icon: Wallet,        roles: ['admin'] },
      { href: '/dashboard/revenue',  labelKey: 'revenue',  icon: TrendingUp,    roles: ['admin'] },
      { href: '/dashboard/reports',  labelKey: 'reports',  icon: ClipboardList, roles: ['admin'] },
    ],
  },
  {
    titleKey: 'sidebar.management',
    items: [
      { href: '/dashboard/analytics', labelKey: 'analytics', icon: BarChart3,     roles: ['admin'] },
      { href: '/dashboard/branches',  labelKey: 'branches',  icon: Building2,     roles: ['admin'] },
      { href: '/dashboard/employees', labelKey: 'employees', icon: Users,         roles: ['admin'] },
      { href: '/dashboard/users',     labelKey: 'users',     icon: UserCircle,    roles: ['admin'] },
    ],
  },
  {
    titleKey: 'sidebar.other',
    items: [
      { href: '/dashboard/notifications', labelKey: 'notifications', icon: Bell,     roles: ['admin', 'seller', 'customer'] },
      { href: '/dashboard/activity',      labelKey: 'activity',      icon: History,  roles: ['admin'] },
      { href: '/dashboard/profile',       labelKey: 'profile',       icon: User,     roles: ['admin', 'seller', 'customer'] },
      { href: '/dashboard/settings',      labelKey: 'settings',      icon: Settings, roles: ['admin'] },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const t = useTranslations('nav');
  const tSidebar = useTranslations('sidebar');

  const role = user?.role || 'customer';

  const filteredGroups = NAV_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition">
              ግ
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">ግሩም ምጣድ</h1>
              <p className="text-[10px] text-gray-500">Grum Stove Admin</p>
            </div>
          </Link>

          <button
            className="md:hidden text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {filteredGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-3' : ''}>
              <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {tSidebar(group.titleKey.replace('sidebar.', ''))}
              </p>
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                const label = t(item.labelKey);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-all group relative',
                      active
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-brand'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r" />
                    )}
                    <Icon size={17} className={active ? '' : 'group-hover:scale-110 transition'} />
                    <span className="flex-1">{label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 mb-2">
            <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.fullName || 'ተጠቃሚ'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {user?.role || ''}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full text-sm text-red-600 hover:bg-red-50 rounded-lg py-2 transition font-medium"
          >
            <LogOut size={16} /> {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}

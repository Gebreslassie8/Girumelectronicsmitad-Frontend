'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, Building2, Users, Menu } from 'lucide-react';

const NAV = [
  { href: '/dashboard',           label: 'ዳሽቦርድ',  icon: LayoutDashboard },
  { href: '/dashboard/inventory', label: 'መጋዘን',   icon: Package },
  { href: '/dashboard/products',  label: 'ምርቶች',   icon: ShoppingCart },
  { href: '/dashboard/orders',    label: 'ትዕዛዞች',  icon: FileText },
  { href: '/dashboard/receipts',  label: 'ደረሰኞች',  icon: FileText },
  { href: '/dashboard/analytics', label: 'ትንተና',    icon: BarChart3 },
  { href: '/dashboard/branches',  label: 'ቅርንጫፎች', icon: Building2 },
  { href: '/dashboard/employees', label: 'ሠራተኞች',  icon: Users },
];

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b">
          <Link href="/" className="text-xl font-bold text-brand">ግሩም ምጣድ</Link>
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
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition ${
                  active ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600" onClick={() => setOpen(true)}>
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">ዳሽቦርድ</h2>
          </div>
          <Link href="/" className="text-sm text-gray-600 hover:text-brand">
            ← ወደ ድህረ ገጽ
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

'use client';

import { Menu } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROLE_LABELS } from '@/lib/utils';

export default function Header({ onMenuClick, title }) {
  const { user } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-gray-600" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="text-sm text-gray-600">
        {user?.fullName} · <span className="text-brand font-medium">{ROLE_LABELS[user?.role] || ''}</span>
      </div>
    </header>
  );
}
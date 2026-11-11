'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User, Settings, Shield, LogOut, ChevronRight,
  HelpCircle, Bell, Wallet, BarChart3, FileText, Package,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useProfile } from '@/components/providers/ProfileProvider';
import { getInitials, getRoleLabel } from '@/lib/utils';

export default function ProfileMenu({ onClose, onOpenProfileModal }) {
  const ref = useRef(null);
  const { user, logout } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const displayName = profile?.fullName || user?.fullName || 'ተጠቃሚ';
  const displayPhone = profile?.phone || user?.phone || '';
  const displayAvatar = profile?.avatar || null;
  const initials = getInitials(displayName);
  const roleLabel = getRoleLabel(user?.role);
  const role = user?.role || 'customer';

  const handleOpenProfile = () => {
    if (onOpenProfileModal) {
      onOpenProfileModal();
    }
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-[60]"
    >
      <div className="p-4 bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-lg ring-2 ring-white/30 overflow-hidden">
            {displayAvatar ? (
              <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{displayName}</p>
            <p className="text-xs text-blue-100 truncate">{displayPhone}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium">
            {roleLabel}
          </span>
          {user?.branch && (
            <span className="inline-flex px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium">
              {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
            </span>
          )}
        </div>
      </div>

      <div className="p-2 max-h-80 overflow-y-auto">
        <button
          type="button"
          onClick={handleOpenProfile}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group text-left"
        >
          <User size={16} className="text-gray-400 group-hover:text-brand transition" />
          <span className="flex-1">የእኔ መገለጫ</span>
          <ChevronRight size={14} className="text-gray-300" />
        </button>

        {role === 'admin' && (
          <>
            <Link href="/dashboard/settings" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
              <Settings size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">ቅንብሮች</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
            <Link href="/dashboard/users" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
              <Shield size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">ተጠቃሚዎች</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
            <Link href="/dashboard/analytics" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
              <BarChart3 size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">ትንተና</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
          </>
        )}

        {role === 'seller' && (
          <>
            <Link href="/dashboard/analytics" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
              <BarChart3 size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">ትንተና</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
            <Link href="/dashboard/expenses" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
              <Wallet size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">ወጪዎች</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
          </>
        )}

        {role === 'customer' && (
          <>
            <Link href="/dashboard/orders" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
              <FileText size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">የእኔ ትዕዛዞች</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
            <Link href="/dashboard/my-products" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
              <Package size={16} className="text-gray-400 group-hover:text-brand transition" />
              <span className="flex-1">የገዙት ምርቶች</span>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
          </>
        )}

        <Link href="/dashboard/notifications" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
          <Bell size={16} className="text-gray-400 group-hover:text-brand transition" />
          <span className="flex-1">ማሳወቂያዎች</span>
          <ChevronRight size={14} className="text-gray-300" />
        </Link>
        <Link href="/dashboard/help" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition group">
          <HelpCircle size={16} className="text-gray-400 group-hover:text-brand transition" />
          <span className="flex-1">እርዳታ</span>
          <ChevronRight size={14} className="text-gray-300" />
        </Link>
      </div>

      <div className="p-2 border-t border-gray-100">
        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition font-medium"
        >
          <LogOut size={16} />
          <span className="flex-1 text-left">ውጣ</span>
        </button>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">ግሩም ምጣድ v1.0.0</p>
      </div>
    </div>
  );
}

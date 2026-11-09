'use client';

import { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';

export default function Header({ onMenuClick, title }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const t = useTranslations('nav');

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          className="md:hidden text-gray-600 hover:text-brand p-1.5 rounded-lg hover:bg-gray-100 transition"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>
      </div>

      {/* Right: Search + Language + Notification + Profile */}
      <div className="flex items-center gap-2">
        {/* Search (hidden on mobile) */}
        <div className="hidden lg:flex items-center relative">
          <Search size={16} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="ፈልግ..."
            className="pl-9 pr-3 py-1.5 w-56 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand bg-gray-50 focus:bg-white transition"
          />
        </div>

        {/* Language Switcher */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand transition"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <NotificationMenu onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-full hover:bg-gray-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
              U
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              የእኔ መገለጫ
            </span>
          </button>

          {showProfile && (
            <ProfileMenu onClose={() => setShowProfile(false)} />
          )}
        </div>
      </div>
    </header>
  );
}

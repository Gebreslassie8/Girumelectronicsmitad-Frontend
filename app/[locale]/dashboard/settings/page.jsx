'use client';

import { useState } from 'react';
import {
  Settings, Building2, Bell, Shield, Palette, Globe, Save,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROLE_LABELS } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

import GeneralTab from '@/components/settings/GeneralTab';
import BranchTab from '@/components/settings/BranchTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SecurityTab from '@/components/settings/SecurityTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import LocalizationTab from '@/components/settings/LocalizationTab';

const TABS = [
  { key: 'general',       label: 'አጠቃላይ',       icon: Settings,  roles: ['admin', 'seller', 'customer'] },
  { key: 'branch',        label: 'ቅርንጫፍ',       icon: Building2, roles: ['admin', 'seller'] },
  { key: 'notifications', label: 'ማሳወቂያዎች',    icon: Bell,      roles: ['admin', 'seller', 'customer'] },
  { key: 'security',      label: 'ደህንነት',       icon: Shield,    roles: ['admin', 'seller', 'customer'] },
  { key: 'appearance',    label: 'አቀራረብ',      icon: Palette,   roles: ['admin', 'seller', 'customer'] },
  { key: 'localization',  label: 'ቋንቋ',         icon: Globe,     roles: ['admin', 'seller', 'customer'] },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const role = user?.role || 'customer';
  const roleLabel = ROLE_LABELS[role] || 'ተጠቃሚ';

  const visibleTabs = TABS.filter((t) => t.roles.includes(role));
  const [active, setActive] = useState(visibleTabs[0]?.key || 'general');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success('ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል');
    } catch {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings size={26} className="text-brand" />
            ቅንብሮች
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Shield size={12} className="text-brand" />
            የእርስዎ ሚና: {roleLabel}
          </p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save size={16} /> አስቀምጥ
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {visibleTabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px ${
                  isActive
                    ? 'border-brand text-brand bg-brand/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {active === 'general' && <GeneralTab user={user} role={role} />}
          {active === 'branch' && <BranchTab user={user} role={role} />}
          {active === 'notifications' && <NotificationsTab user={user} />}
          {active === 'security' && <SecurityTab user={user} />}
          {active === 'appearance' && <AppearanceTab />}
          {active === 'localization' && <LocalizationTab />}
        </div>
      </Card>
    </div>
  );
}
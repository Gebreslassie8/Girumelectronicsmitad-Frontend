'use client';

import { useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES = [
  { key: 'light',  label: 'ብርሃን',  icon: Sun },
  { key: 'dark',   label: 'ጨለማ',   icon: Moon },
  { key: 'system', label: 'ስርዓት',  icon: Monitor },
];

const DENSITIES = [
  { key: 'comfortable', label: 'ምቹ' },
  { key: 'compact',     label: 'ጠባብ' },
];

export default function AppearanceTab() {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('comfortable');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">አቀራረብ</h2>
        <p className="text-sm text-gray-500">የመተግበሪያውን መልክ ያስተካክሉ</p>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          ገጽታ
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const active = theme === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={cn(
                  'relative p-4 rounded-xl border-2 transition flex flex-col items-center gap-2',
                  active
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {active && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center">
                    <Check size={12} />
                  </span>
                )}
                <Icon size={24} className={active ? 'text-brand' : 'text-gray-500'} />
                <span className={cn('text-sm font-medium', active ? 'text-brand' : 'text-gray-700')}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          ጥግግት
        </h3>
        <div className="flex gap-2">
          {DENSITIES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDensity(d.key)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition',
                density === d.key
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
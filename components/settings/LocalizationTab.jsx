'use client';

import { useState } from 'react';
import { Clock, DollarSign } from 'lucide-react';

const LANGUAGES = [
  { key: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { key: 'en', label: 'English', flag: '🇬🇧' },
  { key: 'om', label: 'Afaan Oromoo', flag: '🇪🇹' },
];

const TIMEZONES = ['Africa/Addis_Ababa', 'Africa/Nairobi', 'UTC'];
const CURRENCIES = ['ETB', 'USD', 'EUR'];

export default function LocalizationTab() {
  const [lang, setLang] = useState('am');
  const [tz, setTz] = useState('Africa/Addis_Ababa');
  const [currency, setCurrency] = useState('ETB');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">ቋንቋ እና ክልል</h2>
        <p className="text-sm text-gray-500">የቋንቋ፣ የሰዓት አቆጣጠር እና የገንዘብ ቅንብሮች</p>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          ቋንቋ
        </h3>
        <div className="space-y-2">
          {LANGUAGES.map((l) => (
            <label
              key={l.key}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                lang === l.key ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="language"
                checked={lang === l.key}
                onChange={() => setLang(l.key)}
                className="w-4 h-4 text-brand"
              />
              <span className="text-xl">{l.flag}</span>
              <span className="text-sm font-medium text-gray-800">{l.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            የሰዓት አቆጣጠር
          </label>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            >
              {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            ገንዘብ
          </label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
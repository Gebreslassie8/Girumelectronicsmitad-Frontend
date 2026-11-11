'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';

export default function GeneralTab({ user, role }) {
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });

  const field = (key, label, Icon, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">የግል መረጃ</h2>
        <p className="text-sm text-gray-500">የመለያዎን መሰረታዊ መረጃ ያስተካክሉ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field('fullName', 'ሙሉ ስም', User)}
        {field('email', 'ኢሜይል', Mail, 'email')}
        {field('phone', 'ስልክ ቁጥር', Phone, 'tel')}
        {field('address', 'አድራሻ', MapPin)}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">ስለ እኔ</label>
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="ስለራስዎ አጭር መግለጫ..."
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
        />
      </div>

      {user?.branch && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 text-sm text-blue-700">
          <Building2 size={16} />
          ቅርንጫፍ: {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
        </div>
      )}
    </div>
  );
}
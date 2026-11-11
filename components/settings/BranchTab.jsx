'use client';

import { useState } from 'react';
import { Building2, MapPin, Users, Percent } from 'lucide-react';

export default function BranchTab({ user, role }) {
  const [form, setForm] = useState({
    name: user?.branch?.name || '',
    code: user?.branch?.code || '',
    phone: user?.branch?.phone || '',
    address: user?.branch?.address || '',
    manager: user?.branch?.manager || '',
    taxRate: user?.branch?.taxRate || 15,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">የቅርንጫፍ ቅንብሮች</h2>
        <p className="text-sm text-gray-500">የቅርንጫፍ መረጃ እና ተያያዥ ቅንብሮች</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="የቅርንጫፍ ስም" icon={Building2} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="ኮድ" icon={Building2} value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
        <Field label="ስልክ" icon={Users} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Field label="አስተዳዳሪ" icon={Users} value={form.manager} onChange={(v) => setForm({ ...form, manager: v })} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">አድራሻ</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">የተጨማሪ እሴት ታክስ (%)</label>
        <div className="relative">
          <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            min={0}
            max={100}
            value={form.taxRate}
            onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </div>
    </div>
  );
}
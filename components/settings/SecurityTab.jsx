'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Smartphone, KeyRound } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function SecurityTab() {
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) {
      toast.error('አዲሶቹ ፓስወርዶች አይመሳሰሉም');
      return;
    }
    if (pwd.next.length < 6) {
      toast.error('ፓስወርድ ቢያንስ 6 ፊደል መሆን አለበት');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success('ፓስወርድ ተቀይሯል');
      setPwd({ current: '', next: '', confirm: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">ደህንነት</h2>
        <p className="text-sm text-gray-500">የመለያዎን ደህንነት ያስተዳድሩ</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          ፓስወርድ ቀይር
        </h3>
        <PasswordField
          label="የአሁኑ ፓስወርድ"
          value={pwd.current}
          onChange={(v) => setPwd({ ...pwd, current: v })}
          show={show.current}
          toggle={() => setShow({ ...show, current: !show.current })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PasswordField
            label="አዲስ ፓስወርድ"
            value={pwd.next}
            onChange={(v) => setPwd({ ...pwd, next: v })}
            show={show.next}
            toggle={() => setShow({ ...show, next: !show.next })}
          />
          <PasswordField
            label="አዲሱን ያረጋግጡ"
            value={pwd.confirm}
            onChange={(v) => setPwd({ ...pwd, confirm: v })}
            show={show.confirm}
            toggle={() => setShow({ ...show, confirm: !show.confirm })}
          />
        </div>
        <Button type="submit" loading={loading}>
          <Lock size={16} /> ፓስወርድ አስቀምጥ
        </Button>
      </form>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          ባለ ሁለት ደረጃ ማረጋገጫ
        </h3>
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Smartphone size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">ባለ ሁለት ደረጃ ማረጋገጫ</p>
              <p className="text-xs text-gray-500 mt-0.5">ተጨማሪ ደህንነት ለመስጠት</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTwoFA(!twoFA)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              twoFA ? 'bg-brand' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={twoFA}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                twoFA ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          ንቁ ክፍለ ጊዜዎች
        </h3>
        <div className="space-y-2">
          <SessionRow device="Chrome · Windows" location="Addis Ababa" current />
          <SessionRow device="Safari · iPhone" location="Addis Ababa" />
        </div>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, toggle }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function SessionRow({ device, location, current }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
          <Shield size={16} className="text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
            {device}
            {current && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                አሁን
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
      </div>
      {!current && (
        <button className="text-xs font-medium text-red-600 hover:underline">
          ውጣ
        </button>
      )}
    </div>
  );
}
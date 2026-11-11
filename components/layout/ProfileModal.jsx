'use client';

import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Building2, Shield, Calendar,
  Save, X, Camera, Lock, Eye, EyeOff, CheckCircle2,
  LogOut, Edit, BadgeCheck, Sparkles, KeyRound,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useProfile } from '@/components/providers/ProfileProvider';
import { formatDate, ROLE_LABELS, ROLE_COLORS, getInitials, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    avatar: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.address || '',
        avatar: profile.avatar || null,
      });
      setEditMode(false);
      setShowPasswordForm(false);
    }
  }, [isOpen, profile]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const roleLabel = ROLE_LABELS[user?.role] || 'ተጠቃሚ';
  const roleColor = ROLE_COLORS[user?.role] || ROLE_COLORS.customer;
  const initials = getInitials(form.fullName);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ፋይሉ ከ2MB መብለጥ የለበትም');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatar: reader.result });
      toast.success('ፎቶ ተመርጧል');
    };
    reader.readAsDataURL(file);
  };

  // ✅ Save profile → close modal
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      updateProfile({ ...form });
      toast.success('መገለጫ ተስተካክሏል');
      setEditMode(false);
      onClose();
    } catch (err) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change password → close modal
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('አዲሶቹ ፓስወርዶች አይመሳሰሉም');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('ፓስወርድ ቢያንስ 6 ፊደል መሆን አለበት');
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success('ፓስወርድ ተቀይሯል');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      onClose(); // ✅ Modal ይዘጋ
    } catch (err) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ Close button — RED */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center shadow-lg hover:scale-110"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* LEFT — Profile Card */}
          <div className="lg:col-span-2 relative bg-gradient-to-br from-brand via-brand-light to-brand-dark p-6 lg:p-8 text-white overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative group mb-4">
                  <div className={cn(
                    'w-32 h-32 rounded-full ring-4 ring-white/30 shadow-2xl flex items-center justify-center text-white text-4xl font-bold overflow-hidden bg-white/20 backdrop-blur',
                    !form.avatar && roleColor.solid
                  )}>
                    {form.avatar ? (
                      <img src={form.avatar} alt={form.fullName} className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  {editMode && (
                    <>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white text-brand flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                <h2 className="text-2xl font-bold leading-tight">
                  {form.fullName || 'ተጠቃሚ'}
                </h2>

                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-medium">
                  <BadgeCheck size={14} />
                  {roleLabel}
                </div>

                {user?.branch && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-blue-100">
                    <Building2 size={12} />
                    {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/20 my-4" />

              <div className="space-y-3 text-sm flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <Phone size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-blue-100 uppercase tracking-wider">ስልክ</p>
                    <p className="text-sm font-medium truncate">{form.phone || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <Mail size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-blue-100 uppercase tracking-wider">ኢሜይል</p>
                    <p className="text-sm font-medium truncate">{form.email || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-blue-100 uppercase tracking-wider">አድራሻ</p>
                    <p className="text-sm font-medium truncate">{form.address || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <Calendar size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-blue-100 uppercase tracking-wider">የተቀላቀሉበት</p>
                    <p className="text-sm font-medium truncate">
                      {user?.createdAt ? formatDate(user.createdAt) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { logout(); onClose(); }}
                className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur font-medium text-sm transition-all"
              >
                <LogOut size={16} /> ውጣ
              </button>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="lg:col-span-3 bg-gray-50 p-6 lg:p-8 overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles size={20} className="text-brand" />
                  የግል መረጃ
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editMode ? 'መረጃዎን ያስተካክሉ' : 'የእርስዎ መረጃ'}
                </p>
              </div>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white font-medium hover:bg-brand-dark transition shadow-sm hover:shadow-md"
                >
                  <Edit size={16} /> አስተካክል
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setForm({
                      fullName: profile?.fullName || '',
                      phone: profile?.phone || '',
                      email: profile?.email || '',
                      address: profile?.address || '',
                      avatar: profile?.avatar || null,
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <X size={16} /> ሰርዝ
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <ModernField
                  label="ሙሉ ስም"
                  icon={User}
                  value={form.fullName}
                  editMode={editMode}
                  onChange={(v) => setForm({ ...form, fullName: v })}
                  required
                />
                <ModernField
                  label="ስልክ ቁጥር"
                  icon={Phone}
                  value={form.phone}
                  editMode={editMode}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  required
                  type="tel"
                />
                <ModernField
                  label="ኢሜይል"
                  icon={Mail}
                  value={form.email}
                  editMode={editMode}
                  onChange={(v) => setForm({ ...form, email: v })}
                  type="email"
                />
                <ModernField
                  label="አድራሻ"
                  icon={MapPin}
                  value={form.address}
                  editMode={editMode}
                  onChange={(v) => setForm({ ...form, address: v })}
                />
              </div>

              {editMode && (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition shadow-sm hover:shadow-md disabled:opacity-50"
                  >
                    <Save size={18} /> {loading ? 'በማስቀመጥ ላይ...' : 'አስቀምጥ'}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield size={18} className="text-brand" />
                ደህንነት
              </h3>

              <button
                type="button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-brand hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <KeyRound size={18} className="text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">ፓስወርድ ቀይር</p>
                    <p className="text-xs text-gray-500">የደህንነትዎን ፓስወርድ ያዘጋጁ</p>
                  </div>
                </div>
                <ChevronDownIcon open={showPasswordForm} />
              </button>

              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="mt-4 space-y-3 p-4 rounded-xl bg-white border border-gray-200">
                  <ModernPasswordField
                    label="የአሁኑ ፓስወርድ"
                    value={passwordForm.currentPassword}
                    onChange={(v) => setPasswordForm({ ...passwordForm, currentPassword: v })}
                    show={showPasswords.current}
                    onToggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  />
                  <ModernPasswordField
                    label="አዲስ ፓስወርድ"
                    value={passwordForm.newPassword}
                    onChange={(v) => setPasswordForm({ ...passwordForm, newPassword: v })}
                    show={showPasswords.new}
                    onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  />
                  <ModernPasswordField
                    label="አዲሱን ያረጋግጡ"
                    value={passwordForm.confirmPassword}
                    onChange={(v) => setPasswordForm({ ...passwordForm, confirmPassword: v })}
                    show={showPasswords.confirm}
                    onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition disabled:opacity-50"
                  >
                    <Save size={16} /> {loading ? 'በመቀየር ላይ...' : 'ፓስወርድ አስቀምጥ'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModernField({ label, icon: Icon, value, onChange, editMode, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center pointer-events-none">
          <Icon size={15} className="text-brand" />
        </div>
        {editMode ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 text-sm font-medium text-gray-800 bg-white transition-all"
          />
        ) : (
          <div className="w-full pl-14 pr-4 py-3 rounded-xl bg-white border-2 border-gray-100 text-sm font-medium text-gray-800 min-h-[48px] flex items-center">
            {value || <span className="text-gray-400 italic">—</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function ModernPasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center pointer-events-none">
          <Lock size={15} className="text-orange-600" />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={6}
          className="w-full pl-14 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 text-sm font-medium text-gray-800 bg-white transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function ChevronDownIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn('text-gray-400 transition-transform', open && 'rotate-180')}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

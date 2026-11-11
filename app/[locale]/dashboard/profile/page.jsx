'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  User, Mail, Phone, MapPin, Building2, Shield, Calendar,
  Edit, Save, X, Camera, Lock, Eye, EyeOff, CheckCircle2,
  Briefcase, KeyRound, LogOut, UserCircle,
} from 'lucide-react';
import { formatDate, ROLE_LABELS, ROLE_COLORS, getInitials, cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Profile state
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    avatar: null, // base64 or URL
  });

  // ✅ Password state
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

  const roleLabel = ROLE_LABELS[user?.role] || 'ተጠቃሚ';
  const roleColor = ROLE_COLORS[user?.role] || ROLE_COLORS.customer;
  const initials = getInitials(profile.fullName);

  // ✅ Avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ፋይሉ ከ2MB መብለጥ የለበትም');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, avatar: reader.result });
      toast.success('ፎቶ ተመርጧል — ለማስቀመጥ "አስቀምጥ" ይጫኑ');
    };
    reader.readAsDataURL(file);
  };

  // ✅ Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      // TODO: API call
      toast.success('መገለጫ በተሳካ ሁኔታ ተስተካክሏል');
      setEditMode(false);
    } catch (err) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change password
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
      await new Promise((r) => setTimeout(r, 800));
      // TODO: API call
      toast.success('ፓስወርድ በተሳካ ሁኔታ ተቀይሯል');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">የእኔ መገለጫ</h1>
        <p className="text-sm text-gray-500 mt-1">
          የግል መረጃዎን ያስተዳድሩ እና ፓስወርድዎን ይቀይሩ
        </p>
      </div>

      {/* Profile Card */}
      <Card padding="none" className="overflow-hidden">
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-br from-brand via-brand-light to-brand-dark relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white" />
            <div className="absolute top-4 right-32 w-32 h-32 rounded-full bg-white" />
          </div>
        </div>

        {/* Avatar + Basic Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
            {/* Avatar */}
            <div className="relative group">
              <div className={cn(
                'w-32 h-32 rounded-full ring-4 ring-white shadow-lg flex items-center justify-center text-white text-4xl font-bold',
                profile.avatar ? 'bg-gray-200' : roleColor.solid
              )}>
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Camera button */}
              {editMode && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center shadow-md hover:bg-brand-dark transition"
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

            {/* Name + Role */}
            <div className="flex-1 sm:pb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.fullName || 'ተጠቃሚ'}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
                  roleColor.bg,
                  roleColor.text
                )}>
                  <Shield size={10} />
                  {roleLabel}
                </span>
                {user?.branch && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    <Building2 size={10} />
                    {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={10} />
                  ከ {formatDate(user?.createdAt)}
                </span>
              </div>
            </div>

            {/* Edit / Cancel button */}
            <div className="sm:pb-3">
              {!editMode ? (
                <Button onClick={() => setEditMode(true)}>
                  <Edit size={16} /> አስተካክል
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setProfile({
                      fullName: user?.fullName || '',
                      phone: user?.phone || '',
                      email: user?.email || '',
                      address: user?.address || '',
                      avatar: null,
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <X size={16} /> ሰርዝ
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Info & Password */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Personal Info — 2 columns */}
        <div className="lg:col-span-2">
          <Card title="የግል መረጃ" padding="md">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="ሙሉ ስም"
                  icon={User}
                  value={profile.fullName}
                  editMode={editMode}
                  onChange={(v) => setProfile({ ...profile, fullName: v })}
                  required
                />
                <InfoField
                  label="ስልክ ቁጥር"
                  icon={Phone}
                  value={profile.phone}
                  editMode={editMode}
                  onChange={(v) => setProfile({ ...profile, phone: v })}
                  required
                />
                <InfoField
                  label="ኢሜይል"
                  icon={Mail}
                  value={profile.email}
                  editMode={editMode}
                  onChange={(v) => setProfile({ ...profile, email: v })}
                  type="email"
                />
                <InfoField
                  label="አድራሻ"
                  icon={MapPin}
                  value={profile.address}
                  editMode={editMode}
                  onChange={(v) => setProfile({ ...profile, address: v })}
                />
              </div>

              {/* Read-only fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <ReadOnlyField label="ሚና" value={roleLabel} icon={Shield} />
                <ReadOnlyField
                  label="ቅርንጫፍ"
                  value={user?.branch
                    ? (typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ')
                    : '—'}
                  icon={Building2}
                />
                <ReadOnlyField
                  label="የተቀላቀሉበት"
                  value={formatDate(user?.createdAt)}
                  icon={Calendar}
                />
                <ReadOnlyField
                  label="የመጨረሻ መግቢያ"
                  value={user?.lastLogin ? formatDate(user.lastLogin) : 'ዛሬ'}
                  icon={CheckCircle2}
                />
              </div>

              {/* Save button */}
              {editMode && (
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button type="submit" loading={loading}>
                    <Save size={16} /> አስቀምጥ
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Right Side — Security + Account */}
        <div className="space-y-4">
          {/* Security Card */}
          <Card title="ደህንነት" padding="md">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-brand hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Lock size={16} className="text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">ፓስወርድ ቀይር</p>
                    <p className="text-xs text-gray-500">የደህንነትዎን ፓስወርድ ያዘጋጁ</p>
                  </div>
                </div>
                <KeyRound size={16} className="text-gray-400 group-hover:text-brand transition" />
              </button>

              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="space-y-3 pt-3 border-t border-gray-100">
                  <PasswordField
                    label="የአሁኑ ፓስወርድ"
                    value={passwordForm.currentPassword}
                    onChange={(v) => setPasswordForm({ ...passwordForm, currentPassword: v })}
                    show={showPasswords.current}
                    onToggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  />
                  <PasswordField
                    label="አዲስ ፓስወርድ"
                    value={passwordForm.newPassword}
                    onChange={(v) => setPasswordForm({ ...passwordForm, newPassword: v })}
                    show={showPasswords.new}
                    onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  />
                  <PasswordField
                    label="አዲሱን ያረጋግጡ"
                    value={passwordForm.confirmPassword}
                    onChange={(v) => setPasswordForm({ ...passwordForm, confirmPassword: v })}
                    show={showPasswords.confirm}
                    onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  />
                  <Button type="submit" loading={loading} className="w-full">
                    <Save size={16} /> ፓስወርድ አስቀምጥ
                  </Button>
                </form>
              )}
            </div>
          </Card>

          {/* Account Card */}
          <Card title="አካውንት" padding="md">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCircle size={14} />
                  <span>የተጠቃሚ መለያ</span>
                </div>
                <span className="text-xs font-mono text-gray-500">
                  {user?._id?.slice(-6) || user?.id?.slice(-6) || 'U-0001'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={14} />
                  <span>ሚና</span>
                </div>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  roleColor.bg,
                  roleColor.text
                )}>
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition"
            >
              <LogOut size={16} /> ውጣ
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============ Sub-components ============

function InfoField({ label, icon: Icon, value, onChange, editMode, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {editMode ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
          />
        ) : (
          <div className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 text-sm text-gray-800">
            {value || <span className="text-gray-400">—</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value, icon: Icon }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 text-sm text-gray-800">
        {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0" />}
        <span className="truncate">{value || '—'}</span>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={6}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

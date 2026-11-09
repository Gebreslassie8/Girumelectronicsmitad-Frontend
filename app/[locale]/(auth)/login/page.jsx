'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Phone, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { DEMO_ACCOUNTS } from '@/lib/mockAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const tv = useTranslations('auth.validation');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    phone: z.string().min(1, tv('phoneRequired')).regex(/^(\+251|0)9\d{8}$/, tv('phoneInvalid')),
    password: z.string().min(6, tv('passwordMin')),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.phone, data.password);
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setValue('phone', account.phone);
    setValue('password', account.password);
    toast.success(`${account.icon} ${account.label} ተመርጧል — ግባ ይጫኑ`, { duration: 2000 });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Demo Accounts */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-brand" />
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Demo Accounts
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => fillDemo(acc)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border-2 ${acc.color} hover:scale-105 transition text-center`}
            >
              <span className="text-xl">{acc.icon}</span>
              <span className="text-xs font-semibold">{acc.label}</span>
              <span className="text-[9px] opacity-70">{acc.phone}</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          ሚና ለመምረጥ ይጫኑ — ስልክ እና ፓስወርድ በራስ-ሰር ይሞላሉ
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder={t('phonePlaceholder')}
              {...register('phone')}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
            <Link href="/forgot-password" className="text-sm text-brand font-medium hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('passwordPlaceholder')}
              {...register('password')}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
          <span className="text-sm text-gray-600">{t('rememberMe')}</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              {t('submitting')}
            </>
          ) : (
            <>
              <LogIn size={18} /> {t('submit')}
            </>
          )}
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-brand font-semibold hover:underline">
            {t('register')}
          </Link>
        </p>
      </form>
    </div>
  );
}

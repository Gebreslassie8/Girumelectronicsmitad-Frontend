'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Phone, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

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

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.phone, data.password);
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
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

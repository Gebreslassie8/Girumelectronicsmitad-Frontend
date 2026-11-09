'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { KeyRound, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  const tv = useTranslations('auth.validation');
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const schema = z.object({
    code: z.string().length(6, tv('codeLength')),
    newPassword: z.string().min(6, tv('passwordMin')),
    confirmPassword: z.string(),
  }).refine((d) => d.newPassword === d.confirmPassword, {
    message: t('passwordMismatch'),
    path: ['confirmPassword'],
  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: POST /api/auth/reset-password
      console.log({ phone, ...data });
      await new Promise((r) => setTimeout(r, 1000));
      setDone(true);
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('success')}</h1>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 mt-6 w-full px-4 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition"
        >
          {t('backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('code')}</label>
          <div className="relative">
            <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('codePlaceholder')}
              maxLength={6}
              {...register('code')}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition tracking-widest text-center font-mono text-lg ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code.message}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('newPassword')}</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('newPasswordPlaceholder')}
              {...register('newPassword')}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
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
          {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('confirmPassword')}</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              {...register('confirmPassword')}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
        </div>

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
            t('submit')
          )}
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-brand"
        >
          <ArrowLeft size={14} /> {t('backToLogin')}
        </Link>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Phone, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const tv = useTranslations('auth.validation');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const schema = z.object({
    phone: z.string().min(1, tv('phoneRequired')).regex(/^(\+251|0)9\d{8}$/, tv('phoneInvalid')),
  });

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: ከ backend API ጋር ማገናኘት — POST /api/auth/forgot-password
      console.log('Send code to:', data.phone);
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('success')}</h1>
        <p className="text-gray-600 mb-6">
          {getValues('phone')}
        </p>
        <Link
          href={`/reset-password?phone=${encodeURIComponent(getValues('phone'))}`}
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition"
        >
          {useTranslations('auth.resetPassword')('title')} →
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 mt-3 text-sm text-gray-600 hover:text-brand"
        >
          <ArrowLeft size={14} /> {t('backToLogin')}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <Send size={18} /> {t('submit')}
            </>
          )}
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-brand"
        >
          <ArrowLeft size={14} /> {t('backToLogin')}
        </Link>

        <p className="text-center text-sm text-gray-600 pt-4 border-t">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-brand font-semibold hover:underline">
            {t('register')}
          </Link>
        </p>
      </form>
    </div>
  );
}

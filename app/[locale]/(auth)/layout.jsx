import Link from 'next/link';
import { Flame, Zap, ShieldCheck } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getTranslations } from 'next-intl/server';

export default async function AuthLayout({ children, params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="min-h-screen flex">
      {/* Left Side — Brand Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand to-brand-dark text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              ግ
            </div>
            <div>
              <p className="font-bold text-xl leading-tight">ግሩም ምጣድ</p>
              <p className="text-sm text-blue-200">Grum Stove</p>
            </div>
          </Link>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {t('heroTitle1')}<br />
            <span className="text-blue-200">{t('heroTitle2')}</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            {t('heroDesc')}
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Zap, key: 'electric' },
              { icon: Flame, key: 'firewood' },
              { icon: ShieldCheck, key: 'safe' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-blue-200" />
                  </div>
                  <div>
                    <p className="font-semibold">{t(`features.${item.key}.title`)}</p>
                    <p className="text-sm text-blue-200">{t(`features.${item.key}.desc`)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-sm text-blue-200 relative z-10">
          © {new Date().getFullYear()} ግሩም ምጣድ. All rights reserved.
        </p>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-20 -right-10 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with language switcher */}
        <div className="flex justify-end p-4 lg:p-6">
          <LanguageSwitcher />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white text-2xl font-bold">
                  ግ
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg text-gray-800 leading-tight">ግሩም ምጣድ</p>
                  <p className="text-xs text-gray-500">Grum Stove</p>
                </div>
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

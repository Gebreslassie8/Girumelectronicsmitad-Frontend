'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Zap, Flame, ShieldCheck, Truck, Award, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');

  const FEATURES = [
    { icon: Zap,         key: 'electric' },
    { icon: Flame,       key: 'firewood' },
    { icon: ShieldCheck, key: 'safe' },
    { icon: Truck,       key: 'delivery' },
  ];

  const PRODUCTS = [
    { key: 'electricStove', icon: Zap,   tagColor: 'bg-brand' },
    { key: 'firewoodStove', icon: Flame, tagColor: 'bg-green-600' },
    { key: 'halfStove',     icon: Award, tagColor: 'bg-purple-600' },
  ];

  const WHY_KEYS = ['local', 'warranty', 'freeDelivery', 'afterSales', 'affordable', 'expert'];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm mb-4">
                <Zap size={14} /> {t('heroBadge')}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {t('heroTitle1')}<br />
                <span className="text-blue-200">{t('heroTitle2')}</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">{t('heroDesc')}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-brand font-semibold hover:bg-gray-100 transition">
                  {t('orderNow')} <ArrowRight size={18} />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition">
                  {t('learnMore')}
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-80 h-80 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Flame size={160} className="text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '5,000+', label: t('stats.customers') },
              { value: '10+',    label: t('stats.years') },
              { value: '4',      label: t('stats.branches') },
              { value: '99%',    label: t('stats.satisfaction') },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-brand">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">{t('featuresTitle')}</h2>
          <p className="text-gray-600 mt-2">{t('featuresSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-brand transition">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-brand" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t(`features.${f.key}.title`)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(`features.${f.key}.desc`)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">{t('productsTitle')}</h2>
            <p className="text-gray-600 mt-2">{t('productsSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.key} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
                    <Icon size={80} className="text-brand" />
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full ${p.tagColor} text-white text-xs font-medium`}>
                      {t(`products.${p.key}.tag`)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-1">{t(`products.${p.key}.name`)}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t(`products.${p.key}.desc`)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-brand">{t(`products.${p.key}.price`)}</span>
                      <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                        {t('orderNow')} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('whyTitle')}</h2>
            <ul className="space-y-3">
              {WHY_KEYS.map((k, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t(`whyItems.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-8 text-white">
            <Clock size={48} className="mb-4 text-blue-200" />
            <h3 className="text-2xl font-bold mb-3">{t('ctaTitle')}</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">{t('ctaDesc')}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-brand font-semibold hover:bg-gray-100 transition">
              {t('ctaButton')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('finalTitle')}</h2>
          <p className="text-blue-100 text-lg mb-8">{t('finalDesc')}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-brand font-bold hover:bg-gray-100 transition">
            {t('finalButton')} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

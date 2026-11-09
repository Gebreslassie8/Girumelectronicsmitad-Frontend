'use client';

import { useTranslations } from 'next-intl';
import { Target, Eye, Heart, Users, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');

  const VALUES = [
    { icon: Heart,      key: 'quality' },
    { icon: Users,      key: 'customer' },
    { icon: Award,      key: 'honesty' },
    { icon: TrendingUp, key: 'innovation' },
  ];

  const STATS = [
    { value: '2014',   label: t('stats.founded') },
    { value: '5,000+', label: t('stats.customers') },
    { value: '4',      label: t('stats.branches') },
    { value: '30+',    label: t('stats.employees') },
  ];

  return (
    <div>
      {/* HEADER */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('storyTitle')}</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{t('storyP1')}</p>
              <p>{t('storyP2')}</p>
              <p>{t('storyP3')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-brand">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Target size={24} className="text-brand" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('mission')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('missionDesc')}</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Eye size={24} className="text-brand" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('vision')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('visionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">{t('valuesTitle')}</h2>
          <p className="text-gray-600 mt-2">{t('valuesSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.key} className="text-center p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-brand" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t(`values.${v.key}.title`)}</h3>
                <p className="text-sm text-gray-600">{t(`values.${v.key}.desc`)}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

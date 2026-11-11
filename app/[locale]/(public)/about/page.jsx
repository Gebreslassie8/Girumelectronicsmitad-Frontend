'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  Target, Eye, Heart, Users, Award, TrendingUp,
  Quote, Linkedin, Mail, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionImage = motion(Image);

// ✅ Founder photo carousel — cycles 1.jpg → 2.jpg → 3.jpg forever
const FOUNDER_PHOTOS = [
  { src: '/images/1.jpg', alt: 'Eshetu Teshager', label: 'Founder',  note: 'Since 2014' },
  { src: '/images/2.jpg', alt: 'Our workshop',    label: 'Workshop', note: 'Our roots'  },
  { src: '/images/3.jpg', alt: 'Our showroom',    label: 'Showroom', note: 'Our future' },
];

export default function AboutPage() {
  const t = useTranslations('about');

  // ✅ Infinite photo cycling
  const [photoIdx, setPhotoIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % FOUNDER_PHOTOS.length);
    }, 4000); // change every 4s
    return () => clearInterval(id);
  }, []);

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

  const fadeUp = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const stagger = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const active = FOUNDER_PHOTOS[photoIdx];

  return (
    <div>
      {/* HEADER */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="text-blue-100 text-lg max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-800 mb-4">
              {t('storyTitle')}
            </motion.h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <motion.p variants={fadeUp}>{t('storyP1')}</motion.p>
              <motion.p variants={fadeUp}>{t('storyP2')}</motion.p>
              <motion.p variants={fadeUp}>{t('storyP3')}</motion.p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-blue-50 rounded-xl p-6 text-center transition-shadow hover:shadow-md"
              >
                <p className="text-3xl font-bold text-brand">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-8 border border-gray-200 transition-shadow hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Target size={24} className="text-brand" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('mission')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('missionDesc')}</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-8 border border-gray-200 transition-shadow hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Eye size={24} className="text-brand" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('vision')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('visionDesc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ✅ FOUNDER SECTION */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-4">
              <Sparkles size={12} />
              {t('founderSubtitle')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {t('founderTitle')}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {/* ✅ Photo (infinite crossfade) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="md:col-span-2 relative aspect-square md:aspect-auto md:min-h-[500px] bg-gradient-to-br from-brand/20 to-brand/5 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.src}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <MotionImage
                      src={active.src}
                      alt={active.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient + label (updates with photo) */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={'label-' + active.src}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-4 left-4 text-white"
                  >
                    <p className="text-xs uppercase tracking-wider opacity-80">{active.label}</p>
                    <p className="text-sm font-semibold">{active.note}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  {FOUNDER_PHOTOS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      aria-label={'Show photo ' + (i + 1)}
                      className={
                        'w-2 h-2 rounded-full transition-all ' +
                        (i === photoIdx ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/80')
                      }
                    />
                  ))}
                </div>
              </motion.div>

              {/* Text */}
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Quote size={32} className="text-brand/30 mb-4" />

                  <blockquote className="text-lg md:text-xl italic text-gray-700 leading-relaxed mb-6">
                    “{t('founderQuote')}”
                  </blockquote>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t('founderName')}
                    </h3>
                    <p className="text-sm font-medium text-brand mt-1">
                      {t('founderRole')}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mt-5">
                    {t('founderBio')}
                  </p>

                  <div className="flex items-center gap-2 mt-6">
                    <motion.a
                      href="mailto:eshetu@example.com"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark transition"
                    >
                      <Mail size={14} />
                      አግኙኝ
                    </motion.a>
                    <motion.a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:border-brand hover:text-brand transition"
                    >
                      <Linkedin size={14} />
                      LinkedIn
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">{t('valuesTitle')}</h2>
          <p className="text-gray-600 mt-2">{t('valuesSubtitle')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.key}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className="text-center p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow"
              >
                <motion.div
                  whileHover={{ rotate: 6 }}
                  className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4"
                >
                  <Icon size={26} className="text-brand" />
                </motion.div>
                <h3 className="font-bold text-gray-800 mb-2">
                  {t(`values.${v.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600">{t(`values.${v.key}.desc`)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
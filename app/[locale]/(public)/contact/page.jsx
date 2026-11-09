'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: ከ backend API ጋር ማገናኘት
    console.log(form);
    setSent(true);
    setForm({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div>
      {/* HEADER */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Phone size={20} className="text-brand" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{t('phone')}</h3>
              <p className="text-gray-700 text-sm">0924 254 988</p>
              <p className="text-gray-700 text-sm">0903 284 493</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Mail size={20} className="text-brand" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{t('email')}</h3>
              <p className="text-gray-700 text-sm">info@grumstove.com</p>
              <p className="text-gray-700 text-sm">sales@grumstove.com</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <MapPin size={20} className="text-brand" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{t('address')}</h3>
              <p className="text-gray-700 text-sm">{t('addressValue')}</p>
              <p className="text-gray-700 text-sm">{t('addressDetail')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Clock size={20} className="text-brand" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{t('hours')}</h3>
              <p className="text-gray-700 text-sm">{t('hoursValue')}</p>
              <p className="text-gray-700 text-sm">{t('hoursDetail')}</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('formTitle')}</h2>
              <p className="text-gray-600 mb-6">{t('formDesc')}</p>

              {sent && (
                <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">{t('form.successTitle')}</p>
                    <p className="text-sm text-green-700">{t('form.successDesc')}</p>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('form.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={onChange}
                      placeholder={t('form.namePlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('form.phone')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={onChange}
                      placeholder={t('form.phonePlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder={t('form.emailPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('form.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={onChange}
                    placeholder={t('form.messagePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition"
                >
                  <Send size={18} /> {t('form.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MAP PLACEHOLDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin size={40} className="mx-auto mb-2" />
            <p className="font-medium">{t('addressValue')}</p>
            <p className="text-sm">Google Maps</p>
          </div>
        </div>
      </section>
    </div>
  );
}

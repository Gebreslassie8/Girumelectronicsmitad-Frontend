'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const links = [
    { href: '/',        label: t('nav.home') },
    { href: '/about',   label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">ግ</div>
              <div>
                <p className="font-bold text-gray-800 leading-tight">{t('footer.tagline').split(' ')[0] === 'ዘመናዊ' ? 'ግሩም ምጣድ' : 'Grum Stove'}</p>
                <p className="text-xs text-gray-500">Electric & Energy Saving</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-gray-700 hover:text-brand font-medium text-sm transition">
                  {l.label}
                </Link>
              ))}
              <LanguageSwitcher />
              <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark transition">
                {t('nav.login')}
              </Link>
            </nav>

            <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {open && (
            <div className="md:hidden py-4 border-t">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-gray-700 hover:text-brand font-medium">
                  {l.label}
                </Link>
              ))}
              <div className="my-2"><LanguageSwitcher /></div>
              <Link href="/login" onClick={() => setOpen(false)} className="block mt-2 px-4 py-2 rounded-lg bg-brand text-white text-center font-medium">
                {t('nav.login')}
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-3">ግሩም ምጣድ / Grum Stove</h3>
              <p className="text-sm leading-relaxed">{t('footer.tagline')}</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-3">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white">{t('nav.home')}</Link></li>
                <li><Link href="/about" className="hover:text-white">{t('nav.about')}</Link></li>
                <li><Link href="/contact" className="hover:text-white">{t('nav.contact')}</Link></li>
                <li><Link href="/login" className="hover:text-white">{t('nav.login')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-3">{t('footer.contactUs')}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone size={14} /> 0924 254 988</li>
                <li className="flex items-center gap-2"><Phone size={14} /> 0903 284 493</li>
                <li className="flex items-center gap-2"><Mail size={14} /> info@grumstove.com</li>
                <li className="flex items-center gap-2"><MapPin size={14} /> {t('contact.addressValue')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ግሩም ምጣድ. {t('footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale) => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1">
      <Globe size={16} className="text-gray-500 ml-1" />
      <button
        onClick={() => switchLocale('am')}
        disabled={isPending}
        className={`px-2 py-1 rounded text-xs font-medium transition ${
          locale === 'am'
            ? 'bg-brand text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        አማ
      </button>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-2 py-1 rounded text-xs font-medium transition ${
          locale === 'en'
            ? 'bg-brand text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
    </div>
  );
}

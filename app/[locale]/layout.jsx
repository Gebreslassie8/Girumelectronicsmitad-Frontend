import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import { routing } from '@/i18n/routing';
import QueryProvider from '@/components/providers/QueryProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

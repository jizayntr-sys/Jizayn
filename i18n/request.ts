import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from './pathnames';

export default getRequestConfig(async ({requestLocale}) => {
  // next-intl son sürümlerinde locale, requestLocale (Promise) içinden gelir
  const locale = await requestLocale;

  // Gelen 'locale' parametresinin geçerli olduğunu doğrula.
  // Eğer 'locales' dizimizde yoksa, 404 sayfasına yönlendir.
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
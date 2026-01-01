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
    messages: (await import(`../messages/${locale}.json`)).default,
    // Eksik çeviri anahtarları için hata verme, sadece uyarı ver
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        // Development'ta console'a yaz, production'da sessizce geç
        if (process.env.NODE_ENV === 'development') {
          console.warn(`⚠️ Missing translation key: ${error.originalMessage}`);
        }
        // Hata fırlatma, getMessageFallback devreye girecek
        return;
      }
      // Diğer hatalar için console'a yaz ama fırlatma (varsayılan davranış)
      if (process.env.NODE_ENV === 'development') {
        console.error('Intl error:', error);
      }
    },
    // Eksik çeviriler için fallback değer
    getMessageFallback({namespace, key, error}) {
      const path = [namespace, key].filter((part) => part != null).join('.');
      if (error.code === 'MISSING_MESSAGE') {
        // Eksik çeviri için anahtar adını döndür (geliştirme için)
        return process.env.NODE_ENV === 'development' ? `[${path}]` : key;
      }
      return `Error: ${path}`;
    },
  };
});
import { routing } from '@/i18n/routing';

export type Locale = (typeof routing.locales)[number];

export interface LocaleConfig {
  currency: string;
  amazonDomain: string;
  etsyLocale?: string;
}

export const localeConfigs: Record<string, LocaleConfig> = {
  tr: {
    currency: 'TRY',
    amazonDomain: 'amazon.com.tr',
    etsyLocale: 'tr',
  },
  en: {
    currency: 'USD',
    amazonDomain: 'amazon.com',
    etsyLocale: undefined, // Etsy.com default
  },
  fr: {
    currency: 'EUR',
    amazonDomain: 'amazon.fr',
    etsyLocale: 'fr',
  },
  de: {
    currency: 'EUR',
    amazonDomain: 'amazon.de',
    etsyLocale: 'de',
  },
  ru: {
    currency: 'RUB',
    amazonDomain: 'amazon.ru',
    etsyLocale: 'ru',
  },
  es: {
    currency: 'EUR',
    amazonDomain: 'amazon.es',
    etsyLocale: 'es',
  },
  ar: {
    currency: 'SAR', // Saudi Riyal (veya diğer Arap ülkeleri için uygun currency)
    amazonDomain: 'amazon.ae', // UAE Amazon
    etsyLocale: undefined,
  },
  it: {
    currency: 'EUR',
    amazonDomain: 'amazon.it',
    etsyLocale: 'it',
  },
  pt: {
    currency: 'EUR', // Portekiz için EUR, Brezilya için BRL
    amazonDomain: 'amazon.es', // Portekiz için İspanya Amazon kullanılabilir
    etsyLocale: 'pt',
  },
  nl: {
    currency: 'EUR',
    amazonDomain: 'amazon.nl',
    etsyLocale: 'nl',
  },
};

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale] || localeConfigs.en;
}

export function getAmazonUrl(locale: Locale, productPath: string): string {
  const config = getLocaleConfig(locale);
  return `https://${config.amazonDomain}${productPath.startsWith('/') ? productPath : `/${productPath}`}`;
}

export function getEtsyUrl(locale: Locale, productPath: string): string {
  const config = getLocaleConfig(locale);
  if (config.etsyLocale) {
    return `https://www.etsy.com/${config.etsyLocale}${productPath.startsWith('/') ? productPath : `/${productPath}`}`;
  }
  return `https://www.etsy.com${productPath.startsWith('/') ? productPath : `/${productPath}`}`;
}

export function formatPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Fiyatların veri içindeki temel para birimi.
 * data/products.ts içindeki priceRange değerleri bu para biriminde tutulur.
 */
export const PRICE_BASE_CURRENCY = 'TRY';

/**
 * 1 birim para biriminin yaklaşık TRY karşılığı.
 * NOT: Sabit (manuel) kur. TRY oynak olduğu için gerektiğinde güncelleyin.
 */
export const TRY_PER_UNIT: Record<string, number> = {
  TRY: 1,
  EUR: 38,
  USD: 35,
};

/**
 * Locale'e göre gösterilecek para birimi.
 * Türkçe -> TL (TRY), diğer tüm diller -> USD.
 */
export function getDisplayCurrency(locale: string): string {
  return locale === 'tr' ? 'TRY' : 'USD';
}

/** İki para birimi arasında sabit kur ile çevirir. */
export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const fromUnit = TRY_PER_UNIT[from] ?? 1;
  const toUnit = TRY_PER_UNIT[to] ?? 1;
  return (amount * fromUnit) / toUnit;
}

/**
 * Tutarı locale'e uygun para birimine çevirip biçimlendirir.
 * Ürün verisinde hedef para birimi zaten tanımlıysa doğrudan kullanır;
 * aksi halde sabit kur ile çevirir (geriye dönük uyumluluk).
 */
export function formatLocalizedPrice(amount: number, baseCurrency: string, locale: string): string {
  const target = getDisplayCurrency(locale);
  if (baseCurrency === target) {
    return formatPrice(amount, baseCurrency, locale);
  }
  let converted = convertCurrency(amount, baseCurrency, target);
  if (target !== 'TRY') {
    converted = Math.round(converted);
  }
  return formatPrice(converted, target, locale);
}

/**
 * Yapılandırılmış veri (JSON-LD / Open Graph) için locale'e uygun
 * sayısal fiyat + para birimi döndürür. Ekranda gösterilenle tutarlı olur.
 */
export function getLocalizedPriceParts(
  amount: number,
  baseCurrency: string,
  locale: string
): { price: number; currency: string } {
  const currency = getDisplayCurrency(locale);
  if (baseCurrency === currency) {
    return { price: amount, currency };
  }
  let price = convertCurrency(amount, baseCurrency, currency);
  if (currency !== 'TRY') price = Math.round(price);
  return { price, currency };
}

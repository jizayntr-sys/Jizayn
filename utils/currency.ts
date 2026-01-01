import { routing } from '@/i18n/routing';

export type Locale = (typeof routing.locales)[number];

export interface LocaleConfig {
  currency: string;
  amazonDomain: string;
  etsyLocale?: string;
}

export const localeConfigs: Record<Locale, LocaleConfig> = {
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

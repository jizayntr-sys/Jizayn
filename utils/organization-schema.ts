import { routing } from '@/i18n/routing';

export function generateOrganizationSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jizayn',
    url: 'https://www.jizayn.com',
    logo: 'https://www.jizayn.com/JizaynLogo.svg',
    sameAs: [
      'https://www.instagram.com/jizayn',
      'https://www.facebook.com/jizayn',
      'https://www.pinterest.com/jizayn'
    ],
    knowsLanguage: routing.locales,
    // NOT: Gerçek NAP (adres/telefon/e-posta) bilgisi netleşince aşağıdaki alanlar
    // eklenmeli. Sahte/placeholder adres & telefon güven sinyaline zarar verdiği için
    // doğrulanmamış bilgiyle doldurulmuyor.
    // address: { '@type': 'PostalAddress', streetAddress, addressLocality, addressRegion, postalCode, addressCountry: 'TR' },
    // contactPoint: { '@type': 'ContactPoint', telephone, contactType: 'customer service', email, availableLanguage: routing.locales },
  };
}
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
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Atölye Adresi', // Gerçek adresinizle güncelleyin
      addressLocality: 'Istanbul',
      addressRegion: 'Istanbul',
      postalCode: '34000',
      addressCountry: 'TR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-555-123-45-67',
      contactType: 'customer service',
      email: 'info@jizayn.com',
      availableLanguage: routing.locales
    }
  };
}
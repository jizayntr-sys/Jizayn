import {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'tr'] as const;

export const pathnames = {
  '/': '/',
  '/about': {
    en: '/about-us',
    tr: '/hakkimizda'
  },
  '/contact': {
    en: '/contact',
    tr: '/iletisim'
  },
  '/products': {
    en: '/products',
    tr: '/urunler'
  },
  '/products/[slug]': {
    en: '/products/[slug]',
    tr: '/urunler/[slug]'
  },
  // Yasal sayfalar
  '/privacy': {
    en: '/privacy-policy',
    tr: '/gizlilik-politikasi'
  },
  '/terms': {
    en: '/terms-of-use',
    tr: '/kullanim-kosullari'
  },
  '/cookies': {
    en: '/cookie-policy',
    tr: '/cerez-politikasi'
  },
  '/kvkk': {
    en: '/data-protection',
    tr: '/kvkk-aydinlatma-metni'
  }
} satisfies Pathnames<typeof locales>;
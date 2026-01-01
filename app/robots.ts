import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/*/admin/', // Dil önekli admin yolları için (örn: /en/admin)
        '/private/',
        '/login/',
        '/*/login/', // Dil önekli login yolları için
        '/account/',
        '/*/account/',
        '/cart/',
        '/*/cart/',
        '/checkout/',
        '/*/checkout/',
        // Arama sonuçlarını engelle (Crawl budget optimizasyonu)
        '/*?search=',
        '/*&search=',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
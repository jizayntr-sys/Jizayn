import { MetadataRoute } from 'next';
import { getAllProducts } from '@/data/products';
import { routing } from '@/i18n/routing';
import { pathnames } from '@/i18n/pathnames';
import { BASE_URL } from '@/lib/constants';

// Force dynamic rendering - don't try to prerender at build time
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ürün sayfaları için sitemap girişleri
  const products = await getAllProducts();
  const productEntries = products.flatMap((product) => {
    return routing.locales.map((locale) => {
      const productData = product.locales[locale as keyof typeof product.locales];
      
      // Eğer bu dilde ürün verisi veya slug yoksa sitemap'e ekleme
      if (!productData?.slug) return null;

      const productsPath = pathnames['/products'][locale as keyof typeof pathnames['/products']];
      const url = `${BASE_URL}/${locale}${productsPath}/${productData.slug}`;

      // Google için alternate (hreflang) linkleri - Çapraz dil referansları
      const languages = routing.locales.reduce((acc, l) => {
        const lData = product.locales[l as keyof typeof product.locales];
        if (lData?.slug) {
          const lProductsPath = pathnames['/products'][l as keyof typeof pathnames['/products']];
          acc[l] = `${BASE_URL}/${l}${lProductsPath}/${lData.slug}`;
        }
        return acc;
      }, {} as Record<string, string>);

      // x-default sadece EN sayfasında eklenmeli (TR sayfasında eklenmemeli)
      // Bu, Google'ın "multiple entries" uyarısını önler
      if (locale === 'en') {
        const defaultProductData = product.locales['en'];
        if (defaultProductData?.slug) {
          const defaultProductsPath = pathnames['/products'].en;
          languages['x-default'] = `${BASE_URL}/en${defaultProductsPath}/${defaultProductData.slug}`;
        }
      }

      return {
        url,
        lastModified: new Date(), // Ürün verisinden gelen tarihi kullan, yoksa şimdiki zamanı kullan
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages,
        },
      };
    });
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  // Statik sayfaları pathnames.ts'den dinamik olarak oluştur
  const staticRoutesConfig = {
    '/': { priority: 1.0, changeFrequency: 'daily' as const },
    '/about': { priority: 0.5, changeFrequency: 'monthly' as const },
    '/contact': { priority: 0.5, changeFrequency: 'monthly' as const },
    '/products': { priority: 0.7, changeFrequency: 'weekly' as const },
    '/privacy': { priority: 0.3, changeFrequency: 'yearly' as const },
    '/terms': { priority: 0.3, changeFrequency: 'yearly' as const },
    '/cookies': { priority: 0.3, changeFrequency: 'yearly' as const },
    '/kvkk': { priority: 0.3, changeFrequency: 'yearly' as const },
  };

  // Her dil için ayrı entry oluştur
  const staticEntries = Object.entries(pathnames)
    .filter(([path]) => !path.includes('[')) // Dinamik rotaları hariç tut
    .flatMap(([canonicalPath, pathConfig]) => {
      const routeConfig = staticRoutesConfig[canonicalPath as keyof typeof staticRoutesConfig] || {
        priority: 0.5,
        changeFrequency: 'monthly' as const,
      };

      // Tüm diller için alternate linkleri oluştur
      const languages = routing.locales.reduce((acc, l) => {
        const localizedPath = typeof pathConfig === 'string' ? pathConfig : (pathConfig as any)[l];
        acc[l] = `${BASE_URL}/${l}${localizedPath}`;
        return acc;
      }, {} as Record<string, string>);

      // x-default sadece EN sayfasında eklenmeli (TR sayfasında eklenmemeli)
      // Bu, Google'ın "multiple entries" uyarısını önler
      // languages objesi tüm diller için oluşturuldu, x-default'u sadece EN entry'sine ekleyeceğiz

      // Her dil için ayrı entry oluştur
      return routing.locales.map((locale) => {
        const localizedPath = typeof pathConfig === 'string' ? pathConfig : (pathConfig as any)[locale];
        
        // x-default sadece EN entry'sine ekle
        const entryLanguages = { ...languages };
        if (locale === 'en') {
          const defaultPath = typeof pathConfig === 'string' ? pathConfig : pathConfig.en;
          entryLanguages['x-default'] = `${BASE_URL}/en${defaultPath}`;
        }
        
        return {
          url: `${BASE_URL}/${locale}${localizedPath}`,
          lastModified: new Date(),
          changeFrequency: routeConfig.changeFrequency,
          priority: routeConfig.priority,
          alternates: {
            languages: entryLanguages,
          },
        };
      });
    });

  return [...staticEntries, ...productEntries];
}
import { MetadataRoute } from 'next';
import { getAllProducts } from '@/data/products';
import { routing } from '@/i18n/routing';
import { pathnames } from '@/i18n/pathnames';
import { BASE_URL } from '@/lib/constants';

// Force dynamic rendering - don't try to prerender at build time
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

function buildLocalizedUrl(locale: string, localizedPath: string): string {
  if (localizedPath === '/') {
    return `${BASE_URL}/${locale}`;
  }

  return `${BASE_URL}/${locale}${localizedPath}`;
}

function toValidDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getProductLastModified(product: { updatedAt?: string; createdAt?: string }): Date | undefined {
  return toValidDate(product.updatedAt) ?? toValidDate(product.createdAt);
}

function getStaticEntries(): MetadataRoute.Sitemap {
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

  return Object.entries(pathnames)
    .filter(([path]) => !path.includes('['))
    .flatMap(([canonicalPath, pathConfig]) => {
      const routeConfig = staticRoutesConfig[canonicalPath as keyof typeof staticRoutesConfig] || {
        priority: 0.5,
        changeFrequency: 'monthly' as const,
      };

      const languages = routing.locales.reduce((acc, l) => {
        const localizedPath = typeof pathConfig === 'string' ? pathConfig : (pathConfig as any)[l];
        acc[l] = buildLocalizedUrl(l, localizedPath);
        return acc;
      }, {} as Record<string, string>);

      return routing.locales.map((locale) => {
        const localizedPath = typeof pathConfig === 'string' ? pathConfig : (pathConfig as any)[locale];

        return {
          url: buildLocalizedUrl(locale, localizedPath),
          changeFrequency: routeConfig.changeFrequency,
          priority: routeConfig.priority,
          alternates: {
            languages: {
              'x-default': languages['en'] || `${BASE_URL}/en`,
              ...languages,
            },
          },
        };
      });
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = getStaticEntries();

  try {
    // Ürün sayfaları için sitemap girişleri
    const products = await getAllProducts();
  const productEntries = products.flatMap((product) => {
    return routing.locales.map((locale) => {
      const productData = product.locales[locale as keyof typeof product.locales];
      const productLastModified = getProductLastModified(product);
      
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

      return {
        url,
        ...(productLastModified ? { lastModified: productLastModified } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            'x-default': languages['en'] || url,
            ...languages,
          },
        },
      };
    });
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    return [...staticEntries, ...productEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    return staticEntries;
  }
}

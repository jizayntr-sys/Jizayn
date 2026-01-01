import { routing } from '@/i18n/routing';
import { pathnames, locales } from '@/i18n/pathnames';

const defaultLocale = 'en'; // x-default için varsayılan dil

/**
 * Get localized pathname from routing pathnames
 */
export function getLocalizedPathname(basePath: string, locale: string): string {
  if (!pathnames || !pathnames[basePath as keyof typeof pathnames]) {
    return basePath;
  }
  
  const pathnameMap = pathnames[basePath as keyof typeof pathnames];
  if (typeof pathnameMap === 'string') {
    return pathnameMap;
  }
  
  if (typeof pathnameMap === 'object' && pathnameMap && locale in pathnameMap) {
    return pathnameMap[locale as keyof typeof pathnameMap] as string;
  }
  
  return basePath;
}

/**
 * Generate hreflang alternates with x-default
 * 
 * @param basePath - Base path for the page (e.g., '/products', '/about')
 * @param locale - Current locale
 * @param getLocalizedPath - Optional function to get localized path for each locale (e.g., for product slugs)
 * @returns Record of locale -> URL mappings including x-default
 */
export function generateHreflangAlternates(
  basePath: string,
  locale: string,
  getLocalizedPath?: (loc: string) => string | null
): Record<string, string> {
  const alternates: Record<string, string> = {};
  const baseUrl = 'https://www.jizayn.com';

  // Tüm diller için alternates oluştur
  for (const loc of routing.locales) {
    // Önce custom getLocalizedPath fonksiyonunu dene (ürün slug'ları için)
    const localizedPath = getLocalizedPath ? getLocalizedPath(loc) : null;
    
    // Eğer custom path yoksa, routing pathnames'den al
    const path = localizedPath !== null 
      ? localizedPath 
      : getLocalizedPathname(basePath, loc);
    
    if (path) {
      alternates[loc] = `${baseUrl}/${loc}${path}`;
    }
  }

  // x-default ekle (varsayılan dil için - genellikle EN)
  const defaultLocalizedPath = getLocalizedPath
    ? getLocalizedPath(defaultLocale)
    : null;
  const defaultPath = defaultLocalizedPath !== null 
    ? defaultLocalizedPath 
    : getLocalizedPathname(basePath, defaultLocale);
  
  if (defaultPath) {
    alternates['x-default'] = `${baseUrl}/${defaultLocale}${defaultPath}`;
  }

  return alternates;
}


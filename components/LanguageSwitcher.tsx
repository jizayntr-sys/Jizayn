'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pathnames } from '@/i18n/pathnames';
import { useLocale } from 'next-intl';
import { ChangeEvent, useTransition } from 'react';
// Note: products import removed - LanguageSwitcher uses pathname-based slug detection

const languageNames: Record<string, string> = {
  tr: 'TR',
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  ru: 'RU',
  es: 'ES',
  ar: 'AR',
  it: 'IT',
  pt: 'PT',
  nl: 'NL',
};

interface LanguageSwitcherProps {
  id?: string;
}

export default function LanguageSwitcher({ id = 'language-switcher' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    startTransition(() => {
      // Ürün detay sayfası kontrolü
      // usePathname() next-intl'den canonical pathname döndürür: /products/[slug] formatında
      // Ama gerçek URL'de locale'e göre farklı olabilir (/tr/urunler/slug veya /en/products/slug)
      // Bu yüzden hem canonical pathname'i hem de gerçek URL'i kontrol ediyoruz
      const isProductDetailPage = 
        (pathname.startsWith('/products/') && pathname !== '/products') ||
        (typeof window !== 'undefined' && (
          window.location.pathname.includes('/products/') || 
          window.location.pathname.includes('/urunler/')
        ));
      
      if (isProductDetailPage) {
        // Slug'ı bul: önce gerçek URL'den, yoksa canonical pathname'den
        let currentSlug: string | undefined;
        
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          // URL formatı: /[locale]/products/[slug] veya /[locale]/urunler/[slug]
          const productsIndex = pathParts.findIndex(p => p === 'products' || p === 'urunler');
          if (productsIndex !== -1 && pathParts[productsIndex + 1]) {
            currentSlug = pathParts[productsIndex + 1];
          }
        }
        
        // Eğer gerçek URL'den bulamadıysak, canonical pathname'den al
        if (!currentSlug) {
          currentSlug = pathname.split('/').pop();
        }
        
        if (currentSlug) {
          // Slug-based language switching removed - using pathname-based approach
          // For products, we'll redirect to the products page in the new locale
          // The user can navigate to the specific product from there
          const productsPath = pathnames['/products'][newLocale as keyof typeof pathnames['/products']];
          const newUrl = `/${newLocale}${productsPath}`;
          setTimeout(() => {
            window.location.href = newUrl;
          }, 0);
          return;
        }
      }
      
      // Diğer sayfalar için normal yönlendirme
      router.replace(pathname as any, { locale: newLocale });
    });
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Dil Seçimi
      </label>
      <select
        id={id}
        value={currentLocale}
        onChange={handleLanguageChange}
        disabled={isPending}
        className={`bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-700 cursor-pointer appearance-none pr-8 ${isPending ? 'opacity-50' : ''}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: `right 0.5rem center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `1.5em 1.5em`
        }}
        aria-label="Dil seçimi"
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {languageNames[locale] || locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

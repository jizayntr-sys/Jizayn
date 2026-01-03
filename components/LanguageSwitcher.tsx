'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pathnames } from '@/i18n/pathnames';
import { useLocale } from 'next-intl';
import { ChangeEvent, useTransition } from 'react';

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

  const handleLanguageChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Ürün detay sayfası kontrolü
    const isProductDetailPage = 
      (pathname.startsWith('/products/') && pathname !== '/products') ||
      (typeof window !== 'undefined' && (
        window.location.pathname.includes('/products/') || 
        window.location.pathname.includes('/urunler/')
      ));
    
    if (isProductDetailPage && typeof window !== 'undefined') {
      // Mevcut slug'ı bul
      const pathParts = window.location.pathname.split('/');
      const productsIndex = pathParts.findIndex(p => p === 'products' || p === 'urunler');
      
      if (productsIndex !== -1 && pathParts[productsIndex + 1]) {
        const currentSlug = pathParts[productsIndex + 1];
        
        try {
          // API'den ürünün tüm dillerdeki slug'larını al
          const response = await fetch(`/api/products/slug/${currentLocale}/${currentSlug}`);
          if (response.ok) {
            const data = await response.json();
            const newSlug = data.slugs?.[newLocale];
            
            if (newSlug) {
              // Yeni locale için ürün detay sayfasına yönlendir
              const productsPath = pathnames['/products'][newLocale as keyof typeof pathnames['/products']];
              window.location.href = `/${newLocale}${productsPath}/${newSlug}`;
              return;
            }
          }
        } catch (error) {
          console.error('Failed to load product slugs:', error);
        }
        
        // Slug bulunamadıysa veya hata olursa, ürünler sayfasına yönlendir
        const productsPath = pathnames['/products'][newLocale as keyof typeof pathnames['/products']];
        window.location.href = `/${newLocale}${productsPath}`;
        return;
      }
    }
    
    // Diğer sayfalar için normal yönlendirme
    startTransition(() => {
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

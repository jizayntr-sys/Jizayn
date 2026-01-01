'use client';

import { usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { pathnames } from '@/i18n/pathnames';

export default function JsonLdBreadcrumb() {
  const pathname = usePathname();
  const locale = useLocale();
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer.nav');
  
  const baseUrl = 'https://www.jizayn.com';
  
  // Başlangıç: Ana Sayfa
  const breadcrumbs = [
    {
      name: tNav('home'),
      item: `${baseUrl}/${locale}`
    }
  ];

  // Rota eşleştirmeleri ve çeviri anahtarları
  // Not: usePathname() next-intl ile dahili yolu (örn: /about) döndürür
  if (pathname === '/products') {
    const path = pathnames['/products'][locale as any];
    breadcrumbs.push({ name: tNav('products'), item: `${baseUrl}/${locale}${path}` });
  } 
  else if (pathname.startsWith('/products/')) {
    // Ürün Detay Sayfası
    // Önce Ürünler listesini ekle
    const productsPath = pathnames['/products'][locale as any];
    breadcrumbs.push({ name: tNav('products'), item: `${baseUrl}/${locale}${productsPath}` });
    
    // Sonra Ürünü ekle
    const slug = pathname.split('/').pop();
    // Slug'ı URL formatına uygun hale getir
    const productPath = pathnames['/products/[slug]'][locale as any].replace('[slug]', slug || '');
    
    // Ürün adını slug'dan türet (Tam ad veritabanından gelmediği için client tarafında en iyi tahmin)
    // Gerçek senaryoda bu veri page.tsx'ten de gelebilir ama bu yöntem de geçerlidir.
    const name = slug ? slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'Product';
    
    breadcrumbs.push({ name, item: `${baseUrl}/${locale}${productPath}` });
  } 
  else if (pathname === '/about') {
    const path = pathnames['/about'][locale as any];
    breadcrumbs.push({ name: tNav('about'), item: `${baseUrl}/${locale}${path}` });
  } 
  else if (pathname === '/contact') {
    const path = pathnames['/contact'][locale as any];
    breadcrumbs.push({ name: tNav('contact'), item: `${baseUrl}/${locale}${path}` });
  }
  // Yasal Sayfalar
  else if (pathname === '/privacy') {
    const path = pathnames['/privacy'][locale as any];
    breadcrumbs.push({ name: tFooter('privacy'), item: `${baseUrl}/${locale}${path}` });
  }
  else if (pathname === '/terms') {
    const path = pathnames['/terms'][locale as any];
    breadcrumbs.push({ name: tFooter('terms'), item: `${baseUrl}/${locale}${path}` });
  }
  else if (pathname === '/cookies') {
    const path = pathnames['/cookies'][locale as any];
    breadcrumbs.push({ name: tFooter('cookies'), item: `${baseUrl}/${locale}${path}` });
  }
  else if (pathname === '/kvkk') {
    const path = pathnames['/kvkk'][locale as any];
    breadcrumbs.push({ name: tFooter('kvkk'), item: `${baseUrl}/${locale}${path}` });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
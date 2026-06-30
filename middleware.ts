import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Ülkeye göre otomatik dil seçimi:
  // Kullanıcı daha önce bir dil seçmediyse (NEXT_LOCALE cookie yoksa),
  // Türkiye'den gelenler Türkçe, diğer tüm ülkeler İngilizce alır.
  // Cookie varsa (manuel seçim dahil) o tercih korunur.
  if (!request.cookies.has('NEXT_LOCALE')) {
    const country =
      request.geo?.country ||
      request.headers.get('x-vercel-ip-country') ||
      '';
    const detectedLocale = country === 'TR' ? 'tr' : 'en';
    // next-intl dil tespitinde bu cookie'yi okur; coğrafi seçimi ona iletiyoruz.
    request.cookies.set('NEXT_LOCALE', detectedLocale);
  }

  const response = intlMiddleware(request);
  
  // HTTP Link header'larını kaldır (duplicate hreflang önleme)
  // HTML'de zaten <link rel="alternate" hreflang> var
  if (response.headers.has('Link')) {
    response.headers.delete('Link');
  }
  
  return response;
}

export const config = {
  // Tüm sayfaları yakala (api, _next, statik dosyalar hariç)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

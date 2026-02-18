import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
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

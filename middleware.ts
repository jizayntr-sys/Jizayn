import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin rotası kontrolü (locale prefix OLMADAN /admin/... şeklinde)
  if (pathname.startsWith('/admin')) {
    const hasSession = request.cookies.has('admin_session');
    
    if (!hasSession && !pathname.startsWith('/admin/login')) {
      // Kullanıcı giriş yapmamışsa, admin login sayfasına yönlendir
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // Admin sayfaları için next-intl middleware'ini çalıştırma (locale prefix gerekmez)
    return NextResponse.next();
  }

  // Admin olmayan sayfalar için next-intl middleware'ini çalıştır (locale prefix ekler)
  return intlMiddleware(request);
}

export const config = {
  // Tüm sayfaları yakala (api, _next, statik dosyalar hariç)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin Rotası Koruması ---
  // URL'de 'admin' kelimesi geçiyorsa bu bir admin rotasıdır.
  const isAdminPath = pathname.split('/').includes('admin');

  if (isAdminPath) {
    const hasSession = request.cookies.has('admin_session');
    
    if (!hasSession) {
      // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
      // Yönlendirme URL'i için doğru dil kodunu bul.
      const locale = routing.locales.find(l => pathname.startsWith(`/${l}/`)) || routing.defaultLocale;
      
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  // Diğer tüm istekler için next-intl middleware'ini çalıştır.
  // Bu, dil tespiti ve yerelleştirilmiş URL yönlendirmelerini yönetir.
  return intlMiddleware(request);
}

export const config = {
  // Tüm sayfaları yakala (api, _next, statik dosyalar hariç)
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};
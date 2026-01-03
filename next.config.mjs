import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Optimize production bundles
  productionBrowserSourceMaps: false,
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize chunks
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    // SVG için CSP kaldırıldı - genel CSP header'ı kullanılacak
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.jizayn.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async headers() {
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ];

    // CSP Ayarları: Development'ta esnek (eval izinli), Production'da sıkı
    // Not: Next.js'in bazı özellikleri (Hot Module Replacement, Fast Refresh) ve Google Analytics için 'unsafe-eval' gerekebilir
    // Development'ta 'unsafe-eval' zorunlu
    // Production'da Google Analytics ve Next.js'in bazı özellikleri için 'unsafe-eval' gerekli
    // Bu bilinçli bir güvenlik kararıdır - Analytics script'i olduğu gibi kalacak
    const cspHeader = process.env.NODE_ENV === 'development'
      ? "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
      : [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googletagmanager.com/gtag/js blob:",
          "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googletagmanager.com/gtag/js blob:",
          "style-src 'self' 'unsafe-inline' https:",
          "font-src 'self' data: https:",
          "img-src 'self' data: https: blob: http:",
          "connect-src 'self' https: ws: wss: http://localhost:* http://127.0.0.1:* blob:",
          "worker-src 'self' blob:",
          "child-src 'self' blob:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'"
        ].join('; ');

    securityHeaders.push({
      key: 'Content-Security-Policy',
      value: cspHeader,
    });

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Next.js static assets (JS, CSS) - 1 yıl cache
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Resimler - 1 ay cache
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      // Public klasöründeki statik dosyalar - 1 ay cache
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      // Logo - 1 ay cache
      {
        source: '/JizaynLogo.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      // Favicon ve manifest - 1 hafta cache
      {
        source: '/:path*.(ico|png|webmanifest)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, immutable',
          },
        ],
      },
      // Font dosyaları - 1 yıl cache (değişmezler)
      {
        source: '/:path*.(woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // HTML sayfalar - 5 dakika cache, CDN'de 1 saat stale-while-revalidate
      {
        source: '/:locale/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
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
    const cspHeader = process.env.NODE_ENV === 'development'
      ? "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
      : [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: blob:",
          "script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' https: blob:",
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
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/JizaynLogo.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*.(woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

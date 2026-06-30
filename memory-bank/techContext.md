# Tech Context — Jizayn

## Yığın
- **Next.js 14** (App Router), React 18, TypeScript.
- **next-intl** ile i18n (locale: `app/[locale]/...`).
- TailwindCSS, framer-motion, lucide-react, react-hot-toast, react-quill (editör).
- sharp (görsel), @next/bundle-analyzer.

## i18n
- Locales: `['en', 'tr']`, defaultLocale: `en` (`i18n/routing.ts`).
- Lokalize URL'ler `i18n/pathnames.ts`'te (örn. `/products` → TR `/urunler`, `/about` → TR `/hakkimizda`).
- Ürün detay: `/products/[slug]` (TR `/urunler/[slug]`).

## Önemli sabitler / yapı
- `lib/constants.ts` → `BASE_URL` (env `NEXT_PUBLIC_BASE_URL` yoksa `https://www.jizayn.com`).
- Ürün verisi: `data/products.ts` (statik dizi, `getAllProducts` / `getProductBySlug` / `getProductById`). Şu an tek ürün: `kumiko-lamp`.
- Ürün tipi: `types/product.ts` (`ProductLocaleData` içinde `metaTitle/metaDescription/metaKeywords`, `shopierUrl/etsyUrl/amazonUrl` + `*Offer` alanları).
- Görseller: `public/images/products/...` ve `public/uploads/products/...`.

## Çalıştırma (yerel)
- Komut: `npm run dev` (Windows / PowerShell).
- Port 3000 doluysa Next.js otomatik **3001**'e geçer → genelde http://localhost:3001
- Yerelde localhost canonical istenirse `.env.local` içine `NEXT_PUBLIC_BASE_URL=http://localhost:3001` eklenip sunucu yeniden başlatılmalı.
- Build: `npm run build`, analiz: `npm run analyze`.

## Git / GitHub (Windows)
- Repo: `jizayntr-sys/Jizayn`, branch `main`, remote `git@github-jizayn:jizayntr-sys/Jizayn.git`
- **Push zorunluluğu:** Cursor'dan push etmeden önce `$env:GIT_SSH_COMMAND = 'C:/Windows/System32/OpenSSH/ssh.exe'` (Git for Windows SSH Jizayn anahtarını bulamaz).
- Detaylı prosedür: **`memory-bank/git-workflow.md`**

## SEO/teknik altyapı dosyaları
- `app/layout.tsx` (root metadata), `app/[locale]/layout.tsx` (locale metadata + Organization JSON-LD + GA).
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` (→ `/manifest.webmanifest`).
- `app/product-feed.xml/route.ts` (Google Shopping feed, EN verisiyle).
- `app/[locale]/products/[slug]/opengraph-image.tsx`, `.../loading.tsx`.
- `utils/organization-schema.ts` (Organization JSON-LD).
- Güvenlik header'ları + CSP + cache başlıkları: `next.config.mjs`.
- GA ID: `G-FM8C3948TW` (`components/GoogleAnalytics.tsx`).
- Google site verification: `app/[locale]/layout.tsx` içinde.

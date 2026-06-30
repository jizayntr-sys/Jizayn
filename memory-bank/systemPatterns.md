# System Patterns — Jizayn

## Metadata deseni
- Her sayfa `generateMetadata` ile locale-aware metadata üretir.
- Canonical her zaman `${BASE_URL}/${locale}/...`; hreflang `alternates.languages` ile (tr, en, `x-default` → her zaman **EN**).
- Başlık şablonu: locale layout'ta `template: '%s | Jizayn'`. Şablonun tekrar "Jizayn" eklememesi için veriden gelen tam başlıklarda `title: { absolute: ... }` kullanılır.

## Ürün metadata (KRİTİK desen)
- Ürün başlık/açıklama/keyword **ürün verisinden** beslenir:
  - `title` → `productData.metaTitle` (yoksa `Ürün Adı | Jizayn`), `absolute` ile.
  - `description` → `productData.metaDescription` (yoksa düz `description`), 158 karakter.
  - `keywords` → `productData.metaKeywords` + genel terimler (el yapımı/doğal ahşap/türkiye üretim).
- ⚠️ Eskiden tüm ürünlere sabit "Kumiko masa lambası" metni gömülüydü; bu kaldırıldı. **Yeni ürün eklerken** ürünün kendi meta alanlarını doldurmak şart.

## Structured data (JSON-LD)
- Ana sayfa: `WebSite` + `SearchAction`.
- Locale layout: `Organization` (her sayfada).
- Ürün detay: `Product` + `BreadcrumbList` + `FAQPage` + `HowTo` (tek script, `.filter(Boolean)`).
- `aggregateRating`/`review` yalnızca yorum varsa eklenir (sahte rating riskinden kaçınmak için).
- `offers.url` → varsa `shopierUrl`, yoksa ürün sayfası URL'i.
- Marka logosu **mutlak URL** olmalı (`https://www.jizayn.com/JizaynLogo.svg`).

## Satın alma butonları
- `AddToCartButton` (`url`, `platform`) — `target="_blank"`.
- Ürün detayda butonlar **yalnızca linki olanlar** gösterilir: `shopierUrl` → Shopier, `etsyUrl` → Etsy, `amazonUrl` → Amazon. Ölü `#` buton yok.
- Stok yoksa butonlar yerine `StockNotificationForm`.

## Dil tespiti (ülkeye göre)
- `middleware.ts`: kullanıcının `NEXT_LOCALE` cookie'si yoksa ülkeye göre dil seçilir → `TR` ise `tr`, diğer her ülke `en`.
- Ülke kaynağı: `request.geo?.country` veya `x-vercel-ip-country` header (Vercel sağlar). **Vercel dışı hosting'de coğrafi veri gelmez → herkes `en` alır.**
- Cookie varsa (manuel dil değişimi dahil) tercih korunur; geo tekrar uygulanmaz.
- Yönlendirme yalnızca kök `/` adresinde (next-intl `localePrefix: 'always'`); `/tr/...` ve `/en/...` doğrudan erişilebilir kalır (SEO için crawler her iki versiyona ulaşır).

## robots / indexleme
- `robots.ts` disallow: `/api/`, `/admin/`, `/editor/`, `/login/`, `/account/`, `/cart/`, `/checkout/` + dil önekli varyantları (`/*/editor/` vb.) ve `?search=`.
- Admin benzeri sayfalara (editör) ayrıca sayfa metadata'sında `robots: { index:false, follow:false }`.

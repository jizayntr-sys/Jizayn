# Progress — Jizayn

## Çalışan
- Çok dilli (TR/EN) site, lokalize URL'ler, hreflang/canonical.
- Sitemap, robots, manifest, Google Shopping feed.
- Ürün detay: Product/Breadcrumb/FAQ/HowTo JSON-LD.
- Shopier/Etsy/Amazon butonları (linki olan gösterilir), yeni sekmede.
- Ürün meta'sı veriden besleniyor (metaTitle/metaDescription/metaKeywords).
- GA + güvenlik header'ları + CSP + cache.

## ⏸️ Ertelendi — Avrupa & Amerika SEO (atölye yeri belli olunca)
Detaylı plan: **`memory-bank/seo-roadmap.md`**. Özet: Organization NAP düzelt → GSC/Bing/Merchant
kayıt → DE/FR dil ekle → blog/içerik → backlink/Pinterest → pazaryeri (Etsy/Amazon) SEO.

## Yapılacak / iyileştirme
- [ ] `shopierUrl` gerçek linklerle doldur (şu an placeholder).
- [ ] Ürün `video` alanına gerçek YouTube/Vimeo linki ekle (bölüm otomatik görünür).
- [ ] `organization-schema.ts` placeholder adres/telefon/e-posta güncelle.
- [ ] `/about` sayfasını gerçek görseller/metin/videolarla güçlendir (şu an emoji placeholder).
- [ ] `public/images/products/Woody/` görselleri var ama veri yok — Woody ürünü `data/products.ts`'e eklenmeli (artık `intro/contentSections/packageContents/importantNotes` ile temiz eklenir).
- [ ] (Opsiyonel) Ana sayfa/Hakkımızda'ya "Atölye / Yapım Videoları" bölümü.
- [ ] (Opsiyonel) İçerik/SEO için blog.
- [ ] (Opsiyonel) `keywords` meta etiketlerini kaldır.

## Tamamlanan (Oturum 2)
- [x] Structured data vitrin modeline uyarlandı (uydurma kargo/iade kaldırıldı).
- [x] Ölü `aggregateRating` veriden silindi.
- [x] Video altyapısı (ProductVideo + VideoObject JSON-LD) kuruldu.
- [x] Ürün detay gövdesi veriye taşındı (Kumiko sabiti kalktı).

## Bilinen riskler
- Statik ürün verisi: yeni ürün eklerken tüm locale + meta alanları elle doldurulmalı.
- Yeni ürün eklenirken ürün detay gövdesi yanlışlıkla "Kumiko masa lambası" diliyle görünebilir (gövde içeriği henüz dinamik değil).

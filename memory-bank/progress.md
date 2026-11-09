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
- [ ] `shopierUrl` gerçek linklerle doldur (şu an placeholder; 3 üründe de jenerik `shopier.com/jizayn`).
- [ ] Ürün `video` alanına gerçek YouTube/Vimeo linki ekle (bölüm otomatik görünür).
- [ ] `organization-schema.ts`: placeholder adres/telefon/e-posta **kaldırıldı** (2026-11-09). Gerçek NAP netleşince yorumlu bloktan geri eklenecek.
- [ ] Ürünlerde `reviews` boş → yıldız zengin sonucu yok. Gerçek yorum topla.
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

## GSC bulguları (2026-11-09, denetim)
- Dizine eklenmeyen 15 sayfa: Soft 404 (3→1), Yönlendirmeli sayfa (3, normal), Tarandı-eklenmedi
  (9, çoğu yasal sayfa; normal), Kopya (0).
- **Soft 404 düzeltildi**: `app/[locale]/products/page.tsx` — boş/geçersiz filtre sonuçları
  (`?category=Akcesuar` gibi) artık `noindex` + self-canonical. Geçerli `/products` indekslenebilir.
  Not: filtre menüsü `lighting` sunuyor ama ürün yok → o da artık noindex ile güvende.
- Kullanıcı GSC'de yapmalı: Soft 404 satırında "Doğrulamayı Başlat" + yeni ürün için URL denetleme → "Dizine eklenmesini iste".
- **Tarandı-eklenmedi (12)**: çoğu yasal+about sayfası (normal). İçinde Kumiko lambasının 2 ESKİ slug'ı
  vardı (`el-yapimi-kumiko-ahsap-masa-lambasi`, `handmade-kumiko-wooden-table-lamp`) → `next.config.mjs`
  `redirects()` ile yeni slug'a 308 kalıcı yönlendirme eklendi (doğrulandı). Bir font .woff2 zaten 404.
- Bilinen davranış: ürün route'unda `loading.tsx` (streaming) olduğu için var olmayan slug 404 yerine
  200 (noindex'li not-found) döner — pratik zarar yok çünkü noindex. İstenirse ileride generateStaticParams
  + dynamicParams=false ile gerçek 404'e çevrilebilir (i18n/stream yapısı test edilerek).

## Bilinen riskler
- Statik ürün verisi: yeni ürün eklerken tüm locale + meta alanları elle doldurulmalı.
- Yeni ürün eklenirken ürün detay gövdesi yanlışlıkla "Kumiko masa lambası" diliyle görünebilir (gövde içeriği henüz dinamik değil).

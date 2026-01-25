-- Kumiko Masa Lambası Alt Text Optimizasyonu
-- SEO-friendly, açıklayıcı ve benzersiz alt text güncellemeleri

-- Not: Bu SQL'i çalıştırmadan önce ürün ID'lerini kontrol etmeniz önerilir

-- TÜRKÇE VERSIYONU
-- Kumiko ürünü için resim alt text'lerini güncelle

UPDATE "ProductImage" 
SET alt = 'El Yapımı Kumiko Ahşap Masa Lambası - Geleneksel Japon Kumiko Tekniği ile İşlenmiş Geometrik Desenli Dekoratif Aydınlatma'
WHERE url LIKE '%ElyapimiKumikomasalambasi.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug = 'el-yapimi-kumiko-ahsap-masa-lambasi' AND locale = 'tr'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Masa Lambası - Geleneksel Geometrik Ahşap İşçiliği Detay Görünümü, Doğal Ahşap Dokusu'
WHERE url LIKE '%Gelenekselgeometrikahsap.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug = 'el-yapimi-kumiko-ahsap-masa-lambasi' AND locale = 'tr'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Tekniği Ahşap Masa Lambası - Yatak Odası ve Oturma Odası için Modern Tasarım Gece Lambası'
WHERE url LIKE '%Kumiko.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug = 'el-yapimi-kumiko-ahsap-masa-lambasi' AND locale = 'tr'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Abajur Masa Lambası - El Yapımı Ahşap Geometrik Desen, Çalışma Masası Aydınlatması'
WHERE url LIKE '%Kumikoabajur.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug = 'el-yapimi-kumiko-ahsap-masa-lambasi' AND locale = 'tr'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Gece Lambası - Sıcak Işıklı Ahşap Masa Lambası, Yatak Odası Dekoratif Aydınlatma Ürünü'
WHERE url LIKE '%Kumikogecelambasi.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug = 'el-yapimi-kumiko-ahsap-masa-lambasi' AND locale = 'tr'
  );

-- İNGİLİZCE VERSIYONU
-- Kumiko product English alt text updates

UPDATE "ProductImage" 
SET alt = 'Handmade Kumiko Wooden Table Lamp - Traditional Japanese Kumiko Technique with Geometric Pattern Decorative Lighting'
WHERE url LIKE '%ElyapimiKumikomasalambasi.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug LIKE '%kumiko%' AND locale = 'en'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Table Lamp - Traditional Geometric Wooden Craftsmanship Detail View, Natural Wood Texture'
WHERE url LIKE '%Gelenekselgeometrikahsap.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug LIKE '%kumiko%' AND locale = 'en'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Technique Wooden Table Lamp - Modern Design Night Lamp for Bedroom and Living Room'
WHERE url LIKE '%Kumiko.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug LIKE '%kumiko%' AND locale = 'en'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Table Lamp Shade - Handmade Wooden Geometric Pattern, Desk Lighting'
WHERE url LIKE '%Kumikoabajur.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug LIKE '%kumiko%' AND locale = 'en'
  );

UPDATE "ProductImage" 
SET alt = 'Kumiko Night Lamp - Warm Light Wooden Table Lamp, Bedroom Decorative Lighting Product'
WHERE url LIKE '%Kumikogecelambasi.webp%'
  AND "productLocaleId" IN (
    SELECT id FROM "ProductLocale" 
    WHERE slug LIKE '%kumiko%' AND locale = 'en'
  );

-- Kontrol sorgusu: Güncellemeleri doğrula
SELECT 
  pl.locale,
  pl.name,
  pi.url,
  pi.alt
FROM "ProductImage" pi
JOIN "ProductLocale" pl ON pi."productLocaleId" = pl.id
WHERE pl.slug LIKE '%kumiko%'
ORDER BY pl.locale, pi."order";

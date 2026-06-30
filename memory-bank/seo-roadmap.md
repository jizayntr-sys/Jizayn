# SEO Yol Haritası — Avrupa & Amerika Görünürlüğü

> **DURUM: ERTELENDİ.** Kullanıcı kararı (2026-06-23): "Şimdilik her şey hazır olsun,
> **atölyemin yeri belli olduğunda** yapacağım." Yani aşağıdaki adımlar planlandı ama
> **gerçek atölye adresi/NAP bilgisi netleşene kadar uygulanmayacak.** Adres belli olunca
> bu dosyadaki sırayla devam et.

## Strateji özeti
Sitede **doğrudan satış yok**; satış Etsy/Amazon/Shopier'de oluyor. Sitenin görevi:
aramalarda çıkıp markayı tanıtmak + pazaryerine trafik göndermek. İki cephe:
1. **Site SEO'su** (Google/Bing)
2. **Pazaryeri SEO'su** (Etsy/Amazon kendi içinde arama motoru — ABD/AB satışının çoğu oradan)

## Mevcut güçlü temel (zaten var)
- Çok dilli (TR/EN), lokalize URL, hreflang/canonical, x-default.
- Sitemap, robots, manifest, Google Shopping feed (`/product-feed.xml`).
- Product/Breadcrumb/FAQ/HowTo/VideoObject + Organization/WebSite JSON-LD.
- GA + GSC doğrulama kodu (`app/layout.tsx`/`[locale]/layout.tsx` içinde `verification.google`).
- Hızlı Next.js altyapısı, image optimizasyonu, EN locale'de fiyat artık EUR.

## Öncelik sıralı plan

### A) Atölye yeri belli olunca İLK yapılacak
- **Organization NAP düzelt** (`utils/organization-schema.ts`): şu an placeholder —
  `streetAddress: 'Atölye Adresi'`, `telephone: '+905551234567'`, `email: 'info@jizayn.com'`.
  Gerçek ad/adres/telefon/e-posta ile değiştir (güven sinyali + local SEO).
- **Google Business Profile** (atölye/işletme kaydı) — adres olunca açılabilir.

### B) Arama motoru kayıtları (kullanıcı yapacak — site-dışı)
- **Google Search Console**: property ekle, `/sitemap.xml` gönder, International targeting + performans izle.
- **Bing Webmaster Tools**: sitemap gönder (ABD'de Bing/DuckDuckGo).
- **Google Merchant Center**: `/product-feed.xml` bağla (ücretsiz listeler + Shopping).

### C) Dil kapsamını genişlet — AB için #1 kaldıraç
- Şu an sadece `en` + `tr` (`i18n/pathnames.ts`).
- Almanya/Fransa/İspanya/İtalya kendi dilinde arar. Altyapı (`utils/currency.ts`) zaten
  `de, fr, es, it, nl` için para birimi/Amazon alan adı tanımlı — **routing + çeviri eksik**.
- Öneri: önce **Almanca + Fransızca** ekle. Teknik kurulum + şablon/meta çevirisini ajan yapabilir;
  ürün gövde metinlerinin çevirisini kullanıcı/çevirmen netleştirir.

### D) İçerik derinliği (uluslararası sıralamanın yakıtı)
- **Blog/rehber** (İngilizce): "What is Kumiko?", "Asanoha pattern meaning",
  "How handmade wooden lamps are made" — alıcı + bilgi amaçlı uzun kuyruk.
- **Yapım videoları**: YouTube'a yükle, sayfaya göm (altyapı hazır → `productData.video` doldur).
- **About sayfasını** gerçek görsel/metin/video ile güçlendir (şu an emoji placeholder).

### E) Site-dışı / backlink (Google'ın en güçlü sinyali — kullanıcı yapacak)
- **Pinterest**: ABD/AB'de el yapımı dekorasyonda dev trafik; görseller zaten Pinterest açıklamalı.
- Etsy/Amazon profili ↔ site karşılıklı bağlantı.
- Tasarım/el sanatları blogları, "handmade gift guide" listeleri, basın.

### F) Pazaryeri SEO'su (kullanıcı yapacak)
- Etsy/Amazon başlık, etiket (tags), açıklama, görsel optimizasyonu — satışın asıl olduğu yer.

## Ajanın kod tarafında yapabilecekleri (adres belli olunca)
- DE/FR (+ istenirse ES/IT) dil altyapısı + şablon/meta çevirileri + hreflang güncellemesi.
- Organization şemasındaki NAP'ı gerçek bilgiyle düzeltmek.
- Blog bölümü iskeleti + SEO meta/şema.
- (Opsiyonel) `keywords` meta temizliği.

## Kullanıcının yapması gerekenler (site-dışı, ajan yapamaz)
- GSC + Bing + Merchant Center kayıt/sitemap gönderimi.
- Gerçek NAP bilgileri.
- Google Business Profile.
- Etsy/Amazon listing optimizasyonu, Pinterest, backlink/erişim.

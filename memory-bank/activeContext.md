# Active Context — Jizayn

Son güncelleme: 2026-06-23

## GitHub push notu (Cursor)
Push başarısız olursa sebep: Git for Windows SSH ≠ Windows OpenSSH. Çözüm:
`$env:GIT_SSH_COMMAND = 'C:/Windows/System32/OpenSSH/ssh.exe'` sonra `git push origin main`.
Tam prosedür: **`memory-bank/git-workflow.md`**

## ⏸️ ERTELENEN: Avrupa & Amerika SEO planı
Kullanıcı kararı (2026-06-23): Uluslararası SEO adımları planlandı ama **atölyenin yeri
belli olunca** uygulanacak (gerçek NAP/adres gerektiriyor). Tam yol haritası:
**`memory-bank/seo-roadmap.md`**. Sıra: (A) Organization NAP düzelt → (B) GSC/Bing/Merchant
kayıt → (C) DE/FR dil ekle → (D) blog/içerik → (E) backlink/Pinterest → (F) pazaryeri SEO.

## Bu oturumda yapılanlar
1. **Teknik + SEO denetimi** yapıldı (genel altyapı güçlü).
2. **Shopier entegrasyonu**:
   - `types/product.ts`'e `shopierUrl` + `shopierOffer` eklendi.
   - `data/products.ts` (kumiko tr+en) `shopierUrl` eklendi — şu an **placeholder** `https://www.shopier.com/jizayn` (TODO: gerçek link).
   - Ürün detayda butonlar gerçek linklere bağlandı, yalnızca linki olan gösteriliyor; `offers.url` Shopier'e yönlendirildi.
3. **SEO düzeltmeleri**:
   - Manifest 404: `app/[locale]/layout.tsx` `/site.webmanifest` → `/manifest.webmanifest`.
   - Editör indekslemeden çıkarıldı: `robots.ts`'e `/editor/` + `/*/editor/`, sayfaya `robots:{index:false}`.
   - Kırık marka logosu: `data/products.ts` brand `logo:'/logo.png'` → `https://www.jizayn.com/JizaynLogo.svg`, `url` www'lu yapıldı.
   - Ürünler sayfası karışık dil bug'ı: `/en/products` açıklaması/keyword'leri locale-aware yapıldı.
   - Ürün detay meta'sı sabit "Kumiko" metninden arındırıldı → `metaTitle/metaDescription/metaKeywords`'ten besleniyor.

## Oturum 2 — Vitrin modeli iyileştirmeleri (3 adım)
Hedef netleşti: **satış yok**, ürün vitrini + dış pazaryeri linkleri (Shopier öncelik) + Jizayn hikayesi + yapım videoları.
1. **Structured data vitrin modeline uyarlandı**: ürün `offers`'tan uydurma `shippingDetails` ve `hasMerchantReturnPolicy` kaldırıldı (siz göndermiyor/iade almıyorsunuz). Veriden ölü `aggregateRating` (4.8/12) silindi. JSON-LD'de sahte rating yoktu (yalnızca gerçek `reviews` varsa çıkıyor).
2. **Video altyapısı kuruldu**: `components/ProductVideo.tsx` poster+title alacak şekilde iyileştirildi; ürün detaya FAQ öncesi "Yapım/Tanıtım Videosu" bölümü + `VideoObject` JSON-LD eklendi (yalnızca `productData.video` doluysa). Veride `video` hâlâ undefined → YouTube/Vimeo linki eklenince otomatik görünür.
3. **Ürün gövdesi veriye taşındı**: `types/product.ts`'e `intro`, `contentSections[]`, `packageContents[]`, `importantNotes[]` eklendi. Kumiko içeriği `data/products.ts`'e (tr+en) taşındı. Ürün sayfası bu alanlardan render ediyor; alan yoksa bölüm gizlenir. Sabit "Kumiko" gövde metni kalktı. (Doğrulandı: /tr/urunler/... 200.)

## Açık konular / kullanıcı kararı bekleyen
- `data/products.ts` içindeki `shopierUrl` **gerçek linkle** doldurulmalı.
- `utils/organization-schema.ts` **placeholder** veriler içeriyor: adres `'Atölye Adresi'`, telefon `+905551234567`, e-posta `info@jizayn.com` → gerçek bilgilerle güncellenmeli.
- Ürün şemasında `shippingDetails` para birimi sabit `TRY` (çok para birimi planlanırsa düzeltilmeli).
- Ürün detay sayfası **gövde içeriği** hâlâ Kumiko'ya özel sabit (renkli bloklar, giriş paragrafı). Birden fazla ürün tipi için veriye/çeviriye taşınmalı.
- Meta `keywords` etiketi tüm sayfalarda var ama Google/Bing kullanmıyor (zararsız; istenirse kaldırılır).

## Çalıştırma notu
- Dev sunucu `npm run dev`; port 3000 dolu → genelde **http://localhost:3001**.

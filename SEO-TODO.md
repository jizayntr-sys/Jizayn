# SEO İyileştirmeleri ve Yapılması Gerekenler

## ✅ Tamamlanan İyileştirmeler

### 1. Hreflang Düzeltmeleri
- ✅ Duplicate hreflang'ler kaldırıldı (HTTP Link header'ları)
- ✅ x-default hreflang tüm sayfalara eklendi
- ✅ Her dilde doğru alternate language tag'leri

### 2. Meta Description Optimizasyonu
- ✅ About sayfası: 155 karakterin altına düşürüldü
- ✅ Contact sayfası: 155 karakterin altına düşürüldü
- ✅ Google'da kesinti riski azaltıldı

### 3. Server-Side Düzeltmeler
- ✅ Prisma connection pooling optimize edildi
- ✅ Dashboard production hatası düzeltildi
- ✅ Error handling iyileştirildi

---

## ⚠️ YAPILMASI GEREKEN - Yüksek Öncelik

### 1. Resim Optimizasyonu (10 resim >100KB)

**Manuel İş - Resim Sıkıştırma:**
```bash
# Kullanılacak araçlar:
- TinyPNG (https://tinypng.com/) - PNG/JPEG sıkıştırma
- Squoosh (https://squoosh.app/) - WebP dönüşümü
- ImageOptim (Mac) veya RIOT (Windows)
```

**Hedef:**
- Tüm ürün resimleri < 100KB olmalı
- WebP formatı kullanılmalı (fallback ile JPEG)
- Progressive JPEG kullanılmalı

**Dizinler:**
- `/public/images/products/`
- `/public/uploads/products/`

### 2. Resim Size Attributes (17 resim)

Next.js Image component'i `fill` prop kullandığında otomatik hesaplıyor.
Ancak bazı statik resimler için width/height eksik olabilir.

**Kontrol edilecek:**
- Header Logo
- Footer Logo  
- Statik SVG'ler

### 3. Kırık External Link (1 adet - 404)

**Bulmak için:**
```bash
# Screaming Frog'da:
# Bulk Export > Response Codes > External > Client Error (4xx) inlinks
```

Link bulunduğunda:
- Düzeltin veya kaldırın
- 404'ları takip edin

---

## 📋 YAPILMASI GEREKEN - Orta Öncelik

### 4. Content Improvement (10 sayfa <200 kelime)

E-ticaret siteleri için düşük kelime sayısı normaldir, ancak SEO için:

**Öneriler:**
- Ürün açıklamalarını genişletin (malzeme detayları, kullanım alanları)
- FAQ bölümü ekleyin
- Kullanım talimatları ekleyin
- Bakım önerileri ekleyin

### 5. H1/H2 Sıralaması (9-10 sayfa)

**Sorun:** Bazı sayfalarda H2'den önce H3 veya diğer headingkler var.

**Çözüm:**
Semantic HTML yapısını kontrol edin:
```html
<h1>Ana Başlık</h1>
<h2>Alt Başlık</h2>
  <h3>Alt Alt Başlık</h3>
<h2>Başka Alt Başlık</h2>
```

---

## ℹ️ OPSIYONEL - Düşük Öncelik

### 6. Title & Description Uzunluğu

**Fırsat:** Bazı sayfalar çok kısa title/description kullanıyor.

Daha fazla keyword ve USP eklenebilir ama zorunlu değil.

### 7. Content Readability

**Not:** Flesch reading score Türkçe için doğru çalışmıyor.
İngilizce sayfalar için gözden geçirilebilir.

### 8. Multiple H2's

HTML standardına uygun, sorun yok. Mantıklı hiyerarşi varsa OK.

---

## 🔧 Teknik Notlar

### Security Headers
✅ Zaten yapılandırılmış (`next.config.mjs`):
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin

### Uppercase URL
1 URL uppercase karakter içeriyor - hangi URL olduğu belirlenmeli.
Kritik değil ama düzeltilebilir.

---

## 🎯 Öncelik Sırası

1. **Resimleri optimize et** (sayfa hızı için kritik)
2. **Kırık linki bul ve düzelt** (kullanıcı deneyimi)
3. **H1/H2 sıralamasını düzelt** (accessibility)
4. **İçerik geliştir** (SEO için iyi)
5. **Detay iyileştirmeleri** (opsiyonel)

---

## 📊 Sonuç

- **Kritik:** 2 madde (resim opt., kırık link)
- **Önemli:** 2 madde (H1/H2, içerik)
- **Opsiyonel:** 3 madde

Tamamlandığında Screaming Frog'da yeniden tarayın ve iyileşmeyi ölçün!

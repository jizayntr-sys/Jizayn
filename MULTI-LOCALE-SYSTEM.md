# Çok Dilli (Multi-Locale) Sistem Mimarisi

## Problem
10 dilli bir e-ticaret sitesi için **her ürün eklenişinde 10 dil oluşturmak:**
- ❌ **Çok pahalı** - Google Translate API: 9 çeviri x her ürün = yüksek maliyet
- ❌ **Çok yavaş** - 9 dil x 2-3 saniye çeviri = ~25 saniye bekleme
- ❌ **Gereksiz veri** - Kullanılmayan diller için DB şişmesi

## Çözüm: Lazy Locale Creation + Fallback

### 1. Otomatik Locale'ler (Eager Creation)
**Sadece TR ve EN** her ürün eklendiğinde otomatik oluşturulur:
```typescript
// app/[locale]/admin/actions.ts - createProduct()
- TR locale: Her zaman (ana dil)
- EN locale: Her zaman (uluslararası erişim)
```

**Neden sadece 2 dil?**
- TR: Ana pazarınız
- EN: Global erişim ve diğer diller için kaynak

### 2. Lazy Loading (Talep Üzerine Oluşturma)
Diğer diller **sadece ihtiyaç duyulduğunda** oluşturulur:

#### A) Tek Ürün için Locale Oluşturma
```bash
GET /api/locale/create?productId=xxx&locale=de
```

**Kullanım Senaryoları:**
- Bir ürünün Almanca sayfası talep edildiğinde
- Admin manuel olarak bir ürün için locale eklemek isterse

#### B) Toplu Locale Oluşturma (Bulk Creation)
```bash
POST /api/locale/create
Body: { "locale": "de" }
```

**Kullanım Senaryoları:**
- Yeni bir dil desteği ekleniyor (örn: Almanca)
- Tüm ürünler için bir dili toplu oluşturmak
- Admin Utilities sayfasından kullanılır

### 3. Fallback Mekanizması
Bir ürünün istenen dilde locale'i yoksa otomatik fallback:

```
Ziyaretçi: DE sayfası istiyor
  ↓
DE locale var mı? 
  ↓ Hayır
EN locale var mı?
  ↓ Hayır  
TR locale var mı?
  ↓ Evet → TR içeriği göster
```

**Kod:**
```typescript
// data/products.ts - getProductBySlug()
1. İstenen locale'de ara (örn: DE)
2. Bulunamadı → EN'de ara
3. Bulunamadı → TR'de ara
4. Hala yok → 404
```

## Sistem Akışı

### Yeni Ürün Ekleme
```
Admin ürün ekler
  ↓
TR locale oluştur ✅
  ↓
EN locale oluştur ✅ (Google Translate ile)
  ↓
TR resimlerini EN'e kopyala ✅
  ↓
DİĞER DİLLER: ❌ Oluşturulmaz (Lazy)
```

### Kullanıcı Farklı Dilde Ürün İster
```
Kullanıcı: /de/products/beispiel-produkt
  ↓
DE locale var mı?
  ↓ Hayır
Fallback → EN içeriği göster
  ↓
(Opsiyonel) Background'da DE locale oluştur
```

### Admin Toplu Locale Oluşturur
```
Admin → Utilities → Almanca için locale oluştur
  ↓
Tüm ürünler döngüye alınır
  ↓
Her ürün için:
  - DE locale var mı kontrol et
  - Yoksa EN/TR'den çevir
  - DE locale + resimler oluştur
  ↓
Rapor: 50 ürün, 45 oluşturuldu, 5 zaten vardı
```

## Dosya Yapısı

### 1. Core Functions
**`app/[locale]/admin/actions.ts`**
- `createProduct()` - Sadece TR ve EN oluşturur
- Google Translate çevirileri

**`data/products.ts`**
- `getProductBySlug()` - Fallback mantığı ile ürün getir

### 2. API Endpoints
**`app/api/locale/create/route.ts`**
- `GET` - Tek ürün için locale oluştur
- `POST` - Tüm ürünler için toplu locale oluştur

### 3. Admin Panel
**`app/[locale]/admin/utilities/page.tsx`**
- Toplu locale oluşturma arayüzü
- Dil seçimi dropdown'u
- İlerleme raporu

## Desteklenen Diller

### Otomatik (Eager)
- ✅ **TR** - Türkçe (Her zaman)
- ✅ **EN** - İngilizce (Her zaman)

### Lazy Loading
- 🇩🇪 **DE** - Almanca
- 🇫🇷 **FR** - Fransızca
- 🇪🇸 **ES** - İspanyolca
- 🇮🇹 **IT** - İtalyanca
- 🇷🇺 **RU** - Rusça
- 🇸🇦 **AR** - Arapça
- 🇯🇵 **JA** - Japonca
- 🇨🇳 **ZH** - Çince

## Maliyet Analizi

### Eski Sistem (10 Dil Eager)
```
Yeni ürün = 9 çeviri (TR hariç)
100 ürün = 900 Google Translate çağrısı
Ortalama 1000 karakter/ürün
= 900,000 karakter
= ~$18 (Google Translate fiyatı)
```

### Yeni Sistem (2 Dil Eager + Lazy)
```
Yeni ürün = 1 çeviri (sadece EN)
100 ürün = 100 Google Translate çağrısı
Ortalama 1000 karakter/ürün
= 100,000 karakter
= ~$2

Diğer diller sadece talep edildiğinde
Örnek: 30 ürün için DE gerekli
= 30 ürün x 1000 karakter = $0.60
```

**Toplam Tasarruf:** %90 maliyet düşüşü

## Kullanım Kılavuzu

### 1. Yeni Ürün Eklemek
Admin Panel → Ürünler → Yeni Ürün
- TR içeriği doldur (zorunlu)
- EN içeriği doldur (önerilen, boş bırakılabilir)
- Kaydet → Otomatik TR + EN oluşturulur

### 2. Yeni Dil Desteği Eklemek
Admin Panel → Utilities → Toplu Locale Oluştur
- Dil seç (örn: Almanca)
- "Locale Oluştur" tıkla
- Bekle (tüm ürünler için ~2-5 dakika)
- Rapor: 45 oluşturuldu, 5 zaten vardı

### 3. Tek Ürün için Locale Eklemek
API çağrısı veya kod:
```bash
curl "http://localhost:3000/api/locale/create?productId=xxx&locale=de"
```

## SEO & Performans

### Avantajlar
✅ **Hızlı ürün ekleme** - 2 saniye yerine 25 saniye
✅ **Düşük API maliyeti** - %90 tasarruf
✅ **Temiz DB** - Sadece kullanılan diller
✅ **SEO** - Ana diller (TR/EN) her zaman hazır
✅ **Fallback** - Eksik dil olsa bile içerik gösterilir

### Dikkat Edilmesi Gerekenler
⚠️ İlk kez bir dilde ürün açılırsa fallback EN/TR gösterir
⚠️ Toplu locale oluşturma uzun sürebilir (100 ürün ~5 dakika)
⚠️ Google Translate API key gerekli (.env.local)

## Gelecek İyileştirmeler

### 1. Otomatik Lazy Creation
Kullanıcı bir ürünü farklı dilde açtığında background'da o locale oluşturulsun:
```typescript
// Middleware veya API Route'da
if (!localeExists) {
  // Background job başlat
  queueLocaleCreation(productId, locale);
  // Şimdilik fallback göster
  return fallbackContent;
}
```

### 2. Cache Stratejisi
Sık erişilen locale'leri cache'le:
```typescript
// Redis veya Next.js cache
cache.set(`product:${id}:${locale}`, data, 3600);
```

### 3. Admin Dashboard Stats
```
Dil Kullanım İstatistikleri:
- TR: 1000 ürün (%100)
- EN: 1000 ürün (%100)
- DE: 450 ürün (%45)
- FR: 120 ürün (%12)
```

### 4. Bulk Translation Queue
Büyük miktarda çeviri için queue sistemi:
```typescript
// Bull Queue veya Vercel Edge Functions
queue.add('translate', { productId, locale });
```

## Sonuç

**Eski Yaklaşım:**
- Her ürün = 10 dil = Pahalı + Yavaş

**Yeni Yaklaşım:**
- Her ürün = 2 dil (TR + EN) = Hızlı + Ucuz
- Diğer diller = Talep üzerine = Verimli

**Sonuç:** Ölçeklenebilir, maliyet-etkin, performanslı çok dilli sistem ✅

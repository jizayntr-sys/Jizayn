# 🗄️ Veritabanı Kurulum Rehberi

Bu rehber, Prisma + Supabase entegrasyonunu kurmanız için adım adım talimatlar içerir.

## 📋 Önkoşullar

- Supabase hesabı (ücretsiz): https://supabase.com
- Node.js ve npm yüklü

## 🔧 Kurulum Adımları

### 1. Supabase Connection String'i Alın

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard/project/busxquitkxwisenwfmkn
2. Sol menüden **Settings** > **Database** seçeneğine gidin
3. **Connection string** bölümüne gidin
4. **Connection pooling** sekmesini seçin (Transaction mode)
5. Connection string'i kopyalayın (format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1`)

**ÖNEMLİ:** Connection string'deki `[YOUR-PASSWORD]` kısmını kendi şifrenizle değiştirin: `0hUKnFhdqxcePvNn`

**Örnek Connection String:**
```
postgresql://postgres:0hUKnFhdqxcePvNn@db.busxquitkxwisenwfmkn.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### 2. Environment Variables Oluşturun

Proje root klasöründe `.env.local` dosyası oluşturun:

```bash
# .env.local dosyası oluştur
touch .env.local
```

Dosya içeriği:

```env
# Database - Supabase Connection String
# Connection pooling (Transaction mode) - ÖNERİLEN
DATABASE_URL="postgresql://postgres:0hUKnFhdqxcePvNn@db.busxquitkxwisenwfmkn.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Alternatif: Direct connection (development için)
# DATABASE_URL="postgresql://postgres:0hUKnFhdqxcePvNn@db.busxquitkxwisenwfmkn.supabase.co:5432/postgres"

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google Analytics (opsiyonel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**⚠️ GÜVENLİK UYARISI:** `.env.local` dosyası `.gitignore`'da olduğu için Git'e commit edilmez. Asla şifrelerinizi Git'e commit etmeyin!

### 3. Prisma Client'ı Generate Edin

```bash
npm run db:generate
```

Bu komut, Prisma schema dosyasına göre TypeScript client'ını oluşturur.

### 4. Database Migration (İlk Kurulum)

Veritabanı tablolarını oluşturmak için:

```bash
npm run db:push
```

Bu komut:
- Prisma schema'yı veritabanına uygular
- Gerekli tabloları oluşturur
- İlişkileri kurar

**Alternatif (Migration dosyaları ile):**
```bash
npm run db:migrate
```

### 5. Veritabanını Görselleştirme (Opsiyonel)

Prisma Studio ile veritabanınızı görselleştirebilirsiniz:

```bash
npm run db:studio
```

Tarayıcıda `http://localhost:5555` adresine gidin.

### 6. Mevcut Ürünleri Veritabanına Aktarma

Mevcut 8 ürünü veritabanına aktarmak için seed script'i çalıştırın:

```bash
npm run db:seed
```

**Not:** Seed script'i oluşturduktan sonra bu komut çalışacak.

## 📚 Prisma Komutları

| Komut | Açıklama |
|-------|----------|
| `npm run db:generate` | Prisma Client'ı generate eder |
| `npm run db:push` | Schema değişikliklerini veritabanına uygular (hızlı) |
| `npm run db:migrate` | Migration dosyası oluşturur ve uygular (production için) |
| `npm run db:migrate:prod` | Production migration'ları uygular |
| `npm run db:studio` | Prisma Studio'yu açar (veritabanı görselleştirme) |
| `npm run db:seed` | Seed script'i çalıştırır (test verisi) |

## 🔍 Supabase Dashboard Bilgileri

- **Project ID:** `busxquitkxwisenwfmkn`
- **Dashboard URL:** https://supabase.com/dashboard/project/busxquitkxwisenwfmkn
- **Password:** `0hUKnFhdqxcePvNn` (güvenlik için değiştirmeyi unutmayın!)

## 📊 Veritabanı Yapısı

### Tablolar:
- `Brand` - Marka bilgileri
- `Product` - Ana ürün tablosu
- `ProductLocale` - Her dil için ürün verisi
- `ProductImage` - Ürün görselleri
- `ProductReview` - Ürün yorumları
- `ProductFaq` - Ürün FAQ'leri
- `ProductOffer` - Amazon/Etsy offer'ları
- `ProductRating` - Ürün rating bilgileri

## 🐛 Sorun Giderme

### Connection Error
- Connection string'in doğru olduğundan emin olun
- Supabase dashboard'da database'in aktif olduğunu kontrol edin
- Password'ün doğru olduğundan emin olun

### Migration Error
- `npm run db:generate` komutunu önce çalıştırın
- `.env.local` dosyasının doğru olduğundan emin olun
- Supabase free tier limitlerini kontrol edin (500 MB)

### Prisma Client Error
- `npm run db:generate` komutunu çalıştırın
- `node_modules` klasörünü silip `npm install` yapın

## ✅ Kontrol Listesi

- [ ] Supabase projesi oluşturuldu
- [ ] Connection string alındı
- [ ] `.env.local` dosyası oluşturuldu ve dolduruldu
- [ ] `npm run db:generate` çalıştırıldı
- [ ] `npm run db:push` çalıştırıldı (tablolar oluşturuldu)
- [ ] `npm run db:studio` ile tablolar kontrol edildi
- [ ] Seed script çalıştırıldı (opsiyonel)

## 📞 Yardım

Sorun yaşarsanız:
1. Prisma dokümantasyonu: https://www.prisma.io/docs
2. Supabase dokümantasyonu: https://supabase.com/docs
3. Project README.md dosyasını kontrol edin


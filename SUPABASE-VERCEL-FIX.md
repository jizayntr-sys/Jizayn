# Supabase Connection Strings - Vercel için Doğru Ayar

## ⚠️ Sorun: Vercel "Can't reach database server" hatası

Vercel serverless functions, Supabase'in bazı connection string'lerine ulaşamıyor.

## ✅ ÇÖZÜM: Session Mode Pooler Kullanın

### Supabase Dashboard'da Connection String Bulma:

1. **Supabase Dashboard** → Project → Settings → Database
2. **Connection Pooling** bölümüne gidin
3. **Session mode** seçin (Transaction mode DEĞİL!)

### Doğru Connection String Formatı:

```bash
# ❌ YANLIŞ (Transaction mode - Vercel'de çalışmıyor)
postgresql://postgres:şifre@db.busxquitkxwisenwfmkn.supabase.co:6543/postgres?pgbouncer=true

# ✅ DOĞRU (Session mode pooler - Vercel için)
postgresql://postgres.busxquitkxwisenwfmkn:şifre@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**VEYA**

```bash
# ✅ DOĞRU (Direct connection - ancak connection limit sorunları olabilir)
postgresql://postgres:şifre@db.busxquitkxwisenwfmkn.supabase.co:5432/postgres
```

## 📋 ŞİMDİ YAPMANIZ GEREKENLER:

### 1. Supabase'den Session Mode Connection String Alın

1. https://supabase.com/dashboard/project/busxquitkxwisenwfmkn/settings/database
2. **Connection Pooling** → **Session mode** 
3. Connection string'i kopyalayın

### 2. Vercel Environment Variable'ı Güncelleyin

Vercel Dashboard → Settings → Environment Variables:

**Name:** `DATABASE_URL`

**Value:** Supabase'den kopyaladığınız **Session mode** connection string
(Şifrenizi kendiniz ekleyin)

### 3. Local .env Dosyanızı da Güncelleyin

Aynı connection string'i local'de de kullanın ki tutarlılık olsun.

### 4. Redeploy

Vercel'de redeploy yapın ve `/api/debug` endpoint'ini test edin.

---

## 🔍 Neden Transaction Mode Çalışmıyor?

- Transaction mode (port 6543) bazı Prisma özellikleriyle uyumsuz
- Vercel'in network routing'i bazı pooler adreslerine ulaşamıyor
- Session mode (port 5432 + pooler hostname) daha geniş uyumluluk sağlıyor

**Supabase Session mode connection string'inizi buraya yapıştırın, doğruluğunu kontrol edelim!**

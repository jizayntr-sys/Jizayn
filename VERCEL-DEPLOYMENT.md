# Vercel Deployment Guide

## Environment Variables

Vercel dashboard'da şu environment variable'ları ayarlayın:

### Production Environment

1. **DATABASE_URL** (Required)
   ```
   postgresql://user:password@host:port/database?pgbouncer=true&connection_limit=1
   ```
   - Supabase veya PostgreSQL connection string
   - PgBouncer ile birlikte kullanılmalı
   - `connection_limit=1` production için önemli

2. **NEXT_PUBLIC_BASE_URL** (Required)
   ```
   https://www.jizayn.com
   ```
   - Sitenizin production URL'i
   - Sitemap ve SEO için gerekli

## Deployment Steps

1. Vercel'e repository'yi bağlayın
2. Environment variables'ı yukarda belirtildiği gibi ekleyin
3. Build & Development Settings:
   - **Build Command**: `npm run build` (otomatik)
   - **Output Directory**: `.next` (otomatik)
   - **Install Command**: `npm install` (otomatik)

4. Deploy butonuna tıklayın

## Important Notes

- `prisma generate` otomatik olarak çalışır (`postinstall` script)
- Sitemap ve product feed runtime'da generate edilir (build sırasında değil)
- Database bağlantısı production'da zorunludur

## Troubleshooting

### Build Fails with "DATABASE_URL not set"
- Vercel dashboard > Settings > Environment Variables
- DATABASE_URL ekleyin
- Redeploy yapın

### IPv6 Connection Issues
- Supabase connection pooling kullanın (pgbouncer=true)
- Direct connection yerine pooled connection kullanın
- Connection limit ekleyin
